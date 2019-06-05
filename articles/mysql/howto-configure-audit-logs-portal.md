---
title: Configure and access audit logs for Azure Database for MySQL in Azure Portal
description: This article describes how to configure and access the audit logs in Azure Database for MySQL from the Azure Portal.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: conceptual
ms.date: 05/29/2019
---

# Configure and access audit logs in the Azure portal

You can configure, list, and download the [Azure Database for MySQL audit logs](concepts-audit-logs.md) from the Azure portal.

## Prerequisites
To step through this how-to guide, you need:
- [Azure Database for MySQL server](quickstart-create-mysql-server-database-using-azure-portal.md)

## Configure audit logging

Enable and configure audit logging.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select your Azure Database for MySQL server.

1. Under the **Settings** section in the sidebar, select **Server parameters**.
   ![Select Server logs, Click to configure](./media/howto-configure-server-logs-in-portal/1-select-server-logs-configure.png)

1. Update the **audit_log_enabled** parameter to ON. 

1. Select the events to be logged by updating the **audit_log_events** parameter.

1. Add any MySQL users to be excluded from logging by updating the **audit_log_exclude_users** parameter. Specify users by providing their MySQL user name.

1. Once you have changed the parameters, you can click **Save**. Or you can **Discard** your changes.

   ![Click save or discard](./media/howto-configure-server-logs-in-portal/3-save-discard.png)

## Set up diagnostic logs



## View list and download logs
Once logging begins, you can view a list of available slow query logs and download individual log files on the Server Logs pane.

1. Open the Azure portal.

2. Select your Azure Database for MySQL server.

3. Under the **Monitoring** section in the sidebar, select **Server Logs**. The page shows a list of your log files, as shown:

   ![List of Logs](./media/howto-configure-server-logs-in-portal/4-server-logs-list.png)

   > [!TIP]
   > The naming convention of the log is **mysql-slow-< your server name>-yyyymmddhh.log**. The date and time used in the file name is the time is when the log was issued. Logs files are rotated every 24 hours or 7.5 GB, whichever comes first.

4. If needed, use the **search box** to quickly narrow down to a specific log based on date/time. The search is on the name of the log.

5. Download individual log files using the **download** button (down arrow icon) next to each log file in the table row as shown:

   ![Click download icon](./media/howto-configure-server-logs-in-portal/5-download.png)

## Next steps
- See [Access Server Logs in CLI](howto-configure-server-logs-in-cli.md) to learn how to download logs programmatically.
- Learn more about [slow query logs](concepts-server-logs.md) in Azure Database for MySQL. 
- For more information about the parameter definitions and MySQL logging, see the MySQL documentation on [Logs](https://dev.mysql.com/doc/refman/5.7/en/slow-query-log.html).