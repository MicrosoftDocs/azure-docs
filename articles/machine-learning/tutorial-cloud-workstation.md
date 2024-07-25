---
title: "Tutorial: Model development on a cloud workstation"
titleSuffix: Azure Machine Learning
description: Learn how to get started prototyping and developing machine learning models on an Azure Machine Learning cloud workstation. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.custom: devx-track-python
ms.topic: tutorial
author: sdgilley
ms.author: sgilley
ms.reviewer: lebaro
ms.date: 07/25/2024
#Customer intent: As a data scientist, I want to know how to prototype and develop machine learning models on a cloud workstation.
---

# Tutorial: Model development on a cloud workstation

Learn how to develop a training script with a notebook on an Azure Machine Learning cloud workstation. This tutorial covers the basics you need to get started:

> [!div class="checklist"]
> * Set up and configuring the cloud workstation. Your cloud workstation is powered by an Azure Machine Learning compute instance, which is pre-configured with environments to support your various model development needs.
> * Use cloud-based development environments.
> * Use MLflow to track your model metrics, all from within a notebook.

## Prerequisites

[!INCLUDE [workspace](includes/prereq-workspace.md)]

## Start with compute

The **Compute** section in your workspace allows you to create compute resources. A compute instance is a cloud-based workstation fully managed by Azure Machine Learning. This tutorial series uses a compute instance. You can also use it to run your own code, and to develop and test models.

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com).
1. Select your workspace if it isn't already open.
1. On the left navigation, select **Compute**.
1. If you don't have a compute instance, you'll see **New** in the middle of the screen. Select **New** and fill out the form. You can use all the defaults.
1. If you have a compute instance, select it from the list. If it's stopped, select **Start**.

## Open Visual Studio Code (VS Code)

Once you have a running compute instance, you can access it in various ways. This tutorial shows using the compute instance from VS Code. VS Code gives you a full integrated development environment (IDE) with the power of Azure Machine Learning resources.

In the compute instance list, select the **VS Code (Web)** or **VS Code (Desktop)** link for the compute instance you want to use. If you choose **VS Code (Desktop)**, you might see a pop-up asking if you want to open the application.

:::image type="content" source="media/tutorial-cloud-workstation/launch-vs-code.png" alt-text="Screenshot shows links to launch VS Code (Web) or (Desktop).":::

This VS Code instance is attached to your compute instance and your workspace file system. Even if you open it on your desktop, the files you see are files in your workspace.

## Set up a new environment for prototyping (optional)

In order for your script to run, you need to be working in an environment configured with the dependencies and libraries the code expects. This section helps you create an environment tailored to your code. To create the new Jupyter kernel your notebook connects to, you'll use a YAML file that defines the dependencies.

* **Upload a file.**

    Files you upload are stored in an Azure file share, and these files are mounted to each compute instance and shared within the workspace.

    1. Download this conda environment file, [*workstation_env.yml*](https://github.com/Azure/azureml-examples/blob/main/tutorials/get-started-notebooks/workstation_env.yml) to your computer by using the **Download raw file** button at the top right.
    1. Drag the file from your computer to the VS Code window. The file is uploaded to your workspace.
    1. Move the file under your username folder.

        :::image type="content" source="media/tutorial-cloud-workstation/upload-file.png" alt-text="Screenshot shows how to upload a file.":::

    1. Select this file to preview it, and see what dependencies it specifies. You'll see contents like this:

    ::: code language="yml" source="~/azureml-examples-main/tutorials/get-started-notebooks/workstation_env.yml" :::

* **Create a kernel.**

    Now use the terminal to create a new Jupyter kernel, based on the *workstation_env.yml* file.

    1. On the top menu bar, select **Terminal > New Terminal**.

        :::image type="content" source="media/tutorial-cloud-workstation/open-terminal.png" alt-text="Screenshot shows open terminal tool in notebook toolbar.":::

    1. View your current conda environments. The active environment is marked with a *.

        ```bash
        conda env list
        ```

    1. `cd` to the folder where you uploaded the *workstation_env.yml* file. For example, if you uploaded it to your user folder:

        ```bash
        cd Users/myusername
        ```

    1. Make sure the workstation_env.yml is in this folder.

        ```bash
        ls
        ```

    1. Create the environment based on the conda file provided. It takes a few minutes to build this environment.

        ```bash
        conda env create -f workstation_env.yml
        ```

    1. Activate the new environment.

        ```bash
        conda activate workstation_env
        ```

    > [!NOTE]
    > If you see a CommandNotFoundError, follow instructions to run `conda init bash`, close the terminal, and open a new one. Then retry the `conda activate workstation_env` command.

    1. Validate the correct environment is active, again looking for the environment marked with a *.

        ```bash
        conda env list
        ```

    1. Create a new Jupyter kernel based on your active environment.

        ```bash
        python -m ipykernel install --user --name workstation_env --display-name "Tutorial Workstation Env" 
        ```

    1. Close the terminal window.

You now have a new kernel. Next you'll open a notebook and use this kernel.

## Create a notebook

1. On the top menu bar, select **File > New File**.
1. Name your new file **develop-tutorial.ipynb** (or enter your preferred name). Make sure you use the **.ipynb** extension.

    :::image type="content" source="media/tutorial-cloud-workstation/vs-code-new-file.gif" alt-text="Screenshot: Create new file.":::

## Set the kernel

1. On the top right, select **Select kernel**.
1. Select **Azure ML compute instance (computeinstance-name)**.
1. Select the kernel you created, **Tutorial Workstation Env**. If you don't see it, select the **Refresh** tool at the top right.

    :::image type="content" source="media/tutorial-cloud-workstation/select-kernel.gif" alt-text="Screenshot shows selecting the new kernel.":::

## Develop a training script

In this section, you develop a Python training script that predicts credit card default payments, using the prepared test and training datasets from the [UCI dataset](https://archive.ics.uci.edu/ml/datasets/default+of+credit+card+clients).

This code uses `sklearn` for training and MLflow for logging the metrics.

1. Start with code that imports the packages and libraries you'll use in the training script.

    [!notebook-python[] (~/azureml-examples-main/tutorials/get-started-notebooks/cloud-workstation.ipynb?name=import)]

1. Next, load and process the data for this experiment. In this tutorial, you read the data from a file on the internet.

    [!notebook-python[] (~/azureml-examples-main/tutorials/get-started-notebooks/cloud-workstation.ipynb?name=load)]

1. Get the data ready for training:

    [!notebook-python[] (~/azureml-examples-main/tutorials/get-started-notebooks/cloud-workstation.ipynb?name=extract)]

1. Add code to start autologging with `MLflow`, so that you can track the metrics and results. With the iterative nature of model development, `MLflow` helps you log model parameters and results. Refer back to those runs to compare and understand how your model performs. The logs also provide context for when you're ready to move from the development phase to the training phase of your workflows within Azure Machine Learning.

    [!notebook-python[] (~/azureml-examples-main/tutorials/get-started-notebooks/cloud-workstation.ipynb?name=mlflow)]

1. Train a model.

    [!notebook-python[] (~/azureml-examples-main/tutorials/get-started-notebooks/cloud-workstation.ipynb?name=gbt)]

    > [!NOTE]
    > You can ignore the mlflow warnings. You'll still get all the results you need tracked.

## Iterate 

Now that you have model results, you might want to change something and try again. For example, try a different classifier technique:

[!notebook-python[] (~/azureml-examples-main/tutorials/get-started-notebooks/cloud-workstation.ipynb?name=ada)]

> [!NOTE]
> You can ignore the mlflow warnings. You'll still get all the results you need tracked.

## Examine results

Now that you've tried two different models, use the results tracked by `MLFfow` to decide which model is better. You can reference metrics like accuracy, or other indicators that matter most for your scenarios. You can dive into these results in more detail by looking at the jobs created by `MLflow`.

1. Return to your workspace in the [Azure Machine Learning studio](https://ml.azure.com).
1. On the left navigation, select **Jobs**.

    :::image type="content" source="media/tutorial-cloud-workstation/jobs.png" alt-text="Screenshot shows how to select Jobs in the navigation.":::

1. Select the link for **Develop on cloud tutorial**.
1. There are two different jobs shown, one for each of the models you tried. These names are autogenerated. As you hover over a name, use the pencil tool next to the name if you want to rename it. 
1. Select the link for the first job. The name appears at the top. You can also rename it here with the pencil tool.
1. The page shows details of the job, such as properties, outputs, tags, and parameters. Under **Tags**, you'll see the estimator_name, which describes the type of model.

1. Select the **Metrics** tab to view the metrics that were logged by `MLflow`. (Expect your results to differ, as you have a different training set.)

    :::image type="content" source="media/tutorial-cloud-workstation/metrics.png" alt-text="Screenshot shows metrics for a job.":::

1. Select the **Images** tab to view the images generated by `MLflow`. 

    :::image type="content" source="media/tutorial-cloud-workstation/images.png" alt-text="Screenshot shows images for a job.":::

1. Go back and review the metrics and images for the other model.

## Create a Python script

Now create a Python script from your notebook for model training.

1. In your VS Code window, right click on the notebook filename and select **Import Notebook to Script**.

1. Use the menu **File > Save** to save this new script file. Call it **train.py**.
1. Look through this file and delete the code you don't want in the training script. For example, keep the code for the model you wish to use, and delete code for the model you don't want.
    * Make sure you keep the code that starts autologging (`mlflow.sklearn.autolog()`).
    * When you run the Python script interactively (as you're doing here), you can keep the line that defines the experiment name (`mlflow.set_experiment("Develop on cloud tutorial")`). Or even give it a different name to see it as a different entry in the **Jobs** section. But when you prepare the script for a training job, that line doesn't apply and should be omitted - the job definition includes the experiment name.
    * When you train a single model, the lines to start and end a run (`mlflow.start_run()` and `mlflow.end_run()`) are also not necessary (they'll have no effect), but can be left in if you wish.

1. When you're finished with your edits, save the file.

You now have a Python script to use for training your preferred model.

## Run the Python script

For now, you're running this code on your compute instance, which is your Azure Machine Learning development environment. [Tutorial: Train a model](tutorial-train-model.md) shows you how to run a training script in a more scalable way on more powerful compute resources. 

1. Select the environment you created earlier in this tutorial as your Python version (workstations_env). In the lower right corner of the notebook, you'll see the environment name. Select it, then select the environment in the middle of the screen.

    :::image type="content" source="media/tutorial-cloud-workstation/select-python.png" alt-text="Screenshot shows selecting the new environment.":::

1. Now run the Python script. Use the **Run Python File** tool on the top right.

    :::image type="content" source="media/tutorial-cloud-workstation/run-python.png" alt-text="Screenshot shows the Run Python File tool at the top right of the screen.":::

> [!NOTE]
> You can ignore the mlflow warnings. You'll still get all the metric and images from autologging.

## Examine script results

Go back to **Jobs** in your workspace in Azure Machine Learning studio to see the results of your training script. Keep in mind that the training data changes with each split, so the results differ between runs as well.

## Clean up resources

If you plan to continue now to other tutorials, skip to [Next steps](#next-steps).

### Stop compute instance

If you're not going to use it now, stop the compute instance:

1. In the studio, in the left navigation area, select **Compute**.
1. In the top tabs, select **Compute instances**
1. Select the compute instance in the list.
1. On the top toolbar, select **Stop**.

### Delete all resources

[!INCLUDE [aml-delete-resource-group](includes/aml-delete-resource-group.md)]

## Next steps

Learn more about:

* [From artifacts to models in MLflow](concept-mlflow-models.md)
* [Using Git with Azure Machine Learning](concept-train-model-git-integration.md)
* [Running Jupyter notebooks in your workspace](how-to-run-jupyter-notebooks.md)
* [Working with a compute instance terminal in your workspace](how-to-access-terminal.md)
* [Manage notebook and terminal sessions](how-to-manage-compute-sessions.md)

This tutorial showed you the early steps of creating a model, prototyping on the same machine where the code resides. For your production training, learn how to use that training script on more powerful remote compute resources:

> [!div class="nextstepaction"]
> [Train a model](tutorial-train-model.md)
>