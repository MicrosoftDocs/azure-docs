---
title: Troubleshoot Microsoft Discovery
description: "Diagnose and resolve common Microsoft Discovery problems across deployment, supercomputer, workspace, networking, bookshelf, and tool operations."
author: yousefi
ms.author: yousefi
ms.service: azure
ms.topic: troubleshooting-general
ms.date: 09/24/2026

#customer intent: As a Discovery platform administrator or developer, I want to troubleshoot common Microsoft Discovery problems so that I can restore a working deployment and run investigations.

---

# Troubleshoot Microsoft Discovery

This article helps you diagnose and resolve problems with Microsoft Discovery when you don't have a specific error code to look up. It covers deployment, supercomputers, workspaces, networking, bookshelves and knowledge bases, and tools and agents.

Start with the general troubleshooting checklist. Then go to the section that matches your symptom for likely causes and solutions. If you already have a specific error code or message, see [Microsoft Discovery error codes](troubleshooting-error-code.md). Before you open a support request, also review [Known issues for Microsoft Discovery](known-issues.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A Microsoft Discovery environment that's deployed or being deployed.
- The required Discovery role assignments. See [Role assignments for Microsoft Discovery](concept-role-assignments.md).
- Access to the Activity Log and to Log Analytics to query platform logs. See [Query supercomputer logs](how-to-query-supercomputer-logs.md) and [Query workspace logs](how-to-query-workspace-logs.md).

## Troubleshooting checklist

Work through these steps first. They identify the cause of most problems and provide the evidence you need for the sections that follow.

### Capture the correlation ID and read the operation history

Get the correlation ID for the failed operation and read the control-plane operations. The summary error is often generic, but the operation history shows the first operation that actually failed. See [Get operation correlation ID from Activity Log](how-to-get-correlation-id.md).

### Check the resource provisioning state

Confirm the resource's `provisioningState`. `Succeeded` means the operation completed, `Accepted` usually means the operation is still in progress, and `Failed` means you must inspect the operation history before you retry. Some resource types must be deleted and recreated after they enter a terminal `Failed` state.

### Verify the deploying identity's roles

Confirm the required roles are assigned to the identity that runs the operation. For a pipeline, check the service principal or managed identity rather than the interactive user. Azure ownership permissions don't replace the Discovery data-plane and supporting service roles described in [Role assignments in Microsoft Discovery](concept-role-assignments.md).

### Confirm the region and API version

Confirm the target region is supported and the request uses the API version that ships with the current Toolbox or [infrastructure quickstart](quickstart-infrastructure.md).

### Query the relevant logs

Query supercomputer, workspace, and bookshelf logs to locate the failing phase. See [Query supercomputer logs](how-to-query-supercomputer-logs.md), [Query workspace logs](how-to-query-workspace-logs.md), and [Query bookshelf logs](how-to-query-bookshelf-logs.md).

## Potential quick workarounds

These workarounds can restore service quickly. For a permanent fix, use the cause and solution sections that follow.

### Retry a transient failure

1. If an operation fails with an `InternalServerError`, a gateway timeout, or other kind of timeout, wait a few minutes.
1. Check the operation history for a terminal failure before you retry. Don't delete partially created resources unless the resource-specific guidance requires recreation.

### Pin a job to a known-good node pool

1. In the project preference, set the correct node pool explicitly (`nodePoolId`).
1. Resubmit the job or tool run.

## Deployment fails because the identity is missing required roles

Deployment reaches an operation that needs a data-plane, network-perimeter, storage, or Foundry permission that the deploying identity doesn't have.

### Solution: Assign the full role set to the deploying identity

1. Assign the platform administrator persona roles to the identity that runs the deployment. Include the network security perimeter, storage data-plane, and Foundry roles required for the resources in your deployment.
1. Preview the assignments with the `Set-DiscoveryRoleAssignments.ps1` script and its `-WhatIf` parameter, and then run the script without `-WhatIf`. See [Assign persona roles with a PowerShell script](how-to-assign-persona-roles.md).
1. Wait several minutes for role and network-perimeter propagation.
1. Rerun the deployment. See [Role assignments for Microsoft Discovery](concept-role-assignments.md).

## Deployment fails or is blocked in a specific region

A region can be restricted or withdrawn for Discovery managed resources even when it appears selectable. Resource-group location policies can also block where you create virtual networks or resource groups. Capacity or quota might also contribute to deployment failure.

### Solution: Deploy to a supported region and add policy exemptions

1. Deploy to a supported region.
1. If a required role is eligible through Privileged Identity Management (PIM), activate it before deploying.
1. Create the resource group in the correct region. If an organizational policy blocks the deployment, ask the policy administrator whether an exemption is permitted at the required scope.

For a region that appears selectable but isn't supported, see [Known issues for Microsoft Discovery](known-issues.md#an-unsupported-region-appears-as-a-deployment-option).

## Deployment appears stuck and never finishes

The deployment fails internally but keeps retrying components, so it looks like it's still running.

### Solution: Find and fix the first internal failure

1. Open the deployment operation history and find the first operation that failed.
1. Resolve that root cause, which is commonly a missing role, a network feature, or a subnet or quota limit.
1. Rerun the deployment.

## A Discovery resource is stuck in a terminal failed state

Some Discovery resources can't be updated after they enter a terminal `Failed` state, so further operations return a conflict.

### Solution: Delete and recreate the failed resource

1. Confirm from the operation history that the resource is in a terminal `Failed` state and can't be retried.
1. Delete only the failed resource. For a workspace, leave the resource group, storage, and supercomputer in place.
1. Recreate the resource with a new name and the correct prerequisites.
1. To free a supercomputer that's bound to a stuck workspace, remove the supercomputer association from within the workspace instead of deleting the supercomputer. See [Manage Microsoft Discovery workspaces](how-to-manage-workspaces.md) and [Delete Microsoft Discovery resources](how-to-delete-discovery-resources.md).

## Supercomputer creation fails with a webhook timeout

During the internal Helm install of the supercomputer, the `kueue-webhook-service` in the `kueue-system` namespace returns a 504 Gateway Timeout to the network-operator pre-upgrade hook, and the install fails. This condition is transient.

### Solution: Retry creation and confirm the latest release

1. Retry supercomputer creation.
1. Confirm you're on the latest platform release.
1. If it persists, inspect the pod behind `kueue-webhook-service` in the `kueue-system` namespace. See [Query supercomputer logs](how-to-query-supercomputer-logs.md).

## The managed cluster fails during node-pool provisioning

The Activity Log shows failures during managed cluster provisioning because the supercomputer subnet is too small for node-pool scaling.

### Solution: Increase the subnet size and redeploy

1. Increase the AKS and supercomputer subnet to at least `/24`.
1. Redeploy the supercomputer.
1. Validate that node-pool creation succeeds.

## Supercomputer jobs terminate unexpectedly

AKS node OS upgrades can evict or kill running jobs and pods, so a subset of long-running jobs terminate, sometimes without surfaced logs. Node or GPU driver health issues can also cause a "node became not ready" failure.

### Solution: Use a resilient release and pin the node pool

1. Confirm you're on a release with job and node resiliency improvements.
1. Set the correct `nodePoolId` in the project preference.
1. If a node or GPU node pool is unhealthy, ensure the latest node image and recreate the node pool.
1. Review the affected run in the supercomputer logs. See [Debug task execution](how-to-debug-task-execution.md).

## Tool runs fail because resources aren't allowlisted

A storage account or supercomputer exists but isn't associated with the workspace, so tool runs that reference it are rejected with a "Resources not allowed" error.

### Solution: Allowlist the storage account and supercomputer in the workspace

1. Associate (allowlist) the storage account and the supercomputer in the workspace.
1. Rerun the tool. See [Manage Microsoft Discovery workspaces](how-to-manage-workspaces.md).

## Workspace creation fails because of insufficient quota

The workspace's Azure Container Apps environment requires enough quota to create. For the Enterprise SKU, the environment needs at least 80 cores.

### Solution: Increase the container environment quota

1. Request or confirm at least 80 cores of Azure Container Apps quota in the target region.
1. Retry workspace creation. See [Quota and reservations](concept-quota-reservation.md).

## The workspace host doesn't resolve over a private endpoint

Private DNS isn't resolving the workspace data-plane host from inside the virtual network after you enable network isolation or disable public access, so investigations are unreachable over Private Link.

### Solution: Fix private DNS resolution

1. Verify the private DNS zone and A-records for the data-plane host exist.
1. Confirm the private endpoint is approved and linked to the correct virtual network and subnet.
1. Validate resolution from a host inside the virtual network:

   ```bash
   nslookup <workspace-host>.workspace.discovery.azure.com
   ```

1. Apply the same checks to a bring-your-own Cosmos DB private endpoint when project creation depends on it. See [Network security for Microsoft Discovery](concept-network-security.md).

## Network security group rules block deployment and usage

`DenyAllInbound` and `DenyAllOutbound` rules applied to every subnet block the traffic Discovery needs, so deployment fails and, even after deployment, chat or agent operations fail.

### Solution: Scope network security group rules to the correct subnets

1. Attach the required allow rules to the correct network security group for the supercomputer subnets. See [Plan network security groups for a Microsoft Discovery supercomputer](how-to-plan-supercomputer-network-security-groups.md).
1. Remove blanket deny rules that apply to every subnet.
1. If agent operations still appear blocked by rules, [create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request) with the affected subnet and network security group details.

## Supercomputer deployment stalls because a required public IP feature isn't registered

For a network configuration that uses a public IP address, the supercomputer deployment can get stuck when the bring-your-own public IP network feature isn't registered on the subscription. This condition causes an internal failure that the deployment keeps retrying. If Azure Policy blocks public IP creation, see [Known issues for Microsoft Discovery](known-issues.md#azure-policy-blocks-public-ip-creation-during-supercomputer-deployment) instead.

### Solution: Register the network feature and redeploy

1. Run the following commands to register the feature and re-register the provider:

   ```azurecli
   az feature register --namespace Microsoft.Network --name AllowBringYourOwnPublicIpAddress
   az provider register -n Microsoft.Network
   ```

1. Run the following command to confirm that the feature state is `Registered`, and then redeploy:

   ```azurecli
   az feature show --namespace Microsoft.Network --name AllowBringYourOwnPublicIpAddress -o table
   ```

## Knowledge base creation fails validation

The data plane rejects an invalid version string or bookshelf name. This rejection surfaces as a chunked-encoding or 400 error on the version request. A bookshelf that's still deploying shows `provisioningState` as `Accepted` rather than `Succeeded`.

### Solution: Use a valid name and version, and wait for provisioning

1. Use a simple integer version number, such as `1`, instead of a longer string such as `1.0`.
1. Ensure the bookshelf name uses lowercase letters and dashes only.
1. Wait for `provisioningState` to reach `Succeeded` before you continue. See [Index a bookshelf knowledge base](how-to-index-bookshelf-knowledgebase.md).

## Bookshelf indexing fails or silently drops documents

Indexing can fail on a very large single document or from a transient database timeout. In some cases, a large document is dropped from the index even though indexing reports success.

### Solution: Check indexing logs and split large documents

1. Check the bookshelf indexing logs for the affected document. See [Query bookshelf indexing logs](how-to-query-bookshelf-indexing-logs.md).
1. Split very large PDFs, and confirm document sizes against the current ingest limits.
1. Confirm sufficient embedding and retrieval model quota in the region.
1. Ensure you're on a platform release with ingest improvements, and then retry.

## Project or agent creation fails with a 500 error

Agent creation in the backing Foundry resource returns a 500 error, often because the project managed identity is missing a Foundry role or because a bring-your-own Cosmos DB private endpoint can't be reached.

### Solution: Verify Foundry roles and Cosmos DB connectivity

1. Verify the Foundry User role is assigned to the project managed identity.
1. Validate the bring-your-own Cosmos DB private endpoint connectivity and DNS.
1. If project deletion is blocked for a project already in a failed state, use platform cleanup actions, and then redeploy. See [Agent creation](how-to-agent-creation.md).

## Tool execution fails with an invalid message id

An invalid or mismatched message identifier passed from the agent to the tool prevents tool invocation, so prompts that use tools can't complete.

### Solution: Update to a fixed release and collect definitions

1. Ensure you're on a release that includes the message ID fix and diagnostic logging.
1. Apply any recommended prompt-level improvements.
1. Collect the agent, workflow, and tool definitions to reproduce the issue. See [Debug task execution](how-to-debug-task-execution.md).

## Advanced troubleshooting and data collection

If you [create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request), collect the following information so support can investigate quickly:

- The correlation ID and the deployment operation list for the failed operation.
- The Activity Log entries and relevant supercomputer, workspace, or bookshelf logs.
- The role assignments on the deploying identity or project managed identity.
- The region, API version, and Toolbox or template version.
- For networking issues, the `nslookup` output from inside the virtual network, the private endpoint and DNS configuration, and the network security group rules.

## Related content

- [Service architecture for Microsoft Discovery](overview-service-architecture.md)
- [Known issues for Microsoft Discovery](known-issues.md)
- [Network security for Microsoft Discovery](concept-network-security.md)
- [Bookshelf knowledge bases](concept-bookshelf-knowledge-bases.md)
