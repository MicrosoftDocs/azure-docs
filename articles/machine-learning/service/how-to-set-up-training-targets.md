---
title: Set up compute targets for model training with Azure Machine Learning service | Microsoft Docs
description: Learn how to select and configure the training environments (compute targets) used to train your machine learning models. The Azure Machine Learning service lets you easily switch training environments. Start training locally, and if you need to scale out, switch to a cloud-based compute target.
services: machine-learning
author: heatherbshapiro
ms.author: hshapiro
ms.reviewer: larryfr
manager: cgronlun
ms.service: machine-learning
ms.component: core
ms.topic: article
ms.date: 12/04/2018
---
# Select and use a compute target to train your model

With the Azure Machine Learning service, you can train your model on different compute resources. These compute resources, called __compute targets__, can be local or in the cloud. In this document, you will learn about the supported compute targets and how to use them.

A compute target is a resource where your training script is run, or your model is hosted when deployed as a web service. You can create and manage a compute target using the Azure Machine Learning SDK, Azure portal, or Azure CLI. If you have compute targets that were created through another service (for example, an HDInsight cluster), you can use them by attaching them to your Azure Machine Learning service workspace.

There are three broad categories of compute targets that Azure Machine Learning supports:

* __Local__: Your local machine, or a cloud-based VM that you use as a dev/experimentation environment. 

* __Managed Compute__: Azure Machine Learning Compute is a compute offering that is managed by the Azure Machine Learning service. It allows you to easily create single- or multi-node compute for training, testing, and batch inferencing.

* __Attached Compute__: You can also bring your own Azure cloud compute and attach it to Azure Machine Learning. Read more below on supported compute types and how to use them.


## Supported compute targets

Azure Machine Learning service has varying support across the various compute targets. A typical model development lifecycle starts with dev/experimentation on a small amount of data. At this stage, we recommend using a local environment. For example, your local computer or a cloud-based VM. As you scale up your training on larger data sets, or do distributed training, we recommend using Azure Machine Learning Compute to create a single- or multi-node cluster that autoscales each time you submit a run. You can also attach your own compute resource, although support for various scenarios may vary as detailed below:

|Compute target| GPU acceleration | Automated hyperparameter tuning | Automated machine learning | Pipeline friendly|
|----|:----:|:----:|:----:|:----:|
|[Local computer](#local)| Maybe | &nbsp; | ✓ | &nbsp; |
|[Azure Machine Learning Compute](#amlcompute)| ✓ | ✓ | ✓ | ✓ |
|[Remote VM](#vm) | ✓ | ✓ | ✓ | ✓ |
|[Azure Databricks](#databricks)| &nbsp; | &nbsp; | &nbsp; | ✓[*](#pipeline-only) |
|[Azure Data Lake Analytics](#adla)| &nbsp; | &nbsp; | &nbsp; | ✓[*](#pipeline-only) |
|[Azure HDInsight](#hdinsight)| &nbsp; | &nbsp; | &nbsp; | ✓ |

> [!IMPORTANT]
> <a id="pipeline-only"></a>__*__ Azure Databricks and Azure Data Lake Analytics can __only__ be used in a pipeline. For more information on pipelines, see the [Pipelines in Azure Machine Learning](concept-ml-pipelines.md) document.

> [!IMPORTANT]
> Azure Machine Learning Compute must be created from within a workspace. You cannot attach existing instances to a workspace.
>
> Other compute targets must be created outside Azure Machine Learning and then attached to your workspace.

## Workflow

The workflow for developing and deploying a model with Azure Machine Learning follows these steps:

1. Develop machine learning training scripts in Python.
1. Create and configure or attach an existing compute target.
1. Submit the training scripts to the compute target.
1. Inspect the results to find the best model.
1. Register the model in the model registry.
1. Deploy the model.

> [!IMPORTANT]
> Your training script isn't tied to a specific compute target. You can train initially on your local computer, then switch compute targets without having to rewrite the training script.

> [!TIP]
> Whenever you associate a compute target with your workspace, either by creating managed compute or attaching existing compute, you need to provide a name to your compute. This should be between 2 and 16 characters in length.

Switching from one compute target to another involves creating a [run configuration](concept-azure-machine-learning-architecture.md#run-configuration). The run configuration defines how to run the script on the compute target.

## Training scripts

When you start a training run, a snapshot of the directory containing your training scripts is created and sent to the compute target. For more information, see [snapshots](concept-azure-machine-learning-architecture.md#snapshot).

## <a id="local"></a>Local computer

When training locally, you use the SDK to submit the training operation. You can train using a user-managed or system-managed environment.

### User-managed environment

In a user-managed environment, you are responsible for ensuring that all the necessary packages are available in the Python environment you choose to run the script in. The following code snippet is an example of configuring training for a user-managed environment:

```python
from azureml.core.runconfig import RunConfiguration

# Editing a run configuration property on-fly.
run_config_user_managed = RunConfiguration()

run_config_user_managed.environment.python.user_managed_dependencies = True

# You can choose a specific Python environment by pointing to a Python path 
#run_config.environment.python.interpreter_path = '/home/ninghai/miniconda3/envs/sdk2/bin/python'
```

For a Jupyter Notebook that demonstrates training in a user-managed environment, see [how-to-use-azureml/training/train-on-local/train-on-local.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training/train-on-local/train-on-local.ipynb).
  
### System-managed environment

System-managed environments rely on conda to manage the dependencies. Conda creates a file named `conda_dependencies.yml` that contains a list of dependencies. You can then ask the system to build a new conda environment and run your scripts in it. System-managed environments can be reused later, as long as the `conda_dependencies.yml` files remains unchanged. 

The initial setup up of a new environment can take several minutes to complete, depending on the size of the required dependencies. The following code snippet demonstrates creating a system-managed environment that depends on scikit-learn:

```python
from azureml.core.runconfig import RunConfiguration
from azureml.core.conda_dependencies import CondaDependencies

run_config_system_managed = RunConfiguration()

run_config_system_managed.environment.python.user_managed_dependencies = False
run_config_system_managed.auto_prepare_environment = True

# Specify conda dependencies with scikit-learn

run_config_system_managed.environment.python.conda_dependencies = CondaDependencies.create(conda_packages=['scikit-learn'])
```

For a Jupyter Notebook that demonstrates training in a system-managed environment, see [how-to-use-azureml/training/train-on-local/train-on-local.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training/train-on-local/train-on-local.ipynb).

## <a id="amlcompute"></a>Azure Machine Learning Compute

Azure Machine Learning Compute is a managed compute infrastructure that allows the user to easily create single- to multi-node compute. It is created __within your workspace region__ and is a resource that can be shared with other users in your workspace. It scales up automatically when a job is submitted, and can be put in an Azure Virtual Network. It executes in a __containerized environment__, packaging your model's dependencies in a Docker container.

You can use Azure Machine Learning Compute to distribute the training process across a cluster of CPU or GPU compute nodes in the cloud. For more information on the VM sizes that include GPUs, see the [GPU optimized virtual machine sizes](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-gpu) documentation.

> [!NOTE]
> Azure Machine Learning Compute has default limits on things like the number of cores that can be allocated. For more information, see the [Manage and request quotas for Azure resources](https://docs.microsoft.com/azure/machine-learning/service/how-to-manage-quotas) document.

You can create Azure Machine Learning Compute on-demand when you schedule a run, or as a persistent resource.

### Run-based creation

You can create Azure Machine Learning Compute as a compute target at run-time. In this case, the compute is automatically created for your run, scales up to max_nodes that you specify in your run config, and is then __deleted automatically__ after the run completes.

This functionality is currently in Preview state, and will not work with Hyperparameter Tuning or Automated Machine Learning jobs.

```python
from azureml.core.compute import ComputeTarget, AmlCompute

#Let us first list the supported VM families for Azure Machine Learning Compute
AmlCompute.supported_vmsizes()

from azureml.core.runconfig import RunConfiguration

# create a new runconfig object
run_config = RunConfiguration()

# signal that you want to use AmlCompute to execute script.
run_config.target = "amlcompute"

# AmlCompute will be created in the same region as workspace. Set vm size for AmlCompute from the list returned above
run_config.amlcompute.vm_size = 'STANDARD_D2_V2'

```

### Persistent compute (Basic)

A persistent Azure Machine Learning Compute can be reused across multiple jobs. It can be shared with other users in the workspace, and is kept between jobs.

To create a persistent Azure Machine Learning Compute resource, you specify the `vm_size` and `max_nodes` parameters. Azure Machine Learning then uses smart defaults for the rest of the parameters.  For example, the compute is set to autoscale down to zero nodes when not used and to create dedicated VMs to run your jobs as needed. 

* **vm_size**: VM family of the nodes created by Azure Machine Learning Compute.
* **max_nodes**: Maximum nodes to autoscale to while running a job on Azure Machine Learning Compute.

```python
from azureml.core.compute import ComputeTarget, AmlCompute
from azureml.core.compute_target import ComputeTargetException

# Choose a name for your CPU cluster
cpu_cluster_name = "cpucluster"

# Verify that cluster does not exist already
try:
    cpu_cluster = ComputeTarget(workspace=ws, name=cpu_cluster_name)
    print('Found existing cluster, use it.')
except ComputeTargetException:
    compute_config = AmlCompute.provisioning_configuration(vm_size='STANDARD_D2_V2',
                                                           max_nodes=4)
    cpu_cluster = ComputeTarget.create(ws, cpu_cluster_name, compute_config)

cpu_cluster.wait_for_completion(show_output=True)

```

### Persistent compute (Advanced)

You can also configure several advanced properties when creating Azure Machine Learning Compute.  These properties allow you to create a persistent cluster of fixed size, or within an existing Azure Virtual Network in your subscription.

In addition to `vm_size` and `max_nodes`, you can use the following properties:

* **min_nodes**: Minimum nodes (default 0 nodes) to downscale to while running a job on Azure Machine Learning Compute.
* **vm_priority**: Choose between 'dedicated' (default) and 'lowpriority' VMs when creating Azure Machine Learning Compute. Low Priority VMs use Azure's excess capacity and are thus cheaper but risk your run being pre-empted.
* **idle_seconds_before_scaledown**: Idle time (default 120 seconds) to wait after run completion before autoscaling to min_nodes.
* **vnet_resourcegroup_name**: Resource group of the __existing__ virtual network. Azure Machine Learning Compute is created within this virtual network.
* **vnet_name**: Name of virtual network. The virtual network must be in the same region as your Azure Machine Learning workspace.
* **subnet_name**: Name of subnet within the virtual network. Azure Machine Learning Compute resources will be assigned IP addresses from this subnet range.

> [!TIP]
> When you create a persistent Azure Machine Learning Compute resource you also have the ability to update its properties such as the min_nodes or the max_nodes. Simply call the `update()` function for it.

```python
from azureml.core.compute import ComputeTarget, AmlCompute
from azureml.core.compute_target import ComputeTargetException

# Choose a name for your CPU cluster
cpu_cluster_name = "cpucluster"

# Verify that cluster does not exist already
try:
    cpu_cluster = ComputeTarget(workspace=ws, name=cpu_cluster_name)
    print('Found existing cluster, use it.')
except ComputeTargetException:
    compute_config = AmlCompute.provisioning_configuration(vm_size='STANDARD_D2_V2',
                                                           vm_priority='lowpriority',
                                                           min_nodes=2,
                                                           max_nodes=4,
                                                           idle_seconds_before_scaledown='300',
                                                           vnet_resourcegroup_name='<my-resource-group>',
                                                           vnet_name='<my-vnet-name>',
                                                           subnet_name='<my-subnet-name>')
    cpu_cluster = ComputeTarget.create(ws, cpu_cluster_name, compute_config)

cpu_cluster.wait_for_completion(show_output=True)

```

For a Jupyter Notebook that demonstrates training on Azure Machine Learning Compute, see [how-to-use-azureml/training/train-on-amlcompute/train-on-amlcompute.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training/train-on-amlcompute/train-on-amlcompute.ipynb).

## <a id="vm"></a>Remote Azure VM

Azure Machine Learning also supports bringing your own compute resource and attaching it to your workspace. One such resource type is an arbitrary remote VM as long as it is accessible from Azure Machine Learning service. Specifically, given the IP address and credentials (username/password or SSH key), you can use any accessible VM for remote runs. You can use a system-built conda environment, an already existing Python environment, or a Docker container. Execution using Docker container requires that you have Docker Engine running on the VM. This functionality is especially useful when you want a more flexible, cloud-based dev/experimentation environment than your local machine.

> [!TIP]
> We recommended using the Data Science Virtual Machine as the Azure VM of choice for this scenario. It is a pre-configured data science and AI development environment in Azure with a curated choice of tools and frameworks for full lifecycle of ML development. For more information on using the Data Science Virtual Machine with Azure Machine Learning, see the [Configure a development environment](https://docs.microsoft.com/azure/machine-learning/service/how-to-configure-environment#dsvm) document.

> [!WARNING]
> Azure Machine Learning only supports virtual machines running Ubuntu. When creating a virtual machine or selecting an existing one, you must select one that uses Ubuntu.

The following steps use the SDK to configure a Data Science Virtual Machine (DSVM) as a training target:

1. To attach an existing virtual machine as a compute target, you must provide the fully qualified domain name, login name, and password for the virtual machine.  In the example, replace ```<fqdn>``` with public fully qualified domain name of the VM, or the public IP address. Replace ```<username>``` and ```<password>``` with the SSH user and password for the VM:

    ```python
    from azureml.core.compute import RemoteCompute

    dsvm_compute = RemoteCompute.attach(ws,
                                    name="attach-dsvm",
                                    username='<username>',
                                    address="<fqdn>",
                                    ssh_port=22,
                                    password="<password>")

    dsvm_compute.wait_for_completion(show_output=True)

1. Create a configuration for the DSVM compute target. Docker and conda are used to create and configure the training environment on DSVM:

    ```python
    from azureml.core.runconfig import RunConfiguration
    from azureml.core.conda_dependencies import CondaDependencies

    # Load the "cpu-dsvm.runconfig" file (created by the above attach operation) in memory
    run_config = RunConfiguration(framework = "python")

    # Set compute target to the Linux DSVM
    run_config.target = compute_target_name

    # Use Docker in the remote VM
    run_config.environment.docker.enabled = True

    # Use CPU base image
    # If you want to use GPU in DSVM, you must also use GPU base Docker image azureml.core.runconfig.DEFAULT_GPU_IMAGE
    run_config.environment.docker.base_image = azureml.core.runconfig.DEFAULT_CPU_IMAGE
    print('Base Docker image is:', run_config.environment.docker.base_image)

    # Ask system to provision a new one based on the conda_dependencies.yml file
    run_config.environment.python.user_managed_dependencies = False

    # Prepare the Docker and conda environment automatically when used the first time.
    run_config.prepare_environment = True

    # specify CondaDependencies obj
    run_config.environment.python.conda_dependencies = CondaDependencies.create(conda_packages=['scikit-learn'])

    ```

For a Jupyter Notebook that demonstrates training on a Remote VM, see [/how-to-use-azureml/training/train-on-remote-vm/train-on-remote-vm.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training/train-on-remote-vm/train-on-remote-vm.ipynb).

## <a id="databricks"></a>Azure Databricks

Azure Databricks is an Apache Spark-based environment in the Azure cloud. It can be used as a compute target when training models with an Azure Machine Learning pipeline.

> [!IMPORTANT]
> An Azure Databricks compute target can only be used in a Machine Learning pipeline.
>
> You must create an Azure Databricks workspace before using it to train your model. To create these resource, see the [Run a Spark job on Azure Databricks](https://docs.microsoft.com/azure/azure-databricks/quickstart-create-databricks-workspace-portal) document.

To attach Azure Databricks as a compute target, you must use the Azure Machine Learning SDK and provide the following information:

* __Compute name__: The name you want to assign to this compute resource.
* __Resource ID__: The resource ID of the Azure Databricks workspace. The following text is an example of the format for this value:

    ```text
    /subscriptions/<your_subscription>/resourceGroups/<resource-group-name>/providers/Microsoft.Databricks/workspaces/<databricks-workspace-name>
    ```

    > [!TIP]
    > To get the resource ID, use the following Azure CLI command. Replace `<databricks-ws>` with the name of your Databricks workspace:
    > ```azurecli-interactive
    > az resource list --name <databricks-ws> --query [].id
    > ```

* __Access token__: The access token used to authenticate to Azure Databricks. To generate an access token, see the [Authentication](https://docs.azuredatabricks.net/api/latest/authentication.html) document.

The following code demonstrates how to attach Azure Databricks as a compute target:

```python
databricks_compute_name = os.environ.get("AML_DATABRICKS_COMPUTE_NAME", "<databricks_compute_name>")
databricks_resource_id = os.environ.get("AML_DATABRICKS_RESOURCE_ID", "<databricks_resource_id>")
databricks_access_token = os.environ.get("AML_DATABRICKS_ACCESS_TOKEN", "<databricks_access_token>")

try:
    databricks_compute = ComputeTarget(workspace=ws, name=databricks_compute_name)
    print('Compute target already exists')
except ComputeTargetException:
    print('compute not found')
    print('databricks_compute_name {}'.format(databricks_compute_name))
    print('databricks_resource_id {}'.format(databricks_resource_id))
    print('databricks_access_token {}'.format(databricks_access_token))
    databricks_compute = DatabricksCompute.attach(
             workspace=ws,
             name=databricks_compute_name,
             resource_id=databricks_resource_id,
             access_token=databricks_access_token
         )
    
    databricks_compute.wait_for_completion(True)
```

## <a id="adla"></a>Azure Data Lake Analytics

Azure Data Lake Analytics is a big data analytics platform in the Azure cloud. It can be used as a compute target when training models with an Azure Machine Learning pipeline.

> [!IMPORTANT]
> An Azure Data Lake Analytics compute target can only be used in a Machine Learning pipeline.
>
> You must create an Azure Data Lake Analytics account before using it to train your model. To create this resource, see the [Get started with Azure Data Lake Analytics](https://docs.microsoft.com/azure/data-lake-analytics/data-lake-analytics-get-started-portal) document.

To attach Data Lake Analytics as a compute target, you must use the Azure Machine Learning SDK and provide the following information:

* __Compute name__: The name you want to assign to this compute resource.
* __Resource ID__: The resource ID of the Data Lake Analytics account. The following text is an example of the format for this value:

    ```text
    /subscriptions/<your_subscription>/resourceGroups/<resource-group-name>/providers/Microsoft.DataLakeAnalytics/accounts/<datalakeanalytics-name>
    ```

    > [!TIP]
    > To get the resource ID, use the following Azure CLI command. Replace `<datalakeanalytics>` with the name of your Data Lake Analytics account name:
    > ```azurecli-interactive
    > az resource list --name <datalakeanalytics> --query [].id
    > ```

The following code demonstrates how to attach Data Lake Analytics as a compute target:

```python
adla_compute_name = os.environ.get("AML_ADLA_COMPUTE_NAME", "<adla_compute_name>")
adla_resource_id = os.environ.get("AML_ADLA_RESOURCE_ID", "<adla_resource_id>")

try:
    adla_compute = ComputeTarget(workspace=ws, name=adla_compute_name)
    print('Compute target already exists')
except ComputeTargetException:
    print('compute not found')
    print('adla_compute_name {}'.format(adla_compute_name))
    print('adla_resource_id {}'.format(adla_resource_id))
    adla_compute = AdlaCompute.attach(
             workspace=ws,
             name=adla_compute_name,
             resource_id=adla_resource_id
         )
    
    adla_compute.wait_for_completion(True)
```

> [!TIP]
> Azure Machine Learning pipelines can only work with data stored in the default data store of the Data Lake Analytics account. If the data you need to work with is in a non-default store, you can use a [`DataTransferStep`](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.data_transfer_step.datatransferstep?view=azure-ml-py) to copy the data before training.

## <a id="hdinsight"></a>Azure HDInsight 

HDInsight is a popular platform for big-data analytics. It provides Apache Spark, which can be used to train your model.

> [!IMPORTANT]
> You must create the HDInsight cluster before using it to train your model. To create a Spark on HDInsight cluster, see the [Create a Spark Cluster in HDInsight](https://docs.microsoft.com/azure/hdinsight/spark/apache-spark-jupyter-spark-sql) document.
>
> When creating the cluster, you must specify an SSH user name and password. Note these values, as you need them when using HDInsight as a compute target.
>
> Once the cluster has been created, it has a fully qualified domain name (FQDN) of `<clustername>.azurehdinsight.net`, where `<clustername>` is the name you provided for the cluster. You need this address (or the public IP address of the cluster) to use it as a compute target

To configure HDInsight as a compute target, you must provide the fully qualified domain name, cluster login name, and password for the HDInsight cluster. The following example uses the SDK to attach a cluster to your workspace. In the example, replace `<fqdn>` with the public fully qualified domain name of the cluster, or the public IP address. Replace `<username>` and `<password>` with the SSH user and password for the cluster:

> [!NOTE]
> To find the FQDN for your cluster, visit the Azure portal and select your HDInsight cluster. From the __Overview__ section, the FQDN is part of the __URL__ entry. Just remove the `https://` from the beginning of the value.
>
> ![Screenshot of the HDInsight cluster overview with the URL entry highlighted](./media/how-to-set-up-training-targets/hdinsight-overview.png)

```python
from azureml.core.compute import HDInsightCompute

try:
    # Attaches a HDInsight cluster as a compute target.
    HDInsightCompute.attach(ws,name = "myhdi",
                            address = "<fqdn>",
                            username = "<username>",
                            password = "<password>")
except UserErrorException as e:
    print("Caught = {}".format(e.message))
    print("Compute config already attached.")

# Configure HDInsight run
# load the runconfig object from the "myhdi.runconfig" file generated by the attach operaton above.
run_config = RunConfiguration.load(project_object = project, run_config_name = 'myhdi')

# ask system to prepare the conda environment automatically when used for the first time
run_config.auto_prepare_environment = True
```

## Submit training run

There are two ways to submit a training run:

* Submitting a `ScriptRunConfig` object.
* Submitting a `Pipeline` object.

> [!IMPORTANT]
> The Azure Databricks and Azure Datalake Analytics compute targets can only be used in a pipeline.
> The local compute target cannot be used in a Pipeline.

### Submit using `ScriptRunConfig`

The code pattern for submitting a training runs using `ScriptRunConfig` is the same regardless of the compute target:

* Create a `ScriptRunConfig` object using the run configuration for the compute target.
* Submit the run.
* Wait for the run to complete.

The following example uses the configuration for the system-managed local compute target created earlier in this document:

```python
src = ScriptRunConfig(source_directory = script_folder, script = 'train.py', run_config = run_config_system_managed)
run = exp.submit(src)
run.wait_for_completion(show_output = True)
```

For a Jupyter Notebook that demonstrates training with Spark on HDInsight, see [how-to-use-azureml/training/train-in-spark/train-in-spark.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training/train-in-spark/train-in-spark.ipynb).

### Submit using a pipeline

The code pattern for submitting a training runs using a pipeline is the same regardless of the compute target:

* Add a step to the pipeline for the compute resource.
* Submit a run using the pipeline.
* Wait for the run to complete.

The following example uses the Azure Databricks compute target created earlier in this document:

```python
dbStep = DatabricksStep(
    name="databricksmodule",
    inputs=[step_1_input],
    outputs=[step_1_output],
    num_workers=1,
    notebook_path=notebook_path,
    notebook_params={'myparam': 'testparam'},
    run_name='demo run name',
    databricks_compute=databricks_compute,
    allow_reuse=False
)
# list of steps to run
steps = [dbStep]
pipeline = Pipeline(workspace=ws, steps=steps)
pipeline_run = Experiment(ws, 'Demo_experiment').submit(pipeline)
pipeline_run.wait_for_completion()
```

For more information on machine learning pipelines, see the [Pipelines and Azure Machine Learning](concept-ml-pipelines.md) document.

For example Jupyter Notebooks that demonstrate training using a pipeline, see [https://github.com/Azure/MachineLearningNotebooks/tree/master/pipeline](https://github.com/Azure/MachineLearningNotebooks/tree/master/pipeline).

## View and set up compute using the Azure portal

You can view what compute targets are associated with your workspace from the Azure portal. To get to the list, use the following steps:

1. Visit the [Azure portal](https://portal.azure.com) and navigate to your workspace.
2. Click on the __Compute__ link under the __Applications__ section.

    ![View compute tab](./media/how-to-set-up-training-targets/azure-machine-learning-service-workspace.png)

### Create a compute target

Follow the above steps to view the list of compute targets, and then use the following steps to create a compute target:

1. Click the __+__ sign to add a compute target.

    ![Add compute ](./media/how-to-set-up-training-targets/add-compute-target.png)

1. Enter a name for the compute target
1. Select **Machine Learning Compute** as the type of compute to use for __Training__

    > [!IMPORTANT]
    > You can only create Azure Machine Learning Compute as the managed compute for training

1. Fill out the required form especially the VM Family and the maximum nodes to use for spinning up the compute 
1. Select __Create__
1. You can view the status of the create operation by selecting the compute target from the list

    ![View Compute list](./media/how-to-set-up-training-targets/View_list.png)

1. You will then see the details for the compute target.

    ![View details](./media/how-to-set-up-training-targets/compute-target-details.png)

1. Now you can submit a run against these targets as detailed above


### Reuse existing compute in your workspace

Follow the above steps to view the list of compute targets, then use the following steps to reuse compute target:

1. Click the **+** sign to add a compute target
2. Enter a name for the compute target
3. Select the type of compute to attach for __Training__

    > [!IMPORTANT]
    > Not all compute types can be attached using the portal.
    > Currently the types that can be attached for training are:
    > 
    > * Remote VM
    > * Databricks
    > * Data Lake Analytics
    > * HDInsight

1. Fill out the required form

    > [!NOTE]
    > Microsoft recommends that you use SSH keys, as they are more secure than passwords. Passwords are vulnerable to brute force attacks, while SSH keys rely on cryptographic signatures. For information on creating SSH keys for use with Azure Virtual Machines, see the following documents:
    >
    > * [Create and use SSH keys on Linux or macOS]( https://docs.microsoft.com/azure/virtual-machines/linux/mac-create-ssh-keys)
    > * [Create and use SSH keys on Windows]( https://docs.microsoft.com/azure/virtual-machines/linux/ssh-from-windows)

1. Select Attach
1. You can view the status of the attach operation by selecting the compute target from the list
1. Now you can submit a run against these targets as detailed above

## Examples
The following notebooks demonstrate concepts in this article:
* [how-to-use-azureml/training/train-on-local/train-on-local.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training/train-on-local/train-on-local.ipynb)
* [how-to-use-azureml/training/train-on-amlcompute/train-on-amlcompute.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training/train-on-amlcompute/train-on-amlcompute.ipynb)
* [how-to-use-azureml/training/train-on-remote-vm/train-on-remote-vm.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training/train-on-remote-vm/train-on-remote-vm.ipynb)
* [how-to-use-azureml/training/train-in-spark/train-in-spark.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training/train-in-spark/train-in-spark.ipynb)
* [tutorials/img-classification-part1-training.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/tutorials/img-classification-part1-training.ipynb)

Get these notebooks:
[!INCLUDE [aml-clone-in-azure-notebook](../../../includes/aml-clone-for-examples.md)]

## Next steps

* [Azure Machine Learning SDK reference](https://aka.ms/aml-sdk)
* [Tutorial: Train a model](tutorial-train-models-with-aml.md)
* [Where to deploy models](how-to-deploy-and-where.md)
* [Build machine learning pipelines with Azure Machine Learning service](concept-ml-pipelines.md)
