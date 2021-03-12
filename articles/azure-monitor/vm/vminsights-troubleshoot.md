---
title: Troubleshoot VM insights
description: Troubleshoot VM insights installation.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/11/2021
ms.custom: references_regions

---

# Troubleshoot VM insights
When onboarding an Azure cirtual machine from the Azure portal, the following steps occur:

- A default Log Analytics workspace is created if that option was selected.
- The Log Analytics agent is installed on Azure virtual machines using a VM extension if the agent is already installed.
- The Dependency agent is installed on Azure virtual machines using an extension, if determined it is required.
  
During the onboarding process, each of these steps is verified and a notification status shown in the portal. Configuration of the workspace and the agent installation typically takes 5 to 10 minutes. It will take another 5 to 10 minutes for data to become available to view in the portal.

If you receive a message that the virtual machine needs to be onboarded after you've performed the onboarding process, allow for up to 30 minutes for the process to be completed.

If the issue persists, then see the following sections for possible causes.

## Is the virtual machine is running?
 If the virtual machine has been turned off for a while, is off currently, or was only recently turned on then you won't have data to display for a bit until data arrives.

## Is the operating system supported?
If the operating system is not in the list of [supported operating systems](vminsights-enable-overview.md#supported-operating-systems) then the extension will fail to install and you will see this message that we are waiting for data to arrive.

## Did the extension install properly?
If you still see a message  that the virtual machine needs to be onboarded, it may mean that one or both of the extensions failed to install correctly. Check the **Extensions** page for your virtual machine in the Azure portal to verify that the following extensions are listed.

| Operating system | Agents | 
|:---|:---|
| Windows | MicrosoftMonitoringAgent<br>Microsoft.Azure.Monitoring.DependencyAgent |
| Linux | OMSAgentForLinux<br>DependencyAgentForLinux |

- If you do not see the both extensions for your operating system in the list of installed extensions, then they need to be installed. 
- If the status does not appear as *Provisioning succeeded* then the extension should be removed and reinstalled.

## Do you have connectivity issues?
For Windows machines, you can use the  *TestCloudConnectivity* tool to identify connectivity issue. This tool is installed by default with the agent in the folder *%SystemRoot%\Program Files\Microsoft Monitoring Agent\Agent*. Run the tool from an elevated command prompt. It will return results and highlight where the test fails. 




For more information refer [Troubleshoot Connectivity issues.
## Next steps

To learn how to use the Performance monitoring feature, see [View VM insights Performance](../vm/vminsights-performance.md). To view discovered application dependencies, see [View VM insights Map](../vm/vminsights-maps.md).
