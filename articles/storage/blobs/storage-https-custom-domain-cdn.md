---
title: Use Azure CDN to access blobs with custom domains over HTTPS
description: Learn how to integrate Azure CDN with blob storage to access blobs with custom domains over HTTPS
services: storage
author: michaelhauss

ms.service: storage
ms.topic: article
ms.date: 06/26/2018
ms.author: mihauss
ms.component: blobs
---

# Use Azure CDN to access blobs with custom domains over HTTPS

Azure Content Delivery Network (CDN) now supports HTTPS for custom domain names. With CDN, you can access storage blobs by using your custom domain over HTTPS. To do so, you first need to enable Azure CDN on your blob or web endpoint and map CDN to a custom domain name. After you take these steps, enabling HTTPS for your custom domain is simplified via one-click access and complete certificate management. There is no increase in normal CDN pricing.

Using CDN is important because it helps you to protect the privacy and data integrity of your sensitive web application data while it is in transit. Using the SSL protocol to serve traffic via HTTPS ensures that your data is encrypted when it is sent across the internet. HTTPS helps ensure trust and authentication, and it protects your web applications from attacks.

> [!NOTE]  
> In addition to providing SSL support for custom domain names, Azure CDN can help you scale your application to deliver high-bandwidth content around the world. To learn more, see [Overview of Azure CDN](../../cdn/cdn-overview.md).

## Quickstart

To enable HTTPS for your custom blob storage endpoint, do the following:

1.  [Integrate an Azure storage account with Azure CDN](../../cdn/cdn-create-a-storage-account-with-cdn.md).  
    This article walks you through creating a storage account in the Azure portal if you have not done so already.

    > [!NOTE]  
    > To add your storage web endpoint during the preview of static websites support in Azure Storage, select **Custom origin** in the **Origin type** drop-down list. In the Azure portal, you need to do this from your CDN profile instead of directly in your storage account.

2.  [Map Azure CDN content to a custom domain](../../cdn/cdn-map-content-to-custom-domain.md).

3.  [Enable HTTPS on an Azure CDN custom domain](../../cdn/cdn-custom-ssl.md).

## Shared access signatures

If your blob storage endpoint is configured to disallow anonymous read access, you need to provide a [shared access signature](../common/storage-dotnet-shared-access-signature-part-1.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) token in each request you make to your custom domain. By default, blob storage endpoints disallow anonymous read access. For more information, see [Manage anonymous read access to containers and blobs](storage-manage-access-to-resources.md)

Azure CDN does not respect any restrictions added to the shared access signature token. For example, all shared access signature tokens have an expiration time, which means that content can still be accessed with an expired shared access signature until that content is purged from the CDN edge nodes. You can control how long data is cached on CDN by setting the cache response header. See [Manage expiration of Azure Storage blobs in Azure CDN](../../cdn/cdn-manage-expiration-of-blob-content.md) for instructions.

If you create multiple shared access signature URLs for the same blob endpoint, we recommend turning on query string caching for your Azure CDN. This action ensures that each URL is treated as a unique entity. For more information, see [Control Azure CDN caching behavior with query strings](../../cdn/cdn-query-string.md).

## HTTP to HTTPS redirection

You can elect to redirect HTTP traffic to HTTPS. Doing so requires the use of the Azure CDN premium offering from Verizon. You need to [Override HTTP behavior by using the Azure CDN rules engine](../../cdn/cdn-rules-engine.md) by applying the following rule:

![HTTP to HTTPS redirection rule](./media/storage-https-custom-domain-cdn/redirect-to-https.png)

*Cdn-endpoint-name* refers to the name that you configured for your CDN endpoint. You can select this value in the drop-down list. *Origin-path* refers to the path within your origin storage account where your static content resides. If you are hosting all static content in a single container, replace *origin-path* with the name of that container.

For a deeper dive into rules, see the [Azure CDN rules engine features](../../cdn/cdn-rules-engine-reference-features.md).

## Pricing and billing

When you access blobs through Azure CDN, you pay [Blob storage prices](https://azure.microsoft.com/pricing/details/storage/blobs/) for traffic between the edge nodes and the origin (Blob storage), and you pay [CDN prices](https://azure.microsoft.com/pricing/details/cdn/) for data that's accessed from the edge nodes.

For example, say you have a storage account in West US that is being accessed by using Azure CDN. If someone in the UK tries to access one of the blobs in that storage account via CDN, Azure first checks the edge node that's closest to the UK for that blob. If the blob is found, Azure accesses that copy of the blob and uses CDN pricing, because it is being accessed on CDN. If the blob is not found, Azure copies the blob to the edge node, which results in egress and transaction charges as specified in the Blob storage pricing. Azure then accesses the file on the edge node, which results in CDN billing.

When you look at the [CDN pricing page](https://azure.microsoft.com/pricing/details/cdn/), note that HTTPS support for custom domain names is available for Azure CDN only from Verizon products (Standard and Premium).

## Next steps

* [Configure a custom domain name for your Blob storage endpoint](storage-custom-domain-name.md)
* [Static website hosting in Azure Storage (preview)](storage-blob-static-website.md)
