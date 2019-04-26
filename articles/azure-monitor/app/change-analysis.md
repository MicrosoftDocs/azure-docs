---
title: Azure Monitor application change analysis - Discover changes that may impact live site issues/outages with Azure Monitor application change analysis  | Microsoft Docs
description: Troubleshoot application live site issues on Azure App Services with Azure Monitor application change analysis
services: application-insights
author: cawams
manager: carmonm
ms.assetid: ea2a28ed-4cd9-4006-bd5a-d4c76f4ec20b
ms.service: application-insights
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 04/26/2019
ms.author: cawa@microsoft.com
---

# Azure Monitor application change analysis (public preview)

When a live site issue/outage occurs determining root cause quickly is critical. Standard monitoring solutions may help you rapidly identify that there is a problem, and often even what component is failing. But this won't always lead to to an immediate answer of why the failure is occuring. Your site worked five minutes ago, now it's broken, what changed in the last five minutes? This is the question that the new feature Azure Monitor application change analysis is designed to answer. By building on the power of the [Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/overview) application change analysis provides insight into your Azure App Service application changes to increase observabilty and reduce MTTR (Mean Time To Repair).

> [!IMPORTANT]
> Azure Monitor application change analysis is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## How do I use application change analysis?

Azure Monitor application change analysis is currently built into the self-service **Diagnose and solve problems** experience which can be accessed from the **Overview** section of you Azure App Service application:

![Screenshot of Azure App Service overview page with red boxes around overview button and diagnose and solve problems button](./media/change-analysis/change-analysis.png)

## Next Steps

- Improve your monitoring of Azure App Services [by enabling the Application Insights features](azure-web-apps.md) of Azure Monitor.
- Enhance your understanding of the [Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/overview) which helps power Azure Monitor application change analysis. 
