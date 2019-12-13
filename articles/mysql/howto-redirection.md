---
title: Connect to Azure Database for MySQL with redirection
description: This article describes how you can configure you application to connect to Azure Database for MySQL with redirection.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: conceptual
ms.date: 11/15/2019
---

# Connect to Azure Database for MySQL with redirection

This topic explains how to connect an application your Azure Database for MySQL server with redirection mode. Redirection aims to reduce network latency between client applications and MySQL servers by allowing applications to connect directly to backend server nodes.

> [!IMPORTANT]
> Support for redirection in the PHP [mysqlnd_azure](https://github.com/microsoft/mysqlnd_azure) is currently in preview.

## Before you begin
Sign in to the [Azure portal](https://portal.azure.com). Create an Azure Database for MySQL server with engine version 5.6, 5.7, or 8.0. For details, refer to [How to create Azure Database for MySQL server from Portal](quickstart-create-mysql-server-database-using-azure-portal.md) or [How to create Azure Database for MySQL server using CLI](quickstart-create-mysql-server-database-using-azure-cli.md).

Redirection is currently only supported when SSL is enabled. For details on how to configure SSL, see [Using SSL with Azure Database for MySQL](https://docs.microsoft.com/azure/mysql/howto-configure-ssl#step-3-enforcing-ssl-connections-in-azure). 

## PHP

### Ubuntu Linux

#### Prerequisites 
- PHP versions 7.2.15+ and 7.3.2+
- PHP PEAR 
- php-mysql
- Azure Database for MySQL server with SSL enabled

1. Install [mysqlnd_azure](https://github.com/microsoft/mysqlnd_azure) with [PECL](https://pecl.php.net/package/mysqlnd_azure).

    ```bash
    sudo pecl install mysqlnd_azure
    ```

2. Locate the extension directory (`extension_dir`) by running the below:

    ```bash
    php -i | grep "extension_dir"
    ```

3. Change directories to the returned folder and ensure `mysqlnd_azure.so` is located in this folder. 

4. Locate the folder for .ini files by running the below: 

    ```bash
    php -i | grep "dir for additional .ini files"
    ```

5. Change directories to this returned folder. 

6. Create a new .ini file for `mysqlnd_azure`. Make sure the alphabet order of the name is after that of mysqnld, since the modules are loaded according to the name order of the ini files. For example, if `mysqlnd` .ini is named `10-mysqlnd.ini`, name the mysqlnd ini as `20-mysqlnd-azure.ini`.

7. Within the new .ini file, add the following lines to enable redirection.

    ```bash
    extension=mysqlnd_azure
    mysqlnd_azure.enabled=on
    ```

### Windows

#### Prerequisites 
- PHP versions 7.2.15+ and 7.3.2+
- php-mysql
- Azure Database for MySQL server with SSL enabled

1. Determine if you are running a x64 or x86 version of PHP by running the following command:

    ```cmd
    php -i | findstr "Thread"
    ```

2. Download the corresponding x64 or x86 version of the [mysqlnd_azure](https://github.com/microsoft/mysqlnd_azure) DLL from [PECL](https://pecl.php.net/package/mysqlnd_azure) that matches your version of PHP. 

3. Extract the zip file and find the DLL named `php_mysqlnd_azure.dll`.

4. Locate the extension directory (`extension_dir`) by running the below command:

    ```cmd
    php -i | find "extension_dir"s
    ```

5. Copy the `php_mysqlnd_azure.dll` file into the directory returned in step 4. 

6. Locate the PHP folder containing the `php.ini` file using the following command:

    ```cmd
    php -i | find "Loaded Configuration File"
    ```

7. Modify the `php.ini` file and add the following extra lines to enable redirection. 

    Under the Dynamic Extensions section: 
    ```cmd
    extension=mysqlnd_azure
    ```
    
    Under the Module Settings section:     
    ```cmd 
    [mysqlnd_azure]
    mysqlnd_azure.enabled=on
    ```

### Confirm redirection

You can also confirm redirection is configured with the below sample PHP code. Create a PHP file called `mysqlConnect.php` and paste the below code. Update the server name, username, and password with your own. 
 
 ```php
<?php
$host = '<yourservername>.mysql.database.azure.com';
$username = '<yourusername>@<yourservername>';
$password = '<yourpassword>';
$db_name = 'testdb';
  echo "mysqlnd_azure.enabled: ", ini_get("mysqlnd_azure.enabled") == true?"On":"Off", "\n";
  $db = mysqli_init();
  $link = mysqli_real_connect ($db, $host, $username, $password, $db_name, 3306, NULL, MYSQLI_CLIENT_SSL);
  if (!$link) {
     die ('Connect error (' . mysqli_connect_errno() . '): ' . mysqli_connect_error() . "\n");
  }
  else {
    echo $db->host_info, "\n"; //if redirection succeeds, the host_info will differ from the hostname you used used to connect
    $res = $db->query('SHOW TABLES;'); //test query with the connection
    print_r ($res);
$db->close();
  }
 ?>
 ```

## Next steps
For more information about connection strings, refer to [Connection Strings](howto-connection-string.md).

