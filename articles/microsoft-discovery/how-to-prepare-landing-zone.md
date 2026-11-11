---
title: Prepare a Microsoft Discovery landing zone with the onboarding tool
description: Run onboarding Stage 2 to prepare providers, permissions, networking, and project storage, then complete firewall, quota, policy, and PIM handoffs.
author: yousefi
ms.author: yousefi
ms.service: azure
ms.topic: how-to
ms.date: 10/28/2026
# Customer intent: As a subscription administrator, I want to prepare an approved Discovery landing zone so that deployment can use the required infrastructure and access.
---

# Prepare a Microsoft Discovery landing zone with the onboarding tool

Run Stage 2 to prepare the subscription and supporting infrastructure described in `config.json`. This preparation **writes to Azure**, even with `network.model=byo-existing`. It can register providers, create or update access, configure networking, and change project-storage settings.

A successful stage doesn't mean customer-owned firewall, quota, policy, or JIT activation work is complete.

If your organization uses [Azure landing zones](/azure/cloud-adoption-framework/ready/landing-zone/), coordinate preparation of Microsoft Discovery with the platform team responsible for the target workload subscription and shared services. Stage 2 prepares dependencies for Microsoft Discovery; it doesn't deploy an enterprise platform landing zone or replace its governance. For platform deployment options and workload subscription provisioning, see [Deploy Azure landing zones](/azure/architecture/landing-zones/landing-zone-deploy).

## Prerequisites

- A reviewed, current [onboarding configuration](how-to-create-deployment-configuration.md).
- Approval for the selected [network mode](how-to-plan-deployment-network.md), storage changes, and human-access mode.
- **Owner**, or **Contributor plus User Access Administrator**, at the target subscription scope. See the [conditional narrower alternative](reference-deployment-permissions.md#stage-2-landing-zone-preparation).
- For JIT mode, customer-approved PIM licensing, eligibility policy, and duration.
- Azure CLI signed into the correct tenant/subscription and a PowerShell 7 prompt in `utilities\onboarding-tool\scripts`.

## Confirm the change scope

1. Confirm the live context:

   ```powershell
   az account show --query "{tenantId:tenantId,name:name,id:id}" -o table
   ```

1. Compare it with `subscriptionId` in `config.json`. Confirm target platform, network, DNS, and storage resource groups.
1. If the subscription is governed by an Azure landing zone, confirm platform-team approval for provider registration, custom roles, role assignments or PIM eligibility, and network/storage changes. Review inherited policies and shared-service ownership before execution; Stage 2 must operate within those guardrails.
1. Review the plan with the network and IAM owners. You can [preview intended actions offline](how-to-preview-deployment-changes.md), but that doesn't validate permissions or live state.
1. For `managed`, `byo`, or `byo-spoke`, approve the VNet/subnet template's effect on any existing VNet. For `byo-existing`, verify customer-prepared subnets, DNS, and routes; that mode skips only the network-template deployment.
1. Confirm that administrators and users targeted by the configuration are the intended principals. Don't substitute a workload identity for a human principal.

## Run Stage 2

```powershell
.\stage2-landing-zone\stage2_prepare.ps1 `
  -ConfigPath .\config.json `
  -JsonPath .\out\stage2.json
```

The stage prepares these areas:

| Area | Tool action | Verify after execution |
| --- | --- | --- |
| Providers | Register the providers used by the tool. | Registration results for the target subscription. Optional capabilities can have additional dependencies. |
| Discovery control plane | Create or update the Discovery NSP Perimeter Joiner custom role and assign it plus subscription Reader to the Discovery service principal. | Role definition, principal, scope, and assignments. |
| Human access | Assign roles or create or reuse eligible user roles according to `rbac.humanAccessMode`. | Correct users, roles, resource groups, and subscription-level reads. |
| Workload identity | Assign UAMI roles after dependencies exist. | Platform, storage, and registry access, plus network access for the actual VNet. |
| Network | In provisioning modes, deploy the VNet, subnets, delegations, shared NSG, applicable UDR tables, and DNS zones and links. | Correct VNet and subnets; no unintended existing-network changes. |
| Project storage | Configure firewall default action, CORS, containers, and applicable blob private endpoint and DNS settings. | Account ownership, client and platform access paths, and correct endpoint and zone association. |

For manual procedures or optional resources outside the tool's scope, use [provider registration](how-to-register-resource-providers.md), [managed identities](how-to-configure-managed-identity.md), [project storage](how-to-configure-project-storage.md), and [NSP setup](how-to-configure-network-security.md#assign-the-nsp-perimeter-joiner-role).

## Complete the team handoffs

Read `.\out\stage2.md` first, then the detailed JSON report and generated artifacts. Review all failures, warnings, skips, and waived checks. See [reports and artifacts](reference-deployment-reports.md) for the shared report format.

| Artifact family | Responsible team | Completion evidence |
| --- | --- | --- |
| `firewall-request-<workspace>.md/.json` | Network/firewall | Required rules applied, reachable next hop, routing/peering and SNAT effective, successful subnet connectivity tests. |
| `quota-increase-requests-<workspace>.md/.json` | Subscription/capacity | Required quota granted and available in the selected region/model/SKU scope. |
| `policy-exemption-requests-<workspace>.md/.json` | Governance/policy | Approved effective exemption or another policy-compliant resolution. |
| `human-pim-eligibility-<workspace>.md/.json` | IAM and users | Correct eligibility verified and required roles activated for subsequent operations. |

Artifacts are emitted beside the selected report path when applicable. Writing a request isn't applying it. A workbook waiver doesn't create an Azure Policy exemption.

For UDR, verify actual egress, not merely an approved firewall ticket. The customer owns hub connectivity and firewall/NVA rules and SNAT; the tool doesn't configure the appliance or create hub peering.

## Activate and verify access

With `customer-jit-managed`, give the eligibility artifact to the customer IAM team. Each user must activate the roles needed for the next operation. Eligibility can legitimately appear as a warning rather than a Stage 2 failure.

Keep workload/service identity assignments persistent as intended by the tool; user PIM choices don't turn them into temporary user activations. Allow role propagation and verify the effective scope, especially when networking, storage, DNS, and platform resources use different groups.

Don't bypass a policy-denied permanent assignment by disabling the policy. Use the approved JIT process or obtain an authorized exception.

## Review completion and rerun if needed

Confirm a current `GO` report, correct prepared resources, resolved customer actions, and active access needed for Stage 3. `GO` only means no failed checks were recorded; it doesn't prove firewall or policy work outside the tool was completed.

Confirm the prepared VNet is in the configured `workloadRegion`, including when the Discovery control plane uses a different region. If an operation fails, use [Stage 2 troubleshooting](troubleshoot-deployment-tool.md#stage-2-fails-an-rbac-operation) and the first failing check's remediation.

Stage 2 is designed to reuse existing prepared state on rerun. After a failure, inspect the first failing operation, correct its cause, review changes already made, and rerun against the same intended targets. Don't assume failure rolled back prior operations.

## Next step

> [!div class="nextstepaction"]
> [Validate deployment readiness](how-to-validate-deployment-readiness.md)
