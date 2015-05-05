<properties 
   pageTitle="Azure Automation Hybrid Runbook Workers"
   description="This article provides information on installing and using Hybrid Runbook Worker which is a feature of Azure Automation that allows you to run runbooks on machines in your local data center."
   services="automation"
   documentationCenter=""
   authors="bwren"
   manager="stevenka"
   editor="tysonn" />
<tags 
   ms.service="automation"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="05/05/2015"
   ms.author="bwren" />

# Azure Automation Hybrid Runbook Workers

Runbooks in Azure Automation cannot access resources in your local data center since they run in the Azure cloud.  The Hybrid Runbook Worker feature of Azure Automation allows you to run runbooks on machines located in your data center in order to manage local resources. The runbooks are stored and managed in Azure Automation and then delivered to one or more on-premise machines where they are run.  

This functionality is illustrated in the following image.

![Hybrid Runbook Worker Overview](./media/automation-hybrid-runbook-worker/automation-hybrid-runbook-worker-overview.png)

You can designate one or more computers in your data center to act as a Hybrid Runbook Worker and run runbooks from Azure Automation.  Each worker requires the Microsoft Management Agent with a connection to Azure Operational Insights and the Azure Automation runbook environment.  Operational Insights is only used to install and maintain the management agent and to monitor the functionality of the worker.  The delivery of runbooks and the instruction to run them are performed by Azure Automation.

![Hybrid Runbook Worker Components](./media/automation-hybrid-runbook-worker/automation-hybrid-runbook-worker-components.png)

There are no inbound firewall requirements to support Hybrid Runbook Workers. The agent on the local computer initiates all communication with Azure Automation in the cloud. When a runbook is started, Azure Automation creates an instruction that is retrieved by agent. The agent then pulls down the runbook and any parameters before running it.  It will also retrieve any [assets](http://msdn.microsoft.com/library/dn939988.aspx) that are used by the runbook from Azure Automation.

## Hybrid Runbook Worker groups

Each Hybrid Runbook Worker is a member of a Hybrid Runbook Worker group that you specify when you install the agent.  A group can include a single agent, but you can install multiple agents in a group for high availability. 

When you start a runbook on a Hybrid Runbook Worker, you specify the group that it will run on.  The members of the group will determine which worker will service the request.  You cannot specify a particular worker.

## Installing Hybrid Runbook Worker

### Prepare Azure Automation environment

Complete the following steps to prepare your Azure Automation environment for Hybrid Runbook Workers.

#### 1. Create Azure Operational Insights workspace
If you do not already have an Operational Insights workspace in your Azure account, then create one using instructions at  [Set up your Operational Insights workspace](../operational-insights-setup-workspace). You can use an existing workspace if you already have one.

#### 2. Deploy Automation intelligence pack
The Automation Intelligence Pack in Operational Insights pushes down components required to configure and support the runbook environment.  Follow the instructions at [Operational Insights intelligence packs](../operational-insights-add-intelligence-pack) to install the **Azure Automation** pack.

### Configure on-premise machines
Complete the following steps for each of the on-premise machines that will act as a Hybrid Runbook Worker.


#### 1. Install the Microsoft Management Agent
The Microsoft Management Agent connects the computer to Operational Insights and allows it to run logic from intelligence packs.  Follow the instructions at [Connect computers directly to Operational Insights](../operational-insights-direct-agent) to install the agent on the on-premise machine and connect it to the Operational Insights.

#### 2. Install the runbook environment and connect to Azure Automation
When you add a computer to Operational Insights, the Automation Intelligence Pack pushes down the **HybridRegistration** PowerShell module which contains the **Add-HybridRunbookWorker** cmdlet.  You use this cmdlet to install the runbook environment on the computer and register it with Azure Automation.

Open a PowerShell session in Administrator mode and run the following command to import the module.

	Import-Module HybridRegistration 

   Then run the **Add-HybridRunbookWorker** cmdlet using the following syntax:

	Add-HybridRunbookWorker –Name <String> -EndPoint <Url> -Token <String>


- **Name** is the name of the Hybrid Runbook Worker Group. If this group already exists in the automation account, then the current computer is added to it.  If it does not already exist, then it is added.
- **EndPoint** is the URL of the Agent service. You can obtain this from the Azure portal on the **Manage Keys** blade.  
- **Token** is the **Primary Access Key** in the **Manage Keys** blade.  You can open the Manage Keys blade by clicking the key icon on the Elements panel for the automation account.<br>![Hybrid Runbook Worker Overview](./media/automation-hybrid-runbook-worker/elements-panel-keys.png)


#### 3. Install PowerShell modules 
Runbooks can use any of the activities and cmdlets defined in the modules installed in your Azure Automation environment.  These modules are not automatically deployed to on-premise machines though, so you must install them manually.  The exception is the Azure module which is installed by default providing access to cmdlets for all Azure services and activities for Azure Automation.

Since the primary purpose of the Hybrid Runbook Worker feature is to manage local resources, you will most likely need to install the modules that support these resources.  You can refer to  [Installing Modules](http://msdn.microsoft.com/library/dd878350(v=vs.85).aspx) for information on installing Windows PowerShell modules.

## Starting runbooks on Hybrid Runbook Worker

[Starting a Runbook in Azure Automation](../automation-starting-a-runbook) describes different methods for starting a runbook.  Hybrid Runbook Worker adds a **RunOn** option where you can specify the name of a Hybrid Runbook Worker Group.  If a group is specified, then the runbook is retrieved and run by of the workers in that group.  If this option is not specified, then it is run in Azure Automation as normal.

When you start a runbook in the Azure portal, you will be presented with a **Run on** option where you can select **Azure** or **Hybrid Worker**.  If you select **Hybrid Worker**, then you can select the group from a dropdown. 

Use the **RunOn** parameter  You could use the following command to start a runbook named Test-Runbook on a Hybrid Runbook Worker Group named MyHybridGroup using Windows PowerShell. 

	Start-AzureAutomationRunbook –AutomationAccountName "MyAutomationAccount" –Name "Test-Runbook" -RunOn "MyHybridGroup"

## Creating runbooks for Hybrid Runbook Worker

There is no difference in the structure of runbooks that run in Azure Automation and those that run on a Hybrid Runbook Worker. Runbooks that you use with each will most likely differ significantly though since runbooks for Hybrid Runbook Worker will typically manage local resources in your data center while runbooks in Azure Automation typically manage resources in the Azure cloud.  

### Runbook permissions

Runbooks will run in the context of the local System account on the Hybrid Runbook Worker, so they must provide their own authentication to resources that they they will access.  They cannot use the same [method that is typically used for runbooks authenticating to Azure resources](automation-configuring.md/#configuring-authentication-to-azure-resources) since they will be accessing resources outside of Azure. 

You can use use [Credential](http://msdn.microsoft.com/library/dn940015.aspx) and [Certificate](http://msdn.microsoft.com/library/dn940013.aspx) assets in your runbook with cmdlets that allow you to specify credentials so you can authenticate to different resources.  The following example shows a portion of a runbook that restarts a computer.  It retrieves credentials from a credential asset and the name of the computer from a variable asset and then uses these values with the Restart-Computer cmdlet.

	$Cred = Get-AutomationCredential "MyCredential"
	$Computer = Get-AutomationVariable "ComputerName"

	Restart-Computer -ComputerName $Computer  -Credential $Cred

You can also leverage [InlineScript](automation-runbook-concepts.md/#inline-script) which will allow you to run blocks of code on another computer with credentials specified by the [PSCredential common parameter](http://technet.microsoft.com/library/jj129719.aspx).


### Authoring and testing runbooks

You can edit a runbook for Hybrid Runbook Worker in Azure Automation, but you may have difficulties if you try to test the runbook in the editor.  The PowerShell modules that access the local resources may not be installed in your Azure Automation environment in which case, the test would fail.  If you do install the required modules, then the runbook will run, but it will not be able to access local resources for a complete test.   

## Relationship to Service Management Automation

[Service Management Automation (SMA)](http://aka.ms/runbookauthor/sma) is a component of Windows Azure Pack (WAP) that allows you to run the same runbooks that are supported by Azure Automation in your local data center.  Unlike Azure Automation, SMA requires a local installation that includes the Windows Azure Pack Management Portal and a database to hold runbooks and SMA configuration. Azure Automation provides these services in the cloud and only requires you to maintain the Hybrid Runbook Workers in your local environment.

If you are an existing SMA user, you can move your runbooks to Azure Automation to be used with Hybrid Runbook Worker with no changes, assuming that they perform their own authentication to resources as described in [Creating runbooks for Hybrid Runbook Worker](#creating-runbooks-for-hybrid-runbook-worker).  Runbooks in SMA run in the context of the service account on the worker server which may provide that authentication for the runbooks.

You can use the following criteria to determine whether Azure Automation with Hybrid Runbook Worker or Service Management Automation is more appropriate for your requirements. 

- SMA requires a local installation of Windows Azure Pack that has higher more local resources and maintenance costs than Azure Automation which only needs an agent installed on local runbook workers.  The agents are managed by Operational Insights furthering decreasing their maintenance costs. 
- Azure Automation stores its runbooks in the cloud and delivers them to on-premise Hybrid Runbooks Workers.  If your security policy does not allow this behavior then you should use SMA.
- Windows Azure Pack is a free download while Azure Automation may incur subscription charges.
 Azure.  Must maintain multiple databases for SMA.
- Azure Automation with Hybrid Runbook Worker allow you to manage runbooks for cloud resources and local resources in one location as opposed to separately managing both Azure Automation and SMA.
- Azure Automation has advanced features such including graphical authoring that are not available in SMA. 


## Related articles

- [Starting a Runbook in Azure Automation](../automation-starting-a-runbook)
- [Editing a Runbook in Azure Automation](https://msdn.microsoft.com/library/dn879137.aspx)