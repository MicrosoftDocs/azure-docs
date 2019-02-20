---
title: What's happening to Azure Batch AI? | Microsoft Docs
description: Learn about what's happening to Azure Batch AI and the Azure Machine Learning service compute option.
services: batch-ai
author: garyericson

ms.service: batch-ai
ms.topic: overview
ms.date: 2/14/2019
ms.author: garye
---

# What's happening to Azure Batch AI?

**The Azure Batch AI service is retiring in March.** The at-scale training and scoring capabilities of Batch AI are now available in [Azure Machine Learning service](../machine-learning/service/overview-what-is-azure-ml.md), which became generally available on December 4, 2018.

Along with many other machine learning capabilities, the Azure Machine Learning service includes a cloud-based managed compute target for training, deploying, and scoring machine learning models. This compute target is called [Azure Machine Learning Compute](../machine-learning/service/how-to-set-up-training-targets.md#amlcompute). [Start migrating and using it today](#migrate). You can interact with the Azure Machine Learning service through its [Python SDKs](../machine-learning/service/quickstart-create-workspace-with-python.md), command-line interface, and the [Azure portal](../machine-learning/service/quickstart-get-started.md).

## Support timeline

| Date | Batch AI service support details |
| ---- |-----------------|
| December&nbsp;14&#x2c;&nbsp;2018| You can use your existing Azure Batch AI subscriptions as before. However, no **new subscriptions** are possible and no new investments are being made.|
| March&nbsp;31&#x2c;&nbsp;2019 | After this date, existing Batch AI subscriptions will no longer work. |

## How does Azure Machine Learning service compare?
It is a cloud service that you use to train, deploy, automate, and manage machine learning models, all at the broad scale that the cloud provides. Get a high-level understanding of the [Azure Machine Learning service in this overview](../machine-learning/service/overview-what-is-azure-ml.md).
 

A typical model development lifecycle involves Data Preparation, Training & Experimentation and a Deployment phase. This end to end cycle can be orchestrated by using Machine Learning pipelines.

![Flow diagram](./media/overview-what-happened-batch-ai/lifecycle.png)


[Learn more about how the service works and its main concepts](../machine-learning/service/concept-azure-machine-learning-architecture.md). Many of the concepts in the model training workflow are similar to existing concepts in Batch AI. 

Specifically, here is a mapping of how you should think about them:
 
|Batch AI service|	Azure Machine Learning service|
|:--:|:---:|
|Workspace|Workspace|
|Cluster|	Compute of type `AmlCompute`|
|File servers|DataStores|
|Experiments|Experiments|
|Jobs|Runs (allows nested runs)|
 
Here is another view of the same table that will help you visualize things further:
 
**Batch AI hierarchy**
![Flow diagram](./media/overview-what-happened-batch-ai/batchai-heirarchy.png) 
 
**Azure Machine Learning service hierarchy**
![Flow diagram](./media/overview-what-happened-batch-ai/azure-machine-learning-service-heirarchy.png) 

### Platform capabilities
Azure Machine Learning service brings a great set of new functionalities including an end to end training->deployment stack that you can use for your AI development without having to manage any Azure resources. This table compares feature support for training between the two services.

|Feature|BatchAI service|Azure Machine Learning service|
|-------|:-------:|:-------:|
|VM size choice	|CPU/GPU	|CPU/GPU. Also supports FPGA for inferencing|
|AI ready Cluster (Drivers, Docker, etc.)|	Yes	|Yes|
|Node Prep|	Yes|	No|
|OS family Choice	|Partial	|No|
|Dedicated and LowPriority VMs	|Yes	|Yes|
|Auto-Scaling	|Yes	|Yes (by default)|
|Wait time for autoscaling	|No	|Yes|
|SSH	|Yes|	Yes|
|Cluster level Mounting	|Yes (FileShares, Blobs, NFS, Custom)	|Yes (mount or download your datastore)|
|Distributed Training|	Yes	|Yes|
|Job Execution Mode|	VM or Container|	Container|
|Custom Container Image|	Yes	|Yes|
|Any Toolkit	|Yes	|Yes (Run Python Script)|
|JobPreparation|	Yes	|Not yet|
|Job level mounting	|Yes (FileShares, Blobs, NFS, Custom)	|Yes (FileShares, Blobs)|
|Job Monitoring 	|via GetJob|	via Run History (Richer information, Custom runtime to push more metrics)|
|Retrieve Job Logs and Files/Models |	via ListFiles and Storage APIs	|via Artifact service|
 |Support for Tensorboard	|No|	Yes|
|VM family level quotas	|Yes	|Yes (with your previous capacity carried forward)|
 
In addition to the preceding table, there are features in the Azure Machine Learning service that were traditionally not supported in BatchAI.

|Feature|BatchAI service|Azure Machine Learning service|
|-------|:-------:|:-------:|
|Environment Preparation	|No	|Yes (Conda Prepare and upload to ACR)|
|HyperParameter Tuning	|No|	Yes|
|Model management	|No	|Yes|
|Operationalization/Deployment|	No	|Via AKS and ACI|
|Data Preparation	|No	|Yes|
|Compute Targets	|Azure VMs	|Local, BatchAI (as AmlCompute), DataBricks, HDInsight|
|Automated Machine Learning	|No|	Yes|
|Pipelines	|No	|Yes|
|Batch Scoring	|Yes	|Yes|
|Portal/CLI support|	Yes	|Yes|


### Programming interfaces

This table presents the various programming interfaces available for each service.
	
|Feature|BatchAI service|Azure Machine Learning service|
|-------|:-------:|:-------:|
|SDK	|Java, C#, Python, Nodejs	|Python (both run config based and estimator based for common frameworks)|
|CLI	|Yes	|Not yet|
|Azure portal	|Yes	|Yes (except job submission)|
|REST API	|Yes	|Yes but distributed across microservices|




## Why migrate?

Upgrading from the Preview BatchAI service to the GA'ed Azure Machine Learning service gives you a better experience through concepts that are easier to use such as Estimators and Datastores. It also guarantees GA level Azure service SLAs and customer support.

Azure Machine Learning service also brings in new functionality such as Automated ML, Hyperparameter Tuning, and ML Pipelines, which are useful in most large-scale AI workloads. The ability to operationalize a trained model without switching to a separate service helps complete the data science loop from data preparation (using the Data Prep SDK) all the way to operationalization and model monitoring.

<a name="migrate"></a>

## How do I migrate?

Before you follow the steps in this migration guide that help map commands between the two services, we recommend that you spend some time getting familiar with the Azure Machine Learning service through its [documentation](../machine-learning/service/overview-what-is-azure-ml.md) including the [tutorial in Python](../machine-learning/service/tutorial-train-models-with-aml.md).

To avoid disruptions to your applications and to benefit from the latest features, take the following steps before March 31, 2019:

1. Create an Azure Machine Learning service workspace and get started:
    + [Python based quickstart](../machine-learning/service/quickstart-create-workspace-with-python.md)
    + [Azure portal based quickstart](../machine-learning/service/quickstart-get-started.md)

1. Set up an [Azure Machine Learning Compute](../machine-learning/service/how-to-set-up-training-targets.md#amlcompute) for model training.

1. Update your scripts to use the Azure Machine Learning Compute.


### SDK migration

Current SDK support in Azure Machine Learning service is through several Python SDKs. The main SDK gets updated roughly every two weeks and can be installed from PyPi using the following command:

```python
pip install --upgrade azureml-sdk[notebooks]
```

Set up your environment and install the SDK using these [quickstart instructions](../machine-learning/service/quickstart-create-workspace-with-python.md#install-the-sdk)

Once you open a jupyter notebook with the kernel pointing to the relevant conda environment, here is how the commands in the two services map:


#### Create a workspace
The concept of initializing a workspace using a configuration.json in BatchAI maps similarly to using a config file in Azure ML.

For **Batch AI**, you did it this way:

```python
sys.path.append('../../..')
import utilities as utils

cfg = utils.config.Configuration('../../configuration.json')
client = utils.config.create_batchai_client(cfg)

utils.config.create_resource_group(cfg)
_ = client.workspaces.create(cfg.resource_group, cfg.workspace, cfg.location).result()
```

**Azure Machine Learning service**, try:

```python
from azureml.core.workspace import Workspace

ws = Workspace.from_config()
print('Workspace name: ' + ws.name, 
      'Azure region: ' + ws.location, 
      'Subscription id: ' + ws.subscription_id, 
      'Resource group: ' + ws.resource_group, sep = '\n')
```

In addition, you can also create a Workspace directly by specifying the configuration parameters like

```python
from azureml.core import Workspace
# Create the workspace using the specified parameters
ws = Workspace.create(name = workspace_name,
                      subscription_id = subscription_id,
                      resource_group = resource_group, 
                      location = workspace_region,
                      create_resource_group = True,
                      exist_ok = True)
ws.get_details()

# write the details of the workspace to a configuration file to the notebook library
ws.write_config()
```

Learn more about the AML Workspace class in the [SDK reference documentation](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py).


#### Create a compute cluster
Azure Machine Learning supports multiple compute targets, some of which are managed by the service and others that can be attached to your workspace (eg. An HDInsight cluster or a remote VM. Read more about various [compute targets](../machine-learning/service/how-to-set-up-training-targets.md). The concept of creating a BatchAI compute cluster maps to creating an AmlCompute cluster in Azure ML. The Amlcompute creation takes in a compute configuration similar to how you pass parameters in BatchAI. One thing to note is that autoscaling is on by default on your AmlCompute cluster whereas it is turned off by default in BatchAI.

For **Batch AI**, you did it this way:

```python
nodes_count = 2
cluster_name = 'nc6'

parameters = models.ClusterCreateParameters(
    vm_size='STANDARD_NC6',
    scale_settings=models.ScaleSettings(
        manual=models.ManualScaleSettings(target_node_count=nodes_count)
    ),
    user_account_settings=models.UserAccountSettings(
        admin_user_name=cfg.admin,
        admin_user_password=cfg.admin_password or None,
        admin_user_ssh_public_key=cfg.admin_ssh_key or None,
    )
)
_ = client.clusters.create(cfg.resource_group, cfg.workspace, cluster_name, parameters).result()
```

For **Azure Machine Learning service**, try:

```python
from azureml.core.compute import ComputeTarget, AmlCompute
from azureml.core.compute_target import ComputeTargetException

# Choose a name for your CPU cluster
gpu_cluster_name = "nc6"

# Verify that cluster does not exist already
try:
    gpu_cluster = ComputeTarget(workspace=ws, name=gpu_cluster_name)
    print('Found existing cluster, use it.')
except ComputeTargetException:
    compute_config = AmlCompute.provisioning_configuration(vm_size='STANDARD_NC6',
                                                           vm_priority='lowpriority',
                                                           min_nodes=1,
                                                           max_nodes=2,
                                                           idle_seconds_before_scaledown='300',
                                                           vnet_resourcegroup_name='<my-resource-group>',
                                                           vnet_name='<my-vnet-name>',
                                                           subnet_name='<my-subnet-name>')
    gpu_cluster = ComputeTarget.create(ws, gpu_cluster_name, compute_config)

gpu_cluster.wait_for_completion(show_output=True)
```

Learn more about the AMLCompute class in the [SDK reference documentation](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.amlcompute.amlcompute?view=azure-ml-py). Note that in the configuration above, only vm_size and max_nodes are mandatory, and the rest of the properties like VNets are for advanced cluster setup only.


#### Monitoring status of your cluster
This is more straightforward in Azure ML as you will see below.

For **Batch AI**, you did it this way:

```python
cluster = client.clusters.get(cfg.resource_group, cfg.workspace, cluster_name)
utils.cluster.print_cluster_status(cluster)
```

For **Azure Machine Learning service**, try:

```python
gpu_cluster.get_status().serialize()
```

#### Getting reference to a Storage account
The concept of a data storage like blob, gets simplified in Azure ML using the DataStore object. By default your Azure ML workspace creates a storage account, but you can attach your own storage also as part of workspace creation. 

For **Batch AI**, you did it this way:

```python
azure_blob_container_name = 'batchaisample'
blob_service = BlockBlobService(cfg.storage_account_name, cfg.storage_account_key)
blob_service.create_container(azure_blob_container_name, fail_on_exist=False)
```

For **Azure Machine Learning service**, try:

```python
ds = ws.get_default_datastore()
print(ds.datastore_type, ds.account_name, ds.container_name)
```

Learn more about registering additional storage accounts, or getting a reference to another registered datastore in the [Azure ML service documentation](../machine-learning/service/how-to-access-data.md#create-a-datastore).


#### Downloading and uploading data 
With either service, you can upload the data into the storage account easily using the datastore reference from above. For BatchAI, we also deploy the training script as part of the fileshare, although you will see how you can specify it as part of your job configuration in the case of Azure ML.

For **Batch AI**, you did it this way:

```python
mnist_dataset_directory = 'mnist_dataset'
utils.dataset.download_and_upload_mnist_dataset_to_blob(
    blob_service, azure_blob_container_name, mnist_dataset_directory)

script_directory = 'tensorflow_samples'
script_to_deploy = 'mnist_replica.py'

blob_service.create_blob_from_path(azure_blob_container_name,
                                   script_directory + '/' + script_to_deploy, 
                                   script_to_deploy)
```


For **Azure Machine Learning service**, try:

```python
import os
import urllib
os.makedirs('./data', exist_ok=True)
download_url = 'https://s3.amazonaws.com/img-datasets/mnist.npz'
urllib.request.urlretrieve(download_url, filename='data/mnist.npz')

ds.upload(src_dir='data', target_path='mnist_dataset', overwrite=True, show_progress=True)

path_on_datastore = ' mnist_dataset/mnist.npz' ds_data = ds.path(path_on_datastore) print(ds_data)
```

#### Create an experiment
As mentioned above Azure ML has a concept of an experiment similar to BatchAI. Each experiment can then have individual runs, similar to how we have jobs in BatchAI. Azure ML also allows you to have hierarchy under each parent run, for individual child runs.

For **Batch AI**, you did it this way:

```python
experiment_name = 'tensorflow_experiment'
experiment = client.experiments.create(cfg.resource_group, cfg.workspace, experiment_name).result()
```

For **Azure Machine Learning service**, try:

```python
from azureml.core import Experiment

experiment_name = 'tensorflow_experiment'
experiment = Experiment(ws, name=experiment_name)
```


#### Submit a job
Once you create an experiment, you have a few different ways of submitting a run. In this example, we are trying to create a deep learning model using TensorFlow and will use an Azure ML Estimator to do that. An [Estimator](../machine-learning/service/how-to-train-ml-models.md) is simply a wrapper function on the underlying run configuration, which makes it easier to submit runs, and is currently supported for Pytorch and TensorFlow only. Through the concept of datastores, you will also see how easy it becomes to specify the mount paths 

For **Batch AI**, you did it this way:

```python
azure_file_share = 'afs'
azure_blob = 'bfs'
args_fmt = '--job_name={0} --num_gpus=1 --train_steps 10000 --checkpoint_dir=$AZ_BATCHAI_OUTPUT_MODEL --log_dir=$AZ_BATCHAI_OUTPUT_TENSORBOARD --data_dir=$AZ_BATCHAI_INPUT_DATASET --ps_hosts=$AZ_BATCHAI_PS_HOSTS --worker_hosts=$AZ_BATCHAI_WORKER_HOSTS --task_index=$AZ_BATCHAI_TASK_INDEX'

parameters = models.JobCreateParameters(
     cluster=models.ResourceId(id=cluster.id),
     node_count=2,
     input_directories=[
        models.InputDirectory(
            id='SCRIPT',
            path='$AZ_BATCHAI_JOB_MOUNT_ROOT/{0}/{1}'.format(azure_blob, script_directory)),
        models.InputDirectory(
            id='DATASET',
            path='$AZ_BATCHAI_JOB_MOUNT_ROOT/{0}/{1}'.format(azure_blob, mnist_dataset_directory))],
     std_out_err_path_prefix='$AZ_BATCHAI_JOB_MOUNT_ROOT/{0}'.format(azure_file_share),
     output_directories=[
        models.OutputDirectory(
            id='MODEL',
            path_prefix='$AZ_BATCHAI_JOB_MOUNT_ROOT/{0}'.format(azure_file_share),
            path_suffix='Models'),
        models.OutputDirectory(
            id='TENSORBOARD',
            path_prefix='$AZ_BATCHAI_JOB_MOUNT_ROOT/{0}'.format(azure_file_share),
            path_suffix='Logs')
     ],
     mount_volumes=models.MountVolumes(
            azure_file_shares=[
                models.AzureFileShareReference(
                    account_name=cfg.storage_account_name,
                    credentials=models.AzureStorageCredentialsInfo(
                        account_key=cfg.storage_account_key),
                    azure_file_url='https://{0}.file.core.windows.net/{1}'.format(
                        cfg.storage_account_name, azure_file_share_name),
                    relative_mount_path=azure_file_share)
            ],
            azure_blob_file_systems=[
                models.AzureBlobFileSystemReference(
                    account_name=cfg.storage_account_name,
                    credentials=models.AzureStorageCredentialsInfo(
                        account_key=cfg.storage_account_key),
                    container_name=azure_blob_container_name,
                    relative_mount_path=azure_blob)
            ]
        ),
     container_settings=models.ContainerSettings(
         image_source_registry=models.ImageSourceRegistry(image='tensorflow/tensorflow:1.8.0-gpu')),
     tensor_flow_settings=models.TensorFlowSettings(
         parameter_server_count=1,
         worker_count=nodes_count,
         python_script_file_path='$AZ_BATCHAI_INPUT_SCRIPT/'+ script_to_deploy,
         master_command_line_args=args_fmt.format('worker'),
         worker_command_line_args=args_fmt.format('worker'),
         parameter_server_command_line_args=args_fmt.format('ps'),
     )
)
```

Submitting the job itself in BatchAI is through the create function.

```python
job_name = datetime.utcnow().strftime('tf_%m_%d_%Y_%H%M%S')
job = client.jobs.create(cfg.resource_group, cfg.workspace, experiment_name, job_name, parameters).result()
print('Created Job {0} in Experiment {1}'.format(job.name, experiment.name))
```

The full information for this training code snippet (including the mnist_replica.py file that we had uploaded to the file share above) can be found in the [BatchAI sample notebook github repo](https://github.com/Azure/BatchAI/tree/2238607d5a028a0c5e037168aefca7d7bb165d5c/recipes/TensorFlow/TensorFlow-GPU-Distributed).

For **Azure Machine Learning service**, try:

```python
from azureml.train.dnn import TensorFlow

script_params={
    '--num_gpus': 1,
    '--train_steps': 500,
    '--input_data': ds_data.as_mount()

}

estimator = TensorFlow(source_directory=project_folder,
                       compute_target=gpu_cluster,
                       script_params=script_params,
                       entry_script='tf_mnist_replica.py',
                       node_count=2,
                       worker_count=2,
                       parameter_server_count=1,   
                       distributed_backend='ps',
                       use_gpu=True)
```

The full information for this training code snippet (including the tf_mnist_replica.py file) can be found in the [Azure ML sample notebook github repo](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training-with-deep-learning/distributed-tensorflow-with-parameter-server). The datastore itself can either be mounted on the individual nodes, or the training data can be downloaded on the node itself. More details on referencing the datastore in your estimator is in the [Azure ML service documentation](../machine-learning/service/how-to-access-data.md#access-datastores-for-training). 

Submitting a run in Azure ML is through the submit function.

```python
run = experiment.submit(estimator)
print(run)
```

There is another way of specifying parameters for your run, using a run config – especially useful for defining a custom training environment. You can find more details in this [sample AmlCompute notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training/train-on-amlcompute/train-on-amlcompute.ipynb). 

#### Monitor your run
Once you submit a run, you can either wait for it to complete or monitor it in Azure ML using neat Jupyter widgets that you can invoke directly from your code. You can also pull context of any previous run by looping through the various experiments in a workspace, and the individual runs within each experiment.

For **Batch AI**, you did it this way:

```python
utils.job.wait_for_job_completion(client, cfg.resource_group, cfg.workspace, 
                                  experiment_name, job_name, cluster_name, 'stdouterr', 'stdout-wk-0.txt')

files = client.jobs.list_output_files(cfg.resource_group, cfg.workspace, experiment_name, job_name,
                                      models.JobsListOutputFilesOptions(outputdirectoryid='stdouterr')) 
for f in list(files):
    print(f.name, f.download_url or 'directory')
```


For **Azure Machine Learning service**, try:

```python
run.wait_for_completion(show_output=True)

from azureml.widgets import RunDetails
RunDetails(run).show()
```

Here is a snapshot of how the widget would load in your notebook for looking at your logs real time:
![Widget monitoring diagram](./media/overview-what-happened-batch-ai/monitor.png)



#### Editing a cluster
Deleting a cluster is straightforward. In addition, Azure ML also allows you to update a cluster from within the notebook in case you want to scale it to a higher number of nodes or increase the idle wait time before scaling down the cluster. We don’t allow you to change the VM size of the cluster itself, since it requires a new deployment effectively in the backend.

For **Batch AI**, you did it this way:
```python
_ = client.clusters.delete(cfg.resource_group, cfg.workspace, cluster_name)
```

For **Azure Machine Learning service**, try:

```python
gpu_cluster.delete()

gpu_cluster.update(min_nodes=2, max_nodes=4, idle_seconds_before_scaledown=600)
```

## Support

BatchAI is slated to retire on March 31 and is already blocking new subscriptions from registering against the service unless it is whitelisted by raising an exception through support.  Reach out to us at [Azure Batch AI Training Preview](mailto:AzureBatchAITrainingPreview@service.microsoft.com) with any questions or if you have feedback as you migrate to Azure Machine Learning service.

Azure Machine Learning service is a generally available service. This means that it comes with a committed SLA and various support plans to choose from.

Pricing for using Azure infrastructure  either through the BatchAI service or through the Azure Machine Learning service should not vary, as we only charge the price for the underlying compute in both cases. For more information, see the [pricing calculator](https://azure.microsoft.com/pricing/details/machine-learning-service/).

View the regional availability between the two services on the [Azure portal](https://azure.microsoft.com/global-infrastructure/services/?products=batch-ai,machine-learning-service&regions=all).


## Next steps

+ Read the [Azure Machine Learning service overview](../machine-learning/service/overview-what-is-azure-ml.md).

+ [Configure a compute target for model training](../machine-learning/service/how-to-set-up-training-targets.md) with Azure Machine Learning service.

+ Review the [Azure roadmap](https://azure.microsoft.com/updates/) to learn of other Azure service updates.
