---
title: How to use an existing model
titleSuffix: Azure Machine Learning service
description: 'Learn how you can use Azure Machine Learning service with models that were trained outside the service. You can register models created outside Azure Machine Learning service, and then deploy them as a web service or Azure IoT Edge module.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: jordane
author: jpe316
ms.reviewer: larryfr
ms.date: 06/19/2019
---

# How to use an existing model with Azure Machine Learning service

Learn how to use an existing machine learning model with the Azure Machine Learning service.

If you have a machine learning model that was trained outside the Azure Machine Learning service, you can still use the service to deploy the model as a web service or to an IoT Edge device.

> [!NOTE]
> The information in this article can be used with both the Azure Machine Learning SDK or Machine Learning CLI extension.

## Prerequisites

* An Azure Machine Learning service workspace. For more information, see the [Create a workspace](setup-create-workspace.md) article.

    > [!TIP]
    > The Python examples in this article assume that the `ws` variable is set to your Azure Machine Learning service workspace.
    >
    > The CLI examples use a placeholder of `myworkspacee` and `myresourcegroup`. Replace these with the name of your workspace and the resource group that contains it.

* The Azure Machine Learning SDK. For more information, see the Python SDK section of the [Create a workspace](setup-create-workspace.md#sdk) article.

* The [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) and [Machine Learning CLI extension](reference-azure-machine-learning-cli.md).
* A trained model. The model must be persisted to one or more files.

    > [!NOTE]
    > The example code snippets in this article demonstrate how to register and deploy the four output files created from Paolo Ripamonti's Twitter sentiment analysis project at Kaggle: [https://www.kaggle.com/paoloripamonti/twitter-sentiment-analysis](https://www.kaggle.com/paoloripamonti/twitter-sentiment-analysis).

## Register the model(s)

Registering a model allows you to store, version, and apply metadata to your trained models. During registration, the model is uploaded to your Azure Machine Learning service workspace. From there, you can search, download, or deploy the model. When deploying, you can deploy as a web service or to an Azure IoT Edge device.

> [!TIP]
> Each time you register a model using the same name, the model version is automatically incremented. The first model registered with a specific name is version 1. The second registered with the same name is version 2, and so on. You can optionally add other metadata such as tags, properties, and descriptions.

> [!IMPORTANT]
> When registering a trained model, the model must be persisted to one or more files. These files are then used to register the model.

To register a model trained outside the Azure Machine Learning service, you must have the files on the local filesystem of your development environment. In the following examples, the `models` directory contains the `model.h5`, `model.w2v`, `encoder.pkl`, and `tokenizer.pkl` files:

```python
from azureml.core.model import Model

model = Model.register(model_path = "./models",
                       model_name = "sentiment",
                       description = "Sentiment analysis model trained outside Azure Machine Learning service",
                       workspace = ws)
```

```azurecli
az ml model register -p ./models -n sentiment -w myworkspace -g myresourcegroup
```

This example uploads the files contained in the `models` directory as a new model registration named `sentiment`.

## Define inference environment

Azure Machine Learning service uses the [InferenceConfig](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.inferenceconfig?view=azure-ml-py) class to define the inference environment for the model. The inference configuration references the following files that are used to run the model when it's deployed:

* The runtime. The only valid value for runtime currently is Python.
* An entry script. This file (named `score.py`) loads the model when the deployed service starts. It is also responsible for receiving data, passing it to the model, and then returning a response.
* A conda environment file. This file defines the Python packages needed to run the model and entry script. 

The following example shows a basic inference configuration using the Python SDK:

```python
from azureml.core.model import InferenceConfig

inference_config = InferenceConfig(runtime= "python", 
                                   entry_script="score.py",
                                   conda_file="myenv.yml")
```

The CLI loads the inference configuration from a YAML file:

```yaml
{
   "entryScript": "score.py",
   "runtime": "python",
   "condaFile": "myenv.yml"
}
```

### Entry script

The following Python code is an example entry script (`score.py`):

```python
import pickle
import json
import time
from keras.models import load_model
from keras.preprocessing.sequence import pad_sequences
from gensim.models.word2vec import Word2Vec
from azureml.core.model import Model

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

    # Get the path where the model(s) registered as the name 'sentiment' can be found.
    model_path = Model.get_model_path('sentiment')
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

The entry script has only two required functions, `init()` and `run(data)`. These functions are used to initialize the service at startup and run the model using request data passed in by a client. The rest of the script handles loading and running the model(s).

### Conda environment

The following YAML describes the conda environment needed to run the model and entry script:

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
```

## Define deployment

The [Webservice](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice?view=azure-ml-py) package contains the classes used for deployment. The class you use determines where the model is deployed. For example, to deploy as a web service on Azure Kubernetes Service, use [AksWebService.deploy_configuration()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.akswebservice?view=azure-ml-py#deploy-configuration-autoscale-enabled-none--autoscale-min-replicas-none--autoscale-max-replicas-none--autoscale-refresh-seconds-none--autoscale-target-utilization-none--collect-model-data-none--auth-enabled-none--cpu-cores-none--memory-gb-none--enable-app-insights-none--scoring-timeout-ms-none--replica-max-concurrent-requests-none--max-request-wait-time-none--num-replicas-none--primary-key-none--secondary-key-none--tags-none--properties-none--description-none--gpu-cores-none--period-seconds-none--initial-delay-seconds-none--timeout-seconds-none--success-threshold-none--failure-threshold-none--namespace-none-) to create the deployment configuration.

The following Python code defines a deployment configuration for a local deployment. This configuration deploys the model as a web service to your local computer.

> [!IMPORTANT]
> A local deployment requires a working installation of [Docker](https://www.docker.com/) on your local computer.

```python
from azureml.core.webservice import LocalWebservice

deployment_config = LocalWebservice.deploy_configuration()
```

The CLI loads the deployment configuration from a YAML file:

```YAML
{
    "computeType": "LOCAL"
}
```

> [!TIP]
> Deploying to a different compute target, such as Azure Kubernetes Service in the Azure cloud, is as easy as changing the deployment configuration. For more information, see [How and where to deploy models](how-to-deploy-and-where.md).

## Deploy the model

To deploy the registered model with the SDK, use [Model.deploy()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py#deploy-workspace--name--models--inference-config--deployment-config-none--deployment-target-none-). The following example loads information on the registered model named `sentiment`, and then deploys it as a service named `sentiment`. During deployment, the `inference_config` and `deployment_config` are used to create and configure the service environment:

```python
from azureml.core.model import Model

model = Model(ws, name='sentiment')
service = Model.deploy(ws, 'myservice', [model], inference_config, deployment_config)

service.wait_for_deployment(True)
print(service.state)
print("scoring URI: " + service.scoring_uri)
```

To deploy the model from the CLI, use the following command:

```azurecli
az ml model deploy -n myservice -m sentiment:1 --ic inferenceConfig.json --dc deploymentConfig.json
```

This command deploys version 1 of the registered model (`sentiment:1`) using the inference and deployment configuration stored in the `inferenceConfig.json` and `deploymentConfig.json` files.

After deployment, the scoring URI is displayed. This URI can be used by clients to submit requests to the service. The following example is a basic Python client that submits data to the service and displays the response:

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

For an example of how to create a client in several different programming languages, see [Create a client](how-to-consume-web-service.md).

## Next steps

* Learn more about [How and where to deploy models](how-to-deploy-and-where.md)
* Learn more about [How to create a client for a deployed model](how-to-consume-web-service.md)