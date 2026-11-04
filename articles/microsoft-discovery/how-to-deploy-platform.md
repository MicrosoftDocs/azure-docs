---
title: Deploy Microsoft Discovery with the onboarding tool
description: Run Discovery onboarding Stage 4 with readiness reports, verify core resource provisioning and access, and distinguish normal resume from workspace recovery.
author: yousefi
ms.author: yousefi
ms.service: azure
ms.topic: how-to
ms.date: 10/28/2026
# Customer intent: As a platform administrator, I want to deploy the validated Discovery configuration so that scientists can use the core platform.
---

# Deploy Microsoft Discovery with the onboarding tool

Run Stage 4 to create the core Discovery platform in dependency order. This stage writes Azure resources and can create human Foundry role assignments or eligibility. It can incur compute, storage, and model costs.

For portal or standalone Bicep deployment instead, use the [infrastructure quickstart](quickstart-infrastructure.md).

## Prerequisites

- A prepared landing zone and reviewed `config.json` containing `resourceGroup`, `managedIdentity.id`, and storage settings.
- Fresh `supercomputer` and `workspace` [Stage 3 reports](how-to-validate-deployment-readiness.md) plus independent connectivity evidence for required subnets.
- The complete **Platform Administrator persona** role set at the documented scopes, including referenced UAMI/network resources. One Discovery role isn't the full set.
- Additional assignment authority if this runner must grant Foundry access in the new workspace managed resource group. See [Stage 4 permissions](reference-deployment-permissions.md#stage-4-platform-deployment).
- Active JIT roles where applicable, Azure CLI signed into the intended subscription, and a PowerShell 7 prompt in `utilities\onboarding-tool\scripts`.

## Review resources and readiness

Stage 4 deploys the supercomputer and node pool, then workspace, chat model, project storage container, and project. The reviewed tool revision uses `discovery-platform.bicep` and Discovery API version `2026-06-01`. Keep the scripts and template at the same revision.

It doesn't create the UAMI or customer-owned storage account, deploy Bookshelf or ingest its content, publish a tool, or create a customer registry.

1. Confirm the subscription and resource groups match the reviewed configuration.
1. Review both readiness reports and independent network evidence. Resolve failed checks and required external actions.
1. Confirm the reports were generated for the configuration and network state you intend to deploy.

The normal deployment path blocks when a supplied report is missing, unreadable, or not `GO`. However, omitting `-ReadinessReport` only warns; missing profile coverage can also warn. The tool doesn't enforce freshness or configuration binding. This procedure supplies both profiles as an operational safeguard, not a claim that the script requires both.

## Confirm region placement

The `controlPlaneRegion` setting places Discovery control-plane resources. The `workloadRegion` setting places the VNet, subnets, and all resources in the managed resource groups. These two regions can differ. The template passes `workloadRegion` through the `discovery.overridemrgregion` tag.

Before normal deployment submits either a Bicep or ARM request, Stage 4 checks the VNet regions for the configured system-node, workload-node, container-app, and private-endpoint subnets. It also checks the separate UDR management subnet when applicable. An unreadable VNet or a region mismatch fails the `deploy-network-region` check before submission.

Keep all those subnets in `workloadRegion`. Don't change `controlPlaneRegion` merely to make it match the VNet. Resolve a [workload-region mismatch](troubleshoot-deployment-tool.md#stage-4-fails-workload-and-vnet-region-alignment) and refresh readiness evidence before retrying.

## Run Stage 4

```powershell
.\stage4-deployment\stage4_deploy.ps1 `
  -ConfigPath .\config.json `
  -ReadinessReport .\out\stage3-supercomputer.json,.\out\stage3-workspace.json `
  -JsonPath .\out\stage4.json
```

Keep the session available while resource operations are running. Provisioning includes AKS and workspace-managed services; a quiet console doesn't establish that an operation is stuck. The tool polls resource state and reports timeouts. Inspect Azure operation history before retrying a timed-out operation that could still be running.

## Verify deployment and access

1. Review `.\out\stage4.md` and the JSON report. Inspect ARM errors and any correlation ID rather than relying only on the verdict.
1. Confirm the supercomputer, node pool, workspace, chat model, Discovery storage container, and project have successful provisioning states and expected resource IDs.
1. Verify project storage points to the intended account. `names.storageContainer` selects an explicit name. When blank, the tool derives `<workspace-prefix>-storage`, truncating the prefix to keep the name within 24 characters. Reruns can reuse a valid legacy `<workspace>-bookshelf` name; that name doesn't mean Bookshelf was deployed.
1. Review Foundry access results. After creating the project, the tool targets Foundry Owner in the workspace managed resource group for Platform Administrator principals, or the deploying identity when no such principals are supplied; it targets Foundry User for Platform Contributor principals.
1. Resolve Foundry warnings before users depend on that access. In JIT mode, activate new eligibility before using the workspace. An assignment failure can be a warning rather than a platform-deployment failure.

Use [reports and artifacts](reference-deployment-reports.md) for output interpretation.

## Resume after interruption

Stage 4 inspects actual resource state and resumes incomplete work. After an interruption:

1. Read operation history and identify whether the last resource is still provisioning, succeeded, or failed.
1. Fix the diagnosed root cause. Refresh readiness reports after relevant changes.
1. Rerun the same normal command with the reviewed configuration and both reports.

Don't delete resources merely because the process was interrupted. A failed operation doesn't imply rollback.

## Use workspace recovery only when applicable

`-Recovery` is a targeted **workspace re-PUT** path, not a general repair switch. Use it only after diagnosing a stranded workspace and confirming the linked supercomputer is `Succeeded`.

The recovery path runs before the normal readiness-report gate. Review fresh readiness and network evidence explicitly before executing any recovery write. Use the targeted command emitted by the tool for the intended subscription, resource group, and workspace; don't adapt it to a different resource without diagnosis.

For topology failures, missing UAMI roles, outbound AKS failures, and safe recreation/escalation criteria, see [Troubleshoot onboarding](troubleshoot-deployment-tool.md). Preserve the operation history and correlation ID before any approved resource deletion.

## Next step

> [!div class="nextstepaction"]
> [Verify the onboarding deployment](how-to-verify-deployment.md)
