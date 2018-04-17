---
title: Authenticating requests to Azure Storage using Shared Key | Microsoft Docs
description: Authenticating requests to Azure Storage using Shared Key.  
services: storage
author: tamram
manager: jeconnoc

ms.service: storage
ms.topic: overview
ms.date: 04/16/2018
ms.author: tamram
---

# Authenticating requests to Azure Storage using Shared Key

 The Blob, Queue, Table, and File services support the following Shared Key authentication schemes for version 2009-09-19 and later (for Blob, Queue, and Table service) and version 2014-02-14 and later (for File service):  
  
-   **Shared Key for Blob, Queue, and File Services.** Use the Shared Key authentication scheme to make requests against the Blob, Queue, and File services. Shared Key authentication in version 2009-09-19 and later supports an augmented signature string for enhanced security and requires that you update your service to authenticate using this augmented signature.  
  
-   **Shared Key for Table Service.** Use the Shared Key authentication scheme to make requests against the Table service using the REST API. Shared Key authentication for the Table service in version 2009-09-19 and later uses the same signature string as in previous versions of the Table service.  
  
-   **Shared Key Lite.** Use the Shared Key Lite authentication scheme to make requests against the Blob, Queue, Table, and File services.  
  
     For version 2009-09-19 and later of the Blob and Queue services, Shared Key Lite authentication supports using a signature string identical to what was supported against Shared Key in previous versions of the Blob and Queue services. You can therefore use Shared Key Lite to make requests against the Blob and Queue services without updating your signature string.  
  
 An authenticated request requires two headers: the `Date` or `x-ms-date` header and the `Authorization` header. The following sections describe how to construct these headers.  
  
> [!NOTE]
>  A container or blob may be made available for public access by setting a container's permissions. For more information, see [Manage Access to Azure Storage Resources](/azure/storage/storage-manage-access-to-resources). A container, blob, queue, or table may be available for signed access via a shared access signature; a shared access signature is authenticated through a different mechanism. See [Delegating Access with a Shared Access Signature](Delegating-Access-with-a-Shared-Access-Signature.md) for more details.  
  
##  <a name="Subheading1"></a> Specifying the Date Header  
 All authenticated requests must include the Coordinated Universal Time (UTC) timestamp for the request. You can specify the timestamp either in the `x-ms-date` header, or in the standard HTTP/HTTPS `Date` header. If both headers are specified on the request, the value of `x-ms-date` is used as the request's time of creation.  
  
 The storage services ensure that a request is no older than 15 minutes by the time it reaches the service. This guards against certain security attacks, including replay attacks. When this check fails, the server returns response code 403 (Forbidden).  
  
> [!NOTE]
>  The `x-ms-date` header is provided because some HTTP client libraries and proxies automatically set the `Date` header, and do not give the developer an opportunity to read its value in order to include it in the authenticated request. If you set `x-ms-date`, construct the signature with an empty value for the `Date` header.  
  
##  <a name="Subheading2"></a> Specifying the Authorization Header  
 An authenticated request must include the `Authorization` header. If this header is not included, the request is anonymous and may only succeed against a container or blob that is marked for public access, or against a container, blob, queue, or table for which a shared access signature has been provided for delegated access.  
  
 To authenticate a request, you must sign the request with the key for the account that is making the request and pass that signature as part of the request.  
  
 The format for the `Authorization` header is as follows:  
  
```  
Authorization="[SharedKey|SharedKeyLite] <AccountName>:<Signature>"  
```  
  
 where `SharedKey` or `SharedKeyLite` is the name of the authorization scheme, `AccountName` is the name of the account requesting the resource, and `Signature` is a Hash-based Message Authentication Code (HMAC) constructed from the request and computed by using the SHA256 algorithm, and then encoded by using Base64 encoding.  
  
> [!NOTE]
>  It is possible to request a resource that resides beneath a different account, if that resource is publicly accessible.  
  
 The following sections describe how to construct the `Authorization` header.  
  
### Constructing the Signature String  
 How you construct the signature string depends on which service and version you are authenticating against and which authentication scheme you are using. When constructing the signature string, keep in mind the following:  
  
-   The VERB portion of the string is the HTTP verb, such as GET or PUT, and must be uppercase.  
  
-   For Shared Key authentication for the Blob, Queue, and File services, each header included in the signature string may appear only once. If any header is duplicated, the service returns status code 400 (Bad Request).  
  
-   The values of all standard HTTP headers must be included in the string in the order shown in the signature format, without the header names. These headers may be empty if they are not being specified as part of the request; in that case, only the new-line character is required.  
  
-   If the `x-ms-date` header is specified, you may ignore the `Date` header, regardless of whether it is specified on the request, and simply specify an empty line for the `Date` portion of the signature string. In this case, follow the instructions in the [Constructing the CanonicalizedHeaders Element](#Constructing_Element) section for adding the `x-ms-date` header.  
  
     Note that it is acceptable to specify both `x-ms-date` and `Date`; in this case, the service uses the value of `x-ms-date`.  
  
-   If the `x-ms-date` header is not specified, specify the `Date` header in the signature string, without including the header name.  
  
-   All new-line characters (\n) shown are required within the signature string.  
  
-   The signature string includes canonicalized headers and canonicalized resource strings. Canonicalizing these strings puts them into a standard format that is recognized by Azure Storage. For detailed information on constructing the `CanonicalizedHeaders` and `CanonicalizedResource` strings that make up part of the signature string, see the appropriate sections later in this topic.  
  
#### Blob, Queue, and File Services (Shared Key Authentication)  
 To encode the Shared Key signature string for a request against the 2009-09-19 version and later of the Blob or Queue service, and version 2014-02-14 and later of the File service, use the following format:  
  
```  
StringToSign = VERB + "\n" +  
               Content-Encoding + "\n" +  
               Content-Language + "\n" +  
               Content-Length + "\n" +  
               Content-MD5 + "\n" +  
               Content-Type + "\n" +  
               Date + "\n" +  
               If-Modified-Since + "\n" +  
               If-Match + "\n" +  
               If-None-Match + "\n" +  
               If-Unmodified-Since + "\n" +  
               Range + "\n" +  
               CanonicalizedHeaders +   
               CanonicalizedResource;  
```  
  
 The following example shows a signature string for a [Get Blob](Get-Blob.md) operation. Note that where there is no header value, the new-line character only is specified.  
  
```  
GET\n\n\n\n\n\n\n\n\n\n\n\nx-ms-date:Sun, 11 Oct 2009 21:49:13 GMT\nx-ms-version:2009-09-19\n/myaccount/mycontainer\ncomp:metadata\nrestype:container\ntimeout:20  
```  
  
 Breaking this down line-by-line shows each portion of the same string:  
  
```  
  
GET\n /*HTTP Verb*/  
\n    /*Content-Encoding*/  
\n    /*Content-Language*/  
\n    /*Content-Length (include value when zero)*/  
\n    /*Content-MD5*/  
\n    /*Content-Type*/  
\n    /*Date*/  
\n    /*If-Modified-Since */  
\n    /*If-Match*/  
\n    /*If-None-Match*/  
\n    /*If-Unmodified-Since*/  
\n    /*Range*/  
x-ms-date:Sun, 11 Oct 2009 21:49:13 GMT\nx-ms-version:2009-09-19\n    /*CanonicalizedHeaders*/  
/myaccount /mycontainer\ncomp:metadata\nrestype:container\ntimeout:20    /*CanonicalizedResource*/  
  
```  
  
 Next, encode this string by using the HMAC-SHA256 algorithm over the UTF-8-encoded signature string, construct the `Authorization` header, and add the header to the request. The following example shows the `Authorization` header for the same operation:  
  
```  
Authorization: SharedKey myaccount:ctzMq410TV3wS7upTBcunJTDLEJwMAZuFPfr0mrrA08=  
```  
  
 Note that in order to use Shared Key authentication with version 2009-09-19 and later of the Blob and Queue services, you must update your code to use this augmented signature string.  
  
 If you prefer to migrate your code to version 2009-09-19 or later of the Blob and Queue services with the fewest possible changes, you can modify your existing `Authorization` headers to use Shared Key Lite instead of Shared Key. The signature format required by Shared Key Lite is identical to that required for Shared Key by versions of the Blob and Queue services prior to 2009-09-19.  
  
> [!IMPORTANT]
>  If you are accessing the secondary location in a storage account for which read-access geo-replication (RA-GRS) is enabled, do not include the `-secondary` designation in the authorization header. For authorization purposes, the account name is always the name of the primary location, even for secondary access.  
  
##### Content-Length Header in Version 2015-02-21 and Later  
 When using version 2015-02-21 or later, if `Content-Length` is zero, then set the `Content-Length` part of the `StringToSign` to an empty string.  
  
 For example, for the following request, the value of the `Content-Length` header is omitted from the `StringToSign` when it is zero.  
  
```  
PUT http://myaccount/mycontainer?restype=container&timeout=30 HTTP/1.1  
x-ms-version: 2015-02-21  
x-ms-date: Fri, 26 Jun 2015 23:39:12 GMT  
Authorization: SharedKey myaccount:ctzMq410TV3wS7upTBcunJTDLEJwMAZuFPfr0mrrA08=  
Content-Length: 0  
```  
  
 The `StringToSign` is constructed as follows:  
  
```  
Version 2015-02-21 and later:  
PUT\n\n\n\n\n\n\n\n\n\n\n\nx-ms-date:Fri, 26 Jun 2015 23:39:12 GMT\nx-ms-version:2015-02-21\n/myaccount/mycontainer\nrestype:container\ntimeout:30  
```  
  
 Whereas in versions prior to 2015-02-21, the `StringToSign` must include the zero value for `Content-Length`:  
  
```  
Version 2014-02-14 and earlier:  
PUT\n\n\n\n0\n\n\n\n\n\n\n\nx-ms-date:Fri, 26 Jun 2015 23:39:12 GMT\nx-ms-version:2015-02-21\n/myaccount/mycontainer\nrestype:container\ntimeout:30  
  
```  
  
#### Table Service (Shared Key Authentication)  
 You must use Shared Key authentication to authenticate a request made against the Table service if your service is using the REST API to make the request. The format of the signature string for Shared Key against the Table service is the same for all versions.  
  
 Note that the Shared Key signature string for a request against the Table service differs slightly from that for a request against the Blob or Queue service, in that it does not include the `CanonicalizedHeaders` portion of the string. Additionally, the `Date` header in this case is never empty even if the request sets the `x-ms-date` header. If the request sets `x-ms-date`, that value is also used for the value of the `Date` header.  
  
 To encode the signature string for a request against the Table service made using the REST API, use the following format:  
  
```  
StringToSign = VERB + "\n" +   
               Content-MD5 + "\n" +   
               Content-Type + "\n" +  
               Date + "\n" +  
               CanonicalizedResource;  
```  
  
> [!NOTE]
>  Beginning with version 2009-09-19, the Table service requires that all REST calls include the `DataServiceVersion` and `MaxDataServiceVersion` headers. See [Setting the OData Data Service Version Headers](Setting-the-OData-Data-Service-Version-Headers.md) for more information.  
  
#### Blob, Queue, and File Service (Shared Key Lite Authentication)  
 You may use Shared Key Lite authentication to authenticate a request made against the 2009-09-19 version and later of the Blob and Queue services, and version 2014-02-14 and later of the File services.  
  
 The signature string for Shared Key Lite is identical to the signature string required for Shared Key authentication in versions of the Blob and Queue services prior to 2009-09-19. So if you wish to migrate your code with the least number of changes to version 2009-09-19 of the Blob and Queue services, you can modify your code to use Shared Key Lite, without changing the signature string itself. Note that by using Shared Key Lite, you will not gain the enhanced security functionality provided by using Shared Key with version 2009-09-19 and later.  
  
 To encode the signature string for a request against the Blob or Queue service, use the following format:  
  
```  
StringToSign = VERB + "\n" +  
               Content-MD5 + "\n" +  
               Content-Type + "\n" +  
               Date + "\n" +  
               CanonicalizedHeaders +   
               CanonicalizedResource;  
```  
  
 The following example shows a signature string for a [Put Blob](Put-Blob.md) operation. Note that the Content-MD5 header line is empty. The headers shown in the string are name-value pairs that specify custom metadata values for the new blob.  
  
```  
PUT\n\ntext/plain; charset=UTF-8\n\nx-ms-date:Sun, 20 Sep 2009 20:36:40 GMT\nx-ms-meta-m1:v1\nx-ms-meta-m2:v2\n/testaccount1/mycontainer/hello.txt  
```  
  
 Next, encode this string by using the HMAC-SHA256 algorithm over the UTF-8-encoded signature string, construct the `Authorization` header, and add the header to the request. The following example shows the `Authorization` header for the same operation:  
  
```  
Authorization: SharedKeyLite myaccount:ctzMq410TV3wS7upTBcunJTDLEJwMAZuFPfr0mrrA08=  
```  
  
#### Table Service (Shared Key Lite Authentication)  
 You can use Shared Key Lite authentication to authenticate a request made against any version of the Table service.  
  
 To encode the signature string for a request against the Table service using Shared Key Lite, use the following format:  
  
```  
StringToSign = Date + "\n"   
               CanonicalizedResource  
```  
  
 The following example shows a signature string for a [Create Table](Create-Table.md) operation.  
  
```  
Sun, 11 Oct 2009 19:52:39 GMT\n/testaccount1/Tables  
```  
  
 Next, encode this string by using the HMAC-SHA256 algorithm, construct the `Authorization` header, and then add the header to the request. The following example shows the `Authorization` header for the same operation:  
  
```  
Authorization: SharedKeyLite testaccount1:uay+rilMVayH/SVI8X+a3fL8k/NxCnIePdyZSkqvydM=  
```  
  
###  <a name="Constructing_Element"></a> Constructing the Canonicalized Headers String  
 To construct the `CanonicalizedHeaders` portion of the signature string, follow these steps:  
  
1.  Retrieve all headers for the resource that begin with `x-ms-`, including the `x-ms-date` header.  
  
2.  Convert each HTTP header name to lowercase.  
  
3.  Sort the headers lexicographically by header name, in ascending order. Each header may appear only once in the string.  
  
    > [!NOTE]
    >  [Lexicographical ordering](http://en.wikipedia.org/wiki/Lexicographical_order) may not always coincide with conventional alphabetical ordering.  
  
4.  Replace any linear whitespace in the header value with a single space.  
  
 Linear whitespace includes carriage return/line feed (CRLF), spaces, and tabs. See [RFC 2616, section 4.2](https://tools.ietf.org/html/rfc2616#section-4.2) for details. Do not replace any whitespace inside a quoted string.  
  
5.  Trim any whitespace around the colon in the header.  
  
6.  Finally, append a new-line character to each canonicalized header in the resulting list. Construct the `CanonicalizedHeaders` string by concatenating all headers in this list into a single string.  
  
 The following shows an example of a canonicalized headers string:  
  
 `x-ms-date:Sat, 21 Feb 2015 00:48:38 GMT\nx-ms-version:2014-02-14\n`  

> [!NOTE] 
> Prior to service version 2016-05-31, headers with empty values were omitted from the signature string. These are now represented in CanonicalizedHeaders by immediately following the colon character with the terminating new-line. 
  
### Constructing the Canonicalized Resource String  
 The `CanonicalizedResource` part of the signature string represents the storage services resource targeted by the request. Any portion of the `CanonicalizedResource` string that is derived from the resource's URI should be encoded exactly as it is in the URI.  
  
 There are two supported formats for the `CanonicalizedResource` string:  
  
-   A format that supports Shared Key authentication for version 2009-09-19 and later of the Blob and Queue services, and for version 2014-02-14 and later of the File service.  
  
-   A format that supports Shared Key and Shared Key Lite for all versions of the Table service, and Shared Key Lite for version 2009-09-19 and later of the Blob and Queue services. This format is identical to that used with previous versions of the storage services.  
  
 For help constructing the URI for the resource you are accessing, see one of the following topics:  
  
-   Blob service: [Naming and Referencing Containers, Blobs, and Metadata](Naming-and-Referencing-Containers--Blobs--and-Metadata.md)  
  
-   Queue service: [Addressing Queue Service Resources](Addressing-Queue-Service-Resources.md)  
  
-   Table service: [Addressing Table Service Resources](Addressing-Table-Service-Resources.md)  
  
-   File service: [Naming and Referencing Shares, Directories, Files, and Metadata](Naming-and-Referencing-Shares--Directories--Files--and-Metadata.md)  
  
> [!IMPORTANT]
>  If your storage account is replicated with read-access geo-replication (RA-GRS), and you are accessing a resource in the secondary location, do not include the `–secondary` designation in the `CanonicalizedResource` string. The resource URI used in the `CanonicalizedResource` string URI should be the URI of the resource at the primary location.  
  
> [!NOTE]
>  If you are authenticating against the storage emulator, the account name will appear twice in the `CanonicalizedResource` string. This is expected. If you are authenticating against Azure storage services, the account name will appear only one time in the `CanonicalizedResource` string.  
  
 **2009-09-19 and later Shared Key Format**  
  
 This format supports Shared Key authentication for the 2009-09-19 version and later of the Blob and Queue services, and the 2014-02-14 version and later of the File services. Construct the `CanonicalizedResource` string in this format as follows:  
  
1.  Beginning with an empty string (""), append a forward slash (/), followed by the name of the account that owns the resource being accessed.  
  
2.  Append the resource's encoded URI path, without any query parameters.  
  
3.  Retrieve all query parameters on the resource URI, including the `comp` parameter if it exists.  
  
4.  Convert all parameter names to lowercase.  
  
5.  Sort the query parameters lexicographically by parameter name, in ascending order.  
  
6.  URL-decode each query parameter name and value.  
  
7.  Include a new-line character (\n) before each name-value pair.

8.  Append each query parameter name and value to the string in the following format, making sure to include the colon (:) between the name and the value:  
  
     `parameter-name:parameter-value`  
  
9. If a query parameter has more than one value, sort all values lexicographically, then include them in a comma-separated list:  
  
     `parameter-name:parameter-value-1,parameter-value-2,parameter-value-n`  
 
Keep in mind the following rules for constructing the canonicalized resource string:  
  
-   Avoid using the new-line character (\n) in values for query parameters. If it must be used, ensure that it does not affect the format of the canonicalized resource string.  
  
-   Avoid using commas in query parameter values.  
  
 Here are some examples that show the `CanonicalizedResource` portion of the signature string, as it may be constructed from a given request URI:  
  
```  
  
Get Container Metadata  
   GET http://myaccount.blob.core.windows.net/mycontainer?restype=container&comp=metadata   
CanonicalizedResource:  
    /myaccount/mycontainer\ncomp:metadata\nrestype:container  
  
List Blobs operation:  
    GET http://myaccount.blob.core.windows.net/container?restype=container&comp=list&include=snapshots&include=metadata&include=uncommittedblobs  
CanonicalizedResource:  
    /myaccount/mycontainer\ncomp:list\ninclude:metadata,snapshots,uncommittedblobs\nrestype:container  
  
Get Blob operation against a resource in the secondary location:  
   GET https://myaccount-secondary.blob.core.windows.net/mycontainer/myblob  
CanonicalizedResource:  
    /myaccount/mycontainer/myblob  
  
```  
  
 **2009-09-19 and later Shared Key Lite and Table service format**  
  
 This format supports Shared Key and Shared Key Lite for all versions of the Table service, and Shared Key Lite for version 2009-09-19 and later of the Blob and Queue services and version 2014-02-14 and later of the File service. This format is identical to that used with previous versions of the storage services. Construct the `CanonicalizedResource` string in this format as follows:  
  
1.  Beginning with an empty string (""), append a forward slash (/), followed by the name of the account that owns the resource being accessed.  
  
2.  Append the resource's encoded URI path. If the request URI addresses a component of the resource, append the appropriate query string. The query string should include the question mark and the `comp` parameter (for example, `?comp=metadata`). No other parameters should be included on the query string.  
  
### Encoding the Signature  
 To encode the signature, call the HMAC-SHA256 algorithm on the UTF-8-encoded signature string and encode the result as Base64. Note that you also need to Base64-decode your storage account key. Use the following format (shown as pseudocode):  
  
```  
Signature=Base64(HMAC-SHA256(UTF8(StringToSign), Base64.decode(<your_azure_storage_account_shared_key>)))  
```  
  
## See Also  
 [Blob Service REST API](Blob-Service-REST-API.md)   
 [Queue Service REST API](Queue-Service-REST-API.md)   
 [Table Service REST API](Table-Service-REST-API.md)   
 [Storage Services REST](Azure-Storage-Services-REST-API-Reference.md)
