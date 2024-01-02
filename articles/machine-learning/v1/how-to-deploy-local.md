---
title: How to run and deploy locally 
titleSuffix: Azure Machine Learning
description: 'This article describes how to use your local computer as a target for training, debugging, or deploying models created in Azure Machine Learning.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: joburges
author: ssalgadodev
ms.date: 08/15/2022
ms.topic: how-to
ms.custom: UpdateFrequency5, deploy, sdkv1, event-tier1-build-2022, build-2023
---

# Deploy models trained with Azure Machine Learning on your local machines 

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

This article describes how to use your local computer as a target for training or deploying models created in Azure Machine Learning. Azure Machine Learning is flexible enough to work with most Python machine learning frameworks. Machine learning solutions generally have complex dependencies that can be difficult to duplicate. This article will show you how to balance total control with ease of use.

Scenarios for local deployment include:

* Quickly iterating data, scripts, and models early in a project.
* Debugging and troubleshooting in later stages.
* Final deployment on user-managed hardware.

## Prerequisites

- An Azure Machine Learning workspace. For more information, see [Create workspace resources](../quickstart-create-resources.md).
- A model and an environment. If you don't have a trained model, you can use the model and dependency files provided in [this tutorial](../tutorial-train-deploy-notebook.md).
- The [Azure Machine Learning SDK for Python](/python/api/overview/azure/ml/intro).
- A conda manager, like Anaconda or Miniconda, if you want to mirror Azure Machine Learning package dependencies.
- Docker, if you want to use a containerized version of the Azure Machine Learning environment.

## Prepare your local machine

The most reliable way to locally run an Azure Machine Learning model is with a Docker image. A Docker image provides an isolated, containerized experience that duplicates, except for hardware issues, the Azure execution environment. For more information on installing and configuring Docker for development scenarios, see [Overview of Docker remote development on Windows](/windows/dev-environment/docker/overview).

It's possible to attach a debugger to a process running in Docker. (See [Attach to a running container](https://code.visualstudio.com/docs/remote/attach-container).) But you might prefer to debug and iterate your Python code without involving Docker. In this scenario, it's important that your local machine uses the same libraries that are used when you run your experiment in Azure Machine Learning. To manage Python dependencies, Azure uses [conda](https://docs.conda.io/). You can re-create the environment by using other package managers, but installing and configuring conda on your local machine is the easiest way to synchronize. 

> [!IMPORTANT]
> GPU base images can't be used for local deployment, unless the local deployment is on an Azure Machine Learning compute instance.  GPU base images are supported only on Microsoft Azure Services such as Azure Machine Learning compute clusters and instances, Azure Container Instance (ACI), Azure VMs, or Azure Kubernetes Service (AKS).

## Prepare your entry script

Even if you use Docker to manage the model and dependencies, the Python scoring script must be local. The script must have two methods:

- An `init()` method that takes no arguments and returns nothing 
- A `run()` method that takes a JSON-formatted string and returns a JSON-serializable object

The argument to the `run()` method will be in this form: 

```json
{
    "data": <model-specific-data-structure>
}
```

The object you return from the `run()` method must implement `toJSON() -> string`.

The following example demonstrates how to load a registered scikit-learn model and score it by using NumPy data. This example is based on the model and dependencies of [this tutorial](../tutorial-train-deploy-notebook.md).

```python
import json
import numpy as np
import os
import pickle
import joblib

def init():
    global model
    # AZUREML_MODEL_DIR is an environment variable created during deployment.
    # It's the path to the model folder (./azureml-models/$MODEL_NAME/$VERSION).
    # For multiple models, it points to the folder containing all deployed models (./azureml-models).
    model_path = os.path.join(os.getenv('AZUREML_MODEL_DIR'), 'sklearn_mnist_model.pkl')
    model = joblib.load(model_path)

def run(raw_data):
    data = np.array(json.loads(raw_data)['data'])
    # Make prediction.
    y_hat = model.predict(data)
    # You can return any data type as long as it's JSON-serializable.
    return y_hat.tolist()
```

For more advanced examples, including automatic Swagger schema generation and scoring binary data (for example, images), see [Advanced entry script authoring](how-to-deploy-advanced-entry-script.md). 

## Deploy as a local web service by using Docker

The easiest way to replicate the environment used by Azure Machine Learning is to deploy a web service by using Docker. With Docker running on your local machine, you will:

1. Connect to the Azure Machine Learning workspace in which your model is registered.
1. Create a `Model` object that represents the model.
1. Create an `Environment` object that contains the dependencies and defines the software environment in which your code will run.
1. Create an `InferenceConfig` object that associates the entry script with the `Environment`.
1. Create a `DeploymentConfiguration` object of the subclass `LocalWebserviceDeploymentConfiguration`.
1. Use `Model.deploy()` to create a `Webservice` object. This method downloads the Docker image and associates it with the `Model`, `InferenceConfig`, and `DeploymentConfiguration`.
1. Activate the `Webservice` by using `Webservice.wait_for_deployment()`.

The following code shows these steps:

```python
from azureml.core.webservice import LocalWebservice
from azureml.core.model import InferenceConfig
from azureml.core.environment import Environment
from azureml.core import Workspace
from azureml.core.model import Model

ws = Workspace.from_config()
model = Model(ws, 'sklearn_mnist')


myenv = Environment.get(workspace=ws, name="tutorial-env", version="1")
inference_config = InferenceConfig(entry_script="score.py", environment=myenv)

deployment_config = LocalWebservice.deploy_configuration(port=6789)

local_service = Model.deploy(workspace=ws, 
                       name='sklearn-mnist-local', 
                       models=[model], 
                       inference_config=inference_config, 
                       deployment_config = deployment_config)

local_service.wait_for_deployment(show_output=True)
print(f"Scoring URI is : {local_service.scoring_uri}")
```

The call to `Model.deploy()` can take a few minutes. After you've initially deployed the web service, it's more efficient to use the `update()` method rather than starting from scratch. See [Update a deployed web service](how-to-deploy-update-web-service.md).


### Test your local deployment

When you run the previous deployment script, it will output the URI to which you can POST data for scoring (for example, `http://localhost:6789/score`). The following sample shows a script that scores sample data by using the `"sklearn-mnist-local"` locally deployed model. The model, if properly trained, infers that `normalized_pixel_values` should be interpreted as a "2". 

```python
import requests

normalized_pixel_values = "[\
0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, \
0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, \
0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, \
0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.5, 0.7, 1.0, 1.0, 0.6, 0.4, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, \
0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.9, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, \
0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.7, 1.0, 1.0, 1.0, 0.8, 0.6, 0.7, 1.0, 1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, \
0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.2, 1.0, 1.0, 0.8, 0.1, 0.0, 0.0, 0.0, 0.8, 1.0, 0.5, 0.0, 0.0, 0.0, 0.0, \
0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 1.0, 0.8, 0.1, 0.0, 0.0, 0.0, 0.5, 1.0, 1.0, 0.3, 0.0, 0.0, 0.0, \
0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.8, 1.0, 1.0, 0.3, 0.0, 0.0, \
0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 1.0, 1.0, 0.8, 0.0, 0.0, \
0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 1.0, 1.0, 0.9, 0.2, 0.0, \
0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 1.0, 1.0, 0.6, 0.0, \
0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.7, 1.0, 1.0, 0.6, 0.0, \
0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.9, 1.0, 0.9, 0.1, \
0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.8, 1.0, 1.0, 0.6, \
0.6, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 1.0, 1.0, 0.7, \
0.7, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.8, 1.0, 1.0, \
1.0, 0.6, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 1.0, 1.0, \
1.0, 0.7, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, \
1.0, 1.0, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, \
1.0, 1.0, 1.0, 0.2, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.1, 0.1, 0.1, 0.6, 0.6, 0.6, 0.6, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, \
0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.7, 0.6, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, \
0.0, 0.0, 0.7, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.7, 0.5, 0.5, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, \
0.0, 0.0, 0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.7, 1.0, 1.0, 1.0, 0.6, 0.5, 0.5, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, \
0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, \
0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, \
0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, \
0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]"

input_data = "{\"data\": [" + normalized_pixel_values + "]}"

headers = {'Content-Type': 'application/json'}

scoring_uri = "http://localhost:6789/score"
resp = requests.post(scoring_uri, input_data, headers=headers)

print("Should be predicted as '2'")
print("prediction:", resp.text)
```

## Download and run your model directly

Using Docker to deploy your model as a web service is the most common option. But you might want to run your code directly by using local Python scripts. You'll need two important components: 

- The model itself
- The dependencies upon which the model relies 

You can download the model:  

- From the portal, by selecting the **Models** tab, selecting the desired model, and on the **Details** page, selecting **Download**.
- From the command line, by using `az ml model download`. (See [model download.](/cli/azure/ml/model#az-ml-model-download))
- By using the Python SDK `Model.download()` method. (See [Model class.](/python/api/azureml-core/azureml.core.model.model#download-target-dir------exist-ok-false--exists-ok-none-))

An Azure model may be in whatever form your framework uses but is generally one or more serialized Python objects, packaged as a Python pickle file (`.pkl` extension). The contents of the pickle file depend on the machine learning library or technique used to train the model. For example, if you're using the model from the tutorial, you might load the model with:

```python
import pickle

with open('sklearn_mnist_model.pkl', 'rb') as f : 
    logistic_model = pickle.load(f, encoding='latin1')
```

Dependencies are always tricky to get right, especially with machine learning, where there can often be a dizzying web of specific version requirements. You can re-create an Azure Machine Learning environment on your local machine either as a complete conda environment or as a Docker image by using the `build_local()` method of the `Environment` class: 

```python
ws = Workspace.from_config()
myenv = Environment.get(workspace=ws, name="tutorial-env", version="1")
myenv.build_local(workspace=ws, useDocker=False) #Creates conda environment.
```

If you set the `build_local()` `useDocker` argument to `True`, the function will create a Docker image rather than a conda environment. If you want more control, you can use the `save_to_directory()` method of `Environment`, which writes conda_dependencies.yml and azureml_environment.json definition files that you can fine-tune and use as the basis for extension. 

The `Environment` class has many other methods for synchronizing environments across your compute hardware, your Azure workspace, and Docker images. For more information, see [Environment class](/python/api/azureml-core/azureml.core.environment(class)).

After you download the model and resolve its dependencies, there are no Azure-defined restrictions on how you perform scoring, fine-tune the model, use transfer learning, and so forth. 

## Upload a retrained model to Azure Machine Learning

If you have a locally trained or retrained model, you can register it with Azure. After it's registered, you can continue tuning it by using Azure compute or deploy it by using Azure facilities like [Azure Kubernetes Service](how-to-deploy-azure-kubernetes-service.md) or [Triton Inference Server (Preview)](../how-to-deploy-with-triton.md).

To be used with the Azure Machine Learning Python SDK, a model must be stored as a serialized Python object in pickle format (a `.pkl` file). It must also implement a `predict(data)` method that returns a JSON-serializable object. For example, you might store a locally trained scikit-learn diabetes model with: 

```python
import joblib

from sklearn.datasets import load_diabetes
from sklearn.linear_model import Ridge

dataset_x, dataset_y = load_diabetes(return_X_y=True)

sk_model = Ridge().fit(dataset_x, dataset_y)

joblib.dump(sk_model, "sklearn_regression_model.pkl")
```

To make the model available in Azure, you can then use the `register()` method of the `Model` class:

```python
from azureml.core.model import Model

model = Model.register(model_path="sklearn_regression_model.pkl",
                       model_name="sklearn_regression_model",
                       tags={'area': "diabetes", 'type': "regression"},
                       description="Ridge regression model to predict diabetes",
                       workspace=ws)
```

You can then find your newly registered model on the Azure Machine Learning **Model** tab:

:::image type="content" source="media/how-to-deploy-local/registered-model.png" alt-text="Screenshot of Azure Machine Learning Model tab, showing an uploaded model." lightbox="media/how-to-deploy-local/registered-model.png":::

For more information on uploading and updating models and environments, see [Register model and deploy locally with advanced usages](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/deployment/deploy-to-local/register-model-deploy-local-advanced.ipynb).

## Next steps

- For information on using VS Code with Azure Machine Learning, see [Launch Visual Studio Code remotely connected to a compute instance (preview)](../how-to-launch-vs-code-remote.md)
- For more information on managing environments, see [Create & use software environments in Azure Machine Learning](how-to-use-environments.md).
- To learn about accessing data from your datastore, see [Connect to storage services on Azure](how-to-access-data.md).
