---
title: Train models with the Azure Machine Learning Python SDK (v1) (preview)
titleSuffix: Azure Machine Learning
description: Add compute resources (compute targets) to your workspace to use for machine learning training and inference with SDK v1.
services: machine-learning
ms.author: vijetaj
author: vijetajo
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: core
ms.date: 10/21/2021
ms.topic: how-to
ms.custom: UpdateFrequency5, devx-track-python, contperf-fy21q1, ignite-fall-2021, sdkv1
---
# Train models with the Azure Machine Learning Python SDK (v1)

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

     
Learn how to attach Azure compute resources to your Azure Machine Learning workspace with SDK v1.  Then you can use these resources as training and inference [compute targets](../concept-compute-target.md) in your machine learning tasks.

In this article, learn how to set up your workspace to use these compute resources:

* Your local computer
* Remote virtual machines
* Apache Spark pools (powered by Azure Synapse Analytics)
* Azure HDInsight
* Azure Batch
* Azure Databricks - used as a training compute target only in [machine learning pipelines](how-to-create-machine-learning-pipelines.md)
* Azure Data Lake Analytics
* Azure Container Instance
* Azure Machine Learning Kubernetes

To use compute targets managed by Azure Machine Learning, see:

* [Azure Machine Learning compute instance](../how-to-create-compute-instance.md)
* [Azure Machine Learning compute cluster](../how-to-create-attach-compute-cluster.md)
* [Azure Kubernetes Service cluster](../how-to-create-attach-kubernetes.md)

> [!IMPORTANT]
> Items in this article marked as "preview" are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure Machine Learning workspace. For more information, see [Create workspace resources](../quickstart-create-resources.md).

* The [Azure CLI extension for Machine Learning service](reference-azure-machine-learning-cli.md), [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/intro), or the [Azure Machine Learning Visual Studio Code extension](../how-to-setup-vs-code.md).

## Limitations

* **Do not create multiple, simultaneous attachments to the same compute** from your workspace. For example, attaching one Azure Kubernetes Service cluster to a workspace using two different names. Each new attachment will break the previous existing attachment(s).

    If you want to reattach a compute target, for example to change TLS or other cluster configuration setting, you must first remove the existing attachment.

## What's a compute target?

With Azure Machine Learning, you can train your model on various resources or environments, collectively referred to as [__compute targets__](concept-azure-machine-learning-architecture.md#compute-targets). A compute target can be a local machine or a cloud resource, such as an Azure Machine Learning Compute, Azure HDInsight, or a remote virtual machine.  You also use compute targets for model deployment as described in ["Where and how to deploy your models"](how-to-deploy-and-where.md).


## Local computer

When you use your local computer for **training**, there is no need to create a compute target.  Just [submit the training run](how-to-set-up-training-targets.md) from your local machine.

When you use your local computer for **inference**, you must have Docker installed. To perform the deployment, use [LocalWebservice.deploy_configuration()](/python/api/azureml-core/azureml.core.webservice.local.localwebservice#deploy-configuration-port-none-) to define the port that the web service will use. Then use the normal deployment process as described in [Deploy models with Azure Machine Learning](how-to-deploy-and-where.md).

## Remote virtual machines

Azure Machine Learning also supports attaching an Azure Virtual Machine. The VM must be an Azure Data Science Virtual Machine (DSVM). The VM offers a curated choice of tools and frameworks for full-lifecycle machine learning development. For more information on how to use the DSVM with Azure Machine Learning, see [Configure a development environment](how-to-configure-environment.md).

> [!TIP]
> Instead of a remote VM, we recommend using the [Azure Machine Learning compute instance](../concept-compute-instance.md). It is a fully managed, cloud-based compute solution that is specific to Azure Machine Learning. For more information, see [create and manage Azure Machine Learning compute instance](../how-to-create-compute-instance.md).

1. **Create**: Azure Machine Learning cannot create a remote VM for you. Instead, you must create the VM and then attach it to your Azure Machine Learning workspace. For information on creating a DSVM, see [Provision the Data Science Virtual Machine for Linux (Ubuntu)](../data-science-virtual-machine/dsvm-ubuntu-intro.md).

    > [!WARNING]
    > Azure Machine Learning only supports virtual machines that run **Ubuntu**. When you create a VM or choose an existing VM, you must select a VM that uses Ubuntu.
    > 
    > Azure Machine Learning also requires the virtual machine to have a __public IP address__.

1. **Attach**: To attach an existing virtual machine as a compute target, you must provide the resource ID, user name, and password for the virtual machine. The resource ID of the VM can be constructed using the subscription ID, resource group name, and VM name using the following string format: `/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Compute/virtualMachines/<vm_name>`
 
   ```python
   from azureml.core.compute import RemoteCompute, ComputeTarget

   # Create the compute config 
   compute_target_name = "attach-dsvm"
   
   attach_config = RemoteCompute.attach_configuration(resource_id='<resource_id>',
                                                   ssh_port=22,
                                                   username='<username>',
                                                   password="<password>")

   # Attach the compute
   compute = ComputeTarget.attach(ws, compute_target_name, attach_config)

   compute.wait_for_completion(show_output=True)
   ```

   Or you can attach the DSVM to your workspace [using Azure Machine Learning studio](../how-to-create-attach-compute-studio.md#other-compute-targets).

    > [!WARNING]
    > Do not create multiple, simultaneous attachments to the same DSVM from your workspace. Each new attachment will break the previous existing attachment(s).

1. **Configure**: Create a run configuration for the DSVM compute target. Docker and conda are used to create and configure the training environment on the DSVM.

   ```python
   from azureml.core import ScriptRunConfig
   from azureml.core.environment import Environment
   from azureml.core.conda_dependencies import CondaDependencies
   
   # Create environment
   myenv = Environment(name="myenv")
   
   # Specify the conda dependencies
   myenv.python.conda_dependencies = CondaDependencies.create(conda_packages=['scikit-learn'])
   
   # If no base image is explicitly specified the default CPU image "azureml.core.runconfig.DEFAULT_CPU_IMAGE" will be used
   # To use GPU in DSVM, you should specify the default GPU base Docker image or another GPU-enabled image:
   # myenv.docker.enabled = True
   # myenv.docker.base_image = azureml.core.runconfig.DEFAULT_GPU_IMAGE
   
   # Configure the run configuration with the Linux DSVM as the compute target and the environment defined above
   src = ScriptRunConfig(source_directory=".", script="train.py", compute_target=compute, environment=myenv) 
   ```

> [!TIP]
> If you want to __remove__ (detach) a VM from your workspace, use the [RemoteCompute.detach()](/python/api/azureml-core/azureml.core.compute.remotecompute#detach--) method.
>
> Azure Machine Learning does not delete the VM for you. You must manually delete the VM using the Azure portal, CLI, or the SDK for Azure VM.

## <a id="synapse"></a>Apache Spark pools

The Azure Synapse Analytics integration with Azure Machine Learning (preview) allows you to attach an Apache Spark pool backed by Azure Synapse for interactive data exploration and preparation. With this integration, you can have a dedicated compute for data wrangling at scale. For more information, see [How to attach Apache Spark pools powered by Azure Synapse Analytics](how-to-link-synapse-ml-workspaces.md#attach-synapse-spark-pool-as-a-compute).

## Azure HDInsight 

Azure HDInsight is a popular platform for big-data analytics. The platform provides Apache Spark, which can be used to train your model.

1. **Create**:  Azure Machine Learning cannot create an HDInsight cluster for you. Instead, you must create the cluster and then attach it to your Azure Machine Learning workspace. For more information, see [Create a Spark Cluster in HDInsight](../../hdinsight/spark/apache-spark-jupyter-spark-sql.md). 

    > [!WARNING]
    > Azure Machine Learning requires the HDInsight cluster to have a __public IP address__.

    When you create the cluster, you must specify an SSH user name and password. Take note of these values, as you need them to use HDInsight as a compute target.
    
    After the cluster is created, connect to it with the hostname \<clustername>-ssh.azurehdinsight.net, where \<clustername> is the name that you provided for the cluster. 

1. **Attach**: To attach an HDInsight cluster as a compute target, you must provide the resource ID, user name, and password for the HDInsight cluster. The resource ID of the HDInsight cluster can be constructed using the subscription ID, resource group name, and HDInsight cluster name using the following string format: `/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.HDInsight/clusters/<cluster_name>`

    ```python
   from azureml.core.compute import ComputeTarget, HDInsightCompute
   from azureml.exceptions import ComputeTargetException

   try:
    # if you want to connect using SSH key instead of username/password you can provide parameters private_key_file and private_key_passphrase

    attach_config = HDInsightCompute.attach_configuration(resource_id='<resource_id>',
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

   Or you can attach the HDInsight cluster to your workspace [using Azure Machine Learning studio](../how-to-create-attach-compute-studio.md#other-compute-targets).

    > [!WARNING]
    > Do not create multiple, simultaneous attachments to the same HDInsight from your workspace. Each new attachment will break the previous existing attachment(s).

1. **Configure**: Create a run configuration for the HDI compute target. 

   [!code-python[](~/aml-sdk-samples/ignore/doc-qa/how-to-set-up-training-targets/hdi.py?name=run_hdi)]

> [!TIP]
> If you want to __remove__ (detach) an HDInsight cluster from the workspace, use the [HDInsightCompute.detach()](/python/api/azureml-core/azureml.core.compute.hdinsight.hdinsightcompute#detach--) method.
>
> Azure Machine Learning does not delete the HDInsight cluster for you. You must manually delete it using the Azure portal, CLI, or the SDK for Azure HDInsight.

## <a id="azbatch"></a>Azure Batch 

Azure Batch is used to run large-scale parallel and high-performance computing (HPC) applications efficiently in the cloud. AzureBatchStep can be used in an Azure Machine Learning Pipeline to submit jobs to an Azure Batch pool of machines.

To attach Azure Batch as a compute target, you must use the Azure Machine Learning SDK and provide the following information:

-    **Azure Batch compute name**: A friendly name to be used for the compute within the workspace
-    **Azure Batch account name**: The name of the Azure Batch account
-    **Resource Group**: The resource group that contains the Azure Batch account.

The following code demonstrates how to attach Azure Batch as a compute target:

```python
from azureml.core.compute import ComputeTarget, BatchCompute
from azureml.exceptions import ComputeTargetException

# Name to associate with new compute in workspace
batch_compute_name = 'mybatchcompute'

# Batch account details needed to attach as compute to workspace
batch_account_name = "<batch_account_name>"  # Name of the Batch account
# Name of the resource group which contains this account
batch_resource_group = "<batch_resource_group>"

try:
    # check if the compute is already attached
    batch_compute = BatchCompute(ws, batch_compute_name)
except ComputeTargetException:
    print('Attaching Batch compute...')
    provisioning_config = BatchCompute.attach_configuration(
        resource_group=batch_resource_group, account_name=batch_account_name)
    batch_compute = ComputeTarget.attach(
        ws, batch_compute_name, provisioning_config)
    batch_compute.wait_for_completion()
    print("Provisioning state:{}".format(batch_compute.provisioning_state))
    print("Provisioning errors:{}".format(batch_compute.provisioning_errors))

print("Using Batch compute:{}".format(batch_compute.cluster_resource_id))
```

> [!WARNING]
> Do not create multiple, simultaneous attachments to the same Azure Batch from your workspace. Each new attachment will break the previous existing attachment(s).

## Azure Databricks

Azure Databricks is an Apache Spark-based environment in the Azure cloud. It can be used as a compute target with an Azure Machine Learning pipeline.

> [!IMPORTANT]
> Azure Machine Learning cannot create an Azure Databricks compute target. Instead, you must create an Azure Databricks workspace, and then attach it to your Azure Machine Learning workspace. To create a workspace resource, see the [Run a Spark job on Azure Databricks](/azure/databricks/scenarios/quickstart-create-databricks-workspace-portal) document.
> 
> To attach an Azure Databricks workspace from a __different Azure subscription__, you (your Azure AD account) must be granted the **Contributor** role on the Azure Databricks workspace. Check your access in the [Azure portal](https://portal.azure.com/).

To attach Azure Databricks as a compute target, provide the following information:

* __Databricks compute name__: The name you want to assign to this compute resource.
* __Databricks workspace name__: The name of the Azure Databricks workspace.
* __Databricks access token__: The access token used to authenticate to Azure Databricks. To generate an access token, see the [Authentication](/azure/databricks/dev-tools/api/latest/authentication) document.

The following code demonstrates how to attach Azure Databricks as a compute target with the Azure Machine Learning SDK:

```python
import os
from azureml.core.compute import ComputeTarget, DatabricksCompute
from azureml.exceptions import ComputeTargetException

databricks_compute_name = os.environ.get(
    "AML_DATABRICKS_COMPUTE_NAME", "<databricks_compute_name>")
databricks_workspace_name = os.environ.get(
    "AML_DATABRICKS_WORKSPACE", "<databricks_workspace_name>")
databricks_resource_group = os.environ.get(
    "AML_DATABRICKS_RESOURCE_GROUP", "<databricks_resource_group>")
databricks_access_token = os.environ.get(
    "AML_DATABRICKS_ACCESS_TOKEN", "<databricks_access_token>")

try:
    databricks_compute = ComputeTarget(
        workspace=ws, name=databricks_compute_name)
    print('Compute target already exists')
except ComputeTargetException:
    print('compute not found')
    print('databricks_compute_name {}'.format(databricks_compute_name))
    print('databricks_workspace_name {}'.format(databricks_workspace_name))
    print('databricks_access_token {}'.format(databricks_access_token))

    # Create attach config
    attach_config = DatabricksCompute.attach_configuration(resource_group=databricks_resource_group,
                                                           workspace_name=databricks_workspace_name,
                                                           access_token=databricks_access_token)
    databricks_compute = ComputeTarget.attach(
        ws,
        databricks_compute_name,
        attach_config
    )

    databricks_compute.wait_for_completion(True)
```

For a more detailed example, see an [example notebook](https://aka.ms/pl-databricks) on GitHub.

> [!WARNING]
> Do not create multiple, simultaneous attachments to the same Azure Databricks from your workspace. Each new attachment will break the previous existing attachment(s).

## Azure Data Lake Analytics

Azure Data Lake Analytics is a big data analytics platform in the Azure cloud. It can be used as a compute target with an Azure Machine Learning pipeline.

Create an Azure Data Lake Analytics account before using it. To create this resource, see the [Get started with Azure Data Lake Analytics](../../data-lake-analytics/data-lake-analytics-get-started-portal.md) document.

To attach Data Lake Analytics as a compute target, you must use the Azure Machine Learning SDK and provide the following information:

* __Compute name__: The name you want to assign to this compute resource.
* __Resource Group__: The resource group that contains the Data Lake Analytics account.
* __Account name__: The Data Lake Analytics account name.

The following code demonstrates how to attach Data Lake Analytics as a compute target:

```python
import os
from azureml.core.compute import ComputeTarget, AdlaCompute
from azureml.exceptions import ComputeTargetException


adla_compute_name = os.environ.get(
    "AML_ADLA_COMPUTE_NAME", "<adla_compute_name>")
adla_resource_group = os.environ.get(
    "AML_ADLA_RESOURCE_GROUP", "<adla_resource_group>")
adla_account_name = os.environ.get(
    "AML_ADLA_ACCOUNT_NAME", "<adla_account_name>")

try:
    adla_compute = ComputeTarget(workspace=ws, name=adla_compute_name)
    print('Compute target already exists')
except ComputeTargetException:
    print('compute not found')
    print('adla_compute_name {}'.format(adla_compute_name))
    print('adla_resource_id {}'.format(adla_resource_group))
    print('adla_account_name {}'.format(adla_account_name))
    # create attach config
    attach_config = AdlaCompute.attach_configuration(resource_group=adla_resource_group,
                                                     account_name=adla_account_name)
    # Attach ADLA
    adla_compute = ComputeTarget.attach(
        ws,
        adla_compute_name,
        attach_config
    )

    adla_compute.wait_for_completion(True)
```

For a more detailed example, see an [example notebook](https://aka.ms/pl-adla) on GitHub.

> [!WARNING]
> Do not create multiple, simultaneous attachments to the same ADLA from your workspace. Each new attachment will break the previous existing attachment(s).

> [!TIP]
> Azure Machine Learning pipelines can only work with data stored in the default data store of the Data Lake Analytics account. If the data you need to work with is in a non-default store, you can use a [`DataTransferStep`](/python/api/azureml-pipeline-steps/azureml.pipeline.steps.data_transfer_step.datatransferstep) to copy the data before training.

## <a id="aci"></a>Azure Container Instance

Azure Container Instances (ACI) are created dynamically when you deploy a model. You cannot create or attach ACI to your workspace in any other way. For more information, see [Deploy a model to Azure Container Instances](how-to-deploy-azure-container-instance.md).

## <a id="kubernetes"></a>Kubernetes

Azure Machine Learning provides you with the option to attach your own Kubernetes clusters for training and inferencing. See [Configure Kubernetes cluster for Azure Machine Learning](../how-to-attach-kubernetes-anywhere.md).

To detach a Kubernetes cluster from your workspace, use the following method:

```python
compute_target.detach()
```

> [!WARNING]
> Detaching a cluster **does not delete the cluster**. To delete an Azure Kubernetes Service cluster, see [Use the Azure CLI with AKS](../../aks/kubernetes-walkthrough.md#delete-the-cluster). To delete an Azure Arc-enabled Kubernetes cluster, see [Azure Arc quickstart](../../azure-arc/kubernetes/quickstart-connect-cluster.md#clean-up-resources).

## Notebook examples

See these notebooks for examples of training with various compute targets:
* [how-to-use-azureml/training](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training)
* [tutorials/img-classification-part1-training.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/tutorials/image-classification-mnist-data/img-classification-part1-training.ipynb)

[!INCLUDE [aml-clone-in-azure-notebook](../includes/aml-clone-for-examples.md)]

## Next steps

* Use the compute resource to [configure and submit a training run](how-to-set-up-training-targets.md).
* [Tutorial: Train and deploy a model](../tutorial-train-deploy-notebook.md) uses a managed compute target to  train a model.
* Learn how to [efficiently tune hyperparameters](../how-to-tune-hyperparameters.md) to build better models.
* Once you have a trained model, learn [how and where to deploy models](../how-to-deploy-online-endpoints.md).
* [Use Azure Machine Learning with Azure Virtual Networks](../how-to-network-security-overview.md)
