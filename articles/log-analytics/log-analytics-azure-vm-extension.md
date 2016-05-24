<properties
	pageTitle="Connect Azure virtual machines to Log Analytics  | Microsoft Azure"
	description="For Windows and Linux virtual machines running in Azure, the recommended way of collected logs and metrics is by installing the Log Analytics Azure VM extension. You can use the Azure portal or PowerShell to install the Log Analytics virtual machine extension onto Azure VMs"
	services="log-analytics"
	documentationCenter=""
	authors="richrundmsft"
	manager="jochan"
	editor=""/>

<tags
	ms.service="log-analytics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="powershell"
	ms.topic="article"
	ms.date="05/23/2016"
	ms.author="richrund"/>

# Connect Azure virtual machines to Log Analytics

For virtual machines running in Azure you can easily install the Log Analytics agent by installing the Microsoft Monitoring Agent virtual machine extension.

The Microsoft Monitoring Agent is an [Azure virtual machine extension](../virtual-machines/virtual-machines-windows-extensions-features.md) that is available for both Windows and Linux computers.
Using a virtual machine extension simplies the installation and configuration process. 
The agent can also be automatically upgraded, ensuring you have the latest features and fixes.

For computers that are not in Azure you can install the Log Analytics agent using the following methods, based on the operating system being used:

+ [Connect Windows computers to Log Analytics](log-analytics-windows-agents.md)
+ [Connect Linux computers to Log Analytics](log-analytics-linux-agents.md)

The above methods can also be used for Azure virtual machines, however you may find that the virtual machine extension is much simpler.

For Azure virtual machines, there are two easy ways to enable the virtual machine extension:

- In the Microsoft Azure management portal
- Using PowerShell

When using agent-based collection for log data, you must configure which logs to collect in the Log Management configuration page of the [OMS portal](https://www.microsoft.com/oms/).

>[AZURE.NOTE] If you’ve configured Log Analytics to index log data using Azure diagnostics and you configure the agent to collect logs, then the same logs will be indexed twice. You will be charged normal data rates for both data sources. If you have the agent installed, then you should collect log data using the agent and not index the logs collected by Azure diagnostics.

## Microsoft Azure Portal

You can install the agent for Log Analytics and connect the Azure virtual machine that it runs on using the [Azure portal](https://portal.azure.com).

### To install the agent for Log Analytics and connect the virtual machine to a workspace

1.	Sign into the [Azure portal](http://portal.azure.com).
2.	Browse for **Log Analytics (OMS)** and then select it.
3.	In your list of Log Analytics workspaces, select the one where you want the Azure VM to connect.  
    ![oms workspaces](./media/log-analytics-azure-storage/oms-connect-azure-01.png)
4.	Under **Log analytics management**, click **Virtual machines**.  
    ![virtual machines](./media/log-analytics-azure-storage/oms-connect-azure-02.png)
5.	In the list of **Virtual machines**, select the virtual machine where you want to install the agent. The **OMS connection status** for the VM will indicate that it is **Not connected**.  
    ![VM not connected](./media/log-analytics-azure-storage/oms-connect-azure-03.png)
6.	In the details for your virtual machine, click **Connect**. The agent is automatically installed and configured for your Log Analytics workspace, but it might take a few minutes for the process to complete.  
    ![connect VM](./media/log-analytics-azure-storage/oms-connect-azure-04.png)
7.	When the agent is installed and connected, you’ll see **OMS connection** status updated to show **This workspace**.  
    ![connected](./media/log-analytics-azure-storage/oms-connect-azure-05.png)

>[AZURE.NOTE] The [Azure VM agent](../virtual-machines/virtual-machines-windows-extensions-features.md) must be installed to automatically install the agent for OMS. If you have an Azure Resource Manager virtual machine, it will not appear in the list and you must use PowerShell or create an ARM template to install the agent.

## Use Azure PowerShell to install the Log Analytics VM extension

If you prefer scripting to make changes to your Azure virtual machines, then you can enable the Microsoft Monitoring Agent using PowerShell.

For classic Azure virtual machines, use the following PowerShell example:

```
Add-AzureAccount

$workspaceId="enter workspace here"
$workspaceKey="enter workspace key here"
$hostedService="enter hosted service here"

$vm = Get-AzureVM –ServiceName $hostedService
Set-AzureVMExtension -VM $vm -Publisher 'Microsoft.EnterpriseCloud.Monitoring' -ExtensionName 'MicrosoftMonitoringAgent' -Version '1.*' -PublicConfiguration "{'workspaceId':  '$workspaceId'}" -PrivateConfiguration "{'workspaceKey': '$workspaceKey' }" | Update-AzureVM -Verbose
```


For Azure Resource Manager virtual machines, use the following PowerShell example:

```
Login-AzureRMAccount
Select-AzureSubscription -SubscriptionId "**"

$workspaceName = "your workspace name"
$VMresourcegroup = "**"
$VMresourcename = "**"

$workspace = (Get-AzureRmOperationalInsightsWorkspace).Where({$_.Name -eq $workspaceName})

if ($workspace.Name -ne $workspaceName) 
{
    Write-Error "Unable to find OMS Workspace $workspaceName. Do you need to run Select-AzureRMSubscription?"
}

$workspaceId = $workspace.CustomerId 
$workspaceKey = (Get-AzureRmOperationalInsightsWorkspaceSharedKeys -ResourceGroupName $workspace.ResourceGroupName -Name $workspace.Name).PrimarySharedKey

$vm = Get-AzureRMVM -ResourceGroupName $VMresourcegroup -Name $VMresourcename
$location = $vm.Location

Set-AzureRMVMExtension -ResourceGroupName $VMresourcegroup -VMName $VMresourcename -Name 'MicrosoftMonitoringAgent' -Publisher 'Microsoft.EnterpriseCloud.Monitoring' -ExtensionType 'MicrosoftMonitoringAgent' -TypeHandlerVersion '1.0' -Location $location -SettingString "{'workspaceId':  '$workspaceId'}" -ProtectedSettingString "{'workspaceKey': '$workspaceKey' }"


```
When configuring using PowerShell, you need to provide the Workspace ID and Primary Key. You can find your Workspace ID and Primary Key on the **Settings** page of the OMS portal, or using PowerShell as shown in the example above.

![workspace ID and primary key](./media/log-analytics-azure-storage/oms-analyze-azure-sources.png)

## Next Steps

+ [Add Log Analytics solutions from the Solutions Gallery](log-analytics-add-solutions.md) to add functionality and gather data.
+ [Collect data from Azure Using Azure diagnostics and Log Analytics](log-analytics-powershell-azure-diagnostics-json.md)

