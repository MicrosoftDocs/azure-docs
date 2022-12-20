---
title: "Quickstart: Set up your cloud workstation"
titleSuffix: Azure Machine Learning
description: Upload files, install packages,  and run code on your Azure Machine Learning on a compute instance, your cloud workstation. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: quickstart
author: sdgilley
ms.author: sgilley
ms.reviewer: sgilley
ms.date: 12/19/2022
#Customer intent: As a data scientist, I want to know how to use my cloud workstation to upload my files and run code.
---

# Quickstart: Set up your Azure Machine Learning cloud workstation

In this quickstart, you'll create and work with:

* A *workspace*.  The workspace is the central place to view and manage all the artifacts and resources you create while using Azure Machine Learning.
* A *compute instance*.  The compute instance is your dedicated machine in the cloud, a pre-configured cloud-based environment you can use to train, deploy, automate, manage, and track machine learning models.

Once you've created the workspace and compute, you'll use them to:

* Upload files
* Run a Jupyter notebook
* Run a Python script

Finally, you'll see how to use included sample notebooks to learn more about Azure Machine Learning.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create the workspace

The workspace is the top-level resource for your machine learning activities, providing a centralized place to view and manage the artifacts you create when you use Azure Machine Learning.

If you  already have a workspace, skip this section and continue to [Create a compute instance](#create-a-compute-instance).

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

## Create a compute instance

You'll use a *compute instance* as your online development environment. The compute instance provides a pre-configured cloud-based environment you can use to train, deploy, automate, manage, and track machine learning models.

If you already have a compute instance, skip this section and continue to [Upload files](#upload-files).  

Create a compute instance now.  You'll also use it as your development environment for the rest of the tutorials, and for your own development work.
 
**@@Steps for creating the compute instance with the new experience will go here.**

> [!NOTE]
> If you're here to learn how to create a workspace and compute instance, you now have the resources you need to run other tutorials.  Continue reading to learn more about how to upload files, work with Jupyter notebooks, and run Python scripts.

## Upload files

You'll need to get your own files into the cloud.  For this tutorial, [download this small data file](https://hbiostat.org/data/repo/titanic3.csv) first, so that you can upload it to your workspace file storage.

1. On the left navigation, select **Notebooks**.
1. On the toolbar above the file list, select **+** to add files.
1. Select **Upload files**.

    :::image type="content" source="media/tutorial-set-up-workstation/upload-files.png" alt-text="Screenshot: Upload files":::

1. Browse to select the data file **titanic3.csv** that you just downloaded.
1. Select **Upload**.

You'll see the file open in a tab. Close this tab if you wish.

You might think that you uploaded the data directly to your compute instance, but you didn't. You instead uploaded the file to a cloud Azure storage container attached to the workspace, which is then mounted to the compute instance. If you delete the compute instance, all of your files will still be available. If you create multiple compute instances in your workspace, these files will be mounted and visible on each.

Uploading data is fine for small files, but isn't the only way to access data.  You'll learn other ways to deal with data files in other tutorials.

## Run a notebook

A Jupyter notebook is a good place to start learning about Azure Machine Learning and its capabilities.  Notebook support is built in to your workspace.  

1. Still in the **Notebooks** section, again select **+** to add files.
1. select **Create new file**.
    
    :::image type="content" source="media/tutorial-set-up-workstation/create-new-file.png" alt-text="Screenshot: Create new file":::

1. Name your new notebook **visualize-sample-data.ipynb**.
 
    > [!TIP]
    > Make sure you keep the `.ipynb` extension in the name.

1. Add this code to the empty cell:

    ```python
    import pandas as pd

    df = pd.read_csv('titanic3.csv')
    
    df.info()
    ```

1. Now run the code cell, either by using **Shift + Enter** or by selecting the **Run cell** button to the left of the cell. 

1. The brackets to the left of the cell now show you a number inside.  The number represents the order in which cells were run.  Since this is the first cell you've run, you'll see `[1]` next to the cell.  You'll also see output produced by the code, in this case the output from `df.info()`.

### See your variables

Use the **Variable explorer** to see the variables defined in your current notebook context.

1. Select the **"..."** in the notebook toolbar.
1. Select **Variable explorer**.
    
    :::image type="content" source="media/tutorial-set-up-workstation/variable-explorer.png" alt-text="Screenshot: Variable explorer tool.":::

    The explorer appears at the bottom.  You'll see your current variable, `df`.  The variable explorer is tool that will help you understand the current state of variables in your notebook.

### Install packages

The notebook kernel on the compute instance has all the basics for running your code, including the Azure Machine Learning Python SDK.  But it may not contain all the packages you need for your own work.  For example, you'll use the `seaborn` package in this tutorial.

1. Add a new code cell to your notebook to install `seaborn` now:

    ```python
    %pip install seaborn
    ```

    > [!TIP]
    > Always use notebook magic, `%pip install`, to install packages in a Jupyter notebook, which installs the package  on the kernel (the Python environment used by the notebook).

1. Run the cell to install the package.  
1. After the package is installed, change the cell to a comment.  When you rerun the notebook, you don't need to install again.  But if you later run the notebook on a different compute resource or environment, you'll have a reminder of the install that will be needed.

    ```python
    # %pip install seaborn
    ```

### View some plots

1. Use these plots to learn more about the data.  Create a new code cell:

    ```python
    import seaborn as sns
    import matplotlib.pyplot as plt
    
    fig, axs = plt.subplots(ncols=3, figsize=(15,5))
    sns.violinplot(x="survived", y="age", hue="sex", data=df, ax=axs[0])
    sns.pointplot(x="parch", y="survived", hue="sex", data=df, ax=axs[1]) # parch = number of parents/children
    sns.violinplot(x="survived", y="fare", hue="sex", data=df, ax=axs[2]) # ticket cost
    ```

1. Run this cell, which will produce these plots.

    :::image type="content" source="media/tutorial-set-up-workstation/plots.png" alt-text="Display of plots created by the Python code.":::

### Add a markdown cell

Select **+ Markdown** to add a Markdown cell to the notebook.  Use the cell to add some observations from the plot.


```md
## Interpretation guidance:

* violinplot 1: young adult men were less likely to survive than children and elderly, and to a lesser extent, women
* lineplot 1: the fewer parents/grandparents, the higher survival rate
* violinplot 2: the more the ticket cost, the higher the survival rate
```

## Run a Python script

Your compute instance can also be used to run scripts, using a terminal window.  

### Export a Python script

Use the notebook tools to export the notebook as a Python file:

1. On the notebook toolbar, select the menu.
1. Select **Export as> Python file**.
1. Select **Create**.

A new tab opens with the new file, **visualize-sample-data.py**.  

If  you didn't comment out the `%pip install seaborn` cell before, you'll see `get_ipython().run_line_magic('pip', 'install seaborn')` as a line of code.  This code only works in notebooks, so if you have this line, either delete it or comment it out in the script file.

### Run the script

1. From the toolbar above the script, select **Save and run script in terminal**.  

    :::image type="content" source="media/tutorial-set-up-workstation/save-and-run.png" alt-text="Screenshot: Save and run script in terminal.":::
    
    A new tab opens to show the terminal window.  At the top of the window are some helpful links for more information about using tools such as Git and the Azure ML CLI from the terminal.
    
    You'll see that the terminal has run a command for you: `python visualize-sample-data.py`.
    
    Finally you'll see the text output from the execution.

2. Close the terminal tab to terminate the session.


### Save the plot

When you run the script in a terminal, you'll see text output, but not the plots, since plots can't be rendered in the terminal window. 

1. Select the **visualize-sample-data.py** tab to go back to the Python script. 

1. Add the following line to the end of the Python script to save the plot as a file:

    ```python
    plt.savefig("plots.png") #save as png
    ```

1. Now again select **Save and run script in terminal**.

1. In your **Files** section, you'll see the new image file, **plots.png**.  If you don't see the file, select **Refresh** to get the most up-to-date view of your files.  

    :::image type="content" source="media/tutorial-set-up-workstation/refresh.png" alt-text="Screenshot: Refresh to see your new file.":::

1. Select the file **plots.png** to open it in another tab.
1. Close the terminal tab to terminate the session.

## Learn from sample notebooks

Use the sample notebooks available in studio to help you learn about how to train and deploy models.  To find these samples:

Still in the **Notebooks** section, select **Samples** at the top.

    :::image type="content" source="media/quickstart-run-notebooks/samples.png" alt-text="Screenshot: Sample notebooks.":::

* The **SDK v1** folder can be used with the previous, v1 version of the SDK. If you're just starting, you won't need these samples.
* Use notebooks in the **SDK v2** folder for examples that show the current version of the SDK, v2.
* These notebooks are read-only, and are updated periodically.  When you open a notebook, select the **Clone** button at the top to add your copy of the notebook and any associated files into your own files.  

## Clean up resources

If you plan to continue now to the next tutorial, skip to [Next steps](#next-steps).

### Stop compute instance

If you're not going to use it now, stop the compute instance:

1. In the studio, in the left navigation area, select **Compute**.
1. In the top tabs, select **Compute instances**
1. Select the compute instance in the list.
1. On the top toolbar, select **Stop**.

### Delete all resources

[!INCLUDE [aml-delete-resource-group](../../includes/aml-delete-resource-group.md)]

## Next steps

You now have an Azure Machine Learning workspace, and a compute instance to use as your dedicated machine in the cloud.

Use these resources with the following tutorials to train a model with Python scripts.and deploy a model.

|Tutorial  |Description  |
|---------|---------|
| [Azure Machine Learning in a day](tutorial-azure-ml-in-a-day.md)     |  Basic end-to-end train and deploy a model      |
| [Access and explore your data]()     |  Store large data in the cloud and retrieve it from notebooks and scripts |
| [Train a model]()   |    Dive in to the details of training a model     |
| [Deploy a model]()  |   Dive in to the details of deploying a model      |

Start with the basic end-to-end workflow:

> [!div class="nextstepaction"]
> [Tutorial: Azure Machine Learning in a day](tutorial-azure-ml-in-a-day.md)
>
