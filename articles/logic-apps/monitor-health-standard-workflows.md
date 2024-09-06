---
title: Monitor Standard workflows with Health Check
description: Set up Health Check to monitor health for Standard workflows in Azure Logic Apps.
services: azure-logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/06/2024
# Customer intent: As a developer, I want to monitor the health for my Standard logic app workflows in single-tenant Azure Logic Apps by setting up Health Check, which is an Azure App Service feature.
---

# Monitor health for Standard workflows in Azure Logic Apps with Health Check (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!NOTE]
> This capability is in preview and is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To help your Standard logic app workflows run with high availability and performance, set up the Health Check feature on your logic app to monitor workflow health. This feature makes sure that your app stays resilient by providing the following benefits:

- Proactive monitoring so you can find and address issues before they impact your customers.

- Increased availability by removing unhealthy instances from the load balancer in Azure.

- Automatic recovery by replacing unhealthy instances.

## How does Health Check work in Azure Logic Apps?

Health Check is an Azure App Service platform feature that redirects requests away from unhealthy instances and replaces those instances if they stay unhealthy. For a Standard logic app, you can specify a path to a "health" workflow that you create for this purpose and for the App Service platform to ping at regular intervals. For example, the following sample shows the basic minimum workflow:

:::image type="content" source="media/monitor-health-standard-workflows/health-workflow.png" alt-text="Screenshot shows Standard logic app workflow to use as the health workflow." lightbox="media/monitor-health-standard-workflows/health-workflow.png":::

After you enable Health Check, the App Service platform pings the specified workflow path for all logic app instances at 1-minute intervals. If the logic app requires scale out, Azure immediately creates a new instance. The App Service platform pings the workflow path again to make sure that the new instance is ready.

If a workflow running on an instance doesn't respond to the ping after 10 requests, the App Service platform determines that the instance is unhealthy and removes the instance for that specific logic app from the load balancer in Azure. With a two-request minimum, you can specify the required number of failed requests to determine that an instance is unhealthy. For more information about overriding default behavior, see [Configuration: Monitor App Service instances using Health Check](../app-service/monitor-instances-health-check.md#configuration).

After Health Check removes the unhealthy instance, the feature continues to ping the instance. If the instance responds with a healthy status code, inclusively ranging from 200 to 299, Health Check returns the instance to the load balancer. However, if the instance remains unhealthy for one hour, Health Check replaces the instance with a new one. For more information, see [What App Service does with health checks](../app-service/monitor-instances-health-check.md#what-app-service-does-with-health-checks).

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A Standard logic app resource with the following attributes:

  - An App Service plan that is scaled to two or more instances.

  - A "health" workflow that specifically runs the health check and the following elements:

    - Starts with the **Request** trigger named **When a HTTP request is received**.

    - Includes the **Request** action named **Response**. Set this action to return a status code inclusively between **200** to **299**.

    You can also optionally have this workflow run other checks to make sure that dependent services are available and work as expected. As a best practice, make sure that the Health Check path monitors critical components in your workflow. For example, if your app depends on a database and messaging system, make sure that Health Check can access those components.

## Limitations

- The specified path length must have fewer than 65 characters.

- Changes in the specified path for Health Check cause your logic app to restart. To reduce the impact on production apps, [set up and use deployment slots](set-up-deployment-slots.md).

- Health Check doesn't follow redirects for the **302** status code So, avoid redirects, and make sure to select a valid path that exists in your app.

## Set up Health Check

1. In the [Azure portal](https://portal.azure.com), go to your Standard logic app resource.

1. On the logic app menu, select **Diagnose and solve problems**.

1. On the **Diagnose and solve problems** page, in the search box, find and select **Health Check feature**.

   :::image type="content" source="media/monitor-health-standard-workflows/health-check.png" alt-text="Screenshot shows Azure portal, page for Diagnose and solve problems, search box with health check entered, and selected option for Health Check feature." lightbox="media/monitor-health-standard-workflows/health-check.png":::

1. In the **Health Check feature** section, select **View Solution**.

1. On the pane that opens, select **Configure and enable health check feature**. 

1. On the **Health check** tab, next to **Health check**, select **Enable**.

1. Under **Health probe path**, in the **Path** box, enter a valid URL path for your workflow, for example:

   **`/api/{workflow-name}/triggers/{request-trigger-name}/invoke?api-version=2022-05-01`**

1. Save your changes. On the toolbar, select **Save**.

1. In your logic app resource, update the **host.json** file by following these steps:

   1. On the logic app menu, under **Development Tools**, select **Advanced Tools** > **Go**.

   1. On the **KuduPlus** toolbar, from the **Debug console** menu, select **CMD**.

   1. Browse to the **site/wwwroot** folder, and next to the **host.json** file, select **Edit**.

   1. In the **host.json** file editor, add the **Workflows.HealthCheckWorkflowName** property and your health workflow name to enable health check authentication and authorization, for example:

      ```json
      "extensions": {
          "workflow": {
              "settings": {
                  "Workflows.HealthCheckWorkflowName" : "{workflow-name}"
              }
          }
      }
      ```

   1. When you finish, select **Save**.

## Troubleshooting

### After I set the health path, my health workflow doesn't trigger.

1. On the logic app menu, select **Diagnose and solve problems**.

1. Under **Troubleshooting categories**, select **Availability and Performance**.

   :::image type="content" source="media/monitor-health-standard-workflows/availability-performance.png" alt-text="Screenshot shows Azure portal, page for Diagnose and solve problems, and selected option for Availability and Performance." lightbox="media/monitor-health-standard-workflows/availability-performance.png":::

1. Find and review the status code section.

   If the status code is **401**, check the following items:

   - Confirm that the **Workflows.HealthCheckWorkflowName** property and your health workflow name appear correctly.

   - Confirm that the specified path matches the workflow and **Request** trigger name.

## Related content

- [Monitor and collect diagnostic data for workflows](monitor-workflows-collect-diagnostic-data.md)
- [Enable and view enhanced telemetry for Standard workflows](enable-enhanced-telemetry-standard-workflows.md)
- [View health and performance metrics](view-workflow-metrics.md)
