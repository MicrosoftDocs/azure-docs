---
title: Manage permissions to resources per user in Azure Stack | Microsoft Docs
description: As a service administrator or tenant, learn how to manage RBAC permissions.
services: azure-stack
documentationcenter: ''
author: brenduns
manager: femila
editor: ''

ms.assetid: cccac19a-e1bf-4e36-8ac8-2228e8487646
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/30/2018
ms.author: brenduns
ms.reviewer: 

---
# Manage access to resources with Azure Stack Role-Based Access Control

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Azure Stack supports role-based access control (RBAC), which you can use to manage user, group, or application access to subscriptions, resources, and services.

## Basics of access management

Role-based access control provides fine-grained access control that you can use to secure your environment. You give users the exact permissions they need by assigning an RBAC role to a user or application at a certain scope. The scope of the role assignment can be a subscription, a resource group, or a single resource.

### Built-in roles

Azure Stack has three basic roles that you can apply to all resource types:

* **Owner** can manage everything, including access to resources.
* **Contributor** can manage everything except access to resources.
* **Reader** can view everything, but can’t make any changes.

### Resource hierarchy and inheritance

Azure Stack has the following resource hierarchy:

* Each subscription belongs to one directory.
* Each resource group belongs to one subscription.
* Each resource belongs to one resource group.

Access that you grant at a parent scope is inherited at child scopes. For example:

* You assign the Reader role to an Azure AD group at the subscription scope. The members of that group can view every resource group and resource in the subscription.
* You assign the Contributor role to an application at the resource group scope. The application can manage resources of all types in that resource group, but not other resource groups in the subscription.

### Multiple role assignment

You can grant a user more than one role and each role can be associated with a different scope. For example:

* You assign TestUser-A the Reader role to Subscription-1.
* You assign TestUser-A the Owner role to TestVM-1.

## Set access permissions for a user

The following steps describe how to configure permissions for a user.

1. Sign in with an account that has owner permissions to the resource you want to manage.
2. In the blade for the resource, click the **Access** icon.
3. In the **Users** blade, click **Roles**.
4. In the **Roles** blade, click **Add** to add permissions for the user.

## Next steps

[Create service principals](azure-stack-create-service-principals.md)