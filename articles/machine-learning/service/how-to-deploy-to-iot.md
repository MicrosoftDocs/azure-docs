---
title: How to deploy models from Azure Machine Learning to IoT Edge | Microsoft Docs
description: Learn how to deploy a model trained with the Azure Machine Learning service to Azure IoT Edge.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: shipatel
author: shivanipatel
ms.reviewer: larryfr
ms.date: 09/06/2018
---

# Prepare to deploy models on IoT Edge

In this article, learn how to prepare a model trained using the Azure Machine Learning service to an IoT Edge device. 

Azure IoT Edge enables users to remotely deploy containerized cloud workloads to a device. The two services together provide a range of benefits such as low latency between response times and less data transfer.  

## Prerequisites

* An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* An Azure Machine Learning Workspace, a local project directory and the Azure Machine Learning SDK for Python installed. Learn how to get these prerequisites using the [How to configure a development environment](how-to-configure-environment.md) document.

* An [IoT Hub](../../iot-hub/iot-hub-create-through-portal.md) in your Azure subscription. 

* A trained model. For information on training a model, see the [Train an image classification model with Azure Machine Learning](tutorial-train-models-with-aml.md).


## Prepare the IoT device

1. Register a device with IoT hub. Once the device is registered, the connection string provided from this process will be used to configure the device. You can register the device through [Azure portal](../../iot-edge/how-to-register-device-portal.md). 

2. The [Windows](../../iot-edge/how-to-install-iot-edge-windows-with-windows.md) or [Linux](../../iot-edge/how-to-install-iot-edge-linux.md) device needs to be installed with the IoT Edge runtime and configured with the connection string from the previous step. 

## Prepare the model

Prepare your model for deployment.  Azure IoT Edge modules are based on container images. To deploy your Machine Learning model to an IoT Edge device, you need register your model on an Azure Machine Learning Workspace and create a Docker image. 

If you used Azure Machine Learning to train your model it may already be registered in your workspace, in this case skip to Retrieve a registered model.

### Initialize the workspace

Initialize the workspace and load the config.json file.

```python

from azureml.core  import Workspace

#Load existing workspace from the the config file info.
ws  = Workspace.from_config()

```    

### Register the model

Next, you register the model into your workspace. Replace the default text with your model path, name, tags, and description.

```python

from azureml.core.model import Model
model = Model.register(model_path = "model.pkl", # this path points to the local file
                       model_name = "best_model", # the model gets registered as this name
                       tags = ['attribute': "face", 'classification': "person"],
                       description = "Facial recognition model",
                       workspace = ws)
```    

### Get the registered model

Now, you can get the model you just registered with this code: 

```python

from azureml.core.model import Model

model_name = "best_model"
model = Model(ws, model_name)                     
```    

### Create a Docker image

Create a Docker image to store all model files. 

1. Create a **scoring script**, named score.py, using the script steps in this [image classification tutorial](tutorial-deploy-models-with-aml.md#make-script).

1. Create an environment file , named myenv.yml, using the environment file steps in this [image classification tutorial](tutorial-deploy-models-with-aml.md#make-myenv).

1. Configure the Docker image.
    
    ```python
    from azureml.core.image import Image, ContainerImage
    
    #Image configuration
    image_config = ContainerImage.image_configuration( runtime = "python", 
                           execution_script = "score.py",
                           conda_file = "myenv.yml", 
                           tags = ["attributes", "calssification"],
                           description = "Face recognition model",
                           
                        )
    ```    

1. Create the image using the model and image configuration.

   Estimated time to complete: **about 5 minutes**

    ```python
    image = ContainerImage.create (name = "myimage", 
                           models = [model], #this is the model object
                           image_config = image_config,
                           workspace = ws
                        )
    ```     

## Prepare the container

Next, you need to find the container image you created with Azure Machine Learning and write down the container registry credentials:

1. Sign in to [Azure Portal](https://portal.azure.com/signin/index).

1. Navigate to the resource group where the container to be deployed is registered.


1. Once in the container registry, select **Access Keys**.

1. Enable the admin user.

1. Save the values for login server, username, and password. 

   These credentials are necessary to provide the IoT edge device access to images in your private container registry.

## Next steps

Now you are now ready to deploy to an IoT Edge device. 

Learn how to complete the deployment from Azure IoT in this article, "[Deploy Azure IoT Edge modules from the Azure portal](../../iot-edge//how-to-deploy-modules-portal.md)".
