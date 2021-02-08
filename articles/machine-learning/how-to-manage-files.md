---
title: How to create and manage files in your workspace
titleSuffix: Azure Machine Learning
description: Learn how use create and manage files in your workspace in Azure Machine Learning studio.
services: machine-learning
author: abeomor
ms.author: osomorog
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.custom: how-to
ms.date: 02/05/2021
# As a data scientist, I want to create and manage the files in my workspace in Azure Machine Learning studio
---

# How to create and manage files in your workspace

Learn how to create and manage the files in your Azure Machine Learning workspace.  These files are stored in the default workspace storage. Files and folders can be shared with anyone else withe read access to the workspace, and can be used from any compute instances in the workspace.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://aka.ms/AMLFree) before you begin.
* A Machine Learning workspace. See [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).

## <a name="create"></a> Create files

To create a new file in your default folder (Users > yourname):

1. Open your workspace in [Azure Machine Learning studio](https://ml.azure.com).
1. On the left side, select **Notebooks**.
1. Select the  **Create new file** image.

    :::image type="content" source="media/how-to-run-jupyter-notebooks/create-new-file.png" alt-text="Create new file":::

1. Name the file.
1. Select a file type.
1. Select **Create**.

Notebooks and most text file types display in the preview section.  No preview is available for most other file types.

To create a new file in a different folder, select the "..." at the end of the folder, then select **Create new file**.

> [!IMPORTANT]
> Content in notebooks and scripts can potentially read data from your sessions and access data without your organization in Azure.  Only load files from trusted sources. For more information, see [Secure code best practices](concept-secure-code-best-practice.md#azure-ml-studio-notebooks).

### Clone samples

Your workspace contains a **Sample notebooks** folder with notebooks designed to help you explore the SDK and serve as examples for your own machine learning projects.  You can clone these notebooks into your own folder on your workspace storage container.  

For an example, see [Tutorial: Create your first ML experiment](tutorial-1st-experiment-sdk-setup.md#azure).

### Share files

Copy and paste the URL to share a file.  Only other users of the workspace can access this URL.  Learn more about [granting access to your workspace](how-to-assign-roles.md).

## Delete a file

You *can't* delete the **Sample notebooks** files.  These files are part of the studio and are updated each time a new SDK is published.  

You *can* delete files found in your **Files** section in any of these ways:

* In the studio, select the **...** at the end of a folder or file.  Make sure to use a supported browser (Microsoft Edge, Chrome, or Firefox).
* [Use a terminal](how-to-use-terminal.md) from any compute instance in your workspace. The folder **~/cloudfiles** is mapped to storage on your workspace storage account.
* In either Jupyter or JupyterLab with their tools.
