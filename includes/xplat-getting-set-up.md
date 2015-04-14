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

Before you can use the xplat-cli with Resource Manager templates and deploy Azure resources and workloads using resource groups, you will need an account with Azure (of course). If you do not have an account, you can get a [free Azure trial here](http://azure.microsoft.com/pricing/free-trial/).

If you don't already have an Azure account but you do have a subscription to MSDN subscription, you can get free Azure credits by activating your [MSDN subscriber benefits here](http://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) -- or you can use the free account. Either will work for Azure access. 

## Step 1: Verify the xplat-cli version

To use the xplat-cli for imperative commands and ARM templates, you need to have at least version 0.8.17. To verify your version, type `azure --version`. You should see something like:

    $ azure --version
    0.8.17 (node: 0.10.25)
    
If you need to update your version of the xplat-cli, see [xplat-cli](https://github.com/Azure/azure-xplat-cli).

## Step 2: Verify you are using a work or school identity with Azure

You can only use the ARM command mode if you are using an [Azure Active Directory tenant](https://msdn.microsoft.com/library/azure/jj573650.aspx#BKMK_WhatIsAnAzureADTenant) or a [Service Principal Name](https://msdn.microsoft.com/library/azure/dn132633.aspx). (These are also called *organizational ids*.)

If you have one, you can log in by typing `azure login` and using your work or school username and password when prompted. You should see something like the following:

    $ azure login
    info:    Executing command login
    warn:    Please note that currently you can login only via Microsoft organizational account or service principal. For instructions on how to set them up, please read http://aka.ms/Dhf67j.
    Username: ahmet@contoso.onmicrosoft.com
    Password: *********
    |info:    Added subscription Visual Studio Ultimate with MSDN                  
    info:    Setting subscription Visual Studio Ultimate with MSDN as default
    info:    Added subscription Azure Free Trial
    +
    info:    login command OK
    
If you do not see this, you can create a new tenant (or service principal) with your Microsoft account identity. (This is often the case with personal MSDN subscriptions or free trial subscriptions.) To create a work or school id from your Azure account created with a Microsoft id, see [Associate an Azure AD Directory with a new Azure Subscription](https://msdn.microsoft.com/library/azure/jj573650.aspx#BKMK_WhatIsAnAzureADTenant).

## Step 3: Choose your Azure subscription

Once you do so, you may have more than one subscription. If you do, you need to select the subscription you want to use by typing

    azure set <subscription id or name> true
    
where _subscription id or name_ is either the subscription id or the subscription name that you would like to work with in the current session.

## Step 4: Place your xplat-cli in the ARM mode

To use the Azure Resource Management (ARM) mode with the xplat-cli, type `azure config mode arm`. You should see something like the following:

    $ azure config mode arm
    info:    New mode is arm

> [AZURE.NOTE] You can switch back to use Azure service management commands by typing `azure config mode asm`.


