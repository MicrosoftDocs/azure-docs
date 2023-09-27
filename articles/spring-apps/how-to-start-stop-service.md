---
title: How to start or stop an Azure Spring Apps service instance
description: Describes how to start or stop an Azure Spring Apps service instance
author: KarlErickson
ms.author: wepa
ms.service: spring-apps
ms.topic: how-to
ms.date: 11/04/2021
ms.custom: devx-track-java, devx-track-extended-java, event-tier1-build-2022
---

# Start or stop your Azure Spring Apps service instance

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Standard consumption and dedicated (Preview) ✔️ Basic/Standard ✔️ Enterprise

This article shows you how to start or stop your Azure Spring Apps service instance.

Your applications running in Azure Spring Apps may not need to run continuously. For example, an application may not need to run continuously if you have a service instance that's used only during business hours. There may be times when Azure Spring Apps is idle and running only the system components.

You can reduce the active footprint of Azure Spring Apps by reducing the running instances, which reduces costs for compute resources. For more information, see [Start, stop, and delete an application in Azure Spring Apps](./how-to-start-stop-delete.md) and [Scale an application in Azure Spring Apps](./how-to-scale-manual.md).

To reduce your costs further, you can completely stop your Azure Spring Apps service instance. All user apps and system components are stopped. However, all your objects and network settings are saved so you can restart your service instance and pick up right where you left off.

## Limitations

The ability to stop and start your Azure Spring Apps service instance has the following limitations:

- You can stop and start your Azure Spring Apps service instance to help you save costs. However, you shouldn't stop and start a running instance for service recovery - for example, to recover from an invalid virtual network configuration.
- The state of a stopped Azure Spring Apps service instance is preserved for up to 90 days. If your cluster is stopped for more than 90 days, you can't recover the cluster state.
- You can only start, view, or delete a stopped Azure Spring Apps service instance. You must start your service instance before performing any update operation, such as creating or scaling an app.
- If an Azure Spring Apps service instance has been stopped or started successfully, you have to wait for at least 30 minutes to start or stop the instance again. However, if your last operation failed, you can try again to start or stop without having to wait.
- For virtual network instances, the start operation may fail due to invalid virtual network configurations. For more information, see [Customer responsibilities for running Azure Spring Apps in a virtual network](./vnet-customer-responsibilities.md).

## Prerequisites

- An existing service instance in Azure Spring Apps. To create a new service instance, see [Quickstart: Provision an Azure Spring Apps service instance](./quickstart-provision-service-instance.md).
- (Optional) [Azure CLI](/cli/azure/install-azure-cli) version 2.45.0 or later.

## [Portal](#tab/azure-portal)

## Stop a running instance

In the Azure portal, use the following steps to stop a running Azure Spring Apps instance:

1. Go to the Azure Spring Apps service overview page.

1. Select **Stop** to stop a running instance.

   :::image type="content" source="media/how-to-start-stop-service/spring-cloud-stop-service.png" alt-text="Screenshot of Azure portal showing the Azure Spring Apps Overview page with the Stop button and Status value highlighted.":::

1. After the instance stops, the status shows **Succeeded (Stopped)**.

## Start a stopped instance

In the Azure portal, use the following steps to start a stopped Azure Spring Apps instance:

1. Go to Azure Spring Apps service overview page.

1. Select **Start** to start a stopped instance.

   :::image type="content" source="media/how-to-start-stop-service/spring-cloud-start-service.png" alt-text="Screenshot of Azure portal showing the Azure Spring Apps Overview page with the Start button and Status value highlighted.":::

1. After the instance starts, the status shows **Succeeded (Running)**.

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
- [Azure Monitor cost and usage](../azure-monitor/usage-estimated-costs.md)
