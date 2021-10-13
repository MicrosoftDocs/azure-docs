---
title: Application Insights Funnels
description: Learn how you can use Funnels to discover how customers are interacting with your application.
ms.topic: conceptual
author: lgayhardt
ms.author: lagayhar
ms.date: 07/30/2021

---

# Discover how customers are using your application with Application Insights Funnels

Understanding the customer experience is of the utmost importance to your business. If your application involves multiple stages, you need to know if most customers are progressing through the entire process, or if they're ending the process at some point. The progression through a series of steps in a web application is known as a *funnel*. You can use Application Insights Funnels to gain insights into your users, and monitor step-by-step conversion rates. 

## Create your funnel
Before you create your funnel, decide on the question you want to answer. For example, you might want to know how many users are viewing the home page, viewing a customer profile, and creating a ticket. 

To create a funnel:

1. In the **Funnels** tab, select **Edit**.
1. Choose your *Top step*.

     :::image type="content" source="./media/usage-funnels/funnel.png" alt-text="Screenshot of the Funnel tab and selecting steps on the edit tab." lightbox="./media/usage-funnels/funnel.png":::

1. To apply filters to the step select **Add filters**, which will appear after you choose an item for the top step.
1. Then choose your *Second step* and so on.
1. Select the **View** tab to see your funnel results

      :::image type="content" source="./media/usage-funnels/funnel-2.png" alt-text="Screenshot of the funnel tab on view tab showing results from the top and second step." lightbox="./media/usage-funnels/funnel-2.png":::

1. To save your funnel to view at another time, select **Save** at the top. You can use **Open** to open your saved funnels.

### Funnels features

- If your app is sampled, you'll see a sampling banner. Selecting the banner opens a context pane, explaining how to turn sampling off. 
- Select a step to see more details on the right. 
- The historical conversion graph shows the conversion rates over the last 90 days. 
- Understand your users better by accessing the users tool. You can use filters in each step. 

## Next steps
  * [Usage overview](usage-overview.md)
  * [Users, Sessions, and Events](usage-segmentation.md)
  * [Retention](usage-retention.md)
  * [Workbooks](../visualize/workbooks-overview.md)
  * [Add user context](./usage-overview.md)
  * [Export to Power BI](./export-power-bi.md)