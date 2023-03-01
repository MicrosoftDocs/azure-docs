---
title: How to deploy large cpu & memory applications in Azure Spring Apps
description: Learn how to deploy large cpu & memory applications for Azure Spring Apps.
author: haital
ms.author: haital
ms.service: spring-apps
ms.topic: how-to
ms.date: 02/28/2023
ms.custom: devx-track-java, devx-track-azurecli
---

# Deploy large cpu & memory applications in Azure Spring Apps

**This article applies to:** ✔️ Enterprise tier

This article shows you how to deploy large cpu & memory applications in Azure Spring Apps. Currently, support for large app is only available in Enterprise tier, and the following cpu & memory combinations are supported.

| cpu (cores) | memory (Gi) |
| ----------- | ----------- |
| 4           | 16          |
| 6           | 24          |
| 8           | 32          |


## Prerequisites

- An Azure Spring Apps service instance.
- [The Azure CLI](/cli/azure/install-azure-cli).

## Create large cpu & memory application


### [Azure portal](#tab/azure-portal)

Use the following steps to create a large cpu & memory application.

1. Navigate to the **Apps** tab, and click **Create app** button
1. Choose **vCpu** and **Memory** for your application
1. Input **App name** and other configs
1. Click  **Create** button
   :::image type="content" source="media/how-to-create-large-application/create-large-application.jpg" lightbox="media/how-to-create-large-application/create-large-application.jpg" alt-text="Screenshot of Azure portal Configuration page showing how to create large app.":::

### [Azure CLI](#tab/azure-cli)

To create a large cpu & memory application, you can use the following CLI command.

```azurecli
az spring app create -g <resource-group-name> -s <service-name> -n <app-name> \
    --cpu 8 --memory 32Gi  
```
This command creates an app with cpu set to 8 core and memory set to 32 Gi.

---

## Scale up/down for large cpu & memory application


### [Azure portal](#tab/azure-portal)

Use the following steps to scale up/down a large cpu & memory application.

1. Navigate to the **Apps** tab, and then select the app you want to scale
1. Navigate to the **Scale up** blade
1. Choose a new **vCpu** and **Memory** value for your application
1. Click  **Save** button
   :::image type="content" source="media/how-to-create-large-application/scale-large-application.jpg" lightbox="media/how-to-create-large-application/scale-large-application.jpg" alt-text="Screenshot of Azure portal Configuration page showing how to scale large app.":::


### [Azure CLI](#tab/azure-cli)

To scale up an application to use large cpu & memory, you can use the following CLI command.

```azurecli
az spring app scale -g <resource-group-name> -s <service-name> -n <app-name> \
    --cpu 8 --memory 32Gi  
```
This command scales up an app to use 8 core cpu and 32 Gi memory.

Similarly, you can scale down a large app using the following CLI command.
```azurecli
az spring app scale -g <resource-group-name> -s <service-name> -n <app-name> \
    --cpu 1 --memory 2Gi  
```
This command scales down a large app to use 1 core cpu and 2 Gi memory.


## Next steps
- [Build and deploy apps to Azure Spring Apps](https://docs.microsoft.com/en-us/azure/spring-apps/quickstart-deploy-apps)
- [Scale an application in Azure Spring Apps](https://docs.microsoft.com/en-us/azure/spring-apps/how-to-scale-manual)