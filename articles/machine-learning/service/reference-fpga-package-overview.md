---
title: FPGA package for hardware acceleration for Azure Machine Learning
description: Learn about the python packages available for Azure Machine Learning users. 
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: reference

ms.reviewer: jmartens
ms.author: tedway
author: tedway
ms.date: 05/07/2018

ROBOTS: NOINDEX
---
# Azure Machine Learning Hardware Acceleration package

>[!Note]
>**This article is deprecated.** This FPGA package was deprecated. Support for this functionality was added to the Azure ML SDK. Support for this package will end incrementally. [View the support timeline](overview-what-happened-to-workbench.md#timeline). Learn about updated [FPGA support](concept-accelerate-with-fpgas.md).

The Azure Machine Learning Hardware Acceleration package is a Python pip-installable extension for Azure Machine Learning that enables data scientists and AI developers to quickly:

+ Featurize images with a quantized version of ResNet 50

+ Train classifiers based on those features

+ Deploy models to [field programmable gate arrays (FPGA)](concept-accelerate-with-fpgas.md) on Azure for ultra-low latency inferencing

## Prerequisites

1. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

1. An Azure Machine Learning Model Management account. For more information on creating the account, see the [Azure Machine Learning Quickstart and Workbench installation](../desktop-workbench/quickstart-installation.md) document. 

1. The package must be installed. 

 
## How to install the package

1. Download and install the latest version of [Git](https://git-scm.com/downloads).

2. Install [Anaconda (Python 3.6)](https://conda.io/miniconda.html)

   To download a pre-configured Anaconda environment, use the following command from the Git prompt:

    ```
    git clone https://aka.ms/aml-real-time-ai
    ```
1. To create the environment, open an **Anaconda Prompt** and use the following command:

    ```
    conda env create -f aml-real-time-ai/environment.yml
    ```

1. To activate the environment, use the following command:

    ```
    conda activate amlrealtimeai
    ```

## Sample code

This sample code walks you through using the SDK to deploy a model to an FPGA.

1. Import the package:
   ```python
   import amlrealtimeai
   from amlrealtimeai import resnet50
   ```

1. Pre-process the image:
   ```python 
   from amlrealtimeai.resnet50.model import LocalQuantizedResNet50
   model_path = os.path.expanduser('~/models')
   model = LocalQuantizedResNet50(model_path)
   print(model.version)
   ```

1. Featurize the images:
   ```python 
   from amlrealtimeai.resnet50.model import LocalQuantizedResNet50
   model_path = os.path.expanduser('~/models')
   model = LocalQuantizedResNet50(model_path)
   print(model.version)
   ```

1. Create a classifier:
   ```python
   model.import_graph_def(include_featurizer=False)
   print(model.classifier_input)
   print(model.classifier_output)
   ```

1. Create the service definition:
   ```python
   from amlrealtimeai.pipeline import ServiceDefinition, TensorflowStage, BrainWaveStage
   save_path = os.path.expanduser('~/models/save')
   service_def_path = os.path.join(save_path, 'service_def.zip')

   service_def = ServiceDefinition()
   service_def.pipeline.append(TensorflowStage(tf.Session(), in_images, image_tensors))
   service_def.pipeline.append(BrainWaveStage(model))
   service_def.pipeline.append(TensorflowStage(tf.Session(), model.classifier_input, model.classifier_output))
   service_def.save(service_def_path)
   print(service_def_path)
   ```
 
1. Prepare the model to run on an FPGA:
   ```python
   from amlrealtimeai import DeploymentClient

   subscription_id = "<Your Azure Subscription ID>"
   resource_group = "<Your Azure Resource Group Name>"
   model_management_account = "<Your AzureML Model Management Account Name>"

   model_name = "resnet50-model"
   service_name = "quickstart-service"

   deployment_client = DeploymentClient(subscription_id, resource_group, model_management_account)
   ```

1. Deploy the model to run on an FPGA:
   ```python
   service = deployment_client.get_service_by_name(service_name)
   model_id = deployment_client.register_model(model_name, service_def_path)

   if(service is None):
      service = deployment_client.create_service(service_name, model_id)    
   else:
      service = deployment_client.update_service(service.id, model_id)
   ```

1. Create the client:
    ```python
   from amlrealtimeai import PredictionClient
   client = PredictionClient(service.ipAddress, service.port)  
   ```

1. Call the API:
   ```python
   image_file = R'C:\path_to_file\image.jpg'
   results = client.score_image(image_file)
   ```

## Reporting issues

Use the [forum](https://aka.ms/aml-forum-service) to report any issues you encounter with the package.

## Next steps

[Deploy a model as a web service on an FPGA](how-to-deploy-fpga-web-service.md)