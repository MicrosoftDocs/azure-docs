---
title: "include file"
description: "include file"
services: app-service
author: cephalin
ms.service: azure-app-service
ms.topic: include
ms.date: 03/29/2019
ms.author: cephalin
ms.custom: "include file"
---

If you want to open a direct SSH session with your container, your app should be running.

Use the [az webapp ssh](/cli/azure/webapp#az-webapp-ssh) command.

If you're not authenticated, you need to authenticate with your Azure subscription to connect. When you're authenticated, you see an in-browser shell where you can run commands inside your container.

![SSH connection](./media/app-service-web-ssh-connect-no-h/app-service-linux-ssh-connection.png)
