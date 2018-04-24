---
title: How to create a multi-container app on Web App for Containers - Azure | Microsoft Docs
description: How to use a multi-container app for Web App for Containers.
keywords: azure app service, web app, linux, docker, compose, kubernetes, multi-container, container
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
ms.date: 10/24/2017
ms.author: msangapu
ms.custom: mvc
#Customer intent: As an Azure customer, I want to show how to use the multi-container feature so customer can deploy their own containers into Web App for Containers.
---

#Create a multi-container (preview) app using Web App for Containers

> [!NOTE]
> This feature is currently in preview. YAML configurations may require modifications to work with the multi-container feature.
>

[Web App for Containers](app-service-linux-intro.md) provides built-in Docker images on Linux with support for specific versions, such as PHP 7.0 and Node.js 4.5. Web App for Containers uses the Docker container technology to host both built-in images and custom images as a platform as a service. In this tutorial, you learn how to build a custom Docker image and deploy it to Web App for Containers. This pattern is useful when the built-in images don't include your language of choice, or when your application requires a specific configuration that isn't provided within the built-in images.

The multi-container feature requires a .yaml  configuration file similar to that of Docker Compose and Kubernetes. In this tutorial, you will learn how to take an existing Docker Compose .yaml file and deploy to Web App for Containers using the Azure Cloud Shell. Alternatively, you can also work with a [Kubernetes sample](http://mangesh_to_provide_link).

[!INCLUDE [Free trial note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this tutorial, you need:

* An active [Azure subscription](https://azure.microsoft.com/pricing/free-trial/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio)
* Experience with Docker Compose or Kubernetes

## Deploy multi-container app to Azure

To create a Multi-container Web App, you must run Azure CLI commands that create a group, service plan, and the multi-container app.

[!INCLUDE [Try Cloud Shell](../../../includes/cloud-shell-try-it.md)]

[!INCLUDE [Configure deployment user](../../../includes/configure-deployment-user.md)]

[!INCLUDE [Create resource group](../../../includes/app-service-web-create-resource-group-linux-no-h.md)] 

[!INCLUDE [Create app service plan](../../../includes/app-service-web-create-app-service-plan-linux-no-h.md)] 

## Create a web app

Create a [web app](../articles/app-service/containers/app-service-linux-intro.md) in the `myAppServicePlan` App Service plan. 

In the Cloud Shell, you can use the [`az webapp create`](/cli/azure/webapp?view=azure-cli-latest#az_webapp_create) command. 

```azurecli-interactive
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name <app_name> 
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

Browse to the site to see your newly created web app with built-in image. Replace _&lt;app name>_ with your web app name.

```bash
http://<app_name>.azurewebsites.net
```

### Sample Docker Compose Configuration

```
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



```yaml
version: '3.1'

services:

  mysql:
    container_name: mysql57
    image: mysql:5.7
    volumes:
      - ${WEBAPP_STORAGE_HOME}/site/data:/var/lib/mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: examplepass

  wordpress:
    container_name: wordpress
    image: wordpress
    volumes:
      - ${WEBAPP_STORAGE_HOME}/site/wwwroot:/var/www/html
    restart: always
    ports:
      - 8080:80
    environment:
      WORDPRESS_DB_PASSWORD: example
```

This sample configures two containers. One container is loading MySQL and the other WordPress. ${WEBAPP_STORAGE_HOME} points to /home/. The volumes options map the file system to directories within the container.  The ports option exposes port 80.

> [!NOTE]
> Endpoints
> Nginx Proxy needed
> AZ client works in windows command-prompt, but not in powershell. Also works in cloud shell.
> Storage/volume mount needs to map to /home/data
> expose:
>	       - "80"
> Depends_on is not honored
>
>	Config options supported in compose:	Services, image, ports, environment, volumes, command, entrypoint
>
>	Config options supported in kube:	Spec, containers, name, image, command, args, ports, 
> Config not supported:	Build
>

## Configure environment variables

Our sample is utilizing persistent storage, however we haven't yet enabled this on our app. To make this change, we'll need to update an app setting.

To set app settings, use the [az webapp config appsettings set] command in the Cloud Shell. App settings are case-sensitive and space-separated.

```azurecli-interactive
az webapp config appsettings set --resource-group myResourceGroup --name <app_name> --settings WEBSITES_ENABLE_APP_SERVICE_STORAGE=TRUE
```

## Create a multi-container app

In the Cloud Shell, create a [web app](app-service-linux-intro.md) in the `myAppServicePlan` App Service plan with the [`az webapp create`] command. Don't forget to replace _\<appname>_ with a unique app name, and _\<docker-ID>_ with your Docker ID.

```azurecli-interactive
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name <app_name> --multicontainer-config-file https://raw.githubusercontent.com/Azure-Samples/multi-container/master/docker-compose-wordpress.yml --multicontainer-config-type compose

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

### Test the web app

Verify that the web app works by browsing to it (`http://<app_name>.azurewebsites.net`). 


[!INCLUDE [Clean-up section](../../../includes/cli-script-clean-up.md)]


## Next steps

> [!div class="nextstepaction"]
> [Learn more about the multi-container configuration options](link-to-another-post)
