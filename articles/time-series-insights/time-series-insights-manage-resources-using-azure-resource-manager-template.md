---
title: 'Manage your environment using Azure Resource Manager templates - Azure Time Series Insights | Microsoft Docs'
description: Learn how to manage your Azure Time Series Insights environment programmatically using Azure Resource Manager.
ms.service: time-series-insights
services: time-series-insights
author: deepakpalled
ms.author: dpalled
manager: cshankar
ms.devlang: csharp
ms.workload: big-data
ms.topic: conceptual
ms.date: 12/06/2019
ms.custom: seodec18
---

# Create Time Series Insights resources using Azure Resource Manager templates

This article describes how to create and deploy Time Series Insights resources using [Azure Resource Manager templates](https://docs.microsoft.com/azure/azure-resource-manager/), PowerShell, and the Time Series Insights resource provider.

Time Series Insights supports the following resources:

   | Resource | Description |
   | --- | --- |
   | Environment | A Time Series Insights environment is a logical grouping of events that are read from event brokers, stored, and made available for query. For more information, read [Plan your Azure Time Series Insights environment](time-series-insights-environment-planning.md) |
   | Event Source | An event source is a connection to an event broker from which Time Series Insights reads and ingests events into the environment. Currently supported event sources are IoT Hub and Event Hub. |
   | Reference Data Set | Reference data sets provide metadata about the events in the environment. Metadata in the reference data sets will be joined with events during ingress. Reference data sets are defined as resources by their event key properties. The actual metadata that makes up the reference data set is uploaded or modified through data plane APIs. |
   | Access Policy | Access policies grant permissions to issue data queries, manipulate reference data in the environment, and share saved queries and perspectives associated with the environment. For more information, read [Grant data access to a Time Series Insights environment using Azure portal](time-series-insights-data-access.md) |

A Resource Manager template is a JSON file that defines the infrastructure and configuration of resources in a resource group. The following documents describe template files in greater detail:

- [Azure Resource Manager template deployment](../azure-resource-manager/templates/overview.md)
- [Deploy resources with Resource Manager templates and Azure PowerShell](../azure-resource-manager/templates/deploy-powershell.md)
- [Microsoft.TimeSeriesInsights resource types](/azure/templates/microsoft.timeseriesinsights/allversions)

The [201-timeseriesinsights-environment-with-eventhub](https://github.com/Azure/azure-quickstart-templates/tree/master/201-timeseriesinsights-environment-with-eventhub) quickstart template is published on GitHub. This template creates a Time Series Insights environment, a child event source configured to consume events from an Event Hub, and access policies that grant access to the environment's data. If an existing Event Hub isn't specified, one will be created with the deployment.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Specify deployment template and parameters

The following procedure describes how to use PowerShell to deploy an Azure Resource Manager template that creates a Time Series Insights environment, a child event source configured to consume events from an Event Hub, and access policies that grant access to the environment's data. If an existing Event Hub isn't specified, one will be created with the deployment.

1. Install Azure PowerShell by following the instructions in [Getting started with Azure PowerShell](https://docs.microsoft.com/powershell/azure/get-started-azureps).

1. Clone or copy the [201-timeseriesinsights-environment-with-eventhub](https://github.com/Azure/azure-quickstart-templates/blob/master/201-timeseriesinsights-environment-with-eventhub/azuredeploy.json) template from GitHub.

   * Create a parameters file

     To create a parameters file, copy the [201-timeseriesinsights-environment-with-eventhub](https://github.com/Azure/azure-quickstart-templates/blob/master/201-timeseriesinsights-environment-with-eventhub/azuredeploy.parameters.json) file.

      [!code-json[deployment-parameters](~/quickstart-templates/201-timeseriesinsights-environment-with-eventhub/azuredeploy.parameters.json)]

    <div id="required-parameters"></div>

   * Required Parameters

     | Parameter | Description |
     | --- | --- |
     | eventHubNamespaceName | The namespace of the source event hub. |
     | eventHubName | The name of the source event hub. |
     | consumerGroupName | The name of the consumer group that the Time Series Insights service will use to read the data from the event hub. **NOTE:** To avoid resource contention, this consumer group must be dedicated to the Time Series Insights service and not shared with other readers. |
     | environmentName | The name of the environment. The name cannot include:   `<`, `>`, `%`, `&`, `:`, `\\`, `?`, `/`, and any control characters. All other characters are allowed.|
     | eventSourceName | The name of the event source child resource. The name cannot include:   `<`, `>`, `%`, `&`, `:`, `\\`, `?`, `/`, and any control characters. All other characters are allowed. |

    <div id="optional-parameters"></div>

   * Optional Parameters

     | Parameter | Description |
     | --- | --- |
     | existingEventHubResourceId | An optional resource ID of an existing Event Hub that will be connected to the Time Series Insights environment through the event source. **NOTE:** The user deploying the template must have privileges to perform the listkeys operation on the Event Hub. If no value is passed, a new event hub will be created by the template. |
     | environmentDisplayName | An optional friendly name to show in tooling or user interfaces instead of the environment name. |
     | environmentSkuName | The name of the sku. For more information, read the [Time Series Insights Pricing page](https://azure.microsoft.com/pricing/details/time-series-insights/).  |
     | environmentSkuCapacity | The unit capacity of the Sku. For more information, read the [Time Series Insights Pricing page](https://azure.microsoft.com/pricing/details/time-series-insights/).|
     | environmentDataRetentionTime | The minimum timespan the environment’s events will be available for query. The value must be specified in the ISO 8601 format, for example `P30D` for a retention policy of 30 days. |
     | eventSourceDisplayName | An optional friendly name to show in tooling or user interfaces instead of the event source name. |
     | eventSourceTimestampPropertyName | The event property that will be used as the event source's timestamp. If a value isn't specified for timestampPropertyName, or if null or empty-string is specified, the event creation time will be used. |
     | eventSourceKeyName | The name of the shared access key that the Time Series Insights service will use to connect to the event hub. |
     | accessPolicyReaderObjectIds | A list of object IDs of the users or applications in Azure AD that should have Reader access to the environment. The service principal objectId can be obtained by calling the **Get-AzADUser** or the **Get-AzADServicePrincipal** cmdlets. Creating an access policy for Azure AD groups is not yet supported. |
     | accessPolicyContributorObjectIds | A list of object IDs of the users or applications in Azure AD that should have Contributor access to the environment. The service principal objectId can be obtained by calling the **Get-AzADUser** or the **Get-AzADServicePrincipal** cmdlets. Creating an access policy for Azure AD groups is not yet supported. |

   * As an example, the following parameters file would be used to create an environment and an event source that reads events from an existing event hub. It also creates two access policies that grant Contributor access to the environment.

     ```JSON
     {
         "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
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

    * For more information, read the [Parameters](../azure-resource-manager/templates/parameter-files.md) article.

## Deploy the quickstart template locally using PowerShell

> [!IMPORTANT]
> The command-line operations displayed below describe the [Az PowerShell module](https://docs.microsoft.com/powershell/azure/overview).

1. In PowerShell, log in to your Azure account.

    * From a PowerShell prompt, run the following command:

      ```powershell
      Connect-AzAccount
      ```

    * You are prompted to log on to your Azure account. After logging on, run the following command to view your available subscriptions:

      ```powershell
      Get-AzSubscription
      ```

    * This command returns a list of available Azure subscriptions. Choose a subscription for the current session by running the following command. Replace `<YourSubscriptionId>` with the GUID for the Azure subscription you want to use:

      ```powershell
      Set-AzContext -SubscriptionID <YourSubscriptionId>
      ```

1. Create a new resource group if one does not exist.

   * If you do not have an existing resource group, create a new resource group with the **New-AzResourceGroup** command. Provide the name of the resource group and location you want to use. For example:

     ```powershell
     New-AzResourceGroup -Name MyDemoRG -Location "West US"
     ```

   * If successful, a summary of the new resource group is displayed.

     ```powershell
     ResourceGroupName : MyDemoRG
     Location          : westus
     ProvisioningState : Succeeded
     Tags              :
     ResourceId        : /subscriptions/<GUID>/resourceGroups/MyDemoRG
     ```

1. Test the deployment.

   * Validate your deployment by running the `Test-AzResourceGroupDeployment` cmdlet. When testing the deployment, provide parameters exactly as you would when executing the deployment.

     ```powershell
     Test-AzResourceGroupDeployment -ResourceGroupName MyDemoRG -TemplateFile <path to template file>\azuredeploy.json -TemplateParameterFile <path to parameters file>\azuredeploy.parameters.json
     ```

1. Create the deployment

    * To create the new deployment, run the `New-AzResourceGroupDeployment` cmdlet, and provide the necessary parameters when prompted. The parameters include a name for your deployment, the name of your resource group, and the path or URL to the template file. If the **Mode** parameter is not specified, the default value of **Incremental** is used. For more information, read [Incremental and complete deployments](../azure-resource-manager/templates/deployment-modes.md).

    * The following command prompts you for the five required parameters in the PowerShell window:

      ```powershell
      New-AzResourceGroupDeployment -Name MyDemoDeployment -ResourceGroupName MyDemoRG -TemplateFile <path to template file>\azuredeploy.json
      ```

    * To specify a parameters file instead, use the following command:

      ```powershell
      New-AzResourceGroupDeployment -Name MyDemoDeployment -ResourceGroupName MyDemoRG -TemplateFile <path to template file>\azuredeploy.json -TemplateParameterFile <path to parameters file>\azuredeploy.parameters.json
      ```

    * You can also use inline parameters when you run the deployment cmdlet. The command is as follows:

      ```powershell
      New-AzResourceGroupDeployment -Name MyDemoDeployment -ResourceGroupName MyDemoRG -TemplateFile <path to template file>\azuredeploy.json -parameterName "parameterValue"
      ```

    * To run a [complete](../azure-resource-manager/templates/deployment-modes.md) deployment, set the **Mode** parameter to **Complete**:

      ```powershell
      New-AzResourceGroupDeployment -Name MyDemoDeployment -Mode Complete -ResourceGroupName MyDemoRG -TemplateFile <path to template file>\azuredeploy.json
      ```

1. Verify the deployment

    * If the resources are deployed successfully, a summary of the deployment is displayed in the PowerShell window:

      ```powershell
       DeploymentName          : MyDemoDeployment
       ResourceGroupName       : MyDemoRG
       ProvisioningState       : Succeeded
       Timestamp               : 10/11/2019 3:20:37 AM
       Mode                    : Incremental
       TemplateLink            :
       Parameters              :
                                 Name                                Type                       Value
                                 ==================================  =========================  ==========
                                 eventHubNewOrExisting               String                     new
                                 eventHubResourceGroup               String                     MyDemoRG
                                 eventHubNamespaceName               String                     tsiquickstartns
                                 eventHubName                        String                     tsiquickstarteh
                                 consumerGroupName                   String                     tsiquickstart
                                 environmentName                     String                     tsiquickstart
                                 environmentDisplayName              String                     tsiquickstart
                                 environmentSkuName                  String                     S1
                                 environmentSkuCapacity              Int                        1
                                 environmentDataRetentionTime        String                     P30D
                                 eventSourceName                     String                     tsiquickstart
                                 eventSourceDisplayName              String                     tsiquickstart
                                 eventSourceTimestampPropertyName    String
                                 eventSourceKeyName                  String                     manage
                                 accessPolicyReaderObjectIds         Array                      []
                                 accessPolicyContributorObjectIds    Array                      []
                                 location                            String                     westus

       Outputs                 :
                                  Name              Type                       Value
                                  ================  =========================  ==========
                                  dataAccessFQDN    String
                                  11aa1aa1-a1aa-1a1a-a11a-aa111a111a11.env.timeseries.azure.com

       DeploymentDebugLogLevel :
      ```

1. Deploy the quickstart template through the Azure portal

   * The quickstart template's home page on GitHub also includes a **Deploy to Azure** button. Clicking it opens a Custom Deployment page in the Azure portal. From this page, you can enter or select values for each of the parameters from the [required parameters](#required-parameters) or [optional parameters](#optional-parameters) tables. After filling out the settings, clicking the **Purchase** button will initiate the template deployment.
    </br>
    </br>
    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F201-timeseriesinsights-environment-with-eventhub%2Fazuredeploy.json" target="_blank">
       <img src="https://azuredeploy.net/deploybutton.png"/>
    </a>

## Next steps

- For information on programmatically managing Time Series Insights resources using REST APIs, read [Time Series Insights Management](https://docs.microsoft.com/rest/api/time-series-insights-management/).
