---
title: Solutions in Operations Management Suite (OMS) | Microsoft Docs
description: Solutions extend the functionality of Operations Management Suite (OMS) by providing packaged management scenarios that customers can add to their OMS workspace.  This article provides details on how custom solutions created by customers and partners.
services: operations-management-suite
documentationcenter: ''
author: bwren
manager: jwhit
editor: tysonn

ms.assetid: 1f054a4e-6243-4a66-a62a-0031adb750d8
ms.service: operations-management-suite
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/01/2017
ms.author: bwren

ms.custom: H1Hack27Feb2017

---
# Working with management solutions in Operations Management Suite (OMS) (Preview)
> [!NOTE]
> This is preliminary documentation for management solutions in OMS which are currently in preview.    
> 
> 

Management solutions extend the functionality of Operations Management Suite (OMS) by providing packaged management scenarios that customers can add to their environment.  In addition to [solutions provided by Microsoft](../log-analytics/log-analytics-add-solutions.md), partners and customers can create management solutions to be used in their own environment or made available to customers through the community.

## Finding and installing management solutions
There are multiple methods for locating and installing management solutions as described in the following sections.

### Azure Marketplace
Management solutions provided by Microsoft and trusted partners may be installed from the Azure Marketplace in the Azure portal.

1. Log in to the Azure portal.
2. In the left pane, select **More services**.
3. Either scroll down to **Solutions** or type *solutions* into the **Filter** dialog.
4. Click the **+ Add** button.
5. Search for solutions that you're interested in either by browsing, clicking the **Filter** button, or typing in the **Search Everthing** box.
6. Click a marketplace item to view its detailed information.
7. Click **Create** to open the **Add Solution** pane.
8. You will be prompted to required information such as the [OMS workspace and Automation account](#oms-workspace-and-automation-account) in addition to values for any parameters in the solution.
9. Click **Create** to install the solution.

### OMS Portal
Management solutions provided by Microsoft may be installed from the Solutions Gallery in the OMS portal.

1. Log in to the OMS portal.
2. Click the **Solutions Gallery** tile.
3. On the OMS Solutions Gallery page, learn about each available solution. Click the name of the solution that you want to add to OMS.
4. On the page for the solution that you chose, detailed information about the solution is displayed. Click **Add**.
5. A new tile for the solution that you added appears on the Overview page in OMS and you can start using it after the OMS service processes your data.

### Azure Quickstart Templates
Members of the community can submit management solutions to Azure Quickstart Templates.  You can either download these templates for later installation or inspect them to learn how to [create your own solutions](#creating-a-solution).

1. Follow the process described in [OMS workspace and Automation account](#oms-workspace-and-automation-account) to link a workspace and account.
2. Go to [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates/).  
3. Search for a solution that you're interested in.
4. Select the solution from the results to view its details.
5. Click the **Deploy to Azure** button.
6. You will be prompted to provide information such as the resource group and location in addition to values for any parameters in the solution.
7. Click **Purchase** to install the solution.

### Deploy Azure Resource Manager template
Solutions that you get from the community or that you [create yourself](#creating-a-solution) are implemented as a Resource Manager template, and you can use any of the standard methods for [deploying a template](../azure-resource-manager/resource-group-template-deploy-portal.md).  Note that before installing the solution, you must create and link the [OMS workspace and Automation account](#oms-workspace-and-automation-account).

## OMS workspace and Automation account
Most management solutions require an [OMS workspace](../log-analytics/log-analytics-manage-access.md) to contain views and an [Automation account](../automation/automation-security-overview.md#automation-account-overview) to contain runbooks and related resources. The workspace and account must meet the following requirements.

* A solution can only use one OMS workspace and one Automation account.  
* The OMS workspace and Automation account used by a solution must be linked to one another. An OMS workspace may only be linked to one Automation account, and an Automation account may only be linked to one OMS workspace.
* To be linked, the OMS workspace and Automation account must be in the same resource group and region.  The exception is an OMS workspace in East US region and and Automation account in East US 2.

### Creating a link between an OMS workspace and Automation account
How you specify the OMS workspace and Automation account depends on the installation method for your solution.

* When you install a Microsoft solution through the OMS portal, it is installed in the current OMS workspace and no Automation account is required.
* When you install a solution through the Azure Marketplace, you are prompted for an OMS workspace and Automation account, and the link between them is created for you.  
* For solutions outside of the Azure Marketplace, you must link the OMS workspace and Automation account before installing the solution.  You can do this by selecting any solution in the Azure Marketplace and selecting the OMS workspace and Automation account.  You don't have to actually install the solution because the link will be created as soon as the OMS workspace and Automation account are selected.  Once the link is created, then you can use that OMS workspace and Automation account for any solution. 

### Verifying the link between an OMS workspace and Automation account
You can verify the link between an OMS workspace and an Automation account using the following procedure.

1. Select the Automation account in the Azure portal.
2. Scroll to the bottom of the **Settings** pane.
3. If there is a section called **OMS Resources** in the **Settings** pane, then this account is attached to an OMS workspace.
4. Select **Workspace** to view the details of the OMS workspace linked to this Automation account.

## Listing management solutions
Use the following procedure to to view the management solutions in the workspaces linked to your Azure subscription.

1. Log in to the Azure portal.
2. In the left pane, select **More services**.
3. Either scroll down to **Solutions** or type *solutions* into the **Filter** dialog.
4. Solutions installed in all your workspaces will be listed.

Note that you can view only the Microsoft solutions installed in the current workspace using the OMS portal.

## Removing a management solution
When a management solution is removed, all resources in the solution are also removed.  

1. Locate the solution in the Azure portal using the procedure in [Listing solutions](#listing-solutions).
2. Select the solution you want to remove.
3. Click the **Delete** button.

## Creating a management solution
Complete guidance on creating management solutions are available at [Creating solutions in Operations Management Suite (OMS)](operations-management-suite-solutions-creating.md). 

## Next steps
* Search [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates) for samples of different Resource Manager templates.
* Create your own [management solutions](operations-management-suite-solutions-creating.md).

