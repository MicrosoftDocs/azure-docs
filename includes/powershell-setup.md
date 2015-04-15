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

List your Azure subscriptions with this command.

	Get-AzureSubscription

For the subscription into which you want to deploy new resources, note the **Accounts** property. Run this command to login to Azure using an account listed in the **Accounts** property.

	Add-AzureAccount

Specify the email address of the account and its password in the Microsoft Azure sign-in dialog.

Set your Azure subscription by running these commands at the Azure PowerShell command prompt. Replace everything within the quotes, including the < and > characters, with the correct name.

	$subscr="<subscription name>"
	Select-AzureSubscription -SubscriptionName $subscr –Current
	Set-AzureSubscription -SubscriptionName $subscr

You can get the correct subscription name from the **SubscriptionName** property of the output of the **Get-AzureSubscription** command.

For more information about Azure subscriptions and accounts, see [How to: Connect to your subscription](powershell-install-configure.md#Connect).

