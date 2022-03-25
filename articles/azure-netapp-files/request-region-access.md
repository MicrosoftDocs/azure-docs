---
title: Request region access for Azure NetApp Files | Microsoft Docs
description: Describes how to request access to a region for using Azure NetApp Files.
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 11/15/2021
ms.author: anfdocs
---
# Request region access for Azure NetApp Files

In some special situations, you might need to explicitly request access to a region. This article explains how to submit a request. 

## Steps

1. Go to **New Support Request** under **Support + troubleshooting**.   

2. Under the **Problem description** tab, provide the required information:
    1. For **Issue Type**, select **Service and Subscription Limits (Quotas)**.
    2. For **Subscription**, select your subscription. 
    3. For **Quota Type**, select **Storage: Azure NetApp Files limits**.

    ![Screenshot that shows the Problem Description tab.](../media/azure-netapp-files/support-problem-descriptions.png)

3. Under the **Additional details** tab, click **Enter details** in the Request Details field.  

    ![Screenshot that shows the Details tab and the Enter Details field.](../media/azure-netapp-files/quota-additional-details.png)

4. To request region access, provide the following information in the Quota Details window that appears:   
    1. In **Quota Type**, select **Region Access**.
    2. In **Region Requested**, select your region.

    ![Screenshot that shows the Quota Details window for requesting region access.](../media/azure-netapp-files/quota-details-region-access.png)

5. Click **Save and continue**. Click **Review + create** to create the request.

## Next steps  

- [Understand the storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md)
- [Cost model for Azure NetApp Files](azure-netapp-files-cost-model.md)
- [Regional capacity quota for Azure NetApp Files](regional-capacity-quota.md)
- [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
