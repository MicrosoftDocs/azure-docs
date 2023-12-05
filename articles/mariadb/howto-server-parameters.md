---
title: Configure server parameters - Azure portal - Azure Database for MariaDB
description: This article describes how to configure MariaDB server parameters in Azure Database for MariaDB using the Azure portal.
ms.service: mariadb
author: SudheeshGH
ms.author: sunaray
ms.topic: how-to
ms.date: 06/24/2022
---

# Configure server parameters in Azure Database for MariaDB using the Azure portal

[!INCLUDE [azure-database-for-mariadb-deprecation](includes/azure-database-for-mariadb-deprecation.md)]

Azure Database for MariaDB supports configuration of some server parameters. This article describes how to configure these parameters by using the Azure portal. Not all server parameters can be adjusted.

>[!Note]
> Server parameters can be updated globally at the server-level, use the [Azure CLI](./howto-configure-server-parameters-cli.md), [PowerShell](./howto-configure-server-parameters-using-powershell.md), or the [Azure portal](./howto-server-parameters.md).

## Configure server parameters

1. Sign in to the Azure portal, then locate your Azure Database for MariaDB server.
2. Under the **SETTINGS** section, select **Server parameters** to open the server parameters page for the Azure Database for MariaDB server.
![Azure portal server parameters page](./media/howto-server-parameters/azure-portal-server-parameters.png)
3. Locate any settings you need to adjust. Review the **Description** column to understand the purpose and allowed values.
![Enumerate drop down](./media/howto-server-parameters/3-toggle_parameter.png)
4. Select  **Save** to save your changes.
![Save or Discard changes](./media/howto-server-parameters/4-save_parameters.png)
5. If you have saved new values for the parameters, you can always revert everything back to the default values by selecting **Reset all to default**.
![Reset all to default](./media/howto-server-parameters/5-reset_parameters.png)

## Setting parameters not listed

If the server parameter you want to update is not listed in the Azure portal, you can optionally set the parameter at the connection level using `init_connect`. This sets the server parameters for each client connecting to the server.

1. Under the **SETTINGS** section, select **Server parameters** to open the server parameters page for the Azure Database for MariaDB server.
2. Search for `init_connect`
3. Add the server parameters in the format: `SET parameter_name=YOUR_DESIRED_VALUE` in value the value column.

    For example, you can change the character set of your server by setting of `init_connect` to `SET character_set_client=utf8;SET character_set_database=utf8mb4;SET character_set_connection=latin1;SET character_set_results=latin1;`
4. Select **Save** to save your changes.

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

Refer to the MariaDB documentation for [Date and Time Functions](https://mariadb.com/kb/en/library/convert_tz/).

## Next steps

- Learn more about [server parameters](concepts-server-parameters.md)
