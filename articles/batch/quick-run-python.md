---
title: Quickstart - Use Python API to run an Azure Batch job
description: In this quickstart, you run an Azure Batch sample job and tasks using the Batch Python client library. Learn the key concepts of the Batch service.
ms.date: 09/10/2021
ms.topic: quickstart
ms.devlang: python
ms.custom: seo-python-october2019, mvc, devx-track-python, mode-api
---

# Quickstart: Use Python API to run an Azure Batch job

This quickstart shows you how to get started with Azure Batch by using the [Azure Batch libraries for Python](/python/api/overview/azure/batch). The quickstart uses a Python app to do the following actions:

> [!div class="checklist"]
> - Upload three text files to a blob container in Azure Storage as inputs for Batch task processing.
> - Create a *pool* of two compute *nodes* running Ubuntu 20.04 LTS OS.
> - Create a *job* and three *tasks* to run on the nodes. Each task processes one of the input files by using a Bash shell command line.
> - Display the output files that the tasks return.

After you complete this quickstart, you understand the [key concepts of the Batch service](batch-service-workflow-features.md) and are ready to use Batch with more realistic, larger scale workloads.

## Prerequisites

- An Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A Batch account with a linked Azure Storage account. You can create the accounts by using any of the following methods:<br>[Azure CLI](quick-create-cli.md) | [Azure portal](quick-create-portal.md) | [Bicep](quick-create-bicep.md) | [ARM template](quick-create-template.md) | [Terraform](quick-create-terraform.md)

- [Python](https://python.org/downloads) version 3.6 or later, which includes the [pip](https://pip.pypa.io/en/stable/installing) package manager.

## Run the app

To run the Python app, you need to provide your Batch and Storage account names, account keys, and Batch account endpoint. You can get this information from the Azure portal, Azure APIs, or command-line tools. To get these values from the Azure portal:
  
  1. From the Azure search bar, search for and select your Batch account name.
  1. On your Batch account page, select **Keys** from the left navigation.
  1. On the **Keys** page, copy the following values:
  
   - **Batch account**
   - **Account endpoint**
   - **Primary access key**
   - **Storage account name**
   - **Key1**

To run the app:

1. Download or clone the [Azure Batch Python Quickstart](https://github.com/Azure-Samples/batch-python-quickstart) app from GitHub. Use the following command to clone the app repo with a Git client:

   ```bash
   git clone https://github.com/Azure-Samples/batch-python-quickstart.git
   ```

1. Switch to the directory that contains the Python script file *python_quickstart_client.py*, and install the required packages by using `pip`.

   ```bash
   pip install -r requirements.txt
   ```

1. Open the file *config.py*, and update the following strings, replacing the placeholders with the values you copied from your accounts.:

   ```python
   BATCH_ACCOUNT_NAME = '<batch account name>'
   BATCH_ACCOUNT_KEY = '<primary access key>'
   BATCH_ACCOUNT_URL = '<account endpoint>'
   STORAGE_ACCOUNT_NAME = '<storage account name>'
   STORAGE_ACCOUNT_KEY = '<key1>'
   ```

1. Run the script to see the Batch workflow in action.

   ```bash
   python python_quickstart_client.py
   ```

Typical execution time is approximately three minutes. Initial pool node setup takes the most time.

### App output

During app execution, there's a pause at `Monitoring all tasks for 'Completed' state, timeout in 00:30:00...` while the pool's compute nodes are started. Tasks are queued to run as soon as the first compute node is running. You can monitor node, task, and job status from your Batch account page in the Azure portal.

The sample application returns output similar to the following example:

```output
Sample start: 11/26/2012 4:02:54 PM

Uploading file taskdata0.txt to container [input]...
Uploading file taskdata1.txt to container [input]...
Uploading file taskdata2.txt to container [input]...
Creating pool [PythonQuickstartPool]...
Creating job [PythonQuickstartJob]...
Adding 3 tasks to job [PythonQuickstartJob]...
Monitoring all tasks for 'Completed' state, timeout in 00:30:00...
```

After each task completes, you see output similar to the following example:

```output
Printing task output...
Task: Task0
Node: tvm-2850684224_3-20171205t000401z
Standard output:
Batch processing began with mainframe computers and punch cards. Today it still plays a central role in business, engineering, science, and other pursuits that require running lots of automated tasks....
...
```

## Review the code

The Python app in this quickstart takes the following steps:

### Upload resource files

1. To interact with the Storage account, the app creates a [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) object.

   ```python
   blob_service_client = BlobServiceClient(
           account_url=f"https://{config.STORAGE_ACCOUNT_NAME}.{config.STORAGE_ACCOUNT_DOMAIN}/",
           credential=config.STORAGE_ACCOUNT_KEY
       )
   ```

1. The app uses the `blob_service_client` reference to create a container in the Storage account and upload data files to the container. The files in storage are defined as Batch [ResourceFile](/python/api/azure-batch/azure.batch.models.resourcefile) objects that Batch can later download to compute nodes.

   ```python
   input_file_paths = [os.path.join(sys.path[0], 'taskdata0.txt'),
                       os.path.join(sys.path[0], 'taskdata1.txt'),
                       os.path.join(sys.path[0], 'taskdata2.txt')]
   
   input_files = [
       upload_file_to_container(blob_service_client, input_container_name, file_path)
       for file_path in input_file_paths]
   ```

1. The app creates a [BatchServiceClient](/python/api/azure.batch.batchserviceclient) object to create and manage pools, jobs, and tasks in the Batch account. The Batch client uses shared key authentication. Batch also supports Azure Active Directory (Azure AD) authentication.

   ```python
   credentials = SharedKeyCredentials(config.BATCH_ACCOUNT_NAME,
           config.BATCH_ACCOUNT_KEY)
   
       batch_client = BatchServiceClient(
           credentials,
           batch_url=config.BATCH_ACCOUNT_URL)
   ```

### Create a pool of compute nodes

To create a Batch pool, the app uses the [PoolAddParameter](/python/api/azure-batch/azure.batch.models.pooladdparameter) class to set the number of nodes, virtual machine (VM) size, and pool configuration. The following [VirtualMachineConfiguration](/python/api/azure-batch/azure.batch.models.virtualmachineconfiguration) object specifies an [ImageReference](/python/api/azure-batch/azure.batch.models.imagereference) to an Ubuntu Server 20.04 LTS Azure Marketplace image. Batch supports a wide range of Linux and Windows Server Marketplace images as well as custom VM images.

The number of nodes (`POOL_NODE_COUNT`) and VM size (`POOL_VM_SIZE`) are defined constants. The app by default creates a pool of two size *Standard_DS1_v2* nodes. This size offers a good balance of performance versus cost for this quickstart.

The [pool.add](/python/api/azure-batch/azure.batch.operations.pooloperations) method submits the pool to the Batch service.

```python
new_pool = batchmodels.PoolAddParameter(
        id=pool_id,
        virtual_machine_configuration=batchmodels.VirtualMachineConfiguration(
            image_reference=batchmodels.ImageReference(
                publisher="canonical",
                offer="0001-com-ubuntu-server-focal",
                sku="20_04-lts",
                version="latest"
            ),
            node_agent_sku_id="batch.node.ubuntu 20.04"),
        vm_size=config.POOL_VM_SIZE,
        target_dedicated_nodes=config.POOL_NODE_COUNT
    )
    batch_service_client.pool.add(new_pool)
```

### Create a Batch job

A Batch job is a logical grouping of one or more tasks. A job includes settings common to the tasks, such as priority and the pool to run tasks on.

The app uses the [JobAddParameter](/python/api/azure-batch/azure.batch.models.jobaddparameter) class to create a job on the pool. The [job.add](/python/api/azure-batch/azure.batch.operations.joboperations) method adds a job to the specified Batch account. Initially the job has no tasks.

```python
job = batchmodels.JobAddParameter(
    id=job_id,
    pool_info=batchmodels.PoolInformation(pool_id=pool_id))

batch_service_client.job.add(job)
```

### Create tasks

The app creates a list of task objects by using the [TaskAddParameter](/python/api/azure-batch/azure.batch.models.taskaddparameter) class. Each task uses a `command_line` parameter to process an input `resource_files` object. The command line is where you specify your app or script. Batch provides a number of ways to deploy apps and scripts to compute nodes.

In the current example, the command line runs the Bash shell `cat` command to display the text file. Then, the app adds tasks to the job with the [task.add_collection](/python/api/azure-batch/azure.batch.operations.taskoperations) method, which queues the tasks to run on the compute nodes.

```python
tasks = []

for idx, input_file in enumerate(resource_input_files):
    command = f"/bin/bash -c \"cat {input_file.file_path}\""
    tasks.append(batchmodels.TaskAddParameter(
        id=f'Task{idx}',
        command_line=command,
        resource_files=[input_file]
    )
    )

batch_service_client.task.add_collection(job_id, tasks)
```

### View task output

The app monitors task state to make sure the tasks complete. When the task runs successfully, the output of the task command writes to the *stdout.txt* file. The app then displays the *stdout.txt* file each completed task generates.

```python
tasks = batch_service_client.task.list(job_id)

for task in tasks:

    node_id = batch_service_client.task.get(job_id, task.id).node_info.node_id
    print(f"Task: {task.id}")
    print(f"Node: {node_id}")

    stream = batch_service_client.file.get_from_task(
        job_id, task.id, config.STANDARD_OUT_FILE_NAME)

    file_text = _read_stream_as_string(
        stream,
        text_encoding)

    if text_encoding is None:
        text_encoding = DEFAULT_ENCODING

    sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding = text_encoding)
    sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding = text_encoding)

    print("Standard output:")
    print(file_text)
```

## Clean up resources

The app automatically deletes the storage container it creates, and gives you the option to delete the Batch pool and job. You are charged for the pool while the nodes are running, even if no jobs are scheduled. When you no longer need the pool, delete it. When you delete the pool, all task output on the nodes is deleted. 

When no longer needed, delete the resource group, Batch account, and storage account. To do so in the Azure portal, select the resource group for the Batch account and select **Delete resource group**.

## Next steps

In this quickstart, you ran an app that uses the Batch Python API to create a Batch pool, nodes, job, and tasks. The job uploaded resource files to an storage container, ran tasks on the nodes, and downloaded output created on the nodes. Now that you understand the key concepts of the Batch service, you're ready to use Batch with more realistic, larger-scale workloads. To learn more about Azure Batch and walk through a parallel workload with a real-world application, continue to the Batch Python tutorial.

> [!div class="nextstepaction"]
> [Process a parallel workload with Python](tutorial-parallel-python.md)
