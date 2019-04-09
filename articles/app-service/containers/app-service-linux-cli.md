---
title: Manage Web App for Containers using Azure CLI - Azure App Service | Microsoft Docs
description: Manage Web App for Containers using Azure CLI.
keywords: azure app service, web app, cli, linux, oss
services: app-service
documentationCenter: ''
author: ahmedelnably
manager: cfowler
editor: ''

ms.assetid:
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/22/2017
ms.author: aelnably
ms.custom: seodec18

---
# Manage Web App for Containers using Azure CLI

Using the commands in this article you are able to create and manage a Web App for Containers using the Azure CLI.
You can start using the new version of the CLI in two ways:

* [Installing Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) on your machine.
* Using [Azure Cloud Shell (Preview)](../../cloud-shell/overview.md)

## Create a Linux App Service Plan

To create a Linux App Service Plan, you can use the following command:

```azurecli-interactive
az appservice plan create -n appname -g rgname --is-linux -l "South Central US" --sku S1 --number-of-workers 1
```

## Create a custom Docker container Web App

To create a web app and configuring it to run a custom Docker container, you can use the following command:

```azurecli-interactive
az webapp create -n sname -g rgname -p pname -i elnably/dockerimagetest
```

## Activate the Docker container logging

To activate the Docker container logging, you can use the following command:

```azurecli-interactive
az webapp log config -n sname -g rgname --web-server-logging filesystem
```

## Change the custom Docker container for an existing Web App for Containers App

To change a previously created app, from the current Docker image to a new image, you can use the following command:

```azurecli-interactive
az webapp config container set -n sname -g rgname -c apurvajo/mariohtml5
```

## Using Docker images from a private registry

You can configure your app to use images from a private registry. You need to provide the url for your registry, user name, and password. This can be achieved using the following command:

```azurecli-interactive
az webapp config container set -n sname1 -g rgname -c <container name> -r <server url> -u <username> -p <password>
```

## Enable continuous deployments for custom Docker images

With the following command you can enable the CD functionality, and get the webhook url. This url can be used to configure you DockerHub or Azure Container Registry repos.

```azurecli-interactive
az webapp deployment container config -n sname -g rgname -e true
```

## Create a Web App for Containers App using one of our built-in runtime frameworks

To create a PHP 5.6 Web App for Containers App that, you can use the following command.

```azurecli-interactive
az webapp create -n sname -g rgname -p pname -r "php|5.6"
```

## Change framework version for an existing Web App for Containers App

To change a previously created app, from the current framework version to Node.js 6.11, you can use the following command:

```azurecli-interactive
az webapp config set -n sname -g rgname --linux-fx-version "node|6.11"
```

## Set up Git deployments for your Web App

To set up Git deployments for your app, you can use the following command:

```azurecli-interactive
az webapp deployment source config -n sname -g rgname --repo-url <gitrepo url> --branch <branch>
```

## Next steps

* [What is Azure App Service on Linux?](app-service-linux-intro.md)
* [Install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli)
* [Azure Cloud Shell (Preview)](../../cloud-shell/overview.md)
* [Set up staging environments in Azure App Service](../../app-service/deploy-staging-slots.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json)
* [Continuous Deployment with Web App for Containers](app-service-linux-ci-cd.md)
