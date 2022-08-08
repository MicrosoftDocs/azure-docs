# Migrate from Service map to Azure Monitor VM insights

[Service map](https://docs.microsoft.com/en-us/azure/azure-monitor/vm/service-map) will retire on 31 August 2024. If you are using this feature to monitor connections between servers, processes, inbound and outbound connection latency, and ports across any TCP-connected architecture make sure to transition to [Azure Monitor VM insights](https://docs.microsoft.com/en-us/azure/azure-monitor/vm/vminsights-overview) before this date.

VM insights monitors the performance and health of your virtual machines and virtual machine scale sets, including their running processes and dependencies on other resources. The map feature visualizes the VM dependencies by discovering running processes that have active network connection between servers, inbound and outbound connection latency or ports across any TCP-connected architecture over a specified time range. [Learn more about the benefits of Map feature over Service map](https://docs.microsoft.com/en-us/azure/azure-monitor/faq#how-is-vm-insights-map-feature-different-from-service-map-). 

## Enable Azure Monitor VM insights using Azure Monitor agent
Migrate from service map to Azure Monitor VM insights using Azure Monitor agent and data collection rules. Azure Monitor agent is meant to replace the Log Analytics agent which was used by service map. Refer to our documentation to enable VM insights for Azure VMs and on-prem machines.
- [How to enable VM insights using Azure Monitor agent for Azure VMs?] <link TBD>

If you have an on-prem machine, we recommend enabling [Azure Arc for servers](https://docs.microsoft.com/en-us/azure/azure-arc/servers/overview) so that the VMs can be enabled for VM insights using processes similar to Azure VMs.

Once you migrate to VM insights, remove the ServiceMap solution from the workspace to avoid data duplication and incurring additional costs.

## Remove ServiceMap solution from the workspace
1.	Sign in to the [Azure portal](https://portal.azure.com/).
1.	In the search bar, type **Log Analytics workspaces**. As you begin typing, the list filters suggestions based on your input. Select **Log Analytics workspaces**.
1.	In your list of Log Analytics workspaces, select the workspace you chose when you enabled ServiceMap.
1.	On the left, select **Solutions**.
1.	In the list of solutions, select **ServiceMap(workspace name)**. On the Overview page for the solution, select Delete. When prompted to confirm, select **Yes**.

The service map UI will not be available after retirement.
