---
title: "Tutorial: Model development on a cloud workstation"
titleSuffix: Azure Machine Learning
description: Learn how to get started prototyping and developing machine learning models on an Azure Machine Learning cloud workstation. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: lebaro-msft
ms.author: lebaro
ms.reviewer: sgilley
ms.date: 03/13/2023
#Customer intent: As a data scientist, I want to know how to prototype and develop machine learning models on a cloud workstation.
---

# Tutorial: Model development on a cloud workstation

Learn how to develop a training script with a notebook on an Azure Machine Learning cloud workstation. This tutorial covers the basics you need to get started:

> [!div class="checklist"]
> * Set up and configuring the cloud workstation. Your cloud workstation is powered by an Azure Machine Learning compute instance, which is pre-configured with environments to support your various model development needs.
> * Use cloud-based development environments.
> * Use MLflow to track your model metrics, all from within a notebook.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Machine Learning workspace. See [Create resources to get started](quickstart-create-resources.md) for information on how to create one.


## Start with Notebooks

The Notebooks section in your workspace is a good place to start learning about Azure Machine Learning and its capabilities.  Here you can connect to compute resources, work with a terminal, and edit and run Jupyter Notebooks and scripts.  

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com).
1. Select your workspace if it isn't already open.
1. On the left navigation, select **Notebooks**.

## Set up a new environment for prototyping (optional)

In order for your script to run, you need to be working in an environment configured with the dependencies and libraries the code expects. This section helps you create an environment tailored to your code. To create the new Jupyter kernel your notebook connects to, you'll use a YAML file that defines the dependencies.

> [!TIP]
> The code in this tutorial works in the default kernel the notebook connects to. You'll find that the pre-configured kernels often have what you need for your machine learning tasks. If you prefer not to create a new kernel, skip to [Create a notebook](#create-a-notebook).

* **Upload a file.**

    Files you upload are stored in an Azure file share, and these files are mounted to each compute instance and shared within the workspace.

    1. Download this conda environment file, [*workstation_env.yml*](https://azuremlexampledata.blob.core.windows.net/datasets/workstation_env.yml) to your computer.
    1. Select **+** and select **Upload files** to upload it to your workspace.
    1. Select **Browse and select file(s)**.
    1. Select **workstation_env.yml** file you just downloaded.
    1. Select **Upload**.

    You'll see the *workstation_env.yml* file under your username folder in the **Files** tab. Select this file to preview it, and see what dependencies it specifies.

    :::image type="content" source="media/tutorial-cloud-workstation/view-yml.png" alt-text="Screenshot shows the yml file that you uploaded.":::


* **Create a kernel.**

    Now use the Azure Machine Learning terminal to create a new Jupyter kernel, based on the *workstation_env.yml* file.

    1. Select **Terminal** to open a terminal window.  You can also open the terminal from the left command bar:

        :::image type="content" source="media/tutorial-cloud-workstation/open-terminal.png" alt-text="Screenshot shows open terminal tool in notebook toolbar.":::

    1. Start your compute instance it if it's not already running.

    1. Once the compute is running, you see a welcome message in the terminal, and you can start typing commands. 
    1. View your current conda environments. The active environment is marked with a *.

        ```bash
        conda env list
        ```

    1. If you created a subfolder for this tutorial, `cd` to that folder now.

    1. Create the environment based on the conda file provided. It takes a few minutes to build this environment.

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

    1. Create a new Jupyter kernel based on your active environment.

        ```bash
        python -m ipykernel install --user --name workstation_env --display-name "Tutorial Workstation Env" 
        ```

    1. Close the terminal window.

You now have a new kernel.  Next you'll open a notebook and use this kernel.

## Create a notebook

1. Select **+ Files**, and choose **Create new file**.

    :::image type="content" source="media/tutorial-cloud-workstation/create-new-file.png" alt-text="Screenshot: Create new file.":::

1. Name your new notebook **develop-tutorial.ipynb** (or enter your preferred name).

1. You'll see the notebook connect to the default kernel in the top right. If you created the new **Tutorial Workstation Env** kernel, switch to it now.

## Develop a training script

In this section you develop a Python training script that predicts credit card default payments, using the prepared test and training datasets from the [UCI dataset](https://archive.ics.uci.edu/ml/datasets/default+of+credit+card+clients).

This code uses `sklearn` for training and MLflow for logging the metrics.

1. Start with code that imports the packages and libraries you'll use in the training script.

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

1. Next, load and process the data for this experiment. In this tutorial, you read the data from a file on the internet.

    ```python
    # load the data
    credit_df = pd.read_csv('https://azuremlexamples.blob.core.windows.net/datasets/credit_card/default_of_credit_card_clients.csv', header=1, index_col=0)
    
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

1. Add code to start autologging with `MLflow`, so that you can track the metrics and results. With the iterative nature of model development, `MLflow` helps you log model parameters and results.  Refer back to those runs to compare and understand how your model performs. The logs also provide context for when you're ready to move from the development phase to the training phase of your workflows within Azure Machine Learning.

    ```python
    # set name for logging
    mlflow.set_experiment("Develop on cloud tutorial")
    # enable autologging with MLflow
    mlflow.sklearn.autolog()

    ```

1. Train a model.

    ```python
    # Train with Gradient Boosting Classifier
    print(f"Training with data of shape {X_train.shape}")
    
    mlflow.start_run()
    clf = GradientBoostingClassifier(
        n_estimators=100, learning_rate=0.1
    )
    clf.fit(X_train, y_train)
    
    y_pred = clf.predict(X_test)
    
    print(classification_report(y_test, y_pred))
    # Stop logging for this model
    mlflow.end_run()
    ```

## Iterate 

Now that you have model results, you may want to change something and try again.  For example, try a different classifier technique:

```python
# Train  with AdaBoost Classifier
from sklearn.ensemble import AdaBoostClassifier

print(f"Training with data of shape {X_train.shape}")

mlflow.start_run()
ada = AdaBoostClassifier()

ada.fit(X_train, y_train)

y_pred = ada.predict(X_test)

print(classification_report(y_test, y_pred))
# Stop logging for this model
mlflow.end_run()
```

## Examine results

Now that you've tried two different models, use the results tracked by `MLFfow` to decide which model is better. You can reference metrics like accuracy, or other indicators that matter most for your scenarios. You can dive into these results in more detail by looking at the jobs created by `MLflow`.

1. On the left navigation, select **Jobs**.

    :::image type="content" source="media/tutorial-cloud-workstation/jobs.png" alt-text="Screenshot shows how to select Jobs in the navigation.":::

1. Select the link for **Develop on cloud tutorial**.
1. There are two different jobs shown, one for each of the models you tried.  These names are auto-generated.  As you hover over a name, use the pencil tool next to the name if you want to rename it.  
1. Select the link for the first job. The name appears at the top. You can also rename it here with the pencil tool.
1. The page shows details of the job, such as properties, outputs, tags, and parameters.  Under **Tags**, you'll see the estimator_name, which describes the type of model.

1. Select the **Metrics** tab to view the metrics that were logged by `MLflow`. (Expect your results to differ, as you have a different training set.)

    :::image type="content" source="media/tutorial-cloud-workstation/metrics.png" alt-text="Screenshot shows metrics for a job.":::

1. Select the **Images** tab to view the images generated by `MLflow`.  

    :::image type="content" source="media/tutorial-cloud-workstation/images.png" alt-text="Screenshot shows images for a job.":::

1. Go back and review the metrics and images for the other model.

## Create a Python script

Now create a Python script from your notebook for model training.

1. On the notebook toolbar, select the menu.
1. Select **Export as> Python**.

    :::image type="content" source="media/tutorial-cloud-workstation/export-python-file.png" alt-text="Screenshot shows exporting a Python file from the notebook.":::

1. Name the file **train.py**.
1. Look through this file and delete the code you don't want in the training script.  For example, keep the code for the model you wish to use, and delete code for the model you don't want.  
    * Make sure you keep the code that starts autologging (`mlflow.sklearn.autolog()`).
    * You may wish to delete the auto-generated comments and add in more of your own comments.
    * When you run the Python script interactively (in a terminal or notebook), you can keep the line that defines the experiment name (`mlflow.set_experiment("Develop on cloud tutorial")`). Or even give it a different name to see it as a different entry in the **Jobs** section. But when you prepare the script for a training job, that line will not work and should be omitted - the job definition will include the experiment name.
    * When running a single model, the lines to start and end a run (`mlflow.start_run()` and `mlflow.end_run()`) are also not necessary (they will have no effect), but can be left in if you wish.

1. When you're finished with your edits, save the file.

You now have a Python script to use for training your preferred model.  

## Run the Python script

For now, you're running this code on your compute instance, which is your Azure Machine Learning development environment. Later tutorials show you how to run a training script in a more scalable way on more powerful compute resources.  

1. On the left, select **Open terminal** to open a terminal window, just as you did earlier in this tutorial.
1. View your current conda environments. The active environment is marked with a *.

    ```bash
    conda env list
    ```

1. If you created a new kernel, activate it now:

    ```bash
    conda activate workstation_env
    ```

1. If you created a subfolder for this tutorial, `cd` to that folder now.
1. Run your training script.

    ```bash
    python train.py
    ```

## Examine script results

Go back to **Jobs** to see the results of your training script. Keep in mind that the training data changes with each split, so the results differ between runs as well.

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
> [Train a model](tutorial-train-model.md)
>
