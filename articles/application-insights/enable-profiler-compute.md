---
title: Enable Application Insights Profiler for applications that are hosted on Azure Cloud Services resources | Microsoft Docs
description: Learn how to set up Application Insights Profiler on an application running on Azure Cloud Services.
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: conceptual
ms.date: 10/16/2017
ms.reviewer: ramach
ms.author: mbullwin

---

# Enable Application Insights Profiler for Azure VMs, Service Fabric, and Azure Cloud Services

This article demonstrates how to enable Azure Application Insights Profiler on an ASP.NET application that is hosted by an Azure Cloud Services resource.

The examples in this article include support for Azure Virtual Machines, virtual machine scale sets, Azure Service Fabric, and Azure Cloud Services. The examples rely on templates that support the [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) deployment model.  


## Overview

The following image shows how Application Insights Profiler works with applications that are hosted on Azure Cloud Services resources. Azure Cloud Services resources include Virtual Machines, scale sets, cloud services, and Service Fabric clusters. The image uses an Azure virtual machine as an example.  

  ![Diagram showing how Application Insights Profiler works with Azure Cloud Services resources](./media/enable-profiler-compute/overview.png)

To fully enable Profiler, you must change the configuration in three locations:

* The Application Insights instance pane in the Azure portal.
* The application source code (for example, an ASP.NET web application).
* The environment deployment definition source code (for example, an Azure Resource Manager template in the .json file).


## Set up the Application Insights instance

1. [Create a new Application Insights resource](https://docs.microsoft.com/azure/application-insights/app-insights-create-new-resource), or select an existing one. 

1. Go to your Application Insights resource, and then copy the instrumentation key.

   ![Location of the instrumentation key](./media/enable-profiler-compute/CopyAIKey.png)

1. To finish setting up the Application Insights instance for Profiler, complete the procedure that's described in [Enable Profiler](https://docs.microsoft.com/azure/application-insights/app-insights-profiler). You don't need to link the web apps, because the steps are specific to the app services resource. Ensure that Profiler is enabled in the **Configure Profiler** pane.


## Set up the application source code

### ASP.NET web applications, Azure Cloud Services web roles, or the Service Fabric ASP.NET web front end
Set up your application to send telemetry data to an Application Insights instance on each `Request` operation.  

Add the [Application Insights SDK](https://docs.microsoft.com/azure/application-insights/app-insights-overview#get-started) to your application project. Make sure that the NuGet package versions are as follows:  
  - For ASP.NET applications: [Microsoft.ApplicationInsights.Web](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Web/) 2.3.0 or later.
  - For ASP.NET Core applications: [Microsoft.ApplicationInsights.AspNetCore](https://www.nuget.org/packages/Microsoft.ApplicationInsights.AspNetCore/) 2.1.0 or later.
  - For other .NET and .NET Core applications (for example, a Service Fabric stateless service or a Cloud Services worker role):
  [Microsoft.ApplicationInsights](https://www.nuget.org/packages/Microsoft.ApplicationInsights/) or [Microsoft.ApplicationInsights.Web](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Web/) 2.3.0 or later.  





## Configure environment deployment and runtime


