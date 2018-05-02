---
title: Create a multi-container (preview) app using Azure Web App for Containers
description: Learn how to use multiple containers on Azure with Docker Compose, with a WordPress and MySQL app.
keywords: azure app service, web app, linux, docker, compose, multi-container, container
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
ms.date: 05/01/2018
ms.author: msangapu
ms.custom: mvc
#Customer intent: As an Azure customer, I want to learn how to deploy multiple containers into Web App for Containers.
---
#Tutorial: Create a multi-container (preview) app in Web App for Containers

[Web App for Containers](app-service-linux-intro.md) provides a flexible way to use Docker images. In this tutorial, you will learn how to create a multi-container app using WordPress and MySQL.

In this tutorial, you will learn how to:
> [!div class="checklist"]
> * Convert a Docker Compose configuration to work with Web App for Containers
> * Add application settings
> * Deploy a multi-container app to Azure

[!INCLUDE [Free trial note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this tutorial, you need experience with Docker Compose.

[!INCLUDE [Try Cloud Shell](../../../includes/cloud-shell-try-it.md)]

[!INCLUDE [Configure deployment user](../../../includes/configure-deployment-user.md)]

[!INCLUDE [Create resource group](../../../includes/app-service-web-create-resource-group-linux.md)] 

[!INCLUDE [Create app service plan](../../../includes/app-service-web-create-app-service-plan-linux.md)] 

## Modify Docker Compose file

For this tutorial, you use the compose file from [Docker](https://docs.docker.com/compose/wordpress/#define-the-project), but you need to modify it in order to run it in Web App for Containers. The finished compose file can be found at [Azure Samples](https://raw.githubusercontent.com/Azure-Samples/multi-container/master/docker-compose-wordpress.yaml). 

The following shows supported and unsupported Docker Compose options in Web App for Containers:

### Supported Docker Compose configuration options
- command
- entrypoint
- environment
- image
- ports
- restart
- services
- volumes

### Unsupported Docker Compose configuration options
- build (not allowed)
- depends_on (ignored)
- networks (ignored)
- secrets (ignored)
- ports other than 80 and 8080 (ignored)

> [!NOTE]
> Any other options not explicitly called out are also ignored in Public Preview.


### Modification steps

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
       MYSQL_ROOT_PASSWORD: examplepass

   wordpress:
     depends_on:
       - db
     image: wordpress:latest
     ports:
       - "8000:80"
     restart: always
     environment:
       WORDPRESS_DB_PASSWORD: examplepass
volumes:
    db_data:
```

WordPress expects `mysql` for the database instead of `db` so rename the two instances. The first one is the container name and the second is defined in the `depends_on` value.

Web App for Containers doesn't currently check for the `depends_on` option so it is ignored.

The volumes option maps the file system to directories within the container. `${WEBAPP_STORAGE_HOME}` is an environment variable in App Service and can be used to persist data for your app. Make the following modifications to the file:

In the `db` section, change the `volumes` option to the following value: `- ${WEBAPP_STORAGE_HOME}/site/data:/var/lib/mysql`

In the `wordpress` section, add a `volumes` option as shown in the following code: 
```yaml
    volumes:
      - ${WEBAPP_STORAGE_HOME}/site/wwwroot:/var/www/html
```

Finally, remove the `volumes` section at the bottom. 

After you're finished, your configuration should look like the following:

```yaml
version: '3.3'

services:

  mysql:
    image: mysql:5.7
    volumes:
      - ${WEBAPP_STORAGE_HOME}/site/data:/var/lib/mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: examplepass

  wordpress:
    depends_on:
       - mysql       
    image: wordpress
    volumes:
      - ${WEBAPP_STORAGE_HOME}/site/wwwroot:/var/www/html
    ports:
      - 8080:80
    restart: always
    environment:
      WORDPRESS_DB_PASSWORD: examplepass
```


## Create a multi-container app (Docker Compose)

In the Cloud Shell, create a multi-container [web app](app-service-linux-intro.md) in the `myAppServicePlan` App Service plan with the [az webapp create](/cli/azure/webapp?view=azure-cli-latest#az_webapp_create) command. Don't forget to replace _\<app_name>_ with a unique app name.

```azurecli-interactive
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name <app_name> --multicontainer-config-type compose --multicontainer-config-file "https://raw.githubusercontent.com/Azure-Samples/multi-container/master/docker-compose-wordpress.yaml"
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

## Configure environment variables

This sample specifies persistent storage, however you also need to enable this setting within App Service. To make this change, do the following:

To set app settings, use the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az_webapp_config_appsettings_set)  command in the Cloud Shell. App settings are case-sensitive and space-separated.

```azurecli-interactive
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

### Browse to the app

Browse to the deployed app at (`http://<app_name>.azurewebsites.net`). 

The app is now running multiple containers in Web App for Containers.

![Sample multi-container app on Web App for Containers](media/tutorial-multi-container-app/AzureMultiContainerWordPressInstall.png)

**Congratulations**, you've created a multi-container app in Web App for Containers.

[!INCLUDE [Clean-up section](../../../includes/cli-script-clean-up.md)]

In this tutorial, you learned how to:
> [!div class="checklist"]
> * Convert a Docker Compose configuration to work with Web App for Containers
> * Add application settings
> * Deploy a multi-container app to Azure

## Next steps

> [!div class="nextstepaction"]
> [Use a custom Docker image for Web App for Containers](tutorial-custom-docker-image.md)
