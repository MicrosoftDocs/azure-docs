---
title: Media Services operations REST API overview | Microsoft Docs
description: Media Services REST API overview
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.assetid: a5f1c5e7-ec52-4e26-9a44-d9ea699f68d9
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 03/20/2019
ms.author: juliako
ms.reviewer: johndeu

---
# Media Services operations REST API overview 

> [!NOTE]
> No new features or functionality are being added to Media Services v2. <br/>Check out the latest version, [Media Services v3](https://docs.microsoft.com/azure/media-services/latest/). Also, see [migration guidance from v2 to v3](../latest/migrate-from-v2-to-v3.md)

The **Media Services Operations REST** API is used for creating Jobs, Assets, Live Channels and other resources in a Media Services account. For more information, see [Media Services Operations REST API reference](https://docs.microsoft.com/rest/api/media/operations/azure-media-services-rest-api-reference).

Media Services provides a REST API that accepts both JSON or atom+pub XML format. Media Services REST API requires specific HTTP headers that each client must send when connecting to Media Services, as well as a set of optional headers. The following sections describe the headers and HTTP verbs you can use when creating requests and receiving responses from Media Services.

Authentication to the Media Services REST API is done through Azure Active Directory authentication which is outlined in the article [Use Azure AD authentication to access the Azure Media Services API with REST](media-services-rest-connect-with-aad.md)

## Considerations

The following considerations apply when using REST.

* When querying entities, there is a limit of 1000 entities returned at one time because public REST v2 limits query results to 1000 results. You need to use **Skip** and **Take** (.NET)/ **top** (REST) as described in [this .NET example](media-services-dotnet-manage-entities.md#enumerating-through-large-collections-of-entities) and [this REST API example](media-services-rest-manage-entities.md#enumerating-through-large-collections-of-entities). 
* When using JSON and specifying to use the **__metadata** keyword in the request (for example, to reference a linked object) you MUST set the **Accept** header to [JSON Verbose format](https://www.odata.org/documentation/odata-version-3-0/json-verbose-format/) (see the following example). Odata does not understand the **__metadata** property in the request, unless you set it to verbose.  
  
        POST https://media.windows.net/API/Jobs HTTP/1.1
        Content-Type: application/json;odata=verbose
        Accept: application/json;odata=verbose
        DataServiceVersion: 3.0
        MaxDataServiceVersion: 3.0
        x-ms-version: 2.17
        Authorization: Bearer <ENCODED JWT TOKEN> 
        Host: media.windows.net
  
        {
            "Name" : "NewTestJob", 
            "InputMediaAssets" : 
                [{"__metadata" : {"uri" : "https://media.windows.net/api/Assets('nb%3Acid%3AUUID%3Aba5356eb-30ff-4dc6-9e5a-41e4223540e7')"}}]
        . . . 

## Standard HTTP request headers supported by Media Services
For every call you make into Media Services, there is a set of required headers you must include in your request and also a set of optional headers you may want to include. The table below lists the required headers:

| Header | Type | Value |
| --- | --- | --- |
| Authorization |Bearer |Bearer is the only accepted authorization mechanism. The value must also include the access token provided by Azure Active Directory. |
| x-ms-version |Decimal |2.17 (or most recent version)|
| DataServiceVersion |Decimal |3.0 |
| MaxDataServiceVersion |Decimal |3.0 |

> [!NOTE]
> Because Media Services uses OData to expose its REST APIs, the DataServiceVersion and MaxDataServiceVersion headers should be included in all requests; however, if they are not, then currently Media Services assumes the DataServiceVersion value in use is 3.0.
> 
> 

The following is a set of optional headers:

| Header | Type | Value |
| --- | --- | --- |
| Date |RFC 1123 date |Timestamp of the request |
| Accept |Content type |The requested content type for the response such as the following:<p> -application/json;odata=verbose<p> - application/atom+xml<p> Responses may have a different content type, such as a blob fetch, where a successful response contains the blob stream as the payload. |
| Accept-Encoding |Gzip, deflate |GZIP and DEFLATE encoding, when applicable. Note: For large resources, Media Services may ignore this header and return noncompressed data. |
| Accept-Language |"en", "es", and so on. |Specifies the preferred language for the response. |
| Accept-Charset |Charset type like “UTF-8” |Default is UTF-8. |
| X-HTTP-Method |HTTP Method |Allows clients or firewalls that do not support HTTP methods like PUT or DELETE to use these methods, tunneled via a GET call. |
| Content-Type |Content type |Content type of the request body in PUT or POST requests. |
| client-request-id |String |A caller-defined value that identifies the given request. If specified, this value will be included in the response message as a way to map the request. <p><p>**Important**<p>Values should be capped at 2096b (2k). |

## Standard HTTP response headers supported by Media Services
The following is a set of headers that may be returned to you depending on the resource you were requesting and the action you intended to perform.

| Header | Type | Value |
| --- | --- | --- |
| request-id |String |A unique identifier for the current operation, service generated. |
| client-request-id |String |An identifier specified by the caller in the original request, if present. |
| Date |RFC 1123 date |The date/time that the request was processed. |
| Content-Type |Varies |The content type of the response body. |
| Content-Encoding |Varies |Gzip or deflate, as appropriate. |

## Standard HTTP verbs supported by Media Services
The following is a complete list of HTTP verbs that can be used when making HTTP requests:

| Verb | Description |
| --- | --- |
| GET |Returns the current value of an object. |
| POST |Creates an object based on the data provided, or submits a command. |
| PUT |Replaces an object, or creates a named object (when applicable). |
| DELETE |Deletes an object. |
| MERGE |Updates an existing object with named property changes. |
| HEAD |Returns metadata of an object for a GET response. |

## Discover and browse the Media Services entity model
To make Media Services entities more discoverable, the $metadata operation can be used. It allows you to retrieve all valid entity types, entity properties, associations, functions, actions, and so on. By adding the $metadata operation to the end of your Media Services REST API endpoint, you can access this discovery service.

 /api/$metadata.

You should append "?api-version=2.x" to the end of the URI if you want to view the metadata in a browser, or do not include the x-ms-version header in your request.

## Authenticate with Media Services REST using Azure Active Directory

Authentication on the REST API is done through Azure Active Directory(AAD).
For details on how to get required authentication details for your Media Services account from the Azure Portal, see [Access the Azure Media Services API with Azure AD authentication](media-services-use-aad-auth-to-access-ams-api.md).

For details on writing code that connects to the REST API using Azure AD authentication, see the article [Use Azure AD authentication to access the Azure Media Services API with REST](media-services-rest-connect-with-aad.md).

## Next steps
To learn how to use Azure AD authentication with Media Services REST API, see [Use Azure AD authentication to access the Azure Media Services API with REST](media-services-rest-connect-with-aad.md).

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

