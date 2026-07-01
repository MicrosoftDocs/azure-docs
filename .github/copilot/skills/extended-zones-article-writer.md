# Extended Zones Article Writer

Write production-ready how-to, quickstart, tutorial, or overview articles for the Azure Extended Zones Learn documentation.

## Context Sources

### Existing articles (reference for style and structure)
- **Directory:** `C:\github\azure-docs-pr\articles\extended-zones\`
- **Best style reference:** `create-storage-account.md` (canonical how-to example)
- **TOC:** `TOC.yml` — defines the site navigation structure
- **Overview:** `overview.md` — contains the supported services table

### Team code repos (for technical accuracy)
- `C:\github\AzureStack-Fiji-Workloads` — team workloads and service code
- `C:\github\Extended-Zones-Core-Platform` — core platform code
- `C:\github\Fiji-Services-EdgeZoneRP` — Edge Zone resource provider
- `C:\github\Fiji-EdgeZones-TSG-TeamDocs` — troubleshooting and team docs
- `C:\github\EdgeZones-Operations-Configuration` — operations config
- `C:\github\EdgeZones-Operations-Validation` — validation scripts

---

## Frontmatter Template

```yaml
---
title: <Descriptive title — verb + noun + "in an Azure Extended Zone">
description: <One sentence, under 160 characters, starting with "Learn how to...">
author: svaldesgzz
ms.author: svaldes
ms.service: azure-extended-zones
ms.topic: <how-to | quickstart | tutorial | overview | concept-article>
ms.date: <MM/DD/YYYY>
---
```

---

## Article Naming Conventions

| Type | Pattern | Example |
|---|---|---|
| How-to | `[action]-[resource].md` | `create-storage-account.md` |
| Quickstart | `deploy-[resource]-[method].md` | `deploy-vm-portal.md` |
| Tutorial | `[action]-[resource].md` | `backup-virtual-machine.md` |
| Overview | `overview.md` or `[topic]-overview.md` | `overview.md` |

---

## Article Structure by Type

### How-to guide (`ms.topic: how-to`)
1. H1 title
2. Intro paragraph ("In this article, you learn how to...")
3. `## Prerequisites` — subscription, Extended Zone access, tools
4. `## Sign in to Azure` — standard portal sign-in step
5. Main task sections (H2 per major step)
6. `## Clean up resources` — portal resource group deletion
7. `## Related content` — 3–4 bullet links to related articles

### Quickstart (`ms.topic: quickstart`)
Same as how-to but faster-paced, single focused task, ends with a "Next steps" section.

### Tutorial (`ms.topic: tutorial`)
Multi-step, progressive task. Each H2 section builds on the previous one.

---

## Key Formatting Rules

**Tables** (use for all settings/configuration steps):
```markdown
| Setting | Value |
| --- | --- |
| Key vault name | Enter a unique name, such as *myKeyVault*. |
| Region | Select the **parent region** of the target Extended Zone. |
```

**Note/Important/Caution blocks:**
```markdown
> [!NOTE]
> Note text here.

> [!IMPORTANT]
> Critical info here.

> [!CAUTION]
> Warning text here.
```

**Code blocks** — always use language-specific fences:
- Azure CLI: ` ```azurecli `
- PowerShell: ` ```azurepowershell `
- JSON: ` ```json `
- Bash: ` ```bash `

**Cross-links** — use relative paths:
```markdown
[Request access to an Azure Extended Zone](request-access.md)
```

**No screenshots** — use text instructions and tables only (no `:::image` directives).

---

## Extended Zone–Specific Notes

- **Key Vault, Disk Encryption Sets, and most control-plane services** are created in the **parent Azure region**, not the Extended Zone itself.
- **VMs, AKS clusters, storage accounts** are deployed **in the Extended Zone** using `--edge-zone <zone-name>` in the CLI or by selecting "Deploy to an Azure Extended Zone" in the portal under the Region field.
- Always remind users: select the **parent region** first in the portal, then select **Deploy to an Azure Extended Zone** and choose the Extended Zone.
- Storage in Extended Zones is **Premium only** with **LRS** redundancy.
- Refer to `request-access.md` whenever Extended Zone access or zone names are needed.

---

## Publishing Checklist

After writing the article:

1. **Save the file** to `C:\github\azure-docs-pr\articles\extended-zones\<filename>.md`

2. **Update `TOC.yml`** — add an entry under the appropriate section:
   ```yaml
   - name: <Short descriptive name>
     href: <filename>.md
   ```
   Sections in TOC: Overview, Quickstarts, Tutorials, Concepts, How-to guides, Arc-enabled PaaS workloads, Security, Reference, Resources

3. **Update `overview.md`** if the article covers a new service — add it to the supported services table under the correct category row (`Compute`, `Networking`, `Storage`, `BCDR`, `Arc-enabled PaaS`, `Other`). Services use `<br>` as separator and are written as markdown links.

4. **Verify frontmatter** — all required fields present (`title`, `description`, `author`, `ms.author`, `ms.service`, `ms.topic`, `ms.date`).
