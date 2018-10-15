---
title: Deploy web services to Azure Container Instances (ACI) - Azure Machine Learning
description: Learn how to deploy a trained model as a web service on Azure Container Instances (ACI) with Azure Machine Learning service. This article shows three different ways to deploy a model on ACI. They differ in the number of lines of code and the control you have in naming parts of the deployment.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: raymondl
author: raymondlaghaeian
ms.reviewer: sgilley
ms.date: 09/24/2018
---

# Deploy web services to Azure Container Instances 

You can deploy your trained model as a web service on [Azure Container Instances](https://azure.microsoft.com/services/container-instances/) (ACI), [Azure Kubernetes Service](https://azure.microsoft.com/services/kubernetes-service/) (AKS), IoT edge device, or [field programmable gate arrays (FPGAs)](concept-accelerate-with-fpgas.md) 

ACI is generally cheaper than AKS and can be set up in 4-6 lines of code. ACI is the perfect option for testing deployments. Later, when you're ready to use your models and web services for high-scale, production usage, you can [deploy them to AKS](how-to-deploy-to-aks.md).

This article shows three different ways to deploy a model on ACI. They differ in the number of lines of code and the control you have in naming parts of the deployment. From the method with the least amount of code and control to the method with the most code and control, the ACI options are:

* Deploy from model file using `Webservice.deploy()` 
* Deploy from registered model using `Webservice.deploy_from_model()`
* Deploy registered model from image using `Webservice.deploy_from_image()`

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


## Prerequisites

- An Azure Machine Learning service workspace and the Azure Machine Learning SDK for Python installed. Learn how to get these prerequisites using the [Get started with Azure Machine Learning quickstart](quickstart-get-started.md).

- The Azure Machine Learning service workspace object

    ```python
    from azureml.core import Workspace
    ws = Workspace.from_config()
    ```

- A model to deploy. The examples in this document use the model created when you follow the "[Train a model](tutorial-train-models-with-aml.md)" tutorial. If you do not use this model, modify the steps to refer to your model name.  You also need to write your own scoring script to run your model.


## Configure an image

Configure the Docker image that is used to store all the model files.
1. Create a scoring script (score.py) [using these instructions](tutorial-deploy-models-with-aml.md#create-scoring-script)

1. Create an environment file (myenv.yml) [using these instructions](tutorial-deploy-models-with-aml.md#create-environment-file) 

1. Use these two files to configure the Docker image in Python using the SDK as follows:

    ```python
    from azureml.core.image import ContainerImage

    image_config = ContainerImage.image_configuration(execution_script = "score.py",
                                                      runtime = "python",
                                                      conda_file = "myenv.yml",
                                                      description = "Image with mnist model",
                                                      tags = {"data": "mnist", "type": "classification"}
                                                     )
    ```

## Configure the ACI container

Configure the ACI container by specify the number of CPUs and gigabyte of RAM needed for your ACI container. The default of one core and 1 gigabyte of RAM is sufficient for many models. If you feel you need more later, recreate the image and redeploy the service.  

```python
from azureml.core.webservice import AciWebservice

aciconfig = AciWebservice.deploy_configuration(cpu_cores = 1, 
                                               memory_gb = 1, 
                                               tags = {"data": "mnist", "type": "classification"},
                                               description = 'Handwriting recognition')
```

## Register a model

> Skip this prerequisite if you are [deploying from a model file](#deploy-from-model-file) (`Webservice.deploy()`).

Register a model to use [`Webservice.deploy_from_model`](#deploy-from-registered-model) or [`Webservice.deploy_from_image`](#deploy-from-image). Or if you already have a registered model, retrieve it now.

### Retrieve a registered model
If you use Azure Machine Learning to train your model, the model might already be registered in your workspace.  For example, the last step of the [train a model](tutorial-train-models-with-aml.md) tutorial] registered the model.  You then retrieve the registered model to deploy.

```python
from azureml.core.model import Model

model_name = "sklearn_mnist"
model=Model(ws, model_name)
```
  
### Register a model file

If your model was built elsewhere, you can still register it into your workspace.  To register a model, the model file (`sklearn_mnist_model.pkl` in this example) must be in the current working directory. Then register that file as a model called `sklearn_mnist` in the workspace with `Model.register()`.
    
```python
from azureml.core.model import Model

model_name = "sklearn_mnist"
model = Model.register(model_path = "sklearn_mnist_model.pkl",
                        model_name = model_name,
                        tags = {"data": "mnist", "type": "classification"},
                        description = "Mnist handwriting recognition",
                        workspace = ws)
```


## Option 1: Deploy from model file

The option to deploy from a model file requires the least amount of code to write, but also offers the least amount of control over the naming of components. This option starts with a model file and registers it into the workspace for you.  However, you can't name the model or associate tags or a description for it.  

This option uses the SDK method, Webservice.deploy().  

**Time estimate**: Deploying takes approximately 6-7 minutes.

1. Make sure the model file is in your local working directory.

1. Open the prerequisite model file, score.py, and change the  `init()` section to:

    ```python
    def init():
        global model
        # retreive the local path to the model using the model name
        model_path = Model.get_model_path('sklearn_mnist_model.pkl')
        model = joblib.load(model_path)
    ```

1. Deploy your model file.

    ```python
    from azureml.core.webservice import Webservice
    
    service_name = 'aci-mnist-1'
    service = Webservice.deploy(deployment_config = aciconfig,
                                    image_config = image_config,
                                    model_paths = ['sklearn_mnist_model.pkl'],
                                    name = service_name,
                                    workspace = ws)
    
    service.wait_for_deployment(show_output = True)
    print(service.state)
    ```

1. You can now [test the web service](#test-web-service).

## Option 2: Deploy from registered model

The option to deploy a registered model file takes a few more lines of code and allows some control over the naming of outputs. This option is a convenient way to deploy a registered model you already have.  However, you can't name the Docker image.  

This option uses the SDK method, Webservice.deploy_from_model().

**Time estimate**:  Deploying with this option takes approximately 8 minutes.

1. Run the code to configure the Docker container and the ACI container and specify the registered model.

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

1. You can now [test the web service](#test-web-service).

## Option 3: Deploy from image

Deploy a registered model (`model`) using `Webservice.deploy_from_image()`. This method allows you to create the Docker image separately and then deploy from that image.

1. Build and register the Docker image under the workspace using `ContainerImage.create()`

    This method gives you more control over the image by creating it in a separate step.  The registered model (`model`) is included in the image.
    
    ```python
    from azureml.core.image import ContainerImage
    
    image = ContainerImage.create(name = "myimage1",
                                  models = [model], # this is the registered model object
                                  image_config = image_config,
                                  workspace = ws)
    
    image.wait_for_creation(show_output = True)
    ```
**Time estimate**: Approximately 3 minutes.

1. Deploy the Docker image as a service using `Webservice.deploy_from_image()`

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

This method gives you the most control over creating and naming the components in the deployment.

You can now test the web service.

## Test the web service

The web service is the same no matter which method was used.  To get predictions, use the `run` method of the service.  

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
