---
title: "Tutorial: AzureML in a Day"
titleSuffix: Azure Machine Learning
description: Use Azure Machine Learning to train and deploy a model in a cloud-based Python Jupyter Notebook. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: sdgilley
ms.author: sgilley
ms.date: 09/15/2022
ms.custom: sdkv2
#Customer intent: As a professional data scientist, I can build an image classification model with Azure Machine Learning by using Python in a Jupyter Notebook.
---

# Tutorial: Azure Machine Learning in a Day

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

Learn how a data scientist uses Azure Machine Learning (Azure ML) to train a model, then use the model for prediction. This tutorial will help you become familiar with the core concepts of Azure ML and their most common usage.

You will learn how to:

> [!div class="checklist"]
> * Connect to your Azure ML workspace
> * Create and run a training job to create a model
> * View the output of your training script
> * Deploy the newly-trained model as an endpoint
> * Call the Azure ML endpoint for inferencing

## Prerequisites

* Complete the [Quickstart: Get started with Azure Machine Learning](quickstart-create-resources.md) to:
    * Create a workspace.
    * Create a cloud-based compute instance to use for your development environment.

## Clone a notebook folder

You complete the following setup in Azure Machine Learning studio. This consolidated interface includes machine learning tools to perform data science scenarios for data science practitioners of all skill levels.

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com/).

1. Select your subscription and the workspace you created.

1. On the left, select **Notebooks**.

1. At the top, select the **Samples** tab.

1. Open the folder with a version number on it. This number represents the current release for the Python SDK.

1. Select the **...** button at the right of the **tutorials** folder, and then select **Clone**.

    :::image type="content" source="media/tutorial-1st-experiment-sdk-setup/clone-tutorials.png" alt-text="Screenshot that shows the Clone tutorials folder.":::

1. A list of folders shows each user who accesses the workspace. Select your folder to clone the **tutorials**  folder there.

## Open the cloned notebook

1. Open the **tutorials** folder that was cloned into your **User files** section.

    > [!IMPORTANT]
    > You can view notebooks in the **samples** folder but you can't run a notebook from there. To run a notebook, make sure you open the cloned version of the notebook in the **Files** section.
    
1. Select the **quickstart-azureml-in-10mins.ipynb** file from your **tutorials/compute-instance-quickstarts/quickstart-azureml-in-10mins** folder. 

    :::image type="content" source="media/tutorial-train-deploy-notebook/expand-folder.png" alt-text="Screenshot shows the Open tutorials folder.":::

1. On the top bar, select the compute instance you created during the  [Quickstart: Get started with Azure Machine Learning](quickstart-create-resources.md)  to use for running the notebook.


## Run the notebook

This tutorial is also available on [GitHub](linkgoeshere) if you wish to use it on your own [local environment](how-to-configure-environment.md#local). 

> [!Important]
> The rest of this article contains the same content as you see in the notebook.  
>
> Switch to the Jupyter Notebook now if you want to run the code while you read along.
> To run a single code cell in a notebook, click the code cell and hit **Shift+Enter**. Or, run the entire notebook by choosing **Run all** from the top toolbar.

## Connect to the workspace

Before you dive in the code, you'll need to connect to your Azure ML workspace. The workspace is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning.

You'll use DefaultAzureCredential to get access to workspace. DefaultAzureCredential should be capable of handling most Azure SDK authentication scenarios.

> [!IMPORTANT] 
> Creating MLClient will not connect to the workspace. The client initialization is lazy, it will wait for the first time it needs to make a call (in the notebook below, that will happen during compute creation).

## Create a compute resource to run your job

Azure ML needs a compute resource for running a job. It can be single or multi-node machines with Linux or Windows OS, or a specific compute fabric like Spark.

You'll provision a Linux compute cluster. See the full list on VM sizes and prices .

For this example you only need a basic cluster, so you'll use a Standard_DS3_v2 model with 2 vCPU cores, 7 GB RAM and create an Azure ML Compute

<code here>


## What is a command job?

You'll create an Azure ML *command job* to train a model for credit default prediction. The command job is used to run a *training script* in a specified environment on a specified compute resource.

The *training script* handles the data preparation, training and registering the trained model. In this tutorial, you'll create a Python training script.

Command jobs can be run from CLI, Python SDK, or studio interface. In this tutorial, you'll use the Azure ML Python SDK v2 to create and run the command job.

After running the training job, you'll deploy the model, then use it to produce a prediction.

## Resources for the command job

The AzureML command job requires several dependent files. For better understanding of the project structure, all these dependencies are created in the notebook cells. By the end of this tutorial, your project structure will look like:

* azureml-in-a-day (folder)
    * dependencies (folder)
      *  conda.yml
    * deploy (folder)
      *  sample-request.json
   * media (folder)
        * job-overview.jpg
    * src (folder)
        * main.py
    * azureml-in-a-day.ipynb

## Set up the command job resources



## Clean up resources

If you're not going to continue to use this model, delete the Model service using:

```python
# if you want to keep workspace and only delete endpoint (it will incur cost while running)
service.delete()
```

If you want to control cost further, stop the compute instance by selecting the "Stop compute" button next to the **Compute** dropdown.  Then start the compute instance again the next time you need it.

### Delete everything

Use these steps to delete your Azure Machine Learning workspace and all compute resources.

[!INCLUDE [aml-delete-resource-group](../../includes/aml-delete-resource-group.md)]


## Next steps

+ Learn about all of the [deployment options for Azure Machine Learning](how-to-deploy-managed-online-endpoints.md).
+ Learn how to [authenticate to the deployed model](how-to-authenticate-online-endpoint.md).
+ [Make predictions on large quantities of data](./tutorial-pipeline-batch-scoring-classification.md) asynchronously.

