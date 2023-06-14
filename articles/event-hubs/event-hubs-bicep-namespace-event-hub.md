---
title: 'Quickstart: Create an event hub with consumer group using Bicep - Azure Event Hubs'
description: 'Quickstart: Create an Event Hubs namespace with an event hub and a consumer group using Bicep'
author: spelluru 
ms.topic: quickstart
ms.author: spelluru 
ms.custom: subject-armqs, mode-arm, devx-track-bicep
ms.date: 03/22/2022
---

# Quickstart: Create an event hub by using Bicep

Azure Event Hubs is a Big Data streaming platform and event ingestion service, capable of receiving and processing millions of events per second. Event Hubs can process and store events, data, or telemetry produced by distributed software and devices. Data sent to an event hub can be transformed and stored using any real-time analytics provider or batching/storage adapters. For detailed overview of Event Hubs, see [Event Hubs overview](event-hubs-about.md) and [Event Hubs features](event-hubs-features.md). In this quickstart, you create an event hub by using [Bicep](../azure-resource-manager/bicep/overview.md). You deploy a Bicep file to create a namespace of type [Event Hubs](./event-hubs-about.md), with one event hub.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/eventhubs-create-namespace-and-eventhub/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.eventhub/eventhubs-create-namespace-and-eventhub/main.bicep":::

The resources defined in the Bicep file include:

- [**Microsoft.EventHub/namespaces**](/azure/templates/microsoft.eventhub/namespaces)
- [**Microsoft.EventHub/namespaces/eventhubs**](/azure/templates/microsoft.eventhub/namespaces/eventhubs)

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters projectName=<project-name>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -projectName "<project-name>"
    ```

    ---

    > [!NOTE]
    > Replace **\<project-name\>** with a project name. It will be used to generate the Event Hubs name and the Namespace name.

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Validate the deployment

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

## Clean up resources

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the VM and all of the resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

In this article, you created an Event Hubs namespace and an event hub in the namespace using Bicep. For step-by-step instructions to send events to (or) receive events from an event hub, see the **Send and receive events** tutorials:

- [.NET Core](event-hubs-dotnet-standard-getstarted-send.md)
- [Java](event-hubs-java-get-started-send.md)
- [Python](event-hubs-python-get-started-send.md)
- [JavaScript](event-hubs-node-get-started-send.md)
- [Go](event-hubs-go-get-started-send.md)
- [C (send only)](event-hubs-c-getstarted-send.md)
- [Apache Storm (receive only)](event-hubs-storm-getstarted-receive.md)

[3]: ./media/event-hubs-quickstart-powershell/sender1.png
[4]: ./media/event-hubs-quickstart-powershell/receiver1.png
[5]: ./media/event-hubs-quickstart-powershell/metrics.png

[Understand the structure and syntax of Bicep files]: ../azure-resource-manager/bicep/file.md
[Deploy resources with Bicep and Azure PowerShell]: ../azure-resource-manager/bicep/deploy-powershell.md
[Deploy resource with Bicep and Azure CLI]: ../azure-resource-manager/bicep/deploy-cli.md
