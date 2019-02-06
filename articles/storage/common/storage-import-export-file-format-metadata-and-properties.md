---
title: Azure Import/Export metadata and properties file format | Microsoft Docs
description: Learn how to specify metadata and properties for one or more blobs that are part of an import or export job.
author: muralikk
services: storage
ms.service: storage
ms.topic: article
ms.date: 01/23/2017
ms.author: muralikk
ms.subservice: common
---
# Azure Import/Export service metadata and properties file format
You can specify metadata and properties for one or more blobs as part of an import job or an export job. To set metadata or properties for blobs being created as part of an import job, you provide a metadata or properties file on the hard drive containing the data to be imported. For an export job, metadata and properties are written to a metadata or properties file that is included on the hard drive returned to you.  
  
## Metadata file format  
The format of a metadata file is as follows:  
  
```xml
<?xml version="1.0" encoding="UTF-8"?>  
<Metadata>  
[<metadata-name-1>metadata-value-1</metadata-name-1>]  
[<metadata-name-2>metadata-value-2</metadata-name-2>]  
. . .  
</Metadata>  
```
  
|XML Element|Type|Description|  
|-----------------|----------|-----------------|  
|`Metadata`|Root element|The root element of the metadata file.|  
|`metadata-name`|String|Optional. The XML element specifies the name of the metadata for the blob, and its value specifies the value of the metadata setting.|  
  
## Properties file format  
The format of a properties file is as follows:  
  
```xml
<?xml version="1.0" encoding="UTF-8"?>  
<Properties>  
[<Last-Modified>date-time-value</Last-Modified>]  
[<Etag>etag</Etag>]  
[<Content-Length>size-in-bytes<Content-Length>]  
[<Content-Type>content-type</Content-Type>]  
[<Content-MD5>content-md5</Content-MD5>]  
[<Content-Encoding>content-encoding</Content-Encoding>]  
[<Content-Language>content-language</Content-Language>]  
[<Cache-Control>cache-control</Cache-Control>]  
</Properties>  
```
  
|XML Element|Type|Description|  
|-----------------|----------|-----------------|  
|`Properties`|Root element|The root element of the properties file.|  
|`Last-Modified`|String|Optional. The last-modified time for the blob. For export jobs only.|  
|`Etag`|String|Optional. The blob's ETag value. For export jobs only.|  
|`Content-Length`|String|Optional. The size of the blob in bytes. For export jobs only.|  
|`Content-Type`|String|Optional. The content type of the blob.|  
|`Content-MD5`|String|Optional. The blob's MD5 hash.|  
|`Content-Encoding`|String|Optional. The blob's content encoding.|  
|`Content-Language`|String|Optional. The blob's content language.|  
|`Cache-Control`|String|Optional. The cache control string for the blob.|  

## Next steps

See [Set blob properties](/rest/api/storageservices/set-blob-properties), [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata), and [Setting and retrieving properties and metadata for blob resources](/rest/api/storageservices/setting-and-retrieving-properties-and-metadata-for-blob-resources) for detailed rules about setting blob metadata and properties.
