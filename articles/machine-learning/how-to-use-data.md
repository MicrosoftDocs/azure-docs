---
title: Work with data using SDK v2 (preview)
titleSuffix: Azure Machine Learning
description: 'Learn to how work with data using the Python SDK v2 preview for Azure Machine Learning.'
services: machine-learning
ms.service: machine-learning
author: blackmist
ms.author: larryfr
ms.subservice: core
ms.date: 05/10/2022
ms.topic: how-to
ms.custom: how-to, deploy, devplatv2, event-tier1-build-2022
---

# Work with data using SDK v2 preview

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

Azure Machine Learning allows you to work with different types of data. In this article, you'll learn about using the Python SDK v2 to work with _URIs_ and _Tables_. URIs reference a location either local to your development environment or in the cloud. Tables are a tabular data abstraction.

For most scenarios, you'll use URIs (`uri_folder` and `uri_file`). A URI references a location in storage that can be easily mapped to the filesystem of a compute node when you run a job. The data is accessed by either mounting or downloading the storage to the node.

When using tables, you'll use `mltable`. It's an abstraction for tabular data that is used for AutoML jobs, parallel jobs, and some advanced scenarios. If you're just starting to use Azure Machine Learning, and aren't using AutoML, we strongly encourage you to begin with URIs.

> [!TIP]
> If you have dataset assets created using the SDK v1, you can still use those with SDK v2. For more information, see the [Consuming V1 Dataset Assets in V2](#consuming-v1-dataset-assets-in-v2) section.



## Prerequisites

* An Azure subscription - If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.
* An Azure Machine Learning workspace.
* The Azure Machine Learning SDK v2 for Python



## URIs

The code snippets in this section cover the following scenarios:

* Reading data in a job
* Reading *and* writing data in a job
* Registering data as an asset in Azure Machine Learning
* Reading registered data assets from Azure Machine Learning in a job

These snippets use `uri_file` and `uri_folder`.

- `uri_file` is a type that refers to a specific file. For example, `'https://<account_name>.blob.core.windows.net/<container_name>/path/file.csv'`.
- `uri_folder` is a type that refers to a specific folder. For example, `'https://<account_name>.blob.core.windows.net/<container_name>/path'`. 

> [!TIP]
> We recommend using an argument parser to pass folder information into _data-plane_ code. By data-plane code, we mean your data processing and/or training code that you run in the cloud. The code that runs in your development environment and submits code to the data-plane is _control-plane_ code.
>
> Data-plane code is typically a Python script, but can be any programming language. Passing the folder as part of job submission allows you to easily adjust the path from training locally using local data, to training in the cloud. For example, the following example uses `argparse` to get a `uri_folder`, which is joined with the file name to form a path:
> 
> ```python
> # train.py
> import argparse
> import os
> import pandas as pd
> 
> parser = argparse.ArgumentParser()
> parser.add_argument("--input_folder", type=str)
> args = parser.parse_args()
> 
> file_name = os.path.join(args.input_folder, "MY_CSV_FILE.csv") 
> df = pd.read_csv(file_name)
> print(df.head(10))
> # process data
> # train a model
> # etc
> ```
>
> If you wanted to pass in just an individual file rather than the entire folder you can use the `uri_file` type.

For a complete example, see the [working_with_uris.ipynb notebook](https://github.com/azure/azureml-previews/sdk/docs/working_with_uris.ipynb).

Below are some common data access patterns that you can use in your *control-plane* code to submit a job to Azure Machine Learning:

### Use data with a training job

Use the tabs below to select where your data is located.

# [Local data](#tab/use-local)

When you pass local data, the data is automatically uploaded to cloud storage as part of the job submission.

```python
from azure.ai.ml.entities import Data, UriReference, JobInput, CommandJob
from azure.ai.ml._constants import AssetTypes

my_job_inputs = {
    "input_data": JobInput(
        path='./sample_data', # change to be your local directory
        type=AssetTypes.URI_FOLDER
    )
}

job = CommandJob(
    code="./src", # local path where the code is stored
    command='python train.py --input_folder ${{inputs.input_data}}',
    inputs=my_job_inputs,
    environment="AzureML-sklearn-0.24-ubuntu18.04-py37-cpu:9",
    compute="cpu-cluster"
)

#submit the command job
returned_job = ml_client.create_or_update(job)
#get a URL for the status of the job
returned_job.services["Studio"].endpoint
```

# [ADLS Gen2](#tab/use-adls)

```python
from azure.ai.ml.entities import Data, UriReference, JobInput, CommandJob
from azure.ai.ml._constants import AssetTypes

# in this example we
my_job_inputs = {
    "input_data": JobInput(
        path='abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>',
        type=AssetTypes.URI_FOLDER
    )
}

job = CommandJob(
    code="./src", # local path where the code is stored
    command='python train.py --input_folder ${{inputs.input_data}}',
    inputs=my_job_inputs,
    environment="AzureML-sklearn-0.24-ubuntu18.04-py37-cpu:9",
    compute="cpu-cluster"
)

#submit the command job
returned_job = ml_client.create_or_update(job)
#get a URL for the status of the job
returned_job.services["Studio"].endpoint
```

# [Blob](#tab/use-blob)

```python
from azure.ai.ml.entities import Data, UriReference, JobInput, CommandJob
from azure.ai.ml._constants import AssetTypes

# in this example we
my_job_inputs = {
    "input_data": JobInput(
        path='https://<account_name>.blob.core.windows.net/<container_name>/path',
        type=AssetTypes.URI_FOLDER
    )
}

job = CommandJob(
    code="./src", # local path where the code is stored
    command='python train.py --input_folder ${{inputs.input_data}}',
    inputs=my_job_inputs,
    environment="AzureML-sklearn-0.24-ubuntu18.04-py37-cpu:9",
    compute="cpu-cluster"
)

#submit the command job
returned_job = ml_client.create_or_update(job)
#get a URL for the status of the job
returned_job.services["Studio"].endpoint
```

---

### Read and write data in a job

Use the tabs below to select where your data is located.

# [Blob](#tab/rw-blob)

```python
from azure.ai.ml.entities import Data, UriReference, JobInput, CommandJob, JobOutput
from azure.ai.ml._constants import AssetTypes

my_job_inputs = {
    "input_data": JobInput(
        path='https://<account_name>.blob.core.windows.net/<container_name>/path',
        type=AssetTypes.URI_FOLDER
    )
}

my_job_outputs = {
    "output_folder": JobOutput(
        path='https://<account_name>.blob.core.windows.net/<container_name>/path',
        type=AssetTypes.URI_FOLDER
    )
}

job = CommandJob(
    code="./src", #local path where the code is stored
    command='python pre-process.py --input_folder ${{inputs.input_data}} --output_folder ${{outputs.output_folder}}',
    inputs=my_job_inputs,
    outputs=my_job_outputs,
    environment="AzureML-sklearn-0.24-ubuntu18.04-py37-cpu:9",
    compute="cpu-cluster"
)

#submit the command job
returned_job = ml_client.create_or_update(job)
#get a URL for the status of the job
returned_job.services["Studio"].endpoint
```

# [ADLS Gen2](#tab/rw-adls)

```python
from azure.ai.ml.entities import Data, UriReference, JobInput, CommandJob, JobOutput
from azure.ai.ml._constants import AssetTypes

my_job_inputs = {
    "input_data": JobInput(
        path='abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>',
        type=AssetTypes.URI_FOLDER
    )
}

my_job_outputs = {
    "output_folder": JobOutput(
        path='abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>',
        type=AssetTypes.URI_FOLDER
    )
}

job = CommandJob(
    code="./src", #local path where the code is stored
    command='python pre-process.py --input_folder ${{inputs.input_data}} --output_folder ${{outputs.output_folder}}',
    inputs=my_job_inputs,
    outputs=my_job_outputs,
    environment="AzureML-sklearn-0.24-ubuntu18.04-py37-cpu:9",
    compute="cpu-cluster"
)

#submit the command job
returned_job = ml_client.create_or_update(job)
#get a URL for the status of the job
returned_job.services["Studio"].endpoint
```
---

### Register data assets

```python
from azure.ai.ml.entities import Data
from azure.ai.ml._constants import AssetTypes

# select one from:
my_path = 'abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>' # adls gen2
my_path = 'https://<account_name>.blob.core.windows.net/<container_name>/path' # blob

my_data = Data(
    path=my_path,
    type=AssetTypes.URI_FOLDER,
    description="description here",
    name="a_name",
    version='1'
)

ml_client.data.create_or_update(my_data)
```

### Consume registered data assets in job

```python
from azure.ai.ml.entities import Data, UriReference, JobInput, CommandJob
from azure.ai.ml._constants import AssetTypes

registered_data_asset = ml_client.data.get(name='titanic', version='1')

my_job_inputs = {
    "input_data": JobInput(
        type=AssetTypes.URI_FOLDER,
        path=registered_data_asset.id
    )
}

job = CommandJob(
    code="./src", 
    command='python read_data_asset.py --input_folder ${{inputs.input_data}}',
    inputs=my_job_inputs,
    environment="AzureML-sklearn-0.24-ubuntu18.04-py37-cpu:9",
    compute="cpu-cluster"
)

#submit the command job
returned_job = ml_client.create_or_update(job)
#get a URL for the status of the job
returned_job.services["Studio"].endpoint
```

## Table

An MLTable is primarily an abstraction over tabular data, but it can also be used for some advanced scenarios involving multiple paths. The following YAML describes an MLTable:

```yaml
paths: 
  - file: ./titanic.csv
transformations: 
  - read_delimited: 
      delimiter: ',' 
      encoding: 'ascii' 
      empty_as_string: false
      header: from_first_file
```

The contents of the MLTable file specify the underlying data location (here a local path) and also the transforms to perform on the underlying data before materializing into a pandas/spark/dask data frame. The important part here's that the MLTable-artifact doesn't have any absolute paths, making it *self-contained*. All the information stored in one folder; regardless of whether that folder is stored on your local drive or in your cloud drive or on a public http server.

To consume the data in a job or interactive session, use `mltable`:

```python
import mltable

tbl = mltable.load("./sample_data")
df = tbl.to_pandas_dataframe()
```

For a full example of using an MLTable, see the [Working with MLTable notebook].

## Consuming V1 dataset assets in V2

> [!NOTE]
> While full backward compatibility is provided, if your intention with your V1 `FileDataset` assets was to have a single path to a file or folder with no loading transforms (sample, take, filter, etc.), then we recommend that you re-create them as a `uri_file`/`uri_folder` using the v2 CLI:
> 
> ```cli
> az ml data create --file my-data-asset.yaml
> ```

Registered v1 `FileDataset` and `TabularDataset` data assets can be consumed in an v2 job using `mltable`. To use the v1 assets, add the following definition in the `inputs` section of your job yaml:

```yaml
inputs:
    my_v1_dataset:
        type: mltable
        path: azureml:myv1ds:1
        mode: eval_mount
```

The following example shows how to do this using the v2 SDK:

```python
from azure.ai.ml.entities import Data, UriReference, JobInput, CommandJob
from azure.ai.ml._constants import AssetTypes

registered_v1_data_asset = ml_client.data.get(name='<ASSET NAME>', version='<VERSION NUMBER>')

my_job_inputs = {
    "input_data": JobInput(
        type=AssetTypes.MLTABLE, 
        path=registered_v1_data_asset.id,
        mode="eval_mount"
    )
}

job = CommandJob(
    code="./src", #local path where the code is stored
    command='python train.py --input_data ${{inputs.input_data}}',
    inputs=my_job_inputs,
    environment="AzureML-sklearn-0.24-ubuntu18.04-py37-cpu:9",
    compute="cpu-cluster"
)

#submit the command job
returned_job = ml_client.jobs.create_or_update(job)
#get a URL for the status of the job
returned_job.services["Studio"].endpoint
```

## Next steps

* [Install and set up Python SDK v2 (preview)](https://aka.ms/sdk-v2-install)
* [Train models with the Python SDK v2 (preview)](how-to-train-sdk.md)
* [Tutorial: Create production ML pipelines with Python SDK v2 (preview)](tutorial-pipeline-python-sdk.md)
