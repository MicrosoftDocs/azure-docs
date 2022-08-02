---
title: Schedule Azure Machine Learning pipeline jobs (CLI preview)
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

---

# Schedule machine learning pipeline jobs

[!INCLUDE [cli v2](../../includes/machine-learning-CLI-v2.md)]

In this article, you'll learn how to programmatically schedule a pipeline to run on Azure. You can create a schedule based on elapsed time. Time-based schedules can be used to take care of routine tasks, such as retrain model or do batch predictions regularly to keep them up-to-date using the new coming. After learning how to create schedules, you'll learn how to retrieve, update and deactivate them via CLI and SDK.

## Prerequisites

* You must have an Azure subscription to use Azure Machine Learning. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* Install the Azure CLI and the `ml` extension. Follow the installation steps in [Install, set up, and use the CLI (v2)](how-to-configure-cli.md).

* Create an Azure Machine Learning workspace if you don't have one. For workspace creation, see [Install, set up, and use the CLI (v2)](how-to-configure-cli.md). 

## Use CLI v2 to schedule a pipeline job

Creating schedule in CLI v2, you need create schedule yaml first. Please check [CLI (v2) batch endpoint YAML schema](./reference-yaml-schedule.md) for detail. 
### Create a schedule yaml

To run a pipeline job on a recurring basis, you'll create a schedule. A `Schedule` associates a job, and a trigger. The trigger can either be `cron` that use cron expression to describes the wait between runs or `recurrence` that specify using what frequency to trigger job. In each case, you need define a pipeline job first, it can be existing pipeline jobs or pipeline job define in yaml, please refer to [Create a pipeline job](how-to-create-component-pipelines-cli).


#### Create a time-based schedule yaml using recurrence pattern

:::code language="yaml" source="~/azureml-examples-schedule-pup-main/cli/schedules/recurrence-schedule.yml":::

This schedule refer existing pipeline job in workspace. Customer also can refer a pipeline job yaml in local.

The `trigger` section contains following properties:

- **(Required)** `type` specifies the schedule type is `recurrence`. It can also be `recurrence`, see details in the next section.

- **(Required)** `frequency` specifies he unit of time that describes how often the schedule fires. Can be `minute`, `hour`, `day`, `week`, `month`.
  
- **(Required)** `interval` specifies how often the schedule fires based on the frequency, which is the number of time units to wait until the schedule fires again.
  
- (Optional) `start_time` describes the start date and time with timezone. If `start_time` is omitted, the first job will run instantly and the future jobs will be triggered based on the schedule, saying start_time will be equal to the job created time. If the start time is in the past, the first job will run at the next calculated run time. 

- (Optional) `schedule` defines the recurrence pattern, containing `hours`, `minutes`, and `weekdays`. 
    - When `frequency` is `day`, pattern can specify `hours` and `minutes`.
    - When `frequency` is `week` and `month`, pattern can specify `hours`, `minutes` and `weekdays`.
    - `hours` should be an integer or a list, from 0 to 23.
    - `minutes` should be an integer or a list, from 0 to 59.
    - `weekdays` can be a string or list from `monday` to `sunday`.
    - If `pattern` is omitted, the job(s) will be triggered according to the logic of `start_time`, `frequency` and `interval`.

- (Optional) `time_zone` specifies the time zone of the recurrence. If omitted, by default is UTC. See [appendix for timezone values](#appendix).

#### Create a time-based schedule yaml using cron expression

:::code language="yaml" source="~/azureml-examples-schedule-pup-main/CLI/schedules/recurrence-schedule.yml":::

This schedule refer a pipeline job yaml in local. Customer also can refer a existing pipeline job in workspace.

The `schedule` section defines the schedule details and contains following properties:

- **(Required)** `type` specifies the schedule type is `cron`. 
- **(Required)** `expression` uses standard crontab expression to express a recurring schedule. A single expression is composed of 5 space-delimited fields:

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
        | `DAYS-OF-WEEK` |    0-6   | Where zero (0) means Sunday. Names of days also accepted. |

    - See more details about [how to use crontab expression](https://github.com/atifaziz/NCrontab/wiki/Crontab-Expression).

    > [!IMPORTANT]
    > `DAYS` and `MONTH` are not supported for now. If you pass a value, it will be ignored and treat as `*`.

- (Optional) `start_time` specifies the start date and time with timezone of the schedule. `start_time: "2022-05-10T10:15:00-04:00"` means the schedule starts from 10:15:00AM on 2022-05-10 in UTC-4 timezone. If `start_time` is omitted, the first job will run instantly and the future jobs will run based on the schedule. If the start time is in the past, the first job will run at the next calculated run time.

- (Optional) `time_zone`specifies the time zone of the expression. If omitted, by default is UTC. See [appendix for timezone values](#appendix).

#### Change runtime settings when defining schedule
When defining schedule using a existing job, you can change the runtime settings of the job. Using this approach, you can define multi-schedules using same job with different inputs.

:::code language="yaml" source="~/azureml-examples-schedule-pup-main/cli/schedules/cron-with-settings-schedule.yml":::

Following properties can be changed when defining schedule:
| Property | Description |
| --- | --- |
|settings| A dictionary of settings to be used when running the pipeline job. |
|inputs| A dictionary of inputs to be used when running the pipeline job. |
|outputs| A dictionary of inputs to be used when running the pipeline job. |
|experiment|Experiment name of triggered job.|
|tags|Tags of triggered job.|


#### Expressions supported in schedule
When define schedule, we support following expression which will be resolved to real value during job runtime.
| Expression | Description |Supported properties|
|----------------|----------------|-------------|
|${{create_context.trigger_time}}|The time when the schedule is triggered.|String type inputs of pipeline job|
|${{name}}|The name of job.|outputs.path of pipeline job|

### Manage schedule

#### Create schedule
After you create schedule yaml, you can use following command to create schedule via CLI.
:::code language="azurecli" source="~/azureml-examples-schedule-pup-main/cli/schedules/schedule.sh" ID="create_schedule" :::    

#### Check schedule detail

#### List all schedules in a workspace
:::code language="azurecli" source="~/azureml-examples-schedule-pup-main/cli/schedules/schedule.sh" ID="show_schedule" :::   
#### Update a schedule
:::code language="azurecli" source="~/azureml-examples-schedule-pup-main/cli/schedules/schedule.sh" ID="update_schedule" :::   
#### Disable a schedule
:::code language="azurecli" source="~/azureml-examples-schedule-pup-main/cli/schedules/schedule.sh" ID="disable_schedule" :::   
#### Enable a schedule
:::code language="azurecli" source="~/azureml-examples-schedule-pup-main/cli/schedules/schedule.sh" ID="enable_schedule" :::   

### Query triggered jobs from a schedule
All the display name of jobs triggered by schedule will have the display name as <schedule_name>-YYYYMMDDThhmmssZ. For e.g. if a schedule with a name of named-schedule is created with a schedule of run every 12 hours starting 6 AM on Jan 1 2021, then the display names of the jobs created will be as follows:

- named-schedule-20210101T060000Z
- named-schedule-20210101T180000Z
- named-schedule-20210102T060000Z
- named-schedule-20210102T180000Z and so on

You can leverage [azure cli JMESPath query](https://docs.microsoft.com/en-us/cli/azure/query-azure-cli) to query the jobs triggered by a schedule name.
:::code language="azurecli" source="~/azureml-examples-schedule-pup-main/CLI/schedules/schedule.sh" ID="query_triggered_jobs" :::   

### Delete a schedule

:::code language="azurecli" source="~/azureml-examples-schedule-pup-main/cli/schedules/schedule.sh" ID="delete_schedule" :::  

    > [!IMPORTANT]
    > Please disable schedule first, only disabled schedule can be deleted.


## Next steps

In this article, you used the Azure Machine Learning CLI to schedule a pipeline. The schedule support use cron expression and recurrence pattern to define trigger frequency. You saw how to use CLI command to managed the schedule. You learned how to query jobs triggered by schedule.

For more information, see:

* Learn more about [schedule use CLI v2](how-to-schedule-pipeline-job-sdkv2.md)
* Learn more about [create pipeline job in CLI v2](how-to-create-component-pipelines-cli.md)
* Learn more about [CLI (v2) core YAML syntax](reference-yaml-core-syntax.md)
* Learn more about [pipelines](concept-ml-pipelines.md)
* Learn more about [component](concept-component.md)

