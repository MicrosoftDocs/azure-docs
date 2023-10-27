---
title: Azure Managed Grafana limitations
description: Learn about current limitations in Azure Managed Grafana.
ms.service: managed-grafana
ms.topic: troubleshooting
ms.date: 10/18/2023
ms.author: malev
ms.custom: engagement-fy23
author: maud-lv
---

# Limitations of Azure Managed Grafana

Azure Managed Grafana delivers the native Grafana functionality in the highest possible fidelity. There are some differences between what it provides and what you can get by self-hosting Grafana. As a general rule, Azure Managed Grafana disables features and settings that might affect the security or reliability of the service and individual Grafana instances it manages.

## Current limitations

Azure Managed Grafana has the following known limitations:

* All users must have accounts in Microsoft Entra ID. Microsoft (also known as MSA) and 3rd-party accounts aren't supported. As a workaround, use the default tenant of your Azure subscription with your Grafana instance and add other users as guests.

* Installing, uninstalling and upgrading plugins from the Grafana Catalog isn't possible.

* Querying Azure Data Explorer might take a long time or return 50x errors. To resolve these issues, use a table format instead of a time series, shorten the time duration, or avoid having many panels querying the same data cluster that can trigger throttling.

* Users can be assigned the following Grafana Organization level roles: Admin, Editor, or Viewer. The Grafana Server Admin role isn't available to customers.

* Some Data plane APIs require Grafana Server Admin permissions and can't be called by users. This includes the [Admin API](https://grafana.com/docs/grafana/latest/developers/http_api/admin/), the [User API](https://grafana.com/docs/grafana/latest/developers/http_api/user/#user-api) and the [Admin Organizations API](https://grafana.com/docs/grafana/latest/developers/http_api/org/#admin-organizations-api).

* Azure Managed Grafana currently doesn't support the Grafana Role Based Access Control (RBAC) feature and the [RBAC API](https://grafana.com/docs/grafana/latest/developers/http_api/access_control/) is therefore disabled.

* Unified alerting is enabled by default for all instances created after December 2022. For instances created before this date, unified alerting must be enabled manually by the Azure Managed Grafana team. For activation, [contact us](mailto:ad4g@microsoft.com)

* Some Azure Managed Grafana features aren't available in Azure Government and Microsoft Azure operated by 21Vianet due to limitations in these specific environments. This following table lists the feature differences.

  | Feature | Azure Government | Microsoft Azure operated by 21Vianet |
  |---------|:------------:|:------------:|
  | Private link | &#x274C; | &#x274C; |
  | Managed private endpoint | &#x274C; | &#x274C; |
  | Team sync with Microsoft Entra ID | &#x274C; | &#x274C; |
  | Enterprise plugins | &#x274C; | &#x274C; |

## Quotas

The following quotas apply to the Essential (preview) and Standard plans.

| Limit                                | Description                                                                                         | Essential       | Standard         |
|--------------------------------------|-----------------------------------------------------------------------------------------------------|-----------------|------------------|
| Alert rules                          | Maximum number of alert rules that can be created                                                   | Not supported   | 100 per instance |
| Dashboards                           | Maximum number of dashboards that can be created                                                    | 20 per instance | Unlimited        |
| Data sources                         | Maximum number of datasources that can be created                                                   | 5 per instance  | Unlimited        |
| API keys                             | Maximum number of API keys that can be created                                                      | 2 per instance  | 100 per instance |
| Data query timeout                   | Maximum wait duration for the reception of data query response headers, before Grafana times out    | 200 seconds     | 200 seconds      |
| Data source query size               | Maximum number of bytes that are read/accepted from responses of outgoing HTTP requests             | 80 MB           | 80 MB            |
| Render image or PDF report wait time | Maximum duration for an image or report PDF rendering request to complete before Grafana times out. | Not supported   | 220 seconds      |
| Instance count                       | Maximum number of instances in a single subscription per Azure region                               | 1               | 20               |

## Next steps

> [!div class="nextstepaction"]
> [Troubleshooting](./troubleshoot-managed-grafana.md)
> [Support](./find-help-open-support-ticket.md)
