---
title: Train a CNTK model with Azure Batch AI - Python | Microsoft Docs
description: Train a Microsoft Cognitive Toolkit (CNTK) neural network with Azure Batch AI using the Python SDK
services: batch-ai
documentationcenter: na
author: lliimsft
manager: jeconnoc
editor: 

ms.assetid:
ms.custom:
ms.service: batch-ai
ms.workload:
ms.tgt_pltfrm: na
ms.devlang: Python
ms.topic: quickstart
ms.date: 08/15/2018
ms.author: danlep
---

# Run a CNTK training job using the Azure Python SDK

This article shows you how to use the Azure Python SDK to train a sample Microsoft Cognitive Toolkit (CNTK) model using the Batch AI service.

In this example, you use the MNIST database of handwritten images to train a convolutional neural network (CNN) on a single-node GPU cluster.

## Prerequisites

* Azure subscription - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* Azure Python SDK - See [installation instructions](/python/azure/python-sdk-azure-install). This article requires at least azure-mgmt-batchai package version 2.0.0.

* Azure storage account - See [How to create an Azure storage account](../storage/common/storage-create-storage-account.md)

* Azure Active Directory service principal credentials - See [How to create a service principal with the CLI](../azure-resource-manager/resource-group-authenticate-service-principal-cli.md)

* Register the Batch AI resource provider once for your subscription using Azure Cloud Shell or the Azure CLI. A provider registration can take up to 15 minutes.

```azurecli
az provider register -n Microsoft.BatchAI
```

## Configure credentials

Add the following code into your script file and replace `FILL-IN-HERE` with appropriate values:

```Python
# credentials used for authentication
aad_client_id = 'FILL-IN-HERE'
aad_secret = 'FILL-IN-HERE'
aad_tenant = 'FILL-IN-HERE'
subscription_id = 'FILL-IN-HERE'

# credentials used for storage
storage_account_name = 'FILL-IN-HERE'
storage_account_key = 'FILL-IN-HERE'

# specify the credentials used to remote login your GPU node
admin_user_name = 'FILL-IN-HERE'
admin_user_password = 'FILL-IN-HERE'

# specify the location in which to create Batch AI resources
mylocation = 'eastus'
```

Note, that putting credentials into the source code is not a good practice and it's done here to make the quickstart simpler.
Consider to use environment variables or a separate configuration file instead.

## Create Batch AI client

The following code creates a service principal credentials object and Batch AI client:

```Python
from azure.common.credentials import ServicePrincipalCredentials
import azure.mgmt.batchai as batchai
import azure.mgmt.batchai.models as models

creds = ServicePrincipalCredentials(
		client_id=aad_client_id, secret=aad_secret, tenant=aad_tenant)

batchai_client = batchai.BatchAIManagementClient(
    credentials=creds, subscription_id=subscription_id)
```

## Create a resource group

Batch AI clusters and jobs are Azure resources and must be placed in an Azure resource group. The following snippet creates a resource group:

```Python
from azure.mgmt.resource import ResourceManagementClient

resource_group_name = 'myresourcegroup'
resource_management_client = ResourceManagementClient(
        credentials=creds, subscription_id=subscription_id)
resource = resource_management_client.resource_groups.create_or_update(
        resource_group_name, {'location': mylocation})
```


## Prepare Azure file share

For illustration purposes, this quickstart uses an Azure File share to host the training data and scripts for the training job.

Create a file share named `batchaiquickstart`.

```Python
from azure.storage.file import FileService
azure_file_share_name = 'batchaiquickstart'
service = FileService(storage_account_name, storage_account_key)
service.create_share(azure_file_share_name, fail_on_exist=False)
```

Create a directory in the share named `mnistcntksample`.

```Python
mnist_dataset_directory = 'mnistcntksample'
service.create_directory(azure_file_share_name, mnist_dataset_directory, fail_on_exist=False)
```
Download the [sample package](https://batchaisamples.blob.core.windows.net/samples/BatchAIQuickStart.zip?st=2017-09-29T18%3A29%3A00Z&se=2099-12-31T08%3A00%3A00Z&sp=rl&sv=2016-05-31&sr=b&sig=hrAZfbZC%2BQ%2FKccFQZ7OC4b%2FXSzCF5Myi4Cj%2BW3sVZDo%3D) and unzip into the current directory. The following code uploads required files into the Azure File share:

```Python
for f in ['Train-28x28_cntk_text.txt', 'Test-28x28_cntk_text.txt',
          'ConvNet_MNIST.py']:
     service.create_file_from_path(
             azure_file_share_name, mnist_dataset_directory, f, f)
```

## Create Batch AI workspace

A workspace is a top-level collection of all types of Batch AI resources. You create your Batch AI cluster and experiments in a workspace.

```Python
workspace_name='myworkspace'
batchai_client.workspaces.create(resource_group_name, workspace_name, mylocation)
```

## Create GPU cluster

Create a Batch AI cluster. In this example, the cluster consists of a single STANDARD_NC6 VM node. This VM size has one NVIDIA K80 GPU. Mount the file share at a folder named `azurefileshare`. The full path of this folder on the GPU compute node is `$AZ_BATCHAI_MOUNT_ROOT/azurefileshare`.

```Python
cluster_name = 'mycluster'

relative_mount_point = 'azurefileshare'

parameters = models.ClusterCreateParameters(
    # VM size. Use N-series for GPU
    vm_size='STANDARD_NC6',
    # Configure the ssh users
    user_account_settings=models.UserAccountSettings(
        admin_user_name=admin_user_name,
        admin_user_password=admin_user_password),
    # Number of VMs in the cluster
    scale_settings=models.ScaleSettings(
        manual=models.ManualScaleSettings(target_node_count=1)
    ),
    # Configure each node in the cluster
    node_setup=models.NodeSetup(
        # Mount shared volumes to the host
        mount_volumes=models.MountVolumes(
            azure_file_shares=[
                models.AzureFileShareReference(
                    account_name=storage_account_name,
                    credentials=models.AzureStorageCredentialsInfo(
                        account_key=storage_account_key),
                    azure_file_url='https://{0}/{1}'.format(
                        service.primary_endpoint, azure_file_share_name),
                    relative_mount_path=relative_mount_point)],
        ),
    ),
)
batchai_client.clusters.create(resource_group_name, workspace_name, cluster_name,
                               parameters).result()
```

## Get cluster status

Monitor the cluster status using the following command:

```Python
cluster = batchai_client.clusters.get(resource_group_name, workspace_name, cluster_name)
print('Cluster state: {0} Target: {1}; Allocated: {2}; Idle: {3}; '
      'Unusable: {4}; Running: {5}; Preparing: {6}; Leaving: {7}'.format(
    cluster.allocation_state,
    cluster.scale_settings.manual.target_node_count,
    cluster.current_node_count,
    cluster.node_state_counts.idle_node_count,
    cluster.node_state_counts.unusable_node_count,
    cluster.node_state_counts.running_node_count,
    cluster.node_state_counts.preparing_node_count,
    cluster.node_state_counts.leaving_node_count))
```

The preceding code prints basic cluster allocation information like in the following example:

```
Cluster state: AllocationState.steady Target: 1; Allocated: 1; Idle: 0; Unusable: 0; Running: 0; Preparing: 1; Leaving: 0
```

The cluster is ready when the nodes are allocated and finished preparation (see the `nodeStateCounts` attribute). If something went wrong, the `errors` attribute contains the error description.

## Create experiment and training job

After the cluster is created, create an experiment (a logical container for a group of related jobs). Then configure and submit a learning job in the experiment:

```Python
experiment_name='myexperiment'

batchai_client.experiments.create(resource_group_name, workspace_name, experiment_name)

job_name = 'myjob'

parameters = models.JobCreateParameters(
    # The cluster this job will run on
    cluster=models.ResourceId(id=cluster.id),
    # The number of VMs in the cluster to use
    node_count=1,
    # Write job's standard output and execution log to Azure File Share
    std_out_err_path_prefix='$AZ_BATCHAI_MOUNT_ROOT/{0}'.format(
        relative_mount_point),
    # Configure location of the training script and MNIST dataset
    input_directories=[models.InputDirectory(
        id='SAMPLE',
        path='$AZ_BATCHAI_MOUNT_ROOT/{0}/{1}'.format(
            relative_mount_point, mnist_dataset_directory))],
    # Specify location where generated model will be stored
    output_directories=[models.OutputDirectory(
        id='MODEL',
        path_prefix='$AZ_BATCHAI_MOUNT_ROOT/{0}'.format(relative_mount_point),
        path_suffix="Models")],
    # Container configuration
    container_settings=models.ContainerSettings(
        image_source_registry=models.ImageSourceRegistry(
            image='microsoft/cntk:2.1-gpu-python3.5-cuda8.0-cudnn6.0')),
    # Toolkit specific settings
    cntk_settings=models.CNTKsettings(
        python_script_file_path='$AZ_BATCHAI_INPUT_SAMPLE/ConvNet_MNIST.py',
        command_line_args='$AZ_BATCHAI_INPUT_SAMPLE $AZ_BATCHAI_OUTPUT_MODEL')
)

# Create the job
batchai_client.jobs.create(resource_group_name, workspace_name, experiment_name, job_name, parameters).result()
```

## Monitor job

You can inspect the job’s state using the following code:

```Python
job = batchai_client.jobs.get(resource_group_name, workspace_name, experiment_name, job_name)

print('Job state: {0} '.format(job.execution_state))
```

Output is similar to: `Job state: running`.

The `executionState` contains the current execution state of the job:
* `queued`: the job is waiting for the cluster nodes to become available
* `running`: the job is running
* `succeeded` (or `failed`): the job is completed and `executionInfo` contains details about the result

## List stdout and stderr output

Use the following code to list generated stdout, stderr, and log files:

```Python
files = batchai_client.jobs.list_output_files(
    resource_group_name, workspace_name, experiment_name, job_name,
    models.JobsListOutputFilesOptions(outputdirectoryid="stdouterr"))

for file in (f for f in files if f.download_url):
    print('file: {0}, download url: {1}'.format(file.name, file.download_url))
```

## List generated model files
Use the following code to list generated model files:
```Python
files = batchai_client.jobs.list_output_files(
    resource_group_name, workspace_name, experiment_name,job_name,
    models.JobsListOutputFilesOptions(outputdirectoryid="MODEL"))

for file in (f for f in files if f.download_url):
    print('file: {0}, download url: {1}'.format(file.name, file.download_url))
```

## Delete resources

Use the following code to delete the job:
```Python
batchai_client.jobs.delete(resource_group_name, workspace_name, experiment_name, job_name)
```

Use the following code to delete the cluster:
```Python
batchai_client.clusters.delete(resource_group_name, workspace_name, cluster_name)
```

Use the following code to delete all allocated resources:
```Python
resource_management_client.resource_groups.delete('myresourcegroup')
```
## Next steps

To learn more about using Batch AI with different frameworks, see the [training recipes](https://github.com/Azure/BatchAI).