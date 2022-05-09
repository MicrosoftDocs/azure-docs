---
title: How to start or stop an Azure Spring Cloud service instance
description: Describes how to start or stop an Azure Spring Cloud service instance
author: karlerickson
ms.author: wepa
ms.service: spring-cloud
ms.topic: how-to
ms.date: 11/04/2021
ms.custom: devx-track-java
---

# Start or stop your Azure Spring Cloud service instance

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to start or stop your Azure Spring Cloud service instance.

> [!NOTE]
> Stop and start is currently under preview and we do not recommend this feature for production.

Your applications running in Azure Spring Cloud may not need to run continuously - for example, if you have a service instance that's used only during business hours. At these times, Azure Spring Cloud may be idle, and running only the system components.

You can reduce the active footprint of Azure Spring Cloud by reducing the running instances and ensuring costs for compute resources are reduced.

To reduce your costs further, you can completely stop your Azure Spring Cloud service instance. All user apps and system components will be stopped. However, all your objects and network settings will be saved so you can restart your service instance and pick up right where you left off.

> [!NOTE]
> The state of a stopped Azure Spring Cloud service instance is preserved for up to 90 days during preview. If your cluster is stopped for more than 90 days, the cluster state cannot be recovered.
> The maximum stop time may change after preview.

You can only start, view, or delete a stopped Azure Spring Cloud service instance. You must start your service instance before performing any update operation, such as creating or scaling an app.

## Prerequisites

- An existing service instance in Azure Spring Cloud. To create a new service instance, see [Quickstart: Deploy your first application in Azure Spring Cloud](./quickstart.md).
- (Optional) [Azure CLI](/cli/azure/install-azure-cli) version 2.11.2 or later.

# [Portal](#tab/azure-portal)

## Stop a running instance

In the Azure portal, use the following steps to stop a running Azure Spring Cloud instance:

1. Go to the Azure Spring Cloud service overview page.
2. Select **Stop** to stop a running instance.

   :::image type="content" source="media/stop-start-service/spring-cloud-stop-service.png" alt-text="Screenshot of Azure portal showing the Azure Spring Cloud Overview page with the Stop button and Status value highlighted.":::

3. After the instance stops, the status will show **Succeeded (Stopped)**.

## Start a stopped instance

In the Azure portal, use the following steps to start a stopped Azure Spring Cloud instance:

1. Go to Azure Spring Cloud service overview page.
2. Select **Start** to start a stopped instance.

   :::image type="content" source="media/stop-start-service/spring-cloud-start-service.png" alt-text="Screenshot of Azure portal showing the Azure Spring Cloud Overview page with the Start button and Status value highlighted.":::

3. After the instance starts, the status will show **Succeeded (Running)**.

# [Azure CLI](#tab/azure-cli)

## Stop a running instance

With the Azure CLI, use the following command to stop a running Azure Spring Cloud instance:

```azurecli
az spring-cloud stop \
    --name <service-instance-name> \
    --resource-group <resource-group-name>
```

## Start a stopped instance

With the Azure CLI, use the following command to start a stopped Azure Spring Cloud instance:

```azurecli
az spring-cloud start \
    --name <service-instance-name> \
    --resource-group <resource-group-name>
```

## Check the power state

After the instance stops or starts, use the following command to check the power state:

```azurecli
az spring-cloud show \
    --name <service-instance-name> \
    --resource-group <resource-group-name>
```

---

## Next steps

* [Monitor app lifecycle events using Azure Activity log and Azure Service Health](./monitor-app-lifecycle-events.md)
* [Monitor usage and estimated costs in Azure Monitor](../azure-monitor/usage-estimated-costs.md)
