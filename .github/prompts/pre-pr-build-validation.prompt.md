---
description: "Run a pre-PR docs validation review against changed files, or the current article when no repo changes exist."
name: "Pre-PR Build Validation Review"
agent: "Build Validation Improver"
model: "GPT-5 (copilot)"
tools: [get_changed_files]
argument-hint: "Optionally provide file paths or a specific validation concern."
---
Run a pre-PR Azure Docs validation review.

Workflow:
- If I provided file paths or a target area, review those first.
- Otherwise, inspect changed files in source control and prioritize documentation files under `articles/`, `includes/`, `bread/`, and `redirects/`.
- If there are no relevant changed files, review the current editor file.
- Make only the smallest edits needed to improve validation quality.

Focus on:
- Frontmatter completeness and metadata quality.
- Heading structure, tables, code fences, and Learn admonition syntax.
- Relative links, image alt text, and Learn directives already present in the file.
- Clear, concise wording only where it affects validation quality or scanability.

Return:
1. Files reviewed.
2. Likely validation issues found.
3. Edits made.
4. Remaining risks or checks that still require a real build or authoring validation run.

If no issues are found, say so explicitly.