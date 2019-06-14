---
title: "include file"
description: "include file"
services: app-service
author: cephalin
ms.service: app-service
ms.topic: "include"
ms.date: 06/14/2019
ms.author: cephalin
ms.custom: "include file"
---

FTP and local Git can deploy to a web app by using a *deployment user*. The deployment username and password are account level, and are different from your Azure subscription credentials. You configure this deployment user only once, and can use it for all your Azure deployments.

To use Azure Cloud Shell to configure your deployment user credentials, run the following [az webapp deployment user set](/cli/azure/webapp/deployment/user?view=azure-cli-latest#az-webapp-deployment-user-set) command. Replace \<username> and \<password> with your new username and password.

- The username must be unique within Azure, and for local Git pushes, must not contain the ‘@’ symbol. 
  
- The password must be at least eight characters long, with two of the following three elements: letters, numbers, and symbols. 

```azurecli-interactive
az webapp deployment user set --user-name <username> --password <password>
```

You get a JSON output with the password shown as `null`. If you get a `'Conflict'. Details: 409` error, change the username. If you get a `'Bad Request'. Details: 400` error, use a stronger password. 

Record your username and password to use to deploy your web apps later.
>
> [!NOTE]
> Instead of using account-level deployment user credentials, you can deploy with app-level credentials, which Azure App Service automatically generates for each app. 

