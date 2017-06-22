---
title: Server Logs in Azure Database for PostgreSQL  | Microsoft Docs
description: Generates query and error logs in Azure Database for PostgreSQL.
services: postgresql
author: SaloniSonpal
ms.author: salonis
manager: jhubbard
editor: jasonwhowell
ms.service: postgresql-database
ms.topic: article
ms.date: 05/10/2017
---
# Server Logs in Azure Database for PostgreSQL 
Azure Database for PostgreSQL generates query and error logs. However, access to transaction logs is not supported. These logs can be used to identify, troubleshoot, and repair configuration errors and sub-optimal performance. For more information, see [Error Reporting and Logging](https://www.postgresql.org/docs/9.6/static/runtime-config-logging.html).

## Access server logs
You can list and download Azure PostgreSQL server error logs using the Azure Portal, [Azure CLI](howto-configure-server-logs-using-cli.md) and Azure REST APIs.

## Log retention
You can set the retention period for system logs using the **log\_retention\_period** parameter associated with your server. The unit for this parameter is days (need to confirm). The default value is three days. The maximum value is 7 days. Note that your server must have enough allocated storage to contain the retained log files.
The log files will rotate every 1 hour or 100MB size, whichever comes first.

## Configure logging for Azure PostgreSQL server
You can enable query logging and error logging for your server. Error logs can contain auto-vacuum, connection and checkpoints information.

You can enable query logging for your PostgreSQL DB instance by setting two server parameters: log\_statement and log\_min\_duration\_statement.

The **log\_statement** parameter controls which SQL statements are logged. We recommend setting this parameter to ***all*** to log all statements; the default value is none (need to confirm).

The **log\_min\_duration\_statement** parameter sets the limit in milliseconds of a statement to be logged. All SQL statements that run longer than the parameter setting are logged. This parameter is disabled and set to minus 1 (-1) by default (need to confirm). Enabling this parameter can be helpful in tracking down unoptimized queries in your applications.

The **log\_min\_messages** allows you to control which message levels are written to the server log. The default is WARNING. (need to confirm)

For more information on these settings, see [Error Reporting and Logging](https://www.postgresql.org/docs/9.6/static/runtime-config-logging.html) documentation. For particularly configuring Azure Database for PostgreSQL server parameters, see [Server Logs in Azure Database for PostgreSQL](concepts-server-logs.md).

## Next steps
- To access logs using Azure CLI command line interface, see [Configure and access server logs using Azure CLI](howto-configure-server-logs-using-cli.md)
- For more information on server parameters, see [Customize server configuration parameters using Azure CLI](howto-configure-server-parameters-using-cli.md).