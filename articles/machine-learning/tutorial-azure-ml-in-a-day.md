---
title: "Quickstart: Azure ML in a day"
titleSuffix: Azure Machine Learning
description: Use Azure Machine Learning to train and deploy a model in a cloud-based Python Jupyter Notebook. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: quickstart
author: sdgilley
ms.author: sgilley
ms.reviewer: sgilley
ms.date: 02/27/2023
ms.custom: sdkv2, ignite-2022
#Customer intent: As a professional data scientist, I want to know how to build and deploy a model with Azure Machine Learning by using Python in a Jupyter Notebook.
---

# Quickstart: First look at Azure Machine Learning

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

Learn how a data scientist uses Azure Machine Learning to train a model, then use the model for prediction. This tutorial will help you become familiar with the core concepts of Azure Machine Learning and their most common usage.

You'll learn how to submit a *command job* to run your *training script* on a specified *compute cluster*, configured with the *job environment* necessary to run the script.

The *training script* handles the data preparation, then trains and registers a model. Once you have the model, you'll deploy it as an *endpoint*, then call the endpoint for inferencing.

## Prerequisites

* Complete the [Create resources you need to get started](quickstart-create-resources.md) if you need help to:
    * Create a workspace.
    * Create a cloud-based compute instance to use for your development environment.
    * Create a new notebook, if you want to copy/paste code into cells.
    * Or, open the notebook version of this tutorial by opening **tutorials/azureml-in-a-day/azureml-in-a-day.ipynb** from the **Samples** section of studio.  Then select **Clone** to add the notebook to your **Files**.

1. On the top bar above your opened notebook, you'll see the compute instance you created during the  [Quickstart: Set up your Azure Machine Learning cloud workstation](quickstart-create-resources.md)  to use for running the notebook.

1. If the compute instance is stopped, select **Start compute** and wait until it is running.

    :::image type="content" source="media/tutorial-azure-ml-in-a-day/start-compute.png" alt-text="Screenshot shows how to start compute if it is stopped.":::

2. Make sure that the kernel, found on the top right, is `Python 3.10 - SDK v2`.  If not, use the dropdown to select this kernel.

    :::image type="content" source="media/tutorial-azure-ml-in-a-day/set-kernel.png" alt-text="Screenshot shows how to set the kernel.":::


> [!Important]
> The rest of this tutorial contains cells of the tutorial notebook.  Copy/paste them into your new notebook, or switch to the notebook now if you cloned it.
>
> To run a single code cell in a notebook, click the code cell and hit **Shift+Enter**. Or, run the entire notebook by choosing **Run all** from the top toolbar.

<!-- nbstart https://raw.githubusercontent.com/Azure/azureml-examples/new-tutorial-series/quickstart/quickstart.ipynb -->


## Connect to the workspace

Before you dive in the code, you need to connect to your Azure Machine Learning workspace. 

We're using `DefaultAzureCredential` to get access to workspace. 
`DefaultAzureCredential` handles most Azure SDK authentication scenarios. 

In the next cell, enter your Subscription ID, Resource Group name and Workspace name. To find these values:

1. In the upper right Azure Machine Learning studio toolbar, select your workspace name.
1. Copy the value for workspace, resource group and subscription ID into the code.  
1. You'll need to copy one value, close the area and paste, then come back for the next one.

:::image type="content" source="media/tutorial-azure-ml-in-a-day/find-credentials.png" alt-text="Screenshot: find the credentials for your code in the upper right of the toolbar.":::

```python
from azure.ai.ml import MLClient
from azure.identity import DefaultAzureCredential

# authenticate
credential = DefaultAzureCredential()

# Get a handle to the workspace
ml_client = MLClient(
    credential=credential,
    subscription_id="<SUBSCRIPTION_ID>",
    resource_group_name="<RESOURCE_GROUP>",
    workspace_name="<AML_WORKSPACE_NAME>"
)
```

The result is a handler to the workspace that you'll use to manage other resources and jobs.

> [!IMPORTANT]
> Creating MLClient will not connect to the workspace. The client initialization is lazy, it will wait for the first time it needs to make a call (in the notebook below, that will happen during compute creation).

## Create a compute resource to run your job

You already have a compute resource you're using to run the notebook.  But now you'll add another type, a **compute cluster** that you'll use to run your training job. The compute cluster can be single or multi-node machines with Linux or Windows OS, or a specific compute fabric like Spark.

You'll provision a Linux compute cluster. See the [full list on VM sizes and prices](https://azure.microsoft.com/pricing/details/machine-learning/) .

For this example, you only need a basic cluster, so you'll use a Standard_DS3_v2 model with 2 vCPU cores, 7-GB RAM.


```python
from azure.ai.ml.entities import AmlCompute

# Name assigned to the compute cluster
cpu_compute_target = "cpu-cluster"

try:
    # let's see if the compute target already exists
    cpu_cluster = ml_client.compute.get(cpu_compute_target)
    print(
        f"You already have a cluster named {cpu_compute_target}, we'll reuse it as is."
    )

except Exception:
    print("Creating a new cpu compute target...")

    # Let's create the Azure ML compute object with the intended parameters
    cpu_cluster = AmlCompute(
        name=cpu_compute_target,
        # Azure ML Compute is the on-demand VM service
        type="amlcompute",
        # VM Family
        size="STANDARD_DS3_V2",
        # Minimum running nodes when there is no job running
        min_instances=0,
        # Nodes in cluster
        max_instances=4,
        # How many seconds will the node running after the job termination
        idle_time_before_scale_down=180,
        # Dedicated or LowPriority. The latter is cheaper but there is a chance of job termination
        tier="Dedicated",
    )
    print(
        f"AMLCompute with name {cpu_cluster.name} will be created, with compute size {cpu_cluster.size}"
    )
    # Now, we pass the object to MLClient's create_or_update method
    cpu_cluster = ml_client.compute.begin_create_or_update(cpu_cluster)
```

## What is a command job?

You'll create an Azure Machine Learning *command job* to train a model for credit default prediction. The command job is used to run a *training script* in a specified environment on a specified compute resource.  You've already created the environment and the compute resource.  Next you'll create the training script.

The *training script* handles the data preparation, training and registering of the trained model. In this tutorial, you'll create a Python training script.

Command jobs can be run from CLI, Python SDK, or studio interface. In this tutorial, you'll use the Azure Machine Learning Python SDK v2 to create and run the command job.

After running the training job, you'll deploy the model, then use it to produce a prediction.

## Create training script

Let's start by creating the training script - the *main.py* Python file.

First create a source folder for the script:


```python
import os

train_src_dir = "./src"
os.makedirs(train_src_dir, exist_ok=True)
```

This script handles the preprocessing of the data, splitting it into test and train data. It then consumes this data to train a tree based model and return the output model. 

[MLFlow](how-to-log-mlflow-models.md) will be used to log the parameters and metrics during our pipeline run. 

The cell below uses IPython magic to write the training script into the directory you just created.




```python
%%writefile {train_src_dir}/main.py
import os
import argparse
import pandas as pd
import mlflow
import mlflow.sklearn
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split

def main():
    """Main function of the script."""

    # input and output arguments
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", type=str, help="path to input data")
    parser.add_argument("--test_train_ratio", type=float, required=False, default=0.25)
    parser.add_argument("--n_estimators", required=False, default=100, type=int)
    parser.add_argument("--learning_rate", required=False, default=0.1, type=float)
    parser.add_argument("--registered_model_name", type=str, help="model name")
    args = parser.parse_args()
   
    # Start Logging
    mlflow.start_run()

    # enable autologging
    mlflow.sklearn.autolog()

    ###################
    #<prepare the data>
    ###################
    print(" ".join(f"{k}={v}" for k, v in vars(args).items()))

    print("input data:", args.data)
    
    credit_df = pd.read_csv(args.data, header=1, index_col=0)

    mlflow.log_metric("num_samples", credit_df.shape[0])
    mlflow.log_metric("num_features", credit_df.shape[1] - 1)

    train_df, test_df = train_test_split(
        credit_df,
        test_size=args.test_train_ratio,
    )
    ####################
    #</prepare the data>
    ####################

    ##################
    #<train the model>
    ##################
    # Extracting the label column
    y_train = train_df.pop("default payment next month")

    # convert the dataframe values to array
    X_train = train_df.values

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
    ###################
    #</train the model>
    ###################

    ##########################
    #<save and register model>
    ##########################
    # Registering the model to the workspace
    print("Registering the model via MLFlow")
    mlflow.sklearn.log_model(
        sk_model=clf,
        registered_model_name=args.registered_model_name,
        artifact_path=args.registered_model_name,
    )

    # Saving the model to a file
    mlflow.sklearn.save_model(
        sk_model=clf,
        path=os.path.join(args.registered_model_name, "trained_model"),
    )
    ###########################
    #</save and register model>
    ###########################
    
    # Stop Logging
    mlflow.end_run()

if __name__ == "__main__":
    main()
```

As you can see in this script, once the model is trained, the model file is saved and registered to the workspace. Now you can use the registered model in inferencing endpoints.

## Configure the command

Now that you have a script that can perform the desired tasks, you'll use the general purpose **command** that can run command line actions. This command line action can be directly calling system commands or by running a script. 

Here, you'll create input variables to specify the input data, split ratio, learning rate and registered model name.  The command script will:
* Use the compute created earlier to run this command.
* Use an *environment* that defines software and runtime libraries needed for the training script. Azure Machine Learning provides many curated or ready-made environments, which are useful for common training and inference scenarios. You'll use one of those environments here.  In the [Train a model](tutorial-train-model.md) tutorial, you'll learn how to create a custom environment. 
* Configure some metadata like display name, experiment name etc. An *experiment* is a container for all the iterations you do on a certain project. All the jobs submitted under the same experiment name would be listed next to each other in Azure ML studio.
* Configure the command line action itself - `python main.py` in this case. The inputs/outputs are accessible in the command via the `${{ ... }}` notation.
* In this sample, we access the data from a file on the internet. 


```python
from azure.ai.ml import command
from azure.ai.ml import Input

registered_model_name = "credit_defaults_model"

job = command(
    inputs=dict(
        data=Input(
            type="uri_file",
            path="https://azuremlexamples.blob.core.windows.net/datasets/credit_card/default_of_credit_card_clients.csv",
        ),
        test_train_ratio=0.2,
        learning_rate=0.25,
        registered_model_name=registered_model_name,
    ),
    code="./src/",  # location of source code
    command="python main.py --data ${{inputs.data}} --test_train_ratio ${{inputs.test_train_ratio}} --learning_rate ${{inputs.learning_rate}} --registered_model_name ${{inputs.registered_model_name}}",
    environment="AzureML-sklearn-1.0-ubuntu20.04-py38-cpu@latest",
    compute="cpu-cluster",
    experiment_name="train_model_credit_default_prediction",
    display_name="credit_default_prediction",
)
```

## Submit the job 

It's now time to submit the job to run in Azure Machine Learning. This time you'll use `create_or_update`  on `ml_client.jobs`.


```python
ml_client.create_or_update(job)
```

## View job output and wait for job completion

View the job in Azure Machine Learning studio by selecting the link in the output of the previous cell.

The output of this job will look like this in the Azure Machine Learning studio. Explore the tabs for various details like metrics, outputs etc. Once completed, the job will register a model in your workspace as a result of training. 

:::image type="content" source="media/tutorial-azure-ml-in-a-day/view-job.gif" alt-text="Screenshot shows the overview page for the job.":::

> [!IMPORTANT]
> Wait until the status of the job is complete before returning to this notebook to continue. The job will take 2 to 3 minutes to run. It could take longer (up to 10 minutes) if the compute cluster has been scaled down to zero nodes and custom environment is still building.



## Deploy the model as an online endpoint

Now deploy your machine learning model as a web service in the Azure cloud, an [`online endpoint`](concept-endpoints.md).

To deploy a machine learning service, you usually need:

* The model assets (file, metadata) that you want to deploy. You've already registered these assets in your training job.
* Some code to run as a service. The code executes the model on a given input request. This entry script receives data submitted to a deployed web service and passes it to the model, then returns the model's response to the client. The script is specific to your model. The entry script must understand the data that the model expects and returns. With an MLFlow model, as in this tutorial, this script is automatically created for you. Samples of scoring scripts can be found [here](https://github.com/Azure/azureml-examples/tree/sdk-preview/sdk/endpoints/online).


## Create a new online endpoint

Now that you have a registered model and an inference script, it's time to create your online endpoint. The endpoint name needs to be unique in the entire Azure region. For this tutorial, you'll create a unique name using [`UUID`](https://en.wikipedia.org/wiki/Universally_unique_identifier).


```python
import uuid

# Creating a unique name for the endpoint
online_endpoint_name = "credit-endpoint-" + str(uuid.uuid4())[:8]
```

> [!NOTE]
> Expect the endpoint creation to take approximately 6 to 8 minutes.


```python
from azure.ai.ml.entities import (
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

endpoint = ml_client.online_endpoints.begin_create_or_update(endpoint).result()

print(f"Endpoint {endpoint.name} provisioning state: {endpoint.provisioning_state}")
```

Once you've created an endpoint, you can retrieve it as below:


```python
endpoint = ml_client.online_endpoints.get(name=online_endpoint_name)

print(
    f'Endpoint "{endpoint.name}" with provisioning state "{endpoint.provisioning_state}" is retrieved'
)
```

## Deploy the model to the endpoint

Once the endpoint is created, deploy the model with the entry script. Each endpoint can have multiple deployments. Direct traffic to these deployments can be specified using rules. Here you'll create a single deployment that handles 100% of the incoming traffic. We have chosen a color name for the deployment, for example, *blue*, *green*, *red* deployments, which is arbitrary.

You can check the **Models** page on the Azure Machine Learning studio, to identify the latest version of your registered model. Alternatively, the code below will retrieve the latest version number for you to use.


```python
# Let's pick the latest version of the model
latest_model_version = max(
    [int(m.version) for m in ml_client.models.list(name=registered_model_name)]
)
```

Deploy the latest version of the model.  

> [!NOTE]
> Expect this deployment to take approximately 6 to 8 minutes.


```python
# picking the model to deploy. Here we use the latest version of our registered model
model = ml_client.models.get(name=registered_model_name, version=latest_model_version)


# create an online deployment.
blue_deployment = ManagedOnlineDeployment(
    name="blue",
    endpoint_name=online_endpoint_name,
    model=model,
    instance_type="Standard_DS3_v2",
    instance_count=1,
)

blue_deployment = ml_client.begin_create_or_update(blue_deployment).result()
```

### Test with a sample query

Now that the model is deployed to the endpoint, you can run inference with it.

Create a sample request file following the design expected in the run method in the score script.


```python
deploy_dir = "./deploy"
os.makedirs(deploy_dir, exist_ok=True)
```


```python
%%writefile {deploy_dir}/sample-request.json
{
  "input_data": {
    "columns": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22],
    "index": [0, 1],
    "data": [
            [20000,2,2,1,24,2,2,-1,-1,-2,-2,3913,3102,689,0,0,0,0,689,0,0,0,0],
            [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 10, 9, 8]
        ]
  }
}
```


```python
# test the blue deployment with some sample data
ml_client.online_endpoints.invoke(
    endpoint_name=online_endpoint_name,
    request_file="./deploy/sample-request.json",
    deployment_name="blue",
)
```

## Clean up resources

If you're not going to use the endpoint, delete it to stop using the resource.  Make sure no other deployments are using an endpoint before you delete it.


> [!NOTE]
> Expect this step to take approximately 6 to 8 minutes.


```python
ml_client.online_endpoints.begin_delete(name=online_endpoint_name)
```

<!-- nbend -->


### Delete everything

Use these steps to delete your Azure Machine Learning workspace and all compute resources.

[!INCLUDE [aml-delete-resource-group](../../includes/aml-delete-resource-group.md)]


## Next steps

+ Convert this tutorial into a production ready [pipeline with reusable components](tutorial-pipeline-python-sdk.md).
+ Learn about all of the [deployment options](how-to-deploy-online-endpoints.md) for Azure Machine Learning.
+ Learn how to [authenticate to the deployed model](how-to-authenticate-online-endpoint.md).
