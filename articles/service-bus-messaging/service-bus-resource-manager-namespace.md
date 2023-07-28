---
title: Create an Azure Service Bus namespace using template
description: Use Azure Resource Manager template to create a Service Bus Messaging namespace
documentationcenter: .net
author: spelluru
ms.topic: article
ms.tgt_pltfrm: dotnet
ms.custom: devx-track-arm-template
ms.date: 09/27/2021
ms.author: spelluru 
---

# Create a Service Bus namespace by using an Azure Resource Manager template

Learn how to deploy an Azure Resource Manager template to create a Service Bus namespace. You can use this template for your own deployments, or customize it to meet your requirements. For more information about creating templates, see [Azure Resource Manager documentation](../azure-resource-manager/index.yml).

The following templates are also available for creating Service Bus namespaces:

* [Create a Service Bus namespace with queue](./service-bus-resource-manager-namespace-queue.md)
* [Create a Service Bus namespace with topic and subscription](./service-bus-resource-manager-namespace-topic.md)
* [Create a Service Bus namespace with queue and authorization rule](./service-bus-resource-manager-namespace-auth-rule.md)
* [Create a Service Bus namespace with topic, subscription, and rule](./service-bus-resource-manager-namespace-topic-with-rule.md)

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Create a service bus namespace

In this quickstart, you use an [existing Resource Manager template](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.servicebus/servicebus-create-namespace/azuredeploy.json) from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/):

[!code-json[create-azure-service-bus-namespace](~/quickstart-templates/quickstarts/microsoft.servicebus/servicebus-create-namespace/azuredeploy.json)]

To find more template samples, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Servicebus&pageNumber=1&sort=Popular).

To create a service bus namespace by deploying a template:

1. Select **Try it** from the following code block, and then follow the instructions to sign in to the Azure Cloud shell.

    ```azurepowershell-interactive
    $serviceBusNamespaceName = Read-Host -Prompt "Enter a name for the service bus namespace to be created"
    $location = Read-Host -Prompt "Enter the location (i.e. centralus)"
    $resourceGroupName = "${serviceBusNamespaceName}rg"
    $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.servicebus/servicebus-create-namespace/azuredeploy.json"

    New-AzResourceGroup -Name $resourceGroupName -Location $location
    New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -serviceBusNamespaceName $serviceBusNamespaceName

    Write-Host "Press [ENTER] to continue ..."
    ```

    The resource group name is the service bus namespace name with **rg** appended.

2. Select **Copy** to copy the PowerShell script.
3. Right-click the shell console, and then select **Paste**.

It takes a few moments to create an event hub.

## Verify the deployment

To see the deployed service bus namespace, you can either open the resource group from the Azure portal, or use the following Azure PowerShell script. If the Cloud shell is still open, you don't need to copy/run the first and second lines of the following script.

```azurepowershell-interactive
$serviceBusNamespaceName = Read-Host -Prompt "Enter the same service bus namespace name used earlier"
$resourceGroupName = "${serviceBusNamespaceName}rg"

Get-AzServiceBusNamespace -ResourceGroupName $resourceGroupName -Name $serviceBusNamespaceName

Write-Host "Press [ENTER] to continue ..."
```

Azure PowerShell is used to deploy the template in this tutorial. For other template deployment methods, see:

* [By using the Azure portal](../azure-resource-manager/templates/deploy-portal.md).
* [By using Azure CLI](../azure-resource-manager/templates/deploy-cli.md).
* [By using REST API](../azure-resource-manager/templates/deploy-rest.md).

## Clean up resources

When the Azure resources are no longer needed, clean up the resources you deployed by deleting the resource group. If the Cloud shell is still open, you don't need to copy/run the first and second lines of the following script.

```azurepowershell-interactive
$serviceBusNamespaceName = Read-Host -Prompt "Enter the same service bus namespace name used earlier"
$resourceGroupName = "${serviceBusNamespaceName}rg"

Remove-AzResourceGroup -ResourceGroupName $resourceGroupName

Write-Host "Press [ENTER] to continue ..."
```

## Next steps

In this article, you created a Service Bus namespace. See the other quickstarts to learn how to create queues, topics/subscriptions, and use them:

* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [Get started with Service Bus topics](service-bus-dotnet-how-to-use-topics-subscriptions.md)
