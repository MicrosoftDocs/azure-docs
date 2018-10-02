---
title: Create Azure Service Bus namespace and queue using Azure Resource Manager template | Microsoft Docs
description: Create a Service Bus namespace and a queue using Azure Resource Manager template
services: service-bus-messaging
documentationcenter: .net
author: spelluru
manager: timlt
editor: ''

ms.assetid: a6bfb5fd-7b98-4588-8aa1-9d5f91b599b6
ms.service: service-bus-messaging
ms.devlang: tbd
ms.topic: article
ms.tgt_pltfrm: dotnet
ms.workload: na
ms.date: 09/11/2018
ms.author: spelluru

---
# Create a Service Bus namespace and a queue using an Azure Resource Manager template

This article shows how to use an Azure Resource Manager template that creates a Service Bus namespace and a queue within that namespace. The article explains how to specify which resources are deployed and how to define parameters that are specified when the deployment is executed. You can use this template for your own deployments, or customize it to meet your requirements.

For more information about creating templates, please see [Authoring Azure Resource Manager templates][Authoring Azure Resource Manager templates].

For the complete template, see the [Service Bus namespace and queue template][Service Bus namespace and queue template] on GitHub.

> [!NOTE]
> The following Azure Resource Manager templates are available for download and deployment.
> 
> * [Create a Service Bus namespace with queue and authorization rule](service-bus-resource-manager-namespace-auth-rule.md)
> * [Create a Service Bus namespace with topic and subscription](service-bus-resource-manager-namespace-topic.md)
> * [Create a Service Bus namespace](service-bus-resource-manager-namespace.md)
> * [Create a Service Bus namespace with topic, subscription, and rule](service-bus-resource-manager-namespace-topic-with-rule.md)
> 
> To check for the latest templates, visit the [Azure Quickstart Templates][Azure Quickstart Templates] gallery and search for **Service Bus**.
> 
> 

## What will you deploy?

With this template, you deploy a Service Bus namespace with a queue.

[Service Bus queues](service-bus-queues-topics-subscriptions.md#queues) offer First In, First Out (FIFO) message delivery to one or more competing consumers.

To run the deployment automatically, click the following button:

[![Deploy to Azure](./media/service-bus-resource-manager-namespace-queue/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F201-servicebus-create-queue%2Fazuredeploy.json)

## Parameters

With Azure Resource Manager, you define parameters for values you want to specify when the template is deployed. The template includes a section called `Parameters` that contains all of the parameter values. You should define a parameter for those values that will vary based on the project you are deploying or based on the environment you are deploying to. Do not define parameters for values that will always stay the same. Each parameter value is used in the template to define the resources that are deployed.

The template defines the following parameters.

### serviceBusNamespaceName
The name of the Service Bus namespace to create.

```json
"serviceBusNamespaceName": {
"type": "string",
"metadata": { 
    "description": "Name of the Service Bus namespace" 
    }
}
```

### serviceBusQueueName
The name of the queue created in the Service Bus namespace.

```json
"serviceBusQueueName": {
"type": "string"
}
```

### serviceBusApiVersion
The Service Bus API version of the template.

```json
"serviceBusApiVersion": { 
       "type": "string", 
       "defaultValue": "2017-04-01", 
       "metadata": { 
           "description": "Service Bus ApiVersion used by the template" 
       }
```

## Resources to deploy
Creates a standard Service Bus namespace of type **Messaging**, with a queue.

```json
"resources ": [{
        "apiVersion": "[variables('sbVersion')]",
        "name": "[parameters('serviceBusNamespaceName')]",
        "type": "Microsoft.ServiceBus/Namespaces",
        "location": "[variables('location')]",
        "kind": "Messaging",
        "sku": {
            "name": "Standard",
        },
        "resources": [{
            "apiVersion": "[variables('sbVersion')]",
            "name": "[parameters('serviceBusQueueName')]",
            "type": "Queues",
            "dependsOn": [
                "[concat('Microsoft.ServiceBus/namespaces/', parameters('serviceBusNamespaceName'))]"
            ],
            "properties": {
                "path": "[parameters('serviceBusQueueName')]",
            }
        }]
    }]
```

## Commands to run deployment
[!INCLUDE [app-service-deploy-commands](../../includes/app-service-deploy-commands.md)]

## PowerShell

```powershell
New-AzureRmResourceGroupDeployment -ResourceGroupName \<resource-group-name\> -TemplateFile <https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/201-servicebus-create-queue/azuredeploy.json>
```

## Azure CLI

```azurecli
azure config mode arm

azure group deployment create \<my-resource-group\> \<my-deployment-name\> --template-uri <https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/201-servicebus-create-queue/azuredeploy.json>
```

## Next steps
Now that you've created and deployed resources using Azure Resource Manager, learn how to manage these resources by viewing these articles:

* [Manage Service Bus with PowerShell](service-bus-manage-with-ps.md)
* [Manage Service Bus resources with the Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer/releases)

[Authoring Azure Resource Manager templates]: ../azure-resource-manager/resource-group-authoring-templates.md
[Service Bus namespace and queue template]: https://github.com/Azure/azure-quickstart-templates/blob/master/201-servicebus-create-queue/
[Azure Quickstart Templates]: https://azure.microsoft.com/documentation/templates/?term=service+bus
[Learn more about Service Bus queues]: service-bus-queues-topics-subscriptions.md
[Using Azure PowerShell with Azure Resource Manager]: ../azure-resource-manager/powershell-azure-resource-manager.md
[Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management]: ../azure-resource-manager/xplat-cli-azure-resource-manager.md
