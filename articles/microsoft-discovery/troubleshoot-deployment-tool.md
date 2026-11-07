---
title: Troubleshoot the Microsoft Discovery onboarding tool
description: Diagnose Discovery onboarding configuration, permissions, policy, networking, quota, deployment, and Q&A verification problems without unsafe workarounds.
author: yousefi
ms.author: yousefi
ms.service: azure
ms.topic: troubleshooting-general
ms.date: 10/28/2026
# Customer intent: As an onboarding operator, I want stage-specific diagnosis and safe recovery guidance so that I can resolve the first failing operation.
---

# Troubleshoot the Microsoft Discovery onboarding tool

Use this article for script stages, check results, and generated reports. For service issues outside the tool, see [general Discovery troubleshooting](troubleshoot-microsoft-discovery.md) or [error codes](troubleshooting-error-code.md).

## Prerequisites

- The tool revision, stage command, and reviewed configuration used for the failed run.
- Access to its [reports and artifacts](reference-deployment-reports.md).
- The [permissions for the affected stage](reference-deployment-permissions.md).
- Access to relevant operation history and correlation IDs for failed Azure writes.

## Start with the first failure

1. Confirm the signed-in tenant/subscription and the configuration's targets.
1. Inspect the first Fail result's detail and remediation, not just the final verdict.
1. Review Warn, Skip, and Waived results. `GO` means no Fail results were recorded, not that all checks ran.
1. For Azure provisioning, inspect operation history and capture the [correlation ID](how-to-get-correlation-id.md).
1. Confirm whether a timed-out resource is still provisioning before another write.
1. After changing relevant inputs/networking/access, regenerate configuration as needed and refresh both readiness reports before deployment.

Don't edit a report to change its verdict, disable a policy, open public access, or delete resources merely to force progress.

## Stage 1 doesn't generate config.json

**Cause:** A required check failed, an input is invalid, or the workbook doesn't reflect approved choices.

**Resolve:** Correct the flagged Config value or SUBNET row and rerun Stage 1. Use POLICY/WAIVER rows only with the intended declaration or approved justification. A waiver doesn't grant an Azure Policy exemption. Review whether an older `config.json` remains from an earlier run.

**Verify:** The current run exports the intended config and its reports contain no unresolved blocking check. Review skipped live checks before treating it as ready.

## Login is missing or Azure checks are skipped

**Cause:** Azure CLI isn't signed in, the wrong tenant or subscription is selected, or the operator lacks access.

**Resolve:**

```powershell
az login
az account set --subscription "<subscription-id>"
az account show --query "{tenantId:tenantId,id:id,name:name}" -o table
```

Use subscription Reader and the conditional permissions for the actual check. Supplying a principal object ID avoids name-resolution lookup; it doesn't replace resource permissions.

**Verify:** Rerun the live checks and confirm the expected reads actually ran instead of degrading to Skip or Warn.

## Stage 2 fails an RBAC operation

**Cause:** The runner can create resources but can't create a custom role, grant roles, or create PIM eligibility at the required scope.

**Resolve:** For a clean subscription or JIT mode, use Owner or Contributor plus User Access Administrator at subscription scope. Contributor plus Role Based Access Control Administrator is only the supported alternative when the NSP custom role already exists and permanent assignments are selected. Inspect the exact denied operation and scope.

**Verify:** Rerun Stage 2 and confirm the intended principal, role, and scope in the report. Don't assume successful assignments before the failure were rolled back.

## Stage 2 reports that PIM activation is required

**Cause:** Eligibility was created or verified, but the user didn't activate it.

**Resolve:** Give `human-pim-eligibility-<workspace>.md` to the IAM team. Each user activates required roles before the dependent operation. Confirm licensing, eligibility duration, and customer policy if eligibility creation itself fails.

**Verify:** Check active access, not only eligible access, then rerun the affected operation. The eligibility reminder can remain a warning without making Stage 2 fail.

## Policy denies a user role assignment

**Symptom:** `RequestDisallowedByPolicy`.

**Resolve:** Use the approved `customer-jit-managed` process where policy requires JIT, or get a policy-approved exception. Don't disable the policy or use a permanent-assignment script as a workaround.

**Verify:** The policy owner confirms an approved effective solution and the intended eligibility or assignment operation succeeds.

## Stage 4 reports a missing or invalid managed identity

**Cause:** `managedIdentity.id` doesn't reference the existing UAMI.

**Resolve:** [Create or identify the UAMI](how-to-configure-managed-identity.md), put its full resource ID in the workbook, rerun Stage 1, and review the resulting config. A principal ID isn't a UAMI resource ID.

**Verify:** The configured resource exists in the intended scope and Stage 4's identity preflight succeeds.

## Stage 4 fails managed identity role assignments

**Cause:** The UAMI lacks required platform, storage, registry, or network access, or its role assignments aren't effective yet.

**Resolve:** Use the exact scoped commands printed by the failed check with authorized assignment access. Verify the three core roles on the platform resource group and Network Contributor on the referenced supercomputer subnet or virtual network. When resources span resource groups, inspect the actual resource IDs.

**Verify:** Allow propagation, confirm effective assignments, and rerun the identity preflight. Don't grant broad subscription roles to mask an incorrectly resolved VNet.

## Stage 4 fails workload and VNet region alignment

**Symptom:** A `deploy-network-region` failure, `RegionMismatch`, or a dependent-resource region error.

**Cause:** A referenced VNet can't be read, or its region differs from `workloadRegion`. The normal Stage 4 preflight checks the workload subnets before submitting resources; `controlPlaneRegion` doesn't need to match their region.

**Resolve:** Confirm the runner can read every referenced VNet. Set `workloadRegion` to the approved VNet/subnet region, or select subnets in `workloadRegion`. Keep all resources in the managed resource groups in that region. Correct the workbook, regenerate configuration, and rerun readiness checks. Changing configuration doesn't move existing managed resources; a deployed region change can require an owner-approved recreation plan.

**Verify:** The region-alignment preflight succeeds for every applicable subnet. Don't delete the environment or change the control-plane region merely to bypass this check.

## Stage 4 fails supercomputer subnet topology

**Cause:** The system-node `aksSubnet` is delegated, or UDR lacks the separate delegated management subnet.

**Resolve:** The tool's `managedcluster` role is the system-node subnet and must be undelegated. A separate UDR management subnet is delegated to `Microsoft.ContainerService/managedClusters`. Review [network planning](how-to-plan-deployment-network.md#record-subnet-and-dns-settings) and the exact proposed subnet update with the network owner before applying it.

**Verify:** Inspect the actual subnet IDs and delegations, regenerate readiness reports, and confirm Stage 4's topology preflight succeeds. Profile names alone don't guarantee management-subnet coverage.

## The supercomputer fails with InternalServerError

**Symptom:** An early `InternalServerError` targets `internalMetadata`, and the managed resource group is empty.

**Resolve:** Check subnet topology and UAMI roles first. Inspect operation history to rule out a still-running operation. Only if the supercomputer is terminally Failed and resource-specific recovery requires recreation, obtain approval to delete that exact failed resource, preserve the correlation ID, review dependents, and rerun Stage 4. Don't delete the whole RG.

**Verify:** The recreated supercomputer reaches Succeeded. If topology and roles are correct but the failure persists, open a support case with the operation and correlation details rather than repeatedly recreating resources or guessing a region.

## AKS bootstrap fails reaching outbound dependencies

**Symptoms:** `VMExtensionError_OutboundConnFail`, exit 50, or failure reaching `mcr.microsoft.com`.

**Resolve:** From the system-node subnet path, verify DNS, the real NVA private next hop, peering and routes, firewall FQDN allows, SNAT, and required TLS and image downloads. A NAT public IP isn't an NVA next hop. A static Stage 3 `GO` doesn't rule this failure out.

Use [supercomputer egress requirements](how-to-configure-supercomputer-network-security.md) and [AKS outbound-failure guidance](/troubleshoot/azure/azure-kubernetes/create-upgrade-delete/error-code-outboundconnfailvmextensionerror).

**Verify:** Retain successful required-subnet tests, refresh readiness reports, and inspect the provisioning result after retry.

## VM quota is insufficient

**Symptom:** `Insufficient quota for VM size`.

**Resolve:** Check live total regional and VM-family vCPU usage in the region where you want to deploy. Request the named quota increase through **Subscriptions** > **Usage + quotas** or through the approved quota process. Confirm selected SKU availability and planned maximum node counts.

**Verify:** Required free quota is available and the live checks succeed. A generated quota-request artifact or an absent portal quota row isn't evidence of granted capacity.

## Deployment is partial or the workspace is stranded

**Resolve:** After an interruption, inspect operation history and identify whether the last resource is still provisioning, succeeded, or failed. Stage 4 inspects actual resource state; normal reruns resume incomplete deployment.

1. Fix the first diagnosed failure and refresh readiness reports after relevant changes.
1. Rerun the same normal Stage 4 command with the reviewed configuration and both readiness reports.
1. Don't delete resources merely because the process was interrupted. A failed operation doesn't imply rollback.

Use `-Recovery` only for its targeted **workspace re-PUT** case after diagnosing a stranded workspace and confirming linked supercomputers are `Succeeded`. It isn't a general repair switch.

The recovery path precedes the normal readiness gate. Review fresh readiness and network evidence explicitly before any recovery write. Use the targeted command emitted by the tool for the intended subscription, resource group, and workspace. Don't adapt it to a different resource without diagnosis. Preserve operation history and the correlation ID before any approved resource deletion.

**Verify:** Check resource states/IDs and required Foundry access, not only a successful command exit. See [deployment and resume guidance](how-to-deploy-platform.md).

## PLAN is mistaken for readiness or reports are stale

**Cause:** An offline preview or old report was supplied instead of fresh live evidence.

**Resolve:** Run both live Stage 3 profiles against the reviewed config and current environment. Pass both JSON paths to the normal Stage 4 command. The script doesn't require reports when omitted and doesn't enforce freshness or config binding.

**Verify:** Confirm report verdicts, actual check coverage, revision/config identity, and independent connectivity evidence. Don't change a `PLAN` verdict to `GO`.

## Stage 5 can't reach the workspace or outputs

**Resolve:** For a private workspace, run from an approved VNet-connected runner with correct DNS and access. Don't enable public access as a routine fix. If the workspace is reachable but output blobs aren't, check the separate storage path, client network access, CORS, and identity permissions.

**Verify:** The runner's workspace probe succeeds and an approved user can access the intended storage endpoint. Endpoint/DNS metadata checks aren't a substitute for actual reachability.

## Prepare a support handoff

Include the tool revision, stage, first failed check, sanitized target/resource context, provisioning state, timestamps, and correlation ID. Summarize relevant report details and connectivity evidence through the approved support channel.

Exclude credentials, tokens, private research text, and raw customer configuration from public issues. For service-level diagnosis, see [general troubleshooting](troubleshoot-microsoft-discovery.md).
