---
title: Send guest OS metrics to the Azure Monitor metric store classic Cloud Service 
description: Send guest OS metrics to the Azure Monitor metric store classic Cloud Service
author: anirudhcavale
services: azure-monitor
ms.service: azure-monitor
ms.topic: howto
ms.date: 09/24/2018
ms.author: ancav
ms.component: metrics
---
# Send guest OS metrics to the Azure Monitor metric store classic Cloud Service

The Azure Monitor [Windows Azure Diagnostics extension](azure-diagnostics.md) (WAD) allows you to collect metrics and logs from the Guest Operating System (guestOS) running as part of a Virtual Machine, Cloud Service, or Service Fabric cluster.  The extension can send telemetry to many different locations listed in the previously linked article.  

This article describes the process to send guest OS performance metrics for Azure classic Cloud Services to the Azure Monitor metric store. Starting with WAD version 1.11, you can write metrics directly to the Azure Monitor metrics store where standard platform metrics are already collected. Storing them in this location allows you to access the same actions available for platform metrics.  Actions include near-real time alerting, charting, routing, access from REST API and more.  In the past, the WAD extension wrote to Azure Storage, but not the Azure Monitor data store.  

The process outlined in this article only works for performance counters on Azure Cloud Services. It does not work for other custom metrics. 
   

## Pre-requisites

- You must be a [Service Administrator or co-administrator](https://docs.microsoft.com/azure/billing/billing-add-change-azure-subscription-administrator.md) on your Azure subscription 

- Your subscription must be registered with [Microsoft.Insights](https://docs.microsoft.com/powershell/azure/overview?view=azurermps-6.8.1) 

- You need to have either [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview?view=azurermps-6.8.1) installed, or you can use [Azure CloudShell](https://docs.microsoft.com/azure/cloud-shell/overview.md) 


## Provision Cloud Service and Storage Account 

1. Create and Deploy a Classic Cloud Service (a sample classic cloud service application and deployment can be found [here](../cloud-services/cloud-services-dotnet-get-started.md). 

2. You can use an existing storage account or deploy a new storage account. It's best if the storage account is in same region as the Classic Cloud Service you just created. In the Azure portal, navigate to the Storage Account resource blade and choose the **Keys**. Note down the storage account name and storage account key, you will need these in later steps.

   ![Storage Account Keys](./media/metrics-store-custom-guestos-classic-cloud-service/storage-keys.png)



## Create a Service Principal 

Create a service principle in your Azure Active Directory tenant using the instructions found at ../azure/azure-resource-manager/resource-group-create-service-principal-portal. Note the following while going through this process: 
  - You can put in any URL for the sign-on URL.  
  - Create new client secret for this app  
  - Save the Key and the client id for use in later steps.  

Give the app created in the previous step *Monitoring Metrics Publisher* permissions to the resource you wish to emit metrics against. If you plan to use the app to emit custom metrics against many resources, you can grant these permissions at the resource group or subscription level.  

> [!NOTE]
> The Diagnostics Extension uses the service principal to authenticate against Azure Monitor and emit metrics for your cloud service 

## Author Diagnostics Extension Configuration 

Prepare your WAD diagnostics extension configuration file. This file dictates which logs, and performance counters the diagnostics extension should collect for your cloud service. Below is a sample diagnostics configuration file.  

```XML
<?xml version="1.0" encoding="utf-8"?> 
<DiagnosticsConfiguration xmlns="http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration"> 
  <PublicConfig xmlns="http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration"> 
    <WadCfg> 
      <DiagnosticMonitorConfiguration overallQuotaInMB="4096"> 
        <DiagnosticInfrastructureLogs scheduledTransferLogLevelFilter="Error" /> 
        <Directories scheduledTransferPeriod="PT1M"> 
          <IISLogs containerName="wad-iis-logfiles" /> 
          <FailedRequestLogs containerName="wad-failedrequestlogs" /> 
        </Directories> 
        <PerformanceCounters scheduledTransferPeriod="PT1M"> 
          <PerformanceCounterConfiguration counterSpecifier="\Processor(_Total)\% Processor Time" sampleRate="PT15S" /> 
          <PerformanceCounterConfiguration counterSpecifier="\Memory\Available MBytes" sampleRate="PT15S" /> 
          <PerformanceCounterConfiguration counterSpecifier="\Memory\Committed Bytes" sampleRate="PT15S" /> 
          <PerformanceCounterConfiguration counterSpecifier="\Memory\Page Faults/sec" sampleRate="PT15S" /> 
        </PerformanceCounters> 
        <WindowsEventLog scheduledTransferPeriod="PT1M"> 
          <DataSource name="Application!*[System[(Level=1 or Level=2 or Level=3)]]" /> 
          <DataSource name="Windows Azure!*[System[(Level=1 or Level=2 or Level=3 or Level=4)]]" /> 
        </WindowsEventLog> 
        <CrashDumps> 
          <CrashDumpConfiguration processName="WaIISHost.exe" /> 
          <CrashDumpConfiguration processName="WaWorkerHost.exe" /> 
          <CrashDumpConfiguration processName="w3wp.exe" /> 
        </CrashDumps> 
        <Logs scheduledTransferPeriod="PT1M" scheduledTransferLogLevelFilter="Error" /> 
      </DiagnosticMonitorConfiguration> 
      <SinksConfig> 
      </SinksConfig> 
    </WadCfg> 
    <StorageAccount /> 
  </PublicConfig> 
  <PrivateConfig xmlns="http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration"> 
    <StorageAccount name="" endpoint="" /> 
</PrivateConfig> 
  <IsEnabled>true</IsEnabled> 
</DiagnosticsConfiguration> 
```

In the "SinksConfig" section of your diagnostics file define a new Azure Monitor sink: 

```XML
  <SinksConfig> 
    <Sink name="AzMonSink"> 
    <AzureMonitor> 
      <ResourceId>-Provide ClassicCloudService’s Resource ID-</ResourceId> 
      <Region>-Azure Region your Cloud Service is deployed in-</Region> 
    </AzureMonitor> 
    </Sink> 
  </SinksConfig> 
```

In the section of your configuration file where you list of performance counters to be collected, add the Azure Monitor Sink. This entry ensures all the performance counters specified are routed to Azure Monitor as metrics. Feel free to add/remove performance counters as per your needs. 

```XML
<PerformanceCounters scheduledTransferPeriod="PT1M" sinks="AzMonSink"> 
 <PerformanceCounterConfiguration counterSpecifier="\Processor(_Total)\% Processor Time" sampleRate="PT15S" /> 
  … 
</PerformanceCounters> 
```
Finally, in the private configuration, add an *Azure Monitor Account* section. Enter the service principal client ID and secret that were created in earlier step. 

```XML
<PrivateConfig xmlns="http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration"> 
  <StorageAccount name="" endpoint="" /> 
    <AzureMonitorAccount> 
      <ServicePrincipalMeta> 
        <PrincipalId>clientId from step 3</PrincipalId> 
        <Secret>client secret from step 3</Secret> 
      </ServicePrincipalMeta> 
    </AzureMonitorAccount> 
</PrivateConfig> 
```
 
Save this diagnostics file locally.  

## Deploy the Diagnostics Extension to your Cloud Service 

Launch PowerShell and Login to Azure 

```PowerShell
Login-AzureRmAccount 
```

Store the Details about the Storage Account details created in an earlier step in variables using the following commands. 

```PowerShell
$storage_account = <name of your storage account from step 3> 
$storage_keys = <storage account key from step 3> 
```
 
Similarly, set the diagnostics file path to a variable using the below command. 

```PowerShell
$diagconfig = “<path of the diagnostics configuration file with the Azure Monitor sink configured>” 
```
 
Deploy the diagnostics extension to your cloud service with the diagnostics file with the Azure Monitor sink configured using the command below 

```PowerShell
Set-AzureServiceDiagnosticsExtension -ServiceName <classicCloudServiceName> -StorageAccountName $storage_account -StorageAccountKey $storage_keys -DiagnosticsConfigurationPath $diagconfig 
```
 
> [!NOTE] 
> It is still mandatory to provide a Storage Account as part of the installation of the diagnostics extension. Any logs and/or performance counters specified in the diagnostics config file will be written to the specified storage account.  

## Plot metrics in the Azure portal 

Navigate to the Azure portal 

 ![Metrics Azure portal](./media/metrics-store-custom-guestos-classic-cloud-service/navigate-metrics.png)

1. In the left-hand menu, click on Monitor 

1. On the Monitor blade, click on the Metrics Preview tab 

1. In the resource drop-down, select your Classic Cloud Service 

1. In the namespaces drop-down, select **azure.vm.windows.guest** 

1. In the metrics drop down, select *Memory\Committed Bytes in Use* 

You can choose to view the total memory used by a specific role, and each role instance by using the dimension filtering and splitting capabilities. 

 ![Metrics Azure portal](./media/metrics-store-custom-guestos-classic-cloud-service/metrics-graph.png)

## Next steps
- Learn more about [custom metrics](metrics-custom-overview.md).



