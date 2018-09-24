---
title: Manage permissions to resources per user in Azure Stack (service administrator and tenant) | Microsoft Docs
description: As a service administrator or tenant, learn how to manage RBAC permissions.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/10/2018
ms.author: mabrigg
ms.reviewer: thoroet

---
# Manage Role-Based Access Control

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

A user in Azure Stack can be a reader, owner, or contributor for each instance of a subscription, resource group, or service. For example, User A might have reader permissions to Subscription One, but have owner permissions to Virtual Machine Seven.

 - Reader: User can view everything, but can’t make any changes.
 - Contributor: User can manage everything except access to resources.
 - Owner: User can manage everything, including access to resources.

## Set access permissions for a user

1. Sign in with an account that has owner permissions to the resource you want to manage.
2. In the blade for the resource, click the **Access** icon ![](media/azure-stack-manage-permissions/image1.png).
3. In the **Users** blade, click **Roles**.
4. In the **Roles** blade, click **Add** to add permissions for the user.

## Set access permissions for a universal group 

> [!Note]  
Applicable only to Active Directory Federated Services (AD FS).

1. Sign in with an account that has owner permissions to the resource you want to manage.
2. In the blade for the resource, click the **Access** icon ![](media/azure-stack-manage-permissions/image1.png).
3. In the **Users** blade, click **Roles**.
4. In the **Roles** blade, click **Add** to add permissions for the Universal Group Active Directory Group.

## Next steps
[Add an Azure Stack tenant](azure-stack-add-new-user-aad.md)

