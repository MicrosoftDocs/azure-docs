---
title: "Quickstart: Create workspace resources"
titleSuffix: Azure Machine Learning
description: Create an Azure Machine Learning workspace and cloud resources that can be used to train machine learning models.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: quickstart
author: sdgilley
ms.author: sgilley
ms.reviewer: sgilley
ms.date: 08/26/2022
adobe-target: true
ms.custom: FY21Q4-aml-seo-hack, contperf-fy21q4, mode-other, ignite-2022
#Customer intent: As a data scientist, I want to create a workspace so that I can start to use Azure Machine Learning.
---

# Quickstart: Create workspace resources you need to get started with Azure Machine Learning

In this quickstart, you'll create a workspace and then add compute resources to the workspace. You'll then have everything you need to get started with Azure Machine Learning.  

The workspace is the top-level resource for your machine learning activities, providing a centralized place to view and manage the artifacts you create when you use Azure Machine Learning. The compute resources provide a pre-configured cloud-based environment you can use to train, deploy, automate, manage, and track machine learning models.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create the workspace

If you  already have a workspace, skip this section and continue to [Create a new notebook](#create-a-new-notebook).

If you don't yet have a workspace, create one now: 
1. Sign in to [Azure Machine Learning studio](https://ml.azure.com)
1. Select **Create workspace**
1. Provide the following information to configure your new workspace:

   Field|Description 
   ---|---
   Workspace name |Enter a unique name that identifies your workspace. Names must be unique across the resource group. Use a name that's easy to recall and to differentiate from workspaces created by others. The workspace name is case-insensitive.
   Subscription |Select the Azure subscription that you want to use.
   Resource group | Use an existing resource group in your subscription or enter a name to create a new resource group. A resource group holds related resources for an Azure solution. You need *contributor* or *owner* role to use an existing resource group.  For more information about access, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).
   Region | Select the Azure region closest to your users and the data resources to create your workspace.
1. Select **Create** to create the workspace

> [!NOTE]
> This creates a workspace along with all required resources. If you would like to reuse resources, such as Storage Account, Azure Container Registry, Azure KeyVault, or Application Insights, use the [Azure portal](https://ms.portal.azure.com/#create/Microsoft.MachineLearningServices) instead.

## Create a new notebook

A Jupyter notebook is a good place to start learning about Azure Machine Learning and its capabilities.  Notebook support is built in to your workspace.  Sample notebooks are also included in the workspace, to give you examples that you can modify for your own needs.  

After your workspace is ready, create a new notebook:

1. On the left, select **Notebooks**.
1. Select **Create new file**.
    
    :::image type="content" source="media/quickstart-run-notebooks/create-new-file.png" alt-text="Screenshot: create a new notebook file.":::

1. Name your new notebook **my-new-notebook.ipynb**.
 
    > [!TIP]
    > Make sure you keep the `.ipynb` extension in the name.

1. Create a new cell with code:

    ```python
    print("Hello, world")
    ```

You didn't need any type of compute resource to edit a notebook.  But you will need one to actually run the code.  A *compute instance* is your cloud development environment, attached to your workspace.  

Create a compute instance now.  You'll also use this as your development environment for the rest of the tutorials and quickstarts, as well as for your own development work.

1. On the toolbar above the notebook, select the **+** to create the compute.

    :::image type="content" source="media/quickstart-create-resources/create-compute-instance.png" alt-text="Screenshot: Create a compute instance.":::
1. Use the default required settings filled in on the form, or change any that you wish.
1. Select **Create** at the bottom.
1. Wait until the dot next to the **Compute instance** turns green, and the tooltip says "Compute Running".

    :::image type="content" source="media/quickstart-create-resources/compute-running.png" alt-text="Screenshot: Compute instance is running."::: 

1. If you see an alert to authenticate, select **Authenticate**.
1. Now run the code cell, either by using **Shift + Enter** or by selecting the **Run cell** tool to the right of the cell. 

1. The brackets to the left of the cell now show you a number inside.  The number represents the order in which cells were run.  Since this is the first cell you've run, you'll see `[1]` next to the cell.  You also see the output of the cell, `Hello, world!`.

1. Run the cell again.  You'll see the same output (since you didn't change the code), but now the brackets contain `[2]`. As your notebook gets larger, these numbers help you understand what code was run, and in what order.
1. Create new code cell with the following code:

    ```python
    one = 1
    two = 2
    hello = 'Hello, world'
    ```
1. Run the new cell.  You'll see the bracket change to `[3]`.  There is no output produced from this cell.

## See your variables

Use the **Variable explorer** to see the variables that are defined in your session.  

1. Select the **"..."** in the notebook toolbar.
1. Select **Variable explorer**.
    
    :::image type="content" source="media/quickstart-run-notebooks/variable-explorer.png" alt-text="Screenshot: Variable explorer tool.":::":::

    The explorer appears at the bottom.  You'll see your current variables, `one`, `two`, and `hello`.  The variable explorer is tool that will help you understand the current state of variables in your notebook session.

## Learn from sample notebooks

Use the sample notebooks available in studio to help you learn about how to train ad deploy models.  To find these samples:

1. Still in the **Notebooks** section, select **Samples** at the top.

    :::image type="content" source="media/quickstart-run-notebooks/samples.png" alt-text="Screenshot: Sample notebooks.":::

1. The **SDK v1** folder can be used with the previous, v1 version of the SDK. If you're just starting, you won't need these samples.
1. Use notebooks in the **SDK v2** folder for examples that show the current version of the SDK, v2.
1. Select the notebook **SDK v2/tutorials/azureml-in-a-day/azureml-in-a-day.ipynb**.  You'll see a read-only version of the notebook.  
1. To get your own copy, you can select **Clone this notebook**.  This action will also copy the rest of the folder's content for that notebook.  No need to do that now, though, as you're going to instead clone the whole folder.

## Clone tutorials folder

You can also clone an entire folder.  The **tutorials** folder is a good place to start learning more about how Azure Machine Learning works.

1. Open the **SDK v2** folder.
1. Select the **"..."** at the right of **tutorials** folder to get the menu, then select **Clone**.
    
    :::image type="content" source="media/quickstart-run-notebooks/clone-folder.png" alt-text="Screenshot: clone v2 tutorials folder.":::

1. Your new folder is now displayed in the **Files** section.  
1. Run the notebooks in this folder to learn more about using the Python SDK v2 to train and deploy models.

## Clean up resources

If you plan to continue now to the next tutorial, skip to [Next steps](#next-steps).

### Stop compute instance

If you're not going to use it now, stop the compute instance:

1. In the studio, on the left, select **Compute**.
1. In the top tabs, select **Compute instances**
1. Select the compute instance in the list.
1. On the top toolbar, select **Stop**.

### Delete all resources

[!INCLUDE [aml-delete-resource-group](../../includes/aml-delete-resource-group.md)]

## Next steps

You now have an Azure Machine Learning workspace, and a compute instance to use as your cloud workstation. 

Use these resources with the following tutorials to learn more about Azure Machine Learning and train a model with Python scripts.

|Tutorial  |Description  |
|---------|---------|
| [Azure Machine Learning in a day](tutorial-azure-ml-in-a-day.md)     |  Basic end-to-end train and deploy a model      |
| [Set up your cloud workstation]()      |  Upload files, install packages, run code     |
| [Access and explore your data]()     |  Store data in the cloud and retrieve it from notebooks and scripts |
| [Train a model]()   |    Dive in to the details of training a model     |
| [Deploy a model]()  |   Dive in to the details of deploying a model      |

Start with the basic end-to-end workflow:

> [!div class="nextstepaction"]
> [Tutorial: Azure Machine Learning in a day](tutorial-azure-ml-in-a-day.md)
>
