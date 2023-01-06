---
title: Application Insights funnels
description: Learn how you can use funnels to discover how customers are interacting with your application.
ms.topic: conceptual
ms.date: 11/15/2022
ms.reviewer: mmcc
---

# Discover how customers are using your application with Application Insights funnels

Understanding the customer experience is of great importance to your business. If your application involves multiple stages, you need to know if customers are progressing through the entire process or ending the process at some point. The progression through a series of steps in a web application is known as a *funnel*. You can use Application Insights funnels to gain insights into your users and monitor step-by-step conversion rates.

## Create your funnel
Before you create your funnel, decide on the question you want to answer. For example, you might want to know how many users view the home page, view a customer profile, and create a ticket.

To create a funnel:

1. On the **Funnels** tab, select **Edit**.
1. Choose your **Top Step**.

     :::image type="content" source="./media/usage-funnels/funnel.png" alt-text="Screenshot that shows the Funnel tab and selecting steps on the Edit tab." lightbox="./media/usage-funnels/funnel.png":::

1. To apply filters to the step, select **Add filters**. This option appears after you choose an item for the top step.
1. Then choose your **Second Step** and so on.

    > [!NOTE]
    > Funnels are limited to a maximum of six steps.

1. Select the **View** tab to see your funnel results.

      :::image type="content" source="./media/usage-funnels/funnel-2.png" alt-text="Screenshot that shows the Funnels View tab that shows results from the top and second steps." lightbox="./media/usage-funnels/funnel-2.png":::

1. To save your funnel to view at another time, select **Save** at the top. Use **Open** to open your saved funnels.

### Funnels features

Funnels have the following features:

- If your app is sampled, you'll see a sampling banner. Selecting the banner opens a context pane that explains how to turn off sampling.
- Select a step to see more details on the right.
- The historical conversion graph shows the conversion rates over the last 90 days.
- Understand your users better by accessing the users tool. You can use filters in each step.

## Next steps

  * [Usage overview](usage-overview.md)
  * [Users, sessions, and events](usage-segmentation.md)
  * [Retention](usage-retention.md)
  * [Workbooks](../visualize/workbooks-overview.md)
  * [Add user context](./usage-overview.md)
  * [Export to Power BI](../logs/log-powerbi.md) if you've [migrated to a workspace-based resource](convert-classic-resource.md)
