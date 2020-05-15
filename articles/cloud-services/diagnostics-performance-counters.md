---
title: Collect on Performance Counters in Azure Cloud Services | Microsoft Docs
description: Learn how to discover, use, and create performance counters in Cloud Services with Azure Diagnostics and Application Insights.
services: cloud-services
documentationcenter: .net
author: tgore03
ms.service: cloud-services
ms.topic: article
ms.date: 02/02/2018
ms.author: tagore
---

# Collect performance counters for your Azure Cloud Service

Performance counters provide a way for you to track how well your application and the host are performing. Windows Server provides many different performance counters related to hardware, applications, the operating system, and more. By collecting and sending performance counters to Azure, you can analyze this information to help make better decisions. 

## Discover available counters

A performance counter is made up of two parts, a set name (also known as a category) and one or more counters. You can use PowerShell to get a list of available performance counters:

```powershell
Get-Counter -ListSet * | Select-Object CounterSetName, Paths | Sort-Object CounterSetName

CounterSetName                                  Paths
--------------                                  -----
.NET CLR Data                                   {\.NET CLR Data(*)\SqlClient...
.NET CLR Exceptions                             {\.NET CLR Exceptions(*)\# o...
.NET CLR Interop                                {\.NET CLR Interop(*)\# of C...
.NET CLR Jit                                    {\.NET CLR Jit(*)\# of Metho...
.NET Data Provider for Oracle                   {\.NET Data Provider for Ora...
.NET Data Provider for SqlServer                {\.NET Data Provider for Sql...
.NET Memory Cache 4.0                           {\.NET Memory Cache 4.0(*)\C...
AppV Client Streamed Data Percentage            {\AppV Client Streamed Data ...
ASP.NET                                         {\ASP.NET\Application Restar...
ASP.NET Apps v4.0.30319                         {\ASP.NET Apps v4.0.30319(*)...
ASP.NET State Service                           {\ASP.NET State Service\Stat...
ASP.NET v2.0.50727                              {\ASP.NET v2.0.50727\Applica...
ASP.NET v4.0.30319                              {\ASP.NET v4.0.30319\Applica...
Authorization Manager Applications              {\Authorization Manager Appl...

#... results cut to save space ...
```

The `CounterSetName` property represents a set (or category), and is a good indicator of what the performance counters are related to. The `Paths` property represents a collection of counters for a set. You could also get the `Description` property for more information about the counter set.

To get all of the counters for a set, use the `CounterSetName` value and expand the `Paths` collection. Each path item is a counter you can query. For example, to get the available counters related to the `Processor` set, expand the `Paths` collection:

```powershell
Get-Counter -ListSet * | Where-Object CounterSetName -eq "Processor" | Select -ExpandProperty Paths

\Processor(*)\% Processor Time
\Processor(*)\% User Time
\Processor(*)\% Privileged Time
\Processor(*)\Interrupts/sec
\Processor(*)\% DPC Time
\Processor(*)\% Interrupt Time
\Processor(*)\DPCs Queued/sec
\Processor(*)\DPC Rate
\Processor(*)\% Idle Time
\Processor(*)\% C1 Time
\Processor(*)\% C2 Time
\Processor(*)\% C3 Time
\Processor(*)\C1 Transitions/sec
\Processor(*)\C2 Transitions/sec
\Processor(*)\C3 Transitions/sec
```

These individual counter paths can be added to the diagnostics framework your cloud service uses. For more information about how a performance counter path is constructed, see [Specifying a Counter Path](https://msdn.microsoft.com/library/windows/desktop/aa373193(v=vs.85)).

## Collect a performance counter

A performance counter can be added to your cloud service for either Azure Diagnostics or Application Insights.

### Application Insights

Azure Application Insights for Cloud Services allows you specify what performance counters you want to collect. After you [add Application Insights to your project](../azure-monitor/app/cloudservices.md#sdk), a config file named **ApplicationInsights.config** is added to your Visual Studio project. This config file defines what type of information Application Insights collects and sends to Azure.

Open the **ApplicationInsights.config** file and find the **ApplicationInsights** > **TelemetryModules** element. Each `<Add>` child-element defines a type of telemetry to collect, along with its configuration. The performance counter telemetry module type is `Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector.PerformanceCollectorModule, Microsoft.AI.PerfCounterCollector`. If this element is already defined, do not add it a second time. Each performance counter to collect is defined under a node named `<Counters>`. Here is an example that collects drive performance counters:

```xml
<ApplicationInsights xmlns="http://schemas.microsoft.com/ApplicationInsights/2013/Settings">

  <TelemetryModules>

    <Add Type="Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector.PerformanceCollectorModule, Microsoft.AI.PerfCounterCollector">
      <Counters>
        <Add PerformanceCounter="\LogicalDisk(C:)\Disk Write Bytes/sec" ReportAs="Disk write (C:)" />
        <Add PerformanceCounter="\LogicalDisk(C:)\Disk Read Bytes/sec" ReportAs="Disk read (C:)" />
      </Counters>
    </Add>

  </TelemetryModules>

<!-- ... cut to save space ... -->
```

Each performance counter is represented as an `<Add>` element under `<Counters>`. The `PerformanceCounter` attribute defines which performance counter to collect. The `ReportAs` attribute is the title to display in the Azure portal for the performance counter. Any performance counter you collect is put into a category named **Custom** in the portal. Unlike Azure Diagnostics, you cannot set the interval these performance counters are collected and sent to Azure. With Application Insights, performance counters are collected and sent every minute. 

Application Insights automatically collects the following performance counters:

* \Process(??APP_WIN32_PROC??)\% Processor Time
* \Memory\Available Bytes
* \.NET CLR Exceptions(??APP_CLR_PROC??)\# of Exceps Thrown / sec
* \Process(??APP_WIN32_PROC??)\Private Bytes
* \Process(??APP_WIN32_PROC??)\IO Data Bytes/sec
* \Processor(_Total)\% Processor Time

For more information, see [System performance counters in Application Insights](../azure-monitor/app/performance-counters.md) and [Application Insights for Azure Cloud Services](../azure-monitor/app/cloudservices.md#performance-counters).

### Azure Diagnostics

> [!IMPORTANT]
> While all this data is aggregated into the storage account, the portal does **not** provide a native way to chart the data. It is highly recommended that you integrate another diagnostics service, like Application Insights, into your application.

The Azure Diagnostics extension for Cloud Services allows you specify what performance counters you want to collect. To set up Azure Diagnostics, see [Cloud Service Monitoring Overview](cloud-services-how-to-monitor.md#setup-diagnostics-extension).

The performance counters you want to collect are defined in the **diagnostics.wadcfgx** file. Open this file (it is defined per role) in Visual Studio and find the **DiagnosticsConfiguration** > **PublicConfig** > **WadCfg** > **DiagnosticMonitorConfiguration** > **PerformanceCounters** element. Add a new **PerformanceCounterConfiguration** element as a child. This element has two attributes: `counterSpecifier` and `sampleRate`. The `counterSpecifier` attribute defines which system performance counter set (outlined in the previous section) to collect. The `sampleRate` value indicates how often that value is polled. As a whole, all performance counters are transferred to Azure according to the parent `PerformanceCounters` element's `scheduledTransferPeriod` attribute value.

For more information about the `PerformanceCounters` schema element, see the [Azure Diagnostics Schema](../azure-monitor/platform/diagnostics-extension-schema-windows.md#performancecounters-element).

The period defined by the `sampleRate` attribute uses the XML duration data type to indicate how often the performance counter is polled. In the example below, the rate is set to `PT3M`, which means `[P]eriod[T]ime[3][M]inutes`: every three minutes.

For more information about how the `sampleRate` and `scheduledTransferPeriod` are defined, see the **Duration Data Type** section in the [W3 XML Date and Time Date Types](https://www.w3schools.com/XML/schema_dtypes_date.asp) tutorial.

```xml
<?xml version="1.0" encoding="utf-8"?>
<DiagnosticsConfiguration  xmlns="http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration">
  <PublicConfig>
    <WadCfg>
      <DiagnosticMonitorConfiguration overallQuotaInMB="4096">

        <!-- ... cut to save space ... -->

        <PerformanceCounters scheduledTransferPeriod="PT1M">
          <PerformanceCounterConfiguration counterSpecifier="\Memory\Available MBytes" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\Web Service(_Total)\ISAPI Extension Requests/sec" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\Web Service(_Total)\Bytes Total/Sec" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\ASP.NET Applications(__Total__)\Requests/Sec" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\ASP.NET Applications(__Total__)\Errors Total/Sec" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\ASP.NET\Requests Queued" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\ASP.NET\Requests Rejected" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\Processor(_Total)\% Processor Time" sampleRate="PT3M" />

          <!-- This is a new perf counter which will track the C: disk read activity in bytes per second, every minute -->
          <PerformanceCounterConfiguration counterSpecifier="\LogicalDisk(C:)\Disk Read Bytes/sec" sampleRate="PT1M" />

        </PerformanceCounters>
      </DiagnosticMonitorConfiguration>
    </WadCfg>
    
    <!-- ... cut to save space ... -->

  </PublicConfig>
</DiagnosticsConfiguration>
```

## Create a new perf counter

A new performance counter can be created and used by your code. Your code that creates a new performance counter must be running elevated, otherwise it will fail. Your cloud service `OnStart` startup code can create the performance counter, requiring you to run the role in an elevated context. Or you can create a startup task that runs elevated and creates the performance counter. For more information about startup tasks, see [How to configure and run startup tasks for a cloud service](cloud-services-startup-tasks.md).

To configure your role to run elevated, add a `<Runtime>` element to the [.csdef](cloud-services-model-and-package.md#servicedefinitioncsdef) file.

```xml
<ServiceDefinition name="CloudServiceLoadTesting" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceDefinition" schemaVersion="2015-04.2.6">
  <WorkerRole name="WorkerRoleWithSBQueue1" vmsize="Large">

    <!-- ... cut to save space ... -->

    <Runtime executionContext="elevated">
      
    </Runtime>

    <!-- ... cut to save space ... -->

  </WorkerRole>
</ServiceDefinition>
```

You can create and register a new performance counter with a few lines of code. Use the `System.Diagnostics.PerformanceCounterCategory.Create` method overload that creates both the category and the counter. The following code first checks if the category exists, and if missing, creates both the category and the counter.

```csharp
using System.Diagnostics;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.ServiceRuntime;

namespace WorkerRoleWithSBQueue1
{
    public class WorkerRole : RoleEntryPoint
    {
        // Perf counter variable representing times service was used.
        private PerformanceCounter counterServiceUsed;

        public override bool OnStart()
        {
            // ... Other startup code here ...

            // Define the category and counter names.
            string perfCounterCatName = "MyService";
            string perfCounterName = "Times Used";

            // Create the counter if needed. Our counter category only has a single counter.
            // Both the category and counter are created in the same method call.
            if (!PerformanceCounterCategory.Exists(perfCounterCatName))
            {
                PerformanceCounterCategory.Create(perfCounterCatName, "Collects information about the cloud service.", 
                                                  PerformanceCounterCategoryType.SingleInstance, 
                                                  perfCounterName, "How many times the cloud service was used.");
            }

            // Get reference to our counter
            counterServiceUsed = new PerformanceCounter(perfCounterCatName, perfCounterName);
            counterServiceUsed.ReadOnly = false;
            
            return base.OnStart();
        }

        // ... cut class code to save space
    }
}
```

When you want to use the counter, call the `Increment` or `IncrementBy` method.

```csharp
// Increase the counter by 1
counterServiceUsed.Increment();
```

Now that your application uses your custom counter, you need to configure Azure Diagnostics or Application Insights to track the counter.


### Application Insights

As previously stated, the performance counters for Application Insights are defined in the **ApplicationInsights.config** file. Open **ApplicationInsights.config** and find the **ApplicationInsights** > **TelemetryModules** > **Add** > **Counters** element. Create an `<Add>` child element and set the `PerformanceCounter` attribute to the category and name of the performance counter you created in your code. Set the `ReportAs` attribute to a friendly name you want to see in the portal.

```xml
<ApplicationInsights xmlns="http://schemas.microsoft.com/ApplicationInsights/2013/Settings">

  <TelemetryModules>

    <Add Type="Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector.PerformanceCollectorModule, Microsoft.AI.PerfCounterCollector">
      <Counters>
        <!-- ... cut other perf counters to save space ... -->

        <!-- This new perf counter matches the [category name]\[counter name] defined in your code -->
        <Add PerformanceCounter="\MyService\Times Used" ReportAs="Service used counter" />
      </Counters>
    </Add>

  </TelemetryModules>

<!-- ... cut to save space ... -->
```

### Azure Diagnostics

As previously stated, the performance counters you want to collect are defined in the **diagnostics.wadcfgx** file. Open this file (it is defined per role) in Visual Studio and find the **DiagnosticsConfiguration** > **PublicConfig** > **WadCfg** > **DiagnosticMonitorConfiguration** > **PerformanceCounters** element. Add a new **PerformanceCounterConfiguration** element as a child. Set the `counterSpecifier` attribute to the category and name of the performance counter you created in your code. 

```xml
<?xml version="1.0" encoding="utf-8"?>
<DiagnosticsConfiguration  xmlns="http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration">
  <PublicConfig>
    <WadCfg>
      <DiagnosticMonitorConfiguration overallQuotaInMB="4096">

        <!-- ... cut to save space ... -->

        <PerformanceCounters scheduledTransferPeriod="PT1M">
          <!-- ... cut other perf counters to save space ... -->
          
          <!-- This new perf counter matches the [category name]\[counter name] defined in your code -->
          <PerformanceCounterConfiguration counterSpecifier="\MyService\Times Used" sampleRate="PT1M" />

        </PerformanceCounters>
      </DiagnosticMonitorConfiguration>
    </WadCfg>
    
    <!-- ... cut to save space ... -->

  </PublicConfig>
</DiagnosticsConfiguration>
```

## More information

- [Application Insights for Azure Cloud Services](../azure-monitor/app/cloudservices.md#performance-counters)
- [System performance counters in Application Insights](../azure-monitor/app/performance-counters.md)
- [Specifying a Counter Path](https://msdn.microsoft.com/library/windows/desktop/aa373193(v=vs.85))
- [Azure Diagnostics Schema - Performance Counters](../azure-monitor/platform/diagnostics-extension-schema-windows.md#performancecounters-element)



