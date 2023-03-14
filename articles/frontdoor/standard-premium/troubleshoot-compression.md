---
title: Troubleshooting file compression in Azure Front Door
description: Learn how to troubleshoot issues with file compression in Azure Front Door. This article covers several possible causes.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 03/20/2022
ms.author: duau
---

# Troubleshooting Azure Front Door file compression

This article helps you troubleshoot Azure Front Door file compression issues.

## Symptom

Compression for your route is enabled, but files are being returned uncompressed.

> [!TIP]
> To check whether your files are being returned compressed, you need to use a tool like [Fiddler](https://www.telerik.com/fiddler) or your browser's [developer tools](https://developer.microsoft.com/microsoft-edge/platform/documentation/f12-devtools-guide/).  Check the HTTP response headers returned with your cached CDN content.  If there is a header named `Content-Encoding` with a value of **gzip**, **bzip2**, or **deflate**, your content is compressed.
> 
> ![Content-Encoding header](../media/troubleshoot-compression/content-header.png)
> 

## Cause

There are several possible causes, including:

* The requested content isn't eligible for compression.
* Compression isn't enabled for the requested file type.
* The HTTP request didn't include a header requesting a valid compression type.
* Origin is sending chunked content.

## Troubleshooting steps

> [!TIP]
> As with deploying new endpoints, Azure Front Door configuration changes take some time to propagate through the network. Usually, changes are applied within 10 minutes.  If this is the first time you've set up compression for your CDN endpoint, you should consider waiting 1-2 hours to be sure the compression settings have propagated to the POPs. 
> 

### Verify the request

First, we should double check on the request. You can use your browser's **[developer tools](https://developer.microsoft.com/microsoft-edge/platform/documentation/f12-devtools-guide/)** to view the requests being made.

* Verify the request is being sent to your endpoint URL,`<endpointname>.z01.azurefd.net`, and not your origin.
* Verify the request contains an **Accept-Encoding** header, and the value for that header contains **gzip**, **deflate**, or **bzip2**.

![CDN request headers](../media/troubleshoot-compression/request-headers.png)

### Verify compression settings

Navigate to your endpoint in the [Azure portal](https://portal.azure.com) and select the **Configure** button in the Routes panel. Verify compression is **enabled**.

![CDN compression settings](../media/troubleshoot-compression/compression-settings.png)

### Check the request at the origin server for a **Via** header

The **Via** HTTP header indicates to the web server that the request is being passed by a proxy server.  Microsoft IIS web servers by default don't compress responses when the request contains a **Via** header.  To override this behavior, do the following:

* **IIS 6**: Set HcNoCompressionForProxies="FALSE" in the IIS Metabase properties. For for information, see [IIS 6 Compression](/previous-versions/iis/6.0-sdk/ms525390(v=vs.90)).
* **IIS 7 and up**: Set both **noCompressionForHttp10** and **noCompressionForProxies** to *False* in the server configuration. For more information, see, [HTTP Compression](https://www.iis.net/configreference/system.webserver/httpcompression).

## Next steps

For answers to Azure Front Door common questions, see [Azure Front Door FAQ](../front-door-faq.yml).
