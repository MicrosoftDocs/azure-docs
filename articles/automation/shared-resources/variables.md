---
title: Variable assets in Azure Automation
description: Variable assets are values that are available to all runbooks and DSC configurations in Azure Automation.  This article explains the details of variables and how to work with them in both textual and graphical authoring.
services: automation
ms.service: automation
ms.subservice: shared-capabilities
author: mgoedtel
ms.author: magoedte
ms.date: 05/14/2019
ms.topic: conceptual
manager: carmonm
---
# Variable assets in Azure Automation

Variable assets are values that are available to all runbooks and DSC configurations in your automation account. They can be managed from the Azure portal, PowerShell, within a runbook, or DSC configuration. Automation variables are useful for the following scenarios:

- Share a value between multiple runbooks or DSC configurations.

- Share a value between multiple jobs from the same runbook or DSC configuration.

- Manage a value from the portal or from the PowerShell command line that is used by runbooks or DSC configurations, such as a set of common configuration items like specific list of VM names, a specific resource group, an AD domain name, and more.  

Since Automation variables are persisted, they are available even if the runbook or DSC configuration fails. This behavior allows a value to be set by one runbook that is then used by another, or is used by the same runbook or DSC configuration the next time that it's run.

When a variable is created, you can specify that it is stored encrypted. Encrypted variables are stored securely in Azure Automation, and its value can't be retrieved from the [Get-AzureRmAutomationVariable](/powershell/module/AzureRM.Automation/Get-AzureRmAutomationVariable) cmdlet that ships as part of the Azure PowerShell module. The only way that an encrypted value can be retrieved is from the **Get-AutomationVariable** activity in a runbook or DSC configuration. If you want to change an encrypted variable to un-encrypted, you must delete and re-create the variable as un-encrypted.

>[!NOTE]
>Secure assets in Azure Automation include credentials, certificates, connections, and encrypted variables. These assets are encrypted and stored in Azure Automation using a unique key that is generated for each automation account. This key is stored in a system managed Key Vault. Before storing a secure asset, the key is loaded from Key Vault and then used to encrypt the asset. This process is managed by Azure Automation.

## Variable types

When you create a variable with the Azure portal, you must specify a data type from the drop-down list so the portal can display the appropriate control for entering the variable value. The variable isn't restricted to this data type. You must set the variable using Windows PowerShell if you want to specify a value of a different type. If you specify **Not defined**, then the value of the variable sets to **$null**, and you must set the value with the [Set-AzureRMAutomationVariable](/powershell/module/AzureRM.Automation/Set-AzureRmAutomationVariable) cmdlet or **Set-AutomationVariable** activity. You can't create or change the value for a complex variable type in the portal, but you can provide a value of any type using Windows PowerShell. Complex types are returned as a [PSCustomObject](/dotnet/api/system.management.automation.pscustomobject).

You can store multiple values to a single variable by creating an array or hashtable and saving it to the variable.

The following are a list of variable types available in Automation:

* String
* Integer
* DateTime
* Boolean
* Null

## AzureRM PowerShell cmdlets

For AzureRM, the cmdlets in the following table are used to create and manage automation credential assets with Windows PowerShell. They ship as part of the [AzureRM.Automation module](/powershell/azure/overview), which is available for use in Automation runbooks and DSC configurations.

| Cmdlets | Description |
|:---|:---|
|[Get-AzureRmAutomationVariable](/powershell/module/AzureRM.Automation/Get-AzureRmAutomationVariable)|Retrieves the value of an existing variable.|
|[New-AzureRmAutomationVariable](/powershell/module/AzureRM.Automation/New-AzureRmAutomationVariable)|Creates a new variable and sets its value.|
|[Remove-AzureRmAutomationVariable](/powershell/module/AzureRM.Automation/Remove-AzureRmAutomationVariable)|Removes an existing variable.|
|[Set-AzureRmAutomationVariable](/powershell/module/AzureRM.Automation/Set-AzureRmAutomationVariable)|Sets the value for an existing variable.|

## Activities

The activities in the following table are used to access variables in a runbook and DSC configurations. The difference between Get-AzureRmAutomationVariable and Get-AutomationVariable cmdlets is clarified above at the start of this document.

| Activities | Description |
|:---|:---|
|Get-AutomationVariable|Retrieves the value of an existing variable.|
|Set-AutomationVariable|Sets the value for an existing variable.|

> [!NOTE]
> You should avoid using variables in the –Name parameter of **Get-AutomationVariable**  in a runbook or DSC configuration since this can complicate discovering dependencies between runbooks or DSC configuration, and Automation variables at design time.

The functions in the following table are used to access and retrieve variables in a Python2 runbook.

|Python2 Functions|Description|
|:---|:---|
|automationassets.get_automation_variable|Retrieves the value of an existing variable. |
|automationassets.set_automation_variable|Sets the value for an existing variable. |

> [!NOTE]
> You must import the "automationassets" module at the top of your Python runbook in order to access the asset functions.

## Creating a new Automation variable

### To create a new variable with the Azure portal

1. From your Automation account, click the **Assets** tile and then on the **Assets** blade, select **Variables**.
2. On the **Variables** tile, select **Add a variable**.
3. Complete the options on the **New Variable** blade and click **Create** save the new variable.

### To create a new variable with Windows PowerShell

The [New-AzureRmAutomationVariable](/powershell/module/AzureRM.Automation/New-AzureRmAutomationVariable) cmdlet creates a new variable and sets its initial value. You can retrieve the value using [Get-AzureRmAutomationVariable](/powershell/module/AzureRM.Automation/Get-AzureRmAutomationVariable). If the value is a simple type, then that same type is returned. If it’s a complex type, then a **PSCustomObject** is returned.

The following sample commands show how to create a variable of type string and then return its value.

```powershell
New-AzureRmAutomationVariable -ResourceGroupName "ResourceGroup01" 
–AutomationAccountName "MyAutomationAccount" –Name 'MyStringVariable' `
–Encrypted $false –Value 'My String'
$string = (Get-AzureRmAutomationVariable -ResourceGroupName "ResourceGroup01" `
–AutomationAccountName "MyAutomationAccount" –Name 'MyStringVariable').Value
```

The following sample commands show how to create a variable with a complex type and then return its properties. In this case, a virtual machine object from **Get-AzureRmVm** is used.

```powershell
$vm = Get-AzureRmVm -ResourceGroupName "ResourceGroup01" –Name "VM01"
New-AzureRmAutomationVariable –AutomationAccountName "MyAutomationAccount" –Name "MyComplexVariable" –Encrypted $false –Value $vm

$vmValue = (Get-AzureRmAutomationVariable -ResourceGroupName "ResourceGroup01" `
–AutomationAccountName "MyAutomationAccount" –Name "MyComplexVariable").Value
$vmName = $vmValue.Name
$vmIpAddress = $vmValue.IpAddress
```

## Using a variable in a runbook or DSC configuration

Use the **Set-AutomationVariable** activity to set the value of an Automation variable in a PowerShell runbook or DSC configuration, and the **Get-AutomationVariable** to retrieve it. You shouldn't use the **Set-AzureRMAutomationVariable** or  **Get-AzureRMAutomationVariable** cmdlets in a runbook or DSC configuration since they are less efficient than the workflow activities. You also cannot retrieve the value of secure variables with **Get-AzureRMAutomationVariable**. The only way to create a new variable from within a runbook or DSC configuration is to use the [New-AzureRMAutomationVariable](/powershell/module/AzureRM.Automation/New-AzureRmAutomationVariable)  cmdlet.

### Textual runbook samples

#### Setting and retrieving a simple value from a variable

The following sample commands show how to set and retrieve a variable in a textual runbook. In this sample, it is assumed that variables of type integer named *NumberOfIterations* and *NumberOfRunnings* and a variable of type string named *SampleMessage* have been created.

```powershell
$NumberOfIterations = Get-AzureRmAutomationVariable -ResourceGroupName "ResourceGroup01" –AutomationAccountName "MyAutomationAccount" -Name 'NumberOfIterations'
$NumberOfRunnings = Get-AzureRmAutomationVariable -ResourceGroupName "ResourceGroup01" –AutomationAccountName "MyAutomationAccount" -Name 'NumberOfRunnings'
$SampleMessage = Get-AutomationVariable -Name 'SampleMessage'

Write-Output "Runbook has been run $NumberOfRunnings times."

for ($i = 1; $i -le $NumberOfIterations; $i++) {
	Write-Output "$i`: $SampleMessage"
}
Set-AzureRmAutomationVariable -ResourceGroupName "ResourceGroup01" –AutomationAccountName "MyAutomationAccount" –Name NumberOfRunnings –Value ($NumberOfRunnings += 1)
```

#### Setting and retrieving a variable in Python2

The following sample code shows how to use a variable, set a variable, and handle an exception for a non-existent variable in a Python2 runbook.

```python
import automationassets
from automationassets import AutomationAssetNotFound

# get a variable
value = automationassets.get_automation_variable("test-variable")
print value

# set a variable (value can be int/bool/string)
automationassets.set_automation_variable("test-variable", True)
automationassets.set_automation_variable("test-variable", 4)
automationassets.set_automation_variable("test-variable", "test-string")

# handle a non-existent variable exception
try:
	value = automationassets.get_automation_variable("non-existing variable")
except AutomationAssetNotFound:
	print "variable not found"
```

### Graphical runbook samples

In a graphical runbook, you add the **Get-AutomationVariable** or **Set-AutomationVariable** by right-clicking on the variable in the Library pane of the graphical editor and selecting the activity you want.

![Add variable to canvas](../media/variables/runbook-variable-add-canvas.png)

#### Setting values in a variable

The following image shows sample activities to update a variable with a simple value in a graphical runbook. In this sample, **Get-AzureRmVM**  retrieves a single Azure virtual machine and the computer name saves to an existing Automation variable with a type of String. It doesn't matter whether the [link is a pipeline or sequence](../automation-graphical-authoring-intro.md#links-and-workflow) since you only expect a single object in the output.

![Set simple variable](../media/variables/runbook-set-simple-variable.png)

## Next Steps

- To learn more about connecting activities together in graphical authoring, see [Links in graphical authoring](../automation-graphical-authoring-intro.md#links-and-workflow)
- To get started with Graphical runbooks, see [My first graphical runbook](../automation-first-runbook-graphical.md)
