---
title: "Tutorial: Deploy a model"
titleSuffix: Azure Machine Learning
description: This tutorial covers how to deploy a model to production using Azure Machine Learning Python SDK v2.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
ms.date: 02/06/2023
ms.custom: mlops #add more custom tags
#Customer intent: This tutorial is intended to show users what is needed for deployment and present a high-level overview of how Azure Machine Learning handles deployment. Deployment isn't typically done by a data scientist, so the tutorial won't use Azure CLI examples. We will link to existing articles that use Azure CLI as needed. The code in the tutorial will use SDK v2. The tutorial will continue where the "Create reusable pipelines" tutorial stops.
---

<!-- nbstart https://raw.githubusercontent.com/Azure/azureml-examples/new-tutorial-series/tutorials/get-started-notebooks/deploy-model.ipynb -->

<!-- > [!TIP]
> Contents of _deploy-model.ipynb_. **[Open in GitHub](https://github.com/Azure/azureml-examples/blob/new-tutorial-series/tutorials/get-started-notebooks/deploy-model.ipynb)**. -->

# Deploy a model as an online endpoint

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

Learn to deploy a model to an online endpoint, using Azure Machine Learning (AzureML) Python SDK v2.

In this tutorial, you'll begin with the files for a trained MLflow model and walk through steps to register it. You'll create an endpoint with a first deployment, test the deployment with data, and retrieve the deployment details. You'll also create a second deployment and allocate some percentage of production traffic to it. After you obtain logs from the second deployment and are satisfied with its performance, you'll eventually send it all the production traffic and delete the first deployment.

The steps you'll take are:

> [!div class="checklist"]
> * Register your model
> * Create an endpoint and a first deployment
> * Deploy a trial run
> * Manually send test data to the deployment
> * Get details of the deployment
> * Create a second deployment
> * Manually scale the second deployment
> * Update allocation of production traffic between both deployments
> * Get details of the second deployment
> * Roll out the new deployment and delete the first one

## Prerequisites

1. If you already completed the earlier Day 1 tutorials, "Train model responsibly" or "Create reusable pipeline", you can skip to #3 in the prerequisites.
1. If you haven't completed either of these earlier tutorials, be sure to do the following: 
    * Access an Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) to begin.
    * Create an AzureML workspace and a compute resource if you don't have them already. The [Quickstart: Create workspace resources](quickstart-create-resources.md) provides steps that you can follow. Be sure to have enough quota (at least 15 cores) available for the [compute resources](/azure/virtual-machines/dv2-dsv2-series#dsv2-series).
    * Download the files and metadata for the model you'll deploy. You can find the files and metadata in the `azureml-examples/tutorials/get-started-notebooks/deploy/credit_defaults_model` directory. <mark> **update this location**</mark> 
1. Create a new notebook or copy the contents of our notebook.
    * Follow the [Quickstart: Run Juypter notebook in Azure Machine Learning studio](quickstart-run-notebooks.md) steps to create a new notebook.
    * Or use the steps in the quickstart to [clone the v2 tutorials folder](quickstart-run-notebooks.md#learn-from-sample-notebooks), then open the notebook from the **tutorials/azureml-in-a-day/azureml-in-a-day.ipynb** folder in your **File** section.<mark> **update these locations**</mark>

<!-- copied from "tutorial-azure-ml-in-a-day.md". Consider making an include file. -->
## Run your notebook

1. On the top bar, select the compute instance you created during the  [Quickstart: Get started with Azure Machine Learning](quickstart-create-resources.md)  to use for running the notebook.

2. Make sure that the kernel, found on the top right, is `Python 3.10 - SDK v2`.  If not, use the dropdown to select this kernel.

:::image type="content" source="media/tutorial-azure-ml-in-a-day/set-kernel.png" alt-text="Screenshot: Set the kernel.":::

> [!Important]
> The rest of this tutorial contains cells of the tutorial notebook.  Copy/paste them into your new notebook, or switch to the notebook now if you cloned it.
>
> To run a single code cell in a notebook, click the code cell and hit **Shift+Enter**. Or, run the entire notebook by choosing **Run all** from the top toolbar.

## Connect to the workspace
Before you dive in the code, you'll need to connect to your AzureML workspace. The workspace is the top-level resource for AzureML, providing a centralized place to work with all the artifacts you create when you use AzureML. In this section, we'll connect to the workspace in which you'll perform deployment tasks.

We're using `DefaultAzureCredential` to get access to the workspace. 
`DefaultAzureCredential` is used to handle most Azure SDK authentication scenarios. 

If `DefaultAzureCredential` doesn't work for you, you can access other available credentials by checking these references: [azure-identity reference doc](/python/api/azure-identity/azure.identity) and [Set up authentication for Azure Machine Learning resources and workflows](how-to-setup-authentication.md).

```python
# Handle to the workspace
from azure.ai.ml import MLClient

# Authentication package
from azure.identity import DefaultAzureCredential
```

However, if you want to use a browser to login and authenticate, you can uncomment the following code to use the `InteractiveBrowserCredential`.


```python
# Handle to the workspace
# from azure.ai.ml import MLClient

# Authentication package
# from azure.identity import InteractiveBrowserCredential
# credential = InteractiveBrowserCredential()
```

To connect to a workspace, you need identifier parameters—a Subscription ID, Resource Group name and Workspace name. You'll use these details in the `MLClient` from `azure.ai.ml` to get a handle to the required AzureML workspace. This example uses the [default Azure authentication](/python/api/azure-identity/azure.identity.defaultazurecredential).

In the next cell, replace the placeholder text `<RESOURCE_GROUP>` with your resource group name, `<SUBSCRIPTION_ID>` with your subscription ID, and `<AZUREML_WORKSPACE_NAME>` with your workspace name. To find these values:

1. In the top right of the Azure Machine Learning studio toolbar, select your workspace name.
2. Copy the value for workspace, resource group and subscription ID into the code.
3. You'll need to copy one value at a time, close the area, paste, then come back for the next one.


```python
# enter details of your AzureML workspace
subscription_id = "<SUBSCRIPTION_ID>"
resource_group = "<RESOURCE_GROUP>"
workspace = "<AZUREML_WORKSPACE_NAME>"
```


```python
# Get a handle to the workspace
ml_client = MLClient(
     DefaultAzureCredential(), subscription_id, resource_group, workspace
)
```

The result is a handle to the workspace that you'll use to manage other resources and jobs.

> [!IMPORTANT]
> Creating `MLClient` will not connect to the workspace. The client initialization is lazy and will wait for the first time it needs to make a call (in this notebook, that will happen during compute creation).


## Register the model

If you already completed the earlier Day 1 tutorials, "Train model responsibly" or "Create reusable pipeline", you've registered an MLflow model as part of the training script and can skip to the [Confirm that the model is registered](#confirm-that-the-model-is-registered) section.

If you didn't complete either of those tutorials, you'll need to register the model. Registering your model before deployment is a recommended best practice.

In this example, we specify the `path` (where to upload files from) inline. If you [cloned the tutorials folder](quickstart-run-notebooks.md#learn-from-sample-notebooks) <mark> **update this location**</mark>, then run the following code as-is. Otherwise, provide the path to the location on your local computer where you've stored the model's files. The SDK automatically uploads the files and registers the model.

For more information on registering your model as an asset, see [Register your model as an asset in Machine Learning by using the SDK](how-to-manage-models.md#register-your-model-as-an-asset-in-machine-learning-by-using-the-sdk).

```python
from azure.ai.ml.entities import Model
from azure.ai.ml.constants import AssetTypes

mlflow_model = Model(
    path="./deploy/credit_defaults_model/",
    type=AssetTypes.MLFLOW_MODEL,
    name="credit_defaults_model",
    description="MLflow Model created from local files.",
)
ml_client.models.create_or_update(mlflow_model)
```

### Confirm that the model is registered

You can check the **Models** page in AzureML studio to identify the latest version of your registered model. Alternatively, the code below will retrieve the latest version number for you to use.


```python
registered_model_name = "credit_defaults_model"

# Let's pick the latest version of the model
latest_model_version = max(
    [int(m.version) for m in ml_client.models.list(name=registered_model_name)]
)

print(latest_model_version)
```

Now that you have a registered model, you can create an endpoint and deployment. The next section will briefly cover some key details about these topics.

## Endpoints and deployments

After you train a machine learning model, you need to deploy it so that others can use it for inferencing. Azure Machine Learning allows you to create **endpoints** and **deployments** for this purpose.

An **endpoint**, in this context, is an HTTPS path that provides an interface for clients to send requests (input data) and receive the inferencing (scoring) output of a trained model. An endpoint provides:
- Authentication using "key & token" based auth 
- SSL termination 
- A stable scoring URI (endpoint-name.region.inference.ml.azure.com)


A **deployment** is a set of resources required for hosting the model that does the actual inferencing. 

A single endpoint can contain multiple deployments. Endpoints and deployments are independent Azure Resource Manager resources that appear in the Azure portal.

Azure Machine Learning allows you to implement both [online endpoints](concept-endpoints.md#what-are-online-endpoints) and [batch endpoints](concept-endpoints.md#what-are-batch-endpoints). In this tutorial, we'll walk you through the steps of implementing a managed online endpoint—that is, a web service in the Azure cloud that receives data from clients and sends back responses in real-time.

## Create an online endpoint

Now that you have a registered model, it's time to create your online endpoint. The endpoint name needs to be unique in the entire Azure region. For this tutorial, you'll create a unique name using a universally unique identifier [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier). For more information on the endpoint naming rules, see [managed online endpoint limits](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints).

> [!NOTE]
> Expect the endpoint creation to take approximately 6 to 8 minutes.

> [!TIP]
> * `auth_mode` : Use `key` for key-based authentication. Use `aml_token` for Azure Machine Learning token-based authentication. A `key` doesn't expire, but `aml_token` does expire. For more information on authenticating, see [Authenticate to an online endpoint](how-to-authenticate-online-endpoint.md).
> * Optionally, you can add a description and tags to your endpoint.


```python
import uuid

# Create a unique name for the endpoint
online_endpoint_name = "credit-endpoint-" + str(uuid.uuid4())[:8]
```

First, we'll define the endpoint, using the `ManagedOnlineEndpoint` class.


```python
from azure.ai.ml.entities import ManagedOnlineEndpoint

# define an online endpoint
endpoint = ManagedOnlineEndpoint(
    name=online_endpoint_name,
    description="this is an online endpoint",
    auth_mode="key",
    tags={
        "training_dataset": "credit_defaults",
         },
)
```

Using the `MLClient` created earlier, we'll now create the endpoint in the workspace. This command will start the endpoint creation and return a confirmation response while the endpoint creation continues.


```python
# create the online endpoint
endpoint = ml_client.online_endpoints.begin_create_or_update(endpoint).result()
```

Once you've created the endpoint, you can retrieve it as follows:


```python
endpoint = ml_client.online_endpoints.get(name=online_endpoint_name)

print(
    f'Endpoint "{endpoint.name}" with provisioning state "{endpoint.provisioning_state}" is retrieved'
)
```

## Understand online deployments

To deploy a model, you must have:

- Model files (or the name and version of a model that's already registered in your workspace).
- A scoring script, that is, code that executes the model on a given input request. The scoring script receives data submitted to a deployed web service and passes it to the model. The script then executes the model and returns its response to the client. The scoring script is specific to your model and must understand the data that the model expects as input and returns as output. For an MLflow model, as in this tutorial, this script is automatically created for you during model training. For an example of a scoring script, see the [Understand the scoring script](how-to-deploy-online-endpoints.md#understand-the-scoring-script) section of the "Deploy an ML model with an online endpoint" article.
- An environment in which the model runs. The environment can be a Docker image with Conda dependencies or a Dockerfile.
- Settings to specify the instance type and scaling capacity.

**Key aspects of a deployment**

* `name` - Name of the deployment.
* `endpoint_name` - Name of the endpoint that will contain the deployment.
* `model` - The model to use for the deployment. This value can be either a reference to an existing versioned model in the workspace or an inline model specification.
* `environment` - The environment to use for the deployment. This value can be either a reference to an existing versioned environment in the workspace or an inline environment specification. For more information on creating an environment, see 
[Manage Azure Machine Learning environments with the CLI & SDK (v2)](how-to-manage-environments-v2.md#create-an-environment).
* `code_configuration` - the configuration for the source code and scoring script.
    * `path`- Path to the source code directory for scoring the model.
    * `scoring_script` - Relative path to the scoring file in the source code directory.
* `instance_type` - The VM size to use for the deployment. For the list of supported sizes, see [Managed online endpoints SKU list](reference-managed-online-endpoints-vm-sku-list.md).
* `instance_count` - The number of instances to use for the deployment.
    
### Deployment using an MLflow model

AzureML supports no-code deployment of a model created and logged with MLflow. This means that you don't have to provide a scoring script or an environment during model deployment, as the scoring script and environment are automatically generated when training an MLflow model.

If you were using a custom model, though, you'd have to specify the environment and scoring script during deployment. See [Customizing MLflow model deployments with scoring script](how-to-deploy-mlflow-models-online-endpoints.md#customizing-mlflow-model-deployments) to learn how to use a scoring script.

> [!IMPORTANT]
> If you typically deploy models using scoring scripts and custom environments and want to achieve the same functionality using MLflow models, we recommend reading [Using MLflow models for no-code deployment](how-to-deploy-mlflow-models.md).

## Deploy the model to the endpoint

You'll begin by creating a single deployment that handles 100% of the incoming traffic. We've chosen an arbitrary color name (*blue*) for the deployment. To create the deployment for our endpoint, we'll use the `ManagedOnlineDeployment` class.

> [!NOTE]
> No need to specify an environment or scoring script as the model to deploy is an MLflow model.


```python
from azure.ai.ml.entities import ManagedOnlineDeployment

# Choosing the latest version of our registered model for deployment
model = ml_client.models.get(name=registered_model_name, version=latest_model_version)

# define an online deployment
blue_deployment = ManagedOnlineDeployment(
    name="blue",
    endpoint_name=online_endpoint_name,
    model=model,
    instance_type="Standard_DS3_v2",
    instance_count=1
)
```

Using the `MLClient` created earlier, we'll now create the deployment in the workspace. This command will start the deployment creation and return a confirmation response while the deployment creation continues.


```python
# create the online deployment
blue_deployment = ml_client.online_deployments.begin_create_or_update(blue_deployment).result()

# blue deployment takes 100 traffic
endpoint.traffic = {"blue": 100}
ml_client.online_endpoints.begin_create_or_update(endpoint).result()
```

### Check the status of the endpoint
You can check the status of the endpoint to see whether the model was deployed without error:


```python
# return an object that contains metadata for the endpoint
endpoint = ml_client.online_endpoints.get(name=online_endpoint_name)

# print a selection of the endpoint's metadata
print(f"Name: {endpoint.name}\nStatus: {endpoint.provisioning_state}\nDescription: {endpoint.description}")
```


```python
# existing traffic details
print(endpoint.traffic)

# Get the scoring URI
print(endpoint.scoring_uri)
```

### Test the endpoint with sample data

Using the `MLClient` created earlier, we'll get a handle to the endpoint. The endpoint can be invoked using the `invoke` command with the following parameters:

* `endpoint_name` - Name of the endpoint
* `request_file` - File with request data
* `deployment_name` - Name of the specific deployment to test in an endpoint

We'll send a sample request using a [json](https://github.com/Azure/azureml-examples/tree/main/sdk/python/endpoints/online/model-1/sample-request.json) file. <mark> **UPDATE link to json file in the repo** </mark>


```python
# test the blue deployment with some sample data
ml_client.online_endpoints.invoke(
    endpoint_name=online_endpoint_name,
    deployment_name="blue",
    request_file="./deploy/sample-request.json",
)
```

### Get logs of the deployment
Check the logs to see whether the endpoint/deployment were invoked successfuly
If you face errors, see [Troubleshooting online endpoints deployment](how-to-troubleshoot-online-endpoints.md).


```python
logs = ml_client.online_deployments.get_logs(name="blue", endpoint_name=online_endpoint_name, lines=50)
print(logs)
```

## Create a second deployment 
Deploy the model as a second deployment called `green`. For the purpose of our example, you'll deploy the same model. In a real use case, you'd want to deploy a new version of the model or a new model. 


```python
# picking the model to deploy. Here we use the latest version of our registered model
model = ml_client.models.get(name=registered_model_name, version=latest_model_version)

# define an online deployment
green_deployment = ManagedOnlineDeployment(
    name="green",
    endpoint_name=online_endpoint_name,
    model=model,
    instance_type="Standard_F4s_v2", #Standard_DS3_v2
    instance_count=1,
)

# create the online deployment
green_deployment = ml_client.online_deployments.begin_create_or_update(green_deployment).result()
```

### Scale deployment to handle more traffic

Using the `MLClient` created earlier, we'll get a handle to the `green` deployment. The deployment can be scaled by increasing or decreasing the `instance_count`.

In the following code, you'll increase the VM instance manually. However, note that it is also possible to autoscale online endpoints. Autoscale automatically runs the right amount of resources to handle the load on your application. Managed online endpoints support autoscaling through integration with the Azure monitor autoscale feature. To configure autoscaling, see [autoscale an online endpoint](how-to-autoscale-endpoints.md).


```python
# update definition of the deployment
green_deployment.instance_count = 2

# update the deployment
ml_client.online_deployments.begin_create_or_update(green_deployment).result()
```

## Update traffic allocation for deployments
You can split production traffic between deployments. You may first want to test the `green` deployment with sample data, just like you did for the `blue` deployment. Once you've tested your green deployment, allocate a small percentage of traffic to it.


```python
endpoint.traffic = {"blue": 80, "green": 20}
ml_client.online_endpoints.begin_create_or_update(endpoint).result()
```

You can test traffic allocation by invoking the endpoint several times:


```python
# You can invoke the endpoint several times
for i in range(30):
    ml_client.online_endpoints.invoke(
        endpoint_name=online_endpoint_name,
        request_file="./deploy/sample-request.json",
    )
```

Show logs from the `green` deployment to check that there were incoming requests and the model was scored successfully. 


```python
logs = ml_client.online_deployments.get_logs(name="green", endpoint_name=online_endpoint_name, lines=50)
print(logs)
```

### View metrics using Azure Monitor
You can view various metrics (request numbers, request latency, network bytes, CPU/GPU/Disk/Memory utilization, and more) for online endpoints/deployments in the metrics page of the AzureML studio.

![metrics page 1](./images/deploy-metrics-1.png)

If you open the metrics for the online endpoint, you can set it up to see metrics.

![metrics page 2](./images/deploy-metrics-2.png)

See [Monitor online endpoints](how-to-monitor-online-endpoints.md) for details.

### Send all traffic to the new deployment
Once you're fully satisfied with your `green` deployment, switch all traffic to it.


```python
endpoint.traffic = {"blue": 0, "green": 100}
ml_client.begin_create_or_update(endpoint).result()
```

### Delete the old deployment
Remove the old (blue) deployment:


```python
ml_client.online_deployments.begin_delete(
    name="blue", endpoint_name=online_endpoint_name
).result()
```

## Clean up resources

If you aren't going use the endpoint and deployment after completing this tutorial, you should delete them.

> [!NOTE]
> Expect this step to take approximately 6 to 8 minutes.


```python
ml_client.online_endpoints.begin_delete(name=online_endpoint_name).result()
```

<!-- nbend -->



### Delete everything

Use these steps to delete your Azure Machine Learning workspace and all compute resources.

[!INCLUDE [aml-delete-resource-group](../../includes/aml-delete-resource-group.md)]

## Next Steps

- Learn about all of the [deployment options](how-to-deploy-online-endpoints.md) for Azure Machine Learning.
- [Test the deployment with mirrored traffic (preview)](how-to-safely-rollout-online-endpoints.md#test-the-deployment-with-mirrored-traffic-preview)
- [Monitor online endpoints](how-to-monitor-online-endpoints.md)
- [Autoscale an online endpoint](how-to-autoscale-endpoints.md)
- [Customizing MLflow model deployments with scoring script](how-to-deploy-mlflow-models-online-endpoints.md#customizing-mlflow-model-deployments)
- [Manage Azure Machine Learning environments with the CLI & SDK (v2)](how-to-manage-environments-v2.md)
- [Use batch endpoints for batch scoring](how-to-use-batch-endpoint.md)
- [View costs for an Azure Machine Learning managed online endpoint](how-to-view-online-endpoints-costs.md)