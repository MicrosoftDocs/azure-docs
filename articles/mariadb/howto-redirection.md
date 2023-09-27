---
title: Connect with redirection - Azure Database for MariaDB
description: This article describes how you can configure your application to connect to Azure Database for MariaDB with redirection.
ms.service: mariadb
ms.custom: devx-track-linux
author: SudheeshGH
ms.author: sunaray
ms.topic: how-to
ms.date: 04/19/2023
---

# Connect to Azure Database for MariaDB with redirection

[!INCLUDE [azure-database-for-mariadb-deprecation](includes/azure-database-for-mariadb-deprecation.md)]

This topic explains how to connect an application your Azure Database for MariaDB server with redirection mode. Redirection aims to reduce network latency between client applications and MariaDB servers by allowing applications to connect directly to backend server nodes.

## Before you begin

Sign in to the [Azure portal](https://portal.azure.com). Create an Azure Database for MariaDB server with engine version 10.2 or 10.3.

For details, refer to how to create an Azure Database for MariaDB server using the [Azure portal](quickstart-create-mariadb-server-database-using-azure-portal.md) or [Azure CLI](quickstart-create-mariadb-server-database-using-azure-cli.md).

> [!IMPORTANT]
> Redirection is currently not supported with [Private Link for Azure Database for MariaDB](concepts-data-access-security-private-link.md).

## Enable redirection

On your Azure Database for MariaDB server, configure the `redirect_enabled` parameter to `ON` to allow connections with redirection mode. To update this server parameter, use the [Azure portal](howto-server-parameters.md) or [Azure CLI](howto-configure-server-parameters-cli.md).

## PHP

Support for redirection in PHP applications is available through the [mysqlnd_azure](https://github.com/microsoft/mysqlnd_azure) extension, developed by Microsoft.

The mysqlnd_azure extension is available to add to PHP applications through PECL and it's highly recommended to install and configure the extension through the officially published [PECL package](https://pecl.php.net/package/mysqlnd_azure).

> [!IMPORTANT]
> Support for redirection in the PHP [mysqlnd_azure](https://github.com/microsoft/mysqlnd_azure) extension is currently in preview.

### Redirection logic

>[!IMPORTANT]
> Redirection logic/behavior beginning version 1.1.0 was updated and **it's recommended to use version 1.1.0+**.

The redirection behavior is determined by the value of `mysqlnd_azure.enableRedirect`. The table below outlines the behavior of redirection based on the value of this parameter beginning in **version 1.1.0+**.

If you're using an older version of the mysqlnd_azure extension (version 1.0.0-1.0.3), the redirection behavior is determined by the value of `mysqlnd_azure.enabled`. The valid values are `off` (acts similarly as the behavior outlined in the table below) and `on` (acts like `preferred` in the table below).

|**mysqlnd_azure.enableRedirect value**| **Behavior**|
|----------------------------------------|-------------|
|`off` or `0`|Redirection isn't be used. |
|`on` or `1`|- If the connection doesn't use SSL on the driver side, no connection is made. The following error is returned: *"mysqlnd_azure.enableRedirect is on, but SSL option isn't set in connection string. Redirection is only possible with SSL."*<br>- If SSL is used on the driver side, but redirection isn't supported on the server, the first connection gets aborted. The following error is returned: *"Connection aborted because redirection isn't enabled on the MariaDB server or the network package doesn't meet redirection protocol."*<br>- If the MariaDB server supports redirection, but the redirected connection failed for any reason, also abort the first proxy connection. Return the error of the redirected connection.|
|`preferred` or `2`<br> (default value)|- mysqlnd_azure uses redirection if possible.<br>- If the connection doesn't use SSL on the driver side, the server doesn't support redirection, or the redirected connection fails to connect for any nonfatal reason while the proxy connection is still a valid one, it falls back to the first proxy connection.|

The subsequent sections of the document outline how to install the `mysqlnd_azure` extension using PECL and set the value of this parameter.

### [Ubuntu Linux](#tab/linux)

**Prerequisites**

- PHP versions 7.2.15+ and 7.3.2+
- PHP PEAR 
- php-mysql
- Azure Database for MariaDB server

1. Install [mysqlnd_azure](https://github.com/microsoft/mysqlnd_azure) with [PECL](https://pecl.php.net/package/mysqlnd_azure). It's recommended to use version 1.1.0+.

    ```bash
    sudo pecl install mysqlnd_azure
    ```

2. Locate the extension directory (`extension_dir`) by running the below:

    ```bash
    sudo php -i | grep "extension_dir"
    ```

3. Change directories to the returned folder and ensure `mysqlnd_azure.so` is located in this folder.

4. Locate the folder for .ini files by running the below:

    ```bash
    sudo hp -i | grep "dir for additional .ini files"
    ```

5. Change directories to this returned folder.

6. Create a new `.ini` file for `mysqlnd_azure`. Make sure the alphabet order of the name is after the `mysqnld` one, since the modules are loaded according to the name order of the ini files. For example, if `mysqlnd` .ini is named `10-mysqlnd.ini`, name the mysqlnd ini as `20-mysqlnd-azure.ini`.

7. Within the new `.ini` file, add the following lines to enable redirection.

    ```config
    extension=mysqlnd_azure
    mysqlnd_azure.enableRedirect = on/off/preferred
    ```

### [Windows](#tab/windows)

**Prerequisites**

- PHP versions 7.2.15+ and 7.3.2+
- php-mysql
- Azure Database for MariaDB server

1. Determine if you're running a x64 or x86 version of PHP by running the following command:

    ```cmd
    php -i | findstr "Thread"
    ```

2. Download the corresponding x64 or x86 version of the [mysqlnd_azure](https://github.com/microsoft/mysqlnd_azure) DLL from [PECL](https://pecl.php.net/package/mysqlnd_azure) that matches your version of PHP. It's recommended to use version 1.1.0+.

3. Extract the zip file and find the DLL named `php_mysqlnd_azure.dll`.

4. Locate the extension directory (`extension_dir`) by running the below command:

    ```cmd
    php -i | find "extension_dir"
    ```

5. Copy the `php_mysqlnd_azure.dll` file into the directory returned in step 4.

6. Locate the PHP folder containing the `php.ini` file using the following command:

    ```cmd
    php -i | find "Loaded Configuration File"
    ```

7. Modify the `php.ini` file and add the following extra lines to enable redirection.

    Under the Dynamic Extensions section:

    ```config
    extension=mysqlnd_azure
    ```

    Under the Module Settings section:

    ```cpnfig
    [mysqlnd_azure]
    mysqlnd_azure.enableRedirect = on/off/preferred
    ```

---

### Confirm redirection

You can also confirm redirection is configured with the below sample PHP code. Create a PHP file called `mysqlConnect.php` and paste the below code. Update the server name, username, and password with your own.

```php
<?php
$host = '<yourservername>.mariadb.database.azure.com';
$username = '<yourusername>@<yourservername>';
$password = '<yourpassword>';
$db_name = 'testdb';
  echo "mysqlnd_azure.enableRedirect: ", ini_get("mysqlnd_azure.enableRedirect"), "\n";
  $db = mysqli_init();
  //The connection must be configured with SSL for redirection test
  $link = mysqli_real_connect ($db, $host, $username, $password, $db_name, 3306, NULL, MYSQLI_CLIENT_SSL);
  if (!$link) {
     die ('Connect error (' . mysqli_connect_errno() . '): ' . mysqli_connect_error() . "\n");
  }
  else {
    echo $db->host_info, "\n"; //if redirection succeeds, the host_info differs from the hostname you used used to connect
    $res = $db->query('SHOW TABLES;'); //test query with the connection
    print_r ($res);
    $db->close();
  }
?>
```

## Next steps

For more information about connection strings, see [Connection Strings](howto-connection-string.md).
