---
title: Monitoring Azure Static Web Apps
description: Monitor requests, failures, and tracing information in Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 4/23/2021
ms.author: cshoe
---

# Monitor Azure Static Web Apps

Enable [Application Insights](../azure-monitor/app/app-insights-overview.md) to monitor API  requests, failures, and tracing information.

> [!IMPORTANT]
> Application Insights has an [independent pricing model](https://azure.microsoft.com/pricing/details/monitor) from Azure Static Web Apps.

> [!NOTE]
> Using Application Insights with Azure Static Web Apps requires an application with an [API](./add-api.md).

## Add monitoring

Use the following steps to add Application Insights monitoring to your static web app.

1. Open the Static Web Apps instance in the Azure portal.

1. Select **Application Insights** from the menu.

1. Select **Yes** next to _Enable Application Insights_.

1. Select **Save**.

:::image type="content" source="media/monitoring/azure-static-web-apps-application-insights-add.png" alt-text="Add Application Insights to Azure Static Web Apps":::

> [!NOTE]
> Once you create the Application Insights instance, an associated application setting is created in the Azure Static Web Apps instance used to link the services together.

## Access data

1. From the _Overview_ window in your static web app, select the link next to the _Resource group_.

1. From the list, select the Application Insights instance prefixed with the same name as your static web app.

The following highlights a few locations in the portal used to inspect aspects of your application's API endpoints.

> [!NOTE]
> For more detail on Application Insights usage, refer to [Where do I see my telemetry?](../azure-monitor/app/app-insights-overview.md#where-do-i-see-my-telemetry).

| Type | Menu location | Description |
|--- | --- | --- |
| [Failures](../azure-monitor/app/asp-net-exceptions.md) | _Investigate > Failures_ | Review failed requests. |
| [Server requests](../azure-monitor/app/tutorial-performance.md) | _Investigate > Performance_ | Review individual API requests.  |
| [Logs](../azure-monitor/app/diagnostic-search.md) | _Monitoring > Logs_ | Interact with an editor to query transaction logs. |
| [Metrics](../azure-monitor/essentials/app-insights-metrics.md) | _Monitoring > Metrics_ | Interact with a designer to create custom charts using various metrics. |

### Traces

Using the following steps to view traces in your application.

1. Select **Logs** under _Monitoring_.

1. Hover your mouse over any card in the _Queries_ window.

1. Select the **Load Editor** button.

1. Replace the generated query with the word `traces`.

1. Select the **Run** button.

:::image type="content" source="media/monitoring/azure-static-web-apps-application-insights-traces.png" alt-text="View Application Insights traces":::

## Limit logging

In some cases you may want to limit logging while still capturing details on errors and warnings by making the following changes to your _host.json_ file of the Azure Functions app.

```json
{
    "version": "2.0",
    "logging": {
        "applicationInsights": {
            "samplingSettings": {
              "isEnabled": true
            },
            "enableDependencyTracking": false
        },
        "logLevels": {
            "default": "Warning"
        }
    }
}
```

## Next steps

> [!div class="nextstepaction"]
> [Setup authentication and authorization](authentication-authorization.md)
