---
title: Troubleshooting file compression in Azure Front Door
description: Learn how to troubleshoot issues with file compression in Azure Front Door. This article covers several possible causes.
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 11/18/2024
ms.author: duau
---

# Troubleshooting Azure Front Door file compression
This article helps you troubleshoot file compression issues in Azure Front Door.

## Symptom

Compression is enabled for your route, but files are being returned uncompressed.

> [!TIP]
> To check if your files are compressed, use a tool like [Fiddler](https://www.telerik.com/fiddler) or your browser's [developer tools](/microsoft-edge/devtools-guide-chromium/overview). Look for the `Content-Encoding` header in the HTTP response. If it has a value of **gzip**, **bzip2**, or **deflate**, your content is compressed.
> 
> ![Content-Encoding header](../media/troubleshoot-compression/content-header.png)

## Cause

Possible causes include:

* The content isn't eligible for compression.
* Compression isn't enabled for the file type.
* The HTTP request lacks a valid compression type header.
* The origin is sending chunked content.

## Troubleshooting steps

> [!TIP]
> Azure Front Door configuration changes can take up to 10 minutes to propagate. If this is your first time setting up compression, wait 1-2 hours to ensure settings have propagated to the POPs.

### Verify the request

Use your browser's **[developer tools](/microsoft-edge/devtools-guide-chromium/overview)** to check the requests:

* Ensure the request is sent to `<endpointname>.z01.azurefd.net`, not your origin.
* Ensure the request includes an **Accept-Encoding** header with **gzip**, **deflate**, or **bzip2**.

![CDN request headers](../media/troubleshoot-compression/request-headers.png)

### Verify compression settings

In the [Azure portal](https://portal.azure.com), navigate to your endpoint and select **Configure** in the Routes panel. Ensure compression is **enabled**.

![CDN compression settings](../media/troubleshoot-compression/compression-settings.png)

### Check the request at the origin server for a **Via** header

The **Via** header indicates a proxy server. By default, Microsoft IIS servers don't compress responses with a **Via** header. To override this:

* **IIS 6**: Set HcNoCompressionForProxies="FALSE" in the IIS Metabase properties. See [IIS 6 Compression](/previous-versions/iis/6.0-sdk/ms525390(v=vs.90)).
* **IIS 7 and up**: Set **noCompressionForHttp10** and **noCompressionForProxies** to *False* in the server configuration. See [HTTP Compression](https://www.iis.net/configreference/system.webserver/httpcompression).

## Next steps

For more information, see [Azure Front Door FAQ](../front-door-faq.yml).
