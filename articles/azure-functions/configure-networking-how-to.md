---
title: How to use a secured storage account with Azure Functions
description: Learn how to use a secured storage account in a virtual network as the default storage account for a function app in Azure Functions.
ms-service: azure-functions
ms.topic: how-to
ms.date: 01/03/2025
ms.custom: template-how-to, build-2024, ignite-2024
# Customer intent: As a developer, I want to understand how to use a secured storage account in a virtual network as the default storage account for my function app, so that my function app can be secure.
---

# How to use a secured storage account with Azure Functions

Azure Functions requires an Azure Storage account when you create a function app instance. This default storage account is used by the Functions runtime to maintain the health of your function app. For more information, see [Storage considerations for Azure Functions](storage-considerations.md). This article shows you how to use a secured storage account as the default storage account. For an in-depth tutorial on how to create your function app with inbound and outbound access restrictions, see the [Integrate with a virtual network](functions-create-vnet.md) tutorial. To learn more about Azure Functions and networking, see [Azure Functions networking options](functions-networking-options.md).

## Restrict your storage account to a virtual network

When you create a function app, you either create a new storage account or link to an existing one. Keep these considerations in mind when working with secured storage account. 

+ To create a function app that uses an existing secured storage account as the default storage account, you must create your app either in the [Azure portal](https://portal.azure.com) or by using [ARM template](functions-infrastructure-as-code.md?tabs=json&pivots=premium-plan#secured-deployments) or [Bicep](functions-infrastructure-as-code.md?tabs=bicep&pivots=premium-plan#secured-deployments) deployments.
+ When using a secured storage account with a dynamic scale plan, you should host your functions in the [Flex Consumption plan](./flex-consumption-plan.md). This plan supports both secured storage accounts and managed identity-based connections to storage, which is the most secure connection option.    
+ All tiers of both the [Dedicated (App Service) plan](./dedicated-plan.md) and the [Elastic Premium plan](./functions-premium-plan.md) also support secure storage accounts. However, there are trade-offs when using managed identities to connect from a Premium plan app. For more information, see [Create an app without Azure Files](storage-considerations.md#create-an-app-without-azure-files). 
+ The [Consumption plan](consumption-plan.md) doesn't support virtual networks, so you can't connect to a secured storage account when running in the Consumption plan. To take advantage of serverless function hosting, you should instead recreate your app to run in Flex Consumption plan.
+ This article currently shows you how to create a function app in a Premium plan that connects to a secured storage account using the storage account connection string. To provide the best protection of storage account credentials, you should instead use managed identities when connecting to a storage account. Instead follow the [Quickstart: Create and deploy functions to Azure Functions using the Azure Developer CLI](create-first-function-azure-developer-cli.md) to create a function app in the Flex Consumption plan that connects to a new secured storage account using managed identities. 
+ For a list of all restrictions on storage accounts, see [Storage account requirements](storage-considerations.md#storage-account-requirements).

## Secure storage during function app creation

You can create a function app, along with a new storage account that is secured behind a virtual network. The following sections show you how to create these resources by using either the Azure portal or by using deployment templates.

### [Azure portal](#tab/portal)

Complete the steps in [Create a function app in a Premium plan](functions-create-vnet.md#create-a-function-app-in-a-premium-plan). This section of the virtual networking tutorial shows you how to create a function app that connects to storage over private endpoints.

> [!NOTE]
> When you create your function app in the Azure portal, you can also choose an existing secured storage account in the **Storage** tab. However, you must configure the appropriate networking on the function app so that it can connect through the virtual network used to secure the storage account. If you don't have permissions to configure networking or you haven't fully prepared your network, select **Configure networking after creation** in the **Networking** tab. You can configure networking for your new function app in the portal under **Settings** > **Networking**.

### [Deployment templates](#tab/templates)

Use Bicep files or Azure Resource Manager (ARM) templates to create a secured function app and storage account resources. When you create a secured storage account in an automated deployment, you must set the `vnetContentShareEnabled` site property, create the file share as part of your deployment, and set the `WEBSITE_CONTENTSHARE` app setting to the name of the file share. For more information, including links to example deployments, see [Secured deployments](functions-infrastructure-as-code.md?pivots=premium-plan#secured-deployments).

---

## Secure storage for an existing function app

When you have an existing function app, you can directly configure networking on the storage account being used by the app. However, this process results in your function app being down while you configure networking and while your function app restarts.

To minimize downtime, you can instead swap-out an existing storage account for a new, secured storage account.

### 1. Enable virtual network integration

As a prerequisite, you need to enable virtual network integration for your function app:

1. Choose a function app with a storage account that doesn't have service endpoints or private endpoints enabled.

1. [Enable virtual network integration](./functions-networking-options.md#enable-virtual-network-integration) for your function app.

### 2. Create a secured storage account

Set up a secured storage account for your function app:

1. [Create a second storage account](../storage/common/storage-account-create.md). This storage account is the secured storage account for your function app to use instead of its original unsecured storage account. You can also use an existing storage account not already being used by Functions.

1. Save the connection string for this storage account to use later. 

1. [Create a file share](../storage/files/storage-how-to-create-file-share.md#create-a-file-share) in the new storage account. For your convenience, you can use the same file share name from your original storage account. Otherwise, if you use a new file share name, you must update your app setting.

1. Secure the new storage account in one of the following ways:

    * [Create a private endpoint](../storage/common/storage-private-endpoints.md#creating-a-private-endpoint). As you set up your private endpoint connection, create private endpoints for the `file` and `blob` subresources. For Durable Functions, you must also make `queue` and `table` subresources accessible through private endpoints. If you're using a custom or on-premises Domain Name System (DNS) server, [configure your DNS server](../storage/common/storage-private-endpoints.md#dns-changes-for-private-endpoints) to resolve to the new private endpoints.

    * [Restrict traffic to specific subnets](../storage/common/storage-network-security.md#grant-access-from-a-virtual-network). Ensure your function app is network integrated with an allowed subnet and that the subnet has a service endpoint to `Microsoft.Storage`.

1. Copy the file and blob content from the current storage account used by the function app to the newly secured storage account and file share. [AzCopy](../storage/common/storage-use-azcopy-blobs-copy.md) and [Azure Storage Explorer](https://techcommunity.microsoft.com/t5/azure-developer-community-blog/azure-tips-and-tricks-how-to-move-azure-storage-blobs-between/ba-p/3545304) are common methods. If you use Azure Storage Explorer, you might need to allow your client IP address access to your storage account's firewall.

Now you're ready to configure your function app to communicate with the newly secured storage account.

### 3. Enable application and configuration routing

> [!NOTE]
> These configuration steps are required only for the [Elastic Premium](./functions-premium-plan.md) and [Dedicated (App Service)](./dedicated-plan.md) hosting plans.
> The [Flex Consumption plan](./flex-consumption-plan.md) doesn't require site settings to configure networking.

You're now ready to route your function app's traffic to go through the virtual network:

1. Enable [application routing](../app-service/overview-vnet-integration.md#application-routing) to route your app's traffic to the virtual network:

    1. In your function app, expand **Settings**, and then select **Networking**. In the **Networking** page, under **Outbound traffic configuration**, select the subnet associated with your virtual network integration.

    1. In the new page, under **Application routing**, select **Outbound internet traffic**.

1. Enable [content share routing](../app-service/overview-vnet-integration.md#content-share) to enable your function app to communicate with your new storage account through its virtual network. In the same page as the previous step, under **Configuration routing**, select **Content storage**.

[!INCLUDE [functions-content-over-vnet-shared-storage-note](../../includes/functions-content-over-vnet-shared-storage-note.md)]

### 4. Update application settings

Finally, you need to update your application settings to point to the new secure storage account:

1. In your function app, expand **Settings**, and then select **Environment variables**.
1. In the **App settings** tab, update the following settings by selecting each setting, editing it, and then selecting **Apply**:

    | Setting name | Value | Comment |
    |----|----|----|
    | [`AzureWebJobsStorage`](./functions-app-settings.md#azurewebjobsstorage)| Storage connection string | Use the connection string for your new secured storage account, which you saved earlier. |
    | [`WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`](./functions-app-settings.md#website_contentazurefileconnectionstring) | Storage connection string | Use the connection string for your new secured storage account, which you saved earlier. |
    | [`WEBSITE_CONTENTSHARE`](./functions-app-settings.md#website_contentshare) | File share | Use the name of the file share created in the secured storage account where the project deployment files reside. |

1. Select **Apply**, and then **Confirm** to save the new application settings in the function app.

   The function app restarts.

After the function app finishes restarting, it connects to the secured storage account.

## Next steps

> [!div class="nextstepaction"]
> [Azure Functions networking options](functions-networking-options.md)
