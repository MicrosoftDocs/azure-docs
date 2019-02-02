---
title: Deploy models as web services
titleSuffix: Azure Machine Learning service
description: 'Learn how and where to deploy your Azure Machine Learning service models including: Azure Container Instances, Azure Kubernetes Service, Azure IoT Edge, and Field-programmable gate arrays.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: aashishb
author: aashishb
ms.reviewer: larryfr
ms.date: 12/07/2018
ms.custom: seodec18
---

# Deploy models with the Azure Machine Learning service

The Azure Machine Learning service provides several ways you can deploy your trained model using the SDK. In this document, learn how to deploy your model as a web service in the Azure cloud, or to IoT edge devices.

> [!IMPORTANT]
> Cross-origin resource sharing (CORS) is not currently supported when deploying a model as a web service.

You can deploy models to the following compute targets:

| Compute target | Deployment type | Description |
| ----- | ----- | ----- |
| [Azure Container Instances (ACI)](#aci) | Web service | Fast deployment. Good for development or testing. |
| [Azure Kubernetes Service (AKS)](#aks) | Web service | Good for high-scale production deployments. Provides autoscaling, and fast response times. |
| [Azure IoT Edge](#iotedge) | IoT module | Deploy models on IoT devices. Inferencing happens on the device. |
| [Field-programmable gate array (FPGA)](#fpga) | Web service | Ultra-low latency for real-time inferencing. |

The process of deploying a model is similar for all compute targets:

1. Train and register a model.
1. Configure and register an image that uses the model.
1. Deploy the image to a compute target.
1. Test the deployment

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE2Kwk3]


For more information on the concepts involved in the deployment workflow, see [Manage, deploy, and monitor models with Azure Machine Learning Service](concept-model-management-and-deployment.md).

## Prerequisites

- An Azure subscription. If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning service](http://aka.ms/AMLFree) today.

- An Azure Machine Learning service workspace and the Azure Machine Learning SDK for Python installed. Learn how to get these prerequisites using the [Get started with Azure Machine Learning quickstart](quickstart-get-started.md).

- A trained model. If you do not have a trained model, use the steps in the [Train models](tutorial-train-models-with-aml.md) tutorial to train and register one with the Azure Machine Learning service.

    > [!NOTE]
    > While the Azure Machine Learning service can work with any generic model that can be loaded in Python 3, the examples in this document demonstrate using a model stored in pickle format.
    > 
    > For more information on using ONNX models, see the [ONNX and Azure Machine Learning](how-to-build-deploy-onnx.md) document.

## <a id="registermodel"></a> Register a trained model

The model registry is a way to store and organize your trained models in the Azure cloud. Models are registered in your Azure Machine Learning service workspace. The model can be trained using Azure Machine Learning, or another service. To register a model from file, use the following code:

```python
from azureml.core.model import Model

model = Model.register(model_path = "model.pkl",
                       model_name = "Mymodel",
                       tags = {"key": "0.1"},
                       description = "test",
                       workspace = ws)
```

**Time estimate**: Approximately 10 seconds.

For more information, see the reference documentation for the [Model class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py).

## <a id="configureimage"></a> Create and register an image

Deployed models are packaged as an image. The image contains the dependencies needed to run the model.

For **Azure Container Instance**, **Azure Kubernetes Service**, and **Azure IoT Edge** deployments, the [azureml.core.image.ContainerImage](https://docs.microsoft.com/python/api/azureml-core/azureml.core.image.containerimage?view=azure-ml-py) class is used to create an image configuration. The image configuration is then used to create a new Docker image. 

The following code demonstrates how to create a new image configuration:

```python
from azureml.core.image import ContainerImage

# Image configuration
image_config = ContainerImage.image_configuration(execution_script = "score.py",
                                                 runtime = "python",
                                                 conda_file = "myenv.yml",
                                                 description = "Image with ridge regression model",
                                                 tags = {"data": "diabetes", "type": "regression"}
                                                 )
```

**Time estimate**: Approximately 10 seconds.

The important parameters in this example described in the following table:

| Parameter | Description |
| ----- | ----- |
| `execution_script` | Specifies a Python script that is used to receive requests submitted to the service. In this example, the script is contained in the `score.py` file. For more information, see the [Execution script](#script) section. |
| `runtime` | Indicates that the image uses Python. The other option is `spark-py`, which uses Python with Apache Spark. |
| `conda_file` | Used to provide a conda environment file. This file defines the conda environment for the deployed model. For more information on creating this file, see [Create an environment file (myenv.yml)](tutorial-deploy-models-with-aml.md#create-environment-file). |

For more information, see the reference documentation for [ContainerImage class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.image.containerimage?view=azure-ml-py)

### <a id="script"></a> Execution script

The execution script receives data submitted to a deployed image, and passes it to the model. It then takes the response returned by the model and returns that to the client. The script is specific to your model; it must understand the data that the model expects and returns. The script usually contains two functions that load and run the model:

* `init()`: Typically this function loads the model into a global object. This function is run only once when the Docker container is started. 

* `run(input_data)`: This function uses the model to predict a value based on the input data. Inputs and outputs to the run typically use JSON for serialization and de-serialization. You can also work with raw binary data. You can transform the data before sending to the model, or before returning to the client. 

#### Working with JSON data

The following is an example script that accepts and returns JSON data. The `run` function transforms the data from JSON into a format that the model expects, and then transforms the response to JSON before returning it:

```python
# import things required by this script
import json
import numpy as np
import os
import pickle
from sklearn.externals import joblib
from sklearn.linear_model import LogisticRegression

from azureml.core.model import Model

# load the model
def init():
    global model
    # retrieve the path to the model file using the model name
    model_path = Model.get_model_path('sklearn_mnist')
    model = joblib.load(model_path)

# Passes data to the model and returns the prediction
def run(raw_data):
    data = np.array(json.loads(raw_data)['data'])
    # make prediction
    y_hat = model.predict(data)
    return json.dumps(y_hat.tolist())
```

#### Working with Binary data

If your model accepts __binary data__, use `AMLRequest`, `AMLResponse`, and `rawhttp`. The following is an example of a script that accepts binary data and returns the reversed bytes for POST requests. For GET requests, it returns the full URL in the response body:

```python
from azureml.contrib.services.aml_request  import AMLRequest, rawhttp
from azureml.contrib.services.aml_response import AMLResponse

def init():
    print("This is init()")

# Accept and return binary data
@rawhttp
def run(request):
    print("This is run()")
    print("Request: [{0}]".format(request))
    # handle GET requests
    if request.method == 'GET':
        respBody = str.encode(request.full_path)
        return AMLResponse(respBody, 200)
    # handle POST requests
    elif request.method == 'POST':
        reqBody = request.get_data(False)
        respBody = bytearray(reqBody)
        respBody.reverse()
        respBody = bytes(respBody)
        return AMLResponse(respBody, 200)
    else:
        return AMLResponse("bad request", 500)
```

> [!IMPORTANT]
> The `azureml.contrib` namespace changes frequently, as we work to improve the service. As such, anything in this namespace should be considered as a preview, and not fully supported by Microsoft.
>
> If you need to test this on your local development environment, you can install the components in the `contrib` namespace by using the following command: 
> ```shell
> pip install azureml-contrib-services
> ```

### <a id="createimage"></a> Register the image

Once you have created the image configuration, you can use it to register an image. This image is stored in the container registry for your workspace. Once created, you can deploy the same image to multiple services.

```python
# Register the image from the image configuration
image = ContainerImage.create(name = "myimage", 
                              models = [model], #this is the model object
                              image_config = image_config,
                              workspace = ws
                              )
```

**Time estimate**: Approximately 3 minutes.

Images are versioned automatically when you register multiple images with the same name. For example, the first image registered as `myimage` is assigned an ID of `myimage:1`. The next time you register an image as `myimage`, the ID of the new image is `myimage:2`.

For more information, see the reference documentation for [ContainerImage class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.image.containerimage?view=azure-ml-py).

## <a id="deploy"></a> Deploy the image

When you get to deployment, the process is slightly different depending on the compute target that you deploy to. Use the information in the following sections to learn how to deploy to:

* [Azure Container Instances](#aci)
* [Azure Kubernetes Services](#aks)
* [Project Brainwave (field-programmable gate arrays)](#fpga)
* [Azure IoT Edge devices](#iotedge)

> [!NOTE]
> When **deploying as a web service**, there are three deployment methods you can use:
>
> | Method | Notes |
> | ----- | ----- |
> | [deploy_from_image](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice(class)?view=azure-ml-py#deploy-from-image-workspace--name--image--deployment-config-none--deployment-target-none-) | You must register the model and create an image before using this method. |
> | [deploy](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice(class)?view=azure-ml-py#deploy-workspace--name--model-paths--image-config--deployment-config-none--deployment-target-none-) | When using this method, you do not need to register the model or create the image. However you cannot control the name of the model or image, or associated tags and descriptions. |
> | [deploy_from_model](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice(class)?view=azure-ml-py#deploy-from-model-workspace--name--models--image-config--deployment-config-none--deployment-target-none-) | When using this method, you do not need to create an image. But you do not have control over the name of the image that is created. |
>
> The examples in this document use `deploy_from_image`.

### <a id="aci"></a> Deploy to Azure Container Instances

Use Azure Container Instances for deploying your models as a web service if one or more of the following conditions is true:

- You need to quickly deploy and validate your model. ACI deployment is finished in less than 5 minutes.
- You are testing a model that is under development. To see quota and region availability for ACI, see the [Quotas and region availability for Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-quotas) document.

To deploy to Azure Container Instances, use the following steps:

1. Define the deployment configuration. The following example defines a configuration that uses one CPU core and 1 GB of memory:

    [!code-python[](~/aml-sdk-samples/ignore/doc-qa/how-to-deploy-to-aci/how-to-deploy-to-aci.py?name=configAci)]

2. To deploy the image created in the [Create the image](#createimage) section of this document, use the following code:

    [!code-python[](~/aml-sdk-samples/ignore/doc-qa/how-to-deploy-to-aci/how-to-deploy-to-aci.py?name=option3Deploy)]

    **Time estimate**: Approximately 3 minutes.

    > [!TIP]
    > If there are errors during deployment, use `service.get_logs()` to view the service logs. The logged information may indicate the cause of the error.

For more information, see the reference documentation for the [AciWebservice](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.aciwebservice?view=azure-ml-py) and [Webservice](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.webservice?view=azure-ml-py) classes.

### <a id="aks"></a> Deploy to Azure Kubernetes Service

To deploy your model as a high-scale production web service, use Azure Kubernetes Service (AKS). You can use an existing AKS cluster or create a new one using the Azure Machine Learning SDK, CLI, or the Azure portal.

Creating an AKS cluster is a one time process for your workspace. You can reuse this cluster for multiple deployments. If you delete the cluster, then you must create a new cluster the next time you need to deploy.

Azure Kubernetes Service provides the following capabilities:

* Autoscaling
* Logging
* Model data collection
* Fast response times for your web services

#### Create a new cluster

To create a new Azure Kubernetes Service cluster, use the following code:

> [!IMPORTANT]
> Creating the AKS cluster is a one time process for your workspace. Once created, you can reuse this cluster for multiple deployments. If you delete the cluster or the resource group that contains it, then you must create a new cluster the next time you need to deploy.
> For [`provisioning_configuration()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.akscompute?view=azure-ml-py), if you pick custom values for agent_count and vm_size, then you need to make sure agent_count multiplied by vm_size is greater than or equal to 12 virtual CPUs. For example, if you use a vm_size of "Standard_D3_v2", which has 4 virtual CPUs, then you should pick an agent_count of 3 or greater.

```python
from azureml.core.compute import AksCompute, ComputeTarget

# Use the default configuration (you can also provide parameters to customize this)
prov_config = AksCompute.provisioning_configuration()

aks_name = 'aml-aks-1' 
# Create the cluster
aks_target = ComputeTarget.create(workspace = ws, 
                                    name = aks_name, 
                                    provisioning_configuration = prov_config)

# Wait for the create process to complete
aks_target.wait_for_completion(show_output = True)
print(aks_target.provisioning_state)
print(aks_target.provisioning_errors)
```

**Time estimate**: Approximately 20 minutes.

#### Use an existing cluster

If you already have AKS cluster in your Azure subscription, and it is version 1.11.*, you can use it to deploy your image. The following code demonstrates how to attach an existing cluster to your workspace:

```python
from azureml.core.compute import AksCompute, ComputeTarget
# Set the resource group that contains the AKS cluster and the cluster name
resource_group = 'myresourcegroup'
cluster_name = 'mycluster'

# Attach the cluster to your workgroup
attach_config = AksCompute.attach_configuration(resource_group = resource_group,
                                         cluster_name = cluster_name)
aks_target = ComputeTarget.attach(ws, 'mycompute', attach_config)

# Wait for the operation to complete
aks_target.wait_for_completion(True)
```

**Time estimate**: Approximately 3 minutes.

#### Deploy the image

To deploy the image created in the [Create the image](#createimage) section of this document to the Azure Kubernetes Server cluster, use the following code:

```python
from azureml.core.webservice import Webservice, AksWebservice

# Set configuration and service name
aks_config = AksWebservice.deploy_configuration()
aks_service_name ='aks-service-1'
# Deploy from image
service = Webservice.deploy_from_image(workspace = ws, 
                                            name = aks_service_name,
                                            image = image,
                                            deployment_config = aks_config,
                                            deployment_target = aks_target)
# Wait for the deployment to complete
service.wait_for_deployment(show_output = True)
print(service.state)
```

**Time estimate**: Approximately 3 minutes.

> [!TIP]
> If there are errors during deployment, use `service.get_logs()` to view the service logs. The logged information may indicate the cause of the error.

For more information, see the reference documentation for the [AksWebservice](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.akswebservice?view=azure-ml-py) and [Webservice](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.webservice.webservice?view=azure-ml-py) classes.

### <a id="fpga"></a> Deploy to field-programmable gate arrays (FPGA)

Project Brainwave makes it possible to achieve ultra-low latency for real-time inferencing requests. Project Brainwave accelerates deep neural networks (DNN) deployed on field-programmable gate arrays in the Azure cloud. Commonly used DNNs are available as featurizers for transfer learning, or customizable with weights trained from your own data.

For a walkthrough of deploying a model using Project Brainwave, see the [Deploy to a FPGA](how-to-deploy-fpga-web-service.md) document.

### <a id="iotedge"></a> Deploy to Azure IoT Edge

An Azure IoT Edge device is a Linux or Windows-based device that runs the Azure IoT Edge runtime. Machine learning models can be deployed to these devices as IoT Edge modules. Deploying a model to an IoT Edge device allows the device to use the model directly, instead of having to send data to the cloud for processing. You get faster response times and less data transfer.

Azure IoT Edge modules are deployed to your device from a container registry. When you create an image from your model, it is stored in the container registry for your workspace.

#### Set up your environment

* A development environment. For more information, see the [How to configure a development environment](how-to-configure-environment.md) document.

* An [Azure IoT Hub](../../iot-hub/iot-hub-create-through-portal.md) in your Azure subscription. 

* A trained model. For an example of how to train a model, see the [Train an image classification model with Azure Machine Learning](tutorial-train-models-with-aml.md) document. A pre-trained model is available on the [AI Toolkit for Azure IoT Edge GitHub repo](https://github.com/Azure/ai-toolkit-iot-edge/tree/master/IoT%20Edge%20anomaly%20detection%20tutorial).

#### Prepare the IoT device
You must create an IoT hub and register a device or reuse one you have with [this script](https://raw.githubusercontent.com/Azure/ai-toolkit-iot-edge/master/amliotedge/createNregister).

``` bash
ssh <yourusername>@<yourdeviceip>
sudo wget https://raw.githubusercontent.com/Azure/ai-toolkit-iot-edge/master/amliotedge/createNregister
sudo chmod +x createNregister
sudo ./createNregister <The Azure subscriptionID you want to use> <Resourcegroup to use or create for the IoT hub> <Azure location to use e.g. eastus2> <the Hub ID you want to use or create> <the device ID you want to create>
```

Save the resulting connection string after "cs":"{copy this string}".

Initialize your device by downloading [this script](https://raw.githubusercontent.com/Azure/ai-toolkit-iot-edge/master/amliotedge/installIoTEdge) into an UbuntuX64 IoT edge node or DSVM to run the following commands:

```bash
ssh <yourusername>@<yourdeviceip>
sudo wget https://raw.githubusercontent.com/Azure/ai-toolkit-iot-edge/master/amliotedge/installIoTEdge
sudo chmod +x installIoTEdge
sudo ./installIoTEdge
```

The IoT Edge node is ready to receive the connection string for your IoT Hub. Look for the line ```device_connection_string:``` and paste the connection string from above in between the quotes.

You can also learn how to register your device and install the IoT runtime step by step by following the [Quickstart: Deploy your first IoT Edge module to a Linux x64 device](../../iot-edge/quickstart-linux.md) document.


#### Get the container registry credentials
To deploy an IoT Edge module to your device, Azure IoT needs the credentials for the container registry that Azure Machine Learning service stores docker images in.

You can easily retrieve the necessary container registry credentials in two ways:

+ **In the Azure Portal**:

  1. Sign in to the [Azure portal](https://portal.azure.com/signin/index).

  1. Go to your Azure Machine Learning service workspace and select __Overview__. To go to the container registry settings, select the __Registry__ link.

     ![An image of the container registry entry](./media/how-to-deploy-and-where/findregisteredcontainer.png)

  1. Once in the container registry, select **Access Keys** and then enable the admin user.
 
     ![An image of the access keys screen](./media/how-to-deploy-and-where/findaccesskey.png)

  1. Save the values for **login server**, **username**, and **password**. 

+ **With a Python script**:

  1. Use the following Python script after the code you ran above to create a container:

     ```python
     # Getting your container details
     container_reg = ws.get_details()["containerRegistry"]
     reg_name=container_reg.split("/")[-1]
     container_url = "\"" + image.image_location + "\","
     subscription_id = ws.subscription_id
     from azure.mgmt.containerregistry import ContainerRegistryManagementClient
     from azure.mgmt import containerregistry
     client = ContainerRegistryManagementClient(ws._auth,subscription_id)
     result= client.registries.list_credentials(resource_group_name, reg_name, custom_headers=None, raw=False)
     username = result.username
     password = result.passwords[0].value
     print('ContainerURL{}'.format(image.image_location))
     print('Servername: {}'.format(reg_name))
     print('Username: {}'.format(username))
     print('Password: {}'.format(password))
     ```
  1. Save the values for ContainerURL, servername, username, and password. 

     These credentials are necessary to provide the IoT Edge device access to images in your private container registry.

#### Deploy the model to the device

You can easily deploy a model by running [this script](https://raw.githubusercontent.com/Azure/ai-toolkit-iot-edge/master/amliotedge/deploymodel) and providing the following information from the steps above:
container registry Name, username, password, image location url, desired deployment name, IoT Hub name, and the device ID you created. You can do this in the VM by following these steps: 

```bash 
wget https://raw.githubusercontent.com/Azure/ai-toolkit-iot-edge/master/amliotedge/deploymodel
sudo chmod +x deploymodel
sudo ./deploymodel <ContainerRegistryName> <username> <password> <imageLocationURL> <DeploymentID> <IoTHubname> <DeviceID>
```

Alternatively, you can follow the steps in the [Deploy Azure IoT Edge modules from the Azure portal](../../iot-edge/how-to-deploy-modules-portal.md) document to deploy the image to your device. When configuring the __Registry settings__ for the device, use the __login server__, __username__, and __password__ for your workspace container registry.

> [!NOTE]
> If you're unfamiliar with Azure IoT, see the following documents for information on getting started with the service:
>
> * [Quickstart: Deploy your first IoT Edge module to a Linux device](../../iot-edge/quickstart-linux.md)
> * [Quickstart: Deploy your first IoT Edge module to a Windows device](../../iot-edge/quickstart.md)


## Testing web service deployments

To test a web service deployment, you can use the `run` method of the Webservice object. In the following example, a JSON document is set to a web service and the result is displayed. The data sent must match what the model expects. In this example, the data format matches the input expected by the diabetes model.

```python
import json

test_sample = json.dumps({'data': [
    [1,2,3,4,5,6,7,8,9,10], 
    [10,9,8,7,6,5,4,3,2,1]
]})
test_sample = bytes(test_sample,encoding = 'utf8')

prediction = service.run(input_data = test_sample)
print(prediction)
```

The webservice is a REST API, so you can create client applications in a variety of programming languages. For more information, see [Create client applications to consume webservices](how-to-consume-web-service.md).

## <a id="update"></a> Update the web service

To update the web service, use the `update` method. The following code demonstrates how to update the web service to use a new image:

```python
from azureml.core.webservice import Webservice
from azureml.core.image import Image

service_name = 'aci-mnist-3'
# Retrieve existing service
service = Webservice(name = service_name, workspace = ws)

# point to a different image
new_image = Image(workspace = ws, id="myimage2:1")

# Update the image used by the service
service.update(image = new_image)
print(service.state)
```

> [!NOTE]
> When you update an image, the web service is not automatically updated. You must manually update each service that you want to use the new image.

For more information, see the reference documentation for the [Webservice](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice(class)?view=azure-ml-py) class.

## Clean up

To delete a deployed web service, use `service.delete()`.

To delete an image, use `image.delete()`.

To delete a registered model, use `model.delete()`.

For more information, see the reference documentation for [WebService.delete()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice(class)?view=azure-ml-py#delete--), [Image.delete()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.image.image(class)?view=azure-ml-py#delete--), and [Model.delete()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py#delete--).

## Next steps

* [Secure Azure Machine Learning web services with SSL](how-to-secure-web-service.md)
* [Consume a ML Model deployed as a web service](how-to-consume-web-service.md)
* [How to run batch predictions](how-to-run-batch-predictions.md)
* [Monitor your Azure Machine Learning models with Application Insights](how-to-enable-app-insights.md)
* [Collect data for models in production](how-to-enable-data-collection.md)
* [Azure Machine Learning service SDK](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py)
* [Use Azure Machine Learning service with Azure Virtual Networks](how-to-enable-virtual-network.md)
