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
ms.date: 04/20/2023
---

# Model training on serverless compute (preview)

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

You no longer need to [create a compute cluster](./how-to-create-attach-compute-cluster.md) to train your model in a scalable way. Your job can instead be submitted to a new compute type, called _serverless compute_.  Serverless compute is a compute resource that you don't create, it's created on the fly for you.  You focus on specifying your job specification, and let Azure Machine Learning take care of the rest.

When you create your own compute cluster, you use its name in the command job, such as `compute="cpu-cluster"`.  Skip creation of a compute cluster, and omit the `compute` parameter to instead use serverless compute.  When `compute` isn't specified for a command job, the job runs on serverless compute.

[!INCLUDE [machine-learning-preview-generic-disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## How to use serverless compute

* Omit the compute name in your CLI or SDK jobs to use serverless compute in:

  * Command jobs, including interactive jobs, parallel jobs, and distributed training
  * Sweep jobs
  * Spark jobs
  * AutoML

* For CLI or SDK pipelines, specify `azureml:serverless` as your default compute.  See [Pipeline job](#pipeline-job) for an example.
* To use serverless in Azure Machine Learning studio, first enable the feature in the **Manage previews** section:

    :::image type="content" source="media/how-to-use-serverless-compute/enable-preview.png" alt-text="Screenshot shows how to enable serverless compute in studio." lightbox="media/how-to-use-serverless-compute/enable-preview.png":::

* When you [submit a training job in studio (preview)](how-to-train-with-ui.md), select **Serverless** as your compute cluster.
* When using [Azure Machine Learning designer](concept-designer.md), select **Serverless** as your compute cluster.

> [!IMPORTANT]
> If you want to use serverless compute with a workspace that is configured for network isolation, the workspace must be using a managed virtual network (preview). For more information see [workspace managed network isolation]().
<!--how-to-managed-network.md  -->

## Performance considerations

Serverless compute can help speed up your training in the following ways:

* **Insufficient quota:** When you create your own compute cluster, you're responsible for figuring out what VM family and node size to create.  When your job runs, if you don't have sufficient quota for the cluster the job will fail.  Serverless compute uses information about your quota to select an appropriate family and node size.  

**Scale down optimization:** When a cluster is scaling down, a new job has to wait for scale down to happen and then scale up before job can run. With serverless compute, you don't have to wait for scale down and your job starts on another cluster/node (assuming you have quota).

**Cluster busy optimization:** when a job is running on a compute cluster and another job is submitted, your job is queued behind the currently running job. With serverless compute, you get another node/another cluster to start running the job (assuming you have quota).

## Quota

When submitting the job, you still need sufficient quota to proceed (both workspace and subscription level quota).  The default VM size/family is selected based on this quota.  If you specify your own VM size/family:

* If you have some quota for your VM size/family, but not sufficient quota for the number of instances, you'll see an error.  The error recommends decreasing the number of instances to a valid number based on your quota limit or request a quota increase for this VM family
* If you don't have quota for your specified VM size, you'll see an error.  The error recommends selecting a different VM size for which you do have quota or request quota for this VM family
* If you do have sufficient quota for VM family, but it's currently consumed by other jobs, you'll get a warning that your job must wait in a queue.  

When you [view your usage and quota in the Azure portal](how-to-manage-quotas.md#view-your-usage-and-quotas-in-the-azure-portal), you'll see the name "Serverless" as another compute resource whenever you're using serverless compute.

## Identity support and credential pass through

* **User credential pass through** : Serverless compute fully supports credential pass through. The user token of the user who is submitting the job is used for storage access. These credentials are from your Azure Active directory. User credential pass through is the default.

    ```yaml
    identity:
      type: user_identity
    ```

* **User-assigned managed identity** : When you have a workspace configured with [user-assigned managed identity](how-to-identity-based-service-authentication.md#workspace), specify the type as `managed`.

    ```yaml
    identity:
      type: managed
    ```

  For information on attaching user-assigned managed identity, see [attach user assigned managed identity](/how-to-submit-spark-jobs.md#attach-user-assigned-managed-identity-using-cli-v2).

## Configure properties

If no compute target is specified for command, parallel, sweep, and AutoML jobs then the compute defaults to serverless compute.
For instance, for this command job:

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
command: echo "hello world"
environment:
  image: library/python:latest
```

The compute defaults to serverless compute with:

* Single node for this job.  The default number of nodes is based on the type of job.  See following sections for other job types.
* CPU virtual machine, determined based on quota, performance, cost, and disk size.
* Dedicated priority
* Workspace location

You can override these defaults.  If you want to specify the VM type or number of nodes for serverless compute, add `resources` to your job:

* `instance_type` to choose a specific VM.  Use this parameter if you want a GPU family.
* `instance_count` to specify the number of nodes.

    ```yaml
    $schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
    command: echo "hello world"
    environment:
      image: library/python:latest
    resources:
      instance_count: 4
      instance_type: Standard_NC24 
    ```

* To change priority, use `queue_settings` to choose between Dedicated VMs (`job_tier: Standard`) and Low priority(`jobtier: Spot`).

    ```yaml
    $schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
    component: ./train.yml 
    queue_settings:
       job_tier: Standard #Possible Values are Standard (dedicated), Spot (low priority). Default is Standard.
    ```

## Example for all fields

Here's an example of all fields specified including identity.

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
component: ./train.yml 
resources:
  instance_count: 4
  instance_type: Standard_NC24 
identity:
  type:  user_identity # can be managed too
queue_settings:
   job_tier: Standard #Possible Values are Standard, Spot. Default is Standard.
```

## Sweep job

The resources field is used in a Sweep job to define the default instance_type while the *limits.max_concurrent_trials* is used to default number of nodes for serverless compute. This default makes it more likely trial runs run concurrently without being gated by the size of compute cluster.  If your quota for this size isn't sufficient, you should override the default with your own values.

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/sweepJob.schema.json
type: sweep
trial:
  command: >-
    python hello-sweep.py
    --A ${{inputs.A}}
    --B ${{search_space.B}}
    --C ${{search_space.C}}
  code: src
  environment: azureml:AzureML-sklearn-1.0-ubuntu20.04-py38-cpu@latest
inputs:
  A: 0.5
resources:
  instance_type: Standard_NC12
sampling_algorithm: random
search_space:
  B:
    type: choice
    values: ["hello", "world", "hello_world"]
  C:
    type: uniform
    min_value: 0.1
    max_value: 1.0
objective:
  goal: minimize
  primary_metric: random_metric
limits:
  max_total_trials: 4
  max_concurrent_trials: 2
  timeout: 3600
display_name: hello-sweep-example
experiment_name: hello-sweep-example
description: Hello sweep job example.
```

## Pipeline job 

For a pipeline job, specify `azureml:serverless` as your default compute type to use serverless compute.

```yaml
$schema: http://azureml/sdk-2-0/PipelineJob.json
type: pipeline
description: "E2E dummy train-score-eval pipeline with jobs defined inline in pipeline job"

inputs:
  pipeline_job_training_input: 
    path: file:./data
  pipeline_job_test_input:
    path: file:./data
  pipeline_job_training_max_epocs: 20
  pipeline_job_training_learning_rate: 1.8
  pipeline_job_learning_rate_schedule: 'time-based'

outputs: 
  pipeline_job_trained_model:
    mode: rw_mount
  pipeline_job_scored_data:
    mode: rw_mount
  pipeline_job_evaluation_report:
    mode: rw_mount

settings:
  default_compute: azureml:serverless

jobs:
  train-job:
    type: command
    code: ./train_src
    environment: azureml:AzureML-sklearn-0.24-ubuntu18.04-py37-cpu:5
    command: >-
        python train.py 
        --training_data ${{inputs.training_data}} 
        --max_epocs ${{inputs.max_epocs}}   
        --learning_rate ${{inputs.learning_rate}} 
        --learning_rate_schedule ${{inputs.learning_rate_schedule}} 
        --model_output ${{outputs.model_output}}
    inputs:
        training_data: ${{parent.inputs.pipeline_job_training_input}}
        max_epocs: ${{parent.inputs.pipeline_job_training_max_epocs}}
        learning_rate: ${{parent.inputs.pipeline_job_training_learning_rate}}
        learning_rate_schedule: ${{parent.inputs.pipeline_job_learning_rate_schedule}}
    outputs:
        model_output: ${{parent.outputs.pipeline_job_trained_model}}
    resources:
      instance_count: 2
      instance_type: Standard_NC6
    queue_settings:
      job_tier: standard  

  score-job:
    type: command
    code: ./score_src
    environment: azureml:AzureML-sklearn-0.24-ubuntu18.04-py37-cpu:5
    command: >-
        python score.py 
        --model_input ${{inputs.model_input}} 
        --test_data ${{inputs.test_data}}
        --score_output ${{outputs.score_output}}
    inputs:
        model_input: ${{parent.jobs.train-job.outputs.model_output}}
        test_data: ${{parent.inputs.pipeline_job_test_input}}
    outputs:
        score_output: ${{parent.outputs.pipeline_job_scored_data}}
    resources:
      instance_count: 1
      instance_type: Standard_NC12
    queue_settings:
      job_tier: standard  
```

## Next steps

View more examples of training with serverless compute at [azureml-examples](https://github.com/Azure/azureml-examples)