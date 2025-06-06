---
title: Request region access for Azure NetApp Files | Microsoft Docs
description: Describes how to request access to a region for using Azure NetApp Files.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 02/10/2025
ms.author: anfdocs
---
# Request region access for Azure NetApp Files

In special situations, you need to explicitly request access to a region. Learn how to submit a request. 

## Steps

1. Go to **New Support Request** under **Support + troubleshooting**.   

2. Under the **Problem description** tab, provide the required information:
    1. For **Issue Type**, select **Service and Subscription Limits (Quotas)**.
    2. For **Subscription**, select your subscription. 
    3. For **Quota Type**, select **Storage: Azure NetApp Files limits**.

    ![Screenshot that shows the Problem Description tab.](./media/shared/support-problem-descriptions.png)

3. In the **Additional details** tab, select **Enter details** in the Request Details field.  

    ![Screenshot that shows the Details tab and the Enter Details field.](./media/shared/quota-additional-details.png)

4. To request region access, provide the following information in the Quota Details window that appears:   
    1. In **Quota Type**, select **Region Access**.
    2. In **Region Requested**, select your region.

    ![Screenshot that shows the Quota Details window for requesting region access.](./media/request-region-access/quota-details-region-access.png)

5. Select **Save and continue**. Click **Review + create** to create the request.

## Next steps  

- [Understand the storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md)
- [Cost model for Azure NetApp Files](azure-netapp-files-cost-model.md)
- [Regional capacity quota for Azure NetApp Files](regional-capacity-quota.md)
- [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
