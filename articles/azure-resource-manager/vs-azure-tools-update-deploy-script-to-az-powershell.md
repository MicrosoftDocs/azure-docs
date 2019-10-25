---
title: Update Visual Studio's template deployment script to use Az Powershell
description: Update the Visual Studio template deployment script from AzureRM to Az Powershell
author: cweining
ms.service: azure-resource-manager
ms.topic: quickstart
ms.date: 09/27/2019
ms.author: cweining
---
# Updating the Visual Studio template deployment script to use Az Powershell

Visual Studio 16.4 supports using Az Powershell in the template deployment script. Visual Studio does not install Az Powershell or automatically update the deployment script in your resource group project. In order to use the newer Az Powershell, you need to do these four things:
1. Uninstall AzureRM powershell
1. Install Az Powershell
1. Update to Visual Studio 16.4
1. Update the deployment script in your project.

## Uninstall AzureRM powershell
Follow these [instructions](https://docs.microsoft.com/powershell/azure/uninstall-az-ps?view=azps-2.7.0#uninstall-the-azurerm-module) to uninstall AzureRM Powershell.

## Install Az Powershell
Follow these [instructions](https://docs.microsoft.com/powershell/azure/install-az-ps?view=azps-2.7.0) to install Az Powershell.

## Update Visual Studio to 16.4
Update to Visual Studio 16.4 when it is available. During the upgrade, be sure that the Azure Powershell component is not checked. Since you installed Az Powershell through the gallery, you don't want the AzureRM version of Powershell that installs with Visual Studio.

If you already upgraded to 16.4 and the Azure Powershell component was checked, you can uninstall it by running the Visual Studio Installer and unchecking the Azure Powershell component in the Azure Workload, or on the individual components page.

## Update the deployment script in your project
Replace all occurrences of the string 'AzureRm' with 'Az' in your deployment script. You can refer to revisions in this [gist](https://gist.github.com/cweining/d2da2479418ea403499c4306dcf4f619) to see the changes. Refer to this [documentation](https://docs.microsoft.com/powershell/azure/migrate-from-azurerm-to-az?view=azps-2.5.0) for more information about upgrading scripts to Az Powershell.


