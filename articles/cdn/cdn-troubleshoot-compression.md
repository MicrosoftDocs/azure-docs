<properties
	pageTitle="CDN - Troubleshooting file compression"
	description="Troubleshoot issues with CDN file compression."
	services="cdn"
	documentationCenter=".NET"
	authors="camsoper"
	manager="erikre"
	editor=""/>

<tags
	ms.service="cdn"
	ms.workload="tbd"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/28/2016" 
	ms.author="casoper"/>
    
# Troubleshooting CDN file compression

This article helps you troubleshoot issues with [CDN file compression](cdn-improve-performance.md).

If you need more help at any point in this article, you can contact the Azure experts on [the MSDN Azure and the Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can also file an Azure support incident. Go to the [Azure Support site](https://azure.microsoft.com/support/options/) and click on **Get Support**.

## Symptom

Compression for your endpoint is enabled, but files are being returned uncompressed.

## Cause

There are several possible causes, including:

- The requested content is not eligible for compression.
- Compression is not enabled for the requested file type.
- The HTTP request did not include a header requesting a valid compression type.

## Troubleshooting steps

> [AZURE.TIP] As with deploying new endpoints, CDN configuration changes take some time to propagate through the network.  In most cases, you will see your changes apply within 90 minutes.  If this is the first time you've set up compression for your CDN endpoint, you should consider waiting 1-2 hours to be sure the compression settings have propagated to the POPs. 

### Verify the request

First, we should do a quick sanity check on the request.  You can use your browser's [developer tools](https://developer.microsoft.com/microsoft-edge/platform/documentation/f12-devtools-guide/) to view the requests being made.

- Verify the request is being sent to your endpoint URL, `<endpointname>.azureedge.net`, and not your origin.
- Verify the request contains an **Accept-Encoding** header, and the value for that header contains **gzip**, **deflate**, or **bzip2**.

![CDN request headers](./media/cdn-troubleshoot-compression/cdn-request-headers.png)

### Verify compression settings (Standard CDN profile)

> [AZURE.NOTE] This step only applies if your CDN profile is in the **Standard** pricing tier.

Navigate to your endpoint in the [Azure Portal](https://portal.azure.com) and click the **Configure** button.

- Verify compression is enabled.
- Verify the MIME type for the content to be compressed is included in the list of compressed formats.

![CDN compression settings](./media/cdn-troubleshoot-compression/cdn-compression-settings.png)

### Verify compression settings (Premium CDN profile)

> [AZURE.NOTE] This step only applies if your CDN profile is in the **Premium** pricing tier.

Navigate to your endpoint in the [Azure Portal](https://portal.azure.com) and click the **Manage** button.  The supplemental portal will open.  Hover over the **HTTP Large** tab, then hover over the **Cache Settings** flyout.  Click on **Compression**. 

- Verify compression is enabled.
- Verify the **File Types** list contains a comma-separated list (no spaces) of MIME types.
- Verify the MIME type for the content to be compressed is included in the list of compressed formats.

![CDN premium compression settings](./media/cdn-troubleshoot-compression/cdn-compression-settings-premium.png)

### Verify the content is cached

Using your browser's developer tools, check the response headers to ensure the file is cached in the region where it is being requested.

- Check the **Server** response header.  The header should have the format **Platform (POP/Server ID)**, as seen in the example below.
- Check the **X-Cache** response header.  The header should read **HIT**.  

![CDN response headers](./media/cdn-troubleshoot-compression/cdn-response-headers.png)

### Verify the file meets the size requirements

In order to be eligible for compression, a file must meet the following size requirements:

- Larger than 128 bytes.
- Smaller than 1 MB.