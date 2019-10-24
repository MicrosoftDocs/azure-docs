---
title: Troubleshoot Azure Log Analytics VM Extension in Azure Monitor | Microsoft Docs
description: Describe the symptoms, causes, and resolution for the most common issues with the Log Analytics VM extension for Windows and Linux Azure VMs.
services: log-analytics
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: tysonn
ms.assetid: 
ms.service: log-analytics
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/06/2019
ms.author: magoedte
---

# Troubleshooting the Log Analytics VM extension in Azure Monitor
This article provides help troubleshooting errors you might experience with the Log Analytics VM extension for Windows and Linux virtual machines running on Microsoft Azure, and suggests possible solutions to resolve them.

To verify the status of the extension, perform the following steps from the Azure portal.

1. Sign into the [Azure portal](https://portal.azure.com).
2. In the Azure portal, click **All services**. In the list of resources, type **virtual machines**. As you begin typing, the list filters based on your input. Select **Virtual machines**.
3. In your list of virtual machines, find and select it.
3. On the virtual machine, click **Extensions**.
4. From the list, check to see if the Log Analytics extension is enabled or not.  For Linux, the agent is listed as **OMSAgentforLinux** and for Windows, the agent is listed as **MicrosoftMonitoringAgent**.

   ![VM Extension View](./media/vmext-troubleshoot/log-analytics-vmview-extensions.png)

4. Click on the extension to view details. 

   ![VM Extension Details](./media/vmext-troubleshoot/log-analytics-vmview-extensiondetails.png)

## Troubleshooting Azure Windows VM extension

If the *Microsoft Monitoring Agent* VM extension is not installing or reporting, you can perform the following steps to troubleshoot the issue.

1. Check if the Azure VM agent is installed and working correctly by using the steps in [KB 2965986](https://support.microsoft.com/kb/2965986#mt1).
   * You can also review the VM agent log file `C:\WindowsAzure\logs\WaAppAgent.log`
   * If the log does not exist, the VM agent is not installed.
   * [Install the Azure VM Agent](../../azure-monitor/learn/quick-collect-azurevm.md#enable-the-log-analytics-vm-extension)
2. Review the Microsoft Monitoring Agent VM extension log files in `C:\Packages\Plugins\Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent`
3. Ensure the virtual machine can run PowerShell scripts
4. Ensure permissions on C:\Windows\temp haven’t been changed
5. View the status of the Microsoft Monitoring Agent by typing the following in an elevated PowerShell window on the virtual machine `(New-Object -ComObject 'AgentConfigManager.MgmtSvcCfg').GetCloudWorkspaces() | Format-List`
6. Review the Microsoft Monitoring Agent setup log files in `C:\Windows\System32\config\systemprofile\AppData\Local\SCOM\Logs`

For more information, see [troubleshooting Windows extensions](../../virtual-machines/extensions/oms-windows.md).

## Troubleshooting Linux VM extension
[!INCLUDE [log-analytics-agent-note](../../../includes/log-analytics-agent-note.md)] 
If the *Log Analytics agent for Linux* VM extension is not installing or reporting, you can perform the following steps to troubleshoot the issue.

1. If the extension status is *Unknown* check if the Azure VM agent is installed and working correctly by reviewing the VM agent log file `/var/log/waagent.log`
   * If the log does not exist, the VM agent is not installed.
   * [Install the Azure VM Agent on Linux VMs](../../azure-monitor/learn/quick-collect-azurevm.md#enable-the-log-analytics-vm-extension)
2. For other unhealthy statuses, review the Log Analytics agent for Linux VM extension logs files in `/var/log/azure/Microsoft.EnterpriseCloud.Monitoring.OmsAgentForLinux/*/extension.log` and `/var/log/azure/Microsoft.EnterpriseCloud.Monitoring.OmsAgentForLinux/*/CommandExecution.log`
3. If the extension status is healthy, but data is not being uploaded review the Log Analytics agent for Linux log files in `/var/opt/microsoft/omsagent/log/omsagent.log`

For more information, see [troubleshooting Linux extensions](../../virtual-machines/extensions/oms-linux.md).

## Next steps

For additional troubleshooting guidance related to the Log Analytics agent for Linux hosted on computers outside of Azure, see [Troubleshoot Azure Log Analytics Linux Agent](agent-linux-troubleshoot.md).  
