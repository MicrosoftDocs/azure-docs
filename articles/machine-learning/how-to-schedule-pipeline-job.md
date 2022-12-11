---
title: Schedule Azure Machine Learning pipeline jobs (preview)
titleSuffix: Azure Machine Learning
description: Learn how to schedule pipeline jobs that allow you to automate routine, time-consuming tasks such as data processing, training, and monitoring.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.author: lochen
author: cloga
ms.date: 08/15/2022
ms.topic: how-to
ms.custom: devx-track-python, ignite-2022
---

# Schedule machine learning pipeline jobs (preview)

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

In this article, you'll learn how to programmatically schedule a pipeline to run on Azure. You can create a schedule based on elapsed time. Time-based schedules can be used to take care of routine tasks, such as retrain models or do batch predictions regularly to keep them up-to-date. After learning how to create schedules, you'll learn how to retrieve, update and deactivate them via CLI and SDK.

## Prerequisites

- You must have an Azure subscription to use Azure Machine Learning. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

# [Azure CLI](#tab/cliv2)

- Install the Azure CLI and the `ml` extension. Follow the installation steps in [Install, set up, and use the CLI (v2)](how-to-configure-cli.md).

- Create an Azure Machine Learning workspace if you don't have one. For workspace creation, see [Install, set up, and use the CLI (v2)](how-to-configure-cli.md).

# [Python SDK](#tab/python)

- Create an Azure Machine Learning workspace if you don't have one.
- The [Azure Machine Learning SDK v2 for Python](/python/api/overview/azure/ml/installv2).

---

## Schedule a pipeline job

To run a pipeline job on a recurring basis, you'll need to create a schedule. A `Schedule` associates a job, and a trigger. The trigger can either be `cron` that use cron expression to describe the wait between runs or `recurrence` that specify using what frequency to trigger job. In each case, you need to define a pipeline job first, it can be existing pipeline jobs or a pipeline job define inline, refer to [Create a pipeline job in CLI](how-to-create-component-pipelines-cli.md) and [Create a pipeline job in SDK](how-to-create-component-pipeline-python.md).

You can schedule a pipeline job yaml in local or an existing pipeline job in workspace.

## Create a schedule

### Create a time-based schedule with recurrence pattern

# [Azure CLI](#tab/cliv2)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

:::code language="yaml"source="~/azureml-examples-main/cli/schedules/recurrence-job-schedule.yml":::

`trigger` contains the following properties:

- **(Required)**  `type` specifies the schedule type is `recurrence`. It can also be `cron`, see details in the next section.

List continues below.

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/schedules/job-schedule.ipynb?name=create_schedule_recurrence)]

`RecurrenceTrigger` contains following properties:

- **(Required)** To provide better coding experience, we use `RecurrenceTrigger` for recurrence schedule.

List continues below.

---

- **(Required)** `frequency` specifies the unit of time that describes how often the schedule fires. Can be `minute`, `hour`, `day`, `week`, `month`.
  
- **(Required)** `interval` specifies how often the schedule fires based on the frequency, which is the number of time units to wait until the schedule fires again.
  
- (Optional) `schedule` defines the recurrence pattern, containing `hours`, `minutes`, and `weekdays`.
    - When `frequency` is `day`, pattern can specify `hours` and `minutes`.
    - When `frequency` is `week` and `month`, pattern can specify `hours`, `minutes` and `weekdays`.
    - `hours` should be an integer or a list, from 0 to 23.
    - `minutes` should be an integer or a list, from 0 to 59.
    - `weekdays` can be a string or list from `monday` to `sunday`.
    - If `schedule` is omitted, the job(s) will be triggered according to the logic of `start_time`, `frequency` and `interval`.

- (Optional) `start_time` describes the start date and time with timezone. If `start_time` is omitted, start_time will be equal to the job created time. If the start time is in the past, the first job will run at the next calculated run time.

- (Optional) `end_time` describes the end date and time with timezone. If `end_time` is omitted, the schedule will continue trigger jobs until the schedule is manually disabled.  

- (Optional) `time_zone` specifies the time zone of the recurrence. If omitted, by default is UTC. To learn more about timezone values, see [appendix for timezone values](reference-yaml-schedule.md#appendix).

### Create a time-based schedule with cron expression

# [Azure CLI](#tab/cliv2)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

:::code language="yaml" source="~/azureml-examples-main/cli/schedules/cron-job-schedule.yml":::

The `trigger` section defines the schedule details and contains following properties:

- **(Required)** `type` specifies the schedule type is `cron`.

List continues below. 

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/schedules/job-schedule.ipynb?name=create_schedule_cron)]

The `CronTrigger` section defines the schedule details and contains following properties:

- **(Required)** To provide better coding experience, we use `CronTrigger` for recurrence schedule.

List continues below. 

---

- **(Required)** `expression` uses standard crontab expression to express a recurring schedule. A single expression is composed of five space-delimited fields:

    `MINUTES HOURS DAYS MONTHS DAYS-OF-WEEK`

    - A single wildcard (`*`), which covers all values for the field. So a `*` in days means all days of a month (which varies with month and year).
    - The `expression: "15 16 * * 1"` in the sample above means the 16:15PM on every Monday.
    - The table below lists the valid values for each field:
 
        | Field          |   Range  | Comment                                                   |
        |----------------|----------|-----------------------------------------------------------|
        | `MINUTES`      |    0-59  | -                                                         |
        | `HOURS`        |    0-23  | -                                                         |
        | `DAYS`         |    -  |    Not supported. The value will be ignored and treat as `*`.    |
        | `MONTHS`       |    -  | Not supported. The value will be ignored and treat as `*`.        |
        | `DAYS-OF-WEEK` |    0-6   | Zero (0) means Sunday. Names of days also accepted. |

    - To learn more about how to use crontab expression, see  [Crontab Expression wiki on GitHub ](https://github.com/atifaziz/NCrontab/wiki/Crontab-Expression).

    > [!IMPORTANT]
    > `DAYS` and `MONTH` are not supported. If you pass a value, it will be ignored and treat as `*`.

- (Optional) `start_time` specifies the start date and time with timezone of the schedule. `start_time: "2022-05-10T10:15:00-04:00"` means the schedule starts from 10:15:00AM on 2022-05-10 in UTC-4 timezone. If `start_time` is omitted, the `start_time` will be equal to schedule creation time. If the start time is in the past, the first job will run at the next calculated run time.

- (Optional) `end_time` describes the end date and time with timezone. If `end_time` is omitted, the schedule will continue trigger jobs until the schedule is manually disabled.  

- (Optional) `time_zone`specifies the time zone of the expression. If omitted, by default is UTC. See [appendix for timezone values](reference-yaml-schedule.md#appendix).

### Change runtime settings when defining schedule

When defining a schedule using an existing job, you can change the runtime settings of the job. Using this approach, you can define multi-schedules using the same job with different inputs.

# [Azure CLI](#tab/cliv2)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

:::code language="yaml" source="~/azureml-examples-main/cli/schedules/cron-with-settings-job-schedule.yml":::

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/schedules/job-schedule.ipynb?name=change_run_settings)]

---

Following properties can be changed when defining schedule:

| Property | Description |
| --- | --- |
|settings| A dictionary of settings to be used when running the pipeline job. |
|inputs| A dictionary of inputs to be used when running the pipeline job. |
|outputs| A dictionary of inputs to be used when running the pipeline job. |
|experiment_name|Experiment name of triggered job.|

### Expressions supported in schedule

When define schedule, we support following expression that will be resolved to real value during job runtime.

| Expression | Description |Supported properties|
|----------------|----------------|-------------|
|`${{create_context.trigger_time}}`|The time when the schedule is triggered.|String type inputs of pipeline job|
|`${{name}}`|The name of job.|outputs.path of pipeline job|

## Manage schedule

### Create schedule

# [Azure CLI](#tab/cliv2)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

After you create the schedule yaml, you can use the following command to create a schedule via CLI.

:::code language="azurecli" source="~/azureml-examples-main/cli/schedules/schedule.sh" ID="create_schedule":::

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/schedules/job-schedule.ipynb?name=create_schedule)]

---

### Check schedule detail

# [Azure CLI](#tab/cliv2)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

:::code language="azurecli" source="~/azureml-examples-main/cli/schedules/schedule.sh" ID="show_schedule":::

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/schedules/job-schedule.ipynb?name=show_schedule)]

---

### List schedules in a workspace

# [Azure CLI](#tab/cliv2)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

:::code language="azurecli" source="~/azureml-examples-main/cli/schedules/schedule.sh" ID="list_schedule":::

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/schedules/job-schedule.ipynb?name=list_schedule)]

---

### Update a schedule

# [Azure CLI](#tab/cliv2)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

:::code language="azurecli" source="~/azureml-examples-main/cli/schedules/schedule.sh" ID="update_schedule":::

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/schedules/job-schedule.ipynb?name=create_schedule)]

---

### Disable a schedule

# [Azure CLI](#tab/cliv2)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

:::code language="azurecli" source="~/azureml-examples-main/cli/schedules/schedule.sh" ID="disable_schedule":::

# [Python SDK](#tab/python)

[!notebook-python[] (~/azureml-examples-main/sdk/python/schedules/job-schedule.ipynb?name=disable_schedule)]

---

### Enable a schedule

# [Azure CLI](#tab/cliv2)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

:::code language="azurecli" source="~/azureml-examples-main/cli/schedules/schedule.sh" ID="enable_schedule":::

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/schedules/job-schedule.ipynb?name=enable_schedule)]

---

## Query triggered jobs from a schedule

All the display name of jobs triggered by schedule will have the display name as <schedule_name>-YYYYMMDDThhmmssZ. For example, if a schedule with a name of named-schedule is created with a scheduled run every 12 hours starting at 6 AM on Jan 1 2021, then the display names of the jobs created will be as follows:

- named-schedule-20210101T060000Z
- named-schedule-20210101T180000Z
- named-schedule-20210102T060000Z
- named-schedule-20210102T180000Z, and so on

:::image type="content" source="media/how-to-schedule-pipeline-job/schedule-triggered-pipeline-jobs.png" alt-text="Screenshot of the jobs tab in the Azure Machine Learning studio filtering by job display name." lightbox= "media/how-to-schedule-pipeline-job/schedule-triggered-pipeline-jobs.png":::

You can also apply [Azure CLI JMESPath query](/cli/azure/query-azure-cli) to query the jobs triggered by a schedule name.

:::code language="azurecli" source="~/azureml-examples-main/CLI/schedules/schedule.sh" ID="query_triggered_jobs":::  

---

## Delete a schedule

> [!IMPORTANT]
> A schedule must be disabled to be deleted.

# [Azure CLI](#tab/cliv2)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

:::code language="azurecli" source="~/azureml-examples-main/cli/schedules/schedule.sh" ID="delete_schedule":::  

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/schedules/job-schedule.ipynb?name=delete_schedule)]

---

## Next steps

* Learn more about the [CLI (v2) schedule YAML schema](./reference-yaml-schedule.md).
* Learn how to [create pipeline job in CLI v2](how-to-create-component-pipelines-cli.md).
* Learn how to [create pipeline job in SDK v2](how-to-create-component-pipeline-python.md).
* Learn more about [CLI (v2) core YAML syntax](reference-yaml-core-syntax.md).
* Learn more about [Pipelines](concept-ml-pipelines.md).
* Learn more about [Component](concept-component.md).


> [!NOTE]
> Information the user should notice even if skimming
