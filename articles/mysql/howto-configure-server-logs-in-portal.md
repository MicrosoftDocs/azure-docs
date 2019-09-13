---
title: Configure and access slow query logs for Azure Database for MySQL in Azure portal
description: This article describes how to configure and access the slow logs in Azure Database for MySQL from the Azure portal.
author: rachel-msft
ms.author: raagyema
ms.service: mysql
ms.topic: conceptual
ms.date: 05/29/2019
---

# Configure and access slow query logs in the Azure portal

You can configure, list, and download the [Azure Database for MySQL slow query logs](concepts-server-logs.md) from the Azure portal.

## Prerequisites
To step through this how-to guide, you need:
- [Azure Database for MySQL server](quickstart-create-mysql-server-database-using-azure-portal.md)

## Configure logging
Configure access to the MySQL slow query log. 

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Select your Azure Database for MySQL server.

3. Under the **Monitoring** section in the sidebar, select **Server Logs**. 
   ![Select Server logs, Click to configure](./media/howto-configure-server-logs-in-portal/1-select-server-logs-configure.png)

4. Select the heading **Click here to enable logs and configure log parameters** to see the server parameters.

5. Change the parameters that you need to adjust. All changes you make in this session are highlighted in purple. 

   Once you have changed the parameters, you can click **Save**. Or you can **Discard** your changes.

   ![Click save or discard](./media/howto-configure-server-logs-in-portal/3-save-discard.png)

6. Return to the list of logs by clicking the **close button** (X icon) on the **Server Parameters** page.

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
- See [access slow query Logs in CLI](howto-configure-server-logs-in-cli.md) to learn how to download slow query logs programmatically.
- Learn more about [slow query logs](concepts-server-logs.md) in Azure Database for MySQL.
- For more information about the parameter definitions and MySQL logging, see the MySQL documentation on [Logs](https://dev.mysql.com/doc/refman/5.7/en/slow-query-log.html).