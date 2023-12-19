---
title: How to configure Azure Functions with a virtual network
description: Article that shows you how to perform certain virtual networking tasks for Azure Functions.
ms.topic: how-to
ms.date: 12/19/2023
ms.custom: template-how-to
---

# How to configure Azure Functions with a virtual network

This article shows you how to perform tasks related to configuring your function app to connect to and run on a virtual network. For an in-depth tutorial on how to secure your storage account, refer to the [Connect to a Virtual Network tutorial](functions-create-vnet.md). To learn more about Azure Functions and networking, see [Azure Functions networking options](functions-networking-options.md).

## Restrict your storage account to a virtual network 

When you create a function app, you either create a new storage account or link to an existing storage account. During function app creation, you can secure a new storage account behind a virtual network and integrate the function app with this network. At this time, you can't secure an existing storage account being used by your function app in the same way. 

> [!NOTE]  
> Securing your storage account is supported for all tiers in both Dedicated (App Service) and Elastic Premium plans. Consumption plans currently don't support virtual networks.

For a list of all restrictions on storage accounts, see [Storage account requirements](storage-considerations.md#storage-account-requirements).

### During function app creation 

You can create a new function app along with a new storage account secured behind a virtual network. The following links show you how to create these resources by using either the Azure portal or by using deployment templates:  

# [Azure portal](#tab/portal)

Complete the following tutorial to create a new function app a secured storage account: [Use private endpoints to integrate Azure Functions with a virtual network](functions-create-vnet.md).

# [Deployment templates](#tab/templates)

Use Bicep or Azure Resource Manager (ARM) [quickstart templates](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/function-app-storage-private-endpoints) to create secured function app and storage account resources.

---

### Existing function app

When you have an existing function app, you can't directly secure the storage account currently being used by the app. You must instead swap-out the existing storage account for a new, secured storage account.

As a prerequisite, you need to enable virtual network integration for your function app.

1. Choose a function app with a storage account that doesn't have service endpoints or private endpoints enabled.

1. [Enable virtual network integration](./functions-networking-options.md#enable-virtual-network-integration) for your function app.

Set up a secured storage account for your function app: 

1. Create or configure a second storage account. This is going to be the secured storage account that your function app will use instead.

1. [Create a file share](../storage/files/storage-how-to-create-file-share.md#create-a-file-share) in the new storage account.

1. Secure the new storage account in one of the following ways:

    * [Create a private endpoint](../storage/common/storage-private-endpoints.md#creating-a-private-endpoint). When you set up private endpoint connections, create private endpoints for the `file` and `blob` subresources. For Durable Functions, you must also make `queue` and `table` subresources accessible through private endpoints. Double check that your function app has access to the virtual network containing the private endpoints. 

    * [Restrict traffic to specific subnets](../storage/common/storage-network-security.md#grant-access-from-a-virtual-network). Ensure that one of the allowed subnets is the one your function app is network integrated with. Double check that the subnet has a service endpoint to Microsoft.Storage.

1. Copy the file and blob content from the current storage account used by the function app to the newly secured storage account and file share. [AzCopy](../storage/common/storage-use-azcopy-blobs-copy) and [Azure Storage Explorer](https://techcommunity.microsoft.com/t5/azure-developer-community-blog/azure-tips-and-tricks-how-to-move-azure-storage-blobs-between/ba-p/3545304) are common methods. If you use Azure Storage Explorer, you may need to allow your client IP address into your storage account's firewall. 

1. Copy the connection string for this storage account. You need this string for later.

Now you're ready to configure your function app to communicate with your secured storage account:

1. [Enable content share routing](../app-service/configure-vnet-integration-routing#content-share) to have your function app communicate with your storage account through its virtual network. 

    * Navigate to the **Networking** tab of your function app. Under **Outbound traffic configuration**, select the subnet associated with your virtual network integration.

    * In the new page, check the box for **Content storage** under **Configuration routing**.

1. Update the **Application Settings** under the **Configuration** tab of your function app to the following:

    | Setting name | Value | Comment |
    |----|----|----|
    | `AzureWebJobsStorage`| Storage connection string | This is the connection string for a secured storage account. |
    | `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` |  Storage connection string | This is the connection string for a secured storage account. This setting is required for Consumption and Premium plan apps on both Windows and Linux. It's not required for Dedicated plan apps, which aren't dynamically scaled by Functions. |
    | `WEBSITE_CONTENTSHARE` | File share | The name of the file share created in the secured storage account where the project deployment files reside. This setting is required for Consumption and Premium plan apps on both Windows and Linux. It's not required for Dedicated plan apps, which aren't dynamically scaled by Functions. |

1. Select **Save** to save the application settings. Changing app settings causes the app to restart.  

After the function app restarts, it's now connected to a secured storage account.

## Next steps

> [!div class="nextstepaction"]
> [Azure Functions networking options](functions-networking-options.md)
