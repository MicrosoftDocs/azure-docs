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
# Use the Azure Portal to create an Azure Machine Learning Workspace

Azure Machine Learning Services is an integrated, end-to-end data science and advanced analytics solution. It helps professional data scientists prepare data, develop experiments, and deploy models at cloud scale.

In this quickstart, you'll get started with Azure Machine Learning Services by creating an Azure Machine Learning Workspace in the Azure portal.

The **Azure Machine Learning Workspace** is the top-level resource that can be used by one or more users to store their compute resources, models, deployments, and run histories. For your convenience, the following resources are added automatically to your workspace when regionally available: [Azure Container Registry](https://docs.microsoft.com/en-us/azure/container-registry/), [Azure storage](https://docs.microsoft.com/en-us/azure/storage/), [Azure Application Insights, and [Azure Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/).

## Prerequisites

To create a workspace, you need an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

Additionally, you must have adequate permissions to create Azure assets such as resource groups, virtual machines, and more.

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

   Field|Suggested&nbsp;value for quickstart|Description
   ---|---|---
   Workspace name |MyWorkspace|Enter a unique name that identifies your workspace. 
   Subscription | _Your subscription_ |Choose the Azure subscription that you want to use. If you have multiple subscriptions, choose the appropriate subscription in which the resource is billed.
   Resource group | _Your resource group_ | Use an existing resource group in your subscription, or enter a name to create a new resource group. In this example, let's use an existing resource group called _Group_. A resource group is a container that holds related resources for an Azure solution. Using Azure CLI, sign into Azure, specify the subscription, and create a resource group.
   Location | _The region closest to your users_ | Choose the location closest to your users and the data resources. This is where the workspace is created.
   

   ![create workspace](media/how-to-create-workspace-in-portal/workspace_create_name.PNG)

1. Select **Create** to begin the creation process.  It can take a few moments to create the workspace. 

   To check on the status of the deployment, select the Notifications icon (bell) on the toolbar.

   When finished, a deployment success message appears.

## View a workspace

1. Check your newly created workspace with the  **All services** link in top left corner of the portal.  

    ![search for workspace](media/how-to-create-workspace-in-portal/allservices-search.PNG)

2. Type **Machine Learning Workspace** in the search field.  Select **Machine Learning Workspace** to view all your Machine Learning Workspaces. You can filter based on subscription, resource groups, and locations.  In this example, you can see the MyWorkspace you created in the previous step.

    ![png](media/how-to-create-workspace-in-portal/allservices_view_workspace.PNG)

3. You can select and click on a workspace to display its complete properties.

![png](media/how-to-create-workspace-in-portal/allservices_view_workspace_full.PNG)

## Clean up resources 

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

## Next steps
You have now created an Azure Machine Learning Workspace.

For a quickstart showing you how to create a project, run a script, and explore the run history of the script, try:
+ [Quickstart: Create a project and get started with Azure Machine Learning Services SDK for Python](quickstart-set-up-in-python.md)
+ [Quickstart: Create a project and get started with Azure Machine Learning Services CLI](quickstart-set-up-in-cli.md)

For a more in-depth experience of this workflow, follow the full-length tutorial that contains detailed steps for building, training, and deploying models with Azure Machine Learning Services. 

> [!div class="nextstepaction"]
> [Tutorial: Build, train, and deploy](tutorial-build-train-deploy-with-azure-machine-learning.md)