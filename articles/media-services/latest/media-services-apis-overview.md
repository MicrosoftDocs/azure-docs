---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Developing with v3 APIs - Azure | Microsoft Docs
description: This article discusses rules that apply to entities and APIs when developing with Media Services v3. 
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 04/08/2019
ms.author: juliako
ms.custom: seodec18

---

# Developing with Media Services v3 APIs

This article discusses rules that apply to entities and APIs when developing with Media Services v3.

## Accessing the Azure Media Services API

To access the Azure Media Services resources, you should use the Azure Active Directory (AD) service principal authentication. The Azure Media REST service requires that the user or application that makes the REST API requests have either the **Contributor** or **Owner** role to access the resources. 

### Azure AD service principal 

You need to create an Azure AD application and service principal in its own tenant. After you create the application, give the app **Contributor** or **Owner** role access to the Media Services account. 

In the following figure, the numbers represent the flow of the requests in chronological order:

![Middle-tier apps](../previous/media/media-services-use-aad-auth-to-access-ams-api/media-services-principal-service-aad-app1.png)

1. A middle-tier app requests an Azure AD access token that has the following parameters:  

   * Azure AD tenant endpoint.
   * Media Services resource URI.
   * Resource URI for REST Media Services.
   * Azure AD application values: the client ID and client secret.
   
   To get all the needed values, 
see [Access Azure Media Services API with the Azure CLI](access-api-cli-how-to.md)

2. The Azure AD access token is sent to the middle tier.
4. The middle tier sends request to the Azure Media REST API with the Azure AD token.
5. The middle tier gets back the data from Media Services.

### v3 API design principles and RBAC

One of the key design principles of the Media Servics v3 API is to make the API more secure. v3 APIs do not return secrets or credentials on **Get** or **List** operations. The keys are always null, empty, or sanitized from the response. The user needs to call a separate action method to get secrets or credentials. The **Reader** role cannot call operations so it cannot call operations like Asset.ListContainerSas, StreamingLocator.ListContentKeys, ContentKeyPolicies.GetPolicyPropertiesWithSecrets. Having separate actions enables you to set more granular RBAC security permissions in a custom role if desired.

For more information, see [Role-based access control for Media Services accounts](rbac-overview.md).

## Naming conventions

Azure Media Services v3 resource names (for example, Assets, Jobs, Transforms) are subject to Azure Resource Manager naming constraints. In accordance with Azure Resource Manager, the resource names are always unique. Thus, you can use any unique identifier strings (for example, GUIDs) for your resource names. 

Media Services resource names cannot include: '<', '>', '%', '&', ':', '&#92;', '?', '/', '*', '+', '.', the single quote character, or any control characters. All other characters are allowed. The max length of a resource name is 260 characters. 

For more information about Azure Resource Manager naming, see: [Naming requirements](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md#arguments-for-crud-on-resource) and [Naming conventions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions).

## Long-running operations

The operations marked with `x-ms-long-running-operation` in the Azure Media Services [swagger files](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/mediaservices/resource-manager/Microsoft.Media/stable/2018-07-01/streamingservice.json) are long running operations. 

For details about how to track asynchronous Azure operations, see [Async operations](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-async-operations#monitor-status-of-operation).

Media Services has the following long-running operations:

* Create LiveEvent
* Update LiveEvent
* Delete LiveEvent
* Start LiveEvent
* Stop LiveEvent
* Reset LiveEvent
* Create LiveOutput
* Delete LiveOutput
* Create StreamingEndpoint
* Update StreamingEndpoint
* Delete StreamingEndpoint
* Start StreamingEndpoint
* Stop StreamingEndpoint
* Scale StreamingEndpoint

## Filtering, ordering, paging of Media Services entities

See [Filtering, ordering, paging of Azure Media Services entities](entities-overview.md)

## Next steps

[Start developing with Media Services v3 API using SDKs/tools](developers-guide.md)
