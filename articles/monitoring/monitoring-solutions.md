---
title: Management solutions in Azure | Microsoft Docs
description: Management solutions in Azure are a collection of logic, visualization, and data acquisition rules that provide metrics pivoted around a particular problem area.  This article provides information on installing and using management solutions.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: ''
ms.assetid: f029dd6d-58ae-42c5-ad27-e6cc92352b3b
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/22/2018
ms.author: bwren


---
# Management solutions in Azure
Management solutions leverage services in Azure to provide additional insight into the operation of a particular application or service. This article provides a brief overview of management solutions in Azure and details on using and installing them.

Management solutions typically collect information into Log Analytics and provide log searches and views to analyze collected data. They may also leverage other services such as Azure Automation to perform actions related to the application or service.

You can add management solutions to your Azure subscription for any applications and services that you use. They are typically available at no cost but collect data that could invoke usage charges. In addition to solutions provided by Microsoft, partners and customers can [create management solutions](../monitoring/monitoring-solutions-creating.md) to be used in their own environment or made available to customers through the community.

## Using management solutions
The **Overview** page for each Log Analytics workspace displays a tile for each solution installed in the workspace. Click on the tile for the solution to open its view which includes more detailed analysis its collected data.

![Overview](media/monitoring-solutions/overview.png)

Management solutions can contain multiple types of Azure resources, and you can view any resources included with a solution just like any other resource. For example, any log searches included in the solution are included with **Saved Searches** in the workspace. You can use those searches when performing ad hoc analysis in Log Analytics.

## List installed management solutions 
Use the following procedure to list the management solutions installed in your subscription.

1. Log in to the Azure portal.
2. In the left pane, select **All services**.
3. Either scroll down to **Solutions** or type *solutions* into the **Filter** dialog.
4. Solutions installed in all your workspaces are listed. The name of the solution is followed by the name of the Log Analytics workspace it's installed in.
1. Use the dropdown boxes at the top of the screen to filter by subscription or resource group.


![List all solutions](media/monitoring-solutions/list-solutions-all.png)

Click on the name of a solution to open its summary page. This page displays any Log Analytics views included in the solution and provides different options for the solution itself and its workspace. View the summary page for a solution by using one of the procedures above to list solutions and then click on the name of the solution.

![Solution properties](media/monitoring-solutions/solution-properties.png)



## Install a management solution
Management solutions from Microsoft and partners are available from the [Azure Marketplace](https://azuremarketplace.microsoft.com). You can search available solutions and install them using the following procedure.

1. From the [list of solutions for your subscription](#list-installed-management-solutions), click **Add**. 
1. To the right of **Management Solutions**, click **More**. 
1. Locate the management solution you want and read through its description.
1. Click **Create** to start the installation process.
1. When the installation process starts, you're prompted to provide required configuration which varies for each solution. All of them require you to select a Log Analytics workspace where the solution will be installed and where its data will be collected. 

![Install a solution](media/monitoring-solutions/install-solution.png)

### Install a solution from the community
Members of the community can submit management solutions to Azure Quickstart Templates. You can install these solutions directly or download them templates for later installation.

1. Follow the process described in [Log Analytics workspace and Automation account](#log-analytics-workspace-and-automation-account) to link a workspace and account.
2. Go to [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates/). 
3. Search for a solution that you're interested in.
4. Select the solution from the results to view its details.
5. Click the **Deploy to Azure** button.
6. You're prompted to provide information such as the resource group and location in addition to values for any parameters in the solution.
7. Click **Purchase** to install the solution.


## Log Analytics workspace and Automation account
All management solutions require a [Log Analytics workspace](../log-analytics/log-analytics-manage-access.md) to store data collected by the solution and to host its log searches and views. Some solutions also require an [Automation account](../automation/automation-security-overview.md#automation-account-overview) to contain runbooks and related resources. The workspace and account must meet the following requirements.

* Each installation of a solution can only use one Log Analytics workspace and one Automation account. You can install the solution separately into multiple workspaces.
* If a solution requires an Automation account, then the Log Analytics workspace and Automation account must be linked to one another. A Log Analytics workspace may only be linked to one Automation account, and an Automation account may only be linked to one Log Analytics workspace.
* To be linked, the Log Analytics workspace and Automation account must be in the same resource group and region. The exception is a workspace in East US region and Automation account in East US 2.

### Creating a link between a Log Analytics workspace and Automation account
How you specify the Log Analytics workspace and Automation account depends on the installation method for your solution.

* When you install a solution through the Azure Marketplace, you are prompted for a workspace and Automation account. The link between them is created if they aren't already linked.
* For solutions outside of the Azure Marketplace, you must link the Log Analytics workspace and Automation account before installing the solution. You can do this by selecting any solution in the Azure Marketplace and selecting the Log Analytics workspace and Automation account. You don't have to actually install the solution because the link is created as soon as the Log Analytics workspace and Automation account are selected. Once the link is created, then you can use that Log Analytics workspace and Automation account for any solution.

### Verifying the link between a Log Analytics workspace and Automation account
You can verify the link between a Log Analytics workspace and an Automation account using the following procedure.

1. Select the Automation account in the Azure portal.
1. Scroll to the **Related Resources** section of the menu.
1. If the **Workspace** setting is enabled, then this account is linked to a Log Analytics workspace. You can click on **Workspace** to view the details of the workspace.

## Remove a management solution
To remove an installed solution, locate it in the [list of installed solutions](#list-installed-management-solutions). Click on the name of the solution to open its summary page and then click on **Delete**.




## Next steps
* Get a [list of management solutions from Microsoft](monitoring-solutions-inventory.md).
* Learn how to [create queries](../log-analytics/log-analytics-log-searches.md) to analyze data collected by management solutions.

