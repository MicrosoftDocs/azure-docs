---
title: Azure Managed Grafana limitations
description: Overview of limitations of Azure Managed Grafana
ms.service: managed-grafana
ms.topic: troubleshooting
ms.date: 08/31/2022
ms.author: malev
author: maud-lv
---

# Limitations of Azure Managed Grafana

Azure Managed Grafana has the following known limitations:

## Known limitations

1. Azure Managed Grafana doesn't support connecting with personal Microsoft accounts currently. To work around it, each Azure subscription has a default tenant that you can use to connect with Azure Active Directory. You can also invite guest users from other tenants.

1. Installing, uninstalling and upgrading plugins isn't supported.

1. Large data source queries are capped at 80 MB. To mitigate this limitation, reduce the size of the query, for example, by shortening the time duration.

1. Query Azure Data Explorer data source might take a long time or return 50x errors. To mitigate this limitation, you can use a table format instead of a time series, shorten the time duration, or avoid having many panels querying the same data cluster to avoid throttling.

1. API key usage isn't in the audit log. This will come in a future release.

## Next steps

> [!div class="nextstepaction"]
> [Troubleshooting](./troubleshoot-managed-grafana.md)
