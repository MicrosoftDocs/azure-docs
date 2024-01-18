---
title: Create and manage files in your workspace
titleSuffix: Azure Machine Learning
description: Learn how create and manage files in your workspace in Azure Machine Learning studio.
services: machine-learning
author: fkriti
ms.author: kritifaujdar
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.date: 12/13/2022
#Customer intent: As a data scientist, I want to create and manage the files in my workspace in Azure Machine Learning studio.
---

# How to create and manage files in your workspace

Learn how to create and manage the files in your Azure Machine Learning workspace.  These files are stored in the default workspace storage. Files and folders can be shared with anyone else with read access to the workspace, and can be used from any compute instances in the workspace.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* A Machine Learning workspace. [Create workspace resources](quickstart-create-resources.md).

## Create files

To create a new file in your default folder (`Users > yourname`):

1. Open your workspace in [Azure Machine Learning studio](https://ml.azure.com).
1. On the left side, select **Notebooks**.
1. Select the **+** tool.
1. Select  **Create new file**.

    :::image type="content" source="media/how-to-run-jupyter-notebooks/create-new-file.png" alt-text="Create new file" lightbox="media/how-to-run-jupyter-notebooks/create-new-file.png":::

1. Name the file.
1. Select a file type.
1. Select **Create**.

Notebooks and most text file types display in the preview section.  Most other file types don't have a preview.  

> [!TIP]
> If you don't see the correct preview for a notebook, make sure it has `.ipynb` as its extension.  Hover over the filename in the list to select **...** if you need to rename the file.  

To create a new file in a different folder:

1. Select the "..." at the end of the folder.
1. Select **Create new file**.

> [!IMPORTANT]
> Content in notebooks and scripts can potentially read data from your sessions and access data without your organization in Azure.  Only load files from trusted sources. For more information, see [Secure code best practices](concept-secure-code-best-practice.md#azure-machine-learning-studio-notebooks).

## Customize your file editing experience

In the Azure Machine Learning studio file editor, you can customize your editing experience with Command Palette and relevant keyboard shortcuts. When you invoke the Command Palette, you will see a selectable list of many options to customize your editing experience.

:::image type="content" source="media/how-to-manage-files/command-palette.png" alt-text="Screenshot shows command palette in file editor.":::

To invoke the Command Palette on a file, either use **F1** or right-select anywhere in the editing space and select **Command Palette** from the menu.

For example, choose "Indent using spaces" if you want your editor to auto-indent with spaces instead of tabs. Take a few moments to explore the different options you have in the Command Palette.


## Manage files with Git

[Use a compute instance terminal](how-to-access-terminal.md#git) to clone and manage Git repositories. To integrate Git with your Azure Machine Learning workspace, see  [Git integration for Azure Machine Learning](concept-train-model-git-integration.md).

## Clone samples

Your workspace contains a **Samples** folder with notebooks designed to help you explore the SDK and serve as examples for your own machine learning projects.   Clone these notebooks into your own folder to run and edit them.  

## Share files

Copy and paste the URL to share a file.  Only other users of the workspace can access this URL.  Learn more about [granting access to your workspace](how-to-assign-roles.md).

## Delete a file

You *can't* delete the **Samples** files.  These files are part of the studio and are updated each time a new SDK is published.  

You *can* delete files found in your **Files** section in any of these ways:

* In the studio, select the **...** at the end of a folder or file.  Make sure to use a supported browser (Microsoft Edge, Chrome, or Firefox).
* [Use a terminal](how-to-access-terminal.md) from any compute instance in your workspace. The folder **~/cloudfiles** is mapped to storage on your workspace storage account.
* In either Jupyter or JupyterLab with their tools.

## Next steps

* [Run Jupyter notebooks in your workspace](how-to-run-jupyter-notebooks.md)
* [Access a compute instance terminal in your workspace](how-to-access-terminal.md)