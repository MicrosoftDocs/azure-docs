---
title: Use Azure Automation runbooks and modules in PowerShell Gallery
description: This article tells how to use runbooks and modules from Microsoft and the community in PowerShell Gallery.
services: automation
ms.subservice: process-automation
ms.date: 03/04/2021
ms.topic: conceptual
---
# Use runbooks and modules in PowerShell Gallery

Rather than creating your own runbooks and modules in Azure Automation, you can access scenarios that have already been built by Microsoft and the community. You can get PowerShell runbooks and [modules](#modules-in-powershell-gallery) from the PowerShell Gallery and [Python runbooks](#use-python-runbooks) from the Azure Automation GitHub organization. You can also contribute to the community by sharing [scenarios that you develop](#add-a-powershell-runbook-to-the-gallery).

> [!NOTE]
> The TechNet Script Center is retiring. All of the runbooks from Script Center in the Runbook gallery have been moved to our [Automation GitHub organization](https://github.com/azureautomation) For more information, see [here](https://techcommunity.microsoft.com/t5/azure-governance-and-management/azure-automation-runbooks-moving-to-github/ba-p/2039337).

## Runbooks in PowerShell Gallery

The [PowerShell Gallery](https://www.powershellgallery.com/packages) provides a variety of runbooks from Microsoft and the community that you can import into Azure Automation. To use one, download a runbook from the gallery, or you can directly import runbooks from the gallery, or from your Automation account in the Azure portal.

> [!NOTE]
> Graphical runbooks are not supported in PowerShell Gallery.

You can only import directly from the PowerShell Gallery using the Azure portal. You cannot perform this function using PowerShell.

> [!NOTE]
> You should validate the contents of any runbooks that you get from the PowerShell Gallery and use extreme caution in installing and running them in a production environment.

## Modules in PowerShell Gallery

PowerShell modules contain cmdlets that you can use in your runbooks. Existing modules that you can install in Azure Automation are available in the [PowerShell Gallery](https://www.powershellgallery.com). You can launch this gallery from the Azure portal and install the modules directly into Azure Automation, or you can manually download and install them.

## Common scenarios available in PowerShell Gallery

The list below contains a few runbooks that support common scenarios. For a full list of runbooks created by the Azure Automation team, see [AzureAutomationTeam profile](https://www.powershellgallery.com/profiles/AzureAutomationTeam).

   * [Update-ModulesInAutomationToLatestVersion](https://www.powershellgallery.com/packages/Update-ModulesInAutomationToLatestVersion/) - Imports the latest version of all modules in an Automation account from PowerShell Gallery.
   * [Enable-AzureDiagnostics](https://www.powershellgallery.com/packages/Enable-AzureDiagnostics/) - Configures Azure Diagnostics and Log Analytics to receive Azure Automation logs containing job status and job streams.
   * [Copy-ItemFromAzureVM](https://www.powershellgallery.com/packages/Copy-ItemFromAzureVM/) - Copies a remote file from a Windows Azure virtual machine.
   * [Copy-ItemToAzureVM](https://www.powershellgallery.com/packages/Copy-ItemToAzureVM/) - Copies a local file to an Azure virtual machine.

## Import a  PowerShell runbook from GitHub with the Azure portal

1. In the Azure portal, open your Automation account.
1. Select **Runbooks gallery** under **Process Automation**.
1. Select **Source: GitHub**.
1. You can use the filters above the list to narrow the display by publisher, type, and sort. Locate the gallery item you want and select it to view its details.

   :::image type="content" source="media/automation-runbook-gallery/browse-gallery-github-sm.png" alt-text="Browsing the GitHub gallery." lightbox="media/automation-runbook-gallery/browse-gallery-github-lg.png":::

1. To import an item, click **Import** on the details blade.

   :::image type="content" source="media/automation-runbook-gallery/gallery-item-details-blade-github-sm.png" alt-text="Detailed view of a runbook from the GitHub gallery." lightbox="media/automation-runbook-gallery/gallery-item-details-blade-github-lg.png":::

1. Optionally, change the name of the runbook and then click **OK** to import the runbook.
1. The runbook appears on the **Runbooks** tab for the Automation account.

## Import a PowerShell runbook from the runbook gallery with the Azure portal

1. In the Azure portal, open your Automation account.
1. Select **Runbooks gallery** under **Process Automation**.
1. Select **Source: PowerShell Gallery**. This shows a list of available runbooks that you can browse.
1. You can use the search box above the list to narrow the list, or you can use the filters to narrow the display by publisher, type, and sort. Locate the gallery item you want and select it to view its details.

   :::image type="content" source="media/automation-runbook-gallery/browse-gallery-sm.png" alt-text="Browsing the runbook gallery." lightbox="media/automation-runbook-gallery/browse-gallery-lg.png":::

1. To import an item, click **Import** on the details blade.

   :::image type="content" source="media/automation-runbook-gallery/gallery-item-detail-sm.png" alt-text="Show a runbook gallery item detail." lightbox="media/automation-runbook-gallery/gallery-item-detail-lg.png":::

1. Optionally, change the name of the runbook and then click **OK** to import the runbook.
1. The runbook appears on the **Runbooks** tab for the Automation account.

## Add a PowerShell runbook to the gallery

Microsoft encourages you to add runbooks to the PowerShell Gallery that you think would be useful to other customers. The PowerShell Gallery accepts PowerShell modules and PowerShell scripts. You can add a runbook by [uploading it to the PowerShell Gallery](/powershell/scripting/gallery/how-to/publishing-packages/publishing-a-package).

## Import a module from the module gallery with the Azure portal

1. In the Azure portal, open your Automation account.
1. Select **Modules** under **Shared Resources** to open the list of modules.
1. Click **Browse gallery** from the top of the page.

      :::image type="content" source="media/automation-runbook-gallery/modules-blade-sm.png" alt-text="View of the module gallery." lightbox="media/automation-runbook-gallery/modules-blade-lg.png":::

1. On the Browse gallery page, you can use the search box to find matches in any of the following fields:

   * Module Name
   * Tags
   * Author
   * Cmdlet/DSC resource name

1. Locate a module that you're interested in and select it to view its details.

   When you drill into a specific module, you can view more information. This information includes a link back to the PowerShell Gallery, any required dependencies, and all of the cmdlets or DSC resources that the module contains.

   :::image type="content" source="media/automation-runbook-gallery/gallery-item-details-blade-sm.png" alt-text="Detailed view of a module from the gallery." lightbox="media/automation-runbook-gallery/gallery-item-details-blade-lg.png":::

1. To install the module directly into Azure Automation, click **Import**.
1. On the Import pane, you can see the name of the module to import. If all the dependencies are installed, the **OK** button is activated. If you're missing dependencies, you need to import those dependencies before you can import this module.
1. On the Import pane, click **OK** to import the module. While Azure Automation imports a module to your account, it extracts metadata about the module and the cmdlets. This action might take a couple of minutes since each activity needs to be extracted.
1. You receive an initial notification that the module is being deployed and another notification when it has completed.
1. After the module is imported, you can see the available activities. You can use module resources in your runbooks and DSC resources.

> [!NOTE]
> Modules that only support PowerShell core are not supported in Azure Automation and are unable to be imported in the Azure portal, or deployed directly from the PowerShell Gallery.

## Use Python runbooks

Python Runbooks are available in the [Azure Automation GitHub organization](https://github.com/azureautomation). When you contribute to our GitHub repo, add the tag **(GitHub Topic) : Python3** when you upload your contribution.

## Request a runbook or module

You can send requests to [User Voice](https://feedback.azure.com/forums/246290-azure-automation/).  If you need help with writing a runbook or have a question about PowerShell, post a question to our [Microsoft Q&A question page](/answers/topics/azure-automation.html).

## Next steps

* To get started with a PowerShell runbook, see [Tutorial: Create a PowerShell runbook](learn/automation-tutorial-runbook-textual-powershell.md).
* To work with runbooks, see [Manage runbooks in Azure Automation](manage-runbooks.md).
* For details of PowerShell, see [PowerShell Docs](/powershell/scripting/overview).
* For a PowerShell cmdlet reference, see [Az.Automation](/powershell/module/az.automation).