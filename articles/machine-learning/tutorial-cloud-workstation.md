---
title: "Model development on a cloud workstation"
titleSuffix: Azure Machine Learning
description: Learn how to get started prototyping and developing machine learning models on an Azure Machine Learning cloud workstation. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: lebaro-msft
ms.author: lebaro
ms.reviewer: sgilley
ms.date: 02/22/2023
#Customer intent: As a data scientist, I want to know how to prototype and develop machine learning models on a cloud workstation.
---

# Model development on a cloud workstation
 
Learn how prototype in a notebook to develop a training script on an Azure Machine Learning cloud workstation. This tutorial covers the basics you'll need to get started:

> [!div class="checklist"]
> * Set up and configuring the cloud workstation. Your cloud workstation is powered by an Azure Machine Learning compute instance, which is pre-configured with environments to support your various model development needs.
> * Use cloud-based development environments.
> * Use MLflow to track your model metrics, all from within the notebook.


## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Machine Learning workspace. See [Create resources to get started](quickstart-create-resources.md) for information on how to create one.
- Download this conda environment file, [*workstation_env.yml*](https://raw.githubusercontent.com/Azure/azureml-examples/new-tutorial-series/tutorials/get-started-notebooks/workstation_env.yml), which you'll use to create a new environment for running a notebook.

## Start with notebooks

A Jupyter Notebook is a good place to start learning about Azure Machine Learning and its capabilities.  Notebook support is built in to your workspace.  

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com).
1. Select your workspace if it isn't already open.
1. On the left navigation, select **Notebooks**.

## Connect to a compute instance

Before you dive into code, you'll need to connect to a compute instance, which is the pre-configured cloud machine that runs your code.

If you don't have a compute instance yet, select **Create compute** on the landing page of **Notebooks**. You can use the default configurations to set it up quickly. It takes a few minutes to start.

If you do have a compute instance, start it if it's not already running.

:::image type="content" source="media/tutorial-cloud-workstation/start-compute.png" alt-text="Screenshot showing the start compute tool in the notebook toolbar":::

## Create a notebook

1. Select **+ Files**, and choose **Create new file**.

    :::image type="content" source="media/tutorial-set-up-workstation/create-new-file.png" alt-text="Screenshot: Create new file.":::

1. Name your new notebook **develop-tutorial.ipynb** (or enter your preferred name).
1. On the top right, observe the kernel dropdown menu. While you can use any of the built-in kernels right away, in this tutorial you're going to create a new kernel to generate an environment that has all the packages and libraries you need.

  
1. Copy and paste the following import code into the first cell of your notebook, _but don't run it yet._

    ```python
    import os
    import argparse
    import pandas as pd
    import mlflow
    import mlflow.sklearn
    from sklearn.ensemble import GradientBoostingClassifier
    from sklearn.metrics import classification_report
    from sklearn.model_selection import train_test_split
    ```

## Set up a new environment for prototyping (optional)

In order for your script to run, you'll need to be working in an environment configured with the dependencies and libraries the code expects. To create the new Jupyter kernel your notebook will connect to, you'll use a YAML file that defines the dependencies.

The code in this tutorial works in the default environment that's on the compute instance. If you wish to skip creating one, skip to [Develop a training script](#develop-a-training-script). Or continue on to learn how to create a new environment, which you might need in the future.

## Upload a file

Upload the yml file you downloaded earlier to your workspace file system. Your files are stored in an Azure file share, and these files are mounted to each compute instance and shared within the workspace.

1. Select **+** and select **Upload files**
2. Select **Browse and select file(s)** 
3. Select **workstation_env.yml** file you downloaded earlier.
4. Select **Upload**

You'll see the *workstation_env.yml* file under your username folder in the **Files** tab. Select this file to preview it, and see what dependencies it specifies.

:::image type="content" source="media/tutorial-cloud-workstation/view-yml.png" alt-text="Screenshot shows the yml file that you uploaded.":::

You may not always need to define a new environment. There are kernels pre-installed on the compute instance, already configured for many common machine learning model development tasks. (In fact, this tutorial works with a pre-installed kernel.  But you're learning how to build your own, since you may need to do that for other jobs.)

## Create a new kernel

Now use the Azure Machine Learning terminal to generate a new kernel, using the *workstation_env.yml* file.

1. On the left, select **Open terminal** to open a terminal window.

    :::image type="content" source="media/tutorial-cloud-workstation/open-terminal.png" alt-text="Screenshot shows open terminal tool in notebook toolbar.":::

1. View your current conda environments. The active environment is marked with a *.

    ```bash
    conda env list
    ```

1. Create the environment based on the conda file provided. It will take a few minutes to build this environment.

    ```bash
    conda env create -f workstation_env.yml

    ```

1. Activate the new environment.

    ```bash
     conda activate workstation_env
    ```

1. Validate the correct environment is active, again looking for the environment marked with a *.

    ```bash
    conda env list
    ```

1. Create a new Jupyter kernel.

    ```bash
    python -m ipykernel install --user --name workstation_env --display-name "Tutorial Workstation Env" 
    ```

1. Close the terminal window.

## Connect notebook to the new kernel

Now that you created the kernel, connect the notebook to this kernel to start running code.

In the top right kernel selector of the notebook, check to see if the new kernel is listed. If it is, select it. If you don't see it, select the refresh button to load the new kernel, and then select it.

## Develop a training script

In this section you'll develop a Python training script that creates a credit card default prediction, using the prepared test and training datasets based on an [UCI dataset]().

This code uses sklearn for training and MLflow for logging the metrics.

1. Run the first cell in the notebook that you created early in the tutorial. This code imports the dependencies that are now installed on your kernel.
1. Add the next code cell to start an MLflow run, so that you can track the metrics and results. With the iterative nature of model development, MLflow helps you log model parameters and results.  Refer back to those runs to compare and understand how your model performs. The logs also provide context when you're ready to move from the development to training phase of your workflows within Azure Machine Learning.

    ```python
    # Start Logging
    mlflow.start_run()
    
    # enable autologging
    mlflow.sklearn.autolog()
    ```

1. Next, load and process the data for this experiment. In this tutorial, you'll read the data from a file on the internet.

    ```python
    # load the data
    credit_df = pd.read_csv('https://azuremlexamples.blob.core.windows.net/datasets/credit_card/default%20of%20credit%20card%20clients.csv', header=1, index_col=0)
    
    # pre-process the data
    mlflow.log_metric("num_samples", credit_df.shape[0])
    mlflow.log_metric("num_features", credit_df.shape[1] - 1)
    
    train_df, test_df = train_test_split(
        credit_df,
        test_size=0.25,
    )
    ```

1. Get the data ready for training:

    ```python
    # Extracting the label column
    y_train = train_df.pop("default payment next month")
    
    # convert the dataframe values to array
    X_train = train_df.values
    
    # Extracting the label column
    y_test = test_df.pop("default payment next month")
    
    # convert the dataframe values to array
    X_test = test_df.values
    ```

1. Train a tree based model.

    ```python
        # Train Gradient Boosting Classifier
    print(f"Training with data of shape {X_train.shape}")
    
    clf = GradientBoostingClassifier(
        n_estimators=100, learning_rate=0.1
    )
    clf.fit(X_train, y_train)
    
    y_pred = clf.predict(X_test)
    
    print(classification_report(y_test, y_pred))
     # Stop Logging for this model
    mlflow.end_run()
    ```

## Iterate 

Now that you have model results, you may want to change something and try again.  For example, try a different classifier technique:

```python
# Train  AdaBoost Classifier
from sklearn.ensemble import AdaBoostClassifier

print(f"Training with data of shape {X_train.shape}")

ada = AdaBoostClassifier()

ada.fit(X_train, y_train)

y_pred = clf.predict(X_test)

print(classification_report(y_test, y_pred))
    # Stop Logging for this model
mlflow.end_run()
```

## Prepare notebook

Once you like the model code, you're ready to create a Python script from the notebook.  But first, you want to gather together only the cells that are useful for creating your preferred model.  You can look through the notebook and delete cells you don't want in your training script.  Or, you could use the **Gather** function in notebooks to create a new notebook for you with just the cells that you need.  

Use these steps to gather just the cells that you need:

1. Click on the cell that contains the model you wish to use.  For this tutorial, let's use the second model you created.
1. On the toolbar that appears on the right at the top of the cell, select the **Gather tool** :::image type="icon" source="media/tutorial-cloud-workstation/gather-tool.png" border="false":::.
1. On the **Create new Gather file** form, shorten the file name to **train**.
1. Select **Create**.

The new gathered notebook opens.  This notebook contains only cells needed to run the selected model cell.  Notice the other model cell doesn't appear here.  If you've done other things in the notebook, such as exploring and visualizing data, those cells wouldn't appear here either.

## Create a Python script

Now use your new gathered notebook to create a Python script for training your model.

1. On the notebook toolbar, select the menu.
1. Select **Export as> Python file**.

    :::image type="content" source="media/tutorial-cloud-workstation/export-python-file.png" alt-text="Screenshot shows exporting a Python file from the notebook.":::

You now have a Python script to use for training.  You may wish to add in some comments to this file.

## Run the Python script

For now, you're running this code *locally* - that is, on the same computer where the code exists.  Later tutorials will show you how to run a training script in a more scalable way on more powerful compute resources.  

1. On the left, select **Open terminal** to open a terminal window, just as you did earlier in this tutorial.
1. Activate your kernel:

    ```bash
    conda activate workstation_env
    ```

1. If you created a sub-folder for this tutorial, `cd` to that folder now.
1. Run your training script.

    ```bash
    python train.py
    ```

## Clean up resources

If you plan to continue now to other tutorials, skip to [Next steps](#next-steps).

### Stop compute instance

If you're not going to use it now, stop the compute instance:

1. In the studio, in the left navigation area, select **Compute**.
1. In the top tabs, select **Compute instances**
1. Select the compute instance in the list.
1. On the top toolbar, select **Stop**.

### Delete all resources

[!INCLUDE [aml-delete-resource-group](../../includes/aml-delete-resource-group.md)]

## Next steps

Learn more about:
* [Using Git with Azure Machine Learning](concept-train-model-git-integration.md)
* [Running Jupyter notebooks in your workspace](how-to-run-jupyter-notebooks.md)
* [Working with a compute instance terminal in your workspace](how-to-access-terminal.md)
* [Manage notebook and terminal sessions](how-to-manage-compute-sessions.md)

This tutorial showed you the early steps of creating a model, prototyping on the same machine where the code resides.  For your production training, learn how to use that training script on more powerful remote compute resources:

> [!div class="nextstepaction"]
> [[Train a model](tutorial-train-model.md)
>
