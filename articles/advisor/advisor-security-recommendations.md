---
title: Azure Advisor Security Recommendations | Microsoft Docs
description: Use Azure Advisor to help improve the security of your Azure deployments.
services: advisor
documentationcenter: NA
author: kumudd
manager: carmonm
editor: ''

ms.assetid: 
ms.service: advisor
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 11/16/2016
ms.author: kumudd
---
# Advisor security recommendations

Advisor provides you with a consistent, consolidated view of recommendations for all your Azure resources. It integrates with Azure Security Center to bring you security recommendations. You can get security recommendations from the **Security** tab in the Advisor dashboard.

Security Center helps you prevent, detect, and respond to threats with increased visibility into and control over the security of your Azure resources. It periodically analyzes the security state of your Azure resources. When Security Center identifies potential security vulnerabilities, it creates recommendations. The recommendations guide you through the process of configuring the needed controls. 

![Advisor security tab](./media/advisor-security-recommendations/advisor-security-tab.png)

For more information about security recommendations, see [Managing security recommendations in Azure Security Center](https://azure.microsoft.com/en-us/documentation/articles/security-center-recommendations/)

## How to access security recommendations in Azure Advisor

1. Sign in into the [Azure portal](https://portal.azure.com).
2. In the left-navigation pane, click **More services**, in the service menu pane, scroll down to **Monitoring and Management**, and then click **Azure Advisor**. This launches the Advisor dashboard. 
3. On the Advisor dashboard, click the **Security** tab, and select the subscription for which you’d like to receive recommendations.
   > [!NOTE]
   > Advisor generates recommendations for subscriptions where you have been assigned the role of **Owner, Contributor, or Reader**.  

![Advisor security tab](./media/advisor-security-recommendations/advisor-security-recommendations.png)

## Next steps

See these resources to learn more about Advisor recommendations:
-  [Advisor High Availability recommendations](advisor-high-availability-recommendations.md)
-  [Advisor Performance recommendations](advisor-performance-recommendations.md)
-  [Advisor Cost recommendations](advisor-performance-recommendations.md)
 
