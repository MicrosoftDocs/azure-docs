---
title: Application Insights Overview dashboard | Microsoft Docs
description: Monitor applications with Application Insights and Overview dashboard functionality.
ms.topic: conceptual
ms.date: 03/22/2023
---

# Application Insights Overview dashboard

Application Insights provides a summary in the overview pane to allow at-a-glance assessment of your application's health and performance.

:::image type="content" source="./media/overview-dashboard/overview.png" lightbox="./media/overview-dashboard/overview.png" alt-text="A screenshot of the Application Insights Overview pane.":::

A time range selection is available at the top of the interface.

:::image type="content" source="./media/overview-dashboard/app-insights-overview-dashboard-03.png" lightbox="./media/overview-dashboard/app-insights-overview-dashboard-03.png" alt-text="Screenshot that shows the time range.":::

Each tile can be selected to navigate to the corresponding experience. As an example, selecting the **Failed requests** tile opens the **Failures** experience.

:::image type="content" source="./media/overview-dashboard/app-insights-overview-dashboard-04.png" lightbox="./media/overview-dashboard/app-insights-overview-dashboard-04.png" alt-text="Screenshot that shows failures.":::

## Application dashboard

The application dashboard uses the existing dashboard technology within Azure to provide a fully customizable single pane view of your application health and performance.

To access the default dashboard, select **Application Dashboard**.

:::image type="content" source="./media/overview-dashboard/app-insights-overview-dashboard-05.png" lightbox="./media/overview-dashboard/app-insights-overview-dashboard-05.png" alt-text="Screenshot that shows the Application Dashboard button.":::

If it's your first time accessing the dashboard, it opens a default view.

:::image type="content" source="./media/overview-dashboard/0001-dashboard.png" lightbox="./media/overview-dashboard/0001-dashboard.png" alt-text="Screenshot that shows the Dashboard view.":::

You can keep the default view if you like it. Or you can also add and delete from the dashboard to best fit the needs of your team.

> [!NOTE]
> All users with access to the Application Insights resource share the same **Application Dashboard** experience. Changes made by one user will modify the view for all users.

## Frequently asked questions

### Can I display more than 30 days of data?

No, there's a limit of 30 days of data displayed in a dashboard.

### I'm seeing a "resource not found" error on the dashboard

A "resource not found" error can occur if you move or rename your Application Insights instance.

To work around this behavior, delete the default dashboard and select **Application Dashboard** again to re-create a new one.

## Next steps

- [Funnels](./usage-funnels.md)
- [Retention](./usage-retention.md)
- [User flows](./usage-flows.md)
