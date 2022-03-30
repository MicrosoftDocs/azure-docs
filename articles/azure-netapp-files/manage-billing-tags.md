---
title: Manage Azure NetApp Files billing by using tags | Microsoft Docs
description: Describes how to manage Azure NetApp Files billing by using tags.
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
ms.date: 05/06/2021
ms.author: anfdocs
---
# Manage billing by using capacity pool billing tags

Tags are name and value pairs that enable you to categorize resources and view consolidated billing. You can apply the same tag to multiple resources and resource groups.  See [Use tags to organize your Azure resources and management hierarchy](../azure-resource-manager/management/tag-resources.md) for details about tags.  

Using tags helps you manage Azure NetApp Files billing and expenses. For example, your company might have only one Azure subscription but multiple departments that use Azure resources and incur expenses. You can tag the resources with the department names at the capacity pool level. The corresponding tags would be displayed in the bill to help you see the expense incurred by each department.   

Billing tags are assigned at the capacity pool level, not volume level.

## Steps

1. To add or edit a tag on a capacity pool, go to the **capacity pool** and select **Tags**.   

2. Fill in the **Name** and **Value** pair.  Click **Apply**.

    > [!IMPORTANT] 
    > Tag data is replicated globally. As such, do not use tag names or values that could compromise the security of your resources. For example, do not use tag names that contain personal or sensitive information. 

      ![Snapshot that shows the Tags window of a capacity pool.](../media/azure-netapp-files/billing-tags-capacity-pool.png)

3. You can display and download information about tagged resources by using the [Azure Cost Management](../cost-management-billing/cost-management-billing-overview.md) portal: 
    1. Click **Cost Analysis** and select the **Cost by resource** view.    
      [ ![Screenshot that shows Cost Analysis of Azure Cost Management](../media/azure-netapp-files/cost-analysis.png) ](../media/azure-netapp-files/cost-analysis.png#lightbox)  

    2. To download an invoice, selecting **Invoices** and then the **Download** button.   
      [ ![Screenshot that shows Invoices of Azure Cost Management](../media/azure-netapp-files/azure-cost-invoices.png) ](../media/azure-netapp-files/azure-cost-invoices.png#lightbox)  

    1. In the Download window that appears, download usage details. The downloaded `csv` file will include capacity pool billing tags for the corresponding resources.   
       ![Snapshot that shows the Download window of Azure Cost Management.](../media/azure-netapp-files/invoice-download.png)   

       [ ![Screenshot that shows the downloaded spreadsheet.](../media/azure-netapp-files/spreadsheet-download.png) ](../media/azure-netapp-files/spreadsheet-download.png#lightbox)

## Next steps

[Cost model for Azure NetApp Files](azure-netapp-files-cost-model.md) 