---
title: Progressive rollout of MLflow models to Online Endpoints
titleSuffix: Azure Machine Learning
description: Learn to deploy your MLflow model progressively using MLflow SDK.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
ms.date: 03/31/2022
ms.topic: how-to
ms.custom: deploy, mlflow, devplatv2, no-code-deployment, devx-track-azurecli, cliv2, event-tier1-build-2022
ms.devlang: azurecli
---

# Progressive rollout of MLflow models to Online Endpoints

In this article, you'll learn how you can progressively update and deploy MLflow models to Online Endpoints without causing service disruption. You'll use blue-green deployment, also known as a safe rollout strategy, to introduce a new version of a web service to production. This strategy will allow you to roll out your new version of the web service to a small subset of users or requests before rolling it out completely.

## About this example

Online Endpoints have the concept of __Endpoint__ and __Deployment__. An endpoint represents the API that customers use to consume the model, while the deployment indicates the specific implementation of that API. This distinction allows users to decouple the API from the implementation and to change the underlying implementation without affecting the consumer. This example will use such concepts to update the deployed model in endpoints without introducing service disruption. 

The model we will deploy is based on the [UCI Heart Disease Data Set](https://archive.ics.uci.edu/ml/datasets/Heart+Disease). The database contains 76 attributes, but we are using a subset of 14 of them. The model tries to predict the presence of heart disease in a patient. It is integer valued from 0 (no presence) to 1 (presence). It has been trained using an `XGBBoost` classifier and all the required preprocessing has been packaged as a `scikit-learn` pipeline, making this model an end-to-end pipeline that goes from raw data to predictions.

The information in this article is based on code samples contained in the [azureml-examples](https://github.com/azure/azureml-examples) repository. To run the commands locally without having to copy/paste files, clone the repo, and then change directories to `sdk/using-mlflow/deploy`.

### Follow along in Jupyter Notebooks

You can follow along this sample in the following notebooks. In the cloned repository, open the notebook: [mlflow_sdk_online_endpoints_progresive.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/using-mlflow/deploy/mlflow_sdk_online_endpoints_progresive.ipynb).

## Prerequisites

Before following the steps in this article, make sure you have the following prerequisites:

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
- Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the owner or contributor role for the Azure Machine Learning workspace, or a custom role allowing Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

Additionally, you will need to:

# [Azure CLI](#tab/cli)

- Install the Azure CLI and the ml extension to the Azure CLI. For more information, see [Install, set up, and use the CLI (v2)](how-to-configure-cli.md).

# [Python (Azure Machine Learning SDK)](#tab/sdk)

- Install the Azure Machine Learning SDK for Python
    
    ```bash
    pip install azure-ai-ml azure-identity
    ```
    
# [Python (MLflow SDK)](#tab/mlflow)

- Install the Mlflow SDK package `mlflow` and the Azure Machine Learning plug-in for MLflow `azureml-mlflow`.

    ```bash
    pip install mlflow azureml-mlflow
    ```

- If you are not running in Azure Machine Learning compute, configure the MLflow tracking URI or MLflow's registry URI to point to the workspace you are working on. See [Configure MLflow for Azure Machine Learning](how-to-use-mlflow-configure-tracking.md) for more details.

---

### Connect to your workspace

First, let's connect to Azure Machine Learning workspace where we are going to work on.

# [Azure CLI](#tab/cli)

```azurecli
az account set --subscription <subscription>
az configure --defaults workspace=<workspace> group=<resource-group> location=<location>
```

# [Python (Azure Machine Learning SDK)](#tab/sdk)

The workspace is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. In this section, we'll connect to the workspace in which you'll perform deployment tasks.

1. Import the required libraries:

    ```python
    from azure.ai.ml import MLClient, Input
    from azure.ai.ml.entities import ManagedOnlineEndpoint, ManagedOnlineDeployment, Model
    from azure.ai.ml.constants import AssetTypes
    from azure.identity import DefaultAzureCredential
    ```

2. Configure workspace details and get a handle to the workspace:

    ```python
    subscription_id = "<subscription>"
    resource_group = "<resource-group>"
    workspace = "<workspace>"
    
    ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace)
    ```

# [Python (MLflow SDK)](#tab/mlflow)

1. Import the required libraries

    ```python
    import json
    import mlflow
    import requests
    import pandas as pd
    from mlflow.deployments import get_deploy_client
    ```

1. Configure the deployment client

    ```python
    deployment_client = get_deploy_client(mlflow.get_tracking_uri())    
    ```

---

### Registering the model in the registry

Ensure your model is registered in Azure Machine Learning registry. Deployment of unregistered models is not supported in Azure Machine Learning. You can register a new model using the MLflow SDK:

# [Azure CLI](#tab/cli)

```azurecli
MODEL_NAME='heart-classifier'
az ml model create --name $MODEL_NAME --type "mlflow_model" --path "model"
```

# [Python (Azure Machine Learning SDK)](#tab/sdk)

```python
model_name = 'heart-classifier'
model_local_path = "model"

model = ml_client.models.create_or_update(
     Model(name=model_name, path=model_local_path, type=AssetTypes.MLFLOW_MODEL)
)
```

# [Python (MLflow SDK)](#tab/mlflow)

```python
model_name = 'heart-classifier'
model_local_path = "model"

registered_model = mlflow_client.create_model_version(
    name=model_name, source=f"file://{model_local_path}"
)
version = registered_model.version
```

---

## Create an online endpoint

Online endpoints are endpoints that are used for online (real-time) inferencing. Online endpoints contain deployments that are ready to receive data from clients and can send responses back in real time.

We are going to exploit this functionality by deploying multiple versions of the same model under the same endpoint. However, the new deployment will receive 0% of the traffic at the begging. Once we are sure about the new model to work correctly, we are going to progressively move traffic from one deployment to the other.

1. Endpoints require a name, which needs to be unique in the same region. Let's ensure to create one that doesn't exist:

    # [Azure CLI](#tab/cli)
    
    ```azurecli
    ENDPOINT_SUFIX=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w ${1:-5} | head -n 1)
    ENDPOINT_NAME="heart-classifier-$ENDPOINT_SUFIX"
    ```
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)
    
    ```python
    import random
    import string
    
    # Creating a unique endpoint name by including a random suffix
    allowed_chars = string.ascii_lowercase + string.digits
    endpoint_suffix = "".join(random.choice(allowed_chars) for x in range(5))
    endpoint_name = "heart-classifier-" + endpoint_suffix
    
    print(f"Endpoint name: {endpoint_name}")
    ```
    
    # [Python (MLflow SDK)](#tab/mlflow)

    ```python
    import random
    import string
    
    # Creating a unique endpoint name by including a random suffix
    allowed_chars = string.ascii_lowercase + string.digits
    endpoint_suffix = "".join(random.choice(allowed_chars) for x in range(5))
    endpoint_name = "heart-classifier-" + endpoint_suffix
    
    print(f"Endpoint name: {endpoint_name}")
    ```

1. Configure the endpoint

    # [Azure CLI](#tab/cli)
    
    __endpoint.yml__

    ```yaml
    $schema: https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.schema.json
    name: heart-classifier-edp
    auth_mode: key
    ```
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)
    
    ```python
    endpoint = ManagedOnlineEndpoint(
        name=endpoint_name,
        description="An endpoint to serve predictions of the UCI heart disease problem",
        auth_mode="key",
    )
    ```
    
    # [Python (MLflow SDK)](#tab/mlflow)

    We can configure the properties of this endpoint using a configuration file. In this case, we are configuring the authentication mode of the endpoint to be "key".
    
    ```python
    endpoint_config = {
        "auth_mode": "key",
        "identity": {
            "type": "system_assigned"
        }
    }
    ```

    Let's write this configuration into a `JSON` file:

    ```python
    endpoint_config_path = "endpoint_config.json"
    with open(endpoint_config_path, "w") as outfile:
        outfile.write(json.dumps(endpoint_config))
    ```

1. Create the endpoint:

    # [Azure CLI](#tab/cli)
    
    ```azurecli
    az ml online-endpoint create -n $ENDPOINT_NAME -f endpoint.yml
    ```
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)
    
    ```python
    ml_client.online_endpoints.begin_create_or_update(endpoint).result()
    ```
    
    # [Python (MLflow SDK)](#tab/mlflow)

    ```python
    endpoint = deployment_client.create_endpoint(
        name=endpoint_name,
        config={"endpoint-config-file": endpoint_config_path},
    )
    ```

1. Getting the authentication secret for the endpoint.

    # [Azure CLI](#tab/cli)
    
    ```azurecli
    ENDPOINT_SECRET_KEY=$(az ml online-endpoint get-credentials -n $ENDPOINT_NAME | jq -r ".accessToken")
    ```
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)
    
    ```python
    endpoint_secret_key = ml_client.online_endpoints.list_keys(
        name=endpoint_name
    ).access_token
    ```
    
    # [Python (MLflow SDK)](#tab/mlflow)

    This functionality is not available in the MLflow SDK. Go to [Azure Machine Learning studio](https://ml.azure.com), navigate to the endpoint and retrieve the secret key from there.

### Create a blue deployment

So far, the endpoint is empty. There are no deployments on it. Let's create the first one by deploying the same model we were working on before. We will call this deployment "default" and it will represent our "blue deployment".

1. Configure the deployment

    # [Azure CLI](#tab/cli)
    
    __blue-deployment.yml__

    ```yaml
    $schema: https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json
    name: default
    endpoint_name: heart-classifier-edp
    model: azureml:heart-classifier@latest
    instance_type: Standard_DS2_v2
    instance_count: 1
    ```
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)

    ```python
    blue_deployment_name = "default"
    ```

    Configure the hardware requirements of your deployment:
    
    ```python
    blue_deployment = ManagedOnlineDeployment(
        name=blue_deployment_name,
        endpoint_name=endpoint_name,
        model=model,
        instance_type="Standard_DS2_v2",
        instance_count=1,
    )
    ```

    If your endpoint doesn't have egress connectivity, use [model packaging (preview)](how-to-package-models.md) by including the argument `with_package=True`:

    ```python
    blue_deployment = ManagedOnlineDeployment(
        name=blue_deployment_name,
        endpoint_name=endpoint_name,
        model=model,
        instance_type="Standard_DS2_v2",
        instance_count=1,
        with_package=True,
    )
    ```
    
    # [Python (MLflow SDK)](#tab/mlflow)

    ```python
    blue_deployment_name = "default"
    ```

    To configure the hardware requirements of your deployment, you need to create a JSON file with the desired configuration:

    ```python
    deploy_config = {
        "instance_type": "Standard_DS2_v2",
        "instance_count": 1,
    }
    ```
    
    > [!NOTE]
    > The full specification of this configuration can be found at [Managed online deployment schema (v2)](reference-yaml-deployment-managed-online.md).
    
    Write the configuration to a file:

    ```python
    deployment_config_path = "deployment_config.json"
    with open(deployment_config_path, "w") as outfile:
        outfile.write(json.dumps(deploy_config))
    ```

1. Create the deployment

    # [Azure CLI](#tab/cli)
    
    ```azurecli
    az ml online-deployment create --endpoint-name $ENDPOINT_NAME -f blue-deployment.yml --all-traffic
    ```

    If your endpoint doesn't have egress connectivity, use model packaging (preview) by including the flag `--with-package`:

    ```azurecli
    az ml online-deployment create --with-package --endpoint-name $ENDPOINT_NAME -f blue-deployment.yml --all-traffic
    ```
    
    > [!TIP]
    > We set the flag `--all-traffic` in the create command, which will assign all the traffic to the new deployment.
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)
    
    ```python
    ml_client.online_deployments.begin_create_or_update(blue_deployment).result()
    ```
    
    # [Python (MLflow SDK)](#tab/mlflow)

    ```python
    blue_deployment = deployment_client.create_deployment(
        name=blue_deployment_name,
        endpoint=endpoint_name,
        model_uri=f"models:/{model_name}/{version}",
        config={"deploy-config-file": deployment_config_path},
    )    
    ```

1. Assign all the traffic to the deployment
    
    So far, the endpoint has one deployment, but none of its traffic is assigned to it. Let's assign it.

    # [Azure CLI](#tab/cli)
    
    *This step in not required in the Azure CLI since we used the `--all-traffic` during creation.*
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)
    
    ```python
    endpoint.traffic = { blue_deployment_name: 100 }
    ```
    
    # [Python (MLflow SDK)](#tab/mlflow)

    ```python
    traffic_config = {"traffic": {blue_deployment_name: 100}}
    ```

    Write the configuration to a file:

    ```python
    traffic_config_path = "traffic_config.json"
    with open(traffic_config_path, "w") as outfile:
        outfile.write(json.dumps(traffic_config))
    ```

1. Update the endpoint configuration:

    # [Azure CLI](#tab/cli)
    
    *This step in not required in the Azure CLI since we used the `--all-traffic` during creation.*
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)
    
    ```python
    ml_client.begin_create_or_update(endpoint).result()
    ```
    
    # [Python (MLflow SDK)](#tab/mlflow)

    ```python
    deployment_client.update_endpoint(
        endpoint=endpoint_name,
        config={"endpoint-config-file": traffic_config_path},
    )
    ```

1. Create a sample input to test the deployment

    # [Azure CLI](#tab/cli)
    
    __sample.yml__

    ```yaml
    {
        "input_data": {
            "columns": [
                "age",
                "sex",
                "cp",
                "trestbps",
                "chol",
                "fbs",
                "restecg",
                "thalach",
                "exang",
                "oldpeak",
                "slope",
                "ca",
                "thal"
            ],
            "data": [
                [ 48, 0, 3, 130, 275, 0, 0, 139, 0, 0.2, 1, 0, "normal" ]
            ]
        }
    }
    ```
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)
    
    The following code samples 5 observations from the training dataset, removes the `target` column (as the model will predict it), and creates a request in the file `sample.json` that can be used with the model deployment.

    ```python
    samples = (
        pd.read_csv("data/heart.csv")
        .sample(n=5)
        .drop(columns=["target"])
        .reset_index(drop=True)
    )
    
    with open("sample.json", "w") as f:
        f.write(
            json.dumps(
                {"input_data": json.loads(samples.to_json(orient="split", index=False))}
            )
        )
    ```
    
    # [Python (MLflow SDK)](#tab/mlflow)

    The following code samples 5 observations from the training dataset, removes the `target` column (as the model will predict it), and creates a request.

    ```python
    samples = (
        pd.read_csv("data/heart.csv")
        .sample(n=5)
        .drop(columns=["target"])
        .reset_index(drop=True)
    )    
    ```

1. Test the deployment

    # [Azure CLI](#tab/cli)
    
    ```azurecli
    az ml online-endpoint invoke --name $ENDPOINT_NAME --request-file sample.json
    ```
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)
    
    ```python
    ml_client.online_endpoints.invoke(
        endpoint_name=endpoint_name,
        request_file="sample.json",
    )
    ```
    
    # [Python (MLflow SDK)](#tab/mlflow)

    ```python
    deployment_client.predict(
        endpoint=endpoint_name, 
        df=samples
    )
    ```

### Create a green deployment under the endpoint

Let's imagine that there is a new version of the model created by the development team and it is ready to be in production. We can first try to fly this model and once we are confident, we can update the endpoint to route the traffic to it.

1. Register a new model version

    # [Azure CLI](#tab/cli)
    
    ```azurecli
    MODEL_NAME='heart-classifier'
    az ml model create --name $MODEL_NAME --type "mlflow_model" --path "model"
    ```
    
    Let's get the version number of the new model:

    ```azurecli
    VERSION=$(az ml model show -n heart-classifier --label latest | jq -r ".version")
    ```
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)
    
    ```python
    model_name = 'heart-classifier'
    model_local_path = "model"
    
    model = ml_client.models.create_or_update(
         Model(name=model_name, path=model_local_path, type=AssetTypes.MLFLOW_MODEL)
    )
    version = model.version
    ```
    
    # [Python (MLflow SDK)](#tab/mlflow)
    
    ```python
    model_name = 'heart-classifier'
    model_local_path = "model"
    
    registered_model = mlflow_client.create_model_version(
        name=model_name, source=f"file://{model_local_path}"
    )
    version = registered_model.version
    ```

1. Configure a new deployment

     # [Azure CLI](#tab/cli)
    
    __green-deployment.yml__

    ```yaml
    $schema: https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json
    name: xgboost-model
    endpoint_name: heart-classifier-edp
    model: azureml:heart-classifier@latest
    instance_type: Standard_DS2_v2
    instance_count: 1
    ```
    
    We will name the deployment as follows:

    ```azurecli
    GREEN_DEPLOYMENT_NAME="xgboost-model-$VERSION"
    ```
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)

    ```python
    green_deployment_name = f"xgboost-model-{version}"
    ```

    Configure the hardware requirements of your deployment:
    
    ```python
    green_deployment = ManagedOnlineDeployment(
        name=green_deployment_name,
        endpoint_name=endpoint_name,
        model=model,
        instance_type="Standard_DS2_v2",
        instance_count=1,
    )
    ```

    If your endpoint doesn't have egress connectivity, use model packaging (preview) by including the argument `with_package=True`:

    ```python
    green_deployment = ManagedOnlineDeployment(
        name=green_deployment_name,
        endpoint_name=endpoint_name,
        model=model,
        instance_type="Standard_DS2_v2",
        instance_count=1,
        with_package=True,
    )
    ```
    
    # [Python (MLflow SDK)](#tab/mlflow)

    ```python
    green_deployment_name = f"xgboost-model-{version}"
    ```

    To configure the hardware requirements of your deployment, you need to create a JSON file with the desired configuration:

    ```python
    deploy_config = {
        "instance_type": "Standard_DS2_v2",
        "instance_count": 1,
    }
    ```
    
    > [!TIP]
    > We are using the same hardware confirmation indicated in the `deployment-config-file`. However, there is no requirements to have the same configuration. You can configure different hardware for different models depending on the requirements.
    
    Write the configuration to a file:

    ```python
    deployment_config_path = "deployment_config.json"
    with open(deployment_config_path, "w") as outfile:
        outfile.write(json.dumps(deploy_config))
    ```

1. Create the new deployment

    # [Azure CLI](#tab/cli)
    
    ```azurecli
    az ml online-deployment create -n $GREEN_DEPLOYMENT_NAME --endpoint-name $ENDPOINT_NAME -f green-deployment.yml
    ```

    If your endpoint doesn't have egress connectivity, use model packaging (preview) by including the flag `--with-package`:

    ```azurecli
    az ml online-deployment create --with-package -n $GREEN_DEPLOYMENT_NAME --endpoint-name $ENDPOINT_NAME -f green-deployment.yml
    ```
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)
    
    ```python
    ml_client.online_deployments.begin_create_or_update(green_deployment).result()
    ```
    
    # [Python (MLflow SDK)](#tab/mlflow)

    ```python
    new_deployment = deployment_client.create_deployment(
        name=green_deployment_name,
        endpoint=endpoint_name,
        model_uri=f"models:/{model_name}/{version}",
        config={"deploy-config-file": deployment_config_path},
    ) 
    ```

1. Test the deployment without changing traffic

    # [Azure CLI](#tab/cli)
    
    ```azurecli
    az ml online-endpoint invoke --name $ENDPOINT_NAME --deployment-name $GREEN_DEPLOYMENT_NAME --request-file sample.json
    ```
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)
    
    ```python
    ml_client.online_endpoints.invoke(
        endpoint_name=endpoint_name,
        deployment_name=green_deployment_name
        request_file="sample.json",
    )
    ```
    
    # [Python (MLflow SDK)](#tab/mlflow)

    ```python
    deployment_client.predict(
        endpoint=endpoint_name, 
        deployment_name=green_deployment_name, 
        df=samples
    )
    ```

    ---

    > [!TIP]
    > Notice how now we are indicating the name of the deployment we want to invoke.

## Progressively update the traffic

One we are confident with the new deployment, we can update the traffic to route some of it to the new deployment. Traffic is configured at the endpoint level:

1. Configure the traffic:

    # [Azure CLI](#tab/cli)
    
    *This step in not required in the Azure CLI*
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)
    
    ```python
    endpoint.traffic = {blue_deployment_name: 90, green_deployment_name: 10}
    ```
    
    # [Python (MLflow SDK)](#tab/mlflow)

    ```python
    traffic_config = {"traffic": {blue_deployment_name: 90, green_deployment_name: 10}}
    ```

    Write the configuration to a file:

    ```python
    traffic_config_path = "traffic_config.json"
    with open(traffic_config_path, "w") as outfile:
        outfile.write(json.dumps(traffic_config))
    ```

1. Update the endpoint

    # [Azure CLI](#tab/cli)
    
    ```azurecli
    az ml online-endpoint update --name $ENDPOINT_NAME --traffic "default=90 $GREEN_DEPLOYMENT_NAME=10"
    ```
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)
    
    ```python
    ml_client.begin_create_or_update(endpoint).result()
    ```
    
    # [Python (MLflow SDK)](#tab/mlflow)

    ```python
    deployment_client.update_endpoint(
        endpoint=endpoint_name,
        config={"endpoint-config-file": traffic_config_path},
    )
    ```

1. If you decide to switch the entire traffic to the new deployment, update all the traffic:

    # [Azure CLI](#tab/cli)
    
    *This step in not required in the Azure CLI*
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)
    
    ```python
    endpoint.traffic = {blue_deployment_name: 0, green_deployment_name: 100}
    ```
    
    # [Python (MLflow SDK)](#tab/mlflow)

    ```python
    traffic_config = {"traffic": {blue_deployment_name: 0, green_deployment_name: 100}}
    ```

    Write the configuration to a file:

    ```python
    traffic_config_path = "traffic_config.json"
    with open(traffic_config_path, "w") as outfile:
        outfile.write(json.dumps(traffic_config))
    ```

1. Update the endpoint

    # [Azure CLI](#tab/cli)
    
    ```azurecli
    az ml online-endpoint update --name $ENDPOINT_NAME --traffic "default=0 $GREEN_DEPLOYMENT_NAME=100"
    ```
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)
    
    ```python
    ml_client.begin_create_or_update(endpoint).result()
    ```
    
    # [Python (MLflow SDK)](#tab/mlflow)

    ```python
    deployment_client.update_endpoint(
        endpoint=endpoint_name,
        config={"endpoint-config-file": traffic_config_path},
    )
    ```

1. Since the old deployment doesn't receive any traffic, you can safely delete it:

    # [Azure CLI](#tab/cli)
    
    ```azurecli
    az ml online-deployment delete --endpoint-name $ENDPOINT_NAME --name default
    ```
    
    # [Python (Azure Machine Learning SDK)](#tab/sdk)
    
    ```python
    ml_client.online_deployments.begin_delete(
        name=blue_deployment_name, 
        endpoint_name=endpoint_name
    )
    ```
    
    # [Python (MLflow SDK)](#tab/mlflow)

    ```python
    deployment_client.delete_deployment(
        blue_deployment_name, 
        endpoint=endpoint_name
    )
    ```

    ---

    > [!TIP]
    > Notice that at this point, the former "blue deployment" has been deleted and the new "green deployment" has taken the place of the "blue deployment".


## Clean-up resources

# [Azure CLI](#tab/cli)

```azurecli
az ml online-endpoint delete --name $ENDPOINT_NAME --yes
```

# [Python (Azure Machine Learning SDK)](#tab/sdk)

```python
ml_client.online_endpoints.begin_delete(name=endpoint_name)
```

# [Python (MLflow SDK)](#tab/mlflow)

```python
deployment_client.delete_endpoint(endpoint_name)
```

---

> [!IMPORTANT]
> Notice that deleting an endpoint also deletes all the deployments under it.

## Next steps

- [Deploy MLflow models to Batch Endpoints](how-to-mlflow-batch.md)
- [Using MLflow models for no-code deployment](how-to-log-mlflow-models.md)
