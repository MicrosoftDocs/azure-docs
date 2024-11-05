---
author: mattchenderson
ms.author: mahender
ms.service: azure-app-service
ms.subservice: web-apps
ms.topic: include
ms.date: 06/28/2024
---

You can configure Azure Blob Storage to [authorize requests with Microsoft Entra ID](/azure/storage/blobs/authorize-access-azure-active-directory?toc=%2fazure%2fstorage%2fblobs%2ftoc.json). This configuration means that instead of generating a SAS key with an expiration, you can instead rely on the application's [managed identity](/azure/app-service/overview-managed-identity). By default, the app's system-assigned identity is used. If you wish to specify a user-assigned identity, you can set the `WEBSITE_RUN_FROM_PACKAGE_BLOB_MI_RESOURCE_ID` app setting to the resource ID of that identity. The setting can also accept `SystemAssigned` as a value, which is equivalent to omitting the setting.

To enable the package to be fetched using the identity:

1. Ensure that the blob is [configured for private access](/azure/storage/blobs/anonymous-read-access-configure#set-the-anonymous-access-level-for-a-container).

1. Grant the identity the [Storage Blob Data Reader](/azure/role-based-access-control/built-in-roles#storage-blob-data-reader) role with scope over the package blob. See [Assign an Azure role for access to blob data](/azure/storage/blobs/assign-azure-role-data-access) for details on creating the role assignment.

1. Set the `WEBSITE_RUN_FROM_PACKAGE` application setting to the blob URL of the package. This URL is usually of the form `https://{storage-account-name}.blob.core.windows.net/{container-name}/{path-to-package}` or similar.
