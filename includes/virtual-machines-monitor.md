---
title: include file
description: include file
author: cynthn
ms.service: virtual-machines
ms.topic: include
ms.date: 09/30/2019
ms.author: cynthn
---

With the significant growth of VMs hosted in Azure, it's important to identify performance and health issues that impact applications and infrastructure services they support. Basic monitoring is delivered by default with Azure by the metric types CPU usage, disk utilization, memory utilization, and network traffic collected by the host hypervisor. Additional metric and log data can be collected using [extensions](../articles/virtual-machines/windows/extensions-features.md) to configure diagnostics on your VMs from the guest operating system.

To detect and help diagnose performance and health issues with the guest operating system, .NET based or Java web application components running inside the VM, Azure Monitor delivers centralized monitoring with comprehensive features such as Azure Monitor for VMs and Application Insights.

## Diagnostics and metrics 

You can set up and monitor the collection of [diagnostics data](https://docs.microsoft.com/cli/azure/vm/diagnostics) using [metrics](../articles/monitoring-and-diagnostics/monitoring-overview-metrics.md) in the Azure portal, the Azure CLI, Azure PowerShell, and programming Applications Programming Interfaces (APIs). For example, you can:

- **Observe basic metrics for the VM.** On the Overview screen of the Azure portal, the basic metrics shown include CPU usage, network usage, total of disk bytes, and disk operations per second.

- **Enable the collection of boot diagnostics and view it using the Azure portal.** When bringing your own image to Azure or even booting one of the platform images, there can be many reasons why a VM gets into a non-bootable state. You can easily enable boot diagnostics when you create a VM by clicking **Enabled** for Boot Diagnostics under the Monitoring section of the Settings screen.

    As VMs boot, the boot diagnostic agent captures boot output and stores it in Azure storage. This data can be used to troubleshoot VM boot issues. Boot diagnostics are not automatically enabled when you create a VM from command-line tools. Before enabling boot diagnostics, a storage account needs to be created for storing boot logs. If you enable boot diagnostics in the Azure portal, a storage account is automatically created for you.

    If you didn’t enable boot diagnostics when the VM was created, you can always enable it later by using [Azure CLI](https://docs.microsoft.com/cli/azure/vm/boot-diagnostics), [Azure PowerShell](https://docs.microsoft.com/powershell/module/az.compute/set-azvmbootdiagnostic), or an [Azure Resource Manager template](../articles/virtual-machines/windows/extensions-diagnostics-template.md).

- **Enable the collection of guest OS diagnostics data.** When you create a VM, you have the opportunity on the settings screen to enable guest OS diagnostics. When you do enable the collection of diagnostics data, the [IaaSDiagnostics extension for Linux](../articles/virtual-machines/linux/diagnostic-extension.md) or the [IaaSDiagnostics extension for Windows](../articles/virtual-machines/windows/ps-extensions-diagnostics.md) is added to the VM, which enables you to collect additional disk, CPU, and memory data.

    Using the collected diagnostics data, you can configure autoscaling for your VMs. You can also configure [Azure Monitor Logs](../articles/azure-monitor/platform/data-platform-logs.md) to store the data and set up alerts to let you know when performance isn't right.

## Alerts

You can create [alerts](../articles/azure-monitor/platform/alerts-overview.md) based on specific performance metrics. Examples of the issues you can be alerted about include when average CPU usage exceeds a certain threshold, or available free disk space drops below a certain amount. Alerts can be configured in the [Azure portal](../articles/azure-monitor/platform/alerts-metric.md#create-with-azure-portal), using [Azure Resource Manager templates](../articles/azure-monitor/platform/alerts-metric-create-templates.md), or [Azure CLI](../articles/azure-monitor/platform/alerts-metric.md#with-azure-cli).

## Azure Service Health

[Azure Service Health](../articles/service-health/service-health-overview.md) provides personalized guidance and support when issues in Azure services affect you, and helps you prepare for upcoming planned maintenance. Azure Service Health alerts you and your teams using targeted and flexible notifications.

## Azure Resource Health

[Azure Resource health](../articles/service-health/resource-health-overview.md) helps you diagnose and get support when an Azure issue impacts your resources. It informs you about the current and past health of your resources and helps you mitigate issues. Resource health provides technical support when you need help with Azure service issues.

## Azure Activity Log

The [Azure Activity Log](../articles/azure-monitor/platform/platform-logs-overview.md) is a subscription log that provides insight into subscription-level events that have occurred in Azure. The log includes a range of data, from Azure Resource Manager operational data to updates on Service Health events. You can click Activity Log in the Azure portal to view the log for your VM.

Some of the things you can do with the activity log include:

- Create an [alert on an Activity Log event](../articles/azure-monitor/platform/platform-logs-overview.md).
- [Stream it to an Event Hub](../articles/azure-monitor/platform/activity-logs-stream-event-hubs.md) for ingestion by a third-party service or custom analytics solution such as Power BI.
- Analyze it in Power BI using the [Power BI content pack](https://powerbi.microsoft.com/documentation/powerbi-content-pack-azure-audit-logs/).
- [Save it to a storage account](../articles/azure-monitor/platform/archive-activity-log.md) for archival or manual inspection. You can specify the retention time (in days) using the Log Profile.

You can also access activity log data by using [Azure PowerShell](https://docs.microsoft.com/powershell/module/azurerm.insights/), the [Azure CLI](https://docs.microsoft.com/cli/azure/monitor), or [Monitor REST APIs](https://docs.microsoft.com/rest/api/monitor/).

[Azure Resource Logs](../articles/azure-monitor/platform/platform-logs-overview.md) are logs emitted by your VM that provide rich, frequent data about its operation. Resource logs differ from the activity log by providing insight about operations that were performed within the VM.

Some of the things you can do with diagnostics logs include:

- [Save them to a storage account](../articles/azure-monitor/platform/archive-diagnostic-logs.md) for auditing or manual inspection. You can specify the retention time (in days) using Resource Diagnostic Settings.
- [Stream them to Event Hubs](../articles/azure-monitor/platform/resource-logs-stream-event-hubs.md) for ingestion by a third-party service or custom analytics solution such as Power BI.
- Analyze them with [Log Analytics](../articles/log-analytics/log-analytics-azure-storage.md).

## Advanced monitoring

For visibility of the application or service supported by the Azure VM and virtual machine scale sets, identification of issues with the guest OS or workload running in the VM to understand if it is impacting availability or performance of the application, or is an issue with the application, enable both [Azure Monitor for VMs](../articles/azure-monitor/insights/vminsights-overview.md) and [Application Insights](../articles/azure-monitor/app/app-insights-overview.md).

Azure Monitor for VMs monitors your Azure virtual machines (VM) at scale by analyzing the performance and health of your Windows and Linux VMs, including the different processes and interconnected dependencies on other resources and external processes it discovers. It includes several trend performance charts to help during investigation of problems and assess capacity of your VMs. The dependency map shows monitored and unmonitored machines, failed and active network connections between processes and these machines, and shows trend charts with standard network connection metrics. Combined with Application Insights, you monitor your application and capture telemetry such as HTTP requests, exceptions, etc. so you can correlate issues between the VMs and your application. Configure [Azure Monitor alerts](../articles/azure-monitor/platform/alerts-overview.md) to alert you on important conditions detected from monitoring data collected by Azure Monitor for VMs.

## Next steps

- Walk through the steps in [Monitor a Windows Virtual Machine with Azure PowerShell](../articles/virtual-machines/windows/tutorial-monitoring.md) or [Monitor a Linux Virtual Machine with the Azure CLI](../articles/virtual-machines/linux/tutorial-monitoring.md).

- Learn more about the best practices around [Monitoring and diagnostics](https://docs.microsoft.com/azure/architecture/best-practices/monitoring).
