---
title: Azure Service Fabric - Performance monitoring with Windows Azure Diagnostics extension | Microsoft Docs
description: Use Windows Azure Diagnostics to collect performance counters for your Azure Service Fabric clusters.
services: service-fabric
documentationcenter: .net
author: dkkapur
manager: timlt
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 11/05/2017
ms.author: dekapur

---

# Performance monitoring with Windows Azure Diagnostics extension

This document covers steps required to set up collection of performance counters via the Windows Azure Diagnostics (WAD) extension for Windows clusters. For Linux clusters, set up the [OMS Agent](service-fabric-diagnostics-oms-agent.md) to collect performance counters for your nodes. 

 > [!NOTE]
> The WAD extension should be deployed on your cluster for these steps to work for you. If it is not set up, head over to [Event aggregation and collection using Windows Azure Diagnostics](service-fabric-diagnostics-event-aggregation-wad.md) and follow the steps in *Deploy the Diagnostics extension*.

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

    The `scheduledTransferPeriod` defines how frquently the values of the counters that are collected are transferred to your Azure storage table and to any configured sink. 

3. Add the performance counters you would like to collect to the `PerformanceCounterConfiguration` that was declared in the previous step. Each counter you would like to collect is defined with a `counterSpecifier`, `sampleRate`, `unit`, `annotation`, and any relevant `sinks`. Here is an example of a perf counter for the *Total Processor Time* (the amount of time the CPU was in use for processing operations):

    ```json
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
            }
        ]
    }
    ```

    The sample rate for the counter can be modified as per your needs. The format for it is `PT<time><unit>`, so if you want the counter collected every second, then you should set the `"sampleRate": "PT15S"`.

    Similarly, you can collect several other performance counters, by adding them to the list in the `PerformanceCounterConfiguration`. Though you can use `*` to specify groups of performance counters that are named similarly, sending any counters via a sink (to Application Insights) requires that they are individually declared. 

4. Once you had added the appropriate performance counters that need to be collected, you need to upgrade your cluster resource so that these changes are reflected in your running cluster. Save your modified `template.json` and open up PowerShell. You will upgrade your cluster using `New-AzureRmResourceGroupDeployment`. The call requires the name of the resource group, the updated template file, and the parameters file, and will go through the resource group making changes to any of the resources that you updated. Once you are signed into your account and are in the right subscription, use the following command to run the upgrade:

    ```sh
    New-AzureRmResourceGroupDeployment -ResourceGroupName <ResourceGroup> -TemplateFile <PathToTemplateFile> -TemplateParameterFile <PathToParametersFile> -Verbose
    ```

5. Once the upgrade finishes rolling out (takes between 15-45 minutes), WAD should be collecting the performance counters and sending them to a table in the storage account declared in the `WadCfg`.

## Next steps
1. See your performance counters in Application Insights by adding the Application Insights sink to your `WadCfg`. Read the *Add the AI Sink to the Resource Manager template* section in [Event analysis and visualization with Application Insights
](service-fabric-diagnostics-event-analysis-appinsights.md) to configure the Application Insights sink.
2. Collect more performance counters for your cluster. See [Performance metrics](service-fabric-diagnostics-event-generation-perf.md) for a list of counters you should collect.
3. [Use monitoring and diagnostics with a Windows VM and Azure Resource Manager templates](../virtual-machines/windows/extensions-diagnostics-template.md) to make further modifications to your `WadCfg`, including configuring additional storage accounts to send diagnostics data to.