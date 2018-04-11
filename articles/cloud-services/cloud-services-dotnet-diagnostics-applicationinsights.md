---
title: Troubleshoot Cloud Services using Application Insights | Microsoft Docs
description: Learn how to troubleshoot cloud service issues by using Application Insights to process data from Azure Diagnostics.
services: cloud-services
documentationcenter: .net
author: sbtron
manager: timlt
editor: tysonn

ms.assetid: e93f387b-ef29-4731-ae41-0676722accb6
ms.service: cloud-services
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/23/2017
ms.author: saurabh

---
# Troubleshoot Cloud Services using Application Insights
With [Azure SDK 2.8](https://azure.microsoft.com/downloads/) and Azure diagnostics extension 1.5, you can send Azure Diagnostics data for your Cloud Service directly to Application Insights. The logs collected by Azure Diagnostics&mdash;including application logs, Windows Event Logs, ETW Logs, and performance counters&mdash;can be sent to Application Insights. You can then visualize this information in the Application Insights portal UI. You can then use the Application Insights SDK to get insights into metrics and logs that come from your application, as well as the system and infrastructure-level data that comes from Azure Diagnostics.

## Configure Azure Diagnostics to send data to Application Insights
Follow these steps to set up your cloud service project to send Azure Diagnostics data to Application Insights.

1. In Visual Studio Solution Explorer, right-click a role and select **Properties** to open the Role designer.

    ![Solution Explorer Role Properties][1]

2. In the **Diagnostics** section of the Role designer, select the **Send diagnostics data to Application Insights** option.

    ![Role designer send diagnostics data to application insights][2]

3. In the dialog box that pops up, select the Application Insights resource that you want to send the Azure diagnostics data to. The dialog box allows you to select an existing Application Insights resource from your subscription or to manually specify an instrumentation key for an Application Insights resource. For more information on creating an Application Insights resource, see [Create a new Application Insights resource](../application-insights/app-insights-create-new-resource.md).

    ![select application insights resource][3]

    Once you have added the Application Insights resource, the instrumentation key for that resource is stored as a service configuration setting with the name **APPINSIGHTS_INSTRUMENTATIONKEY**. You can change this configuration setting for each service configuration or environment. To do so, select a different configuration from the **Service Configuration** list and specify a new instrumentation key for that configuration.

    ![select service configuration][4]

    The **APPINSIGHTS_INSTRUMENTATIONKEY** configuration setting is used by Visual Studio to configure the diagnostics extension with the appropriate Application Insights resource information during publishing. The configuration setting is a convenient way of defining different instrumentation keys for different service configurations. Visual Studio will translate that setting and insert it into the diagnostics extension public configuration during the publish process. To simplify the process of configuring the diagnostics extension with PowerShell, the package output from Visual Studio also contains the public configuration XML with the appropriate Application Insights instrumentation key. The public config files are created in the Extensions folder and follow the pattern *PaaSDiagnostics.&lt;RoleName&gt;.PubConfig.xml*. Any PowerShell-based deployments can use this pattern to map each configuration to a role.

4) To configure Azure diagnostics to send all performance counters and error-level logs collected by the Azure diagnostics agent to Application Insights, enable the **Send diagnostics data to Application Insights** option. 

    If you want to further configure what data is sent to Application Insights, you must manually edit the *diagnostics.wadcfgx* file for each role. See [Configure Azure Diagnostics to send data to Application Insights](#configure-azure-diagnostics-to-send-data-to-application-insights) to learn more about manually updating the configuration.

When the cloud service is configured to send Azure diagnostics data to application insights, you can deploy it to Azure normally, making sure the Azure diagnostics extension is enabled. For more information, see  [Publishing a Cloud Service using Visual Studio](../vs-azure-tools-publishing-a-cloud-service.md).  

## Viewing Azure diagnostics data in Application Insights
The Azure diagnostic telemetry shows up in the Application Insights resource configured for your cloud service.

Azure diagnostics log types map to Application Insights concepts in these ways:

* Performance counters are displayed as Custom Metrics in Application Insights.
* Windows Event Logs are shown as Traces and Custom Events in Application Insights.
* Application logs, ETW logs, and any Diagnostics Infrastructure logs are shown as Traces in Application Insights.

To view Azure diagnostics data in Application Insights, do one of the following:

* Use [Metrics explorer](../application-insights/app-insights-metrics-explorer.md) to visualize any custom performance counters or counts of different types of Windows Event Log events.

    ![Custom Metrics in Metrics Explorer][5]

* Use [Search](../application-insights/app-insights-diagnostic-search.md) to search across the  trace logs sent by Azure Diagnostics. For example, if an unhandled exception has caused the role to crash and recycle, information about the exception shows up in the *Application* channel of *Windows Event Log*. You can use search to look at the Windows Event Log error and get the full stack trace for the exception to help find the cause of the issue.

    ![Search Traces][6]

## Next Steps
* [Add the Application Insights SDK to your cloud service](../application-insights/app-insights-cloudservices.md) to send data about requests, exceptions, dependencies, and any custom telemetry from your application. When combined with the Azure Diagnostics data, this information you can get a complete view of your application and system, all in the same Application Insight resource.  

<!--Image references-->
[1]: ./media/cloud-services-dotnet-diagnostics-applicationinsights/solution-explorer-properties.png
[2]: ./media/cloud-services-dotnet-diagnostics-applicationinsights/role-designer-sendtoappinsights.png
[3]: ./media/cloud-services-dotnet-diagnostics-applicationinsights/select-appinsights-resource.png
[4]: ./media/cloud-services-dotnet-diagnostics-applicationinsights/role-designer-appinsights-serviceconfig.png
[5]: ./media/cloud-services-dotnet-diagnostics-applicationinsights/metrics-explorer-custom-metrics.png
[6]: ./media/cloud-services-dotnet-diagnostics-applicationinsights/search-windowseventlog-error.png
