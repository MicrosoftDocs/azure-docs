---
title: How To Configure Server Parameters in Azure Database for MySQL | Microsoft Docs
description: This article describes how to configure MySQL server parameters in Azure Database for MySQL using the Azure portal.
services: mysql
author: v-chenyh
ms.author: v-chenyh
manager: jhubbard
editor: jasonwhowell
ms.service: mysql-database
ms.topic: article
ms.date: 10/10/2017
---

# How to configure server parameters in Azure Database for MySQL by using the Azure portal

Azure Database for MySQL supports configuration of some server parameters. This topic describes how to configure these parameters by using the Azure portal. Not all server parameters can be adjusted. 

## Navigate to Server Parameters on Azure portal
1. Sign in to the Azure portal, then locate your Azure Database for MySQL server.
2. Under the **SETTINGS** section, click **Server parameters** to open the Server parameters page for the Azure Database for MySQL.
3. Locate any settings you need to adjust. Review the **Description** column to understand the purpose and allowed values. 
4. Click  **Save** to save your changes.

![Azure portal server parameters blade](./media/howto-server-parameters/auzre-portal-server-parameters.png)

## List of configurable server parameters

The list of supported server parameters is constantly growing. Use the server parameters tab in Azure portal to get the definition and configure server parameters based on your application requirements. 

## Nonconfigurable server parameters

The following parameters are not configurable and tied to your [pricing tier](concepts-service-tiers.md). 

| **Pricing tier** | **InnoDB Buffer Pool (MB)** | **Max Connections** |
| :------------------------ | :-------- | :----------- |
| Basic 50 | 1024 | 50 | 
| Basic 100  | 2560 | 100 | 
| Standard 100 | 2560 | 200 | 
| Standard 200 | 5120 | 400 | 
| Standard 400 | 10240 | 400 | 
| Standard 800 | 20480 | 1600 |

Other server parameter default values for version [5.7](https://dev.mysql.com/doc/refman/5.7/en/innodb-parameters.html) and [5.6](https://dev.mysql.com/doc/refman/5.6/en/innodb-parameters.html).

## Next steps
- [Connection libraries for Azure Database for MySQL](concepts-connection-libraries.md).
