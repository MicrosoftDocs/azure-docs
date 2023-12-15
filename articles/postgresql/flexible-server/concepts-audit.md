---
title: Audit logging - Azure Database for PostgreSQL - Flexible Server
description: Concepts for pgAudit audit logging in Azure Database for PostgreSQL - Flexible Server.
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.author: gennadyk
author: GennadNY
ms.reviewer: 
ms.date: 11/30/2021
---

# Audit logging in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Audit logging of database activities in Azure Database for PostgreSQL - Flexible Server is available through the PostgreSQL Audit extension: [pgAudit](https://www.pgaudit.org/). pgAudit provides detailed session and/or object audit logging.

If you want Azure resource-level logs for operations like compute and storage scaling, see the [Azure Activity Log](../../azure-monitor/essentials/platform-logs-overview.md).

## Usage considerations
By default, pgAudit log statements are emitted along with your regular log statements by using Postgres's standard logging facility. In Azure Database for PostgreSQL - Flexible Server, you can configure all logs to be sent to Azure Monitor Log store for later analytics in Log Analytics. If you enable Azure Monitor resource logging, your logs will be automatically sent (in JSON format) to Azure Storage, Event Hubs, and/or Azure Monitor logs, depending on your choice.

To learn how to set up logging to Azure Storage, Event Hubs, or Azure Monitor logs, visit the resource logs section of the [server logs article](concepts-logging.md).

## Installing pgAudit
Before you can install pgAudit extension in Azure Database for PostgreSQL - Flexible Server, you will need to allow-list pgAudit extension for use. 

Using the [Azure portal](https://portal.azure.com):

   1. Select your Azure Database for PostgreSQL - Flexible Server.
   2. On the sidebar, select **Server Parameters**.
   3. Search for the `azure.extensions` parameter.
   4. Select pgAudit as extension you wish to allow-list.
     :::image type="content" source="./media/concepts-extensions/allow-list.png" alt-text=" Screenshot showing Azure Database for PostgreSQL - allow-listing extensions for installation ":::
  
Using [Azure CLI](/cli/azure/):

   You can allow-list extensions via CLI parameter set [command](/cli/azure/postgres/flexible-server/parameter?view=azure-cli-latest&preserve-view=true). 

   ```bash
az postgres flexible-server parameter set --resource-group <your resource group>  --server-name <your server name> --subscription <your subscription id> --name azure.extensions --value pgAudit
   ```

 
To install pgAudit, you need to include it in the server's shared preload libraries. A change to Postgres's `shared_preload_libraries` parameter requires a server restart to take effect. You can change parameters using the [Azure portal](howto-configure-server-parameters-using-portal.md), [Azure CLI](howto-configure-server-parameters-using-cli.md), or [REST API](/rest/api/postgresql/singleserver/configurations/createorupdate).

Using the [Azure portal](https://portal.azure.com):

   1. Select your Azure Database for PostgreSQL - Flexible Server.
   2. On the sidebar, select **Server Parameters**.
   3. Search for the `shared_preload_libraries` parameter.
   4. Select **pgaudit**.
     :::image type="content" source="./media/concepts-audit/shared-preload-libraries.png" alt-text=" Screenshot showing Azure Database for PostgreSQL - enabling shared_preload_libraries for pgaudit ":::
   5. You can check that **pgaudit** is loaded in shared_preload_libraries by executing following query in psql:
        ```SQL
      show shared_preload_libraries;
      ```
      You should see **pgaudit** in the query result that will return shared_preload_libraries

   6. Connect to your server using a client (like psql) and enable the pgAudit extension
      ```SQL
      CREATE EXTENSION pgaudit;
      ```

> [!TIP]
> If you see an error, confirm that you restarted your server after saving `shared_preload_libraries`.

## pgAudit settings

pgAudit allows you to configure session or object audit logging. [Session audit logging](https://github.com/pgaudit/pgaudit/blob/master/README.md#session-audit-logging) emits detailed logs of executed statements. [Object audit logging](https://github.com/pgaudit/pgaudit/blob/master/README.md#object-audit-logging) is audit scoped to specific relations. You can choose to set up one or both types of logging. 



Once you have [enabled pgAudit](#installing-pgaudit), you can configure its parameters to start logging. 
To configure pgAudit you can follow below instructions. 
Using the [Azure portal](https://portal.azure.com):

   1. Select your Azure Database for PostgreSQL server.
   2. On the sidebar, select **Server Parameters**.
   3. Search for the `pgaudit` parameters.
   4. Pick appropriate settings parameter to edit. For example to start logging set `pgaudit.log` to `WRITE`
       :::image type="content" source="./media/concepts-audit/pgaudit-config.png" alt-text="Screenshot showing Azure Database for PostgreSQL - configuring logging with pgaudit ":::
   5. Click **Save** button to save changes



The [pgAudit documentation](https://github.com/pgaudit/pgaudit/blob/master/README.md#settings) provides the definition of each parameter. Test the parameters first and confirm that you are getting the expected behavior.

> [!NOTE]
> Setting `pgaudit.log_client` to ON will redirect logs to a client process (like psql) instead of being written to file. This setting should generally be left disabled. <br> <br>
> `pgaudit.log_level` is only enabled when `pgaudit.log_client` is on.

> [!NOTE]
> In Azure Database for PostgreSQL - Flexible Server, `pgaudit.log` cannot be set using a `-` (minus) sign shortcut as described in the pgAudit documentation. All required statement classes (READ, WRITE, etc.) should be individually specified.
> [!NOTE]
>If you set the log_statement parameter to DDL or ALL, and run a `CREATE ROLE/USER ... WITH PASSWORD ... ; `  or  `ALTER ROLE/USER ... WITH PASSWORD ... ;`, command, then PostgreSQL creates an entry in the PostgreSQL logs, where password is logged in clear text,  which may cause a potential security risk.  This is expected behavior as per PostgreSQL engine design. You can, however, use PGAudit extension and set  `pgaudit.log='DDL'` parameter in server parameters page, which doesn't record any `CREATE/ALTER ROLE` statement in Postgres Log, unlike Postgres `log_statement='DDL'` setting. If you do need to log these statements you can add `pgaudit.log ='ROLE'` in addition, which, while logging `'CREATE/ALTER ROLE'` will redact the password from logs. 

## Audit log format
Each audit entry is indicated by `AUDIT:` near the beginning of the log line. The format of the rest of the entry is detailed in the [pgAudit documentation](https://github.com/pgaudit/pgaudit/blob/master/README.md#format).

## Getting started
To quickly get started, set `pgaudit.log` to `WRITE`, and open your server logs to review the output. 

## Viewing audit logs
The way you access the logs depends on which endpoint you choose. For Azure Storage, see the [logs storage account](../../azure-monitor/essentials/resource-logs.md#send-to-azure-storage) article. For Event Hubs, see the [stream Azure logs](../../azure-monitor/essentials/resource-logs.md#send-to-azure-event-hubs) article.

For Azure Monitor Logs, logs are sent to the workspace you selected. The Postgres logs use the **AzureDiagnostics** collection mode, so they can be queried from the AzureDiagnostics table. The fields in the table are described below. Learn more about querying and alerting in the [Azure Monitor Logs query](../../azure-monitor/logs/log-query-overview.md) overview.

You can use this query to get started. You can configure alerts based on queries.

Search for all pgAudit entries in Postgres logs for a particular server in the last day

```kusto
AzureDiagnostics
| where Resource =~ "myservername"
| where Category == "PostgreSQLLogs"
| where TimeGenerated > ago(1d)
| where Message contains "AUDIT:"
```



## Next steps
- [Learn about logging in Azure Database for PostgreSQL - Flexible Server](concepts-logging.md)
- [Learn how to setup logging in Azure Database for PostgreSQL - Flexible Server and how to access logs](howto-configure-and-access-logs.md)
