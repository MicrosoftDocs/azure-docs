<properties
	pageTitle="Tutorial - Get started with the Azure Batch Python client | Microsoft Azure"
	description="Learn the basic concepts of Azure Batch and how to develop the Batch service with a simple scenario"
	services="batch"
	documentationCenter="python"
	authors="mmacy"
	manager="timlt"
	editor=""/>

<tags
	ms.service="batch"
	ms.devlang="python"
	ms.topic="hero-article"
	ms.tgt_pltfrm="na"
	ms.workload="big-compute"
	ms.date="06/17/2016"
	ms.author="marsma"/>

# Get started with the Azure Batch Python client

> [AZURE.SELECTOR]
- [.NET](batch-dotnet-get-started.md)
- [Python](batch-python-tutorial.md)

Learn the basics of [Azure Batch][azure_batch] and the [Batch Python][py_azure_sdk] client as we discuss a small Batch application written in Python. We'll look at how two sample scripts leverage the Batch service to process a parallel workload on Linux virtual machines in the cloud, as well as how they interact with [Azure Storage](./../storage/storage-introduction.md) for file staging and retrieval. You'll learn a common Batch application workflow and gain a base understanding of the major components of Batch such as jobs, tasks, pools, and compute nodes.

> [AZURE.NOTE] Linux support in Batch is currently in preview. Some aspects of the feature discussed here may change prior to general availability. [Application packages](batch-application-packages.md) are **currently unsupported** on Linux compute nodes.

![Batch solution workflow (basic)][11]<br/>

## Prerequisites

This article assumes that you have a working knowledge of Python and familiarity with Linux. It also assumes that you're able to satisfy the account creation requirements that are specified below for Azure and the Batch and Storage services.

### Accounts

- **Azure account**: If you don't already have an Azure subscription, [create a free Azure account][azure_free_account].
- **Batch account**: Once you have an Azure subscription, [create an Azure Batch account](batch-account-create-portal.md).
- **Storage account**: See [Create a storage account](../storage/storage-create-storage-account.md#create-a-storage-account) in [About Azure storage accounts](../storage/storage-create-storage-account.md).

### Code sample

The Python tutorial code sample is one of the many Batch code samples found in the [azure-batch-samples][github_samples] repository on GitHub. You can download all of the samples by clicking  **Clone or download > Download ZIP** on the repository home page, or by clicking the [azure-batch-samples-master.zip][github_samples_zip] direct download link. Once you've extracted the contents of the ZIP file, the two scripts for this tutorial are found in the `article_samples` directory:

`/azure-batch-samples/Python/Batch/article_samples/python_tutorial_client.py`<br/>
`/azure-batch-samples/Python/Batch/article_samples/python_tutorial_task.py`

### Python environment

In order to run the *python_tutorial_client.py* sample script on your local workstation, you will need a **Python interpreter** compatible with version **2.7** or **3.3-3.5**. The script has been tested on both Linux and Windows.

You will also need to install the **Azure Batch** and **Azure Storage** Python packages. This can be done using the *requirements.txt* found here:

`/azure-batch-samples/Python/Batch/requirements.txt`

Issue following **pip** command to install the Batch and Storage packages:

`pip install -r requirements.txt`

Or, you can install the [azure-batch][pypi_batch] and [azure-storage][pypi_storage] Python packages manually.

> [AZURE.TIP] You may need to prefix your commands with `sudo`, e.g. `sudo pip install -r requirements.txt`, if you are using an unprivileged account (recommended). For more information on installing Python packages, see [Installing Packages][pypi_install] on readthedocs.io.

## Batch Python tutorial code sample

The Batch Python tutorial code sample consists of two Python scripts and a few data files.

- **python_tutorial_client.py**: Interacts with the Batch and Storage services to execute a parallel workload on compute nodes (virtual machines). The *python_tutorial_client.py* script runs on your local workstation.

- **python_tutorial_task.py**: The script that runs on compute nodes in Azure to perform the actual work. In the sample, *python_tutorial_task.py* parses the text in a file downloaded from Azure Storage (the input file). Then it produces a text file (the output file) that contains a list of the top three words that appear in the input file. After it creates the output file, *python_tutorial_task.py* uploads the file to Azure Storage. This makes it available for download to the client script running on your workstation. The *python_tutorial_task.py* script runs in parallel on multiple compute nodes in the Batch service.

- **./data/taskdata\*.txt**: These three text files provide the input for the tasks that run on the compute nodes.

The following diagram illustrates the primary operations that are performed by the client and task scripts. This basic workflow is typical of many compute solutions that are created with Batch. While it does not demonstrate every feature available in the Batch service, nearly every Batch scenario will include portions of this workflow.

![Batch example workflow][8]<br/>

[**Step 1.**](#step-1-create-storage-containers) Create **containers** in Azure Blob Storage.<br/>
[**Step 2.**](#step-2-upload-task-script-and-data-files) Upload task script and input files to containers.<br/>
[**Step 3.**](#step-3-create-batch-pool) Create a Batch **pool**.<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;**3a.** The pool **StartTask** downloads the task script (python_tutorial_task.py) to nodes as they join the pool.<br/>
[**Step 4.**](#step-4-create-batch-job) Create a Batch **job**.<br/>
[**Step 5.**](#step-5-add-tasks-to-job) Add **tasks** to the job.<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;**5a.** The tasks are scheduled to execute on nodes.<br/>
	&nbsp;&nbsp;&nbsp;&nbsp;**5b.** Each task downloads its input data from Azure Storage, then begins execution.<br/>
[**Step 6.**](#step-6-monitor-tasks) Monitor tasks.<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;**6a.** As tasks are completed, they upload their output data to Azure Storage.<br/>
[**Step 7.**](#step-7-download-task-output) Download task output from Storage.

As mentioned, not every Batch solution will perform these exact steps, and may include many more, but this sample demonstrates common processes found in a Batch solution.

## Prepare client script

Before you run the sample, add your Batch and Storage account credentials to *python_tutorial_client.py*. If you have not done so already, open the file in your favorite editor and update the following lines with your credentials.

```python
# Update the Batch and Storage account credential strings below with the values
# unique to your accounts. These are used when constructing connection strings
# for the Batch and Storage client objects.

# Batch account credentials
batch_account_name = "";
batch_account_key  = "";
batch_account_url  = "";

# Storage account credentials
storage_account_name = "";
storage_account_key  = "";
```

You can find your Batch and Storage account credentials within the account blade of each service in the [Azure portal][azure_portal]:

![Batch credentials in the portal][9]
![Storage credentials in the portal][10]<br/>

In the following sections we analyze the steps used by the scripts to process a workload in the Batch service. We encourage you to refer regularly to the scripts in your editor while you work your way through the rest of the article.

Navigate to the following line in **python_tutorial_client.py** to start with Step 1:

```python
if __name__ == '__main__':
```

## Step 1: Create Storage containers

![Create containers in Azure Storage][1]
<br/>

Batch includes built-in support for interacting with Azure Storage. Containers in your Storage account will provide the files needed by the tasks that run in your Batch account. The containers also provide a place to store the output data that the tasks produce. The first thing the *python_tutorial_client.py* script does is create three containers in [Azure Blob Storage](../storage/storage-introduction.md#blob-storage):

- **application**: This container will store the Python script run by the tasks, *python_tutorial_task.py*.
- **input**: Tasks will download the data files to process from the *input* container.
- **output**: When tasks complete input file processing, they will upload the results to the *output* container.

In order to interact with a Storage account and create containers, we use the [azure-storage][pypi_storage] package to create a [BlockBlobService][py_blockblobservice] object--the "blob client." We then create three containers in the Storage account using the blob client.

```python
 # Create the blob client, for use in obtaining references to
 # blob storage containers and uploading files to containers.
 blob_client = azureblob.BlockBlobService(
     account_name=_STORAGE_ACCOUNT_NAME,
     account_key=_STORAGE_ACCOUNT_KEY)

 # Use the blob client to create the containers in Azure Storage if they
 # don't yet exist.
 app_container_name = 'application'
 input_container_name = 'input'
 output_container_name = 'output'
 blob_client.create_container(app_container_name, fail_on_exist=False)
 blob_client.create_container(input_container_name, fail_on_exist=False)
 blob_client.create_container(output_container_name, fail_on_exist=False)
```

Once the containers have been created, the application can now upload the files that will be used by the tasks.

> [AZURE.TIP] [How to use Azure Blob storage from Python](../storage/storage-python-how-to-use-blob-storage.md) provides a good overview of working with Azure Storage containers and blobs. It should be near the top of your reading list as you start working with Batch.

## Step 2: Upload task script and data files

![Upload task application and input (data) files to containers][2]
<br/>

In the file upload operation, *python_tutorial_client.py* first defines collections of **application** and **input** file paths as they exist on the local machine. Then it uploads these files to the containers that you created in the previous step.

```python
 # Paths to the task script. This script will be executed by the tasks that
 # run on the compute nodes.
 application_file_paths = [os.path.realpath('python_tutorial_task.py')]

 # The collection of data files that are to be processed by the tasks.
 input_file_paths = [os.path.realpath('./data/taskdata1.txt'),
                     os.path.realpath('./data/taskdata2.txt'),
                     os.path.realpath('./data/taskdata3.txt')]

 # Upload the application script to Azure Storage. This is the script that
 # will process the data files, and is executed by each of the tasks on the
 # compute nodes.
 application_files = [
     upload_file_to_container(blob_client, app_container_name, file_path)
     for file_path in application_file_paths]

 # Upload the data files. This is the data that will be processed by each of
 # the tasks executed on the compute nodes in the pool.
 input_files = [
     upload_file_to_container(blob_client, input_container_name, file_path)
     for file_path in input_file_paths]
```

Using list comprehension, the `upload_file_to_container` function is called for each file in the collections, and two [ResourceFile][py_resource_file] collections are populated. The `upload_file_to_container` function appears below:

```
def upload_file_to_container(block_blob_client, container_name, file_path):
    """
    Uploads a local file to an Azure Blob storage container.

    :param block_blob_client: A blob service client.
    :type block_blob_client: `azure.storage.blob.BlockBlobService`
    :param str container_name: The name of the Azure Blob storage container.
    :param str file_path: The local path to the file.
    :rtype: `azure.batch.models.ResourceFile`
    :return: A ResourceFile initialized with a SAS URL appropriate for Batch
    tasks.
    """
    blob_name = os.path.basename(file_path)

    print('Uploading file {} to container [{}]...'.format(file_path,
                                                          container_name))

    block_blob_client.create_blob_from_path(container_name,
                                            blob_name,
                                            file_path)

    sas_token = block_blob_client.generate_blob_shared_access_signature(
        container_name,
        blob_name,
        permission=azureblob.BlobPermissions.READ,
        expiry=datetime.datetime.utcnow() + datetime.timedelta(hours=2))

    sas_url = block_blob_client.make_blob_url(container_name,
                                              blob_name,
                                              sas_token=sas_token)

    return batchmodels.ResourceFile(file_path=blob_name,
                                    blob_source=sas_url)
```

### ResourceFiles

A [ResourceFile][py_resource_file] provides tasks in Batch with the URL to a file in Azure Storage that will be downloaded to a compute node before that task is run. The [ResourceFile][py_resource_file].**blob_source** property specifies the full URL of the file as it exists in Azure Storage. The URL may also include a shared access signature (SAS) that provides secure access to the file. Most task types in Batch include a *ResourceFiles* property, including:

- [CloudTask][py_task]
- [StartTask][py_starttask]
- [JobPreparationTask][py_jobpreptask]
- [JobReleaseTask][py_jobreltask]

This sample does not use the JobPreparationTask or JobReleaseTask task types, but you can read more about them in [Run job preparation and completion tasks on Azure Batch compute nodes](batch-job-prep-release.md).

### Shared access signature (SAS)

Shared access signatures are strings that provide secure access to containers and blobs in Azure Storage. The *python_tutorial_client.py* script uses both blob and container shared access signatures, and demonstrates how to obtain these shared access signature strings from the Storage service.

- **Blob shared access signatures**: The pool's StartTask uses blob shared access signatures when it downloads the task script and input data files from Storage (see [Step #3](#step-3-create-batch-pool) below). The `upload_file_to_container` function in *python_tutorial_client.py* contains the code that obtains each blob's shared access signature. It does so by calling [BlockBlobService.make_blob_url][py_make_blob_url] in the Storage module.

- **Container shared access signature**: As each task finishes its work on the compute node, it uploads its output file to the *output* container in Azure Storage. To do so, *python_tutorial_task.py* uses a container shared access signature that provides write access to the container. The `get_container_sas_token` function in *python_tutorial_client.py* obtains the container's shared access signature, which is then passed as a command-line argument to the tasks. Step #5, [Add tasks to a job](#step-5-add-tasks-to-job), discusses the usage of the container SAS.

> [AZURE.TIP] Check out the two-part series on shared access signatures, [Part 1: Understanding the SAS model](../storage/storage-dotnet-shared-access-signature-part-1.md) and [Part 2: Create and use a SAS with the Blob service](../storage/storage-dotnet-shared-access-signature-part-2.md), to learn more about providing secure access to data in your Storage account.

## Step 3: Create Batch pool

![Create a Batch pool][3]
<br/>

A Batch **pool** is a collection of compute nodes (virtual machines) on which Batch executes a job's tasks.

After it uploads the task script and data files to the Storage account, *python_tutorial_client.py* starts its interaction with the Batch service by using the Batch Python module. To do so, a [BatchServiceClient][py_batchserviceclient] is created:

```python
 # Create a Batch service client. We'll now be interacting with the Batch
 # service in addition to Storage.
 credentials = batchauth.SharedKeyCredentials(_BATCH_ACCOUNT_NAME,
                                              _BATCH_ACCOUNT_KEY)

 batch_client = batch.BatchServiceClient(
     credentials,
     base_url=_BATCH_ACCOUNT_URL)
```

Next, a pool of compute nodes is created in the Batch account with a call to `create_pool`.

```python
def create_pool(batch_service_client, pool_id,
                resource_files, distro, version):
    """
    Creates a pool of compute nodes with the specified OS settings.

    :param batch_service_client: A Batch service client.
    :type batch_service_client: `azure.batch.BatchServiceClient`
    :param str pool_id: An ID for the new pool.
    :param list resource_files: A collection of resource files for the pool's
    start task.
    :param str distro: The Linux distribution that should be installed on the
    compute nodes, e.g. 'Ubuntu' or 'CentOS'.
    :param str version: The version of the operating system for the compute
    nodes, e.g. '15' or '14.04'.
    """
    print('Creating pool [{}]...'.format(pool_id))

    # Create a new pool of Linux compute nodes using an Azure Virtual Machines
    # Marketplace image. For more information about creating pools of Linux
    # nodes, see:
    # https://azure.microsoft.com/documentation/articles/batch-linux-nodes/

    # Specify the commands for the pool's start task. The start task is run
    # on each node as it joins the pool, and when it's rebooted or re-imaged.
    # We use the start task to prep the node for running our task script.
    task_commands = [
        # Copy the python_tutorial_task.py script to the "shared" directory
        # that all tasks that run on the node have access to.
        'cp -r $AZ_BATCH_TASK_WORKING_DIR/* $AZ_BATCH_NODE_SHARED_DIR',
        # Install pip and then the azure-storage module so that the task
        # script can access Azure Blob storage
        'apt-get update',
        'apt-get -y install python-pip',
        'pip install azure-storage']

    # Get the virtual machine configuration for the desired distro and version.
    # For more information about the virtual machine configuration, see:
    # https://azure.microsoft.com/documentation/articles/batch-linux-nodes/
    vm_config = get_vm_config_for_distro(batch_service_client, distro, version)

    new_pool = batch.models.PoolAddParameter(
        id=pool_id,
        virtual_machine_configuration=vm_config,
        vm_size=_POOL_VM_SIZE,
        target_dedicated=_POOL_NODE_COUNT,
        start_task=batch.models.StartTask(
            command_line=wrap_commands_in_shell('linux', task_commands),
            run_elevated=True,
            wait_for_success=True,
            resource_files=resource_files),
        )

    try:
        batch_service_client.pool.add(new_pool)
    except batchmodels.batch_error.BatchErrorException as err:
        print_batch_exception(err)
        raise
}
```

When you create a pool, you define a [PoolAddParameter][py_pooladdparam] which specifies several properties for the pool:

- **ID** of the pool (*id* - required)<p/>As with most entities in Batch, your new pool must have a unique ID within your Batch account. Your code will refer to this pool using its ID, and it's how you identify the pool in the Azure [portal][azure_portal].

- **Number of compute nodes** (*target_dedicated* - required)<p/>This specifies how many VMs should be deployed in the pool. It is important to note that all Batch accounts have a default **quota** that limits the number of **cores** (and thus, compute nodes) in a Batch account. You will find the default quotas and instructions on how to [increase a quota](batch-quota-limit.md#increase-a-quota) (such as the maximum number of cores in your Batch account) in [Quotas and limits for the Azure Batch service](batch-quota-limit.md). If you find yourself asking "Why won't my pool reach more than X nodes?" this core quota may be the cause.

- **Operating system** for nodes (*virtual_machine_configuration* **or** *cloud_service_configuration* - required)<p/>In *python_tutorial_client.py*, we create a pool of Linux nodes using a [VirtualMachineConfiguration][py_vm_config] obtained with our `get_vm_config_for_distro` helper function. This helper function uses [list_node_agent_skus][py_list_skus] to obtain and select an image from a list of compatible [Azure Virtual Machines Marketplace][vm_marketplace] images. You have the option to instead specify a [CloudServiceConfiguration][py_cs_config] and create pool of Windows nodes from Cloud Services. See [Provision Linux compute nodes in Azure Batch pools](batch-linux-nodes.md) for more information about the two configurations.

- **Size of compute nodes** (*vm_size* - required)<p/>Since we're specifying Linux nodes for our [VirtualMachineConfiguration][py_vm_config], we specify a VM size (`STANDARD_A1` in this sample) from [Sizes for virtual machines in Azure](../virtual-machines/virtual-machines-linux-sizes.md). Again, see [Provision Linux compute nodes in Azure Batch pools](batch-linux-nodes.md) for more information.

- **Start task** (*start_task* - not required)<p/>Along with the above physical node properties, you may also specify a [StartTask][py_starttask] for the pool (it is not required). The StartTask will execute on each node as that node joins the pool, as well as each time a node is restarted. The StartTask is especially useful for preparing compute nodes for the execution of tasks, such as installing the applications that your tasks will run.<p/>In this sample application, the StartTask copies the files that it downloads from Storage (which are specified by using the StartTask's **resource_files** property) from the StartTask *working directory* to the *shared* directory that all tasks running on the node can access. Essentially, this copies `python_tutorial_task.py` to the shared directory on each node as the node joins the pool, so that any tasks that run on the node can access it.

You may notice the call to the `wrap_commands_in_shell` helper function. This function takes a collection of separate commands and creates a single command line appropriate for a task's command line property.

Also notable in the code snippet above is the use of two environment variables in the **command_line** property of the StartTask: `AZ_BATCH_TASK_WORKING_DIR` and `AZ_BATCH_NODE_SHARED_DIR`. Each compute node within a Batch pool is automatically configured with several environment variables that are specific to Batch. Any process that is executed by a task has access to these environment variables.

> [AZURE.TIP] To find out more about the environment variables that are available on compute nodes in a Batch pool, as well as information on task working directories, see **Environment settings for tasks** and **Files and directories** in the [overview of Azure Batch features](batch-api-basics.md).

## Step 4: Create Batch job

![Create Batch job][4]<br/>

A Batch **job** is a collection of tasks, and is associated with a pool of compute nodes. The tasks in a job execute on the associated pool's compute nodes.

You can use a job not only for organizing and tracking tasks in related workloads, but also for imposing certain constraints--such as the maximum runtime for the job (and by extension, its tasks) as well as job priority in relation to other jobs in the Batch account. In this example, however, the job is associated only with the pool that was created in step #3. No additional properties are configured.

All Batch jobs are associated with a specific pool. This association indicates which nodes the job's tasks will execute on. You specify this by using the [PoolInformation][py_poolinfo] property, as shown in the code snippet below.

```python
def create_job(batch_service_client, job_id, pool_id):
    """
    Creates a job with the specified ID, associated with the specified pool.

    :param batch_service_client: A Batch service client.
    :type batch_service_client: `azure.batch.BatchServiceClient`
    :param str job_id: The ID for the job.
    :param str pool_id: The ID for the pool.
    """
    print('Creating job [{}]...'.format(job_id))

    job = batch.models.JobAddParameter(
        job_id,
        batch.models.PoolInformation(pool_id=pool_id))

    try:
        batch_service_client.job.add(job)
    except batchmodels.batch_error.BatchErrorException as err:
        print_batch_exception(err)
        raise
```

Now that a job has been created, tasks are added to perform the work.

## Step 5: Add tasks to job

![Add tasks to job][5]<br/>
*(1) Tasks are added to the job, (2) the tasks are scheduled to run on nodes, and (3) the tasks download the data files to process*

Batch **tasks** are the individual units of work that execute on the compute nodes. A task has a command line and runs the scripts or executables that you specify in that command line.

To actually perform work, tasks must be added to a job. Each [CloudTask][py_task] is configured with a command line property and [ResourceFiles][py_resource_file] (as with the pool's StartTask) that the task downloads to the node before its command line is automatically executed. In the sample, each task processes only one file. Thus, its ResourceFiles collection contains a single element.

```python
def add_tasks(batch_service_client, job_id, input_files,
              output_container_name, output_container_sas_token):
    """
    Adds a task for each input file in the collection to the specified job.

    :param batch_service_client: A Batch service client.
    :type batch_service_client: `azure.batch.BatchServiceClient`
    :param str job_id: The ID of the job to which to add the tasks.
    :param list input_files: A collection of input files. One task will be
     created for each input file.
    :param output_container_name: The ID of an Azure Blob storage container to
    which the tasks will upload their results.
    :param output_container_sas_token: A SAS token granting write access to
    the specified Azure Blob storage container.
    """

    print('Adding {} tasks to job [{}]...'.format(len(input_files), job_id))

    tasks = list()

    for input_file in input_files:

        command = ['python $AZ_BATCH_NODE_SHARED_DIR/python_tutorial_task.py '
                   '--filepath {} --numwords {} --storageaccount {} '
                   '--storagecontainer {} --sastoken "{}"'.format(
                    input_file.file_path,
                    '3',
                    _STORAGE_ACCOUNT_NAME,
                    output_container_name,
                    output_container_sas_token)]

        tasks.append(batch.models.TaskAddParameter(
                'topNtask{}'.format(input_files.index(input_file)),
                wrap_commands_in_shell('linux', command),
                resource_files=[input_file]
                )
        )

    batch_service_client.task.add_collection(job_id, tasks)
```

> [AZURE.IMPORTANT] When they access environment variables such as `$AZ_BATCH_NODE_SHARED_DIR` or execute an application not found in the node's `PATH`, task command lines must invoke the shell explicitly, such as with `/bin/sh -c MyTaskApplication $MY_ENV_VAR`. This requirement is unnecessary if your tasks execute an application in the node's `PATH` and do not reference any environment variables.

Within the `for` loop in the code snippet above, you can see that the command line for the task is constructed with five command-line arguments that are passed to *python_tutorial_task.py*:

1. **filepath**: This is the local path to the file as it exists on the node. When the ResourceFile object in `upload_file_to_container` was created in Step 2 above, the file name was used for this property (the `file_path` parameter in the ResourceFile constructor). This indicates that the file can be found in the same directory on the node as *python_tutorial_task.py*.

2. **numwords**: The top *N* words should be written to the output file.

3. **storageaccount**: The name of the Storage account that owns the container to which the task output should be uploaded.

4. **storagecontainer**: The name of the Storage container to which the output files should be uploaded.

5. **sastoken**: The shared access signature (SAS) that provides write access to the **output** container in Azure Storage. The *python_tutorial_task.py* script uses this shared access signature when creates its BlockBlobService reference. This provides write access to the container without requiring an access key for the storage account.

```python
# NOTE: Taken from python_tutorial_task.py

# Create the blob client using the container's SAS token.
# This allows us to create a client that provides write
# access only to the container.
blob_client = azureblob.BlockBlobService(account_name=args.storageaccount,
                                         sas_token=args.sastoken)
```

## Step 6: Monitor tasks

![Monitor tasks][6]<br/>
*The script (1) monitors the tasks for completion status, and (2) the tasks upload result data to Azure Storage*

When tasks are added to a job, they are automatically queued and scheduled for execution on compute nodes within the pool associated with the job. Based on the settings you specify, Batch handles all task queuing, scheduling, retrying, and other task administration duties for you.

There are many approaches to monitoring task execution. The `wait_for_tasks_to_complete` function in *python_tutorial_client.py* provides a simple example of monitoring tasks for a certain state, in this case, the [completed][py_taskstate] state.

```python
def wait_for_tasks_to_complete(batch_service_client, job_id, timeout):
    """
    Returns when all tasks in the specified job reach the Completed state.

    :param batch_service_client: A Batch service client.
    :type batch_service_client: `azure.batch.BatchServiceClient`
    :param str job_id: The id of the job whose tasks should be to monitored.
    :param timedelta timeout: The duration to wait for task completion. If all
    tasks in the specified job do not reach Completed state within this time
    period, an exception will be raised.
    """
    timeout_expiration = datetime.datetime.now() + timeout

    print("Monitoring all tasks for 'Completed' state, timeout in {}..."
          .format(timeout), end='')

    while datetime.datetime.now() < timeout_expiration:
        print('.', end='')
        sys.stdout.flush()
        tasks = batch_service_client.task.list(job_id)

        incomplete_tasks = [task for task in tasks if
                            task.state != batchmodels.TaskState.completed]
        if not incomplete_tasks:
            print()
            return True
        else:
            time.sleep(1)

    print()
    raise RuntimeError("ERROR: Tasks did not reach 'Completed' state within "
                       "timeout period of " + str(timeout))
```

## Step 7: Download task output

![Download task output from Storage][7]<br/>

Now that the job is completed, the output from the tasks can be downloaded from Azure Storage. This is done with a call to `download_blobs_from_container` in *python_tutorial_client.py*:

```python
def download_blobs_from_container(block_blob_client,
                                  container_name, directory_path):
    """
    Downloads all blobs from the specified Azure Blob storage container.

    :param block_blob_client: A blob service client.
    :type block_blob_client: `azure.storage.blob.BlockBlobService`
    :param container_name: The Azure Blob storage container from which to
     download files.
    :param directory_path: The local directory to which to download the files.
    """
    print('Downloading all files from container [{}]...'.format(
        container_name))

    container_blobs = block_blob_client.list_blobs(container_name)

    for blob in container_blobs.items:
        destination_file_path = os.path.join(directory_path, blob.name)

        block_blob_client.get_blob_to_path(container_name,
                                           blob.name,
                                           destination_file_path)

        print('  Downloaded blob [{}] from container [{}] to {}'.format(
            blob.name,
            container_name,
            destination_file_path))

    print('  Download complete!')
```

> [AZURE.NOTE] The call to `download_blobs_from_container` in *python_tutorial_client.py* specifies that the files should be downloaded to your user's home directory. Feel free to modify this output location.

## Step 8: Delete containers

Because you are charged for data that resides in Azure Storage, it is always a good idea to remove any blobs that are no longer needed for your Batch jobs. In *python_tutorial_client.py*, this is done with three calls to [BlockBlobService.delete_container][py_delete_container]:

```
# Clean up storage resources
print('Deleting containers...')
blob_client.delete_container(app_container_name)
blob_client.delete_container(input_container_name)
blob_client.delete_container(output_container_name)
```

## Step 9: Delete the job and the pool

In the final step, the user is prompted to delete the job and the pool that were created by the *python_tutorial_client.py* script. Although you are not charged for jobs and tasks themselves, you *are* charged for compute nodes. Thus, we recommend that you allocate nodes only as needed. Deleting unused pools can be part of your maintenance process.

The BatchServiceClient's [JobOperations][py_job] and [PoolOperations][py_pool] both have corresponding deletion methods, which are called if the user confirms deletion:

```python
# Clean up Batch resources (if the user so chooses).
if query_yes_no('Delete job?') == 'yes':
    batch_client.job.delete(_JOB_ID)

if query_yes_no('Delete pool?') == 'yes':
    batch_client.pool.delete(_POOL_ID)
```

> [AZURE.IMPORTANT] Keep in mind that you are charged for compute resources--deleting unused pools will minimize cost. Also, be aware that deleting a pool deletes all compute nodes within that pool, and that any data on the nodes will be unrecoverable after the pool is deleted.

## Run the sample script

When you run the *python_tutorial_client.py* script, the console output will be similar to the following. You will see a pause at `Monitoring all tasks for 'Completed' state, timeout in 0:20:00...` while the pool's compute nodes are created, started, and the commands in the pool's start task are executed. Use the [Azure portal][azure_portal] to monitor your pool, compute nodes, job, and tasks during and after execution. Use the [Azure portal][azure_portal] or the [Microsoft Azure Storage Explorer][storage_explorer] to view the Storage resources (containers and blobs) that are created by the application.

Typical execution time is **approximately 5-7 minutes** when you run the application in its default configuration.

```
Sample start: 2016-05-20 22:47:10

Uploading file /home/user/py_tutorial/python_tutorial_task.py to container [application]...
Uploading file /home/user/py_tutorial/data/taskdata1.txt to container [input]...
Uploading file /home/user/py_tutorial/data/taskdata2.txt to container [input]...
Uploading file /home/user/py_tutorial/data/taskdata3.txt to container [input]...
Creating pool [PythonTutorialPool]...
Creating job [PythonTutorialJob]...
Adding 3 tasks to job [PythonTutorialJob]...
Monitoring all tasks for 'Completed' state, timeout in 0:20:00..........................................................................
  Success! All tasks reached the 'Completed' state within the specified timeout period.
Downloading all files from container [output]...
  Downloaded blob [taskdata1_OUTPUT.txt] from container [output] to /home/user/taskdata1_OUTPUT.txt
  Downloaded blob [taskdata2_OUTPUT.txt] from container [output] to /home/user/taskdata2_OUTPUT.txt
  Downloaded blob [taskdata3_OUTPUT.txt] from container [output] to /home/user/taskdata3_OUTPUT.txt
  Download complete!
Deleting containers...

Sample end: 2016-05-20 22:53:12
Elapsed time: 0:06:02

Delete job? [Y/n]
Delete pool? [Y/n]

Press ENTER to exit...
```

## Next steps

Feel free to make changes to *python_tutorial_client.py* and *python_tutorial_task.py* to experiment with different compute scenarios. For example, try adding an execution delay to *python_tutorial_task.py* to simulate long-running tasks and monitor them in the portal. Try adding more tasks or adjusting the number of compute nodes. Add logic to check for and allow the use of an existing pool to speed execution time.

Now that you're familiar with the basic workflow of a Batch solution, it's time to dig in to the additional features of the Batch service.

- Review the [Overview of Azure Batch features](batch-api-basics.md) article, which we recommend if you're new to the service.
- Start on the other Batch development articles under **Development in-depth** in the [Batch learning path][batch_learning_path].
- Check out a different implementation of processing the "top N words" workload with Batch in the [TopNWords][github_topnwords] sample.

[azure_batch]: https://azure.microsoft.com/services/batch/
[azure_free_account]: https://azure.microsoft.com/free/
[azure_portal]: https://portal.azure.com
[batch_learning_path]: https://azure.microsoft.com/documentation/learning-paths/batch/
[blog_linux]: http://blogs.technet.com/b/windowshpc/archive/2016/03/30/introducing-linux-support-on-azure-batch.aspx
[github_samples]: https://github.com/Azure/azure-batch-samples
[github_samples_common]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/Common
[github_samples_zip]: https://github.com/Azure/azure-batch-samples/archive/master.zip
[github_topnwords]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/TopNWords

[nuget_packagemgr]: https://visualstudiogallery.msdn.microsoft.com/27077b70-9dad-4c64-adcf-c7cf6bc9970c
[nuget_restore]: https://docs.nuget.org/consume/package-restore/msbuild-integrated#enabling-package-restore-during-build

[py_account_ops]: http://azure-sdk-for-python.readthedocs.org/en/latest/ref/azure.batch.operations.html#azure.batch.operations.AccountOperations
[py_azure_sdk]: https://pypi.python.org/pypi/azure
[py_batch_docs]: http://azure-sdk-for-python.readthedocs.org/en/latest/ref/azure.batch.html
[py_batch_package]: https://pypi.python.org/pypi/azure-batch
[py_batchserviceclient]: http://azure-sdk-for-python.readthedocs.io/en/latest/ref/azure.batch.html#azure.batch.BatchServiceClient
[py_blockblobservice]: http://azure.github.io/azure-storage-python/ref/azure.storage.blob.blockblobservice.html#azure.storage.blob.blockblobservice.BlockBlobService
[py_cloudtask]: http://azure-sdk-for-python.readthedocs.io/en/latest/ref/azure.batch.models.html#azure.batch.models.CloudTask
[py_computenodeuser]: http://azure-sdk-for-python.readthedocs.org/en/latest/ref/azure.batch.models.html#azure.batch.models.ComputeNodeUser
[py_cs_config]: http://azure-sdk-for-python.readthedocs.io/en/latest/ref/azure.batch.models.html#azure.batch.models.CloudServiceConfiguration
[py_delete_container]: http://azure.github.io/azure-storage-python/ref/azure.storage.blob.baseblobservice.html#azure.storage.blob.baseblobservice.BaseBlobService.delete_container
[py_gen_blob_sas]: http://azure.github.io/azure-storage-python/ref/azure.storage.blob.baseblobservice.html#azure.storage.blob.baseblobservice.BaseBlobService.generate_blob_shared_access_signature
[py_gen_container_sas]: http://azure.github.io/azure-storage-python/ref/azure.storage.blob.baseblobservice.html#azure.storage.blob.baseblobservice.BaseBlobService.generate_container_shared_access_signature
[py_image_ref]: http://azure-sdk-for-python.readthedocs.io/en/latest/ref/azure.batch.models.html#azure.batch.models.ImageReference
[py_imagereference]: http://azure-sdk-for-python.readthedocs.org/en/latest/ref/azure.batch.models.html#azure.batch.models.ImageReference
[py_job]: http://azure-sdk-for-python.readthedocs.io/en/latest/ref/azure.batch.operations.html#azure.batch.operations.JobOperations
[py_jobpreptask]: http://azure-sdk-for-python.readthedocs.io/en/latest/ref/azure.batch.models.html#azure.batch.models.JobPreparationTask
[py_jobreltask]: http://azure-sdk-for-python.readthedocs.io/en/latest/ref/azure.batch.models.html#azure.batch.models.JobReleaseTask
[py_list_skus]: http://azure-sdk-for-python.readthedocs.io/en/latest/ref/azure.batch.operations.html#azure.batch.operations.AccountOperations.list_node_agent_skus
[py_make_blob_url]: http://azure.github.io/azure-storage-python/ref/azure.storage.blob.baseblobservice.html#azure.storage.blob.baseblobservice.BaseBlobService.make_blob_url
[py_pool]: http://azure-sdk-for-python.readthedocs.io/en/latest/ref/azure.batch.operations.html#azure.batch.operations.PoolOperations
[py_pooladdparam]: http://azure-sdk-for-python.readthedocs.io/en/latest/ref/azure.batch.models.html#azure.batch.models.PoolAddParameter
[py_poolinfo]: http://azure-sdk-for-python.readthedocs.io/en/latest/ref/azure.batch.models.html#azure.batch.models.PoolInformation
[py_resource_file]: http://azure-sdk-for-python.readthedocs.io/en/latest/ref/azure.batch.models.html#azure.batch.models.ResourceFile
[py_samples_github]: https://github.com/Azure/azure-batch-samples/tree/master/Python/Batch/
[py_starttask]: http://azure-sdk-for-python.readthedocs.io/en/latest/ref/azure.batch.models.html#azure.batch.models.StartTask
[py_starttask]: http://azure-sdk-for-python.readthedocs.io/en/latest/ref/azure.batch.models.html#azure.batch.models.StartTask
[py_task]: http://azure-sdk-for-python.readthedocs.io/en/latest/ref/azure.batch.models.html#azure.batch.models.CloudTask
[py_taskstate]: http://azure-sdk-for-python.readthedocs.io/en/latest/ref/azure.batch.models.html#azure.batch.models.TaskState
[py_vm_config]: http://azure-sdk-for-python.readthedocs.io/en/latest/ref/azure.batch.models.html#azure.batch.models.VirtualMachineConfiguration
[pypi_batch]: https://pypi.python.org/pypi/azure-batch
[pypi_storage]: https://pypi.python.org/pypi/azure-storage

[pypi_install]: http://python-packaging-user-guide.readthedocs.io/en/latest/installing/
[storage_explorer]: http://storageexplorer.com/
[visual_studio]: https://www.visualstudio.com/products/vs-2015-product-editions
[vm_marketplace]: https://azure.microsoft.com/marketplace/virtual-machines/

[1]: ./media/batch-dotnet-get-started/batch_workflow_01_sm.png "Create containers in Azure Storage"
[2]: ./media/batch-dotnet-get-started/batch_workflow_02_sm.png "Upload task application and input (data) files to containers"
[3]: ./media/batch-dotnet-get-started/batch_workflow_03_sm.png "Create Batch pool"
[4]: ./media/batch-dotnet-get-started/batch_workflow_04_sm.png "Create Batch job"
[5]: ./media/batch-dotnet-get-started/batch_workflow_05_sm.png "Add tasks to job"
[6]: ./media/batch-dotnet-get-started/batch_workflow_06_sm.png "Monitor tasks"
[7]: ./media/batch-dotnet-get-started/batch_workflow_07_sm.png "Download task output from Storage"
[8]: ./media/batch-dotnet-get-started/batch_workflow_sm.png "Batch solution workflow (full diagram)"
[9]: ./media/batch-dotnet-get-started/credentials_batch_sm.png "Batch credentials in Portal"
[10]: ./media/batch-dotnet-get-started/credentials_storage_sm.png "Storage credentials in Portal"
[11]: ./media/batch-dotnet-get-started/batch_workflow_minimal_sm.png "Batch solution workflow (minimal diagram)"
