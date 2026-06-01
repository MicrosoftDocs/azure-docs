---
title: "Tutorial: Run a parallel workload using the Python API"
description: Learn how to process media files in parallel using ffmpeg in Azure Batch with the Batch Python client library.
ms.devlang: python
ms.topic: tutorial
ms.date: 05/13/2026
ms.custom: mvc, devx-track-python
# Customer intent: "As a developer, I want to run a parallel workload using the Python API with Azure Batch, so that I can efficiently process multiple media files in high-performance computing tasks."
---

# Tutorial: Run a parallel workload with Azure Batch using the Python API

Use Azure Batch to run large-scale parallel and high-performance computing (HPC) batch jobs efficiently in Azure. This tutorial walks through a Python example of running a parallel workload using Batch. You learn a common Batch application workflow and how to interact programmatically with Batch and Storage resources.

> [!div class="checklist"]
> * Authenticate with Batch and Storage accounts.
> * Upload input files to Storage.
> * Create a pool of compute nodes to run an application.
> * Create a job and tasks to process input files.
> * Monitor task execution.
> * Retrieve output files.

In this tutorial, you convert MP4 media files to MP3 format, in parallel, by using the [ffmpeg](https://ffmpeg.org/) open-source tool.

[!INCLUDE [quickstarts-free-trial-note.md](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## Prerequisites

* [Python version 3.8 or later](https://www.python.org/downloads/)

* [pip package manager](https://pip.pypa.io/en/stable/installation/)

* An Azure Batch account and a linked Azure Storage account. To create these accounts, see the Batch quickstart guides for [Azure portal](quick-create-portal.md) or [Azure CLI](quick-create-cli.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

[!INCLUDE [batch-common-credentials](../../includes/batch-common-credentials.md)]

## Download and run the sample app

### Download the sample app

[Download or clone the sample app](https://github.com/Azure-Samples/batch-python-ffmpeg-tutorial) from GitHub. To clone the sample app repo with a Git client, use the following command:

```bash
git clone https://github.com/Azure-Samples/batch-python-ffmpeg-tutorial.git
```

Navigate to the directory that contains the file *batch_python_tutorial_ffmpeg.py*.

In your Python environment, install the required packages using `pip`.

```bash
pip install -r requirements.txt
```

Use a code editor to open the file *config.py*. Update the Batch and storage account values with the names unique to your accounts. The sample uses [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential) to authenticate, so account keys are no longer required. For example:


```python Snippet:tutorial_parallel_config
_BATCH_ACCOUNT_NAME = 'yourbatchaccount'
_BATCH_ACCOUNT_URL = 'https://yourbatchaccount.yourbatchregion.batch.azure.com'
_STORAGE_ACCOUNT_NAME = 'mystorageaccount'
```

Before running the sample, sign in with the Azure CLI (`az login`) or otherwise configure a credential that `DefaultAzureCredential` can discover (for example, a managed identity, Visual Studio Code, or environment variables). Make sure the signed-in identity is granted the appropriate Azure RBAC roles on both the Batch account (for example, **Azure Batch Contributor** or **Reader**) and the Storage account (for example, **Storage Blob Data Contributor**).

### Run the app

To run the script:

```bash
python batch_python_tutorial_ffmpeg.py
```

When you run the sample application, the console output is similar to the following. During execution, you experience a pause at `Monitoring all tasks for 'Completed' state, timeout in 00:30:00...` while the pool's compute nodes are started.

```
Sample start: 11/28/2018 3:20:21 PM

Container [input] created.
Container [output] created.
Uploading file LowPriVMs-1.mp4 to container [input]...
Uploading file LowPriVMs-2.mp4 to container [input]...
Uploading file LowPriVMs-3.mp4 to container [input]...
Uploading file LowPriVMs-4.mp4 to container [input]...
Uploading file LowPriVMs-5.mp4 to container [input]...
Creating pool [LinuxFFmpegPool]...
Creating job [LinuxFFmpegJob]...
Adding 5 tasks to job [LinuxFFmpegJob]...
Monitoring all tasks for 'Completed' state, timeout in 00:30:00...
Success! All tasks completed successfully within the specified timeout period.
Deleting container [input]....

Sample end: 11/28/2018 3:29:36 PM
Elapsed time: 00:09:14.3418742
```

Go to your Batch account in the Azure portal to monitor the pool, compute nodes, job, and tasks. For example, to see a heat map of the compute nodes in your pool, select **Pools** > **LinuxFFmpegPool**.

When tasks are running, the heat map is similar to the following:

:::image type="content" source="./media/tutorial-parallel-python/pool.png" alt-text="Screenshot of Pool heat map.":::

Typical execution time is approximately *5 minutes* when you run the application in its default configuration. Pool creation takes the most time.

[!INCLUDE [batch-common-tutorial-download](../../includes/batch-common-tutorial-download.md)]

## Review the code

The following sections break down the sample application into the steps that it performs to process a workload in the Batch service. Refer to the Python code while you read the rest of this article, since not every line of code in the sample is discussed.

### Authenticate Blob and Batch clients

The sample authenticates with both Storage and Batch by using [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential) from the [azure-identity](https://pypi.org/project/azure-identity/) package. `DefaultAzureCredential` tries multiple credential types in order (environment variables, managed identity, Azure CLI sign-in, and so on), which makes the same code work in local development and in production without storing account keys.

To interact with a storage account, the app uses the [azure-storage-blob](https://pypi.python.org/pypi/azure-storage-blob) package to create a [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) object that uses the credential.

```python Snippet:tutorial_parallel_blob_client
credential = DefaultAzureCredential()

blob_service_client = BlobServiceClient(
    account_url=f"https://{_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/",
    credential=credential)
```

The app creates a [BatchClient](/python/api/azure-batch/azure.batch.batchclient) object to create and manage pools, jobs, and tasks in the Batch service. The Batch client uses the same `DefaultAzureCredential` to authenticate through [Microsoft Entra ID](batch-aad-auth.md).

```python Snippet:tutorial_parallel_batch_client
batch_client = BatchClient(
    endpoint=_BATCH_ACCOUNT_URL,
    credential=credential)
```

### Upload input files

The app uses the `blob_client` reference create a storage container for the input MP4 files and a container for the task output. Then, it calls the `upload_file_to_container` function to upload MP4 files in the local *InputFiles* directory to the container. The files in storage are defined as Batch [ResourceFile](/python/api/azure-batch/azure.batch.models.resourcefile) objects that Batch can later download to compute nodes.

```python Snippet:tutorial_parallel_upload_inputs
blob_service_client.create_container(input_container_name)
blob_service_client.create_container(output_container_name)
input_file_paths = []

for folder, subs, files in os.walk(os.path.join(sys.path[0], './InputFiles/')):
    for filename in files:
        if filename.endswith(".mp4"):
            input_file_paths.append(os.path.abspath(
                os.path.join(folder, filename)))

# Upload the input files. This is the collection of files that are to be processed by the tasks.
input_files = [
    upload_file_to_container(blob_service_client, input_container_name, file_path)
    for file_path in input_file_paths]
```

### Create a pool of compute nodes

Next, the sample creates a pool of compute nodes in the Batch account with a call to `create_pool`. This defined function uses the Batch [BatchPoolCreateOptions](/python/api/azure-batch/azure.batch.models.batchpoolcreateoptions) class to set the number of nodes, VM size, and a pool configuration. Here, a [VirtualMachineConfiguration](/python/api/azure-batch/azure.batch.models.virtualmachineconfiguration) object specifies a [BatchVmImageReference](/python/api/azure-batch/azure.batch.models.batchvmimagereference) to an Ubuntu Server 20.04 LTS image published in the Azure Marketplace. Batch supports a wide range of VM images in the Azure Marketplace, as well as custom VM images.

The number of nodes and VM size are set using defined constants. Batch supports dedicated nodes and [Spot nodes](batch-spot-vms.md), and you can use either or both in your pools. Dedicated nodes are reserved for your pool. Spot nodes are offered at a reduced price from surplus VM capacity in Azure. Spot nodes become unavailable if Azure doesn't have enough capacity. The sample by default creates a pool containing only five Spot nodes in size *Standard_A1_v2*.

In addition to physical node properties, this pool configuration includes a [BatchStartTask](/python/api/azure-batch/azure.batch.models.batchstarttask) object. The BatchStartTask executes on each node as that node joins the pool, and each time a node is restarted. In this example, the BatchStartTask runs Bash shell commands to install the ffmpeg package and dependencies on the nodes.

The [create_pool](/python/api/azure-batch/azure.batch.batchclient#azure-batch-batchclient-create-pool) method submits the pool to the Batch service.

```python Snippet:tutorial_parallel_create_pool
new_pool = models.BatchPoolCreateOptions(
    id=pool_id,
    virtual_machine_configuration=models.VirtualMachineConfiguration(
        image_reference=models.BatchVmImageReference(
            publisher="Canonical",
            offer="UbuntuServer",
            sku="20.04-LTS",
            version="latest"
        ),
        node_agent_sku_id="batch.node.ubuntu 20.04"),
    vm_size=_POOL_VM_SIZE,
    target_dedicated_nodes=_DEDICATED_POOL_NODE_COUNT,
    target_low_priority_nodes=_LOW_PRIORITY_POOL_NODE_COUNT,
    start_task=models.BatchStartTask(
        command_line="/bin/bash -c \"apt-get update && apt-get install -y ffmpeg\"",
        wait_for_success=True,
        user_identity=models.UserIdentity(
            auto_user=models.AutoUserSpecification(
                scope=models.AutoUserScope.POOL,
                elevation_level=models.ElevationLevel.ADMIN)),
    )
)
batch_client.create_pool(pool=new_pool)
```

### Create a job

A Batch job specifies a pool to run tasks on and optional settings such as a priority and schedule for the work. The sample creates a job with a call to `create_job`. This defined function uses the [BatchJobCreateOptions](/python/api/azure-batch/azure.batch.models.batchjobcreateoptions) class to create a job on your pool. The [create_job](/python/api/azure-batch/azure.batch.batchclient#azure-batch-batchclient-create-job) method submits the pool to the Batch service. Initially the job has no tasks.

```python Snippet:tutorial_parallel_create_job
job = models.BatchJobCreateOptions(
    id=job_id,
    pool_info=models.BatchPoolInfo(pool_id=pool_id))

batch_client.create_job(job=job)
```

### Create tasks

The app creates tasks in the job with a call to `add_tasks`. This defined function creates a list of task objects using the [BatchTaskCreateOptions](/python/api/azure-batch/azure.batch.models.batchtaskcreateoptions) class. Each task runs ffmpeg to process an input `resource_files` object using a `command_line` parameter. ffmpeg was previously installed on each node when the pool was created. Here, the command line runs ffmpeg to convert each input MP4 (video) file to an MP3 (audio) file.

The sample creates an [OutputFile](/python/api/azure-batch/azure.batch.models.outputfile) object for the MP3 file after running the command line. Each task's output files (one, in this case) are uploaded to a container in the linked storage account, using the task's `output_files` property.

Then, the app adds tasks to the job with the [create_tasks](/python/api/azure-batch/azure.batch.batchclient#azure-batch-batchclient-create-tasks) method, which queues them to run on the compute nodes.

```python Snippet:tutorial_parallel_add_tasks
tasks = list()

for idx, input_file in enumerate(input_files):
    input_file_path = input_file.file_path
    output_file_path = "".join((input_file_path).split('.')[:-1]) + '.mp3'
    command = "/bin/bash -c \"ffmpeg -i {} {} \"".format(
        input_file_path, output_file_path)
    tasks.append(models.BatchTaskCreateOptions(
        id='Task{}'.format(idx),
        command_line=command,
        resource_files=[input_file],
        output_files=[models.OutputFile(
            file_pattern=output_file_path,
            destination=models.OutputFileDestination(
                container=models.OutputFileBlobContainerDestination(
                    container_url=output_container_sas_url)),
            upload_options=models.OutputFileUploadConfiguration(
                upload_condition=models.OutputFileUploadCondition.TASK_SUCCESS))]
    )
    )
batch_client.create_tasks(job_id=job_id, task_collection=tasks)
```

### Monitor tasks

When tasks are added to a job, Batch automatically queues and schedules them for execution on compute nodes in the associated pool. Based on the settings you specify, Batch handles all task queuing, scheduling, retrying, and other task administration duties.

There are many approaches to monitoring task execution. The `wait_for_tasks_to_complete` function in this example uses the [BatchTaskState](/python/api/azure-batch/azure.batch.models.batchtaskstate) object to monitor tasks for a certain state, in this case the completed state, within a time limit.

```python Snippet:tutorial_parallel_wait_tasks
while datetime.datetime.now() < timeout_expiration:
    print('.', end='')
    sys.stdout.flush()
    tasks = batch_client.list_tasks(job_id=job_id)

    incomplete_tasks = [task for task in tasks if
                        task.state != models.BatchTaskState.COMPLETED]
    if not incomplete_tasks:
        print()
        return True
    else:
        time.sleep(1)
...
```

## Clean up resources

After it runs the tasks, the app automatically deletes the input storage container it created, and gives you the option to delete the Batch pool and job. The BatchClient's [JobOperations](/python/api/azure-batch/azure.batch.operations.joboperations) and [PoolOperations](/python/api/azure-batch/azure.batch.operations.pooloperations) classes both have delete methods, which are called if you confirm deletion. Although you're not charged for jobs and tasks themselves, you are charged for compute nodes. Thus, we recommend that you allocate pools only as needed. When you delete the pool, all task output on the nodes is deleted. However, the input and output files remain in the storage account.

When no longer needed, delete the resource group, Batch account, and storage account. To do so in the Azure portal, select the resource group for the Batch account and choose **Delete resource group**.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Authenticate with Batch and Storage accounts.
> * Upload input files to Storage.
> * Create a pool of compute nodes to run an application.
> * Create a job and tasks to process input files.
> * Monitor task execution.
> * Retrieve output files.

For more examples of using the Python API to schedule and process Batch workloads, see the [Batch Python samples](https://github.com/Azure/azure-batch-samples/tree/master/Python/Batch) on GitHub.
