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

While the [deploy a model tutorial](tutorial-deploy-models-with-aml.md) shows deployment, this article shows a more advanced approach that gives you more control over the steps. The resulting deployment is the same web service API.

## Start with a model
The model to deploy must be registered in your workspace.  If you use Azure Machine Learning to train your model, it might already be registered in your workspace, as is the case with the deployment tutorial.  

If your model was built elsewhere, you can still deploy it after you register it into your workspace.  To register a model, you need the model file (`mnist_model.pkl` in this example) to be in the current working directory. Then register that file as a model called `mnist_model` in the workspace with `Model.register`.

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

## Deploy registered model in one step

Once you have a registered model, you can deploy it in one step.  

The deployment tutorial shows deployment in one step using the `Webservice.deploy_from_model()` method.  This method:

- Builds a Docker image
- Registers the image under the workspace
- Sends the image to the ACI container
- Starts up a container in ACI using the image
- Gets the web service HTTP endpoint

```
service = Webservice.deploy_from_model(workspace = ws,
                                       name = 'sklearn-mnist-model',
                                       deployment_config = aciconfig,
                                       models = [model],
                                       image_config = image_config)
```
This method is a convenient way to deploy models you have ready now, but it's harder to reuse the Docker image for more models later.  


## Deploy in two steps
This article shows how to break up the deployment by creating the Docker image separately and then deploying from that image.  You then have more flexibility to reuse the Docker image for new models in the future.  

The two steps are:
- Build and register the Docker image under the workspace using `ContainerImage.create`
- Deploy the Docker image as a service using `Webservice.deploy_from_image`

### Build image

In the first step, `ContainerImage.create` is used to:
- Build a Docker image
- Register the image under the workspace

The configuration for the image is identical to what is shown in the deployment tutorial. Create the [scoring script (score.py)](tutorial-deploy-models-with-aml.md#create-scoring-script) and [the environment file (myenv.yml)](tutorial-deploy-models-with-aml.md#create-environment-file) and use them to configure the image.

```python
from azureml.core.image import ContainerImage

image_config = ContainerImage.image_configuration(execution_script = "mnist_score.py",
                                                  runtime = "python",
                                                  conda_file = "myenv.yml",
                                                  description = "Image with mnist model",
                                                  tags = ["mnist","classification"]
                                                 )
```

In the tutorial using the one-step approach, a Docker container is created on the fly using this configuration.  For the two-step approach, use this configuration to create the Docker image yourself.  

```python                                                 
image = ContainerImage.create(name = "myimage1",
                              # this is the model object
                              models = [model],
                              image_config = image_config,
                              workspace = ws)

image.wait_for_creation(show_output = True)
```    

### Deploy from image

Now use the image to deploy to ACI.  

First create a configuration file, identical to the one shown in tutorial.  Specify the number of CPUs and gigabyte of RAM needed for your ACI container. While it depends on your model, the default of one core and one gigabyte of RAM is sufficient for typical models. If you feel you need more later, you will have to recreate the image and redeploy the service.  

```python
from azureml.core.webservice import AciWebservice

aciconfig = AciWebservice.deploy_configuration(cpu_cores = 1, 
                                               memory_gb = 1, 
                                               tags = ['mnist','classification'], 
                                               description = 'Handwriting recognition')
```

Now use this configuration file to deploy from the image. This step:
- Gets the Docker image
- Starts up a container in ACI using the image
- Gets the web service HTTP endpoint


```python
from azureml.core.webservice import Webservice

service_name = 'aci-mnist-1'
service = Webservice.deploy_from_image(deployment_config = aciconfig,
                                           image = image,
                                           name = service_name,
                                           workspace = ws)
service.wait_for_deployment(True)
print(service.state)
```    


## Test web service

The webservice works exactly the same regardless of which method you use.  To get predictions, use the `run` method of the service.  

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
prediction = service.run(input_data = test_samples)
print(prediction)
```

The returned result is:

`{"result": [8]}`


## Delete the service to clean up

If you're not going to use this web service, delete it so you don't incur any charges.

```python
service.delete()
```

## Next steps

Learn how to [deploy to Azure Kubernetes Service](how-to-deploy-to-aks.md) for a larger scale deployment. 