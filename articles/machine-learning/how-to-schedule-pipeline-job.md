---
title: Schedule Azure Machine Learning pipeline jobs (preview)
titleSuffix: Azure Machine Learning
description: Schedule pipeline jobs allow you to automate routine, time-consuming tasks such as data processing, training, and monitoring.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.author: cloga
author: lochen
ms.date: 07/30/2022
ms.topic: how-to
ms.custom: devx-track-python

# Customer intent: As a Python coding data scientist, I want to improve my operational efficiency by scheduling my training pipeline jobs of my model using the latest data. 
---

# Schedule machine learning pipeline jobs

In this article, you'll learn how to programmatically schedule a pipeline to run on Azure. You can create a schedule based on elapsed time. Time-based schedules can be used to take care of routine tasks, such as retrain model or do batch predictions regularly to keep them up-to-date using the new coming. After learning how to create schedules, you'll learn how to retrieve, update and deactivate them via CLI and SDK.

## Prerequisites

* You must have an Azure subscription to use Azure Machine Learning. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* Install the Azure CLI and the `ml` extension. Follow the installation steps in [Install, set up, and use the CLI (v2)](how-to-configure-cli.md).

* Create an Azure Machine Learning workspace if you don't have one. For workspace creation, see [Install, set up, and use the CLI (v2)](how-to-configure-cli.md). 

* The [Azure Machine Learning SDK v2 for Python](/python/api/overview/azure/ml/installv2).

## Use CLI v2 to schedule a pipeline job

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

Creating schedule in CLI v2, you need create schedule yaml first. Please check [CLI (v2) batch endpoint YAML schema](./reference-yaml-schedule.md) for detail. 
## Create a schedule yaml

To run a pipeline job on a recurring basis, you'll create a schedule. A `Schedule` associates a job, and a trigger. The trigger can either be `cron` that use cron expression to describes the wait between runs or `recurrence` that specify using what frequency to trigger job. In each case, you need define a pipeline job first, it can be existing pipeline jobs or pipeline job define in yaml, please refer to [Create a pipeline job](how-to-train-cli.md#hello-pipelines).


### Create a time-based schedule yaml use recurrence pattern

:::code language="yaml" source="~/azureml-examples-main/cli/schedules/recurrence-schedule.yml":::

This schedule refer existing pipeline job in workspace. Customer also can refer a pipeline job yaml in local.

The `trigger` section contains following properties:

- **(Required)** `type` specifies the schedule type is `recurrence`.

- **(Required)** `frequency` specifies he unit of time that describes how often the schedule fires. Can be `minute`, `hour`, `day`, `week`, `month`.
  
- **(Required)** `interval` specifies how often the schedule fires based on the frequency, which is the number of time units to wait until the schedule fires again.
  
- (Optional) `start_time` describes the start date and time with timezone. If `start_time` is omitted, the first job will run instantly and the future jobs will be triggered based on the schedule, saying start_time will be equal to the job created time. If the start time is in the past, the first job will run at the next calculated run time. 

- (Optional) `pattern` defines the recurrence pattern, containing `hours`, `minutes`, and `weekdays`. 
    - When `frequency` is `day`, pattern can specify `hours` and `minutes`.
    - When `frequency` is `week` and `month`, pattern can specify `hours`, `minutes` and `weekdays`.
    - `hours` should be an integer or a list, from 0 to 23.
    - `minutes` should be an integer or a list, from 0 to 59.
    - `weekdays` can be a string or list from `monday` to `sunday`.
    - If `pattern` is omitted, the job(s) will be triggered according to the logic of `start_time`, `frequecy` and `interval`.

- (Optional) `time_zone` specifies the time zone of the recurrence. If omitted, by default is UTC. See [appendix for timezone values]

### Create a time-based schedule yaml use cron expression

:::code language="yaml" source="~/azureml-examples-main/cli/schedules/recurrence-schedule.yml":::

This schedule refer a pipeline job yaml in local. Customer also can refer a existing pipeline job in workspace.

### Manage schedule via CLI

#### Create schedule via CLI
After you create schedule yaml, you can use following command to create schedule via CLI.
:::code language="azurecli" source="~/azureml-examples-main/cli/schedules/schedule.sh" ID="create_schedule" :::    

#### Check schedule detail via CLI



#### List all schedules in a workspace via CLI

#### Update a schedule via CLI
#### Disable/Enable a schedule via CLI

### Query triggered jobs from a schedule via CLI



### Optional arguments when creating a schedule

In addition to the arguments discussed previously, you may set the `status` argument to `"Disabled"` to create an inactive schedule. Finally, the `continue_on_step_failure` allows you to pass a Boolean that will override the pipeline's default failure behavior.

## View your scheduled pipelines

In your Web browser, navigate to Azure Machine Learning. From the **Endpoints** section of the navigation panel, choose **Pipeline endpoints**. This takes you to a list of the pipelines published in the Workspace.

:::image type="content" source="./media/how-to-trigger-published-pipeline/scheduled-pipelines.png" alt-text="Pipelines page of AML":::

In this page you can see summary information about all the pipelines in the Workspace: names, descriptions, status, and so forth. Drill in by clicking in your pipeline. On the resulting page, there are more details about your pipeline and you may drill down into individual runs.

## Deactivate the pipeline

If you have a `Pipeline` that is published, but not scheduled, you can disable it with:

```python
pipeline = PublishedPipeline.get(ws, id=pipeline_id)
pipeline.disable()
```

If the pipeline is scheduled, you must cancel the schedule first. Retrieve the schedule's identifier from the portal or by running:

```python
ss = Schedule.list(ws)
for s in ss:
    print(s)
```

Once you have the `schedule_id` you wish to disable, run:

```python
def stop_by_schedule_id(ws, schedule_id):
    s = next(s for s in Schedule.list(ws) if s.id == schedule_id)
    s.disable()
    return s

stop_by_schedule_id(ws, schedule_id)
```

If you then run `Schedule.list(ws)` again, you should get an empty list.

## ## Use SDK v2 to schedule a pipeline job

## Next steps

In this article, you used the Azure Machine Learning SDK for Python to schedule a pipeline in two different ways. One schedule recurs based on elapsed clock time. The other schedule runs if a file is modified on a specified `Datastore` or within a directory on that store. You saw how to use the portal to examine the pipeline and individual runs. You learned how to disable a schedule so that the pipeline stops running. Finally, you created an Azure Logic App to trigger a pipeline. 

For more information, see:

> [!div class="nextstepaction"]
> [Use Azure Machine Learning Pipelines for batch scoring](tutorial-pipeline-batch-scoring-classification.md)

* Learn more about [pipelines](concept-ml-pipelines.md)
* Learn more about [exploring Azure Machine Learning with Jupyter](samples-notebooks.md)
