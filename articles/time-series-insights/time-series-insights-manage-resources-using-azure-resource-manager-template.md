---
title: How to manage your Azure Time Series Insights environment using Azure Resource Manager templates| Microsoft Docs
description: This article describes how to manage your Azure Time Series Insights environment programmatically using Azure Resource Manager.
services: time-series-insights
ms.service: time-series-insights
author: sandshadow
ms.author: edett
manager: jhubbard
editor: MicrosoftDocs/tsidocs
ms.reviewer: anshan
ms.devlang: csharp
ms.workload: big-data
ms.topic: article
ms.date: 12/08/2017
---
# Create Time Series Insights resources using Azure Resource Manager templates

This article describes how to create and deploy Time Series Insights resources using Azure Resource Manager templates, PowerShell, and the Time Series Insights resource provider.

Time Series Insights supports the following resources:
   | Resource | Description |
   | --- | --- |
   | Environment | A Time Series Insights environment is a logical grouping of events which are read from event brokers, stored, and made available for query. For more information see [Plan your Azure Time Series Insights environment](./time-series-insights-environment-planning) |
   | Event Source | An event source is a connection to an event broker from which Time Series Insights reads and ingests events into the environment. Currently supported event sources are IoT Hub and Event Hub. |
   | Reference Data Set | Reference data sets provide metadata about the events in the environment. Metadata in the reference data sets will be joined with events during ingress. Reference data sets are defined as resources by their event key properties. The actual metadata that makes up the reference data set is uploaded or modified through data plane APIs. |
   | Access Policy | Access policies grant permissions to issue data queries, manipulate reference data in the environment, and share saved queries and perspectives associated with the environment. For more information see [Grant data access to a Time Series Insights environment using Azure portal](./time-series-insights-data-access) |

A Resource Manager template is a JSON file that defines the infrastructure and configuration of resources in a resource group. For more information see the following documents:
-[Azure Resource Manager overview - Template deployment](../azure-resource-manager/resource-group-overview#template-deployment)
-[Deploy resources with Resource Manager templates and Azure PowerShell](../azure-resource-manager/resource-group-template-deploy)

The [201-timeseriesinsights-environment-with-eventhub](https://github.com/Azure/azure-quickstart-templates/tree/master/201-timeseriesinsights-environment-with-eventhub) quickstart template is published on GitHub. This template creates a Time Series Insights environment, a child event source configured to consume events from an Event Hub, and access policies that grant access to the environment's data. If an existing Event Hub isn't specified, one will be created with the deployment.

## Deploy the quickstart template locally using PowerShell

The following procedure describes how to use PowerShell to deploy an Azure Resource Manager template that creates a Time Series Insights environment, a child event source configured to consume events from an Event Hub, and access policies that grant access to the environment's data. If an existing Event Hub isn't specified, one will be created with the deployment.

The approximate workflow is as follows:

1. Install PowerShell.
1. Create the template and a parameter file.
1. In PowerShell, log in to your Azure account.
1. Create a new resource group if one does not exist.
1. Test the deployment.
1. Deploy the template.

### Install PowerShell

Install Azure PowerShell by following the instructions in [Getting started with Azure PowerShell](/powershell/azure/get-started-azureps).

### Create a template

Clone or copy the [201-timeseriesinsights-environment-with-eventhub](https://github.com/Azure/azure-quickstart-templates/tree/master/201-timeseriesinsights-environment-with-eventhub) template from GitHub:

```json
{
  "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "eventHubNamespaceName": {
      "type": "string",
      "metadata": {
        "description": "The namespace of the source event hub."
      }
    },
    "eventHubName": {
      "type": "string",
      "metadata": {
        "description": "The name of the source event hub."
      }
    },
    "consumerGroupName": {
      "type": "string",
      "metadata": {
        "description": "The name of the consumer group that the Time Series Insights service will use to read the data from the event hub. NOTE: To avoid resource contention, this consumer group must be dedicated to the Time Series Insights service and not shared with other readers."
      }
    },
    "existingEventHubResourceId": {
      "type": "string",
      "defaultValue": "",
      "metadata": {
        "description": "An optional resource id of an existing Event Hub that will be connected to the Time Series Insights environment through the event source. NOTE: The user deploying the template must have privileges to perform the listkeys operation on the Event Hub. If no value is passed, a new event hub will be created by the template."
      }
    },
    "environmentName": {
      "type": "string",
      "maxLength": 90,
      "metadata": {
        "description": "Name of the environment. The name cannot include:   '<', '>', '%', '&', ':', '\\', '?', '/' and any control characters. All other characters are allowed."
      }
    },
    "environmentDisplayName": {
      "type": "string",
      "defaultValue": "",
      "maxLength": 90,
      "metadata": {
        "description": "An optional friendly name to show in tooling or user interfaces instead of the environment name."
      }
    },
    "environmentSkuName": {
      "type": "string",
      "defaultValue": "S1",
      "allowedValues": [
        "S1",
        "S2"
      ],
      "metadata": {
        "description": "The name of the sku. For more information, see https://azure.microsoft.com/pricing/details/time-series-insights/"
      }
    },
    "environmentSkuCapacity": {
      "type": "int",
      "defaultValue": 1,
      "minValue": 1,
      "maxValue": 10,
      "metadata": {
        "description": "The unit capacity of the Sku. For more information, see https://azure.microsoft.com/pricing/details/time-series-insights/"
      }
    },
    "environmentDataRetentionTime": {
      "type": "string",
      "defaultValue": "P30D",
      "metadata": {
        "description": "The minimum timespan the environment’s events will be available for query. The value must be specified in the ISO 8601 format, e.g. \"P30D\" for a retention policy of 30 days."
      }
    },
    "eventSourceName": {
      "type": "string",
      "maxLength": 90,
      "metadata": {
        "description": "Name of the event source child resource. The name cannot include:   '<', '>', '%', '&', ':', '\\', '?', '/' and any control characters. All other characters are allowed."
      }
    },
    "eventSourceDisplayName": {
      "type": "string",
      "defaultValue": "",
      "maxLength": 90,
      "metadata": {
        "description": "An optional friendly name to show in tooling or user interfaces instead of the event source name."
      }
    },
    "eventSourceTimestampPropertyName": {
      "type": "string",
      "defaultValue": "",
      "maxLength": 90,
      "metadata": {
        "description": "The event property that will be used as the event source's timestamp. If a value isn't specified for timestampPropertyName, or if null or empty-string is specified, the event creation time will be used."
      }
    },
    "eventSourceKeyName": {
      "type": "string",
      "defaultValue": "manage",
      "metadata": {
        "description": "The name of the shared access key that the Time Series Insights service will use to connect to the event hub."
      }
    },
    "accessPolicyReaderObjectIds": {
      "type": "array",
      "defaultValue": [],
      "metadata": {
        "description": "A list of object ids of the users or applications in AAD that should have Reader access to the environment. The service principal objectId can be obtained by calling the Get-AzureRMADUser or the Get-AzureRMADServicePrincipal cmdlets. Creating an access policy for AAD groups is not yet supported."
      }
    },
    "accessPolicyContributorObjectIds": {
      "type": "array",
      "defaultValue": [],
      "metadata": {
        "description": "A list of object ids of the users or applications in AAD that should have Contributor access to the environment. The service principal objectId can be obtained by calling the Get-AzureRMADUser or the Get-AzureRMADServicePrincipal cmdlets. Creating an access policy for AAD groups is not yet supported."
      }
    }
  },
  "variables": {
    "environmentTagsOptions": [
      null,
      {
        "displayName": "[parameters('environmentDisplayName')]"
      }
    ],
    "environmentTagsValue": "[variables('environmentTagsOptions')[length(take(parameters('environmentDisplayName'), 1))]]",
    "eventSourceTagsOptions": [
      null,
      {
        "displayName": "[parameters('eventSourceDisplayName')]"
      }
    ],
    "eventSourceTagsValue": "[variables('eventSourceTagsOptions')[length(take(parameters('eventSourceDisplayName'), 1))]]",
    "eventSourceResourceId": "[if(empty(parameters('existingEventHubResourceId')), resourceId('Microsoft.EventHub/Namespaces/EventHubs', parameters('eventHubNamespaceName'), parameters('eventHubName')), parameters('existingEventHubResourceId'))]",
    "authorizationRuleResourceId": "[if(empty(parameters('existingEventHubResourceId')), resourceId('Microsoft.EventHub/Namespaces/EventHubs/AuthorizationRules', parameters('eventHubNamespaceName'), parameters('eventHubName'), parameters('eventSourceKeyName')), concat(parameters('existingEventHubResourceId'), '/authorizationRules/', parameters('eventSourceKeyName')))]"
  },
  "resources": [
    {
      "condition": "[empty(parameters('existingEventHubResourceId'))]",
      "apiVersion": "2017-04-01",
      "name": "[parameters('eventHubNamespaceName')]",
      "type": "Microsoft.EventHub/Namespaces",
      "location": "[resourceGroup().location]",
      "sku": {
        "name": "Standard"
      },
      "properties": {
        "isAutoInflateEnabled": "true",
        "maximumThroughputUnits": "20"
      },
      "resources": [
        {
          "condition": "[empty(parameters('existingEventHubResourceId'))]",
          "apiVersion": "2017-04-01",
          "name": "[parameters('eventHubName')]",
          "type": "EventHubs",
          "dependsOn": [
            "[concat('Microsoft.EventHub/namespaces/', parameters('eventHubNamespaceName'))]"
          ],
          "properties": {
            "messageRetentionInDays": "7",
            "partitionCount": "4"
          },
          "resources": [
            {
              "condition": "[empty(parameters('existingEventHubResourceId'))]",
              "type": "AuthorizationRules",
              "name": "[parameters('eventSourceKeyName')]",
              "apiVersion": "2017-04-01",
              "location": "[resourceGroup().location]",
              "dependsOn": [
                "[parameters('eventHubName')]"
              ],
              "properties": {
                "rights": [
                  "Listen",
                  "Send",
                  "Manage"
                ]
              }
            },
            {
              "condition": "[empty(parameters('existingEventHubResourceId'))]",
              "apiVersion": "2017-04-01",
              "name": "[parameters('consumerGroupName')]",
              "type": "ConsumerGroups",
              "dependsOn": [
                "[parameters('eventHubName')]"
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "Microsoft.TimeSeriesInsights/environments",
      "name": "[parameters('environmentName')]",
      "apiVersion": "2017-11-15",
      "location": "[resourceGroup().location]",
      "properties": {
        "dataRetentionTime": "[parameters('environmentDataRetentionTime')]"
      },
      "sku": {
        "name": "[parameters('environmentSkuName')]",
        "capacity": "[parameters('environmentSkuCapacity')]"
      },
      "tags": "[variables('environmentTagsValue')]",
      "resources": [
        {
          "type": "eventsources",
          "name": "[parameters('eventSourceName')]",
          "apiVersion": "2017-11-15",
          "location": "[resourceGroup().location]",
          "kind": "Microsoft.EventHub",
          "properties": {
            "eventSourceResourceId": "[variables('eventSourceResourceId')]",
            "eventHubName": "[parameters('eventHubName')]",
            "serviceBusNamespace" : "[parameters('eventHubNamespaceName')]",
            "consumerGroupName": "[parameters('consumerGroupName')]",
            "keyName": "[parameters('eventSourceKeyName')]",
            "sharedAccessKey": "[listkeys(variables('authorizationRuleResourceId'), '2017-04-01').primaryKey]",
            "timestampPropertyName": "[parameters('eventSourceTimestampPropertyName')]"
          },
          "tags": "[variables('eventSourceTagsValue')]",
          "dependsOn": [
            "[concat('Microsoft.TimeSeriesInsights/environments/', parameters('environmentName'))]",
            "[resourceId('Microsoft.EventHub/Namespaces/EventHubs/ConsumerGroups', parameters('eventHubNamespaceName'), parameters('eventHubName'), parameters('consumerGroupName'))]",
            "[resourceId('Microsoft.EventHub/Namespaces/EventHubs/AuthorizationRules', parameters('eventHubNamespaceName'), parameters('eventHubName'), parameters('eventSourceKeyName'))]"
          ]
        }
      ]
    },
    {
      "condition": "[not(empty(parameters('accessPolicyReaderObjectIds')))]",
      "type": "Microsoft.TimeSeriesInsights/environments/accesspolicies",
      "name": "[concat(parameters('environmentName'), '/', 'readerAccessPolicy', copyIndex())]",
      "copy": { 
        "name": "accessPolicyReaderCopy", 
        "count": "[if(empty(parameters('accessPolicyReaderObjectIds')), 1, length(parameters('accessPolicyReaderObjectIds')))]"
      },
      "apiVersion": "2017-11-15",
      "properties": {
        "principalObjectId": "[parameters('accessPolicyReaderObjectIds')[copyIndex()]]",
        "roles": ["Reader"]
      },
      "dependsOn": [
        "[concat('Microsoft.TimeSeriesInsights/environments/', parameters('environmentName'))]"
      ]
    },
    {
      "condition": "[not(empty(parameters('accessPolicyContributorObjectIds')))]",
      "type": "Microsoft.TimeSeriesInsights/environments/accesspolicies",
      "name": "[concat(parameters('environmentName'), '/', 'contributorAccessPolicy', copyIndex())]",
      "copy": { 
        "name": "accessPolicyReaderCopy", 
        "count": "[if(empty(parameters('accessPolicyContributorObjectIds')), 1, length(parameters('accessPolicyContributorObjectIds')))]"
      },
      "apiVersion": "2017-11-15",
      "properties": {
        "principalObjectId": "[parameters('accessPolicyContributorObjectIds')[copyIndex()]]",
        "roles": ["Contributor"]
      },
      "dependsOn": [
        "[concat('Microsoft.TimeSeriesInsights/environments/', parameters('environmentName'))]"
      ]
    }
  ],
  "outputs": {
    "dataAccessFQDN": {
      "value": "[reference(resourceId('Microsoft.TimeSeriesInsights/environments', parameters('environmentName'))).dataAccessFQDN]",
      "type": "string"
    }
  }
}
```

### Create a parameters file

To create a parameters file, copy the [201-timeseriesinsights-environment-with-eventhub](https://github.com/Azure/azure-quickstart-templates/blob/master/201-timeseriesinsights-environment-with-eventhub/azuredeploy.parameters.json) file.

```json
{
  "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
      "eventHubNamespaceName": {
          "value": "GEN-UNIQUE"
      },
      "eventHubName": {
          "value": "GEN-UNIQUE"
      },
      "consumerGroupName": {
          "value": "GEN-UNIQUE"
      },
      "environmentName": {
        "value": "GEN-UNIQUE"
      },
      "eventSourceName": {
        "value": "GEN-UNIQUE"
      }
  }
}
```

#### Required Parameters

   | Parameter | Description |
   | --- | --- |
   | eventHubNamespaceName | The namespace of the source event hub. |
   | eventHubName | The name of the source event hub. |
   | consumerGroupName | The name of the consumer group that the Time Series Insights service will use to read the data from the event hub. **NOTE:** To avoid resource contention, this consumer group must be dedicated to the Time Series Insights service and not shared with other readers. |
   | environmentName | The name of the environment. The name cannot include:   '<', '>', '%', '&', ':', '\\', '?', '/' and any control characters. All other characters are allowed.|
   | eventSourceName | The name of the event source child resource. The name cannot include:   '<', '>', '%', '&', ':', '\\', '?', '/' and any control characters. All other characters are allowed. |

#### Optional Parameters

   | Parameter | Description |
   | --- | --- |
   | existingEventHubResourceId | An optional resource ID of an existing Event Hub that will be connected to the Time Series Insights environment through the event source. **NOTE:** The user deploying the template must have privileges to perform the listkeys operation on the Event Hub. If no value is passed, a new event hub will be created by the template. |
   | environmentDisplayName | An optional friendly name to show in tooling or user interfaces instead of the environment name. |
   | environmentSkuName | The name of the sku. For more information, see the [Time Series Insights Pricing page](https://azure.microsoft.com/pricing/details/time-series-insights/).  |
   | environmentSkuCapacity | The unit capacity of the Sku. For more information, see the [Time Series Insights Pricing page](https://azure.microsoft.com/pricing/details/time-series-insights/).|
   | environmentDataRetentionTime | The minimum timespan the environment’s events will be available for query. The value must be specified in the ISO 8601 format, for example "P30D" for a retention policy of 30 days. |
   | eventSourceDisplayName | An optional friendly name to show in tooling or user interfaces instead of the event source name. |
   | eventSourceTimestampPropertyName | The event property that will be used as the event source's timestamp. If a value isn't specified for timestampPropertyName, or if null or empty-string is specified, the event creation time will be used. |
   | eventSourceKeyName | The name of the shared access key that the Time Series Insights service will use to connect to the event hub. |
   | accessPolicyReaderObjectIds | A list of object IDs of the users or applications in AAD that should have Reader access to the environment. The service principal objectId can be obtained by calling the **Get-AzureRMADUser** or the **Get-AzureRMADServicePrincipal** cmdlets. Creating an access policy for AAD groups is not yet supported. |
   | accessPolicyContributorObjectIds | A list of object IDs of the users or applications in AAD that should have Contributor access to the environment. The service principal objectId can be obtained by calling the **Get-AzureRMADUser** or the **Get-AzureRMADServicePrincipal** cmdlets. Creating an access policy for AAD groups is not yet supported. |

As an example, the following parameters file would be used to create an environment and an event source that reads events from an existing event hub. It also creates two access policies that grant Contributor access to the environment.

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "eventHubNamespaceName": {
            "value": "tsiTemplateTestNamespace"
        },
        "eventHubName": {
            "value": "tsiTemplateTestEventHub"
        },
        "consumerGroupName": {
            "value": "tsiTemplateTestConsumerGroup"
        },
        "environmentName": {
          "value": "tsiTemplateTestEnvironment"
        },
        "eventSourceName": {
          "value": "tsiTemplateTestEventSource"
        },
        "existingEventHubResourceId": {
          "value": "/subscriptions/{yourSubscription}/resourceGroups/MyDemoRG/providers/Microsoft.EventHub/namespaces/tsiTemplateTestNamespace/eventhubs/tsiTemplateTestEventHub"
        },
        "accessPolicyContributorObjectIds": {
            "value": [
                "AGUID001-0000-0000-0000-000000000000",
                "AGUID002-0000-0000-0000-000000000000"
            ]
        }
    }
  }
```

For more information, see the [Parameters](../azure-resource-manager/resource-group-template-deploy.md#parameter-files) article.

### Log in to Azure and set the Azure subscription

From a PowerShell prompt, run the following command:

```powershell
Login-AzureRmAccount
```

You are prompted to log on to your Azure account. After logging on, run the following command to view your available subscriptions:

```powershell
Get-AzureRMSubscription
```

This command returns a list of available Azure subscriptions. Choose a subscription for the current session by running the following command. Replace `<YourSubscriptionId>` with the GUID for the Azure subscription you want to use:

```powershell
Set-AzureRmContext -SubscriptionID <YourSubscriptionId>
```

### Set the resource group

If you do not have an existing resource group, create a new resource group with the **New-AzureRmResourceGroup** command. Provide the name of the resource group and location you want to use. For example:

```powershell
New-AzureRmResourceGroup -Name MyDemoRG -Location "West US"
```

If successful, a summary of the new resource group is displayed.

```powershell
ResourceGroupName : MyDemoRG
Location          : westus
ProvisioningState : Succeeded
Tags              :
ResourceId        : /subscriptions/<GUID>/resourceGroups/MyDemoRG
```

### Test the deployment

Validate your deployment by running the `Test-AzureRmResourceGroupDeployment` cmdlet. When testing the deployment, provide parameters exactly as you would when executing the deployment.

```powershell
Test-AzureRmResourceGroupDeployment -ResourceGroupName MyDemoRG -TemplateFile <path to template file>\azuredeploy.json -TemplateParameterFile <path to parameters file>\azuredeploy.parameters.json
```

### Create the deployment

To create the new deployment, run the `New-AzureRmResourceGroupDeployment` cmdlet, and provide the necessary parameters when prompted. The parameters include a name for your deployment, the name of your resource group, and the path or URL to the template file. If the **Mode** parameter is not specified, the default value of **Incremental** is used. For more information, see [Incremental and complete deployments](../azure-resource-manager/resource-group-template-deploy.md#incremental-and-complete-deployments).

The following command prompts you for the five required parameters in the PowerShell window:

```powershell
New-AzureRmResourceGroupDeployment -Name MyDemoDeployment -ResourceGroupName MyDemoRG -TemplateFile <path to template file>\azuredeploy.json 
```

To specify a parameters file instead, use the following command:

```powershell
New-AzureRmResourceGroupDeployment -Name MyDemoDeployment -ResourceGroupName MyDemoRG -TemplateFile <path to template file>\azuredeploy.json -TemplateParameterFile <path to parameters file>\azuredeploy.parameters.json
```

You can also use inline parameters when you run the deployment cmdlet. The command is as follows:

```powershell
New-AzureRmResourceGroupDeployment -Name MyDemoDeployment -ResourceGroupName MyDemoRG -TemplateFile <path to template file>\azuredeploy.json -parameterName "parameterValue"
```

To run a [complete](../azure-resource-manager/resource-group-template-deploy.md#incremental-and-complete-deployments) deployment, set the **Mode** parameter to **Complete**:

```powershell
New-AzureRmResourceGroupDeployment -Name MyDemoDeployment -Mode Complete -ResourceGroupName MyDemoRG -TemplateFile <path to template file>\azuredeploy.json
```

## Verify the deployment

If the resources are deployed successfully, a summary of the deployment is displayed in the PowerShell window:

```powershell
DeploymentName          : azuredeploy
ResourceGroupName       : MyDemoRG
ProvisioningState       : Succeeded
Timestamp               : 12/9/2017 01:06:54
Mode                    : Incremental
TemplateLink            :
Parameters              :
                          Name             Type                       Value
                          ===============  =========================  ==========
                          eventHubNamespaceName  String               <eventHubNamespaceName>
                          eventHubName     String                     <eventHubName>
                          consumerGroupName  String                   <consumerGroupName>
                          existingEventHubResourceId  String
                          environmentName  String                     <environmentName>
                          environmentDisplayName  String
                          environmentSkuName  String                  S1
                          environmentSkuCapacity  Int                 1
                          environmentDataRetentionTime  String        P30D
                          eventSourceName  String                     <eventSourceName>
                          eventSourceDisplayName  String
                          eventSourceTimestampPropertyName  String
                          eventSourceKeyName  String                  manage
                          accessPolicyReaderObjectIds  Array          []
                          accessPolicyContributorObjectIds  Array     [
                            "AGUID001-0000-0000-0000-000000000000",
                            "AGUID002-0000-0000-0000-000000000000"
                          ]

Outputs                 :
                          Name             Type                       Value
                          ===============  =========================  ==========
                          dataAccessFQDN   String
                          <guid>.env.timeseries.azure.com
```

## Deploy the quickstart template through the Azure portal

The quickstart template's home page on GitHub also includes a **Deploy to Azure** button. Clicking it opens a Custom Deployment page in the Azure portal. From this page, you can enter or select values for each of the parameters from the [required parameters](./time-series-insights/time-series-insights-manage-resources-using-azure-resource-manager-template#required-parameters) or [optional parameters](.//time-series-insights/time-series-insights-manage-resources-using-azure-resource-manager-template#optional-parameters) tables. After filling out the settings, clicking the **Purchase** button will initiate the template deployment.

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F201-timeseriesinsights-environment-with-eventhub%2Fazuredeploy.json" target="_blank">
    <img src="http://azuredeploy.net/deploybutton.png"/>
</a>