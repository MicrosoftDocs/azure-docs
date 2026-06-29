---
title: Customer-Initiated Disaster Recovery for Azure Storage Mover
description: Plan and execute customer-initiated disaster recovery for Azure Storage Mover by redeploying management resources in a secondary region.
author: stevenmatthew
ms.service: azure-storage-mover
ms.topic: how-to
ms.date: 06/17/2026
ms.author: shaas
---

# Customer-initiated disaster recovery for Azure Storage Mover

This article describes how to prepare for and perform customer-initiated disaster recovery (DR) for Azure Storage Mover.

Use this guidance when you want to recover Storage Mover management resources in a different region during a regional outage.

## Scope and shared responsibility

This article focuses on Storage Mover management resources, such as storage mover resources, projects, endpoints, job definitions, and job run history.

Storage Mover doesn't move your source data by itself. Your end-to-end DR outcomes also depend on:

- Source system availability and recoverability.
- Storage account resiliency and replication choices.
- Agent VM or host availability, network path, and permissions.

For reliability architecture and Azure-initiated recovery details, see [Reliability in Azure Storage Mover](/azure/reliability/reliability-azure-storage-mover?toc=/azure/storage-mover/toc.json).

## Before a regional outage

Prepare in advance so you can recover quickly:

1. Deploy Storage Mover resources in a region with availability zones when possible.
1. Periodically export your Storage Mover resources as an ARM template snapshot.
1. Store snapshots in version control so you can recover from the last known good state.
1. Document a target recovery region and validate required service availability.
1. Validate DR runbooks, including RBAC assignments and agent registration steps.

## During a regional outage

Choose one of these approaches:

- Wait for Azure to recover the affected region.
- Minimize downtime by redeploying Storage Mover resources to another region from your latest snapshot.

## Redeploy Storage Mover resources to a different region

### 1. Export and prepare the template

Export the template from your current deployment.

- If the resource group is dedicated to Storage Mover, export at the resource group scope.
- If the resource group contains unrelated resources, remove non-Storage-Mover resources from the exported template.

Then modify the template:

1. Remove `Microsoft.StorageMover/agents` resources.
1. Remove `Microsoft.HybridCompute/machines` resources.
1. Remove dependency references to removed resources.
1. Remove `agentResourceId` from job definition resources.
1. Update the top-level Storage Mover `location` to the target region.
1. Review target storage account resource IDs and update them if needed.

### 2. Deploy to the target region

Deploy the updated template to a new resource group in the target region.

To export and deploy templates, see [Export templates in Azure portal](/azure/azure-resource-manager/templates/export-template-portal).

### 3. Register new agents

You can't move existing agents to a new region by redeploying the old resources. Register new agents against the newly deployed Storage Mover resource.

For setup steps, see [Deploy a storage mover agent](agent-deploy.md) and [Register an agent](agent-register.md).

### 4. Reassign agents to job definitions

After new agents are online, update job definitions to use the new agents.

For job definition guidance, see [Define and start a migration job](job-definition-create.md).

### 5. Regrant access to target storage

Grant the new agent identity access to target storage accounts and containers (for example, the required data contributor role).

For identity access guidance, see [Assign a managed identity access to a resource](/entra/identity/managed-identities-azure-resources/grant-managed-identity-resource-access-azure-portal).

### 6. Validate and resume migrations

Before resuming production workloads:

1. Validate endpoint connectivity and network path.
1. Run a small test migration.
1. Confirm logs and job states in the new region.
1. Resume scheduled and operational migrations.

## Next steps

- [Reliability in Azure Storage Mover](/azure/reliability/reliability-azure-storage-mover?toc=/azure/storage-mover/toc.json)
- [Troubleshoot network issues](network-troubleshooting.md)
- [Job run error codes](status-code.md)
