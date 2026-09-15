---
title: Static website hosting FAQ
titleSuffix: Azure Blob Storage
description: Frequently asked questions about static website hosting in Azure Blob Storage.
ms.topic: faq
ms.service: azure-blob-storage
ms.date: 08/24/2026
ms.author: normesta
author: normesta
---

# Static website hosting FAQ

This article answers frequently asked questions about static website hosting in Azure Blob Storage.

## Does the Azure Storage firewall work with a static website?

Yes. Storage account [network security rules](../common/storage-network-security.md), including IP-based and virtual network firewalls, work with the static website endpoint. Use these rules to protect your website.

## Do static websites support Microsoft Entra ID?

No. A static website only supports anonymous public read access for files in the **$web** container.

## How do I use a custom domain with a static website?

Configure a [custom domain](./static-website-content-delivery-network.md) with a static website by using [Azure Content Delivery Network (Azure CDN)](./storage-custom-domain-name.md#map-a-custom-domain-with-https-enabled). Azure CDN provides consistent low latencies to your website from anywhere in the world.

## How do I use a custom Secure Sockets Layer (SSL) certificate with a static website?

Configure a [custom SSL](./static-website-content-delivery-network.md) certificate with a static website by using [Azure CDN](./storage-custom-domain-name.md#map-a-custom-domain-with-https-enabled). Azure CDN provides consistent low latencies to your website from anywhere in the world.

## How do I add custom headers and rules with a static website?

Configure the host header for a static website by using [Azure CDN - Verizon Premium](../../cdn/cdn-verizon-premium-rules-engine.md). We'd be interested to hear your feedback [here](https://feedback.azure.com/d365community/idea/694b08ef-3525-ec11-b6e6-000d3a4f0f84).

## Why am I getting an HTTP 404 error from a static website?

A 404 error can happen if you refer to a file name by using an incorrect case. For example: `Index.html` instead of `index.html`. File names and extensions in the URL of a static website are case-sensitive even though they're served over HTTP. This error can also happen if your Azure CDN endpoint isn't yet provisioned. Wait up to 90 minutes after you provision a new Azure CDN for the propagation to complete.

## Why isn't the root directory of the website redirecting to the default index page?

In the Azure portal, open the static website configuration page of your account and locate the name and extension that is set in the **Index document name** field. Ensure that this name is exactly the same as the name of the file located in the **$web** container of the storage account. File names and extensions in the URL of a static website are case-sensitive even though they're served over HTTP.

## Related content

- [Static website hosting in Azure Storage](storage-blob-static-website.md)
- [Host a static website in Azure Storage](storage-blob-static-website-how-to.md)
- [Integrate a static website with Azure CDN](static-website-content-delivery-network.md)
