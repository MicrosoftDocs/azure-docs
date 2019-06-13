---
title: "include file"
description: "include file"
services: app-service
author: cephalin
ms.service: app-service
ms.topic: "include"
ms.date: 06/13/2019
ms.author: cephalin
ms.custom: "include file"
---

FTP and local Git deployment to a web app require a *deployment user*. The deployment username and password are account level, and are different from your Azure subscription credentials. You configure this deployment user only once. You can use it for all your Azure deployments.

In the Azure Cloud Shell, configure your deployment credentials with the [az webapp deployment user set](/cli/azure/webapp/deployment/user?view=azure-cli-latest#az-webapp-deployment-user-set) command. Replace \<username> and \<password> in the following command with your new username and password. 
- The username must be unique within Azure, and for local Git pushes, must not contain the ‘@’ symbol. 
  
- The password must be at least eight characters long, with two of the following three elements: letters, numbers, and symbols. 

```azurecli-interactive
az webapp deployment user set --user-name <username> --password <password>
```

You get a JSON output with the password shown as `null`. If you get a `'Conflict'. Details: 409` error, change the username. If you get a `'Bad Request'. Details: 400` error, use a stronger password. 

> [!NOTE]
> Record your username and password. You need them to deploy your web app later.
>
