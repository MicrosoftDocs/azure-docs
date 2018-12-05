---
title: Where to deploy models with Azure Machine Learning service | Microsoft Docs
description: Learn about the different ways that you can deploy your models into production using the Azure Machine Learning service.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: aashishb
author: aashishb
ms.reviewer: larryfr
ms.date: 08/29/2018
---

# Deploy models with the Azure Machine Learning service

The Azure Machine Learning service provides several ways you can deploy your trained model using the SDK. In this document, learn how to deploy your model as a web service in the Azure cloud, or to IoT edge devices.

You can deploy models to the following compute targets:

| Compute target | Deployment type | Description |
| ----- | ----- | ----- |
| [Azure Container Instances (ACI)](#aci) | Web service | Fast deployment. Good for development or testing. |
| [Azure Kubernetes Service (AKS)](#aks) | Web service | Good for high-scale production deployments. Provides autoscaling, and fast response times. |
| [Azure IoT Edge](#iotedge) | IoT module | Deploy models on IoT devices. Inferencing happens on the device. |
| [Field-programmable gate array (FPGA)](#fpga) | Web service | Ultra-low latency for real-time inferencing. |

## Prerequisites

- An Azure Machine Learning service workspace and the Azure Machine Learning SDK for Python installed. Learn how to get these prerequisites using the [Get started with Azure Machine Learning quickstart](quickstart-get-started.md).

- A trained model in either pickle (`.pkl`) or ONNX (`.onnx`) format. If you do not have a trained model, use the steps in the [Train models](tutorial-train-models-with-aml.md) tutorial to train and register one with the Azure Machine Learning service.

- The code sections in this document assume that `ws` references your machine learning workspace. For example, `ws = Workspace.from_config()`.

## Deployment workflow

The process of deploying a model is similar for all compute targets:

1. Train a model.
1. Register the model.
1. Create an image configuration.
1. Create the image.
1. Deploy the image to a compute target.

    * When **deploying as a web service**, there are three deployment options:

        * [deploy](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice(class)?view=azure-ml-py#deploy-workspace--name--model-paths--image-config--deployment-config-none--deployment-target-none-): When using this method, you do not need to register the model or create the image. However you cannot control the name of the model or image, or associated tags and descriptions.
        * [deploy_from_model](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice(class)?view=azure-ml-py#deploy-from-model-workspace--name--models--image-config--deployment-config-none--deployment-target-none-): When using this method, you do not need to create an image. But you do not have control over the name of the image that is created.
        * [deploy_from_image](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice(class)?view=azure-ml-py#deploy-from-image-workspace--name--image--deployment-config-none--deployment-target-none-): Register the model and create an image before using this method.

        The examples in this document use `deploy_from_image`.

    * When **deploying as an IoT Edge module**, you must register the model and create the image.

## Register a model

Only trained models can be deployed. The model can be trained using Azure Machine Learning, or another service. To register a model from file, use the following code:

```python
from azureml.core.model import Model

model = Model.register(model_path = "model.pkl",
                       model_name = "Mymodel",
                       tags = ["0.1"],
                       description = "test",
                       workspace = ws)
```

> [!NOTE]
> While the example shows using an model stored as a pickle file, you can also used ONNX models. For more information on using ONNX models, see the [ONNX and Azure Machine Learning](how-to-build-deploy-onnx.md) document.

For more information, see the reference documentation for the [Model class](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py).

## Create an image configuration

Deployed models are packaged as an image. The image contains the dependencies needed to run the model.

For **Azure Container Instance**, **Azure Kubernetes Service**, and **Azure IoT Edge** deployments, the `azureml.core.image.ContainerImage` class is used to create an image configuration. The image configuration is then used to create a new Docker image. 

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

This configuration uses a `score.py` file to pass requests to the model. This file contains two functions:

* `init()`: Typically this function loads the model into a global object. This function is run only once when the Docker container is started. 

* `run(input_data)`: This function uses the model to predict a value based on the input data. Inputs and outputs to the run typically use JSON for serialization and de-serialization, but other formats are supported.

For an example `score.py` file, see the [image classification tutorial](tutorial-deploy-models-with-aml.md#make-script). For an example that uses an ONNX model, see the [ONNX and Azure Machine Learning](how-to-build-deploy-onnx.md) document.

The `conda_file` parameter is used to provide a conda environment file. This file defines the conda environment for the deployed model. For more information on creating this file, see [Create an environment file (myenv.yml)](tutorial-deploy-models-with-aml.md#create-environment-file).

For more information, see the reference documentation for [ContainerImage class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.image.containerimage?view=azure-ml-py)

## <a id="createimage"></a> Create the image

Once you have created the image configuration, you can use it to create an image. This image is registered in your workspace. Once created, you can deploy the same image to multiple services.

```python
# Create the image from the image configuration
image = ContainerImage.create(name = "myimage", 
                              models = [model], #this is the model object
                              image_config = image_config,
                              workspace = ws
                              )
```

**Time estimate**: Approximately 3 minutes.

Images are versioned automatically when you register multiple images with the same name. For example, the first image registered as `myimage` is assigned an ID of `myimage:1`. The next time you register an image as `myimage`, the ID of the new image is `myimage:2`.

Image creation takes around 5 minutes.

For more information, see the reference documentation for [ContainerImage class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.image.containerimage?view=azure-ml-py).

## <a id="aci"></a> Deploy to Azure Container Instances

Use Azure Container Instances for deploying your models as a web service if one or more of the following conditions is true:

- You need to quickly deploy and validate your model. ACI deployment is finished in less than 5 minutes.
- You are testing a model that is under development. ACI allows you to deploy 20 container groups per subscription. For more information, see the [Quotas and region availability for Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-quotas) document.

To deploy to Azure Container Instances, use the following steps:

1. Define the deployment configuration. The following example defines a configuration that uses one CPU core and 1 GB of memory:

    [!code-python[](~/aml-sdk-samples/ignore/doc-qa/how-to-deploy-to-aci/how-to-deploy-to-aci.py?name=configAci)]

2. To deploy the image created in the [Create the image](#createimage) section of this document, use the following code:

    [!code-python[](~/aml-sdk-samples/ignore/doc-qa/how-to-deploy-to-aci/how-to-deploy-to-aci.py?name=option3Deploy)]

    **Time estimate**: Approximately 3 minutes.

    > [!TIP]
    > If there are errors during deployment, use `service.get_logs()` to view the AKS service logs. The logged information may indicate the cause of the error.

For more information, see the reference documentation for the [AciWebservice](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.aciwebservice?view=azure-ml-py) and [Webservice](https://docs.microsoft.comS/python/api/azureml-core/azureml.core.webservice.webservice(class)?view=azure-ml-py) classes.

## <a id="aks"></a> Deploy to Azure Kubernetes Service

To deploy your model as a high-scale production web service, use Azure Kubernetes Service (AKS). You can use an existing AKS cluster or create a new one using the Azure Machine Learning SDK, CLI, or the Azure portal.

Creating an AKS cluster is a one time process for your workspace. You can reuse this cluster for multiple deployments. If you delete the cluster, then you must create a new cluster the next time you need to deploy.

Azure Kubernetes Service provides the following capabilities:

* Autoscaling
* Logging
* Model data collection
* Fast response times for your web services

To deploy to Azure Kubernetes Service, use the following steps:

1. To create an AKS cluster, use the following code:

    > [!IMPORTANT]
    > Creating the AKS cluster is a one time process for your workspace. Once created, you can reuse this cluster for multiple deployments. If you delete the cluster or the resource group that contains it, then you must create a new cluster the next time you need to deploy.

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

    > [!TIP]
    > If you have existing AKS cluster in your Azure subscription, you can use it to deploy your image. To attach an existing cluster, it must use Azure Kubernetes Service version 1.11.3. The following code demonstrates how to attach an existing cluster to your workspace:
    >
    > ```python
    > # Get the resource id from https://porta..azure.com -> Find your resource group -> click on the Kubernetes service -> Properties
    > resource_id = '/subscriptions/<your subscription id>/resourcegroups/<your resource group>/providers/Microsoft.ContainerService/managedClusters/<your aks service name>'
    > 
    > # Set to the name of the cluster
    > cluster_name='my-existing-aks' 
    > 
    > # Attatch the cluster to your workgroup
    > aks_target = AksCompute.attach(workspace=ws, name=cluster_name, resource_id=resource_id)
    > 
    > # Wait for the operation to complete
    > aks_target.wait_for_completion(True)
    > ```

2. To deploy the image created in the [Create the image](#createimage) section of this document, use the following code:

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

    > [!TIP]
    > If there are errors during deployment, use `service.get_logs()` to view the AKS service logs. The logged information may indicate the cause of the error.

For more information, see the reference documentation for the [AksWebservice](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.akswebservice?view=azure-ml-py) and [Webservice](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.webservice(class)?view=azure-ml-py) classes.

## <a id="fpga"></a> Deploy to field-programmable gate arrays (FPGA)

Project Brainwave makes it possible to achieve ultra-low latency for real-time inferencing requests. Project Brainwave accelerates deep neural networks (DNN) deployed on field-programmable gate arrays in the Azure cloud. Commonly used DNNs are available as featurizers for transfer learning, or customizable with weights trained from your own data.

For a walkthrough of deploying a model using Project Brainwave, see the [Deploy to a FPGA](how-to-deploy-fpga-web-service.md) document.

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

## Clean up web services

The following code demonstrates how to delete the web service, image, and model:

```python
service.delete()
image.delete()
model.delete()
```

## <a id="iotedge"></a> Deploy to Azure IoT Edge

An Azure IoT Edge device is a Linux or Windows-based device that runs the Azure IoT Edge runtime. Machine learning models can be deployed to these devices as IoT Edge modules. Deploying a model to an IoT Edge device allows the device to use the model directly, instead of having to send data to the cloud for processing. You get faster response times and less data transfer.

Azure IoT Edge modules are deployed to your device from a container registry. When you create an image from your model using the steps in this document, it is stored in the container registry for your workspace.

Use the following steps to get the container registry credentials for your Azure Machine Learning service workspace:

1. Sign in to the [Azure portal](https://portal.azure.com/signin/index).

1. Go to your Azure Machine Learning service workspace and select __Overview__. To go to the container registry settings, select the __Registry__ link.

    ![An image of the container registry entry](./media/how-to-deploy-to-iot/findregisteredcontainer.png)

1. Once in the container registry, select **Access Keys** and then enable the admin user.

    ![An image of the access keys screen](./media/how-to-deploy-to-iot/findaccesskey.png)

1. Save the values for **login server**, **username**, and **password**. 

Once you have the credentials, use the steps in the [Deploy Azure IoT Edge modules from the Azure portal](../../iot-edge/how-to-deploy-modules-portal.md) document to deploy the image to your device. When configuring the __Registry settings__ for the device, use the __login server__, __username__, and __password__ for your workspace container registry.

> [!NOTE]
> If you're unfamiliar with Azure IoT, see the following documents for information on getting started with the service:
>
> * [Quickstart: Deploy your first IoT Edge module to a Linux device](../../iot-edge/quickstart-linux.md)
> * [Quickstart: Deploy your first IoT Edge module to a Windows device](../../iot-edge/quickstart.md)

## Next steps

* [Secure Azure Machine Learning web services with SSL](how-to-secure-web-service.md)
* [Consume a ML Model deployed as a web service](how-to-consume-web-service.md)
* [How to run batch predictions](how-to-run-batch-predictions.md)