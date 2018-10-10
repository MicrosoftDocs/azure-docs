---
title: Region management in Azure Stack | Microsoft Docs
description: Overview of region management in Azure Stack.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.assetid: e94775d5-d473-4c03-9f4e-ae2eada67c6c
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/05/2018
ms.author: sethm
ms.reviewer: efemmano

---
# Region management in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Azure Stack uses the concept of regions, which are logical entities comprised of the hardware resources that make up the Azure Stack infrastructure. Inside Region management, you can find all resources that are required to successfully operate the Azure Stack infrastructure.

One integrated system deployment (referred to as an *Azure Stack cloud*) makes up a single region. Each Azure Stack Development Kit has one region, named **local**. If you deploy a second Azure Stack integrated system, or you set up another instance of the development kit on separate hardware, this Azure Stack cloud is a different region.

## Information available through the Region management tile

Azure Stack has a set of region management capabilities available in the **Region management** tile. This tile is available to an Azure Stack operator on the default dashboard in the administrator portal. Through this tile, you can monitor and update your Azure Stack region and its components, which are region-specific.

 ![The region management tile](media/azure-stack-manage-region/image1.png)

 If you click a region in the Region management tile, you can access the following information:

  ![Description of panes on the Region management blade](media/azure-stack-manage-region/image2.png)

1. **The resource menu**. Here, you can access specific infrastructure management areas, and view and manage user resources such as storage accounts and virtual networks.

2. **Alerts**. This lists system-wide alerts and provides details on each of those alerts.

3. **Updates**. Here you can view the current version of your Azure Stack infrastructure, available updates, and the update history. You can also update your integrated system.

4. **Resource providers**. Resource providers is the place to manage the user functionality offered by the components required to run Azure Stack. Each resource provider comes with an administrative experience. This experience can include alerts for the specific provider, metrics, and other management capabilities specific to the resource provider.

5. **Infrastructure roles**. Infrastructure roles are the components necessary to run Azure Stack. Only the infrastructure roles that report alerts are listed. By selecting a role, you can view the alerts associated with the role and the role instances where this role is running.

## Next steps

- [Monitor health and alerts in Azure Stack](azure-stack-monitor-health.md)
- [Manage updates in Azure Stack](azure-stack-updates.md)
