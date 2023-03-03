---
title: "Tutorial: ML pipelines with Python SDK v2"
titleSuffix: Azure Machine Learning
description: Use Azure Machine Learning to create your production-ready  ML project in a cloud-based Python Jupyter Notebook using Azure Machine Learning  Python SDK v2. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: msdpalam
ms.author: meeral
ms.reviewer: sgilley
ms.date: 02/27/2023
ms.custom: sdkv2, event-tier1-build-2022, ignite-2022
#Customer intent: This tutorial is intended to introduce Azure Machine Learning to data scientists who want to scale up or publish their ML projects. By completing a familiar end-to-end project, which starts by loading the data and ends by creating and calling an online inference endpoint, the user should become familiar with the core concepts of Azure Machine Learning and their most common usage. Each step of this tutorial can be modified or performed in other ways that might have security or scalability advantages. We will cover some of those in the Part II of this tutorial, however, we suggest the reader use the provide links in each section to learn more on each topic.
---

# Tutorial: Create production Machine Learning pipelines

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

> [!NOTE]
> For a tutorial that uses SDK v1 to build a pipeline, see [Tutorial: Build an Azure Machine Learning pipeline for image classification](v1/tutorial-pipeline-python-sdk.md)

The core of a machine learning pipeline is to split a complete machine learning task into a multistep workflow. Each step is a manageable component that can be developed, optimized, configured, and automated individually. Steps are connected through well-defined interfaces. The Azure Machine Learning pipeline service automatically orchestrates all the dependencies between pipeline steps. The benefits of using a pipeline are standardized the MLOps practice, scalable team collaboration, training efficiency and cost reduction. To learn more about the benefits of pipelines, see [What are Azure Machine Learning pipelines](concept-ml-pipelines.md).

In this tutorial, you use Azure Machine Learning to create a production ready machine learning (ML) project, using Azure Machine Learning Python SDK v2.

In this tutorial you learn how to use the Azure Machine Learning Python SDK v2 to:

> [!div class="checklist"]
>
> - Connect to your Azure Machine Learning workspace
> - Create Azure Machine Learning data assets
> - Create reusable Azure Machine Learning components
> - Create, validate and run Azure Machine Learning  pipelines
> - Deploy the newly-trained model as an endpoint
> - Call the Azure Machine Learning endpoint for inferencing

During this tutorial, you create an Azure Machine Learning  pipeline to train a model for credit default prediction. The pipeline handles the data preparation, training and registering the trained model. Then run the pipeline, deploy the model and use it.

The next image shows a simple pipeline as you'll see it in the Azure portal once submitted.

The two steps are first data preparation and second training.

:::image type="content" source="media/tutorial-pipeline-python-sdk/pipeline-overview.jpg" alt-text="Diagram shows overview of the pipeline.":::

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Machine Learning workspace. See [Create resources to get started](quickstart-create-resources.md) for information on how to create one.

## Open the notebook

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com).
1. Open your workspace if it isn't already open.
1. From the navigation bar on the left, select **Notebook**.
1. At the top, select **Samples**.

1. Select the **e2e-ml-workflow.ipynb** file from **tutorials/azureml-examples/tutorials/e2e-ds-experience/** folder.

    :::image type="content" source="media/tutorial-pipeline-python-sdk/expand-folder.png" alt-text="Screenshot shows the open tutorials folder.":::
1. Select **Clone this notebook**.
1. On the top bar, select the compute instance you created during the  [Create resources to get started](quickstart-create-resources.md) to use for running the notebook. Start the compute if it isn't already started.

> [!Important]
> The rest of this article contains the same content as you see in the notebook.  
>
> Switch to the Jupyter Notebook now if you want to run the code while you read along.
> To run a single code cell in a notebook, click the code cell and hit **Shift+Enter**. Or, run the entire notebook by choosing **Run all** from the top toolbar

## Set up the pipeline resources

The Azure Machine Learning framework can be used from CLI, Python SDK, or studio interface. In this example, you use the Azure Machine Learning Python SDK v2 to create a pipeline.

Before creating the pipeline, you need the following resources:

- The data asset for training
- The software environment to run the pipeline
- A compute resource to where the job runs

### Connect to the workspace

Before we dive in the code, you need to connect to your Azure Machine Learning  workspace. The workspace is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning.

[!Notebook-python[] (~/azureml-examples-tutorials/tutorials/get-started-notebooks/pipeline.ipynb?name=import-mlclient)]

In the next cell, enter your Subscription ID, Resource Group name and Workspace name. To find your Subscription ID:

1. In the upper right Azure Machine Learning studio toolbar, select your workspace name.
1. You see the values you need for **<SUBSCRIPTION_ID>**, **<RESOURCE_GROUP>**, and **<AML_WORKSPACE_NAME>**.
1. Copy a value, then close the window and paste that into your code.  Open the tool again to get the next value.

:::image type="content" source="media/tutorial-pipeline-python-sdk/find-info.png" alt-text="Screenshot shows how to find values needed for your code.":::

[!Notebook-python[] (~/azureml-examples-tutorials/tutorials/get-started-notebooks/pipeline.ipynb?name=ml_client)]

The result is a handler to the workspace that you use to manage other resources and jobs.

> [!IMPORTANT]
> Creating MLClient will not connect to the workspace. The client initialization is lazy, it will wait for the first time it needs to make a call (in the notebook, that will happen during dataset registration).

### Register data from an external url

If you have been following along with the other tutorials in this series and already registered the data, you can fetch the same dataset from the workspace using `credit_dataset = ml_client.data.get("<DATA ASSET NAME>", version='<VERSION>')`. Then you may skip this section. To learn about data more in depth or if you would rather complete the data tutorial first, see [Upload, access and explore your data in Azure Machine Learning](tutorial-explore-data.md).
 
Azure Machine Learning uses a `Data` object to register a reusable definition of data, and consume data within a pipeline. In the next section, you consume some data from web url as one example. Data from other sources can be created as well. `Data` assets from other sources can be created as well.

[!Notebook-python[] (~/azureml-examples-tutorials/tutorials/get-started-notebooks/pipeline.ipynb?name=credit_data)]

This code just created a `Data` asset, ready to be consumed as an input by the pipeline that you'll define in the next sections. In addition, you can register the data to your workspace so it becomes reusable across pipelines.

Since this is the first time that you're making a call to the workspace, you may be asked to authenticate. Once the authentication is complete, you then see the dataset registration completion message.

[!Notebook-python[] (~/azureml-examples-tutorials/tutorials/get-started-notebooks/pipeline.ipynb?name=update-credit_data)]

In the future, you can fetch the same dataset from the workspace using `credit_dataset = ml_client.data.get("<DATA ASSET NAME>", version='<VERSION>')`.

### Create a compute resource to run your pipeline

Each step of an Azure Machine Learning pipeline can use a different compute resource for running the specific job of that step. It can be single or multi-node machines with Linux or Windows OS, or a specific compute fabric like Spark.

In this section, you provision a Linux [compute cluster](how-to-create-attach-compute-cluster.md?tabs=python). See the [full list on VM sizes and prices](https://azure.microsoft.com/pricing/details/machine-learning/) .

For this tutorial, you only need a basic cluster so use a Standard_DS3_v2 model with 2 vCPU cores, 7-GB RAM and create an Azure Machine Learning Compute.  

> [!TIP]
> If you already have a compute cluster, replace "cpu-cluster" in the next code block with the name of your cluster.  This will keep you from creating another one.

[!Notebook-python[] (~/azureml-examples-tutorials/tutorials/get-started-notebooks/pipeline.ipynb?name=cpu_cluster)]

### Create a job environment for pipeline steps

So far, you've created a development environment on the compute instance, your development machine. You also need an environment to use for each step of the pipeline. Each step can have its own environment, or you can use some common environments for multiple steps.

In this example, you create a conda environment for your jobs, using a conda yaml file.
First, create a directory to store the file in.

[!Notebook-python[] (~/azureml-examples-tutorials/tutorials/get-started-notebooks/pipeline.ipynb?name=dependencies_dir)]

Now, create the file in the dependencies directory.

[!Notebook-python[] (~/azureml-examples-tutorials/tutorials/get-started-notebooks/pipeline.ipynb?name=conda.yml)]

The specification contains some usual packages, that you use in your pipeline (numpy, pip), together with some Azure Machine Learning specific packages (azureml-defaults, azureml-mlflow).

The Azure Machine Learning packages aren't mandatory to run Azure Machine Learning jobs. However, adding these packages let you interact with Azure Machine Learning for logging metrics and registering models, all inside the Azure Machine Learning job. You use them in the training script later in this tutorial.

Use the *yaml* file to create and register this custom environment in your workspace:

[!Notebook-python[] (~/azureml-examples-tutorials/tutorials/get-started-notebooks/pipeline.ipynb?name=custom_env_name)]

## Build the training pipeline

Now that you have all assets required to run your pipeline, it's time to build the pipeline itself, using the Azure Machine Learning Python SDK v2.

Azure Machine Learning pipelines are reusable ML workflows that usually consist of several components. The typical life of a component is:

- Write the yaml specification of the component, or create it programmatically using `ComponentMethod`.
- Optionally, register the component with a name and version in your workspace, to make it reusable and shareable.
- Load that component from the pipeline code.
- Implement the pipeline using the component's inputs, outputs and parameters.
- Submit the pipeline.

There are two ways to create a component, programmatic and yaml definition. The next two sections walk you through creating a component both ways. You can either create the two components trying both options or pick your preferred method.

### Create component 1: data prep (using programmatic definition)

Let's start by creating the first component. This component handles the preprocessing of the data. The preprocessing task is performed in the *data_prep.py* Python file.

First create a source folder for the data_prep component:

[!Notebook-python[] (~/azureml-examples-tutorials/tutorials/get-started-notebooks/pipeline.ipynb?name=data_prep_src_dir)]

This script performs the simple task of splitting the data into train and test datasets. Azure Machine Learning mounts datasets as folders to the computes, therefore, we created an auxiliary `select_first_file` function to access the data file inside the mounted input folder.

[MLFlow](https://mlflow.org/docs/latest/tracking.html) is used to log the parameters and metrics during our pipeline run.

[!Notebook-python[] (~/azureml-examples-tutorials/tutorials/get-started-notebooks/pipeline.ipynb?name=def-main)]

Now that you have a script that can perform the desired task, create an Azure Machine Learning Component from it.

Use the general purpose **CommandComponent** that can run command line actions. This command line action can directly call system commands or run a script. The inputs/outputs are specified on the command line via the `${{ ... }}` notation.

[!Notebook-python[] (~/azureml-examples-tutorials/tutorials/get-started-notebooks/pipeline.ipynb?name=data_prep_component)]

Optionally, register the component in the workspace for future reuse.

### Create component 2: training (using yaml definition)

The second component that you create consumes the training and test data, train a tree based model and return the output model. Use Azure Machine Learning logging capabilities to record and visualize the learning progress.

You used the `CommandComponent` class to create your first component. This time you use the yaml definition to define the second component. Each method has its own advantages. A yaml definition can actually be checked-in along the code, and would provide a readable history tracking. The programmatic method using `CommandComponent` can be easier with built-in class documentation and code completion.

Create the directory for this component:

[!Notebook-python[] (~/azureml-examples-tutorials/tutorials/get-started-notebooks/pipeline.ipynb?name=train_src_dir)]

Create the training script in the directory:

[!Notebook-python[] (~/azureml-examples-tutorials/tutorials/get-started-notebooks/pipeline.ipynb?name=train.py)]

As you can see in this training script, once the model is trained, the model file is saved and registered to the workspace. Now you can use the registered model in inferencing endpoints.

For the environment of this step, you use one of the built-in (curated) Azure Machine Learning environments. The tag `azureml`, tells the system to use look for the name in curated environments.

First, create the *yaml* file describing the component:

[!Notebook-python[] (~/azureml-examples-tutorials/tutorials/get-started-notebooks/pipeline.ipynb?name=train.yml)]

Now create and register the component:

[!Notebook-python[] (~/azureml-examples-tutorials/tutorials/get-started-notebooks/pipeline.ipynb?name=train_component)]

[!Notebook-python[] (~/azureml-examples-tutorials/tutorials/get-started-notebooks/pipeline.ipynb?name=update-train_component)]

### Create the pipeline from components

Now that both your components are defined and registered, you can start implementing the pipeline.

Here, you use *input data*, *split ratio* and *registered model name* as input variables. Then call the components and connect them via their inputs/outputs identifiers. The outputs of each step can be accessed via the `.outputs` property.

The Python functions returned by `load_component()` work as any regular Python function that we use within a pipeline to call each step.

To code the pipeline, you use a specific `@dsl.pipeline` decorator that identifies the Azure Machine Learning pipelines. In the decorator, we can specify the pipeline description and default resources like compute and storage. Like a Python function, pipelines can have inputs. You can then create multiple instances of a single pipeline with different inputs.

Here, we used *input data*, *split ratio* and *registered model name* as input variables. We then call the components and connect them via their inputs/outputs identifiers. The outputs of each step can be accessed via the `.outputs` property.

[!Notebook-python[] (~/azureml-examples-tutorials/tutorials/get-started-notebooks/pipeline.ipynb?name=pipeline)]

Now use your pipeline definition to instantiate a pipeline with your dataset, split rate of choice and the name you picked for your model.

[!Notebook-python[] (~/azureml-examples-tutorials/tutorials/get-started-notebooks/pipeline.ipynb?name=registered_model_name)]

## Submit the job

It's now time to submit the job to run in Azure Machine Learning. This time you use `create_or_update`  on `ml_client.jobs`.

Here you also pass an experiment name. An experiment is a container for all the iterations one does on a certain project. All the jobs submitted under the same experiment name would be listed next to each other in Azure Machine Learning studio.

Once completed, the pipeline registers a model in your workspace as a result of training.

[!Notebook-python[] (~/azureml-examples-tutorials/tutorials/get-started-notebooks/pipeline.ipynb?name=returned_job)]

An output of "False" is expected from the previous cell. You can track the progress of your pipeline, by using the link generated in the previous cell.

When you select on each component, you see more information about the results of that component.
There are two important parts to look for at this stage:

- `Outputs+logs` > `user_logs` > `std_log.txt`
This section shows the script run sdtout.

    :::image type="content" source="media/tutorial-pipeline-python-sdk/user-logs.jpg" alt-text="Screenshot of std_log.txt." lightbox="media/tutorial-pipeline-python-sdk/user-logs.jpg":::


- `Outputs+logs` > `Metric`
This section shows different logged metrics. In this example. mlflow `autologging`, has automatically logged the training metrics.

    :::image type="content" source="media/tutorial-pipeline-python-sdk/metrics.jpg" alt-text="Screenshot shows logged metrics.txt." lightbox="media/tutorial-pipeline-python-sdk/metrics.jpg":::

## Deploy the model as an online endpoint

To learn how to deploy your model to an online endpoint, see [Deploy a model as an online endpoint tutorial](tutorial-deploy-model.md).

## Clean up resources

If you're not going to use the endpoint, delete it to stop using the resource.  Make sure no other deployments are using an endpoint before you delete it.

> [!NOTE]
> Expect this step to take approximately 6 to 8 minutes.

[!Notebook-python[] (~/azureml-examples-tutorials/tutorials/get-started-notebooks/pipeline.ipynb?name=ml_client.online_endpoints.begin_delete)]

## Next steps

> [!div class="nextstepaction"]
> Learn more about [Azure Machine Learning logging](./how-to-use-mlflow-cli-runs.md).
