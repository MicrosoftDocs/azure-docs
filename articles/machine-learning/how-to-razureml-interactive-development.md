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

The R language and many popular packages are available on Azure Machine Learning compute instances. You can use also an R Kernel running in a Jupyter notebook. 

Many R users also use RStudio, a popular IDE. You can install RStudio or Posit Workbench in a custom container, but there are limitations with this approach in reading and writing to your Azure Machine Learning workspace.


## Prerequisites

> [!div class="checklist"]
> - If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today
> - An [Azure Machine Learning workspace](quickstart-create-resources.md)

## Access data

You can upload files to your workspace file storage and access them in R.  But for larger files, stored in Azure [_data assets_ or data from _datastores_](concept-data.md), you first need to install a few packages.

This section describes how to use Python and the `reticulate` package to load your data assets and datastores into R from an interactive session. You'll read tabular data as Pandas DataFrames using the [`azureml-fsspec`](https://learn.microsoft.com/en-us/python/api/azure-ai-mlfs/azure.ai.mlfs.spec?view=azure-ml-py) Python package and the `reticulate` R package. 

Use this setup script to install the required packages:

	* `azureml-fsspec` must be **pip installed** in the default conda environment (`azureml_py38` as of this writing) 
	* the R `reticulate` package needs to be at least version 1.26.
	* Do this with the setup script at CI creation time

* The user needs to retrieve the complete AzureML URI for the file to be used in the form of `azureml://subscriptions/<subscription_id>/resourcegroups/<resource_group_name>/workspaces/<workspace_name>/datastores/<datastore_name>/<path/to/file>`
	* This can be done through the CLI 
* The data asset needs to be created in AzureML (via Studio or CLIv2)

	Once the setup script is run on the compute instance and the file URI(s) has been retrieved, loading a tabular file into an R `data.frame` is a four step process:

## Read tabular data from registered _data assets_ or _datastores_
	1. Load `reticulate`
	```
	library(reticulate)
	```
	2. Select the approprate conda environment which has `azureml-fsspec`
	```
	use_condaenv("azureml_py38")
	```
	3. Load `Pandas` in R
	```
	pd <- import("pandas")
	```
	4. Use Pandas read functions to read in the file(s) into the R environment
	```
	r_dataframe <- pd$read_csv(<complete-uri-of-file>)
	```

You have now created a Python virtual environment with the appropriate Python packages to be able to read data.

## Install R packages

There are many R packages pre-installed on the compute instance.

> [!TIP]
> When you create or use a different compute instance, you'll need to again install any packages you've installed.

When you want to install additional packages, you'll need to explicitly state the location and dependencies.

> [!NOTE]
> Since you are installing packages within an R session running in a Jupyter notebook, `dependencies = TRUE` is required, otherwise any dependency will not be automatically installed. The lib location is also required to install in the correct compute instance location.

For example, to install the `tsibble` package:

```r
install.packages("tsibble", 
                 dependencies = TRUE,
                 lib = "/home/azureuser")
```

## Load R libraries

Add `/home/azureuser` to the R library path. You will need to do this to access user installed libraries in every interactive R script.

```r
.libPaths("/home/azureuser")
```

Once the libPath is updated, load libraries as usual

```r
library('tsibble')
```

## Use R in the notebook

Other than the above issues, use R as you would in any other environment, such as your local workstation.  In your notebook, you can read and write to the path where you notebook is stored.

## Known limitations

@@Verify this: 
- Reading a file with `reticulate` only works with tabular data.
- From an interactive R session, you can only write to the workspace file system.
- From an interactive R session, you cannot interact with MLFlow (such as, log model or query registry).


## Next steps

* [How to train R models in Azure Machine Learning](how-to-razureml-train-model.md)