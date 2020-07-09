---
title: Deploy Azure Monitor
description: 
ms.subservice: 
ms.topic: conceptual
ms.date: 05/08/2020

---

# Deploy Azure Monitor
This article describes the different steps required for a complete implementation of Azure Monitor to monitor all of the resources in your Azure subscription. Basic descriptions for each step are provided with links to other documentation for complete details. Some of the steps need to be performed only once or a limited number of times for a particular subscription, while others need to be performed for each resource or virtual machine. For these resources, see [Deploy Azure Monitor at scale](platform/deploy-scale.md) after going through this guide.

The features of Azure Monitor and their configuration will vary depending on your business requirements balanced with the cost of the enabled features. Each step will identify whether there is potential cost, and you should assess these costs before determining how broadly to implement your monitoring.

As you enable features in Azure Monitor, data will be collected to either [Azure Monitor Metrics](platform/data-platform-metrics.md) or [Azure Monitor Logs](platform/data-platform-logs.md). Each stores different kinds of data and enable kinds of analysis and alerting. See [Compare Azure Monitor Metrics and Logs](platform/data-platform.md) for a comparison of the two and [Overview of alerts in Microsoft Azure](platform/alerts-overview.md) for a description of different alert types.

## Collect data from Azure resources

> [!NOTE]
> See [Monitoring Azure resources with Azure Monitor](insights/monitor-azure-resource.md) for a complete guide on monitoring virtual machines with Azure Monitor.

Some monitoring of Azure resources is available automatically with no configuration required, while you must perform configuration steps to collect additional monitoring data. The following table illustrates the configuration steps required to collect all available data from your Azure resources, including at which step different data is collected into Azure Monitor Metrics and Azure Monitor Logs. The sections below describe each step in further detail.

![Deploy Azure resource monitoring](media/deploy/deploy-azure-resources.png)

### Automatic monitoring
The following features of Azure Monitor are enabled out of the box with no configuration required when you create an Azure subscription. There is no cost associated with this monitoring.

#### Activity log
The [Activity log](platform/platform-logs-overview.md) provides insight into subscription-level events that have occurred in Azure. Events are automatically written to the Activity log when you create a new Azure resource, modify a resource, or perform a significant activity. You can view events in the Azure portal and create alerts when particular events are created.


See [Azure Activity log](platform/activity-log.md) for details of the Activity log and how to view it in the Azure portal.

See below for collecting the Activity log into a Log Analytics workspace.

#### Platform metrics
[Platform metrics](platform/metrics-supported.md) are collected automatically into [Azure Monitor Metrics](platform/data-platform-metrics.md) from Azure services where they can be analyzed using [Metrics explorer](platform/metrics-getting-started.md). This data is often presented on the **Overview** page in the Azure portal for different services.

See below for collecting platform metrics into a Log Analytics workspace.

### Create Log Analytics workspace
You require at least one [Log Analytics workspace](platform/design-logs-deployment.md) to enable [Azure Monitor Logs](platform/data-platform-logs.md). This is required for collecting logs from Azure resources, collecting data from the guest operating system of Azure virtual machines, and for most Azure Monitor insights. You can start with a single workspace to support this monitoring, but see  [Designing your Azure Monitor Logs deployment](platform/design-logs-deployment.md) for guidance on when to use multiple workspaces.


There is no cost for creating a Log Analytics workspace, but there is a potential charge one you configure data to be collected into it. See [Manage usage and costs with Azure Monitor Logs](manage-cost-storage.md) for details.

See [Create a Log Analytics workspace in the Azure portal](learn/quick-create-workspace.md) to create a Log Analytics workspace. See [Manage access to log data and workspaces in Azure Monitor](platform/manage-access.md) to configure access to the workspace.

 


### Create diagnostic setting to collect Activity log into Logs
While the [Activity log](platform-logs-overview.md) is collected automatically, you should configure it to also collect into your Log Analytics workspace to combine it with the other data used with Azure Monitor Logs.  You can also configure it to send to Event Hubs if you require your data sent outside of Azure Monitor, such as to an external incident management system.

Create a [diagnostic setting](platform/diagnostic-settings.md) for your subscription to copy Activity log entries to your Log Analytics workspace or send to Event Hub. There's no cost for this collection. See [Create diagnostic settings in Azure portal](platform/diagnostic-settings.md#create-diagnostic-settings-in-azure-portal) for details.


### Create diagnostic setting to collect resource logs
Resources in Azure automatically generate [resource logs](platform/platform-logs-overview.md) that provide details of operations performed within the resource. Unlike platform metrics, you need to configure resource logs to be collected. Collect them into a Log Analytics workspace to combine it with the other data used with Azure Monitor Logs and to Event Hubs if you require your data sent outside of Azure Monitor, such as to an external incident management system.

Create a [diagnostic setting](platform/diagnostic-settings.md) on each resource to collect its resource logs. There is a cost for this collection so refer to [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) and [Event Hubs pricing](https://azure.microsoft.com/pricing/details/event-hubs/) before implementing across a significant number of resources. Also see [Manage usage and costs with Azure Monitor Logs](manage-cost-storage.md) for details on optimizing the cost of your log collection.

See [Create diagnostic setting to collect resource logs and metrics in Azure](diagnostic-settings.md#create-diagnostic-settings-in-azure-portal) for details on creating a diagnostic setting. Since a diagnostic setting needs to be created for each Azure resource, see [Deploy Azure Monitor at scale](platform/deploy-scale.md) for details on using [Azure policy](../governance/policy/overview.md) to have settings automatically created each time an Azure resource is created. 


## Collect data from virtual machines

> [!NOTE]
> See [Monitoring Azure virtual machines with Azure Monitor](insights/monitor-vm-azure.md) for a complete guide on monitoring virtual machines with Azure Monitor. 

While platform metrics and the Activity log are collected automatically for each virtual machines host just like any other Azure resource, you need agents to collect data from the guest operating system. See [Overview of Azure Monitor agents](platform/agents-overview.md) for a comparison of the agents used by Azure Monitor.



![Deploy Azure VM](media/deploy/deploy-azure-vm.png)

### Enable Azure Monitor for VMs on workspace
Azure Monitor for VMs requires at least one Log Analytics workspace which will typically be the same workspace as the one created to collect data from other Azure resources. Before you onboard any virtual machines, you must enable Azure Monitor for VMs on the workspace. 




You can access the configuration for the workspace directly from Azure Monitor for VMs by selecting **Workspace configuration** from the **Get Started**. Click on the workspace name to open its menu.







- Enable the workspace for Azure Monitor for VMs. See [Enable Azure Monitor for VMs overview](../insights/vminsights-enable-overview.md) for details.
- 



You must configure a workspace before you can enable virtual machines. This will typically be the same workspace that you configured to collect data from Azure resources. 

Once a workspace has been enabled, you must enable each VM to be monitored for Azure Monitor for VMs. This process will perform the following:

- Install Log Analytics agent
- Install Dependency agent
- Enable the computer for Azure Monitor for VMs

Enable using [Azure portal](../insights/vminsights-enable-single-vm.md), [Resource Manager template](insights/vminsights-enable-at-scale-powershell.md).

Since you need to enable Azure Monitor VMs for each virtual machine, you'll typically use Azure Policy to have it enabled automatically each time you create a VM. See [Deploy Azure Monitor at scale](platform/deploy-scale.md) for details.


### Configure Log Analytics workspace
The Log Analytics agent sends log and performance data from virtual machines guests to a Log Analytics workspace.  The Log Analytics agent retrieves its configuration from the Log Analytics workspace it's connected to. You only need to configure the workspace once, and each time an agent connects, it will download any configuration changes. 

See [Agent data sources in Azure Monitor](platform/agent-data-sources.md) for details on this configuration and the data sources that can be collected.



### Diagnostic extension and Telegraf agent
Azure Monitor for VMs will collect data to a Log Analytics workspace but not to Azure Monitor Metrics. 



## Enable insights and solutions
Insights and solutions provide monitoring for a particular service or solution. Insights use more recent features of Azure Monitor such as workbooks, so you will most likely use an insight if it's available for your service. If not, then install the solution which will still provide you with significant value beyond the standard features of Azure Monitor.

### Insights
Insights are automatically available in every Azure subscription. They will typically be enabled for each instance of their resource but require onboarding for full functionality.

For example, Azure Monitor for Key Vaults (preview) is automatically enabled for all key vaults using data from platform metrics that are automatically collected for all Azure resources. You can enable additional functionality though by onboarding each key vault to collect its resource logs into a Log Analytics workspace.

There is no cost to insights although you will be charged for any data that they ingest.

See the documentation for each insight for any unique onboarding requirements.

### Solutions
Solutions must be added to a Log Analytics workspace. If you have multiple workspaces in your subscription, then you may need to enable the solution in each workspace with data to evaluate.

There is no cost to solutions although you will be charged for any data that they ingest.

See [Install a monitoring solution](insights/solutions.md#install-a-monitoring-solution) for details.


## Monitor applications
Monitoring of your custom applications is performed by Azure Monitor using [Application Insights](app/app-insights-overview.md). 

![Deploy application insights](media/deploy/deploy-application-insights.png)


### Create an application resource
You must create a resource in Application Insights for each application that you're going to monitor. Performance data collected by Application Insights is stored in Azure Monitor Metrics while other data is stored in Azure Monitor Logs. This is stored separately from your Log Analytics works as described in [How is data in Azure Monitor Logs structured?](platform/data-platform-logs.md#how-is-data-in-azure-monitor-logs-structured). Currently in preview though is the ability to store your application data directly in the Log Analytics workspace with your other data. This simplifies your configuration and allows your application to take advantage of all the features of a Log Analytics workspace.

See [Create an Application Insights resource](app/create-new-resource.md) to create a classic application. 
See [Workspace-based Application Insights resources (preview)](app/create-workspace-resource.md) to create a workspace-based application.

To enable monitoring, you must decide whether you will use codeless or code-based monitoring.

### Configure codeless monitoring
This method is easiest to implement and can be configured after your code development. It doesn't require any updates to your code. See the following resources for details depending on the your application.

- [Applications hosted on Azure Web Apps](app/azure-web-apps.md)
- [Java applications](app/java-in-process-agent.md)
- [ASP.NET applications hosted in IIS on Azure VM or Azure virtual machine scale set](app/azure-vm-vmss-apps.md)
- [ASP.NET applications hosted in IIS on-premises VM](app/monitor-performance-live-website-now.md)


### Configure code-based monitoring
This method is more customizable and collects additional telemetry, but it requires adding a dependency to your code on the Application Insights SDK NuGet packages. See the following resources for details depending on your application.

- [ASP.NET Applications](app/asp-net.md)
- [ASP.NET Core Applications](app/asp-net-core.md)
- [.NET Console Applications](app/console.md)
- [Java](app/java-get-started.md)
- [Node.js](app/nodejs.md)
- [Python](app/opencensus-python.md)
- [Other platforms](app/platforms.md)

### Other monitoring
In addition to collecting data from the application itself, you can configure the following additional monitoring with Application Insights.

- [Instrument your web pages](app/javascript.md) for page view, AJAX, and other client-side telemetry.
- [Analyze mobile app usage](learn/mobile-center-quickstart.md) by integrating with Visual Studio App Center.
- [Availability tests](app/monitor-web-app-availability.md) - ping your website regularly from our servers.


## Workbooks and visualizations
In addition to analyzing collected metric data with [metrics explorer]() and collected log data using [log queries]() in Log Analytics, you can use [different methods to visualize](visualizations.md) this data.

### Workbooks
[Workbooks](platform/workbooks-overview.md) in Azure Monitor allow you to create rich visual reports in the Azure portal. You can combine different sets of metric and log data collected in Azure Monitor to create unified interactive experiences. Insights include pre-built workbooks, and you can access a gallery of workbooks in the **Workbooks** tab of the Azure Monitor menu. See [Azure Monitor Workbooks](platform/workbooks-overview.md) for details on creating custom workbooks.

### Dashboards
[Azure dashboards](../azure-portal/azure-portal-dashboards.md) are the primary dashboarding technology for Azure and allow you to combine Azure Monitor data with data from other services to provide a single pane of glass over your Azure infrastructure.

## Alerts
As you use the tools in Azure Monitor to inspect data that you've collected, you can start to create [alert rules](platform/alerts-overview.md) that proactively notify you of any notable information identified in your monitoring data.


### Action groups
[Action groups](platform/action-groups.md) are a collection of notification preferences used by alert rules to determine the action to perform when an alert is triggered. Examples of actions include sending a mail or text, calling a webhook, or send data to an ITSM tool. Each alert rule requires at least one action group, and a single action group can be used by multiple alert rules.

See [Create and manage action groups in the Azure portal](platform/action-groups.md) for details on creating an action group and a description of the different actions it can include.


### Alert rules
There are multiple types of alert rules defined by the type of data that they use. Each has different capabilities, and a different cost. The basic strategy you should follow is to use the alert rule type with the lowest cost that provides the logic that you require.

- [Activity log rules](platform/activity-log-alerts.md). Creates an alert in response to a new Activity log event that matches specified conditions. There is no cost to these alerts so they should be your first choice. See [Create, view, and manage activity log alerts by using Azure Monitor](platform/alerts-activity-log.md) for details on creating an Activity log alert.
- [Metric alert rules](platform/alerts-metric-overview.md). Creates an alert in response to one or more metric values exceeding a threshold. Metric alerts are stateful meaning that the alert will automatically close when the value drops below the threshold, and it will only send out notifications when the state changes. There is a cost to metric alerts, but this is significantly less than log alerts. See [Create, view, and manage metric alerts using Azure Monitor](platform/alerts-metric.md) for details on creating a metric alert.
- [Log alert rules](platform/alerts-unified-log.md). Creates an alert when the results of a schedule query matches specified criteria. They are the most expensive of the alert rules, but they allow the most complex criteria. See [Create, view, and manage log alerts using Azure Monitor](platform/alerts-log.md) for details on creating a log query alert.
- [Application alerts](app/monitor-web-app-availability.md) allow you to perform proactive performance and availability testing of your web application. You can perform a simple ping test at no cost, but there is a cost to more complex testing. See [Monitor the availability of any website](app/monitor-web-app-availability.md) for a description of the different tests and details on creating them.l





## Next steps

- Get an [overview of alerts](alerts-overview.md).
