---
title: Run a parallel workload - Azure Batch Python 
description: Tutorial - Step by step instructions to run a basic parallel workload in Azure Batch using the Batch Python client SDK
services: batch
author: dlepow
manager: jeconnoc

ms.service: batch
ms.devlang: python
ms.topic: tutorial
ms.date: 12/22/17
ms.author: dlepow
ms.custom: mvc
---

# Run a basic parallel workload in Azure Batch using the Python client

# Process media files in parallel with Azure Batch using the .NET API

Azure Batch enables you to run large-scale parallel and high-performance computing (HPC) batch jobs efficiently in Azure. This tutorial covers building a Python sample application step by step to process a parallel workload using Batch. In this tutorial, you convert media files in parallel using the [ffmpeg](http://ffmpeg.org/) open-source tool. You learn a common Batch application workflow and how to interact programmatically with Batch and Storage resources. You learn how to:

> [!div class="checklist"]
> * Authenticate with Batch and Storage accounts
> * Upload input data files to Storage
> * Create a Batch pool to run ffmpeg
> * Create a job and tasks to process input files
> * Monitor task execution
> * Retrieve output files

## Prerequisites

* [Python version 2.7 or 3.3 or later](https://www.python.org/downloads/)
* An Azure Batch account and a linked Azure Storage account. To create these accounts, see the Batch quickstarts using the [Azure portal](quick-create-portal.md) or [Azure CLI](quick-create-cli.md). 

## Download the sample

[Download or clone the sample application](https://github.com/dlepow/batchmvc) from GitHub. 

Change to the directory that contains the sample code:

```bash
cd python
```

[!INCLUDE [batch-common-credentials](../../includes/batch-common-credentials.md)]

Open the file `batch_python_tututorial_ffmpeg.py` in a text editor. Update the Batch and storage account credential strings with the values unique to your accounts.


```Python
_BATCH_ACCOUNT_NAME = 'mybatchaccount'
_BATCH_ACCOUNT_KEY = 'xxxxxxxxxxxxxxxxE+yXrRvJAqT9BlXwwo1CwF+SwAYOxxxxxxxxxxxxxxxx43pXi/gdiATkvbpLRl3x14pcEQ=='
_BATCH_ACCOUNT_URL = 'https://mybatchaccount.westeurope.batch.azure.com'
_STORAGE_ACCOUNT_NAME = 'mystorageaccount'
_STORAGE_ACCOUNT_KEY = 'xxxxxxxxxxxxxxxxy4/xxxxxxxxxxxxxxxxfwpbIC5aAWA8wDu+AFXZB827Mt9lybZB1nUcQbQiUrkPtilK5BQ=='
```

The following sections break down the sample application into the steps that it performs to process a workload in the Batch service. Refer to the Python code while you work your way through the rest of this article, since not every line of code in the sample is discussed.

## Blob and Batch clients

* To interact with the linked storage account, the app uses the [azure-storage](https://pypi.python.org/pypi/azure-storage) package to create a [BlockBlobService](/python/api/azure.storage.blob.blockblobservice.blockblobservice) object.

  ```python
  blob_client = azureblob.BlockBlobService(
      account_name=STORAGE_ACCOUNT_NAME,
      account_key=STORAGE_ACCOUNT_KEY)
  ```

* The app creates a [BatchServiceClient](/python/api/azure.batch.batchserviceclient) object to create and manage pools, jobs, and tasks in the Batch service. The Batch client in the sample uses shared key authentication. Batch also supports authentication through [Azure Active Directory](batch-aad-auth.md), to authenticate individual users or an unattended application.

  ```python
  credentials = batchauth.SharedKeyCredentials(_BATCH_ACCOUNT_NAME,
     _BATCH_ACCOUNT_KEY)

  batch_client = batch.BatchServiceClient(
        credentials,
        base_url=_BATCH_ACCOUNT_URL)
  ```

## Upload input files


The app uses the `blob_client` reference to create a container in the storage account and calls the `upload-file_to_container` function to upload input MP4 files to the container. The files in storage are defined as Batch [ResourceFile](/python/api/azure.batch.models.resourcefile) objects that Batch can later download to compute nodes.

  ```python
  input_file_paths = []
    
    for folder, subs, files in os.walk('./InputFiles/'):
        for filename in files:
            if filename.endswith(".mp4"):
                input_file_paths.append(os.path.abspath(os.path.join(folder, filename)))

    # Upload the input files. This is the collection of files that are to be processed by the tasks. 
    input_files = [
        upload_file_to_container(blob_client, input_container_name, file_path)
        for file_path in input_file_paths]
  ```


## Create a Batch pool

Next, the sample creates a pool of compute nodes in the Batch account with a call to `create_pool`. The `create_pool` function uses the [PoolAddParameter](/python/api/azure.batch.models.pooladdparameter) method to set the number of nodes, VM size, and a pool configuration. Here, a [VirtualMachineConfiguration](/python/api/azure.batch.models.virtualmachineconfiguration) object specifies an [ImageReference](/python/api/azure.batch.models.imagereference) to an Ubuntu Server 16.04 LTS image published in the Azure Marketplace. Batch supports a wide range of Linux and Windows Server images in the Azure Marketplace, as well as custom VM images.

The number of nodes (`_POOL_NODE_COUNT`) and VM size (`_POOL_VM_SIZE`) are defined constants. The sample by default creates a pool of 5 size *Standard_A1_v2* nodes. 

In addition to physical node properties, this pool configuration includes a [StartTask](/python/api/azure.batch.models.starttask) object. The StartTask executes on each node as that node joins the pool, and each time a node is restarted. In this example, the StartTask runs Bash shell commands to install the ffmpeg package and dependencies on the nodes.

The [pool.add](/python/api/azure.batch.operations.pooloperations#azure_batch_operations_PoolOperations_add) method submits the pool to the Batch service.

```python
new_pool = batch.models.PoolAddParameter(
        id=pool_id,
        virtual_machine_configuration=batchmodels.VirtualMachineConfiguration(
            image_reference=batchmodels.ImageReference(
        	        publisher="Canonical",
        	        offer="UbuntuServer",
        	        sku="16.04.0-LTS",
        	        version="latest"
                ),
            node_agent_sku_id="batch.node.ubuntu 16.04"),
        vm_size=_POOL_VM_SIZE,
        target_dedicated_nodes=_POOL_NODE_COUNT,
        start_task=batchmodels.StartTask(
            command_line="/bin/bash -c \"add-apt-repository -y ppa:djcj/hybrid && apt-get update && apt-get install -y ffmpeg\"",
            wait_for_success=True,
            user_identity=batchmodels.UserIdentity(
                auto_user=batchmodels.AutoUserSpecification(
                scope=batchmodels.AutoUserScope.pool,
                elevation_level=batchmodels.ElevationLevel.admin)),
         )
  )
    try:
        batch_service_client.pool.add(new_pool)
    except batchmodels.batch_error.BatchErrorException as err:
        print_batch_exception(err)
        raise

```

## Create a Batch job

A Batch job specifies a pool to run tasks on and optional settings such as a priority and schedule for the work. The sample creates a job with a call to `create_job`. The app uses the [JobAddParameter](/python/api/azure.batch.models.jobaddparameter) method to create a job on your pool. The [job.add](/python/api/azure.batch.operations.joboperations#azure_batch_operations_JobOperations_add) method submits the pool to the Batch service. Initially the job has no tasks.

```python
job = batch.models.JobAddParameter(
    job_id,
    batch.models.PoolInformation(pool_id=pool_id))

try:
    batch_service_client.job.add(job)
except batchmodels.batch_error.BatchErrorException as err:
    print_batch_exception(err)
    raise
```

### Create tasks

The app creates tasks in the job with a call to `add_tasks`. The app creates a list of task objects using the [TaskAddParameter](/python/api/azure.batch.models.taskaddparameter) method. Each task uses ffmpeg to convert an input `resource_files` object (MP4 file) using a `command_line` parameter. ffmpeg was previously installed on each node when the pool was created.

Then, the app adds tasks to the job with the [task.add_collection](/python/api/azure.batch.operations.taskoperations#azure_batch_operations_TaskOperations_add_collection) method, which queues them to run on the compute nodes. 



## Next steps

In this tutorial, you learned about how to:

> [!div class="checklist"]
> * Authenticate with Batch and Storage accounts
> * Upload input data files to Storage
> * Create a Batch pool to run ffmpeg
> * Create a job and tasks to process input files
> * Monitor task execution
> * Retrieve output files

Advance to the next tutorial to learn about ....  

> [!div class="nextstepaction"]

