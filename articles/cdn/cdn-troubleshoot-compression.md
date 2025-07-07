---
ROBOTS: NOINDEX
title: Troubleshooting file compression in Azure Content Delivery Network
description: Learn how to troubleshoot issues with file compression in Azure Content Delivery Network. This article covers several possible causes.
services: cdn
author: halkazwini
ms.author: halkazwini
manager: kumudd
ms.service: azure-cdn
ms.topic: troubleshooting
ms.date: 03/31/2025
# Customer intent: As a web developer, I want to troubleshoot file compression issues in my CDN, so that I can ensure efficient content delivery and improve loading times for users.
---

# Troubleshooting Azure Content Delivery Network file compression

[!INCLUDE [Azure CDN from Microsoft (classic) retirement notice](../../includes/cdn-classic-retirement.md)]

This article helps you troubleshoot issues with [CDN file compression](cdn-improve-performance.md).

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and the Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can also file an Azure Support incident. Go to the [Azure Support site](https://azure.microsoft.com/support/options/) and select **Get Support**.

## Symptom

Compression for your endpoint is enabled, but files are being returned uncompressed.

> [!TIP]
> To check whether your files are being returned compressed, you need to use a tool like [Fiddler](https://www.telerik.com/fiddler) or your browser's developer tools. Check the HTTP response headers returned with your cached content delivery network content. If there is a header named `Content-Encoding` with a value of **gzip**, **bzip2**, **brotli**, or **deflate**, your content is compressed.
>
> ![Content-Encoding header](./media/cdn-troubleshoot-compression/cdn-content-header.png)
>
>

## Cause

There are several possible causes, including:

- The requested content isn't eligible for compression.
- Compression isn't enabled for the requested file type.
- The HTTP request didn't include a header requesting a valid compression type.
- Origin is sending chunked content.

## Troubleshooting steps

> [!TIP]
> As with deploying new endpoints, content delivery network configuration changes take some time to propagate through the network. Usually, changes are applied within 90 minutes. If this is the first time you've set up compression for your content delivery network endpoint, you should consider waiting 1-2 hours to be sure the compression settings have propagated to the POPs.
>

### Verify the request

First, we should do a quick sanity check on the request. You can use your browser's developer tools to view the requests being made.

- Verify the request is being sent to your endpoint URL, `<endpointname>.azureedge.net`, and not your origin.
- Verify the request contains an **Accept-Encoding** header, and the value for that header contains **gzip**, **deflate**, **brotli**, or **bzip2**.

![CDN request headers](./media/cdn-troubleshoot-compression/cdn-request-headers.png)

### Verify compression settings

Navigate to your endpoint in the [Azure portal](https://portal.azure.com) and select the **Configure** button.

- Verify compression is enabled.
- Verify the MIME type for the content to be compressed is included in the list of compressed formats.

### Check the request at the origin server for a **Via** header

The **Via** HTTP header indicates to the web server that the request is being passed by a proxy server. Microsoft IIS web servers by default don't compress responses when the request contains a **Via** header. To override this behavior, perform the following:

- **IIS 6:** [Set HcNoCompressionForProxies="FALSE" in the IIS Metabase properties](/previous-versions/iis/6.0-sdk/ms525390(v=vs.90))
- **IIS 7 and up:** [Set both **noCompressionForHttp10** and **noCompressionForProxies** to False in the server configuration](https://www.iis.net/configreference/system.webserver/httpcompression)
