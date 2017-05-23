---
title: Connect existing Azure App Service to Azure Database for MySQL | Microsoft Docs
description: Instructions for how to properly connect an existing Azure App Service to Azure Database for MySQL
services: mysql
author: v-chenyh
ms.author: v-chenyh
editor: jasonh
manager: jhubbard
ms.assetid: 
ms.service: mysql-database
ms.tgt_pltfrm: portal
ms.devlang: na
ms.topic: article
ms.date: 05/23/2017
---

# Connect an existing Azure App Service to Azure Database for MySQL server
This document explains how to connect an existing Azure App Service to your Azure Database for MySQL server.

## Before you begin
Log in to the [Azure portal](https://portal.azure.com). Create an Azure Database for MySQL server. For details, please refer to [How to create Azure Database for MySQL server from Portal](quickstart-create-mysql-server-database-using-azure-portal.md) or [How to create Azure Database for MySQL server using CLI](quickstart-create-mysql-server-database-using-azure-cli.md).

Currently we offer two solutions to enable access from Azure App Service to Azure Database for MySQL. Both solutions involve setting up server-level firewall rules.

## Solution 1 - Create a server-level firewall rule to allow all IPs

Azure Database for MySQL provides tighter security using Firewall to protect your data. When connecting from Azure App Service to Azure Database for MySQL server, please keep in mind that the outbound IPs of App Service are dynamic in nature.

To make sure the availability of your Azure App Service is not compromised, we recommend using this solution to allow ALL IPs.

> [!NOTE]
> We are working with Azure App Service team for a long term solution to avoid allowing all IPs.

1. On the MySQL server blade, under Settings heading, click **Connection Security** to open the Connection Security blade for the Azure Database for MySQL.

   ![Azure portal - click Connection Security](./media/howto-manage-firewall-using-portal/1-connection-security.png)

2. Enter **RULE NAME**, **START IP**, and **END IP**. Then click **Save**.

|           |             |
|-----------|-------------|
|*RULE NAME*|Allow-All-IPs|
|*START IP*|0.0.0.0|
|*END IP*|255.255.255.255|

   ![Azure portal - Add all IPs](./media/howto-connect-webapp/1_2-add-all-ips.png)

## Solution 2 - Create a server-level firewall rule to explicitly allow outbound IPs
You can explicitly add all the outbound IPs of your Azure App Service.

1. On the App Service Properties blade, view your **OUTBOUND IP ADDRESS**.

   ![Azure portal - View outbound IPs](./media/howto-connect-webapp/2_1-outbound-ip-address.png)

2. On the MySQL Connection security blade, add outbound IPs one by one.

   ![Azure portal - Add explicit IPs](./media/howto-connect-webapp/2_2-add-explicit-ips.png)

3. Remeber to **Save** your firewall rules.

Azure App Service team is doing their best to keep the outbound IPs remain the same, but when recycle or scale operation occurs, it may change since new machines will be added on every region frequently to increase the capacity to serve customers.  If this changes, the app will experience downtime since it can no longer connect to the database. Please keep this in mind when choosing one of the solution mentioned above.

## SSL configuration

Azure Database for MySQL has SSL Enabled by default. If your application is not using SSL to connect to the database, then you need to disable SSL on MySQL server. For details on how to configure SSL, See [Using SSL with Azure Database for MySQL](howto-configure-ssl.md).

## Next steps

- For more information about connection strings, please refer to [Connection Strings](howto-connection-string.md).
