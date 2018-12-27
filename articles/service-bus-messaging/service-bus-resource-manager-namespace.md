---
title: Create Service Bus Messaging namespace using Azure Resource Manager template | Microsoft Docs
description: Use Azure Resource Manager template to create a Service Bus Messaging namespace
services: service-bus-messaging
documentationcenter: .net
author: spelluru
manager: timlt
editor: ''

ms.assetid: dc0d6482-6344-4cef-8644-d4573639f5e4
ms.service: service-bus-messaging
ms.devlang: tbd
ms.topic: article
ms.tgt_pltfrm: dotnet
ms.workload: na
ms.date: 11/06/2018
ms.author: spelluru

---

# Create a Service Bus namespace using an Azure Resource Manager template
In this quickstart, you create an Azure Resource Manager template that creates a Service Bus namespace of type **Messaging** with a **Standard** SKU. The article also defines the parameters that are specified for the execution of the deployment. You can use this template for your own deployments, or customize it to meet your requirements. For more information about creating templates, see [Authoring Azure Resource Manager templates][Authoring Azure Resource Manager templates]. For the complete template, see the [Service Bus namespace template][Service Bus namespace template] on GitHub.

> [!NOTE]
> The following Azure Resource Manager templates are available for download and deployment. 
> 
> * [Create a Service Bus namespace with queue](service-bus-resource-manager-namespace-queue.md)
> * [Create a Service Bus namespace with topic and subscription](service-bus-resource-manager-namespace-topic.md)
> * [Create a Service Bus namespace with queue and authorization rule](service-bus-resource-manager-namespace-auth-rule.md)
> * [Create a Service Bus namespace with topic, subscription, and rule](service-bus-resource-manager-namespace-topic-with-rule.md)
> 
> To check for the latest templates, visit the [Azure Quickstart Templates][Azure Quickstart Templates] gallery and search for Service Bus.

## Quick deployment
To run the sample without out writing any JSON and running PowerShell/CLI command, select the following button:

[![Deploy to Azure](./media/service-bus-resource-manager-namespace/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-servicebus-create-namespace%2Fazuredeploy.json)

To create and deploy template manually, go through the following  sections in this article.

## Prerequisites
To complete this quickstart, you need an Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/) before you begin.

If you want to use **Azure PowerShell** to deploy the Resource Manager template, [Install Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-azurerm-ps?view=azurermps-5.7.0).

If you want to use **Azure CLI** to deploy the Resource Manager template, [Install  Azure CLI]( /cli/azure/install-azure-cli).

## Create the Resource Manager template JSON 
Create a JSON file named **MyServiceBusNamespace.json** with the following content: 

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "serviceBusNamespaceName": {
            "type": "string",
            "metadata": {
                "description": "Name of the Service Bus namespace"
            }
        },
        "serviceBusSku": {
            "type": "string",
            "allowedValues": [
                "Basic",
                "Standard",
                "Premium"
            ],
            "defaultValue": "Standard",
            "metadata": {
                "description": "The messaging tier for service Bus namespace"
            }
        },
        "location": {
            "type": "string",
            "defaultValue": "[resourceGroup().location]",
            "metadata": {
                "description": "Location for all resources."
            }
        }
    },
    "resources": [
        {
            "apiVersion": "2017-04-01",
            "name": "[parameters('serviceBusNamespaceName')]",
            "type": "Microsoft.ServiceBus/namespaces",
            "location": "[parameters('location')]",
            "sku": {
                "name": "[parameters('serviceBusSku')]"
            }
        }
    ]
}
```

This template creates a standard Service Bus namespace.

## Create the parameters JSON
The template you created in the previous step has a section called `Parameters`. You define parameters for those values that vary based on the project you are deploying or based on the target environment. This template defines the following parameters: **serviceBusNamespaceName**, **serviceBusSku**, and **location**. To learn more about SKUs of Service Bus, see [Service Bus SKUs](https://azure.microsoft.com/pricing/details/service-bus/) to create.

Create a JSON file named **MyServiceBusNamespace-Parameters.json** with the following content: 

> [!NOTE] 
> Specify a name for your Service Bus namespace. 


```json
{
  "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "serviceBusNamespaceName": {
      "value": "<Specify a name for the Service Bus namespace>"
    },
    "serviceBusSku": {
      "value": "Standard"
    },
    "location": {
        "value": "East US"
    }
  }
}
```


## Use Azure PowerShell to deploy the template

### Sign in to Azure
1. Launch Azure PowerShell

2. Run the following command to sign in to Azure:

   ```azurepowershell
   Login-AzureRmAccount
   ```
3. If you have Issue the following commands to set the current subscription context:

   ```azurepowershell
   Select-AzureRmSubscription -SubscriptionName "<YourSubscriptionName>" 
   ```

### Deploy resources
To deploy the resources using Azure PowerShell, switch to the folder where you saved the JSON files, and run the following commands:

> [!IMPORTANT]
> Specify a name for the Azure resource group as a value for $resourceGroupName before running the commands. 

1. Declare a variable for the resource group name, and specify a value for it. 

    ```azurepowershell
    $resourceGroupName = "<Specify a name for the Azure resource group>"
    ```
2. Create an Azure resource group.

    ```azurepowershell
    New-AzureRmResourceGroup $resourceGroupName -location 'East US'
    ```
3. Deploy the Resource Manager template. Specify the names of deployment itself, resource group, JSON file for the template, JSON file for parameters

    ```azurepowershell
    New-AzureRmResourceGroupDeployment -Name MyARMDeployment -ResourceGroupName $resourceGroupName -TemplateFile MyServiceBusNamespace.json -TemplateParameterFile MyServiceBusNamespace-Parameters.json
    ```

## Use Azure CLI to deploy the template

### Sign in to Azure

1. Run the following command to sign in to Azure:

    ```azurecli
    az login
    ```
2. Set the current subscription context. Replace `MyAzureSub` with the name of the Azure subscription you want to use:

    ```azurecli
    az account set --subscription <Name of your Azure subscription>
    ``` 

### Deploy resources
To deploy the resources using Azure CLI, switch to the folder with JSON files, and run the following commands:

> [!IMPORTANT]
> Specify a name for the Azure resource group in the az group create command. .

1. Create an Azure resource group. 
    ```azurecli
    az group create --name <YourResourceGroupName> --location eastus
    ```

2. Deploy the Resource Manager template. Specify the names of resource group, deployment, JSON file for the template, JSON file for parameters.

    ```azurecli
    az group deployment create --name <Specify a name for the deployment> --resource-group <YourResourceGroupName> --template-file MyServiceBusNamespace.json --parameters @MyServiceBusNamespace-Parameters.json
    ```

## Next steps
In this article, you created a Service Bus namespace. See the other quickstarts to learn how to create queues, topics/subscriptions, and use them: 

- [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
- [Get started with Service Bus topics](service-bus-dotnet-how-to-use-topics-subscriptions.md)

[Authoring Azure Resource Manager templates]: ../azure-resource-manager/resource-group-authoring-templates.md
[Service Bus namespace template]: https://github.com/Azure/azure-quickstart-templates/blob/master/101-servicebus-create-namespace/
[Azure Quickstart Templates]: https://azure.microsoft.com/documentation/templates/?term=service+bus
[Service Bus pricing and billing]: service-bus-pricing-billing.md
[Using Azure PowerShell with Azure Resource Manager]: ../azure-resource-manager/powershell-azure-resource-manager.md
[Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management]: ../azure-resource-manager/xplat-cli-azure-resource-manager.md
