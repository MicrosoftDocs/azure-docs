---
title: Azure Application Insights Funnels
description: Learn how you can use Funnels to discover how customers are interacting with your application.
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 07/17/2017
ms.author: mbullwin
---

# Discover how customers are using your application with the Application Insights Funnels

Understanding customer experience is of the utmost importance to your business. If your application involves multiple stages, you will need to know if most customers are progressing through the entire process, or if they are ending the process at some point. The progression through a series of steps in a web application is known as a "funnel". You can use the Application Insights Funnels to gain insights into your users and monitor step-by-step conversion rates. 

## Create your funnel
Before you create your funnel, you need to decide on the question you want to answer. For example, you might want to know how many users are viewing the home page, viewing a customer profile and creating a ticket. In this example, the owners of the Fabrikam Fiber company want to know the percentage of customers who successfully create a customer ticket.

Here are the steps they take to create their funnel.

1. Click the New button on the Funnels tool.
1. Select the time range of "Last 90 days" from the **Time Range** drop-down. Select either "My funnels" or "Shared funnels"
1. Select the **Index** event from the **Step 1** drop-down list. 
1. Select the **Customer** event from the **Step 2** drop-down list.
1. Select the **Create** event from the **Step 3** drop-down list.
1. Add a name to the funnel and click **Save**.

The following illustration demonstrates the data the Funnels tool generates. From here the Fabrikam owners can see that during the last 90 days, 54.3% of their customers who visited the home page created a customer ticket. They can also see that 2.7k of their customers came to the index from the home page, this could indicate a refresh issue.


![Funnels tool with data](./media/app-insights-understand-usage-patterns/funnel1.png)

## Funnel features
1. If your app is sampled, you will see a sampling banner. Clicking on the banner will open a context pane instructing how to turn sampling off. 
2. You can export your funnel to [Power BI](app-insights-export-power-bi.md).
3. Click on a step to get deeper insights on the right. 
4. Historical conversion shows the conversion over the last 90 days. 
5. Understand your users better by going to the users tool from Funnels. Each step will give you curated users filters. 

## Next steps
  * [Usage overview](app-insights-usage-overview.md)
  * [Users, Sessions, and Events](app-insights-usage-segmentation.md)
  * [Retention](app-insights-usage-retention.md)
  * [Workbooks](app-insights-usage-workbooks.md)
  * [Add user context](app-insights-usage-send-user-context.md)
  * [Export to Power BI](app-insights-export-power-bi.md)

