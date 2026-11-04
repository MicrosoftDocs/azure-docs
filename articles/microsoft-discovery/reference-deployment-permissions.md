---
title: Microsoft Discovery onboarding permissions by stage
description: Look up operator permissions and scopes for Discovery onboarding planning, preparation, readiness, deployment, and Q&A verification.
author: yousefi
ms.author: yousefi
ms.service: azure
ms.topic: reference
ms.date: 10/24/2026
# Customer intent: As an IAM administrator, I want stage-specific access requirements so that operators can use the least privilege needed for each task.
---

# Microsoft Discovery onboarding permissions by stage

Each onboarding stage needs different permissions. Separate the signed-in operator's access from the roles the tool grants to users, workload identities, and the Discovery service. Don't keep subscription-wide elevated access active for all stages just because Stage 2 needs it.

## Identity and scope terminology

| Identity | Purpose |
| --- | --- |
| Runner/operator | Signed-in Azure CLI identity executing a stage. |
| Target human principals | Users receiving permanent assignments or PIM eligibility from the configuration. |
| User-assigned managed identity (UAMI) | Customer-owned runtime identity supplied to Discovery resources. |
| Discovery control-plane service principal | First-party service principal that provisions service-managed resources; not a human operator or UAMI. |

**Subscription Reader** means the Azure built-in Reader role, ID `acdd72a7-3385-48ef-bd42-f606fba81ae7`, at `/subscriptions/<target-subscription-id>` or inherited from a covering management group. RG-only Reader is insufficient for subscription/location provider, quota, model-catalog, and policy reads. Discovery Platform Reader is a different role and doesn't replace it.

Subscription Owner/Contributor include the required reads, but don't elevate solely for read-only planning. Azure resource permissions also don't automatically grant Microsoft Entra directory lookup access.

## Offline preview and local parsing

Stages 2-5 with `-DryRun` require no Azure permissions, Azure CLI, or login. They read a usable configuration and describe actions locally.

Stage 1 can parse its workbook locally, but some Azure checks degrade to Warn/Skip when unavailable. Local export doesn't establish live readiness. Resolving a non-GUID principal name can require login and directory lookup even when other workbook processing is local.

## Stage 1: Planning

| Path | Required access | Scope and purpose |
| --- | --- | --- |
| Baseline live checks | Azure Reader | Target subscription: provider visibility, dependencies, VM SKU/quota, model catalog/TPM, visible policies, and resource reads. |
| Workspace-name availability | Custom role with `Microsoft.Discovery/checkNameAvailability/action`, or Discovery Platform Administrator | Target subscription; additional to baseline reads. |
| Inherited policy details | Reader or Resource Policy Reader where the definitions are located | Applicable parent management group; subscription reads alone might not expose inherited definitions. |
| Principal-name resolution | Customer-approved Entra directory read access | Target tenant. Supplying an Entra object ID avoids name lookup. |

Cognitive Services Usages Reader covers quota usage, not the complete model-catalog and subscription-read requirements. Missing access makes the corresponding check unavailable; review the report rather than assuming it ran.

## Stage 2: Landing-zone preparation

The full preparation path requires **Owner**, or **Contributor plus User Access Administrator**, at target-subscription scope. This covers resource changes, provider registration, custom-role preparation, and assignments/eligibility.

**Contributor plus Role Based Access Control Administrator** is the narrower supported alternative only when the NSP custom role already exists and `permanent-role-assignments` is selected. Don't use that combination as a substitute for the full clean-subscription or JIT preparation path.

For `customer-jit-managed`, confirm the customer has the required PIM licensing and an eligibility policy allowing the selected duration. Eligible access isn't active access. The tool doesn't activate customer roles.

Stage 2 assigns the Discovery control-plane service principal the **Discovery NSP Perimeter Joiner** custom role and subscription **Reader**. The custom role authorizes perimeter association operations, not arbitrary perimeter-rule administration. See [NSP preparation](how-to-configure-network-security.md#assign-the-nsp-perimeter-joiner-role).

The tool also prepares human persona access and workload UAMI roles. In its shared-UAMI deployment path, these include Discovery Platform Contributor, Storage Blob Data Contributor, and AcrPull on the platform RG, and Network Contributor on the VNet (with a network-RG fallback if it isn't found). Review actual scopes and separate RGs; a fallback scope isn't proof the intended VNet was resolved.

## Stage 3: Readiness validation

| Execution path | Required access | Scope |
| --- | --- | --- |
| Default configuration/readiness checks | Azure Reader | Target subscription. No VM created. |
| Effective-network checks when a usable NIC exists | Baseline Reader plus Network Contributor, or custom actions below | NIC and Network Watcher resource scopes or their RGs; additional subscription-wide Network Contributor isn't required. |
| Optional `-WithVm` probe lifecycle | Baseline Reader plus Contributor on the probe RG; Network Contributor for a VNet/subnet in a different RG | Keep access active through cleanup. This mode has release limitations and isn't used by the main readiness procedure. |

The effective-network custom permissions are:

- `Microsoft.Network/networkInterfaces/effectiveNetworkSecurityGroups/action`
- `Microsoft.Network/networkInterfaces/effectiveRouteTable/action`
- `Microsoft.Network/networkWatchers/nextHop/action`

These actions return Azure-calculated network state; they don't replace packet-level tests. See [Validate readiness](how-to-validate-deployment-readiness.md).

## Stage 4: Platform deployment

Assign **every role in the Platform Administrator persona**, at the [documented scopes](concept-role-assignments.md#roles-required-by-persona), including referenced network and UAMI dependencies. A single Discovery Platform Administrator assignment isn't the entire supporting Azure role set.

Subscription Owner or Contributor from Stage 2 isn't a general requirement for Stage 4. Separately, the runner needs role-assignment authority if it must create permanent Foundry assignments in the new workspace managed RG. Creating JIT eligibility needs User Access Administrator or Owner at an appropriate covering scope.

Foundry-assignment failures can warn instead of failing platform provisioning. Verify that required users have effective access before handoff. Newly created JIT eligibility still needs user activation.

## Stage 5: Scenario verification

Assign the complete **Scientist persona** role set at the [documented scopes](concept-role-assignments.md#roles-required-by-persona). Discovery Platform Contributor alone isn't enough.

The runner must also reach the workspace data-plane endpoint. For private workspaces, use VNet-connected, peered, or VPN-connected execution with appropriate DNS. Network reachability and authorization are independent prerequisites.

## Activation and handoff responsibilities

- Activate PIM-eligible roles before their stage and renew access if an operation outlasts activation.
- Keep access active through any approved temporary-resource cleanup.
- Allow role propagation and verify the actual scope instead of assigning broader roles to work around delays.
- Check platform, network, storage, DNS, and workspace managed RGs separately when they differ.
- Don't replace a policy-approved JIT process with the standalone permanent persona-assignment utility.
- Keep service and UAMI assignments separate from user eligibility; the human-access mode doesn't make workload access temporary.

## Related content

- [Role assignments and persona definitions](concept-role-assignments.md)
- [Configure managed identities](how-to-configure-managed-identity.md)
- [Prepare a landing zone](how-to-prepare-landing-zone.md)
