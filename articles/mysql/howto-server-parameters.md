---
title: Configure server parameters - Azure portal - Azure Database for MySQL
description: This article describes how to configure MySQL server parameters in Azure Database for MySQL using the Azure portal.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: conceptual
ms.date: 4/1/2020
---

# How to configure server parameters in Azure Database for MySQL by using the Azure portal

Azure Database for MySQL supports configuration of some server parameters. This article describes how to configure these parameters by using the Azure portal. Not all server parameters can be adjusted.

## Navigate to Server Parameters on Azure portal

1. Sign in to the Azure portal, then locate your Azure Database for MySQL server.
2. Under the **SETTINGS** section, click **Server parameters** to open the server parameters page for the Azure Database for MySQL server.
![Azure portal server parameters page](./media/howto-server-parameters/auzre-portal-server-parameters.png)
3. Locate any settings you need to adjust. Review the **Description** column to understand the purpose and allowed values.
![Enumerate drop down](./media/howto-server-parameters/3-toggle_parameter.png)
4. Click  **Save** to save your changes.
![Save or Discard changes](./media/howto-server-parameters/4-save_parameters.png)
5. If you have saved new values for the parameters, you can always revert everything back to the default values by selecting **Reset all to default**.
![Reset all to default](./media/howto-server-parameters/5-reset_parameters.png)

## List of configurable server parameters

The list of supported server parameters is constantly growing. Use the server parameters tab in Azure portal to get the definition and configure server parameters based on your application requirements.

## Non-configurable server parameters

The InnoDB Buffer Pool size is not configurable and tied to your [pricing tier](concepts-service-tiers.md).

|**Pricing Tier**|**vCore(s)**|**InnoDB Buffer Pool size in MB <br>(servers supporting up to 4 TB storage)**| **InnoDB Buffer Pool size in MB <br>(servers supporting up to 16 TB storage)**|
|:---|---:|---:|---:|
|Basic| 1| 832| |
|Basic| 2| 2560| |
|General Purpose| 2| 3584| 7168|
|General Purpose| 4| 7680| 15360|
|General Purpose| 8| 15360| 30720|
|General Purpose| 16| 31232| 62464|
|General Purpose| 32| 62976| 125952|
|General Purpose| 64| 125952| 251904|
|Memory Optimized| 2| 7168| 14336|
|Memory Optimized| 4| 15360| 30720|
|Memory Optimized| 8| 30720| 61440|
|Memory Optimized| 16| 62464| 124928|
|Memory Optimized| 32| 125952| 251904|

These additional server parameters are not configurable in the system:

|**Parameter**|**Fixed value**|
| :------------------------ | :-------- |
|innodb_file_per_table in Basic tier|OFF|
|innodb_flush_log_at_trx_commit|1|
|sync_binlog|1|
|innodb_log_file_size|512MB|

Other server parameters that are not listed here are set to their MySQL out-of-box default values for versions [5.7](https://dev.mysql.com/doc/refman/5.7/en/innodb-parameters.html) and [5.6](https://dev.mysql.com/doc/refman/5.6/en/innodb-parameters.html).

## Working with the time zone parameter

### Populating the time zone tables

The time zone tables on your server can be populated by calling the `mysql.az_load_timezone` stored procedure from a tool like the MySQL command line or MySQL Workbench.

> [!NOTE]
> If you are running the `mysql.az_load_timezone` command from MySQL Workbench, you may need to turn off safe update mode first using `SET SQL_SAFE_UPDATES=0;`.

```sql
CALL mysql.az_load_timezone();
```

> [!IMPORTANT]
> You should restart the server to ensure the time zone tables are properly populated. To restart the server, use the [Azure portal](howto-restart-server-portal.md) or [CLI](howto-restart-server-cli.md).

To view available time zone values, run the following command:

```sql
SELECT name FROM mysql.time_zone_name;
```

### Setting the global level time zone

The global level time zone can be set from the **Server parameters** page in the Azure portal. The below sets the global time zone to the value "US/Pacific".

![Set time zone parameter](./media/howto-server-parameters/timezone.png)

### Setting the session level time zone

The session level time zone can be set by running the `SET time_zone` command from a tool like the MySQL command line or MySQL Workbench. The example below sets the time zone to the **US/Pacific** time zone.

```sql
SET time_zone = 'US/Pacific';
```

Refer to the MySQL documentation for [Date and Time Functions](https://dev.mysql.com/doc/refman/5.7/en/date-and-time-functions.html#function_convert-tz).

## Next steps

- [Connection libraries for Azure Database for MySQL](concepts-connection-libraries.md).
