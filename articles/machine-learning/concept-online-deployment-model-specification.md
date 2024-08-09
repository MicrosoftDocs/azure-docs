---
title: Specification of models to use in the deployment of an online endpoint
titleSuffix: Azure Machine Learning
description: Learn to specify the model to use for deployments in Azure Machine Learning online endpoints.
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
ms.date: 06/28/2024
reviewer: msakande
ms.topic: concept-article
ms.custom: how-to, devplatv2, cliv2, sdkv2
---

# Model specification in an online deployment configuration

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

In this article, you learn to use the deployment configuration to specify models that you want to use in online deployments. When deploying a model to an Azure Machine Learning online endpoint, you need to specify the model one of two ways:

- Provide the path to the model's location on your local computer
- Provide a reference to a versioned model that is already registered in your workspace.

In Azure Machine Learning, after you create your deployment, the environment variable `AZUREML_MODEL_DIR` points to the storage location within Azure where your model is stored.

## Deployment configurations with models that are stored locally

The following local folder structure illustrates how you can specify models that are available locally on your machine for use in an online deployment.

:::image type="content" source="media/concept-online-deployment-model-specification/multi-models-1.png" alt-text="A screenshot showing a local folder structure containing multiple models." lightbox="media/concept-online-deployment-model-specification/multi-models-1.png":::

### Deployment configuration with a single local model

To use a single model that you have on your local machine in a deployment, specify the `path` to the `model` in your deployment YAML. The following code is an example of the deployment YAML with the path `/Downloads/multi-models-sample/models/model_1/v1/sample_m1.pkl`:

```yml
$schema: https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json 
name: blue 
endpoint_name: my-endpoint 
model: 
  path: /Downloads/multi-models-sample/models/model_1/v1/sample_m1.pkl 
code_configuration: 
  code: ../../model-1/onlinescoring/ 
  scoring_script: score.py 
environment:  
  conda_file: ../../model-1/environment/conda.yml 
  image: mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04:latest 
instance_type: Standard_DS3_v2 
instance_count: 1 
```

In Azure Machine Learning, after you create your deployment to an online endpoint, the environment variable `AZUREML_MODEL_DIR` points to the storage location within Azure where your model is stored. For example, `/var/azureml-app/azureml-models/aaa-aaa-aaa-aaa-aaa/1` now contains the model `sample_m1.pkl`. 

Within your scoring script (`score.py`), you can load your model (in this example, `sample_m1.pkl`) in the script's `init()` function:

```python
def init(): 
    model_path = os.path.join(str(os.getenv("AZUREML_MODEL_DIR")), "sample_m1.pkl") 
    model = joblib.load(model_path) 
```

### Deployment configuration with several local models

Although the Azure CLI, Python SDK, and other client tools allow you to specify only one model per deployment in the deployment definition, you can still use multiple models in a deployment by registering a model folder that contains all the models as files or subdirectories. For more information on registering your assets, such as models, so that you can specify their registered names and versions during deployment, see [Register your model and environment](how-to-deploy-online-endpoints.md#register-your-model-and-environment).

In the previous example folder structure, you notice that there are several models in the `models` folder. To use these models, in your deployment YAML, you specify the path to the `models` folder as follows:

```yml
$schema: https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json 
name: blue 
endpoint_name: my-endpoint 
model: 
  path: /Downloads/multi-models-sample/models/ 
code_configuration: 
  code: ../../model-1/onlinescoring/ 
  scoring_script: score.py 
environment:  
  conda_file: ../../model-1/environment/conda.yml 
  image: mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04:latest 
instance_type: Standard_DS3_v2 
instance_count: 1 
```

After you create your deployment, the environment variable `AZUREML_MODEL_DIR` points to the storage location within Azure where your models are stored. For example, `/var/azureml-app/azureml-models/bbb-bbb-bbb-bbb-bbb/1` now contains the models and the file structure.

For this example, the contents of the `AZUREML_MODEL_DIR` folder look like this:

:::image type="content" source="media/concept-online-deployment-model-specification/multi-models-2.png" alt-text="A screenshot showing the folder structure of the storage location for multiple models." lightbox="media/concept-online-deployment-model-specification/multi-models-2.png":::

Within your scoring script (`score.py`), you can load your models in the `init()` function. The following code loads the `sample_m1.pkl` model:

```python
def init(): 
    model_path = os.path.join(str(os.getenv("AZUREML_MODEL_DIR")), "models","model_1","v1", "sample_m1.pkl ") 
    model = joblib.load(model_path) 
```

For an example of how to deploy several models to one deployment, see [Deploy multiple models to one deployment (CLI example)](https://github.com/Azure/azureml-examples/blob/main/cli/endpoints/online/custom-container/minimal/multimodel) and [Deploy multiple models to one deployment (SDK example)](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/online/custom-container/online-endpoints-custom-container-multimodel.ipynb).

> [!TIP]
> If you have more than 1500 files to register, consider compressing the files or subdirectories as .tar.gz when registering the models. To consume the models, you can unpack the files or subdirectories in the `init()` function of the scoring script. Alternatively, when you register the models, set the `azureml.unpack` property to `True`, to automatically unpack the files or subdirectories. In either case, unpacking the files happens once in the initialization stage.

## Deployment configuration with models that are registered in your workspace

You can use registered models in your deployment specifications by referencing their names in your deployment YAML. For example, the following deployment YAML configuration specifies the registered `model` name as `azureml:local-multimodel:3`:

```yml
$schema: https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json 
name: blue 
endpoint_name: my-endpoint 
model: azureml:local-multimodel:3 
code_configuration: 
  code: ../../model-1/onlinescoring/ 
  scoring_script: score.py 
environment:  
  conda_file: ../../model-1/environment/conda.yml 
  image: mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04:latest 
instance_type: Standard_DS3_v2 
instance_count: 1 
```

For this example, consider that `local-multimodel:3` contains the following model artifacts, which can be viewed from the **Models** tab in the Azure Machine Learning studio:

:::image type="content" source="media/concept-online-deployment-model-specification/multi-models-3.png" alt-text="A screenshot of a folder structure showing the model artifacts of  a registered model." lightbox="media/concept-online-deployment-model-specification/multi-models-3.png":::

After you create your deployment, the environment variable `AZUREML_MODEL_DIR` points to the storage location within Azure where your models are stored. For example, `/var/azureml-app/azureml-models/local-multimodel/3` contains the models and the file structure. `AZUREML_MODEL_DIR` points to the folder containing the root of the model artifacts. Based on this example, the contents of the `AZUREML_MODEL_DIR` folder look like this:

:::image type="content" source="media/concept-online-deployment-model-specification/multi-models-4.png" alt-text="A screenshot of the folder structure showing multiple models." lightbox="media/concept-online-deployment-model-specification/multi-models-4.png":::

Within your scoring script (`score.py`), you can load your models in the `init()` function. For example, load the `diabetes.sav` model:

```python
def init(): 
    model_path = os.path.join(str(os.getenv("AZUREML_MODEL_DIR"), "models", "diabetes", "1", "diabetes.sav") 
    model = joblib.load(model_path) 
```

## Deployment configuration for models that are available in the model catalog

For models in the model catalog, except for models under Azure OpenAI collection, you can use the model IDs that is shown in the model card to deploy them. Model IDs are in the format of `azureml://registries/{registry_name}/models/{model_name}/versions/{model_version}`. Some model cards include example notebooks that show how to use model ID for the deployment.

## Deployment configuration for models that are available in your organization's registry

Each model in the organization registries has model ID in the format of `azureml://registries/{registry_name}/models/{model_name}/versions/{model_version}`. Note that you may also use environments that are registered in the same registry.

## Related content

[Online endpoints and deployments for real-time inference](concept-endpoints-online.md)
[Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md)