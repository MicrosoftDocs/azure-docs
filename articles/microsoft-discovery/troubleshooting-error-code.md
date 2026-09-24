---
title: Microsoft Discovery error codes
description: "Reference of common Microsoft Discovery error codes for deployment, workspace, supercomputer, bookshelf, and tool operations, with resolution guidance."
author: yousefi
ms.author: yousefi
ms.service: azure
ms.topic: error-reference #Don't change
ms.date: 09/24/2026

#customer intent: As a Discovery platform administrator or developer, I want a list of Microsoft Discovery error codes and their resolutions so that I can quickly diagnose and fix failed operations.

---

# Microsoft Discovery error codes

Use these tables to look up error codes and messages that Microsoft Discovery returns during deployment, workspace and supercomputer operations, bookshelf and knowledge base creation, and tool and agent runs. The **Details** column summarizes the cause and resolution, and links to a related how-to article when one applies.

For issues that might not return a unique error code, see [Known issues for Microsoft Discovery](known-issues.md).

The following general checks resolve most errors before you consult a specific code:

- **Capture the correlation ID** from the failed operation and use it to read control-plane and backend logs. Many failures are only fully explained in the operation history, not in the summary error. See [Get operation correlation ID from Activity Log](how-to-get-correlation-id.md).
- **Check `provisioningState`.** `Succeeded` means the operation completed, `Accepted` usually means the operation is still in progress, and `Failed` means you must inspect the operation history. Some resource types must be deleted and recreated after they enter a terminal `Failed` state.
- **Verify the deploying identity's roles.** Discovery requires data-plane, storage, network-perimeter, and Foundry permissions in addition to control-plane rights. Subscription **Owner** alone isn't sufficient. See [Role assignments for Microsoft Discovery](concept-role-assignments.md).
- **Confirm region and API version.** Deploy only to a supported region and use the API version that ships with the current Toolbox or [infrastructure quickstart](quickstart-infrastructure.md).

## Deployment and control-plane error codes

| Code | Error message | Details |
| --- | --- | --- |
| `AuthorizationFailed` | `The client '<principal>' doesn't have authorization to perform action 'Microsoft.Discovery/...' over scope '...'. If access was recently granted, refresh your credentials.` | The signed-in principal lacks a required Discovery platform role, or a recently granted role didn't propagate to the token. Assign **Microsoft Discovery Platform Administrator** and refresh credentials (sign out and back in) so the new role is in the token. See [Role assignments for Microsoft Discovery](concept-role-assignments.md). |
| `InvalidResourceType` | `Microsoft.Discovery is registered, but the provider metadata doesn't expose the 'supercomputers' or 'storageContainers' resource types. Direct ARM requests return InvalidResourceType for API version <version>.` | The request uses an unsupported API version or region, or the provider isn't fully registered. Use the API version and Toolbox or [quickstart](quickstart-infrastructure.md) from the current release, deploy to a supported region, and re-register the provider. See [Resource provider registration](concept-resource-provider-registration.md). |
| `DeploymentFailed` | `The resource operation completed with terminal provisioning state 'Failed'.` | A backing operation failed. Read the deployment operation history by using the correlation ID to find the first internally failing operation, resolve its root cause (often a missing role, a network feature, or a subnet or quota limit), then retry without deleting partially created resources where possible. See [Get operation correlation ID from Activity Log](how-to-get-correlation-id.md). |
| `ResourceDeploymentFailure` | `The resource provision operation didn't complete successfully.` | A dependent resource failed to provision. Identify the failing child operation from the operation history and correct the underlying cause. If the resource remains in a terminal `Failed` state and can't be retried, delete and recreate only the failed resource. |
| `InternalServerError` | `The server encountered an internal error. Please retry the request.` | A transient backend error during create or update. Retry the operation. If it persists, capture the correlation ID and [create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request). |
| `Conflict` | `The resource is in a 'Failed' state and can't be updated.` | A resource in terminal `Failed` state can't be updated in place. Delete only the failed resource and recreate it with a new name and the correct prerequisites. See [Manage Microsoft Discovery workspaces](how-to-manage-workspaces.md) and [Delete Microsoft Discovery resources](how-to-delete-discovery-resources.md). |
| `RequestDisallowedByPolicy` | `Create or update public IP failed. Resource was disallowed by policy.` | An Azure Policy assignment denies a public IP required by the selected supercomputer network configuration. Use a supported `UserDefinedRouting` configuration that doesn't provision a managed public IP, or ask your policy administrator whether an exemption is permitted. See [Known issues for Microsoft Discovery](known-issues.md#azure-policy-blocks-public-ip-creation-during-supercomputer-deployment). |

## Workspace error codes

| Code | Error message | Details |
| --- | --- | --- |
| `InvalidRequest` | `Resources not allowed: storage '<name>' isn't allowlisted in workspace '<workspace>'.` | The storage account exists but isn't associated with the workspace, so tool runs that reference it are rejected. Associate the storage account with the workspace, then rerun the operation. See [Manage Microsoft Discovery workspaces](how-to-manage-workspaces.md). |
| `InvalidRequest` | `Resources not allowed: supercomputer '<name>' isn't allowlisted in workspace '<workspace>'.` | The supercomputer exists but isn't associated with the workspace. Associate the supercomputer with the workspace, then rerun the tool. See [Manage supercomputers](how-to-manage-supercomputers.md). |
| `Conflict` | `Workspace is in a terminal 'Failed' state; the operation conflicts with the current state.` | Delete only the stuck workspace (leave the resource group, storage, and supercomputer in place) and recreate it with a different name. To free a supercomputer bound to a stuck workspace, remove the supercomputer association from within the workspace instead of deleting the supercomputer. See [Manage Microsoft Discovery workspaces](how-to-manage-workspaces.md). |
| `QuotaExceeded` | `Workspace creation failed because the container environment quota is insufficient.` | The workspace's Azure Container Apps environment requires enough quota to create. For the Enterprise SKU, ensure at least 80 cores of Azure Container Apps quota in the target region, then retry. See [Quota and reservations](concept-quota-reservation.md). |

## Supercomputer error codes

| Code | Error message | Details |
| --- | --- | --- |
| `BadRequest` | `UPGRADE FAILED: pre-upgrade hooks failed: Hook pre-upgrade network-operator/templates/keep-ncp-hook.yaml failed: failed calling webhook "mjob.kb.io": ... code 504: 504 Gateway Timeout` | A transient failure during the internal Helm install of the supercomputer: the `kueue-webhook-service` in the `kueue-system` namespace returns a 504 to the network-operator pre-upgrade hook. Retry supercomputer creation and ensure you're on the latest platform release. Inspect the webhook pod if it persists. See [Query supercomputer logs](how-to-query-supercomputer-logs.md). |
| `NodeNotReady` | `Tool run failed: node became not ready.` | A node or GPU driver health issue on the node pool. Ensure the latest node image, recreate the affected node pool if it stays unhealthy, and retry the run. Set the correct node pool explicitly in the project preference rather than relying on automatic selection. See [Query supercomputer logs](how-to-query-supercomputer-logs.md). |
| `JobTerminated` | `Supercomputer job terminated before completion.` | Long-running jobs can be evicted when AKS performs node OS upgrades. Ensure you're on a release with job and node resiliency improvements, set the correct `nodePoolId` in the project preference, and review the run in the supercomputer logs. See [Debug task execution](how-to-debug-task-execution.md). |

## Bookshelf and knowledge base error codes

| Code | Error message | Details |
| --- | --- | --- |
| `ERR_INCOMPLETE_CHUNKED_ENCODING` | `PATCH .../knowledgeBases/<name>/versions/<version> — 400 (Bad Request). "Failed to create knowledge base."` | The data plane rejects an invalid version string or bookshelf name. Use a simple integer version number (for example, `1`) instead of a longer string such as `1.0`, and ensure the bookshelf name uses lowercase letters and dashes only. See [Index a bookshelf knowledge base](how-to-index-bookshelf-knowledgebase.md). |
| `ResourceCreationValidateFailed` | `Bookshelf creation validation failed (gateway timeout).` | A transient backend timeout during bookshelf creation. Retry, and ensure you're on a platform release with create-resiliency fixes. Confirm sufficient embedding and retrieval model quota in the region before retrying. See [Query bookshelf logs](how-to-query-bookshelf-logs.md). |
| `IndexingFailed` | `Knowledge base indexing failed.` | Indexing can fail on very large single documents or from a transient database (SQL) login timeout. Check the indexing logs for the affected document, split very large PDFs, and ensure you're on a release with ingest improvements. If a large document isn't reflected in answers even though indexing reported success, suspect silent truncation and inspect the indexing logs. See [Query bookshelf indexing logs](how-to-query-bookshelf-indexing-logs.md). |

## Tool and agent error codes

| Code | Error message | Details |
| --- | --- | --- |
| `HTTP 500` (Foundry) | `Project deployment failure: 500 error creating agent in Foundry.` | Agent creation in the backing Foundry resource fails. Verify the **Foundry User** role is assigned to the project managed identity, and validate bring-your-own Cosmos DB private endpoint connectivity and DNS. Project deletion might be blocked for projects already in `Failed` state. Use platform cleanup actions, and then redeploy. See [Agent creation](how-to-agent-creation.md). |
| `InvalidMessageId` | `Tool execution failed due to an invalid message id.` | An invalid or mismatched message identifier that the agent passes to the tool prevents the tool from running. Ensure you're on a release that includes the message ID fix and diagnostic logging. Apply any recommended prompt-level improvements, and collect the agent, workflow, and tool definitions to reproduce the issue. See [Debug task execution](how-to-debug-task-execution.md). |
