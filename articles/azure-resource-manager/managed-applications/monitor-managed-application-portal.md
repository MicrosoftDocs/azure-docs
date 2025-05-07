---
title: Use Azure portal to monitor a managed app
description: Shows how to use the Azure portal to monitor availability and alerts for a managed application.
ms.topic: how-to
ms.date: 06/24/2024
---

# Monitor a deployed instance of a managed application

After you deploy a managed application to your Azure subscription, you might want to check the status of the application. This article shows options in the Azure portal for checking the status. You can monitor the availability of the resources in your managed application. You can also set up and view alerts.

## View resource health

1. Select your managed application instance.

   ![Select managed application](./media/monitor-managed-application-portal/select-managed-application.png)

1. Select **Resource Health**.

   ![Select resource health](./media/monitor-managed-application-portal/select-resource-health.png)

1. View the availability of the resources in your managed application.

   ![View resource health](./media/monitor-managed-application-portal/view-health.png)

## View alerts

1. Select **Alerts**.

   ![Select alerts](./media/monitor-managed-application-portal/select-alerts.png)

1. If you have alert rules configured, you see information about alerts that were raised.

   ![View alerts](./media/monitor-managed-application-portal/view-alerts.png)

1. To add alert rules, select **+ New alert rule**.

   ![Create alert](./media/monitor-managed-application-portal/create-new-alert.png)

You can create alerts for your managed application instance or the resources in the managed application. For information about creating alerts, see [Overview of alerts in Microsoft Azure](/azure/azure-monitor/alerts/alerts-overview).

## Next steps

- For managed application examples, see [Sample projects for Azure managed applications](sample-projects.md).
- To deploy a managed application, see [Deploy service catalog app through Azure portal](deploy-service-catalog-quickstart.md).
