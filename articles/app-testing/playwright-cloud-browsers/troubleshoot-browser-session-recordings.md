---
title: Troubleshoot browser session recordings
titleSuffix: Playwright Workspaces
description: Learn how to resolve problems when you save and view browser session recordings in Playwright Workspaces, including error codes for configuration, recording start, upload, and viewing.
ms.service: azure-app-testing
ms.subservice: playwright-workspaces
ms.custom: playwright-workspaces
ms.topic: troubleshooting-general
ms.date: 11/18/2026
author: Abhinav-Premsekhar
ms.author: apremsekhar
---

# Troubleshoot browser session recordings

This article helps you resolve problems when you [save and view browser session recordings](./capabilities/session-recording.md) in Playwright Workspaces. It covers errors that occur when you configure observability on a workspace, when a recording starts, while a recording is saved, and when you view a recording in the Azure portal.

## Check the basics first

Most recording problems come from the setup of the workspace, the storage account, or the managed identity. Before you look up a specific error code, check that:

- **Observability is turned on.** In your Playwright workspace, select **Settings** > **Capabilities**, and make sure **Observability** is on and a **Storage account** is selected.
- **The managed identity exists and is set up correctly.** If you use a system-assigned identity, turn it on for the workspace in **Settings** > **Identity**. If you use a user-assigned identity, associate it with the workspace.
- **The managed identity has access to the storage account.** The identity that you selected on the **Capabilities** page needs the **Storage Blob Data Contributor** role on the linked storage account. This role also lets the identity generate the user delegation key that Playwright Workspaces uses to upload artifacts.
- **The storage account is reachable.** The storage account must allow network access through its public endpoint. Storage accounts that allow access only through private endpoints aren't currently supported for storing artifacts.
- **Your MCP client asks for recordings.** The remote MCP server records a session only when your MCP client sends the `x-ms-enable-sessionartifacts` header with the value `Enabled`.

> [!NOTE]
> Session recording, reporting, and browser profiles use the same storage account and managed identity. A problem with the storage account or identity can affect all three features.

## Errors when you configure observability

These errors occur when you create or update a workspace and the observability settings aren't valid. For example, these errors occur when you deploy the workspace by using an Azure Resource Manager (ARM template), Bicep, or the REST API. The Azure portal shows them as a deployment or save failure.


| Error code | Message | Action |
|---|---|---|
| `InvalidEnablementStatus` | The sessionArtifacts value must be `Enabled` or `Disabled`. | Set `sessionArtifacts` to `Enabled` or `Disabled`. |
| `StorageUriRequired` | `storageUri` is required when `sessionArtifacts` is enabled. | Provide the URI of the storage account that stores your artifacts. In the Azure portal, select a **Storage account** on the **Capabilities** page. |
| `InvalidStorageUri` | The `storageUri` provided is invalid. Use an HTTPS endpoint for Azure Blob Storage or Azure Data Lake Storage. Query parameters, fragments, and embedded user information aren't supported. | Use the HTTPS Blob Storage or Data Lake Storage endpoint of the storage account, for example `https://<storage-account-name>.blob.core.windows.net`. Don't include a SAS token, query string, fragment, or user name in the URI. |
| `ManagedIdentityRequired` | `storageIdentity` is required when `sessionArtifacts` is enabled. | Specify the managed identity that Playwright Workspaces uses to access the storage account. In the Azure portal, select an **Identity type** on the **Capabilities** page. |
| `ManagedIdentityNotAllowed` | `storageIdentity` must be omitted when `sessionArtifacts` is disabled. | Remove `storageIdentity` from the request, or set `sessionArtifacts` to `Enabled`. |
| `InvalidManagedIdentityType` | `storageIdentity.type` must be `SystemAssigned` or `UserAssigned`. | Set `storageIdentity.type` to `SystemAssigned` or `UserAssigned`. |
| `ManagedIdentityResourceIdRequired` | `storageIdentity.resourceId` is required when `storageIdentity.type` is `UserAssigned`. | Provide the resource ID of the user-assigned managed identity. |
| `ManagedIdentityResourceIdNotAllowed` | `storageIdentity.resourceId` must be omitted when `storageIdentity.type` is `SystemAssigned`. | Remove `storageIdentity.resourceId` when you use the system-assigned identity. |
| `SystemAssignedManagedIdentityNotEnabled` | The workspace must have a system-assigned managed identity when `storageIdentity.type` is `SystemAssigned`. | Turn on the system-assigned identity for the workspace in **Settings** > **Identity**, and then try again. Or use a user-assigned identity. |
| `UserAssignedManagedIdentityNotAssociated` | User-assigned identity `{resourceId}` isn't associated with the workspace. | Add the user-assigned identity to the workspace in **Settings** > **Identity**, and then try again. Or select an identity that's already associated with the workspace. |

## Errors when a recording starts

These errors occur when the remote MCP server creates a browser session and tries to start the recording. The recording doesn't start, so no artifacts are saved for that session.


| Error code | Message | Action |
|---|---|---|
| `WorkspaceRecordingNotEnabled` | Recording couldn't be started because recording isn't enabled for the workspace. Enable recording in the workspace settings, then create a new browser session. | Turn on **Observability** in **Settings** > **Capabilities**, and then start a new browser session. |
| `RecordingWorkspaceMetadataRetrievalFailed` | Recording couldn't be started because the workspace recording configuration couldn't be retrieved. Try again. | This error is usually temporary. Start a new browser session. If the error continues, contact support. |
| `RecordingConfigurationInvalid` | Recording couldn't be started because the workspace recording configuration is incomplete. Verify the linked storage account and managed identity. | On the **Capabilities** page, make sure a storage account and an identity type are selected. If the storage account was deleted or moved, select another one. |
| `RecordingManagedIdentityTokenAcquisitionFailed` | Recording couldn't be started because a token couldn't be acquired for the workspace managed identity. Verify the identity configuration and try again. | Make sure the managed identity still exists and is still associated with the workspace. If you deleted a user-assigned identity or turned off the system-assigned identity, set up the identity again and select it on the **Capabilities** page. |
| `RecordingContainerCreationFailed` | Recording couldn't be started because the session container couldn't be created. Verify that the managed identity has Storage Blob Data Contributor access and try again. | Assign the **Storage Blob Data Contributor** role on the storage account to the managed identity. Also check that the storage account's network settings allow access through its public endpoint. |
| `RecordingContainerNameConflict` | Recording couldn't be started because the generated session container name already exists. Start a new session and try again. | Start a new browser session. |
| `RecordingSasCreationFailed` | Recording couldn't be started because upload access couldn't be created for the session container. Verify that the managed identity can generate a user delegation key and try again. | Assign the **Storage Blob Data Contributor** role on the storage account to the managed identity. This role includes permission to generate a user delegation key. Make sure that the storage account allows Microsoft Entra authorization. |
| `SessionArtifactsRequireMcpProtocol` | Session artifacts can be enabled only for MCP browser sessions. | Session recording is available only for sessions that you create through the remote MCP server. Remove the `x-ms-enable-sessionartifacts` header from clients that don't connect through the remote MCP server. |

## Errors while a recording is saved

These errors occur after the recording starts, while Playwright Workspaces captures and uploads artifacts. The recording might be incomplete or missing.

| Error code | Message | Action |
|---|---|---|
| `SessionArtifactsSizeLimitReached` | Recording was stopped because the session artifact size limit of 1 GB was reached. | The artifacts of a single session can't exceed 1 GB. The browser session continues, but the rest of the session isn't recorded. Split long tasks into shorter sessions. |
| `ArtifactUploadFailed` | Recording couldn't be completed because the trace archive couldn't be uploaded. Verify the workspace storage access and try again. | Check that the managed identity still has the **Storage Blob Data Contributor** role, that the storage account still exists, and that its network settings allow access. Then run the session again. |
| `SessionArtifactsAuthorizationFailed` | Recording couldn't be completed because access to workspace storage was denied. Verify the workspace storage access and try again. | Check the role assignment for the managed identity on the storage account, and check the storage account's network and firewall settings. Then run the session again. |
| `BrowserConnectionClosed` | Recording couldn't be completed because the browser connection was lost. Try again. | The connection to the cloud browser ended before the recording was saved. Run the session again. If the error continues, check the network connection between your MCP client and the remote MCP server. |
| `PostProcessingFailed` | Recording couldn't be completed because of an internal service error. Try again. | Run the session again. If the error continues, contact support. |
| `PostProcessingTimeout` | Recording couldn't be completed because of an internal service error. Try again. | Run the session again. If the error continues, contact support. |


## Common problems

### The session doesn't appear as recorded

The session is listed in the **Browser activity log**, but it has no recording.

- Ensure your MCP client sends the `x-ms-enable-sessionartifacts` header with the value `Enabled`. Sessions from clients that don't send the header aren't recorded.
- After you add the header, restart the MCP server connection in your client so that the new header takes effect.
- Ensure that **Observability** is turned on in **Settings** > **Capabilities**.
- If the agent's response or the session shows an error code, find it in the tables in this article.

### Recordings stopped working after a change to the workspace or storage account

Recording worked before, but new sessions aren't recorded or fail with an error.

- If someone deleted or replaced the managed identity, removed its role assignment, or deleted the storage account, set up the storage account and identity again on the **Capabilities** page.
- If someone changed the storage account's network settings to allow only private endpoints, or added firewall rules, allow access through the public endpoint.
- Role assignments can take a few minutes to take effect. Wait a few minutes, and then run the session again.

### The portal didn't assign permissions to the managed identity

You selected **Assign permissions to the managed identities on my behalf**, but recordings fail with `RecordingContainerCreationFailed`, `RecordingSasCreationFailed`, or `SessionArtifactsAuthorizationFailed`.

- The Azure portal can assign the role only if you have permission to assign roles on the storage account, such as the **Owner**, **User Access Administrator**, or **Role Based Access Control Administrator** role.
- If you don't have one of these roles, ask someone who does to assign the **Storage Blob Data Contributor** role on the storage account to the managed identity. For the steps, see [Assign storage permissions to the managed identity](./capabilities/session-recording.md#assign-storage-permissions-to-the-managed-identity).

### You can't open a recording in the Azure portal

The session has a recording, but the session playback doesn't load, or you see an authorization error.

- Ensure you have the **Storage Blob Data Reader** role on the linked storage account.
- Ensure the storage account allows cross-origin requests from Trace Viewer. In the storage account, select **Settings** > **Resource sharing (CORS)**, and on the **Blob service** tab, allow the origin `https://trace.playwright.dev` with the `GET` and `OPTIONS` methods.
- Ensure your network can reach the storage account's public endpoint.

### The recording ends before the session ends

The recording covers only the first part of the session.

- If the session hit the 1-GB size limit, you see `SessionArtifactsSizeLimitReached`. Split long tasks into shorter sessions.
- If the browser connection was lost, you see `BrowserConnectionClosed`. Run the session again.

## Get help

If the steps in this article don't resolve the problem, open a support request. In your Playwright workspace, select **Help** > **Support + Troubleshooting**. Include the session ID from the **Browser activity log** and the error code that you received.

## Related content

- [Save and view browser session recordings](./capabilities/session-recording.md)
- [Troubleshoot the remote MCP server](troubleshoot-remote-mcp-server.md)
- [Assign Azure roles by using the Azure portal](/azure/role-based-access-control/role-assignments-portal)
- [Configure Azure Storage firewalls and virtual networks](/azure/storage/common/storage-network-security)
