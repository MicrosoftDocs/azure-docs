---
title: Backup and restore Azure API center
titleSuffix: Azure API Center
description: Learn how to back up and restore Azure API Center to the same or new service instance.
ms.service: azure-api-center
ms.topic: how-to
ms.date: 07/27/2026
# Customer intent: As an API developer, I want to back up and restore my Azure API Center service instance.
---

# Backup and restore Azure API Center

> [!IMPORTANT]
> The `apiops apic` commands are in preview. Command names and flags might change before general availability. Use the information in this article to start your disaster recovery process.

You can back up the contents of an Azure API Center and restore them to the same service instance or new service instance in another region, subscription, resource group, or tenant.

## Why backup and restore?

- No automatic cross‑region replication for API Center. Each region is an independent deployment. If a region becomes unavailable, your API Center content in that region isn't automatically recoverable elsewhere.
- The platform keeps per‑region backups of the service data, but you can't use those backups to move or rebuild your catalog in a different region, subscription, or tenant.
- The backup and restore flow outlined in this article gives you a portable, version‑controllable snapshot of your API Center that you own and can replay anywhere.

### Typical uses

| Scenario | Process |
|----------|----------|
| Protect against accidental deletion or edits | Back up on a schedule; restore the last good snapshot. |
| Recover from a regional outage | Provision a new service in another region, then restore. |
| Migrate to another subscription and tenant | Back up from source, restore to target. |
| Promote configuration between environments. For example, development to production | Back up development, restore to production with overrides. |
| Audit or rollback | Keep snapshots in Git; compare and revert. |

## What's included in backups

The backup captures everything reachable through the API Center control plane, including:

- Workspaces
- Metadata schemas
- APIs, API versions, and API definitions, including the specification files
- API deployments and environments
- API sources, such as links to Azure API Management or Amazon API Gateway. The backup includes only the configuration.
- Analyzer configurations and their spectral rulesets
- Authentication configurations and security requirements. The backup includes only references. See [Secrets management](#secret-management).
- Resource links
- Plugins, models, agents (and versions/artifacts), skills (and versions/artifacts)
- Evaluation configurations and MCP registry configurations
- Portal and Data API settings (optional)

### Not included

The following items are environment-specific or are automatically recreated:

- Analysis reports, search and vector indexes, and other **derived** data. These items regenerate after restore.
- Key Vault secret values — the backup includes only the *reference*; the secret must already exist in the target
  Key Vault. For more information, see [Secrets management](#secret-management).
- The API Center service resource, its managed identity, and role assignments are created separately. For more information, see [Restore](#restore-publish).
- APIs that are synced from an API source. By default, these APIs aren't copied. Recreating the API source
  re‑syncs them. Use `--include-synced` to capture a read‑only snapshot.

## Prerequisites

- **Node.js ≥ 22** and the `apiops` CLI installed.

    ```bash
    npm install -g @azure-tools/apiops-cli
    ```

- An existing **source** API Center to back up, and (for restore) a **target** API Center.
- Azure permissions: **Reader** on the source, **Contributor** on the target, and rights to read and write any
  referenced Key Vault secrets from the target's identity.
- Authentication via `DefaultAzureCredential`. Sign in by using the Azure CLI (`az login`) for local use, or use a
  service principal or workload identity in continuous integration (CI) pipeline. For more information, see the
  [apiops authentication docs](https://github.com/Azure/apiops-cli#authentication).

## Back up (extract)

Extract the API Center content to local artifact files:

```bash
apiops apic extract \
  --resource-group <source-rg> \
  --service-name <source-api-center> \
  --output ./apic-artifacts
```

Useful options:

| Option | Purpose |
|--------|---------|
| `--workspace <name>` | Back up a single workspace instead of all. |
| `--filter <path>` | Back up only resources matching a filter file. |
| `--include-synced` | Also capture APIs synced from API sources (read‑only snapshot). |
| `--include-blobs` | Include skill/agent artifact binaries and rulesets (default on). |
| `--output <dir>` | Output directory (default `./apic-artifacts`). |

The result is a folder of human‑readable JSON files plus specification and artifact sidecars. You should commit changes to Git so you have versioned, restorable snapshots:

```bash
cd apic-artifacts
git init && git add . && git commit -m "API Center backup $(date -u +%FT%TZ)"
```

### Schedule regular backups

Run `apiops apic extract` on a schedule (nightly, or on change) in a pipeline and commit the result. Your
**recovery point** is only as fresh as your last backup, so pick a cadence that matches your tolerance for
lost changes. `apiops apic init` can scaffold a ready‑made GitHub Actions or Azure DevOps pipeline for this.

## Restore (publish)

### Step 1 — Make sure a target service exists

Restore doesn't create the API Center service resource. Create the target service first using Azure portal,
Azure CLI, or the Bicep template that `apiops apic init` can scaffold. For a **regional recovery**, create it
in the surviving region:

```bash
az apic create \
  --resource-group <target-rg> \
  --name <target-api-center> \
  --location <another-region>
```

Ensure the target service's identity can read any **Key Vault** secrets your authentication configurations and API sources
reference. For more information, see [Secret management](#secret-management).

### Step 2 — Publish the artifacts

```bash
apiops apic publish \
  --resource-group <target-rg> \
  --service-name <target-api-center> \
  --source ./apic-artifacts
```

The CLI restores resources in the correct dependency order (metadata schemas → workspaces → environments and
authorization configurations → API sources → APIs → versions → definitions → deployments → remaining resources).

Useful options:

| Option | Purpose |
|--------|---------|
| `--dry-run` | Preview what would change **without** applying anything. Always try this first. |
| `--overrides <path>` | Substitute environment‑specific values (hostnames, Key Vault references, resource IDs). Needed when restoring to a different region, subscription, or tenant. |
| `--delete-unmatched` | Delete target resources that aren't present in the artifacts (make the target exactly match the backup). Use with care. |
| `--commit-id <sha>` | Publish only what changed since a given Git commit (incremental). |

> [!TIP]
> Always run with `--dry-run` first and review the report before doing a publish.

### Step 3 — Verify

- Confirm APIs, versions, definitions, deployments, and environments appear in the target.
- Derived features (analysis results, search) might take a little time to warm up after restore.
- If you recreated API **sources**, allow the sync to run to repopulate their APIs.

## Recovering from a regional outage

Because regions are independent, cross‑region recovery restores into a **new** service:

1. Provision a new API Center in a healthy region (Step 1 in the preceding section).
1. Prepare an overrides file to rewrite any region‑ or subscription‑specific values, such as environment
   hostnames and Key Vault references.
1. Use `apiops apic publish` to publish the most recent backup into the new service.
1. Repoint clients and DNS to the new service.

Keep your backups in a Git repository or storage that isn't in the same region as the API Center. This way, a
regional outage doesn't affect your backups.

## Moving to another subscription or tenant

Use the same process as a restore. Use an overrides file for anything that is subscription or tenant specific, such as resource IDs and Key Vault references. Back up from the source, create the target service, and then publish by using `--overrides`.

## Secret management

Authentication configurations and Amazon API Gateway sources store references to Key Vault secrets. Secret values aren't stored. Backups only contain the references. Before restoring, make sure:

- The target service's managed identity can access the referenced Key Vaults and secrets.
- If you moved subscription, tenant, or region, update those references with the `--overrides` file.

The CLI runs a preflight check and will tell you if a referenced secret can't be resolved before it starts
publishing.

## Was the service recently deleted?

If you deleted the API Center service within the retention window (30 days), you might be able to **undelete** it
directly. This method is faster and more complete than a content restore:

```bash
apiops apic list-deleted --resource-group <rg>
# then recover the desired service
```

Fall back to `apic publish` from a backup if the service is past retention or the content itself was corrupted.

## Troubleshooting

| Symptom | Likely cause or fix |
|---|---|
| Publish fails on a definition or spec | Specification import is long running. The CLI polls automatically. Re-run publish - it's idempotent. |
| "Secret not found" during preflight | The referenced Key Vault secret is missing or the target identity lacks access. Create the secret or grant access, or fix `--overrides`. |
| Synced APIs missing after restore | Expected - recreate the API source and let it sync, or re-run with `--include-synced`. |
| Name already exists | API Center service names are globally unique. Restore to a new name (and override hostnames), or purge the old service first. |
| Analysis or search results empty right after restore | Derived data is rebuilt asynchronously. Give it time. |

## Additional resources

- [apiops CLI repository](https://github.com/Azure/apiops-cli)