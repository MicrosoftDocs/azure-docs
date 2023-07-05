---
title: 'Quickstart: Boost performance for Azure Database for MySQL - Flexible Server with Azure Cache for Redis'
description: "This tutorial shows how to add Azure Cache for Redis to boost performance for your Azure Database for MySQL - Flexible Server."
ms.service: mysql
ms.subservice: flexible-server
ms.custom: devx-track-python
ms.topic: quickstart
author: mksuni
ms.author: sumuth 
ms.date: 12/07/2022
---

# Tutorial: Boost performance of Azure Database for MySQL - Flexible Server with Azure Cache for Redis

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article demonstrates how to boost the performance of an Azure Database for MySQL flexible server using [Azure Cache for Redis](../../azure-cache-for-redis/cache-overview.md). Azure Cache for Redis is a secure data cache and messaging broker that provides high throughput and low-latency access to data for applications.

## Prerequisites

For this quickstart you need:

- An Azure account with an active subscription. 

    [!INCLUDE [flexible-server-free-trial-note](../includes/flexible-server-free-trial-note.md)]
- Create an Azure Database for MySQL - Flexible Server using [Azure portal](./quickstart-create-server-portal.md) <br/> or [Azure CLI](./quickstart-create-server-cli.md) if you don't have one.
- Configure networking settings of Azure Database for MySQL - Flexible Server to make sure your IP has access to it. If you're using Azure App Service or Azure Kubernetes service, enable **Allow public access from any Azure service within Azure to this server** setting in the Azure portal.

[Having issues? Let us know](https://github.com/MicrosoftDocs/azure-docs/issues)

## Populate the MySQL database

Connect to [MySQL Server using MySQL Workbench](connect-workbench.md) and run the following query to populate the database. 

```sql
CREATE DATABASE tododb;

CREATE TABLE tasks
(
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	title nvarchar(100) NOT NULL,
	completed TINYINT(1) NOT NULL
);

INSERT INTO tasks (id,title, completed) VALUES
(1,'Task1', 0),
(2,'Task2', 0),
(3,'Task3', 1),
(4,'Task4', 1),
(5,'Task5', 0);

```

## Create a Redis cache

[!INCLUDE [redis-cache-create](../../azure-cache-for-redis/includes/redis-cache-create.md)]

## Use Redis with Python

Install the latest version of [Python](https://www.python.org/) on your local environment or on an Azure virtual machine or Azure App Service. Use pip to install redis-py.

```python
pip install redis
```

The following code creates a connection to Azure Cache for Redis instance using redis-py, stores the query result into the Azure Cache for Redis and fetch the value from the cache.

```python
import redis
import mysql.connector

r = redis.Redis(
    host='your-azure-redis-instance-name.redis.cache.windows.net',
    port=6379, 
    password='azure-redis-primary-access-key')
    
mysqlcnx = mysql.connector.connect(user='your-admin-username', password='db-user-password',
                              host='database-servername.mysql.database.azure.com',
                              database='your-databsae-name')
			      
mycursor = mysqlcnx.cursor()
mycursor.execute("SELECT * FROM tasks where completed=1")
myresult = mycursor.fetchall()

#Set the result of query in a key 
if result:
          cache.hmset(mykey, myresult)
          cache.expire(mykey, 3600)
      return result
      
#Get value of mykey
getkeyvalue= cache.hgetall(mykey)

#close mysql connection
mysqlcnx.close()
```

## Using Redis with PHP

Install [PHP](https://www.php.net/manual/en/install.php) on your local environment. Follow the steps below to write a PHP script that caches a SQL query from MySQL database. Here are a few pre-requisites before running the script:

1. Install and enable [Redis PECL extension](https://pecl.php.net/package/redis) to use Azure Cache for Redis with your PHP script. See [how to install the extension locally](https://github.com/phpredis/phpredis/blob/develop/INSTALL.md) 
2. Install and enable [MySQL PDO extension](https://www.php.net/manual/en/ref.pdo-mysql.php)

```php
<?php

$redis = new Redis();
$redis->connect('azure-redis-instance-ame.redis.cache.windows.net', 6379);
$redis->auth('azure-redis-primary-access-key');

$key = 'tasks';

if (!$redis->get($key)) {
    /*Pulling data from MySQL database*/
    $database_name     = 'database-name';
    $database_user     = 'your-database-user';
    $database_password = 'your-database-password';
    $mysql_host        = 'database-servername.mysql.database.azure.com';

    $pdo = new PDO('mysql:host=' . $mysql_host . '; dbname=' . $database_name, $database_user, $database_password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql  = "SELECT * FROM tasks";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
       $tasks[] = $row;
    }

    $redis->set($key, serialize($tasks));
    $redis->expire($key, 10);

} else {
     /*Pulling data from Azure Cache for Redis*/
     $tasks = unserialize($redis->get($key));

}

echo $source . ': <br>';
print_r($tasks);
```

## Using Redis with WordPress

The benefit of enabling Azure Cache for Redis instance to your WordPress application will allow you to deliver content faster since all of the WordPress content is stored in the database. You can cache content that is mostly read only from WordPress database to make the query lookups faster. You can use either of these plugins to setup Redis.  Install and enable [Redis PECL extension](https://pecl.php.net/package/redis). See [how to install the extension locally](https://github.com/phpredis/phpredis/blob/develop/INSTALL.md) or [how to install the extension in Azure App Service](../../app-service/configure-language-php.md).

Install [Redis Object cache](https://wordpress.org/plugins/redis-cache/) and activate this plugin on our WordPress application. Now update the `wp-config.php` file right above the statement */* That's all, stop editing! Happy blogging. */**

```php
define( 'WP_REDIS_HOST', 'azure-redis-servername.redis.cache.windows.net' );
define( 'WP_REDIS_PORT', 6379 );
define( 'WP_REDIS_PASSWORD', 'azure-redis-primary-access-key' );
define( 'WP_REDIS_TIMEOUT', 1 );
define( 'WP_REDIS_READ_TIMEOUT', 1 );

// change the database for each site to avoid cache collisions
// values 0-15 are valid in a default redis config.
define( 'WP_REDIS_DATABASE', 0 );

// automatically delete cache keys after 7 days
define( 'WP_REDIS_MAXTTL', 60 * 60 * 24 * 7 );

// bypass the object cache, useful for debugging
// define( 'WP_REDIS_DISABLED', true );

/* That's all, stop editing! Happy blogging. */

```

Go to the Wordpress admin dashboard and select the Redis settings page on the menu. Now select **enable Object Cache**. Plugin will read the Azure Cache for Redis instance  information from `wp-config.php` file.

You may also use [W3 Total cache](https://wordpress.org/plugins/w3-total-cache/) to configure Azure Cache for Redis on your WordPress app. You can evaluate the performance improvements using [Query Monitor plugin](https://wordpress.org/plugins/query-monitor/), which allows you to debug database queries and it also shows total database queries grouped by a plugin.  

## Next steps

In this quickstart, you learned how to create an instance of Azure Cache for Redis and use it with Azure database for MySQL. See [performance best practices](../single-server/concept-performance-best-practices.md) for Azure database for MySQL.
