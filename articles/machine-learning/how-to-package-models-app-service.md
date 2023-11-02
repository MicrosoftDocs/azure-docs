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

You can deploy models outside of Azure Machine Learning for online serving by creating model packages (preview). Azure Machine Learning allows you to create a model package that collects all the dependencies required for deploying a machine learning model to a serving platform. You can move a model package across workspaces and even outside of Azure Machine Learning. To learn more about model packages, see [Model packages for deployment (preview)](concept-package-models.md).

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

In this article, you learn how package a model and deploy it to an Azure App Service.

## Prerequisites

Before following the steps in this article, make sure you have the following prerequisites:

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* An Azure Machine Learning workspace. If you don't have one, use the steps in the [How to manage workspaces](how-to-manage-workspace.md)article to create one.

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the owner or contributor role for the Azure Machine Learning workspace, or a custom role. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).


## Prepare your system

Follow these steps to prepare your system. 

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
    
    This article uses the example in the folder **endpoints/online/deploy-with-packages/mlflow-model**.

1. Connect to the Azure Machine Learning workspace where you'll do your work.

    # [Azure CLI](#tab/cli)
    
    ```azurecli
    az account set --subscription <subscription>
    az configure --defaults workspace=<workspace> group=<resource-group> location=<location>
    ```
    
    # [Python](#tab/sdk)
    
    The workspace is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning. Here, you connect to the workspace in which you perform deployment tasks.
    
    1. Import the required libraries:
    
        ```python
        from azure.ai.ml import MLClient, Input
        from azure.ai.ml.entities import ManagedOnlineEndpoint, ManagedOnlineDeployment, Model
        from azure.ai.ml.constants import AssetTypes
        from azure.identity import DefaultAzureCredential
        ```
    
    1. If you're running in an Azure Machine Learning compute instance, create an `MLClient` as follows:
    
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
    
1. Packages require the model to be registered in either your workspace or in an Azure Machine Learning registry. In this example, there's a local copy of the model in the repository, so you only need to publish the model to the registry in the workspace. You can skip this step if the model you're trying to deploy is already registered.
   
    # [Azure CLI](#tab/cli)
    
    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/mlflow-model/deploy.sh" ID="register_model" :::
    
    # [Python](#tab/sdk)
    
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/deploy-with-packages/mlflow-model/sdk-deploy-and-test.ipynb?name=register_model)]
    
## Deploy a model package to the Azure App Service

In this section, you package the previously registered MLflow model and deploy it to the Azure App Service.

1. Deploying a model outside of Azure Machine Learning requires creating a package specification. To create a package that's completely disconnected from Azure Machine Learning, specify the `copy` mode in the model configuration. The `copy` mode tells the package to copy the artifacts inside of the package. The following code shows how to specify the copy mode for the model configuration:

    # [Azure CLI](#tab/cli)

    Create a package YAML specification:
    
    __package-external.yml__
    
    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/mlflow-model/package-external.yml" :::
    
    # [Python](#tab/sdk)
    
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/deploy-with-packages/mlflow-model/sdk-deploy-and-test.ipynb?name=configure_package_copy)]
    ---
    
    > [!TIP]
    > When you specify the **model configuration** using `copy` for the **mode** property, you guarantee that all the model artifacts are copied inside the generated docker image instead of downloaded from the Azure Machine Learning model registry, thereby allowing true portability outside of Azure Machine Learning. For a full specification about all the options when creating packages see [Create a package specification](how-to-package-models.md#create-a-package-specification).

1. Start the package operation.

    # [Azure CLI](#tab/cli)
    
    :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/mlflow-model/deploy.sh" ID="build_package_copy" :::
    
    # [Python](#tab/sdk)
    
    [!notebook-python[] (~/azureml-examples-main/sdk/python/endpoints/online/deploy-with-packages/mlflow-model/sdk-deploy-and-test.ipynb?name=build_package_copy)]

1. The result of the package operation is an environment in Azure Machine Learning. The advantage of having this environment is that each environment has a corresponding docker image that you can use in an external deployment. Images are hosted in the Azure Container Registry. The following steps show how you get the name of the generated image:

    1. Go to the [Azure Machine Learning studio](https://ml.azure.com).

    1. Select the **Environments** section.

    1. Select the **Custom environments** tab.

    1. Look for the environment named *heart-classifier-mlflow-package*, which is the name of the package you just created.

    1. Copy the value that's in the **Azure container registry** field.

    :::image type="content" source="./media/model-packaging/model-package-container-name.png" alt-text="A screenshot showing the section where the Azure container registry image name is displayed in Azure Machine Learning studio."::: 


1. Now, deploy this package in an App Service.

    1. Go to the [Azure portal](https://portal.azure.com) and create a new App Service resource.

    1. In the creation wizard, select the subscription and resource group you're using.

    1. In the __Instance details__ section, give the app a name.
    
    1. For __Publish__, select __Docker container__.

    1. For __Operating System__, select __Linux__.

        :::image type="content" source="./media/model-packaging/model-package-web-app-config.png" alt-text="A screenshot showing how to configure the app service to deploy the generated docker container image.":::

    1. Configure the rest of the page as needed and select **Next**.

    1. Go to the **Docker** tab.
    
    1. For **Options**, select **Single Container**.
    
    1. For **Image Source**, select **Azure Container Registry**.

    1. Configure the **Azure container registry options** as follows:

        1. For **Registry**, select the Azure Container Registry associated with the Azure Machine Learning workspace.

        1. For **Image**, select the image that you found in step 3(e) of this tutorial.

        1. For **Tag**, select **latest**.
        
        :::image type="content" source="./media/model-packaging/model-package-web-app-docker.png" alt-text="A screenshot showing the section Docker of the wizard, where the docker image associated with the package is indicated.":::

    1. Configure the rest of the wizard as needed.

    1. Select **Create**. The model is now deployed in the App Service you created.

    1. The way you invoke and get predictions depends on the inference server you used. In this example, you used the Azure Machine Learning inferencing server, which creates predictions under the route `/score`. For more information about the input formats and features, see the details of the package [azureml-inference-server-http](https://pypi.org/project/azureml-inference-server-http/).
  
    1. Prepare the request payload. The format for an MLflow model deployed with Azure Machine Learning inferencing server is as follows:

       :::code language="json" source="~/azureml-examples-main/cli/endpoints/online/deploy-with-packages/mlflow-model/sample-request.json" ::: 

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
