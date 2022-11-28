---
title: 'Quickstart: Boost performance for Azure Database for MySQL Flexible Server with Redis'
description: "This tutorial shows how to add Redis cache to boost performance for your Azure Database for MySQL Flexible Server."
ms.service: mysql
ms.subservice: flexible-server
ms.topic: quickstart
author: mksuni
ms.author: sumuth 
ms.date: 08/15/2022
---

# Tutorial: Boost performance of Azure Database for MySQL - Flexible Server with Azure cache for Redis 

[[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article demonstrates how to connect improve the performance of an Azure Database for MySQL using Azure cache for Redis. 

## Prerequisites

For this quickstart you need:

- An Azure account with an active subscription. 

    [!INCLUDE [flexible-server-free-trial-note](../includes/flexible-server-free-trial-note.md)]
- Create an Azure Database for MySQL Flexible server using [Azure portal](./quickstart-create-server-portal.md) <br/> or [Azure CLI](./quickstart-create-server-cli.md) if you do not have one.

[Having issues? Let us know](https://github.com/MicrosoftDocs/azure-docs/issues)

## Populate the mysql database

Use mysql workbench, and connect to the server 

```sql
CREATE DATABASE tododb;

CREATE TABLE tasks
(
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	title nvarchar(100) NOT NULL,
	completed TINYINT(1) NOT NULL
);

INSERT INTO tasks (title, completed) VALUES
('Task1', 0),
('Task2', 0),
('Task3', 1),
('Task4', 1),
('Task5', 0);

```

## Create a Redis cache 
[!INCLUDE [redis-cache-create](../../azure-cache-for-redis/includes/redis-cache-create.md)]

## Configure app service env variables 
In the repository you will find some Python code that you can run in your EC2 instance. But first you need to configure some environment variables:
```
syntax: shell
$ export REDIS_URL=redis://your_AZURE_redis_endpoint:6379/
$ export DB_HOST=your_mysql_endpoint
$ export DB_USER=admin
$ export DB_PASS=your_admin_password
$ export DB_NAME=tutorial
Note that the values for mysql_endpoint, redis_endpoint, and password are those that you saved in the previous steps.
```

## Caching result of query using Python 

The first of the two methods implemented in the code sample works by caching a serialized representation of the SQL query result. The following Python snippet illustrates the logic:
```
syntax: python
def fetch(sql):

  result = cache.get(sql)
  if result:
    return deserialize(result)
  else:
    result = db.query(sql)
    cache.setex(sql, ttl, serialize(result))
    return result
 ```   
 
 First, the SQL statement is used as a key in Redis, and the cache is examined to see if a value is present. If a value is not present, the SQL statement is used to query the database. The result of the database query is stored in Redis. The ttl variable must be set to a sensible value, dependent on the nature of your application. When the ttl expires, Redis evicts the key and frees the associated memory. This code is available in the tutorial repository and you can run it as is, but feel free to add print statements here and there if you want to see the value of a variable at a certain point in time.

In terms of strategy, the drawback of this approach is that when data is modified in the database, the changes won’t be reflected automatically to the user if a previous result was cached and its ttl has not elapsed yet.

An example of how you would use the fetch function:
```
syntax: python
print(fetch("SELECT * FROM tasks"))
```

The result would be:
```
syntax: python
[{'title': 'Task1', 'completed': 0}]
 ```
 
 ## Using Redis with WordPress
 
The benefit of enabling Redis Cache to your WordPress application will allow you to deliver content faster since all of the WordPress content is stored in the database. You can cache content that is mostly read only from WordPress database to make the query lookups faster. You can use either of these plugins to setup Redis.

### Pre-requisite
PLease install and enable [Redis PECL extension](https://pecl.php.net/package/redis). See [ow to install the extension locally](https://github.com/phpredis/phpredis/blob/develop/INSTALL.md) or [ow to install the extension in Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/configure-language-php?pivots=platform-linux#enable-php-extensions).

1. [Redis Object cache](https://wordpress.org/plugins/redis-cache/): Install and activate this plugin. Now update the wp-config.php file right above the statement */* That's all, stop editing! Happy blogging. */**

```php
define( 'WP_REDIS_HOST', '127.0.0.1' );
define( 'WP_REDIS_PORT', 6379 );
// define( 'WP_REDIS_PASSWORD', 'secret' );
define( 'WP_REDIS_TIMEOUT', 1 );
define( 'WP_REDIS_READ_TIMEOUT', 1 );

// change the database for each site to avoid cache collisions
// values 0-15 are valid in a default redis config.
define( 'WP_REDIS_DATABASE', 0 );

// automatically delete cache keys after 7 days
// define( 'WP_REDIS_MAXTTL', 60 * 60 * 24 * 7 );

// bypass the object cache, useful for debugging
// define( 'WP_REDIS_DISABLED', true );

/* That's all, stop editing! Happy blogging. */

```
Go to wordpress admin dashboard and select the Redis settings page on the menu. Now select **enable Object Cache**. Plugin will read the redis server information from wp-config.php file.

4. [W3 Total cache](https://wordpress.org/plugins/w3-total-cache/):


Furthermore you can [Query Monitor](https://wordpress.org/plugins/query-monitor/) allows you to debug database queries and it also shows total database queries grouped by a plugin. Query monitor plugin has other capabilties as well that help with debugging such as PHP errors, hooks and actions, HTTP API calls and more. 
 
 ## Expire content 
 
    
## Next steps

In this quickstart, you learned how to create an instance of Azure Cache for Redis.

> [Create an ASP.NET web app that uses an Azure Cache for Redis.](../../azure-cache-for-redis/cache-web-app-howto.md)
> [Create a Node.js web app that uses an Azure Cache for Redis.](../../azure-cache-for-redis/cache-nodejs-get-started.md)
> [Create an Python web app that uses an Azure Cache for Redis.](../../azure-cache-for-redis/cache-python-get-started.md)
