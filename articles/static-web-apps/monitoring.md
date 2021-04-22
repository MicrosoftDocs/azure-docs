---
title: Monitoring Azure Static Web Apps Preview
description: Monitor requests, failures and tracing information in Azure Static Web Apps Preview
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 2/15/2021
ms.author: cshoe
---

# Monitor Azure Static Web Apps

Enable [Application Insights](../azure-monitor/app/app-insights-overview.md) to monitor requests, failures and tracing information.

## Requirements

- Requires an application with an [API](./add-api.md).
- Requires the same region as the associated Static Web Apps instance.

## Add monitoring

Use the following steps to add Application Insights monitoring to you static web app.

1. Open the Static Web Apps instance in the Azure portal.

1. Select **Application Insights** from the menu.

1. Select **Yes** next to _Enable Application Insights_.

1. Select **Save**.

:::image type="content" source="media/monitoring/azure-static-web-apps-application-insights-add.png" alt-text="Add Application Insights to Azure Static Web Apps":::

## Access data

1. From the _Overview_ window in your static web app, select the link next to the _Resource group_.

1. From the list, select the Application Insights instance prefixed with the same name as your static web app.

Following locations highlight a few ways to inspect aspects of your application's API endpoints.

> [!NOTE]
> For more detail on Application Insights usage, refer to [Where do I see my telemetry?](../azure-monitor/app/app-insights-overview.md#where-do-i-see-my-telemetry).

| Type | Menu location | Description |
|--- | --- | --- |
| Failures | _Investigate > Failures_ | Review failed requests. |
| Server requests | _Investigate > Performance_ | Review individual API requests.  |
| Logs | _Monitoring > Logs_ | Interact with an editor to query transaction logs. |
| Metrics | _Monitoring > Metrics_ | Interact with a designer to create custom charts using various metrics. |

## Next steps

> [!div class="nextstepaction"]
> [Setup authentication and authorization](authentication-authorization.md)
