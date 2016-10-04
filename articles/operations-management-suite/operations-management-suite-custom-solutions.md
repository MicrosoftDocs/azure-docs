<properties
   pageTitle="Custom solutions in Operations Management Suite (OMS) | Microsoft Azure"
   description="Solutions extend the functionality of Operations Management Suite (OMS) by providing packaged management scenarios that customers can add to their OMS workspace.  This article provides details on how custom solutions created by customers and partners."
   services="operations-management-suite"
   documentationCenter=""
   authors="bwren"
   manager="jwhit"
   editor="tysonn" />
<tags
   ms.service="operations-management-suite"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="10/03/2016"
   ms.author="bwren" />

# Custom solutions in Operations Management Suite (OMS) (Preview)

>[AZURE.NOTE]This is preliminary documentation for custom solutions in OMS which are currently in preview.    

Solutions extend the functionality of Operations Management Suite (OMS) by providing packaged management scenarios that customers can add to their OMS workspace.  In addition to [solutions provided by Microsoft](../log-analytics/log-analytics-add-solutions.md), partners and customers can create custom solutions to be used in their own environment or made available to customers through the community.

## Creating a custom solution
Complete guidance on creating custom solutions are available at [Creating custom solutions in Operations Management Suite (OMS)](operations-management-suite-custom-solutions-creating.md). 


## Installing a custom solution
Since custom solutions are implemented as Resource Manager templates in Azure, they cannot be deployed from the OMS console like Microsoft solutions.  

There are three methods for installing a custom solution depending on how it has been made available from its author.

- Solutions from trusted Microsoft partners will be available in the [Azure Marketplace](http://azure.microsoft.com/marketplace/).  These solutions will have a complete user interface to guide you through the installation.
- Authors can make solutions available to the community at [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates/).  This provides some user interface to assist with installation, but you must provide values for all parameters.  
- Since a custom solution is implemented as a Resource Manager template, you can use any of the standard methods for [deploying a template](../resource-group-template-deploy-portal.md).


## OMS workspace and Automation account
Solutions require an [OMS workspace](../log-analytics/log-analytics-manage-access.md) to contain views and an [Automation account](../automation/automation-security-overview.md#automation-account-overview) to contain runbooks and related resources.  These must be available before the resources in the solution are created and should not be defined in the solution itself.  The user will specify a workspace and account when they deploy your solution, but as the author you should consider the following points.

- A solution can only use one OMS workspace and one Automation account.  It will accept the names for each in the solution's parameters and use them with related resources throughout the solution. 
- The OMS workspace and Automation account used by a solution must be linked to one another. An OMS workspace may only be linked to one Automation account, and an Automation account may only be linked to one OMS workspace.
- To be linked, the OMS workspace and Automation account must be in the same resource group and region.  The exception is an OMS workspace in East US region and and Automation account in East US 2.

### Creating a link between the OMS workspace and Automation account
Currently, the only way to create a link between an OMS workspace and Automation account is through the user interface in the Azure portal when a installs a solution from the Azure Marketplace.  The user is prompted to select a workspace and account, and they are limited to the those with a matching resource group and region.  The link is created just before the solution is installed. 

If your solution will be made available through [Azure QuickStart templates](https://azure.microsoft.com/documentation/templates/), then you must link the OMS workspace and Automation account before installing the solution.  You can do this by selecting any solution in the Azure Marketplace and selecting the OMS workspace and Automation account.  You don't have to actually install the solution because the link will be created as soon as the OMS workspace and Automation account are selected.  Once the link is created, then you can use that OMS workspace and Automation account for any solution. 

### Verifying the link between an OMS workspace and Automation account
You can verify the link between an OMS workspace and an Automation account using the following procedure.

1. Select the Automation account in the Azure portal.
2. Scroll to the bottom of the **Settings** pane.
3. If there is a section called **OMS Resources** in the **Settings** pane, then this account is attached to an OMS workspace.
4. Select **Workspace** to view the details of the OMS workspace linked to this Automation account.


## Listing custom solutions
Custom solutions will not be listed in the OMS console, and you must use the Azure portal to view and manage custom solutions.  

1. Log in to the Azure portal.
2. In the left pane, select **More services**.
3. Either scroll down to **Solutions** or type *solutions* into the **Filter** dialog.
4. Standard and custom solutions installed in all your workspaces will be listed.

## Removing a custom solution
When a solution is removed, all resources in the solution are also removed.  

1. Locate the solution in the Azure portal using the procedure in [Listing custom solutions](#listingcustom-solutions).
2. Select the solution you want to remove.
3. Click the **Delete** button.

## Next steps

- Search [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates) for samples of different Resource Manager templates.
- Create your own [custom solutions](operations-management-suite-custom-solutions-creating.md).
 