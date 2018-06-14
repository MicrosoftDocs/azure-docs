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
# Use the Azure portal to create an Azure Machine Learning Workspace

Get started using Azure Machine Learning Services by creating an Azure Machine Learning Workspace. In this article, you will create your workspace using the Azure portal.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a Workspace 

1. Sign in to the [Azure portal](https://portal.azure.com/) using the credentials for the Azure subscription you'll use. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now.

   ![Azure portal](./media/how-to-create-workspace-in-portal/portal-dashboard.png)

1. Select the **Create a resource** button (+) in the upper-left corner of the portal.

   ![Create a resource in Azure portal](./media/how-to-create-workspace-in-portal/portal-create-a-resource.png)

1. Enter **Machine Learning** in the search bar. Select the search result named **Machine Learning Workspace**.

    ![search for workspace](media/how-to-create-workspace-in-portal/workspace_create.PNG)

1. In the **Machine Learning Workspace** pane, scroll to the bottom and select **Create** to begin.

    ![create](./media/how-to-create-workspace-in-portal/portal-create-button.png)

1. In the **ML Workspace** pane, configure your workspace. 
    + Name the workspace that will be created. In this example, let's name it _MyWorkspace_.
    + Select a subscription
    + Either create a new resource group or use an existing one. In this example, let's use an existing resource group called _Group_.
    + Select the geographical region where the workspace will be created.

    ![create workspace](media/how-to-create-workspace-in-portal/workspace_create_name.PNG)

1. Select **Create** to begin the creation process.

     It can take a few moments to create the workspace. You can check on the status of the deployment process by clicking the Notifications icon (bell) on the Azure portal toolbar.

    ![deployment in progress](media/how-to-create-workspace-in-portal/deployment_in_progress.PNG)

1.  When this stage is complete, a message will inform you that the deployment has succeeded.

    ![deployment succeeded](media/how-to-create-workspace-in-portal/deployment_succeeded.PNG)

## View a workspace

1. Check your newly created workspace with the  **All service** link in top left corner of the portal.  

    ![search for workspace](media/how-to-create-workspace-in-portal/allservices-search.PNG)

2. Type **Machine Learning Workspace** in the search field.  Select **Machine Learning Workspace** to view all your Machine Learning Workspaces. You can filter based on subscription, resource groups, and locations.  In this example, you can see the MyWorkspace you created in the previous step.

    ![png](media/how-to-create-workspace-in-portal/allservices_view_workspace.PNG)

3. You can select and click on a workspace to display its complete properties.

![png](media/how-to-create-workspace-in-portal/allservices_view_workspace_full.PNG)

## Clean up resources 
[!INCLUDE aml-delete-resource-group]

## Next steps

You can also use the [Quickstart: Create a project and get started with Azure Machine Learning Services SDK for Python]() or the [Quickstart: Create a project and get started with Azure Machine Learning Services CLI]() to create workspaces and projects.