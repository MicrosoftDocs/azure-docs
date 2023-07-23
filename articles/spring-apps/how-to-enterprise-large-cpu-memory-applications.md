---
title: How to deploy large CPU and memory applications in Azure Spring Apps in the Enterprise plan
description: Learn how to deploy large CPU and memory applications in the Enterprise plan for Azure Spring Apps.
author: KarlErickson
ms.author: haital
ms.service: spring-apps
ms.topic: how-to
ms.date: 03/17/2023
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli
---

# Deploy large CPU and memory applications in Azure Spring Apps in the Enterprise plan

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This article shows how to deploy large CPU and memory applications in Azure Spring Apps to support CPU intensive or memory intensive workloads. Support for large applications is currently available only in the Enterprise plan, which supports the CPU and memory combinations as shown in the following table.

| CPU (cores) | Memory (GB) |
| ----------- | ----------- |
| 4           | 16          |
| 6           | 24          |
| 8           | 32          |

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- An Azure Spring Apps service instance. For more information, see [Quickstart: Provision an Azure Spring Apps service instance](quickstart-provision-service-instance.md).
- The [Azure CLI](/cli/azure/install-azure-cli). Install the Azure Spring Apps extension with the following command: `az extension add --name spring`.

## Create a large CPU and memory application

You can use the Azure portal or the Azure CLI to create applications.

### [Azure portal](#tab/azure-portal)

Use the following steps to create a large CPU and memory application using the Azure portal.

1. Go to your Azure Spring Apps service instance.

1. In the navigation pane, select **Apps**, and then select **Create app**.

1. On the **Create App** page, provide a name for **App name** and select the desired **vCpu** and **Memory** values for your application.

1. Select  **Create**.

   :::image type="content" source="media/how-to-enterprise-large-cpu-memory-applications/create-large-application.png" lightbox="media/how-to-enterprise-large-cpu-memory-applications/create-large-application.png" alt-text="Screenshot of the Azure portal Create App page in Azure Spring Apps showing configuration settings for a new app.":::

### [Azure CLI](#tab/azure-cli)

The following command creates an application with the CPU set to eight core processors and memory set to 32 gigabytes.

```azurecli
az spring app create \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name> \
    --name <Spring-app-name> \
    --cpu 8 \
    --memory 32Gi 
```

---

## Scale up and down for large CPU and memory applications

To adjust your application's CPU and memory settings, you can use the Azure portal or Azure CLI commands.

### [Azure portal](#tab/azure-portal)

Use the following steps to scale up or down a large CPU and memory application.

1. On the overview page of your app, select **Scale up** in the navigation pane.

1. Select the preferred **vCpu** and **Memory** values.

   :::image type="content" source="media/how-to-enterprise-large-cpu-memory-applications/scale-large-application.png" lightbox="media/how-to-enterprise-large-cpu-memory-applications/scale-large-application.png" alt-text="Screenshot of Azure portal Configuration page showing how to scale large app.":::

1. Select **Save**.

### [Azure CLI](#tab/azure-cli)

The following command scales up an app to have high CPU and memory values.

```azurecli
az spring app scale \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name> \
    --name <Spring-app-name> \
    --cpu 8 \
    --memory 32Gi 
```

The following command scales down an app to have low CPU and memory values.

```azurecli
az spring app scale \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name> \
    --name <Spring-app-name> \
    --cpu 1 \
    --memory 2Gi 
```

---

## Next steps

- [Build and deploy apps to Azure Spring Apps](quickstart-deploy-apps.md)
- [Scale an application in Azure Spring Apps](how-to-scale-manual.md)
