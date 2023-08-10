---
title: Collect production data from models deployed for real-time inferencing (preview)
titleSuffix: Azure Machine Learning
description: Collect inference data from a model deployed to a real-time endpoint on Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: how-to
author: ahughes-msft
ms.author: alehughes
ms.date: 04/25/2023
ms.reviewer: mopeakande
reviewer: msakande
ms.custom: devplatv2, build-2023
---

# Collect production data from models deployed for real-time inferencing (preview)

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

In this article, you'll learn how to collect production inference data from a model deployed to an Azure Machine Learning managed online endpoint or Kubernetes online endpoint.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

Azure Machine Learning **Data collector** logs inference data in Azure blob storage. You can enable data collection for new or existing online endpoint deployments.

Data collected with the provided Python SDK is automatically registered as a data asset in your Azure Machine Learning workspace. This data asset can be used for model monitoring.

If you're interested in collecting production inference data for a MLFlow model deployed to a real-time endpoint, doing so can be done with a single toggle. To learn how to do this, see [Data collection for MLFlow models](#collect-data-for-mlflow-models).


## Prerequisites

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [basic prereqs cli](includes/machine-learning-cli-prereqs.md)]

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure Machine Learning workspace, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*`. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

# [Python](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

[!INCLUDE [basic prereqs sdk](includes/machine-learning-sdk-v2-prereqs.md)]

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure Machine Learning workspace, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*`. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

---

* Have a registered model that you can use for deployment. If you haven't already registered a model, see [Register your model as an asset in Machine Learning](how-to-manage-models.md#register-your-model-as-an-asset-in-machine-learning-by-using-the-cli).

* Create an Azure Machine Learning online endpoint. If you don't have an existing online endpoint, see [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md).

## Perform custom logging for model monitoring

Data collection with custom logging allows you to log pandas DataFrames directly from your scoring script before, during, and after any data transformations. With custom logging, tabular data is logged in real-time to your workspace Blob storage or a custom Blob storage container. From storage, it can be consumed by your model monitors.

### Update your scoring script with custom logging code

First, you'll need to add custom logging code to your scoring script (`score.py`). For custom logging, you'll need the `azureml-ai-monitoring` package. For more information, see the comprehensive [PyPI page for the data collector SDK](https://pypi.org/project/azureml-ai-monitoring/).

1. Import the `azureml-ai-monitoring` package by adding the following line to the top of the scoring script:

    ```python
    from azureml.ai.monitoring import Collector
    ```

1. Declare your data collection variables (up to five of them) in your `init()` function:

    > [!NOTE]
    > If you use the names `model_inputs` and `model_outputs` for your `Collector` objects, the model monitoring system will automatically recognize the automatically registered data assets, which will provide for a more seamless model monitoring experience.
    
    ```python
    global inputs_collector, outputs_collector
    inputs_collector = Collector(name='model_inputs')          
    outputs_collector = Collector(name='model_outputs')
    inputs_outputs_collector = Collector(name='model_inputs_outputs')
    ```

    By default, Azure Machine Learning raises an exception if there's a failure during data collection. Optionally, you can use the `on_error` parameter to specify a function to run if logging failure happens. For instance, using the `on_error` parameter in the following code, Azure Machine Learning logs the error rather than throwing an exception:

    ```python
    inputs_collector = Collector(name='model_inputs', on_error=lambda e: logging.info("ex:{}".format(e)))
    ```

1. In your `run()` function, use the `collect()` function to log DataFrames before and after scoring. The `context` is returned from the first call to `collect()`, and it contains information to correlate the model inputs and model outputs later.

    ```python
    context = inputs_collector.collect(data) 
    result = model.predict(data)
    outputs_collector.collect(result, context)
    ```

    > [!NOTE]
    > Currently, only pandas DataFrames can be logged with the `collect()` API. If the data is not in a DataFrame when passed to `collect()`, it will not be logged to storage and an error will be reported.

The following code is an example of a full scoring script (`score.py`) that uses the custom logging Python SDK:

```python
import pandas as pd
import json
from azureml.ai.monitoring import Collector

def init():
  global inputs_collector, outputs_collector

  # instantiate collectors with appropriate names, make sure align with deployment spec
  inputs_collector = Collector(name='model_inputs')                    
  outputs_collector = Collector(name='model_outputs')
  inputs_outputs_collector = Collector(name='model_inputs_outputs') #note: this is used to enable Feature Attribution Drift

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

  # create a dataframe with inputs/outputs joined - this creates a URI folder (not mltable) 
  # input_output_df = input_df.merge(output_df, context)
  input_output_df = input_df.join(output_df)

  # collect both your inputs and output  
  inputs_outputs_collector.collect(input_output_df, context)
  
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

Before you create your deployment with the updated scoring script, you'll create your environment with the base image `mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04` and the appropriate conda dependencies, then you'll build the environment using the specification in the following YAML.

```yml
channels:
  - conda-forge
dependencies:
  - python=3.8
  - pip=22.3.1
  - pip:
      - azureml-defaults==1.38.0
      - azureml-ai-monitoring~=0.1.0b1
name: model-env
```

### Update your deployment YAML

Next, we'll create the deployment YAML. Include the `data_collector` attribute and enable collection for `model_inputs` and `model_outputs`, which are the names we gave our `Collector` objects earlier via the custom logging Python SDK:

```yml
data_collector:
  collections:
    model_inputs:
      enabled: 'True'
    model_outputs:
      enabled: 'True'
```

The following code is an example of a comprehensive deployment YAML for a managed online endpoint deployment. You should update the deployment YAML according to your scenario.

```yml
$schema: https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json
name: blue
endpoint_name: my_endpoint
model: azureml:iris_mlflow_model@latest
environment:
  image: mcr.microsoft.com/azureml/openmpi4.1.0-ubuntu20.04
  conda_file: model/conda.yaml
code_configuration:
  code: scripts
  scoring_script: score.py
instance_type: Standard_F2s_v2
instance_count: 1
data_collector:
  collections:
    model_inputs:
      enabled: 'True'
    model_outputs:
      enabled: 'True'
```

Optionally, you can adjust the following additional parameters for your `data_collector`:

- `data_collector.rolling_rate`: The rate to partition the data in storage. Value can be: Minute, Hour, Day, Month, or Year.
- `data_collector.sampling_rate`: The percentage, represented as a decimal rate, of data to collect. For instance, a value of 1.0 represents collecting 100% of data.
- `data_collector.collections.<collection_name>.data.name`: The name of the data asset to register with the collected data.
- `data_collector.collections.<collection_name>.data.path`: The full Azure Machine Learning datastore path where the collected data should be registered as a data asset.
- `data_collector.collections.<collection_name>.data.version`: The version of the data asset to be registered with the collected data in blob storage.

#### Collect data to a custom Blob storage container

If you need to collect your production inference data to a custom Blob storage container, you can do so with the data collector.

To use the data collector with a custom Blob storage container, connect the storage container to an Azure Machine Learning datastore. To learn how to do so, see [create datastores](how-to-datastore.md).

Next, ensure that your Azure Machine Learning endpoint has the necessary permissions to write to the datastore destination. The data collector supports both system assigned managed identities (SAMIs) and user assigned managed identities (UAMIs). Add the identity to your endpoint. Assign the role `Storage Blob Data Contributor` to this identity with the Blob storage container which will be used as the data destination. To learn how to use managed identities in Azure, see [assign Azure roles to a managed identity](/azure/role-based-access-control/role-assignments-portal-managed-identity).

Then, update your deployment YAML to include the `data` property within each collection. The `data.name` is a required parameter used to specify the name of the data asset to be registered with the collected data. The `data.path` is a required parameter used to specify the fully-formed Azure Machine Learning datastore path, which is connected to your Azure Blob storage container. The `data.version` is an optional parameter used to specify the version of the data asset (defaults to 1).

Here is an example YAML configuration of how you would do so:

```yml
data_collector:
  collections:
    model_inputs:
      enabled: 'True'
      data: 
        name: my_model_inputs_data_asset
        path: azureml://datastores/workspaceblobstore/paths/modelDataCollector/my_endpoint/blue/model_inputs
        version: 1
    model_outputs:
      enabled: 'True'
      data: 
        name: my_model_outputs_data_asset
        path: azureml://datastores/workspaceblobstore/paths/modelDataCollector/my_endpoint/blue/model_outputs 
        version: 1
```

**Note**: You can also use the `data.path` parameter to point to datastores in different Azure subscriptions. To do so, ensure your path looks like this: `azureml://subscriptions/<sub_id>/resourcegroups/<rg_name>/workspaces/<ws_name>/datastores/<datastore_name>/paths/<path>`

### Create your deployment with data collection

Deploy the model with custom logging enabled:

```bash
$ az ml online-deployment create -f deployment.YAML
```

For more information on how to format your deployment YAML for data collection (along with default values) with kubernetes online endpoints, see the [CLI (v2) Azure Arc-enabled Kubernetes online deployment YAML schema](reference-yaml-deployment-kubernetes-online.md). For more information on how to format your deployment YAML for data collection with managed online endpoints, see [CLI (v2) managed online deployment YAML schema](reference-yaml-deployment-managed-online.md).

### Store collected data in a blob
Blob storage output/format

By default, the collected data will be stored at the following path in your workspace Blob storage: `azureml://datastores/workspaceblobstore/paths/modelDataCollector`. The final path in Blob will be appended with `{endpoint_name}/{deployment_name}/{collection_name}/{yyyy}/{MM}/{dd}/{HH}/{instance_id}.jsonl`. Each line in the file is a JSON object representing a single inference request/response that was logged.

> [!NOTE]
> `collection_name` refers to the MDC data collection name (e.g., "model_inputs" or "model_outputs"). `instance_id` is a unique id identifying the grouping of data which was logged.

The collected data will follow the following json schema. The collected data is available from the `data` key and additional metadata is provided.

```json
{"specversion":"1.0",
"id":"725aa8af-0834-415c-aaf5-c76d0c08f694",
"source":"/subscriptions/636d700c-4412-48fa-84be-452ac03d34a1/resourceGroups/mire2etesting/providers/Microsoft.MachineLearningServices/workspaces/mirmasterws/onlineEndpoints/localdev-endpoint/deployments/localdev",
"type":"azureml.inference.inputs",
"datacontenttype":"application/json",
"time":"2022-12-01T08:51:30Z",
"data":[{"label":"DRUG","pattern":"aspirin"},{"label":"DRUG","pattern":"trazodone"},{"label":"DRUG","pattern":"citalopram"}],
"correlationid":"3711655d-b04c-4aa2-a6c4-6a90cbfcb73f","xrequestid":"3711655d-b04c-4aa2-a6c4-6a90cbfcb73f",
"modelversion":"default",
"collectdatatype":"pandas.core.frame.DataFrame",
"agent":"monitoring-sdk/0.1.2",
"contentrange":"bytes 0-116/117"}
```

> [!NOTE]
> Line breaks are shown only for readability. In your collected .jsonl files, there won't be any line breaks.


#### Store large payloads

If the payload of your data is greater than 256 kb, there will be an event in the `{instance_id}.jsonl` file contained within the `{endpoint_name}/{deployment_name}/request/.../{instance_id}.jsonl` path that points to a raw file path, which should have the following path: `blob_url/{blob_container}/{blob_path}/{endpoint_name}/{deployment_name}/{rolled_time}/{instance_id}.jsonl`. The collected data will exist at this path.

#### Store binary data

With collected binary data, we show the raw file directly, with `instance_id` as the file name. Binary data is placed in the same folder as the request source group path, based on the `rolling_rate`. The following example reflects the path in the data field. The format is json, and line breaks are only shown for readability:

```json
{
"specversion":"1.0",
"id":"ba993308-f630-4fe2-833f-481b2e4d169a",
"source":"/subscriptions//resourceGroups//providers/Microsoft.MachineLearningServices/workspaces/ws/onlineEndpoints/ep/deployments/dp",
"type":"azureml.inference.request",
"datacontenttype":"text/plain",
"time":"2022-02-28T08:41:07Z",
"data":"https://masterws0373607518.blob.core.windows.net/modeldata/mdc/%5Byear%5D%5Bmonth%5D%5Bday%5D-%5Bhour%5D_%5Bminute%5D/ba993308-f630-4fe2-833f-481b2e4d169a",
"path":"/score?size=1",
"method":"POST",
"contentrange":"bytes 0-80770/80771",
"datainblob":"true"
}
```

#### Viewing the data in the studio UI

To view the collected data in Blob storage from the studio UI:

1. Go to thee **Data** tab in your Azure Machine Learning workspace:

    :::image type="content" source="./media/how-to-collect-production-data/datastores.png" alt-text="Screenshot highlights Data page in Azure Machine Learning workspace" lightbox="media/how-to-collect-production-data/datastores.png":::

1. Navigate to **Datastores** and select your **workspaceblobstore (Default)**:

    :::image type="content" source="./media/how-to-collect-production-data/workspace-blob-store.png" alt-text="Screenshot highlights Datastores page in AzureML workspace" lightbox="media/how-to-collect-production-data/workspace-blob-store.png":::

1. Use the **Browse** menu to view the collected production data:

    :::image type="content" source="./media/how-to-collect-production-data/data-view.png" alt-text="Screenshot highlights tree structure of data in Datastore" lightbox="media/how-to-collect-production-data/data-view.png":::

## Log payload

In addition to custom logging with the provided Python SDK, you can collect request and response HTTP payload data directly without the need to augment your scoring script (`score.py`). To enable payload logging, in your deployment YAML, use the names `request` and `response`:

```yml
$schema: http://azureml/sdk-2-0/OnlineDeployment.json

endpoint_name: my_endpoint 
name: blue 
model: azureml:my-model-m1:1 
environment: azureml:env-m1:1 
data_collector:
   collections:
       request:
           enabled: 'True'
       response:
           enabled: 'True'
```

Deploy the model with payload logging enabled:

```bash
$ az ml online-deployment create -f deployment.YAML
```

> [!NOTE]
> With payload logging, the collected data is not guaranteed to be in tabular format. Because of this, if you want to use collected payload data with model monitoring, you'll be required to provide a pre-processing component to make the data tabular. If you're interested in a seamless model monitoring experience, we recommend using the [custom logging Python SDK](#perform-custom-logging-for-model-monitoring).

As your deployment is used, the collected data will flow to your workspace Blob storage. The following code is an example of an HTTP _request_ collected JSON:

```json
{"specversion":"1.0",
"id":"19790b87-a63c-4295-9a67-febb2d8fbce0",
"source":"/subscriptions/d511f82f-71ba-49a4-8233-d7be8a3650f4/resourceGroups/mire2etesting/providers/Microsoft.MachineLearningServices/workspaces/mirmasterenvws/onlineEndpoints/localdev-endpoint/deployments/localdev",
"type":"azureml.inference.request",
"datacontenttype":"application/json",
"time":"2022-05-25T08:59:48Z",
"data":{"data": [  [1,2,3,4,5,6,7,8,9,10], [10,9,8,7,6,5,4,3,2,1]]},
"path":"/score",
"method":"POST",
"contentrange":"bytes 0-59/*",
"correlationid":"f6e806c9-1a9a-446b-baa2-901373162105","xrequestid":"f6e806c9-1a9a-446b-baa2-901373162105"}
```

And the following code is an example of an HTTP _response_ collected JSON:

```json
{"specversion":"1.0",
"id":"bbd80e51-8855-455f-a719-970023f41e7d",
"source":"/subscriptions/d511f82f-71ba-49a4-8233-d7be8a3650f4/resourceGroups/mire2etesting/providers/Microsoft.MachineLearningServices/workspaces/mirmasterenvws/onlineEndpoints/localdev-endpoint/deployments/localdev",
"type":"azureml.inference.response",
"datacontenttype":"application/json",
"time":"2022-05-25T08:59:48Z",
"data":[11055.977245525679, 4503.079536107787],
"contentrange":"bytes 0-38/39",
"correlationid":"f6e806c9-1a9a-446b-baa2-901373162105","xrequestid":"f6e806c9-1a9a-446b-baa2-901373162105"}
```

## Collect data for MLFlow models

If you're deploying an MLFlow model to an Azure Machine Learning online endpoint, you can enable production inference data collection with single toggle in the studio UI. If data collection is toggled on, we'll auto-instrument your scoring script with custom logging code to ensure that the production data is logged to your workspace Blob storage. The data can then be used by your model monitors to monitor the performance of your MLFlow model in production.

To enable production data collection, while you're deploying your model, under the **Deployment** tab, select **Enabled** for **Data collection (preview)**.

After enabling data collection, production inference data will be logged to your Azure Machine Learning workspace blob storage and two data assets will be created with names `<endpoint_name>-<deployment_name>-model_inputs` and `<endpoint_name>-<deployment_name>-model_outputs`. These data assets will be updated in real-time as your deployment is used in production. The data assets can then be used by your model monitors to monitor the performance of your model in production.

## Next steps

To learn how to monitor the performance of your models with the collected production inference data, see the following articles:

- [What are Azure Machine Learning endpoints?](concept-endpoints.md)
