---
title: Troubleshoot Microsoft Discovery
description: "Diagnose and resolve common Microsoft Discovery problems across deployment, supercomputer, workspace, networking, bookshelf, and tool operations."
author: yousefi
ms.author: yousefi
ms.service: azure
ms.topic: troubleshooting-general
ms.date: 11/10/2026

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

For an Azure Resource Manager operation, capture the correlation ID and inspect the deployment operation history and Activity Log for the failing operation. See [Get operation correlation ID from Activity Log](how-to-get-correlation-id.md).

For a workspace data-plane request or tool run, capture the response, timestamp, and available request, conversation, or run identifiers, then query the relevant application logs. An ARM correlation ID doesn't necessarily identify the application request, and the Activity Log isn't a record of all data-plane activity. See [Access resource logs](how-to-access-resource-logs.md).

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

1. If an operation returns an `InternalServerError` or a timeout, check its outcome and resource state before retrying. The response alone doesn't establish a transient failure.
1. Retry only when the operation supports safe retries and the evidence indicates a temporary failure. Use bounded backoff and honor `Retry-After` when returned. Don't delete partially created resources unless the resource-specific guidance requires recreation.
1. If the failure persists or the cause isn't clear, [create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request) with the response, timestamp, and relevant identifiers.

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
1. Check model and compute quota in the target region. Request additional quota if needed. If capacity isn't available, select another supported target region.

For a region that appears selectable but isn't supported, see [Known issues for Microsoft Discovery](known-issues.md#an-unsupported-region-appears-as-a-deployment-option).

### Cross-region managed resources deploy to the wrong region

For a [cross-region deployment](how-to-deploy-across-regions.md), verify that the `discovery.overridemrgregion` tag was present on each supported Discovery resource when it was created. The value must be a valid Azure programmatic region identifier, and the target region must support Discovery cross-region deployment and the required Foundry features.

If resources can't communicate, check network security groups, routes, firewalls, private endpoints, and private DNS. Verify that managed identities can access storage accounts, the container registry, and other dependencies.

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

Check the job and node events before assigning a cause. Discovery uses a Pod Disruption Budget (PDB) that can block voluntary eviction of an active tool during an AKS node-pool upgrade. A PDB doesn't prevent involuntary disruptions such as hardware failure, node loss, or resource exhaustion. See [Supercomputer AKS upgrades](concept-supercomputer-aks-upgrades.md#how-microsoft-discovery-protects-running-tools).

<a id="solution-use-a-resilient-release-and-pin-the-node-pool"></a>

### Solution: Inspect the run and verify the node pool

1. Review the affected run and job and node events in the [supercomputer logs](how-to-query-supercomputer-logs.md).
1. Verify the `nodePoolId` in the project preference identifies the intended pool. Selecting a pool doesn't repair unhealthy nodes or guarantee scheduling capacity.
1. If a node or GPU node pool is unhealthy, collect its state and events and contact your administrator or Microsoft Support for a supported recovery procedure. Don't modify the backing AKS resources directly. See [Debug task execution](how-to-debug-task-execution.md).

## Supercomputer nodes never reach the Ready state

Nodes provision at the infrastructure layer but never join the cluster, and the supercomputer stays in a provisioning or failed state. Bootstrap failures happen before your containers run, so application logs might contain no useful evidence.

### Solution: Check bootstrap dependencies and cluster health

1. Check that nodes can resolve `mcr.microsoft.com` and `management.azure.com`, and that DNS responses return along the same path as the query.
1. Compare outbound rules with the [supercomputer network requirements](how-to-plan-supercomputer-network-security-groups.md) and [AKS outbound rules](/azure/aks/outbound-rules-control-egress). Check container image and OS package endpoints, including dependencies covered by Azure Front Door service tags.
1. For `UserDefinedRouting`, verify node subnets can reach the management subnet on ports 443 and 4443. Check rules on the management subnet's network security group, not only the node subnets.
1. Inspect [virtual network flow logs](/azure/network-watcher/vnet-flow-logs-overview) during the provisioning window. A denied flow identifies the matching rule. If there are no deny records, check effective routes and the egress appliance for drops, asymmetric paths, and source network address translation port exhaustion.
1. Verify subnet delegations against the [onboarding validation checks](how-to-validate-deployment-readiness.md). For `UserDefinedRouting`, the management subnet requires `Microsoft.ContainerService/managedClusters` delegation; the system-node and node-pool subnets must remain undelegated.
1. Check subnet IP availability, VM quota and SKU availability, Azure Policy denials, managed identity permissions, and role assignment failures.
1. Inspect the virtual machine scale set instance and extension provisioning state for the specific failure.

Flow logs have three limitations:

- Traffic dropped by routing, an egress appliance, or a DNS failure doesn't reach network security group evaluation. No deny record isn't proof that traffic was allowed.
- A capture only covers the lifecycle events observed. Bootstrap, upgrade, and failover rules might have no matches in a steady-state capture. Don't remove a rule solely because it matched nothing.
- Flow logs are aggregated, not real time. Allow several collection intervals before concluding a flow didn't occur.

Configuration checks don't prove packet-level connectivity or available compute capacity. Correlate them with the provisioning error and observed network traffic. After correcting a confirmed customer-managed configuration problem, use a supported Discovery recovery procedure with your administrator or Microsoft Support. Don't reconcile the backing AKS cluster, reimage instances, or change resources in the managed resource group directly.

## A node pool fails to delete

If node pool deletion returns `InternalServerError` with the target `internalMetadata`, inspect the deletion operation and the backing AKS cluster state. A `Failed` or `Deallocated` cluster is useful diagnostic evidence, but the error alone doesn't establish the cause or a customer-run repair.

<a id="solution-reconcile-the-backing-cluster-before-retrying-deletion"></a>

### Solution: Collect cluster state and use supported recovery

1. Check the cluster in the supercomputer's managed resource group. This command is read-only; replace the placeholders with the actual resource names.

   ```azurecli
   az aks show --resource-group "{managedResourceGroup}" --name "{aksClusterName}" \
     --query "{provisioningState:provisioningState, powerState:powerState.code}"
   ```

1. Collect the failed deletion response, timestamp, ARM correlation ID, and cluster state for Microsoft Support. Don't run `az aks update` or modify the backing resources in the managed resource group as a repair.
1. Retry deletion through Discovery only after the supported recovery procedure indicates it's safe. See [Delete Microsoft Discovery resources](how-to-delete-discovery-resources.md).

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

## Workspace creation fails validation

Check the first failed operation for the following conditions:

- **Name conflict:** Workspace names must be globally unique and lowercase. Choose a different name if the failure identifies a naming conflict.
- **Permissions:** Verify the deploying identity has **Microsoft Discovery Platform Administrator (Preview)** or **Owner** on the resource group, plus the [required supporting roles](#deployment-fails-because-the-identity-is-missing-required-roles).
- **Subnet delegation:** Verify `workspaceSubnet` and `agentSubnet` are delegated to `Microsoft.App/environments`.
- **Quota:** Use the [workspace quota checks](#workspace-creation-fails-because-of-insufficient-quota).
- **Identity:** Use the [workspace identity checks](#workspace-creation-fails-with-identity-error).

## The workspace host doesn't resolve over a private endpoint

Private DNS isn't resolving the workspace data-plane host from inside the virtual network after you enable network isolation or disable public access, so investigations are unreachable over Private Link.

### Solution: Fix private DNS resolution

1. Read the private endpoint's DNS configuration and verify the required zone and A-records for the actual workspace data-plane host.
1. Confirm the private endpoint is approved and linked to the correct virtual network and subnet.
1. Confirm the private DNS zone is linked to the client virtual network and the private endpoint has the correct DNS zone group. With custom DNS, check forwarding to Azure DNS (`168.63.129.16`) through the appropriate Azure-connected DNS path. See [Configure private DNS](how-to-configure-network-security.md#configure-private-dns).
1. Validate resolution from a host inside the virtual network:

   ```bash
   nslookup "{workspaceDataPlaneHostname}"
   ```

   Replace `{workspaceDataPlaneHostname}` with the host from the workspace data-plane endpoint. Confirm the result matches the private endpoint's IP address. Successful DNS resolution alone doesn't prove API connectivity.

1. Apply the same checks to a bring-your-own Cosmos DB private endpoint when project creation depends on it. See [Network security for Microsoft Discovery](concept-network-security.md).

If public network access is disabled, connect to the workspace from a private network path through a private endpoint, VPN, or ExpressRoute. Discovery Studio users also need that path. Don't enable public access as a routine troubleshooting fix.

## Network hardening or private endpoint access fails

<a id="permission-to-perform-joinperimeterruleaction-is-missing"></a>

### Missing permission to perform joinPerimeterRule/action

The custom NSP Perimeter Joiner role assignment is missing or hasn't propagated.

1. [Verify the role assignment](how-to-configure-network-security.md#assign-the-nsp-perimeter-joiner-role).
1. Confirm the assignment is at **subscription** scope, not resource group scope.
1. Wait up to five minutes for Azure RBAC propagation.
1. Retry workspace creation. The create-or-update operation is idempotent.

### Service principal not found

If the Discovery Control Plane service principal doesn't exist in your tenant, create it, then retry the role assignment:

```azurecli
az ad sp create --id 92c174ac-8e41-4815-a1b7-d81b19ab03ce
```

### An approved private endpoint still returns API errors

| Error | Checks and resolution |
| --- | --- |
| 504 Gateway Timeout | The backend might be temporarily unavailable. Compare with the public path only if that path is already allowed by your network policy. Don't enable public access for this test. If both allowed paths fail, check service availability. |
| 401 Unauthorized | Verify the token audience is `https://discovery.azure.com/` and the caller has the required role on the resource. |
| DNS resolves to a public IP | Follow the [private DNS checks](#the-workspace-host-doesnt-resolve-over-a-private-endpoint). |

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

A `400` response from the classic knowledge-base version endpoint can identify an invalid version or name. A browser chunked-encoding error alone doesn't identify the validation failure; inspect the response and operation logs. Also confirm that the bookshelf's `provisioningState` is `Succeeded`.

### Solution: Use a valid name and version, and wait for provisioning

1. For the classic knowledge-base version endpoint with API version `2026-02-01-preview`, use a `versionName` of 1-24 ASCII letters, digits, or hyphens. For example, `1` is valid, but `1.0` isn't. These constraints don't define the contract for other API versions.
1. Check the bookshelf and knowledge base names against the constraints for the API or Studio experience you're using.
1. Wait for `provisioningState` to reach `Succeeded` before you continue. See [Index a bookshelf knowledge base](how-to-index-bookshelf-knowledgebase.md).

## Bookshelf indexing fails or silently drops documents

Indexing can fail on a very large single document or from a transient database timeout. In some cases, a large document is dropped from the index even though indexing reports success.

### Solution: Check indexing logs and split large documents

1. Check the bookshelf indexing logs for the affected document. See [Query bookshelf indexing logs](how-to-query-bookshelf-indexing-logs.md).
1. Split very large PDFs, and confirm document sizes against the current ingest limits.
1. Confirm sufficient embedding and retrieval model quota in the region.
1. Ensure you're on a platform release with ingest improvements, and then retry.

## Project or agent creation fails with a 500 error

A 500 response during project or agent creation doesn't identify a cause by itself. Check the project identity's Foundry permissions and, if you use bring-your-own Cosmos DB, its private endpoint and DNS configuration. Use the response and logs to determine whether either check relates to the failure.

### Solution: Verify Foundry roles and Cosmos DB connectivity

1. Verify the Foundry User role is assigned to the project managed identity.
1. Validate the bring-your-own Cosmos DB private endpoint connectivity and DNS.
1. If the error persists or a failed project can't be deleted through Discovery, contact Microsoft Support with the response, timestamp, and available request identifiers. Don't modify backing managed resources as a cleanup action. See [Agent creation](how-to-agent-creation.md).

## Tool execution fails with an invalid message id

An invalid or mismatched message identifier passed from the agent to the tool prevents tool invocation, so prompts that use tools can't complete.

### Solution: Update to a fixed release and collect definitions

1. Ensure you're on a release that includes the message ID fix and diagnostic logging.
1. Apply any recommended prompt-level improvements.
1. Collect the agent, workflow, and tool definitions to reproduce the issue. See [Debug task execution](how-to-debug-task-execution.md).

## Managed identity operations fail

### Storage access denied

Storage container creation or blob operations fail with `403 Forbidden`, `AuthorizationFailed`, `AuthorizationPermissionMismatch`, or `This request is not authorized to perform this operation`.

Verify that the workspace's user-assigned managed identity (UAMI) has **Storage Blob Data Contributor** on the target storage account. For example:

```azurecli
az role assignment create \
  --assignee-object-id "{uamiPrincipalId}" \
  --assignee-principal-type ServicePrincipal \
  --role "Storage Blob Data Contributor" \
  --scope "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}"
```

Role assignment propagation can take up to 10 minutes. Wait, then retry. If the failure affects a user's access to output files rather than the workspace identity, use [Can't view output files](how-to-debug-task-execution.md#cant-view-output-files).

### Container image pull failures

Tool runs fail with `ImagePullBackOff`. Check that the image repository and tag in the tool definition exist, and that the registry network rules allow access from the supercomputer.

Verify permissions for the supercomputer's **kubelet UAMI**, which pulls images. In a shared-identity deployment, it can be the same UAMI used by the workspace. For a registry in **RBAC Registry Permissions** mode, assign **AcrPull** at the registry scope:

```azurecli
az role assignment create \
  --assignee-object-id "{uamiPrincipalId}" \
  --assignee-principal-type ServicePrincipal \
  --role "AcrPull" \
  --scope "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ContainerRegistry/registries/{acrName}"
```

For an ABAC-enabled registry, use supported repository roles instead. AcrPull isn't a substitute for repository-scoped permissions. See [Supercomputer registry access](how-to-configure-container-registry.md#supercomputer-access).

### Workspace creation fails with identity error

For `ManagedIdentityNotFound` or `LinkedAuthorizationFailed` errors:

1. Verify the UAMI exists: `az identity show --name {name} --resource-group {rg}`.
1. Verify the identity resource ID and its required placement for your deployment. For cross-region deployments, follow the workload-region placement in [Deploy across regions](how-to-deploy-across-regions.md).
1. Confirm the caller has **Reader** access to the identity resource.

See [Configure a user-assigned managed identity](how-to-configure-managed-identity.md).

### Chat model deployment fails

Agent responses fail with authentication errors when calling Azure OpenAI if the service-managed **Cognitive Services OpenAI User** assignment is missing.

Find the workspace managed resource group:

```azurecli
az rest --method GET \
  --url "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/workspaces/{workspaceName}?api-version=2026-06-01" \
  --query "properties.managedResourceGroup"
```

Verify role assignments there. If the autoassigned role is missing, contact Microsoft Support. Don't manually modify assignments managed by the Discovery service.

## Persona role assignment script fails

Use the failed and skipped rows in the [persona role assignment script summary](how-to-assign-persona-roles.md#output-and-exit-codes) to identify the affected scope.

| Symptom | Cause and resolution |
| --- | --- |
| `FATAL: -ResourceGroupName is required when -Scope is 'ResourceGroup'.` | Supply `-ResourceGroupName <name>` or choose `-Scope Subscription` when that broader scope is intended. |
| `Role 'Microsoft Discovery Bookshelf Index Data Reader - Preview' not found in this tenant.` | The role isn't available in the tenant yet. The run continues; rerun later to pick up the role. |
| `Azure AI Owner/User ... [-WorkspaceManagedRGName not provided; ...]` | The workspace doesn't exist yet. Follow the [two-step assignment workflow](how-to-assign-persona-roles.md), or use subscription scope only if that scope is intended. |
| `Permission denied` from `New-AzRoleAssignment` | The script runner needs **Owner**, **User Access Administrator**, or **Role Based Access Control Administrator** at the target scope. |
| `Unable to acquire token for tenant '...'` and `User interaction is required` | Specify the subscription's tenant with `-TenantId <guid>` or enter the tenant GUID at the prompt. |

For additional cross-tenant guidance, see the [script troubleshooting reference](https://github.com/microsoft/discovery/blob/main/utilities/rbac-roles-assignment/README.md#troubleshooting).

## Project access or linked-resource permissions are incorrect

Use the [project role verification commands](how-to-configure-project-rbac.md#verify-the-assignments) to inspect direct and inherited assignments.

| Symptom | Cause and resolution |
| --- | --- |
| You can't see a project | Assign the role at the full project resource ID and allow time for Azure RBAC propagation. |
| You can see every project | Review and narrow an inherited Microsoft Discovery Platform role at workspace, resource group, or subscription scope. |
| The tool list is empty or agent creation is denied | Assign **Microsoft Discovery Tools Reader (Preview)** on each referenced tool or an approved containing scope. |
| The model picker is empty or agent creation is denied | Assign **Microsoft Discovery Chat Model Reader (Preview)** on the selected model deployment or workspace. |
| A contributor can run an existing agent but can't view its tool or model | This behavior is expected for an agent created by a platform administrator. Add Tools Reader or Chat Model Reader only if the contributor needs to view those definitions or update the agent. |
| Discovery Engine runs without Chat Model Reader | This behavior is expected. Project Contributor authorizes Discovery Engine, and the platform `gpt-5-4` deployment doesn't require a separate user assignment. |
| Project artifacts' storage account is inaccessible | Assign **Storage Account Contributor** on the backing storage account or resource group. |
| Storage assets are visible, but files can't be opened | Assign **Storage Blob Data Reader** or **Storage Blob Data Contributor** at the backing Azure Storage scope. Also check the [client network and CORS requirements](how-to-debug-task-execution.md#cant-view-output-files). |
| A knowledge base isn't listed or can't be queried | Assign **Microsoft Discovery Bookshelf Index Data Reader - Preview** on the bookshelf or an inherited scope. |
| Agent creation worked before a linked-resource role was removed | Access is checked during agent create or update, not every run. Update or remove agents that reference the revoked resource. |
| A project-only user can't read Workbench session status | Some Workbench read and status operations require inherited workspace access because they don't include project context. |

## Storage container creation fails or stays in provisioning

If Azure reports that `.../storageAccounts/{name}` wasn't found, verify `storageAccountId` is the full ARM ID of an existing storage account. Create the storage account before the Discovery storage container.

For provisioning failures, inspect the storage container operation, backend access, identity permissions, and network path. Storage containers are resource-group-level resources, not workspace children; don't infer their provisioning requirements from workspace state alone. Use [Get a storage container](how-to-manage-storage-containers.md#get-a-storage-container) to inspect the resource. If the operation remains stuck and doesn't identify a correctable configuration problem, contact Microsoft Support before retrying or recreating it.

For blob permission failures, use [Storage access denied](#storage-access-denied).

## Tool deployment fails

| Symptom | Cause and resolution |
| --- | --- |
| `InvalidDefinitionContent` during creation | Revalidate the YAML against the [tool definition reference](how-to-create-tool-definition.md), then convert it to JSON again. |
| Environment variables aren't visible in the container | Confirm the uploaded file is a flat `{ "KEY": "value" }` JSON object, then recreate the tool resource with that file. |
| `RoleAssignmentNotFound` during creation | Assign **Contributor** or **Microsoft Discovery Platform Administrator (Preview)** at resource group scope. |
| `ImagePullBackOff` during a tool run | Follow the [container image and identity checks](#container-image-pull-failures). |

See [Deploy a tool to Microsoft Discovery](how-to-deploy-tool-to-discovery.md) for the creation workflow.

## Shared sessions or tasks don't make progress

| Symptom | Where to start |
| --- | --- |
| Tasks stay in New status | Check the [Discovery Engine and task dependencies](how-to-debug-task-execution.md#tasks-stuck-in-new-status). |
| Tasks finish without useful results | Add specific, achievable validation requirements and set the task back to New. |
| The agent keeps retrying the same approach | Review [validation requirements and agent capability](how-to-debug-task-execution.md#tasks-cycling-between-executing-and-incomplete). |
| No tasks start after several minutes | Allow 2-3 minutes for startup, then confirm the project has at least one deployed agent. See [Cognition warmup](how-to-debug-task-execution.md#cognition-warmup-takes-a-long-time). |
| Tool calls take a long time | Compare with [normal execution times](how-to-debug-task-execution.md#normal-execution-times), including the first-call cold start. |
| Logs show a task in `FLAGGED_HUMAN` state | Open the shared session in Discovery Studio and address the task that needs attention. |
| CogLoop is waiting for a running tool task | Inspect the associated job in the [supercomputer logs](how-to-query-supercomputer-logs.md). |
| A context-window saturation reset failed | Contact your Discovery administrator with the instance and error details. |

### Serialization errors block all cognition instances

An instance's working memory might not deserialize after a model-schema change, or instance data in Cosmos DB might be corrupted.

1. Run the [serialization-error query](how-to-query-cognitive-loop-logs.md#detect-serialization-errors-jsonexception) to confirm the pattern.
1. Inspect `Exception` for the JSON path and property that fails.
1. Escalate to the service team with the instance ID and exception details.

### Tasks aren't being validated

1. Run the [TaskValidationAgent lifecycle query](how-to-query-cognitive-loop-logs.md#view-taskvalidationagent-lifecycle) to check provisioning, upsert, and invocation.
1. Look for upsert failures or provisioning errors. If there are no entries, first rule out [missing or delayed logs](#application-logs-contain-no-data), then check whether the validation agent was provisioned.
1. Verify the required workspace model deployment using the [Discovery Engine startup checks](how-to-debug-task-execution.md#discovery-engine-wont-start).

### Circuit breaker events persist

Repeated model API failures can open a circuit breaker and temporarily pause CogLoop requests. Events normally clear after the cooldown. Use the [circuit-breaker query](how-to-query-cognitive-loop-logs.md#detect-circuit-breaker-events) to inspect `BrokenCircuitException`. If the events persist, contact Microsoft Support.

## Resources or tool outputs aren't visible

For files that exist but return access errors, use [Can't view output files](how-to-debug-task-execution.md#cant-view-output-files) to check the user's network path, CORS, and storage permissions.

### A resource doesn't appear in the conversation

1. Call `GetResourceContext` to confirm that the resource URI exists in conversation context.
1. Check whether it is marked as not shared. If so, the agent hasn't called `ShareResource`.
1. Call `PreviewResource` on the URI to confirm it contains content.
1. If the description is missing, verify `UpdateResourceDetails` was called before `ShareResource`.
1. If the resource is still absent, use Azure Storage Explorer to check whether the file exists under `discoveryOutputs/{projectName}/{investigationName}/{conversationGuid}/`.

### Tool outputs don't appear in GetResourceContext

1. Confirm the tool's output directory is listed in `outputMounts`.
1. Verify the tool succeeded by checking conversation history for errors.
1. Confirm each output mount is an absolute **directory** path, not a file path.

See [Configure output mounts](how-to-data-handling-with-tools-agents.md#capture-tool-outputs-by-using-output-mounts).

### Agent resource calls look incorrect in logs

Agents reason iteratively, so an unsuccessful call followed by a corrected call doesn't necessarily require intervention.

| Log pattern | Interpretation |
| --- | --- |
| `PreviewResource` returns "resource not found" | The output might not exist yet, or the URI is wrong. The agent can refresh `GetResourceContext` and retry with the correct URI. |
| Repeated `GetResourceContext` calls | The agent is refreshing the resource list after tool execution. |
| `ShareResource` returns "already shared" | The resource is already visible; the tool returns a success confirmation. |
| `UpdateResourceDetails` follows `ShareResource` | The description update doesn't retroactively change the storage asset that was already created. |

Intervene if the agent repeats the same failing call without progress, not merely because it makes a mistake and then self-corrects.

## Application logs contain no data

First, confirm you're querying the [Log Analytics workspace for the affected resource](how-to-access-resource-logs.md), not a different managed resource group. Expand the time range to the last 24 hours and allow for ingestion latency. Logs usually arrive within seconds, but ingestion can take up to five minutes.

If the resource has no relevant activity, generate logs by running an appropriate operation:

| Component | Table or query guide | Operation that generates logs |
| --- | --- | --- |
| Workspace | [DiscoveryLogs_CL](how-to-query-workspace-logs.md) | Run a shared session. |
| Bookshelf queries | [DiscoveryLogs_CL](how-to-query-bookshelf-logs.md) | Run a knowledge base query in Discovery Studio. |
| Bookshelf indexing | [DiscoveryBookshelfLogs_CL](how-to-query-bookshelf-indexing-logs.md) | Create or reindex a knowledge base. |
| Cognition loop | [DiscoveryCogLoopLogs_CL](how-to-query-cognitive-loop-logs.md) | Run a shared session with Discovery Engine. |
| Supercomputer | [Supercomputer log tables](how-to-query-supercomputer-logs.md) | Run a shared session or indexing job that uses compute. |

## Log queries time out or run slowly

Narrow the time range and filter before aggregating. For cognition logs, filter by `InstanceId`, `LogLevel`, or `Message`. Use `take` or `limit` to restrict the result set, or `summarize` when you need aggregates rather than raw rows.

## Activity log entries are missing or show Failed

If entries are missing:

1. Extend the time range to cover the operation. Activity logs retain up to 90 days.
1. Verify the resource group filter contains the resource, or remove the filter.
1. Confirm the operation changed the resource. Read-only HTTP GET requests don't appear in the Activity Log.

For a failed entry, inspect its **Properties** in the Azure portal or query the error details:

```kql
AzureActivity
| where ResourceProviderValue == "MICROSOFT.DISCOVERY"
| where ActivityStatusValue == "Failure"
| extend ErrorCode = tostring(parse_json(Properties).statusCode)
| extend ErrorMessage = tostring(parse_json(Properties).statusMessage)
| project TimeGenerated, OperationNameValue, Caller, ErrorCode, ErrorMessage
| order by TimeGenerated desc
```

See [View activity logs](how-to-view-activity-logs.md) for access and export instructions.

## Advanced troubleshooting and data collection

If you [create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request), collect the following information so support can investigate quickly:

- For ARM failures, the correlation ID and deployment operation list; for application failures, the response, timestamp, and available request, conversation, or run identifiers.
- The Activity Log entries and relevant supercomputer, workspace, or bookshelf logs.
- The role assignments on the deploying identity or project managed identity.
- The region, API version, and Toolbox or template version.
- For networking issues, the `nslookup` output from inside the virtual network, the private endpoint and DNS configuration, and the network security group rules.

## Related content

- [Service architecture for Microsoft Discovery](overview-service-architecture.md)
- [Known issues for Microsoft Discovery](known-issues.md)
- [Network security for Microsoft Discovery](concept-network-security.md)
- [Bookshelf knowledge bases](concept-bookshelf-knowledge-bases.md)
