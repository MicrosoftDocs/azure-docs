---
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: include
ms.date: 03/17/2022
---

Return to the Azure portal for Azure SQL Database to verify it is now governed by Microsoft Purview
1. Sign in to the Azure portal through [this link](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Sql%2Fservers)

1. Select the Azure SQL Server that you want to configure.

1. Go to **Azure Active Directory** on the left pane.

1. Scroll down to **Microsoft Purview access policies**.

1. Select the button to **Check for Microsoft Purview Governance**. Wait while the request is processed. It may take a few minutes.
   ![Screenshot that shows Azure SQL is governed by Microsoft Purview.](../media/how-to-policies-data-owner-sql/check-governed-status-azure-sql-db.png)

1. Confirm that the Microsoft Purview Governance Status shows `Governed`. Note that **it may take a few minutes** after you enable *Data use management* in Microsoft Purview for the correct status to be reflected.
