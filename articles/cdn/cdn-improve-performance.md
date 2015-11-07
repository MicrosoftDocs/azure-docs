<properties 
	pageTitle="CDN - Improve performance by compressing files" 
	description="You can improve file transfer speed and increases page load performance by compressing your files." 
	services="cdn" 
	documentationCenter=".NET" 
	authors="juliako" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="cdn" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="09/01/2015" 
	ms.author="juliako"/>

#Improve performance by compressing files

This topic discusses how to improve file transfer speed and increases page load performance by compressing your files.

There are two ways CDN can support compression: 

- You can enable compression on your origin server, in which case the CDN will support compression by default and deliver compressed files to clients. 
- You can enable compression directly on CDN edge servers, in which case the CDN will compress the files and serve it to end users.

##Definitions

- **Accept-Encoding** request header - This header indicates the compression methods a user agent supports. It must be included in the request header. For more information, see [Header Field Definitions](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html).
- **Content type** - A list of content types needs to be added for compression. Only text files are eligible for compression. E.g. text/plain, text/html.
- **Compression method** - Supported compression methods are gzip/deflate/bzip2, a supported method must be set in the Accept-Encoding Request Header. 
- **Cache status** - Cache status identifies whether the requested content is already cached on the POP closest to the requester.  
- **File size** - By default compression only supports files larger than 1 byte and smaller than 1MB.  

##Workflow

1. Requester sends a request for content.
2. An edge server checks whether there is **Accept-Encoding** header.
	1. If included, this header identifies the requested compression method.
	1. If missing, this type of request will be served in an uncompressed format.
3.	The closest edge POP checks the cache status, compression method and if it still has a valid TTL.
	1.	Cache Miss:  if the requested version is not cached, the request is forwarded to the origin.
	2.	Cache HIT with same compression method: The edge server will immediately deliver the compressed content to the client.
	3.	Cache HIT with different compression method: The edge server will transcode the asset to the requested compression method. 
	4.	Cache HIT and uncompressed : if the initial request caused the asset to be cached in an uncompressed format, then a check will be performed to see whether the request is eligible for edge server compression (based on the criteria in the definition/requirement section above.)
		1.	If eligible, the edge server will compress the file and serve it to the client.
		2.	If not eligible: the edge server will immediately deliver the uncompressed content to the client. 

![File compression](./media/cdn-file-compression/cdn-compress-files.png)

##Considerations 

1. For Media Services CDN enabled streaming endpoints, compression is enabled by default for the following content types: application/vnd.ms-sstr+xml,application/dash+xml,application/vnd.apple.mpegurl,application/f4m+xml. You cannot enable/disable compression for the mentioned types using the Azure portal.  
2. Only one file version (compressed or uncompressed) will be cached on the edge server. A request for a different version will result in the content being transcoded by the edge server.  