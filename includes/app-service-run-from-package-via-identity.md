---
author: mattchenderson
ms.service: app-service
ms.topic: include
ms.date: 06/11/2021
ms.author: mahender
ms.subservice: web-apps
---

Azure Blob Storage can be configured to [authorize requests with Azure AD](../articles/storage/blobs/authorize-access-azure-active-directory.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json). This means that instead of generating a SAS key with an expiration, you can instead rely on the application's [managed identity](../articles/app-service/overview-managed-identity.md). By default, the app's system-assigned identity will be used. If you wish to specify a user-assigned identity, you can set the `WEBSITE_RUN_FROM_PACKAGE_BLOB_MI_RESOURCE_ID` app setting to the resource ID of that identity. The setting can also accept "SystemAssigned" as a value, although this is the same as omitting the setting altogether.

To enable the package to be fetched using the identity:

1. Ensure that the blob is [configured for private access](../articles/storage/blobs/anonymous-read-access-configure.md#set-the-anonymous-access-level-for-a-container).

1. Grant the identity the [Storage Blob Data Reader](../articles/role-based-access-control/built-in-roles.md#storage-blob-data-reader) role with scope over the package blob. See [Assign an Azure role for access to blob data](../articles/storage/blobs/assign-azure-role-data-access.md) for details on creating the role assignment.

1. Set the `WEBSITE_RUN_FROM_PACKAGE` application setting to the blob URL of the package. This will likely be of the form "https://{storage-account-name}.blob.core.windows.net/{container-name}/{path-to-package}" or similar.