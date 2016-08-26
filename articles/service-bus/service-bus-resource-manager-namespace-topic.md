<properties
    pageTitle="Create a Service Bus namespace with topic and subscription using an Azure Resource Manager template | Microsoft Azure"
    description="Create a Service Bus namespace with topic and subscription using Azure Resource Manager template"
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
    ms.date="07/11/2016"
    ms.author="sethm;shvija"/>

# Create a Service Bus namespace with topic and subscription using an Azure Resource Manager template

This article shows how to use an Azure Resource Manager template that creates a Service Bus namespace with a topic and subscription. You will learn how to define which resources are deployed and how to define parameters that are specified when the deployment is executed. You can use this template for your own deployments, or customize it to meet your requirements

For more information about creating templates, please see [Authoring Azure Resource Manager templates][].

For the complete template, see the [Service Bus namespace with topic and subscription][] template.

>[AZURE.NOTE] The following Azure Resource Manager templates are available for download and deployment.
>
>-    [Create a Service Bus namespace with queue and authorization rule](service-bus-resource-manager-namespace-auth-rule.md)
>-    [Create a Service Bus namespace with queue](service-bus-resource-manager-namespace-queue.md)
>-    [Create a Service Bus namespace](service-bus-resource-manager-namespace.md)
>-    [Create a Service Bus namespace with an Event Hub and consumer group](service-bus-resource-manager-namespace-event-hub.md)
>
>To check for the latest templates, visit the [Azure Quickstart Templates][] gallery and search for Service Bus.

## What will you deploy?

With this template, you will deploy a Service Bus namespace with topic and subscription.

[Service Bus topics and subscriptions](service-bus-queues-topics-subscriptions.md#topics-and-subscriptions) provide a one-to-many form of communication, in a *publish/subscribe* pattern.

To run the deployment automatically, click the following button:

[![Deploy to Azure](./media/service-bus-resource-manager-namespace-topic/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F201-servicebus-create-topic-and-subscription%2Fazuredeploy.json)

## Parameters

With Azure Resource Manager, you define parameters for values you want to specify when the template is deployed. The template includes a section called `Parameters` that contains all of the parameter values. You should define a parameter for those values that will vary based on the project you are deploying or based on the environment you are deploying to. Do not define parameters for values that will always stay the same. Each parameter value is used in the template to define the resources that are deployed.

The template defines the following parameters.

### serviceBusNamespaceName

The name of the Service Bus namespace to create.

```
"serviceBusNamespaceName": {
"type": "string"
}
```

### serviceBusTopicName

The name of the topic created in the Service Bus namespace.

```
"serviceBusTopicName": {
"type": "string"
}
```

### serviceBusSubscriptionName

The name of the subscription created in the Service Bus namespace.

```
"serviceBusSubscriptionName": {
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

Creates a standard Service Bus namespace of type **Messaging**, with topic and subscription.

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
            "name": "[parameters('serviceBusTopicName')]",
            "type": "Topics",
            "dependsOn": [
                "[concat('Microsoft.ServiceBus/namespaces/', parameters('serviceBusNamespaceName'))]"
            ],
            "properties": {
                "path": "[parameters('serviceBusTopicName')]",
            },
            "resources": [{
                "apiVersion": "[variables('sbVersion')]",
                "name": "[parameters('serviceBusSubscriptionName')]",
                "type": "Subscriptions",
                "dependsOn": [
                    "[parameters('serviceBusTopicName')]"
                ],
                "properties": {}
            }]
        }]
    }]
```

## Commands to run deployment

[AZURE.INCLUDE [app-service-deploy-commands](../../includes/app-service-deploy-commands.md)]

## PowerShell

```
New-AzureResourceGroupDeployment -Name \<deployment-name\> -ResourceGroupName \<resource-group-name\> -TemplateUri <https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/201-servicebus-create-topic-and-subscription/azuredeploy.json>
```

## Azure CLI

```
azure config mode arm

azure group deployment create \<my-resource-group\> \<my-deployment-name\> --template-uri <https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/201-servicebus-create-topic-and-subscription/azuredeploy.json>
```

## Next steps

Now that you've created and deployed resources using Azure Resource Manager, learn how to manage these resources by viewing these articles:

- [Manage Azure Service Bus using Azure Automation](service-bus-automation-manage.md)
- [Manage Service Bus with PowerShell](service-bus-powershell-how-to-provision.md)
- [Manage Service Bus resources with the Service Bus Explorer](https://code.msdn.microsoft.com/Service-Bus-Explorer-f2abca5a)


  [Authoring Azure Resource Manager templates]: ../resource-group-authoring-templates.md
  [Azure Quickstart Templates]: https://azure.microsoft.com/documentation/templates/?term=service+bus
  [Learn more about Service Bus topics and subscriptions]: service-bus-queues-topics-subscriptions.md
  [Using Azure PowerShell with Azure Resource Manager]: ../powershell-azure-resource-manager.md
  [Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management]: ../xplat-cli-azure-resource-manager.md
  [Service Bus namespace with topic and subscription]: https://github.com/Azure/azure-quickstart-templates/blob/master/201-servicebus-create-topic-and-subscription/
