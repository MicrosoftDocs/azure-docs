---
title: Package and deploy models outside Azure Machine Learning (preview)
titleSuffix: Azure Machine Learning
description:  Learn how you can package a model to deploy outside of Azure Machine Learning for online serving.
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
reviewer: msakande
ms.service: machine-learning
ms.subservice: mlops
ms.date: 10/04/2023
ms.topic: how-to
---

# Package and deploy models outside Azure Machine Learning (preview)

Models can be deployed outside of Azure Machine Learning for online serving by creating model packages (preview), a capability in Azure Machine Learning that allows you to collect all the dependencies required to deploy a machine learning model to a serving platform. Packages can be moved across workspaces and even outside of Azure Machine Learning. To learn more about model packages, read [Model packages for deployment (preview)](concept-package-models.md).

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

In this article, you learn how package a model and deploy it to an Azure App Service.

## Prerequisites

Follow these steps to prepare your environment:

1. The example in this article is based on code samples contained in the [azureml-examples](https://github.com/azure/azureml-examples) repository. To run the commands locally without having to copy/paste YAML and other files, first clone the repo and then change directories to the folder:

    # [Azure CLI](#tab/cli)
    
    ```azurecli
    git clone https://github.com/Azure/azureml-examples --depth 1
    cd azureml-examples/cli
    ```
    
    # [Python](#tab/sdk)
    
    ```azurecli
    !git clone https://github.com/Azure/azureml-examples --depth 1
    !cd azureml-examples/sdk/python
    ```
    
    ---
    
    This article uses the example in the folder **endpoints/online/deploy-packages/mlflow-model**.

1. Let's connect to Azure Machine Learning workspace where we're going to work on.

    # [Azure CLI](#tab/cli)
    
    ```azurecli
    az account set --subscription <subscription>
    az configure --defaults workspace=<workspace> group=<resource-group> location=<location>
    ```
    
    # [Python](#tab/sdk)
    
    The workspace is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. In this section, we connect to the workspace in which you perform deployment tasks.
    
    1. Import the required libraries:
    
        ```python
        from azure.ai.ml import MLClient, Input
        from azure.ai.ml.entities import ManagedOnlineEndpoint, ManagedOnlineDeployment, Model
        from azure.ai.ml.constants import AssetTypes
        from azure.identity import DefaultAzureCredential
        ```
    
    2. If you're running in a Compute Instance in Azure Machine Learning, create an `MLClient` as follows:
    
        ```python
        ml_client = MLClient.from_config(DefaultAzureCredential())
        ```
    
        Otherwise, configure workspace details and get a handle to the workspace:
    
        ```python
        subscription_id = "<subscription>"
        resource_group = "<resource-group>"
        workspace = "<workspace>"
        
        ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace)
        ```
    
1. Packages require the model to be registered in either your workspace or in an Azure Machine Learning registry. In this example we have a local copy of the model in the repository, so we only need to publish the model to the registry in the workspace. You can skip this step if the model you're trying to deploy is already registered.
   
    # [Azure CLI](#tab/cli)
    
    ```azurecli
    MODEL_NAME='heart-classifier-mlflow'
    MODEL_PATH='model'
    az ml model create --name $MODEL_NAME --path $MODEL_PATH --type mlflow_model
    ```
    
    # [Python](#tab/sdk)
    
    ```python
    model_name = "heart-classifier-mlflow"
    model_path = "model"
    model = ml_client.models.create_or_update(
        Model(name=model_name, path=model_path, type=AssetTypes.MLFLOW_MODEL)
    )
    ```
    
## Deploy a model package to Azure App Service

Let's see how to package the previously registered MLflow model to deploy it to Azure App Service.

1. Deploying a model outside of Azure Machine Learning requires creating a package specification. To create a package completely disconnected from Azure Machine Learning we indicate the package to **copy** the artifacts inside of the package as done in the next example:

    # [Azure CLI](#tab/cli)

    Create a package YAML specification:
    
    __package-external.yml__
    
    ```yml
    $schema: http://azureml/sdk-2-0/ModelVersionPackage.json
    target_environment_name: heart-classifier-mlflow-pkg
    inferencing_server: 
        type: azureml_online
    model_configuration:
        mode: copy
    ```
    
    # [Python](#tab/sdk)
    
    ```python
    package_config = ModelPackage(
        target_environment_name="heart-classifier-mlflow-pkg",
        inferencing_server=AzureMLOnlineInferencingServer(),
        model_configuration=ModelConfiguration(
            mode="copy"
        )
    )
    ```
    ---
    
    > [!TIP]
    > Notice that we have indicated **model configuration** using *copy* for the property **mode**. This guarantees all the model artifacts are copied inside of the generated docker image instead of downloaded from Azure Machine Learning model registry, allowing true portability outside of Azure Machine Learning. For a full specification about all the options when creating packages see [Package a model for online deployment](how-to-package-models.md).

1. Let's start the package operation.

    # [Azure CLI](#tab/cli)
    
    ```azurecli
    az ml model package -n $MODEL_NAME -l latest --file package-external.yml
    ```
    
    # [Python](#tab/sdk)
    
    ```python
    model_package = ml_client.models.begin_package(model_name, model.version, package_config)
    ```

1. The result of the package operation is an environment in Azure Machine Learning. The advantage of them is that each environment has a corresponding docker image we can use in our external deployment. Images are hosted in Azure Container Registry. We need the name of the generated image:

    1. Go to [Azure Machine Learning studio](https://ml.azure.com).

    1. Select the section **Environments**.

    1. Select the tab **Custom environments**.

    1. Look for the environment named *heart-classifier-mlflow-package*, which is the name of the package we just created.

    1. Copy the value in the field **Azure container registry**.

    :::image type="content" source="./media/model-packaging/model-package-container-name.png" alt-text="An screenshot showing the section where the Azure container registry image name is displayed in Azure Machine Learning studio."::: 


1. Now, let's deploy this package in an App Service.

    1. Go to [Azure portal](https://portal.azure.com) and create a new App Service resource.

    1. In the creation wizard, select the subscription and resource group you're using.

    1. On __Instance details__, give the app a name.
    
    1. On __Publish__, select __Docker container__.

    1. On __Operative System__, select __Linux__.

        :::image type="content" source="./media/model-packaging/model-package-web-app-config.png" alt-text="An screenshot showing how to configure the app service to deploy the generated docker container image.":::

    1. Configure the rest of the page as needed and click on **Next**.

    1. On the **Docker** tab, on **Options**, select **Single Container**.
    
    1. On **Image Source**, select **Azure Container Registry**.

    1. Configure **Azure container registry options** as follows:

        1. On **Registry**, select the Azure Container Registry associated with Azure Machine Learning workspace.

        1. On **Image**, select the image that you found on step 3.5 of this tutorial.

        1. On **Tag**, select **latest**.
        
        :::image type="content" source="./media/model-packaging/model-package-web-app-docker.png" alt-text="An screenshot showing the section Docker of the wizard, where the docker image associated with the package is indicated.":::

    1. Configure the rest of the wizard as needed.

    1. Click on **Create**. The model is now deployed in the App Service just created.

    1. Depending on the inference server you used, the way you use to invoke and get predictions. In this example, we have used the Azure Machine Learning inferencing server, which creates predictions under the route `/score`. For more information about the input formats and features please see the details of the package [azureml-inference-server-http](https://pypi.org/project/azureml-inference-server-http/).

    1. Test the model deployment to see if it works. 

        ```bash
        cat -A sample-request.json | curl http://heart-classifier-mlflow-pkg.azurewebsites.net/score \
            --request POST \
            --header 'Content-Type: application/json' \
            --data-binary @-
        ```

## Next step

> [!div class="nextstepaction"]
> [Model packages for deployment (preview)](concept-package-models.md)


