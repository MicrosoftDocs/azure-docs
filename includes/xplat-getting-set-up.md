<properties services="virtual-machines" title="Setting up xplat-cli for service management" authors="squillace" solutions="" manager="timlt" editor="tysonn" />

<tags
   ms.service="virtual-machine"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="linux"
   ms.workload="infrastructure"
   ms.date="04/13/2015"
   ms.author="rasquill" />

## Using the xplat-cli

The following steps help you use the xplat-cli easily with the most recent version and the proper subscription. If you need to install the xplat-cli and connect it to your account first, see the [Azure Command-Line Interface (xplat-cli)](xplat-cli.md).

### Step 1: Update the xplat-cli version

To use the xplat-cli for imperative commands with service management mode, you should have a recent version if possible. To verify your version, type `azure --version`. You should see something like:

    $ azure --version
    0.8.17 (node: 0.10.25)
    
If you want to update your version of the xplat-cli, see [xplat-cli](https://github.com/Azure/azure-xplat-cli).

### Step 2: Set the Azure account and subscription

Once you have connected your xplat-cli with the account you want to use, you may have more than one subscription. If you do, you should review the subscriptions available for your account by typing `azure account list`, and then select the subscription you want to use by typing `azure account set <subscription id or name> true` where _subscription id or name_ is either the subscription id or the subscription name that you would like to work with in the current session. You should see something like the following:

    $ azure account set "Visual Studio Ultimate with MSDN" true
    info:    Executing command account set
    info:    Setting subscription to "Visual Studio Ultimate with MSDN" with id "0e220bf6-5caa-4e9f-8383-51f16b6c109f".
    info:    Changes saved
    info:    account set command OK
    
> [AZURE.NOTE] If you don't already have an Azure account but you do have a subscription to MSDN subscription, you can get free Azure credits by activating your [MSDN subscriber benefits here](http://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) -- or you can use the free account. Either will work for Azure access. 
