---
title: Create, manage, and secure admin and query api-keys for Azure Search | Microsoft Docs
description: api-keys control access to the service endpoint. Admin keys grant write access. Query keys can be created for read-only access.
author: HeidiSteen
manager: cgronlun
tags: azure-portal
services: search
ms.service: search
ms.devlang: rest-api
ms.topic: conceptual
ms.date: 06/20/2018
ms.author: heidist

---

# Create and manage api-keys for an Azure Search service

All requests to a search service need a read-only api-key that was generated specifically for your service. The api-key is the sole mechanism for authenticating access to your search service endpoint and must be included on every request. In [REST solutions](search-get-started-nodejs.md#update-the-configjs-with-your-search-service-url-and-api-key), the api-key is typically specified in a request header. In [.NET solutions](search-howto-dotnet-sdk.md#core-scenarios), a key is often specified as a configuration setting and then passed as [Credentials](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.searchserviceclient.credentials) (admin key) or [SearchCredentials](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.searchserviceclient.searchcredentials) (query key) on [SearchServiceClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.searchserviceclient).

Keys are created with your search service during service provisioning. You can view and obtain key values in the [Azure portal](https://portal.azure.com).

![Portal page, Settings, Keys section](media/search-manage/azure-search-view-keys.png)

## What is an api-key

An api-key is a string composed of randomly generated numbers and letters. Through [role-based permissions](search-security-rbac.md), you can delete or read the keys, but you can't replace a key with a user-defined password or use Active Directory as the primary authentication methodology for accessing search operations. 

Two types of keys are used to access your search service: admin (read-write) and query (read-only).

|Key|Description|Limits|  
|---------|-----------------|------------|  
|Admin|Grants full rights to all operations, including the ability to manage the service, create and delete indexes, indexers, and data sources.<br /><br /> Two admin keys, referred to as *primary* and *secondary* keys in the portal, are generated when the service is created and can be individually regenerated on demand. Having two keys allows you to roll over one key while using the second key for continued access to the service.<br /><br /> Admin keys are only specified in HTTP request headers. You cannot place an admin api-key in a URL.|Maximum of 2 per service|  
|Query|Grants read-only access to indexes and documents, and are typically distributed to client applications that issue search requests.<br /><br /> Query keys are created on demand. You can create them manually in the portal or programmatically via the [Management REST API](https://docs.microsoft.com/rest/api/searchmanagement/).<br /><br /> Query keys can be specified  in an HTTP request header for search, suggestion, or lookup operation. Alternatively, you can pass a query key  as a parameter on a URL. Depending on how your client application formulates the request, it might be easier to pass the key as a query parameter:<br /><br /> `GET /indexes/hotels/docs?search=*&$orderby=lastRenovationDate desc&api-version=2017-11-11&api-key=[query key]`|50 per service|  

 Visually, there is no distinction between an admin key or query key. Both keys are strings composed of 32 randomly generated alpha-numeric characters. If you lose track of what type of key is specified in your application, you can [check the key values in the portal](https://portal.azure.com) or use the [REST API](https://docs.microsoft.com/rest/api/searchmanagement/) to return the value and key type.  

> [!NOTE]  
>  It is considered a poor security practice to pass sensitive data such as an `api-key` in the request URI. For this reason, Azure Search only accepts a query key as an `api-key` in the query string, and you should avoid doing so unless the contents of your index should be publicly available. As a general rule, we recommend passing your `api-key` as a request header.  

## Find api-keys for your service

You can obtain access keys in the portal or through the [Management REST API](https://docs.microsoft.com/rest/api/searchmanagement/). For more information, see [Manage admin and query api-keys](search-security-api-keys.md).

1. Sign in to the [Azure portal](https://portal.azure.com).
2. List the [search services](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices)  for your subscription.
3. select the service and on the service page, find **Settings** >**Keys** to view admin and query keys.

![Portal page, Settings, Keys section](media/search-security-overview/settings-keys.png)

## Regenerate admin keys

Two admin keys are created for each service so that you can rollover a primary key, using the secondary key for continued access.

If you regenerate both primary and secondary keys at the same time, any applications using either key for accessing service operations will no longer have access to the service.

1. In the **Settings** >**Keys** page, copy the secondary key.
2. For all applications, update the api-key settings to use the secondary key.
3. Regenerate the primary key.
4. Update all applications to use the new primary key.

## Secure api-keys
Key security is ensured by restricting access via the portal or Resource Manager interfaces (PowerShell or command-line interface). As noted, subscription administrators can view and regenerate all api-keys. As a precaution, review role assignments to understand who has access to the admin keys.

+ In the service dashboard, click **Access control (IAM)** to view role assignments for your service.

Members of the following roles can view and regenerate keys: Owner, Contributor, [Search Service Contributors](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#search-service-contributor)

> [!Note]
> For identity-based access over search results, you can create security filters to trim results by identity, removing documents for which the requestor should not have access. For more information, see [Security filters](search-security-trimming-for-azure-search.md) and [Secure with Active Directory](search-security-trimming-for-azure-search-with-aad.md).

## See also

+ [Role-based access control in Azure Search](search-security-rbac.md)
+ [Manage using PowerShell](search-manage-powershell.md) 
+ [Performance and optimization article](search-performance-optimization.md)