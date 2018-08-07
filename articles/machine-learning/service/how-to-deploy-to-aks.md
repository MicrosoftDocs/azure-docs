---
title: Migrate to Azure Machine Learning, general availability
description: Learn how to upgrade or migrate to the latest version of Azure Machine Learning Services.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: raymondl
author: raymondlaghaeian
ms.reviewer: sgilley
ms.date: 09/24/2018
---

# How to deploy web services from Azure Machine Learning Services to Azure Kubernetes Service

You can deploy your trained model as a web service API on either [Azure Container Instances](https://azure.microsoft.com/services/container-instances/) (ACI) or  [Azure Kubernetes Service](https://azure.microsoft.com/services/kubernetes-service/) (AKS).

In this article, you'll learn how to deploy on AKS.  AKS offers scalability, @@SLA, logging, authentication, and more. It takes about 10 minutes longer and a few more lines of code than ACI. AKS is designed to leave your web services running while ACI @@???

For initial testing,  [deploy on ACI](how-to-deploy-to-aci.md) instead. ACI is cheaper and can be provisioned much faster than AKS.

## Prerequisites

- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- An Azure Machine Learning Workspace, a local project directory and the Azure Machine Learning SDK for Python installed. Learn how to get these prerequisites using the [Portal quickstart](quickstart-get-started.md).

- A provisioned AKS cluster.  


## Install libraries and initialize your workspace

```python
import azureml.core
# Check core SDK version number
print("SDK version:", azureml.core.VERSION)

from azureml.core import Workspace

ws = Workspace.from_config()
print(ws.name, ws.resource_group, ws.location, ws.subscription_id, sep = '\n')
```

## Register a model
To register the model, you need the file `best_model.pkl` to be in the current directory. This call registers that file as a model called `best_model.pkl` in the workspace.


```python
import getpass
username = getpass.getuser()

from azureml.core.model import Model
model_name = username + "best_model.pkl"
model = Model.register(model_path = "best_model.pkl",
                       model_name = model_name,
                       tags = ["diabetes", "regression", username],
                       description = "Ridge regression model to predict diabetes",
                       workspace = ws)
```  

## Next steps

You can try to [deploy to Azure Container Instance](how-to-deploy-to-aci.md) as well. 