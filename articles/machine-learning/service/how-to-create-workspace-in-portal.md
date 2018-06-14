---
title: Create a Workspace using Azure portal
description: Learn how to create a workspace using Microsoft Azure portal.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.reviewer: sgilley
ms.author: yahajiza
author: YasinMSFT
ms.date: 04/10/2018
---
# Create a Workspace using Azure portal

To get started using Azure Machine Learning, you need a workspace. In this page, we demonsrate how you can quickly and easilly create a workspace using the Azure portal.

## Prerequisites

To step through this how-to guide, you need an Azure account.

## Create a Workspace 

The experience starts in the Azure portal by clicking on Create a resource in top left corner of screen. In the “Search the Marketplace” box, type Machine Learning and select Machine Learning Workplace from the list of suggestions.

![png](media/how-to-create-workspace-in-portal/search_for_workspace.PNG)

Alternatively, you can press enter and select Machine Learning Workspace from search results.

![png](media/how-to-create-workspace-in-portal/search_result_workspace.PNG)

To create a workspace, click on Machine Learning Workspace to open the creation page. 

![png](media/how-to-create-workspace-in-portal/workspace_create.PNG)

Once you click on create, a new window will appear. Here, you need to complete some basic fields to create a workspace. The first step is to name the workspace you will be creating. In this example, we name it MyWorkspace. Next, you need to select a subscription. Third, you need to either create a new resource group or use an existing one. In this example, we use an existing resource group called Group. Finally, you need to select the geographical region where the workspace will be created. Once all these input fields are completed, then click on Create.

![png](media/how-to-create-workspace-in-portal/workspace_create_name.PNG)

After clicking on create, a request will be submitted to Azure to provision the workspace. You can check the deployment progress by clicking on the notifications icon in top right section of portal. 

![png](media/how-to-create-workspace-in-portal/deployment_in_progress.PNG)

Upon completion of this stage, you will see a message informing you that the deployment has succeeded.

![png](media/how-to-create-workspace-in-portal/deployment_succeeded.PNG)

## View a Workspace

To check your newly created workspace, you can click on All service in top left corner of the portal, search and select Machine Learning Workspace. 

![png](media/how-to-create-workspace-in-portal/allservices-search.PNG)

This will display all Machine Learning Workspaces that have been created. You can filter based on subscription, resource groups and locations.  In this example, we can see the MyWorkspace we just created in the previous step.

![png](media/how-to-create-workspace-in-portal/allservices-view_workspace.PNG)

You can select and click on a workspace to display its complete properties.

![png](media/how-to-create-workspace-in-portal/allservices-view_workspace_full.PNG)

## Next steps

For information about machine learning, see Workbench UX documentation.