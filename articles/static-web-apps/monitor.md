---
title: Monitor Azure Static Web Apps
description: Monitor requests, failures, and tracing information in Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 09/19/2022
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

Once you create the Application Insights instance, it creates an associated application setting in the Azure Static Web Apps instance used to link the services together.

> [!NOTE]
> If you want to track how the different features of your web app are used end-to-end client side, you can insert trace calls in your JavaScript code. For more information, see [Application Insights for webpages](../azure-monitor/app/javascript.md?tabs=snippet).

## Access data

1. From the _Overview_ window in your static web app, select the link next to the _Resource group_.

1. From the list, select the Application Insights instance prefixed with the same name as your static web app.

The following table highlights a few locations in the portal you can use to inspect aspects of your application's API endpoints.

> [!NOTE]
> For more information on Application Insights usage, see the [App insights overview](../azure-monitor/app/app-insights-overview.md).

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

2. Select **Load Editor**.

3. Replace the generated query with the word `traces`.

4. Select **Run**.

:::image type="content" source="media/monitoring/azure-static-web-apps-application-insights-traces.png" alt-text="View Application Insights traces":::

## Limit logging

In some cases, you may want to limit logging while still capturing details on errors and warnings. You can do so by making the following changes to your _host.json_ file of the Azure Functions app.

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
> [Set up authentication and authorization](authentication-authorization.md)