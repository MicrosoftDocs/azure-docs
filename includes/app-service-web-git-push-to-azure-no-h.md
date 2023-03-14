---
title: "include file"
description: "include file"
services: app-service
author: cephalin
ms.service: app-service
ms.topic: "include"
ms.date: 02/02/2018
ms.author: cephalin
ms.custom: "include file"
---

1. Since you're deploying the `main` branch, you need to set the default deployment branch for your App Service app to `main` (see [Change deployment branch](../articles/app-service/deploy-local-git.md#change-deployment-branch)). In the Cloud Shell, set the `DEPLOYMENT_BRANCH` app setting with the [`az webapp config appsettings set`](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set) command. 

    ```azurecli-interactive
    az webapp config appsettings set --name <app-name> --resource-group myResourceGroup --settings DEPLOYMENT_BRANCH='main'
    ```

1. Back in the local terminal window, add an Azure remote to your local Git repository. Replace *\<deploymentLocalGitUrl-from-create-step>* with the URL of the Git remote that you saved from [Create a web app](#create-a-web-app).

    ```bash
    git remote add azure <deploymentLocalGitUrl-from-create-step>
    ```

1. Push to the Azure remote to deploy your app with the following command. When Git Credential Manager prompts you for credentials, make sure you enter the credentials you created in **Configure a deployment user**, not the credentials you use to sign in to the Azure portal.

    ```bash
    git push azure main
    ```

    This command may take a few minutes to run. While running, it displays information similar to the following example:
