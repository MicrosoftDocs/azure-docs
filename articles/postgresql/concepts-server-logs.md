---
title: Server Logs in Azure Database for PostgreSQL
description: This article describes how Azure Database for PostgreSQL generates query and error logs, and how log retention is configured.
services: postgresql
author: rachel-msft
ms.author: raagyema
manager: kfile
editor: jasonwhowell
ms.service: postgresql
ms.topic: article
ms.date: 02/28/2018
---
# Server Logs in Azure Database for PostgreSQL 
Azure Database for PostgreSQL generates query and error logs. However, access to transaction logs is not supported. Query and error logs can be used to identify, troubleshoot, and repair configuration errors and suboptimal performance. For more information, see [Error Reporting and Logging](https://www.postgresql.org/docs/9.6/static/runtime-config-logging.html).

## Access server logs
You can list and download Azure PostgreSQL server error logs using the Azure portal, [Azure CLI](howto-configure-server-logs-using-cli.md), and Azure REST APIs.

## Log retention
You can set the retention period for system logs using the **log\_retention\_period** parameter associated with your server. The unit for this parameter is days. The default value is 3 days. The maximum value is 7 days. Your server must have enough allocated storage to contain the retained log files.
The log files rotate every one hour or 100 MB size, whichever comes first.

## Configure logging for Azure PostgreSQL server
You can enable query logging and error logging for your server. Error logs can contain auto-vacuum, connection, and checkpoints information.

You can enable query logging for your PostgreSQL DB instance by setting two server parameters: `log_statement` and `log_min_duration_statement`.

The **log\_statement** parameter controls which SQL statements are logged. We recommend setting this parameter to ***all*** to log all statements; the default value is none.

The **log\_min\_duration\_statement** parameter sets the limit in milliseconds of a statement to be logged. All SQL statements that run longer than the parameter setting are logged. This parameter is disabled and set to minus 1 (-1) by default. Enabling this parameter can be helpful in tracking down unoptimized queries in your applications.

The **log\_min\_messages** allows you to control which message levels are written to the server log. The default is WARNING. 

For more information on these settings, see [Error Reporting and Logging](https://www.postgresql.org/docs/9.6/static/runtime-config-logging.html) documentation. For particularly configuring Azure Database for PostgreSQL server parameters, see [Customize server configuration parameters using Azure CLI](howto-configure-server-parameters-using-cli.md).

## Next steps
- To access logs using Azure CLI command-line interface, see [Configure and access server logs using Azure CLI](howto-configure-server-logs-using-cli.md).
- For more information on server parameters, see [Customize server configuration parameters using Azure CLI](howto-configure-server-parameters-using-cli.md).
