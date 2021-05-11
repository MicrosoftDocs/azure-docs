---
title: Troubleshoot VM insights guest health (preview)
description: Describes troubleshooting steps that you can take when you have issues with VM insights health.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 02/25/2021

---

# Troubleshoot VM insights guest health (preview)
This article describes troubleshooting steps that you can take when you have issues with VM insights health.


## Upgrade available message is still displayed after upgrading guest health 

- Verify that VM is running in global Azure. Arc enabled servers are not yet supported.
- Verify that the virtual machine's region and operating system version are supported as described in [Enable Azure Monitor for VMs guest health (preview)](vminsights-health-enable.md).
- Verify that guest health extension installed successfully with 0 exit code.
- Verify that Azure Monitor agent extension is installed successfully.
- Verify that system-assigned managed identity is enabled for the virtual machine.
- Verify that no user-assigned managed identities are specified for the virtual machine.
- Verify for Windows virtual machines that locale is *US English*. Localization is not currently supported by Azure Monitor agent.
- Verify that the virtual machine is not using the network proxy. Azure Monitor agent does not currently support proxies.
- Verify that the health extension agent started without errors. If the agent can't start, the agent's state may be corrupt. Delete the contents of the agent state folder and restart the agent.
  - For Linux: Daemon is *vmGuestHealthAgent*. State folder is */var/opt/vmGuestHealthAgent/**
  - For Windows: Service is *VM Guest Health agent*. State folder is _%ProgramData%\Microsoft\VMGuestHealthAgent\\*_.
- Verify the Azure Monitor agent has network connectivity. 
  - From the virtual machine, attempt to ping _<region>.handler.control.monitor.azure.com_. For example, for a virtual machine in westeurope, attempt to ping _westeurope.handler.control.monitor.azure.com:443_.
- Verify that virtual machine has an association with a data collection rule in the same region as the Log Analytics workspace.
  -  Refer to **Create data collection rule (DCR)** in [Enable Azure Monitor for VMs guest health (preview)](vminsights-health-enable.md) to ensure structure of the DCR is correct. Pay particular attention to presence of *performanceCounters* data source section set up to samples three counters and presence of *inputDataSources* section in health extension configuration to send counters to the extension.
-  Check the virtual machine for guest health extension errors.
   -  For Linux: Check logs at _/var/log/azure/Microsoft.Azure.Monitor.VirtualMachines.GuestHealthLinuxAgent/*.log_.
   -  For Windows: Check logs at _C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.Monitor.VirtualMachines.GuestHealthWindowsAgent\{extension version}\*.log_.
-  Check the virtual machine for Azure Monitor agent errors.
   -  For Linux: Check logs at _/var/log/mdsd.*_.
   -  For Windows: Check logs at _C:\WindowsAzure\Resources\*{vmName}.AMADataStore_.
 



## Error message that no data is available 

![No data](media/vminsights-health-troubleshoot/no-data.png)


### Verify that the virtual machine meets configuration requirements

1. Verify that the virtual machine is an Azure virtual machine. Azure Arc for servers is not currently supported.
2. Verify that the virtual machine is running a [supported operating system](vminsights-health-enable.md?current-limitations.md).
3. Verify that the virtual machine is installed in a [supported region](vminsights-health-enable.md?current-limitations.md).
4. Verify that the Log Analytics workspace is installed in a [supported region](vminsights-health-enable.md?current-limitations.md).

### Verify that the VM is properly onboarded
Verify that the Azure Monitor agent extension and Guest VM Health agent are successfully provisioned on the virtual machine. Select **Extensions** from the virtual machine's menu in the Azure portal and make sure that the two agents are listed.

![VM extensions](media/vminsights-health-troubleshoot/extensions.png)

### Verify the system assigned identity is enabled on the virtual machine
Verify that the system assigned identity is enabled on the virtual machine. Select **Identity** from the virtual machine's menu in the Azure portal. If user managed identity is enabled, regardless of the status of the system managed identity, Azure Monitor agent will not be able to communicate with the configuration service, and the guest health extension will not work.

![System assigned identity](media/vminsights-health-troubleshoot/system-identity.png)

### Verify data collection rule
Verify that the data collection rule specifying health extension as a data source is associated with the virtual machine.

## Error message for bad request due to insufficient permissions
This error indicates that the **Microsoft.WorkloadMonitor** resource provider wasn’t registered in the subscription. See [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider) for details on registering this resource provider. 

![Bad request](media/vminsights-health-troubleshoot/bad-request.png)

## Health shows as "unknown" after guest health is enabled.

### Verify that performance counters on Windows nodes are working correctly 
Guest health relies on the agent being able to collect performance counters from the node. he base set of performance counter libraries may become corrupted and may need to be rebuilt. Follow the instructions at [Manually rebuild performance counter library values](/troubleshoot/windows-server/performance/rebuild-performance-counter-library-values) to rebuild the performance counters.





## Next steps

- [Get an overview of the guest health feature of VM insights](vminsights-health-overview.md)