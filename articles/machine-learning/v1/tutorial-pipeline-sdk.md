---
title: "Tutorial: Using Azure ML Pipelines to Productionize E2E ML Workflows with Python SDKv2 in a Jupyter Notebook"
titleSuffix: Azure Machine Learning
description: Use Azure Machine Learning to productionize your ML projectin a cloud-based Python Jupyter Notebook using Azure ML Python SDK V2. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: msdpalam
ms.author: msdpalam
ms.date: 04/20/2022

#Customer intent: This tutorial is intended to introduce Azure ML to data scientists who want to scale up or publish their ML projects. By completing a familiar end-to-end project, which starts by loading the data and ends by creating and calling an online inference endpoint, the user should become familiar with the core concepts of Azure ML and their most common usage. Each step of this tutorial can be modified or performed in other ways that might have security or scalability advantages. We will cover some of those in the Part II of this tutorial, however, we suggest the reader use the provide links in each section to learn more on each topic. 
---

# Tutorial: Using Azure ML Pipelines to Productionize E2E ML Workflows with Python SDK v2 in a Jupyter Notebook

In this tutorial, you should be able to use Azure Machine Learning (Azure ML) to productionize your ML project, leveraging AzureML Python SDK v2


You will learn how to leverage the AzureML Python SDK to:

> [!div class="checklist"]
> 
> * connect to your Azure ML workspace
> * create Azure ML Datasets
> * create reusable Azure ML Components
> * create, validate and run Azure ML pipelines
> * deploy the newly-trained model as an endpoint
> * call the Azure ML endpoint for inferencing

## Prerequisites

* A basic understanding of Machine Learning projects workflow
* Complete the [Quickstart: Get started with Azure Machine Learning](https://docs.microsoft.com/en-us/azure/machine-learning/quickstart-create-resources) to:
    * Create a workspace.
    * Create a cloud-based compute instance to use for your development environment.
 * Install Azure Machine Learning Python SDK v2
    * Run the following command going into the terminal of your compute instance
    ```
    pip install azure-ml==0.0.139 --extra-index-url  https://azuremlsdktestpypi.azureedge.net/sdk-cli-v2
    ```
## <a name="azure"></a>Run a notebook from your workspace

Azure Machine Learning includes a cloud notebook server in your workspace for an install-free and pre-configured experience. Use [your own environment](how-to-configure-environment.md#local) if you prefer to have control over your environment, packages, and dependencies.

 Follow along with this video or use the detailed steps to clone and run the tutorial notebook from your workspace.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4mTUr]

> [!NOTE]
> The video helps you understand the process, but shows opening a different file.  For this tutorial, once you've cloned the **tutorials** folder, use [instructions below to open the cloned notebook](#open).

## <a name="clone"></a> Clone a notebook folder

You complete the following experiment setup and run steps in Azure Machine Learning studio. This consolidated interface includes machine learning tools to perform data science scenarios for data science practitioners of all skill levels.

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com/).

1. Select your subscription and the workspace you created.

1. On the left, select **Compute**.

1. From the list of **Compute Instances**, find the one, that is running.

1. Click on "Terminal", to open the terminal session on the compute instance. 

1. On a browser, navigate to [Azure Sample](https://github.com/Azure/azureml-examples/tree/sdk-preview) GitHub Repo

1. Click on **Code** and copy the [HTTPS Link](https://github.com/Azure/azureml-examples.git)

1. Now on the terminal run the command:
   ```
   git clone --depth 1 https://github.com/Azure/azureml-examples --branch sdk-preview
   ```
1. After the cloning is complete, run
   ```
   get checkout sdk-preview
   ```
1. On the left, select **Notebooks**.

1. Now, on the left, Select the **Files**

    :::image type="content" source="media/clone-tutorials.png" alt-text="Screenshot that shows the Clone tutorials folder.":::

1. A list of folders shows each user who accesses the workspace. Select your folder, you will find **azure-samples** is cloned.

## <a name="open"></a> Open the cloned notebook

1. Open the **tutorials** folder that was cloned into your **User files** section.

    > [!IMPORTANT]
    > You can view notebooks in the **azure-samples** folder in the terminal, but you can't run a notebook from there. To run a notebook, make sure you open the cloned version of the notebook in the **Files** section.
    
1. Select the **e2e-ml-workflow-part-I.ipynb** file from your **azureml-examples/tutorials/e2e-ds-experience/** folder. 

    :::image type="content" source="media/expand-folder.png" alt-text="Screenshot shows the Open tutorials folder.":::

1. On the top bar, select the compute instance you created during the  [Quickstart: Get started with Azure Machine Learning](quickstart-create-resources.md)  to use for running the notebook.

This tutorial is also available on [GitHub](https://github.com/Azure/azureml-examples/tree/sdk-preview/tutorials) if you wish to use it on your own [local environment](how-to-configure-environment.md#local).

> [!Important]
> The rest of this article contains the same content as you see in the notebook.  
>
> Switch to the Jupyter Notebook now if you want to run the code while you read along.
> To run a single code cell in a notebook, click the code cell and hit **Shift+Enter**. Or, run the entire notebook by choosing **Run all** from the top toolbar


## Introduction

In this tutorial, we will create an Azure ML pipeline to train a model for credit default prediction. The pipeline handles the data preparation, training and registering the trained model. 

The image below shows the pipeline as you will see it in the AzureML portal once submitted. It is a rather simple pipeline we'll use to walk you through the new AzureML SDK.

The two steps are first data preparation and second training. The pipeline will register a model so that we can deploy the model as an endpoint and evaluate the inferencing through that endpoint by invoking sample queries.

   ![Screenshot that shows the AML Pipeline](media/pipeline-overview.jpg "ML Pipeline")


## Set Up the Pipeline Resources

Azure ML Framework can be used from CLI, Python SDK, or GUI. In this example we will use the AzureML Python SDK to create a pipeline. This requires importing specific python entities (ex: dataset, component, pipeline) and assemble in a python script to build a full pipeline.

Note: In this tutorial, we try to postpone the imports of the required packages to the sections directly using those packages. This way, you will better understand the role of each of the entities in the SDK. If you decide to run the cells out of the presented order, make sure you have imported the packages first.

### Connect to the Workspace

Before we dive in the code, we'll need to create an instance of MLClient to connect to Azure ML workspace. The workspace is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. Please provide the references to your workspace below.

```Python
# handle to the workspace
from azure.ml import MLClient

# Authentication package
from azure.identity import DefaultAzureCredential
```
In the next cell, we enter the Subscription ID, Resource Group name and Workspace name. These parameters can be obtained during workspace creation, or by visiting the Azure ML Studio. The result is a handler to the workspace that we can use to manage other resources and jobs.

Note: We use the default interactive authentication for this tutorial which will require you to manually confirm your connection in a browser. More advanced connection methods can be found here [sdkv1link](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.authentication?view=azure-ml-py).

```Python
# get a handle to the workspace
ml_client = MLClient(
    DefaultAzureCredential(),
    subscription_id="<SUBSCRIPTION_ID>",
    resource_group_name="<RESOURCE_GROUP>",
    workspace_name="<AML_WORKSPACE_NAME>",
)
```

> [!IMPORTANT]
> Creating MLClient will not connect to the workspace. The client initialization is lazy, it will wait for the first time we'll need to make a call (in the notebook below, that will happen during dataset registration).

### Register a dataset from an external url

The data we use for our training is usually in one of the locations below:

* Local Machine
* Web
* Big Data Storage services (e.g. Azure Blob, Azure Data Lake Storage, SQL... )
 
Azure ML uses a Dataset object to register a reusable definition of data, and consume data within a pipeline. A Dataset object is a pointer to a data storage service and a path. In the section below, we consume some data from web url as one example. Datasets from other sources can be created as well.


```python
from azure.ml.entities import Dataset

web_path = "https://archive.ics.uci.edu/ml/machine-learning-databases/00350/default%20of%20credit%20card%20clients.xls"

credit_dataset = Dataset(
    name="creditcard_defaults",
    paths=[dict(file=web_path)],
    description="Dataset for credit card defaults",
    tags={"source_type": "web", "source": "UCI ML Repo"},
)
```
We just created a Dataset object, it is ready to be consumed as an input by the pipeline that we will define in the next sections. In addition, we can also register the dataset to our workspace so it becomes reusable across pipelines.

This will enable us to:

* reuse and share the dataset in future pipelines
* use versions to track the modification to the dataset
* use the dataset from Azure ML designer which is Azure ML's GUI for pipeline authoring

Since this is the first time in this tutorial that we are making a call to the workspace, running the next cell should direct you to Azure ML's web authentication page. Please login with your Azure credentials. Once you are logged in, you should receive a message that informs you that the authentication is complete and you can close the authentication window. You should then see the dataset registration completion below.

```Python
credit_dataset = ml_client.create_or_update(credit_dataset)
print(
    f"Dataset with name {credit_dataset.name} was registered to workspace, the dataset version is {credit_dataset.version}"
)
```
In future, you can fetch the same dataset from the workspace using:
```
credit_dataset = ml_client.datasets.get("<DATASET NAME>", version='<VERSION>')
```
### Create a Compute Resource to run our pipeline

Each step of an Azure ML pipelines can use a different compute resource for running the specific job of that step. It can be single or multi-node machines with Linux or Windows OS, or a specific compute fabric like Spark on HDInsight.

In this section, we provision a Linux compute cluster. You can check [here](https://azure.microsoft.com/en-ca/pricing/details/machine-learning/) for a full list on VM sizes and prices.

For this tutorial we only need a basic cluster, let's pick a Standard_DS3_v2 model with 2 vCPU cores, 7 GB RAM and create an Azure ML Compute


```python
from azure.ml.entities import AmlCompute

# Let's create the Azure ML compute object with the intended parameters
cluster_basic = AmlCompute(
    # Name assigned to the compute cluster
    name="cpu-cluster",
    # Azure ML Compute is the on-demand VM service
    type="amlcompute",
    # VM Family
    size="Standard_DS3_v2",
    # Minimum running nodes when there is no job running
    min_instances=0,
    # nodes in cluster
    max_instances=2,
    # How many seconds will the node running after the job termination
    idle_time_before_scale_down=180,
    # Dedicated or LowPriority. The latter is cheaper but there is a chance of job termination
    tier="Dedicated",
)

# # Now, we pass the object to clinet's create_or_update method
cluster_basic = ml_client.begin_create_or_update(cluster_basic)

print(
    f"AMLCompute with name {cluster_basic.name} is created, the compute size is {cluster_basic.size}"
)
```



### Create a Job Environment for pipeline steps

So far, in the requirements section, we have created a development environment on our development machine. Azure ML needs to know what environment to use for each step of the pipeline. Each step can have its own environment, or you can use some common environments for multiple steps.

An environment will be built using any published docker image as-is, or a Dockerfile, and add required dependencies no top of it.

In our example, we create a conda environment for our jobs, using a [conda yaml file](https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#create-env-file-manually) and add it to an Ubuntu image in Microsoft Container Registry. For more information on Azure ML environments and Azure Container Registries, please check [sdkv1link](https://docs.microsoft.com/en-us/azure/machine-learning/concept-environments).

```python
import os
dependencies_dir = "./dependencies"
os.makedirs(dependencies_dir, exist_ok=True)
```

```Python
%%writefile {dependencies_dir}/conda.yml
name: model-env
channels:
  - conda-forge
dependencies:
  - python=3.8
  - numpy=1.21.2
  - pip=21.2.4
  - scikit-learn=0.24.2
  - scipy=1.7.1
  - pandas>=1.1,<1.2
  - pip:
    - azureml-defaults==1.38.0
    - azureml-mlflow==1.38.0
    - inference-schema[numpy-support]==1.3.0
    - joblib==1.0.1
    - xlrd==2.0.1
```

Here we added some usual packages we use in our pipeline (numpy, pip) together with some Azure ML specific packages (azureml-defaults, azureml-mlflow).

These Azure ML packages are not mandatory to run Azure ML jobs. However, adding those will let us interact with Azure ML for logging metrics and registering models, all inside the Azure ML job (see training script for details).

```Python
from azure.ml.entities import Environment

custom_env_name = "aml-scikit-learn"

pipeline_job_env = Environment(
    name=custom_env_name,
    description="Custom environment for Credit Card Defaults pipeline",
    tags={"scikit-learn": "0.24.2", "azureml-defaults": "1.38.0"},
    conda_file=os.path.join(dependencies_dir, "conda.yml"),
    image="mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04:20210727.v1",
)
pipeline_job_env = ml_client.environments.create_or_update(pipeline_job_env)

print(
    f"Environment with name {pipeline_job_env.name} is registered to workspace, the environment version is {pipeline_job_env.version}"
)
```

## Create the Training Pipeline

Now that we've provisioned the assets required to run our pipeline, we'll build the pipeline itself using the Azure ML Python SDK.

Azure ML pipelines are reusable ML workflows that usually consist of several components. Azure ML defines these components in yaml files. The typical life of a component will consist in:
- writing directly the yaml specification of the component or create it programmatically using `ComponentMethod`,
- optionally register this component with a name and version in your workspace to make it reusable and shareable,
- load that component from the pipeline code
- implement the pipeline using this component inputs, outputs and parameters
- submit the pipeline.

### Create or Load Components

### Data Preparation Component (using programmatic definition)

Let's start by creating the first component. This component handles the preprocessing of the data. The preprocessing task is performed in the *data_prep.py* python file.

Let's first create a source folder for the data_prep component:

```Python
import os

data_prep_src_dir = "./components/data_prep"
os.makedirs(data_prep_src_dir, exist_ok=True)
```

This script performs the simple task of splitting the data into train and test datasets. 
Azure ML mounts datasets as folders to the computes, therefore, we created an auxiliary `select_first_file` function to access the data file inside the mounted input folder.

[MLFlow](https://mlflow.org/docs/latest/tracking.html) can be used to log the parameters and metrics during our pipeline run. A detailed guide on Azure ML logging is available [here](https://github.com/Azure/azureml-examples/blob/sdk-preview/notebooks/mlflow/mlflow-v1-comparison.ipynb). 

```Python
%%writefile {data_prep_src_dir}/data_prep.py
import os
import argparse
import pandas as pd
from sklearn.model_selection import train_test_split
import logging
from azureml.core import Run
import mlflow


def select_first_file(path):
    """Selects first file in folder, use under assumption there is only one file in folder
    Args:
        path (str): path to directory or file to choose
    Returns:
        str: full path of selected file
    """
    files = os.listdir(path)
    return os.path.join(path, files[0])


def main():
    """Main function of the script."""

    # input and output arguments
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", type=str, help="path to input data")
    parser.add_argument("--test_train_ratio", type=float, required=False, default=0.25)
    parser.add_argument("--train_data", type=str, help="path to train data")
    parser.add_argument("--test_data", type=str, help="path to test data")
    args = parser.parse_args()

    # Start Logging
    mlflow.start_run()

    print(" ".join(f"{k}={v}" for k, v in vars(args).items()))

    print("input data:", select_first_file(args.data))

    credit_df = pd.read_excel(select_first_file(args.data), header=1, index_col=0)

    mlflow.log_metric("num_samples", credit_df.shape[0])
    mlflow.log_metric("num_features", credit_df.shape[1] - 1)

    credit_train_df, credit_test_df = train_test_split(
        credit_df,
        test_size=args.test_train_ratio,
    )

    # output paths are mounted as folder, therefore, we are adding a filename to the path
    credit_train_df.to_csv(os.path.join(args.train_data, "data.csv"), index=False)

    credit_test_df.to_csv(os.path.join(args.test_data, "data.csv"), index=False)

    # Stop Logging
    mlflow.end_run()


if __name__ == "__main__":
    main()
```

Now that we have a script that can perform the desired task, we can create an Azure ML Component from it. Azure ML support various types of components for performing ML tasks, such as running scripts, data transfer, etc.

Here we use the general purpose **CommandComponent** that can run command line actions. This command line action can be directly calling system commands or running a script. The inputs/outputs are accessible in the command via the `${{ ... }}` notation.

A component can be created by calling the component instantiators, or directly writing the defining yaml file. For the first component, we use the `CommandComponent` class.

```Python
# importing the CommandComponent Package
from azure.ml.entities import CommandComponent

# importing the CommandComponent Package
from azure.ml.entities import Code

data_prep_component = CommandComponent(
    # Name of the component
    name="Data_Preparation",
    # Component Version, no Version and the component will be automatically versioned
    #     version="26",
    # The dictionary of the inputs. Each item is a dictionary itself.
    inputs=dict(
        data=dict(type="path"),
        test_train_ratio=dict(type="number"),
    ),
    # The dictionary of the outputs. Each item is a dictionary itself.
    outputs=dict(
        train_data=dict(type="path"),
        test_data=dict(type="path"),
    ),
    # The source folder of the component
    code=Code(local_path=data_prep_src_dir),
    # The environment the component job will be using
    environment=ml_client.environments.get(
        name=pipeline_job_env.name, version=pipeline_job_env.version
    ),
    # The command that will be run in the component, using ${{}} to create a command template
    # the actual parameter values will be injected at runtime.
    command="python data_prep.py --data ${{inputs.data}} --test_train_ratio ${{inputs.test_train_ratio}} "
    "--train_data ${{outputs.train_data}} --test_data ${{outputs.test_data}} ",
)

data_prep_component = ml_client.create_or_update(data_prep_component)

print(
    f"Component {data_prep_component.name} with Version {data_prep_component.version} is registered"
)
```

#### Training Component (using yaml definition)

The second component that we will create will consume the training and test data, train a tree based model and then returns the output model. We use Azure ML logging capabilities to record and visualize the learning progress.

Once the model is trained, the model file is saved and registered to the workspace. This will allow us to use the registered model in inferencing endpoints.

```Python
import os
train_src_dir = "./components/train"
os.makedirs(train_src_dir, exist_ok=True)
```

```Python
%%writefile {train_src_dir}/train.py
import argparse
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import classification_report
from azureml.core.model import Model
from azureml.core import Run
import os
import pandas as pd
import joblib
import mlflow


def select_first_file(path):
    """Selects first file in folder, use under assumption there is only one file in folder
    Args:
        path (str): path to directory or file to choose
    Returns:
        str: full path of selected file
    """
    files = os.listdir(path)
    return os.path.join(path, files[0])


# Start Logging
mlflow.start_run()

# enable autologging
mlflow.sklearn.autolog()

# This line creates a handles to the current run. It is used for model registration
run = Run.get_context()

os.makedirs("./outputs", exist_ok=True)


def main():
    """Main function of the script."""

    # input and output arguments
    parser = argparse.ArgumentParser()
    parser.add_argument("--train_data", type=str, help="path to train data")
    parser.add_argument("--test_data", type=str, help="path to test data")
    parser.add_argument("--n_estimators", required=False, default=100, type=int)
    parser.add_argument("--learning_rate", required=False, default=0.1, type=float)
    parser.add_argument("--registered_model_name", type=str, help="model name")
    parser.add_argument("--model", type=str, help="path to model file")
    args = parser.parse_args()

    # paths are mounted as folder, therefore, we are selecting the file from folder
    train_df = pd.read_csv(select_first_file(args.train_data))

    # Extracting the label column
    y_train = train_df.pop("default payment next month")

    # convert the dataframe values to array
    X_train = train_df.values

    # paths are mounted as folder, therefore, we are selecting the file from folder
    test_df = pd.read_csv(select_first_file(args.test_data))

    # Extracting the label column
    y_test = test_df.pop("default payment next month")

    # convert the dataframe values to array
    X_test = test_df.values

    print(f"Training with data of shape {X_train.shape}")

    clf = GradientBoostingClassifier(
        n_estimators=args.n_estimators, learning_rate=args.learning_rate
    )
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)

    print(classification_report(y_test, y_pred))

    # setting the full path of the model file
    model_file = os.path.join(args.model, "model.pkl")
    with open(model_file, "wb") as mf:
        joblib.dump(clf, mf)

    # Registering the model to the workspace
    model = Model.register(
        run.experiment.workspace,
        model_name=args.registered_model_name,
        model_path=model_file,
        tags={"type": "sklearn.GradientBoostingClassifier"},
        description="Model created in Azure ML on credit card defaults dataset",
    )

    # Stop Logging
    mlflow.end_run()


if __name__ == "__main__":
    main()
```
We've previously shown how we create a component using `CommandComponent` class. This time we use the yaml definition for defining our component. Each method has its own advantages. A yaml definition can actually be checked-in along the code, and would provide a readable history tracking. The programmatic method using `CommandComponent` can be easier with built-in class documentation and code completion.

For the environment of this step, we can use one of the built-in Azure ML environments. The tag `azureml`, tells the system to use look for the name in the previously built environments. 

```Python
%%writefile {train_src_dir}/train.yml
# <component>
name: TrainCreditDefaultsModel
display_name: Train Credit Defaults Model
# version: 1 # Not specifying a version will automatically update the version
type: command
inputs:
  train_data: 
    type: path
  test_data: 
    type: path
  learning_rate:
    type: number     
  registered_model_name:
    type: string
outputs:
  model:
    type: path
code:
  local_path: .
environment:
  # for this step, we'll use an AzureML curate environment
  azureml:AzureML-sklearn-0.24-ubuntu18.04-py37-cpu:21
command: >-
  python train.py 
  --train_data ${{inputs.train_data}} 
  --test_data ${{inputs.test_data}} 
  --learning_rate ${{inputs.learning_rate}}
  --registered_model_name ${{inputs.registered_model_name}} 
  --model ${{outputs.model}}
# </component>

```

```Python
# importing the Component Package
from azure.ml.entities import Component

# Loading the component from the yml file
train_component = Component.load(path=os.path.join(train_src_dir, "train.yml"))
```

```Python
# Now we register the component to the workspace
train_component = ml_client.create_or_update(train_component)

print(
    f"Component {train_component.name} with Version {train_component.version} is registered"
)
```

### Creating the Pipeline from registered Components

Now that both our components are defined and registered, we can start implementing the pipeline. This consists in using a specific python syntax based on our  *dsl functions*. we load the components using the `dsl.load_component` method, this way, we can use them in our pipeline like functions.

```Python
from azure.ml import dsl, MLClient
from azure.ml.dsl import Pipeline
from azure.ml.entities import Component as ComponentEntity, Dataset
from pathlib import Path


# Let's load the data-prep registered component from the workspace
data_prep_func = dsl.load_component(
    client=ml_client,
    name=data_prep_component.name,
    version=data_prep_component.version,
)

# Let's load the train registered component from the workspace
train_func = dsl.load_component(
    client=ml_client,
    name=train_component.name,
    version=train_component.version,
)

```

Note: instead of loading the registered components, you can also load the component directly from the local code and yaml file. Here's how it would look:

```python
# load the train func from the local yaml file
train_func = dsl.load_component(
    yaml_file=os.path.join(train_src_dir, "train.yml")
)
```

These python functions returned by `dsl.load_component()` work as any regular python function that we'll use within a pipeline to call each step.

To code the pipeline, we use a specific `@dsl.pipeline` decorator that identifies the Azure ML pipelines. In the decorator, we can specify the pipeline description and default resources like compute and storage. Like a python function, pipelines can have inputs, you can then create multiple instances of a single pipeline with different inputs.

Here, we used *input data*, *split ratio* and *registered model name* as input variables. We then call the components and connect them via their inputs /outputs identifiers. The outputs of each step can be accessed via the `.outputs` property.


```Python
# the dsl decorator tells the sdk that we are defining an Azure ML pipeline
@dsl.pipeline(
    compute="cpu-cluster",
    description="E2E data_perp-train pipeline",
)
def credit_defaults_pipeline(
    pipeline_job_data_input,
    pipeline_job_test_train_ratio,
    pipeline_job_learning_rate,
    pipeline_job_registered_model_name,
):
    # using data_prep_function like a python call with its own inputs
    data_prep_job = data_prep_func(
        data=pipeline_job_data_input,
        test_train_ratio=pipeline_job_test_train_ratio,
    )

    # using train_func like a python call with its own inputs
    train_job = train_func(
        train_data=data_prep_job.outputs.train_data, # note: using outputs from previous step
        test_data=data_prep_job.outputs.test_data, # note: using outputs from previous step
        learning_rate=pipeline_job_learning_rate, # note: using a pipeline input as parameter
        registered_model_name=pipeline_job_registered_model_name,
    )

    # a pipeline returns a dict of outputs
    # keys will code for the pipeline output identifier
    return {
        "pipeline_job_train_data": data_prep_job.outputs.train_data,
        "pipeline_job_test_data": data_prep_job.outputs.test_data,
    }
```

Let's now use our pipeline definition to instantiate a pipeline with our dataset, split rate of choice and the name we picked for our model.

```Python
registered_model_name = "credit_defaults_model"

# Let's instantiate the pipeline with the parameters of our choice
pipeline = credit_defaults_pipeline(
    pipeline_job_data_input=credit_dataset,
    pipeline_job_test_train_ratio=0.2,
    pipeline_job_learning_rate=0.25,
    pipeline_job_registered_model_name=registered_model_name,
)
```

### Submitting a Job to Azure ML Workspace
It is now time to submit the job for running in Azure ML. This time we use `create_or_update`  on `ml_client.jobs`.

Here we also pass an experiment name. An experiment is a container for all the iterations one does on a certain project. All the jobs submitted under the same experiment name would be listed next to each other in Azure ML studio.

Once completed, the pipeline will have registered a model in your workspace as a result of training.

```Python
# submit the pipeline job
returned_job = ml_client.jobs.create_or_update(
    pipeline,
    
    # Project's name
    experiment_name="e2e_registered_components",
    
    # If there is no dependency, pipeline run will continue even after the failure of one component
    continue_run_on_step_failure=True,
)
# get a URL for the status of the job
returned_job.services["Studio"].endpoint
```

You can track the progress of your pipeline, by using the link generated in the cell above.
Clicking on each component, will reveal more information on that one. 
There are two important parts to look for at this stage:
- `Outputs+logs` > `user_logs` > `std_log.txt`
This section shows the script run sdtout
<div>
<img src="media/user-logs.jpg" width="600"/>
</div>

- `Outputs+logs` > `Metric`
This section shows different logged metrics. In this example. mlflow `autologging`, has automatically logged the training metrics.

<div>
<img src="media/metrics.jpg" width="600"/>
</div>


## Deploy the Model as an Online Endpoint
Let's learn how to deploy your machine learning model as a web service in the Azure cloud [sdkv1link](https://docs.microsoft.com/en-us/azure/machine-learning/how-to-deploy-and-where?tabs=azcli). 
A typical situation for a deployed machine learning service is that you need the following resources:

 - The model assets (filed, metadata) that you want deployed. We have already registered these in our training component.
 - Some code to run as a service. It executes the model on a given input request. This entry script receives data submitted to a deployed web service and passes it to the model. It then returns the model's response to the client. The script is specific to your model. The entry script must understand the data that the model expects and returns.

The two things you need to accomplish in your entry script are:

- Loading your model (using a function called `init()`)
- Running your model on input data (using a function called `run()`)

### Creating an Inference Script

In the following implementation the `init()` function loads the model, and the run function expects the data in `json` format with the input data stored under `data`.

```Python
deploy_dir = "./deploy"
os.makedirs(deploy_dir, exist_ok=True)
```

```Python
%%writefile {deploy_dir}/score.py
import os
import logging
import json
import numpy
import joblib


def init():
    """
    This function is called when the container is initialized/started, typically after create/update of the deployment.
    You can write the logic here to perform init operations like caching the model in memory
    """
    global model
    # AZUREML_MODEL_DIR is an environment variable created during deployment.
    # It is the path to the model folder (./azureml-models/$MODEL_NAME/$VERSION)
    model_path = os.path.join(os.getenv("AZUREML_MODEL_DIR"), "model.pkl")
    # deserialize the model file back into a sklearn model
    model = joblib.load(model_path)
    logging.info("Init complete")


def run(raw_data):
    """
    This function is called for every invocation of the endpoint to perform the actual scoring/prediction.
    In the example we extract the data from the json input and call the scikit-learn model's predict()
    method and return the result back
    """
    logging.info("Request received")
    data = json.loads(raw_data)["data"]
    data = numpy.array(data)
    result = model.predict(data)
    logging.info("Request processed")
    return result.tolist()
```

### Create a New Online Endpoint
It is now straight forward to create an online endpoint. First, we create an endpoint by providing its description. The deployment name needs to be unique in the entire azure region, therefore, for this tutorial, we create a unique name using [`UUID`](https://en.wikipedia.org/wiki/Universally_unique_identifier#:~:text=A%20universally%20unique%20identifier%20(UUID,%2C%20for%20practical%20purposes%2C%20unique.).

```Python
import uuid

# Creating a unique name for the endpoint
online_endpoint_name = "credit-endpoint-" + str(uuid.uuid4())[:8]

```

```Python
from azure.ml.entities import (
    ManagedOnlineEndpoint,
    ManagedOnlineDeployment,
    Model,
    Environment,
)

# create an online endpoint
endpoint = ManagedOnlineEndpoint(
    name=online_endpoint_name,
    description="this is an online endpoint",
    auth_mode="key",
    tags={
        "training_dataset": "credit_defaults",
        "model_type": "sklearn.GradientBoostingClassifier",
    },
)

endpoint = ml_client.begin_create_or_update(endpoint)

print(f"Endpint {endpoint.name} provisioning state: {endpoint.provisioning_state}")
```
If you have previously created an endpoint, you can retrieve it as below:

```Python
endpoint = ml_client.online_endpoints.get(name = online_endpoint_name)

print(f"Endpint \"{endpoint.name}\" with provisioning state \"{endpoint.provisioning_state}\" is retrieved")
```

### Deploy the Model to the Endpoint

Once the endpoint is created, we deploy the model with the entry script. Each endpoint can have multiple deployments and direct traffic to these deployments can be specified using rules. Here we create a single deployment that handles 100% of the incoming traffic. We have chosen a color name for our deployment, e.g. *blue*, *green*, *red* deployments, which is totally arbitrary.

You can check the *Models* page on the Azure ML Studio, to identify the latest version of your registered model. Alternatively, the code below can surface the latest version, if integer numbers are used for versioning.

```Python
# Let's pick the latest version of the model
latest_model_version = max(
    [int(m.version) for m in ml_client.models.list(name=registered_model_name)]
)
```

```Python
# picking the model to deploy. Here we use the latest version of our registered model
model = ml_client.models.get(name=registered_model_name, version=latest_model_version)


#create an online deployment.
blue_deployment = ManagedOnlineDeployment(
    name='blue',
    endpoint_name=online_endpoint_name,
    model=model,
    environment="AzureML-sklearn-0.24-ubuntu18.04-py37-cpu:21",
    code_local_path=deploy_dir,
    scoring_script="score.py",
    instance_type='Standard_DS3_v2',
    instance_count=1)

blue_deployment = ml_client.begin_create_or_update(blue_deployment)
```

### Test with a sample query

With the endpoint already published, we can run inference with it.

Let's create a sample request file following the design expected in the run method in the score script.

```Python
%%writefile {deploy_dir}/sample-request.json
{"data": [
    [20000,2,2,1,24,2,2,-1,-1,-2,-2,3913,3102,689,0,0,0,0,689,0,0,0,0], 
    [10,9,8,7,6,5,4,3,2,1, 10,9,8,7,6,5,4,3,2,1,10,9,8]
]}
```

```Python
# test the blue deployment with some sample data
ml_client.online_endpoints.invoke(
    endpoint_name=online_endpoint_name,
    request_file="./deploy/sample-request.json",
    deployment_name='blue'
)
```

The endpoint itself, can also be removed if no other deployment exists:
```python 
ml_client.online_endpoints.begin_delete(name=online_endpoint_name)
```

## Next Steps

Coming Soon - We are working on an expansion of this tutorial using Sweep Component (work in progress), and also using multi-node training and performing Hyper Parameter Optimization.

+ Learn about all of the [deployment options for Azure Machine Learning](how-to-deploy-and-where.md).
+ Learn how to [create clients for the web service](how-to-consume-web-service.md).
+ [Make predictions on large quantities of data](./tutorial-pipeline-batch-scoring-classification.md) asynchronously.
+ Monitor your Azure Machine Learning models with [Application Insights](how-to-enable-app-insights.md).
+ Try out the [automatic algorithm selection](tutorial-auto-train-models.md) tutorial.