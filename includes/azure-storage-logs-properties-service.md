---
 author: normesta
 ms.service: storage
 ms.topic: include
 ms.date: 09/28/2020
 ms.author: normesta
---

| Property | Description |
|:--- |:---|
|**accountName** | The name of the storage account. For example: `mystorageaccount`.  |
|**requestUrl** | The URL that is requested. |
|**userAgentHeader** | The **User-Agent header** value, in quotes. For example: `WA-Storage/6.2.0 (.NET CLR 4.0.30319.42000; Win32NT 6.2.9200.0)`.|
|**referrerHeader** | The **Referrer** header value. For example: `http://contoso.com/about.html`.|
|**clientRequestId** | The **x-ms-client-request-id** header value of the request. For example: `360b66a6-ad4f-4c4a-84a4-0ad7cb44f7a6`. |
|**etag** | The ETag identifier for the returned object, in quotes. For example: `0x8D101F7E4B662C4`.  |
|**serverLatencyMs** | The total time expressed in milliseconds to perform the requested operation. This value doesn't include network latency (the time to read the incoming request and send the response to the requester). For example: `22`. |
|**serviceType** | The service associated with this request. For example: `blob`, `table`, `files`, or `queue`. |
|**operationCount** | The number of each logged operation that is involved in the request. This count starts with an index of `0`. Some requests require more than one operation. Most requests perform only one operation. For example: `1`. |
|**requestHeaderSize** | The size of the request header expressed in bytes. For example: `578`. <br>If a request is unsuccessful, this value might be empty. |
|**requestBodySize** | The size of the request packets, expressed in bytes, that are read by the storage service. <br> For example: `0`. <br>If a request is unsuccessful, this value might be empty.  |
|**responseHeaderSize** | The size of the response header expressed in bytes. For example: `216`. <br>If a request is unsuccessful, this value might be empty.  |
|**responseBodySize** | The size of the response packets written by the storage service, in bytes. If a request is unsuccessful, this value may be empty. For example: `216`.  |
|**requestMd5** | The value of either the **Content-MD5** header or the **x-ms-content-md5** header in the request. The MD5 hash value specified in this field represents the content in the request. For example: `788815fd0198be0d275ad329cafd1830`. <br>This field can be empty.  |
|**serverMd5** | The value of the MD5 hash calculated by the storage service. For example: `3228b3cf1069a5489b298446321f8521`. <br>This field can be empty.  |
|**lastModifiedTime** | The Last Modified Time (LMT) for the returned object.  For example: `Tuesday, 09-Aug-11 21:13:26 GMT`. <br>This field is empty for operations that can return multiple objects. |
|**conditionsUsed** | A semicolon-separated list of key-value pairs that represent a condition. The conditions can be any of the following: <li> If-Modified-Since <li> If-Unmodified-Since <li> If-Match <li> If-None-Match  <br> For example: `If-Modified-Since=Friday, 05-Aug-11 19:11:54 GMT`. |
|**contentLengthHeader** | The value of the Content-Length header for the request sent to the storage service. If the request was successful, this value is equal to requestBodySize. If a request is unsuccessful, this value may not be equal to requestBodySize, or it might be empty. |
|**tlsVersion** | The TLS version used in the connection of request. For example: `TLS 1.2`. |
|**smbTreeConnectID** | The Server Message Block (SMB) **treeConnectId** established at tree connect time. For example: `0x3` |
|**smbPersistentHandleID** | Persistent handle ID from an SMB2 CREATE request that survives network reconnects.  Referenced in [MS-SMB2](/openspecs/windows_protocols/ms-smb2/f1d9b40d-e335-45fc-9d0b-199a31ede4c3) 2.2.14.1 as **SMB2_FILEID.Persistent**. For example: `0x6003f` |
|**smbVolatileHandleID** | Volatile handle ID from an SMB2 CREATE request that is recycled on network reconnects.  Referenced in [MS-SMB2](/openspecs/windows_protocols/ms-smb2/f1d9b40d-e335-45fc-9d0b-199a31ede4c3) 2.2.14.1 as **SMB2_FILEID.Volatile**. For example: `0xFFFFFFFF00000065` |
|**smbMessageID** | The connection relative **MessageId**. For example: `0x3b165` |
|**smbCreditsConsumed** | The ingress or egress consumed by the request, in units of 64k. For example: `0x3` |
|**smbCommandDetail** | More information about this specific request rather than the general type of request. For example: `0x2000 bytes at offset 0xf2000` |
|**smbFileId** | The **FileId** associated with the file or directory.  Roughly analogous to an NTFS FileId. For example: `0x9223442405598953` |
|**smbSessionID** | The SMB2 **SessionId** established at session setup time. For example: `0x8530280128000049` |
|**smbCommandMajor	uint32** | Value in the **SMB2_HEADER.Command**. Currently, this is a number between 0 and 18 inclusive. For example: `0x6` |
|**smbCommandMinor** | The subclass of **SmbCommandMajor**, where appropriate. For example: `DirectoryCloseAndDelete` |