---
title: Using the Azure Stack portal | Microsoft Docs
description: Learn how to access and use the user portal in Azure Stack.
services: azure-stack
documentationcenter: ''
author: twooley
manager: byronr
editor: ''

ms.assetid: 5aa00123-5b87-45e0-a671-4165e66bfbc6
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/25/2017
ms.author: twooley

---
# Using the Azure Stack portal

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

As a consumer of Azure Stack services, you can use the Azure Stack portal to subscribe to public offers, and use the services that are made available through those offers. If you’ve used the Azure portal before, you’re already familiar with the user interface.

## Access the portal

Your Azure Stack operator (either a service provider or an administrator in your organization), will let you know the correct URL to access the portal. 

- For an integrated system, the URL varies based on your operator’s region and external domain name, and will be in the format https://portal.&lt;*region*&gt;.&lt;*FQDN*&gt;.
- If you’re using the Azure Stack Development Kit, the portal address is https://portal.local.azurestack.external.

![Screenshot of the Azure Stack user portal](media/azure-stack-use-portal/UserPortal.png)

## Customize the dashboard

The dashboard contains a set of default tiles. You can click **Edit dashboard** to modify the default dashboard, or click **New dashboard** to add custom dashboards. You can easily add tiles to the dashboard. For example, you can click **New**, right-click **Compute**, and then click **Pin to dashboard**.

## Create subscription and browse available resources
 
If you don’t already have a subscription, the first thing you need to do is subscribe to an offer. After that, you can browse which resources are available to you. To browse and create resources, do any of the following:

- Click the **Marketplace** tile on the dashboard. 
- On the **All resources** tile, click **Create resources**.
- On the left navigation pane, click **New**.

## Learn how to use available services

If you need guidance for how to use available services, there may be different options available to you.

- Your organization or service provider may provide their own documentation. This is especially true if they offer customized services or apps.
- Third-party apps have their own documentation.
- For Azure-consistent services, we strongly recommend that you first review the Azure Stack documentation. To access the Azure Stack user documentation, click the Help icon, and then click **Help + support**.
 
    ![Screenshot of the Help and support option in the UI](media/azure-stack-use-portal/HelpAndSupport.png)

    In particular, we suggest that you review the following articles to get started:

    - [Key considerations: Using services or building apps for Azure Stack](azure-stack-considerations.md)
    - In the “Use services” section of the documentation, you’ll see each Azure-consistent service listed. There is a “considerations” topic for each service, which describes the deltas between the service offered in Azure, and the same service offered in Azure Stack. For an example, see [VM considerations](azure-stack-vm-considerations.md). There may be other information in the “Use services” section that’s unique to Azure Stack. 
     
      You can use the Azure documentation as general reference for a service, but you must be aware of these differences. Understand that the documentation links on the **Quickstart tutorials** tile point to Azure documentation.

## Get support

If you need additional support, please contact your organization or service provider for assistance. 

If you’re using the Azure Stack Development Kit, the [Azure Stack forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=azurestack) is the only method of support.

## Next steps

[Key considerations: Using services or building apps for Azure Stack](azure-stack-considerations.md)
