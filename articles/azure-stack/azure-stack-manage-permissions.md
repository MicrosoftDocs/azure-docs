---
title: Manage permissions to resources per user in Azure Stack (service administrator and tenant) | Microsoft Docs
description: As a service administrator or tenant, learn how to manage RBAC permissions.
services: azure-stack
documentationcenter: ''
author: Heathl17
manager: byronr
editor: ''

ms.assetid: cccac19a-e1bf-4e36-8ac8-2228e8487646
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/08/2017
ms.author: helaw

---
# Manage Role-Based Access Control
A user in Azure Stack can be a reader, owner, or contributor for each instance of a subscription, resource group, or service. For example, User A might have reader permissions to Subscription 1, but have owner permissions to Virtual Machine 7.

* Reader: User can view everything, but can’t make any changes.
* Contributor: User can manage everything except access to resources.
* Owner: User can manage everything, including access to resources.

## Set access permissions for a user
1. Sign in with an account that has owner permissions to the resource you want to manage.
2. In the blade for the resource, click the **Access** icon ![](media/azure-stack-manage-permissions/image1.png).
3. In the **Users** blade, click **Roles**.
4. In the **Roles** blade, click **Add** to add permissions for the user.

## Next steps
[Add an Azure Stack tenant](azure-stack-add-new-user-aad.md)

