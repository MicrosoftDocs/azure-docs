---
title: 'Quickstart: Create an Azure event hub with consumer group'
description: 'Quickstart: Create an Event Hubs namespace with an event hub and a consumer group using Azure Resource Manager templates'
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
ms.date: 06/08/2021
---

# Quickstart: Create an event hub by using an ARM template
In this quickstart, you create an event hub by using an [Azure Resource Manager template (ARM template)](../azure-resource-manager/management/overview.md). You deploy an ARM template to create a namespace of type [Event Hubs](./event-hubs-about.md), with one event hub.

## Prerequisites

- If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.
- If you're new to Azure Event Hubs, see [Event Hubs overview](event-hubs-about.md) and [Event Hubs features](event-hubs-features.md). 


## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/eventhubs-create-namespace-and-eventhub/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.eventhub/eventhubs-create-namespace-and-eventhub/azuredeploy.json":::

The resources defined in the template include:

- [**Microsoft.EventHub/namespaces**](/azure/templates/microsoft.eventhub/namespaces)
- [**Microsoft.EventHub/namespaces/eventhubs**](/azure/templates/microsoft.eventhub/namespaces/eventhubs)

To find more template samples, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?term=eventhub&pageNumber=1&sort=Popular).

## Deploy the template

### Using Azure portal user interface

1. If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template opens in the Azure portal. 

    :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.eventhub%2Feventhubs-create-namespace-and-eventhub%2Fazuredeploy.json":::
2. Select an existing **resource group** or create a resource group and select it. 
1. Select the **region**.
1. Enter a unique **name** for the **project**. This name is used to generate names for an Event Hubs namespace and an event hub in the namespace. 
1. Select **Review + create**.
1. On the **Review + create** page, select **Create**.

### Using Azure Cloud Shell

To deploy the template using Azure Cloud Shell: 

1. Select **Open Cloud Shell** from the following code block, and then follow the instructions to sign in to the Azure Cloud Shell.

   ```azurepowershell-interactive
   $projectName = Read-Host -Prompt "Enter a project name that is used for generating resource names"
   $location = Read-Host -Prompt "Enter the location (i.e. centralus)"
   $resourceGroupName = "${projectName}rg"
   $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.eventhub/eventhubs-create-namespace-and-eventhub/azuredeploy.json"

   New-AzResourceGroup -Name $resourceGroupName -Location $location
   New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -projectName $projectName

   Write-Host "Press [ENTER] to continue ..."
   ```

   It takes a few moments to create an event hub.

1. Select **Copy** to copy the PowerShell script.
1. Right-click the shell console, and then select **Paste**.
1. Press **ENTER** to run the commands. 

## Validate the deployment

To verify the deployment, you can either open the resource group from the [Azure portal](https://portal.azure.com), or use the following Azure PowerShell script. If the Cloud Shell is still open, you don't need to copy/run the first line (Read-Host).

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter the same project name that you used in the last procedure"
$resourceGroupName = "${projectName}rg"
$namespaceName = "${projectName}ns"

Get-AzEventHub -ResourceGroupName $resourceGroupName -Namespace $namespaceName

Write-Host "Press [ENTER] to continue ..."
```

## Clean up resources

When the Azure resources are no longer needed, clean up the resources you deployed by deleting the resource group. If the Cloud Shell is still open, you don't need to copy/run the first line (Read-Host).

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter the same project name that you used in the last procedure"
$resourceGroupName = "${projectName}rg"

Remove-AzResourceGroup -ResourceGroupName $resourceGroupName

Write-Host "Press [ENTER] to continue ..."
```

## Next steps

In this article, you created an Event Hubs namespace, and an event hub in the namespace. For step-by-step instructions to send events to (or) receive events from an event hub, see the **Send and receive events** tutorials:

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

[Authoring Azure Resource Manager templates]: ../azure-resource-manager/templates/syntax.md
[Azure Quickstart Templates]:  https://azure.microsoft.com/resources/templates/?term=event+hubs
[Using Azure PowerShell with Azure Resource Manager]: ../azure-resource-manager/management/manage-resources-powershell.md
[Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management]: ../azure-resource-manager/management/manage-resources-cli.md
[Event hub and consumer group template]: https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.eventhub/event-hubs-create-event-hub-and-consumer-group/
