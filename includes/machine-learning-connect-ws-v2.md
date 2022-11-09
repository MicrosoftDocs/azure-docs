---
author: sdgilley
ms.service: machine-learning
ms.topic: include
ms.date: 09/20/2022
ms.author: sgilley
---

[!INCLUDE [sdk v2](./machine-learning-sdk-v2.md)]

Run this code to connect to your Azure ML workspace. 

Replace your Subscription ID, Resource Group name and Workspace name in the code below. To find these values:

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com).
1. Open the workspace you wish to use.
1. In the upper right Azure Machine Learning studio toolbar, select your workspace name.
1. Copy the value for workspace, resource group and subscription ID into the code.  
1. If you're using a notebook inside studio, you'll need to copy one value, close the area and paste, then come back for the next one.

[!notebook-python[](~/azureml-examples-main/sdk/python/resources/compute/compute.ipynb?name=subscription_id)]

[!notebook-python[](~/azureml-examples-main/sdk/python/resources/compute/compute.ipynb?name=ml_client)]

`ml_client` is a handler to the workspace that you'll use to manage other resources and jobs.