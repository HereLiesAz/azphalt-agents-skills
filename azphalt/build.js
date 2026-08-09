// Package ../skills/ into a distributable kind:"skill" .azp.
//   npm install && npm run build   →   dev-workflow-skills-1.0.0.azp
//
// The repo's skills/<id>/SKILL.md directories ARE the package payload — this script just copies
// them under skills/ in the archive (matching the ids declared in manifest.json's skill.skills[])
// and lets writeAzp() compute the integrity digests. No content is duplicated between the native
// skills/ tree (the source of truth, directly usable by copying into ~/.claude/skills/) and the
// package built here.
import fs from "node:fs";
import path from "node:path";
import { writeAzp } from "@azphalt/azp";

const manifest = JSON.parse(fs.readFileSync("manifest.json", "utf-8"));

/** Recursively collect every file under `dir` into `payload`, keyed by its path relative to `base`. */
function collect(dir, base, payload) {
  for (const name of fs.readdirSync(dir)) {
    if (name.startsWith(".")) continue; // skip .DS_Store, .gitkeep, etc.
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      collect(full, base, payload);
    } else {
      const rel = path.relative(base, full).split(path.sep).join("/");
      payload[rel] = fs.readFileSync(full);
    }
  }
}

const skillsDir = path.resolve("../skills");
const payload = {};
collect(skillsDir, path.resolve(".."), payload);

// Sanity check: every id the manifest declares must have produced a payload entry, or writeAzp's
// digest map and validateSkillManifest's containment check will both fail loudly anyway — but a
// clear message here is more useful than a generic verification error.
for (const entry of manifest.skill.skills) {
  const want = `skills/${entry.id}/SKILL.md`;
  if (!payload[want]) {
    throw new Error(`manifest declares skill "${entry.id}" but ${want} was not found under ../skills/`);
  }
}

const license = fs.existsSync("../LICENSE") ? fs.readFileSync("../LICENSE", "utf-8") : manifest.license;

const { azp } = writeAzp({ manifest, payload, license });
const out = `dev-workflow-skills-${manifest.version}.azp`;
fs.writeFileSync(out, azp);
console.log(`Built ${out} (${azp.length} bytes) — ${manifest.skill.skills.length} skills`);
