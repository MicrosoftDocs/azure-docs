## Setting up PowerShell for Resource Manager templates
 
Before you can use Azure PowerShell with Resource Manager, you will need to have right Windows PowerShell and Azure PowerShell versions.

### Verify PowerShell versions

Verify you have Windows PowerShell version 3.0 or 4.0. To find the version of Windows PowerShell, type this command at a Windows PowerShell command prompt.

	$PSVersionTable

You will receive the following type of information:

	Name                           Value
	----                           -----
	PSVersion                      3.0
	WSManStackVersion              3.0
	SerializationVersion           1.1.0.1
	CLRVersion                     4.0.30319.18444
	BuildVersion                   6.2.9200.16481
	PSCompatibleVersions           {1.0, 2.0, 3.0}
	PSRemotingProtocolVersion      2.2


Verify that the value of **PSVersion** is 3.0 or 4.0. If not, see [Windows Management Framework 3.0](http://www.microsoft.com/download/details.aspx?id=34595) or [Windows Management Framework 4.0](http://www.microsoft.com/download/details.aspx?id=40855).

You must also have Azure PowerShell version 0.9.0 or later. If you have not installed and configured Azure PowerShell, click [here](powershell-install-configure.md) for instructions.

You can check the version of Azure PowerShell that you have installed with this command at the Azure PowerShell command prompt.

	Get-Module azure | format-table version

You will receive the following type of information:

	Version
	-------
	0.9.0

If you do not have 0.9.0 or later, you must remove Azure PowerShell using the Programs and Features Control Panel and then install the latest version. See [How to Install and Configure Azure PowerShell](powershell-install-configure.md) for more information.

### Set your Azure account and subscription

If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](http://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free trial](http://azure.microsoft.com/pricing/free-trial/).

Open an Azure PowerShell command prompt and log on to Azure with this command.

	Add-AzureAccount

If you have multiple Azure subscriptions, you can list your Azure subscriptions with this command.

	Get-AzureSubscription

You will receive the following type of information:

	SubscriptionId            : fd22919d-eaca-4f2b-841a-e4ac6770g92e
	SubscriptionName          : Visual Studio Ultimate with MSDN
	Environment               : AzureCloud
	SupportedModes            : AzureServiceManagement,AzureResourceManager
	DefaultAccount            : johndoe@contoso.com
	Accounts                  : {johndoe@contoso.com}
	IsDefault                 : True
	IsCurrent                 : True
	CurrentStorageAccountName : 
	TenantId                  : 32fa88b4-86f1-419f-93ab-2d7ce016dba7

You can set the current Azure subscription by running these commands at the Azure PowerShell command prompt. Replace everything within the quotes, including the < and > characters, with the correct name.

	$subscr="<SubscriptionName from the display of Get-AzureSubscription>"
	Select-AzureSubscription -SubscriptionName $subscr -Current	

For more information about Azure subscriptions and accounts, see [How to: Connect to your subscription](powershell-install-configure.md#Connect).

### Switch to the Azure Resource Manager module

In order to use the Azure Resource Manager module you will need to switch from the default set of Azure commands to the Azure Resource Manager set of commands. Run this command.

	Switch-AzureMode AzureResourceManager

> [AZURE.NOTE] You can switch back to the default set of commands with the **Switch-AzureMode AzureServiceManagement** command.

