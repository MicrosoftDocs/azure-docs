---
title: Update Visual Studio's template deployment script to use Az PowerShell
description: Update the Visual Studio template deployment script from AzureRM to Az PowerShell
ms.topic: how-to
ms.date: 10/24/2024
---

# Update Visual Studio template deployment script to use Az PowerShell module

> [!NOTE]
> The Azure Resource Group project is now in extended support, meaning we will continue to support existing features and capabilities but won't prioritize adding new features.

> [!NOTE]
> For the best and most secure experience, we strongly recommend updating your Visual Studio installation to the [latest Long-Term Support (LTS) version](/visualstudio/install/update-visual-studio). Upgrading will improve both the reliability and overall performance of your Visual Studio environment. If you choose not to upgrade, you may encounter the issues documented in [Issues when creating and deploying Azure resource groups through Visual Studio](/troubleshoot/developer/visualstudio/ide/troubleshoot-create-deploy-resource-group).

Visual Studio 16.4 supports using the Az PowerShell module in the template deployment script. However, Visual Studio doesn't automatically install that module. To use the Az module, you need to take four steps:

1. [Uninstall AzureRM module](/powershell/azure/uninstall-az-ps#uninstall-the-azurerm-module)
1. [Install Az module](/powershell/azure/install-azure-powershell)
1. Update Visual Studio to 16.4
1. Update the deployment script in your project.

## Update Visual Studio to 16.4

Update your installation of Visual Studio to version 16.4 or later. During the upgrade, make sure the Azure PowerShell component isn't checked. Since you installed the Az module through the gallery, you don't want to reinstall the AzureRM module.

If you already upgraded to 16.4 and the Azure PowerShell component was checked, you can uninstall it by running the Visual Studio Installer. Don't select the Azure PowerShell component in the Azure Workload or on the individual components page.

## Update the deployment script in your project

Replace all occurrences of the string 'AzureRm' with 'Az' in your deployment script. You can refer to revisions in this [gist](https://gist.github.com/cweining/d2da2479418ea403499c4306dcf4f619) to see the changes. For more information about upgrading scripts to the Az module, see [Migrate Azure PowerShell from AzureRM to Az](/powershell/azure/migrate-from-azurerm-to-az).

## Next steps

To learn about using the Visual Studio project, see [Creating and deploying Azure resource group projects through Visual Studio](create-visual-studio-deployment-project.md).
