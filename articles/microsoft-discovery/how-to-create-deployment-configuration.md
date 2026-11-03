---
title: Create a Microsoft Discovery onboarding configuration
description: Complete the Discovery planning workbook, select network and human-access settings, and run Stage 1 to generate and review config.json.
author: yousefi
ms.author: yousefi
ms.service: azure
ms.topic: how-to
ms.date: 10/28/2026
# Customer intent: As a platform administrator, I want to generate a reviewed onboarding configuration so that later stages use consistent approved settings.
---

# Create a Microsoft Discovery onboarding configuration

Run Stage 1 to turn a completed planning workbook into `config.json`. Stages 2-5 consume that file instead of asking for the same values again. Correct inputs in the workbook and regenerate the configuration when the plan changes.

Stage 1 reads Azure state for live checks but doesn't change Azure resources. It writes local configuration and requested reports. Local parsing without complete Azure access isn't a readiness assessment.

## Prerequisites

- [Set up the tool](how-to-set-up-deployment-tool.md), including an existing platform resource group, UAMI, and customer-owned storage account.
- [Approved network settings](how-to-plan-deployment-network.md) and resource names.
- A policy-approved choice of permanent or customer-managed JIT human access.
- For live checks: Azure CLI signed into the intended subscription, subscription Reader and applicable [conditional Stage 1 permissions](reference-deployment-permissions.md#stage-1-planning).
- A PowerShell 7 prompt in `utilities\onboarding-tool\scripts`.

## Select and complete the workbook

1. Use the workbook that ships with your checked-out tool revision:

   | Workbook in `stage1-planning` | Supported `network.model` |
   | --- | --- |
   | `discovery-resource-planning-form-managed-vnet.xlsx` | `managed` |
   | `discovery-resource-planning-form-byo-vnet.xlsx` | `byo`, `byo-spoke`, `byo-existing` |

   The [upstream planning directory](https://github.com/microsoft/discovery/tree/main/utilities/onboarding-tool/scripts/stage1-planning) contains both files. Keep the workbook and scripts at the same reviewed revision.

1. Open the **Config** sheet and fill in the yellow Value cells. Check stored values even after changing a dropdown: an old selection can remain in a copied workbook. `network.model`, not the workbook filename, determines provisioning.
1. Complete the identity and deployment fields:

   | Field | Value to record |
   | --- | --- |
   | `subscriptionId` | Subscription selected with `az account set`. |
   | `deployingIdentity.objectId` | Deploying principal's Entra object ID. A user UPN or application appId/display name requires directory lookup access. |
   | `resourceGroup` | Existing platform resource group. |
   | `managedIdentity.id` | Full resource ID of the precreated UAMI, not its principal ID. |
   | `controlPlaneRegion` | Supported Discovery control-plane region: East US, Sweden Central, or UK South. This region can differ from `workloadRegion`. |
   | `workloadRegion` | Region for the VNet/subnets and all resources in the managed resource groups. For `byo-existing`, this region must match the existing VNet region. |
   | `names.*` | Resource names, including workspace, project, supercomputer, and node pool. Review [naming rules](reference-resource-naming.md). |

   To get the signed-in user's object ID:

   ```powershell
   az ad signed-in-user show --query id -o tsv
   ```

   The runner, target human users, workload UAMI, and Discovery control-plane service principal are different identities. When `principals` is empty, the tool uses the deploying identity for its default human-role targeting; review that choice before Stage 2.

## Select human-access management

Set `rbac.humanAccessMode` explicitly according to customer policy.

| Value | User access created by Stages 2 and 4 | Follow-up |
| --- | --- | --- |
| `permanent-role-assignments` | Standard Azure role assignments | Review assignments and scopes; no PIM activation for these assignments. |
| `customer-jit-managed` | Time-bound PIM eligibility | Each user activates required roles before the operation that needs them. |

For `customer-jit-managed`, set `rbac.jitEligibilityDurationDays` to a whole number from **7 through 3650** for new eligibility. The value sets the eligibility duration in days, not the activation window. Confirm PIM licensing and policy with your IAM team.

This choice applies to users. The tool continues to create persistent assignments for service principals and managed identities. Eligible user roles aren't active access, even when Stage 2 reports success.

## Complete networking, storage, and sizing

Use the [network planning task](how-to-plan-deployment-network.md) for architecture choices; record their exact values here.

| Field | Value to record |
| --- | --- |
| `network.model` | One of the four supported modes; only `byo-existing` skips network-template provisioning. |
| `network.networkResourceGroup` | Existing VNet RG, or the target RG for tool-provisioned networking. |
| `network.dnsResourceGroup` | DNS-zone RG when different from the network RG; otherwise leave blank. |
| `network.vnetName` | Selected VNet name. For `byo-existing`, Stage 1 checks its region against `workloadRegion`, not `controlPlaneRegion`. Provisioning modes default a blank value to `vnet-<workspace-name>`. |
| `network.existingSubnets` | Other existing CIDRs for overlap checks; not a promise to preserve a VNet's undeclared subnet collection. |
| `network.outboundType` | `UserDefinedRouting` or `LoadBalancer`. |
| `network.nvaNextHop` | Reachable firewall/NVA private IP for UDR; not a NAT public IP. |
| SUBNET rows | Planned CIDRs and roles. In `byo-existing`, CIDRs must match existing subnets. |
| `storage.account` | Existing customer-owned StorageV2 account name; advanced JSON can use `storage.accountId`. Keep `storage.model=byo`. |
| `storage.access` | Approved access method, such as `privateEndpoint`; later checks depend on this value. |
| `workspace.publicNetworkAccess` | `Enabled` or `Disabled`; affects workspace data-plane runner access. |
| `workspace.networkIsolation` | `true` or `false`; independently controls Workbench isolation. |

Review [quota and capacity](concept-quota-reservation.md) for all planned capabilities. The tool's default compute sizing uses three `Standard_D4s_v6` system nodes and up to three `Standard_D4ds_v6` workload nodes. Advanced JSON can override `systemSku`, `nodePoolVmSize`, and `nodePoolMaxNodeCount`; live checks derive vCPU requirements from selected SKU metadata.

The workspace path needs 450,000 GPT-5.4 GlobalStandard TPM: 250,000 for the built-in deployment and 200,000 for the validation chat model. Quota is scoped by subscription, region, model, and deployment type. An absent portal row doesn't mean zero quota; a catalog read is also required. Resumed-deployment checks account for allocations still to be created.

Record any optional `bookshelf.inScope` intent, but Stage 4 doesn't deploy Bookshelf. Project storage remains mandatory. Use `names.storageContainer` for an explicit Discovery storage-container name; otherwise Stage 4 derives it. The [upstream configuration schema](https://github.com/microsoft/discovery/blob/main/utilities/onboarding-tool/script-specs/config.schema.json) is the complete machine contract, including advanced sizing fields.

## Review policy declarations and waivers

The tool collects visible subscription policies live. Don't manually duplicate every policy in the workbook. Use a POLICY row only for an intended declaration or override.

A WAIVER row records an approved exception to a tool check; it doesn't change Azure Policy. For a `policy-preflight` waiver, the Config-sheet columns are A: `WAIVER`, B: `policy-preflight`, C: required justification, D: approver. Obtain customer approval rather than using a waiver simply to make a report green.

If Azure Policy will deny deployment, the policy owner must resolve it or create an applicable approved exemption before Stage 4. Stage 2 can emit exemption-request commands, but generating those commands doesn't apply them.

## Generate and review the configuration

1. For the managed workbook, run the following command. If you selected the BYO workbook, use its path for `-FormPath`.

   ```powershell
   .\stage1-planning\stage1_plan.ps1 `
     -FormPath .\stage1-planning\discovery-resource-planning-form-managed-vnet.xlsx `
     -OutConfig .\config.json `
     -JsonPath .\out\stage1.json
   ```

1. Review `.\out\stage1.md` and `.\out\stage1.json`. Required checks must pass or have a recorded approved waiver before a new configuration is exported. If the run fails, don't consume an old `config.json` left by a previous run.
1. Confirm the output is from the current run. Inspect subscription, names, UAMI resource ID, storage, network mode, CIDRs, outbound settings, human-access mode, and workspace controls.
1. Review every Warn, Skip, or Waived row. Some Azure-dependent checks degrade to Warn/Skip when not signed in; a locally generated config doesn't prove provider visibility, quota, policy, or name availability.
1. Correct failed inputs in the workbook and rerun Stage 1. After configuration or network changes, regenerate downstream readiness evidence before deployment.

Keep `config.json` with the tool revision and approvals in customer-approved storage. Don't commit customer configuration or reports.

For report fields and failed checks, see [reports and artifacts](reference-deployment-reports.md) and [Stage 1 troubleshooting](troubleshoot-deployment-tool.md#stage-1-doesnt-generate-configjson).

You can optionally [preview intended changes offline](how-to-preview-deployment-changes.md) with the generated configuration before live preparation. Preview is supporting guidance for Stages 2-5, not a separate stage or a Stage 1 `-DryRun` mode.

## Next step

> [!div class="nextstepaction"]
> [Prepare the landing zone](how-to-prepare-landing-zone.md)
