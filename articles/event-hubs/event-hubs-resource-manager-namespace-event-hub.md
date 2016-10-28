<properties
    pageTitle="Create an Event Hubs namespace with Event Hub and consumer group using an Azure Resource Manager template | Microsoft Azure"
    description="Create an Event Hubs namespace with Event Hub and consumer group using Azure Resource Manager template"
    services="event-hubs"
    documentationCenter=".net"
    authors="sethmanheim"
    manager="timlt"
    editor=""/>

<tags
    ms.service="event-hubs"
    ms.devlang="tbd"
    ms.topic="article"
    ms.tgt_pltfrm="dotnet"
    ms.workload="na"
    ms.date="08/31/2016"
    ms.author="sethm;shvija"/>

# Create an Event Hubs namespace with Event Hub and consumer group using an Azure Resource Manager template

This article shows how to use an Azure Resource Manager template that creates an Event Hubs namespace with an Event Hub and a consumer group. You will learn how to define which resources are deployed and how to define parameters that are specified when the deployment is executed. You can use this template for your own deployments, or customize it to meet your requirements

For more information about creating templates, please see [Authoring Azure Resource Manager templates][].

For the complete template, see the [Event Hub and consumer group template][] on GitHub.

>[AZURE.NOTE]
>To check for the latest templates, visit the [Azure Quickstart Templates][] gallery and search for Event Hubs.

## What will you deploy?

With this template, you will deploy an Event Hubs namespace with an Event Hub and a consumer group.

[Event Hubs](../event-hubs/event-hubs-what-is-event-hubs.md) is an event processing service used to provide event and telemetry ingress to Azure at massive scale, with low latency and high reliability.

To run the deployment automatically, click the following button:

[![Deploy to Azure](./media/event-hubs-resource-manager-namespace-event-hub/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F201-event-hubs-create-event-hub-and-consumer-group%2Fazuredeploy.json)

## Parameters

With Azure Resource Manager, you define parameters for values you want to specify when the template is deployed. The template includes a section called `Parameters` that contains all of the parameter values. You should define a parameter for those values that will vary based on the project you are deploying or based on the environment you are deploying to. Do not define parameters for values that will always stay the same. Each parameter value is used in the template to define the resources that are deployed.

The template defines the following parameters.

### eventHubNamespaceName

The name of the Event Hubs namespace to create.

```
"eventHubNamespaceName": {
"type": "string"
}
```

### eventHubName

The name of the Event Hub created in the Event Hubs namespace.

```
"eventHubName": {
"type": "string"
}
```

### eventHubConsumerGroupName

The name of the consumer group created for the Event Hub.

```
"eventHubConsumerGroupName": {
"type": "string"
}
```

### apiVersion

The API version of the template.

```
"apiVersion": {
"type": "string"
}
```

## Resources to deploy

Creates a namespace of type **EventHubs**, with an Event Hub and a consumer group.

```
"resources":[  
      {  
         "apiVersion":"[variables('ehVersion')]",
         "name":"[parameters('namespaceName')]",
         "type":"Microsoft.EventHub/Namespaces",
         "location":"[variables('location')]",
         "sku":{  
            "name":"Standard",
            "tier":"Standard"
         },
         "resources":[  
            {  
               "apiVersion":"[variables('ehVersion')]",
               "name":"[parameters('eventHubName')]",
               "type":"EventHubs",
               "dependsOn":[  
                  "[concat('Microsoft.EventHub/namespaces/', parameters('namespaceName'))]"
               ],
               "properties":{  
                  "path":"[parameters('eventHubName')]"
               },
               "resources":[  
                  {  
                     "apiVersion":"[variables('ehVersion')]",
                     "name":"[parameters('consumerGroupName')]",
                     "type":"ConsumerGroups",
                     "dependsOn":[  
                        "[parameters('eventHubName')]"
                     ],
                     "properties":{  

                     }
                  }
               ]
            }
         ]
      }
   ],
```

## Commands to run deployment

[AZURE.INCLUDE [app-service-deploy-commands](../../includes/app-service-deploy-commands.md)]

## PowerShell

```
New-AzureRmResourceGroupDeployment -ResourceGroupName \<resource-group-name\> -TemplateFile https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/201-event-hubs-create-event-hub-and-consumer-group/azuredeploy.json
```

## Azure CLI

```
azure config mode arm

azure group deployment create \<my-resource-group\> \<my-deployment-name\> --template-uri [https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/201-event-hubs-create-event-hub-and-consumer-group/azuredeploy.json][]
```

[Authoring Azure Resource Manager templates]: ../resource-group-authoring-templates.md
[Azure Quickstart Templates]:  https://azure.microsoft.com/documentation/templates/?term=event+hubs
[Using Azure PowerShell with Azure Resource Manager]: ../powershell-azure-resource-manager.md
[Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management]: ../xplat-cli-azure-resource-manager.md
[Event Hub and consumer group template]: https://github.com/Azure/azure-quickstart-templates/blob/master/201-event-hubs-create-event-hub-and-consumer-group/
