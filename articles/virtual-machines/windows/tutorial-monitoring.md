---
title: Azure Monitoring and Windows Virtual Machines | Microsoft Docs
description: Tutorial - Monitor a Windows Virtual Machine with Azure PowerShell 
services: virtual-machines-windows
documentationcenter: virtual-machines
author: davidmu1
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 05/04/2017
ms.author: davidmu
---

# Monitor a Windows Virtual Machine with Azure PowerShell

[Azure Monitor](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview) can be used to investigate diagnostics data that can be collected on a Windows Virtual Machine (VM). You learn to:

> [!div class="checklist"]
> * Create a virtual network
> * Create a resource group and VM 
> * Enable boot diagnostics on the VM
> * View boot diagnostics
> * View host metrics
> * Install the diagnostics extension
> * View VM metrics
> * Create an alert
> * Set up advanced monitoring

This tutorial requires the Azure PowerShell module version 3.6 or later. Run ` Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

To complete the example in this tutorial, you must have an existing virtual machine. If needed, this [script sample](../scripts/virtual-machines-windows-powershell-sample-create-vm.md) can create one for you. When working through the tutorial, replace the resource group and VM names where needed.

## View boot diagnostics

When you create a Windows VM, boot diagnostics are automatically enabled. A storage account is automatically created to store the boot diagnostics data.

You can get the boot diagnostic data from `myMonitorVM` with [Get-​Azure​Rm​VM​Boot​Diagnostics​Data](https://docs.microsoft.com/powershell/module/azurerm.compute/get-azurermvmbootdiagnosticsdata?view=azurermps-3.8.0):

```powershell
Get-AzureRmVMBootDiagnosticsData -ResourceGroupName myResourceGroupMonitor -Name myMonitorVM -Windows -LocalPath "./diagnosticsdata"
```

## View host metrics

A Linux VM has a dedicated Host VM in Azure that it interacts with. Metrics are automatically collected for the Host VM that you can easily view in the Azure portal.

1. In the Azure portal, click **Resource Groups**, select **myResourceGroupMonitor**, and then select **myMonitorVM** in the resource list.
2. Click **Metrics** on the VM blade, and then select any of the Host metrics under **Available metrics** to see how the Host VM is performing.

![View host metrics](./media/tutorial-monitoring/tutorial-monitor-host-metrics.png)

## Install diagnostics extension

[Azure Diagnostics](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs) enables the collection of diagnostic data on a VM.

For this tutorial, you need a storage account to store diagnostics data. You can create a new storage account named `mydiagnosticsstorage` with [New-AzureRmStorageAccount](https://docs.microsoft.com/powershell/module/azurerm.storage/new-azurermstorageaccount?view=azurermps-3.8.0): 

```powershell
New-AzureRmStorageAccount -ResourceGroupName myResourceGroupMonitor `
  -AccountName mydiagnosticsstorage `
  -Location eastus `
  -Type Standard_LRS
```

**Note:** Storage account names must be between 3 and 24 characters and must contain only numbers and lowercase letters.

The diagnostics extension that you are installing uses a configuration file to define the metrics that are collected. Replace `{subscriptionId}` in `resourceId`, and then save the metric configuration data to a file named *DiagnosticsPubConfig.xml*:

```xml
<?xml version="1.0" encoding="utf-8"?>
  <PublicConfig xmlns="http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration">
    <WadCfg>
      <DiagnosticMonitorConfiguration overallQuotaInMB="4096">
        <DiagnosticInfrastructureLogs scheduledTransferLogLevelFilter="Error"/>
        <PerformanceCounters scheduledTransferPeriod="PT1M">
        <PerformanceCounterConfiguration counterSpecifier="\Processor(_Total)\% Processor Time" sampleRate="PT15S" unit="Percent">
          <annotation displayName="CPU utilization" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\Processor(_Total)\% Privileged Time" sampleRate="PT15S" unit="Percent">
          <annotation displayName="CPU privileged time" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\Processor(_Total)\% User Time" sampleRate="PT15S" unit="Percent">
          <annotation displayName="CPU user time" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\Processor Information(_Total)\Processor Frequency" sampleRate="PT15S" unit="Count">
          <annotation displayName="CPU frequency" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\System\Processes" sampleRate="PT15S" unit="Count">
          <annotation displayName="Processes" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\Process(_Total)\Thread Count" sampleRate="PT15S" unit="Count">
          <annotation displayName="Threads" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\Process(_Total)\Handle Count" sampleRate="PT15S" unit="Count">
          <annotation displayName="Handles" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\Memory\% Committed Bytes In Use" sampleRate="PT15S" unit="Percent">
          <annotation displayName="Memory usage" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\Memory\Available Bytes" sampleRate="PT15S" unit="Bytes">
          <annotation displayName="Memory available" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\Memory\Committed Bytes" sampleRate="PT15S" unit="Bytes">
          <annotation displayName="Memory committed" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\Memory\Commit Limit" sampleRate="PT15S" unit="Bytes">
          <annotation displayName="Memory commit limit" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\Memory\Pool Paged Bytes" sampleRate="PT15S" unit="Bytes">
          <annotation displayName="Memory paged pool" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\Memory\Pool Nonpaged Bytes" sampleRate="PT15S" unit="Bytes">
          <annotation displayName="Memory non-paged pool" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\PhysicalDisk(_Total)\% Disk Time" sampleRate="PT15S" unit="Percent">
          <annotation displayName="Disk active time" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\PhysicalDisk(_Total)\% Disk Read Time" sampleRate="PT15S" unit="Percent">
          <annotation displayName="Disk active read time" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\PhysicalDisk(_Total)\% Disk Write Time" sampleRate="PT15S" unit="Percent">
          <annotation displayName="Disk active write time" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\PhysicalDisk(_Total)\Disk Transfers/sec" sampleRate="PT15S" unit="CountPerSecond">
          <annotation displayName="Disk operations" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\PhysicalDisk(_Total)\Disk Reads/sec" sampleRate="PT15S" unit="CountPerSecond">
          <annotation displayName="Disk read operations" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\PhysicalDisk(_Total)\Disk Writes/sec" sampleRate="PT15S" unit="CountPerSecond">
          <annotation displayName="Disk write operations" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\PhysicalDisk(_Total)\Disk Bytes/sec" sampleRate="PT15S" unit="BytesPerSecond">
          <annotation displayName="Disk speed" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\PhysicalDisk(_Total)\Disk Read Bytes/sec" sampleRate="PT15S" unit="BytesPerSecond">
          <annotation displayName="Disk read speed" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\PhysicalDisk(_Total)\Disk Write Bytes/sec" sampleRate="PT15S" unit="BytesPerSecond">
          <annotation displayName="Disk write speed" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\PhysicalDisk(_Total)\Avg. Disk Queue Length" sampleRate="PT15S" unit="Count">
          <annotation displayName="Disk average queue length" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\PhysicalDisk(_Total)\Avg. Disk Read Queue Length" sampleRate="PT15S" unit="Count">
          <annotation displayName="Disk average read queue length" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\PhysicalDisk(_Total)\Avg. Disk Write Queue Length" sampleRate="PT15S" unit="Count">
          <annotation displayName="Disk average write queue length" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\LogicalDisk(_Total)\% Free Space" sampleRate="PT15S" unit="Percent">
          <annotation displayName="Disk free space (percentage)" locale="en-us"/>
        </PerformanceCounterConfiguration>
        <PerformanceCounterConfiguration counterSpecifier="\LogicalDisk(_Total)\Free Megabytes" sampleRate="PT15S" unit="Count">
          <annotation displayName="Disk free space (MB)" locale="en-us"/>
        </PerformanceCounterConfiguration>
      </PerformanceCounters>
      <Metrics resourceId="/subscriptions/{subscriptionId}/resourceGroups/myResourceGroupMonitor/providers/Microsoft.Compute/virtualMachines/myMonitorVM" >
          <MetricAggregation scheduledTransferPeriod="PT1H"/>
          <MetricAggregation scheduledTransferPeriod="PT1M"/>
      </Metrics>
      <WindowsEventLog scheduledTransferPeriod="PT1M">
        <DataSource name="Application!*[System[(Level = 1 or Level = 2)]]"/>
        <DataSource name="Security!*[System[(Level = 1 or Level = 2)]"/>
        <DataSource name="System!*[System[(Level = 1 or Level = 2)]]"/>
      </WindowsEventLog>
        </DiagnosticMonitorConfiguration>
      </WadCfg>
      <StorageAccount>mydiagnosticsstorage</StorageAccount>
  </PublicConfig>
```

Now you can install the extension using the diagnostics configuration with [Set-AzureRmVMDiagnosticsExtension](https://docs.microsoft.com/powershell/module/azurerm.compute/set-azurermvmdiagnosticsextension?view=azurermps-3.8.0):

```powershell
Set-AzureRmVMDiagnosticsExtension -ResourceGroupName myResourceGroupMonitor `
  -VMName myMonitorVM `
  -DiagnosticsConfigurationPath DiagnosticsPubConfig.xml
```

## View VM metrics

You can view the VM metrics in the same way that you viewed the Host VM metrics:

1. In the Azure portal, click **Resource Groups**, select **myResourceGroupMonitor**, and then select **myMonitorVM** in the resource list.
2. Click **Metrics** on the VM blade, and then select any of the diagnostics metrics under **Available metrics** to see how the VM is performing.

## Create alerts

Alerts are a method of monitoring Azure resource metrics, events, or logs and being notified when a condition you specify is met.

Replace `{subscriptionId}` in `TargetResourceId`, and then you can create an alert with [New-AzureRmAlertRuleEmail](https://docs.microsoft.com/powershell/module/azurerm.insights/new-azurermalertruleemail?view=azurermps-3.8.0) and [Add-AzureRmMetricAlertRule](https://docs.microsoft.com/powershell/module/azurerm.insights/add-azurermmetricalertrule?view=azurermps-3.8.0). The alert sends an email to the owners of the resource group when the percentage of CPU usage goes over the threshold of 1:

```powershell
$action = New-AzureRmAlertRuleEmail -SendToServiceOwners
$time = New-TimeSpan -Minutes 5
Add-AzureRmMetricAlertRule -ResourceGroup myResourceGroupMonitor `
  -WindowSize $time `
  -Operator GreaterThan `
  -Threshold 1 `
  -TargetResourceId "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroupMonitor/providers/Microsoft.Compute/virtualMachines/myMonitorVM" `
  -MetricName "Percentage CPU" `
  -TimeAggregationOperator Total `
  -Location eastus `
  -Name cpu-alert `
  -Actions $action
```

## Advanced monitoring 

You can do more advanced monitoring of your VM by using [Operations Management Suite](https://docs.microsoft.com/azure/operations-management-suite/operations-management-suite-overview). If you haven't already done so, you can sign up for a [free trial](https://www.microsoft.com/en-us/cloud-platform/operations-management-suite-trial) of Operations Management Suite.

When you have access to the OMS portal, you can find the workspace key and workspace identifier on the Settings blade. Replace <workspace-key> and <workspace-id> with the values for from your OMS workspace and then you can use [Set-AzureRmVMExtension](https://docs.microsoft.com/powershell/module/azurerm.compute/set-azurermvmextension?view=azurermps-3.8.0) to add the OMS extension to the VM:

```powershell
Set-AzureRmVMExtension -ResourceGroupName myResourceGroupmonitor `
  -ExtensionName "Microsoft.EnterpriseCloud.Monitoring" `
  -VMName myMonitorVM `
  -Publisher "Microsoft.EnterpriseCloud.Monitoring" `
  -ExtensionType "MicrosoftMonitoringAgent" `
  -TypeHandlerVersion 1.0 `
  -Settings @{"workspaceId" = "<workspace-id>"} `
  -ProtectedSettings @{"workspaceKey" = "<workspace-key>"} `
  -Location eastus
```

On the Log Search blade of the OMS portal, you should see `myMonitorVM` such as what is shown in the following picture:

![OMS blade](./media/tutorial-monitoring/tutorial-monitor-oms.png)