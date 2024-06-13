---
title: How to use a secured storage account with Azure Functions
description: Learn how to use a secured storage account in a virtual network as the default storage account for a function app in Azure Functions.
ms.topic: how-to
ms.date: 06/13/2024
ms.custom: template-how-to, build-2024
---

# How to use a secured storage account with Azure Functions

This article shows you how to connect your function app to a secured storage account. For an in-depth tutorial on how to create your function app with inbound and outbound access restrictions, see the [Integrate with a virtual network](functions-create-vnet.md) tutorial. To learn more about Azure Functions and networking, see [Azure Functions networking options](functions-networking-options.md).

## Restrict your storage account to a virtual network

When you create a function app, you either create a new storage account or link to an existing one. Only [ARM template and Bicep deployments](functions-infrastructure-as-code.md#secured-deployments) support function app creation with an existing secured storage account.

> [!NOTE]  
> Securing your storage account is supported for all tiers of a [dedicated App Service plan](./dedicated-plan.md) and the [Azure Functions Elastic Premium plan](./functions-premium-plan.md). It's also supported by the [Azure Functions Flex Consumption plan](./flex-consumption-plan.md). Consumption plans don't support virtual networks.

For a list of all restrictions on storage accounts, see [Storage account requirements](storage-considerations.md#storage-account-requirements).

[!INCLUDE [functions-flex-preview-note](../../includes/functions-flex-preview-note.md)]

## Secure storage during function app creation 

You can create a function app, along with a new storage account, that is secured behind a virtual network and is accessible via private endpoints. The following sections show you how to create these resources by using either the Azure portal or deployment templates.

### [Azure portal](#tab/portal)

Complete the following tutorial to create a new function app a secured storage account: [Use private endpoints to integrate Azure Functions with a virtual network](functions-create-vnet.md).

### [Deployment templates](#tab/templates)

Use Bicep files or Azure Resource Manager (ARM) templates to create a secured function app and storage account resources. When you create a secured storage account in an automated deployment, you must set the `vnetContentShareEnabled` site property, create the file share as part of your deployment, and set the `WEBSITE_CONTENTSHARE` app setting to the name of the file share. For more information, including links to example deployments, see [Automate resource deployment for your function app in Azure Functions](functions-infrastructure-as-code.md).

---

## Secure storage for an existing function app

When you have an existing function app, you can't directly secure the storage account currently being used by the app. You must instead swap-out the existing storage account for a new, secured storage account.

### 1. Enable virtual network integration

As a prerequisite, you need to enable virtual network integration for your function app.

1. Choose a function app with a storage account that doesn't have service endpoints or private endpoints enabled.

1. [Enable virtual network integration](./functions-networking-options.md#enable-virtual-network-integration) for your function app.

### 2. Create a secured storage account

Set up a secured storage account for your function app:

1. [Create a second storage account](../storage/common/storage-account-create.md). This account is the secured storage account for your function app to use instead of your original storage account. You can also use an existing storage account not already being used by Functions.

1. Copy the connection string for this storage account. You need this string for later.

1. [Create a file share](../storage/files/storage-how-to-create-file-share.md#create-a-file-share) in the new storage account. For your convenience, you can use the same name as the file share in your original storage account. Otherwise, if you use a new file share name, you need to update your app settings.

1. Secure the new storage account in one of the following ways:

    * [Create a private endpoint](../storage/common/storage-private-endpoints.md#creating-a-private-endpoint). When you set up a private endpoint connection, create private endpoints for the `file` and `blob` subresources. For Durable Functions, you must also make `queue` and `table` subresources accessible through private endpoints. If you're using a custom or on-premises Domain Name System (DNS) server, make sure you [configure your DNS server](../storage/common/storage-private-endpoints.md#dns-changes-for-private-endpoints) to resolve to the new private endpoints.

    * [Restrict traffic to specific subnets](../storage/common/storage-network-security.md#grant-access-from-a-virtual-network). Ensure that one of the allowed subnets is the one your function app is network integrated with and your subnet has a service endpoint to `Microsoft.Storage`.

1. Copy the file and blob content from the current storage account used by the function app to the newly secured storage account and file share. [AzCopy](../storage/common/storage-use-azcopy-blobs-copy.md) and [Azure Storage Explorer](https://techcommunity.microsoft.com/t5/azure-developer-community-blog/azure-tips-and-tricks-how-to-move-azure-storage-blobs-between/ba-p/3545304) are common methods. If you use Azure Storage Explorer, you might need to allow your client IP address access to your storage account's firewall.

Now you're ready to configure your function app to communicate with the newly secured storage account.

### 3. Enable application and configuration routing

Route your function app's traffic to go through the virtual network by following these steps:

1. Enable [application routing](../app-service/overview-vnet-integration.md#application-routing) to route your app's traffic to the virtual network:

    * In your function app, expand **Settings**, and then select **Networking**. Under **Outbound traffic configuration**, select the subnet associated with your virtual network integration.

    * In the new page, select **Outbound internet traffic** under **Application routing**.

1. Enable [content share routing](../app-service/overview-vnet-integration.md#content-share) to enable your function app to communicate with your new storage account through its virtual network.

    * In the same page, select **Content storage** under **Configuration routing**.

### 4. Update application settings

Finally, you need to update your application settings to point to the new secure storage account.

1. In your function app, expand **Settings**, and then select **Environment variables**.
1. In the **App settings** tab, update the following settings:

    | Setting name | Value | Comment |
    |----|----|----|
    | [`AzureWebJobsStorage`](./functions-app-settings.md#azurewebjobsstorage)<br>[`WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`](./functions-app-settings.md#website_contentazurefileconnectionstring) | Storage connection string | Both settings contain the connection string for the new secured storage account, which you saved earlier. |
    | [`WEBSITE_CONTENTSHARE`](./functions-app-settings.md#website_contentshare) | File share | The name of the file share created in the secured storage account where the project deployment files reside. |

1. Select **Apply** to save the application settings. The app now restarts.  

After the function app restarts, it connects to a secured storage account.

## Next steps

> [!div class="nextstepaction"]
> [Azure Functions networking options](functions-networking-options.md)
