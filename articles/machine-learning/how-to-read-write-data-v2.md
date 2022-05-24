---
title: Read and write data 
titleSuffix: Azure Machine Learning
description: Learn how to read and write data for consumption in Azure Machine Learning training jobs.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.author: yogipandey
author: ynpandey
ms.reviewer: ssalgadodev
ms.date: 04/15/2022
ms.custom: devx-track-python, devplatv2, sdkv2, cliv2, event-tier1-build-2022
#Customer intent: As an experienced Python developer, I need to read in my data to make it available to a remote compute to train my machine learning models.
---

# Read and write data for ML experiments
[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]
[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

Learn how to read and write data for your training jobs with the Azure Machine Learning Python SDK v2(preview) and the Azure Machine Learning CLI extension v2. 
 
## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

- The [Azure Machine Learning SDK for Python v2](/python/api/overview/azure/ml/intro).

- An Azure Machine Learning workspace

```python

from azure.ai.ml import MLClient
from azure.identity import InteractiveBrowserCredential

#enter details of your AML workspace
subscription_id = '<SUBSCRIPTION_ID>'
resource_group = '<RESOURCE_GROUP>'
workspace = '<AML_WORKSPACE_NAME>'

#get a handle to the workspace
ml_client = MLClient(InteractiveBrowserCredential(), subscription_id, resource_group, workspace)
```

## Read local data in a job

You can use data from your current working directory in a training job with the JobInput class. 
The JobInput class allows you to define data inputs from a specific file, `uri_file` or a folder location, `uri_folder`. In the JobInput object, you specify the `path` of where your data is located; the path can be a local path or a cloud path. Azure Machine Learning supports `https://`, `abfss://`, `wasbs://` and `azureml://` URIs. 

> [!IMPORTANT] 
> If the path is local, but your compute is defined to be in the cloud, Azure Machine Learning will automatically upload the data to cloud storage for you.


# [Python-SDK](#tab/Python-SDK)
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

# [CLI](#tab/CLI)
The following code shows how to read in uri_file type data from local. 

```azurecli
az ml job create -f <file-name>.yml
```
```yaml
$schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
command: |
  python hello-iris.py --iris-csv ${{inputs.iris_csv}}
code: src
inputs:
  iris_csv:
    type: uri_file 
    path: ./example-data/iris.csv
environment: azureml:AzureML-sklearn-1.0-ubuntu20.04-py38-cpu@latest
compute: azureml:cpu-cluster
```

---

## Read data stored in storage service on Azure in a job

You can read your data in from existing storage on Azure.
You can leverage Azure Machine Learning datastore to register these exiting Azure storage.
Azure Machine Learning datastores securely keep the connection information to your data storage on Azure, so you don't have to code it in your scripts.
You can access your data and create datastores with,
- Credential-based data authentication, like a service principal or shared access signature (SAS) token. These credentials can be accessed by users who have Reader access to the workspace.
- Identity-based data authentication to connect to storage services with your Azure Active Directory ID or other managed identity.

# [Python-SDK](#tab/Python-SDK)

The following code shows how to read in uri_folder type data from Azure Data Lake Storage Gen 2 or Blob via SDK V2. 

```python

from azure.ai.ml.entities import Data, UriReference, JobInput, CommandJob
from azure.ai.ml._constants import AssetTypes

my_job_inputs = {
    "input_data": JobInput(
        path='abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>', # Blob: 'https://<account_name>.blob.core.windows.net/<container_name>/path'
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

# [CLI](#tab/CLI)
The following code shows how to read in uri_file type data from Azure ML datastore via CLI V2. 

```azurecli
az ml job create -f <file-name>.yml
```
```yaml
$schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
command: |
  echo "--iris-csv: ${{inputs.iris_csv}}"
  python hello-iris.py --iris-csv ${{inputs.iris_csv}}
code: src
inputs:
  iris_csv:
    type: uri_file 
    path: azureml://datastores/workspaceblobstore/paths/example-data/iris.csv
environment: azureml:AzureML-sklearn-1.0-ubuntu20.04-py38-cpu@latest
compute: azureml:cpu-cluster
```

---

## Read and write data to cloud-based storage

You can read and write data from your job into your cloud-based storage. 

The JobInput defaults the mode - how the input will be exposed during job runtime - to InputOutputModes.RO_MOUNT (read-only mount). Put another way, Azure Machine Learning will mount the file or folder to the compute and set the file/folder to read-only. By design, you can't write to JobInputs only JobOutputs. The data is automatically uploaded to cloud storage.

Matrix of possible types and modes for job inputs and outputs:

Type | Input/Output | `upload` | `download` | `ro_mount` | `rw_mount` | `direct` | `eval_download` | `eval_mount` 
------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------
`uri_folder` | Input  | ❌  | ✅  |  ✅  | ❌  | ✅  | ❌ | ❌
`uri_file`   | Input | ❌  | ✅  |  ✅  | ❌  | ✅  | ❌ | ❌
`mltable`   | Input | ❌  | ✅  |  ✅  | ❌  | ✅  | ✅ | ✅
`uri_folder` | Output  | ✅  | ❌  |  ❌  | ✅  | ✅  | ❌ | ❌
`uri_file`   | Output | ✅  | ❌  |  ❌  | ✅  | ✅  | ❌ | ❌
`mltable`   | Output | ✅  | ❌  |  ❌  | ✅  | ✅  | ❌ | ❌

As you can see from the table, `eval_download` and `eval_mount` are unique to `mltable`. A MLTable-artifact can yield files that are not necessarily located in the `mltable`'s storage. Or it can subset or shuffle the data that resides in the storage. That view is only visible if the MLTable file is actually evaluated by the engine. These modes will provide that view of the files.




# [Python-SDK](#tab/Python-SDK)

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

# [CLI](#tab/CLI)

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/CommandJob.schema.json
code: src/prep
command: >-
  python prep.py 
  --raw_data ${{inputs.raw_data}} 
  --prep_data ${{outputs.prep_data}}
inputs:
  raw_data: 
    type: uri_folder 
    path: ./data
outputs:
  prep_data: 
    mode: upload
environment: azureml:AzureML-sklearn-0.24-ubuntu18.04-py37-cpu@latest
compute: azureml:cpu-cluster

```

---

## Register data

You can register data as an asset to your workspace. The benefits of registering data are:

* Easy to share with other members of the team (no need to remember file locations)
* Versioning of the metadata (location, description, etc.)
* Lineage tracking

The following example demonstrates versioning of sample data, and shows how to register a local file as a data asset. The data is uploaded to cloud storage and registered as an asset.

```python

from azure.ai.ml.entities import Data
from azure.ai.ml._constants import AssetTypes

my_data = Data(
    path="./sample_data/titanic.csv",
    type=AssetTypes.URI_FILE,
    description="Titanic Data",
    name="titanic",
    version='1'
)

ml_client.data.create_or_update(my_data)
``` 

To register data that is in a cloud location, you can specify the path with any of the supported protocols for the storage type. The following example shows what the path looks like for data from Azure Data Lake Storage Gen 2. 

```python
from azure.ai.ml.entities import Data
from azure.ai.ml._constants import AssetTypes

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

## Consume registered data assets in jobs

Once your data is registered as an asset to the workspace, you can consume that data asset in jobs.
The following example demonstrates how to consume `version` 1 of the registered data asset `titanic`. 

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

## Use data in pipelines 

If you're working with Azure Machine Learning pipelines, you can read data into and move data between pipeline components with the Azure Machine Learning CLI v2 extension or the Python SDK v2 (preview). 

### Azure Machine Learning CLI v2
The following YAML file demonstrates how to use the output data from one component as the input for another component of the pipeline using the Azure Machine Learning CLI v2 extension:

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

:::code language="yaml" source="~/azureml-examples-sdk-preview/cli/jobs/pipelines-with-components/basics/3b_pipeline_with_data/pipeline.yml":::

## Python SDK v2 (preview)

The following example defines a pipeline containing three nodes and moves data between each node.

* `prepare_data_node` that loads the image and labels from Fashion MNIST data set into `mnist_train.csv` and `mnist_test.csv`.
* `train_node` that trains a CNN model with Keras using the training data, `mnist_train.csv` .
* `score_node` that scores the model using test data, `mnist_test.csv`.

[!notebook-python[] (~/azureml-examples-sdk-preview/sdk/jobs/pipelines/2e_image_classification_keras_minist_convnet/image_classification_keras_minist_convnet.ipynb?name=build-pipeline)]

## Next steps
* [Install and set up Python SDK v2 (preview)](https://aka.ms/sdk-v2-install)
* [Install and use the CLI (v2)](how-to-configure-cli.md)
* [Train models with the Python SDK v2 (preview)](how-to-train-sdk.md)
* [Tutorial: Create production ML pipelines with Python SDK v2 (preview)](tutorial-pipeline-python-sdk.md)
* Learn more about [Data in Azure Machine Learning](concept-data.md)
