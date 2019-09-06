---
title: Create and manage workspaces
titleSuffix: Azure Machine Learning service
description: Learn how to create, view and delete Azure Machine Learning service workspaces in the Azure portal.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual

ms.reviewer: jmartens
ms.author: shipatel
author: shivp950
ms.date: 05/10/2019
ms.custom: seodec18

---

# Create and manage Azure Machine Learning service workspaces in Azure portal

In this article, you'll create, view, and delete [**Azure Machine Learning service workspaces**](concept-workspace.md) in the Azure portal for [Azure Machine Learning service](overview-what-is-azure-ml.md).  The portal is the easiest way to get started with workspaces but as your needs change or requirements for automation increase you can also create and delete workspaces [using the CLI](reference-azure-machine-learning-cli.md), [with Python code](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py) or [via the VS Code extension](how-to-vscode-tools.md#get-started-with-azure-machine-learning).

## Create a workspace

To create a workspace, you need an Azure subscription. If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning service](https://aka.ms/AMLFree) today.

[!INCLUDE [aml-create-portal](../../../includes/aml-create-in-portal.md)]

### Download a configuration file

1. If you will be creating a [Notebook VM](tutorial-1st-experiment-sdk-setup.md#azure), skip this step.

1. If you plan to use code on your local environment that references this workspace, select  **Download config.json** from the **Overview** section of the workspace.  

   ![Download config.json](./media/how-to-manage-workspace/configure.png)
   
   Place the file into  the directory structure with your Python scripts or Jupyter Notebooks. It can be in the same directory, a subdirectory named *.azureml*, or in a parent directory. When you create a Notebook VM, this file is added to the correct directory on the VM for you.


## <a name="view"></a>View a workspace

1. In top left corner of the portal, select **All services**.

1. In the **All services** filter field, type **machine learning service**.  

1. Select **Machine Learning service workspaces**.

   ![Search for Azure Machine Learning service workspace](media/how-to-manage-workspace/all-services.png)

1. Look through the list of workspaces found. You can filter based on subscription, resource groups, and locations.  

1. Select a workspace to display its properties.
   ![Workspace properties](media/how-to-manage-workspace/allservices_view_workspace_full.PNG)

## Delete a workspace

Use the Delete button at the top of the workspace you wish to delete.

  ![Delete button](media/how-to-manage-workspace/delete-workspace.png)

## Clean up resources

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

## Next steps

Follow the full-length tutorial to learn how to use a workspace to build, train, and deploy models with Azure Machine Learning service.

> [!div class="nextstepaction"]
> [Tutorial: Train models](tutorial-train-models-with-aml.md)
