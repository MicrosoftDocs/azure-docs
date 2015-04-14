<properties services="virtual-machines" title="Setting up xplat-cli for Resource Manager Templates" authors="squillace" solutions="" manager="timlt" editor="tysonn" />

<tags
   ms.service="virtual-machine"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="linux"
   ms.workload="infrastructure"
   ms.date="04/13/2015"
   ms.author="rasquill" />

## Setting up the xplat-cli for Resource Manager templates

Before you can use the xplat-cli with Resource Manager templates and deploy Azure resources and workloads using resource groups, you should first 

## Step 1: Verify the xplat-cli version

To use the xplat-cli for imperative commands and ARM templates, you need to have at least version 0.8.17. To verify your version, type 

    azure --version
    
If you need to update your version of the xplat-cli, see [xplat-cli](https://github.com/Azure/azure-xplat-cli).

## Step 2: Connect xplat-cli to your Azure subscription

If you don't already have an Azure account but you do have a subscription to MSDN subscription, you can activate your [MSDN subscriber benefits here](http://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) -- or you can sign up for a [free Azure trial here](http://azure.microsoft.com/pricing/free-trial/). Either will work for Azure access.

Once you do so, you may have more than one subscription. If you do, you need to select the subscription you want to use by typing

    azure set <subscription id or name> true
    
where _subscription id or name_ is either the subscription id or the subscription name that you would like to work with in the current session.

## Step 3: Create a work or school identity in the subscription.

You can only use the ARM command mode if you are using an [Azure Active Directory tenant](https://msdn.microsoft.com/library/azure/jj573650.aspx#BKMK_WhatIsAnAzureADTenant) or a [Service Principal Name](https://msdn.microsoft.com/library/azure/dn132633.aspx). 

If you have one, you can log in by typing

    azure login
    
and using your work or school username and password when prompted.

> [AZURE.NOTE] If you do not have a work or school id -- what also is called an "organizational id" -- it is possible to create a new tenant (or service principal) with your Microsoft account. (This is often the case with personal MSDN subscriptions.) To create a work or school id from your Azure account created with a Microsoft id, see [Associate an Azure AD Directory with a new Azure Subscription](https://msdn.microsoft.com/library/azure/jj573650.aspx#BKMK_WhatIsAnAzureADTenant).

## Step 4: Place your xplat-cli in the ARM mode

To use the Resource Management mode with the xplat-cli, you need to move into the ARM mode by typing:

	azure config mode arm

> [AZURE.NOTE] You can switch back to use Azure service management commands by typing

    azure config mode asm


