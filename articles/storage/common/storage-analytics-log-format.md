---
title: "Storage Analytics Log Format"
ms.custom: na
ms.date: 2016-06-29
ms.prod: azure
ms.reviewer: na
ms.service: storage
ms.suite: na
ms.tgt_pltfrm: na
ms.topic: reference
ms.assetid: f2bc5951-c6f4-4496-9b8e-be95a328eb36
caps.latest.revision: 18
author: tamram
manager: carolz
translation.priority.mt:
  - de-de
  - es-es
  - fr-fr
  - it-it
  - ja-jp
  - ko-kr
  - pt-br
  - ru-ru
  - zh-cn
  - zh-tw
---
# Storage Analytics Log Format
Each log entry conforms to a standard log format that is determined by the version of Storage Analytics Logging. The first field in a log entry always specifies the version number. Consumers of logging data can take a dependency on this field as well as the following aspects of a log entry:  

-   All fields, populated or empty, will be separated by a semicolon “;”  

-   Each log entry is separated by a newline character “\n”  

-   The last field in the entry will not end with a semicolon “;”  

 Always check the version before processing a log entry.  

> [!NOTE]
>  Any field that may contain a quote (“), a semicolon (;), or a newline (\n) is HTML encoded and quoted.  

## Log Entry Format  
 Each version 1.0 log entry adheres to the following format:  

 `<version-number>;<request-start-time>;<operation-type>;<request-status>;<http-status-code>;<end-to-end-latency-in-ms>;<server-latency-in-ms>;<authentication-type>;<requester-account-name>;<owner-account-name>;<service-type>;<request-url>;<requested-object-key>;<request-id-header>;<operation-count>;<requester-ip-address>;<request-version-header>;<request-header-size>;<request-packet-size>;<response-header-size>;<response-packet-size>;<request-content-length>;<request-md5>;<server-md5>;<etag-identifier>;<last-modified-time>;<conditions-used>;<user-agent-header>;<referrer-header>;<client-request-id>`  

 The following table lists and defines each field in a log entry.  

|Field Name|Field Type|Definition|Example|  
|----------------|----------------|----------------|-------------|  
|`<version-number>`|string|The version of Storage Analytics Logging used to record the entry.|`1.0`|  
|`<request-start-time>`|timestamp|The time in UTC when the request was received by Storage Analytics.|`2011-08-09T21:44:36.2481552Z`|  
|`<operation-type>`|string|The type of REST operation performed. See the [Storage Analytics Logged Operations and Status Messages](Storage-Analytics-Logged-Operations-and-Status-Messages.md) topic for a list of possible operations.|`GetBlob`|  
|`<request-status>`|string|The status of the requested operation. See the [Storage Analytics Logged Operations and Status Messages](Storage-Analytics-Logged-Operations-and-Status-Messages.md) topic for a list of possible status messages. In version 2017-04-17 and later, `ClientOtherError` is not used. Instead, this field contains the [error code](https://docs.microsoft.com/rest/api/storageservices/Common-REST-API-Error-Codes).  |`Success`|  
|`<http-status-code>`|string|The HTTP status code for the request. If the request is interrupted, this value may be set to `Unknown`.|`200`|  
|`<end-to-end-latency-in-ms>`|duration|The total time in milliseconds to perform the requested operation, including the time to read the incoming request and send the response to the requester.|`39`|  
|`<server-latency-in-ms>`|duration|The total time in milliseconds to perform the requested operation. This value does not include network latency (the time to read the incoming request and send the response to the requester).|`22`|  
|`<authentication-type>`|string|Indicates whether the request was authenticated, anonymous, or used Shared Access Signature (SAS).|`authenticated`|  
|`<requester-account-name>`|string|Same as storage account name, if the request is authenticated. This field will be empty for anonymous and SAS requests.|`myaccount`|  
|`<owner-account-name>`|string|The account name of the service owner.|`myaccount`|  
|`<service-type>`|string|The requested storage service: blob, table, or queue.|`blob`|  
|`<request-url>`|string|The complete URL of the request, in quotes.|`"https://myaccount.blob.core.windows.net/mycontainer/2025c44c-d25e-42bf-8507-7a5ca4faa034?timeout=30000"`|  
|`<requested-object-key>`|string|The key of the requested object, in quotes. This field will always use the account name, even if a custom domain name has been configured.|`"/myaccount/mycontainer/2025c44c-d25e-42bf-8507-7a5ca4faa034"`|  
|`<request-id-header>`|guid|The request ID assigned by the storage service. This is equivalent to the value of the `x-ms-request-id` header.|`668a4744-7eb3-4e8f-b8d3-fbfd3829715b`|  
|`<operation-count>`|int|The number of each logged operation for a request, using an index of zero. Some requests require more than one operation, such as Copy Blob, though most perform just one operation.|`0`|  
|`<requester-ip-address>`|string|The IP address of the requester, including the port number.|`192.100.0.102:4362`|  
|`<request-version-header>`|string|The storage service version specified when the request was made. This is equivalent to the value of the `x-ms-version` header.|`2009-09-19`|  
|`<request-header-size>`|long|The size of the request header, in bytes. If a request is unsuccessful, this value may be empty.|`280`|  
|`<request-packet-size>`|long|The size of the request packets read by the storage service, in bytes. If a request is unsuccessful, this value may be empty.|`0`|  
|`<response-header-size>`|long|The size of the response header, in bytes. If a request is unsuccessful, this value may be empty.|`216`|  
|`<response-packet-size>`|long|The size of the response packets written by the storage service, in bytes. If a request is unsuccessful, this value may be empty.|`0`|  
|`<request-content-length>`|long|The value of the `Content-Length` header for the request sent to the storage service. If the request was successful, this value is equal to `<request-packet-size>`. If a request is unsuccessful, this value may not be equal to `<request-packet-size>`, or it may be empty.|`0`|  
|`<request-md5>`|string|The value of either the Content-MD5 header or the x-ms-content-md5 header in the request, in quotes. The MD5 hash value specified in this field represents the content in the request. This field can be empty.|`"788815fd0198be0d275ad329cafd1830"`|  
|`<server-md5>`|string|The value of the MD5 hash calculated by the storage service, in quotes. This field can be empty.|`"3228b3cf1069a5489b298446321f8521"`|  
|`<etag-identifier>`|string|The ETag identifier for the returned object, in quotes.|`"0x8D101F7E4B662C4"`|  
|`<last-modified-time>`|datetime|The Last Modified Time (LMT) for the returned object, in quotes. This field is empty for operations that can return multiple objects.|`Tuesday, 09-Aug-11 21:13:26 GMT`|  
|`<conditions-used>`|string|A semicolon-separated list in the form of `ConditionName=value`, in quotes. `ConditionName` can be one of the following conditions:<br /><br /> -   `If-Modified-Since`<br />-   `If-Unmodified-Since`<br />-   `If-Match`<br />-   `If-None-Match`|`"If-Modified-Since=Friday, 05-Aug-11 19:11:54 GMT"`|  
|`<user-agent-header>`|string|The `User-Agent` header value, in quotes.|`“Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)”`|  
|`<referrer-header>`|string|The `Referer` header value, in quotes.|`"http://contoso.com/about.html"`|  
|`<client-request-id>`|string|The `x-ms-client-request-id` header value included in the request, in quotes.|`"8/9/2011 9:44:36 PM 45ef1c0f-8c71-4153-bc88-38589f63fbfc"`|  

## Sample Log Entries  

### Get Blob  
 The following sample log entry applies to an anonymous **GetBlob** request:  

 `1.0;2014-06-19T22:59:23.1967767Z;GetBlob;AnonymousSuccess;200;17;16;anonymous;;storagesample;blob;"https://storagesample.blob.core.windows.net/sample-container1/00001.txt";"/storagesample/sample-container1/00001.txt";61d2e3f6-bcb7-4cd1-a81e-4f8f497f0da2;0;192.100.0.102:4362;2014-02-14;283;0;354;23;0;;;""0x8D15A2913C934DE"";Thursday, 19-Jun-14 22:58:10 GMT;;"WA-Storage/4.0.1 (.NET CLR 4.0.30319.34014; Win32NT 6.3.9600.0)";;"44dfd78e-7288-4898-8f70-c3478983d3b6"`  

### Put Blob  
 The following sample log entry applies to an authenticated **PutBlob** request:  

 `1.0;2014-06-19T01:33:54.0926521Z;PutBlob;Success;201;197;54;authenticated;storagesample;storagesample;blob;"https://storagesample.blob.core.windows.net/sample-container1/00001.txt";"/storagesample/sample-container1/00001.txt";a200be85-1c98-4dd9-918e-f13d8c0538e0;0;192.100.0.102:4362;2014-02-14;460;23;225;0;23;"DrPO6z1f00SCsomhaf+J/A==";"DrPO6z1f00SCsomhaf+J/A==";""0x8D15975AA456EA4"";Thursday, 19-Jun-14 01:33:53 GMT;;"WA-Storage/4.0.1 (.NET CLR 4.0.30319.34014; Win32NT 6.3.9600.0)";;"1fe6814a-e4cb-4195-a3cf-837dc7120f68"`  

### Copy Blob  
 The following sample log entries apply to an authenticated **CopyBlob** request. The Copy Blob operation will log 3 operations: **CopyBlob**, **CopyBlobSource**, and **CopyBlobDestination**. Note that the request ID property is identical for all three operations, but the operation ID is incremented for each operation.  

 **Version 2012-02-12 and Newer**  

 In version 2012-02-12 and newer, the `<requested-object-key>` is a URL, which replaces the `/accountname/containername/blobname` format used in versions before 2012-02-12.  

 The request ID and operation ID are in bold for each log entry below:  

 `1.0;2014-06-19T23:31:36.5780954Z;CopyBlob;Success;202;13;13;authenticated;storagesample;storagesample;blob;"https://storagesample.blob.core.windows.net/sample-container/Copy-sample-blob.txt";"/storagesample/sample-container/Copy-sample-blob.txt";505fc366-688f-4622-bbb1-20e8fc26cffd;0;192.100.0.102:4362;2014-02-14;538;0;261;0;0;;;""0x8D15A2DBF11553E"";Thursday, 19-Jun-14 23:31:36 GMT;;"WA-Storage/4.0.1 (.NET CLR 4.0.30319.34014; Win32NT 6.3.9600.0)";;"dc00da87-5483-4524-b0dc-d1df025a6a9a"`  

 `1.0;2014-06-19T23:31:36.5780954Z;CopyBlobSource;Success;202;13;13;authenticated;storagesample;storagesample;blob;"https://storagesample.blob.core.windows.net/sample-container/Copy-sample-blob.txt";"https://storagesample.blob.core.windows.net/sample-container/sample-blob.txt";505fc366-688f-4622-bbb1-20e8fc26cffd;1;192.100.0.102:4362;2014-02-14;538;0;261;0;0;;;;;;"WA-Storage/4.0.1 (.NET CLR 4.0.30319.34014; Win32NT 6.3.9600.0)";;"dc00da87-5483-4524-b0dc-d1df025a6a9a"`  

 `1.0;2014-06-19T23:31:36.5780954Z;CopyBlobDestination;Success;202;13;13;authenticated;storagesample;storagesample;blob;"https://storagesample.blob.core.windows.net/sample-container/Copy-sample-blob.txt";"/storagesample/sample-container/Copy-sample-blob.txt";505fc366-688f-4622-bbb1-20e8fc26cffd;2;192.100.0.102:4362;2014-02-14;538;0;261;0;0;;;;;;"WA-Storage/4.0.1 (.NET CLR 4.0.30319.34014; Win32NT 6.3.9600.0)";;"dc00da87-5483-4524-b0dc-d1df025a6a9a"`  

 **Versions Prior to 2012-02-12**  

 The request ID and operation ID are in bold for each log entry below:  

 `1.0;2011-08-09T18:02:40.6526789Z;CopyBlob;Success;201;28;28;authenticated;account8ce1b67a9e80b35;myaccount;blob;"https://myaccount.blob.core.windows.net/thumbnails/lake.jpg?timeout=30000";"/myaccount/thumbnails/lakebck.jpg";85ba10a5-b7e2-495e-8033-588e08628c5d;0;268.20.203.21:4362;2009-09-19;505;0;188;0;0;;;"0x8CE1B67AD473BC5";Friday, 09-Aug-11 18:02:40 GMT;;;;"8/9/2011 6:02:40 PM 683803d3-538f-4ba8-bc7c-24c83aca5b1a"`  

 `1.0;2011-08-09T18:02:40.6526789Z;CopyBlobSource;Success;201;28;28;authenticated;myaccount;myaccount;blob;"https://myaccount.blob.core.windows.net/thumbnails/lake.jpg?timeout=30000";"/myaccount/thumbnails/lake.jpg";85ba10a5-b7e2-495e-8033-588e08628c5d;1;268.20.203.21:4362;2009-09-19;505;0;188;0;0;;;;;;;;"8/9/2011 6:02:40 PM 683803d3-538f-4ba8-bc7c-24c83aca5b1a"`  

 `1.0;2011-08-09T18:02:40.6526789Z;CopyBlobDestination;Success;201;28;28;authenticated;myaccount;myaccount;blob;"https://myaccount.blob.core.windows.net/thumbnails/lake.jpg?timeout=30000";"/myaccount/thumbnails/lakebck.jpg";85ba10a5-b7e2-495e-8033-588e08628c5d;2;268.20.203.21:4362;2009-09-19;505;0;188;0;0;;;;;;;;"8/9/2011 6:02:40 PM 683803d3-538f-4ba8-bc7c-24c83aca5b1a"`  

## See Also  
 [Storage Analytics Logging](storage-analytics-logging.md)   
 [Storage Analytics Logged Operations and Status Messages](storage-analytics-logged-operations-and-status-messages.md)
