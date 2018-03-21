---
title: Manage and security admin and query api-keys for Azure Search | Microsoft Docs
description: api-keys control access to the service endpoint. Admin keys grant write access. Query keys can be created for read-only access.
services: search
documentationcenter: ''
author: HeidiSteen
manager: cgronlun
editor: ''
tags: azure-portal

ms.assetid: 
ms.service: search
ms.devlang: rest-api
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 03/20/2018
ms.author: heidist

---

# Manage admin and query api-keys in Azure Search

All requests to a search service need an api-key that was generated specifically for your service. This api-key is the sole mechanism for authenticating access to your search service endpoint. 

An api-key is a string composed of randomly generated numbers and letters. Through [role-based permissions](search-security-rbac.md), you can delete or read the keys, but you can't replace a key with a user-defined password or use Active Directory as the primary authentication methodology for accessing search operations. 

Two types of keys are used to access your search service:

* Admin (valid for any read-write operation against the service)
* Query (valid for read-only operations such as queries against an index)

An admin api-key is created when the service is provisioned. There are two admin keys, designated as *primary* and *secondary* to keep them straight, but in fact they are interchangeable. Each service has two admin keys so that you can roll one over without losing access to your service. You can regenerate either admin key, but you cannot add to the total admin key count. There is a maximum of two admin keys per search service.

Query keys are designed for client applications that call Search directly. You can create up to 50 query keys. In application code, you specify the search URL and a query api-key to allow read-only access to the service. Your application code also specifies the index used by your application. Together, the endpoint, an api-key for read-only access, and a target index define the scope and access level of the connection from your client application.

## View or generate keys

+ In the service dashboard, click **Keys** to slide open the key management page. 

Commands for regenerating or creating keys are at the top of the page. By default, only admin keys are created. Query api-keys must be created manually.


## Secure api-keys
Key security is ensured by restricting access via the portal or Resource Manager interfaces (PowerShell or command-line interface). As noted, subscription administrators can view and regenerate all api-keys. As a precaution, review role assignments to understand who has access to the admin keys.

+ In the service dashboard, click **Access control (IAM)** to view role assignments for your service.

Members of the following roles can view and regnerate keys: Owner, Contributor, [Search Service Contributors](https://docs.microsoft.com/azure/active-directory/role-based-access-built-in-roles#search-service-contributor)

> [!Note]
> For identity-based access over search results, you can create security filters to trim results by identity, removing documents for which the requestor should not have access. For more information, see [Security filters](search-security-trimming-for-azure-search.md) and [Secure with Active Directory](search-security-trimming-for-azure-search-with-aad).

## See also

+ [Role-based access control in Azure Search](search-security-rbac.md)
+ [Manage using PowerShell](search-manage-powershell.md) 
+ [Performance and optimization article](search-performance-optimization.md)