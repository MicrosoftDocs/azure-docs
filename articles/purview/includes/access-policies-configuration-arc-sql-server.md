---
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: include
ms.date: 11/30/2022
ms.custom: references_regions
---


This section describes the steps to configure SQL Server on Azure Arc to use Microsoft Purview. Execute these steps after you enable the *Data use management* option for this data source in the Microsoft Purview account.

1. Sign in to the Azure portal through [this link](https://portal.azure.com/#view/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/~/overview)

1. Navigate to **SQL servers** on the left pane. You will see a list of SQL Server instances on Azure Arc.

1. Select the SQL Server instance that you want to configure.

1. Go to **Azure Active Directory** on the left pane.

1. Scroll down to **Microsoft Purview access policies**.

1. Select the button to **Check for Microsoft Purview Governance**. Wait while the request is processed. While that happens, this message will be displayed at the top of the page. You may need to scroll up to see it. 
   ![Screenshot that shows Arc-SQL agent is processing a request](../media/how-to-policies-data-owner-sql/arc-sql-processing-request.png)

1. At the bottom of the page, confirm that the Microsoft Purview Governance Status shows `Governed`. Note that **it may take up to 30 minutes** for the correct status to be reflected. Continue doing a browser refresh until that happens. 

1. Confirm that the Microsoft Purview Endpoint points to the Microsoft Purview account where you registered this data source and enabled the *Data use management*

1. Compare the **App registration ID** with the one shown in the Microsoft Purview account registration for this data source

   ![Screenshot that shows Microsoft Purview endpoint status in the Azure Active Directory section.](../media/how-to-policies-data-owner-sql/setup-sql-on-arc-for-purview2.png)
