---
title: Logs - Hyperscale (Citus) - Azure Database for PostgreSQL
description: How to access database logs for Azure Database for PostgreSQL - Hyperscale (Citus)
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: conceptual
ms.date: 7/13/2020
---

# Logs in Azure Database for PostgreSQL - Hyperscale (Citus)

PostgreSQL logs are available on every node of a Hyperscale (Citus) server
group. You can ship logs to a storage server, or to an analytics service. The
logs can be used to identify, troubleshoot, and repair configuration errors and
suboptimal performance.

## Accessing logs

To access PostgreSQL logs for a Hyperscale (Citus) coordinator or worker node,
open the node in the Azure portal:

![list of nodes](media/howto-hyperscale-logging/choose-node.png)

For the selected node, open **Diagnostic settings**, and click **+ Add
diagnostic setting**.

![Add diagnostic settings button](media/howto-hyperscale-logging/diagnostic-settings.png)

Pick a name for the new diagnostics settings, and check the **PostgreSQLLogs**
box.  Choose which destination(s) should receive the logs.

![Choose PostgreSQL logs](media/howto-hyperscale-logging/diagnostic-create-setting.png)

## Next steps

- [Get started with log analytics queries](/azure/azure-monitor/log-query/get-started-portal)
- Learn about [Azure event hubs](/azure/event-hubs/event-hubs-about)
