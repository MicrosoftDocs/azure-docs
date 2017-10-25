---
title: Enable Application Insights Profiler for Azure Compute applications | Microsoft Docs
description: Learn how to set up Application Insights Profiler on an application running in Azure Compute.
services: application-insights
documentationcenter: ''
author: ramach-msft
manager: carmonm
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 10/16/2017
ms.author: ramach

---

# Enable Application Insights Profiler for Azure VMs, Service Fabric, and Cloud Services

This article demonstrates how to enable Azure Application Insights Profiler on an ASP.NET application that is hosted by an Azure compute resource. 

The examples in this article include support for Azure Virtual Machines, virtual machine scale sets, Azure Service Fabric, and Azure Cloud Services. The examples rely on templates that support the [Azure Resource Manager](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview) deployment model.  


## Overview

The following image shows how the Application Insights profiler works with Azure resources. The image uses an Azure virtual machine as an example.

  ![Overview](./media/enable-profiler-compute/overview.png)

To fully enable the profiler, you must change the configuration in three locations:

* The Application Insights instance pane in the Azure portal.
* The application source code (for example, an ASP.NET web application).
* The environment deployment definition source code (for example, a VM deployment template .json file).


## Set up the Application Insights instance

In the Azure portal, create or go to the Application Insights instance that you want to use. Note the instance instrumentation key. You use the instrumentation key in other configuration steps.

  ![Location of the key instrumentation](./media/enable-profiler-compute/CopyAIKey.png)

This instance should be the same as your application. It's configured to send telemetry data to on each request.
Profiler results also are available in this instance.  

In the Azure portal, complete the steps that are described in [Enable the profiler](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-profiler#enable-the-profiler) to finish setting up the Application Insights instance for the profiler. You don't need to link web apps for the example in this article. Just ensure that the profiler is enabled in the portal.


## Set up the application source code

Set up your application to send telemetry data to an Application Insights instance on each `Request` operation:  

1. Add the [Application Insights SDK](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-overview#get-started) to your application project. Make sure that the NuGet package versions are as follows:  
  - For ASP.NET applications: [Microsoft.ApplicationInsights.Web](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Web/) 2.3.0 or later.
  - For ASP.NET Core applications: [Microsoft.ApplicationInsights.AspNetCore](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore/) 2.1.0 or later.
  - For other .NET and .NET Core applications (for example, a Service Fabric stateless service or a Cloud Services worker role):
  [Microsoft.ApplicationInsights](https://www.nuget.org/packages/Microsoft.ApplicationInsights/) or [Microsoft.ApplicationInsights.Web](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Web/) 2.3.0 or later.  

2. If your application is *not* an ASP.NET or ASP.NET Core application (for example, if it's a Cloud Services worker role or Service Fabric stateless APIs), the following extra instrumentation setup is required:  

  1. Add the following code early in the application lifetime:  

    ```csharp
    using Microsoft.ApplicationInsights.Extensibility;
    ...
    // Replace with your own Application Insights instrumentation key.
    TelemetryConfiguration.Active.InstrumentationKey = "00000000-0000-0000-0000-000000000000";
    ```
  For more information about this global instrumentation key configuration, see [Use Service Fabric with Application Insights](https://github.com/Azure-Samples/service-fabric-dotnet-getting-started/blob/dev/appinsights/ApplicationInsights.md).  

  2. For any piece of code that you want to instrument, add a `StartOperation<RequestTelemetry>` **USING** statement around it, as in the following example:

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

  Calling `StartOperation<RequestTelemetry>` within another `StartOperation<RequestTelemetry>` scope is not supported. You can use `StartOperation<DependencyTelemetry>` in the nested scope instead. For example:  

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


## Set up the environment deployment definition

The environment in which the profiler and your application execute can be a virtual machine, a virtual machine scale set, a Service Fabric cluster, or a Cloud Services instance.  

### Virtual machines, virtual machine scale sets, or Service Fabric

Full examples:  
  * [Virtual machine](https://github.com/Azure/azure-docs-json-samples/blob/master/application-insights/WindowsVirtualMachine.json)
  * [Virtual machine scale set](https://github.com/Azure/azure-docs-json-samples/blob/master/application-insights/WindowsVirtualMachineScaleSet.json)
  * [Service Fabric cluster](https://github.com/Azure/azure-docs-json-samples/blob/master/application-insights/ServiceFabricCluster.json)

1. To ensure that [.NET Framework 4.6.1](https://docs.microsoft.com/en-us/dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed) or later is in use, it's sufficient to confirm that the deployed OS is `Windows Server 2012 R2` or later.

2. Locate the [Azure Diagnostics](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/azure-diagnostics) extension in the deployment template file, and then add the following `SinksConfig` section as a child element of `WadCfg`. Replace the `ApplicationInsightsProfiler` property value with your own Application Insights instrumentation key:  
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

  For information about adding the Diagnostics extension to your deployment template, see [Use monitoring and diagnostics with a Windows VM and Azure Resource Manager templates](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/extensions-diagnostics-template?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).


### Cloud Services

1. To ensure that [.NET Framework 4.6.1](https://docs.microsoft.com/en-us/dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed) or later is in use, it's sufficient to confirm that ServiceConfiguration.\*.cscfg files have an `osFamily` value of **"5"** or later.

2. Locate the [Azure Diagnostics](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/azure-diagnostics) diagnostics.wadcfgx file for your application role:  
  ![Location of the diagnostics config file](./media/enable-profiler-compute/cloudservice-solutionexplorer.png)  
  If you can't find the file, to learn how to enable the Diagnostics extension in your Cloud Services project, see [Set up diagnostics for Azure Cloud Services and virtual machines](https://docs.microsoft.com/en-us/azure/vs-azure-tools-diagnostics-for-cloud-services-and-virtual-machines#enable-diagnostics-in-cloud-service-projects-before-deploying-them).

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
> If the `diagnostics.wadcfgx` file also contains another sink of type `ApplicationInsights`, all three of these instrumentation keys must match:  
>  * The instrumentation key used by your application.  
>  * The instrumentation key used by the `ApplicationInsights` sink.  
>  * The instrumentation key used by the `ApplicationInsightsProfiler` sink.  
>
> You can find the actual instrumentation key value used by the `ApplicationInsights` sink in the ServiceConfiguration.\*.cscfg files.  
> After the Visual Studio 15.5 Azure SDK release, only the instrumentation keys used by the application and `ApplicationInsightsProfiler` sink need to match each other.


## Environment deployment and runtime configurations

1. Deploy the modified environment deployment definition.  

  To apply the modifications, typically a full template deployment or a cloud services publish through PowerShell cmdlets or Visual Studio is involved.  

  The following is an alternate approach for existing virtual machines that touches only its Azure Diagnostics extension:  
  ```powershell
  $ConfigFilePath = [IO.Path]::GetTempFileName()
  # After you export the currently deployed Diagnostics config to a file, edit it to include the ApplicationInsightsProfiler sink.
  (Get-AzureRmVMDiagnosticsExtension -ResourceGroupName "MyRG" -VMName "MyVM").PublicSettings | Out-File -Verbose $ConfigFilePath
  # Set-AzureRmVMDiagnosticsExtension might require the -StorageAccountName argument
  # if your original diagnostics configuration had the storageAccountName property in the protectedSettings section
  # (which is not downloadable). Make sure to pass the same original value you had in this cmdlet call.
  Set-AzureRmVMDiagnosticsExtension -ResourceGroupName "MyRG" -VMName "MyVM" -DiagnosticsConfigurationPath $ConfigFilePath
  ```

2. If the intended application is running through [IIS](https://www.microsoft.com/web/platform/server.aspx), enable the `IIS Http Tracing` Windows feature:  
  
  1. Establish remote access to the environment, and then use the [Add Windows Features]( https://docs.microsoft.com/en-us/iis/configuration/system.webserver/tracing/) window, or run the following command in PowerShell (as administrator):  
    ```powershell
    Enable-WindowsOptionalFeature -FeatureName IIS-HttpTracing -Online -All
    ```  
  2. If establishing remote access is a problem, you can use [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/get-started-with-azure-cli) to run the following command:  
    ```powershell
    az vm run-command invoke -g MyResourceGroupName -n MyVirtualMachineName --command-id RunPowerShellScript --scripts "Enable-WindowsOptionalFeature -FeatureName IIS-HttpTracing -Online -All"
    ```


## Enable the profiler on on-premises servers

Enabling the profiler on an on-premises server is also known as running Application Insights Profiler in standalone mode (it's not tied to Azure Diagnostics extension modifications). 

We have no plan to officially support the profiler for on-premises servers. If you are interested in experimenting with this scenario, you can [download support code](https://github.com/ramach-msft/AIProfiler-Standalone). We are *not* responsible for maintaining that code, or for responding to issues and feature requests related to the code.

## Next steps

- Generate traffic to your application (for example, launch an [availability test](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-monitor-web-app-availability)). Then, wait 10 to 15 minutes for traces to start to be sent to the Application Insights instance.
- See [Profiler traces](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-profiler#enable-the-profiler) in the Azure portal.
- Get help with troubleshooting profiler issues in [Profiler troubleshooting](app-insights-profiler.md#troubleshooting).
- Read more about the profiler in [Application Insights Profiler](app-insights-profiler.md).
