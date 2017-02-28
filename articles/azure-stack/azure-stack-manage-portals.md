---
title: Using the administrator and user portals in Azure Stack | Microsoft Docs
description: Learn the differences between the administrator and user portals in Azure Stack.
services: azure-stack
documentationcenter: ''
author: twooley-MS
manager: byronr
editor: ''

ms.assetid: 02c7ff03-874e-4951-b591-28166b7a7a79
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/01/2017
ms.author: twooley

---
# Using the administrator and user portals in Azure Stack
Starting with the Technical Preview 3 (TP3) release of Azure Stack, there are two portals; the administrator portal and the user portal. The portals are backed by separate instances of Azure Resource Manager.

The following table shows how to connect to the portals and to endpoints in a single-node Azure Stack Proof of Concept (POC) environment.

|  Portal | URL | API endpoint URL |   
| -------- | ------------- | ------- |  
| Administrator | https://portal.local.azurestack.external  | https://api.local.azurestack.external  |  
| User | https://publicportal.local.azurestack.external | https://publicapi.local.azurestack.external  |
| | |


## The administrator portal
The administrator portal enables a cloud administrator to perform administrative tasks. An administrator can do thing such as:
* monitor health and alerts
* manage capacity
* populate the marketplace
* create plans and offers
* create subscriptions for tenant users

In addition to these administrative capabilities, an administrator can create resources such as virtual machines, virtual networks, and storage accounts.

 ![The administrator portal](media/azure-stack-manage-portals/image1.png)

 ## The user portal

 The user portal (also referred to as the *tenant* portal) does not provide access to any of the administrative functionalities of the administrator portal. The user portal enables a user to subscribe to public offers, and to use the services that are made available through them.

  ![The user portal](media/azure-stack-manage-portals/image2.png)
 
 ## Subscription behavior
 
 Make sure that you understand the following differences between subscription behavior in the two portals.

 Administrator portal:
* There is only one subscription that is available in the administrator portal. This is the "Default Provider Subscription." You cannot add any subscriptions for use in the administrator portal.
* As a cloud administrator, you can add subscriptions for your tenants (or for yourself) from the administrator portal. Your tenant users (or you) can access and use these subscriptions from the user portal.

  >[!NOTE]
  Because of the Azure Resource Manager separation, subscriptions do not cross portals. For example, if you as a cloud administrator signs in to the user portal, you can't access the Default Provider Subscription. Therefore, you don't have access to any administrative functionality. You can create new subscriptions for yourself from public offers, but you are considered a tenant user.

User portal:
* In the user portal, an account can have multiple subscriptions.

  >[!NOTE]
In the POC environment, if a tenant user belongs to the same directory, they are not blocked from signing in to the administrator portal. However, they can't access any of the administrative functions. Also, they can't add subscriptions or access offers that are made available to them in the user portal.


## Next steps

[Region management in Azure Stack](azure-stack-region-management.md)
[Connect to Azure Stack] (azure-stack-connect-azure-stack.md)
