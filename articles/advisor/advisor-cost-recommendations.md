---
title: Azure Advisor Cost Recommendations | Microsoft Docs
description: Use Azure Advisor to optimize the cost of your Azure deployments.
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

# Azure Advisor Cost Recommendations

Advisor helps you optimize and reduce your overall Azure spend by identifying idle resources and resources with varying utilization patterns. You can get cost recommendations using Advisor from the **Cost** tab of the Advisor dashboard.

## Low utilization virtual machines 

While certain application scenarios can result in low utilization by design, you can often save money by managing the size and number of virtual machines. Advisor monitors your virtual machine usage for 14 days and identifies low utilization virtual machines. Virtual machines whose CPU utilization is 5% or less and network usage is 7 MB or less for 4 or more days, are considered as low utilization virtual machines.

Advisor shows you the estimated cost of continuing to run the virtual machine. You can choose to shut down or resize the virtual machine.  

![Advisor cost recommendations for resizing virtual machines](./media/advisor-cost-recommendations/advisor-cost-resizevms.png)

## SQL Elastic Database Pool recommendations

Advisor identifies SQL server instances that can benefit from creating elastic database pools. Elastic database pools provide a simple cost effective solution to manage the performance goals for multiple databases that have varying usage patterns. These recommendations offer inline actions.
For more information about Azure elastic pools, see [What is an Azure Elastic pool?](https://azure.microsoft.com/en-us/documentation/articles/sql-database-elastic-pool/)

![Advisor cost recommendations for elastic database pools](./media/advisor-cost-recommendations/advisor-cost-elasticdbpools.png)


# Next Steps

See these resources to learn more about Advisor recommendations:
-  [Introduction to Advisor](advisor-overview.md)
-  [Advisor FAQs](advisor-faqs.md)
-  [Advisor High Availability recommendations](advisor-cost-recommendations.md)
-  [Advisor Security recommendations](advisor-cost-recommendations.md)
-  [Advisor Performance recommendations](advisor-cost-recommendations.md)
