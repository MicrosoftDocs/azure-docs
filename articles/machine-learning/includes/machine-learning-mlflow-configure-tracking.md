---
author: santiagxf
ms.service: machine-learning
ms.topic: include
ms.date: 01/02/2023
ms.author: fasantia
---

1. Get the tracking URI for your workspace:

    # [Azure CLI](#tab/cli)
    
    [!INCLUDE [cli v2](machine-learning-cli-v2.md)]
    
    1. Login and configure your workspace:
    
        ```bash
        az account set --subscription <subscription>
        az configure --defaults workspace=<workspace> group=<resource-group> location=<location> 
        ```
    
    1. You can get the tracking URI using the `az ml workspace` command:
    
        ```bash
        az ml workspace show --query mlflow_tracking_uri
        ```
        
    # [Python](#tab/python)
    
    [!INCLUDE [sdk v2](machine-learning-sdk-v2.md)]
    
    You can get the Azure ML MLflow tracking URI using the [Azure Machine Learning SDK v2 for Python](../concept-v2.md). Ensure you have the library `azure-ai-ml` installed in the compute you are using. The following sample gets the unique MLFLow tracking URI associated with your workspace.
    
    1. Login into your workspace using the `MLClient`. The easier way to do that is by using the workspace config file:
    
        ```python
        from azure.ai.ml import MLClient
        from azure.identity import DefaultAzureCredential
    
        ml_client = MLClient.from_config(credential=DefaultAzureCredential())
        ```
    
        > [!TIP]
        > You can download the workspace configuration file by:
        > 1. Navigate to [Azure ML studio](https://ml.azure.com)
        > 2. Click on the upper-right corner of the page -> Download config file.
        > 3. Save the file `config.json` in the same directory where you are working on.
    
    1. Alternatively, you can use the subscription ID, resource group name and workspace name to get it:
    
        ```python
        from azure.ai.ml import MLClient
        from azure.identity import DefaultAzureCredential
    
        #Enter details of your AzureML workspace
        subscription_id = '<SUBSCRIPTION_ID>'
        resource_group = '<RESOURCE_GROUP>'
        workspace_name = '<WORKSPACE_NAME>'
    
        ml_client = MLClient(credential=DefaultAzureCredential(),
                                subscription_id=subscription_id, 
                                resource_group_name=resource_group,
                                workspace_name=workspace_name)
        ```
    
        > [!IMPORTANT]
        > `DefaultAzureCredential` will try to pull the credentials from the available context. If you want to specify credentials in a different way, for instance using the web browser in an interactive way, you can use `InteractiveBrowserCredential` or any other method available in [`azure.identity`](https://pypi.org/project/azure-identity/) package.
    
    1. Get the Azure Machine Learning Tracking URI:
    
        ```python
        mlflow_tracking_uri = ml_client.workspaces.get(ml_client.workspace_name).mlflow_tracking_uri
        ```
    
    # [Studio](#tab/studio)
    
    Use the Azure Machine Learning portal to get the tracking URI:
    
    1. Open the [Azure Machine Learning studio portal](https://ml.azure.com) and log in using your credentials.

    1. In the upper right corner, click on the name of your workspace to show the __Directory + Subscription + Workspace__ blade.

    1. Click on __View all properties in Azure Portal__.

    1. On the __Essentials__ section, you will find the property __MLflow tracking URI__.
    
    
    # [Manually](#tab/manual)
    
    The Azure Machine Learning Tracking URI can be constructed using the subscription ID, region of where the resource is deployed, resource group name and workspace name. The following code sample shows how:
    
    > [!WARNING]
    > If you are working in a private link-enabled workspace, the MLflow endpoint will also use a private link to communicate with Azure Machine Learning. As a consequence, the tracking URI will look different as proposed here. You need to get the tracking URI using the Azure ML SDK or CLI v2 on those cases.
    
    ```python
    region = "<LOCATION>"
    subscription_id = '<SUBSCRIPTION_ID>'
    resource_group = '<RESOURCE_GROUP>'
    workspace_name = '<AML_WORKSPACE_NAME>'
    
    mlflow_tracking_uri = f"azureml://{region}.api.azureml.ms/mlflow/v1.0/subscriptions/{subscription_id}/resourceGroups/{resource_group}/providers/Microsoft.MachineLearningServices/workspaces/{workspace_name}"
    ```

1. Configuring the tracking URI:

    # [Using MLflow SDK](#tab/mlflow)
    
    Then the method [`set_tracking_uri()`](https://mlflow.org/docs/latest/python_api/mlflow.html#mlflow.set_tracking_uri) points the MLflow tracking URI to that URI.
    
    ```python
    import mlflow
    
    mlflow.set_tracking_uri(mlflow_tracking_uri)
    ```
    
    # [Using environment variables](#tab/environ)
    
    You can set the MLflow environment variables [MLFLOW_TRACKING_URI](https://mlflow.org/docs/latest/tracking.html#logging-to-a-tracking-server) in your compute to make any interaction with MLflow in that compute to point by default to Azure Machine Learning.
    
    ```bash
    MLFLOW_TRACKING_URI=$(az ml workspace show --query mlflow_tracking_uri | sed 's/"//g') 
    ```

    ---

    > [!TIP]
    > When working on shared environments, like an Azure Databricks cluster, Azure Synapse Analytics cluster, or similar, it is useful to set the environment variable `MLFLOW_TRACKING_URI` at the cluster level to automatically configure the MLflow tracking URI to point to Azure Machine Learning for all the sessions running in the cluster rather than to do it on a per-session basis.
