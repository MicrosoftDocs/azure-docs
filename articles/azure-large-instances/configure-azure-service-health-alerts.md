---
title: Configure Azure service health alerts
titleSuffix: Azure Large Instances
description: Explains how to configure Azure service health alerts.
ms.title: Configure Azure service health alerts
ms.topic: conceptual
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: azure-large-instances
ms.date: 06/01/2023
---
# Configure Azure Service Health alerts
This article explains how to configure Azure Service Health alerts.

You can get automatic notifications when there are planned maintenance events or unplanned
downtime that affects your infrastructure.

Follow these steps to configure Service Health alerts:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Search for “service health” in the search bar and select **Service Health** from the results.

    :::image type="content" source="media/health-alerts-step-2.png" alt-text="Screenshot of the health alert dashboard.":::

1. In the Service Health Dashboard, select **Health Alerts**.
    :::image type="content" source="media/health-alerts-step-3.png" alt-text="Screenshot of the health alert service issues.":::

1. Select **Create service health alert**.

    :::image type="content" source="media/health-alerts-step-4.png" alt-text="Screenshot of create health service alert.":::

1. Deselect **Select all** under **Services**.
    :::image type="content" source="media/health-alerts-step-5.png" alt-text="Screenshot of create health service alert rule.":::

1. Select **Azure Large Instances**.

1. Select the regions in which your Azure Large Instances for the Epic workload instances are deployed.
1. Under **Action Groups**, select **Create New**.
1. Fill in the details and select the type of notification for the Action (Examples: Email, SMS, Voice).

1. Click **OK** to add the Action.
1. Click **OK** to add the Action Group.
1. Verify you see your newly created Action Group.
You will now receive alerts when there are health issues or maintenance actions on your systems.
