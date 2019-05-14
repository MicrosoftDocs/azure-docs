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

In the Azure Cloud Shell, configure deployment credentials with the [`az webapp deployment user set`](/cli/azure/webapp/deployment/user?view=azure-cli-latest#az-webapp-deployment-user-set) command. This deployment user is required for FTP and local Git deployment to a web app. The username and password are account level. _They're different from your Azure subscription credentials._

In the following example, replace *\<username>* and *\<password>*, including the brackets, with a new username and password. The username must be unique within Azure. The password must be at least eight characters long, with two of the following three elements: letters, numbers, and symbols. 

```azurecli-interactive
az webapp deployment user set --user-name <username> --password <password>
```

You get a JSON output with the password shown as `null`. If you get a `'Conflict'. Details: 409` error, change the username. If you get a `'Bad Request'. Details: 400` error, use a stronger password. The deployment username must not contain ‘@’ symbol for local Git pushes.

You configure this deployment user only once. You can use it for all your Azure deployments.

> [!NOTE]
> Record the username and password. You need them to deploy the web app later.
>
>
