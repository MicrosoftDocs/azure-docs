---
title: Runbook and module galleries for Azure Automation
description: Runbooks and modules from Microsoft and the community are available for you to install and use in your Azure Automation environment.  This article describes how you can access these resources and to contribute your runbooks to the gallery.
services: automation
ms.service: automation
ms.subservice: process-automation
author: bobbytreed
ms.author: robreed
ms.date: 03/20/2019
ms.topic: conceptual
manager: carmonm
---
# Runbook and module galleries for Azure Automation

Rather than creating your own runbooks and modules in Azure Automation, you can access scenarios that have already been built by Microsoft and the community.

You can get PowerShell runbooks and [modules](#modules-in-powershell-gallery) from the PowerShell Gallery and [Python runbooks](#python-runbooks) from the Script Center Gallery. You can also contribute to the community by sharing scenarios that you develop, see Adding a runbook to the gallery

## Runbooks in PowerShell Gallery

The [PowerShell Gallery](https://www.powershellgallery.com/packages) provides a variety of runbooks from Microsoft and the community that you can import into Azure Automation. To use one, download a runbook from the gallery, or you can directly import runbooks from the gallery, or from your Automation Account in the Azure portal.

You can only import directly from the PowerShell Gallery using the Azure portal. You cannot perform this function using PowerShell.

> [!NOTE]
> You should validate the contents of any runbooks that you get from the PowerShell Gallery and use extreme caution in installing and running them in a production environment.

### To import a PowerShell runbook from the Runbook Gallery with the Azure portal

1. In the Azure portal, open your Automation account.
2. Under **Process Automation**, click on **Runbooks gallery**
3. Select **Source: PowerShell Gallery**.
4. Locate the gallery item you want and select it to view its details. On the left, you can enter additional search parameters for the publisher and type.

   ![Browse gallery](media/automation-runbook-gallery/browse-gallery.png)

5. Click on **View source project** to view the item in the [TechNet Script Center](https://gallery.technet.microsoft.com/).
6. To import an item, click on it to view its details and then click the **Import** button.

   ![Import button](media/automation-runbook-gallery/gallery-item-detail.png)

7. Optionally, change the name of the runbook and then click **OK** to import the runbook.
8. The runbook appears on the **Runbooks** tab for the Automation Account.

### Adding a PowerShell runbook to the gallery

Microsoft encourages you to add runbooks to the PowerShell Gallery that you think would be useful to other customers. The PowerShell Gallery accepts PowerShell modules and PowerShell scripts. You can add a runbook by [uploading it to the PowerShell Gallery](/powershell/gallery/how-to/publishing-packages/publishing-a-package).

> [!NOTE]
> Graphical runbooks are not supported in PowerShell Gallery.

## Modules in PowerShell Gallery

PowerShell modules contain cmdlets that you can use in your runbooks, and existing modules that you can install in Azure Automation are available in the [PowerShell Gallery](https://www.powershellgallery.com). You can launch this gallery from the Azure portal and install them directly into Azure Automation. You can also download them and install them manually.  

### To import a module from the Automation Module Gallery with the Azure portal

1. In the Azure portal, open your Automation account.
2. Select **Modules** under **Shared Resources** to open the list of modules.
3. Click **Browse gallery** from the top of the page.

   ![Module gallery](media/automation-runbook-gallery/modules-blade.png)

4. On the **Browse gallery** page, you can search by the following fields:

   * Module Name
   * Tags
   * Author
   * Cmdlet/DSC resource name

5. Locate a module that you're interested in and select it to view its details.  

   When you drill into a specific module, you can view more information. This information includes a link back to the PowerShell Gallery, any required dependencies, and all of the cmdlets or DSC resources that the module contains.

   ![PowerShell module details](media/automation-runbook-gallery/gallery-item-details-blade.png)

6. To install the module directly into Azure Automation, click the **Import** button.
7. When you click the Import button, on the **Import** pane, you see the module name that you're about to import. If all the dependencies are installed, the **OK** button is activated. If you're missing dependencies, you need to import those dependencies before you can import this module.
8. On the **Import** page, click **OK** to import the module. While Azure Automation imports a module to your account, it extracts metadata about the module and the cmdlets. This action may take a couple of minutes since each activity needs to be extracted.
9. You receive an initial notification that the module is being deployed and another notification when it has completed.
10. After the module is imported, you can see the available activities. You can use its resources in your runbooks and Desired State Configuration.

> [!NOTE]
> Modules that only support PowerShell core are not supported in Azure Automation and are unable to be imported in the Azure portal, or deployed directly from the PowerShell Gallery.

## Python Runbooks

Python Runbooks are available in the [Script Center gallery](https://gallery.technet.microsoft.com/scriptcenter/site/search?f%5B0%5D.Type=RootCategory&f%5B0%5D.Value=WindowsAzure&f%5B1%5D.Type=ProgrammingLanguage&f%5B1%5D.Value=Python&f%5B1%5D.Text=Python&sortBy=Date&username=). You can contribute Python runbooks to the Script Center gallery by clicking **Upload a contribution**. When you do, ensure that you add the tag **Python** when uploading your contribution.

> [!NOTE]
> In order to upload content to [Script Center](https://gallery.technet.microsoft.com/scriptcenter) a minimum of 100 points is required. 

## Requesting a runbook or module

You can send requests to [User Voice](https://feedback.azure.com/forums/246290-azure-automation/).  If you need help with writing a runbook or have a question about PowerShell, post a question to our [forum](https://social.msdn.microsoft.com/Forums/windowsazure/home?forum=azureautomation&filter=alltypes&sort=lastpostdesc).

## Next steps

* To get started with runbooks, see [Manage runbook in Azure Automation](manage-runbooks.md)
* To understand the differences between PowerShell and PowerShell Workflow with runbooks, see [Learning PowerShell workflow](automation-powershell-workflow.md)
