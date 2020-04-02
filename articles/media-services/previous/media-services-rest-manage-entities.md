---
title: Managing Media Services entities with REST  | Microsoft Docs
description: This article demonstrates how to manage Media Services entities with REST API.
author: juliako
manager: femila
editor: ''
services: media-services
documentationcenter: ''

ms.assetid: 95262a32-0f2a-4286-b9e2-1a1ca6399b5b
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/20/2019
ms.author: juliako

---
# Managing Media Services entities with REST  

> [!div class="op_single_selector"]
> * [REST](media-services-rest-manage-entities.md)
> * [.NET](media-services-dotnet-manage-entities.md)
> 
> 

Microsoft Azure Media Services is a REST-based service built on OData v3. You can add, query, update, and delete entities in much the same way as you can on any other OData service. Exceptions will be called out when applicable. For more information on OData, see [Open Data Protocol documentation](https://www.odata.org/documentation/).

This topic shows you how to manage Azure Media Services entities with REST.

>[!NOTE]
> Starting April 1, 2017, any Job record in your account older than 90 days will be automatically deleted, along with its associated Task records, even if the total number of records is below the maximum quota. For example, on April 1, 2017, any Job record in your account older than December 31, 2016, will be automatically deleted. If you need to archive the job/task information, you can use the code described in this topic.

## Considerations  

When accessing entities in Media Services, you must set specific header fields and values in your HTTP requests. For more information, see [Setup for Media Services REST API Development](media-services-rest-how-to-use.md).

## Connect to Media Services

For information on how to connect to the AMS API, see [Access the Azure Media Services API with Azure AD authentication](media-services-use-aad-auth-to-access-ams-api.md). 

## Adding entities
Every entity in Media Services is added to an entity set, such as Assets, through a POST HTTP request.

The following example shows how to create an AccessPolicy.

    POST https://media.windows.net/API/AccessPolicies HTTP/1.1
    Content-Type: application/json;odata=verbose
    Accept: application/json;odata=verbose
    DataServiceVersion: 3.0
    MaxDataServiceVersion: 3.0
    x-ms-version: 2.19
    Authorization: Bearer <ENCODED JWT TOKEN> 
    Host: media.windows.net
    Content-Length: 74
    Expect: 100-continue

    {"Name": "DownloadPolicy", "DurationInMinutes" : "300", "Permissions" : 1}

## Querying entities
Querying and listing entities is straightforward and only involves a GET HTTP request and optional OData operations.
The following example retrieves a list of all MediaProcessor entities.

    GET https://media.windows.net/API/MediaProcessors HTTP/1.1
    Content-Type: application/json;odata=verbose
    Accept: application/json;odata=verbose
    DataServiceVersion: 3.0
    MaxDataServiceVersion: 3.0
    x-ms-version: 2.19
    Authorization: Bearer <ENCODED JWT TOKEN> 
    Host: media.windows.net

You can also retrieve a specific entity or all entity sets associated with a specific entity, such as in the following examples:

    GET https://media.windows.net/API/JobTemplates('nb:jtid:UUID:e81192f5-576f-b247-b781-70a790c20e7c') HTTP/1.1
    Content-Type: application/json;odata=verbose
    Accept: application/json;odata=verbose
    DataServiceVersion: 3.0
    MaxDataServiceVersion: 3.0
    x-ms-version: 2.19
    Authorization: Bearer <ENCODED JWT TOKEN> 
    Host: media.windows.net

    GET https://media.windows.net/API/JobTemplates('nb:jtid:UUID:e81192f5-576f-b247-b781-70a790c20e7c')/TaskTemplates HTTP/1.1
    Content-Type: application/json;odata=verbose
    Accept: application/json;odata=verbose
    DataServiceVersion: 3.0
    MaxDataServiceVersion: 3.0
    x-ms-version: 2.19
    Authorization: Bearer <ENCODED JWT TOKEN> 
    Host: media.windows.net

The following example returns only the State property of all Jobs.

    GET https://media.windows.net/API/Jobs?$select=State HTTP/1.1
    Content-Type: application/json;odata=verbose
    Accept: application/json;odata=verbose
    DataServiceVersion: 3.0
    MaxDataServiceVersion: 3.0
    x-ms-version: 2.19
    Authorization: Bearer <ENCODED JWT TOKEN> 
    Host: media.windows.net

The following example returns all JobTemplates with the name "SampleTemplate."

    GET https://media.windows.net/API/JobTemplates?$filter=startswith(Name,%20'SampleTemplate') HTTP/1.1
    Content-Type: application/json;odata=verbose
    Accept: application/json;odata=verbose
    DataServiceVersion: 3.0
    MaxDataServiceVersion: 3.0
    x-ms-version: 2.19
    Authorization: Bearer <ENCODED JWT TOKEN> 
    Host: media.windows.net

> [!NOTE]
> The $expand operation is not supported in Media Services as well as the unsupported LINQ methods described in LINQ Considerations (WCF Data Services).
> 
> 

## Enumerating through large collections of entities
When querying entities, there is a limit of 1000 entities returned at one time because public REST v2 limits query results to 1000 results. Use **skip** and **top** to enumerate through the large collection of entities. 

The following example shows how to use **skip** and **top** to skip the first 2000 jobs and get the next 1000 jobs.  

    GET https://media.windows.net/api/Jobs()?$skip=2000&$top=1000 HTTP/1.1
    Content-Type: application/json;odata=verbose
    Accept: application/json;odata=verbose
    DataServiceVersion: 3.0
    MaxDataServiceVersion: 3.0
    x-ms-version: 2.19
    Authorization: Bearer <ENCODED JWT TOKEN>
    Host: media.windows.net

## Updating entities
Depending on the entity type and the state that it is in, you can update properties on that entity through a PATCH, PUT, or MERGE HTTP requests. For more information about these operations, see [PATCH/PUT/MERGE](https://msdn.microsoft.com/library/dd541276.aspx).

The following code example shows how to update the Name property on an Asset entity.

    MERGE https://media.windows.net/API/Assets('nb:cid:UUID:80782407-3f87-4e60-a43e-5e4454232f60') HTTP/1.1
    Content-Type: application/json;odata=verbose
    Accept: application/json;odata=verbose
    DataServiceVersion: 3.0
    MaxDataServiceVersion: 3.0
    x-ms-version: 2.19
    Authorization: Bearer <ENCODED JWT TOKEN>
    Host: media.windows.net
    Content-Length: 21
    Expect: 100-continue

    {"Name" : "NewName" }

## Deleting entities
Entities can be deleted in Media Services by using a DELETE HTTP request. Depending on the entity, the order in which you delete entities may be important. For example, entities such as Assets require that you revoke (or delete) all Locators that reference that particular Asset before deleting the Asset.

The following example shows how to delete a Locator that was used to upload a file into blob storage.

    DELETE https://media.windows.net/API/Locators('nb:lid:UUID:76dcc8e8-4230-463d-97b0-ce25c41b5c8d') HTTP/1.1
    Content-Type: application/json;odata=verbose
    Accept: application/json;odata=verbose
    DataServiceVersion: 3.0
    MaxDataServiceVersion: 3.0
    x-ms-version: 2.19
    Authorization: Bearer <ENCODED JWT TOKEN>
    Host: media.windows.net
    Content-Length: 0

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

