---
title: How To Configure Server Parameters in Azure Database for MySQL
description: This article describes how to configure MySQL server parameters in Azure Database for MySQL using the Azure portal.
services: mysql
author: ajlam
ms.author: andrela
manager: kfile
editor: jasonwhowell
ms.service: mysql-database
ms.topic: article
ms.date: 02/28/2018
---

# How to configure server parameters in Azure Database for MySQL by using the Azure portal

Azure Database for MySQL supports configuration of some server parameters. This article describes how to configure these parameters by using the Azure portal. Not all server parameters can be adjusted. 

## Navigate to Server Parameters on Azure portal
1. Sign in to the Azure portal, then locate your Azure Database for MySQL server.
2. Under the **SETTINGS** section, click **Server parameters** to open the 
Server parameters page for the Azure Database for MySQL.
![Azure portal server parameters page](./media/howto-server-parameters/auzre-portal-server-parameters.png)
3. Locate any settings you need to adjust. Review the **Description** column to understand the purpose and allowed values. 
![Enumerate drop down](./media/howto-server-parameters/3-toggle_parameter.png)
4. Click  **Save** to save your changes.
![Save or Discard changes](./media/howto-server-parameters/4-save_parameters.png)
5. If you have saved new values for the parameters, you can always revert everything back to the default values by selecting **Reset all to default**.
![Reset all to default](./media/howto-server-parameters/5-reset_parameters.png)


## List of configurable server parameters

The list of supported server parameters is constantly growing. Use the server parameters tab in Azure portal to get the definition and configure server parameters based on your application requirements. 

## Nonconfigurable server parameters
InnoDB Buffer Pool and Max Connections are not configurable and tied to your [pricing tier](concepts-service-tiers.md). 

|**Pricing Tier**| **Compute Generation**|**vCore(s)**|**InnoDB Buffer Pool (MB)**| **Max Connections**|
|---|---|---|---|--|
|Basic| Gen 4| 1| 1024| 50 |
|Basic| Gen 4| 2| 2560| 100 |
|Basic| Gen 5| 1| 1024| 50 |
|Basic| Gen 5| 2| 2560| 100 |
|General Purpose| Gen 4| 2| 2560| 200|
|General Purpose| Gen 4| 4| 5120| 400|
|General Purpose| Gen 4| 8| 10240| 800|
|General Purpose| Gen 4| 16| 20480| 1600|
|General Purpose| Gen 4| 32| 40960| 3200|
|General Purpose| Gen 5| 2| 2560| 200|
|General Purpose| Gen 5| 4| 5120| 400|
|General Purpose| Gen 5| 8| 10240| 800|
|General Purpose| Gen 5| 16| 20480| 1600|
|General Purpose| Gen 5| 32| 40960| 3200|
|Memory Optimized| Gen 5| 2| 7168| 600|
|Memory Optimized| Gen 5| 4| 15360| 1250|
|Memory Optimized| Gen 5| 8| 30720| 2500|
|Memory Optimized| Gen 5| 16| 62464| 5000|
|Memory Optimized| Gen 5| 32| 125952| 10000| 

These additional server parameters are not configurable in the system:

|**Parameter**|**Fixed value**|
| :------------------------ | :-------- |
|innodb_file_per_table in Basic tier|OFF|
|innodb_flush_log_at_trx_commit|1|
|sync_binlog|1|
|innodb_log_file_size|512MB|

Other server parameters that are not listed here are set to their MySQL out-of-box default values for versions [5.7](https://dev.mysql.com/doc/refman/5.7/en/innodb-parameters.html) and [5.6](https://dev.mysql.com/doc/refman/5.6/en/innodb-parameters.html).

## Next steps
- [Connection libraries for Azure Database for MySQL](concepts-connection-libraries.md).
