---
title: Role-based access control in Speech Studio - Speech service
titleSuffix: Azure Cognitive Services
description: Learn how to assign access roles to the Speech service through Speech Studio.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 09/07/2021
ms.author: pafarley
---

# Azure role-based access control in Speech Studio 

Speech Studio supports Azure role-based access control (Azure RBAC), an authorization system for managing individual access to Azure resources. Using Azure RBAC, you can assign different levels of permissions for your Speech Studio operations to different team members. For more information on Azure RBAC, see the [Azure RBAC documentation](/azure/role-based-access-control/overview).

## Prerequisites

* You must be signed into Speech Studio with your Azure account and Speech resource. See the [Speech Studio overview](speech-studio-overview.md).

## Manage role assignments for Speech resources

To grant access to an Azure speech resource, you add a role assignment through the Azure RBAC tool in the Azure portal. 

Within a few minutes, the target will be assigned the selected role at the selected scope. For help with these steps, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal?tabs=current).

## Supported built-in roles in Speech Studio

A role definition is a collection of permissions. Use the following recommended built-in roles if you don't have any unique custom requirements for permissions:

| **Built-in role** | **Permission to list resource keys** | **Permission for Custom Speech operations** | **Permission for Custom Voice operations**| **Permission for other capabilities** |
| ---| ---| ---| ---| --|
|**Owner** |Yes |Full access to the projects, including the permission to create, edit, or delete project / data / model / endpoints |Full access to the projects, including the permission to create, edit, or delete project / data / model / endpoints |Full access |
|**Contributor** |Yes |Full access to the projects, including the permission to create, edit, or delete project / data / model / endpoints |Full access to the projects, including the permission to create, edit, or delete project / data / model / endpoints |Full access |
|**Cognitive Service Contributors** |Yes |Full access to the projects, including the permission to create, edit, or delete project / data / model / endpoints |Full access to the projects, including the permission to create, edit, or delete project / data / model / endpoints |Full access |
|**Cognitive Service Users** |Yes |Full access to the projects, including the permission to create, edit, or delete project / data / model / endpoints |Full access to the projects, including the permission to create, edit, or delete project / data / model / endpoints |Full access |
|**Cognitive Service Speech Contributor** |No |Full access to the projects, including the permission to create, edit, or delete project / data / model / endpoints |Full access to the projects, including the permission to create, edit, or delete project / data / model / endpoints |Full access |
|**Cognitive Service Speech User** |No |Can view the projects / datasets / models / endpoints; cannot create, edit, delete |Can view the projects / datasets / models / endpoints; cannot create, edit, delete |Full access |
|**Cognitive Services Data Reader (preview)** |No |Can view the projects / datasets / models / endpoints; cannot create, edit, delete |Can view the projects / datasets / models / endpoints; cannot create, edit, delete |Full access |

Alternatively, you can [create your own custom roles](/azure/role-based-access-control/custom-roles). For example, you could create a custom role with the permission to upload custom speech datasets, but without the ability to deploy a custom speech model to an endpoint.

> [!NOTE]
> Speech Studio supports key-based authentication. Roles that have permission to list resource keys (`Microsoft.CognitiveServices/accounts/listKeys/action`) will firstly be authenticated with a resource key and will have full access to the Speech Studio operations, as long as key authentication is enabled in Azure portal. If key authentication is disabled by the service admin, then those roles will lose all access to the Studio.

> [!NOTE]
> One resource could be assigned or inherited with multiple roles, and the final level of access to this resource is a combination of all your roles' permissions from the operation level.

## Next steps

Learn more about [Speech service encryption of data at rest](/azure/cognitive-services/speech-service/speech-encryption-of-data-at-rest).