---
title: Use and deploy existing models
titleSuffix: Azure Machine Learning
description: 'Learn how to bring ML models trained outside Azure to the Azure cloud with Azure Machine Learning. Then deploy the model as a web service or IoT module.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: jordane
author: jpe316
ms.reviewer: larryfr
ms.date: 07/17/2020
ms.topic: how-to
ms.custom: devx-track-python, deploy
---

# Deploy your existing model with Azure Machine Learning


In this article, you learn how to register and deploy a machine learning model you trained outside Azure Machine Learning. You can deploy as a web service or to an IoT Edge device.  Once deployed, you can monitor your model and detect data drift in Azure Machine Learning. 

For more information on the concepts and terms in this article, see [Manage, deploy, and monitor machine learning models](concept-model-management-and-deployment.md).

## Prerequisites

* [An Azure Machine Learning workspace](how-to-manage-workspace.md)
  + Python examples assume that the `ws` variable is set to your Azure Machine Learning workspace. For more information about how to connect to workspace, please refer to the [Azure Machine Learning SDK for Python documentation](/python/api/overview/azure/ml/#workspace).
  
  + CLI examples use placeholders of `myworkspace` and `myresourcegroup`, which you should replace with the name of your workspace and the resource group that contains it.

* The [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/install).  

* The [Azure CLI](/cli/azure/install-azure-cli) and [Machine Learning CLI extension](reference-azure-machine-learning-cli.md).

* A trained model. The model must be persisted to one or more files on your development environment. <br><br>To demonstrate registering a model trained, the example code in this article uses the models from [Paolo Ripamonti's Twitter sentiment analysis project](https://www.kaggle.com/paoloripamonti/twitter-sentiment-analysis).

## Register the model(s)

Registering a model allows you to store, version, and track metadata about models in your workspace. In the following Python and CLI examples, the `models` directory contains the `model.h5`, `model.w2v`, `encoder.pkl`, and `tokenizer.pkl` files. This example uploads the files contained in the `models` directory as a new model registration named `sentiment`:

```python
from azureml.core.model import Model
# Tip: When model_path is set to a directory, you can use the child_paths parameter to include
#      only some of the files from the directory
model = Model.register(model_path = "./models",
                       model_name = "sentiment",
                       description = "Sentiment analysis model trained outside Azure Machine Learning",
                       workspace = ws)
```

For more information, see the [Model.register()](/python/api/azureml-core/azureml.core.model%28class%29#register-workspace--model-path--model-name--tags-none--properties-none--description-none--datasets-none--model-framework-none--model-framework-version-none--child-paths-none--sample-input-dataset-none--sample-output-dataset-none--resource-configuration-none-) reference.

```azurecli
az ml model register -p ./models -n sentiment -w myworkspace -g myresourcegroup
```

> [!TIP]
> You can also set add `tags` and `properties` dictionary objects to the registered model. These values can be used later to help identify a specific model. For example, the framework used, training parameters, etc.

For more information, see the [az ml model register](/cli/azure/ml/model#az_ml_model_register) reference.


For more information on model registration in general, see [Manage, deploy, and monitor machine learning models](concept-model-management-and-deployment.md).

## Define inference configuration

The inference configuration defines the environment used to run the deployed model. The inference configuration references the following entities, which are used to run the model when it's deployed:

* An entry script, named `score.py`, loads the model when the deployed service starts. This script is also responsible for receiving data, passing it to the model, and then returning a response.
* An Azure Machine Learning [environment](how-to-use-environments.md). An environment defines the software dependencies needed to run the model and entry script.

The following example shows how to use the SDK to create an environment and then use it with an inference configuration:

```python
from azureml.core.model import InferenceConfig
from azureml.core.environment import Environment
from azureml.core.conda_dependencies import CondaDependencies

# Create the environment
myenv = Environment(name="myenv")
conda_dep = CondaDependencies()

# Define the packages needed by the model and scripts
conda_dep.add_conda_package("tensorflow")
conda_dep.add_conda_package("numpy")
conda_dep.add_conda_package("scikit-learn")
# You must list azureml-defaults as a pip dependency
conda_dep.add_pip_package("azureml-defaults")
conda_dep.add_pip_package("keras")
conda_dep.add_pip_package("gensim")

# Adds dependencies to PythonSection of myenv
myenv.python.conda_dependencies=conda_dep

inference_config = InferenceConfig(entry_script="score.py",
                                   environment=myenv)
```

For more information, see the following articles:

+ [How to use environments](how-to-use-environments.md).
+ [InferenceConfig](/python/api/azureml-core/azureml.core.model.inferenceconfig) reference.


The CLI loads the inference configuration from a YAML file:

```yaml
{
   "entryScript": "score.py",
   "runtime": "python",
   "condaFile": "myenv.yml"
}
```

With the CLI, the conda environment is defined in the `myenv.yml` file referenced by the inference configuration. The following YAML is the contents of this file:

```yaml
name: inference_environment
dependencies:
- python=3.6.2
- tensorflow
- numpy
- scikit-learn
- pip:
    - azureml-defaults
    - keras
    - gensim
```

For more information on inference configuration, see [Deploy models with Azure Machine Learning](how-to-deploy-and-where.md).

### Entry script (score.py)

The entry script has only two required functions, `init()` and `run(data)`. These functions are used to initialize the service at startup and run the model using request data passed in by a client. The rest of the script handles loading and running the model(s).

> [!IMPORTANT]
> There isn't a generic entry script that works for all models. It is always specific to the model that is used. It must understand how to load the model, the data format that the model expects, and how to score data using the model.

The following Python code is an example entry script (`score.py`):

```python
import os
import pickle
import json
import time
from keras.models import load_model
from keras.preprocessing.sequence import pad_sequences
from gensim.models.word2vec import Word2Vec

# SENTIMENT
POSITIVE = "POSITIVE"
NEGATIVE = "NEGATIVE"
NEUTRAL = "NEUTRAL"
SENTIMENT_THRESHOLDS = (0.4, 0.7)
SEQUENCE_LENGTH = 300

# Called when the deployed service starts
def init():
    global model
    global tokenizer
    global encoder
    global w2v_model

    # Get the path where the deployed model can be found.
    model_path = os.path.join(os.getenv('AZUREML_MODEL_DIR'), './models')
    # load models
    model = load_model(model_path + '/model.h5')
    w2v_model = Word2Vec.load(model_path + '/model.w2v')

    with open(model_path + '/tokenizer.pkl','rb') as handle:
        tokenizer = pickle.load(handle)

    with open(model_path + '/encoder.pkl','rb') as handle:
        encoder = pickle.load(handle)

# Handle requests to the service
def run(data):
    try:
        # Pick out the text property of the JSON request.
        # This expects a request in the form of {"text": "some text to score for sentiment"}
        data = json.loads(data)
        prediction = predict(data['text'])
        #Return prediction
        return prediction
    except Exception as e:
        error = str(e)
        return error

# Determine sentiment from score
def decode_sentiment(score, include_neutral=True):
    if include_neutral:
        label = NEUTRAL
        if score <= SENTIMENT_THRESHOLDS[0]:
            label = NEGATIVE
        elif score >= SENTIMENT_THRESHOLDS[1]:
            label = POSITIVE
        return label
    else:
        return NEGATIVE if score < 0.5 else POSITIVE

# Predict sentiment using the model
def predict(text, include_neutral=True):
    start_at = time.time()
    # Tokenize text
    x_test = pad_sequences(tokenizer.texts_to_sequences([text]), maxlen=SEQUENCE_LENGTH)
    # Predict
    score = model.predict([x_test])[0]
    # Decode sentiment
    label = decode_sentiment(score, include_neutral=include_neutral)

    return {"label": label, "score": float(score),
       "elapsed_time": time.time()-start_at}  
```

For more information on entry scripts, see [Deploy models with Azure Machine Learning](how-to-deploy-and-where.md).

## Define deployment

The [Webservice](/python/api/azureml-core/azureml.core.webservice) package contains the classes used for deployment. The class you use determines where the model is deployed. For example, to deploy as a web service on Azure Kubernetes Service, use [AksWebService.deploy_configuration()](/python/api/azureml-core/azureml.core.webservice.akswebservice#deploy-configuration-autoscale-enabled-none--autoscale-min-replicas-none--autoscale-max-replicas-none--autoscale-refresh-seconds-none--autoscale-target-utilization-none--collect-model-data-none--auth-enabled-none--cpu-cores-none--memory-gb-none--enable-app-insights-none--scoring-timeout-ms-none--replica-max-concurrent-requests-none--max-request-wait-time-none--num-replicas-none--primary-key-none--secondary-key-none--tags-none--properties-none--description-none--gpu-cores-none--period-seconds-none--initial-delay-seconds-none--timeout-seconds-none--success-threshold-none--failure-threshold-none--namespace-none--token-auth-enabled-none--compute-target-name-none-) to create the deployment configuration.

The following Python code defines a deployment configuration for a local deployment. This configuration deploys the model as a web service to your local computer.

> [!IMPORTANT]
> A local deployment requires a working installation of [Docker](https://www.docker.com/) on your local computer:

```python
from azureml.core.webservice import LocalWebservice

deployment_config = LocalWebservice.deploy_configuration()
```

For more information, see the [LocalWebservice.deploy_configuration()](/python/api/azureml-core/azureml.core.webservice.localwebservice#deploy-configuration-port-none-) reference.

The CLI loads the deployment configuration from a YAML file:

```YAML
{
    "computeType": "LOCAL"
}
```

Deploying to a different compute target, such as Azure Kubernetes Service in the Azure cloud, is as easy as changing the deployment configuration. For more information, see [How and where to deploy models](how-to-deploy-and-where.md).

## Deploy the model

The following example loads information on the registered model named `sentiment`, and then deploys it as a service named `sentiment`. During deployment, the inference configuration and deployment configuration are used to create and configure the service environment:

```python
from azureml.core.model import Model

model = Model(ws, name='sentiment')
service = Model.deploy(ws, 'myservice', [model], inference_config, deployment_config)

service.wait_for_deployment(True)
print(service.state)
print("scoring URI: " + service.scoring_uri)
```

For more information, see the [Model.deploy()](/python/api/azureml-core/azureml.core.model.model#deploy-workspace--name--models--inference-config-none--deployment-config-none--deployment-target-none--overwrite-false-) reference.

To deploy the model from the CLI, use the following command. This command deploys version 1 of the registered model (`sentiment:1`) using the inference and deployment configuration stored in the `inferenceConfig.json` and `deploymentConfig.json` files:

```azurecli
az ml model deploy -n myservice -m sentiment:1 --ic inferenceConfig.json --dc deploymentConfig.json
```

For more information, see the [az ml model deploy](/cli/azure/ml/model#az_ml_model_deploy) reference.

For more information on deployment, see [How and where to deploy models](how-to-deploy-and-where.md).

## Request-response consumption

After deployment, the scoring URI is displayed. This URI can be used by clients to submit requests to the service. The following example is a simple Python client that submits data to the service and displays the response:

```python
import requests
import json

scoring_uri = 'scoring uri for your service'
headers = {'Content-Type':'application/json'}

test_data = json.dumps({'text': 'Today is a great day!'})

response = requests.post(scoring_uri, data=test_data, headers=headers)
print(response.status_code)
print(response.elapsed)
print(response.json())
```

For more information on how to consume the deployed service, see [Create a client](how-to-consume-web-service.md).

## Next steps

* [Monitor your Azure Machine Learning models with Application Insights](how-to-enable-app-insights.md)
* [Collect data for models in production](how-to-enable-data-collection.md)
* [How to create a client for a deployed model](how-to-consume-web-service.md)