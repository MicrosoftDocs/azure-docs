---
title: Use R interactively on Azure Machine Learning
titleSuffix: Azure Machine Learning
description: 'Learn how to use Azure Machine Learning for interactive R work'
ms.service: machine-learning
ms.date: 12/21/2022
ms.topic: how-to
author: wahalulu
ms.author: mavaisma
ms.reviewer: sgilley
ms.devlang: r
---

# Interactive R development

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

This article will show you how to use R on a compute instance in Azure Machine Learning studio, running an R kernel in a Jupyter notebook.

Many R users also use RStudio, a popular IDE. You can install RStudio or Posit Workbench in a custom container on a compute instance.  However, there are limitations with the container in reading and writing to your Azure Machine Learning workspace.  

## Prerequisites

- If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today
- An [Azure Machine Learning workspace and a compute instance](quickstart-create-resources.md)
- A basic understand of using Jupyter notebooks in Azure Machine Learning studio.  For more information, see [Quickstart: Run Jupyter notebooks in studio](quickstart-run-notebooks.md)

## Access data

You can upload files to your workspace file storage and access them in R.  But for larger files, stored in Azure [_data assets_ or data from _datastores_](concept-data.md), you first need to install a few packages.

This section describes how to use Python and the `reticulate` package to load your data assets and datastores into R from an interactive session. You'll read tabular data as Pandas DataFrames using the [`azureml-fsspec`](https://learn.microsoft.com/en-us/python/api/azure-ai-mlfs/azure.ai.mlfs.spec?view=azure-ml-py) Python package and the `reticulate` R package. 

To install these packages:

1. Create a new file on the compute instance, called setup.sh.  
1. Copy this code into the file:

    :::code language="bash" source="~/azureml-examples-mavaisma-r-azureml/tutorials/using-r-with-azureml/01-setup-env-for-r-azureml/ci-setup-interactive-r.sh":::

1. Select  **Save and run script in terminal** to run the script

The install script performs the following steps:

* `pip` installs `azureml-fsspec` in the default conda environment for the compute instance
* Installs the R `reticulate` package if necessary (version must be 1.26 or greater)

### Find data file location

For a data asset [created in Azure Machine Learning](how-to-create-data-assets.md?tabs=cli#create-a-uri_file-data-asset)
* Retrieve the complete AzureML URI for the file to be used in the form of `azureml://subscriptions/<subscription_id>/resourcegroups/<resource_group_name>/workspaces/<workspace_name>/datastores/<datastore_name>/<path/to/file>`

### Read tabular data from registered _data assets_ or _datastores_

Once you've run the setup script on your compute instance and you have the file URI(s) for your data, use the following to read a tabular file into an R `data.frame`:

1. Load `reticulate`
    
    ```
    library(reticulate)
    ```

1. Select the conda environment where `azureml-fsspec` was installed

    ```r
    use_condaenv("azureml_py38")
    ```

1. Load `Pandas` in R

    ```r
    pd <- import("pandas")
    ```
1. Specify the fill path to the asset

    ```r
    # uri is of the form azureml://subscriptions/<subscription_id>/resourcegroups/<resource_group_name>/workspaces/<workspace_name>/datastores/<datastore_name>/<path/to/file>. 
	uri = "put-full-uri-here"
	```

1. Use Pandas read functions to read in the file(s) into the R environment

    ```r
    r_dataframe <- pd$read_csv(uri)
    ```

You've now created a Python virtual environment with the appropriate Python packages to be able to read data.

## Install R packages

There are many R packages pre-installed on the compute instance.

> [!TIP]
> When you create or use a different compute instance, you'll need to again install any packages you've installed.

When you want to install other packages, you'll need to explicitly state the location and dependencies.

> [!NOTE]
> Since you are installing packages within an R session running in a Jupyter notebook, `dependencies = TRUE` is required, otherwise any dependency will not be automatically installed. The lib location is also required to install in the correct compute instance location.

For example, to install the `tsibble` package:

```r
install.packages("tsibble", 
                 dependencies = TRUE,
                 lib = "/home/azureuser")
```

## Load R libraries

Add `/home/azureuser` to the R library path. 

```r
.libPaths("/home/azureuser")
```

> [!TIP]
> You need to update the `.libPaths` in each interactive R script to access user installed libraries.  SAdd this code to the top of each interactive R script or notebook.  

Once the libPath is updated, load libraries as usual

```r
library('tsibble')
```

## Use R in the notebook

Other than the above issues, use R as you would in any other environment, such as your local workstation.  In your notebook or script, you can read and write to the path where the notebook/script is stored.

## Known limitations

@@Verify this: 
- Reading a file with `reticulate` only works with tabular data.
- From an interactive R session, you can only write to the workspace file system.
- From an interactive R session, you can't interact with MLFlow (such as, log model or query registry).


## Next steps

* [How to train R models in Azure Machine Learning](how-to-razureml-train-model.md)