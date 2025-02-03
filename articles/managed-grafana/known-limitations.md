---
title: Azure Managed Grafana service limits
titlesuffix: Azure Managed Grafana
description: Learn about current service limits, quotas, and constraints you may encounter using Azure Managed Grafana.
ms.service: azure-managed-grafana
ms.topic: troubleshooting
ms.date: 12/17/2024
ms.author: malev
ms.custom: engagement-fy23
author: maud-lv
---

# Service limits, quotas, and constraints

Azure Managed Grafana delivers the native Grafana functionality in the highest possible fidelity. There are some differences between what it provides and what you can get by self-hosting Grafana. As a general rule, Azure Managed Grafana disables features and settings that might affect the security or reliability of the service and individual Grafana instances it manages.

## Service limits

Azure Managed Grafana has the following known limitations:

* All users must have accounts in Microsoft Entra ID. Third-party accounts aren't supported. As a workaround, use the default tenant of your Azure subscription with your Grafana instance and add other users as guests.

* Installing, uninstalling and upgrading plugins from the Grafana Catalog isn't possible.

* Querying Azure Data Explorer might take a long time or return 50x errors. To resolve these issues, use a table format instead of a time series, shorten the time duration, or avoid having many panels querying the same data cluster that can trigger throttling.

* Users can be assigned the following Grafana Organization level roles: Admin, Editor, or Viewer. The Grafana Server Admin role isn't available to customers.

* Some Data plane APIs require Grafana Server Admin permissions and can't be called by users. This includes the [Admin API](https://grafana.com/docs/grafana/latest/developers/http_api/admin/), the [User API](https://grafana.com/docs/grafana/latest/developers/http_api/user/#user-api) and the [Admin Organizations API](https://grafana.com/docs/grafana/latest/developers/http_api/org/#admin-organizations-api).

* Azure Managed Grafana currently doesn't support the Grafana Role Based Access Control (RBAC) feature and the [RBAC API](https://grafana.com/docs/grafana/latest/developers/http_api/access_control/) is therefore disabled.

* Unified alerting is enabled by default for all instances created after December 2022. For instances created before this date, unified alerting must be enabled manually by the Azure Managed Grafana team. For activation, [open a support ticket](find-help-open-support-ticket.md#open-a-support-ticket).

* > Only Azure subscriptions billed directly through Microsoft are eligible for the purchase of Grafana Enterprise. CSP subscriptions, i.e., Azure subscriptions billed through Cloud Solution Providers (CSP), are ineligible.

## Current User authentication

The *Current User* authentication option triggers the following limitation. Grafana offers some automated features such as alerts and reporting, that are expected to run in the background periodically. The Current User authentication method relies on a user being logged in, in an interactive session, to connect a data source to a database. Therefore, when this authentication method is used and no user is logged in, automated tasks can't run in the background. To leverage automated tasks, we recommend setting up another data source with another authentication method or [configuring alerts in Azure Monitor](./how-to-use-azure-monitor-alerts.md).

## Feature availability in sovereign clouds

Some Azure Managed Grafana features aren't available in Azure Government and Microsoft Azure operated by 21Vianet due to limitations in these specific environments. The following table lists these differences.

| Feature                           | Azure Government | Microsoft Azure operated by 21Vianet (Preview) |
|-----------------------------------|:----------------:|:----------------------------------------------:|
| Private link                      |   Not supported  |                  Not supported                 |
| Managed private endpoint          |   Not supported  |                  Not supported                 |
| Team sync with Microsoft Entra ID |      Preview     |                     Preview                    |
| Enterprise plugins                |   Not supported  |                  Not supported                 |
| Essential plan                    |     Supported    |                  Not supported                 |

## Throttling limits and quotas

The following quotas apply to the Essential (preview) and Standard plans.

[!INCLUDE [Azure Managed Grafana limits](../../includes/azure-managed-grafana-limits.md)]

Each data source also has its own limits that can be reflected in Azure Managed Grafana dashboards, alerts and reports. We recommend that you research these limits in the documentation of each data source provider. For instance:

* Refer to [Azure Monitor](/azure/azure-monitor/service-limits) to learn about Azure Monitor service limits including alerts, Prometheus metrics, data collection, logs and more.
* Refer to [Azure Data Explorer](/azure/data-explorer/kusto/concepts/querylimits) to learn about Azure Data Explorer service limits.

## Managed identities

Each Azure Managed Grafana instance can only be assigned one managed identity, user-assigned or system-assigned, but not both.

## Related links

> [!div class="nextstepaction"]
> [Troubleshooting](./troubleshoot-managed-grafana.md)
> [Support](./find-help-open-support-ticket.md)
