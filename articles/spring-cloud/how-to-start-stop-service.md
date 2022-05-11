---
title: How to start or stop an Azure Spring Apps service instance
description: Describes how to start or stop an Azure Spring Apps service instance
author: karlerickson
ms.author: wepa
ms.service: spring-cloud
ms.topic: how-to
ms.date: 11/04/2021
ms.custom: devx-track-java
---

# Start or stop your Azure Spring Apps service instance

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to start or stop your Azure Spring Apps service instance.

> [!NOTE]
> Stop and start is currently under preview and we do not recommend this feature for production.

Your applications running in Azure Spring Apps may not need to run continuously - for example, if you have a service instance that's used only during business hours. At these times, Azure Spring Apps may be idle, and running only the system components.

You can reduce the active footprint of Azure Spring Apps by reducing the running instances and ensuring costs for compute resources are reduced.

To reduce your costs further, you can completely stop your Azure Spring Apps service instance. All user apps and system components will be stopped. However, all your objects and network settings will be saved so you can restart your service instance and pick up right where you left off.

> [!NOTE]
> The state of a stopped Azure Spring Apps service instance is preserved for up to 90 days during preview. If your cluster is stopped for more than 90 days, the cluster state cannot be recovered.
> The maximum stop time may change after preview.

You can only start, view, or delete a stopped Azure Spring Apps service instance. You must start your service instance before performing any update operation, such as creating or scaling an app.

## Prerequisites

- An existing service instance in Azure Spring Apps. To create a new service instance, see [Quickstart: Deploy your first application in Azure Spring Apps](./quickstart.md).
- (Optional) [Azure CLI](/cli/azure/install-azure-cli) version 2.11.2 or later.

## [Portal](#tab/azure-portal)

## Stop a running instance

In the Azure portal, use the following steps to stop a running Azure Spring Apps instance:

1. Go to the Azure Spring Apps service overview page.
2. Select **Stop** to stop a running instance.

   :::image type="content" source="media/stop-start-service/spring-cloud-stop-service.png" alt-text="Screenshot of Azure portal showing the Azure Spring Apps Overview page with the Stop button and Status value highlighted.":::

3. After the instance stops, the status will show **Succeeded (Stopped)**.

## Start a stopped instance

In the Azure portal, use the following steps to start a stopped Azure Spring Apps instance:

1. Go to Azure Spring Apps service overview page.
2. Select **Start** to start a stopped instance.

   :::image type="content" source="media/stop-start-service/spring-cloud-start-service.png" alt-text="Screenshot of Azure portal showing the Azure Spring Apps Overview page with the Start button and Status value highlighted.":::

3. After the instance starts, the status will show **Succeeded (Running)**.

## [Azure CLI](#tab/azure-cli)

## Stop a running instance

With the Azure CLI, use the following command to stop a running Azure Spring Apps instance:

```azurecli
az spring stop \
    --name <service-instance-name> \
    --resource-group <resource-group-name>
```

## Start a stopped instance

With the Azure CLI, use the following command to start a stopped Azure Spring Apps instance:

```azurecli
az spring start \
    --name <service-instance-name> \
    --resource-group <resource-group-name>
```

## Check the power state

After the instance stops or starts, use the following command to check the power state:

```azurecli
az spring show \
    --name <service-instance-name> \
    --resource-group <resource-group-name>
```

---

## Next steps

- [Monitor app lifecycle events using Azure Activity log and Azure Service Health](./monitor-app-lifecycle-events.md)
- [Monitor usage and estimated costs in Azure Monitor](../azure-monitor/usage-estimated-costs.md)
