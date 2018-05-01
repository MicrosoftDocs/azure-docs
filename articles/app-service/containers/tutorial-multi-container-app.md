---
title: Create a multi-container (preview) app using Web App for Containers
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
#Customer intent: As an Azure customer, I want to show how to use the multiple containers so customer can deploy their own containers into Web App for Containers.
---
#Tutorial: Create a multi-container (preview) app in Web App for Containers

> [!NOTE]
> Deployment to multiple containers is currently in preview.

[Web App for Containers](app-service-linux-intro.md) provides a flexible way to use Docker images. Web App for Containers uses the Docker container technology to host both built-in images and custom images as a platform as a service.  In this tutorial, you will learn how to create a multiple container app using....

<!----  hello -->

In this tutorial, you will learn how to:
> [!div class="checklist"]
> * Convert a Docker Compose configuration
> * Deploy multi-container app to Azure
> * Configure environment variables

[!INCLUDE [Free trial note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [Try Cloud Shell](../../../includes/cloud-shell-try-it.md)]

[!INCLUDE [Configure deployment user](../../../includes/configure-deployment-user.md)]

[!INCLUDE [Create resource group](../../../includes/app-service-web-create-resource-group-linux.md)] 

[!INCLUDE [Create app service plan](../../../includes/app-service-web-create-app-service-plan-linux.md)] 

## Modify Docker Compose file

For this tutorial, you use the compose file from [Azure Samples](https://raw.githubusercontent.com/Azure-Samples/multi-container/master/docker-compose-wordpress.yaml), but you need to modify it in order to run it in Web App for Containers. The following shows supported and unsupported Docker Compose options in Web App for Containers:

### Supported Docker Compose syntax
- command
- entrypoint
- environment
- image
- ports
- restart
- services
- volumes

### Unsupported Docker Compose syntax
- build
- depends_on
- networks
- secrets

Any other syntax not explicitly called out isn't supported in Public Preview.

<!-- don't lead customers to beleive this is the working yaml -->


In this section, you will learn how to use a Docker Compose configuration in Web App for Containers. <!--To use a Kuberentes configuration, follow the steps at [Use a Kubernetes configuration](#using-a-kubernetes-configuration-optional) instead for the rest of the tutorial.-->

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

> [!NOTE]
> If your app requires a database, [Azure Database services](https://azure.microsoft.com/en-us/product-categories/databases/) is strongly recommended for production environments, instead of a database container. If you want to use a database in container for development or testing purposes, make sure to use the persisted share storage to store your database files, so the database can be persisted during app restarts. 

This sample is based on WordPress and MySQL from [Docker](https://docs.docker.com/compose/wordpress/#define-the-project). It needs to be modified in order to work with multiple containers. Listed below are both supported and unsupported options.


## Multi-container configuration

### Removing dependencies
This sample states that WP is dependent on the MySQL container. However, `depends_on` is not supported so it will be removed from the configuration.

<!-- doesn't break the app, may add it later -->
<!-- will not be honored -->

### Persistent storage
If you want to persist the data, you need to map the container directory to  shared storage.You can utilize *WEBAPP_STORAGE_HOME* variable to access this shared directory. The volumes option maps the file system to directories within the container.  Once the app is enabled, you also need to enable an app setting to enable persistent storage which you will do later.

### Ports

<!-- only host port 80 or 8080 will be honored, any others will be disregarded.-->



```yaml
version: '3.3'

services:

  mysql:
    container_name: mysql
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
      WORDPRESS_DB_PASSWORD: examplepass
```


## Create a multi-container app (Docker Compose)

<!--Change this to a create command 
az webapp config container set --resource-group myResourceGroup --plan myAppServicePlan --name <app_name> --multicontainer-config-type compose --multicontainer-config-file https://raw.githubusercontent.com/Azure-Samples/multi-container/master/docker-compose-wordpress.yaml 

-->

In the Cloud Shell, create a multi-container [web app](app-service-linux-intro.md) in the `myAppServicePlan` App Service plan with the [az webapp create](/cli/azure/webapp?view=azure-cli-latest#az_webapp_create) command. Don't forget to replace _\<app_name>_ with a unique app name.

```azurecli-interactive
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name <app_name> --multicontainer-config-type compose --multicontainer-config-file "https://raw.githubusercontent.com/Azure-Samples/multi-container/master/docker-compose-wordpress.yaml"
```

When the web app has been created, the Azure CLI shows output similar to the following example:

```json
[
  {
    "name": "DOCKER_CUSTOM_IMAGE_NAME",
    "value": "COMPOSE|dmVyc2lvbjogJzMuMycKCnNlcnZpY2VzOgoKICBteXNxbDoKICAgIGNvbnRhaW5lcl9uYW1lOiBteXNxbDU3CiAgICBpbWFnZTogbXlzcWw6NS43CiAgICB2b2x1bWVzOgogICAgICAtICR7V0VCQVBQX1NUT1JBR0VfSE9NRX0vc2l0ZS9kYXRhOi92YXIvbGliL215c3FsCiAgICByZXN0YXJ0OiBhbHdheXMKICAgIGVudmlyb25tZW50OgogICAgICBNWVNRTF9ST09UX1BBU1NXT1JEOiBleGFtcGxlcGFzcwoKICB3b3JkcHJlc3M6CiAgICBjb250YWluZXJfbmFtZTogd29yZHByZXNzCiAgICBpbWFnZTogd29yZHByZXNzCiAgICB2b2x1bWVzOgogICAgICAtICR7V0VCQVBQX1NUT1JBR0VfSE9NRX0vc2l0ZS93d3dyb290Oi92YXIvd3d3L2h0bWwKICAgIHJlc3RhcnQ6IGFsd2F5cwogICAgcG9ydHM6CiAgICAgIC0gODA4MDo4MAogICAgZW52aXJvbm1lbnQ6CiAgICAgIFdPUkRQUkVTU19EQl9QQVNTV09SRDogZXhhbXBsZQo="
  }
]
```

## Configure environment variables

This sample is utilizing persistent storage, however it isn't yet enabled. To make this change, you need to update an app setting.

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

Browse to the deployed app using your web browser.(`http://<app_name>.azurewebsites.net`). 

The app is now running multiple containers in Web App for Containers.

![Sample multi-container app on Web App for Containers](media/tutorial-multi-container-app/AzureMultiContainerWordPressInstall.png)

**Congratulations**, you've created a multi-container app on Web App for Containers.

<!-- If you're only looking for Docker Compose instructions, you're done. See [next steps](#next-steps).

## Use a Kubernetes configuration (optional)

In this section, you will learn how to use a Kubernetes configuration to deploy to multiple containers. Make sure you have a [resource group](#create-a-resource-group) and an [App Service plan](#create-an-azure-app-service-plan) already.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: wordpress
  labels:
    name: wordpress
spec:
  containers:
   - image: mysql:5.7
     name: mysql
     env:
        - name: MYSQL_ROOT_PASSWORD
          value: examplepass
          
     ports:
     - containerPort: 3306
       name: mysql

     volumeMounts:
     - name: appservice-storage
       mountPath: /var/lib/mysql
       subPath: /mysql
       
   - image: wordpress
     name: wordpress
     ports:
     - containerPort: 80
       name: wordpress
     env:
        - name: WORDPRESS_DB_PASSWORD
          value: examplepass

     volumeMounts:
      - name: appservice-storage
        mountPath: /var/www/html
        subPath: /site/wwwroot
        
  volumes:
    - name: appservice-storage
      hostConfig:
        path: ${WEBAPP_STORAGE_HOME}

```

### Supported Kubernetes options for multi-container 
- args
- command
- containers
- image
- name
- ports
- spec

> [!NOTE]
>Any other Kubernetes syntax not explicitly called out aren't supported in Public Preview.
>

## Create a multi-container app (Kubernetes)

In the Cloud Shell, create a multi-container [web app](app-service-linux-intro.md) in the `myAppServicePlan` App Service plan with the [az webapp create](/cli/azure/webapp?view=azure-cli-latest#az_webapp_create) command. Don't forget to replace _\<app_name>_ with a unique app name.

```azurecli-interactive
az webapp config container set --resource-group myResourceGroup --plan myAppServicePlan --name <app_name> --multicontainer-config-type kube --multicontainer-config-file https://raw.githubusercontent.com/Azure-Samples/multi-container/master/k8.yaml 

```


```json
[
  {
    "name": "DOCKER_CUSTOM_IMAGE_NAME",
    "value": "KUBE|YXBpVmVyc2lvbjogdjEKa2luZDogUG9kCm1ldGFkYXRhOgogIG5hbWU6IHNvbWUtd29yZHByZXNzCiAgbGFiZWxzOgogICAgbmFtZTogc29tZS13b3JkcHJlc3MKc3BlYzoKICBjb250YWluZXJzOgogICAgLSBpbWFnZTogd29yZHByZXNzCiAgICAgIG5hbWU6IHdvcmRwcmVzcwogICAgICBlbnY6CiAgICAgICAgLSBuYW1lOiAiV09SRFBSRVNTX0RCX1BBU1NXT1JEIgogICAgICAgICAgdmFsdWU6ICJteXNxbGRicGFzcyIKICAgIC0gaW1hZ2U6IG15c3FsNTcKICAgICAgbmFtZTogbXlzcWwKICAgICAgZW52OgogICAgICAgIC0gbmFtZTogIk1ZU1FMX1JPT1RfUEFTU1dPUkQiCiAgICAgICAgICB2YWx1ZTogIm15c3FsZGJwYXNzIgo="
  }
]
```
-->
[!INCLUDE [Clean-up section](../../../includes/cli-script-clean-up.md)]

In this tutorial, you learned how to:
> [!div class="checklist"]
> * Convert a Docker Compose configuration
> * Add application settings
> * Deploy multi-container app to Azure

## Next steps

> [!div class="nextstepaction"]
> [Use a custom Docker image for Web App for Containers](tutorial-custom-docker-image.md)
