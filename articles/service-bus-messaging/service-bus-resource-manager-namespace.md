---
title: Create Service Bus namespace using an Azure Resource Manager template | Microsoft Docs
description: Use Azure Resource Manager template to create a Service Bus namespace
services: service-bus-messaging
documentationcenter: .net
author: sethmanheim
manager: timlt
editor: ''

ms.assetid: dc0d6482-6344-4cef-8644-d4573639f5e4
ms.service: service-bus-messaging
ms.devlang: tbd
ms.topic: article
ms.tgt_pltfrm: dotnet
ms.workload: na
ms.date: 04/12/2017
ms.author: sethm;shvija

---

# Create a Service Bus namespace using an Azure Resource Manager template

This article describes how to use an Azure Resource Manager template that creates a Service Bus namespace of type **Messaging** with a Standard/Basic SKU. The article also defines the parameters that are specified for the execution of the deployment. You can use this template for your own deployments, or customize it to meet your requirements.

For more information about creating templates, please see [Authoring Azure Resource Manager templates][Authoring Azure Resource Manager templates].

For the complete template, see the [Service Bus namespace template][Service Bus namespace template] on GitHub.

> [!NOTE]
> The following Azure Resource Manager templates are available for download and deployment. 
> 
> * [Create a Service Bus namespace with queue](service-bus-resource-manager-namespace-queue.md)
> * [Create a Service Bus namespace with topic and subscription](service-bus-resource-manager-namespace-topic.md)
> * [Create a Service Bus namespace with queue and authorization rule](service-bus-resource-manager-namespace-auth-rule.md)
> * [Create a Service Bus namespace with topic, subscription, and rule](service-bus-resource-manager-namespace-topic-with-rule.md)
> 
> To check for the latest templates, visit the [Azure Quickstart Templates][Azure Quickstart Templates] gallery and search for Service Bus.
> 
> 

## What will you deploy?
With this template, you will deploy a Service Bus namespace with a [Basic, Standard, or Premium](https://azure.microsoft.com/pricing/details/service-bus/) SKU.

To run the deployment automatically, click the following button:

[![Deploy to Azure](./media/service-bus-resource-manager-namespace/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-servicebus-create-namespace%2Fazuredeploy.json)

## Parameters
With Azure Resource Manager, you define parameters for values you want to specify when the template is deployed. The template includes a section called `Parameters` that contains all of the parameter values. You should define a parameter for those values that will vary based on the project you are deploying or based on the environment you are deploying to. Do not define parameters for values that will always stay the same. Each parameter value is used in the template to define the resources that are deployed.

This template defines the following parameters.

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

### serviceBusSKU
The name of the Service Bus [SKU](https://azure.microsoft.com/pricing/details/service-bus/) to create.

```json
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

```

The template defines the values that are permitted for this parameter (Basic, Standard, or Premium) and assigns a default value (Standard) if no value is specified.

For more information about Service Bus pricing, see [Service Bus pricing and billing][Service Bus pricing and billing].

### serviceBusApiVersion
The Service Bus API version of the template.

```json
"serviceBusApiVersion": { 
       "type": "string", 
       "defaultValue": "2015-08-01", 
       "metadata": { 
           "description": "Service Bus ApiVersion used by the template" 
       } 
```

## Resources to deploy
### Service Bus namespace
Creates a standard Service Bus namespace of type **Messaging**.

```json
"resources": [
    {
        "apiVersion": "[parameters('serviceBusApiVersion')]",
        "name": "[parameters('serviceBusNamespaceName')]",
        "type": "Microsoft.ServiceBus/Namespaces",
        "location": "[variables('location')]",
        "kind": "Messaging",
        "sku": {
            "name": "StandardSku",
            "tier": "Standard"
        },
        "properties": {
        }
    }
]
```

## Commands to run deployment
[!INCLUDE [app-service-deploy-commands](../../includes/app-service-deploy-commands.md)]

### PowerShell
```powershell
New-AzureRmResourceGroupDeployment -ResourceGroupName <resource-group-name> -TemplateFile https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-servicebus-create-namespace/azuredeploy.json
```

### Azure CLI
```CLI
azure config mode arm

azure group deployment create <my-resource-group> <my-deployment-name> --template-uri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-servicebus-create-namespace/azuredeploy.json
```

## Next steps
Now that you've created and deployed resources using Azure Resource Manager, learn how to manage these resources by reading these articles:

* [Manage Service Bus with PowerShell](service-bus-manage-with-ps.md)
* [Manage Service Bus resources with the Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer/releases)

[Authoring Azure Resource Manager templates]: ../azure-resource-manager/resource-group-authoring-templates.md
[Service Bus namespace template]: https://github.com/Azure/azure-quickstart-templates/blob/master/101-servicebus-create-namespace/
[Azure Quickstart Templates]: https://azure.microsoft.com/documentation/templates/?term=service+bus
[Service Bus pricing and billing]: service-bus-pricing-billing.md
[Using Azure PowerShell with Azure Resource Manager]: ../azure-resource-manager/powershell-azure-resource-manager.md
[Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management]: ../azure-resource-manager/xplat-cli-azure-resource-manager.md
