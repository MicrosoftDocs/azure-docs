---
title: Use Azure portal to monitor a managed application | Microsoft Docs
description: Shows how to use the Azure portal to monitor availability and alerts for a managed application.
services: managed-applications
author: tfitzmac

ms.service: managed-applications
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.date: 10/04/2018
ms.author: tomfitz
---
# Monitor a deployed instance of a managed application

In the Azure portal, you can monitor the availability of your deployed managed application. You can also set up and view alerts.

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

1. Select **+ New Alert Rule** to create an alert.

   ![Create alert](./media/monitor-managed-application-portal/create-new-alert.png)

You can create alerts for your managed application instance or the resources in the managed application. For information about creating alerts, see [Overview of alerts in Microsoft Azure](../monitoring-and-diagnostics/monitoring-overview-alerts.md).

## Next steps

* For managed application examples, see [Sample projects for Azure managed applications](sample-projects.md).
* To deploy a managed application, see [Deploy service catalog app through Azure portal](deploy-service-catalog-quickstart.md).