---
title: "Quickstart: Run notebooks"
titleSuffix: Azure Machine Learning
description: Learn to run Jupyter notebooks in studio, and find sample notebooks to learn more about Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.custom: ignite-2022
ms.topic: quickstart
author: sdgilley
ms.author: sgilley
ms.date: 09/28/2022
adobe-target: true
#Customer intent: As a data scientist, I want to run notebooks and explore sample notebooks in Azure Machine Learning.
---

# Quickstart: Run Jupyter notebooks in studio

Get started with Azure Machine Learning by using Jupyter notebooks to learn more about the Python SDK.

In this quickstart, you'll learn how to run notebooks on a *compute instance* in Azure Machine Learning studio.  A compute instance is an online compute resource that has a development environment already installed and ready to go.  

You'll also learn where to find sample notebooks to help jump-start your path to training and deploying models with Azure Machine Learning.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Run the [Quickstart: Create workspace resources you need to get started with Azure Machine Learning](quickstart-create-resources.md) to create a workspace and a compute instance.

## Create a new notebook

Create a new notebook in studio.

1. Sign into [Azure Machine Learning studio](https://ml.azure.com).
1. Select your workspace, if it isn't already open.
1. On the left, select **Notebooks**.
1. Select **Create new file**.
    
    :::image type="content" source="media/quickstart-run-notebooks/create-new-file.png" alt-text="Screenshot: create a new notebook file.":::

1. Name your new notebook **my-new-notebook.ipynb**.


## Create a markdown cell

1. On the upper right of each notebook cell is a toolbar of actions you can use for that cell.  Select the **Convert to markdown cell** tool to change the cell to markdown.

    :::image type="content" source="media/quickstart-run-notebooks/convert-to-markdown.png" alt-text="Screenshot: Convert to markdown.":::

1. Double-click on the cell to open it.
1. Inside the cell, type:

    ```markdown
    # Testing a new notebook
    Use markdown cells to add nicely formatted content to the notebook.
    ```

## Create a code cell

1. Just below the cell, select **+ Code** to create a new code cell.
1. Inside this cell, add:

    ```python
    print("Hello, world!")
    ```

## Run the code

1. If you stopped your compute instance at the end of the [Quickstart: Create workspace resources you need to get started with Azure Machine Learning](quickstart-create-resources.md), start it again now:

    :::image type="content" source="media/quickstart-run-notebooks/start-compute.png" alt-text="Screenshot: Start a compute instance.":::

1.  Wait until the compute instance is "Running".  When it is running, the **Compute instance** dot is green.  You can also see the status after the compute instance name.  You may have to select the arrow to see the full name.

    :::image type="content" source="media/quickstart-run-notebooks/compute-running.png" alt-text="Screenshot: Compute is running.":::

1. You can run code cells either by using **Shift + Enter**, or by selecting the **Run cell** tool to the right of the cell.  Use one of these methods to run the cell now.

    :::image type="content" source="media/quickstart-run-notebooks/run-cell.png" alt-text="Screenshot: run cell tool.":::

1. The brackets to the left of the cell now have a number inside.  The number represents the order in which cells were run.  Since this is the first cell you've run, you'll see `[1]` next to the cell.  You also see the output of the cell, `Hello, world!`.

1. Run the cell again.  You'll see the same output (since you didn't change the code), but now the brackets contain `[2]`. As your notebook gets larger, these numbers help you understand what code was run, and in what order.

## Run a second code cell

1. Add a second code cell:

    ```python
    two = 1 + 1
    print("One plus one is ",two)
    ```

1. Run the new cell.  
1. Your notebook now looks like:

    :::image type="content" source="media/quickstart-run-notebooks/notebook.png" alt-text="Screenshot: Notebook contents.":::

## See your variables

Use the **Variable explorer** to see the variables that are defined in your session.  

1. Select the **"..."** in the notebook toolbar.
1. Select **Variable explorer**.
    
    :::image type="content" source="media/quickstart-run-notebooks/variable-explorer.png" alt-text="Screenshot: Variable explorer tool.":::":::

    The explorer appears at the bottom.  You currently have one variable, `two`, assigned.

1. Add another code cell:

    ```python
    three = 1+two
    ```

1. Run this cell to see the variable `three` appear in the variable explorer.

## Learn from sample notebooks

There are sample notebooks available in studio to help you learn more about Azure Machine Learning.  To find these samples:

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

### Delete all resources

[!INCLUDE [aml-delete-resource-group](../../includes/aml-delete-resource-group.md)]

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Azure Machine Learning in a day](tutorial-azure-ml-in-a-day.md)
>
