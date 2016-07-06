<properties
	pageTitle="CDN - Improve performance by compressing files"
	description="You can improve file transfer speed and increases page load performance by compressing your files."
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
	ms.date="07/06/2016"
	ms.author="casoper"/>

# Improve performance by compressing files

Compression is a simple and effective method to improve file transfer speed and increase page load performance by reducing file size before it is sent from the server. It reduces bandwidth costs and provides a more responsive experience for your users.

There are two ways to enable compression:

- You can enable compression on your origin server, in which case the CDN will pass through the compressed files and deliver compressed files to clients that request them.
- You can enable compression directly on CDN edge servers, in which case the CDN will compress the files and serve it to end users, even if they are not compressed by the origin server.

> [AZURE.IMPORTANT] CDN configuration changes take some time to propagate through the network.  For <b>Azure CDN from Akamai</b> profiles, propagation usually completes in under one minute.  For <b>Azure CDN from Verizon</b> profiles, you will usually see your changes apply within 90 minutes.  If this is the first time you've set up compression for your CDN endpoint, you should consider waiting 1-2 hours to be sure the compression settings have propagated to the POPs before troubleshooting

## Enabling compression

> [AZURE.NOTE] The Standard and Premium CDN tiers provide the same compression functionality, but the user interface differs.  For more information about the differences between Standard and Premium CDN tiers, see [Azure CDN Overview](cdn-overview.md).

### Standard tier

> [AZURE.NOTE] This section applies to **Azure CDN Standard from Verizon** and **Azure CDN Standard from Akamai** profiles.

1. From the CDN profile blade, click the CDN endpoint you wish to manage.

	![CDN profile blade endpoints](./media/cdn-file-compression/cdn-endpoints.png)

	The CDN endpoint blade opens.

2. Click the **Configure** button.

	![CDN profile blade manage button](./media/cdn-file-compression/cdn-config-btn.png)

	The CDN Configuration blade opens.

3. Turn on **Compression**.

	![CDN compression options](./media/cdn-file-compression/cdn-compress-standard.png)

4. Use the default types, or modify the list by removing or adding file types.
	
	> [AZURE.TIP] While possible, it is not recommended to apply compression to compressed formats, such as ZIP, MP3, MP4, JPG, etc.
	
5. After making your changes, click the **Save** button.

### Premium tier

> [AZURE.NOTE] This section applies to **Azure CDN Premium from Verizon** profiles.

1. From the CDN profile blade, click the **Manage** button.

	![CDN profile blade manage button](./media/cdn-file-compression/cdn-manage-btn.png)

	The CDN management portal opens.

2. Hover over the **HTTP Large** tab, then hover over the **Cache Settings** flyout.  Click on **Compression**.

	Compression options are displayed.

	![File compression](./media/cdn-file-compression/cdn-compress-files.png)

3. Enable compression by clicking the **Compression Enabled** radio button.  Enter the MIME types you wish to compress as a comma-delimited list (no spaces) in the **File Types** textbox.
		
	> [AZURE.TIP] While possible, it is not recommended to apply compression to compressed formats, such as ZIP, MP3, MP4, JPG, etc. 

4. After making your changes, click the **Update** button.


## Compression rules

These tables describe Azure CDN compression behavior for every scenario.

> [AZURE.IMPORTANT] For **Azure CDN from Verizon** (Standard and Premium), only eligible files are compressed.  To be eligible for compression, a file must:
>
> - Be larger than 128 bytes.
> - Be smaller than 1 MB.
> 
> For **Azure CDN from Akamai**, all files are eligible for compression.
>
> For all Azure CDN products, a file must be a MIME type that has been [configured for compression](#enabling-compression).
>
> **Azure CDN from Verizon** profiles (Standard and Premium) support **gzip**, **deflate**, or **bzip2** encoding.  **Azure CDN from Akamai** profiles only support **gzip** encoding.
>
> **Azure CDN from Akamai** endpoints always request **gzip** encoded files from the origin, regardless of the client request.

### Compression disabled or file is ineligible for compression

|Client requested format (via Accept-Encoding header)|Cached file format|CDN response to the client|Notes|
|----------------|-----------|------------|-----|
|Compressed|Compressed|Compressed|   |
|Compressed|Uncompressed|Uncompressed|    |	
|Compressed|Not cached|Compressed or Uncompressed|Depends on origin response|
|Uncompressed|Compressed|Uncompressed|    |
|Uncompressed|Uncompressed|Uncompressed|    |	
|Uncompressed|Not cached|Uncompressed|     |

### Compression enabled and file is eligible for compression

|Client requested format (via Accept-Encoding header)|Cached file format|CDN response to the client|Notes|
|----------------|-----------|------------|-----|
|Compressed|Compressed|Compressed|CDN transcodes between supported formats|
|Compressed|Uncompressed|Compressed|CDN performs compression|
|Compressed|Not cached|Compressed|CDN performs compression if origin returns uncompressed.  **Azure CDN from Verizon** will pass the uncompressed file on the first request and then compress and cache the file for subsequent requests.  Files with `Cache-Control: no-cache` header will never be compressed. 
|Uncompressed|Compressed|Uncompressed|CDN performs decompression|
|Uncompressed|Uncompressed|Uncompressed|     |	
|Uncompressed|Not cached|Uncompressed|     |

## Media Services CDN Compression

For Media Services CDN enabled streaming endpoints, compression is enabled by default for the following content types: application/vnd.ms-sstr+xml, application/dash+xml,application/vnd.apple.mpegurl, application/f4m+xml. You cannot enable/disable compression for the mentioned types using the Azure portal.  

## See also
- [Troubleshooting CDN file compression](cdn-troubleshoot-compression.md)    
