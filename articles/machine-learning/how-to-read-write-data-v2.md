---
title: Access data in a job
titleSuffix: Azure Machine Learning
description: Learn how to read and write data in Azure Machine Learning training jobs.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.author: yogipandey
author: ynpandey
ms.reviewer: franksolomon
ms.date: 01/23/2023
ms.custom: devx-track-python, devplatv2, sdkv2, cliv2, event-tier1-build-2022, ignite-2022
#Customer intent: As an experienced Python developer, I need to read in my data to make it available to a remote compute to train my machine learning models.
---

# Access data in a job

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning CLI extension you use:"]
> * [v1](v1/how-to-train-with-datasets.md)
> * [v2 (current version)](how-to-read-write-data-v2.md)

Learn how to read and write data for your jobs with the Azure Machine Learning Python SDK v2 and the Azure Machine Learning CLI extension v2.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

- The [Azure Machine Learning SDK for Python v2](https://aka.ms/sdk-v2-install).

- An Azure Machine Learning workspace

## Supported paths

When you provide a data input/output to a Job, you must specify a `path` parameter that points to the data location. This table shows both the different data locations that Azure Machine Learning supports, and examples for the `path` parameter:


|Location  | Examples  |
|---------|---------|
|A path on your local computer     | `./home/username/data/my_data`         |
|A path on a public http(s) server    |  `https://raw.githubusercontent.com/pandas-dev/pandas/main/doc/data/titanic.csv`    |
|A path on Azure Storage     |   `https://<account_name>.blob.core.windows.net/<container_name>/<path>` <br> `abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>`    |
|A path on a Datastore   |   `azureml://datastores/<data_store_name>/paths/<path>`      |
|A path to a Data Asset  |  `azureml:<my_data>:<version>`  |

## Supported modes

When you run a job with data inputs/outputs, you can specify the *mode* - for example, whether the data should be read-only mounted, or downloaded to the compute target. This table shows the possible modes for different type/mode/input/output combinations:

Type | Input/Output | `upload` | `download` | `ro_mount` | `rw_mount` | `direct` | `eval_download` | `eval_mount` 
------ | ------ | :---: | :---: | :---: | :---: | :---: | :---: | :---:
`uri_folder` | Input  |   | ✓  |  ✓  |   | ✓  |  | 
`uri_file`   | Input |   | ✓  |  ✓  |   | ✓  |  | 
`mltable`   | Input |   | ✓  |  ✓  |   | ✓  | ✓ | ✓
`uri_folder` | Output  | ✓  |   |    | ✓  |   |  | 
`uri_file`   | Output | ✓  |   |    | ✓  |   |  | 
`mltable`   | Output | ✓  |   |    | ✓  | ✓  |  | 

> [!NOTE]
> `eval_download` and `eval_mount` are unique to `mltable`. The `ro_mount` is the default mode for MLTable. In some scenarios, however, an MLTable can yield files that are not necessarily co-located with the MLTable file in storage. Alternately, an `mltable` can subset or shuffle the data located in the storage resource. That view becomes visible only if the engine actually evaluates the MLTable file. These modes provide that view of the files.


## Read data in a job

# [Azure CLI](#tab/cli)

Create a job specification YAML file (`<file-name>.yml`). In the `inputs` section of the job, specify:

1. The `type`; whether the data is a specific file (`uri_file`), a folder location (`uri_folder`), or an `mltable`.
1. The `path` of your data location; any of the paths outlined in the [Supported Paths](#supported-paths) section will work.

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json

# Possible Paths for Data:
# Blob: https://<account_name>.blob.core.windows.net/<container_name>/<folder>/<file>
# Datastore: azureml://datastores/<data_store_name>/paths/<path>
# Data Asset: azureml:<my_data>:<version>

command: |
  ls ${{inputs.my_data}}
code: <folder where code is located>
inputs:
  my_data:
    type: <type> # uri_file, uri_folder, mltable
    path: <path>
environment: azureml:AzureML-sklearn-1.0-ubuntu20.04-py38-cpu@latest
compute: azureml:cpu-cluster
```

Next, run in the CLI

```azurecli
az ml job create -f <file-name>.yml
```

# [Python SDK](#tab/python)

Use the `Input` class to define:

1. The `type`; whether the data is a specific file (`uri_file`), a folder location (`uri_folder`), or an `mltable`.
1. The `path` of your data location; any of the paths outlined in the [Supported Paths](#supported-paths) section will work.

```python
from azure.ai.ml import command
from azure.ai.ml.entities import Data
from azure.ai.ml import Input
from azure.ai.ml.constants import AssetTypes
from azure.ai.ml import MLClient

ml_client = MLClient.from_config()

# Possible Asset Types for Data:
# AssetTypes.URI_FILE
# AssetTypes.URI_FOLDER
# AssetTypes.MLTABLE

# Possible Paths for Data:
# Blob: https://<account_name>.blob.core.windows.net/<container_name>/<folder>/<file>
# Datastore: azureml://datastores/<data_store_name>/paths/<path>
# Data Asset: azureml:<my_data>:<version>

my_job_inputs = {
    "input_data": Input(type=AssetTypes.URI_FOLDER, path="<path>")
}

job = command(
    code="./src",  # local path where the code is stored
    command="ls ${{inputs.input_data}}",
    inputs=my_job_inputs,
    environment="AzureML-sklearn-0.24-ubuntu18.04-py37-cpu:latest",
    compute="cpu-cluster",
)

# submit the command
returned_job = ml_client.jobs.create_or_update(job)
# get a URL for the status of the job
returned_job.services["Studio"].endpoint
```

---

### Read V1 data assets
This section explains how to read V1 `FileDataset` and `TabularDataset` data entities in a V2 job.

#### Read a `FileDataset`

# [Azure CLI](#tab/cli)

Create a job specification YAML file (`<file-name>.yml`), with the type set to `mltable` and the mode set to `eval_mount`:

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json

command: |
  ls ${{inputs.my_data}}
code: <folder where code is located>
inputs:
  my_data:
    type: mltable
    mode: eval_mount
    path: azureml:<filedataset_name>@latest
environment: azureml:<environment_name>@latest
compute: azureml:cpu-cluster
```

Next, run in the CLI

```azurecli
az ml job create -f <file-name>.yml
```

# [Python SDK](#tab/python)

In the `Input` object, specify the `type` as `AssetTypes.MLTABLE` and `mode` as `InputOutputModes.EVAL_MOUNT`:

```python
from azure.ai.ml import command
from azure.ai.ml.entities import Data
from azure.ai.ml import Input
from azure.ai.ml.constants import AssetTypes, InputOutputModes
from azure.ai.ml import MLClient

ml_client = MLClient.from_config()

filedataset_asset = ml_client.data.get(name="<filedataset_name>", version="<version>")

my_job_inputs = {
    "input_data": Input(
            type=AssetTypes.MLTABLE, 
            path=filedataset_asset,
            mode=InputOutputModes.EVAL_MOUNT
    )
}

job = command(
    code="./src",  # local path where the code is stored
    command="ls ${{inputs.input_data}}",
    inputs=my_job_inputs,
    environment="<environment_name>:<version>",
    compute="cpu-cluster",
)

# submit the command
returned_job = ml_client.jobs.create_or_update(job)
# get a URL for the job status
returned_job.services["Studio"].endpoint
```

---

#### Read a `TabularDataset`

# [Azure CLI](#tab/cli)

Create a job specification YAML file (`<file-name>.yml`), with the type set to `mltable` and the mode set to `direct`:

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json

command: |
  ls ${{inputs.my_data}}
code: <folder where code is located>
inputs:
  my_data:
    type: mltable
    mode: direct
    path: azureml:<tabulardataset_name>@latest
environment: azureml:<environment_name>@latest
compute: azureml:cpu-cluster
```

Next, run in the CLI

```azurecli
az ml job create -f <file-name>.yml
```

# [Python SDK](#tab/python)

In the `Input` object, specify the `type` as `AssetTypes.MLTABLE`, and `mode` as `InputOutputModes.DIRECT`:

```python
from azure.ai.ml import command
from azure.ai.ml.entities import Data
from azure.ai.ml import Input
from azure.ai.ml.constants import AssetTypes, InputOutputModes
from azure.ai.ml import MLClient

ml_client = MLClient.from_config()

filedataset_asset = ml_client.data.get(name="<tabulardataset_name>", version="<version>")

my_job_inputs = {
    "input_data": Input(
            type=AssetTypes.MLTABLE, 
            path=filedataset_asset,
            mode=InputOutputModes.DIRECT
    )
}

job = command(
    code="./src",  # local path where the code is stored
    command="python train.py --inputs ${{inputs.input_data}}",
    inputs=my_job_inputs,
    environment="<environment_name>:<version>",
    compute="cpu-cluster",
)

# submit the command
returned_job = ml_client.jobs.create_or_update(job)
# get a URL for the status of the job
returned_job.services["Studio"].endpoint
```

---

## Write data in a job

In your job, you can write data to your cloud-based storage with *outputs*. The [Supported modes](#supported-modes) section showed that only job *outputs* can write data, because the mode can be either `rw_mount` or `upload`.

# [Azure CLI](#tab/cli)

Create a job specification YAML file (`<file-name>.yml`), with the `outputs` section populated with the type and path where you'd like to write your data:

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/CommandJob.schema.json

# Possible Paths for Data:
# Blob: https://<account_name>.blob.core.windows.net/<container_name>/<folder>/<file>
# Datastore: azureml://datastores/<data_store_name>/paths/<path>
# Data Asset: azureml:<my_data>:<version>

code: src
command: >-
  python prep.py 
  --raw_data ${{inputs.raw_data}} 
  --prep_data ${{outputs.prep_data}}
inputs:
  raw_data: 
    type: <type> # uri_file, uri_folder, mltable
    path: <path>
outputs:
  prep_data: 
    type: <type> # uri_file, uri_folder, mltable
    path: <path>
environment: azureml:<environment_name>@latest
compute: azureml:cpu-cluster
```

Next, create a job with the CLI:

```azurecli
az ml job create --file <file-name>.yml
```

# [Python SDK](#tab/python)

```python
from azure.ai.ml import command
from azure.ai.ml.entities import Data
from azure.ai.ml import Input, Output
from azure.ai.ml.constants import AssetTypes

# Possible Asset Types for Data:
# AssetTypes.URI_FILE
# AssetTypes.URI_FOLDER
# AssetTypes.MLTABLE

# Possible Paths for Data:
# Blob: https://<account_name>.blob.core.windows.net/<container_name>/<folder>/<file>
# Datastore: azureml://datastores/<data_store_name>/paths/<path>
# Data Asset: azureml:<my_data>:<version>

my_job_inputs = {
    "raw_data": Input(type=AssetTypes.URI_FOLDER, path="<path>")
}

my_job_outputs = {
    "prep_data": Output(type=AssetTypes.URI_FOLDER, path="<path>")
}

job = command(
    code="./src",  # local path where the code is stored
    command="python process_data.py --raw_data ${{inputs.raw_data}} --prep_data ${{outputs.prep_data}}",
    inputs=my_job_inputs,
    outputs=my_job_outputs,
    environment="<environment_name>:<version>",
    compute="cpu-cluster",
)

# submit the command
returned_job = ml_client.create_or_update(job)
# get a URL for the status of the job
returned_job.services["Studio"].endpoint

```

---

## Data in pipelines

If you work with Azure Machine Learning pipelines, you can read data into and move data between pipeline components with the Azure Machine Learning CLI v2 extension, or the Python SDK v2.

### Azure Machine Learning CLI v2
This YAML file shows how to use the output data from one component as the input for another component of the pipeline, with the Azure Machine Learning CLI v2 extension:

[!INCLUDE [CLI v2](../../includes/machine-learning-CLI-v2.md)]

:::code language="yaml" source="~/azureml-examples-main/CLI/jobs/pipelines-with-components/basics/3b_pipeline_with_data/pipeline.yml":::

### Python SDK v2

This example defines a pipeline that contains three nodes, and moves data between each node.

* `prepare_data_node` loads the image and labels from Fashion MNIST data set into `mnist_train.csv` and `mnist_test.csv`.
* `train_node` trains a CNN model with Keras, using the `mnist_train.csv` training data.
* `score_node` scores the model using `mnist_test.csv` test data.

[!notebook-python[] (~/azureml-examples-main/sdk/python/jobs/pipelines/2e_image_classification_keras_minist_convnet/image_classification_keras_minist_convnet.ipynb?name=build-pipeline)]

## Next steps

* [Train models](how-to-train-model.md)
* [Tutorial: Create production ML pipelines with Python SDK v2](tutorial-pipeline-python-sdk.md)
* Learn more about [Data in Azure Machine Learning](concept-data.md)
