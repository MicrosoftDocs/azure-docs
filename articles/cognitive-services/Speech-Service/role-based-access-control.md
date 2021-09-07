---
title: Role-based access control in Speech Studio - Speech service
titleSuffix: Azure Cognitive Services
description: 
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 09/07/1992
ms.author: pafarley
---

# Azure role-based access control in Speech Studio 

Speech Studio supports Azure role-based access control (Azure RBAC), an authorization system for managing individual access to Azure resources, to collaborate with others. Using Azure RBAC, you assign different team members different levels of permissions for your Speech Studio operations. For more information on Azure RBAC, see the [Azure RBAC documentation](https://docs.microsoft.com/azure/role-based-access-control/overview).

## Prerequisites

* You must be signed into Speech Studio with your Azure account and Speech resource. See the [Speech Studio overview](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-studio-overview).

## Manage role assignments for Speech resources

Azure RBAC can be assigned to an Azure Speech resource. To grant access to an Azure resource, you add a role assignment. 

Within a few minutes, the target will be assigned the selected role at the selected scope. For help with these steps, see [Assign Azure roles using the Azure portal](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal?tabs=current).

## Supported roles in Speech Studio

A role definition is a collection of permissions. Use the following recommended Build-in roles if you don’t have any unique custom requirements on permissions:

| Role | Permission of list resource keys | Permission of Custom Speech operations | Permission of Custom Voice operations| Permission of other capabilities |
| ---| ---| ---| ---| --|
|Owner |Yes |Full access to the projects, including the permission to create, edit, or delete project / data / model / endpoints |Full access to the projects, including the permission to create, edit, or delete project / data / model / endpoints |Full access |
|Contributor |Yes |Full access to the projects, including the permission to create, edit, or delete project / data / model / endpoints |Full access to the projects, including the permission to create, edit, or delete project / data / model / endpoints |Full access |
|Cognitive Service Contributors |Yes |Full access to the projects, including the permission to create, edit, or delete project / data / model / endpoints |Full access to the projects, including the permission to create, edit, or delete project / data / model / endpoints |Full access |
|Cognitive Service Users |Yes |Full access to the projects, including the permission to create, edit, or delete project / data / model / endpoints |Full access to the projects, including the permission to create, edit, or delete project / data / model / endpoints |Full access |
|Cognitive Service Speech Contributor |No |Full access to the projects, including the permission to create, edit, or delete project / data / model / endpoints |Full access to the projects, including the permission to create, edit, or delete project / data / model / endpoints |Full access |
|Cognitive Service Speech User |No |Can view the projects / datasets / models / endpoints, cannot create, edit, delete |Can view the projects / datasets / models / endpoints, cannot create, edit, delete |Full access |
|Cognitive Services Data Reader (preview) |No |Can view the projects / datasets / models / endpoints, cannot create, edit, delete |Can view the projects / datasets / models / endpoints, cannot create, edit, delete |Full access |

> [!NOTE]
> There could be more available roles besides the ones listed above to access Speech Services and Speech Studio, and the access is defined at operation level. For example, You can use the built-in roles or you can create your own custom roles (see [Azure custom roles - Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/custom-roles)) e.g., a custom role can be granted with the permission to upload custom speech datasets, but cannot deploy a custom speech model to an endpoint. For more information on custom roles.

> [!NOTE]
> Speech Studio supports key-based authentication. For roles that have permission to **List Keys** (Microsoft.CognitiveServices/accounts/listKeys/action, like Owners / Contributors / Cognitive Service Contributors / Cognitive Service User), they will be firstly authenticated via the resource key and you will have full access of the Studio operations, as long as the key authentication is enabled in Azure portal (is there any learn-more doc for Azure key-authentication? If key authentication is disabled by your service admin, then you will lose all access to the Studio).

> [!NOTE]
> One resource could be assigned or inherited with multiple roles, and the final level of access of this resource is a combination of all your roles’ permissions from the operation level. 

## Next steps

Learn more about [Speech service encryption of data at rest](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-encryption-of-data-at-rest)