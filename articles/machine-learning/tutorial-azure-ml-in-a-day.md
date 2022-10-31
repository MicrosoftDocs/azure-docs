---
title: "Tutorial: Azure ML in a day"
titleSuffix: Azure Machine Learning
description: Use Azure Machine Learning to train and deploy a model in a cloud-based Python Jupyter Notebook. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: sdgilley
ms.author: sgilley
ms.date: 09/15/2022
ms.custom: sdkv2, ignite-2022
#Customer intent: As a professional data scientist, I want to know how to build and deploy a model with Azure Machine Learning by using Python in a Jupyter Notebook.
---

# Tutorial: Azure Machine Learning in a day

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

Learn how a data scientist uses Azure Machine Learning (Azure ML) to train a model, then use the model for prediction. This tutorial will help you become familiar with the core concepts of Azure ML and their most common usage.

You'll learn how to submit a *command job* to run your *training script* on a specified *compute resource*, configured with the *job environment* necessary to run the script.

The *training script* handles the data preparation, then trains and registers a model. Once you have the model, you'll deploy it as an *endpoint*, then call the endpoint for inferencing.

The steps you'll take are:

> [!div class="checklist"]
> * Connect to your Azure ML workspace
> * Create your compute resource and job environment
> * Create your training script
> * Create and run your command job to run the training script on the compute resource, configured with the appropriate job environment
> * View the output of your training script
> * Deploy the newly-trained model as an endpoint
> * Call the Azure ML endpoint for inferencing


## Prerequisites

* Complete the [Quickstart: Get started with Azure Machine Learning](quickstart-create-resources.md) to:
    * Create a workspace.
    * Create a cloud-based compute instance to use for your development environment.

* Create a new notebook or copy our notebook.
    * Follow the [Quickstart: Run Juypter notebook in Azure Machine Learning studio](quickstart-run-notebooks.md) steps to create a new notebook.
    * Or use the steps in the quickstart to [clone the v2 tutorials folder](quickstart-run-notebooks.md#learn-from-sample-notebooks), then open the notebook from the **tutorials/azureml-in-a-day/azureml-in-a-day.ipynb** folder in your **File** section.

## Run your notebook

On the top bar, select the compute instance you created during the  [Quickstart: Get started with Azure Machine Learning](quickstart-create-resources.md)  to use for running the notebook.

> [!Important]
> The rest of this tutorial contains cells of the tutorial notebook.  Copy/paste them into your new notebook, or switch to the notebook now if you cloned it.
>
> To run a single code cell in a notebook, click the code cell and hit **Shift+Enter**. Or, run the entire notebook by choosing **Run all** from the top toolbar.

## Connect to the workspace

Before you dive in the code, you'll need to connect to your Azure ML workspace. The workspace is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning.

We're using `DefaultAzureCredential` to get access to workspace. 
`DefaultAzureCredential` is used to handle most Azure SDK authentication scenarios. 

[!notebook-python[](~/azureml-examples-main/tutorials/azureml-in-a-day/azureml-in-a-day.ipynb?name=credential)]

In the next cell, enter your Subscription ID, Resource Group name and Workspace name. To find these values:

1. In the upper right Azure Machine Learning studio toolbar, select your workspace name.
1. Copy the value for workspace, resource group and subscription ID into the code.  
1. You'll need to copy one value, close the area and paste, then come back for the next one.


[!notebook-python[](~/azureml-examples-main/tutorials/azureml-in-a-day/azureml-in-a-day.ipynb?name=ml_client)]

The result is a handler to the workspace that you'll use to manage other resources and jobs.

> [!IMPORTANT]
> Creating MLClient will not connect to the workspace. The client initialization is lazy, it will wait for the first time it needs to make a call (in the notebook below, that will happen during compute creation).

## Create a compute resource to run your job

You'll need a compute resource for running a job. It can be single or multi-node machines with Linux or Windows OS, or a specific compute fabric like Spark.

You'll provision a Linux compute cluster. See the [full list on VM sizes and prices](https://azure.microsoft.com/pricing/details/machine-learning/) .

For this example, you only need a basic cluster, so you'll use a Standard_DS3_v2 model with 2 vCPU cores, 7-GB RAM and create an Azure ML Compute.

[!notebook-python[](~/azureml-examples-main/tutorials/azureml-in-a-day/azureml-in-a-day.ipynb?name=cpu_compute_target)]

## Create a job environment

To run your AzureML job on your compute resource, you'll need an [environment](concept-environments.md). An environment lists the software runtime and libraries that you want installed on the compute where you’ll be training. It's similar to your python environment on your local machine.

AzureML provides many curated or ready-made environments, which are useful for common training and inference scenarios. You can also create your own custom environments using a docker image, or a conda configuration.

In this example, you'll create a custom conda environment for your jobs, using a conda yaml file.

First, create a directory to store the file in.

[!notebook-python[](~/azureml-examples-main/tutorials/azureml-in-a-day/azureml-in-a-day.ipynb?name=dependencies_dir)]

Now, create the file in the dependencies directory.

[!notebook-python[](~/azureml-examples-main/tutorials/azureml-in-a-day/azureml-in-a-day.ipynb?name=write_model)]

The specification contains some usual packages, that you'll use in your job (numpy, pip).

Reference this *yaml* file to create and register this custom environment in your workspace:

[!notebook-python[](~/azureml-examples-main/tutorials/azureml-in-a-day/azureml-in-a-day.ipynb?name=custom_env_name)]

## What is a command job?

You'll create an Azure ML *command job* to train a model for credit default prediction. The command job is used to run a *training script* in a specified environment on a specified compute resource.  You've already created the environment and the compute resource.  Next you'll create the training script.

The *training script* handles the data preparation, training and registering of the trained model. In this tutorial, you'll create a Python training script.

Command jobs can be run from CLI, Python SDK, or studio interface. In this tutorial, you'll use the Azure ML Python SDK v2 to create and run the command job.

After running the training job, you'll deploy the model, then use it to produce a prediction.


## Create training script

Let's start by creating the training script - the *main.py* python file.

First create a source folder for the script:

[!notebook-python[](~/azureml-examples-main/tutorials/azureml-in-a-day/azureml-in-a-day.ipynb?name=train_src_dir)]

This script handles the preprocessing of the data, splitting it into test and train data. It then consumes this data to train a tree based model and return the output model. 

[MLFlow](https://mlflow.org/docs/latest/tracking.html) will be used to log the parameters and metrics during our pipeline run.

[!notebook-python[](~/azureml-examples-main/tutorials/azureml-in-a-day/azureml-in-a-day.ipynb?name=write_main)]

As you can see in this script, once the model is trained, the model file is saved and registered to the workspace. Now you can use the registered model in inferencing endpoints.

## Configure the command

Now that you have a script that can perform the desired tasks, you'll use the general purpose **command** that can run command line actions. This command line action can be directly calling system commands or by running a script. 

Here, you'll create input variables to specify the input data, split ratio, learning rate and registered model name.  The command script will:
* Use the compute created earlier to run this command.
* Use the environment created earlier - you can use the `@latest` notation to indicate the latest version of the environment when the command is run.
* Configure some metadata like display name, experiment name etc. An *experiment* is a container for all the iterations you do on a certain project. All the jobs submitted under the same experiment name would be listed next to each other in Azure ML studio.
* Configure the command line action itself - `python main.py` in this case. The inputs/outputs are accessible in the command via the `${{ ... }}` notation.


[!notebook-python[](~/azureml-examples-main/tutorials/azureml-in-a-day/azureml-in-a-day.ipynb?name=registered_model_name)]

## Submit the job 

It's now time to submit the job to run in AzureML. This time you'll use `create_or_update`  on `ml_client.jobs`.


[!notebook-python[](~/azureml-examples-main/tutorials/azureml-in-a-day/azureml-in-a-day.ipynb?name=create_job)]

## View job output and wait for job completion

View the job in AzureML studio by selecting the link in the output of the previous cell.

The output of this job will look like this in the AzureML studio. Explore the tabs for various details like metrics, outputs etc. Once completed, the job will register a model in your workspace as a result of training. 

![Screenshot that shows the job overview](media/tutorial-azure-ml-in-a-day/view-job.gif "Overview of the job.")

> [!IMPORTANT]
> Wait until the status of the job is complete before returning to this notebook to continue. The job will take 2 to 3 minutes to run. It could take longer (up to 10 minutes) if the compute cluster has been scaled down to zero nodes and custom environment is still building.

## Deploy the model as an online endpoint

Now deploy your machine learning model as a web service in the Azure cloud, an [`online endpoint`](concept-endpoints.md).

To deploy a machine learning service, you usually need:

* The model assets (file, metadata) that you want to deploy. You've already registered these assets in your training job.
* Some code to run as a service. The code executes the model on a given input request. This entry script receives data submitted to a deployed web service and passes it to the model, then returns the model's response to the client. The script is specific to your model. The entry script must understand the data that the model expects and returns. With an MLFlow model, as in this tutorial, this script is automatically created for you. Samples of scoring scripts can be found [here](https://github.com/Azure/azureml-examples/tree/sdk-preview/sdk/endpoints/online).


## Create a new online endpoint

Now that you have a registered model and an inference script, it's time to create your online endpoint. The endpoint name needs to be unique in the entire Azure region. For this tutorial, you'll create a unique name using [`UUID`](https://en.wikipedia.org/wiki/Universally_unique_identifier).


[!notebook-python[](~/azureml-examples-main/tutorials/azureml-in-a-day/azureml-in-a-day.ipynb?name=online_endpoint_name)]

> [!NOTE]
> Expect the endpoint creation to take approximately 6 to 8 minutes.

[!notebook-python[](~/azureml-examples-main/tutorials/azureml-in-a-day/azureml-in-a-day.ipynb?name=endpoint)]

Once you've created an endpoint, you can retrieve it as below:

[!notebook-python[](~/azureml-examples-main/tutorials/azureml-in-a-day/azureml-in-a-day.ipynb?name=retrieve_endpoint)]

## Deploy the model to the endpoint

Once the endpoint is created, deploy the model with the entry script. Each endpoint can have multiple deployments. Direct traffic to these deployments can be specified using rules. Here you'll create a single deployment that handles 100% of the incoming traffic. We have chosen a color name for the deployment, for example, *blue*, *green*, *red* deployments, which is arbitrary.

You can check the **Models** page on the Azure ML studio, to identify the latest version of your registered model. Alternatively, the code below will retrieve the latest version number for you to use.


[!notebook-python[](~/azureml-examples-main/tutorials/azureml-in-a-day/azureml-in-a-day.ipynb?name=latest_model_version)]

Deploy the latest version of the model.  

> [!NOTE]
> Expect this deployment to take approximately 6 to 8 minutes.


[!notebook-python[](~/azureml-examples-main/tutorials/azureml-in-a-day/azureml-in-a-day.ipynb?name=blue_deployment)]


### Test with a sample query

Now that the model is deployed to the endpoint, you can run inference with it.

Create a sample request file following the design expected in the run method in the score script.

[!notebook-python[](~/azureml-examples-main/tutorials/azureml-in-a-day/azureml-in-a-day.ipynb?name=deploy_dir)]


[!notebook-python[](~/azureml-examples-main/tutorials/azureml-in-a-day/azureml-in-a-day.ipynb?name=write_sample)]

[!notebook-python[](~/azureml-examples-main/tutorials/azureml-in-a-day/azureml-in-a-day.ipynb?name=test)]

## Clean up resources

If you're not going to use the endpoint, delete it to stop using the resource.  Make sure no other deployments are using an endpoint before you delete it.

> [!NOTE]
> Expect this step to take approximately 6 to 8 minutes.

[!notebook-python[](~/azureml-examples-main/tutorials/azureml-in-a-day/azureml-in-a-day.ipynb?name=delete_endpoint)]


### Delete everything

Use these steps to delete your Azure Machine Learning workspace and all compute resources.

[!INCLUDE [aml-delete-resource-group](../../includes/aml-delete-resource-group.md)]


## Next steps

+ Convert this tutorial into a production ready [pipeline with reusable components](tutorial-pipeline-python-sdk.md).
+ Learn about all of the [deployment options](how-to-deploy-managed-online-endpoints.md) for Azure Machine Learning.
+ Learn how to [authenticate to the deployed model](how-to-authenticate-online-endpoint.md).
