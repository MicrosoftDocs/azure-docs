---
title: Deploy web services to an Azure Container Instances | Azure Machine Learning
description: Learn how to deploy a trained model as a web service API on Azure Container Instances with Azure Machine Learning service.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: raymondl
author: raymondlaghaeian
ms.reviewer: sgilley
ms.date: 09/24/2018
---

# How to deploy web services to an Azure Container Instances

You can deploy your trained model as a web service API on either [Azure Container Instances](https://azure.microsoft.com/services/container-instances/) (ACI) or  [Azure Kubernetes Service](https://azure.microsoft.com/services/kubernetes-service/) (AKS).

In this article, you'll learn how to deploy on ACI.  ACI is generally cheaper than AKS and setup can be done in a few minutes with just a 4-6 lines of code. ACI is the perfect option for testing deployments.

When you're ready to use your models and web services for high-scale, production usage, [deploy them to AKS](how-to-deploy-to-aks.md) instead.

## Prerequisites

- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- An Azure Machine Learning Workspace, a local project directory and the Azure Machine Learning SDK for Python installed. Learn how to get these prerequisites using the [Portal quickstart](quickstart-get-started.md).

- A model to deploy.  Learn how to create one in the [Train and deploy model on Azure Machine Learning with MNIST dataset and TensorFlow tutorial](tutorial-train-models-with-aml.md).  

While [this tutorial](tutorial-deploy-models-with-aml.md) shows deployment, this article shows a more advanced approach that gives you more control over the steps for model registration and Docker image creation. The end result, however, is the same web service API.

## Import libraries and initialize your workspace

```python
import azureml.core
# Check core SDK version number
print("SDK version:", azureml.core.VERSION)
```

```python
from azureml.core import Workspace

ws = Workspace.from_config()
print(ws.name, ws.resource_group, ws.location, ws.subscription_id, sep = '\n')
```

## Register a model
To register the model, you need the file `mnist_model.pkl` to be in the current working directory. This call registers that file as a model called `mnist_model` in the workspace.


```python
import getpass
username = getpass.getuser()

from azureml.core.model import Model
model_name = "diabetes_model"
model = Model.register(model_path = "mnist_model.pkl",
                       model_name = "mnist_model",
                       tags = ["mnist",username],
                       description = "Mnist handwriting recognition",
                       workspace = ws)
```    

## Create Docker image

At a minimum, you must include a model file and an execution script to load and call the model for inferencing. Include any additional dependencies in a .yml file.

The parameter in the `get_model_path` call is referring to a model registered under the workspace. It is NOT referencing the local file.



```python
score_file = '''import pickle
import json
import numpy
from sklearn.externals import joblib
from sklearn.linear_model import Ridge
from azureml.core.model import Model

def init():
    global model
    model_path = Model.get_model_path("'''+model_name+'''")
    model = joblib.load(model_path)

# note you can pass in multiple rows for scoring
def run(raw_data):
    try:
        data = json.loads(raw_data)['data']
        data = numpy.array(data)
        result = model.predict(data)
    except Exception as e:
        result = str(e)
    return json.dumps({'result': result.tolist()})'''

%store score_file > ./mnist_score.py
```

```python
!cat ./mnist_score.py
```
    

```python
%%writefile ./myenv.yml
name: myenv
channels:
  - defaults
dependencies:
  - pip:
    - numpy
    - scikit-learn
    # Required packages for AzureML execution, history, and data preparation.
    - --extra-index-url https://azuremlsdktestpypi.azureedge.net/sdk-release/Preview/E7501C02541B433786111FE8E140CAA1
    - azureml-core
```    

You can add optional tags and a description to your image. An image can contain one or more models.

The following command could take a few minutes. 


```python
from azureml.core.image import ContainerImage

image_config = ContainerImage.image_configuration(execution_script = "mnist_score.py",
                                                  runtime = "python",
                                                  conda_file = "myenv.yml",
                                                  description = "Image with mnist model",
                                                  tags = ["mnist","classification"]
                                                 )
                                                 
image = ContainerImage.create(name = "myimage1",
                              # this is the model object
                              models = [model],
                              image_config = image_config,
                              workspace = ws)

image.wait_for_creation(show_output = True)
```    

## Deploy image on ACI

Now you can deploy the image as a service. The service creation can take a few minutes.


```python
from azureml.core.webservice import AciWebservice

aciconfig = AciWebservice.deploy_configuration(cpu_cores = 1, 
                                               memory_gb = 1, 
                                               tags = ['mnist','classification'], 
                                               description = 'Handwriting recognition')
```


```python
from azureml.core.webservice import Webservice

aci_service_name = 'aci-mnist-1'
aci_service = Webservice.deploy_from_image(deployment_config = aciconfig,
                                           image = image,
                                           name = aci_service_name,
                                           workspace = ws)
aci_service.wait_for_deployment(True)
print(aci_service.state)
```    

## Test web service

Call the web service with test input data to get a prediction.

```python
from sklearn import datasets
import numpy as np
import json

# Get sample data
mnist_data = datasets.load_digits()
features = mnist_data.images
features = features.reshape(features.shape[0],-1)

# Pick the data row that corresponds to number 8
test_samples = json.dumps({"data": features[8:9, :].tolist()})
prediction = aci_service.run(input_data = test_samples)
print(prediction)
```

    {"result": [8]}
    

## Delete the service to clean up

If you're not going to use this web service, delete it so you don't incur any charges.

```python
aci_service.delete()
```

## Next steps

You can try to [deploy to Azure Kubernetes Service](how-to-deploy-to-aks.md) when you are ready for a larger scale deployment. 
