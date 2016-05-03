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
	ms.date="04/21/2016" 
	ms.author="casoper"/>

# Improve performance by compressing files

This topic discusses how to improve file transfer speed and increase page load performance by compressing your files.

There are two ways CDN can support compression:

- You can enable compression on your origin server, in which case the CDN will support compression by default and deliver compressed files to clients.
- You can enable compression directly on CDN edge servers, in which case the CDN will compress the files and serve it to end users.

## Enabling compression

> [AZURE.NOTE] The Standard and Premium CDN tiers provide the same compression functionality, but the user interface differs.  For more information about the differences between Standard and Premium CDN tiers, see [Azure CDN Overview](cdn-overview.md).

### Standard tier

1. From the CDN profile blade, click the CDN endpoint you wish to manage.

	![CDN profile blade endpoints](./media/cdn-file-compression/cdn-endpoints.png)

	The CDN endpoint blade opens.

2. Click the **Configure** button.

	![CDN profile blade manage button](./media/cdn-file-compression/cdn-config-btn.png)

	The CDN Configuration blade opens.

3. Turn on **Compression**.

	![CDN compression options](./media/cdn-file-compression/cdn-compress-standard.png)

4. Use the default types, or modify the list by removing or adding file types.

5. After making your changes, click the **Save** button.

### Premium tier

1. From the CDN profile blade, click the **Manage** button.

	![CDN profile blade manage button](./media/cdn-file-compression/cdn-manage-btn.png)

	The CDN management portal opens.

2. Hover over the **HTTP Large** tab, then hover over the **Cache Settings** flyout.  Click on **Compression**.

	Compression options are displayed.

	![File compression](./media/cdn-file-compression/cdn-compress-files.png)

3. After modifying the list of file types, click the **Update** button.


## Compression process

### Overview

1. Requester sends a request for content.

2. An edge server checks whether there is an **Accept-Encoding** header.
	1. If included, this header identifies the requested compression method.
		> [AZURE.NOTE] Supported compression methods are **gzip**, **deflate**, and **bzip2**.
	2. If missing, this type of request will be served in an uncompressed format.
	
3.	The closest edge POP checks the cache status, compression method, and if it still has a valid time-to-live.
	1.	Cache **Miss**: If the requested version is not cached, the request is forwarded to the origin.
	2.	Cache **Hit**: If the requested version is cached with the requested compression method, the edge server will immediately deliver the compressed content to the client.
	3.	Cache **Hit**: If the file is cached with different compression method, the edge server will transcode the asset to the requested compression method.
	4.	Cache **Hit**: If the file is cached in an uncompressed format, a check will be performed to determine whether the request is eligible for edge server compression.  If eligible, the edge server will compress the file and serve it to the client.  Otherwise, it will return the uncompressed content.
		> [AZURE.NOTE] To be eligible for compression, a file must:
		>	1. Be larger than 128 bytes.
		>	2. Be smaller than 1 MB.
		>	3. Be a MIME type that has been [configured for compression](#enabling-compression).

### Tables

The tables below describe CDN compression behavior for every scenario.

#### Compression disabled or file is ineligible for compression

|Requested format|Cached file|CDN response|Notes|
|----------------|-----------|------------|-----|
|Compressed|Compressed|Compressed|CDN transcodes between supported formats|
|Compressed|Uncompressed|Uncompressed|    |	
|Compressed|Not cached|Compressed or Uncompressed|Depends on origin response|
|Uncompressed|Compressed|Uncompressed|CDN will go back to origin for uncompressed version|
|Uncompressed|Uncompressed|Uncompressed|    |	
|Uncompressed|Not cached|Uncompressed|     |

#### Compression enabled and file is eligible for compression

|Requested format|Cached file|CDN response|Notes|
|----------------|-----------|------------|-----|
|Compressed|Compressed|Compressed|CDN transcodes between supported formats|
|Compressed|Uncompressed|Compressed|CDN performs compression|
|Compressed|Not cached|Compressed|CDN performs compression if origin returns uncompressed|
|Uncompressed|Compressed|Uncompressed|CDN performs decompression|
|Uncompressed|Uncompressed|Uncompressed|     |	
|Uncompressed|Not cached|Uncompressed|     |	


## Notes

1. Only one file version (compressed or uncompressed) will be cached on the edge server. A request for a different version will result in the content being transcoded by the edge server.
2. For Media Services CDN enabled streaming endpoints, compression is enabled by default for the following content types: application/vnd.ms-sstr+xml, application/dash+xml,application/vnd.apple.mpegurl, application/f4m+xml. You cannot enable/disable compression for the mentioned types using the Azure portal.  
3. While possible, it is not recommended to apply compression on compressed media formats, such as MP3, MP4, JPG, etc.

## See also
- [Troubleshooting CDN file compression](cdn-troubleshoot-compression.md)    
