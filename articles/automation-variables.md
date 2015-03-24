<properties 
   pageTitle="Variables"
   description="Variables"
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
   ms.date="03/16/2015"
   ms.author="bwren" />

# Variables

Automation variable assets are values that are available to all runbooks.  They can be created, modified, and retrieved from the Azure Management Portal, Windows PowerShell, and from within a runbook. Automation variables are useful for the following scenarios:

- Share a value between multiple runbooks.

- Share a value between multiple jobs from the same runbook.

- Manage a value from the management portal or from the Windows PowerShell command line that is used by runbooks.

Automation variables are persisted so that they continue to be available even if the runbook fails.  This also allows a value to be set by one runbook that is then used by another, or is used by the same runbook the next time that it is run.

When a variable is created, you can specify that it be stored encrypted.  When a variable is encrypted, it is stored securely in Azure Automation, and its value cannot be retrieved from the [Get-AzureAutomationVariable](http://aka.ms/runbookauthor/cmdlet/getazurevariable) cmdlet that ships as part of the Azure PowerShell module.  The only way that an encrypted value can be retrieved is from the **Get-AutomationVariable** activity in a runbook.

>[AZURE.NOTE]Secure assets in Azure Automation include credentials, certificates, connections, and encrypted variables. These assets are encrypted and stored in the Azure Automation using a unique key that is generated for each automation account. This key is encrypted by a master certificate and stored in Azure Automation. Before storing a secure asset, the key for the automation account is decrypted using the master certificate and then used to encrypt the asset.

## Variable Types

When you create a variable with the Azure Management Portal, you must specify a data type from the dropdown list so the portal can display the appropriate control for entering the variable value. The variable is not restricted to this data type, but you must set the variable using Windows PowerShell if you want to specify a value of a different type. If you specify **Undefined**, then the value of the variable will be set to **$null**, and you must set the value with the [Set-AzureAutomationVariable](http://aka.ms/runbookauthor/cmdlet/setazurevariable) cmdlet or **Set-AutomationVariable** activity.  You cannot create or change the value for a complex variable type in the portal, but you can provide a value of any type using Windows PowerShell. Complex types will be returned as a [PSCustomObject](http://aka.ms/runbookauthor/pscustomobject).

You can store multiple values to a single variable by creating an array or hashtable and saving it to the variable.

## Windows PowerShell Cmdlets

The cmdlets in the following table are used to create and manage Automation variables with Windows PowerShell. They ship as part of the [Azure PowerShell module](http://aka.ms/runbookauthor/azurepowershell) which is available for use in Automation runbooks.

|Cmdlets|Description|
|:---|:---|
|[Get-AzureAutomationVariable](http://aka.ms/runbookauthor/cmdlet/getazurevariable)|Retrieves the value of an existing variable.|
|[New-AzureAutomationVariable](http://aka.ms/runbookauthor/cmdlet/newazurevariable)|Creates a new variable and sets its value.|
|[Remove-AzureAutomationVariable](http://aka.ms/runbookauthor/cmdlet/removeazurevariable)|Removes an existing variable.|
|[Set-AzureAutomationVariable](http://aka.ms/runbookauthor/cmdlet/setazurevariable)|Sets the value for an existing variable.|

## Runbook Activities

The activities in the following table are used to access Automation variables in a runbook. They are only available for use in a runbook and do not ship as part of the Azure PowerShell module.

|Activities|Description|
|:---|:---|
|Get-AutomationVariable|Retrieves the value of an existing variable.|
|Set-AutomationVariable|Sets the value for an existing variable.|

>[AZURE.NOTE] You should avoid using variables in the –Name parameter of **Get-AutomationVariable** since this can complicate discovering dependencies between runbooks and Automation variables at design time.

## Creating a New Automation variable

### To create a new variable with the Azure Management Portal

1. Select the **Automation** workspace.

1. At the top of the window, click **Assets**.

1. At the bottom of the window, click **Add Setting**.

1. Click **Add Variable**.

1. In the **Type** dropdown, select a data type.

1. Type a name for the variable in the **Name** box.

1. Click the right arrow.

1. Type in a value for the variable and specify whether to encrypt it.

1. Click the check mark to save the new variable.

### To create a new variable with Windows PowerShell

The [New-AzureAutomationVariable](http://aka.ms/runbookauthor/cmdlet/newazurevariable) cmdlet creates a new variable and sets its initial value. You can retrieve the value using [Get-AzureAutomationVariable](http://aka.ms/runbookauthor/cmdlet/getazurevariable). If the value is a simple type, then that same type is returned. If it’s a complex type, then a **PSCustomObject** is returned.

The following sample commands show how to create a variable of type string and then return its value.


	New-AzureAutomationVariable –AutomationAccountName "MyAutomationAccount" –Name 'MyStringVariable' –Encrypted $false –Value 'My String'
	
	$string = (Get-AzureAutomationVariable –AutomationAccountName "MyAutomationAccount" –Name 'MyStringVariable').Value

The following sample commands show how to create a variable with a complex type and then return its properties. In this case, a virtual machine object from **Get-AzureVM** is used.

	$vm = Get-AzureVM –ServiceName "MyVM" –Name "MyVM"
	New-AzureAutomationVariable –AutomationAccountName "MyAutomationAccount" –Name "MyComplexVariable" –Encrypted $false –Value $vm
	
	$vmValue = (Get-AzureAutomationVariable –AutomationAccountName "MyAutomationAccount" –Name "MyComplexVariable").Value
	$vmName = $ vmValue.Name
	$vmIpAddress = $ vmValue.IpAddress

## Using a variable in a runbook

You should use the **Get-AutomationVariable** activity to use a variable in a runbook and not the [Get-AzureAutomationVariable](http://aka.ms/runbookauthor/cmdlet/getazurevariable) cmdlet. The activity will be more efficient and is the only way to retrieve an encrypted variable.

### Retrieving a simple value from a variable

Use the **Set-AutomationVariable** activity to set the value of an Automation variable in a runbook and the **Get-AutomationVariable** to retrieve it. The only way to create a new variable from within a runbook is to use the [New-AzureAutomationVariable](http://aka.ms/runbookauthor/cmdlet/newazurevariable)  cmdlet.

The following sample commands show how to set and retrieve a variable in a runbook. In this sample, it is assumed that variables of type integer named NumberOfIterations and NumberOfRunnings and a variable of type string named SampleMessage have already been created.

	$NumberOfIterations = Get-AutomationVariable -Name 'NumberOfIterations'
	$NumberOfRunnings = Get-AutomationVariable -Name 'NumberOfRunnings'
	$SampleMessage = Get-AutomationVariable -Name 'SampleMessage'
	
	Write-Output "Runbook has been run $NumberOfRunnings times."
	
	for ($i = 1; $i -le $NumberOfIterations; $i++) {
	   Write-Output "$i`: $SampleMessage"
	}
	Set-AutomationVariable –Name NumberOfRunnings –Value (NumberOfRunngs += 1)

### Setting and retrieving a complex object in a variable

The following sample code shows how update a variable with a complex value in a runbook. In this sample, an Azure virtual machine is retrieved with **Get-AzureVM** and saved to an existing Automation variable.

	$vm = Get-AzureVM -ServiceName "MyVM" -Name "MyVM"
	Set-AutomationVariable -Name "MyComplexVariable" -Value $vm

In the following code, the value is retrieved from the variable and used to start the virtual machine.

	$vmObject = Get-AutomationVariable -Name "MyComplexVariable"
	if ($vmObject.PowerState -eq 'Stopped') {
	   Start-AzureVM -ServiceName $vmObject.ServiceName -Name $vmObject.Name
	}

### Setting and retrieving a collection in a variable

The following sample code shows how to use a variable with a collection of complex values in a runbook. In this sample, multiple Azure virtual machines are retrieved with **Get-AzureVM** and saved to an existing Automation variable.

	$vmValues = Get-AutomationVariable -Name "MyComplexVariable"
	ForEach ($vmValue in $vmValues)
	{
	   if ($vmValue.PowerState -eq 'Stopped') {
	      Start-AzureVM -ServiceName $vmValue.ServiceName -Name $vmValue.Name
	   }
	}

In the following code, the collection is retrieved from the variable and used to start each virtual machine.

	$vmValues = Get-AutomationVariable -Name "MyComplexVariable"
	ForEach ($vmValue in $vmValues)
	{
	   if ($vmValue.PowerState -eq 'Stopped') {
	      Start-AzureVM -ServiceName $vmValue.ServiceName -Name $vmValue.Name
	   }
	}

## See Also

[Automation Assets](../automation-assets)
