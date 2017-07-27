---
title: Enable the Azure Application Insights Profiler for a Compute resource | Microsoft Docs
description: Learn how to setup the Profiler to 
services: application-insights
documentationcenter: ''
author: CFreemanwa
manager: carmonm
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 07/25/2017
ms.author: cfreeman

---

# How to enable Application Insights Profiler on Azure Compute resources

This walk-through demonstrates how to enable Application Insights Profiler on an ASP.NET application hosted by Azure Compute resources. The examples include support for Virtual Machines, Virtual Machine Scale Sets, and Services Fabric. The examples all rely on templates that support the Azure Resource Management deployment model. For more information about the deployment model please review [Azure Resource Manager vs. classic deployment: Understand deployment models and the state of your resources](/azure-resource-manager/resource-manager-deployment-model).

## Overview

The following diagram illustrates how the Profiler works for Azure Compute resources. It uses an Azure Virtual Machine as an example.

![Overview](./media/enable-profiler-compute/overview.png)
You must install the Diagnostics Agent component for the Azure Compute resources in order to  collect information for processing and display on the Azure portal. The rest of the walk-through provides guidance on how to install and configure the diagnostics agent to enable the Application Insights Profiler.

### Prerequisites for the walk-through

* Download the deployment Resource Manager templates that install the Profiler agents on the VMs or Scale Sets.

    [WindowsVirtualMachine.json](https://github.com/CFreemanwa/samples/blob/master/WindowsVirtualMachine.json) | [WindowsVirtualMachineScaleSet.json](https://github.com/CFreemanwa/samples/blob/master/WindowsVirtualMachineScaleSet.json)
* An Application Insights instance enabled for profiling. Check https://docs.microsoft.com/en-us/azure/application-insights/app-insights-profiler#enable-the-profiler to see how to do that.
* .NET framework >= 4.6.1 installed in the target Azure Compute resource.


## Enable the Profiler on Azure Virtual Machines Resource Manager deployment model
These steps are explained in this section:
* Create Resource Group in your Azure subscription
* Create an Application Insights resource in the Resource group
* Apply Application Insights Instrumentation Key in the Azure Resource Manager template
* Create Azure VM to host the web application
* Configure Web Deploy on the VM
* Install Azure Application Insights SDK to your project
* Publish the project to Azure VM
* Enable the Profiler on Application Insight
* Add an Availability Test to your application
* View your performance data

### Create a Resource Group in your Azure subscription
The following example demonstrates how to do create a resource group using a PowerShell script:

```
New-AzureRmResourceGroup -Name "Replace_With_Resource_Group_Name" -Location "Replace_With_Resource_Group_Location"
```

### Create an Application Insights resource in the Resource group

![Create Application Insights](./media/enable-profiler-compute/createai.png)

### Apply Application Insights Instrumentation Key in the Azure Resource Manager template
If you haven't downloaded the template yet, download the template from below. [WindowsVirtualMachine.json](https://github.com/CFreemanwa/samples/blob/master/WindowsVirtualMachine.json)

![Find AI Key](./media/enable-profiler-compute/copyaikey.png)

![Replace Template Value](./media/enable-profiler-compute/copyaikeytotemplate.png)

### Create Azure VM to host the web application
* Create a secure string to save the password
```
$password = ConvertTo-SecureString -String "Replace_With_Your_Password" -AsPlainText -Force
```

* Deploy the Azure Resource Manager template

Change directory in PowerShell console to the folder that contains your Resource Manager template. To deploy the template run the following command:

```
New-AzureRmResourceGroupDeployment -ResourceGroupName "Replace_With_Resource_Group_Name" -TemplateFile .\WindowsVirtualMachine.json -adminUsername "Replace_With_your_user_name" -adminPassword $password -dnsNameForPublicIP "Replace_WIth_your_DNS_Name" -Verbose
```

After the script executes successfully, you should find a VM named *MyWindowsVM* in your resource group.

### Configure Web Deploy on the VM
Make sure **Web Deploy** is enabled on your VM so you can publish your web application from Visual Studio.

You can install Web Deploy on a VM manually via WebPI:[Installing and Configuring Web Deploy on IIS 8.0 or Later](https://docs.microsoft.com/en-us/iis/install/installing-publishing-technologies/installing-and-configuring-web-deploy-on-iis-80-or-later)

Here is an example for how to automate installing Web Deploy using Azure Resource Manager template:
[Create, configure, and deploy Web Application to an Azure VM](https://azure.microsoft.com/en-us/resources/templates/201-web-app-vm-dsc/)

If you are deploying an ASP.NET MVC application, you need to go to Server Manager, **Add Roles and Features | Web Server (IIS) | Web Server | Application Development** and enable ASP.NET 4.5 on your server.
![Add ASP.NET](./media/enable-profiler-compute/addaspnet45.png)

### Install Azure Application Insights SDK to your project
* Open your ASP.NET web application in Visual Studio
* Right click on the project and select **Add | Connected Services**
* Choose Application Insights
* Follow the instructions on the page. Select the Application Insights resource you have created earlier
* Click the **Register** button


### Publish the project to Azure VM
There are several ways to publish an application to an Azure VM. One way is to do so in Visual Studio 2017.
To finish the publishing process, right click on the project, select 'Publish...'. Select Azure Virtual Machine as the publish target and follow the steps.

![Publish-FromVS](./media/enable-profiler-compute/publishtoVM.png)

Run some load test against your application. you should be able to see results in the Application Insights instance portal webpage.


### Enable the Profiler on Application Insight
Go to your Application Insights Performance blade. Click on the Configure icon and Enable the Profiler

![Enable Profiler step 1](./media/enable-profiler-compute/enableprofiler1.png)

![Enable Profiler step 2](./media/enable-profiler-compute/enableprofiler2.png)

### Add an Availability Test to your application
Browse to the Application Insights resource you created earlier. Go to the Availability blade and add a performance test that sends web requests to your application URL. This way we can collect some sample data to be displayed in the Application Insights Profiler

![Add Performance Test][./media/enable-profiler-compute/add-test.png]

### View your performance data

Wait for a 10-15 minutes for the Profiler to collect and analyze the data. Then go to the Performance blade in your AI resource and view how your application was performing when it's under load.

![View Performance][./media/enable-profiler-compute/view-aiperformance.png]

Clicking on the icon under Examples with open the Trace View blade.

![Trace View][./media/enable-profiler-compute/traceview.png]


### What to Add If You Have an Existing Azure Resource Manager (Resource Manager) Template for VM or virtual machine scale set

1. Locate the Windows Azure Diagnostics (WAD) resource declaration in your deployment template.
  * Create one if you don't have it yet (check how it's done in the full example).
  * You can update the template from the Azure Resource website (https://resources.azure.com).
2. Modify publisher from "Microsoft.Azure.Diagnostics" to "AIP.Diagnostics.Test".
3. Use typeHandlerVersion as "0.0".
4. Make sure to have autoUpgradeMinorVersion set to true.
5. Add the new ApplicationInsightsProfiler sink instance in WadCfg settings object, as shown in the following example.

```
"resources": [
        {
          "type": "extensions",
          "name": "Microsoft.Insights.VMDiagnosticsSettings",
          "apiVersion": "2016-03-30",
          "properties": {
            "publisher": "AIP.Diagnostics.Test",
            "type": "IaaSDiagnostics",
            "typeHandlerVersion": "0.0",
            "autoUpgradeMinorVersion": true,
            "settings": {
              "WadCfg": {
                "SinksConfig": {
                  "Sink": [
                    {
                      "name": "Give a descriptive short name. E.g.: MyApplicationInsightsProfilerSink",
                      "ApplicationInsightsProfiler": "Enter the Application Insights instance instrumentation key guid here"
                    }
                  ]
                },
                "DiagnosticMonitorConfiguration": {
                    ...
                }
                ...
              }
              ...
            }
            ...
          }
          ...
]
```

## Enable the Profiler on Virtual Machine Scale Sets
Download the [WindowsVirtualMachineScaleSet.json](https://github.com/CFreemanwa/samples/blob/master/WindowsVirtualMachineScaleSet.json) template to see how to enable the Profiler. Apply the same changes in a VM template to virtual machine scale set diagnostics extension resource.
Make sure each instance in the Scale Set has access to Internet, so the Profiler Agent can send the collected samples to Application Insights to be analyzed and displayed.

## Enable the Profiler on Service Fabric applications
Currently enabling the Profiler on Service Fabric applications requires the following:
1. Provision the Service Fabric Cluster have the WAD extension that installs the Profiler agent
2. Install Application Insights SDK in the project and configure AI Key
3. Add application code to instrument telemetry

### Provision the Service Fabric Cluster have the WAD extension that installs the Profiler agent
A Service Fabric cluster can be secure or non-secure. You may set one Gateway cluster to be non-secure so it doesn't require a certificate for access. Clusters that host business logic and data should be secure. You can enable the Profiler on both secure and non-secure Service Fabric clusters. This walk-through uses a non-secure cluster as an example to explain what changes are required to enable the Profiler. You can provision a secure cluster in the same way.

Download the [ServiceFabricCluster.json](https://github.com/CFreemanwa/samples/blob/master/ServiceFabricCluster.json). Same as for VMs and virtual machine scale set, replace the Application Insights Key with your AI Key:

```
"publisher": "AIP.Diagnostics.Test",
                 "settings": {
                   "WadCfg": {
                     "SinksConfig": {
                       "Sink": [
                         {
                           "name": "MyApplicationInsightsProfilerSinkVMSS",
                           "ApplicationInsightsProfiler": "[Application_Insights_Key]"
                         }
                       ]
                     },
```

Deploy the template using PowerShell script:
```
Login-AzureRmAccount
New-AzureRmResourceGroup -Name [Your_Resource_Group_Name] -Location [Your_Resource_Group_Location] -Verbose -Force
New-AzureRmResourceGroupDeployment -Name [Choose_An_Arbitrary_Name] -ResourceGroupName [Your_Resource_Group_Name] -TemplateFile [Path_To_Your_Template]

```

### Install Application Insights SDK in the project and configure AI Key
Install Application Insights SDK from NuGet Package. Make sure you install a stable version 2.3 or later. [Microsoft.ApplicationInsights.Web](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Web/)
Please refer to [Using Service Fabric with Application Insights](https://github.com/Azure-Samples/service-fabric-dotnet-getting-started/blob/dev/appinsights/ApplicationInsights.md) for configuring the Application Insights in your projects.

### Add application code to instrument telemetry
For any piece of code you want to instrument, add a using statement around it. In the following  example, the RunAsync method below is doing some work, and the telemetryClient class captures the telemetry once it starts. The event needs a unique name across the application.

```
protected override async Task RunAsync(CancellationToken cancellationToken)
       {
           // TODO: Replace the following sample code with your own logic
           //       or remove this RunAsync override if it's not needed in your service.

           while (true)
           {
               using( var operation = telemetryClient.StartOperation<RequestTelemetry>("[Insert_Event_Unique_Name]"))
               {
                   cancellationToken.ThrowIfCancellationRequested();

                   ++this.iterations;

                   ServiceEventSource.Current.ServiceMessage(this.Context, "Working-{0}", this.iterations);

                   await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
               }

           }
       }
```

Deploy your application to the Service Fabric cluster. Wait for the app to run for 10 minutes. For better effect, you can run a load test on the app. Go to the Application Insights portal Performance blade, you should see Examples of profiling traces showing up.

<!---
Commenting out these sections for now
## Enable the Profiler on Cloud Services applications
[TODO]
## Enable the Profiler on classic Azure Virtual Machines
[TODO]
## Enable the Profiler on on-premise servers
[TODO]
--->

## Next steps

- Find help with troubleshooting profiler issues [Profiler troubleshooting](app-insights-profiler.md#troubleshooting)

- Read more about profiler [Application Insights Profiler](app-insights-profiler.md).
