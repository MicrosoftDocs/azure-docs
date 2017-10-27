---
title: Enable Application Insights Profiler for Azure Compute applications | Microsoft Docs
description: Learn how to set up the Profiler on an application running in Azure Compute.
services: application-insights
documentationcenter: ''
author: ramach
manager: carmonm
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 10/16/2017
ms.author: ramach

---

# Enable Application Insights Profiler on Azure Virtual Machines, Service Fabric and Cloud Services

This walkthrough demonstrates how to enable Azure Application Insights Profiler on an ASP.NET application hosted by an Azure Compute resource.  
The examples include support for Azure Virtual Machines, Azure Virtual Machine Scale Sets, Azure Service Fabric, and Azure Cloud Services.  
The examples rely on templates that support the [Azure Resource Manager](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview) deployment model.  


## Overview

The following diagram illustrates how the Profiler works for Azure resources. It uses an Azure virtual machine as an example.

![Overview](./media/enable-profiler-compute/overview.png)


In order to fully enable Profiler, the configuration needs to be done in three places:

1. Application Insights instance portal blade.
2. Application source code (e.g.: an ASP.NET web application).
3. Environment deployment definition source code (e.g.: a Virtual Machine deployment template json file).


## Configure the Application Insights instance

Create or visit the Azure Portal blade for the Application Insights instance you want to use, and take note of its instrumentation key. It's going to be useful for other configuration steps:

  ![Location of the key](./media/enable-profiler-compute/CopyAIKey.png)

This instance should be the same your application is configured to send telemetry data to on each request.
Also, Profiler results are going to be available in this instance.  

Still in the Azure Portal, follow [Enable the Profiler](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-profiler#enable-the-profiler) to finish configuring the AI instance for Profiler. There's no need to link web apps for the purposes of this walkthrough, just make sure Profiler is enabled in the Portal.


## Configure the application source code

Your application should be configured to send telemetry data to an Application Insights instance on each `Request` operation.  

1. Add the [Application Insights SDK](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-overview#get-started) to your application project. Make sure the nuget package versions are as follow:  
  - For ASP.NET applications: [Microsoft.ApplicationInsights.Web](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Web/) of version 2.3.0 or newer.
  - For ASP.NET Core applications: [Microsoft.ApplicationInsights.AspNetCore](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore/) 2.1.0. or newer.
  - For other .NET and .NET core applications (e.g. Service Fabric stateless service, cloud service worker role):
  [Microsoft.ApplicationInsights](https://www.nuget.org/packages/Microsoft.ApplicationInsights/) or [Microsoft.ApplicationInsights.Web](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Web/) 2.3.0 or newer.  

2. If your application is *not* an ASP.NET or ASP.NET Core application (e.g.: Cloud Services worker roles, Service Fabric Stateless APIs), then the following extra instrumentation setup is needed:  

  2.1. Add the following code into an early point in the application lifetime.  

  ```csharp
  using Microsoft.ApplicationInsights.Extensibility;
  ...
  // Replace with your own Application Insights instrumentation key.
  TelemetryConfiguration.Active.InstrumentationKey = "00000000-0000-0000-0000-000000000000";
  ```
  For more information about this global instrumentation key configuration, see [Using Service Fabric with Application Insights](https://github.com/Azure-Samples/service-fabric-dotnet-getting-started/blob/dev/appinsights/ApplicationInsights.md).  

  2.2. For any piece of code that you want to instrument, add a `StartOperation<RequestTelemetry>` `using` statement around it, like in the following example:

  ```csharp
  using Microsoft.ApplicationInsights;
  using Microsoft.ApplicationInsights.DataContracts;
  ...
  var client = new TelemetryClient();
  ...
  using (var operation = client.StartOperation<RequestTelemetry>("Insert_Your_Custom_Event_Unique_Name"))
  {
    // ... Code I want to profile.
  }
  ```

> [!NOTE]  
> Calling `StartOperation<RequestTelemetry>` within another `StartOperation<RequestTelemetry>` scope is not supported. You can use `StartOperation<DependencyTelemetry>` in the nested scope instead. Example:  

```csharp
using (var getDetailsOperation = client.StartOperation<RequestTelemetry>("GetProductDetails"))
{
  try
  {
    ProductDetail details = new ProductDetail() { Id = productId };
    getDetailsOperation.Telemetry.Properties["ProductId"] = productId.ToString();

    // By using DependencyTelemetry, 'GetProductPrice' is correctly linked as part of the 'GetProductDetails' request.
    using (var getPriceOperation = client.StartOperation<DependencyTelemetry>("GetProductPrice"))
    {
        double price = await _priceDataBase.GetAsync(productId);
        if (IsTooCheap(price))
        {
            throw new PriceTooLowException(productId);
        }
        details.Price = price;
    }

    // Similarly, note how 'GetProductReviews' doesn't establish another RequestTelemetry.
    using (var getReviewsOperation = client.StartOperation<DependencyTelemetry>("GetProductReviews"))
    {
        details.Reviews = await _reviewDataBase.GetAsync(productId);
    }

    getDetailsOperation.Telemetry.Success = true;
    return details;
  }
  catch(Exception ex)
  {
    getDetailsOperation.Telemetry.Success = false;

    // This exception gets linked to the 'GetProductDetails' request telemetry.
    client.TrackException(ex);
    throw;
  }
}
```


## Configure the environment deployment definition

The environment where Profiler and your application execute can be a Virtual Machine, Virtual Machine Scale Set, Service Fabric Cluster, or a Cloud Services.  

### Virtual Machine, Virtual Machine Scale Sets or Service Fabric

Full Examples:  
  * [Virtual Machine](https://github.com/Azure/azure-docs-json-samples/blob/master/application-insights/WindowsVirtualMachine.json)
  * [Virtual Machine Scale Set](https://github.com/Azure/azure-docs-json-samples/blob/master/application-insights/WindowsVirtualMachineScaleSet.json)
  * [Service Fabric Cluster](https://github.com/Azure/azure-docs-json-samples/blob/master/application-insights/ServiceFabricCluster.json)

1. In order to ensure that [.NET framework 4.6.1](https://docs.microsoft.com/en-us/dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed) or newer is in use, it's sufficient to confirm that the deployed OS is `Windows Server 2012 R2` or newer.

2. Locate the [Azure Diagnostics](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/azure-diagnostics) extension in the deployment template file, and add the following `SinksConfig` section as a child element of `WadCfg`, replacing the `ApplicationInsightsProfiler` property value with your own AI instrumentation key:  
```json
"SinksConfig": {
  "Sink": [
    {
      "name": "MyApplicationInsightsProfilerSink",
      "ApplicationInsightsProfiler": "00000000-0000-0000-0000-000000000000"
    }
  ]
}
```

Please refer to the examples and [this guide](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/extensions-diagnostics-template?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) for how to add the Diagnostics extension to your deployment template.


### Cloud Services

1. In order to ensure that [.NET framework 4.6.1](https://docs.microsoft.com/en-us/dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed) or newer is in use, it's sufficient to confirm that `ServiceConfiguration.*.cscfg` files contain `osFamily` as `"5"` or newer.

2. Locate the [Azure Diagnostics](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/azure-diagnostics) `diagnostics.wadcfgx` file for your application role:  
![Location of the diagnostics config file](./media/enable-profiler-compute/cloudservice-solutionexplorer.png)  
If you can't find the file, please refer to [this guide](https://docs.microsoft.com/en-us/azure/vs-azure-tools-diagnostics-for-cloud-services-and-virtual-machines#enable-diagnostics-in-cloud-service-projects-before-deploying-them) for how to enable the Diagnostics extension in your Azure Cloud Services project.

3. Add the following `SinksConfig` section as a child element of `WadCfg`:  
  ```xml
  <WadCfg>
    <DiagnosticMonitorConfiguration>...</DiagnosticMonitorConfiguration>
    <SinksConfig>
      <Sink name="MyApplicationInsightsProfiler">
        <!-- Replace with your own Application Insights instrumentation key. -->
        <ApplicationInsightsProfiler>00000000-0000-0000-0000-000000000000</ApplicationInsightsProfiler>
      </Sink>
    </SinksConfig>
  </WadCfg>
  ```

> [!NOTE]  
> If `diagnostics.wadcfgx` file also contains another sink of type `ApplicationInsights`, then all three of these instrumentation keys must match:  
>  * the instrumentation key used by your application  
>  * the instrumentation key used by the `ApplicationInsights` sink  
>  * the instrumentation key used by the `ApplicationInsightsProfiler` sink  
>
>The actual instrumentation key value used by the `ApplicationInsights` sink can be found in the `ServiceConfiguration.*.cscfg` files.  
>After Visual Studio 15.5 Azure SDK release, only the instrumentation keys used by the application and `ApplicationInsightsProfiler` sink will need to match each other.


## Environment deployment and runtime configurations

1. Deploy the modified environment deployment definition.  
Typically, in order to apply the modifications, a full template deployment or a Cloud Services publish through PowerShell cmdlets or Visual Studio is involved.  
The following is an alternate approach for existing `Virtual Machines` that touches only its Diagnostics extension:  
```powershell
$ConfigFilePath = [IO.Path]::GetTempFileName()
# After exporting the currently deployed Diagnostics config to a file, edit it to include the ApplicationInsightsProfiler sink.
(Get-AzureRmVMDiagnosticsExtension -ResourceGroupName "MyRG" -VMName "MyVM").PublicSettings | Out-File -Verbose $ConfigFilePath
# Set-AzureRmVMDiagnosticsExtension might require the -StorageAccountName argument
# if your original diagnostics configuration had the storageAccountName property in the protectedSettings section
# (which is not downloadable). Make sure to pass the same original value you had in this cmdlet call.
Set-AzureRmVMDiagnosticsExtension -ResourceGroupName "MyRG" -VMName "MyVM" -DiagnosticsConfigurationPath $ConfigFilePath
```

2. If the intended application is running through [IIS](https://www.microsoft.com/web/platform/server.aspx), then the `IIS Http Tracing` Windows feature needs to be enabled:  
  Establish remote access to the environment, and then use the [Add Windows Features]( https://docs.microsoft.com/en-us/iis/configuration/system.webserver/tracing/) window or run the following in PowerShell (as administrator):  
  ```powershell
  Enable-WindowsOptionalFeature -FeatureName IIS-HttpTracing -Online -All
  ```  
  If establishing remote access is a problem, you can use [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/get-started-with-azure-cli) to run the following:  
  ```powershell
  az vm run-command invoke -g MyResourceGroupName -n MyVirtualMachineName --command-id RunPowerShellScript --scripts "Enable-WindowsOptionalFeature -FeatureName IIS-HttpTracing -Online -All"
  ```


## How to enable Profiler on on-premises servers

Also known as running AI Profiler in standalone mode (not tied to Diagnostics extension modifications).  
We have no plan to officially support Profiler for on-premise servers.
If you are interested in experimenting this scenario, you can download support code from [here](https://github.com/ramach-msft/AIProfiler-Standalone).  
We are *not* responsible for maintaining that code or responding to issues and features requests related to it.


## Next steps

- Generate traffic to your application (e.g.: launch an [Availability Test](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-monitor-web-app-availability)) and allow 10-15 minutes after that for traces to start to be sent to the Application Insights instance.

- See [Profiler traces](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-profiler#enable-the-profiler) in the Azure Portal.

- Find help with troubleshooting Profiler issues in [Profiler troubleshooting](app-insights-profiler.md#troubleshooting).

- Read more about the Profiler in [Application Insights Profiler](app-insights-profiler.md).
