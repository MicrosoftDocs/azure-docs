---
title: Deploy a Windows Hybrid Runbook Worker in Azure Automation
description: This article tells how to deploy a Hybrid Runbook Worker that you can use to run runbooks on Windows-based computers in your local datacenter or cloud environment.
services: automation
ms.subservice: process-automation
ms.date: 12/10/2019
ms.topic: conceptual
---
# Deploy a Windows Hybrid Runbook Worker

You can use the Hybrid Runbook Worker feature of Azure Automation to run runbooks directly on the computer that's hosting the role and against resources in the environment to manage those local resources. Azure Automation stores and manages runbooks and then delivers them to one or more designated computers. This article describes how to deploy a Hybrid Runbook Worker on a Windows machine.

After you successfully deploy a runbook worker, review [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md) to learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../includes/azure-monitor-log-analytics-rebrand.md)]

## Windows Hybrid Runbook Worker installation and configuration

To install and configure a Windows Hybrid Runbook Worker, you can use one of the following methods.

* For Azure VMs, install the Log Analytics agent for Windows using the [virtual machine extension for Windows](../virtual-machines/extensions/oms-windows.md). The extension installs the Log Analytics agent on Azure virtual machines, and enrolls virtual machines into an existing Log Analytics workspace using an Azure Resource Manager template or PowerShell. Once the agent is installed, the VM can be added to a Hybrid Runbook Worker group in your Automation account. Refer to steps 3 and 4 in the [Manual deployment](#manual-deployment) section.

* Use an Automation runbook to completely automate the process of configuring a Windows computer. This is the recommended method for machines in your datacenter or another cloud environment.

* Follow a step-by-step procedure to manually install and configure the Hybrid Runbook Worker role on your non-Azure VM.

> [!NOTE]
> To manage the configuration of servers that support the Hybrid Runbook Worker role with Desired State Configuration (DSC), you must add the servers as DSC nodes.

### Minimum requirements for Windows Hybrid Runbook Worker

The minimum requirements for a Windows Hybrid Runbook Worker are:

* Windows Server 2012 or later
* Windows PowerShell 5.1 or later ([download WMF 5.1](https://www.microsoft.com/download/details.aspx?id=54616))
* .NET Framework 4.6.2 or later
* Two cores
* 4 GB of RAM
* Port 443 (outbound)

### Network configuration

To get more networking requirements for the Hybrid Runbook Worker, see [Configuring your network](automation-hybrid-runbook-worker.md#network-planning).

### Enabling servers for management with Azure Automation State Configuration

For information about enabling servers for management with Azure Automation State Configuration, see [Enable machines for management by Azure Automation State Configuration](automation-dsc-onboarding.md).

Enabling Azure Automation [Update Management](automation-update-management.md) automatically configures any Windows computer that's connected to your Log Analytics workspace as a Hybrid Runbook Worker to support runbook updates. However, this worker is not registered with any Hybrid Runbook Worker groups already defined in your Automation account.

### Addition of the computer to a Hybrid Runbook Worker group

You can add the worker computer to a Hybrid Runbook Worker group in your Automation account. Note that you must support Automation runbooks as long as you're using the same account for both the Azure Automation feature and the Hybrid Runbook Worker group membership. This functionality has been added to version 7.2.12024.0 of the Hybrid Runbook Worker.

## Automated deployment

On the target machine, perform the following steps to automate the installation and configuration of the Windows Hybrid Worker role.

### Step 1 - Download the PowerShell script

Download the **New-OnPremiseHybridWorker.ps1** script from the 
[PowerShell Gallery](https://www.powershellgallery.com/packages/New-OnPremiseHybridWorker). The download should be directly from the computer running the Hybrid Runbook Worker role or from another computer in your environment. When you have downloaded the script, copy it to your worker. The **New-OnPremiseHybridWorker.ps1** script uses the parameters described below during execution.

| Parameter | Status | Description |
| --------- | ------ | ----------- |
| `AAResourceGroupName` | Mandatory | The name of the resource group that's associated with your Automation account. |
| `AutomationAccountName` | Mandatory | The name of your Automation account.
| `Credential` | Optional | The credentials to use when logging in to the Azure environment. |
| `HybridGroupName` | Mandatory | The name of a Hybrid Runbook Worker group that you specify as a target for the runbooks that support this scenario. |
| `OMSResourceGroupName` | Optional | The name of the resource group for the Log Analytics workspace. If this resource group is not specified, the value of `AAResourceGroupName` is used. |
| `SubscriptionID` | Mandatory | The identifier of the Azure subscription associated with your Automation account. |
| `TenantID` | Optional | The identifier of the tenant organization associated with your Automation account. |
| `WorkspaceName` | Optional | The Log Analytics workspace name. If you don't have a Log Analytics workspace, the script creates and configures one. |

> [!NOTE]
> When enabling features, Azure Automation only supports certain regions for linking a Log Analytics workspace and an Automation account. For a list of the supported mapping pairs, see [Region mapping for Automation account and Log Analytics workspace](how-to/region-mappings.md).

### Step 2 - Open Windows PowerShell command line shell

Open **Windows PowerShell** from the **Start** screen in Administrator mode.

### Step 3 - Run the PowerShell script

In the PowerShell command line shell, browse to the folder that contains the script that you have downloaded. Change the values for the parameters `AutomationAccountName`, `AAResourceGroupName`, `OMSResourceGroupName`, `HybridGroupName`, `SubscriptionID`, and `WorkspaceName`. Then run the script.

You're prompted to authenticate with Azure after you run the script. You must sign in with an account that's a member of the Subscription Admins role and co-administrator of the subscription.

```powershell-interactive
.\New-OnPremiseHybridWorker.ps1 -AutomationAccountName <NameofAutomationAccount> -AAResourceGroupName <NameofResourceGroup>`
-OMSResourceGroupName <NameofOResourceGroup> -HybridGroupName <NameofHRWGroup> `
-SubscriptionID <AzureSubscriptionId> -WorkspaceName <NameOfLogAnalyticsWorkspace>
```

### Step 4 - Install NuGet

You're prompted to agree to install NuGet, and to authenticate with your Azure credentials. If you don't have the latest NuGet version, you can obtain it from [Available NuGet Distribution Versions](https://www.nuget.org/downloads).

### Step 5 - Verify the deployment

After the script is finished, the Hybrid Worker Groups page shows the new group and the number of members. If it's an existing group, the number of members is incremented. You can select the group from the list on the Hybrid Worker Groups page and choose the **Hybrid Workers** tile. On the Hybrid Workers page, you can see each member of the group listed.

## Manual deployment

On the target machine, perform the first two steps once for your Automation environment. Then perform the remaining steps for each worker computer.

### Step 1 - Create a Log Analytics workspace

If you don't already have a Log Analytics workspace, review the [Azure Monitor Log design guidance](../azure-monitor/platform/design-logs-deployment.md) before you create the workspace.

### Step 2 - Add an Azure Automation feature to the Log Analytics workspace

An Automation feature adds functionality for Azure Automation, including support for the Hybrid Runbook Worker. When you enable an Azure Automation feature in your Log Analytics workspace, the worker components are automatically pushed to the agent computer.

To add the Azure Automation feature, for example, Update Management, to your workspace, run the following PowerShell cmdlet:

```powershell-interactive
Set-AzOperationalInsightsIntelligencePack -ResourceGroupName <logAnalyticsResourceGroup> -WorkspaceName <LogAnalyticsWorkspaceName> -IntelligencePackName "AzureAutomation" -Enabled $true
```

### Step 3 - Install the Log Analytics agent for Windows

The Log Analytics agent for Windows connects computers to an Azure Monitor Log Analytics workspace. When you install the agent on your computer and connect it to your workspace, it automatically downloads the components that are required for the Hybrid Runbook Worker.

To install the agent on the computer, follow the instructions at [Connect Windows computers to Azure Monitor logs](../log-analytics/log-analytics-windows-agent.md). You can repeat this process for multiple computers to add multiple workers to your environment.

When the agent has successfully connected to your Log Analytics workspace after a few minutes, you can run the following query to verify that it is sending heartbeat data to the workspace.

```kusto
Heartbeat 
| where Category == "Direct Agent" 
| where TimeGenerated > ago(30m)
```

In the search results, you should see heartbeat records for the computer, indicating that it is connected and reporting to the service. By default, every agent forwards a heartbeat record to its assigned workspace. Use the following steps to complete the agent installation and setup.

1. Enable the feature to add the agent machine. See [Enable machines in the workspace](https://docs.microsoft.com/azure/automation/automation-onboard-solutions-from-automation-account#onboard-machines-in-the-workspace).
2. Verify that the agent has correctly downloaded the Azure Automation feature. 
3. To confirm the version of the Hybrid Runbook Worker, browse to **C:\Program Files\Microsoft Monitoring Agent\Agent\AzureAutomation** and note the **version** subfolder.

### Step 4 - Install the runbook environment and connect to Azure Automation

When you configure an agent to report to a Log Analytics workspace, the Azure Automation feature pushes down the `HybridRegistration` PowerShell module, which contains the `Add-HybridRunbookWorker` cmdlet. Use this cmdlet to install the runbook environment on the computer and register it with Azure Automation.

Open a PowerShell session in Administrator mode and run the following commands to import the module.

```powershell-interactive
cd "C:\Program Files\Microsoft Monitoring Agent\Agent\AzureAutomation\<version>\HybridRegistration"
Import-Module .\HybridRegistration.psd1
```

Now run the `Add-HybridRunbookWorker` cmdlet using the following syntax.

```powershell-interactive
Add-HybridRunbookWorker –GroupName <String> -EndPoint <Url> -Token <String>
```

You can get the information required for this cmdlet from the Manage Keys page in the Azure portal. Open this page by selecting **Keys** on the Settings page in your Automation account.

![Manage Keys page](media/automation-hybrid-runbook-worker/elements-panel-keys.png)

* For the `GroupName` parameter, use the name of the Hybrid Runbook Worker group. If this group already exists in the Automation account, the current computer is added to it. If this group doesn't exist, it's added.
* For the `EndPoint` parameter, use the **URL** entry on the Manage Keys page.
* For the `Token` parameter, use the **PRIMARY ACCESS KEY** entry on the Manage Keys page.
* If required, set the `Verbose` parameter to receive details about the installation.

### Step 5 -  Install PowerShell modules

Runbooks can use any of the activities and cmdlets defined in the modules installed in your Azure Automation environment. As these modules are not automatically deployed to on-premises computers, you must install them manually. The exception is the Azure module. This module is installed by default and provides access to cmdlets for all Azure services and activities for Azure Automation.

Because the primary purpose of the Hybrid Runbook Worker is to manage local resources, you most likely need to install the modules that support these resources, particularly the `PowerShellGet` module. For information on installing Windows PowerShell modules, see [Windows PowerShell](https://docs.microsoft.com/powershell/scripting/developer/windows-powershell).

Modules that are installed must be in a location referenced by the `PSModulePath` environment variable so that the hybrid worker can automatically import them. For more information, see [Install Modules in PSModulePath](https://docs.microsoft.com/powershell/scripting/developer/module/installing-a-powershell-module?view=powershell-7).

## <a name="remove-windows-hybrid-runbook-worker"></a>Remove the Hybrid Runbook Worker from an on-premises Windows computer

1. In the Azure portal, go to your Automation account.
2. Under **Account Settings**, select **Keys** and note the values for **URL** and **Primary Access Key**.

3. Open a PowerShell session in Administrator mode and run the following command with your URL and primary access key values. Use the `Verbose` parameter for a detailed log of the removal process. To remove stale machines from your Hybrid Worker group, use the optional `machineName` parameter.

```powershell-interactive
Remove-HybridRunbookWorker -url <URL> -key <PrimaryAccessKey> -machineName <ComputerName>
```

## Remove a Hybrid Worker group

To remove a Hybrid Runbook Worker group, you first need to remove the Hybrid Runbook Worker from every computer that is a member of the group. Then use the following steps to remove the group:

1. Open the Automation account in the Azure portal.
2. Select **Hybrid worker groups** under **Process Automation**. Select the group that you want to delete. The properties page for that group appears.

   ![Properties page](media/automation-hybrid-runbook-worker/automation-hybrid-runbook-worker-group-properties.png)

3. On the properties page for the selected group, select **Delete**. A message asks you to confirm this action. Select **Yes** if you're sure that you want to continue.

   ![Confirmation message](media/automation-hybrid-runbook-worker/automation-hybrid-runbook-worker-confirm-delete.png)

   This process can take several seconds to finish. You can track its progress under **Notifications** from the menu.

## Next steps

* To learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment, see [Run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md).
* To learn how to troubleshoot your Hybrid Runbook Workers, see [Troubleshoot Hybrid Runbook Worker issues](troubleshoot/hybrid-runbook-worker.md#general).
