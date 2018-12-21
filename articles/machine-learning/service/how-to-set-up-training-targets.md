---
title: Compute targets for model training
titleSuffix: Azure Machine Learning service
description: Configure the training environments (compute targets) for machine learning model training. You can easily switch between training environments. Start training locally. If you need to scale out, switch to a cloud-based compute target.
services: machine-learning
author: heatherbshapiro
ms.author: hshapiro
ms.reviewer: larryfr
manager: cgronlun
ms.service: machine-learning
ms.component: core
ms.topic: article
ms.date: 12/04/2018
ms.custom: seodec18
---
# Set up compute targets for model training

With the Azure Machine Learning service, you can train your model on different compute resources. These compute resources, called __compute targets__, can be local or in the cloud. In this article, you learn about the supported compute targets and how to use them.

A compute target is a resource where you run your training script, or you host your model when it's deployed as a web service. You can create and manage a compute target by using the Azure Machine Learning SDK, the Azure portal, or the Azure CLI. If you have compute targets created through another service (for example, an Azure HDInsight cluster), you can use these targets by attaching them to your Azure Machine Learning service workspace.

There are three broad categories of compute targets that Azure Machine Learning supports:

* __Local__: Your local machine, or a cloud-based virtual machine (VM) that you use as a development and experimentation environment. 
* __Managed compute__: The Azure Machine Learning Compute environment is a compute offering that's managed by the Azure Machine Learning service. The offering allows you to easily create a single or multi-node compute for training, testing, and batch inferencing.
* __Attached compute__: You can also bring your own Azure cloud compute and attach it to Azure Machine Learning. Read more about supported compute types and how to use them in the following sections.


## Supported compute targets

Azure Machine Learning service has varying support across the various compute targets. A typical model development lifecycle starts with development and experimentation on a small amount of data. At this stage, we recommend you use a local environment like your local computer or a cloud-based VM. As you scale up your training on larger data sets, or do distributed training, use an Azure Machine Learning compute to create a single or multi-node cluster that autoscales each time you submit a run. You can also attach your own compute resource, although support for various scenarios can vary as described in the following table:

|Compute target| GPU acceleration | Automated<br/> hyperparameter tuning | Automated</br> machine learning | Pipeline friendly|
|----|:----:|:----:|:----:|:----:|
|[Local computer](#local)| Maybe | &nbsp; | ✓ | &nbsp; |
|[An Azure Machine Learning compute](#amlcompute)| ✓ | ✓ | ✓ | ✓ |
|[Remote VM](#vm) | ✓ | ✓ | ✓ | ✓ |
|[Azure Databricks](#databricks)| &nbsp; | &nbsp; | ✓ | ✓[*](#pipeline-only) |
|[Azure Data Lake Analytics](#adla)| &nbsp; | &nbsp; | &nbsp; | ✓[*](#pipeline-only) |
|[Azure HDInsight](#hdinsight)| &nbsp; | &nbsp; | &nbsp; | ✓ |

> [!IMPORTANT]
> <a id="pipeline-only"></a>__*__ _Azure Databricks and Azure Data Lake Analytics can only be used in a pipeline._<br/>
> For more information on pipelines, see [Pipelines in Azure Machine Learning](concept-ml-pipelines.md).
>
> An Azure Machine Learning compute must be created from within a workspace. You can't attach existing instances to a workspace.
>
> Other compute targets must be created outside Azure Machine Learning and then attached to your workspace.
>
> When you train a model, some compute targets rely on Docker container images. The GPU base image must be used on Microsoft Azure Services only. For model training, the services include:
> * The Azure Machine Learning Compute environment
> * Azure Kubernetes Service
> * Windows Data Science Virtual Machine (DSVM)

## Workflow

The workflow for developing and deploying a model with Azure Machine Learning follows these steps:

1. Develop the machine learning training scripts in Python.
1. Create and configure the compute target, or attach an existing compute target.
1. Submit the training scripts to the compute target.
1. Inspect the results to find the best model.
1. Register the model in the model registry.
1. Deploy the model.

> [!NOTE]
> Your training script isn't tied to a specific compute target. You can train initially on your local computer, then switch compute targets without having to rewrite the training script.
> 
> When you associate a compute target with your workspace by creating a managed compute or by attaching an existing compute, provide a name to your compute. The name should be between two and 16 characters long.

To switch from one compute target to another, you need a [run configuration](concept-azure-machine-learning-architecture.md#run-configuration). The run configuration defines how to run the script on the compute target.

## Training scripts

When you start a training run, it creates a snapshot of the directory that contains your training scripts and sends it to the compute target. For more information, see [Snapshots](concept-azure-machine-learning-architecture.md#snapshot).

## <a id="local"></a>Local computer

When you train locally, you use the SDK to submit the training operation. You can train by using a user-managed or system-managed environment.

### User-managed environment

In a user-managed environment, make sure all of the necessary packages are available in the Python environment where you run the script. The following code snippet is an example of how to configure training for a user-managed environment:

```python
from azureml.core.runconfig import RunConfiguration

# Edit a run configuration property on the fly.
run_config_user_managed = RunConfiguration()

run_config_user_managed.environment.python.user_managed_dependencies = True

# Choose a specific Python environment by pointing to a Python path. For example:
# run_config.environment.python.interpreter_path = '/home/ninghai/miniconda3/envs/sdk2/bin/python'
```

  
### System-managed environment

System-managed environments rely on conda to manage the dependencies. Conda creates a file named **conda_dependencies.yml** that contains a list of dependencies. You can ask the system to build a new conda environment and run your scripts there. System-managed environments can be reused later, as long as the conda_dependencies.yml file is unchanged. 

The initial setup up of a new environment can take several minutes to complete based on the size of the required dependencies. The following code snippet demonstrates how to create a system-managed environment that depends on scikit-learn:

```python
from azureml.core.runconfig import RunConfiguration
from azureml.core.conda_dependencies import CondaDependencies

run_config_system_managed = RunConfiguration()

run_config_system_managed.environment.python.user_managed_dependencies = False
run_config_system_managed.auto_prepare_environment = True

# Specify the conda dependencies with scikit-learn

run_config_system_managed.environment.python.conda_dependencies = CondaDependencies.create(conda_packages=['scikit-learn'])
```

## <a id="amlcompute"></a>Azure Machine Learning Compute environment

The Azure Machine Learning Compute environment is a managed-compute infrastructure that allows the user to easily create a single or multi-node compute. The compute is created within your workspace region as a resource that can be shared with other users in your workspace. The compute scales up automatically when a job is submitted, and can be put in an Azure virtual network. The compute executes in a containerized environment and packages your model dependencies in a Docker container.

You can use the Azure Machine Learning Compute environment to distribute the training process across a cluster of CPU or GPU compute nodes in the cloud. For more information on the VM sizes that include GPUs, see [GPU-optimized virtual machine sizes](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-gpu).

> [!NOTE]
> The Azure Machine Learning Compute environment has default limits, such as the number of cores that can be allocated. For more information, see [Manage and request quotas for Azure resources](https://docs.microsoft.com/azure/machine-learning/service/how-to-manage-quotas).

You can create an Azure Machine Learning compute on demand when you schedule a run, or as a persistent resource.

### Run-based creation

You can create an Azure Machine Learning compute as a compute target at run time. The compute is automatically created for your run and scales up to the number of **max_nodes** that you specify in your run config. The compute is deleted automatically after the run completes.

> [!IMPORTANT]
> Run-based creation of an Azure Machine Learning compute is currently in Preview. Don't use run-based creation if you use automated hyperparameter tuning or automated machine learning. To use hyperparameter tuning or automated machine learning, create the Azure Machine Learning compute before you submit a run.

```python
from azureml.core.compute import ComputeTarget, AmlCompute

# First, list the supported VM families for the Azure Machine Learning Compute environment
AmlCompute.supported_vmsizes()

from azureml.core.runconfig import RunConfiguration

# Create a new runconfig object
run_config = RunConfiguration()

# Signal that you want to use AmlCompute to execute the script
run_config.target = "amlcompute"

# AmlCompute is created in the same region as your workspace
# Set the VM size for AmlCompute from the list of supported_vmsizes
run_config.amlcompute.vm_size = 'STANDARD_D2_V2'

```

### Persistent compute: Basic

A persistent Azure Machine Learning compute can be reused across jobs. The compute can be shared with other users in the workspace and is kept between jobs.

To create a persistent Azure Machine Learning compute resource, you specify the **vm_size** and **max_nodes** properties. Azure Machine Learning then uses smart defaults for the other properties. The compute autoscales down to zero nodes when it isn't used, and creates dedicated VMs to run your jobs as needed. 

* **vm_size**: The VM family of the nodes created by the Azure Machine Learning compute.
* **max_nodes**: The maximum number of nodes to autoscale up to when you run a job on the Azure Machine Learning compute.

```python
from azureml.core.compute import ComputeTarget, AmlCompute
from azureml.core.compute_target import ComputeTargetException

# Choose a name for your CPU cluster
cpu_cluster_name = "cpucluster"

# Verify that the cluster doesn't already exist
try:
    cpu_cluster = ComputeTarget(workspace=ws, name=cpu_cluster_name)
    print('Found existing cluster, use it.')
except ComputeTargetException:
    compute_config = AmlCompute.provisioning_configuration(vm_size='STANDARD_D2_V2',
                                                           max_nodes=4)
    cpu_cluster = ComputeTarget.create(ws, cpu_cluster_name, compute_config)

cpu_cluster.wait_for_completion(show_output=True)

```

### Persistent compute: Advanced

You can also configure several advanced properties when you create an Azure Machine Learning compute. The properties allow you to create a persistent cluster of fixed size, or within an existing Azure virtual network in your subscription.

Along with the **vm_size** and **max_nodes** properties, you can also use the following properties:

* **min_nodes**: The minimum number of nodes to downscale to when you run a job on an Azure Machine Learning compute. The default minimum is zero (0) nodes.
* **vm_priority**: The type of VM to use when you create an Azure Machine Learning compute resource. Choose between **dedicated** (default) and **lowpriority**. Low priority VMs use the excess capacity in Azure. These VMs are cheaper, but runs can be pre-empted when these VMs are used.
* **idle_seconds_before_scaledown**: The amount of idle time to wait after a run completes, and before the autoscale up to the number of **min_nodes**. The default idle time is 120 seconds.
* **vnet_resourcegroup_name**: The resource group of the __existing__ virtual network. The Azure Machine Learning compute is created within this virtual network.
* **vnet_name**: The name of the virtual network. The virtual network must be in the same region as your Azure Machine Learning workspace.
* **subnet_name**: The name of subnet within the virtual network. The Azure Machine Learning compute resources are assigned IP addresses from this subnet range.

> [!TIP]
> When you create a persistent Azure Machine Learning compute resource, you can update properties like the number of **min_nodes** or **max_nodes**. To update a property, call the `update()` function for the property.

```python
from azureml.core.compute import ComputeTarget, AmlCompute
from azureml.core.compute_target import ComputeTargetException

# Choose a name for your CPU cluster
cpu_cluster_name = "cpucluster"

# Verify that the cluster doesn't already exist 
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


## <a id="vm"></a>Remote VM

Azure Machine Learning also supports bringing your own compute resource and attaching it to your workspace. One such resource type is an arbitrary remote VM, as long as it's accessible from Azure Machine Learning service. The resource can be an Azure VM, a remote server in your organization, or on-premises. Specifically, given the IP address and credentials (user name and password, or SSH key), you can use any accessible VM for remote runs.
You can use a system-built conda environment, an existing Python environment, or a Docker container. When you execute by using a Docker container, you need to have Docker Engine running on the VM. The remote VM functionality is especially useful when you want a cloud-based development and experimentation environment that's more flexible than your local machine.

> [!TIP]
> Use the DSVM as the Azure VM of choice for this scenario. This VM is a pre-configured data science and AI development environment in Azure The VM offers a curated choice of tools and frameworks for full-lifecycle machine learning development. For more information on how to use the DSVM with Azure Machine Learning, see [Configure a development environment](https://docs.microsoft.com/azure/machine-learning/service/how-to-configure-environment#dsvm).

> [!WARNING]
> Azure Machine Learning only supports virtual machines that run Ubuntu. When you create a VM or choose an existing VM, you must select a VM that uses Ubuntu.

The following steps use the SDK to configure a DSVM as a training target:

1. To attach an existing virtual machine as a compute target, you must provide the fully qualified domain name (FQDN), user name, and password for the virtual machine. In the example, replace \<fqdn> with the public FQDN of the VM, or the public IP address. Replace \<username> and \<password> with the SSH user name and password for the VM.

    ```python
    from azureml.core.compute import RemoteCompute, ComputeTarget
    
    # Create the compute config
    attach_config = RemoteCompute.attach_configuration(address = "ipaddress",
                                                       ssh_port=22,
                                                       username='<username>',
                                                       password="<password>")

    # If you use SSH instead of a password, use this code:
    #                                                  ssh_port=22,
    #                                                  username='<username>',
    #                                                  password=None,
    #                                                  private_key_file="path-to-file",
    #                                                  private_key_passphrase="passphrase")

    # Attach the compute target
    compute = ComputeTarget.attach(ws, "attach-dsvm", attach_config)

    compute.wait_for_completion(show_output=True)
    ```

1. Create a configuration for the DSVM compute target. Docker and conda are used to create and configure the training environment on the DSVM.

    ```python
    from azureml.core.runconfig import RunConfiguration
    from azureml.core.conda_dependencies import CondaDependencies

    # Load into memory the cpu-dsvm.runconfig file created in the previous attach operation
    run_config = RunConfiguration(framework = "python")

    # Set the compute target to the Linux DSVM
    run_config.target = compute_target_name

    # Use Docker in the remote VM
    run_config.environment.docker.enabled = True

    # Use the CPU base image
    # To use GPU in DSVM, you must also use the GPU base Docker image "azureml.core.runconfig.DEFAULT_GPU_IMAGE"
    run_config.environment.docker.base_image = azureml.core.runconfig.DEFAULT_CPU_IMAGE
    print('Base Docker image is:', run_config.environment.docker.base_image)

    # Ask the system to provision a new conda environment based on the conda_dependencies.yml file
    run_config.environment.python.user_managed_dependencies = False

    # Prepare the Docker and conda environment automatically when they're used for the first time
    run_config.prepare_environment = True

    # Specify the CondaDependencies object
    run_config.environment.python.conda_dependencies = CondaDependencies.create(conda_packages=['scikit-learn'])

    ```

## <a id="databricks"></a>Azure Databricks

Azure Databricks is an Apache Spark-based environment in the Azure cloud. The environment can be used as a compute target when you train models with an Azure Machine Learning pipeline.

> [!IMPORTANT]
> An Azure Databricks compute target can only be used in a Machine Learning pipeline.
>
> You must create an Azure Databricks workspace before you use it to train your model. To create these resource, see [Run a Spark job on Azure Databricks](https://docs.microsoft.com/azure/azure-databricks/quickstart-create-databricks-workspace-portal).

To attach Azure Databricks as a compute target, you must use the Azure Machine Learning SDK and provide the following information:

* __Compute name__: The name to assign to this compute resource.
* __Databricks workspace name__: The name of the Azure Databricks workspace.
* __Access token__: The access token used to authenticate to Azure Databricks. To generate an access token, see [Authentication](https://docs.azuredatabricks.net/api/latest/authentication.html).

The following code demonstrates how to attach Azure Databricks as a compute target:

```python
databricks_compute_name = os.environ.get("AML_DATABRICKS_COMPUTE_NAME", "<databricks_compute_name>")
databricks_workspace_name = os.environ.get("AML_DATABRICKS_WORKSPACE", "<databricks_workspace_name>")
databricks_resource_group = os.environ.get("AML_DATABRICKS_RESOURCE_GROUP", "<databricks_resource_group>")
databricks_access_token = os.environ.get("AML_DATABRICKS_ACCESS_TOKEN", "<databricks_access_token>")

try:
    databricks_compute = ComputeTarget(workspace=ws, name=databricks_compute_name)
    print('Compute target already exists')
except ComputeTargetException:
    print('compute not found')
    print('databricks_compute_name {}'.format(databricks_compute_name))
    print('databricks_workspace_name {}'.format(databricks_workspace_name))
    print('databricks_access_token {}'.format(databricks_access_token))

    # Create the attach config
    attach_config = DatabricksCompute.attach_configuration(resource_group = databricks_resource_group,
                                                           workspace_name = databricks_workspace_name,
                                                           access_token = databricks_access_token)
    databricks_compute = ComputeTarget.attach(
             ws,
             databricks_compute_name,
             attach_config
         )
    
    databricks_compute.wait_for_completion(True)
```

## <a id="adla"></a>Azure Data Lake Analytics

Azure Data Lake Analytics is a big-data analytics platform in the Azure cloud. The platform can be used as a compute target when you train models with an Azure Machine Learning pipeline.

> [!IMPORTANT]
> An Azure Data Lake Analytics compute target can only be used in a Machine Learning pipeline.
>
> You must create an Azure Data Lake Analytics account before you use it to train your model. To create this resource, see [Get started with Azure Data Lake Analytics](https://docs.microsoft.com/azure/data-lake-analytics/data-lake-analytics-get-started-portal).

To attach Data Lake Analytics as a compute target, you must use the Azure Machine Learning SDK and provide the following information:

* __Compute name__: The name to assign to this compute resource.
* __Resource group__: The resource group that contains the Data Lake Analytics account.
* __Account name__: The Data Lake Analytics account name.

The following code demonstrates how to attach Data Lake Analytics as a compute target:

```python
adla_compute_name = os.environ.get("AML_ADLA_COMPUTE_NAME", "<adla_compute_name>")
adla_resource_group = os.environ.get("AML_ADLA_RESOURCE_GROUP", "<adla_resource_group>")
adla_account_name = os.environ.get("AML_ADLA_ACCOUNT_NAME", "<adla_account_name>")

try:
    adla_compute = ComputeTarget(workspace=ws, name=adla_compute_name)
    print('Compute target already exists')
except ComputeTargetException:
    print('compute not found')
    print('adla_compute_name {}'.format(adla_compute_name))
    print('adla_resource_id {}'.format(adla_resource_group))
    print('adla_account_name {}'.format(adla_account_name))
    
    # Create the attach config
    attach_config = AdlaCompute.attach_configuration(resource_group = adla_resource_group,
                                                     account_name = adla_account_name)
    # Attach the ADLA
    adla_compute = ComputeTarget.attach(
             ws,
             adla_compute_name,
             attach_config
         )
    
    adla_compute.wait_for_completion(True)
```

> [!TIP]
> Azure Machine Learning pipelines only work with data that's stored in the default data store of the Data Lake Analytics account. If the data you need is in a non-default store, you can use a [DataTransferStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.data_transfer_step.datatransferstep?view=azure-ml-py) operation to copy the data before you train the model.

## <a id="hdinsight"></a>Azure HDInsight 

Azure HDInsight is a popular platform for big-data analytics. The platform provides Apache Spark, which can be used to train your model.

> [!IMPORTANT]
> You must create the HDInsight cluster before you use it to train your model. To create a Spark on HDInsight cluster, see [Create a Spark Cluster in HDInsight](https://docs.microsoft.com/azure/hdinsight/spark/apache-spark-jupyter-spark-sql).
>
> When you create the cluster, you must specify an SSH user name and password. Take note of these values, as you need them to use HDInsight as a compute target.
>
> After the cluster is created, it has the FQDN \<clustername>.azurehdinsight.net, where \<clustername> is the name that you provided for the cluster. You need the FQDN address (or the public IP address of the cluster) to use the cluster as a compute target.

To configure HDInsight as a compute target, you must provide the FQDN, user name, and password for the HDInsight cluster. The following example uses the SDK to attach a cluster to your workspace. In the example, replace \<fqdn> with the public FQDN of the cluster, or the public IP address. Replace \<username> and \<password> with the SSH user name and password for the cluster.

> [!NOTE]
> To find the FQDN for your cluster, go to the Azure portal and select your HDInsight cluster. Under __Overview__, you can see the FQDN in the __URL__ entry. To get the FQDN, remove the https:\// prefix from the beginning of the entry.

![Get the FQDN for an HDInsight cluster in the Azure portal](./media/how-to-set-up-training-targets/hdinsight-overview.png)

```python
from azureml.core.compute import HDInsightCompute, ComputeTarget

try:
    # Attach an HDInsight cluster as a compute target
    attach_config = HDInsightCompute.attach_configuration(address = "fqdn-or-ipaddress",
                                                          ssh_port = 22,
                                                          username = "username",
                                                          password = None, #if using ssh key
                                                          private_key_file = "path-to-key-file",
                                                          private_key_phrase = "key-phrase")
    compute = ComputeTarget.attach(ws, "myhdi", attach_config)
except UserErrorException as e:
    print("Caught = {}".format(e.message))
    print("Compute config already attached.")

# Configure the HDInsight run
# Load the runconfig object from the myhdi.runconfig file generated in the previous attach operation
run_config = RunConfiguration.load(project_object = project, run_config_name = 'myhdi')

# Ask the system to prepare the conda environment automatically when it's used for the first time
run_config.auto_prepare_environment = True
```

## Submit training runs

There are two ways to submit a training run:

* Submit a training run by using a `ScriptRunConfig` object.
* Submit a training run by using a `Pipeline` object.

> [!IMPORTANT]
> The Azure Databricks and Azure Datalake Analytics compute targets can only be used in a pipeline.
>
> The local compute target can't be used in a pipeline.

### ScriptRunConfig object

The code pattern to submit a training run with the `ScriptRunConfig` object is the same for all types of compute targets:

1. Create a `ScriptRunConfig` object by using the run configuration for the compute target.
1. Submit the run.
1. Wait for the run to complete.

The following example uses the configuration for the system-managed local compute target created earlier:

```python
src = ScriptRunConfig(source_directory = script_folder, script = 'train.py', run_config = run_config_system_managed)
run = exp.submit(src)
run.wait_for_completion(show_output = True)
```


### Pipeline object

The code pattern to submit a training run with a `Pipeline` object is the same for all types of compute targets:

1. Add a step to the `Pipeline` object for the compute resource.
1. Submit a run by using the pipeline.
1. Wait for the run to complete.

The following example uses the Azure Databricks compute target created earlier:

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

# List of steps to run
steps = [dbStep]
pipeline = Pipeline(workspace=ws, steps=steps)
pipeline_run = Experiment(ws, 'Demo_experiment').submit(pipeline)
pipeline_run.wait_for_completion()
```

For more information on machine learning pipelines, see [Pipelines and Azure Machine Learning](concept-ml-pipelines.md).

For example Jupyter notebooks that demonstrate how to train a model by using a pipeline, see [https://github.com/Azure/MachineLearningNotebooks/tree/master/pipeline](https://github.com/Azure/MachineLearningNotebooks/tree/master/pipeline).

## Access computes in the Azure portal

You can access the compute targets that are associated with your workspace in the Azure portal. 

### View compute targets

To see the compute targets for your workspace, use the following steps:

1. Navigate to the [Azure portal](https://portal.azure.com) and open your workspace.
1. Under __Applications__, select __Compute__.

    ![View compute targets](./media/how-to-set-up-training-targets/azure-machine-learning-service-workspace.png)

### Create a compute target

Follow the previous steps to view the list of compute targets. Then use these steps to create a compute target:

1. Select the Plus sign (+) to add a compute target.

    ![Add a compute target](./media/how-to-set-up-training-targets/add-compute-target.png)

1. Enter a name for the compute target.
1. Select **Machine Learning Compute** as the type of compute to use for __Training__.

    > [!IMPORTANT]
    > You can only create an Azure Machine Learning compute as the managed-compute resource for training.

1. Fill out the form. Provide values for the required properties, especially **VM Family**, and the **maximum nodes** to use to spin up the compute. 
1. Select __Create__.
1. View the status of the create operation by selecting the compute target from the list:

    ![Select a compute target to view the create operation status](./media/how-to-set-up-training-targets/View_list.png)

1. You then see the details for the compute target:

    ![View the computer target details](./media/how-to-set-up-training-targets/compute-target-details.png)

Now you can submit a run against the computer targets as described earlier.


### Reuse existing compute targets

Follow the steps described earlier to view the list of compute targets. Then use these steps to reuse a compute target:

1. Select the Plus sign (+) to add a compute target.
1. Enter a name for the compute target.
1. Select the type of compute to attach for __Training__:

    > [!IMPORTANT]
    > Not all compute types can be attached from the Azure portal.
    > The compute types that can currently be attached for training include:
    >
    > * A remote VM
    > * Azure Databricks
    > * Azure Data Lake Analytics
    > * Azure HDInsight

1. Fill out the form and provide values for the required properties.

    > [!NOTE]
    > Microsoft recommends that you use SSH keys, which are more secure than passwords. Passwords are vulnerable to brute force attacks. SSH keys rely on cryptographic signatures. For information on how to create SSH keys for use with Azure Virtual Machines, see the following documents:
    >
    > * [Create and use SSH keys on Linux or macOS](https://docs.microsoft.com/azure/virtual-machines/linux/mac-create-ssh-keys)
    > * [Create and use SSH keys on Windows](https://docs.microsoft.com/azure/virtual-machines/linux/ssh-from-windows)

1. Select __Attach__.
1. View the status of the attach operation by selecting the compute target from the list.

Now you can submit a run against these compute targets as described earlier.

## Notebook examples

For examples, see the notebooks in the following locations:

* [how-to-use-azureml/training](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training)
* [tutorials/img-classification-part1-training.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/tutorials/img-classification-part1-training.ipynb)

[!INCLUDE [aml-clone-in-azure-notebook](../../../includes/aml-clone-for-examples.md)]

## Next steps

* [Azure Machine Learning SDK reference](https://aka.ms/aml-sdk)
* [Tutorial: Train a model](tutorial-train-models-with-aml.md)
* [Where to deploy models](how-to-deploy-and-where.md)
* [Build machine learning pipelines with Azure Machine Learning service](concept-ml-pipelines.md)
