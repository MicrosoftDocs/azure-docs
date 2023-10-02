---
title: 'Quickstart: Use Python to create a pool and run a job'
description: Follow this quickstart to run an app that uses the Azure Batch client library for Python to create and run Batch pools, nodes, jobs, and tasks.
ms.date: 04/13/2023
ms.topic: quickstart
ms.devlang: python
ms.custom: seo-python-october2019, mvc, devx-track-python, mode-api
---

# Quickstart: Use Python to create a Batch pool and run a job

This quickstart shows you how to get started with Azure Batch by running an app that uses the [Azure Batch libraries for Python](/python/api/overview/azure/batch). The Python app:

> [!div class="checklist"]
> - Uploads several input data files to an Azure Storage blob container to use for Batch task processing.
> - Creates a pool of two virtual machines (VMs), or compute nodes, running Ubuntu 20.04 LTS OS.
> - Creates a job and three tasks to run on the nodes. Each task processes one of the input files by using a Bash shell command line.
> - Displays the output files that the tasks return.

After you complete this quickstart, you understand the [key concepts of the Batch service](batch-service-workflow-features.md) and are ready to use Batch with more realistic, larger scale workloads.

## Prerequisites

- An Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A Batch account with a linked Azure Storage account. You can create the accounts by using any of the following methods: [Azure CLI](quick-create-cli.md) | [Azure portal](quick-create-portal.md) | [Bicep](quick-create-bicep.md) | [ARM template](quick-create-template.md) | [Terraform](quick-create-terraform.md).

- [Python](https://python.org/downloads) version 3.6 or later, which includes the [pip](https://pip.pypa.io/en/stable/installing) package manager.

## Run the app

To complete this quickstart, you download or clone the Python app, provide your account values, run the app, and verify the output.

### Download or clone the app

1. Download or clone the [Azure Batch Python Quickstart](https://github.com/Azure-Samples/batch-python-quickstart) app from GitHub. Use the following command to clone the app repo with a Git client:

   ```bash
   git clone https://github.com/Azure-Samples/batch-python-quickstart.git
   ```

1. Switch to the *batch-python-quickstart/src* folder, and install the required packages by using `pip`.

   ```bash
   pip install -r requirements.txt
   ```

### Provide your account information

The Python app needs to use your Batch and Storage account names, account key values, and Batch account endpoint. You can get this information from the Azure portal, Azure APIs, or command-line tools.

To get your account information from the [Azure portal](https://portal.azure.com):
  
  1. From the Azure Search bar, search for and select your Batch account name.
  1. On your Batch account page, select **Keys** from the left navigation.
  1. On the **Keys** page, copy the following values:
  
   - **Batch account**
   - **Account endpoint**
   - **Primary access key**
   - **Storage account name**
   - **Key1**

In your downloaded Python app, edit the following strings in the *config.py* file to supply the values you copied.

```python
BATCH_ACCOUNT_NAME = '<batch account>'
BATCH_ACCOUNT_KEY = '<primary access key>'
BATCH_ACCOUNT_URL = '<account endpoint>'
STORAGE_ACCOUNT_NAME = '<storage account name>'
STORAGE_ACCOUNT_KEY = '<key1>'
```

>[!IMPORTANT]
>Exposing account keys in the app source isn't recommended for Production usage. You should restrict access to credentials and refer to them in your code by using variables or a configuration file. It's best to store Batch and Storage account keys in Azure Key Vault.

### Run the app and view output

Run the app to see the Batch workflow in action.

```bash
python python_quickstart_client.py
```

Typical run time is approximately three minutes. Initial pool node setup takes the most time.

The app returns output similar to the following example:

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

There's a pause at `Monitoring all tasks for 'Completed' state, timeout in 00:30:00...` while the pool's compute nodes start. As tasks are created, Batch queues them to run on the pool. As soon as the first compute node is available, the first task runs on the node. You can monitor node, task, and job status from your Batch account page in the Azure portal.

After each task completes, you see output similar to the following example:

```output
Printing task output...
Task: Task0
Node: tvm-2850684224_3-20171205t000401z
Standard output:
Batch processing began with mainframe computers and punch cards. Today it still plays a central role...
```

## Review the code

Review the code to understand the steps in the [Azure Batch Python Quickstart](https://github.com/Azure-Samples/batch-python-quickstart).

### Create service clients and upload resource files

1. The app creates a [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) object to interact with the Storage account.

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

To create a Batch pool, the app uses the [PoolAddParameter](/python/api/azure-batch/azure.batch.models.pooladdparameter) class to set the number of nodes, VM size, and pool configuration. The following [VirtualMachineConfiguration](/python/api/azure-batch/azure.batch.models.virtualmachineconfiguration) object specifies an [ImageReference](/python/api/azure-batch/azure.batch.models.imagereference) to an Ubuntu Server 20.04 LTS Azure Marketplace image. Batch supports a wide range of Linux and Windows Server Marketplace images, and also supports custom VM images.

The `POOL_NODE_COUNT` and `POOL_VM_SIZE` are defined constants. The app creates a pool of two size Standard_DS1_v2 nodes. This size offers a good balance of performance versus cost for this quickstart.

The [pool.add](/python/api/azure-batch/azure.batch.operations.pooloperations#azure-batch-operations-pooloperations-add) method submits the pool to the Batch service.

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

A Batch job is a logical grouping of one or more tasks. The job includes settings common to the tasks, such as priority and the pool to run tasks on.

The app uses the [JobAddParameter](/python/api/azure-batch/azure.batch.models.jobaddparameter) class to create a job on the pool. The [job.add](/python/api/azure-batch/azure.batch.operations.joboperations) method adds the job to the specified Batch account. Initially the job has no tasks.

```python
job = batchmodels.JobAddParameter(
    id=job_id,
    pool_info=batchmodels.PoolInformation(pool_id=pool_id))

batch_service_client.job.add(job)
```

### Create tasks

Batch provides several ways to deploy apps and scripts to compute nodes. This app creates a list of task objects by using the [TaskAddParameter](/python/api/azure-batch/azure.batch.models.taskaddparameter) class. Each task processes an input file by using a `command_line` parameter to specify an app or script. 

The following script processes the input `resource_files` objects by running the Bash shell `cat` command to display the text files. The app then uses the [task.add_collection](/python/api/azure-batch/azure.batch.operations.taskoperations#azure-batch-operations-taskoperations-add-collection) method to add each task to the job, which queues the tasks to run on the compute nodes.

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

The app monitors task state to make sure the tasks complete. When each task runs successfully, the task command output writes to the *stdout.txt* file. The app then displays the *stdout.txt* file for each completed task.

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

The app automatically deletes the storage container it creates, and gives you the option to delete the Batch pool and job. Pools and nodes incur charges while the nodes are running, even if they aren't running jobs. If you no longer need the pool, delete it.

When you no longer need your Batch resources, you can delete the resource group that contains them. In the Azure portal, select **Delete resource group** at the top of the resource group page. On the **Delete a resource group** screen, enter the resource group name, and then select **Delete**.

## Next steps

In this quickstart, you ran an app that uses the Batch Python API to create a Batch pool, nodes, job, and tasks. The job uploaded resource files to a storage container, ran tasks on the nodes, and displayed output from the nodes.

Now that you understand the key concepts of the Batch service, you're ready to use Batch with more realistic, larger scale workloads. To learn more about Azure Batch and walk through a parallel workload with a real-world application, continue to the Batch Python tutorial.

> [!div class="nextstepaction"]
> [Process a parallel workload with Python](tutorial-parallel-python.md)
