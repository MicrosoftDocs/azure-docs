---
title: How to start or stop a service in Azure Spring Cloud
titleSuffix: Azure Spring Cloud
description: Start or stop a service.
author: karlerickson
ms.author: wepa
ms.service: spring-cloud
ms.topic: how-to
ms.date: 10/26/2021
ms.custom: devx-track-java
---

# Start or stop your service in Azure Spring Cloud
This article shows you how to start or stop your service in Azure Spring Cloud.

## Overview

Your applications running in Azure Spring Cloud may not need to run continuously. For example, if you have a service instance that's used only during business hours. At these times, Azure Spring Cloud may be idle and running only the system components.

You can reduce the active footprint of Azure Spring Cloud by reducing the running instances and ensuring costs for compute resources are reduced. 

To reduce your costs further, you can completely stop your Azure Spring Cloud service instance. All user apps and system components will be stopped, but all your objects and network settings will be saved. This will allow you to restart your service instance and pick up right where you left off.

## Limitations

When using the cluster start/stop feature, the following restrictions apply:
- The state of a stopped Azure Spring Cloud service instance is preserved for up to 90 days during preview. If your cluster is stopped for more than 90 days, the cluster state cannot be recovered. 
- You can only start, view, or delete a stopped Azure Spring Cloud service instance. You must start your service instance before performing any update operation, such as creating or scaling an app.


> [!NOTE]
> Stop and start is currently under preview. The maximum stop time may or may not change after preview.

## Prerequisites

- You already have an existing service instance in Azure Spring Cloud. See [Quickstart: Deploy your first application in Azure Spring Cloud](./quickstart.md) to create a new service instance.

## Start or stop an Azure Spring Cloud instance

You can start and stop Azure Spring Cloud service instances using the [Azure portal](https://portal.azure.com) or Azure CLI.

#### [Portal](#tab/azure-portal)

## Stop a running instance
1. Go to the Azure Spring Cloud service overview page.
1. Click the **Stop** button to stop a running instance.

    ![Stop the Azure Spring Cloud service with the Stop button](./media/stop-start-service/spring-cloud-stop-service.png)

1. After the instance is stopped successfully, the status will show *Succeeded(Stopped)*.

## Start a stopped instance
1. Go to Azure Spring Cloud service overview page.
2. Click the **Start** button to start a stopped instance.

    ![Start the Azure Spring Cloud service with the Start button](./media/stop-start-service/spring-cloud-start-service.png)

3. After the instance is started successfully, the status will show *Succeeded(Running)*.

#### [Azure CLI](#tab/azure-cli)

## Stop a running instance
Use the following command to stop a running Azure Spring Cloud instance:
```azurecli-interactive
az spring-cloud stop --name <service instance name> --resource-group <resource group name> [--no-wait]
```

## Start a stopped instance
Use the following command to start a stopped Azure Spring Cloud instance:
```azurecli-interactive
az spring-cloud start --name <service instance name> --resource-group <resource group name> [--no-wait]
```
## Check the power state
After the instance is stopped or started successfully, use the following command to check the power state:
```azurecli-interactive
az spring-cloud show --name <service instance name> --resource-group <resource group name>
```
---

## Next steps
* [Monitor app lifecycle events using Azure Activity log and Azure Service Health](./monitor-app-lifecycle-events.md)
* [Monitor usage and estimated costs in Azure Monitor](../azure-monitor/usage-estimated-costs.md)