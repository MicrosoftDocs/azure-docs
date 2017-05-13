---
title: Create an Azure Event Hubs namespace and consumer group using a template | Microsoft Docs
description: Create an Event Hubs namespace with an event hub and a consumer group using Azure Resource Manager templates
services: event-hubs
documentationcenter: .net
author: sethmanheim
manager: timlt
editor: ''

ms.assetid: 28bb4591-1fd7-444f-a327-4e67e8878798
ms.service: event-hubs
ms.devlang: tbd
ms.topic: article
ms.tgt_pltfrm: dotnet
ms.workload: na
ms.date: 03/07/2017
ms.author: sethm;shvija

---
# Create an Event Hubs namespace with an event hub and consumer group using an Azure Resource Manager template
This article shows how to use an Azure Resource Manager template that creates a namespace of type Event Hubs, with one event hub and one consumer group. The article shows how to define which resources are deployed and how to define parameters that are specified when the deployment is executed. You can use this template for your own deployments, or customize it to meet your requirements

For more information about creating templates, please see [Authoring Azure Resource Manager templates][Authoring Azure Resource Manager templates].

For the complete template, see the [Event hub and consumer group template][Event Hub and consumer group template] on GitHub.

> [!NOTE]
> To check for the latest templates, visit the [Azure Quickstart Templates][Azure Quickstart Templates] gallery and search for Event Hubs.
> 
> 

## What will you deploy?
With this template, you will deploy an Event Hubs namespace with an event hub and a consumer group.

[Event Hubs](event-hubs-what-is-event-hubs.md) is an event processing service used to provide event and telemetry ingress to Azure at massive scale, with low latency and high reliability.

To run the deployment automatically, click the following button:

[![Deploy to Azure](./media/event-hubs-resource-manager-namespace-event-hub/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F201-event-hubs-create-event-hub-and-consumer-group%2Fazuredeploy.json)

## Parameters
With Azure Resource Manager, you define parameters for values you want to specify when the template is deployed. The template includes a section called `Parameters` that contains all of the parameter values. You should define a parameter for those values that will vary based on the project you are deploying or based on the environment you are deploying to. Do not define parameters for values that will always stay the same. Each parameter value in the template defines the resources that are deployed.

The template defines the following parameters.

### eventHubNamespaceName
The name of the Event Hubs namespace to create.

```json
"eventHubNamespaceName": {
"type": "string"
}
```

### eventHubName
The name of the event hub created in the Event Hubs namespace.

```json
"eventHubName": {
"type": "string"
}
```

### eventHubConsumerGroupName
The name of the consumer group created for the event hub.

```json
"eventHubConsumerGroupName": {
"type": "string"
}
```

### apiVersion
The API version of the template.

```json
"apiVersion": {
"type": "string"
}
```

## Resources to deploy
Creates a namespace of type **EventHubs**, with an event hub and a consumer group.

```json
"resources":[  
      {  
         "apiVersion":"[variables('ehVersion')]",         "name":"[parameters('namespaceName')]",
         "type":"Microsoft.EventHub/namespaces",
         "location":"[variables('location')]",
         "sku":{  
            "name":"Standard",
            "tier":"Standard"
         },
         "resources":[  
            {  

"apiVersion":"[variables('ehVersion')]",               "name":"[parameters('eventHubName')]",
               "type":"EventHubs",
               "dependsOn":[  
                  "[concat('Microsoft.EventHub/namespaces/', parameters('namespaceName'))]"
               ],
               "properties":{  
                  "path":"[parameters('eventHubName')]"
               },
               "resources":[  
                  {  
                     "apiVersion":"[variables('ehVersion')]",                     "name":"[parameters('consumerGroupName')]",
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
[!INCLUDE [app-service-deploy-commands](../../includes/app-service-deploy-commands.md)]

## PowerShell
```powershell
New-AzureRmResourceGroupDeployment -ResourceGroupName \<resource-group-name\> -TemplateFile https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/201-event-hubs-create-event-hub-and-consumer-group/azuredeploy.json
```

## Azure CLI
```cli
azure config mode arm

azure group deployment create \<my-resource-group\> \<my-deployment-name\> --template-uri [https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/201-event-hubs-create-event-hub-and-consumer-group/azuredeploy.json][]
```
# More complex template
Following example shows a more complex ARM template, which deploys event hub namespace with root manage access key, event hub inside of the namespace, default and custom consumer group and two authorization rules for reading and sending of events.  

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {

    "LocationName": {
      "defaultValue": "GermanyCentral",
      "type": "String"
    },


    "Endpoint": {
     // Note that SB endpoint for Azure Environment is different.
      "defaultValue": ".servicebus.cloudapi.de:443/ OR '.servicebus.windows.net:443/'",
      "type": "String"
    },

    
    "PartitionCount": {
      "defaultValue": 4,
      "type": "int"
    },


    "ProductName": {
      "type": "string",
      "defaultValue": "EHNameSpanceName/EHName/yourproductname"
    },

    "InstanceId": {
      "type": "string"
    }
  },
  "variables": {
    // SHows how to build namespace from argument (i.e.: 'InstanceId')
    "EventHubNamespaceName": "[concat('iotservice-', concat(parameters('InstanceId'), '-EventHubs'))]",
    "EventHubName": "[concat(parameters('ProductName'), '-EventHub')]"

  },
  "resources": [
    {
      "comments": "Any comment here",
      "type": "Microsoft.EventHub/namespaces",
      "sku": {
        "name": "Standard",
        "tier": "Standard",
        "capacity": 1
      },
      "kind": "EventHub",
      "name": "[variables('EventHubNamespaceName')]",
      "apiVersion": "2015-08-01",
      "location": "[parameters('LocationName')]",
      "tags": {
        "InstanceId": "[parameters('InstanceId')]",
        "Product": "[parameters('ProductName')]"
      },
      "properties": {
        "serviceBusEndpoint": "[concat('https://', variables('EventHubNamespaceName'), parameters('Endpoint'))]",
        "enabled": true
      },
      "dependsOn": []
    },

    {
      "comments": "RootManageSharedAccessKey on namespace level.",
      "type": "Microsoft.EventHub/namespaces/AuthorizationRules",
m      "name": "[concat(variables('EventHubNamespaceName'), '/RootManageSharedAccessKey')]",
      "apiVersion": "2015-08-01",
      "tags": {
        "InstanceId": "[parameters('InstanceId')]",
        "Product": "[parameters('ProductName')]"
      },
      "properties": {
        "rights": [
          "Listen",
          "Manage",
o          "Send"
        ]
      },
      "dependsOn": [
        "[resourceId('Microsoft.EventHub/namespaces', variables('EventHubNamespaceName'))]"
      ]
    },
    {
      "comments": "...",
      "type": "Microsoft.EventHub/namespaces/eventhubs",
t      "name": "[concat(variables('EventHubNamespaceName'), '/', variables('EventHubName'))]",
      "apiVersion": "2015-08-01",
      "location": "[parameters('LocationName')]",
      "tags": {
        "InstanceId": "[parameters('InstanceId')]",
        "Product": "[parameters('ProductName')]"
      },
      "properties": {
        "messageRetentionInDays": 7,
        "status": "Active",
s        "partitionCount": "[parameters('PartitionCount')]"
      },
      "dependsOn": [
        "[resourceId('Microsoft.EventHub/namespaces', variables('EventHubNamespaceName'))]"
      ]
    },
    {
      "comments": "SharedAccessKey on EventHub level.",
      "type": "Microsoft.EventHub/namespaces/eventhubs/authorizationRules",
      "name": "[concat(variables('EventHubNamespaceName'), '/', variables('EventHubName'), '/RootManageSharedAccessKey')]",
u      "apiVersion": "2015-08-01",
      "location": "[parameters('LocationName')]",
      "tags": {
        "InstanceId": "[parameters('InstanceId')]",
        "Product": "[parameters('ProductName')]"
      },
      "properties": {
        "rights": [
          "Manage",
          "Send",
          "Listen"
        ]
      },
      "dependsOn": [
        "[resourceId('Microsoft.EventHub/namespaces', variables('EventHubNamespaceName'))]",
        "[concat('Microsoft.EventHub/namespaces/', concat(variables('EventHubNamespaceName'), '/eventhubs/', variables('EventHubName')))]"
      ]
    },

    {
      "comments": "$Default consumer group",
      "type": "Microsoft.EventHub/namespaces/eventhubs/consumergroups",
      "name": "[concat(variables('EventHubNamespaceName'), '/', variables('EventHubName'), '/$Default')]",
      "apiVersion": "2015-08-01",
      "location": "[parameters('LocationName')]",
      "tags": {
        "InstanceId": "[parameters('InstanceId')]",
        "Product": "[parameters('ProductName')]"
      },
      "properties": {

      },
      "dependsOn": [
        "[resourceId('Microsoft.EventHub/namespaces', variables('EventHubNamespaceName'))]",
        "[concat('Microsoft.EventHub/namespaces/', concat(variables('EventHubNamespaceName'), '/eventhubs/', variables('EventHubName')))]"
      ]
    },

    {
      "comments": "Custom Consumer Group.",
      "type": "Microsoft.EventHub/namespaces/eventhubs/consumergroups",
      "name": "[concat(variables('EventHubNamespaceName'), '/', variables('EventHubName'), '/', parameters('ProductName'))]",
      "apiVersion": "2015-08-01",
      "location": "[parameters('LocationName')]",
      "tags": {
        "InstanceId": "[parameters('InstanceId')]",
        "Product": "[parameters('ProductName')]"
      },
      "properties": {

      },
      "dependsOn": [
        "[resourceId('Microsoft.EventHub/namespaces', variables('EventHubNamespaceName'))]",
        "[concat('Microsoft.EventHub/namespaces/', concat(variables('EventHubNamespaceName'), '/eventhubs/', variables('EventHubName')))]"
      ]
    },
    {
      "comments": "Send-Rule",
      "type": "Microsoft.EventHub/namespaces/eventhubs/authorizationRules",
      "name": "[concat(variables('EventHubNamespaceName'), '/', variables('EventHubName'), '/send')]",
      "apiVersion": "2015-08-01",
      "location": "[parameters('LocationName')]",
      "tags": {
        "InstanceId": "[parameters('InstanceId')]",
        "Product": "[parameters('ProductName')]"
      },
      "properties": {
        "rights": [
          "Send"
        ]
      },
      "dependsOn": [
        "[resourceId('Microsoft.EventHub/namespaces', variables('EventHubNamespaceName'))]",
        "[concat('Microsoft.EventHub/namespaces/', concat(variables('EventHubNamespaceName'), '/eventhubs/', variables('EventHubName')))]"
      ]
    },
    {
      "comments": "Listen Rule",
      "type": "Microsoft.EventHub/namespaces/eventhubs/authorizationRules",
      "name": "[concat(variables('EventHubNamespaceName'), '/', variables('EventHubName'), '/listen')]",
      "apiVersion": "2015-08-01",
      "tags": {
        "InstanceId": "[parameters('InstanceId')]",
        "Product": "[parameters('ProductName')]"
      },

      "properties": {
        "rights": [
          "Listen"
        ]
      },
      "dependsOn": [
        "[resourceId('Microsoft.EventHub/namespaces', variables('EventHubNamespaceName'))]",
        "[concat('Microsoft.EventHub/namespaces/', concat(variables('EventHubNamespaceName'), '/eventhubs/', variables('EventHubName')))]"

      ]
    }
  ]
}
```

## Next steps
You can learn more about Event Hubs by visiting the following links:

* [Event Hubs overview](event-hubs-what-is-event-hubs.md)
* [Create an event hub](event-hubs-create.md)
* [Event Hubs FAQ](event-hubs-faq.md)

[Authoring Azure Resource Manager templates]: ../azure-resource-manager/resource-group-authoring-templates.md
[Azure Quickstart Templates]:  https://azure.microsoft.com/documentation/templates/?term=event+hubs
[Using Azure PowerShell with Azure Resource Manager]: ../powershell-azure-resource-manager.md
[Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management]: ../xplat-cli-azure-resource-manager.md
[Event hub and consumer group template]: https://github.com/Azure/azure-quickstart-templates/blob/master/201-event-hubs-create-event-hub-and-consumer-group/
