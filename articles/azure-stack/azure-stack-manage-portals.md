---
title: Using the administrator portal in Azure Stack | Microsoft Docs
description: As an Azure Stack operator, learn how to use the administrator portal.
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
ms.date: 09/25/2017
ms.author: twooley

---
# Using the administrator portal in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

There are two portals in Azure Stack; the administrator portal and the user portal (sometimes referred to as the *tenant* portal). As an Azure Stack operator, you can use the administrator portal for day-to-day management and operations of Azure Stack. 

## Access the administrator portal

For a development kit environment, you need to first make sure that you can [connect to the development kit host](azure-stack-connect-azure-stack.md) through Remote Desktop Connection or through a virtual private network (VPN).

To access the administrator portal, browse to the portal URL and sign in by using the credentials of an Azure Stack operator. For an integrated system, the portal URL varies based on the region name and external fully qualified domain name (FQDN) of your Azure Stack deployment.

| Environment | Administrator Portal URL |   
| -- | -- | 
| Development kit| https://adminportal.local.azurestack.external  |
| Integrated systems | https://adminportal.&lt;*region*&gt;.&lt;*FQDN*&gt; | 
| | |

 ![The administrator portal](media/azure-stack-manage-portals/image1.png)

In the administrator portal, you can do things such as:

* manage the infrastructure (including system health, updates, capacity, etc.)
* populate the marketplace
* create plans and offers
* create subscriptions for users

In the **Quickstart tutorial** tile, there are links to online documentation for the most common tasks.
 
Although there is the ability for an operator to create resources such as virtual machines, virtual networks, and storage accounts in the administrator portal, you should [sign in to the user portal](user/azure-stack-use-portal.md) to create and test resources. (The **Create a virtual machine** link in the quickstart tutorial tile has you create a virtual machine in the administrator portal, but this procedure is only to validate Azure Stack after initial deployment.)

## Subscription behavior
 
There is only one subscription that is available in the administrator portal. This subscription is the *Default Provider Subscription*. You can't add any other subscriptions for use in the administrator portal.

As an Azure Stack operator, you can add subscriptions for your users (including yourself) from the administrator portal. Users (including yourself) can access and use these subscriptions from the user portal. The user portal does not provide access to any of the administrative or operational capabilities of the administrator portal.

The administrator and user portals are backed by separate instances of Azure Resource Manager. Because of the Resource Manager separation, subscriptions do not cross portals. For example, if you as an Azure Stack operator signs in to the user portal, you can't access the Default Provider Subscription. Therefore, you don't have access to any administrative functions. You can create subscriptions for yourself from public offers, but you are considered a tenant user.

  >[!NOTE]
  In the development kit environment, if a user belongs to the same tenant directory as the Azure Stack operator, they are not blocked from signing in to the administrator portal. However, they can't access any of the administrative functions. Also, from the administrator portal, they can't add subscriptions or access offers that are made available to them in the user portal.

## Administrator portal tips

### Customize the dashboard

The dashboard contains a set of default tiles. You can click **Edit dashboard** to modify the default dashboard, or click **New dashboard** to add custom dashboards. You can easily add tiles to the dashboard. For example, you can click **New**, right-click **Offers + Plans**, and then click **Pin to dashboard**.

### Quick access to online documentation

To access the Azure Stack operator documentation, click the Help and support icon (question mark) in the upper-right corner of the administrator portal, and then click **Help + support**.

### Quick access to help and support

If you click the Help and support icon (question mark) in the upper-right corner of the administrator portal, and then click **New support request**, this does either of the following:

- If you're using an integrated system, this action opens a site where you can directly open a support ticket with Microsoft Customer Support Services (CSS). Refer to the "Where to get support" section of [Azure Stack administration basics](azure-stack-manage-basics.md) to understand when you should go through Microsoft support or through your original equipment manufacturer (OEM) hardware vendor support.
- If you’re using the development kit, this action opens the Azure Stack forums site directly. These forums are regularly monitored. Because the development kit is an evaluation environment, there is no official support offered through Microsoft CSS.

## Next steps

- [Region management in Azure Stack](azure-stack-region-management.md)
