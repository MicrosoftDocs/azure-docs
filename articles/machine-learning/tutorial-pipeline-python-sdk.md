---
title: "Tutorial: ML pipelines with Python SDK v2"
titleSuffix: Azure Machine Learning
description: Use Azure Machine Learning to create your production-ready  ML project in a cloud-based Python Jupyter Notebook using Azure ML Python SDK v2. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: msdpalam
ms.author: meeral
ms.reviewer: sgilley
ms.date: 08/29/2022
ms.custom: sdkv2, event-tier1-build-2022, ignite-2022
#Customer intent: This tutorial is intended to introduce Azure ML to data scientists who want to scale up or publish their ML projects. By completing a familiar end-to-end project, which starts by loading the data and ends by creating and calling an online inference endpoint, the user should become familiar with the core concepts of Azure ML and their most common usage. Each step of this tutorial can be modified or performed in other ways that might have security or scalability advantages. We will cover some of those in the Part II of this tutorial, however, we suggest the reader use the provide links in each section to learn more on each topic.
---

# Tutorial: Create production ML pipelines with Python SDK v2 in a Jupyter notebook

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

> [!NOTE]
> For a tutorial that uses SDK v1 to build a pipeline, see [Tutorial: Build an Azure Machine Learning pipeline for image classification](v1/tutorial-pipeline-python-sdk.md)
> 

In this tutorial, you'll use Azure Machine Learning (Azure ML) to create a production ready machine learning (ML) project, using AzureML Python SDK v2.

You'll learn how to use the AzureML Python SDK v2 to:

> [!div class="checklist"]
> 
> * Connect to your Azure ML workspace
> * Create Azure ML data assets
> * Create reusable Azure ML components
> * Create, validate and run Azure ML pipelines
> * Deploy the newly-trained model as an endpoint
> * Call the Azure ML endpoint for inferencing

## Prerequisites

* Complete the [Quickstart: Get started with Azure Machine Learning](quickstart-create-resources.md) to:
    * Create a workspace.
    * Create a cloud-based compute instance to use for your development environment.
    * Create a cloud-based compute cluster to use for training your model.
* Complete the [Quickstart: Run Jupyter notebooks in studio](quickstart-run-notebooks.md) to clone the **SDK v2/tutorials** folder.


## Open the notebook

1. Open the **tutorials** folder that was cloned into your **Files** section from the [Quickstart: Run Jupyter notebooks in studio](quickstart-run-notebooks.md).
    
1. Select the **e2e-ml-workflow.ipynb** file from your **tutorials/azureml-examples/tutorials/e2e-ds-experience/** folder. 

    :::image type="content" source="media/tutorial-pipeline-python-sdk/expand-folder.png" alt-text="Screenshot shows the open tutorials folder.":::

1. On the top bar, select the compute instance you created during the  [Quickstart: Get started with Azure Machine Learning](quickstart-create-resources.md) to use for running the notebook.

> [!Important]
> The rest of this article contains the same content as you see in the notebook.  
>
> Switch to the Jupyter Notebook now if you want to run the code while you read along.
> To run a single code cell in a notebook, click the code cell and hit **Shift+Enter**. Or, run the entire notebook by choosing **Run all** from the top toolbar

## Introduction

In this tutorial, you'll create an Azure ML pipeline to train a model for credit default prediction. The pipeline handles the data preparation, training and registering the trained model.  You'll then run the pipeline, deploy the model and use it.

The image below shows the pipeline as you'll see it in the AzureML portal once submitted. It's a rather simple pipeline we'll use to walk you through the AzureML SDK v2.

The two steps are first data preparation and second training. 

:::image type="content" source="media/tutorial-pipeline-python-sdk/pipeline-overview.jpg" alt-text="Diagram shows overview of the pipeline.":::

## Set up the pipeline resources

The Azure ML framework can be used from CLI, Python SDK, or studio interface. In this example, you'll use the AzureML Python SDK v2 to create a pipeline. 

Before creating the pipeline, you'll set up the resources the pipeline will use:

* The data asset for training
* The software environment to run the pipeline
* A compute resource to where the job will run

## Connect to the workspace

Before we dive in the code, you'll need to connect to your Azure ML workspace. The workspace is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. 

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=import-mlclient)]

In the next cell, enter your Subscription ID, Resource Group name and Workspace name. To find your Subscription ID:
1. In the upper right Azure Machine Learning studio toolbar, select your workspace name.
1. You'll see the values you need for **<SUBSCRIPTION_ID>**, **<RESOURCE_GROUP>**, and **<AML_WORKSPACE_NAME>**.
1. Copy a value, then close the window and paste that into your code.  Open the tool again to get the next value.

:::image type="content" source="media/tutorial-pipeline-python-sdk/find-info.png" alt-text="Screenshot shows how to find values needed for your code.":::

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=ml_client)]

The result is a handler to the workspace that you'll use to manage other resources and jobs.

> [!IMPORTANT]
> Creating MLClient will not connect to the workspace. The client initialization is lazy, it will wait for the first time it needs to make a call (in the notebook below, that will happen during dataset registration).

## Register data from an external url

The data you use for training is usually in one of the locations below:

* Local machine
* Web
* Big Data Storage services (for example, Azure Blob, Azure Data Lake Storage, SQL)
 
Azure ML uses a `Data` object to register a reusable definition of data, and consume data within a pipeline. In the section below, you'll consume some data from web url as one example. Data from other sources can be created as well. `Data` assets from other sources can be created as well.

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=credit_data)]

This code just created a `Data` asset, ready to be consumed as an input by the pipeline that you'll define in the next sections. In addition, you can register the data to your workspace so it becomes reusable across pipelines.

Registering the data asset will enable you to:

* Reuse and share the data asset in future pipelines
* Use versions to track the modification to the data asset
* Use the data asset from Azure ML designer, which is Azure ML's GUI for pipeline authoring

Since this is the first time that you're making a call to the workspace, you may be asked to authenticate. Once the authentication is complete, you'll then see the dataset registration completion message.

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=update-credit_data)]

In the future, you can fetch the same dataset from the workspace using `credit_dataset = ml_client.data.get("<DATA ASSET NAME>", version='<VERSION>')`.

## Create a compute resource to run your pipeline

Each step of an Azure ML pipeline can use a different compute resource for running the specific job of that step. It can be single or multi-node machines with Linux or Windows OS, or a specific compute fabric like Spark.

In this section, you'll provision a Linux [compute cluster](how-to-create-attach-compute-cluster.md?tabs=python). See the [full list on VM sizes and prices](https://azure.microsoft.com/pricing/details/machine-learning/) .

For this tutorial you only need a basic cluster, so we'll  use a Standard_DS3_v2 model with 2 vCPU cores, 7 GB RAM and create an Azure ML Compute.  

> [!TIP]
> If you already have a compute cluster, replace "cpu-cluster" in the code below with the name of your cluster.  This will keep you from creating another one.

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=cpu_cluster)]

## Create a job environment for pipeline steps

So far, you've created a development environment on the compute instance, your development machine. You'll also need an environment to use for each step of the pipeline. Each step can have its own environment, or you can use some common environments for multiple steps.

In this example, you'll create a conda environment for your jobs, using a conda yaml file.
First, create a directory to store the file in.

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=dependencies_dir)]

Now, create the file in the dependencies directory.

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=conda.yml)]

The specification contains some usual packages, that you'll use in your pipeline (numpy, pip), together with some Azure ML specific packages (azureml-defaults, azureml-mlflow).

The Azure ML packages aren't mandatory to run Azure ML jobs. However, adding these packages will let you interact with Azure ML for logging metrics and registering models, all inside the Azure ML job. You'll use them in the training script later in this tutorial.

Use the *yaml* file to create and register this custom environment in your workspace:

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=custom_env_name)]

## Build the training pipeline

Now that you have all assets required to run your pipeline, it's time to build the pipeline itself, using the Azure ML Python SDK v2.

Azure ML pipelines are reusable ML workflows that usually consist of several components. The typical life of a component is:

* Write the yaml specification of the component, or create it programmatically using `ComponentMethod`.
* Optionally, register the component with a name and version in your workspace, to make it reusable and shareable.
* Load that component from the pipeline code.
* Implement the pipeline using the component's inputs, outputs and parameters
* Submit the pipeline.

## Create component 1: data prep (using programmatic definition)

Let's start by creating the first component. This component handles the preprocessing of the data. The preprocessing task is performed in the *data_prep.py* python file.

First create a source folder for the data_prep component:

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=data_prep_src_dir)]

This script performs the simple task of splitting the data into train and test datasets. 
Azure ML mounts datasets as folders to the computes, therefore, we created an auxiliary `select_first_file` function to access the data file inside the mounted input folder.

[MLFlow](https://mlflow.org/docs/latest/tracking.html) will be used to log the parameters and metrics during our pipeline run.

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=def-main)]

Now that you have a script that can perform the desired task, create an Azure ML Component from it. 

You'll use the general purpose **CommandComponent** that can run command line actions. This command line action can directly call system commands or run a script. The inputs/outputs are specified on the command line via the `${{ ... }}` notation.

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=data_prep_component)]

Optionally, register the component in the workspace for future re-use.


## Create component 2: training (using yaml definition)

The second component that you'll create will consume the training and test data, train a tree based model and return the output model. You'll use Azure ML logging capabilities to record and visualize the learning progress.

You used the `CommandComponent` class to create your first component. This time you'll use the yaml definition to define the second component. Each method has its own advantages. A yaml definition can actually be checked-in along the code, and would provide a readable history tracking. The programmatic method using `CommandComponent` can be easier with built-in class documentation and code completion.

Create the directory for this component:

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=train_src_dir)]

Create the training script in the directory:

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=train.py)]

As you can see in this training script, once the model is trained, the model file is saved and registered to the workspace. Now you can use the registered model in inferencing endpoints.

For the environment of this step, you'll use one of the built-in (curated) Azure ML environments. The tag `azureml`, tells the system to use look for the name in curated environments.

First, create the *yaml* file describing the component:

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=train.yml)]

Now create and register the component:

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=train_component)]

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=update-train_component)]

## Create the pipeline from components

Now that both your components are defined and registered, you can start implementing the pipeline.

Here, you'll use *input data*, *split ratio* and *registered model name* as input variables. Then call the components and connect them via their inputs/outputs identifiers. The outputs of each step can be accessed via the `.outputs` property.

The python functions returned by `load_component()` work as any regular python function that we'll use within a pipeline to call each step.

To code the pipeline, you use a specific `@dsl.pipeline` decorator that identifies the Azure ML pipelines. In the decorator, we can specify the pipeline description and default resources like compute and storage. Like a python function, pipelines can have inputs. You can then create multiple instances of a single pipeline with different inputs.

Here, we used *input data*, *split ratio* and *registered model name* as input variables. We then call the components and connect them via their inputs/outputs identifiers. The outputs of each step can be accessed via the `.outputs` property.

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=pipeline)]

Now use your pipeline definition to instantiate a pipeline with your dataset, split rate of choice and the name you picked for your model.

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=registered_model_name)]

## Submit the job 

It's now time to submit the job to run in Azure ML. This time you'll use `create_or_update`  on `ml_client.jobs`.

Here you'll also pass an experiment name. An experiment is a container for all the iterations one does on a certain project. All the jobs submitted under the same experiment name would be listed next to each other in Azure ML studio.

Once completed, the pipeline will register a model in your workspace as a result of training.

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=returned_job)]

An output of "False" is expected from the above cell.  You can track the progress of your pipeline, by using the link generated in the cell above.

When you select on each component, you'll see more information about the results of that component. 
There are two important parts to look for at this stage:
* `Outputs+logs` > `user_logs` > `std_log.txt`
This section shows the script run sdtout.

    :::image type="content" source="media/tutorial-pipeline-python-sdk/user-logs.jpg" alt-text="Screenshot of std_log.txt." lightbox="media/tutorial-pipeline-python-sdk/user-logs.jpg":::


* `Outputs+logs` > `Metric`
This section shows different logged metrics. In this example. mlflow `autologging`, has automatically logged the training metrics.

    :::image type="content" source="media/tutorial-pipeline-python-sdk/metrics.jpg" alt-text="Screenshot shows logged metrics.txt." lightbox="media/tutorial-pipeline-python-sdk/metrics.jpg":::

## Deploy the model as an online endpoint

Now deploy your machine learning model as a web service in the Azure cloud, an [`online endpoint`](concept-endpoints.md).
To deploy a machine learning service, you usually need:

* The model assets (filed, metadata) that you want to deploy. You've already registered these assets in your training component.
* Some code to run as a service. The code executes the model on a given input request. This entry script receives data submitted to a deployed web service and passes it to the model, then returns the model's response to the client. The script is specific to your model. The entry script must understand the data that the model expects and returns. When using a MLFlow model, as in this tutorial, this script is automatically created for you

## Create a new online endpoint

Now that you have a registered model and an inference script, it's time to create your online endpoint. The endpoint name needs to be unique in the entire Azure region. For this tutorial, you'll create a unique name using [`UUID`](https://en.wikipedia.org/wiki/Universally_unique_identifier).

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=online_endpoint_name)]

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=endpoint)]

Once you've created an endpoint, you can retrieve it as below:

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=update-endpoint)]

## Deploy the model to the endpoint

Once the endpoint is created, deploy the model with the entry script. Each endpoint can have multiple deployments and direct traffic to these deployments can be specified using rules. Here you'll create a single deployment that handles 100% of the incoming traffic. We have chosen a color name for the deployment, for example, *blue*, *green*, *red* deployments, which is arbitrary.

You can check the *Models* page on the Azure ML studio, to identify the latest version of your registered model. Alternatively, the code below will retrieve the latest version number for you to use.

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=latest_model_version)]

Deploy the latest version of the model.  

> [!NOTE]
> Expect this deployment to take approximately 6 to 8 minutes.

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=model)]

### Test with a sample query

Now that the model is deployed to the endpoint, you can run inference with it.

Create a sample request file following the design expected in the run method in the score script.

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=sample-request.json)]

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=write-sample-request)]

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=ml_client.online_endpoints.invoke)]

## Clean up resources

If you're not going to use the endpoint, delete it to stop using the resource.  Make sure no other deployments are using an endpoint before you delete it.

> [!NOTE]
> Expect this step to take approximately 6 to 8 minutes.

[!Notebook-python[] (~/azureml-examples-main/tutorials/e2e-ds-experience/e2e-ml-workflow.ipynb?name=ml_client.online_endpoints.begin_delete)]

## Next steps

> [!div class="nextstepaction"]
> Learn more about [Azure ML logging](./how-to-use-mlflow-cli-runs.md).
