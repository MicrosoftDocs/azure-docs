---
title: Collect production data from models deployed for real-time inferencing
titleSuffix: Azure Machine Learning
description: Collect inference data from your model deployed to a real-time endpoint on Azure Machine Learning to monitor its performance in production.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: how-to
author: ahughes-msft
ms.author: alehughes
ms.date: 04/25/2023
ms.reviewer: mopeakande
ms.custom: template-how-to-pattern
---

# Collect production data from models deployed for real-time inferencing

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

In this article, you'll learn how to collect production inference data from a model deployed to an Azure Machine Learning managed online endpoint or Kubernetes online endpoint.

[!INCLUDE [machine-learning-preview-generic-disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

Azure Machine Learning **Data collector** logs inference data in Azure blob storage. You can enable data collection for new or existing online endpoint deployments.

Data collected with the provided Python SDK is automatically registered as a data asset in your Azure Machine Learning workspace. This data asset can be used for model monitoring.

If you are interested in collecting production inference data for a MLFlow model deployed to a real-time endpoint, doing so can be done with a single toggle. To learn how to do this, see [Data collection for MLFlow models](#data-collection-for-mlflow-models).

In this article, you'll learn to:

> [!div class="checklist"]
> * Do ...
> * Do ...
> * Do ...

## Prerequisites

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [basic prereqs cli](../../includes/machine-learning-cli-prereqs.md)]

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure Machine Learning workspace, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*`. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

# [Python](#tab/python)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

[!INCLUDE [basic prereqs sdk](../../includes/machine-learning-sdk-v2-prereqs.md)]

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure Machine Learning workspace, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*`. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

---

* Have a registered model that you can use for deployment. If you haven't already registered a model, see [Register your model as an asset in Machine Learning](how-to-manage-models.md#register-your-model-as-an-asset-in-machine-learning-by-using-the-cli).

* Create an Azure Machine Learning online endpoint. If you don't have an existing online endpoint, see [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md).

## Perform custom logging for model monitoring

Data collection with custom logging allows you to log pandas DataFrames directly from your scoring script, before, during, and after any data transformations. With custom logging, tabular data is logged in real-time to your workspace Blob storage, where it can be seamlessly consumed by your model monitors.

### Update your scoring script (`score.py`)

First, you will need to add custom logging code to your scoring script (`score.py`). You can view the PyPI page for the data collector SDK [here](https://pypi.org/project/azureml-ai-monitoring/). 

Open the scoring file and add the following line at the top to import the `azure-ai-monitoring` package:

```python
from azure.ai.monitoring import Collector
```

Next, in your `init()` function, declare your data collection variables (up to five data collection variables are supported):

> [!NOTE]
> If you use the names `model_inputs` and `model_outputs` for your `Collector` objects, the model monitoring system will automatically recognize the automatically registered data assets, which will provide for a more seamless model monitoring experience.

```python
global inputs_collector, outputs_collector
inputs_collector = Collector(name='model_inputs')          
outputs_collector = Collector(name='model_outputs')
```

By default, an exception is raised if there is a failure during data collection. Optionally, you can use the `on_error` parameter to specify a function to run on logging failure. For instance, 

```python
inputs_collector = Collector(name='model_inputs', on_error=lambda e: logging.info("ex:{}".format(e)))
```

Next, in your `run()` function, we utilize the `collect()` function to log DataFrames before and after scoring. The `context` is returned from the first call to `collect()`, and it contains information to correlate the model inputs and model outputs later.

```python
context = inputs_collector.collect(data) 
result = model.predict(data)
outputs_collector.collect(result, context)
```

> [!NOTE]
> Currently, only pandas DataFrames can be logged with the `collect()` API. If the data is not in DataFrame format when passed to `collect()`, it will not be logged to storage and an error will be reported.

```python
import pandas as pd
import json
from azureml.ai.monitoring import Collector

def init():
  global inputs_collector, outputs_collector

  # instantiate collectors with appropriate names, make sure align with deployment spec
  inputs_collector = Collector(name='model_inputs')                    
  outputs_collector = Collector(name='model_outputs')

def run(data): 
  # json data: { "data" : {  "col1": [1,2,3], "col2": [2,3,4] } }
  pdf_data = preprocess(json.loads(data))
  
  # tabular data: {  "col1": [1,2,3], "col2": [2,3,4] }
  input_df = pd.DataFrame(pdf_data)

  # collect inputs data, store correlation_context
  context = inputs_collector.collect(input_df)

  # perform scoring with pandas Dataframe, return value is also pandas Dataframe
  output_df = predict(input_df) 

  # collect outputs data, pass in correlation_context so inputs and outputs data can be correlated later
  outputs_collector.collect(output_df, context)
  
  return output_df.to_dict()
  
def preprocess(json_data):
  # preprocess the payload to ensure it can be converted to pandas DataFrame
  return json_data["data"]

def predict(input_df):
  # process input and return with outputs
  ...
  
  return output_df
```

### Update your dependencies 


### Update your deployment yaml 

## Log payload


## Collect data for MLFlow models

If you are deploying a MLFlow model to an Azure Machine Learning online endpoint, enabling production inference data collection can be done with single toggle if you are deploying from the StudioUI. 

## Next steps