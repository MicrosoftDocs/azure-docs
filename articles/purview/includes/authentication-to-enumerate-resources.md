---
author: whhender
ms.author: whhender
ms.service: purview
ms.topic: include
ms.date: 02/04/2022
---

1. Go to the subscription or the resource group in the Azure portal. 
1. Select **Access Control (IAM)** from the left menu.
1. Select **+Add**.
1. In the **Select input** box, select the **Reader** role and enter your Microsoft Purview account name (which represents its MSI file name).
1. Select **Save** to finish the role assignment. This will allow Microsoft Purview to list resources under a subscription or resource group.