<properties services="virtual-machines" title="Setting up xplat-cli for Resource Manager Templates" authors="squillace" solutions="" manager="timlt" editor="tysonn" />

## Setting up xplat-cli for Resource Manager templates

Before you can use the xplat-cli with Resource Manager templates and deploy Azure resources and workloads using resource groups, you should first 

## Step 1: Verify xplat version

To use the xplat-cli for imperative commands and ARM templates, you need to have at least version 0.8.17. To verify your version, type 

    azure --version
    
If you need to update your version of the xplat-cli, see [xplat-cli](https://github.com/Azure/azure-xplat-cli).

## Step 2: Connect xplat-cli to your Azure subscription

If you don't already have an Azure account but you do have a subscription to MSDN subscription, you can activate your [MSDN subscriber benefits here](http://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) -- or you can sign up for a [free Azure trial here](http://azure.microsoft.com/pricing/free-trial/). Either will work for Azure access.

Once you do so, you may have more than one subscription. If you do, you need to select the subscription you want to use by typing

    azure set <subscription id or name> true
    
where _subscription id or name_ is either the subscription id or the subscription name that you would like to work with in the current session.

> [AZURE.NOTE] If you do not HAVE     


## Step 3: Create a work or school identity in the subscription.

You cannot access the ARM commands unless you are using a [Azure Active Directory tenant](https://msdn.microsoft.com/en-us/library/azure/jj573650.aspx#BKMK_WhatIsAnAzureADTenant) or a [Service Principal Name](https://msdn.microsoft.com/en-us/library/azure/dn132633.aspx). It is possible to 




## Step 4: Switch to the Azure Resource Manager module

Switch to the Azure Resource Manager set of Azure PowerShell commands with this command.

	Switch-AzureMode AzureResourceManager

> [AZURE.NOTE] You can switch back to the Azure module with the **Switch-AzureMode AzureServiceManagement** command.