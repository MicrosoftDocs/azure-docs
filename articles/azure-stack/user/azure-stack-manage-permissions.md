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
ms.date: 04/25/2018
ms.author: brenduns
ms.reviewer: 

---
# Manage Role-Based Access Control

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Azure Stack uses role-based access control for each instance of a subscription, resource group, or service. An Azure Stack user can be assigned one or more roles. For example, User-A might have reader permissions to Subscription-1, and have owner permissions to Virtual Machine-7.

## Built-in roles

Azure Stack has three basic roles that apply to all resource types:

* **Owner** can manage everything, including access to resources.
* **Contributor** can manage everything except access to resources.
* **Reader** can view everything, but can’t make any changes.

## Set access permissions for a user

The following steps describe how to configure permissions for a user.

1. Sign in with an account that has owner permissions to the resource you want to manage.
2. In the blade for the resource, click the **Access** icon. <br>![Azure Stack Access Icon](media/azure-stack-manage-permissions/image1.png)

3. In the **Users** blade, click **Roles**.
4. In the **Roles** blade, click **Add** to add permissions for the user.

## Next steps

[Create service principals](azure-stack-create-service-principals.md)