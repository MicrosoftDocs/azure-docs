---
title: Deploy web services to Azure Container Instances | Azure Machine Learning
description: Learn how to deploy a trained model as a web service API on Azure Container Instances (ACI) with Azure Machine Learning service.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: raymondl
author: raymondlaghaeian
ms.reviewer: sgilley
ms.date: 09/24/2018
---

# How to deploy web services to Azure Container Instances

You can deploy your trained model as a web service API on either [Azure Container Instances](https://azure.microsoft.com/services/container-instances/) (ACI) or  [Azure Kubernetes Service](https://azure.microsoft.com/services/kubernetes-service/) (AKS).

In this article, you'll learn how to deploy on ACI.  ACI is generally cheaper than AKS and setup can be done in a few minutes with just a 4-6 lines of code. ACI is the perfect option for testing deployments.

When you're ready to use your models and web services for high-scale, production usage, [deploy them to AKS](how-to-deploy-to-aks.md) instead.

This article shows three different methods to deploy a model on ACI.

* Deploy from model file - `Webservice.deploy()`
* Deploy from registered model - `Webservice.deploy_from_model()`
* Deploy registered model from image - `Webservice.deploy_from_image()`

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An Azure Machine Learning Workspace and the Azure Machine Learning SDK for Python installed. Learn how to get these prerequisites using the [Portal quickstart](quickstart-get-started.md).
- The workspace object

    ```python
    from azureml.core import Workspace
    ws = Workspace.from_config()
    ```

- A model to deploy.  Learn how to create one in the [Train a model tutorial](tutorial-train-models-with-aml.md).  Code examples in this article show the deployment for the model `sklearn_mnist_model.pkl` created from the tutorial. 
- A [Docker image configuration](#docker-image-configuration)
- An [ACI container configuration ](#aci-container-configuration)
- A [registered model](#registered-model) (skip this prerequisite if you are deploying from a file (`Webservice.deploy()`))

### Docker image configuration

Configure the Docker image no matter which method you use.  To configure:
1. Create the [scoring script (score.py)](tutorial-deploy-models-with-aml.md#create-scoring-script)
1. Create [an environment file (myenv.yml)](tutorial-deploy-models-with-aml.md#create-environment-file) 
1. Use these two files to configure the Docker image

```python
from azureml.core.image import ContainerImage

image_config = ContainerImage.image_configuration(execution_script = "score.py",
                                                  runtime = "python",
                                                  conda_file = "myenv.yml",
                                                  description = "Image with mnist model",
                                                  tags = ["mnist","classification"]
                                                 )
```

### ACI container configuration

Configure the ACI container no matter which method you use. Specify the number of CPUs and gigabyte of RAM needed for your ACI container. While it depends on your model, the default of one core and 1 gigabyte of RAM is sufficient for typical models. If you feel you need more later, you will have to recreate the image and redeploy the service.  

```python
from azureml.core.webservice import AciWebservice

aciconfig = AciWebservice.deploy_configuration(cpu_cores = 1, 
                                               memory_gb = 1, 
                                               tags = ['mnist','classification'], 
                                               description = 'Handwriting recognition')
```

### Registered model

>Skip this prerequisite if you are [deploying from a file](#deploy-from-model-file) (`Webservice.deploy()`).

Register a model to use `Webservice.deploy_from_model(#deploy-from-registered-model)` or ``Webservice.deploy_from_image(#deploy-from-image)`. If you use Azure Machine Learning to train your model, the model might already be registered in your workspace.  For example, the last step of the [train a model tutorial] registered the model.  You can retrieve the registered model to deploy:

```python
from azureml.core.model import Model

model_name = "sklearn_mnist"
model=Model(ws, model_name)
```

If your model was built elsewhere, you can still register it into your workspace.  To register a model, the model file (`sklearn_mnist_model.pkl` in this example) must be in the current working directory. Then register that file as a model called `sklearn_mnist` in the workspace with `Model.register()`.

```python
from azureml.core.model import Model

model_name = "sklearn_mnist"
model = Model.register(model_path = "sklearn_mnist_model.pkl",
                       model_name = model_name,
                       tags = ['mnist','classification'],
                       description = "Mnist handwriting recognition",
                       workspace = ws)
```


## Deploy from model file

Deploy a model file using  `Webservice.deploy()`.  The model file must be present in your local working directory. You don't need a registered model for this method.

1. Edit the prerequisite file score.py and change the  `init()` section to:

    ```python
    def init():
        global model
        # retreive the local path to the model using the model name
        model_path = Model.get_model_path('sklearn_mnist_model.pkl')
        model = joblib.load(model_path)
    ```

1. Deploy your model file:

    ```python
    from azureml.core.webservice import Webservice
    
    service_name = 'aci-mnist-1'
    service = Webservice.deploy(deployment_config = aciconfig,
                                    image_config = image_config,
                                    model_paths = ['sklearn_mnist.pkl'],
                                    name = service_name,
                                    workspace = ws)
    
    service.wait_for_deployment(show_output = True)
    print(service.state)
    ```

**Time estimate**: Approximately 6-7 minutes.

This method is a convenient way to deploy a model file without first registering it.  You can't name the model or associate tags or a description for it.  

Proceed to [test the web service](#test-web-service).

## Deploy from registered model

Deploy a registered model (`model`) using `Webservice.deploy_from_model()`.  You provide the configuration for the Docker container and the ACI container, along with the registered model:


```python
from azureml.core.webservice import Webservice

service_name = 'aci-mnist-2'
service = Webservice.deploy_from_model(deployment_config = aciconfig,
                                       image_config = image_config,
                                       models = [model], # this is the registered model object
                                       name = service_name,
                                       workspace = ws)
service.wait_for_deployment(show_output = True)
print(service.state)
```

**Time estimate**: Approximately 8 minutes.

This method is a convenient way to deploy a registered model you have now.  It doesn't allow you to name the Docker image.

Proceed to [test the web service](#test-web-service).


## Deploy from image

Deploy a registered model (`model`) using `Webservice.deploy_from_image()`. This method allows you to create the Docker image separately and deploy from that image.  You have more flexibility to name and reuse the Docker image for new models in the future.  

The steps are:
- Build and register the Docker image under the workspace using `ContainerImage.create()`
- Deploy the Docker image as a service using `Webservice.deploy_from_image()`

### Build image

This method gives you more control over the image by creating it in a separate step.  The registered model (`model`) is included in the image:

```python
from azureml.core.image import ContainerImage

image = ContainerImage.create(name = "myimage1",
                              models = [model], # this is the registered model object
                              image_config = image_config,
                              workspace = ws)

image.wait_for_creation(show_output = True)
```
**Time estimate**: Approximately 3 minutes.

### Deploy from image

Now deploy the image to ACI.  

```python
from azureml.core.webservice import Webservice

service_name = 'aci-mnist-3'
service = Webservice.deploy_from_image(deployment_config = aciconfig,
                                           image = image,
                                           name = service_name,
                                           workspace = ws)
service.wait_for_deployment(show_output = True)
print(service.state)
```   
 
**Time estimate**: Approximately 3 minutes.

Proceed to test the web service.

## Test web service

The webservice is the same regardless of how it was created.  To get predictions, use the `run` method of the service.  

```python
# Load Data
import os
import urllib

os.makedirs('./data', exist_ok = True)

urllib.request.urlretrieve('http://yann.lecun.com/exdb/mnist/t10k-images-idx3-ubyte.gz', filename = './data/test-images.gz')

from utils import load_data
X_test = load_data('./data/test-images.gz', False) / 255.0

from sklearn import datasets
import numpy as np
import json

# find 5 random samples from test set
n = 5
sample_indices = np.random.permutation(X_test.shape[0])[0:n]

test_samples = json.dumps({"data": X_test[sample_indices].tolist()})
test_samples = bytes(test_samples, encoding = 'utf8')

# predict using the deployed model
prediction = service.run(input_data = test_samples)
print(prediction)
```


## Clean up resources

If you're not going to use this web service, delete it so you don't incur any charges.

```python
service.delete()
```

## Next steps

Learn how to [deploy to Azure Kubernetes Service](how-to-deploy-to-aks.md) for a larger scale deployment. 