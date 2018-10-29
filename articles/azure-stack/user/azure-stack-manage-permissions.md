---
title: Manage permissions to resources per user in Azure Stack | Microsoft Docs
description: As a service administrator or tenant, learn how to manage RBAC permissions.
services: azure-stack
documentationcenter: ''
author: PatAltimore
manager: femila
editor: ''

ms.assetid: cccac19a-e1bf-4e36-8ac8-2228e8487646
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/15/2018
ms.author: patricka
ms.reviewer: 

---

# Manage access to resources with Azure Stack Role-Based Access Control

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Azure Stack supports role-based access control (RBAC), the same [security model for access management](https://docs.microsoft.com/azure/role-based-access-control/overview) that Microsoft Azure uses. You can use RBAC to manage user, group, or application access to subscriptions, resources, and services.

## Basics of access management

Role-based access control provides fine-grained access control that you can use to secure your environment. You give users the exact permissions they need by assigning a RBAC role at a certain scope. The scope of the role assignment can be a subscription, a resource group, or a single resource. Read the [Role-Based Access Control in the Azure portal](https://docs.microsoft.com/azure/role-based-access-control/overview) article to get more detailed information about access management.

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

### Assigning roles

You can assign more than one role to a user and each role can be associated with a different scope. For example:

* You assign TestUser-A the Reader role to Subscription-1.
* You assign TestUser-A the Owner role to TestVM-1.

The Azure [role assignments](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal) article provides detailed information about viewing, assigning, and deleting roles.

### Resource hierarchy and inheritance

Azure Stack has the following resource hierarchy:

* Each subscription belongs to one directory.
* Each resource group belongs to one subscription.
* Each resource belongs to one resource group.

Access that you grant at a parent scope is inherited at child scopes. For example:

* You assign the **Reader** role to an Azure AD group at the subscription scope. The members of that group can view every resource group and resource in the subscription.
* You assign the **Contributor** role to an application at the resource group scope. The application can manage resources of all types in that resource group, but not other resource groups in the subscription.

### Assigning roles

You can assign more than one role to a user and each role can be associated with a different scope. For example:

* You assign TestUser-A the Reader role to Subscription-1.
* You assign TestUser-A the Owner role to TestVM-1.

The Azure [role assignments](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal) article provides detailed information about viewing, assigning, and deleting roles.

## Set access permissions for a user

The following steps describe how to configure permissions for a user.

1. Sign in with an account that has owner permissions to the resource you want to manage.
2. In the left navigation pane, choose **Resource groups**.
3. Choose the name of the resource group that you want to set permissions on.
4. In the resource group navigation pane, choose **Access control (IAM)**. The **Access control** view lists the Items that have access to the resource group. You can filter these results, and use a menu bar to Add or Remove permissions.
5. On the **Access control** menu bar, choose **+ Add**.
6. On **Add permissions**:

   * Choose the role you want to assign from the **Role** drop-down list.
   * Choose the resource you want to assign from the **Assign access to** drop-down list.
   * Select the user, group, or application in your directory that you wish to grant access to. You can search the directory with display names, email addresses, and object identifiers.

7. Select **Save**.

## Next steps

[Create service principals](azure-stack-create-service-principals.md)