---
title: Use Azure CDN to access blobs with custom domains over HTTPS
description: Learn how to integrate Azure CDN with Blob storage to access blobs with custom domains over HTTPS
services: storage
author: normesta

ms.service: storage
ms.topic: article
ms.date: 06/26/2018
ms.author: normesta
ms.reviewer: seguler
ms.subservice: blobs
---

# Use Azure CDN to access blobs with custom domains over HTTPS

Azure Content Delivery Network (Azure CDN) now supports HTTPS for custom domain names. With Azure CDN, you can access blobs by using your custom domain name over HTTPS. To do so, enable Azure CDN on your blob or web endpoint and then map Azure CDN to a custom domain name. After you're done, Azure simplifies enabling HTTPS for your custom domain via one-click access and complete certificate management. There's no increase in the normal Azure CDN pricing.

Azure CDN helps protect the privacy and data integrity of your web application data while it's in transit. By using the SSL protocol to serve traffic via HTTPS, Azure CDN keeps your data encrypted when it's sent across the internet. Using HTTPS with Azure CDN helps to protect your web applications from attack.

> [!NOTE]  
> In addition to providing SSL support for custom domain names, Azure CDN can help you scale your application to deliver high-bandwidth content around the world. To learn more, see [Overview of Azure CDN](../../cdn/cdn-overview.md).

## Quickstart

To enable HTTPS for your custom Blob storage endpoint, do the following:

1.  [Integrate an Azure storage account with Azure CDN](../../cdn/cdn-create-a-storage-account-with-cdn.md).  
    This article walks you through creating a storage account in the Azure portal, if you haven't already done so.

    > [!NOTE]  
    > To add your storage web endpoint during the preview of static websites support in Azure Storage, select **Custom origin** in the **Origin type** drop-down list. In the Azure portal, you need to do this from your Azure CDN profile instead of directly in your storage account.

2.  [Map Azure CDN content to a custom domain](../../cdn/cdn-map-content-to-custom-domain.md).

3.  [Enable HTTPS on an Azure CDN custom domain](../../cdn/cdn-custom-ssl.md).

## Shared access signatures

By default, Blob storage endpoints disallow anonymous read access. If your Blob storage endpoint is configured to disallow anonymous read access, provide a [shared access signature](../common/storage-dotnet-shared-access-signature-part-1.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) token in each request to your custom domain. For more information, see [Manage anonymous read access to containers and blobs](storage-manage-access-to-resources.md).

Azure CDN doesn't respect any restrictions that are added to the shared access signature token. For example, all shared access signature tokens expire. You can still access content with an expired shared access signature until that content is purged from the Azure CDN edge nodes. You can control how long data is cached on Azure CDN by setting the cache response header. To learn how, see [Manage expiration of Azure Storage blobs in Azure CDN](../../cdn/cdn-manage-expiration-of-blob-content.md).

If you create two or more shared access signature URLs for the same blob endpoint, we recommend turning on query string caching for your Azure CDN. This action ensures that Azure treats each URL as a unique entity. For more information, see [Control Azure CDN caching behavior with query strings](../../cdn/cdn-query-string.md).

## HTTP to HTTPS redirection

You can redirect HTTP traffic to HTTPS. Doing so requires the use of the Azure CDN premium offering from Verizon. [Override HTTP behavior with the Azure CDN rules engine](../../cdn/cdn-rules-engine.md) by applying the following rule:

![HTTP to HTTPS redirection rule](./media/storage-https-custom-domain-cdn/redirect-to-https.png)

*Cdn-endpoint-name*, which you select in the drop-down list, refers to the name that you configured for your Azure CDN endpoint. *Origin-path* refers to the path within your origin storage account, where your static content is stored. If you're hosting all static content in a single container, replace *origin-path* with the name of that container.

For a deeper dive into rules, see the [Azure CDN rules engine features](../../cdn/cdn-rules-engine-reference-features.md).

## Pricing and billing

When you access blobs through Azure CDN, you pay [Blob storage prices](https://azure.microsoft.com/pricing/details/storage/blobs/) for traffic between the edge nodes and the origin (Blob storage). You pay [Azure CDN prices](https://azure.microsoft.com/pricing/details/cdn/) for data that's accessed from the edge nodes.

For example, let's say you have a storage account in West US that you're accessing via Azure CDN. When someone in the UK tries to access a blob in that storage account via Azure CDN, Azure first checks for the blob in the edge node that's closest to the UK. If Azure finds the blob, it accesses a copy and uses Azure CDN pricing, because Azure CDN is accessing it. If Azure doesn't find the blob, it copies the blob to the edge node. This action results in egress and transaction charges, as specified in the Blob storage pricing. Azure then accesses the file on the edge node, which results in Azure CDN billing.

On the [Azure CDN pricing page](https://azure.microsoft.com/pricing/details/cdn/), HTTPS support for custom domain names is available for Azure CDN only from Verizon Standard and Premium products.

## Next steps

* [Configure a custom domain name for your Blob storage endpoint](storage-custom-domain-name.md)
* [Static website hosting in Azure Storage](storage-blob-static-website.md)
