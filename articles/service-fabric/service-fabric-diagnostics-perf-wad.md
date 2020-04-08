---
title: Performance monitoring with Windows Azure Diagnostics
description: Use Windows Azure Diagnostics to collect performance counters for your Azure Service Fabric clusters.
author: srrengar

ms.topic: conceptual
ms.date: 11/21/2018
ms.author: srrengar
---

# Performance monitoring with the Windows Azure Diagnostics extension

This document covers steps required to set up collection of performance counters via the Windows Azure Diagnostics (WAD) extension for Windows clusters. For Linux clusters, set up the [Log Analytics agent](service-fabric-diagnostics-oms-agent.md) to collect performance counters for your nodes. 

 > [!NOTE]
> The WAD extension should be deployed on your cluster for these steps to work for you. If it is not set up, head over to [Event aggregation and collection using Windows Azure Diagnostics](service-fabric-diagnostics-event-aggregation-wad.md).  


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Collect performance counters via the WadCfg

To collect performance counters via WAD, you need to modify the configuration appropriately in your cluster's Resource Manager template. Follow these steps to add a performance counter you want to collect to your template and run a Resource Manager resource upgrade.

1. Find the WAD configuration in your cluster's template - find `WadCfg`. You will be adding performance counters to collect under the `DiagnosticMonitorConfiguration`.

2. Set up your configuration to collect performance counters by adding the following section to your `DiagnosticMonitorConfiguration`. 

    ```json
    "PerformanceCounters": {
        "scheduledTransferPeriod": "PT1M",
        "PerformanceCounterConfiguration": []
    }
    ```

    The `scheduledTransferPeriod` defines how frequently the values of the counters that are collected are transferred to your Azure storage table and to any configured sink. 

3. Add the performance counters you would like to collect to the `PerformanceCounterConfiguration` that was declared in the previous step. Each counter you would like to collect is defined with a `counterSpecifier`, `sampleRate`, `unit`, `annotation`, and any relevant `sinks`.

Here is an example of a configuration with the counter for the *Total Processor Time* (the amount of time the CPU was in use for processing operations) and *Service Fabric Actor Method Invocations per Second*, one of the Service Fabric custom performance counters. Refer to [Reliable Actor Performance Counters](service-fabric-reliable-actors-diagnostics.md#list-of-events-and-performance-counters) and [Reliable Service Performance Counters](service-fabric-reliable-serviceremoting-diagnostics.md#list-of-performance-counters) for a full list of Service Fabric custom perf counters.

 ```json
 "WadCfg": {
         "DiagnosticMonitorConfiguration": {
           "overallQuotaInMB": "50000",
           "EtwProviders": {
             "EtwEventSourceProviderConfiguration": [
               {
                 "provider": "Microsoft-ServiceFabric-Actors",
                 "scheduledTransferKeywordFilter": "1",
                 "scheduledTransferPeriod": "PT5M",
                 "DefaultEvents": {
                   "eventDestination": "ServiceFabricReliableActorEventTable"
                 }
               },
               {
                 "provider": "Microsoft-ServiceFabric-Services",
                 "scheduledTransferPeriod": "PT5M",
                 "DefaultEvents": {
                   "eventDestination": "ServiceFabricReliableServiceEventTable"
                 }
               }
             ],
             "EtwManifestProviderConfiguration": [
               {
                 "provider": "cbd93bc2-71e5-4566-b3a7-595d8eeca6e8",
                 "scheduledTransferLogLevelFilter": "Information",
                 "scheduledTransferKeywordFilter": "4611686018427387904",
                 "scheduledTransferPeriod": "PT5M",
                 "DefaultEvents": {
                   "eventDestination": "ServiceFabricSystemEventTable"
                 }
               }
             ]
           },
           "PerformanceCounters": {
                 "scheduledTransferPeriod": "PT1M",
                 "PerformanceCounterConfiguration": [
                     {
                         "counterSpecifier": "\\Processor(_Total)\\% Processor Time",
                         "sampleRate": "PT1M",
                         "unit": "Percent",
                         "annotation": [
                         ],
                         "sinks": ""
                     },
                     {
                         "counterSpecifier": "\\Service Fabric Actor Method(*)\\Invocations/Sec",
                         "sampleRate": "PT1M",
                     }
                 ]
             }
         }
       },
  ```

 The sample rate for the counter can be modified as per your needs. The format for it is `PT<time><unit>`, so if you want the counter collected every second, then you should set the `"sampleRate": "PT15S"`.

 You can also use variables in your ARM template to collect an array of performance counters, which can come in handy when you collect performance counters per process. In the below example, we are collecting processor time and garbage collector time per process and then 2 performance counters on the nodes themselves all using variables. 

 ```json
"variables": {
  "copy": [
      {
        "name": "processorTimeCounters",
        "count": "[length(parameters('monitoredProcesses'))]",
        "input": {
          "counterSpecifier": "\\Process([parameters('monitoredProcesses')[copyIndex('processorTimeCounters')]])\\% Processor Time",
          "sampleRate": "PT1M",
          "unit": "Percent",
          "sinks": "applicationInsights",
          "annotation": [
            {
              "displayName": "[concat(parameters('monitoredProcesses')[copyIndex('processorTimeCounters')],' Processor Time')]",
              "locale": "en-us"
            }
          ]
        }
      },
      {
        "name": "gcTimeCounters",
        "count": "[length(parameters('monitoredProcesses'))]",
        "input": {
          "counterSpecifier": "\\.NET CLR Memory([parameters('monitoredProcesses')[copyIndex('gcTimeCounters')]])\\% Time in GC",
          "sampleRate": "PT1M",
          "unit": "Percent",
          "sinks": "applicationInsights",
          "annotation": [
            {
              "displayName": "[concat(parameters('monitoredProcesses')[copyIndex('gcTimeCounters')],' Time in GC')]",
              "locale": "en-us"
            }
          ]
        }
      }
    ],
    "machineCounters": [
      {
        "counterSpecifier": "\\Memory\\Available Bytes",
        "sampleRate": "PT1M",
        "unit": "KB",
        "sinks": "applicationInsights",
        "annotation": [
          {
            "displayName": "Memory Available Kb",
            "locale": "en-us"
          }
        ]
      },
      {
        "counterSpecifier": "\\Memory\\% Committed Bytes In Use",
        "sampleRate": "PT15S",
        "unit": "percent",
        "annotation": [
          {
            "displayName": "Memory usage",
            "locale": "en-us"
          }
        ]
      }
    ]
  }
....
"WadCfg": {
    "DiagnosticMonitorConfiguration": {
      "overallQuotaInMB": "50000",
      "Metrics": {
        "metricAggregation": [
          {
            "scheduledTransferPeriod": "PT1M"
          }
        ],
        "resourceId": "[resourceId('Microsoft.Compute/virtualMachineScaleSets', variables('vmNodeTypeApp2Name'))]"
      },
      "PerformanceCounters": {
        "scheduledTransferPeriod": "PT1M",
        "PerformanceCounterConfiguration": "[concat(variables ('processorTimeCounters'), variables('gcTimeCounters'),  variables('machineCounters'))]"
      },
....
```

1. Once you have added the appropriate performance counters that need to be collected, you need to upgrade your cluster resource so that these changes are reflected in your running cluster. Save your modified `template.json` and open up PowerShell. You can upgrade your cluster using `New-AzResourceGroupDeployment`. The call requires the name of the resource group, the updated template file, and the parameters file, and prompts Resource Manager to make appropriate changes to the resources that you updated. Once you are signed into your account and are in the right subscription, use the following command to run the upgrade:

    ```sh
    New-AzResourceGroupDeployment -ResourceGroupName <ResourceGroup> -TemplateFile <PathToTemplateFile> -TemplateParameterFile <PathToParametersFile> -Verbose
    ```

1. Once the upgrade finishes rolling out (takes between 15-45 minutes depending on whether it's the first deployment and the size of your resource group), WAD should be collecting the performance counters and sending them to the table named WADPerformanceCountersTable in the storage account associated with your cluster. See your performance counters in Application Insights by [adding the AI Sink to the Resource Manager template](service-fabric-diagnostics-event-aggregation-wad.md#add-the-application-insights-sink-to-the-resource-manager-template).

## Next steps
* Collect more performance counters for your cluster. See [Performance metrics](service-fabric-diagnostics-event-generation-perf.md) for a list of counters you should collect.
* [Use monitoring and diagnostics with a Windows VM and Azure Resource Manager templates](../virtual-machines/windows/extensions-diagnostics-template.md) to make further modifications to your `WadCfg`, including configuring additional storage accounts to send diagnostics data to.
* Visit the [WadCfg builder](https://azure.github.io/azure-diagnostics-tools/config-builder/) to build a template from scratch and make sure your syntax is correct.(https://azure.github.io/azure-diagnostics-tools/config-builder/) to build a template from scratch and make sure your syntax is correct.
