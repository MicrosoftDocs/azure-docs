---
title: How to Start or Stop an Azure Spring Apps Service Instance
description: Describes how to start or stop an Azure Spring Apps service instance
author: KarlErickson
ms.author: wepa
ms.service: azure-spring-apps
ms.topic: how-to
ms.date: 06/27/2024
ms.custom: devx-track-java, devx-track-extended-java
---

# Start or stop your Azure Spring Apps service instance

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ❎ Standard consumption and dedicated (Preview) ✅ Basic/Standard ✅ Enterprise

This article shows you how to start or stop your Azure Spring Apps service instance.

Your applications running in Azure Spring Apps may not need to run continuously. For example, an application may not need to run continuously if you have a service instance that's used only during business hours. There may be times when Azure Spring Apps is idle and running only the system components.

You can reduce the active footprint of Azure Spring Apps by reducing the running instances, which reduces costs for compute resources. For more information, see [Start, stop, and delete an application in Azure Spring Apps](./how-to-start-stop-delete.md) and [Scale an application in Azure Spring Apps](./how-to-scale-manual.md).

To reduce your costs further, you can completely stop your Azure Spring Apps service instance. All user apps and system components are stopped. However, all your objects and network settings are saved so you can restart your service instance and pick up right where you left off.

## Limitations

The ability to stop and start your Azure Spring Apps service instance has the following limitations:

- You can stop and start your Azure Spring Apps service instance to help you save costs. However, stopping and then starting a service instance doesn't automatically fix system errors or recover invalid settings. For example, it can't recover from an invalid virtual network configuration.
- You can only start, view, or delete a stopped Azure Spring Apps service instance. You must start your service instance before performing any update operation, such as creating or scaling an app.
- The state of a stopped Azure Spring Apps service instance is preserved for up to 90 days. If the service instance is stopped for more than 90 days, you can't perform any operations on this instance except fetching settings or deleting it.
- If an Azure Spring Apps service instance is stopped or started successfully, you have to wait for at least 30 minutes to start or stop the instance again. However, if your last operation failed, you can try again without waiting.
- For virtual network instances, the start operation may fail due to invalid virtual network configurations. For more information, see [Customer responsibilities for running Azure Spring Apps in a virtual network](./vnet-customer-responsibilities.md).

## Prerequisites

- An existing service instance in Azure Spring Apps. To create a new service instance, see [Quickstart: Provision an Azure Spring Apps service instance](quickstart-provision-service-instance.md).
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

## Troubleshoot failed resource provisioning during startup

When you start a service instance, you might get an error message even if the `ProvisioningState` is `Succeeded`. This error message helps you identify the resources that failed to start or the settings that weren't applied.

You might receive an error message similar to the following example: `Failed to start the following resource(s) or apply setting(s): [<failed resource list>]. Please check and update them accordingly.`

The following list describes some common actions you can take to recover from these failures:

- Identify the failed resources: Refer to the `<failed resource list>` section in the error message to identify the resources that failed to start or the settings that failed to apply.
- Investigate and mitigate: Examine each listed resource, check failure logs if available, and make necessary mitigations. These mitigations could involve updating the specific resources that failed to start or reapplying the affected settings.

## Next steps

- [Monitor app lifecycle events using Azure Activity log and Azure Service Health](./monitor-app-lifecycle-events.md)
- [Azure Monitor cost and usage](/azure/azure-monitor/cost-usage)
