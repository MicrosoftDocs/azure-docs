---
title: Azure Automation Windows Hybrid Runbook Worker
description: This article provides information on installing an Azure Automation Hybrid Runbook Worker that allows you to run runbooks on Windows-based computers in your local datacenter or cloud environment.
services: automation
ms.service: automation
author: georgewallace
ms.author: gwallace
ms.date: 04/06/2018
ms.topic: article
manager: carmonm
---
# How to deploy a Windows Hybrid Runbook Worker

Runbooks in Azure Automation cannot access resources in other clouds or in your on-premises environment since they run in the Azure cloud. The Hybrid Runbook Worker feature of Azure Automation allows you to run runbooks directly on the computer hosting the role and against resources in the environment to manage those local resources. Runbooks are stored and managed in Azure Automation and then delivered to one or more designated computers.

This functionality is illustrated in the following image:

![Hybrid Runbook Worker Overview](media/automation-hybrid-runbook-worker/automation.png)

## Hybrid Runbook Worker groups

Each Hybrid Runbook Worker is a member of a Hybrid Runbook Worker group that you specify when you install the agent. A group can include a single agent, but you can install multiple agents in a group for high availability.

When you start a runbook on a Hybrid Runbook Worker, you specify the group that it runs on. The members of the group determine which worker services the request. You cannot specify a particular worker.

## Installing the Windows Hybrid Runbook Worker

To install and configure a Windows Hybrid Runbook Worker, there are two methods available. The recommended method is using an Automation runbook to completely automate the process required to configure a Windows computer. The second method is following a step-by-step procedure to manually install and configure the role.

> [!NOTE]
> To manage the configuration of your servers supporting the Hybrid Runbook Worker role with Desired State Configuration (DSC), you need to add them as DSC nodes.

The following are the minimum requirements for a Windows Hybrid Runbook Worker.

* Windows Server 2012 or later.
* Windows PowerShell 4.0 or higher is required ([Download WMF 4.0](https://www.microsoft.com/download/details.aspx?id=40855)). Windows PowerShell 5.1 ([Download WMF 5.1](https://www.microsoft.com/download/details.aspx?id=54616)) is recommended for increased reliability.
* .NET Framework 4.6.2 or later.
* A minimum of two cores.
* A minimum of 4 GB of RAM.

For more information about onboarding them for management with DSC, see [Onboarding machines for management by Azure Automation DSC](automation-dsc-onboarding.md).
If you enable the [Update Management solution](../operations-management-suite/oms-solution-update-management.md), any Windows computer connected to your Log Analytics workspace is  automatically configured as a Hybrid Runbook Worker to support runbooks included in this solution. However, it is not registered with any Hybrid Worker groups already defined in your Automation account. The computer can be added to a Hybrid Runbook Worker group in your Automation account to support Automation runbooks as long as you are using the same account for both the solution and Hybrid Runbook Worker group membership. This functionality has been added to version 7.2.12024.0 of the Hybrid Runbook Worker.

After you have successfully deployed a runbook worker, review [run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md) to learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment.

### Automated deployment

Perform the following steps to automate the installation and configuration of the Windows Hybrid Worker role.

1. Download the *New-OnPremiseHybridWorker.ps1* script from the [PowerShell Gallery](https://www.powershellgallery.com/packages/New-OnPremiseHybridWorker/DisplayScript) directly from the computer running the Hybrid Runbook Worker role or from another computer in your environment and copy it to the worker.

   The *New-OnPremiseHybridWorker.ps1* script requires the following parameters during execution:

   * *AutomationAccountName* (mandatory) - The name of your Automation account.
   * *AAResourceGroupName* (mandatory) - The name of the resource group associated with your Automation account
   * *OMSResourceGroupName* (optional) - The name of the resource group for the OMS workspace. If not specified, the AAResourceGroupName is used.
   * *HybridGroupName* (mandatory) - The name of a Hybrid Runbook Worker group that you specify as a target for the runbooks supporting this scenario.
   * *SubscriptionID* (mandatory) - The Azure Subscription ID that your Automation account is in.
   * *WorkspaceName* (optional) - The Log Analytics workspace name. If you do not have a Log Analytics workspace, the script creates and configures one.

     > [!NOTE]
     > Currently the only Automation regions supported for integration with Log Analytics are - **Australia Southeast**, **East US 2**, **Southeast Asia**, and **West Europe**. If your Automation account is not in one of those regions, the script creates a Log Analytics workspace but it warns you that it cannot link them together.

1. On your computer, start **Windows PowerShell** from the **Start** screen in Administrator mode.
1. From the PowerShell command-line shell, navigate to the folder, which contains the script you downloaded and execute it changing the values for parameters *-AutomationAccountName*, *-AAResourceGroupName*, *-OMSResourceGroupName*, *-HybridGroupName*, *-SubscriptionId*, and *-WorkspaceName*.

     > [!NOTE]
     > You are prompted to authenticate with Azure after you execute the script. You **must** sign in with an account that is a member of the Subscription Admins role and co-administrator of the subscription.

   ```powershell-interactive
   .\New-OnPremiseHybridWorker.ps1 -AutomationAccountName <NameofAutomationAccount> -AAResourceGroupName <NameofResourceGroup>`
   -OMSResourceGroupName <NameofOResourceGroup> -HybridGroupName <NameofHRWGroup> `
   -SubscriptionId <AzureSubscriptionId> -WorkspaceName <NameOfLogAnalyticsWorkspace>
   ```

1. You are prompted to agree to install **NuGet** and you are prompted to authenticate with your Azure credentials.

1. After the script is complete, the Hybrid Worker Groups blade will show the new group and number of members or if an existing group, the number of members is incremented. You can select the group from the list on the **Hybrid Worker Groups** blade and select the **Hybrid Workers** tile. On the **Hybrid Workers** blade, you see each member of the group listed.

### Manual deployment

Perform the first two steps once for your Automation environment and then repeat the remaining steps for each worker computer.

#### 1. Create Log Analytics workspace

If you do not already have a Log Analytics workspace, then create one using instructions at [Manage your workspace](../log-analytics/log-analytics-manage-access.md). You can use an existing workspace if you already have one.

#### 2. Add Automation solution to Log Analytics workspace

Solutions add functionality to Log Analytics. The Automation solution adds functionality for Azure Automation including support for Hybrid Runbook Worker. When you add the solution to your workspace, it automatically pushes down worker components to the agent computer that you will install in the next step.

Follow the instructions at [To add a solution using the Solutions Gallery](../log-analytics/log-analytics-add-solutions.md) to add the **Automation** solution to your Log Analytics workspace.

#### 3. Install the Microsoft Monitoring Agent

The Microsoft Monitoring Agent connects computers to Log Analytics. When you install the agent on your on-premises computer and connect it to your workspace, it will automatically download the components required for Hybrid Runbook Worker.

Follow the instructions at [Connect Windows computers to Log Analytics](../log-analytics/log-analytics-windows-agent.md) to install the agent on the on-premises computer. You can repeat this process for multiple computers to add multiple workers to your environment.

When the agent has successfully connected to Log Analytics, it is listed on the **Connected Sources** tab of the Log Analytics **Settings** page. You can verify that the agent has correctly downloaded the Automation solution when it has a folder called **AzureAutomationFiles** in C:\Program Files\Microsoft Monitoring Agent\Agent. To confirm the version of the Hybrid Runbook Worker, you can navigate to C:\Program Files\Microsoft Monitoring Agent\Agent\AzureAutomation\ and note the \\*version* subfolder.

#### 4. Install the runbook environment and connect to Azure Automation

When you add an agent to Log Analytics, the Automation solution pushes down the **HybridRegistration** PowerShell module, which contains the **Add-HybridRunbookWorker** cmdlet. You use this cmdlet to install the runbook environment on the computer and register it with Azure Automation.

Open a PowerShell session in Administrator mode and run the following commands to import the module.

    ```powershell-interactive
    cd "C:\Program Files\Microsoft Monitoring Agent\Agent\AzureAutomation\<version>\HybridRegistration"
    Import-Module HybridRegistration.psd1
    ```

Then run the **Add-HybridRunbookWorker** cmdlet using the following syntax:

    ```powershell-interactive
    Add-HybridRunbookWorker –GroupName <String> -EndPoint <Url> -Token <String>
    ```

You can get the information required for this cmdlet from the **Manage Keys** page in the Azure portal. Open this page by selecting the **Keys** option from the **Settings** page in your Automation account.

![Hybrid Runbook Worker Overview](media/automation-hybrid-runbook-worker/elements-panel-keys.png)

* **GroupName** is the name of the Hybrid Runbook Worker Group. If this group already exists in the automation account, then the current computer is added to it. If it does not already exist, then it is added.
* **EndPoint** is the **URL** field in the **Manage Keys** page.
* **Token** is the **Primary Access Key** in the **Manage Keys** page.

Use the **-Verbose** switch with **Add-HybridRunbookWorker** to receive detailed information about the installation.

#### 5. Install PowerShell modules

Runbooks can use any of the activities and cmdlets defined in the modules installed in your Azure Automation environment. These modules are not automatically deployed to on-premises computers though, so you must install them manually. The exception is the Azure module, which is installed by default providing access to cmdlets for all Azure services and activities for Azure Automation.

Since the primary purpose of the Hybrid Runbook Worker feature is to manage local resources, you most likely need to install the modules that support these resources. You can refer to [Installing Modules](http://msdn.microsoft.com/library/dd878350.aspx) for information on installing Windows PowerShell modules. Modules that are installed must be in a location referenced by PSModulePath environment variable so that they are automatically imported by the Hybrid worker. For more information, see [Modifying the PSModulePath Installation Path](https://msdn.microsoft.com/library/dd878326%28v=vs.85%29.aspx).

## Next Steps

* Review [run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md) to learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment.
* For instructions on how to remove Hybrid Runbook Workers, see [Remove Azure Automation Hybrid Runbook Workers](automation-remove-hrw.md)