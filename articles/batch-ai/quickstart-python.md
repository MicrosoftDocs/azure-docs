---
title: Azure Quickstart - CNTK training with Batch AI - Python | Microsoft Docs
description: Quickly learn to run a CNTK training job with Batch AI using the Python SDK
services: batch-ai
documentationcenter: na
author: lliimsft
manager: Vaman.Bedekar
editor: tysonn

ms.assetid:
ms.custom: 
ms.service: batch-ai
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: Python
ms.topic: quickstart
ms.date: 10/06/2017
ms.author: lili
---

# Run a CNTK training job using the Azure Python SDK

This quickstart details using the Azure Python SDK to run a Microsoft Cognitive Toolkit (CNTK) training job using the Batch AI service. 

In this example, you use the MNIST database of handwritten images to train a convolutional neural network (CNN) on a single-node GPU cluster. 

## Prerequisites

* Azure subscription - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

* Azure Python SDK - See [installation instructions](/python/azure/python-sdk-azure-install)

* Azure storage account - See [How to create an Azure storage account](../storage/common/storage-create-storage-account.md)

* Azure Active Directory service principal credentials - See [How to create a service principal with the CLI](../azure-resource-manager/resource-group-authenticate-service-principal-cli.md)


## Configure credentials
Create these parameters in your Python script, substituting your own values:

```Python
# credentials used for authentication
client_id = 'my_aad_client_id'
secret = 'my_aad_secret_key'
token_uri = 'my_aad_token_uri'
subscription_id = 'my_subscription_id'

# credentials used for storage
storage_account_name = 'my_storage_account_name'
storage_account_key = 'my_storage_account_key'

# specify the credentials used to remote login your GPU node
admin_user_name = 'my_admin_user_name'
admin_user_password = 'my_admin_user_password'
```

As a best practice, all credentials should be stored in a separate configuration file, which is not shown in this example. Refer to the [recipes](https://github.com/azure/BatchAI/recipes) to implement a configuration file. 

## Authenticate with Batch AI

To be able to access Azure Batch AI, you need to authenticate using Azure Active Directory. Below is code to authenticate with the service (create a `BatchAIManagementClient` object) using your service principal credentials and subscription ID:

```Python
from azure.common.credentials import ServicePrincipalCredentials
import azure.mgmt.batchai as batchai
import azure.mgmt.batchai.models as models

creds = ServicePrincipalCredentials(
		client_id=client_id, secret=secret, token_uri=token_uri)

client = batchai.BatchAIManagementClient(credentials=creds,
                                         subscription_id=subscription_id
)
```

## Create a resource group

Batch AI clusters and jobs are Azure resources and must be placed in an Azure resource group. The following snippet creates a resource group:

```Python
from azure.mgmt.resource import ResourceManagementClient

resource_group_name = 'myresourcegroup'

client = ResourceManagementClient(
        credentials=creds, subscription_id=subscription_id)

resource = client.resource_groups.create_or_update(
        resource_group_name, {'location': 'eastus'})
```


## Prepare Azure file share
For illustration purposes, this quickstart uses an Azure file share to host the training data and scripts for the learning job. 

1. Create a file share named *batchaiquickstart*.

  ```Python
  from azure.storage.file import FileService 
 
  azure_file_share_name = 'batchaiquickstart' 
 
  service = FileService(storage_account_name, storage_account_key) 
 
  service.create_share(azure_file_share_name, fail_on_exist=False)
  ``` 
 
2. Create a directory in the share named *mnistcntksample* 

  ```Python
  mnist_dataset_directory = 'mnistcntksample' 
 
  service.create_directory(azure_file_share_namem, mnist_dataset_directory, fail_on_exist=False) 
  ```
3. Download the [sample package](https://batchaisamples.blob.core.windows.net/samples/BatchAIQuickStart.zip?st=2017-09-29T18%3A29%3A00Z&se=2099-12-31T08%3A00%3A00Z&sp=rl&sv=2016-05-31&sr=b&sig=hrAZfbZC%2BQ%2FKccFQZ7OC4b%2FXSzCF5Myi4Cj%2BW3sVZDo%3D) and unzip. Upload the contents to the directory.

  ```Python
  for f in ['Train-28x28_cntk_text.txt', 'Test-28x28_cntk_text.txt', 'ConvNet_MNIST.py']:     
     service.create_file_from_path(
             azure_file_share_name, mnist_dataset_directory, f, f) 
  ```

## Create GPU cluster

Create a Batch AI cluster. In this example, the cluster consists of a single STANDARD_NC6 VM node. This VM size has one NVIDIA K80 GPU. Mount the file share at a folder named *azurefileshare*. The full path of this folder on the GPU compute node is $AZ_BATCHAI_MOUNT_ROOT/azurefileshare.

```Python
cluster_name = 'mycluster'

relative_mount_point = 'azurefileshare' 
 
parameters = models.ClusterCreateParameters(
    # Location where the cluster will physically be deployed
    location='eastus', 
 
    # VM size. Use NC or NV series for GPU
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
         azure_file_url='https://{0}.file.core.windows.net/{1}'.format(
               storage_account_name, mnist_dataset_directory),
                  relative_mount_path = relative_mount_point)],
         ), 
    ), 
) 
client.clusters.create(resource_group_name, cluster_name, parameters).result() 
```

## Get cluster status

Monitor the cluster status using the following command: 

```Python
cluster = client.clusters.get(resource_group_name, cluster_name)
print('Cluster state: {0} Target: {1}; Allocated: {2}; Idle: {3}; '
      'Unusable: {4}; Running: {5}; Preparing: {6}; leaving: {7}'.format(
    cluster.allocation_state,
    cluster.scale_settings.manual.target_node_count,
    cluster.current_node_count,
    cluster.node_state_counts.idle_node_count,
    cluster.node_state_counts.unusable_node_count,
    cluster.node_state_counts.running_node_count,
    cluster.node_state_counts.preparing_node_count,
    cluster.node_state_counts.leaving_node_count)) 
```

The preceding code prints basic cluster allocation information such as the following:

```Shell
Cluster state: AllocationState.steady Target: 1; Allocated: 1; Idle: 0; Unusable: 0; Running: 0; Preparing: 1; Leaving 0
 
```  

The cluster is ready when the nodes are allocated and finished preparation (see the `nodeStateCounts` attribute). If something went wrong, the `errors` attribute contains the error description.

## Create training job

After the cluster is ready, configure and submit the learning job. 

```Python
job_name = 'myjob' 
 
parameters = models.job_create_parameters.JobCreateParameters( 
 
     # Location where the job will run
     # Ideally this should be co-located with the cluster.
     location='eastus', 
 
     # The cluster this job will run on
     cluster=models.ResourceId(cluster.id), 
 
     # The number of VMs in the cluster to use
     node_count=1, 
 
     # Override the path where the std out and std err files will be written to.
     # In this case we will write these out to an Azure Files share
     std_out_err_path_prefix='$AZ_BATCHAI_MOUNT_ROOT/{0}'.format(relative_mount_point), 
 
     input_directories=[models.InputDirectory(
         id='SAMPLE',
         path='$AZ_BATCHAI_MOUNT_ROOT/{0}/{1}'.format(relative_mount_point, mnist_dataset_directory))], 
 
     # Specify directories where files will get written to 
     output_directories=[models.OutputDirectory(
        id='MODEL',
        path_prefix='$AZ_BATCHAI_MOUNT_ROOT/{0}'.format(relative_mount_point),
        path_suffix="Models")], 
 
     # Container configuration
     container_settings=models.ContainerSettings(
        models.ImageSourceRegistry(image='microsoft/cntk:2.1-gpu-python3.5-cuda8.0cudnn6.0')), 
 
     # Toolkit specific settings
     cntk_settings = models.CNTKsettings(
        python_script_file_path='$AZ_BATCHAI_INPUT_SAMPLE/ConvNet_MNIST.py',
        command_line_args='$AZ_BATCHAI_INPUT_SAMPLE $AZ_BATCHAI_OUTPUT_MODEL')
 ) 
 
# Create the job 
client.jobs.create(resource_group_name, job_name, parameters).result() 
```

## Monitor job
You can inspect the job’s state using the following command: 
 
```Python
job = client.jobs.get(resource_group_name, job_name) 
 
print(`Job state: {0} `.format(job.execution_state.name))
```

Output is similar to: `Job state: running`.

The `executionState` contains the current execution state of the job:
* `queued`: the job is waiting for the cluster nodes to become available
* `running`: the job is running
* `succeeded` (or `failed`) : the job is completed and `executionInfo` contains details about the result
 
## List stdout and stderr output
Use the following command to list links to the stdout and stderr log files:

```Python
files = client.jobs.list_output_files(resource_group_name, job_name, models.JobsListOutputFilesOptions("stdouterr")) 
 
for file in list(files):
     print('file: {0}, download url: {1}'.format(file.name, file.download_url)) 
```
## Delete resources

Use the following command to delete the job:
```Python
client.jobs.delete(resource_group_name, job_name) 
```

Use the following command to delete the cluster:
```Python
client.clusters.delete(resource_group_name, cluster_name)
```
## Next steps

In this quickstart, you learned how to run a CNTK training job on a Batch AI cluster, using the Azure Python SDK. To learn more about using Batch AI with different toolkits, see the [training recipes](https://github.com/Azure/BatchAI).
