---
title: Quickstart - Use the Azure CLI to create a Service Bus queue | Microsoft Docs
description: In this quickstart, you learn how to use the Azure CLI to create a Service Bus namespace and then a queue in that namespace.
author: spelluru
ms.topic: quickstart
ms.date: 09/28/2021
ms.author: spelluru
ms.custom: mode-api, devx-track-azurecli 
ms.devlang: azurecli
---

# Use the Azure CLI to create a Service Bus namespace and a queue
This quickstart shows you how to create a Service Bus namespace and a queue using the Azure CLI. It also shows you how to get authorization credentials that a client application can use to send/receive messages to/from the queue. 

[!INCLUDE [howto-service-bus-queues](../../includes/howto-service-bus-queues.md)]

## Prerequisites
If you don't have an Azure subscription, you can create a [free account][free account] before you begin.

In this quickstart, you use Azure Cloud Shell that you can launch after signing in to the Azure portal. For details about Azure Cloud Shell, see [Overview of Azure Cloud Shell](../cloud-shell/overview.md). You can also [install](/cli/azure/install-azure-cli) and use Azure PowerShell on your machine. 

## Provision resources
1. Sign in to the [Azure portal](https://portal.azure.com).
2. Launch Azure Cloud Shell by selecting the icon shown in the following image. Switch to **Bash** mode if the Cloud Shell is in **PowerShell** mode. 

    :::image type="content" source="./media/service-bus-quickstart-powershell/launch-cloud-shell.png" alt-text="Launch Cloud Shell":::
3. Run the following command to create an Azure resource group. Update the resource group name and the location if you want. 

    ```azurecli-interactive
    az group create --name ContosoRG --location eastus
    ```
4. Run the following command to create a Service Bus messaging namespace.

    ```azurecli-interactive
    az servicebus namespace create --resource-group ContosoRG --name ContosoSBusNS --location eastus
    ```
5. Run the following command to create a queue in the namespace you created in the previous step. In this example, `ContosoRG` is the resource group you created in the previous step. `ContosoSBusNS` is the name of the Service Bus namespace created in that resource group. 

    ```azurecli-interactive
    az servicebus queue create --resource-group ContosoRG --namespace-name ContosoSBusNS --name ContosoOrdersQueue
    ```
6. Run the following command to get the primary connection string for the namespace. You use this connection string to connect to the queue and send and receive messages. 

    ```azurecli-interactive
    az servicebus namespace authorization-rule keys list --resource-group ContosoRG --namespace-name ContosoSBusNS --name RootManageSharedAccessKey --query primaryConnectionString --output tsv    
    ```

    Note down the connection string and the queue name. You use them to send and receive messages. 


## Next steps
In this article, you created a Service Bus namespace and a queue in the namespace. To learn how to send/receive messages to/from the queue, see one of the following quickstarts in the **Send and receive messages** section. 

- [.NET](service-bus-dotnet-get-started-with-queues.md)
- [Java](service-bus-java-how-to-use-queues.md)
- [JavaScript](service-bus-nodejs-how-to-use-queues.md)
- [Python](service-bus-python-how-to-use-queues.md)
- [PHP](service-bus-php-how-to-use-queues.md)

[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
