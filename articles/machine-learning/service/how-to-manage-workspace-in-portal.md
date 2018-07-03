---
title: Manage Azure Machine Learning Workspaces in the Azure Portal
description: Learn how to create, view and delete Azure Machine Learning Workspaces in the Azure portal.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.reviewer: sgilley
ms.author: yahajiza
author: YasinMSFT
ms.date: 04/10/2018
---

# Manage Azure Machine Learning Workspaces in the Azure portal

In this article, you'll manage **Azure Machine Learning Workspaces** in the Azure portal for [Azure Machine Learning Services](overview-what-is-azure-ml.md). 

A workspace is the top-level resource that can be used by one or more users to store their compute resources, models, deployments, and run histories. For your convenience, the following resources are added automatically to your workspace when regionally available: [Azure Container Registry](https://azure.microsoft.com/en-us/services/container-registry/), [Azure storage](https://azure.microsoft.com/en-us/services/storage/), [Azure Application Insights](https://azure.microsoft.com/en-us/services/application-insights/), and [Azure Key Vault](https://azure.microsoft.com/en-us/services/key-vault/).

## Prerequisites

To create a workspace, you need an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a workspace 

[!INCLUDE [aml-create-portal](../../../includes/aml-create-in-portal.md)]

## View a workspace

1. In top left corner of the portal, select **All services**. 

   ![all services](media/how-to-manage-workspace-in-portal/allservices.png)

1. In the **All services** filter field, type **Machine Learning Workspace**.  

   ![search for Azure Machine Learning workspace](media/how-to-manage-workspace-in-portal/allservices-search1.png)

1. In the filter results, select **Machine Learning Workspace** to display a list of your workspaces. 

   ![search for Azure Machine Learning workspace](media/how-to-manage-workspace-in-portal/allservices-search.PNG)

1. Look through the list of workspaces found. You can filter based on subscription, resource groups, and locations.  

   ![Azure Machine Learning workspace list](media/how-to-manage-workspace-in-portal/allservices_view_workspace.PNG)

1. Select the workspace you just created to display its properties.

   ![png](media/how-to-manage-workspace-in-portal/allservices_view_workspace_full.PNG)

## Delete a workspace

Use the Delete button at the top of the workspace you wish to delete.

  ![png](media/how-to-manage-workspace-in-portal/delete-workspace.png)


## Clean up resources 

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

## Next steps

Follow the full-length tutorial to learn how to use a workspace to build, train, and deploy models with Azure Machine Learning Services.

> [!div class="nextstepaction"]
> [Tutorial: Build, train, and deploy](tutorial-build-train-deploy-with-azure-machine-learning.md)