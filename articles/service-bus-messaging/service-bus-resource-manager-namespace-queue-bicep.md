---
title: Create Azure Service Bus namespace and queue using Bicep
description: 'Quickstart: Create a Service Bus namespace and a queue using Bicep'
documentationcenter: .net
author: spelluru
ms.author: spelluru
ms.date: 08/24/2022
ms.topic: quickstart
ms.tgt_pltfrm: dotnet
ms.custom: subject-bicepqs, mode-arm, devx-track-bicep
---

# Quickstart: Create a Service Bus namespace and a queue using a Bicep file

This article shows how to use a Bicep file that creates a Service Bus namespace and a queue within that namespace. The article explains how to specify which resources are deployed and how to define parameters that are specified when the deployment is executed. You can use this Bicep file for your own deployments, or customize it to meet your requirements.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/servicebus-create-queue/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.servicebus/servicebus-create-queue/main.bicep":::

The resources defined in the Bicep file include:

- [**Microsoft.ServiceBus/namespaces**](/azure/templates/microsoft.servicebus/namespaces?pivots=deployment-language-bicep)
- [**Microsoft.ServiceBus/namespaces/queues**](/azure/templates/microsoft.servicebus/namespaces/queues?pivots=deployment-language-bicep)

> [!NOTE]
> The following ARM templates are available for download and deployment.
>
> - [Create a Service Bus namespace with queue and authorization rule](service-bus-resource-manager-namespace-auth-rule.md)
> - [Create a Service Bus namespace with topic and subscription](service-bus-resource-manager-namespace-topic.md)
> - [Create a Service Bus namespace](service-bus-resource-manager-namespace.md)
> - [Create a Service Bus namespace with topic, subscription, and rule](service-bus-resource-manager-namespace-topic-with-rule.md)

You can find more Bicep/ARM templates from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Servicebus&pageNumber=1&sort=Popular)

## Deploy the Bicep file

With this Bicep file, you deploy a Service Bus namespace with a queue.

[Service Bus queues](service-bus-queues-topics-subscriptions.md#queues) offer First In, First Out (FIFO) message delivery to one or more competing consumers.

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep
    ```

    ---

    You will be prompted to enter the following parameter values:

    - **serviceBusNamespaceName**: Name of the Service Bus namespace.
    - **serviceBusQueueName**: Name of the Queue.

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

See the following topic that shows how to create an authorization rule for the namespace/queue:

[Create a Service Bus authorization rule for namespace and queue using an ARM template](service-bus-resource-manager-namespace-auth-rule.md)

Learn how to manage these resources by viewing these articles:

* [Manage Service Bus with PowerShell](service-bus-manage-with-ps.md)
* [Manage Service Bus resources with the Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer/releases)

[Authoring Azure Resource Manager templates]: ../azure-resource-manager/templates/syntax.md
[Service Bus namespace and queue template]: https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.servicebus/servicebus-create-queue/azuredeploy.json/
[Azure Quickstart Templates]: https://azure.microsoft.com/resources/templates/?term=service+bus
[Learn more about Service Bus queues]: service-bus-queues-topics-subscriptions.md
[Using Azure PowerShell with Azure Resource Manager]: ../azure-resource-manager/management/manage-resources-powershell.md
[Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management]: ../azure-resource-manager/management/manage-resources-cli.md
