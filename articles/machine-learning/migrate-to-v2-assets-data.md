---
title: 'Upgrade data management to SDK v2'
titleSuffix: Azure Machine Learning
description: Upgrade data management from v1 to v2 of Azure Machine Learning SDK
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: reference
author: SturgeonMi
ms.author: xunwan
ms.date: 02/13/2023
ms.reviewer: franksolomon
ms.custom: migration
monikerRange: 'azureml-api-1 || azureml-api-2'
---

# Upgrade data management to SDK v2

In V1, an Azure Machine Learning dataset can either be a `Filedataset` or a `Tabulardataset`.
In V2, an Azure Machine Learning data asset can be a `uri_folder`, `uri_file` or `mltable`.
You can conceptually map `Filedataset` to `uri_folder` and `uri_file`, `Tabulardataset` to `mltable`.

* URIs (`uri_folder`, `uri_file`) - a Uniform Resource Identifier that is a reference to a storage location on your local computer or in the cloud, that makes it easy to access data in your jobs.
* MLTable - a method to abstract the tabular data schema definition, to make it easier for consumers of that data to materialize the table into a Pandas/Dask/Spark dataframe.

This article compares data scenario(s) in SDK v1 and SDK v2.

## Create a `filedataset`/ uri type of data asset

* SDK v1 - Create a `Filedataset`

    ```python
    from azureml.core import Workspace, Datastore, Dataset
    
    # create a FileDataset pointing to files in 'animals' folder and its subfolders recursively
    datastore_paths = [(datastore, 'animals')]
    animal_ds = Dataset.File.from_files(path=datastore_paths)
    
    # create a FileDataset from image and label files behind public web urls
    web_paths = ['https://azureopendatastorage.blob.core.windows.net/mnist/train-images-idx3-ubyte.gz',
                 'https://azureopendatastorage.blob.core.windows.net/mnist/train-labels-idx1-ubyte.gz']
    mnist_ds = Dataset.File.from_files(path=web_paths)
    ```
    
* SDK v2
    * Create a `URI_FOLDER` type data asset

        ```python
        from azure.ai.ml.entities import Data
        from azure.ai.ml.constants import AssetTypes
        
        # Supported paths include:
        # local: './<path>'
        # blob:  'https://<account_name>.blob.core.windows.net/<container_name>/<path>'
        # ADLS gen2: 'abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>/'
        # Datastore: 'azureml://datastores/<data_store_name>/paths/<path>'
        
        my_path = '<path>'
        
        my_data = Data(
            path=my_path,
            type=AssetTypes.URI_FOLDER,
            description="<description>",
            name="<name>",
            version='<version>'
        )
        
        ml_client.data.create_or_update(my_data)
        ```

    * Create a `URI_FILE` type data asset.
        ```python
        from azure.ai.ml.entities import Data
        from azure.ai.ml.constants import AssetTypes
        
        # Supported paths include:
        # local: './<path>/<file>'
        # blob:  'https://<account_name>.blob.core.windows.net/<container_name>/<path>/<file>'
        # ADLS gen2: 'abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>/<file>'
        # Datastore: 'azureml://datastores/<data_store_name>/paths/<path>/<file>'
        my_path = '<path>'
        
        my_data = Data(
            path=my_path,
            type=AssetTypes.URI_FILE,
            description="<description>",
            name="<name>",
            version="<version>"
        )
        
        ml_client.data.create_or_update(my_data)
        ```

## Create a tabular dataset/data asset

* SDK v1

    ```python
    from azureml.core import Workspace, Datastore, Dataset
    
    datastore_name = 'your datastore name'
    
    # get existing workspace
    workspace = Workspace.from_config()
        
    # retrieve an existing datastore in the workspace by name
    datastore = Datastore.get(workspace, datastore_name)
    
    # create a TabularDataset from 3 file paths in datastore
    datastore_paths = [(datastore, 'weather/2018/11.csv'),
                       (datastore, 'weather/2018/12.csv'),
                       (datastore, 'weather/2019/*.csv')]
    
    weather_ds = Dataset.Tabular.from_delimited_files(path=datastore_paths)
    ```

* SDK v2 - Create `mltable` data asset via yaml definition

    ```yaml
    type: mltable
    
    paths:
      - pattern: ./*.txt
    transformations:
      - read_delimited:
          delimiter: ,
          encoding: ascii
          header: all_files_same_headers
    ```
    
    ```python
    from azure.ai.ml.entities import Data
    from azure.ai.ml.constants import AssetTypes
    
    # my_path must point to folder containing MLTable artifact (MLTable file + data
    # Supported paths include:
    # local: './<path>'
    # blob:  'https://<account_name>.blob.core.windows.net/<container_name>/<path>'
    # ADLS gen2: 'abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>/'
    # Datastore: 'azureml://datastores/<data_store_name>/paths/<path>'
    
    my_path = '<path>'
    
    my_data = Data(
        path=my_path,
        type=AssetTypes.MLTABLE,
        description="<description>",
        name="<name>",
        version='<version>'
    )
    
    ml_client.data.create_or_update(my_data)
    ```

## Use data in an experiment/job

* SDK v1

    ```python
    from azureml.core import ScriptRunConfig
    
    src = ScriptRunConfig(source_directory=script_folder,
                          script='train_titanic.py',
                          # pass dataset as an input with friendly name 'titanic'
                          arguments=['--input-data', titanic_ds.as_named_input('titanic')],
                          compute_target=compute_target,
                          environment=myenv)
                                 
    # Submit the run configuration for your training run
    run = experiment.submit(src)
    run.wait_for_completion(show_output=True)
    ```

* SDK v2

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
    # Datastore: azureml://datastores/paths/<folder>/<file>
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

## Mapping of key functionality in SDK v1 and SDK v2

|Functionality in SDK v1|Rough mapping in SDK v2|
|-|-|
|[Method/API in SDK v1](/python/api/azureml-core/azureml.data)|[Method/API in SDK v2](/python/api/azure-ai-ml/azure.ai.ml.entities)|

## Next steps

For more information, see the documentation here:
* [Data in Azure Machine Learning](concept-data.md?tabs=uri-file-example%2Ccli-data-create-example)
* [Create data_assets](how-to-create-data-assets.md?tabs=CLI)
* [Read and write data in a job](how-to-read-write-data-v2.md)
* [V2 datastore operations](/python/api/azure-ai-ml/azure.ai.ml.operations.datastoreoperations)
