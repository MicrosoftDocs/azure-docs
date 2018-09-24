---
title: Using the Azure Stack portal | Microsoft Docs
description: Learn how to access and use the user portal in Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/12/2018
ms.author: mabrigg
ms.reviewer: efemmano

---
# Use the Azure Stack portal

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

You can use the Azure Stack portal to subscribe to public offers, and use the services that these offers provide. If you've used the global Azure portal, you're already familiar with how the site works.

## Access the portal

Your Azure Stack operator (either a service provider or an administrator in your organization), will let you know the correct URL to access the portal.

- For an integrated system, the URL varies based on your operator's region and external domain name, and will be in the format https://portal.&lt;*region*&gt;.&lt;*FQDN*&gt;.
- If you're using the Azure Stack Development Kit, the portal address is https://portal.local.azurestack.external.

![Screen capture of the Azure Stack user portal](media/azure-stack-use-portal/UserPortal.png)

## Customize the dashboard

The dashboard contains a default set of tiles. You can select **Edit dashboard** to modify the default dashboard, or select **New dashboard** to create a custom dashboard. You can easily customize a dashboard by adding or removing tiles. For example, to add a Compute tile, select **+ Create a resource**. Right-click **Compute**, and then select **Pin to dashboard**.

## Create subscription and browse available resources

If you don't already have a subscription, the first thing you need to do is subscribe to an offer. After that, you can browse the available resources. To browse and create resources, use any of the following approaches:

- Select the **Marketplace** tile on the dashboard.
- On the **All resources** tile, select **Create resources**.
- On the left navigation pane, select **+ Create a resource**.

## Learn how to use available services

If you need guidance for how to use available services, there may be different options available to you.

- Your organization or service provider may provide their own documentation, which is typically the case if they offer customized services or apps.
- Third-party apps have their own documentation.
- For Azure-consistent services, we strongly recommend that you first review the Azure Stack documentation. To access the Azure Stack user documentation, select the Help icon, and then select **Help + support**.

    ![Help and support option in the UI](media/azure-stack-use-portal/HelpAndSupport.png)

    In particular, we suggest that you review the following articles to get started:

    - [Key considerations: Using services or building apps for Azure Stack](azure-stack-considerations.md)
    - In the **Use services** section of the documentation, there is a considerations article for each service. The considerations page describes the differences between the service offered in Azure, and the same service offered in Azure Stack. For an example, see [VM considerations](azure-stack-vm-considerations.md). There may be other information in the **Use services** section that's unique to Azure Stack.

      You can use the Azure documentation as general reference for a service, but you must be aware of these differences. Understand that the documentation links on the **Quickstart tutorials** tile point to Azure documentation.

## Get support

If you need support, contact your organization or service provider for help.

If you're using the Azure Stack Development Kit, the [Azure Stack forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=azurestack) is the only source of support.

## Next steps

[Key considerations: Using services or building apps for Azure Stack](azure-stack-considerations.md)
