---
title: How to Deploy Static File in Azure Spring Apps Enterprise Tier
titleSuffix: Azure Spring Apps Enterprise Tier
description: How to Deploy Static File in Azure Spring Apps Enterprise Tier
author: yilims
ms.author: yili7
ms.service: spring-apps
ms.topic: how-to
ms.date: 10/09/2022
ms.custom: event-tier1-build-2022
---

# How to deploy static file in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to deploy your static files to Azure Spring Apps Enterprise tier. The static files are served by web servers like Nginx or Apache HTTP Server

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise tier instance. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise tier](quickstart-deploy-apps-enterprise.md).
- One or more applications running in Azure Spring Apps. For more information on creating apps, see [How to Deploy Spring Boot applications from Azure CLI](./how-to-launch-from-source.md).
- [Azure CLI](/cli/azure/install-azure-cli), version 2.0.67 or higher.
- Your static files to be served by web servers such as Nginx or Apache HTTP Server.

## Deploy your static files

* To deploy the static files with the default server configuration generated automatically, select a web server to use: nginx or httpd, use the following command:

```azurecli
az spring app deploy
    --resource-group <your-resource-group-name> \
    --service <your-Azure-Spring-Apps-name> \
    --name <your-app-name> \
    --source-path <path-to-source-code>
    --build-env BP_WEB_SERVER=nginx
```

* To deploy the static files with customized server configuration file, see [Web server configuration restriction](#web-server-configuration-restriction):

```azurecli
az spring app deploy
    --resource-group <your-resource-group-name> \
    --service <your-Azure-Spring-Apps-name> \
    --name <your-app-name> \
    --source-path <path-to-source-code>
```
## Configure Web server
Use environment variables to configure the web server:

```azurecli
az spring app deploy
    --resource-group <your-resource-group-name> \
    --service <your-Azure-Spring-Apps-name> \
    --name <your-app-name> \
    --source-path <path-to-source-code>
    --build-env BP_WEB_SERVER=httpd BP_WEB_SERVER_ROOT=htdocs
```
Refer to [NGINX doc](https://docs.vmware.com/en/VMware-Tanzu-Buildpacks/services/tanzu-buildpacks/GUID-nginx-nginx-buildpack.html) and [HTTPD doc](https://docs.vmware.com/en/VMware-Tanzu-Buildpacks/services/tanzu-buildpacks/GUID-httpd-httpd-buildpack.html) for more environment variables.

## Customized server configuration file restriction
Your web server configuration must conform to the following restrictions:
- Your application must listen on port 8080. The service checks the port on TCP for readiness and liveness.

## Next steps

- [Azure Spring Apps](index.yml)
