<properties
    pageTitle="Create a Service Bus namespace with queue | Microsoft Azure"
    description="Create a Service Bus namespace and a queue using an ARM template"
    services="service-bus"
    documentationCenter=".net"
    authors="sethmanheim"
    manager="timlt"
    editor=""/>

<tags
    ms.service="service-bus"
    ms.devlang="tbd"
    ms.topic="article"
    ms.tgt_pltfrm="dotnet"
    ms.workload="na"
    ms.date="04/08/2016"
    ms.author="sethm;shvija"/>

# Create a Service Bus namespace and a queue using an ARM template

This article shows how to use an Azure Resource Manager (ARM) template that creates a Service Bus namespace and a queue. You will learn how to define which resources are deployed and how to define parameters that are specified when the deployment is executed. You can use this template for your own deployments, or customize it to meet your requirements

For more information about creating templates, please see [Authoring Azure Resource Manager Templates][].

For the complete template, see the [Service Bus namespace and queue template][] on GitHub.

>[AZURE.NOTE] ARM templates for other Service Bus messaging entities are available.
>
>-    [Create a Service Bus namespace with queue and authorization rule](https://github.com/Azure/azure-quickstart-templates/blob/master/301-servicebus-create-authrule-namespace-and-queue/azuredeploy.json)
>-    [Create a Service Bus namespace with an Event Hub and consumer group](https://github.com/Azure/azure-quickstart-templates/blob/master/201-servicebus-create-eventhub-and-consumerGroup/azuredeploy.json)
>-    [Create a Service Bus namespace with topic and subscription](https://github.com/Azure/azure-quickstart-templates/blob/master/201-servicebus-create-topic-and-subscription/azuredeploy.json)
>-    [Create a Service Bus namespace](https://github.com/Azure/azure-quickstart-templates/blob/master/101-servicebus-create-namespace/azuredeploy.json)
>
>To check for the latest templates, see the [Azure Quickstart Templates][] and search for Service Bus.

## What will you deploy?

With this template, you will deploy a Service Bus namespace with a queue.

Queues offer First In, First Out (FIFO) message delivery to one or more competing consumers.

[Learn more about Service Bus queues](service-bus-queues-topics-subscriptions.md).

To run the deployment automatically, click the following button

[![Deploy to Azure](./media/service-bus-arm-namespace-queue/deploybutton.png)](TBD)

## Parameters

With Azure Resource Manager, you define parameters for values you want to specify when the template is deployed. The template includes a section called `Parameters` that contains all of the parameter values. You should define a parameter for those values that will vary based on the project you are deploying or based on the environment you are deploying to. Do not define parameters for values that will always stay the same. Each parameter value is used in the template to define the resources that are deployed.

We will describe each parameter in the template.

### serviceBusNamespaceName

The name of the Service Bus namespace to create.

```
"serviceBusNamespaceName": {
"type": "string"
}
```

### serviceBusQueueName

The name of the queue created in the Service Bus namespace.

```
"serviceBusQueueName": {
"type": "string"
}
```

### serviceBusApiVersion

The Service Bus API version of the template.

```
"serviceBusApiVersion": {
"type": "string"
}
```

## Resources to deploy

Creates a standard Service Bus namespace with a queue.

```
"resources ": [{
        "apiVersion": "[variables('sbVersion')]",
        "name": "[parameters('serviceBusNamespaceName')]",
        "type": "Microsoft.ServiceBus/Namespaces",
        "location": "[variables('location')]",
        "kind": "Messaging",
        "sku": {
            "name": "StandardSku",
            "tier": "Standard"
        },
        "resources": [{
            "apiVersion": "[variables('sbVersion')]",
            "name": "[parameters('serviceBusQueueName')]",
            "type": "Queues",
            "dependsOn": [
                "[concat('Microsoft.ServiceBus/namespaces/', parameters('namespaceName'))]"
            ],
            "properties": {
                "path": "[parameters('serviceBus/QueueName')]",
            }
        }]
```

## Commands to run deployment

[AZURE.INCLUDE [app-service-deploy-commands](../../includes/app-service-deploy-commands.md)]

## PowerShell

```
New-AzureRmResourceGroupDeployment -ResourceGroupName \<resource-group-name\> -TemplateFile <https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/201-servicebus-create-queue/azuredeploy.json>
```

## Azure CLI

```
azure config mode arm

azure group deployment create \<my-resource-group\> \<my-deployment-name\> --template-uri <https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/201-servicebus-create-queue/azuredeploy.json>
```

  [Authoring Azure Resource Manager Templates]: ../resource-group-authoring-templates.md
  [Service Bus namespace and queue template]: https://github.com/Azure/azure-quickstart-templates/blob/master/201-servicebus-create-queue/azuredeploy.json
  [Azure Quickstart Templates]: https://azure.microsoft.com/documentation/templates/
  [Learn more about Service Bus queues]: service-bus-queues-topics-subscriptions.md
  [Using Azure PowerShell with Azure Resource Manager]: ../powershell-azure-resource-manager.md
  [Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management]: ../xplat-cli-azure-resource-manager.md