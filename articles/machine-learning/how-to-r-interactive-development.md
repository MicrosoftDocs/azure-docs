---
title: Use R interactively on Azure Machine Learning
titleSuffix: Azure Machine Learning
description: 'Learn how to work with R interactively on Azure Machine Learning'
ms.service: machine-learning
ms.subservice: core
ms.date: 06/01/2023
ms.topic: how-to
author: wahalulu
ms.author: mavaisma
ms.reviewer: sgilley
ms.devlang: r
---

# Interactive R development
 
[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

This article shows how to use R on a compute instance in Azure Machine Learning studio, that runs an R kernel in a Jupyter notebook.

The popular RStudio IDE also works. You can install RStudio or Posit Workbench in a custom container on a compute instance.  However, this has limitations in reading and writing to your Azure Machine Learning workspace.  

> [!IMPORTANT]
> The code shown in this article works on an Azure Machine Learning compute instance.  The compute instance has an environment and configuration file necessary for the code to run successfully.  

## Prerequisites

- If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today
- An [Azure Machine Learning workspace and a compute instance](quickstart-create-resources.md)
- A basic understand of using Jupyter notebooks in Azure Machine Learning studio. See [Model development on a cloud workstation](tutorial-cloud-workstation.md) for more information.

## Run R in a notebook in studio

You'll use a notebook in your Azure Machine Learning workspace, on a compute instance.  

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com)
1. Open your workspace if it isn't already open
1. On the left navigation, select **Notebooks**
1. Create a new notebook, named **RunR.ipynb**

    > [!TIP]
    > If you're not sure how to create and work with notebooks in studio, review [Run Jupyter notebooks in your workspace](how-to-run-jupyter-notebooks.md)

1. Select the notebook.
1. On the notebook toolbar, make sure your compute instance is running.  If not, start it now.
1. On the notebook toolbar, switch the kernel to **R**.

    :::image type="content" source="media/how-to-r-interactive-development/r-kernel.png" alt-text="Screenshot: Switch the notebook kernel to use R." lightbox="media/how-to-r-interactive-development/r-kernel.png":::

Your notebook is now ready to run R commands.

## Access data

You can upload files to your workspace file storage resource, and then access those files in R. However, for files stored in Azure [_data assets_ or data from _datastores_](concept-data.md), you must install some packages.

This section describes how to use Python and the `reticulate` package to load your data assets and datastores into R, from an interactive session. You use the [`azureml-fsspec`](/python/api/azureml-fsspec/?view=azure-ml-py&preserve-view=true) Python package and the `reticulate` R package to read tabular data as Pandas DataFrames. This section also includes an example of reading data assets and datastores into an R `data.frame`.

To install these packages:

1. Create a new file on the compute instance, called **setup.sh**.  
1. Copy this code into the file:

    :::code language="bash" source="~/azureml-examples-mavaisma-r-azureml/tutorials/using-r-with-azureml/01-setup-compute-instance-for-interactive-r/setup-ci-for-interactive-data-reads.sh":::

1. Select  **Save and run script in terminal** to run the script

The install script handles these steps:

* `pip` installs `azureml-fsspec` in the default conda environment for the compute instance
* Installs the R `reticulate` package if necessary (version must be 1.26 or greater)

### Read tabular data from registered data assets or datastores

For data stored in a data asset [created in Azure Machine Learning](how-to-create-data-assets.md#create-a-data-asset-file-type), use these steps to read that tabular file into a Pandas DataFrame or an R `data.frame`:
> [!NOTE]
> Reading a file with `reticulate` only works with tabular data.

1. Ensure you have the correct version of `reticulate`.  For a version less than 1.26, try to use a newer compute instance.

    ```r
    packageVersion("reticulate")
    ```

1. Load `reticulate` and set the conda environment where `azureml-fsspec` was installed

    [!Notebook-r[](~/azureml-examples-mavaisma-r-azureml/tutorials/using-r-with-azureml/02-develop-in-interactive-r/work-with-data-assets.ipynb?name=reticulate)]


1. Find the URI path to the data file.

    1. First, get a handle to your workspace

        [!Notebook-r[](~/azureml-examples-mavaisma-r-azureml/tutorials/using-r-with-azureml/02-develop-in-interactive-r/work-with-data-assets.ipynb?name=configure-ml_client)]
    
    1. Use this code to retrieve the asset. Make sure to replace `<DATA_NAME>` and `<VERSION_NUMBER>` with the name and number of your data asset.

        > [!TIP]
        > In studio, select **Data** in the left navigation to find the name and version number of your data asset.
        
        [!Notebook-r[](~/azureml-examples-mavaisma-r-azureml/tutorials/using-r-with-azureml/02-develop-in-interactive-r/work-with-data-assets.ipynb?name=get-uri)]
    
    1. Run the code to retrieve the URI.

        [!Notebook-r[](~/azureml-examples-mavaisma-r-azureml/tutorials/using-r-with-azureml/02-develop-in-interactive-r/work-with-data-assets.ipynb?name=py_run_string)]
    
1. Use Pandas read functions to read  the file(s) into the R environment

    [!Notebook-r[](~/azureml-examples-mavaisma-r-azureml/tutorials/using-r-with-azureml/02-develop-in-interactive-r/work-with-data-assets.ipynb?name=read-uri)]

You can also use a Datastore URI to access different files on a registered Datastore, and read these resources into an R `data.frame`.

 1. In this format, create a Datastore URI, using your own values:
 
    ```r
    subscription <- '<subscription_id>'
    resource_group <- '<resource_group>'
    workspace <- '<workspace>'
    datastore_name <- '<datastore>'
    path_on_datastore <- '<path>'
    
    uri <- paste0("azureml://subscriptions/", subscription, "/resourcegroups/", resource_group, "/workspaces/", workspace, "/datastores/", datastore_name, "/paths/", path_on_datastore)
    ```
    
    > [!TIP]
    > Instead of remembering the datastore URI format, you can copy-and-paste the datastore URI from the Studio UI, if you know the datastore where your file is located:
    > 1. Navigate to the file/folder you want to read into R
    > 1. Select the elipsis (**...**) next to it. 
    > 1. Select from the menu **Copy URI**. 
    > 1. Select the **Datastore URI** to copy into your notebook/script.
    > Note that you must create a variable for `<path>` in the code.
    > :::image type="content" source="media/how-to-access-data-ci/datastore_uri_copy.png" alt-text="Screenshot highlighting the copy of the datastore URI.":::

 2. Create a filestore object using the aforementioned URI:
   ```r
   fs <- azureml.fsspec$AzureMachineLearningFileSystem(uri, sep = "")
   ```
         
 3. Read into an R `data.frame`:
   ```r
   df <- with(fs$open("<path>)", "r") %as% f, {
    x <- as.character(f$read(), encoding = "utf-8")
    read.csv(textConnection(x), header = TRUE, sep = ",", stringsAsFactors = FALSE)
   })
   print(df)
   ```
    
## Install R packages

A compute instance has many preinstalled R packages.

To install other packages, you must explicitly state the location and dependencies.

> [!TIP]
> When you create or use a different compute instance, you must re-install any packages you've installed.

For example, to install the `tsibble` package:

```r
install.packages("tsibble", 
                 dependencies = TRUE,
                 lib = "/home/azureuser")
```

> [!NOTE]
> If you install packages within an R session that runs in a Jupyter notebook, `dependencies = TRUE` is required. Otherwise, dependent packages will not automatically install. The lib location is also required to install in the correct compute instance location.

## Load R libraries

Add `/home/azureuser` to the R library path.

```r
.libPaths("/home/azureuser")
```

> [!TIP]
> You must update the `.libPaths` in each interactive R script to access user installed libraries. Add this code to the top of each interactive R script or notebook.  

Once the libPath is updated, load libraries as usual.

```r
library('tsibble')
```

## Use R in the notebook

Beyond the issues described earlier, use R as you would in any other environment, including your local workstation. In your notebook or script, you can read and write to the path where the notebook/script is stored.

> [!NOTE]
> - From an interactive R session, you can only write to the workspace file system.
> - From an interactive R session, you cannot interact with MLflow (such as log model or query registry).

## Next steps

* [Adapt your R script to run in production](how-to-r-modify-script-for-production.md)