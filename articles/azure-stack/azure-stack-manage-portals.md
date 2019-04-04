---
title: Using the administration portal in Azure Stack | Microsoft Docs
description: As an Azure Stack operator, learn how to use the administration portal.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.custom: mvc
ms.date: 02/25/2019
ms.author: jeffgilb
ms.custom: mvc
ms.reviewer: efemmano
ms.lastreviewed: 02/25/2019

---
# Quickstart: use the Azure Stack administration portal

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

There are two portals in Azure Stack; the administration portal and the user portal (sometimes referred to as the *tenant* portal.) As an Azure Stack Operator, you use the administration portal for day-to-day management and operations of Azure Stack.

## Access the administrator portal

To access the administrator portal, browse to the portal URL and sign in by using the credentials of an Azure Stack operator. For an integrated system, the portal URL varies based on the region name and external fully qualified domain name (FQDN) of your Azure Stack deployment. The administration portal URL is always the same for Azure Stack Development Kit (ASDK) deployments. 

| Environment | Administrator Portal URL |   
| -- | -- | 
| ASDK| https://adminportal.local.azurestack.external  |
| Integrated systems | https://adminportal.&lt;*region*&gt;.&lt;*FQDN*&gt; | 
| | |

> [!TIP]
> For an ASDK environment, you need to first make sure that you can [connect to the development kit host](azure-stack-connect-azure-stack.md) through Remote Desktop Connection or through a virtual private network (VPN).

 ![The administration portal](media/azure-stack-manage-portals/admin-portal.png)

The default time zone for all Azure Stack deployments is set to Coordinated Universal Time (UTC). 

In the administrator portal, you can do things like:

* [Register Azure Stack with Azure](azure-stack-registration.md)
* [Populate the marketplace](azure-stack-download-azure-marketplace-item.md)
* [Create plans, offers, and subscriptions for users](azure-stack-plan-offer-quota-overview.md)
* [Monitor health and alerts](azure-stack-monitor-health.md)
* [Manage Azure Stack updates](azure-stack-updates.md)

The **Quickstart tutorial** tile provides links to online documentation for the most common tasks.

Although an operator can create resources such as virtual machines, virtual networks, and storage accounts in the administration portal, you should [sign in to the user portal](user/azure-stack-use-portal.md) to create and test resources.

>[!NOTE]
>The **Create a virtual machine** link in the quickstart tutorial tile has you create a virtual machine in the administration portal, but this is only intended to validate that Azure Stack has been deployed successfully.

## Understand subscription behavior

There are three subscriptions created by default in the administration portal; consumption, default provider, and metering. As an Operator, you will mostly use the *Default Provider Subscription*. You can't add any other subscriptions and use them in the administration portal. 

Other subscriptions are created by users in the user portal based on the plans and offers you create for them. However, the user portal doesn't provide access to any of the administrative or operational capabilities of the administration portal.

The administration and user portals are backed by separate instances of Azure Resource Manager. Because of this Azure Resource Manager separation, subscriptions do not cross portals. For example, if you, as an Azure Stack Operator, sign in to the user portal, you can't access the *Default Provider Subscription*. Although you don't have access to any administrative functions, you can create subscriptions for yourself from available public offers. As long as you're signed in to the user portal you are considered a tenant user.

  >[!NOTE]
  >In an ASDK environment, if a user belongs to the same tenant directory as the Azure Stack Operator, they are not blocked from signing in to the administration portal. However, they can't access any of the administrative functions or add subscriptions to access offers that are available to them in the user portal.

## Administration portal tips

### Customize the dashboard

The dashboard contains a set of default tiles. You can select **Edit dashboard** to modify the default dashboard, or select **New dashboard** to add a custom dashboard. You can easily add tiles to a dashboard. For example, you can select **+ Create a resource**, right-click **Offers + Plans**, and then select **Pin to dashboard**.

Sometimes, you might see a blank dashboard in the portal. To recover the dashboard, click **Edit Dashboard**, and then right-click and select **Reset to default state**.

### Quick access to online documentation

To access the Azure Stack Operator documentation, use the Help and support icon (question mark) in the upper-right corner of the administrator portal. Move your cursor to the icon, and then select **Help + support**.

### Quick access to help and support

If you select the Help and support icon (question mark) in the upper-right corner of the administrator portal, and then select **New support request**, one of the following results happens:

- If you're using an integrated system, this action opens a site where you can directly open a support ticket with Microsoft Customer Support Services (CSS). Refer to [Where to get support](azure-stack-manage-basics.md#where-to-get-support) to understand when you should go through Microsoft support or through your original equipment manufacturer (OEM) hardware vendor support.
- If you’re using the ASDK, this action opens the [Azure Stack forums site](https://social.msdn.microsoft.com/Forums/home?forum=AzureStack) directly. These forums are regularly monitored. Because the ASDK is an evaluation environment, there is no official support offered through Microsoft CSS.

### Quick access to the Azure roadmap

If you select **Help and support** (the question mark) in the upper right corner of the administration portal, and then select **Azure roadmap**, a new browser tab opens and takes you to the Azure roadmap. By typing **Azure Stack** in the **Products** search box, you can see all Azure Stack roadmap updates.

## Next steps

[Register Azure Stack with Azure](azure-stack-registration.md) and populate the [Azure Stack marketplace](azure-stack-marketplace.md) with items to offer your users. 
