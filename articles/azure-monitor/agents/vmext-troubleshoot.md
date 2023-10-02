---
title: Troubleshoot the Azure Log Analytics VM extension
description: Describe the symptoms, causes, and resolution for the most common issues with the Log Analytics VM extension for Windows and Linux Azure VMs.
ms.topic: conceptual
ms.date: 06/06/2019

---

# Troubleshoot the Log Analytics VM extension in Azure Monitor
This article provides help troubleshooting errors you might experience with the Log Analytics VM extension for Windows and Linux virtual machines running on Azure. The article suggests possible solutions to resolve them.

To verify the status of the extension:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the portal, select **All services**. In the list of resources, enter **virtual machines**. As you begin typing, the list filters based on your input. Select **Virtual machines**.
1. In your list of virtual machines, find and select it.
1. On the virtual machine, select **Extensions**.
1. From the list, check to see if the Log Analytics extension is enabled or not. For Linux, the agent is listed as **OMSAgentforLinux**. For Windows, the agent is listed as **MicrosoftMonitoringAgent**.

   ![Screenshot that shows the VM Extensions view.](./media/vmext-troubleshoot/log-analytics-vmview-extensions.png)

1. Select the extension to view details.

   ![Screenshot that shows the VM extension details.](./media/vmext-troubleshoot/log-analytics-vmview-extensiondetails.png)

## Troubleshoot the Azure Windows VM extension

If the Microsoft Monitoring Agent VM extension isn't installing or reporting, perform the following steps to troubleshoot the issue:

1. Check if the Azure VM agent is installed and working correctly by using the steps in [KB 2965986](https://support.microsoft.com/kb/2965986#mt1):
   * You can also review the VM agent log file `C:\WindowsAzure\logs\WaAppAgent.log`.
   * If the log doesn't exist, the VM agent isn't installed.
   * [Install the Azure VM Agent](../../virtual-machines/extensions/agent-windows.md#install-the-azure-windows-vm-agent).
1. Review the Microsoft Monitoring Agent VM extension log files in `C:\Packages\Plugins\Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent`.
1. Ensure the virtual machine can run PowerShell scripts.
1. Ensure permissions on C:\Windows\temp haven't been changed.
1. View the status of the Microsoft Monitoring Agent by entering `(New-Object -ComObject 'AgentConfigManager.MgmtSvcCfg').GetCloudWorkspaces() | Format-List` in an elevated PowerShell window on the virtual machine.
1. Review the Microsoft Monitoring Agent setup log files in `C:\WindowsAzure\Logs\Plugins\Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent\1.0.18053.0\`. This path changes based on the version number of the agent.

For more information, see [Troubleshooting Windows extensions](../../virtual-machines/extensions/oms-windows.md).

## Troubleshoot the Linux VM extension
[!INCLUDE [log-analytics-agent-note](../../../includes/log-analytics-agent-note.md)]
If the Log Analytics agent for Linux VM extension isn't installing or reporting, perform the following steps to troubleshoot the issue:

1. If the extension status is **Unknown**, check if the Azure VM agent is installed and working correctly by reviewing the VM agent log file `/var/log/waagent.log`.
   * If the log doesn't exist, the VM agent isn't installed.
   * [Install the Azure VM Agent on Linux VMs](../../virtual-machines/extensions/agent-linux.md#installation).
1. For other unhealthy statuses, review the Log Analytics agent for Linux VM extension logs files in `/var/log/azure/Microsoft.EnterpriseCloud.Monitoring.OmsAgentForLinux/*/extension.log` and `/var/log/azure/Microsoft.EnterpriseCloud.Monitoring.OmsAgentForLinux/*/CommandExecution.log`.
1. If the extension status is healthy but data isn't being uploaded, review the Log Analytics agent for Linux log files in `/var/opt/microsoft/omsagent/log/omsagent.log`.

## Next steps

For more troubleshooting guidance related to the Log Analytics agent for Linux, see [Troubleshoot issues with the Log Analytics agent for Linux](../agents/agent-linux-troubleshoot.md).
