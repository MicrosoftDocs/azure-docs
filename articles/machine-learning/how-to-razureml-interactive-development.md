---
title: Use R interactively on Azure Machine Learning
titleSuffix: Azure Machine Learning
description: 'Learn how to leverage Azure Machine Learning for interactive R work'
ms.service: machine-learning
ms.date: 11/10/2022
ms.topic: how-to
author: wahalulu
ms.author: mavaisma
ms.reviewer: sgilley
ms.devlang: r
---

# Interactive R development

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

This article describes how to install RStudio, use it for interactive `R` development, and read tabular files from Azure Storage.

You can use R in several ways on Azure Machine Learning. The R language and many popular packages are available on Azure Machine Learning Compute instances. You can use also an R Kernel running in a Jupyter notebook. 
Many R users also use RStudio, a popular IDE.

> [!IMPORTANT]
> This article refers to working with R interactive using RStudio, **not** the R Kernel on Jupyter. 

## Prerequisites

> [!div class="checklist"]
> - If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today
> - An [Azure Machine Learning workspace](quickstart-create-resources.md)
> - The proper permissions to create/modify Compute resources
> - A VNET with access to the internet



## Additional setup required for interactive access to data (Data assets and Datastores)

> [!IMPORTANT]
> There is no support for accessing _Data assets_ or data from _Datastores_ interactively from R. This section describes how to use Python and the `reticulate` package to load data into R from an interactive session. This will let you read tabular data as Pandas DataFrames leveraging [`azureml-fsspec`](https://learn.microsoft.com/en-us/python/api/azure-ai-mlfs/azure.ai.mlfs.spec?view=azure-ml-py)

You need to create a Python environment and install `pandas` and `azureml-fsspec`.

1. Start RStudio
1. Load the retuculate package
    ```r
    library(reticulate)
    ```
1. Create a virtual environment
    ```r
    virtualenv_create("interactive-r")

1. Select the environment you just created
    ```r
    use_virtualenv("interactive-r")
    ```
1. Install `pandas` and `azureml-fsspec` with `pip`
    ```r
    py_install(c("pandas", "azureml-fsspec"), pip = TRUE)
    ```

You have now created a Python virtual environment with the appropriate Python packages to be able to read data.

## Read tabular data from _Data assets_ or _Datastores_

> [!IMPORTANT]
> You must have existing data assets or datastores defined.

To read a file

## Work with R

## Next steps

* [How to train R models in Azure Machine Learning](how-to-razureml-train-model.md)