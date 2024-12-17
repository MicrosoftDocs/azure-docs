---
title: Integrate an Azure Storage account with Azure Front Door
titleSuffix: Azure Front Door
description: This article shows you how to use Azure Front Door to deliver high-bandwidth content by caching blobs from Azure Storage.
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 11/13/2024
ms.author: duau
ms.custom: mvc, mode-other
---

# Integrate an Azure Storage account with Azure Front Door

Azure Front Door can be used to deliver high-bandwidth content by caching blobs from Azure Storage. In this article, you create an Azure Storage account and enable Front Door to cache and accelerate content from Azure Storage.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Create a storage account

A storage account provides access to Azure Storage services. It represents the highest level of the namespace for accessing each Azure Storage service component: Azure Blob, Queue, and Table storage. For more information, see [Introduction to Microsoft Azure Storage](../storage/common/storage-introduction.md).

1. In the Azure portal, select **+ Create a resource** in the upper left corner. The **Create a resource** pane appears.

1. On the **Create a resource** page, search for **Storage account** and select **Storage account** from the list. Then select **Create**.

    :::image type="content" source="./media/integrate-storage-account/create-new-storage-account.png" alt-text="Screenshot of creating a storage account.":::

1. On the **Create a storage account** page, enter or select the following information for the new storage account:

    | Setting | Value |
    | --- | --- |
    | Resource group | Select **Create new** and enter the name **AFDResourceGroup**. You can also select an existing resource group. |
    | Storage account name | Enter a name for the account using 3-24 lowercase letters and numbers only. The name must be unique across Azure and becomes the host name in the URL used to address blob, queue, or table resources for the subscription. To address a container resource in Blob storage, use a URI in the following format: http://*&lt;storageaccountname&gt;*.blob.core.windows.net/*&lt;container-name&gt;*. |
    | Region | Select an Azure region closest to you from the drop-down list. |
    
    Leave all other settings as default. Select the **Review** tab, select **Create**, and then select **Review + Create**.

1. The creation of the storage account can take a few minutes to complete. Once creation is complete, select **Go to resource** to go to the new storage account resource.

## Enable Azure Front Door CDN for the storage account

1. From the storage account resource, select **Front Door and CDN** under **Security + networking** in the left menu.

    :::image type="content" source="./media/integrate-storage-account/storage-endpoint-configuration.png" alt-text="Screenshot of creating an AFD endpoint.":::
    
1. In the **New endpoint** section, enter the following information:

    | Setting  | Value |
    | -------- | ----- |
    | Service type | Select **Azure Front Door**. |
    | Create new/use existing profile | Choose to create a new Front Door profile or select an existing one. |
    | Profile name | Enter a name for the Front Door profile. If you selected **Use existing**, choose from the available profiles. |
    | Endpoint name | Enter your endpoint hostname, such as *contoso1234*. This name is used to access your cached resources at the URL _&lt;endpoint-name + hash value&gt;_.z01.azurefd.net. |
    | Origin hostname | By default, a new Front Door endpoint uses the hostname of your storage account as the origin server. |
    | Pricing tier | Select **Standard** for content delivery or **Premium** for content delivery with security features. |
    | Caching | *Optional* - Toggle on to [enable caching](front-door-caching.md) for your static content. Choose an appropriate query string behavior and enable compression if needed. |
    | WAF | *Optional* - Toggle on to protect your endpoint from vulnerabilities, malicious actors, and bots with [Web Application Firewall](web-application-firewall.md). Use an existing policy from the WAF policy dropdown or create a new one. |
    | Private link | *Optional* - Toggle on to keep your storage account private, not exposed to the public internet. Select the region that matches your storage account or is closest to your origin. Choose **blob** as the target subresource. |

    :::image type="content" source="./media/integrate-storage-account/security-settings.png" alt-text="Screenshot of the caching, WAF, and private link settings for an endpoint.":::

    > [!NOTE]
    > * With the Standard tier, you can only use custom rules with WAF. To deploy managed rules and bot protection, choose the Premium tier. For a detailed comparison, see [Azure Front Door tier comparison](./standard-premium/tier-comparison.md).
    > * The Private Link feature is **only** available with the Premium tier.

1. Select **Create** to create the new endpoint. After creation, it appears in the endpoint list.

    :::image type="content" source="./media/integrate-storage-account/endpoint-created.png" alt-text="Screenshot of a new Front Door endpoint created from a Storage account.":::

> [!NOTE]
> * The endpoint list will only show Front Door and CDN profiles within the same subscription.

## Extra features
From the storage account **Front Door and CDN** page, select the endpoint from the list to open the Front Door endpoint configuration page. Here, you can enable other Azure Front Door features such as the [rules engine](front-door-rules-engine.md) and configure traffic [load balancing](routing-methods.md).

For best practices, refer to [Use Azure Front Door with Azure Storage blobs](scenario-storage-blobs.md).

## Enable SAS

To grant limited access to private storage containers, use the Shared Access Signature (SAS) feature of your Azure Storage account. A SAS is a URI that grants restricted access rights to your Azure Storage resources without exposing your account key.

## Access CDN content

To access cached content with Azure Front Door, use the Front Door URL provided in the portal. The address for a cached blob follows this format:

http://<*endpoint-name-with-hash-value*\>.z01.azurefd.net/<*myPublicContainer*\>/<*BlobName*\>

> [!NOTE]
> After enabling Azure Front Door access to a storage account, all publicly available objects are eligible for Front Door POP (Point-of-presence) caching. If you modify an object that is currently cached in Front Door, the new content won't be available until Front Door refreshes its content after the time-to-live period expires.

## Add a custom domain

Using a custom domain with Azure Front Door allows your own domain name to be visible in end-user requests, which can enhance customer convenience and support branding efforts.

To add a custom domain:

1. Navigate to the storage account *Front Door and CDN** page.

1. Select **View custom domains** for the Azure Front Door endpoint.

1. On the domains page, add a new custom domain to access your storage account.

For detailed instructions, see [Configure a custom domain with Azure Front Door](./standard-premium/how-to-add-custom-domain.md).

## Purge cached content from Azure Front Door

If you no longer want to cache an object in Azure Front Door, you can purge the cached content.

1. Navigate to the storage account **Front Door and CDN** page.

1. Select the Azure Front Door endpoint from the list to open the Azure Front Door endpoint configuration page.

1. Select on the **Purge cache** option at the top of the page.

1. Select the endpoint, domain, and path you want to purge.

> [!NOTE]
> An object already cached in Azure Front Door will remain cached until the time-to-live period expires or until you purge the endpoint.

## Clean up resources

In the preceding steps, you created an Azure Front Door profile and an endpoint in a resource group. If you no longer need these resources, you can delete them to avoid incurring charges.

1. In the Azure portal, select **Resource groups** from the left-hand menu, then select **AFDResourceGroup**.

1. On the **Resource group** page, select **Delete resource group**. Enter **AFDResourceGroup** in the text box, then select **Delete**. This action deletes the resource group, profile, and endpoint created in this guide.

1. To delete your storage account, select the storage account from the dashboard, then select **Delete** from the top menu.

## Next steps

* Learn how to use [Azure Front Door with Azure Storage blobs](scenario-storage-blobs.md)
* Learn how to [enable Azure Front Door Private Link with Azure Blob Storage](standard-premium/how-to-enable-private-link-storage-account.md)
* Learn how to [enable Azure Front Door Private Link with Storage Static Website](how-to-enable-private-link-storage-static-website.md)


