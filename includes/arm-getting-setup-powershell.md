<properties services="virtual-machines" title="Setting up PowerShell for Resource Manager templates" authors="JoeDavies-MSFT" solutions="" manager="timlt" editor="tysonn" />

## Setting up PowerShell for Resource Manager templates

Before you can use Azure PowerShell with Resource Manager templates and deploy Azure resources and workloads using resource groups, follow these steps.

### Step 1: Verify PowerShell versions

Before you can use Windows PowerShell with ARM, you must have the following:

- Windows PowerShell, Version 3.0 or 4.0. To find the version of Windows PowerShell, type **$PSVersionTable** and verify that the value of **PSVersion** is 3.0 or 4.0. To install a compatible version, see [Windows Management Framework 3.0](http://www.microsoft.com/download/details.aspx?id=34595) or [Windows Management Framework 4.0](http://www.microsoft.com/download/details.aspx?id=40855).

- Azure PowerShell version 0.8.0 or later. You can check the version of Azure PowerShell that you have installed with the **Get-Module azure | format-table version** command. For instructions and a link to the latest version, see [How to Install and Configure Azure PowerShell](powershell-install-configure.md).


### Step 2: Set your Azure subscription

If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](http://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free trial](http://azure.microsoft.com/pricing/free-trial/).

Set your Azure subscription by running these commands at the Azure PowerShell command prompt. Replace everything within the quotes, including the < and > characters, with the correct name.

	$subscr="<subscription name>"
	Select-AzureSubscription -SubscriptionName $subscr –Current
	Set-AzureSubscription -SubscriptionName $subscr

You can get the correct subscription name from the **SubscriptionName** property of the output of the **Get-AzureSubscription** command. You can also store these commands in a text file for future use.


### Step 3: Switch to the Azure Resource Manager module

Switch to the Azure Resource Manager set of Azure PowerShell commands with this command.

	Switch-AzureMode AzureResourceManager

> [AZURE.NOTE] You can switch back to the Azure module with the **Switch-AzureMode AzureServiceManagement** command.

