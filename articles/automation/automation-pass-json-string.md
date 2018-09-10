---
title: Pass a JSON object to an Azure Automation runbook
description: How to pass parameters to a runbook as a JSON object
services: automation
ms.service: automation
ms.component: process-automation
author: georgewallace
ms.author: gwallace
ms.date: 03/16/2018
ms.topic: conceptual
manager: carmonm
keywords: powershell,  runbook, json, azure automation
---

# Pass a JSON object to an Azure Automation runbook

It can be useful to store data that you want to pass to a runbook in a JSON file.
For example, you might create a JSON file that contains all of the parameters you want to pass to a runbook.
To do this, you have to convert the JSON to a string
and then convert the string to a PowerShell object before passing its contents to the runbook.

In this example, we'll create a PowerShell script that calls
[Start-AzureRmAutomationRunbook](https://docs.microsoft.com/powershell/module/azurerm.automation/start-azurermautomationrunbook)
to start a PowerShell runbook, passing the contents of the JSON to the runbook.
The PowerShell runbook starts an Azure VM, getting the parameters for the VM from the JSON that was passed in.

## Prerequisites
To complete this tutorial, you need the following:

* Azure subscription. If you don't have one yet, you can [activate your MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or [sign up for a free account](https://azure.microsoft.com/free/).
* [Automation account](automation-sec-configure-azure-runas-account.md) to hold the runbook and authenticate to Azure resources.  This account must have permission to start and stop the virtual machine.
* An Azure virtual machine. We stop and start this machine so it should not be a production VM.
* Azure Powershell installed on a local machine. See [Install and configure Azure Powershell](https://docs.microsoft.com/powershell/azure/install-azurerm-ps?view=azurermps-4.1.0) for information about how to get Azure PowerShell.

## Create the JSON file

Type the following test in a text file, and save it as `test.json` somewhere on your local computer.

```json
{
   "VmName" : "TestVM",
   "ResourceGroup" : "AzureAutomationTest"
}
```

## Create the runbook

Create a new PowerShell runbook named "Test-Json" in Azure Automation.
To learn how to create a new PowerShell runbook, see
[My first PowerShell runbook](automation-first-runbook-textual-powershell.md).

To accept the JSON data, the runbook must take an object as an input parameter.

The runbook can then use the properties defined in the JSON.

```powershell
Param(
     [parameter(Mandatory=$true)]
     [object]$json
)

# Connect to Azure account   
$Conn = Get-AutomationConnection -Name AzureRunAsConnection
Connect-AzureRmAccount -ServicePrincipal -Tenant $Conn.TenantID `
    -ApplicationID $Conn.ApplicationID -CertificateThumbprint $Conn.CertificateThumbprint

# Convert object to actual JSON
$json = $json | ConvertFrom-Json

# Use the values from the JSON object as the parameters for your command
Start-AzureRmVM -Name $json.VMName -ResourceGroupName $json.ResourceGroup
 ```

 Save and publish this runbook in your Automation account.

## Call the runbook from PowerShell

Now you can call the runbook from your local machine by using Azure PowerShell.
Run the following PowerShell commands:

1. Log in to Azure:
   ```powershell
   Connect-AzureRmAccount
   ```
    You are prompted to enter your Azure credentials.

   > [!IMPORTANT]
   > **Add-AzureRmAccount** is now an alias for **Connect-AzureRMAccount**. When searching your library items, if you do not see **Connect-AzureRMAccount**, you can use **Add-AzureRmAccount**, or you can update your modules in your Automation Account.

1. Get the contents of the JSON file and convert it to a string:
    ```powershell
    $json =  (Get-content -path 'JsonPath\test.json' -Raw) | Out-string
    ```
    `JsonPath` is the path where you saved the JSON file.
1. Convert the string contents of `$json` to a PowerShell object:
   ```powershell
   $JsonParams = @{"json"=$json}
   ```
1. Create a hashtable for the parameters for `Start-AzureRmAutomationRunbook`:
   ```powershell
   $RBParams = @{
        AutomationAccountName = 'AATest'
        ResourceGroupName = 'RGTest'
        Name = 'Test-Json'
        Parameters = $JsonParams
   }
   ```
   Notice that you are setting the value of `Parameters` to the PowerShell object that contains the values from the JSON file. 
1. Start the runbook
   ```powershell
   $job = Start-AzureRmAutomationRunbook @RBParams
   ```

The runbook uses the values from the JSON file to start a VM.

## Next steps

* To learn more about editing PowerShell and PowerShell Workflow runbooks with a textual editor, see [Editing textual runbooks in Azure Automation](automation-edit-textual-runbook.md) 
* To learn more about creating and importing runbooks, see [Creating or importing a runbook in Azure Automation](automation-creating-importing-runbook.md)


