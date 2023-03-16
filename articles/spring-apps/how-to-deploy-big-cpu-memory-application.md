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

This article shows how to deploy large CPU and memory applications in Azure Spring Apps to support CPU intensive or memory intensive workloads. Support for large applications is currently only available in the Enterprise tier, which supports the following CPU and memory combinations.

| CPU (core processors) | Memory (gigabytes) |
| ----------- | ----------- |
| 4           | 16          |
| 6           | 24          |
| 8           | 32          |

## Prerequisites

- An Azure Spring Apps service instance.
- [The Azure CLI](/cli/azure/install-azure-cli).

## Create a large CPU and memory application

You can use the Azure portal or the Azure CLI to create applications.

### [Azure portal](#tab/azure-portal)

Use the following steps to create a large CPU and memory application using the Azure portal.

1. Go to your service instance of Azure Spring Apps.

1. In the navigation pane, select **Apps**  and then select **Create app**.

1. On the **Create App** page, provide a name for **App name** and select the desired **vCpu** and **Memory** setting for your application.

1. Select  **Create**.

   :::image type="content" source="media/how-to-create-large-application/create-large-application.png" lightbox="media/how-to-create-large-application/create-large-application.png" alt-text="Screenshot of the Azure portal Create App page in Azure Spring Apps showing configuration settings for a new app.":::

### [Azure CLI](#tab/azure-cli)

The following command creates an application with the CPU set to eight core processors and memory set to 32 gigabytes.

```azurecli
az spring app create -g <resource-group-name> -s <service-name> -n <app-name> \
    --cpu 8 --memory 32Gi  
```

---

## Scale up and down for large CPU and memory applications

To adjust your application's CPU and memory settings, you can use the Azure portal or Azure CLI commands.

### [Azure portal](#tab/azure-portal)

Use the following steps to scale up or down a large CPU and memory application.

1. On the overview page of your app, select **Scale up** in the navigation pane.

1. Select the preferred **vCpu** and **Memory** values.

   :::image type="content" source="media/how-to-create-large-application/scale-large-application.png" lightbox="media/how-to-create-large-application/scale-large-application.png" alt-text="Screenshot of Azure portal Configuration page showing how to scale large app.":::

### [Azure CLI](#tab/azure-cli)

The following command scales up an app to have a high CPU and memory values.

```azurecli
az spring app scale -g <resource-group-name> -s <service-name> -n <app-name> \
    --cpu 8 --memory 32Gi  
```

The following command scales down an app to have a low CPU and memory values.

```azurecli
az spring app scale -g <resource-group-name> -s <service-name> -n <app-name> \
    --cpu 1 --memory 2Gi  
```

---

## Next steps

- [Build and deploy apps to Azure Spring Apps](/azure/spring-apps/quickstart-deploy-apps)

- [Scale an application in Azure Spring Apps](/azure/spring-apps/how-to-scale-manual)
