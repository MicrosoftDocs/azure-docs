---
title: Model training on serverless compute
titleSuffix: Azure Machine Learning
description: You no longer need to create your own compute cluster to train your model in a scalable way.  You can now use a compute cluster that Azure Machine Learning has made available for you.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.custom:
  - build-2023
  - ignite-2023
ms.topic: how-to
ms.author: vijetaj
author: vijetajo
ms.reviewer: sgilley
ms.date: 10/23/2023
---

# Model training on serverless compute

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

You no longer need to [create and manage compute](./how-to-create-attach-compute-cluster.md) to train your model in a scalable way. Your job can instead be submitted to a new compute target type, called _serverless compute_. Serverless compute is the easiest way to run training jobs on Azure Machine Learning. Serverless compute is a fully managed, on-demand compute. Azure Machine Learning creates, scales, and manages the compute for you. Through model training with serverless compute, machine learning  professionals can focus on their expertise of building machine learning models and not have to learn about compute infrastructure or setting it up.

Machine learning professionals can specify the resources the job needs. Azure Machine Learning manages the compute infrastructure, and provides managed network isolation reducing the burden on you.

Enterprises can also reduce costs by specifying optimal resources for each job. IT Admins can still apply control by specifying cores quota at subscription and workspace level and apply Azure policies.

Serverless compute can be used to fine-tune models in the model catalog such as LLAMA 2. Serverless compute can be used to run all types of jobs from Azure Machine Learning studio, SDK and CLI.  Serverless compute can also be used for building environment images and for responsible AI dashboard scenarios. Serverless jobs consume the same quota as Azure Machine Learning compute quota. You can choose standard (dedicated) tier or spot (low-priority) VMs. Managed identity and user identity are supported for serverless jobs. Billing model is the same as Azure Machine Learning compute.

## Advantages of serverless compute

* Azure Machine Learning manages creating, setting up, scaling, deleting, patching, compute infrastructure reducing management overhead
* You don't need to learn about compute, various compute types, and related properties. 
* There's no need to repeatedly create clusters for each VM size needed, using same settings, and replicating for each workspace.  
* You can optimize costs by specifying the exact resources each job needs at runtime in terms of instance type (VM size) and instance count. You can monitor the utilization metrics of the job to optimize the resources a job would need.
* Reduction in steps involved to run a job
* To further simplify job submission, you can skip the resources altogether. Azure Machine Learning defaults the instance count and chooses an instance type (VM size) based on factors like quota, cost, performance and disk size. 
* Lesser wait times before jobs start executing in some cases.
* User identity and workspace user-assigned managed identity is supported for job submission. 
* With managed network isolation, you can streamline and automate your network isolation configuration. Customer virtual network is also supported
* Admin control through quota and Azure policies

## How to use serverless compute

* You can finetune foundation models such as LLAMA 2 using notebooks as shown below:
  *  [Fine Tune LLAMA 2](https://github.com/Azure/azureml-examples/blob/bd799ecf31b60cec650e3b0ea2ea790fe0c99c4e/sdk/python/foundation-models/system/finetune/Llama-notebooks/text-classification/emotion-detection-llama-serverless-compute.ipynb)
  *  [Fine Tune LLAMA 2 using multiple nodes](https://github.com/Azure/azureml-examples/blob/84ddcf23566038dfbb270da81c5b34b6e0fb3e5d/sdk/python/foundation-models/system/finetune/Llama-notebooks/multinode-text-classification/emotion-detection-llama-multinode-serverless.ipynb)
* When you create your own compute cluster, you use its name in the command job, such as `compute="cpu-cluster"`.  With serverless, you can skip creation of a compute cluster, and omit the `compute` parameter to instead use serverless compute.  When `compute` isn't specified for a job, the job runs on serverless compute. Omit the compute name in your CLI or SDK jobs to use serverless compute in the following job types and optionally provide resources a job would need in terms of instance count and instance type:

  * Command jobs, including interactive jobs and distributed training
  * AutoML jobs
  * Sweep jobs
  * Parallel jobs

* For pipeline jobs through CLI use `default_compute: azureml:serverless` for pipeline level default compute.  For pipelines jobs through SDK use `default_compute="serverless"`. See [Pipeline job](#pipeline-job) for an example.

* When you [submit a training job in studio (preview)](how-to-train-with-ui.md), select **Serverless** as the compute type.
* When using [Azure Machine Learning designer](concept-designer.md), select **Serverless** as default compute.
* You can use serverless compute for responsible AI dashboard
  * [AutoML Image Classification scenario with RAI Dashboard](https://github.com/Azure/azureml-examples/blob/main/sdk/python/responsible-ai/vision/responsibleaidashboard-automl-image-classification-fridge.ipynb) 

## Performance considerations

Serverless compute can help speed up your training in the following ways:

**Insufficient quota:** When you create your own compute cluster, you're responsible for figuring out what VM size and node count to create.  When your job runs, if you don't have sufficient quota for the cluster the job fails.  Serverless compute uses information about your quota to select an appropriate VM size by default.  

**Scale down optimization:** When a compute cluster is scaling down, a new job has to wait for scale down to happen and then scale up before job can run. With serverless compute, you don't have to wait for scale down and your job can start running on another cluster/node (assuming you have quota).

**Cluster busy optimization:** when a job is running on a compute cluster and another job is submitted, your job is queued behind the currently running job. With serverless compute, you get another node/another cluster to start running the job (assuming you have quota).

## Quota

When submitting the job, you still need sufficient Azure Machine Learning compute quota to proceed (both workspace and subscription level quota).  The default VM size for serverless jobs is selected based on this quota.  If you specify your own VM size/family:

* If you have some quota for your VM size/family, but not sufficient quota for the number of instances, you see an error.  The error recommends decreasing the number of instances to a valid number based on your quota limit or request a quota increase for this VM family or changing the VM size
* If you don't have quota for your specified VM size, you see an error.  The error recommends selecting a different VM size for which you do have quota or request quota for this VM family
* If you do have sufficient quota for VM family to run the serverless job, but other jobs are using the quota, you get a message that your job must wait in a queue until quota is available  

When you [view your usage and quota in the Azure portal](how-to-manage-quotas.md#view-your-usage-and-quotas-in-the-azure-portal), you see the name "Serverless" to see all the quota consumed by serverless jobs.

## Identity support and credential pass through

* **User credential pass through** : Serverless compute fully supports user credential pass through. The user token of the user who is submitting the job is used for storage access. These credentials are from your Microsoft Entra ID. 

    # [Python SDK](#tab/python)

    ```python
    from azure.ai.ml import command
    from azure.ai.ml import MLClient     # Handle to the workspace
    from azure.identity import DefaultAzureCredential     # Authentication package
    from azure.ai.ml.entities import ResourceConfiguration
    from azure.ai.ml.entities import UserIdentityConfiguration 

    credential = DefaultAzureCredential()
    # Get a handle to the workspace. You can find the info on the workspace tab on ml.azure.com
    ml_client = MLClient(
        credential=credential,
        subscription_id="<Azure subscription id>", 
        resource_group_name="<Azure resource group>",
        workspace_name="<Azure Machine Learning Workspace>",
    )
    job = command(
        command="echo 'hello world'",
        environment="AzureML-sklearn-1.0-ubuntu20.04-py38-cpu@latest",
            identity=UserIdentityConfiguration(),
    )
    # submit the command job
    ml_client.create_or_update(job)
    ```

    # [Azure CLI](#tab/cli)

    ```yml
    $schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
    command: echo "hello world"
    environment:
      image: azureml:AzureML-sklearn-1.0-ubuntu20.04-py38-cpu@latest
    identity:
      type: user_identity
    ```

    ---

* **User-assigned managed identity** : When you have a workspace configured with [user-assigned managed identity](how-to-identity-based-service-authentication.md#workspace), you can use that identity with the serverless job for storage access.

    # [Python SDK](#tab/python)

    ```python
    from azure.ai.ml import command
    from azure.ai.ml import MLClient     # Handle to the workspace
    from azure.identity import DefaultAzureCredential    # Authentication package
    from azure.ai.ml.entities import ResourceConfiguration
    from azure.ai.ml.entities import ManagedIdentityConfiguration

    credential = DefaultAzureCredential()
    # Get a handle to the workspace. You can find the info on the workspace tab on ml.azure.com
    ml_client = MLClient(
        credential=credential,
        subscription_id="<Azure subscription id>", 
        resource_group_name="<Azure resource group>",
        workspace_name="<Azure Machine Learning Workspace>",
    )
    job = command(
        command="echo 'hello world'",
        environment="AzureML-sklearn-1.0-ubuntu20.04-py38-cpu@latest",
            identity= ManagedIdentityConfiguration(),
    )
    # submit the command job
    ml_client.create_or_update(job)

    ```

    # [Azure CLI](#tab/cli)

    ```yaml
    $schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
    command: echo "hello world"
    environment:
      image: azureml:AzureML-sklearn-1.0-ubuntu20.04-py38-cpu@latest
    identity:
      type: managed
    ````

  ---

  For information on attaching user-assigned managed identity, see [attach user assigned managed identity](./how-to-submit-spark-jobs.md#attach-user-assigned-managed-identity-using-cli-v2).

## Configure properties for command jobs

If no compute target is specified for command, sweep, and AutoML jobs then the compute defaults to serverless compute.
For instance, for this command job:

# [Python SDK](#tab/python)

```python
from azure.ai.ml import command
from azure.ai.ml import command 
from azure.ai.ml import MLClient # Handle to the workspace
from azure.identity import DefaultAzureCredential # Authentication package

credential = DefaultAzureCredential()
# Get a handle to the workspace. You can find the info on the workspace tab on ml.azure.com
ml_client = MLClient(
    credential=credential,
    subscription_id="<Azure subscription id>", 
    resource_group_name="<Azure resource group>",
    workspace_name="<Azure Machine Learning Workspace>",
)
job = command(
    command="echo 'hello world'",
    environment="AzureML-sklearn-1.0-ubuntu20.04-py38-cpu@latest",
)
# submit the command job
ml_client.create_or_update(job)
```

# [Azure CLI](#tab/cli)

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
command: echo "hello world"
environment:
  image: library/python:latest
```

---

The compute defaults to serverless compute with:

* Single node for this job.  The default number of nodes is based on the type of job.  See following sections for other job types.
* CPU virtual machine, which is determined based on quota, performance, cost, and disk size.
* Dedicated virtual machines
* Workspace location

You can override these defaults.  If you want to specify the VM type or number of nodes for serverless compute, add `resources` to your job:

* `instance_type` to choose a specific VM.  Use this parameter if you want a specific CPU/GPU VM size
* `instance_count` to specify the number of nodes.

    # [Python SDK](#tab/python)
    ```python
    from azure.ai.ml import command 
    from azure.ai.ml import MLClient # Handle to the workspace
    from azure.identity import DefaultAzureCredential # Authentication package
    from azure.ai.ml.entities import JobResourceConfiguration 

    credential = DefaultAzureCredential()
    # Get a handle to the workspace. You can find the info on the workspace tab on ml.azure.com
    ml_client = MLClient(
        credential=credential,
        subscription_id="<Azure subscription id>", 
        resource_group_name="<Azure resource group>",
        workspace_name="<Azure Machine Learning Workspace>",
    )
    job = command(
        command="echo 'hello world'",
        environment="AzureML-sklearn-1.0-ubuntu20.04-py38-cpu@latest",
        resources = JobResourceConfiguration(instance_type="Standard_NC24", instance_count=4)
    )
    # submit the command job
    ml_client.create_or_update(job)
    ```

    # [Azure CLI](#tab/cli)

    ```yaml
    $schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
    command: echo "hello world"
    environment:
      image: library/python:latest
    resources:
      instance_count: 4
      instance_type: Standard_NC24 
    ```

    ---

* To change job tier, use `queue_settings` to choose between Dedicated VMs (`job_tier: Standard`) and Low priority(`jobtier: Spot`).

    # [Python SDK](#tab/python)

    ```python
    from azure.ai.ml import command
    from azure.ai.ml import MLClient    # Handle to the workspace
    from azure.identity import DefaultAzureCredential    # Authentication package
    credential = DefaultAzureCredential()
    # Get a handle to the workspace. You can find the info on the workspace tab on ml.azure.com
    ml_client = MLClient(
        credential=credential,
        subscription_id="<Azure subscription id>", 
        resource_group_name="<Azure resource group>",
        workspace_name="<Azure Machine Learning Workspace>",
    )
    job = command(
        command="echo 'hello world'",
        environment="AzureML-sklearn-1.0-ubuntu20.04-py38-cpu@latest",
        queue_settings={
          "job_tier": "spot"  
        }
    )
    # submit the command job
    ml_client.create_or_update(job)
    ```

    # [Azure CLI](#tab/cli)
    ```yaml
    $schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
    component: ./train.yml 
    queue_settings:
       job_tier: Standard #Possible Values are Standard (dedicated), Spot (low priority). Default is Standard.
    ```
    

## Example for all fields with command jobs

Here's an example of all fields specified including identity the job should use. There's no need to specify virtual network settings as workspace level managed network isolation is automatically used.

# [Python SDK](#tab/python)

```python
from azure.ai.ml import command
from azure.ai.ml import MLClient      # Handle to the workspace
from azure.identity import DefaultAzureCredential     # Authentication package
from azure.ai.ml.entities import ResourceConfiguration
from azure.ai.ml.entities import UserIdentityConfiguration 

credential = DefaultAzureCredential()
# Get a handle to the workspace. You can find the info on the workspace tab on ml.azure.com
ml_client = MLClient(
    credential=credential,
    subscription_id="<Azure subscription id>", 
    resource_group_name="<Azure resource group>",
    workspace_name="<Azure Machine Learning Workspace>",
)
job = command(
    command="echo 'hello world'",
    environment="AzureML-sklearn-1.0-ubuntu20.04-py38-cpu@latest",
         identity=UserIdentityConfiguration(),
    queue_settings={
      "job_tier": "Standard"  
    }
)
job.resources = ResourceConfiguration(instance_type="Standard_E4s_v3", instance_count=1)
# submit the command job
ml_client.create_or_update(job)
```

# [Azure CLI](#tab/cli)
```yaml
$schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
command: echo "hello world"
environment:
  image: azureml:AzureML-sklearn-1.0-ubuntu20.04-py38-cpu@latest
queue_settings:
   job_tier: Standard #Possible Values are Standard, Spot. Default is Standard.
identity:
  type: user_identity #Possible values are Managed, user_identity
resources:
  instance_count: 1
  instance_type: Standard_E4s_v3 

```

---
View more examples of training with serverless compute at:-
* [Quick Start](https://github.com/Azure/azureml-examples/blob/main/tutorials/get-started-notebooks/quickstart.ipynb)
* [Train Model](https://github.com/Azure/azureml-examples/blob/main/tutorials/get-started-notebooks/train-model.ipynb)
  
## AutoML job

There's no need to specify compute for AutoML jobs. Resources can be optionally specified. If instance count isn't specified, then it's defaulted based on max_concurrent_trials and max_nodes parameters. If you submit an AutoML image classification or NLP task with no instance type, the GPU VM size is automatically selected. It's possible to submit AutoML job through CLIs, SDK, or Studio. To submit AutoML jobs with serverless compute in studio first enable the [submit a training job in studio (preview)](how-to-train-with-ui.md) feature in the preview panel.

# [Python SDK](#tab/python)

If you want to specify the type or instance count, use the `ResourceConfiguration` class.

[!notebook-python[] (~/azureml-examples-main/sdk/python/jobs/automl-standalone-jobs/automl-classification-task-bankmarketing/automl-classification-task-bankmarketing-serverless.ipynb?name=classification-configuration)]

# [Azure CLI](#tab/cli)

If you want to specify the type or instance count, add a  `resources` section.

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/automl-standalone-jobs/cli-automl-classification-task-bankmarketing/cli-automl-classification-task-bankmarketing-serverless.yml":::

---

## Pipeline job 

# [Python SDK](#tab/python)

For a pipeline job, specify `"serverless"` as your default compute type to use serverless compute.

[!notebook-python[] (~/azureml-examples-main/sdk/python/jobs/pipelines/1a_pipeline_with_components_from_yaml/pipeline_with_components_from_yaml_serverless.ipynb?name=build-pipeline)]

# [Azure CLI](#tab/cli)

For a pipeline job, specify `azureml:serverless` as your default compute type to use serverless compute.  

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines-with-components/basics/1b_e2e_registered_components/pipeline-serverless.yml":::

---

You can also set serverless compute as the default compute in Designer.

## Next steps

View more examples of training with serverless compute at:-
* [Quick Start](https://github.com/Azure/azureml-examples/blob/main/tutorials/get-started-notebooks/quickstart.ipynb)
* [Train Model](https://github.com/Azure/azureml-examples/blob/main/tutorials/get-started-notebooks/train-model.ipynb)
* [Fine Tune LLAMA 2](https://github.com/Azure/azureml-examples/blob/bd799ecf31b60cec650e3b0ea2ea790fe0c99c4e/sdk/python/foundation-models/system/finetune/Llama-notebooks/text-classification/emotion-detection-llama-serverless-compute.ipynb)
