---
title: Serverless compute - the easiest scalable way to train a model (preview)
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

@@ NEED SDK EXAMPLES

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

You no longer need to [create a compute cluster](./how-to-create-attach-compute-cluster.md) to train your model in a scalable way. Your job can instead be submitted to a new compute type, called _serverless compute_.  Serverless compute is a compute resource that you don't create, it's created on the fly for you.  You focus on specifying your job specification, and let Azure Machine Learning take care of the rest.

When you create a compute cluster, you then specify its name in the command job, such as `compute="cpu-cluster"`.  To use serverless compute, simply omit this `compute` parameter.  When `compute` is not specified, serverless compute is used instead.

Use [workspace managed network isolation (preview)]() to use serverless compute with private endpoints.

[!INCLUDE [machine-learning-preview-generic-disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## How to use serverless compute

* Omit the compute name in your CLI or SDK jobs to use serverless compute in:

  * Command jobs, including interactive jobs, parallel jobs, and distributed training
  * Sweep jobs
  * Spark jobs
  * AutoML

* For CLI or SDK pipelines, specify `azureml:serverless` as your default compute.  See [Pipeline job](#pipeline-job)
* When you [submit a training job in Studio (preview)](how-to-train-with-ui.md), select "Serverless" as your compute cluster.
* When using [Azure Machine Learning designer](concept-designer.md), select "Serverless" as your compute cluster.

## Performance considerations

Serverless compute can help speed up your training in the following ways:

**Scale down optimization:** When a cluster is scaling down and a job is submitted to a compute cluster, the job has to wait for scale down to happen and then scale up before job can run. With serverless compute you don't have to wait for scale down and your job can be started off on another cluster/node (assuming you have quota).

**Cluster busy optimization:** when a job is running on a compute cluster and another job is submitted, your job is queued behind the currently running job. With serverless compute, you'll get another node/another cluster to start running the job (assuming you have quota).

## Quota 

When submitting the job, you'll still need sufficient quota to proceed (both workspace and subscription level quota).  The default VM size/family will be selected based on this quota.  If you specify your own VM size/family:

1. If you have some quota for your VM size/family, but not sufficient quota for the number of instances, you'll see an error with a recommendation to decrease the number of instances to a valid number based on your quota limit or request a quota increase for this VM family
1. If you don't have quota for your specified VM size, you'll see an `error` with a recommendation to select a different VM size for which you do have quota or request quota for this VM family
1. If you do have sufficient quota for VM family, but it is currently consumed by other jobs, you'll get a `warning` that your job must wait in a queue.  

When you [view your usage and quota in the Azure portal](how-to-manage-quotas#view-your-usage-and-quotas-in-the-azure-portal), you'll see the name "Serverless" as another compute resource whenever you're using serverless compute.


## Identity support and credential pass through

* **User credential pass through** : Serverless compute fully supports credential pass through. The user token of the user who is submitting the job is used for storage access. These credentials are from your Azure Active directory login. User credential pass through is the default.

    ```yaml
    identity:
      type: user_identity
    ```

* **User-assigned managed identity** : When you have a workspace created with [user-assigned managed identity](how-to-identity-based-service-authentication.md#workspace), specify the type as `managed`. 

    ```yaml
    identity:
      type: managed
    ```

## Configure properties

If no compute target is specified for command, parallel, sweep, interactive, AutoML jobs then the compute will be defaulted to serverless compute.
For instance, for this command job:

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
command: echo "hello world"
environment:
  image: library/python:latest
```

The compute defaults to serverless compute with:

* Single node
* CPU virtual machine, determined based on quota, performance, cost, and disk size.
* Dedicated priority compute
* Workspace location

To use serverless compute, omit the compute property when submitting a command.  This will give you a serverless compute with default settings.  

To override the default configuration, add `resources` to your job:

* instance_type
* instance_count

    ```yaml
    $schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
    command: echo "hello world"
    environment:
      image: library/python:latest
    resources:
      instance_count: 4
      instance_type: Standard_NC24 
    ```

* Use `queue_settings` to choose between Dedicated VMs (`job_tier: Standard`) and Low priority(`jobtier: Spot`).

    ```yaml
    $schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
    component: ./train.yml 
    queue_settings:
       job_tier: Standard #Possible Values are Standard (dedicated), Spot (low priority). Default is Standard.
    ```

## Example for all fields

Here is an example of all fields specified including identity.

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
   #job_priority: in the future
```

## Job type examples

The default settings are sometimes determined by the job type, as shown in these examples.

### AutoML job

The resources field is used in an AutoML job to specify instance_type while a combination of limits.max_nodes and limits.max_concurrent_Trials is used to get the default number of nodes in serverless compute and submit jobs.Max_nodes is used for distributed training through AutoML Tabular/NLP/Vision jobs.

```yaml
$schema: https://azuremlsdk2.blob.core.windows.net/preview/0.0.1/autoMLJob.schema.json

type: automl
experiment_name: dpv2-cli-text-ner
description: A text named entity recognition job using CoNLL 2003 data
resources:
  instance_type: Standard_NC24
task: text_ner
primary_metric: accuracy
log_verbosity: debug

limits:
  timeout_minutes: 120
  max_nodes: 4
  max_trials: 2 
  max_concurrent_trials: 2 
 # serverless compute will default to 4-node cluster with 2 distributed training jobs, each job running on 2 nodes

training_data:
  path: "./training-mltable-folder"
  type: mltable
validation_data:
  type: mltable
  path: "./validation-mltable-folder"

# featurization:
#   dataset_language: "eng"

sweep:
  sampling_algorithm: random
  early_termination:
    type: bandit
    evaluation_interval: 2
    slack_amount: 0.05
    delay_evaluation: 6

search_space:
  - model_name:
      type: choice
      values: [bert_base_cased, roberta_base]
  - model_name:
      type: choice
      values: [distilroberta_base]
    weight_decay:
      type: uniform
      min_value: 0.01
      max_value: 0.1
```

### Sweep job

The resources field is used in a Sweep job to define the default instance_type while the *limits.max_concurrent_trials* is used to default number of nodes for serverless compute. This default makes it more likely trial runs will run concurrently without being gated by the size of compute cluster.  If your quota for this size is not sufficient, you should override the default with your own values.

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

### Pipeline job 

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

??? samples on azureml-examples