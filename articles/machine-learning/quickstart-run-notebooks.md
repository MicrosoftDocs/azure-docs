---
title: "Quickstart: Run notebooks"
titleSuffix: Azure Machine Learning
description: Create an Azure Machine Learning workspace and cloud resources that can be used to train machine learning models.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: quickstart
author: sdgilley
ms.author: sgilley
ms.date: 09/28/2022
adobe-target: true
#Customer intent: As a data scientist, I want to run notebooks and explore sample notebooks in Azure Machine Learning.
---

# Quickstart: Run Juypter notebook in Azure Machine Learning studio

In this quickstart, you'll run Jupyter notebooks on a *compute instance* in Azure Machine Learning studio.  A compute instance is an online compute resource that has a development environment already installed and ready to go.  You'll use this online machine for your development environment to write and run code in Python scripts and Jupyter notebooks.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Run the [Quickstart: Create workspace resources you need to get started with Azure Machine Learning](quickstart-create-resources.md) to create a workspace and a compute instance.

## Create a new notebook

Create a new notebook in studio.

1. Sign into [Azure Machine Learning studio](https://ml.azure.com)
1. Select your workspace, if it isn't already open
1. On the left, select **Notebooks**
1. Select **Create new file** 
    
    :::image type="content" source="media/quickstart-run-notebooks/create-new-file.png" alt-text="Screenshot: create a new notebook file.":::

1. Name your new notebook **my-new-notebook.ipynb**
1. If you stopped your compute instance at the end of the [Quickstart: Create workspace resources you need to get started with Azure Machine Learning](quickstart-create-resources.md), start it again now:

    :::image type="content" source="media/quickstart-run-notebooks/start-compute.png" alt-text="Screenshot: Start a compute instance.":::

## Create a markdown cell

1. On the upper right of each notebook cell is a toolbar of actions you can use for that cell.  Select the **Convert to markdown cell** tool to change the cell to markdown.

    :::image type="content" source="media/quickstart-run-notebooks/convert-to-markdown.png" alt-text="Screenshot: Convert to markdown":::

1. Double click on the cell to open it.
1. Inside the cell, type the following:

    ```markdown
    # Testing a new notebook
    Use markdown cells to add nicely formatted content to the notebook.
    ```

## Create a code cell

1. Just below the cell, select **+ Code** to create a new code cell.
1. Inside this cell, type the following

    ```python
    print("Hello, world!")
    ```

## Run the code

1. You can run code cells either by using **Shift + Enter**, or by selecting the **Run cell** tool to the right of the cell.  Use one of these methods to run the cell now.

    :::image type="content" source="media/quickstart-run-notebooks/run-cell.png" alt-text="Screenshot: run cell tool.":::

1. The brackets to the left of the cell now have a number inside.  This number represents the order in which cells were run.  Since this is the first cell you've run, you'll see `[1]` next to the cell.  You also see the output of the cell, `Hello, world!`.

1. Run the cell again.  You'll see the same output (since you didn't change the code), but now the brackets contain `[2]`.

## Run a second code cell

1. Add a second code cell with this content:

    ```python
    two = 1 + 1
    print(two)
    ```

1. Run this new cell.  
1. Your notebooks now looks like this:

    :::image type="content" source="media/quickstart-run-notebooks/notebook.png" alt-text="Screenshot: Notebook contents.":::

## Explore sample notebooks

There are sample notebooks available in studio to use so you can learn more about Azure Machine Learning.  To find these samples:

1. Still in the **Notebooks** section, select **Samples** a the top.

    :::image type="content" source="media/quickstart-run-notebooks/samples.png" alt-text="Screenshot: Sample notebooks.":::

1. The **v1** folder can be used with the previous, v1 version of the SDK. 
1. Use notebooks in the **v2** folder for examplesl that show the current version of the SDK, v2.
1. When you select a notebook, you'll see a read-only version of the notebook.  
1. Select **Clone this notebook** to add a copy of it to your files.  This action will also copy the rest of the folder's content for that notebook.
1. You can also clone an entire folder.  Select the **"..."** at the right of a folder to get the menu, then select **Clone**.
1. Clone the **v2/tutorials** folder.  
    
    :::image type="content" source="media/quickstart-run-notebooks/clone-folder.png" alt-text="Screenshot: clone v2 tutorials folder.":::

1. Now go back to **Files** to see the cloned folder in your files.

## Clean up resources

If you plan to continue now to the next tutorial, skip to [Next steps](#next-steps).

### Delete all resources

[!INCLUDE [aml-delete-resource-group](../../includes/aml-delete-resource-group.md)]

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Azure Machine Learning in a day](tutorial-azure-ml-in-a-day.md)
>
