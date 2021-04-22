---
title: Profile model memory and CPU usage
titleSuffix: Azure Machine Learning
description: Learn to profile your model before deployment. Profiling determines the memory and CPU usage of your model.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: gopalv
author: gvashishtha
ms.date: 07/31/2020
ms.topic: how-to
zone_pivot_groups: aml-control-methods
ms.reviewer: larryfr
ms.custom: deploy
---

# Profile your model to determine resource utilization

This article shows how to profile a machine learning to model to determine how much CPU and memory you will need to allocate for the model when deploying it as a web service.

## Prerequisites

This article assumes you have trained and registered a model with Azure Machine Learning. See the [sample tutorial here](how-to-train-scikit-learn.md) for an example of training and registering a scikit-learn model with Azure Machine Learning.

## Limitations

* Profiling will not work when the Azure Container Registry (ACR) for your workspace is behind a virtual network.

## Run the profiler

Once you have registered your model and prepared the other components necessary for its deployment, you can determine the CPU and memory the deployed service will need. Profiling tests the service that runs your model and returns information such as the CPU usage, memory usage, and response latency. It also provides a recommendation for the CPU and memory based on resource usage.

In order to profile your model, you will need:
* A registered model.
* An inference configuration based on your entry script and inference environment definition.
* A single column tabular dataset, where each row contains a string representing sample request data.

> [!IMPORTANT]
> At this point we only support profiling of services that expect their request data to be a string, for example: string serialized json, text, string serialized image, etc. The content of each row of the dataset (string) will be put into the body of the HTTP request and sent to the service encapsulating the model for scoring.

> [!IMPORTANT]
> We only support profiling up to 2 CPUs in ChinaEast2 and USGovArizona region.

Below is an example of how you can construct an input dataset to profile a service that expects its incoming request data to contain serialized json. In this case, we created a dataset based 100 instances of the same request data content. In real world scenarios we suggest that you use larger datasets containing various inputs, especially if your model resource usage/behavior is input dependent.

::: zone pivot="py-sdk"

```python
import json
from azureml.core import Datastore
from azureml.core.dataset import Dataset
from azureml.data import dataset_type_definitions

input_json = {'data': [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                       [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]]}
# create a string that can be utf-8 encoded and
# put in the body of the request
serialized_input_json = json.dumps(input_json)
dataset_content = []
for i in range(100):
    dataset_content.append(serialized_input_json)
dataset_content = '\n'.join(dataset_content)
file_name = 'sample_request_data.txt'
f = open(file_name, 'w')
f.write(dataset_content)
f.close()

# upload the txt file created above to the Datastore and create a dataset from it
data_store = Datastore.get_default(ws)
data_store.upload_files(['./' + file_name], target_path='sample_request_data')
datastore_path = [(data_store, 'sample_request_data' +'/' + file_name)]
sample_request_data = Dataset.Tabular.from_delimited_files(
    datastore_path, separator='\n',
    infer_column_types=True,
    header=dataset_type_definitions.PromoteHeadersBehavior.NO_HEADERS)
sample_request_data = sample_request_data.register(workspace=ws,
                                                   name='sample_request_data',
                                                   create_new_version=True)
```

Once you have the dataset containing sample request data ready, create an inference configuration. Inference configuration is based on the score.py and the environment definition. The following example demonstrates how to create the inference configuration and run profiling:

```python
from azureml.core.model import InferenceConfig, Model
from azureml.core.dataset import Dataset


model = Model(ws, id=model_id)
inference_config = InferenceConfig(entry_script='path-to-score.py',
                                   environment=myenv)
input_dataset = Dataset.get_by_name(workspace=ws, name='sample_request_data')
profile = Model.profile(ws,
            'unique_name',
            [model],
            inference_config,
            input_dataset=input_dataset)

profile.wait_for_completion(True)

# see the result
details = profile.get_details()
```

::: zone-end

::: zone pivot="cli"


The following command demonstrates how to profile a model by using the CLI:

```azurecli-interactive
az ml model profile -g <resource-group-name> -w <workspace-name> --inference-config-file <path-to-inf-config.json> -m <model-id> --idi <input-dataset-id> -n <unique-name>
```

> [!TIP]
> To persist the information returned by profiling, use tags or properties for the model. Using tags or properties stores the data with the model in the model registry. The following examples demonstrate adding a new tag containing the `requestedCpu` and `requestedMemoryInGb` information:
>
> ```python
> model.add_tags({'requestedCpu': details['requestedCpu'],
>                 'requestedMemoryInGb': details['requestedMemoryInGb']})
> ```
>
> ```azurecli-interactive
> az ml model profile -g <resource-group-name> -w <workspace-name> --i <model-id> --add-tag requestedCpu=1 --add-tag requestedMemoryInGb=0.5
> ```

::: zone-end

## Next steps

* [Troubleshoot a failed deployment](how-to-troubleshoot-deployment.md)
* [Deploy to Azure Kubernetes Service](how-to-deploy-azure-kubernetes-service.md)
* [Create client applications to consume web services](how-to-consume-web-service.md)
* [Update web service](how-to-deploy-update-web-service.md)
* [How to deploy a model using a custom Docker image](how-to-deploy-custom-docker-image.md)
* [Use TLS to secure a web service through Azure Machine Learning](how-to-secure-web-service.md)
* [Monitor your Azure Machine Learning models with Application Insights](how-to-enable-app-insights.md)
* [Collect data for models in production](how-to-enable-data-collection.md)
* [Create event alerts and triggers for model deployments](how-to-use-event-grid.md)

