---
title: Deploy an extension-based Windows or Linux User Hybrid Runbook Worker in Azure Automation
description: This article tells how to deploy an extension-based Windows or Linux Hybrid Runbook Worker that you can use to run runbooks on Windows-based machines in your local datacenter or cloud environment.
services: automation
ms.subservice: process-automation
ms.date: 09/24/2021
ms.topic: conceptual 
---

# Deploy an extension-based Windows or Linux User Hybrid Runbook Worker in Automation

The extension-based onboarding is only for **User** Hybrid Runbook Workers. For **System** Hybrid Runbook Worker onboarding, see [Deploy an agent-based Windows Hybrid Runbook Worker in Automation](./automation-windows-hrw-install.md) or [Deploy an agent-based Linux Hybrid Runbook Worker in Automation](./automation-linux-hrw-install.md). 

You can use the user Hybrid Runbook Worker feature of Azure Automation to run runbooks directly on an Azure or non-Azure machine, including servers registered with [Azure Arc-enabled servers](../azure-arc/servers/overview.md). From the machine or server that's hosting the role, you can run runbooks directly against it and against resources in the environment to manage those local resources.

Azure Automation stores and manages runbooks and then delivers them to one or more designated machines. This article describes how to deploy a user Hybrid Runbook Worker on a Windows or Linux machine, how to remove the worker, and how to remove a Hybrid Runbook Worker group.

After you successfully deploy a runbook worker, review [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md) to learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment.

## Prerequisites

### Minimum requirements
- Two cores.
- 4 GB of RAM.
- Port 443 (outbound).
- The system-assigned managed identity must be enabled on the Azure virtual machine or Arc enabled server.  If the system-assigned managed identity is not enabled, it will be enabled as part of the adding process.
- Non-Azure machines must have the Azure Arc enabled servers agent installed (The connected machine agent). For instructions to install the `AzureConnectedMachineAgent`, see [Connect hybrid machines to Azure from the Azure portal](../azure-arc/servers/onboard-portal.md).

### Supported operating systems
| Windows | Linux (x64)|
|---|---|
| &#9679; Windows Server 2019 (including Server Core), <br> &#9679; Windows Server 2016, version 1709 and 1803 (excluding Server Core), and <br> &#9679; Windows Server 2012, 2012 R2 <br><br> | &#9679; Debian GNU/Linux 7 and 8, <br> &#9679; Ubuntu 18.04, and 20.04 LTS, <br> &#9679; SUSE Linux Enterprise Server 15, and 15.1 (SUSE did not release versions numbered 13 or 14), and <br> &#9679; Red Hat Enterprise Linux Server 7 and 8 |

### Other Requirements
| Windows | Linux (x64)|
|---|---|
| Windows PowerShell 5.1 (download WMF 5.1). PowerShell Core is not supported.| Linux Hardening must not be enabled.  |
| .NET Framework 4.6.2 or later. ||

### Package requirements for Linux

| Required package | Description |Minimum version|
|--------------------- | --------------------- | -------------------|
|Glibc |GNU C Library| 2.5-12 |
|Openssl| OpenSSL Libraries | 1.0 (TLS 1.1 and TLS 1.2 are supported)|
|Curl | cURL web client | 7.15.5|
|Python-ctypes | Foreign function library for Python| Python 2.x or Python 3.x are required |
|PAM | Pluggable Authentication Modules|

| Optional package | Description | Minimum version|
|--------------------- | --------------------- | -------------------|
| PowerShell Core | To run PowerShell runbooks, PowerShell Core needs to be installed. For instructions, see [Installing PowerShell Core on Linux](/powershell/scripting/install/installing-powershell-core-on-linux) | 6.0.0 |

### Network requirements
?

## Create hybrid worker group 

Perform the following steps to create a hybrid worker group in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your Automation account. 

1. Under **Process Automation**, select **Hybrid worker groups**. 

1. Select **+ Create hybrid worker group**. 

1. From the **Basics** tab, in the **Name** text box, enter a name for your Hybrid worker group. 

1. For the **Use run as credential** option: 
   - If you select **No**, the hybrid extension will be installed using the local system account.
   - If you select **Yes**, then from the drop-down list, select the credential asset.

1. Select **Next** to advance to the **Hybrid worker selection** tab. You can select Azure virtual machines or Azure Arc-enabled servers to be added to this Hybrid worker group. If you don't select any machines, an empty Hybrid worker group will be created. You can still add machines later. 

1. Select **Add machines** to go to the **Add machines as hybrid worker** page. You will only see machines that are not part of any other hybrid worker group. 

1. Select the checkbox next to the machine(s) you want to add to the hybrid worker group. If you don't see your non-Azure machine listed, ensure Azure Arc Connected Machine agent is installed on the machine.  

1. Select **Add**. 

1. Select **Next** to advance to the **Review + Create** tab. 

1. Select **Create**. This operation will install the hybrid worker extension on the machine and will register the hybrid worker to the hybrid worker group. You can verify that the hybrid worker has been created under **Process Automation** > **Hybrid worker groups** > **User hybrid worker groups**. You may need to select **Refresh**. If you select the group name, it will show you the hybrid worker details.

> [!NOTE]
> The selected machine will not be added to the hybrid worker group if it is already part of another hybrid worker group.

## Add a machine to the hybrid worker group

You can also create an empty hybrid worker group and then add machines.  

1. Under **Process Automation**, select **Hybrid worker groups** and then your hybrid worker group to go to the **Hybrid Worker Group** page.

1. Under **Hybrid worker group**, select **Hybrid Workers**.

1. Select **+ Add** to go to the **Add machines as hybrid worker** page. You will only see machines that are not part of any other hybrid worker group. 

1. Select the checkbox next to the machine(s) you want to add to the hybrid worker group. If you don't see your non-Azure machine listed, ensure Azure Arc Connected Machine agent is installed on the machine.

1. Select **Add** to add the machine to the group. Once added, you can see the machine type as Azure virtual machine or Arc-enabled server. You also see the **Worker Type** as **HybridV1** (agent-based) or **HybridV2** (extension-based).

## Delete a Hybrid Runbook Worker

You can delete the Hybrid Runbook Worker from the portal.

1. Under **Process Automation**, select **Hybrid worker groups** and then your hybrid worker group to go to the **Hybrid Worker Group** page.

1. Under **Hybrid worker group**, select **Hybrid Workers**.

1. Select the checkbox next to the machine(s) you want to delete from the hybrid worker group.

1. Select **Delete**.  You will be presented with a warning in a dialog box **Delete Hybrid worker** that the selected hybrid worker would be deleted permanently. Select **Delete**. This operation will delete the extension for the hybrid worker v2 (extension-based) or remove the hybrid worker v1 (agent-based) entry from the portal.

## Delete a Hybrid Runbook Worker group

You can delete the Hybrid Runbook Worker group from the portal.

1. Under **Process Automation**, select **Hybrid worker groups** and then your hybrid worker group to go to the **Hybrid Worker Group** page.

1. Select **Delete**. You will be presented with a warning in a dialog box to remove any machine that are defined as hybrid workers in the hybrid worker group. If there is already a worker added to the group, you will first have to delete the worker from the group.

1. Select **Yes**. The hybrid worker group will be deleted.

## Next steps

* To learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment, see [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md).

* To learn how to troubleshoot your Hybrid Runbook Workers, see [Troubleshoot Hybrid Runbook Worker issues](troubleshoot/hybrid-runbook-worker.md#general).