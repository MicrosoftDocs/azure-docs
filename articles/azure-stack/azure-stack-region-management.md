
---
title: Region management in Azure Stack | Microsoft Docs
description: Overview of region management in Azure Stack.
services: azure-stack
documentationcenter: ''
author: efemmano
manager: dsavage
editor: ''

ms.assetid: e94775d5-d473-4c03-9f4e-ae2eada67c6c
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/13/2017
ms.author: efemmano

---
# Region management in Azure Stack
Azure Stack Technical Preview 2 introduces the concept of regions, which are logical entities comprised of the hardware resources making up the Azure Stack infrastructure. Inside Region Management, you can find all required resources to successfully operate the Azure Stack infrastructure lifecycle.

The Azure Stack Proof of Concept (POC) is a single node deployment and equals one region. If you set up another instance of Azure Stack POC on separate hardware, this instance will be a different region.

## Information available through the Region Management tile
This preview release of Azure Stack introduces a set of region management capabilities available in the **Region Management** tile. In this tile, you can monitor and update your Azure Stack region and its components, which are region-specific.

 ![The region management tile](media/azure-stack-manage-region/image1.png)

 Here is what’s new in this technical preview: 

  ![Description of panes on the Region Management blade](media/azure-stack-manage-region/image2.png)
  
1. **Quickstart**. You can find Azure Stack-related documentation and links to it here. 

2. **Alerts**. This tile lists system-wide alerts and provides details on each of those alerts.

3. **Infrastructure roles**. Infrastructure roles are the components necessary to run Azure Stack. By clicking a role, you can view the alerts associated with the specific role and the role instances where this role is running.

  >[!NOTE]
  In Azure Stack Technical Preview 2, only the Health Controller role surfaces alerts in this journey.

4. **Resource providers**. Resource providers is the place to manage the tenant functionality offered by the components required to run Azure Stack. Each one comes with an administrative experience. This experience can include alerts for the specific provider, metrics, and other management capabilities specific to the resource provider.

  >[!NOTE]
  In Azure Stack Technical Preview 2, only Storage, Compute, and Network resource providers offer an associated experience.

5. **Updates**. In this tile, you can view the update status of your Azure Stack infrastructure, including version, update availability, and updates history. For more information, see [Updates management in Azure Stack](azure-stack-updates.md).

## Next steps
[Updates management in Azure Stack](azure-stack-updates.md)




