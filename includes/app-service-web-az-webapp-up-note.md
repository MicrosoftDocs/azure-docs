---
title: "include file"
description: "include file"
services: app-service
author: msangapu
ms.service: app-service
ms.topic: "include"
ms.date: 09/14/2021
ms.author: msangapu
ms.custom: "include file"
---

> [!NOTE]
> The `az webapp up` command does the following actions:
>
>- Create a default [resource group](/cli/azure/group#az-group-create).
>
>- Create a default [App Service plan](/cli/azure/appservice/plan#az-appservice-plan-create).
>
>- [Create an app](/cli/azure/webapp#az-webapp-create) with the specified name.
>
>- [Zip deploy](../articles/app-service/deploy-zip.md#deploy-a-zip-package) all files from the current working directory, [with build automation enabled](../articles/app-service/deploy-zip.md#enable-build-automation-for-zip-deploy).
>
>- Cache the parameters locally in the *.azure/config* file so that you don't need to specify them again when deploying later with `az webapp up` or other `az webapp` commands from the project folder. The cached values are used automatically by default.
>