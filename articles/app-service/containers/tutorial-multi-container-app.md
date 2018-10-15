---
title: Create a multi-container (preview) app in Web App for Containers
description: Learn how to use multiple containers on Azure with Docker Compose and Kubernetes configuration files, with a WordPress and MySQL app.
keywords: azure app service, web app, linux, docker, compose, multicontainer, multi-container, web app for containers, multiple containers, container, kubernetes, wordpress, azure db for mysql, production database with containers
services: app-service
documentationcenter: ''
author: msangapu
manager: jeconnoc
editor: ''

ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 06/25/2018
ms.author: msangapu
ms.custom: mvc
#Customer intent: As an Azure customer, I want to learn how to deploy multiple containers using WordPress into Web App for Containers.
---
# Tutorial: Create a multi-container (preview) app in Web App for Containers

[Web App for Containers](app-service-linux-intro.md) provides a flexible way to use Docker images. In this tutorial, you'll learn how to create a multi-container app using WordPress and MySQL. You'll complete this tutorial in Cloud Shell, but you can also run these commands locally with the [Azure CLI](/cli/azure/install-azure-cli) command-line tool (2.0.32 or later).

In this tutorial, you'll learn how to:
> [!div class="checklist"]
> * Convert a Docker Compose configuration to work with Web App for Containers
> * Convert a Kubernetes configuration to work with Web App for Containers
> * Deploy a multi-container app to Azure
> * Add application settings
> * Use persistent storage for your containers
> * Connect to Azure Database for MySQL
> * Troubleshoot errors

[!INCLUDE [Free trial note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this tutorial, you need experience with [Docker Compose](https://docs.docker.com/compose/) or [Kubernetes](https://kubernetes.io/).

## Download the sample

For this tutorial, you use the compose file from [Docker](https://docs.docker.com/compose/wordpress/#define-the-project), but you'll modify it include Azure Database for MySQL, persistent storage, and Redis. The configuration file can be found at [Azure Samples](https://github.com/Azure-Samples/multicontainerwordpress).

[!code-yml[Main](../../../azure-app-service-multi-container/docker-compose-wordpress.yml)]

In Cloud Shell, create a tutorial directory and then change to it.

```bash
mkdir tutorial

cd tutorial
```

Next, run the following command to clone the sample app repository to your tutorial directory. Then change to the `multicontainerwordpress` directory.

```bash
git clone https://github.com/Azure-Samples/multicontainerwordpress

cd multicontainerwordpress
```

## Create a resource group

[!INCLUDE [resource group intro text](../../../includes/resource-group.md)]

In Cloud Shell, create a resource group with the [`az group create`](/cli/azure/group?view=azure-cli-latest#az-group-create) command. The following example creates a resource group named *myResourceGroup* in the *South Central US* location. To see all supported locations for App Service on Linux in **Standard** tier, run the [`az appservice list-locations --sku S1 --linux-workers-enabled`](/cli/azure/appservice?view=azure-cli-latest#az-appservice-list-locations) command.

```azurecli-interactive
az group create --name myResourceGroup --location "South Central US"
```

You generally create your resource group and the resources in a region near you.

When the command finishes, a JSON output shows you the resource group properties.

## Create an Azure App Service plan

In Cloud Shell, create an App Service plan in the resource group with the [`az appservice plan create`](/cli/azure/appservice/plan?view=azure-cli-latest#az-appservice-plan-create) command.

<!-- [!INCLUDE [app-service-plan](app-service-plan-linux.md)] -->

The following example creates an App Service plan named `myAppServicePlan` in the **Standard** pricing tier (`--sku S1`) and in a Linux container (`--is-linux`).

```azurecli-interactive
az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku S1 --is-linux
```

When the App Service plan has been created, Cloud Shell shows information similar to the following example:

```json
{
  "adminSiteName": null,
  "appServicePlanName": "myAppServicePlan",
  "geoRegion": "South Central US",
  "hostingEnvironmentProfile": null,
  "id": "/subscriptions/0000-0000/resourceGroups/myResourceGroup/providers/Microsoft.Web/serverfarms/myAppServicePlan",
  "kind": "linux",
  "location": "South Central US",
  "maximumNumberOfWorkers": 1,
  "name": "myAppServicePlan",
  < JSON data removed for brevity. >
  "targetWorkerSizeId": 0,
  "type": "Microsoft.Web/serverfarms",
  "workerTierName": null
}
```

## Docker Compose configuration options

For this tutorial, you use the compose file from [Docker](https://docs.docker.com/compose/wordpress/#define-the-project), but you'll modify it include Azure Database for MySQL, persistent storage, and Redis. Alternatively, you can use a [Kubernetes configuration](#use-a-kubernetes-configuration-optional). The configuration files can be found at [Azure Samples](https://github.com/Azure-Samples/multicontainerwordpress).

The following lists show supported and unsupported Docker Compose configuration options in Web App for Containers:

### Supported options

* command
* entrypoint
* environment
* image
* ports
* restart
* services
* volumes

### Unsupported options

* build (not allowed)
* depends_on (ignored)
* networks (ignored)
* secrets (ignored)

> [!NOTE]
> Any other options not explicitly called out are also ignored in Public Preview.

### Docker Compose with WordPress and MySQL containers

## Create a Docker Compose app

In your Cloud Shell, create a multi-container [web app](app-service-linux-intro.md) in the `myAppServicePlan` App Service plan with the [az webapp create](/cli/azure/webapp?view=azure-cli-latest#az-webapp-create) command. Don't forget to replace _\<app_name>_ with a unique app name.

```bash
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name <app_name> --multicontainer-config-type compose --multicontainer-config-file docker-compose-wordpress.yml
```

When the web app has been created, Cloud Shell shows output similar to the following example:

```json
{
  "additionalProperties": {},
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

### Browse to the app

Browse to the deployed app at (`http://<app_name>.azurewebsites.net`). The app may take a few minutes to load. If you receive an error, allow a few more minutes then refresh the browser. If you're having trouble and would like to troubleshoot, review [container logs](#find-docker-container-logs).

![Sample multi-container app on Web App for Containers][1]

**Congratulations**, you've created a multi-container app in Web App for Containers. Next you'll configure your app to use Azure Database for MySQL. Don't install WordPress at this time.

## Connect to production database

It's not recommended to use database containers in a production environment. The local containers aren't scalable. Instead, you'll use Azure Database for MySQL which can be scaled.

### Create an Azure Database for MySQL server

Create an Azure Database for MySQL server with the [`az mysql server create`](/cli/azure/mysql/server?view=azure-cli-latest#az-mysql-server-create) command.

In the following command, substitute your MySQL server name where you see the _&lt;mysql_server_name>_ placeholder (valid characters are `a-z`, `0-9`, and `-`). This name is part of the MySQL server's hostname  (`<mysql_server_name>.database.windows.net`), it needs to be globally unique.

```azurecli-interactive
az mysql server create --resource-group myResourceGroup --name <mysql_server_name>  --location "South Central US" --admin-user adminuser --admin-password My5up3rStr0ngPaSw0rd! --sku-name B_Gen4_1 --version 5.7
```

Creating the server may take a few minutes to complete. When the MySQL server is created, Cloud Shell shows information similar to the following example:

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

Create a firewall rule for your MySQL server to allow client connections by using the [`az mysql server firewall-rule create`](/cli/azure/mysql/server/firewall-rule?view=azure-cli-latest#az-mysql-server-firewall-rule-create) command. When both starting IP and end IP are set to 0.0.0.0, the firewall is only opened for other Azure resources.

```azurecli-interactive
az mysql server firewall-rule create --name allAzureIPs --server <mysql_server_name> --resource-group myResourceGroup --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0
```

> [!TIP]
> You can be even more restrictive in your firewall rule by [using only the outbound IP addresses your app uses](../app-service-ip-addresses.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json#find-outbound-ips).
>

### Create the WordPress database

```bash
az mysql db create --resource-group myResourceGroup --server-name <mysql_server_name> --name wordpress
```

When the database has been created, Cloud Shell shows information similar to the following example:

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

To connect the WordPress app to this new MySQL server, you'll configure a few WordPress-specific environment variables, including the SSL CA path defined by `MYSQL_SSL_CA`. The [Baltimore CyberTrust Root](https://www.digicert.com/digicert-root-certificates.htm) from [DigiCert](http://www.digicert.com/) is provided in the [custom image](https://docs.microsoft.com/en-us/azure/app-service/containers/tutorial-multi-container-app#use-a-custom-image-for-mysql-ssl-and-other-configurations) below.

To make these changes, use the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az-webapp-config-appsettings-set) command in Cloud Shell. App settings are case-sensitive and space-separated.

```bash
az webapp config appsettings set --resource-group myResourceGroup --name <app_name> --settings WORDPRESS_DB_HOST="<mysql_server_name>.mysql.database.azure.com" WORDPRESS_DB_USER="adminuser@<mysql_server_name>" WORDPRESS_DB_PASSWORD="My5up3rStr0ngPaSw0rd!" WORDPRESS_DB_NAME="wordpress" MYSQL_SSL_CA="BaltimoreCyberTrustroot.crt.pem"
```

When the app setting has been created, Cloud Shell shows information similar to the following example:

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

By default, SSL is used by Azure Database for MySQL. WordPress requires additional configuration to use SSL with MySQL. The WordPress 'official image' doesn't provide the additional configuration, but a [custom image](https://hub.docker.com/r/microsoft/multicontainerwordpress/builds/) has been prepared fo your convenience. In practice, you would add desired changes to your own image.

The custom image is based on the 'official image' of [WordPress from Docker Hub](https://hub.docker.com/_/wordpress/). The following changes have been made in this custom image for Azure Database for MySQL:

* [Adds Baltimore Cyber Trust Root Certificate file for SSL to MySQL.](https://github.com/Azure-Samples/multicontainerwordpress/blob/5669a89e0ee8599285f0e2e6f7e935c16e539b92/docker-entrypoint.sh#L61)
* [Uses App Setting for MySQL SSL Certificate Authority certificate in WordPress wp-config.php.](https://github.com/Azure-Samples/multicontainerwordpress/blob/5669a89e0ee8599285f0e2e6f7e935c16e539b92/docker-entrypoint.sh#L163)
* [Adds WordPress define for MYSQL_CLIENT_FLAGS needed for MySQL SSL.](https://github.com/Azure-Samples/multicontainerwordpress/blob/5669a89e0ee8599285f0e2e6f7e935c16e539b92/docker-entrypoint.sh#L164)

The following changes have been made for Redis (to be used in a later section):

* [Adds PHP extension for Redis v4.0.2.](https://github.com/Azure-Samples/multicontainerwordpress/blob/5669a89e0ee8599285f0e2e6f7e935c16e539b92/Dockerfile#L35)
* [Adds unzip needed for file extraction.](https://github.com/Azure-Samples/multicontainerwordpress/blob/5669a89e0ee8599285f0e2e6f7e935c16e539b92/docker-entrypoint.sh#L71)
* [Adds Redis Object Cache 1.3.8 WordPress plugin.](https://github.com/Azure-Samples/multicontainerwordpress/blob/5669a89e0ee8599285f0e2e6f7e935c16e539b92/docker-entrypoint.sh#L74)
* [Uses App Setting for Redis host name in WordPress wp-config.php.](https://github.com/Azure-Samples/multicontainerwordpress/blob/5669a89e0ee8599285f0e2e6f7e935c16e539b92/docker-entrypoint.sh#L162)

To use the custom image, you'll update your docker-compose-wordpress.yml file. In Cloud Shell, type `nano docker-compose-wordpress.yml` to open the nano text editor. Change the `image: wordpress` to use `image: microsoft/multicontainerwordpress`. You no longer need the database container. Remove the  `db`, `environment`, `depends_on`, and `volumes` section from the configuration file. Your file should look like the following code:

```yaml
version: '3.3'

services:
   wordpress:
     image: microsoft/multicontainerwordpress
     ports:
       - "8000:80"
     restart: always
```

Save your changes and exit nano. Use the command `^O` to save and `^X` to exit.

### Update app with new configuration

In Cloud Shell, reconfigure your multi-container [web app](app-service-linux-intro.md) with the [az webapp config container set](/cli/azure/webapp/config/container?view=azure-cli-latest#az-webapp-config-container-set) command. Don't forget to replace _\<app_name>_ with the name of the web app you created earlier.

```bash
az webapp config container set --resource-group myResourceGroup --name <app_name> --multicontainer-config-type compose --multicontainer-config-file docker-compose-wordpress.yml
```

When the app has been reconfigured, Cloud Shell shows information similar to the following example:

```json
[
  {
    "name": "DOCKER_CUSTOM_IMAGE_NAME",
    "value": "COMPOSE|dmVyc2lvbjogJzMuMycKCnNlcnZpY2VzOgogICB3b3JkcHJlc3M6CiAgICAgaW1hZ2U6IG1zYW5nYXB1L3dvcmRwcmVzcwogICAgIHBvcnRzOgogICAgICAgLSAiODAwMDo4MCIKICAgICByZXN0YXJ0OiBhbHdheXM="
  }
]
```

### Browse to the app

Browse to the deployed app at (`http://<app_name>.azurewebsites.net`). The app is now using Azure Database for MySQL.

![Sample multicontainer app on Web App for Containers][1]

## Add persistent storage

Your multi-container is now running in Web App for Containers. However, if you install WordPress now and restart your app later, you'll find that your WordPress installation is gone. This happens because your Docker Compose configuration currently points to a storage location inside your container. The files installed into your container don't persist beyond app restart. In this section, you'll add persistent storage to your WordPress container.

### Configure environment variables

To use of persistent storage, you'll enable this setting within App Service. To make this change, use the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az-webapp-config-appsettings-set) command in Cloud Shell. App settings are case-sensitive and space-separated.

```bash
az webapp config appsettings set --resource-group myResourceGroup --name <app_name> --settings WEBSITES_ENABLE_APP_SERVICE_STORAGE=TRUE
```

When the app setting has been created, Cloud Shell shows information similar to the following example:

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

In the Cloud Shell, type `nano docker-compose-wordpress.yml` to open the nano text editor.

The `volumes` option maps the file system to a directory within the container. `${WEBAPP_STORAGE_HOME}` is an environment variable in App Service that is mapped to persistent storage for your app. You'll use this environment variable in the volumes option so that the WordPress files are installed into persistent storage instead of the container. Make the following modifications to the file:

In the `wordpress` section, add a `volumes` option so it looks like the following code:

```yaml
version: '3.3'

services:
   wordpress:
     image: microsoft/multicontainerwordpress
     volumes:
      - ${WEBAPP_STORAGE_HOME}/site/wwwroot:/var/www/html
     ports:
       - "8000:80"
     restart: always
```

### Update app with new configuration

In Cloud Shell, reconfigure your multi-container [web app](app-service-linux-intro.md) with the [az webapp config container set](/cli/azure/webapp/config/container?view=azure-cli-latest#az-webapp-config-container-set) command. Don't forget to replace _\<app_name>_ with a unique app name.

```bash
az webapp config container set --resource-group myResourceGroup --name <app_name> --multicontainer-config-type compose --multicontainer-config-file docker-compose-wordpress.yml
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

### Browse to the app

Browse to the deployed app at (`http://<app_name>.azurewebsites.net`).

The WordPress container is now using Azure Database for MySQL and persistent storage.

## Add Redis container

 The WordPress 'official image' does not include the dependencies for Redis. These dependencies and additional configuration needed to use Redis with WordPress have been prepared for you in this [custom image](https://github.com/Azure-Samples/multicontainerwordpress). In practice, you would add desired changes to your own image.

The custom image is based on the 'official image' of [WordPress from Docker Hub](https://hub.docker.com/_/wordpress/). The following changes have been made in this custom image for Redis:

* [Adds PHP extension for Redis v4.0.2.](https://github.com/Azure-Samples/multicontainerwordpress/blob/5669a89e0ee8599285f0e2e6f7e935c16e539b92/Dockerfile#L35)
* [Adds unzip needed for file extraction.](https://github.com/Azure-Samples/multicontainerwordpress/blob/5669a89e0ee8599285f0e2e6f7e935c16e539b92/docker-entrypoint.sh#L71)
* [Adds Redis Object Cache 1.3.8 WordPress plugin.](https://github.com/Azure-Samples/multicontainerwordpress/blob/5669a89e0ee8599285f0e2e6f7e935c16e539b92/docker-entrypoint.sh#L74)
* [Uses App Setting for Redis host name in WordPress wp-config.php.](https://github.com/Azure-Samples/multicontainerwordpress/blob/5669a89e0ee8599285f0e2e6f7e935c16e539b92/docker-entrypoint.sh#L162)

Add the redis container to the bottom of the configuration file so it looks like the following example:

[!code-yml[Main](../../../azure-app-service-multi-container/compose-wordpress.yml)]

### Configure environment variables

To use Redis, you'll enable this setting, `WP_REDIS_HOST`, within App Service. This is a *required setting* for WordPress to communicate with the Redis host. To make this change, use the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az-webapp-config-appsettings-set) command in Cloud Shell. App settings are case-sensitive and space-separated.

```bash
az webapp config appsettings set --resource-group myResourceGroup --name <app_name> --settings WP_REDIS_HOST="redis"
```

When the app setting has been created, Cloud Shell shows information similar to the following example:

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

In Cloud Shell, reconfigure your multi-container [web app](app-service-linux-intro.md) with the [az webapp config container set](/cli/azure/webapp/config/container?view=azure-cli-latest#az-webapp-config-container-set) command. Don't forget to replace _\<app_name>_ with a unique app name.

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

Complete the steps and install WordPress.

### Connect WordPress to Redis

Log-in to WordPress admin. In the left navigation, select **Plugins**, and then select **Installed Plugins**.

![Select WordPress Plugins][2]

Show all plugins here

In the plugins page, find **Redis Object Cache** and click **Activate**.

![Activate Redis][3]

Click on **Settings**.

![Click on Settings][4]

Click the **Enable Object Cache** button.

![Click the 'Enable Object Cache' button][5]

WordPress connects to the Redis server. The connection **status** appears on the same page.

![WordPress connects to the Redis server. The connection **status** appears on the same page.][6]

**Congratulations**, you've connected WordPress to Redis. The production-ready app is now using **Azure Database for MySQL, persistent storage, and Redis**. You can now scale out your App Service Plan to multiple instances.

## Use a Kubernetes configuration (optional)

In this section, you'll learn how to use a Kubernetes configuration to deploy multiple containers. Make sure you follow earlier steps in to create a [resource group](#create-a-resource-group) and an [App Service plan](#create-an-azure-app-service-plan). Since the majority of the steps are similar to that of the compose section, the configuration file has been combined for you.

### Supported Kubernetes options for multi-container

* args
* command
* containers
* image
* name
* ports
* spec

> [!NOTE]
>Any other Kubernetes options not explicitly called out aren't supported in Public Preview.
>

### Kubernetes configuration file

You'll use *kubernetes-wordpress.yml* for this portion of the tutorial. It is displayed here for your reference:

[!code-yml[Main](../../../azure-app-service-multi-container/kubernetes-wordpress.yml)]

### Create an Azure Database for MySQL server

Create a server in Azure Database for MySQL with the [`az mysql server create`](/cli/azure/mysql/server?view=azure-cli-latest#az-mysql-server-create) command.

In the following command, substitute your MySQL server name where you see the _&lt;mysql_server_name>_ placeholder (valid characters are `a-z`, `0-9`, and `-`). This name is part of the MySQL server's hostname  (`<mysql_server_name>.database.windows.net`), it needs to be globally unique.

```azurecli-interactive
az mysql server create --resource-group myResourceGroup --name <mysql_server_name>  --location "South Central US" --admin-user adminuser --admin-password My5up3rStr0ngPaSw0rd! --sku-name B_Gen4_1 --version 5.7
```

When the MySQL server is created, Cloud Shell shows information similar to the following example:

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

Create a firewall rule for your MySQL server to allow client connections by using the [`az mysql server firewall-rule create`](/cli/azure/mysql/server/firewall-rule?view=azure-cli-latest#az-mysql-server-firewall-rule-create) command. When both starting IP and end IP are set to 0.0.0.0, the firewall is only opened for other Azure resources.

```azurecli-interactive
az mysql server firewall-rule create --name allAzureIPs --server <mysql_server_name> --resource-group myResourceGroup --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0
```

> [!TIP]
> You can be even more restrictive in your firewall rule by [using only the outbound IP addresses your app uses](../app-service-ip-addresses.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json#find-outbound-ips).
>

### Create the WordPress database

If you haven't already, create an [Azure Database for MySQL server](#create-an-azure-database-for-mysql-server).

```bash
az mysql db create --resource-group myResourceGroup --server-name <mysql_server_name> --name wordpress
```

When the database has been created, Cloud Shell shows information similar to the following example:

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

### Create a multi-container app (Kubernetes)

In Cloud Shell, create a multi-container [web app](app-service-linux-intro.md) in the `myResourceGroup` resource group and the `myAppServicePlan` App Service plan with the [az webapp create](/cli/azure/webapp?view=azure-cli-latest#az-webapp-create) command. Don't forget to replace _\<app_name>_ with a unique app name.

```bash
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name <app_name> --multicontainer-config-type kube --multicontainer-config-file kubernetes-wordpress.yml
```

When the web app has been created, Cloud Shell shows output similar to the following example:

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

### Configure database variables in WordPress

To connect the WordPress app to this new MySQL server, you'll configure a few WordPress-specific environment variables. To make this change, use the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az-webapp-config-appsettings-set) command in Cloud Shell. App settings are case-sensitive and space-separated.

```bash
az webapp config appsettings set --resource-group myResourceGroup --name <app_name> --settings WORDPRESS_DB_HOST="<mysql_server_name>.mysql.database.azure.com" WORDPRESS_DB_USER="adminuser@<mysql_server_name>" WORDPRESS_DB_PASSWORD="My5up3rStr0ngPaSw0rd!" WORDPRESS_DB_NAME="wordpress" MYSQL_SSL_CA="BaltimoreCyberTrustroot.crt.pem"
```

When the app setting has been created, Cloud Shell shows information similar to the following example:

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

Your multi-container is now running in Web App for Containers. The data will be erased on restart because the files aren't persisted. In this section, you'll add persistent storage to your WordPress container.

### Configure environment variables

To use of persistent storage, you'll enable this setting within App Service. To make this change, use the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az-webapp-config-appsettings-set) command in Cloud Shell. App settings are case-sensitive and space-separated.

```bash
az webapp config appsettings set --resource-group myResourceGroup --name <app_name> --settings WEBSITES_ENABLE_APP_SERVICE_STORAGE=TRUE
```

When the app setting has been created, Cloud Shell shows information similar to the following example:

```json
[
  {
    "name": "WEBSITES_ENABLE_APP_SERVICE_STORAGE",
    "slotSetting": false,
    "value": "TRUE"
  }
]
```

### Browse to the app

Browse to the deployed app at (`http://<app_name>.azurewebsites.net`).

The app is now running multiple containers in Web App for Containers.

![Sample multicontainer app on Web App for Containers][1]

**Congratulations**, you've created a multi-container app in Web App for Containers.

To use Redis, follow the steps in [Connect WordPress to Redis](#connect-wordpress-to-redis).

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
> * Connect to Azure Database for MySQL
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
