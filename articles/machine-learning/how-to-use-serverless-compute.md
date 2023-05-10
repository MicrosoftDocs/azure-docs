---
title: Model training on serverless compute (preview)
titleSuffix: Azure Machine Learning
description: You no longer need to create your own compute cluster to train your model in a scalable way.  You can now use a compute cluster that Azure Machine Learning has made available for you.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.author: vijetaj
author: vijetajo
ms.reviewer: sgilley
ms.date: 05/09/2023
---

# Model training on serverless compute (preview)

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

You no longer need to [create a compute cluster](./how-to-create-attach-compute-cluster.md) to train your model in a scalable way. Your job can instead be submitted to a new compute type, called _serverless compute_.  Serverless compute is a compute resource that you don't create, it's created, scaled, and managed by Azure Machine Learning for you.  You focus on specifying your job specification and resources the job needs, and let Azure Machine Learning take care of the rest. You don't need to create and manage compute lifecycle anymore to run training jobs or to learn about various compute concepts.
There is no need to repeatedly create clusters for each VM size needed, using same settings, and replicating for each workspace. 

You can also optimize costs by specifying the exact resources each job needs at runtime in terms of instance type (VM size) and instance count. You can monitor the utilization metrics of the job to optimize the resources a job would neeed.

When you create your own compute cluster, you use its name in the command job, such as `compute="cpu-cluster"`.  Skip creation of a compute cluster, and omit the `compute` parameter to instead use serverless compute.  When `compute` isn't specified for a command job, the job runs on serverless compute.

[!INCLUDE [machine-learning-preview-generic-disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## How to use serverless compute

* Omit the compute name in your CLI or SDK jobs to use serverless compute in:

  * Command jobs, including interactive jobs, parallel jobs, and distributed training
  * AutoML jobs
  * Sweep jobs

* For CLI pipelines use `default_compute: azureml:serverless` for your default compute.  For SDK pipelines use `default_compute="serverless"`. See [Pipeline job](#pipeline-job) for an example.
* To use serverless in Azure Machine Learning studio, first enable the feature in the **Manage previews** section:

    :::image type="content" source="media/how-to-use-serverless-compute/enable-preview.png" alt-text="Screenshot shows how to enable serverless compute in studio." lightbox="media/how-to-use-serverless-compute/enable-preview.png":::

* When you [submit a training job in studio (preview)](how-to-train-with-ui.md), select **Serverless** as your compute cluster.
* When using [Azure Machine Learning designer](concept-designer.md), select **Serverless** as your compute cluster.

> [!IMPORTANT]
> If you want to use serverless compute with a workspace that is configured for network isolation, the workspace must be using a managed virtual network (preview). For more information see [workspace managed network isolation]().
<!--how-to-managed-network.md  -->

## Performance considerations

Serverless compute can help speed up your training in the following ways:

**Insufficient quota:** When you create your own compute cluster, you're responsible for figuring out what VM size and node count to create.  When your job runs, if you don't have sufficient quota for the cluster the job will fail.  Serverless compute uses information about your quota to select an appropriate VM size by default.  

**Scale down optimization:** When a compute cluster is scaling down, a new job has to wait for scale down to happen and then scale up before job can run. With serverless compute, you don't have to wait for scale down and your job can start runnng on another cluster/node (assuming you have quota).

**Cluster busy optimization:** when a job is running on a compute cluster and another job is submitted, your job is queued behind the currently running job. With serverless compute, you get another node/another cluster to start running the job (assuming you have quota).

## Quota

When submitting the job, you still need sufficient quota to proceed (both workspace and subscription level quota).  The default VM size/family is selected based on this quota.  If you specify your own VM size/family:

* If you have some quota for your VM size/family, but not sufficient quota for the number of instances, you'll see an error.  The error recommends decreasing the number of instances to a valid number based on your quota limit or request a quota increase for this VM family
* If you don't have quota for your specified VM size, you'll see an error.  The error recommends selecting a different VM size for which you do have quota or request quota for this VM family
* If you do have sufficient quota for VM family to run the serverless job, but it's currently consumed by other jobs, you'll get a warning that your job must wait in a queue.  

When you [view your usage and quota in the Azure portal](how-to-manage-quotas.md#view-your-usage-and-quotas-in-the-azure-portal), you'll see the name "Serverless" as another compute resource whenever you're using serverless compute.

## Identity support and credential pass through

* **User credential pass through** : Serverless compute fully supports credential pass through. The user token of the user who is submitting the job is used for storage access. These credentials are from your Azure Active directory. User credential pass through is the default.

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

* **User-assigned managed identity** : When you have a workspace configured with [user-assigned managed identity](how-to-identity-based-service-authentication.md#workspace), you can use that identity for the serverless job.

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

    ---

  For information on attaching user-assigned managed identity, see [attach user assigned managed identity](./how-to-submit-spark-jobs.md#attach-user-assigned-managed-identity-using-cli-v2).

## Configure properties

If no compute target is specified for command, parallel, sweep, and AutoML jobs then the compute defaults to serverless compute.
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
* CPU virtual machine, determined based on quota, performance, cost, and disk size.
* Dedicated priority
* Workspace location

You can override these defaults.  If you want to specify the VM type or number of nodes for serverless compute, add `resources` to your job:

* `instance_type` to choose a specific VM.  Use this parameter if you want a GPU family.
* `instance_count` to specify the number of nodes.

    # [Python SDK](#tab/python)
    ```python
    from azure.ai.ml import command 
    from azure.ai.ml import MLClient # Handle to the workspace
    from azure.identity import DefaultAzureCredential # Authentication package
    from azure.ai.ml.entities import ResourceConfiguration 

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
        resources = ResourceConfiguration(instance_type="Standard_NC24", instance_count=4)
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

* To change priority, use `queue_settings` to choose between Dedicated VMs (`job_tier: Standard`) and Low priority(`jobtier: Spot`).

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

## Example for all fields

Here's an example of all fields specified including identity.

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
## AutoML job

# [Python SDK](#tab/python)

If you want to specify the type or instance count, use the `ResourceConfiguration` class.

[!notebook-python[] (~/azureml-examples-vj/sdk/python/jobs/automl-standalone-jobs/automl-classification-task-bankmarketing/automl-classification-task-bankmarketing-serverless.ipynb?name=classification-configuration)]

# [Azure CLI](#tab/cli)

If you want to specify the type or instance count, add a  `resources` section.

:::code language="yaml" source="~/azureml-examples-vj/cli/jobs/automl-standalone-jobs/cli-automl-classification-task-bankmarketing/cli-automl-classification-task-bankmarketing-serverless.yml":::

---

## Pipeline job 

# [Python SDK](#tab/python)

For a pipeline job, specify `"serverless"` as your default compute type to use serverless compute.

[!notebook-python[] (~/azureml-examples-vj/sdk/python/jobs/pipelines/1a_pipeline_with_components_from_yaml/pipeline_with_components_from_yaml_serverless.ipynb?name=build-pipeline)]

# [Azure CLI](#tab/cli)

For a pipeline job, specify `azureml:serverless` as your default compute type to use serverless compute.  

:::code language="yaml" source="~/azureml-examples-vj/cli/jobs/pipelines-with-components/basics/1b_e2e_registered_components/pipeline-serverless.yml":::






---

## Next steps

View more examples of training with serverless compute at [azureml-examples](https://github.com/Azure/azureml-examples)
