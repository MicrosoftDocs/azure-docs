---
title: How to use a secured storage account with Azure Functions
description: Article that shows you how to use a secured storage account in a virtual network as the default storage account for a function app in Azure Functions.
ms.topic: how-to
ms.date: 05/06/2024
ms.custom: template-how-to, build-2024
---

# How to use a secured storage account with Azure Functions

This article shows you how to connect your function app to a secured storage account. For an in-depth tutorial on how to create your function app with inbound and outbound access restrictions, refer to the [Integrate with a virtual network](functions-create-vnet.md) tutorial. To learn more about Azure Functions and networking, see [Azure Functions networking options](functions-networking-options.md).

## Restrict your storage account to a virtual network 

When you create a function app, you either create a new storage account or link to an existing one. Currently, only [ARM template and Bicep deployments](functions-infrastructure-as-code.md#secured-deployments) support function app creation with an existing secured storage account. 

> [!NOTE]  
> Securing your storage account is supported for all tiers of the [Dedicated (App Service) plan](./dedicated-plan.md) and the [Elastic Premium plan](./functions-premium-plan.md), as well as in the [Flex Consumption plan](./flex-consumption-plan.md).  
> Consumption plans don't support virtual networks.

For a list of all restrictions on storage accounts, see [Storage account requirements](storage-considerations.md#storage-account-requirements).

[!INCLUDE [functions-flex-preview-note](../../includes/functions-flex-preview-note.md)]

## Secure storage during function app creation 

You can create a function app along with a new storage account secured behind a virtual network that is accessible via private endpoints. The following links show you how to create these resources by using either the Azure portal or by using deployment templates:  

### [Azure portal](#tab/portal)

Complete the following tutorial to create a new function app a secured storage account: [Use private endpoints to integrate Azure Functions with a virtual network](functions-create-vnet.md).

### [Deployment templates](#tab/templates)

Use Bicep files or Azure Resource Manager (ARM) templates to create a secured function app and storage account resources. When you create a secured storage account in an automated deployment, you must set the `vnetContentShareEnabled` site property, create the file share as part of your deployment, and set the `WEBSITE_CONTENTSHARE` app setting to the name of the file share. For more information, including links to example deployments, see [Secured deployments](functions-infrastructure-as-code.md#secured-deployments). 

---

## Secure storage for an existing function app

When you have an existing function app, you can't directly secure the storage account currently being used by the app. You must instead swap-out the existing storage account for a new, secured storage account.

### 1. Enable virtual network integration

As a prerequisite, you need to enable virtual network integration for your function app.

1. Choose a function app with a storage account that doesn't have service endpoints or private endpoints enabled.

1. [Enable virtual network integration](./functions-networking-options.md#enable-virtual-network-integration) for your function app.

### 2. Create a secured storage account 

Set up a secured storage account for your function app: 

1. [Create a second storage account](../storage/common/storage-account-create.md). This is going to be the secured storage account that your function app will use instead. You can also use an existing storage account not already being used by Functions.

1. Copy the connection string for this storage account. You need this string for later.

1. [Create a file share](../storage/files/storage-how-to-create-file-share.md#create-a-file-share) in the new storage account. Try to use the same name as the file share in the existing storage account. Otherwise, you'll need to copy the name of the new file share to configure an app setting later.

1. Secure the new storage account in one of the following ways:

    * [Create a private endpoint](../storage/common/storage-private-endpoints.md#creating-a-private-endpoint). When you set up private endpoint connections, create private endpoints for the `file` and `blob` subresources. For Durable Functions, you must also make `queue` and `table` subresources accessible through private endpoints. If you're using a custom or on-premises DNS server, make sure you [configure your DNS server](../storage/common/storage-private-endpoints.md#dns-changes-for-private-endpoints) to resolve to the new private endpoints. 

    * [Restrict traffic to specific subnets](../storage/common/storage-network-security.md#grant-access-from-a-virtual-network). Ensure that one of the allowed subnets is the one your function app is network integrated with. Double check that the subnet has a service endpoint to Microsoft.Storage.

1. Copy the file and blob content from the current storage account used by the function app to the newly secured storage account and file share. [AzCopy](../storage/common/storage-use-azcopy-blobs-copy.md) and [Azure Storage Explorer](https://techcommunity.microsoft.com/t5/azure-developer-community-blog/azure-tips-and-tricks-how-to-move-azure-storage-blobs-between/ba-p/3545304) are common methods. If you use Azure Storage Explorer, you may need to allow your client IP address into your storage account's firewall. 

Now you're ready to configure your function app to communicate with the newly secured storage account.

### 3. Enable application and configuration routing

You should now route your function app's traffic to go through the virtual network.

1. Enable [application routing](../app-service/overview-vnet-integration.md#application-routing) to route your app's traffic into the virtual network.

    * Navigate to the **Networking** tab of your function app. Under **Outbound traffic configuration**, select the subnet associated with your virtual network integration.

    * In the new page, check the box for **Outbound internet traffic** under **Application routing**.

1. Enable [content share routing](../app-service/overview-vnet-integration.md#content-share) to have your function app communicate with your new storage account through its virtual network. 

    * In the same page, check the box for **Content storage** under **Configuration routing**.

### 4. Update application settings

Finally, you need to update your application settings to point at the new secure storage account.

1. Update the **Application Settings** under the **Configuration** tab of your function app to the following:

    | Setting name | Value | Comment |
    |----|----|----|
    | [`AzureWebJobsStorage`](./functions-app-settings.md#azurewebjobsstorage)<br>[`WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`](./functions-app-settings.md#website_contentazurefileconnectionstring) | Storage connection string | Both settings contain the connection string for the new secured storage account, which you saved earlier. |
    | [`WEBSITE_CONTENTSHARE`](./functions-app-settings.md#website_contentshare) | File share | The name of the file share created in the secured storage account where the project deployment files reside. |

1. Select **Save** to save the application settings. Changing app settings causes the app to restart.  

After the function app restarts, it's now connected to a secured storage account.

## Next steps

> [!div class="nextstepaction"]
> [Azure Functions networking options](functions-networking-options.md)
