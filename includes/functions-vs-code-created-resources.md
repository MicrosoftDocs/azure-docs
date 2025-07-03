---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/20/2025
ms.author: glenga
---

+ A [resource group](../articles/azure-resource-manager/management/overview.md), which is a logical container for related resources.
+ A function app, which provides the environment for executing your function code. A function app lets you group functions as a logical unit for easier management, deployment, and sharing of resources within the same hosting plan.
+ An Azure App Service plan, which defines the underlying host for your function app.
+ A standard [Azure Storage account](../articles/storage/common/storage-account-create.md), which is used by the Functions host to maintain state and other information about your function app.
+ An Application Insights instance that's connected to the function app, and which tracks the use of your functions in the app.
+ A user-assigned managed identity that's added to the [Storage Blob Data Contributor](/azure/role-based-access-control/built-in-roles/storage#storage-blob-data-contributor) role in the new default host storage account.

