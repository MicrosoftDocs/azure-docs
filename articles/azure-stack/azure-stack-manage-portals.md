---
title: Using the administrator and user portals in Azure Stack | Microsoft Docs
description: Learn the differences between the administrator and user portals in Azure Stack.
services: azure-stack
documentationcenter: ''
author: twooley
manager: byronr
editor: ''

ms.assetid: 02c7ff03-874e-4951-b591-28166b7a7a79
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/30/2017
ms.author: twooley

---
# Using the administrator and user portals in Azure Stack

There are two portals in Azure Stack; the administrator portal and the user portal (also referred to as the *tenant* portal). The portals are backed by separate instances of Azure Resource Manager.

The following table shows how to connect to the portals and to Resource Manager endpoints in an Azure Stack Development Kit environment.

|  Portal | Portal URL | Resource Manager endpoint URL |   
| -------- | ------------- | ------- |  
| Administrator | https://adminportal.local.azurestack.external  | https://adminmanagement.local.azurestack.external  |  
| User | https://portal.local.azurestack.external | https://management.local.azurestack.external  |
| | |

## The administrator portal

The administrator portal enables a cloud operator to perform administrative and operational tasks. A cloud operator can do things such as:
* monitor health and alerts
* manage capacity
* populate the marketplace
* create plans and offers
* create subscriptions for tenants

A cloud operator can also create resources such as virtual machines, virtual networks, and storage accounts.

 ![The administrator portal](media/azure-stack-manage-portals/image1.png)

 ## The user portal

 The user portal does not provide access to any of the administrative or operational capabilities of the administrator portal. In the user portal, a user can subscribe to public offers, and use the services that are made available through those offers.

  ![The user portal](media/azure-stack-manage-portals/image2.png)
 
 ## Subscription behavior
 
 Make sure that you understand the following differences between subscription behavior in the two portals.

 Administrator portal:
* There is only one subscription that is available in the administrator portal. This subscription is the *Default Provider Subscription*. You can't add any other subscriptions for use in the administrator portal.
* As a cloud operator, you can add subscriptions for your users (including yourself) from the administrator portal. Users (including yourself) can access and use these subscriptions from the user portal.

  >[!NOTE]
  Because of the Azure Resource Manager separation, subscriptions do not cross portals. For example, if you as a cloud operator signs in to the user portal, you can't access the Default Provider Subscription. Therefore, you don't have access to any administrative functions. You can create subscriptions for yourself from public offers, but you are considered a tenant user.

User portal:
* In the user portal, an account can have multiple subscriptions.

  >[!NOTE]
  In the development kit environment, if a tenant user belongs to the same directory as the cloud operator, they are not blocked from signing in to the administrator portal. However, they can't access any of the administrative functions. Also, they can't add subscriptions or access offers that are made available to them in the user portal.

## Next steps

[Connect to Azure Stack](azure-stack-connect-azure-stack.md)

[Region management in Azure Stack](azure-stack-region-management.md)
