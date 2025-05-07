---
title: Create Azure Service Bus namespace topic using a template
description: 'Quickstart: Create a Service Bus namespace with topic and subscription using Azure Resource Manager template'
author: spelluru
ms.author: spelluru
ms.date: 09/27/2021
ms.topic: quickstart
ms.tgt_pltfrm: dotnet
ms.custom: mode-other, devx-track-azurecli, devx-track-arm-template
ms.devlang: azurecli
---

# Quickstart: Create a Service Bus namespace with topic and subscription using an Azure Resource Manager template

This article shows how to use an Azure Resource Manager template that creates a Service Bus namespace and a topic and subscription within that namespace. The article explains how to specify which resources are deployed and how to define parameters that are specified when the deployment is executed. You can use this template for your own deployments, or customize it to meet your requirements

For more information about creating templates, see [Authoring Azure Resource Manager templates][Authoring Azure Resource Manager templates].

For the complete template, see the [Service Bus namespace with topic and subscription][Service Bus namespace with topic and subscription] template.

> [!NOTE]
> The following Azure Resource Manager templates are available for download and deployment.
>
> * [Create a Service Bus namespace](service-bus-resource-manager-namespace.md)
> * [Create a Service Bus namespace with queue](service-bus-resource-manager-namespace-queue.md)
> * [Create a Service Bus namespace with queue and authorization rule](service-bus-resource-manager-namespace-auth-rule.md)
> * [Create a Service Bus namespace with topic, subscription, and rule](service-bus-resource-manager-namespace-topic-with-rule.md)
>
> To check for the latest templates, visit the [Azure Quickstart Templates][Azure Quickstart Templates] gallery and search for **Service Bus**.

## What do you deploy?

With this template, you deploy a Service Bus namespace with topic and subscription.

[Service Bus topics and subscriptions](service-bus-queues-topics-subscriptions.md#topics-and-subscriptions) provide a one-to-many form of communication, in a *publish/subscribe* pattern.

To run the deployment automatically, click the following button:

[![Deploy to Azure](./media/service-bus-resource-manager-namespace-topic/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.servicebus%2Fservicebus-create-topic-and-subscription%2Fazuredeploy.json)

## Parameters

With Azure Resource Manager, you define parameters for values you want to specify when the template is deployed. The template includes a section called `Parameters` that contains all of the parameter values. Define a parameter for those values that vary based on the project you're deploying or based on the environment you're deploying to. Do not define parameters for values that always stay the same. Each parameter value is used in the template to define the resources that are deployed.

The template defines the following parameters:

### serviceBusNamespaceName

The name of the Service Bus namespace to create.

```json
"serviceBusNamespaceName": {
"type": "string"
}
```

### serviceBusTopicName

The name of the topic created in the Service Bus namespace.

```json
"serviceBusTopicName": {
"type": "string"
}
```

### serviceBusSubscriptionName

The name of the subscription created in the Service Bus namespace.

```json
"serviceBusSubscriptionName": {
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

Creates a standard Service Bus namespace of type **Messaging**, with topic and subscription.

```json
"resources": [{
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

For JSON syntax and properties, see [namespaces](/azure/templates/microsoft.servicebus/namespaces), [topics](/azure/templates/microsoft.servicebus/namespaces/topics), and [subscriptions](/azure/templates/microsoft.servicebus/namespaces/topics/subscriptions).

## Commands to run deployment

[!INCLUDE [app-service-deploy-commands](../../includes/app-service-deploy-commands.md)]

## PowerShell

```powershell-interactive
New-AzureResourceGroupDeployment -Name \<deployment-name\> -ResourceGroupName \<resource-group-name\> -TemplateUri <https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/quickstarts/microsoft.servicebus/servicebus-create-topic-and-subscription/azuredeploy.json>
```

## Azure CLI

```azurecli-interactive
az deployment group create \<my-resource-group\> --name \<my-deployment-name\> --template-uri <https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/quickstarts/microsoft.servicebus/servicebus-create-topic-and-subscription/azuredeploy.json>
```

## Next steps

Now that you've created and deployed resources using Azure Resource Manager, learn how to manage these resources by viewing these articles:

* [Manage Service Bus with PowerShell](service-bus-manage-with-ps.md)
* [Manage Service Bus resources with the Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer/releases)

[Authoring Azure Resource Manager templates]: ../azure-resource-manager/templates/syntax.md
[Azure Quickstart Templates]: https://azure.microsoft.com/resources/templates/?term=service+bus
[Learn more about Service Bus topics and subscriptions]: service-bus-queues-topics-subscriptions.md
[Using Azure PowerShell with Azure Resource Manager]: ../azure-resource-manager/management/manage-resources-powershell.md
[Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management]: ../azure-resource-manager/management/manage-resources-cli.md
[Service Bus namespace with topic and subscription]: https://azure.microsoft.com/resources/templates/servicebus-create-topic-and-subscription/
