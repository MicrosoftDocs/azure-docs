<properties services="virtual-machines" title="Setting up PowerShell" authors="JoeDavies-MSFT" solutions="" manager="timlt" editor="tysonn" />

<tags
   ms.service="virtual-machines"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm=""
   ms.workload="infrastructure"
   ms.date="04/14/2015"
   ms.author="josephd" />

## Setting up PowerShell

Before you can use Azure PowerShell, follow these steps.

### Step 1: Verify PowerShell versions

Before you can use Windows PowerShell, you must have Windows PowerShell, Version 3.0 or 4.0. To find the version of Windows PowerShell, type this command at a Windows PowerShell command prompt.

	$PSVersionTable

You should see something like this.

	Name                           Value
	----                           -----
	PSVersion                      3.0
	WSManStackVersion              3.0
	SerializationVersion           1.1.0.1
	CLRVersion                     4.0.30319.18444
	BuildVersion                   6.2.9200.16481
	PSCompatibleVersions           {1.0, 2.0, 3.0}
	PSRemotingProtocolVersion      2.2

Verify that the value of **PSVersion** is 3.0 or 4.0. To install a compatible version, see [Windows Management Framework 3.0](http://www.microsoft.com/download/details.aspx?id=34595) or [Windows Management Framework 4.0](http://www.microsoft.com/download/details.aspx?id=40855).

You should also have Azure PowerShell version 0.8.0 or later. You can check the version of Azure PowerShell that you have installed with this command at the Azure PowerShell command prompt.

	Get-Module azure | format-table version

You should see something like this.

	Version
	-------
	0.8.16.1

For instructions and a link to the latest version, see [How to Install and Configure Azure PowerShell](powershell-install-configure.md).


### Step 2: Set your Azure account and subscription

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
	Select-AzureSubscription -SubscriptionName $subscr –Current	

For more information about Azure subscriptions and accounts, see [How to: Connect to your subscription](powershell-install-configure.md#Connect).
