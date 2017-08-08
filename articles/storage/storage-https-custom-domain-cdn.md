---
title: Using the Azure CDN to access blobs with custom domains over HTTPS
description: Learn how to integrate the Azure CDN with blob storage to access blobs with custom domains over HTTPS
services: storage
documentationcenter: ''
author: michaelhauss
manager: vamshik
editor: tysonn

ms.assetid:
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/04/2017
ms.author: mihauss
---
# Using the Azure CDN to access blobs with custom domains over HTTPS

Azure Content Delivery Network (CDN) now supports HTTPS for custom domain names.
You can leverage this feature to access storage blobs using your custom domain over HTTPS. To do so, you’ll first need to enable Azure CDN on your blob endpoint and map the CDN to a custom domain name. Once you
take these steps, enabling HTTPS for your custom domain is simplified via
one-click enablement, complete certificate management, and all with no
additional cost to normal CDN pricing.

This ability is important because it enables you to protect the privacy and data
integrity of your sensitive web application data while in transit. Using the SSL
protocol to serve traffic via HTTPS ensures that data is encrypted when it is
sent across the internet. HTTPS provides trust and authentication, and protects
your web applications from attacks.

> [!NOTE]
> In addition to providing SSL support for custom domain names, the Azure CDN can
> help you scale your application to deliver high-bandwidth content around the world.
> To learn more, check out [Overview of the Azure CDN](../cdn/cdn-overview.md).
>
>

## Quick start

These are the steps required to enable HTTPS for your custom blob storage
endpoint:

1.  [Integrate an Azure storage account with Azure
    CDN](../cdn/cdn-create-a-storage-account-with-cdn.md).
    This article walks you through creating a storage account in the Azure
    Portal if you have not done so already.
2.  [Map Azure CDN content to a custom
    domain](../cdn/cdn-map-content-to-custom-domain.md).
3.  [Enable HTTPS on an Azure CDN custom
    domain](../cdn/cdn-custom-ssl.md).

## Shared Access Signatures

If your blob storage endpoint is configured to disallow anonymous read access,
you will need to provide a [Shared Access Signature
(SAS)](storage-dotnet-shared-access-signature-part-1.md)
token in each request you make to your custom domain. By default, blob storage
endpoints disallow anonymous read access. See [Managing anonymous read access to
containers and
blobs](storage-manage-access-to-resources.md)
for more information on shared access signatures.

Azure CDN does not respect any restrictions added to the SAS token. For example,
all SAS tokens have an expiration time. This means that content can still be
accessed with an expired SAS until that content is purged from the CDN edge
nodes. You can control how long data is cached on the CDN by setting the cache
response header. See [Managing expiration of Azure Storage blobs in Azure
CDN](../cdn/cdn-manage-expiration-of-blob-content.md)
for instructions.

If you create multiple SAS URLs for the same blob endpoint, we recommend turning
on query string caching for your Azure CDN. This is to ensure that each URL is
treated as a unique entity. See [Controlling Azure CDN caching behavior with
query strings](../cdn/cdn-query-string.md) for
more information.

## HTTP to HTTPS redirection

You can elect to redirect HTTP traffic to HTTPS. This requires use of the Azure
CDN premium offering from Verizon. You need to [Override HTTP behavior using the
Azure CDN rules
engine](../cdn/cdn-rules-engine.md) with the
following rule:

![](./media/storage-https-custom-domain-cdn/redirect-to-https.png)

“Cdn-endpoint-name” refers to the name that you configured for your CDN
endpoint. You can select this value from the dropdown. “Origin-path” refers to
the path within your origin storage account where your static content resides.
If you are hosting all static content in a single container, replace
“origin-path” with the name of that container.

For a deeper dive into rules, please see the [Azure CDN rules engine
features](../cdn/cdn-rules-engine-reference-features.md).

## Pricing and billing

When you access blobs through an Azure CDN, you pay [Blob storage
prices](https://azure.microsoft.com/pricing/details/storage/blobs/) for
traffic between the edge nodes and the origin (Blob storage), and [CDN
prices](https://azure.microsoft.com/pricing/details/cdn/) for data
accessed from the edge nodes.

For example, say you have a storage account in West US that is being accessed
using an Azure CDN. If someone in the UK tries to access one of the blobs in
that storage account via the CDN, Azure first checks the edge node closest to
the UK for that blob. If found, it accesses that copy of the blob and will use
CDN pricing, because it is being accessed on the CDN. If not found, Azure will
copy the blob to the edge node, which will result in egress and transaction
charges as specified in the Blob storage pricing, and then access the file on
the edge node, which will result in CDN billing.

When looking at the [CDN pricing
page](https://azure.microsoft.com/pricing/details/cdn/), note that HTTPS
support for custom domain names is only available for Azure CDN from Verizon
products (Standard and Premium).

## Next steps

[Configure a custom domain name for your Blob storage endpoint](storage-custom-domain-name.md)
