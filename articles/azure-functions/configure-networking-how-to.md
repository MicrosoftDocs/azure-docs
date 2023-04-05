---
title: How to configure Azure Functions with a virtual network
description: Article that shows you how to perform certain virtual networking tasks for Azure Functions.
ms.topic: how-to
ms.date: 03/24/2023
ms.custom: template-how-to
---

# How to configure Azure Functions with a virtual network

This article shows you how to perform tasks related to configuring your function app to connect to and run on a virtual network. For an in-depth tutorial on how to secure your storage account, refer to the [Connect to a Virtual Network tutorial](functions-create-vnet.md). To learn more about Azure Functions and networking, see [Azure Functions networking options](functions-networking-options.md).

## Restrict your storage account to a virtual network 

When you create a function app, you must create or link to a general-purpose Azure Storage account that supports Blob, Queue, and Table storage. You can secure a new storage account behind a virtual network during account creation. At this time, you can't secure an existing storage account being used by your function app in the same way. 

> [!NOTE]  
> Securing your storage account is supported for all tiers in both Dedicated (App Service) and Elastic Premium plans. Consumption plans currently don't support virtual networks.

### During function app creation 

You can create a new function app along with a new storage account secured behind a virtual network. The following links show you how to create these resources by using either the Azure portal or by using deployment templates:  

# [Azure portal](#tab/portal)

Complete the following tutorial to create a new function app a secured storage account: [Use private endpoints to integrate Azure Functions with a virtual network](functions-create-vnet.md).

# [Deployment templates](#tab/templates)

Use Bicep or Azure Resource Manager (ARM) [quickstart templates](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/function-app-storage-private-endpoints) to create secured function app and storage account resources.

---

### Existing function app

When you have an existing function app, you can't secure the storage account currently being used by the app. You must instead swap-out the existing storage account for a new, secured storage account. 

To secure the storage for an existing function app: 

1. Choose a function app with a storage account that doesn't have service endpoints or private endpoints enabled.

1. [Enable virtual network integration](./functions-networking-options.md#enable-virtual-network-integration) for your function app.

1. Create or configure a second storage account. This is going to be the secured storage account that your function app uses instead.

1. [Create a file share](../storage/files/storage-how-to-create-file-share.md#create-a-file-share) in the new storage account.

1. Secure the new storage account in one of the following ways:

    * [Create a private endpoint](../storage/common/storage-private-endpoints.md#creating-a-private-endpoint). When using private endpoint connections, the storage account must have private endpoints for the `file` and `blob` subresources. For Durable Functions, you must also make `queue` and `table` subresources accessible through private endpoints.

    * [Enable a service endpoint from the virtual network](../storage/common/storage-network-security.md#grant-access-from-a-virtual-network). When using service endpoints, enable the subnet dedicated to your function apps for storage accounts on the firewall.

1. Copy the file and blob content from the current storage account used by the function app to the newly secured storage account and file share.

1. Copy the connection string for this storage account.

1. Update the **Application Settings** under **Configuration** for the function app to the following:

    | Setting name | Value | Comment |
    |----|----|----|
    | `AzureWebJobsStorage`| Storage connection string | This is the connection string for a secured storage account. |
    | `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` |  Storage connection string | This is the connection string for a secured storage account. |
    | `WEBSITE_CONTENTSHARE` | File share | The name of the file share created in the secured storage account where the project deployment files reside. |
    | `WEBSITE_CONTENTOVERVNET` | 1 | A value of 1 enables your function app to scale when you have your storage account restricted to a virtual network. You should enable this setting when restricting your storage account to a virtual network. |

1. Select **Save** to save the application settings. Changing app settings causes the app to restart.  

After the function app restarts, it's now connected to a secured storage account.

## Next steps

> [!div class="nextstepaction"]
> [Azure Functions networking options](functions-networking-options.md)
