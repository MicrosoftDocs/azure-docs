<properties services="virtual-machines" title="Setting up xplat-cli for Resource Manager Templates" authors="squillace" solutions="" manager="timlt" editor="tysonn" />

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

## Step 1: Update the xplat-cli version

To use the xplat-cli for imperative commands and ARM templates, you should have a recent version if possible. To verify your version, type `azure --version`. You should see something like:

    $ azure --version
    0.8.17 (node: 0.10.25)
    
If you want to update your version of the xplat-cli, see [xplat-cli](https://github.com/Azure/azure-xplat-cli).

## Step 2: Set the Azure account and subscription

Once you have connected your xplat-cli with the account you want to use, you may have more than one subscription. If you do, you need to select the subscription you want to use by typing

    azure set <subscription id or name> true
    
where _subscription id or name_ is either the subscription id or the subscription name that you would like to work with in the current session.


Before you can use the xplat-cli with Resource Manager templates and deploy Azure resources and workloads using resource groups, you will need an account with Azure (of course). If you do not have an account, you can get a [free Azure trial here](http://azure.microsoft.com/pricing/free-trial/).

If you don't already have an Azure account but you do have a subscription to MSDN subscription, you can get free Azure credits by activating your [MSDN subscriber benefits here](http://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) -- or you can use the free account. Either will work for Azure access. 
