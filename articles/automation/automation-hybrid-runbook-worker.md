---
title: Azure Automation Hybrid Runbook Workers | Microsoft Docs
description: This article provides information on installing and using Hybrid Runbook Worker which is a feature of Azure Automation that allows you to run runbooks on machines in your local datacenter or cloud provider.
services: automation
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: tysonn

ms.assetid: 06227cda-f3d1-47fe-b3f8-436d2b9d81ee
ms.service: automation
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 08/21/2017
ms.author: magoedte;bwren
---

# Automate resources in your data center or cloud with Hybrid Runbook Worker
Runbooks in Azure Automation cannot access resources in other clouds or in your on-premises environment since they run in the Azure cloud.  The Hybrid Runbook Worker feature of Azure Automation allows you to run runbooks directly on the computer hosting the role and against resources in the environment to manage those local resources. Runbooks are stored and managed in Azure Automation and then delivered to one or more designated computers.  

This functionality is illustrated in the following image:<br>  

![Hybrid Runbook Worker Overview](media/automation-offering-get-started/automation-infradiagram-networkcomms.png)

For a technical overview of the Hybrid Runbook Worker role and deployment considerations, see [Automation architecture overview](automation-offering-get-started.md#automation-architecture-overview).    

## Hybrid Runbook Worker groups
Each Hybrid Runbook Worker is a member of a Hybrid Runbook Worker group that you specify when you install the agent.  A group can include a single agent, but you can install multiple agents in a group for high availability.

When you start a runbook on a Hybrid Runbook Worker, you specify the group that it runs on.  The members of the group determine which worker services the request.  You cannot specify a particular worker.

## Relationship to Service Management Automation
[Service Management Automation (SMA)](https://technet.microsoft.com/library/dn469260.aspx) allows you to run the same runbooks that are supported by Azure Automation in your local data center. SMA is generally deployed together with Windows Azure Pack, as Windows Azure Pack contains a graphical interface for SMA management. Unlike Azure Automation, SMA requires a local installation that includes web servers to host the API, a database to contain runbooks and SMA configuration, and Runbook Workers to execute runbook jobs. Azure Automation provides these services in the cloud and only requires you to maintain the Hybrid Runbook Workers in your local environment.

If you are an existing SMA user, you can move your runbooks to Azure Automation to be used with Hybrid Runbook Worker with no changes, assuming that they perform their own authentication to resources as described in [run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md).  Runbooks in SMA run in the context of the service account on the worker server which may provide that authentication for the runbooks.

You can use the following criteria to determine whether Azure Automation with Hybrid Runbook Worker or Service Management Automation is more appropriate for your requirements.

* SMA requires a local installation of its underlying components that are connected to Windows Azure Pack if a graphical management interface is required. More local resources are needed with higher maintenance costs than Azure Automation, which only needs an agent installed on local runbook workers. The agents are managed by Operations Management Suite, further decreasing your maintenance costs.
* Azure Automation stores its runbooks in the cloud and delivers them to on-premises Hybrid Runbook Workers. If your security policy does not allow this behavior, then you should use SMA.
* SMA is included with System Center; and therefore, requires a System Center 2012 R2 license. Azure Automation is based on a tiered subscription model.
* Azure Automation has advanced features such as graphical runbooks that are not available in SMA.

## Installing the Windows Hybrid Runbook Worker 

To install and configure a Windows Hybrid Runbook Worker, there are two methods available.  The recommended method is using an Automation runbook to completely automate the process required to configure a Windows computer.  The second method is following a step-by-step procedure to manually install and configure the role.  

> [!NOTE]
> To manage the configuration of your servers supporting the Hybrid Runbook Worker role with Desired State Configuration (DSC), you need to add them as DSC nodes.  For more information about onboarding them for management with DSC, see [Onboarding machines for management by Azure Automation DSC](automation-dsc-onboarding.md).           
><br>
>If you enable the [Update Management solution](../operations-management-suite/oms-solution-update-management.md), any Windows computer connected to your OMS workspace is  automatically configured as a Hybrid Runbook Worker to support runbooks included in this solution.  However, it is not registered with any Hybrid Worker groups already defined in your Automation account.  The computer can be added to a Hybrid Runbook Worker group in your Automation account to support Automation runbooks as long as you are using the same account for both the solution and Hybrid Runbook Worker group membership.  This functionality has been added to version 7.2.12024.0 of the Hybrid Runbook Worker.  

Review the following information regarding the [hardware and software requirements](automation-offering-get-started.md#hybrid-runbook-worker) and [information for preparing your network](automation-offering-get-started.md#network-planning) before you begin deploying a Hybrid Runbook Worker.  After you have successfully deployed a runbook worker, review [run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md) to learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment.  
 
### Automated deployment

Perform the following steps to automate the installation and configuration of the Windows Hybrid Worker role.  

1. Download the *New-OnPremiseHybridWorker.ps1* script from the [PowerShell Gallery](https://www.powershellgallery.com/packages/New-OnPremiseHybridWorker/1.0/DisplayScript) directly from the computer running the Hybrid Runbook Worker role or from another computer in your environment and copy it to the worker.  

    The *New-OnPremiseHybridWorker.ps1* script requires the following parameters during execution:

  * *AutomationAccountName* (mandatory) - the name of your Automation account.  
  * *ResourceGroupName* (mandatory) - the name of the resource group associated with your Automation account.  
  * *HybridGroupName* (mandatory) - the name of a Hybrid Runbook Worker group that you specify as a target for the runbooks supporting this scenario. 
  *  *SubscriptionID* (mandatory) - the Azure Subscription Id that your Automation account is in.
  *  *WorkspaceName* (optional) - the OMS workspace name.  If you do not have an OMS workspace, the script creates and configures one.  

     > [!NOTE]
     > Currently the only Automation regions supported for integration with OMS are - **Australia Southeast**, **East US 2**, **Southeast Asia**, and **West Europe**.  If your Automation account is not in one of those regions, the script creates an OMS workspace but it warns you that it cannot link them together.
     > 
2. On your computer, start **Windows PowerShell** from the **Start** screen in Administrator mode.  
3. From the PowerShell command-line shell, navigate to the folder, which contains the script you downloaded and execute it changing the values for parameters *-AutomationAccountName*, *-ResourceGroupName*, *-HybridGroupName*, *-SubscriptionId*, and *-WorkspaceName*.

     > [!NOTE] 
     > You are prompted to authenticate with Azure after you execute the script.  You **must** sign in with an account that is a member of the Subscription Admins role and co-administrator of the subscription.  
     >  
    
        .\New-OnPremiseHybridWorker.ps1 -AutomationAccountName <NameofAutomationAccount> `
        -ResourceGroupName <NameofOResourceGroup> -HybridGroupName <NameofHRWGroup> `
        -SubscriptionId <AzureSubscriptionId> -WorkspaceName <NameOfOMSWorkspace>

4. You are prompted to agree to install **NuGet** and you are prompted to authenticate with your Azure credentials.<br><br> ![Execution of New-OnPremiseHybridWorker script](media/automation-hybrid-runbook-worker/new-onpremisehybridworker-scriptoutput.png)

5. After the script is complete, the Hybrid Worker Groups blade will show the new group and number of members or if an existing group, the number of members is incremented.  You can select the group from the list on the **Hybrid Worker Groups** blade and select the **Hybrid Workers** tile.  On the **Hybrid Workers** blade, you see each member of the group listed.  

### Manual deployment 
Perform the first two steps once for your Automation environment and then repeat the remaining steps for each worker computer.

#### 1. Create Operations Management Suite workspace
If you do not already have an Operations Management Suite workspace, then create one using instructions at [Manage your workspace](../log-analytics/log-analytics-manage-access.md). You can use an existing workspace if you already have one.

#### 2. Add Automation solution to Operations Management Suite workspace
Solutions add functionality to Operations Management Suite.  The Automation solution adds functionality for Azure Automation including support for Hybrid Runbook Worker.  When you add the solution to your workspace, it automatically pushes down worker components to the agent computer that you will install in the next step.

Follow the instructions at [To add a solution using the Solutions Gallery](../log-analytics/log-analytics-add-solutions.md) to add the **Automation** solution to your Operations Management Suite workspace.

#### 3. Install the Microsoft Monitoring Agent
The Microsoft Monitoring Agent connects computers to Operations Management Suite.  When you install the agent on your on-premises computer and connect it to your workspace, it will automatically download the components required for Hybrid Runbook Worker.

Follow the instructions at [Connect Windows computers to Log Analytics](../log-analytics/log-analytics-windows-agents.md) to install the agent on the on-premises computer.  You can repeat this process for multiple computers to add multiple workers to your environment.

When the agent has successfully connected to Operations Management Suite, it will be listed on the **Connected Sources** tab of the Operations Management Suite **Settings** pane.  You can verify that the agent has correctly downloaded the Automation solution when it has a folder called **AzureAutomationFiles** in C:\Program Files\Microsoft Monitoring Agent\Agent.  To confirm the version of the Hybrid Runbook Worker, you can navigate to C:\Program Files\Microsoft Monitoring Agent\Agent\AzureAutomation\ and note the \\*version* subfolder.   

#### 4. Install the runbook environment and connect to Azure Automation
When you add an agent to Operations Management Suite, the Automation solution pushes down the **HybridRegistration** PowerShell module, which contains the **Add-HybridRunbookWorker** cmdlet.  You use this cmdlet to install the runbook environment on the computer and register it with Azure Automation.

Open a PowerShell session in Administrator mode and run the following commands to import the module.

    cd "C:\Program Files\Microsoft Monitoring Agent\Agent\AzureAutomation\<version>\HybridRegistration"
    Import-Module HybridRegistration.psd1

Then run the **Add-HybridRunbookWorker** cmdlet using the following syntax:

    Add-HybridRunbookWorker –GroupName <String> -EndPoint <Url> -Token <String>

You can get the information required for this cmdlet from the **Manage Keys** blade in the Azure portal.  Open this blade by selecting the **Keys** option from the **Settings** blade in your Automation account.

![Hybrid Runbook Worker Overview](media/automation-hybrid-runbook-worker/elements-panel-keys.png)

* **GroupName** is the name of the Hybrid Runbook Worker Group. If this group already exists in the automation account, then the current computer is added to it.  If it does not already exist, then it is added.
* **EndPoint** is the **URL** field in the **Manage Keys** blade.
* **Token** is the **Primary Access Key** in the **Manage Keys** blade.  

Use the **-Verbose** switch with **Add-HybridRunbookWorker** to receive detailed information about the installation.

#### 5. Install PowerShell modules
Runbooks can use any of the activities and cmdlets defined in the modules installed in your Azure Automation environment.  These modules are not automatically deployed to on-premises computers though, so you must install them manually.  The exception is the Azure module, which is installed by default providing access to cmdlets for all Azure services and activities for Azure Automation.

Since the primary purpose of the Hybrid Runbook Worker feature is to manage local resources, you most likely need to install the modules that support these resources.  You can refer to [Installing Modules](http://msdn.microsoft.com/library/dd878350.aspx) for information on installing Windows PowerShell modules.  Modules that are installed must be in a location referenced by PSModulePath environment variable so that they are automatically imported by the Hybrid worker.  For further information, see [Modifying the PSModulePath Installation Path](https://msdn.microsoft.com/library/dd878326%28v=vs.85%29.aspx). 

## Removing Hybrid Runbook Worker 
You can remove one or more Hybrid Runbook Workers from a group or you can remove the group, depending on your requirements.  To remove a Hybrid Runbook Worker from an on-premises computer, perform the following steps.

1. In the Azure portal, navigate to your Automation account.  
2. From the **Settings** blade, select **Keys** and note the values for field **URL** and **Primary Access Key**.  You need this information for the next step.
3. Open a PowerShell session in Administrator mode and run the following command - `Remove-HybridRunbookWorker -url <URL> -key <PrimaryAccessKey>`.  Use the **-Verbose** switch for a detailed log of the removal process.

> [!NOTE]
> This does not remove the Microsoft Monitoring Agent from the computer, only the functionality and configuration of the Hybrid Runbook Worker role.  

## Remove Hybrid Worker groups
To remove a group, you first need to remove the Hybrid Runbook Worker from every computer that is a member of the group using the procedure shown earlier, and then you perform the following steps to remove the group.  

1. Open the Automation account in the Azure portal.
2. Select the **Hybrid Worker Groups** tile and in the **Hybrid Worker Groups** blade, select the group you wish to delete.  After selecting the specific group, the **Hybrid worker group** properties blade is displayed.<br> ![Hybrid Runbook Worker Group Blade](media/automation-hybrid-runbook-worker/automation-hybrid-runbook-worker-group-properties.png)   
3. On the properties blade for the selected group, click **Delete**.  A message appears asking you to confirm this action, select **Yes** if you are sure you want to proceed.<br> ![Delete Group Confirmation Dialog](media/automation-hybrid-runbook-worker/automation-hybrid-runbook-worker-confirm-delete.png)<br> This process can take several seconds to complete and you can track its progress under **Notifications** from the menu.  

## Troubleshooting 
The Hybrid Runbook Worker depends on the Microsoft Monitoring Agent to communicate with your Automation account to register the worker, receive runbook jobs, and report status. If  registration of the worker fails, here are some possible causes for the error:  

1. The hybrid worker is behind a proxy or firewall.  
	Verify the computer has outbound access to *.azure-automation.net on port 443.  

2. The computer the hybrid worker is running on has less than the minimum hardware [requirements](automation-offering-get-started.md#hybrid-runbook-worker).  
    Computers running the Hybrid Runbook Worker should meet the minimum hardware requirements before designating it to host this feature. Otherwise, depending on the resource utilization of other background processes and contention caused by runbooks during execution, the computer will become over utilized and cause runbook job delays or timeouts.
    Confirm the computer designated to run the Hybrid Runbook Worker feature meets the minimum hardware requirements.  If it does, monitor CPU and memory utilization to determine any correlation between the performance of Hybrid Runbook Worker processes and Windows.  If there is memory or CPU pressure, this may indicate the need to upgrade or add additional processors, or increase memory to address the resource bottleneck and resolve the error. Alternatively, select a different compute resource that can support the minimum requirements and scale when workload demands indicate an increase is necessary.
    
3. The Microsoft Monitoring Agent service is not running.  
    If the Microsoft Monitoring Agent Windows service is not running, this prevents the Hybrid Runbook Worker from communicating with Azure Automation.  Verify the agent is running by entering the following command in PowerShell: `get-service healthservice`.  If the service is stopped, enter the following command in PowerShell to start the service: `start-service healthservice`.  

4. In the **Application and Services Logs\Operations Manager** event log, you see event 4502  and EventMessage containing **Microsoft.EnterpriseManagement.HealthService.AzureAutomation.HybridAgent** with the following description:  *The certificate presented by the service <wsid>.oms.opinsights.azure.com was not issued by a certificate authority used for Microsoft services. Please contact your network administrator to see if they are running a proxy that intercepts TLS/SSL communication. The article KB3126513 has additional troubleshooting information for connectivity issues.*
    This can be caused by your proxy or network firewall blockking communication to Microsoft Azure.  Verify the computer has outbound access to *.azure-automation.net on ports 443.

Logs are stored locally on each hybrid worker at C:\ProgramData\Microsoft\System Center\Orchestrator\7.2\SMA\Sandboxes.  You can check if there are any warning or error events written to the **Application and Services Logs\Microsoft-SMA\Operations** and **Application and Services Logs\Operations Manager** event log that would indicate a connectivity or other issue affecting onboarding of the role to Azure Automation or issue while performing normal operations.  

## Next steps
Review [run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md) to learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment.
