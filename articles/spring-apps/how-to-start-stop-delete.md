---
title: Start, stop, and delete an application in Azure Spring Apps
description: Need to start, stop, or delete your Azure Spring Apps application? Learn how to manage the state of an Azure Spring Apps application.
author: KarlErickson
ms.service: spring-apps
ms.topic: how-to
ms.date: 01/10/2023
ms.author: karler
ms.custom: devx-track-java, devx-track-extended-java, event-tier1-build-2022, engagement-fy23
---

# Start, stop, and delete an application in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This guide explains how to change an application's state in Azure Spring Apps by using either the Azure portal or the Azure CLI.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- A deployed Azure Spring Apps service instance. Follow the [quickstart on deploying an app via the Azure CLI](./quickstart.md) to get started.
- At least one application already created in your service instance.

## Application state

Your applications running in Azure Spring Apps may not need to run continuously. For example, an application may not always need to run if it's only used during business hours.

There may be times where you wish to stop or start an application. You can also restart an application as part of general troubleshooting steps or delete an application you no longer require.

## Manage application state

After you deploy an application, you can start, stop, and delete it by using the [Azure portal](https://portal.azure.com) or [Azure CLI](/cli/azure/).

### [Azure portal](#tab/azure-portal)

1. Go to your Azure Spring Apps service instance in the [Azure portal](https://portal.azure.com).

1. Select **Application Dashboard**.

1. Select the application whose state you want to change.

1. On the **Overview** page for that application, select **Start/Stop**, **Restart**, or **Delete**.

   :::image type="content" source="media/how-to-start-stop-delete/how-to-start-stop-delete.png" alt-text="Screenshot of Azure portal showing the Overview page of the demo app." lightbox="media/how-to-start-stop-delete/how-to-start-stop-delete.png":::

### [Azure CLI](#tab/azure-cli)

> [!NOTE]
> You can use optional parameters and configure defaults with the Azure CLI. Learn more about the Azure CLI by reading the [az spring](/cli/azure/spring) reference documentation.

1. First, use the following command to install the Azure Spring Apps extension for Azure CLI:

   ```azurecli-interactive
   az extension add --name spring
   ```

1. Next, perform any of the following Azure CLI operations:

   - Start your application:

     ```azurecli-interactive
     az spring app start \
         --resource-group <resource-group-name> \
         --service <Azure-Spring-Apps-instance-name> \
         --name <application-name>
     ```

   - Stop your application:

     ```azurecli
     az spring app stop \
         --resource-group <resource-group-name> \
         --service <Azure-Spring-Apps-instance-name> \
         --name <application-name>
     ```

   - Restart your application:

     ```azurecli
     az spring app restart \
         --resource-group <resource-group-name> \
         --service <Azure-Spring-Apps-instance-name> \
         --name <application-name>
     ```

   - Delete your application:

     ```azurecli
     az spring app delete \
         --resource-group <resource-group-name> \
         --service <Azure-Spring-Apps-instance-name> \
         --name <application-name>
     ```

---

## Next steps

> [!div class="nextstepaction"]
> [Start or stop your Azure Spring Apps service instance](how-to-start-stop-service.md)
