---
title: Read and write data 
titleSuffix: Azure Machine Learning
description: Learn how to read and write data for consumption in Azure Machine Learning jobs
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.author: yogipandey
author: ynpandey
ms.reviewer: nibaccam
ms.date: 04/15/2022
ms.custom: devx-track-python,devplatv2


# Customer intent: As an experienced Python developer, I need to read in my data to make it available to a remote compute to train my machine learning models.
---

# Read and write data for ML experiments

Learn how to read and write data into jobs.
 
## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

- The [Azure Machine Learning SDK for Python v2](/python/api/overview/azure/ml/intro).

- An Azure Machine Learning workspace

```python

from azure.ml import MLClient
from azure.identity import InteractiveBrowserCredential

#enter details of your AML workspace
subscription_id = '<SUBSCRIPTION_ID>'
resource_group = '<RESOURCE_GROUP>'
workspace = '<AML_WORKSPACE_NAME>'

#get a handle to the workspace
ml_client = MLClient(InteractiveBrowserCredential(), subscription_id, resource_group, workspace)
```

## Use local data in a job

If you have data in your current working directory that you want to use in a job. 
The JobInput class allow you to define data inputs of type  uri_file (a specific file) or uri_folder (a folder location). The `path`
can be a local path or a cloud path. Azure Machine Learning supports https://, abfss://, wasbs:// and azureml:// URIs. If the path is local but your compute is defined to be in the cloud, Azure Machine Learning will automatically upload the data to cloud storage for you.

```python

from azure.ml.entities import Data, UriReference, JobInput, CommandJob
from azure.ml._constants import AssetTypes

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

## Using data stored in storage service on Azure in a job

You can read your data in from existing storage on Azure.

# [Azure Data Lake Storage Gen2](#tab/ADLS-Gen2)

```python

from azure.ml.entities import Data, UriReference, JobInput, CommandJob
from azure.ml._constants import AssetTypes

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

# [Azure Blob Storage](#tab/blob)

```python

from azure.ml.entities import Data, UriReference, JobInput, CommandJob
from azure.ml._constants import AssetTypes

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

## Read and write data to cloud-based storage

You can read and write data from your job into your cloud-based storage. 

The JobInput defaults the mode - how the input will be exposed during job runtime - to InputOutputModes.RO_MOUNT (read-only mount). Put another way, Azure Machine Learning will mount the file or folder to the compute and set the file/folder to read-only. By design, you cannot write to JobInputs only JobOutputs 
The data is automatically uploaded to cloud storage.

# [Azure Data Lake Storage Gen2](#tab/ADLS-Gen2)

```python
from azure.ml.entities import Data, UriReference, JobInput, CommandJob, JobOutput
from azure.ml._constants import AssetTypes

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

# [Azure Blob Storage ](#tab/blob)

```python

from azure.ml.entities import Data, UriReference, JobInput, CommandJob, JobOutput
from azure.ml._constants import AssetTypes

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

---

## Register data

You can register data as an asset. The benefits of registering data are:

* Easy to share with other members of the team (no need to remember file locations)
* Versioning of the metadata (location, description, etc)
* Lineage tracking

The following is an example of versioning the sample data in this repo and shows how to register a local file as a data asset. The data is uploaded to cloud storage and registered as an asset.

```python

from azure.ml.entities import Data
from azure.ml._constants import AssetTypes

my_data = Data(
    path="./sample_data/titanic.csv",
    type=AssetTypes.URI_FILE,
    description="Titanic Data",
    name="titanic",
    version='1'
)

ml_client.data.create_or_update(my_data)
``` 

To register data that is in a cloud location, just specify the path with any of the supported protocols for the storage type. The following example shows what the path looks like for data from Azure Data Lake Storage Gen 2. 

```python
from azure.ml.entities import Data
from azure.ml._constants import AssetTypes

my_path = 'abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>' # adls gen2

my_data = Data(
    path=my_path,
    type=AssetTypes.URI_FOLDER,
    description="description here",
    name="a_name",
    version='1'
)

ml_client.data.create_or_update(my_data)

```

## Consume registered data assets in job

Once your data is registered as an asset to the workspace you can consume that data asset in jobs.
The following example demonstrates how to consume `version` 1 of the registered data asset `titanic`. 

```python

from azure.ml.entities import Data, UriReference, JobInput, CommandJob
from azure.ml._constants import AssetTypes

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

## Move data between pipelines steps with the CLI v2


## Move data between pipelines steps with Python SDK v2 (preview)


## Next steps

