---
title: 'Tutorial: Access storage blobs using an Azure Content Delivery Network custom domain over HTTPS'
description: Learn how to add an Azure Content Delivery Network custom domain and enable HTTPS on that domain for your custom blob storage endpoint.
services: cdn
author: duongau
ms.service: azure-cdn
ms.topic: tutorial
ms.date: 03/20/2024
ms.author: duau
ms.custom: mvc
---

# Tutorial: Access storage blobs using an Azure Content Delivery Network custom domain over HTTPS

After you've integrated your Azure Storage account with Azure Content Delivery Network, you can add a custom domain and enable HTTPS on that domain for your custom blob storage endpoint.

## Prerequisites

Before you can complete the steps in this tutorial, you must first integrate your Azure Storage account with Azure Content Delivery Network. For more information, see [Quickstart: Integrate an Azure Storage account with Azure Content Delivery Network](cdn-create-a-storage-account-with-cdn.md).

## Add a custom domain

When you create a content delivery network endpoint in your profile, the endpoint name, which is a subdomain of azureedge.net, is included in the URL for delivering content delivery network content by default. You also have the option of associating a custom domain with a content delivery network endpoint. With this option, you deliver your content with a custom domain in your URL instead of an endpoint name. To add a custom domain to your endpoint, follow the instructions in this tutorial: [Add a custom domain to your Azure Content Delivery Network endpoint](cdn-map-content-to-custom-domain.md).

## Configure HTTPS

By using the HTTPS protocol on your custom domain, you ensure that your data is delivered securely on the internet via TLS/SSL encryption. When your web browser is connected to a web site via HTTPS, it validates the web site's security certificate and verifies if the certificate is issue by a legitimate certificate authority. To configure HTTPS on your custom domain, follow the instructions in this tutorial: [Configure HTTPS on an Azure Content Delivery Network custom domain](cdn-custom-ssl.md).

## Shared Access Signatures

If your blob storage endpoint is configured to disallow anonymous read access, you should provide a [Shared Access Signature (SAS)](cdn-sas-storage-support.md) token in each request you make to your custom domain. By default, blob storage endpoints disallow anonymous read access. For more information about SAS, see [Managing anonymous read access to containers and blobs](../storage/blobs/anonymous-read-access-configure.md).

Azure Content Delivery Network ignores any restrictions added to the SAS token. For example, all SAS tokens have an expiration time, which means that content can still be accessed with an expired SAS until that content gets purged from the content delivery network point of presence (POP) servers. You can control how long data is cached on Azure Content Delivery Network by setting the cache response header. For more information, see [Managing expiration of Azure Storage blobs in Azure Content Delivery Network](cdn-manage-expiration-of-blob-content.md).

If you create multiple SAS URLs for the same blob endpoint, consider enabling query string caching. Doing so ensures that each URL is treated as a unique entity. For more information, see [Controlling Azure Content Delivery Network caching behavior with query strings](cdn-query-string.md).

## HTTP-to-HTTPS redirection

You can elect to redirect HTTP traffic to HTTPS by creating a URL redirect rule with the [Standard rules engine](cdn-standard-rules-engine.md) or the [Edgio Premium rules engine](cdn-verizon-premium-rules-engine.md). Standard Rules engine is available only for Azure Content Delivery Network from Microsoft profiles, while Edgio premium rules engine is available only from Azure Content Delivery Network Premium from Edgio profiles.

![Microsoft redirect rule](./media/cdn-storage-custom-domain-https/cdn-standard-redirect-rule.png)

In the above rule, leaving Hostname, Path, Query string, and Fragment results in the incoming values being used in the redirect.

![Edgio redirect rule](./media/cdn-storage-custom-domain-https/cdn-url-redirect-rule.png)

In the above rule, *Cdn-endpoint-name* refers to the name that you configured for your content delivery network endpoint, which you can select from the dropdown list. The value for *origin-path* refers to the path within your origin storage account where your static content resides. If you're hosting all static content in a single container, replace *origin-path* with the name of that container.

## Pricing and billing

When you access blobs through Azure Content Delivery Network, you pay [Blob storage prices](https://azure.microsoft.com/pricing/details/storage/blobs/) for traffic between the POP servers and the origin (Blob storage), and [Azure content delivery network pricing](https://azure.microsoft.com/pricing/details/cdn/) for data accessed from the POP servers.

For example, if you have a storage account in the United States that's being accessed using Azure Content Delivery Network and someone in Europe attempts to access one of the blobs in that storage account via Azure Content Delivery Network, Azure Content Delivery Network first checks the POP closest to Europe for that blob. If found, Azure Content Delivery Network accesses that copy of the blob and uses content delivery network pricing, because it's being accessed on Azure Content Delivery Network. If not found, Azure Content Delivery Network copies the blob to the POP server, which results in egress and transaction charges as specified in the Blob storage pricing, and then accesses the file on the POP server, which results in Azure Content Delivery Network billing.

## Next steps

[Tutorial: Set Azure Content Delivery Network caching rules](cdn-caching-rules-tutorial.md)
