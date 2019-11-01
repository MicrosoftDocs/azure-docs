---
title: Create Azure ML workspaces in the portal
titleSuffix: Azure Machine Learning
description: Learn how to create, view and delete Azure Machine Learning workspaces in the Azure portal.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual

ms.author: sgilley
author: sdgilley
ms.date: 11/04/2019
ms.custom: seodec18

---

# Create and manage Azure Machine Learning workspaces in the Azure portal
[!INCLUDE [applies-to-skus](../../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, you'll create, view, and delete [**Azure Machine Learning workspaces**](concept-workspace.md) in the Azure portal for [Azure Machine Learning](overview-what-is-azure-ml.md).  The portal is the easiest way to get started with workspaces but as your needs change or requirements for automation increase you can also create and delete workspaces [using the CLI](reference-azure-machine-learning-cli.md), [with Python code](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py) or [via the VS Code extension](how-to-vscode-tools.md#get-started-with-azure-machine-learning-for-visual-studio-code).

## Create a workspace

To create a workspace, you need an Azure subscription. If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.

1. Sign in to the [Azure portal](https://portal.azure.com/) by using the credentials for your Azure subscription. 

1. In the upper-left corner of Azure portal, select **+ Create a resource**.

      ![Create a new resource](../../../includes/media/aml-create-in-portal/portal-create-resource.png)

1. Use the search bar to find **Machine Learning service workspace**.

1. Select **Machine Learning service workspace**.

1. In the **Machine Learning service workspace** pane, select **Create** to begin.

1. Provide the following information to configure your new workspace:

   Field|Description 
   ---|---
   Workspace name |Enter a unique name that identifies your workspace. In this example, we use **docs-ws**. Names must be unique across the resource group. Use a name that's easy to recall and to differentiate from workspaces created by others.  
   Subscription |Select the Azure subscription that you want to use.
   Resource group | Use an existing resource group in your subscription or enter a name to create a new resource group. A resource group holds related resources for an Azure solution. In this example, we use **docs-aml**. 
   Location | Select the location closest to your users and the data resources to create your workspace.
   Workspace edition | Select **Basic** or **Enterprise**.  This workspace edition determines the features to which you’ll have access and pricing. Learn more about [Basic and Enterprise edition offerings](overview-what-is-azure-ml.md#sku). 

    ![Configure your workspace](media/how-to-manage-workspace/select-edition.png)

1. After you are finished configuring the workspace, select **Create**. 

   > [!Warning] 
   > It can take several minutes to create your workspace in the cloud.

   When the process is finished, a deployment success message appears. 
 
 1. To view the new workspace, select **Go to resource**.

### Download a configuration file

1. If you will be creating a [Notebook VM](tutorial-1st-experiment-sdk-setup.md#azure), skip this step.

1. If you plan to use code on your local environment that references this workspace, select  **Download config.json** from the **Overview** section of the workspace.  

   ![Download config.json](./media/how-to-manage-workspace/configure.png)
   
   Place the file into  the directory structure with your Python scripts or Jupyter Notebooks. It can be in the same directory, a subdirectory named *.azureml*, or in a parent directory. When you create a Notebook VM, this file is added to the correct directory on the VM for you.

## <a name="upgrade"></a>Upgrade to Enterprise edition

You can upgrade your workspace from Basic edition to Enterprise edition to take advantage of the enhanced features such low-code experiences and enhanced security features.

1. Sign in to [Azure portal](https://portal.azure.com).

1. Select the workspace that you wish to upgrade.

1. Select **Upgrade** either at the top or in the upgrade message.

    ![Upgrade a workspace](media/how-to-manage-workspace/upgrade.png)

1. Select **Confirm Update**.


> [!IMPORTANT]
> You cannot downgrade an Enterprise edition workspace to a Basic edition workspace. 

## <a name="view"></a>Find a workspace

1. In top left corner of the portal, select **All services**.

1. In the **All services** filter field, type **machine learning**.  

1. Select **Azure Machine Learning**.

   ![Search for Azure Machine Learning workspace](media/how-to-manage-workspace/all-services.png)

1. Look through the list of workspaces found. You can filter based on subscription, resource groups, and locations.  

1. Select a workspace to display its properties.
   ![Workspace properties](media/how-to-manage-workspace/allservices_view_workspace_full.PNG)

## Delete a workspace

Use the Delete button at the top of the workspace you wish to delete.

  ![Delete button](media/how-to-manage-workspace/delete-workspace.png)


## Clean up resources

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

## Next steps

Follow the full-length tutorial to learn how to use a workspace to build, train, and deploy models with Azure Machine Learning.

> [!div class="nextstepaction"]
> [Tutorial: Train models](tutorial-train-models-with-aml.md)
