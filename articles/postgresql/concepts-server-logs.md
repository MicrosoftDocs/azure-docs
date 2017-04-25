---
title: postgresql-concepts-server-logs | Microsoft Docs
description: Generates query and error logs.
keywords: azure cloud postgresql postgres
services: postgresql
author:
ms.author:
manager: jhubbard
editor: jasonh

ms.assetid:
ms.service: postgresql - database
ms.tgt_pltfrm: portal
ms.topic: hero - article
ms.date: 04/30/2017
---
# Azure PostgreSQL server logs
Azure Database for PostgreSQL generates query and error logs. However, access to transaction logs is not supported. These logs can be used to identify, troubleshoot, and repair configuration errors and sub-optimal performance. For more information, see [Error Reporting and Logging](https://www.postgresql.org/docs/9.6/static/runtime-config-logging.html).

## Access server logs
You can list and download Azure PostgreSQL server error logs using the [Azure Portal](logs-cli/update.me), [Command Line Interface (Azure CLI)](logs-cli/update.me) and Azure REST APIs.

## Log retention
You can set the retention period for system logs using the **log\_retention\_period** parameter associated with your server. The unit for this parameter is days (need to confirm). The default value is three days. The maximum value is 7 days. Note that your server must have enough allocated storage to contain the retained log files.
The log files will rotate every 1 hour or 100MB size, whichever comes first.

## Configure logging for Azure PostgreSQL server
You can enable query logging and error logging for your server. Error logs can contain auto-vacuum, connection and checkpoints information.

You can enable query logging for your PostgreSQL DB instance by setting two server parameters: log\_statement and log\_min\_duration\_statement.

The **log\_statement** parameter controls which SQL statements are logged. We recommend setting this parameter to ***all*** to log all statements; the default value is none (need to confirm).

The **log\_min\_duration\_statement** parameter sets the limit in milliseconds of a statement to be logged. All SQL statements that run longer than the parameter setting are logged. This parameter is disabled and set to minus 1 (-1) by default (need to confirm). Enabling this parameter can be helpful in tracking down unoptimized queries in your applications.

The **log\_min\_messages** allows you to control which message levels are written to the server log. The default is WARNING. (need to confirm)

For more information on these settings, see [Error Reporting and Logging](https://www.postgresql.org/docs/9.6/static/runtime-config-logging.html) documentation. For particularly configuring Azure PostgreSQL server parameters, see [customizing server configuration parameters](parameters/update.me).

(screenshot of how the logs change when parameter is 
configured)

## Next steps
- To access logs using Azure Portal, see [Configure and access Server logs using Portal](logs-cli/update.me).
- To access logs using Azure CLI command line interface, see [Configure and access Server logs using CLI](logs-cli/update.me).
- For more information on server parameters, see [customizing server configuration parameters](parameters/update.me).

