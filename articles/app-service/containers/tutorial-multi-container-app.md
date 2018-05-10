---
title: Create a multi-container (preview) app using Azure Web App for Containers
description: Learn how to use multiple containers on Azure with Docker Compose and Kubernetes configuration files, with a WordPress and MySQL app.
keywords: azure app service, web app, linux, docker, compose, multi-container, container, kubernetes
services: app-service
documentationcenter: ''
author: msangapu
manager: cfowler
editor: ''

ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 05/02/2018
ms.author: msangapu
ms.custom: mvc
#Customer intent: As an Azure customer, I want to learn how to deploy multiple containers using WordPress into Web App for Containers.
---
#Tutorial: Create a multi-container (preview) app in Web App for Containers

[Web App for Containers](app-service-linux-intro.md) provides a flexible way to use Docker images. In this tutorial, you'll learn how to create a multi-container app using WordPress and MySQL.

In this tutorial, you'll learn how to:
> [!div class="checklist"]
> * Convert a Docker Compose configuration to work with Web App for Containers
> * Convert a Kubernetes configuration to work with Web App for Containers
> * Deploy a multi-container app to Azure
> * Add application settings
> * Use persistent storage for your containers
> * Create an Azure Database for MySQL
> * Use a custom WordPress image with MySQL SSL and Redis settings
> * Troubleshoot errors

[!INCLUDE [Free trial note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this tutorial, you need:
* Install [Azure CLI](/cli/azure/install-azure-cli).
* Experience with [Docker Compose](https://docs.docker.com/compose/) or [Kubernetes](https://kubernetes.io/).
* Azure DB for MySQL Experience

## Create a deployment user

In the local command-prompt, create deployment credentials with the [`az webapp deployment user set`](/cli/azure/webapp/deployment/user?view=azure-cli-latest#az_webapp_deployment_user_set) command. This deployment user is required for FTP and local Git deployment to a web app. The user name and password are account level. _They are different from your Azure subscription credentials._

In the following example, replace *\<username>* and *\<password>* (including brackets) with a new user name and password. The user name must be unique within Azure. The password must be at least eight characters long, with two of the following three elements: letters, numbers, symbols. 

```azurecli-interactive
az webapp deployment user set --user-name <username> --password <password>
```

You should get a JSON output, with the password shown as `null`. If you get a `'Conflict'. Details: 409` error, change the username. If you get a ` 'Bad Request'. Details: 400` error, use a stronger password.

You create this deployment user only once; you can use it for all your Azure deployments.

> [!NOTE]
> Record the user name and password. You need them to deploy the web app later.
>
>

[!INCLUDE [Create resource group](../../../includes/app-service-web-create-resource-group-linux.md)] 

[!INCLUDE [Create app service plan](../../../includes/app-service-web-create-app-service-plan-linux.md)] 

## Docker Compose configuration options

For this tutorial, you use the compose file from [Docker](https://docs.docker.com/compose/wordpress/#define-the-project), but you need to modify it in order to run it in Web App for Containers. The finished compose file can be found at [Azure Samples](https://raw.githubusercontent.com/Azure-Samples/multi-container/master/compose-wordpress.yml). 

The following lists show supported and unsupported Docker Compose configuration options in Web App for Containers:

### Supported options
- command
- entrypoint
- environment
- image
- ports
- restart
- services
- volumes

### Unsupported options
- build (not allowed)
- depends_on (ignored)
- networks (ignored)
- secrets (ignored)
- ports other than 80 and 8080 (ignored)

> [!NOTE]
> Any other options not explicitly called out are also ignored in Public Preview.


### Docker Compose with WordPress and MySQL containers

Copy and paste the YAML below, locally to a file named `compose-wordpress.yml`.

The Docker Compose file is reproduced in the following code:
```yaml
version: '3.3'

services:
   db:
     image: mysql:5.7
     volumes:
       - db_data:/var/lib/mysql
     restart: always
     environment:
       MYSQL_ROOT_PASSWORD: somewordpress
       MYSQL_DATABASE: wordpress
       MYSQL_USER: wordpress
       MYSQL_PASSWORD: wordpress

   wordpress:
     depends_on:
       - db
     image: wordpress:latest
     ports:
       - "8000:80"
     restart: always
     environment:
       WORDPRESS_DB_HOST: db:3306
       WORDPRESS_DB_USER: wordpress
       WORDPRESS_DB_PASSWORD: wordpress
volumes:
    db_data:
```

> [!IMPORTANT]
> You'll configure an Azure Database for MySQL later in the article. It's not recommended to use database containers in a production environment.
>

## Create a multi-container app (Docker Compose)

In your local command-prompt terminal, create a multi-container [web app](app-service-linux-intro.md) in the `myAppServicePlan` App Service plan with the [az webapp create](/cli/azure/webapp?view=azure-cli-latest#az_webapp_create) command. Don't forget to replace _\<app_name>_ with a unique app name.

```bash
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name <app_name> --multicontainer-config-type compose --multicontainer-config-file compose-wordpress.yml
```

When the web app has been created, the Azure CLI shows output similar to the following example:

```json
{
  "additionalProperties": {},
  "availabilityState": "Normal",
  "clientAffinityEnabled": true,
  "clientCertEnabled": false,
  "cloningInfo": null,
  "containerSize": 0,
  "dailyMemoryTimeQuota": 0,
  "defaultHostName": "multi-app2.azurewebsites.net",
  "enabled": true,
  < JSON data removed for brevity. >
}
```

### Browse to the app

Browse to the deployed app at (`http://<app_name>.azurewebsites.net`). The app may take a few minutes to load. If you receive an error, allow a few more minutes then refresh the browser.

![Sample multi-container app on Web App for Containers][1]

**Congratulations**, you've created a multi-container app in Web App for Containers. Next you'll configure your app to use Azure Database for MySQL. You shouldn't install WordPress at this time.


## Create an Azure Database for MySQL server

Create a server in Azure Database for MySQL (Preview) with the [`az mysql server create`](/cli/azure/mysql/server?view=azure-cli-latest#az_mysql_server_create) command.

In the following command, substitute your MySQL server name where you see the _&lt;mysql_server_name>_ placeholder (valid characters are `a-z`, `0-9`, and `-`). This name is part of the MySQL server's hostname  (`<mysql_server_name>.database.windows.net`), it needs to be globally unique.

```azurecli-interactive
az mysql server create --resource-group myResourceGroup --name <mysql_server_name>  --location "West Europe" --admin-user adminuser --admin-password My5up3rStr0ngPaSw0rd! --sku-name B_Gen4_1 --version 5.7
```

When the MySQL server is created, the Azure CLI shows information similar to the following example:

```json
{
  "administratorLogin": "adminuser",
  "administratorLoginPassword": null,
  "fullyQualifiedDomainName": "<mysql_server_name>.database.windows.net",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.DBforMySQL/servers/<mysql_server_name>",
  "location": "southcentralus",
  "name": "<mysql_server_name>",
  "resourceGroup": "myResourceGroup",
  ...
}
```

### Configure server firewall

Create a firewall rule for your MySQL server to allow client connections by using the [`az mysql server firewall-rule create`](/cli/azure/mysql/server/firewall-rule?view=azure-cli-latest#az_mysql_server_firewall_rule_create) command. When both starting IP and end IP are set to 0.0.0.0, the firewall is only opened for other Azure resources. 

```azurecli-interactive
az mysql server firewall-rule create --name allAzureIPs --server <mysql_server_name> --resource-group myResourceGroup --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0
```

> [!TIP] 
> You can be even more restrictive in your firewall rule by [using only the outbound IP addresses your app uses](../app-service-ip-addresses.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json#find-outbound-ips).
>

### Create the WordPress database

You need to create the WordPress database.

```bash
az mysql db create --resource-group myResourceGroup --server-name <mysql_server_name> --name wordpress
```

When the database has been created, the Azure CLI shows information similar to the following example:

```json
{
  "additionalProperties": {},
  "charset": "latin1",
  "collation": "latin1_swedish_ci",
  "id": "/subscriptions/12db1644-4b12-4cab-ba54-8ba2f2822c1f/resourceGroups/myResourceGroup/providers/Microsoft.DBforMySQL/servers/<mysql_server_name>/databases/wordpress",
  "name": "wordpress",
  "resourceGroup": "myResourceGroup",
  "type": "Microsoft.DBforMySQL/servers/databases"
}
```

### Configure database variables in WordPress

To connect the WordPress app to this new MySQL server, you need to configure a few WordPress-specific environment variables, including the SSL CA path defined by `MYSQL_SSL_CA`. A certificate from digitrust.com has been provided for you.

To make these changes, use the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az_webapp_config_appsettings_set) command in the local command-prompt terminal. App settings are case-sensitive and space-separated.

```bash
az webapp config appsettings set --resource-group myResourceGroup --name <app_name> --settings WORDPRESS_DB_HOST="<mysql_server_name>.mysql.database.azure.com" WORDPRESS_DB_USER="adminuser@<mysql_server_name>" WORDPRESS_DB_PASSWORD="My5up3rStr0ngPaSw0rd!" WORDPRESS_DB_NAME="wordpress" MYSQL_SSL_CA="BaltimoreCyberTrustroot.crt.pem"
```

When the app setting has been created, the Azure CLI shows information similar to the following example:

```json
[
  {
    "name": "WORDPRESS_DB_HOST",
    "slotSetting": false,
    "value": "<mysql_server_name>.mysql.database.azure.com"
  },
  {
    "name": "WORDPRESS_DB_USER",
    "slotSetting": false,
    "value": "adminuser@<mysql_server_name>"
  },
  {
    "name": "WORDPRESS_DB_NAME",
    "slotSetting": false,
    "value": "wordpress"
  },
  {
    "name": "WORDPRESS_DB_PASSWORD",
    "slotSetting": false,
    "value": "My5up3rStr0ngPaSw0rd!"
  },
  {
    "name": "MYSQL_SSL_CA",
    "slotSetting": false,
    "value": "BaltimoreCyberTrustroot.crt.pem"
  }
]
```

### Use a custom image for MySQL SSL and other configurations

Azure Database for MySQL uses SSL by default. WordPress requires additional configuration to use SSL with Azure Database for MySQL. These changes and others have already been made for you in the [custom image](https://github.com/msangapu/wordpress). In practice, you would add desired changes to your own image.

The custom image is based on the 'official image' of [WordPress from Docker Hub](https://hub.docker.com/_/wordpress/).

The following changes have been made in this custom image:
* [Adds PHP extension for Redis v4.0.2.](https://github.com/msangapu/wordpress/blob/0903507e9b506e7962f3c0d84f8382979eb2e530/Dockerfile#L35)
* [Adds unzip needed for file extraction](https://github.com/msangapu/wordpress/blob/1c15a8c87b3c4800c5844c1ab9da88831e0d4b78/docker-entrypoint.sh#L71)
* [Adds Baltimore Cyber Trust Root Certificate file for SSL to MySQL.](https://github.com/msangapu/wordpress/blob/1c15a8c87b3c4800c5844c1ab9da88831e0d4b78/docker-entrypoint.sh#L61)
* [Uses App Setting for MySQL SSL Certificate Authority certificate in WordPress wp-config.php.](https://github.com/msangapu/wordpress/blob/1c15a8c87b3c4800c5844c1ab9da88831e0d4b78/docker-entrypoint.sh#L163)
* [Adds WordPress define for MYSQL_CLIENT_FLAGS needed for MySQL SSL](https://github.com/msangapu/wordpress/blob/1c15a8c87b3c4800c5844c1ab9da88831e0d4b78/docker-entrypoint.sh#L164)
* [Adds Redis Object Cache 1.3.8 WordPress plugin.](https://github.com/msangapu/wordpress/blob/1c15a8c87b3c4800c5844c1ab9da88831e0d4b78/docker-entrypoint.sh#L74)
* [Uses App Seting for Redis host name in WordPress wp-config.php.](https://github.com/msangapu/wordpress/blob/1c15a8c87b3c4800c5844c1ab9da88831e0d4b78/docker-entrypoint.sh#L162)

To use the custom image, change the `image: wordpress` to use `image: msangapu/wordpress`. You no longer need the database container. Remove the  `db`, `environment`, `depends_on`, and `volumes` section from the configuration file. Your file should look like the following code:
 

```yaml
version: '3.3'

services:
   wordpress:
     image: msangapu/wordpress
     ports:
       - "8000:80"
     restart: always
```

### Update app with new configuration

In your local command-prompt terminal, reconfigure your multi-container [web app](app-service-linux-intro.md) with the [az webapp config container set](/cli/azure/webapp/config/container?view=azure-cli-latest#az_webapp_config_container_set) command. Don't forget to replace _\<app_name>_ with a unique app name.

```bash
az webapp config container set --resource-group myResourceGroup --name <app_name> --multicontainer-config-type compose --multicontainer-config-file compose-wordpress.yml
```

When the app has been reconfigured, the Azure CLI shows information similar to the following example:

```json
[
  {
    "name": "DOCKER_CUSTOM_IMAGE_NAME",
    "value": "COMPOSE|dmVyc2lvbjogJzMuMycKCnNlcnZpY2VzOgogICB3b3JkcHJlc3M6CiAgICAgaW1hZ2U6IG1zYW5nYXB1L3dvcmRwcmVzcwogICAgIHBvcnRzOgogICAgICAgLSAiODAwMDo4MCIKICAgICByZXN0YXJ0OiBhbHdheXM="
  }
]
```
<!-- may not need this 
### Restart the app

Now that you've supplied a new container image, you need to restart the app so it downloads the new image.

```bash
az webapp restart --resource-group myResourceGroup --name <app_name>
```
-->

### Browse to the app

Browse to the deployed app at (`http://<app_name>.azurewebsites.net`). The app is now using Azure Database for MySQL.

## Add persistent storage

Your multi-container is now running in Web App for Containers. The data will be erased on restart because the files are not persisted. In this section, you'll add persistent storage to your WordPress container. 

### Configure environment variables

To use of persistent storage, you'll enable this setting within App Service. To make this change, use the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az_webapp_config_appsettings_set) command in the local command-prompt terminal. App settings are case-sensitive and space-separated.

```bash
az webapp config appsettings set --resource-group myResourceGroup --name <app_name> --settings WEBSITES_ENABLE_APP_SERVICE_STORAGE=TRUE
```

When the app setting has been created, the Azure CLI shows information similar to the following example:

```json
[
  < JSON data removed for brevity. >
  {
    "name": "WORDPRESS_DB_NAME",
    "slotSetting": false,
    "value": "wordpress"
  },
  {
    "name": "WEBSITES_ENABLE_APP_SERVICE_STORAGE",
    "slotSetting": false,
    "value": "TRUE"
  }
]
```


### Modify configuration file

Open *compose-wordpress.yml* again.

The `volumes` option maps the file system to a directory within the container. `${WEBAPP_STORAGE_HOME}` is an environment variable in App Service that is mapped to persistent storage for your app. Make the following modifications to the file:

In the `wordpress` section, add a `volumes` option as shown in the following code: 

```yaml
    volumes:
      - ${WEBAPP_STORAGE_HOME}/site/wwwroot:/var/www/html
```

After you're finished, save your changes. Your configuration should look like the following code:

```yaml
version: '3.3'

services:
   wordpress:
     image: msangapu/wordpress
     volumes:
      - ${WEBAPP_STORAGE_HOME}/site/wwwroot:/var/www/html
     ports:
       - "8000:80"
     restart: always
```

### Update app with new configuration

In your local command-prompt terminal, reconfigure your multi-container [web app](app-service-linux-intro.md) with the [az webapp config container set](/cli/azure/webapp/config/container?view=azure-cli-latest#az_webapp_config_container_set) command. Don't forget to replace _\<app_name>_ with a unique app name.

```bash
az webapp config container set --resource-group myResourceGroup --name <app_name> --multicontainer-config-type compose --multicontainer-config-file compose-wordpress.yml
```

After your command runs, it shows output similar to the following example:

```json
[
  {
    "name": "WEBSITES_ENABLE_APP_SERVICE_STORAGE",
    "slotSetting": false,
    "value": "TRUE"
  },
  {
    "name": "DOCKER_CUSTOM_IMAGE_NAME",
    "value": "COMPOSE|dmVyc2lvbjogJzMuMycKCnNlcnZpY2VzOgogICBteXNxbDoKICAgICBpbWFnZTogbXlzcWw6NS43CiAgICAgdm9sdW1lczoKICAgICAgIC0gZGJfZGF0YTovdmFyL2xpYi9teXNxbAogICAgIHJlc3RhcnQ6IGFsd2F5cwogICAgIGVudmlyb25tZW50OgogICAgICAgTVlTUUxfUk9PVF9QQVNTV09SRDogZXhhbXBsZXBhc3MKCiAgIHdvcmRwcmVzczoKICAgICBkZXBlbmRzX29uOgogICAgICAgLSBteXNxbAogICAgIGltYWdlOiB3b3JkcHJlc3M6bGF0ZXN0CiAgICAgcG9ydHM6CiAgICAgICAtICI4MDAwOjgwIgogICAgIHJlc3RhcnQ6IGFsd2F5cwogICAgIGVudmlyb25tZW50OgogICAgICAgV09SRFBSRVNTX0RCX1BBU1NXT1JEOiBleGFtcGxlcGFzcwp2b2x1bWVzOgogICAgZGJfZGF0YTo="
  }
]
```

<!-- restart the app here, add az command -->

### Browse to the app

Browse to the deployed app at (`http://<app_name>.azurewebsites.net`). 

The WordPress container is now using Azure Database for MySQL and persistent storage.

## Add Redis container

Add the redis container to the bottom of the configuration file:

```yaml
   redis:
     image: redis:3-alpine
     restart: always
```

### Configure environment variables

To use Redis, you'll enable this setting within App Service. To make this change, use the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az_webapp_config_appsettings_set) command in the local command-prompt terminal. App settings are case-sensitive and space-separated.

```bash
az webapp config appsettings set --resource-group myResourceGroup --name <app_name> --settings WP_REDIS_HOST="redis"
```

When the app setting has been created, the Azure CLI shows information similar to the following example:

```json
[
  < JSON data removed for brevity. >
  {
    "name": "WORDPRESS_DB_USER",
    "slotSetting": false,
    "value": "adminuser@<mysql_server_name>"
  },
  {
    "name": "WP_REDIS_HOST",
    "slotSetting": false,
    "value": "redis"
  }
]
```

### Update app with new configuration

In your local command-prompt terminal, reconfigure your multi-container [web app](app-service-linux-intro.md) with the [az webapp config container set](/cli/azure/webapp/config/container?view=azure-cli-latest#az_webapp_config_container_set) command. Don't forget to replace _\<app_name>_ with a unique app name.

```bash
az webapp config container set --resource-group myResourceGroup --name <app_name> --multicontainer-config-type compose --multicontainer-config-file compose-wordpress.yml
```

After your command runs, it shows output similar to the following example:

```json
[
  {
    "name": "DOCKER_CUSTOM_IMAGE_NAME",
    "value": "COMPOSE|dmVyc2lvbjogJzMuMycKCnNlcnZpY2VzOgogICBteXNxbDoKICAgICBpbWFnZTogbXlzcWw6NS43CiAgICAgdm9sdW1lczoKICAgICAgIC0gZGJfZGF0YTovdmFyL2xpYi9teXNxbAogICAgIHJlc3RhcnQ6IGFsd2F5cwogICAgIGVudmlyb25tZW50OgogICAgICAgTVlTUUxfUk9PVF9QQVNTV09SRDogZXhhbXBsZXBhc3MKCiAgIHdvcmRwcmVzczoKICAgICBkZXBlbmRzX29uOgogICAgICAgLSBteXNxbAogICAgIGltYWdlOiB3b3JkcHJlc3M6bGF0ZXN0CiAgICAgcG9ydHM6CiAgICAgICAtICI4MDAwOjgwIgogICAgIHJlc3RhcnQ6IGFsd2F5cwogICAgIGVudmlyb25tZW50OgogICAgICAgV09SRFBSRVNTX0RCX1BBU1NXT1JEOiBleGFtcGxlcGFzcwp2b2x1bWVzOgogICAgZGJfZGF0YTo="
  }
]
```

### Browse to the app
Browse to the deployed app at (`http://<app_name>.azurewebsites.net`). 

The production-ready app is now using **Azure Database for MySQL, persistent storage and Redis**. Complete the steps and install WordPress.


### Use WordPress Redis plugin

Log-in to WordPress admin. In the left navigation, select **Plugins**, and then select **Installed Plugins**.

![Select WordPress Plugins][2]

Show all plugins here

In the plugins page, find **Redis Object Cache** and click **Activate**.

![Activate Redis][3]

Click on **settings**.

![Click on Settings][4]

Click the **Enable Object Cache** button.

![Click the 'Enable Object Cache' button][5]

WordPress connects to the Redis server. The connection **status** appears on the same page.

![Once WordPress is connected to Redis, your screen should show this.][6]


## Use a Kubernetes configuration (optional)

In this section, you'll learn how to use a Kubernetes configuration to deploy multiple containers. Make sure you have a [resource group](#create-a-resource-group), an [App Service plan](#create-an-azure-app-service-plan). Since the majority of the steps are similar to that of the compose section, the configuration file has been combined for you. 

(!!!Mangesh Give link to modified github repo and image.!!!)

### Supported Kubernetes options for multi-container 
- args
- command
- containers
- image
- name
- ports
- spec

> [!NOTE]
>Any other Kubernetes options not explicitly called out aren't supported in Public Preview.
>


### Create configuration file

Save the following YAML to a file called *kubernetes_wordpress.yaml*.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: wordpress
  labels:
    name: wordpress
spec:
  containers:

   - image: redis:3-alpine
     name: redis

   - image: msangapu/wordpress
     name: wordpress
     ports:
     - containerPort: 80
       name: wordpress
          
     volumeMounts:
      - name: appservice-storage
        mountPath: /var/www/html
        subPath: /site/wwwroot
        
  volumes:
    - name: appservice-storage
      hostConfig:
        path: ${WEBAPP_STORAGE_HOME}
```

### Create an Azure Database for MySQL server

Create a server in Azure Database for MySQL (Preview) with the [`az mysql server create`](/cli/azure/mysql/server?view=azure-cli-latest#az_mysql_server_create) command.

In the following command, substitute your MySQL server name where you see the _&lt;mysql_server_name>_ placeholder (valid characters are `a-z`, `0-9`, and `-`). This name is part of the MySQL server's hostname  (`<mysql_server_name>.database.windows.net`), it needs to be globally unique.

```azurecli-interactive
az mysql server create --resource-group myResourceGroup --name <mysql_server_name>  --location "West Europe" --admin-user adminuser --admin-password My5up3rStr0ngPaSw0rd! --sku-name B_Gen4_1 --version 5.7
```

When the MySQL server is created, the Azure CLI shows information similar to the following example:

```json
{
  "administratorLogin": "adminuser",
  "administratorLoginPassword": null,
  "fullyQualifiedDomainName": "<mysql_server_name>.database.windows.net",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.DBforMySQL/servers/<mysql_server_name>",
  "location": "southcentralus",
  "name": "<mysql_server_name>",
  "resourceGroup": "myResourceGroup",
  ...
}
```

### Configure server firewall

Create a firewall rule for your MySQL server to allow client connections by using the [`az mysql server firewall-rule create`](/cli/azure/mysql/server/firewall-rule?view=azure-cli-latest#az_mysql_server_firewall_rule_create) command. When both starting IP and end IP are set to 0.0.0.0, the firewall is only opened for other Azure resources. 

```azurecli-interactive
az mysql server firewall-rule create --name allAzureIPs --server <mysql_server_name> --resource-group myResourceGroup --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0
```

> [!TIP] 
> You can be even more restrictive in your firewall rule by [using only the outbound IP addresses your app uses](../app-service-ip-addresses.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json#find-outbound-ips).
>

### Create the WordPress database

You need to create the WordPress database. If you haven't already, create an [Azure Database for MySQL server](#create-an-azure-database-for-mysql-server).

```bash
az mysql db create --resource-group myResourceGroup --server-name <mysql_server_name> --name wordpress
```

When the database has been created, the Azure CLI shows information similar to the following example:

```json
{
  "additionalProperties": {},
  "charset": "latin1",
  "collation": "latin1_swedish_ci",
  "id": "/subscriptions/12db1644-4b12-4cab-ba54-8ba2f2822c1f/resourceGroups/myResourceGroup/providers/Microsoft.DBforMySQL/servers/<mysql_server_name>/databases/wordpress",
  "name": "wordpress",
  "resourceGroup": "myResourceGroup",
  "type": "Microsoft.DBforMySQL/servers/databases"
}
```


### Configure database variables in WordPress

To connect the WordPress app to this new MySQL server, you need to configure a few WordPress-specific environment variables. To make this change, use the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az_webapp_config_appsettings_set) command in the local command-prompt terminal. App settings are case-sensitive and space-separated.

```bash
az webapp config appsettings set --resource-group myResourceGroup --name <app_name> --settings WORDPRESS_DB_HOST="<mysql_server_name>.mysql.database.azure.com" WORDPRESS_DB_USER="adminuser@<mysql_server_name>" WORDPRESS_DB_PASSWORD="My5up3rStr0ngPaSw0rd!" WORDPRESS_DB_NAME="wordpress" MYSQL_SSL_CA="BaltimoreCyberTrustroot.crt.pem"
```

When the app setting has been created, the Azure CLI shows information similar to the following example:

```json
[
  {
    "name": "WORDPRESS_DB_HOST",
    "slotSetting": false,
    "value": "<mysql_server_name>.mysql.database.azure.com"
  },
  {
    "name": "WORDPRESS_DB_USER",
    "slotSetting": false,
    "value": "adminuser@<mysql_server_name>"
  },
  {
    "name": "WORDPRESS_DB_NAME",
    "slotSetting": false,
    "value": "wordpress"
  },
  {
    "name": "WORDPRESS_DB_PASSWORD",
    "slotSetting": false,
    "value": "My5up3rStr0ngPaSw0rd!"
  }
]
```

### Add persistent storage

Your multi-container is now running in Web App for Containers. The data will be erased on restart because the files are not persisted. In this section, you'll add persistent storage to your WordPress container. 

### Configure environment variables

To use of persistent storage, you'll enable this setting within App Service. To make this change, use the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az_webapp_config_appsettings_set) command in the local command-prompt terminal. App settings are case-sensitive and space-separated.

```bash
az webapp config appsettings set --resource-group myResourceGroup --name <app_name> --settings WEBSITES_ENABLE_APP_SERVICE_STORAGE=TRUE
```

When the app setting has been created, the Azure CLI shows information similar to the following example:

```json
[
  {
    "name": "WEBSITES_ENABLE_APP_SERVICE_STORAGE",
    "slotSetting": false,
    "value": "TRUE"
  }
]
```


### Create a multi-container app (Kubernetes)

In your local command-prompt terminal, create a multi-container [web app](app-service-linux-intro.md) in the `myResourceGroup` resource group and the `myAppServicePlan` App Service plan with the [az webapp create](/cli/azure/webapp?view=azure-cli-latest#az_webapp_create) command. Don't forget to replace _\<app_name>_ with a unique app name.

```bash
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name <app_name> --multicontainer-config-type kube --multicontainer-config-file kubernetes_wordpress.yaml
```

When the web app has been created, the Azure CLI shows output similar to the following example:

```json
{
  "availabilityState": "Normal",
  "clientAffinityEnabled": true,
  "clientCertEnabled": false,
  "cloningInfo": null,
  "containerSize": 0,
  "dailyMemoryTimeQuota": 0,
  "defaultHostName": "<app_name>.azurewebsites.net",
  "enabled": true,
  < JSON data removed for brevity. >
}
```
<!-->
### Restart the app

To
```bash
az webapp restart --resource-group multiRG01 --name multi-app1
```
-->

### Browse to the app

Browse to the deployed app at (`http://<app_name>.azurewebsites.net`). 

The app is now running multiple containers in Web App for Containers.

![Sample multi-container app on Web App for Containers](1)

**Congratulations**, you've created a multi-container app in Web App for Containers.


To configure Redis, follow the steps in [Add Redis container](#add-redis-container).


## Find Docker Container logs

If you run into issues using multiple containers, you can access the container logs by browsing to: `https://<app_name>.scm.azurewebsites.net/api/logs/docker`.

You'll see output similar to the following example:

```json
[
   {
      "machineName":"RD00XYZYZE567A",
      "lastUpdated":"2018-05-10T04:11:45Z",
      "size":25125,
      "href":"https://<app_name>.scm.azurewebsites.net/api/vfs/LogFiles/2018_05_10_RD00XYZYZE567A_docker.log",
      "path":"/home/LogFiles/2018_05_10_RD00XYZYZE567A_docker.log"
   }
]
```

You see a log for each container and an additional log for the parent process. Copy the respective `href` value into the browser to view the log.


[!INCLUDE [Clean-up section](../../../includes/cli-script-clean-up.md)]

In this tutorial, you learned how to:
> [!div class="checklist"]
> * Convert a Docker Compose configuration to work with Web App for Containers
> * Convert a Kubernetes configuration to work with Web App for Containers
> * Deploy a multi-container app to Azure
> * Add application settings
> * Use persistent storage for your containers
> * Create an Azure Database for MySQL
> * Use a custom WordPress image with MySQL SSL and Redis settings
> * Troubleshoot errors

## Next steps

> [!div class="nextstepaction"]
> [Use a custom Docker image for Web App for Containers](tutorial-custom-docker-image.md)


<!--Image references-->
[1]: ./media/tutorial-multi-container-app/azure-multi-container-wordpress-install.png
[2]: ./media/tutorial-multi-container-app/wordpress-plugins.png
[3]: ./media/tutorial-multi-container-app/activate-redis.png
[4]: ./media/tutorial-multi-container-app/redis-settings.png
[5]: ./media/tutorial-multi-container-app/enable-object-cache.png
[6]: ./media/tutorial-multi-container-app/redis-connected.png
