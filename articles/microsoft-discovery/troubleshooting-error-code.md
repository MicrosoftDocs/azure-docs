---
title: Microsoft Discovery error codes
description: "Reference of common Microsoft Discovery error codes for deployment, workspace, supercomputer, bookshelf, and tool operations, with resolution guidance."
author: yousefi
ms.author: yousefi
ms.service: azure
ms.topic: error-reference #Don't change
ms.date: 11/10/2026

#customer intent: As a Discovery platform administrator or developer, I want a list of Microsoft Discovery error codes and their resolutions so that I can quickly diagnose and fix failed operations.

---

# Microsoft Discovery error codes

Use these tables to look up error codes and messages that Microsoft Discovery returns during deployment, workspace and supercomputer operations, bookshelf and knowledge base creation, and tool and agent runs. The **Details** column summarizes the cause and resolution, and links to a related how-to article when one applies.

For issues that might not return a unique error code, see [Known issues for Microsoft Discovery](known-issues.md).

The following general checks resolve most errors before you consult a specific code:

- **Capture the appropriate identifiers.** For ARM operations, use the correlation ID and deployment operation history. For data-plane requests and tool runs, collect the response, timestamp, and available request, conversation, or run identifiers for application logs. Don't assume an ARM correlation ID traces every application request. See [Capture the correlation ID and read the operation history](troubleshoot-microsoft-discovery.md#capture-the-correlation-id-and-read-the-operation-history).
- **Check `provisioningState`.** `Succeeded` means the operation completed, `Accepted` usually means the operation is still in progress, and `Failed` means you must inspect the operation history. Some resource types must be deleted and recreated after they enter a terminal `Failed` state.
- **Verify the deploying identity's roles.** Discovery requires data-plane, storage, network-perimeter, and Foundry permissions in addition to control-plane rights. Subscription **Owner** alone isn't sufficient. See [Role assignments for Microsoft Discovery](concept-role-assignments.md).
- **Confirm region and API version.** Deploy only to a supported region and use the API version that ships with the current Toolbox or [infrastructure quickstart](quickstart-infrastructure.md).

## REST API response errors

Control-plane Azure Resource Manager requests and workspace data-plane job requests can return the following HTTP errors. Inspect the response body and the correlation ID before retrying.

| HTTP status | API or error code | Resolution |
| --- | --- | --- |
| 400 | Control plane: `InvalidRequestContent` | Correct a malformed request body or missing required properties. See the [supercomputer request properties](how-to-manage-supercomputers-rest-api.md). |
| 401 | Data plane: Unauthorized | Refresh the access token. |
| 403 | Data plane: Forbidden | Verify the caller's RBAC permissions on the workspace or project. See [Project access troubleshooting](troubleshoot-microsoft-discovery.md#project-access-or-linked-resource-permissions-are-incorrect). |
| 404 | Control plane: `ResourceNotFound` | Verify the subscription, resource group, and resource ID identify an existing resource. |
| 404 | Data plane: Not Found | Check the project name, operation ID, and workspace URL. |
| 409 | Control plane: `Conflict` | Inspect resource state. For example, wait for the supercomputer to finish provisioning before creating a node pool. For a terminal failed state, use the [failed-resource guidance](troubleshoot-microsoft-discovery.md#a-discovery-resource-is-stuck-in-a-terminal-failed-state). |
| 429 | `TooManyRequests` | Apply backoff and retry. Honor the `Retry-After` header when returned. |
| 5xx | Data plane: Server Error | The response alone doesn't establish a transient failure. Check the operation outcome before retrying. Use bounded backoff only for safe, retryable operations, and contact Microsoft Support if the failure persists. See [Retry a transient failure](troubleshoot-microsoft-discovery.md#retry-a-transient-failure) and the [job API retry strategy](how-to-run-jobs-supercomputer-rest-api.md#retry-strategy). |

## Deployment and control-plane error codes

| Code | Error message | Details |
| --- | --- | --- |
| `AuthorizationFailed` | `The client '<principal>' doesn't have authorization to perform action 'Microsoft.Discovery/...' over scope '...'. If access was recently granted, refresh your credentials.` | The signed-in principal lacks a required Discovery platform role, or a recently granted role didn't propagate to the token. Assign **Microsoft Discovery Platform Administrator** and refresh credentials (sign out and back in) so the new role is in the token. See [Role assignments for Microsoft Discovery](concept-role-assignments.md). |
| `InvalidResourceType` | `Microsoft.Discovery is registered, but the provider metadata doesn't expose the 'supercomputers' or 'storageContainers' resource types. Direct ARM requests return InvalidResourceType for API version <version>.` | The request uses an unsupported API version or region, or the provider isn't fully registered. Use the API version and Toolbox or [quickstart](quickstart-infrastructure.md) from the current release, deploy to a supported region, and re-register the provider. See [Resource provider registration](how-to-register-resource-providers.md). |
| `DeploymentFailed` | `The resource operation completed with terminal provisioning state 'Failed'.` | A backing operation failed. Read the deployment operation history by using the correlation ID to find the first internally failing operation, resolve its root cause (often a missing role, a network feature, or a subnet or quota limit), then retry without deleting partially created resources where possible. See [Get operation correlation ID from Activity Log](how-to-get-correlation-id.md). |
| `ResourceDeploymentFailure` | `The resource provision operation didn't complete successfully.` | A dependent resource failed to provision. Identify the failing child operation from the operation history and correct the underlying cause. If the resource remains in a terminal `Failed` state and can't be retried, delete and recreate only the failed resource. |
| `InternalServerError` | `The server encountered an internal error. Please retry the request.` | The code doesn't establish a cause or a customer-run repair. Inspect the ARM operation history and resource state before a safe, bounded retry. If it persists, capture the response, timestamp, and correlation ID for Microsoft Support. For node pool deletion failures, use [supported recovery guidance](troubleshoot-microsoft-discovery.md#a-node-pool-fails-to-delete), not a direct backing-cluster update. |
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
| `NodeNotReady` | `Tool run failed: node became not ready.` | Inspect node health and job events, verify the intended `nodePoolId`, and use a supported recovery procedure with your administrator or Microsoft Support. Don't update node images or recreate backing AKS resources directly. See [Unexpected job termination](troubleshoot-microsoft-discovery.md#supercomputer-jobs-terminate-unexpectedly). |
| `JobTerminated` | `Supercomputer job terminated before completion.` | Check job and node events to identify the interruption; the error alone doesn't establish an AKS upgrade as the cause. Verify the intended node pool and use supported recovery for unhealthy nodes. See [Unexpected job termination](troubleshoot-microsoft-discovery.md#supercomputer-jobs-terminate-unexpectedly) and [AKS upgrade protection and limitations](concept-supercomputer-aks-upgrades.md#how-microsoft-discovery-protects-running-tools). |

## Bookshelf and knowledge base error codes

| Code | Error message | Details |
| --- | --- | --- |
| `ERR_INCOMPLETE_CHUNKED_ENCODING` | `PATCH .../knowledgeBases/<name>/versions/<version> — 400 (Bad Request). "Failed to create knowledge base."` | Inspect the response and logs; the browser error alone doesn't identify the cause. For the classic `2026-02-01-preview` version endpoint only, `versionName` permits 1-24 ASCII letters, digits, or hyphens (`1` is valid; `1.0` isn't). Check names against the API or Studio constraints and confirm the bookshelf's `provisioningState` is `Succeeded`. See [Knowledge base validation troubleshooting](troubleshoot-microsoft-discovery.md#knowledge-base-creation-fails-validation). |
| `ResourceCreationValidateFailed` | `Bookshelf creation validation failed (gateway timeout).` | A transient backend timeout during bookshelf creation. Retry, and ensure you're on a platform release with create-resiliency fixes. Confirm sufficient embedding and retrieval model quota in the region before retrying. See [Query bookshelf logs](how-to-query-bookshelf-logs.md). |
| `IndexingFailed` | `Knowledge base indexing failed.` | Indexing can fail on very large single documents or from a transient database (SQL) login timeout. Check the indexing logs for the affected document, split very large PDFs, and ensure you're on a release with ingest improvements. If a large document isn't reflected in answers even though indexing reported success, suspect silent truncation and inspect the indexing logs. See [Query bookshelf indexing logs](how-to-query-bookshelf-indexing-logs.md). |

## Tool and agent error codes

| Code | Error message | Details |
| --- | --- | --- |
| `HTTP 500` (Foundry) | `Project deployment failure: 500 error creating agent in Foundry.` | The response alone doesn't identify a cause. Check the project identity's Foundry roles and, when applicable, bring-your-own Cosmos DB connectivity and DNS. If the error persists or a failed project can't be deleted through Discovery, contact Microsoft Support rather than modifying backing managed resources. See [Project or agent creation troubleshooting](troubleshoot-microsoft-discovery.md#project-or-agent-creation-fails-with-a-500-error). |
| `InvalidMessageId` | `Tool execution failed due to an invalid message id.` | An invalid or mismatched message identifier that the agent passes to the tool prevents the tool from running. Ensure you're on a release that includes the message ID fix and diagnostic logging. Apply any recommended prompt-level improvements, and collect the agent, workflow, and tool definitions to reproduce the issue. See [Debug task execution](how-to-debug-task-execution.md). |
