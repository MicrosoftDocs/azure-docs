You can take advantage of many opportunities to monitor your VMs by collecting, viewing, and analyzing diagnostic and log data. To do simple [monitoring](../articles/azure-monitor/overview.md) of your VM, you can use the Overview screen for the VM in the Azure portal. You can use [extensions](../articles/virtual-machines/windows/extensions-features.md) to configure diagnostics on your VMs to collect additional metric data. You can also use more advanced monitoring options, such as [Application Insights](../articles/application-insights/app-insights-overview.md) and [Log Analytics](../articles/log-analytics/log-analytics-queries.md).

## Diagnostics and metrics 

You can set up and monitor the collection of [diagnostics data](https://docs.microsoft.com/cli/azure/vm/diagnostics) using [metrics](../articles/monitoring-and-diagnostics/monitoring-overview-metrics.md) in the Azure portal, the Azure CLI, Azure PowerShell, and programming Applications Programming Interfaces (APIs). For example, you can:

- **Observe basic metrics for the VM.** On the Overview screen of the Azure portal, the basic metrics shown include CPU usage, network usage, total of disk bytes, and disk operations per second.

- **Enable the collection of boot diagnostics and view it using the Azure portal.** When bringing your own image to Azure or even booting one of the platform images, there can be many reasons why a VM gets into a non-bootable state. You can easily enable boot diagnostics when you create a VM by clicking **Enabled** for Boot Diagnostics under the Monitoring section of the Settings screen.

    As VMs boot, the boot diagnostic agent captures boot output and stores it in Azure storage. This data can be used to troubleshoot VM boot issues. Boot diagnostics are not automatically enabled when you create a VM from command-line tools. Before enabling boot diagnostics, a storage account needs to be created for storing boot logs. If you enable boot diagnostics in the Azure portal, a storage account is automatically created for you.

    If you didn’t enable boot diagnostics when the VM was created, you can always enable it later by using [Azure CLI](https://docs.microsoft.com/cli/azure/vm/boot-diagnostics), [Azure PowerShell](https://docs.microsoft.com/powershell/module/azurerm.compute/set-azurermvmbootdiagnostics), or an [Azure Resource Manager template](../articles/virtual-machines/windows/extensions-diagnostics-template.md).

- **Enable the collection of guest OS diagnostics data.** When you create a VM, you have the opportunity on the settings screen to enable guest OS diagnostics. When you do enable the collection of diagnostics data, the [IaaSDiagnostics extension for Linux](../articles/virtual-machines/linux/diagnostic-extension.md) or the [IaaSDiagnostics extension for Windows](../articles/virtual-machines/windows/ps-extensions-diagnostics.md) is added to the VM, which enables you to collect additional disk, CPU, and memory data.

    Using the collected diagnostics data, you can configure autoscaling for your VMs. You can also configure logs to store the data and set up alerts to let you know when performance isn't quite right.

## Alerts

You can create [alerts](../articles/monitoring-and-diagnostics/monitoring-overview-alerts.md) based on specific performance metrics. Examples of the issues you can be alerted about include when average CPU usage exceeds a certain threshold, or available free disk space drops below a certain amount. Alerts can be configured in the [Azure portal](../articles/monitoring-and-diagnostics/insights-alerts-portal.md), using [Azure PowerShell](../articles/monitoring-and-diagnostics/insights-alerts-powershell.md), or the [Azure CLI](../articles/monitoring-and-diagnostics/insights-alerts-command-line-interface.md).

## Azure Service Health

[Azure Service Health](../articles/service-health/service-health-overview.md) provides personalized guidance and support when issues in Azure services affect you, and helps you prepare for upcoming planned maintenance. Azure Service Health alerts you and your teams using targeted and flexible notifications.

## Azure Resource Health

[Azure Resource health](../articles/service-health/resource-health-overview.md) helps you diagnose and get support when an Azure issue impacts your resources. It informs you about the current and past health of your resources and helps you mitigate issues. Resource health provides technical support when you need help with Azure service issues.

## Logs

The [Azure Activity Log](../articles/monitoring-and-diagnostics/monitoring-overview-activity-logs.md) is a subscription log that provides insight into subscription-level events that have occurred in Azure. The log includes a range of data, from Azure Resource Manager operational data to updates on Service Health events. You can click Activity Log in the Azure portal to view the log for your VM.

Some of the things you can do with the activity log include:

- Create an [alert on an Activity Log event](../articles/monitoring-and-diagnostics/monitoring-overview-activity-logs.md).
- [Stream it to an Event Hub](../articles/monitoring-and-diagnostics/monitoring-stream-activity-logs-event-hubs.md) for ingestion by a third-party service or custom analytics solution such as PowerBI.
- Analyze it in PowerBI using the [PowerBI content pack](https://powerbi.microsoft.com/documentation/powerbi-content-pack-azure-audit-logs/).
- [Save it to a storage account](../articles/monitoring-and-diagnostics/monitoring-archive-activity-log.md) for archival or manual inspection. You can specify the retention time (in days) using the Log Profile.

You can also access activity log data by using [Azure PowerShell](https://docs.microsoft.com/powershell/module/azurerm.insights/), the [Azure CLI](https://docs.microsoft.com/cli/azure/monitor), or [Monitor REST APIs](https://docs.microsoft.com/rest/api/monitor/).

[Azure Diagnostic Logs](../articles/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md) are logs emitted by your VM that provide rich, frequent data about its operation. Diagnostic logs differ from the activity log by providing insight about operations that were performed within the VM.

Some of the things you can do with diagnostics logs include:

- [Save them to a storage account](../articles/monitoring-and-diagnostics/monitoring-archive-diagnostic-logs.md) for auditing or manual inspection. You can specify the retention time (in days) using Resource Diagnostic Settings.
- [Stream them to Event Hubs](../articles/monitoring-and-diagnostics/monitoring-stream-diagnostic-logs-to-event-hubs.md) for ingestion by a third-party service or custom analytics solution such as PowerBI.
- Analyze them with [OMS Log Analytics](../articles/log-analytics/log-analytics-azure-storage.md).

## Advanced monitoring

- [Operations Management Suite (OMS)](https://docs.microsoft.com/azure/operations-management-suite/) provides monitoring, alerting, and alert remediation capabilities across cloud and on-premises assets. You can install an extension on a [Linux VM](../articles/virtual-machines/linux/extensions-oms.md) or a [Windows VM](../articles/virtual-machines/windows/extensions-oms.md) that installs the OMS agent, and enrolls the VM into an existing OMS workspace.

- [Log Analytics](../articles/log-analytics/log-analytics-overview.md) is a service in OMS that monitors your cloud and on-premises environments to maintain their availability and performance. It collects data generated by resources in your cloud and on-premises environments and from other monitoring tools to provide analysis across multiple sources.

    For Windows and Linux VMs, the recommended method for collecting logs and metrics is by installing the Log Analytics agent. The easiest way to install the Log Analytics agent on a VM is through the [Log Analytics VM Extension](../articles/log-analytics/log-analytics-azure-vm-extension.md). Using the extension simplifies the installation process and automatically configures the agent to send data to the Log Analytics workspace that you specify. The agent is also upgraded automatically, ensuring that you have the latest features and fixes.

- [Network Watcher](../articles/network-watcher/network-watcher-monitoring-overview.md) enables you to monitor your VM and its associated resources as they relate to the network that they are in. You can install the Network Watcher Agent extension on a [Linux VM](../articles/virtual-machines/linux/extensions-nwa.md) or a [Windows VM](../articles/virtual-machines/windows/extensions-nwa.md).

## Next steps
- Walk through the steps in [Monitor a Windows Virtual Machine with Azure PowerShell](../articles/virtual-machines/windows/tutorial-monitoring.md) or [Monitor a Linux Virtual Machine with the Azure CLI](../articles/virtual-machines/linux/tutorial-monitoring.md).
- Learn more about the best practices around [Monitoring and diagnostics](https://docs.microsoft.com/azure/architecture/best-practices/monitoring).
