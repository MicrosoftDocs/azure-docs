---
title: Create and use compute targets for model training
titleSuffix: Azure Machine Learning service
description: Configure the training environments (compute targets) for machine learning model training. You can easily switch between training environments. Start training locally. If you need to scale out, switch to a cloud-based compute target.
services: machine-learning
author: heatherbshapiro
ms.author: hshapiro
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.date: 06/12/2019
ms.custom: seodec18
---
# Set up compute targets for model training 

With Azure Machine Learning service, you can train your model on a variety of resources or environments, collectively referred to as [__compute targets__](concept-azure-machine-learning-architecture.md#compute-targets). A compute target can be a local machine or a cloud resource, such as an Azure Machine Learning Compute, Azure HDInsight or a remote virtual machine.  You can also create compute targets for model deployment as described in ["Where and how to deploy your models"](how-to-deploy-and-where.md).

You can create and manage a compute target using the Azure Machine Learning SDK, Azure portal, Azure CLI or Azure Machine Learning VS Code extension. If you have compute targets that were created through another service (for example, an HDInsight cluster), you can use them by attaching them to your Azure Machine Learning service workspace.
 
In this article, you learn how to use various compute targets for model training.  The steps for all compute targets follow the same workflow:
1. __Create__ a compute target if you don’t already have one.
2. __Attach__ the compute target to your workspace.
3. __Configure__ the compute target so that it contains the Python environment and package dependencies needed by your script.


>[!NOTE]
> Code in this article was tested with Azure Machine Learning SDK version 1.0.39.

## Compute targets for training

Azure Machine Learning service has varying support across different compute targets. A typical model development lifecycle starts with dev/experimentation on a small amount of data. At this stage, we recommend using a local environment. For example, your local computer or a cloud-based VM. As you scale up your training on larger data sets, or do distributed training, we recommend using Azure Machine Learning Compute to create a single- or multi-node cluster that autoscales each time you submit a run. You can also attach your own compute resource, although support for various scenarios may vary as detailed below:

[!INCLUDE [aml-compute-target-train](../../../includes/aml-compute-target-train.md)]


> [!NOTE]
> Azure Machine Learning Compute can be created as a persistent resource or created dynamically when you request a run. Run-based creation removes the compute target after the training run is complete, so you cannot reuse compute targets created this way.

## What's a run configuration?

When training, it is common to start on your local computer, and later run that training script on a different compute target. With Azure Machine Learning service, you can run your script on various compute targets without having to change your script. 

All you need to do is define the environment for each compute target with a **run configuration**.  Then, when you want to run your training experiment on a different compute target, specify the run configuration for that compute. 

Learn more about [submitting experiments](#submit) at the end of this article.

### Manage environment and dependencies

When you create a run configuration, you need to decide how to manage the environment and dependencies on the compute target. 

#### System-managed environment

Use a system-managed environment when you want [Conda](https://conda.io/docs/) to manage the Python environment and the script dependencies for you. A system-managed environment is assumed by default and the most common choice. It is useful on remote compute targets, especially when you cannot configure that target. 

All you need to do is specify each package dependency using the [CondaDependency class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.conda_dependencies.condadependencies?view=azure-ml-py) Then Conda creates a file named **conda_dependencies.yml** in the **aml_config** directory in your workspace with your list of package dependencies and sets up your Python environment when you submit your training experiment. 

The initial setup of a new environment can take several minutes depending on the size of the required dependencies. As long as the list of packages remains unchanged, the setup time happens only once.
  
The following code shows an example for a system-managed environment requiring scikit-learn:
    
[!code-python[](~/aml-sdk-samples/ignore/doc-qa/how-to-set-up-training-targets/runconfig.py?name=run_system_managed)]

#### User-managed environment

For a user-managed environment, you're responsible for setting up your environment and installing every package your training script needs on the compute target. If your training environment is already configured (such as on your local machine), you can skip the setup step by setting `user_managed_dependencies` to True. Conda will not check your environment or install anything for you.

The following code shows an example of configuring training runs for a user-managed environment:

[!code-python[](~/aml-sdk-samples/ignore/doc-qa/how-to-set-up-training-targets/runconfig.py?name=run_user_managed)]
  
## Set up in Python

Use the sections below to configure these compute targets:

* [Local computer](#local)
* [Azure Machine Learning Compute](#amlcompute)
* [Remote virtual machines](#vm)
* [Azure HDInsight](#hdinsight)


### <a id="local"></a>Local computer

1. **Create and attach**: There's no need to create or attach a compute target to use your local computer as the training environment.  

1. **Configure**:  When you use your local computer as a compute target, the training code is run in your [development environment](how-to-configure-environment.md).  If that environment already has the Python packages you need, use the user-managed environment.

 [!code-python[](~/aml-sdk-samples/ignore/doc-qa/how-to-set-up-training-targets/local.py?name=run_local)]

Now that you’ve attached the compute and configured your run, the next step is to [submit the training run](#submit).

### <a id="amlcompute"></a>Azure Machine Learning Compute

Azure Machine Learning Compute is a managed-compute infrastructure that allows the user to easily create a single or multi-node compute. The compute is created within your workspace region as a resource that can be shared with other users in your workspace. The compute scales up automatically when a job is submitted, and can be put in an Azure Virtual Network. The compute executes in a containerized environment and packages your model dependencies in a [Docker container](https://www.docker.com/why-docker).

You can use Azure Machine Learning Compute to distribute the training process across a cluster of CPU or GPU compute nodes in the cloud. For more information on the VM sizes that include GPUs, see [GPU-optimized virtual machine sizes](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-gpu).

Azure Machine Learning Compute has default limits, such as the number of cores that can be allocated. For more information, see [Manage and request quotas for Azure resources](https://docs.microsoft.com/azure/machine-learning/service/how-to-manage-quotas).


You can create an Azure Machine Learning compute environment on demand when you schedule a run, or as a persistent resource.

#### Run-based creation

You can create Azure Machine Learning Compute as a compute target at run time. The compute is automatically created for your run. The compute is deleted automatically once the run completes. 

> [!NOTE]
> To specify the max number of nodes to use, you would normally set `node_count` to the number of nodes. There is currently (04/04/2019) a bug that prevents this from working. As a workaround, use the `amlcompute._cluster_max_node_count` property of the run configuration. For example, `run_config.amlcompute._cluster_max_node_count = 5`.

> [!IMPORTANT]
> Run-based creation of Azure Machine Learning compute is currently in Preview. Don't use run-based creation if you use automated hyperparameter tuning or automated machine learning. To use hyperparameter tuning or automated machine learning, create a [persistent compute](#persistent) target instead.

1.  **Create, attach, and configure**: The run-based creation performs all the necessary steps to create, attach, and configure the compute target with the run configuration.  

  [!code-python[](~/aml-sdk-samples/ignore/doc-qa/how-to-set-up-training-targets/amlcompute.py?name=run_temp_compute)]


Now that you’ve attached the compute and configured your run, the next step is to [submit the training run](#submit).

#### <a id="persistent"></a>Persistent compute

A persistent Azure Machine Learning Compute can be reused across jobs. The compute can be shared with other users in the workspace and is kept between jobs.

1. **Create and attach**: To create a persistent Azure Machine Learning Compute resource in Python, specify the **vm_size** and **max_nodes** properties. Azure Machine Learning then uses smart defaults for the other properties. The compute autoscales down to zero nodes when it isn't used.   Dedicated VMs are created to run your jobs as needed.
    
    * **vm_size**: The VM family of the nodes created by Azure Machine Learning Compute.
    * **max_nodes**: The max number of nodes to autoscale up to when you run a job on Azure Machine Learning Compute.
    
   [!code-python[](~/aml-sdk-samples/ignore/doc-qa/how-to-set-up-training-targets/amlcompute2.py?name=cpu_cluster)]

   You can also configure several advanced properties when you create Azure Machine Learning Compute. The properties allow you to create a persistent cluster of fixed size, or within an existing Azure Virtual Network in your subscription.  See the [AmlCompute class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.amlcompute.amlcompute?view=azure-ml-py
    ) for details.
    
   Or you can create and attach a persistent Azure Machine Learning Compute resource [in the Azure portal](#portal-create).

1. **Configure**: Create a run configuration for the persistent compute target.

   [!code-python[](~/aml-sdk-samples/ignore/doc-qa/how-to-set-up-training-targets/amlcompute2.py?name=run_amlcompute)]

Now that you’ve attached the compute and configured your run, the next step is to [submit the training run](#submit).


### <a id="vm"></a>Remote virtual machines

Azure Machine Learning also supports bringing your own compute resource and attaching it to your workspace. One such resource type is an arbitrary remote VM, as long as it's accessible from Azure Machine Learning service. The resource can be an Azure VM, a remote server in your organization, or on-premises. Specifically, given the IP address and credentials (user name and password, or SSH key), you can use any accessible VM for remote runs.

You can use a system-built conda environment, an already existing Python environment, or a Docker container. To execute on a Docker container, you must have a Docker Engine running on the VM. This functionality is especially useful when you want a more flexible, cloud-based dev/experimentation environment than your local machine.

Use the Azure Data Science Virtual Machine (DSVM)  as the Azure VM of choice for this scenario. This VM is a pre-configured data science and AI development environment in Azure. The VM offers a curated choice of tools and frameworks for full-lifecycle machine learning development. For more information on how to use the DSVM with Azure Machine Learning, see [Configure a development environment](https://docs.microsoft.com/azure/machine-learning/service/how-to-configure-environment#dsvm).

1. **Create**: Create a DSVM before using it to train your model. To create this resource, see [Provision the Data Science Virtual Machine for Linux (Ubuntu)](https://docs.microsoft.com/azure/machine-learning/data-science-virtual-machine/dsvm-ubuntu-intro).

    > [!WARNING]
    > Azure Machine Learning only supports virtual machines that run Ubuntu. When you create a VM or choose an existing VM, you must select a VM that uses Ubuntu.

1. **Attach**: To attach an existing virtual machine as a compute target, you must provide the fully qualified domain name (FQDN), user name, and password for the virtual machine. In the example, replace \<fqdn> with the public FQDN of the VM, or the public IP address. Replace \<username> and \<password> with the SSH user name and password for the VM.

   ```python
   from azureml.core.compute import RemoteCompute, ComputeTarget

   # Create the compute config 
   compute_target_name = "attach-dsvm"
   attach_config = RemoteCompute.attach_configuration(address = "<fqdn>",
                                                    ssh_port=22,
                                                    username='<username>',
                                                    password="<password>")

   # If you authenticate with SSH keys instead, use this code:
   #                                                  ssh_port=22,
   #                                                  username='<username>',
   #                                                  password=None,
   #                                                  private_key_file="<path-to-file>",
   #                                                  private_key_passphrase="<passphrase>")

   # Attach the compute
   compute = ComputeTarget.attach(ws, compute_target_name, attach_config)

   compute.wait_for_completion(show_output=True)
   ```

   Or you can attach the DSVM to your workspace [using the Azure portal](#portal-reuse).

1. **Configure**: Create a run configuration for the DSVM compute target. Docker and conda are used to create and configure the training environment on the DSVM.

   [!code-python[](~/aml-sdk-samples/ignore/doc-qa/how-to-set-up-training-targets/dsvm.py?name=run_dsvm)]


Now that you’ve attached the compute and configured your run, the next step is to [submit the training run](#submit).

### <a id="hdinsight"></a>Azure HDInsight 

Azure HDInsight is a popular platform for big-data analytics. The platform provides Apache Spark, which can be used to train your model.

1. **Create**:  Create the HDInsight cluster before you use it to train your model. To create a Spark on HDInsight cluster, see [Create a Spark Cluster in HDInsight](https://docs.microsoft.com/azure/hdinsight/spark/apache-spark-jupyter-spark-sql). 

    When you create the cluster, you must specify an SSH user name and password. Take note of these values, as you need them to use HDInsight as a compute target.
    
    After the cluster is created, connect to it with the hostname \<clustername>-ssh.azurehdinsight.net, where \<clustername> is the name that you provided for the cluster. 

1. **Attach**: To attach an HDInsight cluster as a compute target, you must provide the hostname, user name, and password for the HDInsight cluster. The following example uses the SDK to attach a cluster to your workspace. In the example, replace \<clustername> with the name of your cluster. Replace \<username> and \<password> with the SSH user name and password for the cluster.

   ```python
   from azureml.core.compute import ComputeTarget, HDInsightCompute
   from azureml.exceptions import ComputeTargetException

   try:
    # if you want to connect using SSH key instead of username/password you can provide parameters private_key_file and private_key_passphrase
    attach_config = HDInsightCompute.attach_configuration(address='<clustername>-ssh.azureinsight.net', 
                                                          ssh_port=22, 
                                                          username='<ssh-username>', 
                                                          password='<ssh-pwd>')
    hdi_compute = ComputeTarget.attach(workspace=ws, 
                                       name='myhdi', 
                                       attach_configuration=attach_config)

   except ComputeTargetException as e:
    print("Caught = {}".format(e.message))

   hdi_compute.wait_for_completion(show_output=True)
   ```

   Or you can attach the HDInsight cluster to your workspace [using the Azure portal](#portal-reuse).

1. **Configure**: Create a run configuration for the HDI compute target. 

   [!code-python[](~/aml-sdk-samples/ignore/doc-qa/how-to-set-up-training-targets/hdi.py?name=run_hdi)]


Now that you’ve attached the compute and configured your run, the next step is to [submit the training run](#submit).


### <a id="azbatch"></a>Azure Batch 

Azure Batch is used to run large-scale parallel and high-performance computing (HPC) applications efficiently in the cloud. AzureBatchStep can be used in an Azure Machine Learning Pipeline to submit jobs to an Azure Batch pool of machines.

To attach Azure Batch as a compute target, you must use the Azure Machine Learning SDK and provide the following information:

-	**Azure Batch compute name**: A friendly name to be used for the compute within the workspace
-	**Azure Batch account name**: The name of the Azure Batch account
-	**Resource Group**: The resource group that contains the Azure Batch account.

The following code demonstrates how to attach Azure Batch as a compute target:

```python
from azureml.core.compute import ComputeTarget, BatchCompute
from azureml.exceptions import ComputeTargetException

batch_compute_name = 'mybatchcompute' # Name to associate with new compute in workspace

# Batch account details needed to attach as compute to workspace
batch_account_name = "<batch_account_name>" # Name of the Batch account
batch_resource_group = "<batch_resource_group>" # Name of the resource group which contains this account

try:
    # check if the compute is already attached
    batch_compute = BatchCompute(ws, batch_compute_name)
except ComputeTargetException:
    print('Attaching Batch compute...')
    provisioning_config = BatchCompute.attach_configuration(resource_group=batch_resource_group, account_name=batch_account_name)
    batch_compute = ComputeTarget.attach(ws, batch_compute_name, provisioning_config)
    batch_compute.wait_for_completion()
    print("Provisioning state:{}".format(batch_compute.provisioning_state))
    print("Provisioning errors:{}".format(batch_compute.provisioning_errors))

print("Using Batch compute:{}".format(batch_compute.cluster_resource_id))
```

## Set up in Azure portal

You can access the compute targets that are associated with your workspace in the Azure portal.  You can use the portal to:

* [View  compute targets](#portal-view) attached to your workspace
* [Create a compute target](#portal-create) in your workspace
* [Attach a compute target](#portal-reuse) that was created outside the workspace

After a target is created and attached to your workspace, you will use it in your run configuration with a `ComputeTarget` object: 

```python
from azureml.core.compute import ComputeTarget
myvm = ComputeTarget(workspace=ws, name='my-vm-name')
```

### <a id="portal-view"></a>View compute targets


To see the compute targets for your workspace, use the following steps:

1. Navigate to the [Azure portal](https://portal.azure.com) and open your workspace. 
1. Under __Applications__, select __Compute__.

    ![View compute tab](./media/how-to-set-up-training-targets/azure-machine-learning-service-workspace.png)

### <a id="portal-create"></a>Create a compute target

Follow the previous steps to view the list of compute targets. Then use these steps to create a compute target: 

1. Select the plus sign (+) to add a compute target.

    ![Add a compute target](./media/how-to-set-up-training-targets/add-compute-target.png) 

1. Enter a name for the compute target. 

1. Select **Machine Learning Compute** as the type of compute to use for __Training__. 

    >[!NOTE]
    >Azure Machine Learning Compute is the only  managed-compute resource you can create in the Azure portal.  All other compute resources can be attached after they are created.

1. Fill out the form. Provide values for the required properties, especially **VM Family**, and the **maximum nodes** to use to spin up the compute.  

    ![Fill out form](./media/how-to-set-up-training-targets/add-compute-form.png) 

1. Select __Create__.


1. View the status of the create operation by selecting the compute target from the list:

    ![Select a compute target to view the create operation status](./media/how-to-set-up-training-targets/View_list.png)

1. You then see the details for the compute target: 

    ![View the computer target details](./media/how-to-set-up-training-targets/compute-target-details.png) 



### <a id="portal-reuse"></a>Attach compute targets

To use compute targets created outside the Azure Machine Learning service workspace, you must attach them. Attaching a compute target makes it available to your workspace.

Follow the steps described earlier to view the list of compute targets. Then use the following steps to attach a compute target: 

1. Select the plus sign (+) to add a compute target. 
1. Enter a name for the compute target. 
1. Select the type of compute to attach for __Training__:

    > [!IMPORTANT]
    > Not all compute types can be attached from the Azure portal. 
    > The compute types that can currently be attached for training include:
    >
    > * A remote VM
    > * Azure Databricks (for use in machine learning pipelines)
    > * Azure Data Lake Analytics (for use in machine learning pipelines)
    > * Azure HDInsight

1. Fill out the form and provide values for the required properties.

    > [!NOTE]
    > Microsoft recommends that you use SSH keys, which are more secure than passwords. Passwords are vulnerable to brute force attacks. SSH keys rely on cryptographic signatures. For information on how to create SSH keys for use with Azure Virtual Machines, see the following documents:
    >
    > * [Create and use SSH keys on Linux or macOS](https://docs.microsoft.com/azure/virtual-machines/linux/mac-create-ssh-keys)
    > * [Create and use SSH keys on Windows](https://docs.microsoft.com/azure/virtual-machines/linux/ssh-from-windows)

1. Select __Attach__. 
1. View the status of the attach operation by selecting the compute target from the list.

## Set up with CLI

You can access the compute targets that are associated with your workspace using the [CLI extension](reference-azure-machine-learning-cli.md) for Azure Machine Learning service.  You can use the CLI to:

* Create a managed compute target
* Update a managed compute target
* Attach an unmanaged compute target

For more information, see [Resource management](reference-azure-machine-learning-cli.md#resource-management).

## Set up with VS Code

You can access, create and manage the compute targets that are associated with your workspace using the [VS Code extension](how-to-vscode-tools.md#create-and-manage-compute-targets) for Azure Machine Learning service.

## <a id="submit"></a>Submit training run

After you create a run configuration, you use it to run your experiment.  The code pattern to submit a training run is the same for all types of compute targets:

1. Create an experiment to run
1. Submit the run.
1. Wait for the run to complete.

> [!IMPORTANT]
> When you submit the training run, a snapshot of the directory that contains your training scripts is created and sent to the compute target. It is also stored as part of the experiment in your workspace. If you change files and submit the run again, only the changed files will be uploaded.
>
> To prevent files from being included in the snapshot, create a [.gitignore](https://git-scm.com/docs/gitignore) or `.amlignore` file in the directory and add the files to it. The `.amlignore` file uses the same syntax and patterns as the [.gitignore](https://git-scm.com/docs/gitignore) file. If both files exist, the `.amlignore` file takes precedence.
> 
> For more information, see [Snapshots](concept-azure-machine-learning-architecture.md#snapshots).

### Create an experiment

First, create an experiment in your workspace.

[!code-python[](~/aml-sdk-samples/ignore/doc-qa/how-to-set-up-training-targets/local.py?name=experiment)]

### Submit the experiment

Submit the experiment with a `ScriptRunConfig` object.  This object includes the:

* **source_directory**: The source directory that contains your training script
* **script**: Identify the training script
* **run_config**: The run configuration, which in turn defines where the training will occur.

For example, to use [the local target](#local) configuration:

[!code-python[](~/aml-sdk-samples/ignore/doc-qa/how-to-set-up-training-targets/local.py?name=local_submit)]

Switch the same experiment to run in a different compute target by using a different run configuration, such as the [amlcompute target](#amlcompute):

[!code-python[](~/aml-sdk-samples/ignore/doc-qa/how-to-set-up-training-targets/amlcompute2.py?name=amlcompute_submit)]

Or you can:

* Submit the experiment with an `Estimator` object as shown in [Train ML models with estimators](how-to-train-ml-models.md).
* Submit an experiment [using the CLI extension](reference-azure-machine-learning-cli.md#experiments).
* Submit an experiment via the [VS Code extension](how-to-vscode-tools.md#train-and-tune-models).

## GitHub tracking and integration

When you start a training run where the source directory is a local Git repository, information about the repository is stored in the run history. For example, the current commit ID for the repository is logged as part of the history.

## Notebook examples

See these notebooks for examples of training with various compute targets:
* [how-to-use-azureml/training](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training)
* [tutorials/img-classification-part1-training.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/tutorials/img-classification-part1-training.ipynb)

[!INCLUDE [aml-clone-in-azure-notebook](../../../includes/aml-clone-for-examples.md)]

## Next steps

* [Tutorial: Train a model](tutorial-train-models-with-aml.md) uses a managed compute target to  train a model.
* Learn how to [efficiently tune hyperparameters](how-to-tune-hyperparameters.md) to build better models.
* Once you have a trained model, learn [how and where to deploy models](how-to-deploy-and-where.md).
* View the [RunConfiguration class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.runconfig.runconfiguration?view=azure-ml-py) SDK reference.
* [Use Azure Machine Learning service with Azure Virtual Networks](how-to-enable-virtual-network.md)
