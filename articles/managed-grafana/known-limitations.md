---
title: Azure Managed Grafana limitations
description: List of known limitations in Azure Managed Grafana
ms.service: managed-grafana
ms.topic: troubleshooting
ms.date: 08/31/2022
ms.author: malev
author: maud-lv
---

# Limitations of Azure Managed Grafana

Azure Managed Grafana delivers the native Grafana functionality in the highest possible fidelity. There are some differences between what it provides and what you can get by self-hosting Grafana. As a general rule, Azure Managed Grafana disables features and settings that may affect the security or reliability of the service and individual Grafana instances it manages.

## Current limitations

Managed Grafana has the following known limitations:

* All users must have accounts in an Azure Active Directory. Microsoft (also known as MSA) and 3rd-party accounts aren't supported. As a workaround, use the default tenant of your Azure subscription with your Grafana instance and add other users as guests.

* Installing, uninstalling and upgrading plugins from the Grafana Catalog isn't possible.

* Data source query results are capped at 80 MB. To mitigate this constraint, reduce the size of the query, for example, by shortening the time duration.

* Querying Azure Data Explorer may take a long time or return 50x errors. To resolve these issues, use a table format instead of a time series, shorten the time duration, or avoid having many panels querying the same data cluster that can trigger throttling.

* API key usage isn't included in the audit log.

* Users can be assigned the following Grafana Organization level roles: Admin, Editor, or Viewer. The Grafana Server Admin role isn't available to customers.

* Some Data plane APIs require Grafana Server Admin permissions and can't be called by users. This includes the [Admin API](https://grafana.com/docs/grafana/latest/developers/http_api/admin/), the [User API](https://grafana.com/docs/grafana/latest/developers/http_api/user/#user-api) and the [Admin Organizations API](https://grafana.com/docs/grafana/latest/developers/http_api/org/#admin-organizations-api).

* Azure Managed Grafana currently doesn't support the Grafana Role Based Access Control (RBAC) feature and the [RBAC API](https://grafana.com/docs/grafana/latest/developers/http_api/access_control/) is therefore disabled.

## Next steps

> [!div class="nextstepaction"]
> [Troubleshooting](./troubleshoot-managed-grafana.md)
