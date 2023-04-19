---
title: Schedule Azure Machine Learning pipeline jobs
titleSuffix: Azure Machine Learning
description: Learn how to schedule pipeline jobs that allow you to automate routine, time-consuming tasks such as data processing, training, and monitoring.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.author: keli19
author: likebupt
ms.reviewer: lagayhar
ms.date: 03/27/2023
ms.topic: how-to
ms.custom: devx-track-python, ignite-2022
---

# Schedule machine learning pipeline jobs

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

In this article, you'll learn how to programmatically schedule a pipeline to run on Azure and use the schedule UI to do the same. You can create a schedule based on elapsed time. Time-based schedules can be used to take care of routine tasks, such as retrain models or do batch predictions regularly to keep them up-to-date. After learning how to create schedules, you'll learn how to retrieve, update and deactivate them via CLI, SDK, and studio UI.

## Prerequisites

- You must have an Azure subscription to use Azure Machine Learning. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

# [Azure CLI](#tab/cliv2)

- Install the Azure CLI and the `ml` extension. Follow the installation steps in [Install, set up, and use the CLI (v2)](how-to-configure-cli.md).

- Create an Azure Machine Learning workspace if you don't have one. For workspace creation, see [Install, set up, and use the CLI (v2)](how-to-configure-cli.md).

# [Python SDK](#tab/python)

- Create an Azure Machine Learning workspace if you don't have one.
- The [Azure Machine Learning SDK v2 for Python](/python/api/overview/azure/ai-ml-readme).

# [studio UI](#tab/ui)

- An Azure Machine Learning workspace. See [Create workspace resources](quickstart-create-resources.md).
- Understanding of Azure Machine Learning pipelines. See [what are machine learning pipelines](concept-ml-pipelines.md), and how to create pipeline job in [CLI v2](how-to-create-component-pipelines-cli.md) or [SDK v2](how-to-create-component-pipeline-python.md).

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

# [studio UI](#tab/ui)

> [!NOTE]
> Currently, Azure Machine Learning schedules (v2) only support pipeline job.
>
>The UI functions are only for Azure Machine Learning schedules (v2), which means v1 schedules created based on published pipelines or pipeline endpoints are not supported in UI - will NOT be listed or accessed in UI. However, you can create v2 schedules for your v1 pipeline jobs using SDK/CLI v2, or UI.

When you have a pipeline job with satisfying performance and outputs, you can set up a schedule to automatically trigger this job on a regular basis.

1. In pipeline job detail page, select **Schedule** -> **Create new schedule** to open the schedule creation wizard.  

    :::image type="content" source="./media/how-to-schedule-pipeline-job/schedule-entry-button.png" alt-text="Screenshot of the jobs tab with schedule button selecting showing the create new schedule button." lightbox= "./media/how-to-schedule-pipeline-job/schedule-entry-button.png":::

2. The *Basic settings* of  the schedule creation wizard contain following properties.

    :::image type="content" source="./media/how-to-schedule-pipeline-job/create-schedule-basic-settings.png" alt-text="Screenshot of schedule creation wizard showing the basic settings." lightbox= "./media/how-to-schedule-pipeline-job/create-schedule-basic-settings.png":::

    - **Name**: the unique identifier of the schedule within the workspace.
    - **Description**: description of the schedule.
    - **Trigger**: specifies the recurrence pattern of the schedule, including following properties.
      - **Time zone**: the time zone based on which to calculate the trigger time, by default is (UTC) Coordinated Universal Time.
      - **Recurrence** or **Cron expression**: select recurrence to specify the recurring pattern. Under **Recurrence**, you can specify the recurrence frequency as minutely, hourly, daily, weekly and monthly.
      - **Start**: specifies the date from when the schedule becomes active. By default it's the date you create this schedule.
      - **End**: specifies the date after when the schedule becomes inactive. By default its NONE, which means the schedule will always be active until you manually disable it.
      - **Tags**: tags of the schedule.

    After you configure the basic settings, you can directly select **Review + Create**, and the schedule will automatically submit jobs according to the recurrence pattern you specified.

---
> [!NOTE]
> The following properties that need to be specified apply for CLI and SDK.

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

# [studio UI](#tab/ui)

When you have a pipeline job with satisfying performance and outputs, you can set up a schedule to automatically trigger this job on a regular basis.

1. In pipeline job detail page, select **Schedule** -> **Create new schedule** to open the schedule creation wizard.

2. The *Basic settings* of the schedule creation wizard contain following properties.

    - **Name**: the unique identifier of the schedule within the workspace.
    - **Description**: description of the schedule.
    - **Trigger**: specifies the recurrence pattern of the schedule, including following properties.
      - **Time zone**: the time zone based on which to calculate the trigger time, by default is (UTC) Coordinated Universal Time.
      - **Recurrence** or **Cron expression**: select cron expression to specify the recurring pattern. **Cron expression** allows you to specify more flexible and customized recurrence pattern.
      - **Start**: specifies the date from when the schedule becomes active. By default it's the date you create this schedule.
      - **End**: specifies the date after when the schedule becomes inactive. By default it's NONE, which means the schedule will always be active until you manually disable it.
      - **Tags**: tags of the schedule.

    After you configure the basic settings, you can directly select Review + Create, and the schedule will automatically submit jobs according to the recurrence pattern you specified.

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

Limitations:

- Currently Azure Machine Learning v2 schedule doesn't support event-based trigger.
- You can specify complex recurrence pattern containing multiple trigger timestamps using Azure Machine Learning SDK/CLI v2, while UI only displays the complex pattern and doesn't support editing.
- If you set the recurrence as the 31st day of every month, in months with less than 31 days, the schedule won't trigger jobs.

### Change runtime settings when defining schedule

When defining a schedule using an existing job, you can change the runtime settings of the job. Using this approach, you can define multi-schedules using the same job with different inputs.

# [Azure CLI](#tab/cliv2)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

:::code language="yaml" source="~/azureml-examples-main/cli/schedules/cron-with-settings-job-schedule.yml":::

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/schedules/job-schedule.ipynb?name=change_run_settings)]

# [studio UI](#tab/ui)

1. Sometimes you may want the jobs triggered by schedules have different configurations from the test jobs. In **Advanced settings** in the schedule creation wizard, you can modify the job inputs/outputs, and run time settings, based on the current job.

    In the substep **Job inputs & outputs**, you can modify inputs and outputs for the future jobs triggered by schedules. You may want the jobs triggered by schedules running with dynamic parameters values. Currently you can use following MACRO expression for job inputs and outputs path.

    | Expression                           | Description             |
    |--------------------------------------|-------------------------|
    | `${{name}}`                          | name of the job         |
    | `${{creation_context.trigger_time}}` | trigger time of the job |

      :::image type="content" source="./media/how-to-schedule-pipeline-job/create-schedule-advanced-settings-inputs-outputs.png" alt-text="Screenshot of create new schedule on the advanced settings job inputs and outputs tab." lightbox= "./media/how-to-schedule-pipeline-job/create-schedule-advanced-settings-inputs-outputs.png":::

    In the substep **Job runtime settings**, you can modify compute and other run time settings for jobs triggered by the schedule.

    :::image type="content" source="./media/how-to-schedule-pipeline-job/create-schedule-advanced-settings-runtime.png" alt-text="Screenshot of schedule creation wizard showing the job runtime settings." lightbox= "./media/how-to-schedule-pipeline-job/create-schedule-advanced-settings-runtime.png":::


2. Select **Review + Create** to review the schedule settings you've configured.

    :::image type="content" source="./media/how-to-schedule-pipeline-job/create-schedule-review.png" alt-text="Screenshot of schedule creation wizard showing the review of the schedule settings." lightbox= "./media/how-to-schedule-pipeline-job/create-schedule-review.png":::

3. Select **Review + Create** to finish the creation. There will be notification when the creation is completed.

---

Following properties can be changed when defining schedule:

| Property | Description |
| --- | --- |
|settings| A dictionary of settings to be used when running the pipeline job. |
|inputs| A dictionary of inputs to be used when running the pipeline job. |
|outputs| A dictionary of inputs to be used when running the pipeline job. |
|experiment_name|Experiment name of triggered job.|

> [!NOTE]
> Studio UI users can only modify input, output, and runtime settings when creating a schedule. `experiment_name` can only be changed using the CLI or SDK.

### Expressions supported in schedule

When define schedule, we support following expression that will be resolved to real value during job runtime.

| Expression | Description |Supported properties|
|----------------|----------------|-------------|
|`${{creation_context.trigger_time}}`|The time when the schedule is triggered.|String type inputs of pipeline job|
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

# [studio UI](#tab/ui)

See [Create a time-based schedule with recurrence pattern](#create-a-time-based-schedule-with-recurrence-pattern) or [Create a time-based schedule with cron expression](#create-a-time-based-schedule-with-cron-expression).

---

### List schedules in a workspace

# [Azure CLI](#tab/cliv2)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

:::code language="azurecli" source="~/azureml-examples-main/cli/schedules/schedule.sh" ID="list_schedule":::

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/schedules/job-schedule.ipynb?name=list_schedule)]

# [studio UI](#tab/ui)

In the studio portal, under **Jobs** extension select the **All schedules** tab, where you can find all your job schedules created by SDK/CLI/UI in a single list.
In the schedule list, you can have an overview of all schedules in this workspace.

:::image type="content" source="./media/how-to-schedule-pipeline-job/schedule-list.png" alt-text="Screenshot of the all schedule tabs showing the list of schedule in this workspace." lightbox= "./media/how-to-schedule-pipeline-job/schedule-list.png":::

---

### Check schedule detail

# [Azure CLI](#tab/cliv2)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

:::code language="azurecli" source="~/azureml-examples-main/cli/schedules/schedule.sh" ID="show_schedule":::

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/schedules/job-schedule.ipynb?name=show_schedule)]

# [studio UI](#tab/ui)

You can select a schedule name to show the schedule detail page. The schedule detail page contains the following tabs:

- **Overview**: basic information of this schedule.

    :::image type="content" source="./media/how-to-schedule-pipeline-job/schedule-detail-overview.png" alt-text="Screenshot of the overview tab in the schedule detail page." lightbox= "./media/how-to-schedule-pipeline-job/schedule-detail-overview.png":::

- **Job definition**: defines the job triggered by this schedule.

  :::image type="content" source="./media/how-to-schedule-pipeline-job/schedule-detail-job-definition.png" alt-text="Screenshot of the job definition tab in the schedule detail page." lightbox= "./media/how-to-schedule-pipeline-job/schedule-detail-job-definition.png":::

- **Jobs history**: a list of all jobs triggered by this schedule.

 :::image type="content" source="./media/how-to-schedule-pipeline-job/schedule-detail-jobs-history.png" alt-text="Screenshot of the jobs history tab in the schedule detail page." lightbox= "./media/how-to-schedule-pipeline-job/schedule-detail-jobs-history.png":::

---

### Update a schedule

# [Azure CLI](#tab/cliv2)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

:::code language="azurecli" source="~/azureml-examples-main/cli/schedules/schedule.sh" ID="update_schedule":::

> [!NOTE]
> If you would like to update more than just tags/description, it is recomend to use `az ml schedule create --file update_schedule.yml`

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/schedules/job-schedule.ipynb?name=create_schedule)]

# [studio UI](#tab/ui)

#### Update a new version pipeline to existing schedule


Once you set up a schedule to do retraining or batch inference on production regularly, you may still work on fine tuning or optimizing the model.

When you have a new version pipeline job with optimized performance, you can update the new version pipeline to an existing schedule.

1. In the new version pipeline job detail page, select **Schedule** -> **Update to existing schedule**.

     :::image type="content" source="./media/how-to-schedule-pipeline-job/update-to-existing-schedule.png" alt-text="Screenshot of the jobs tab with schedule button selected showing update to existing schedule button." lightbox= "./media/how-to-schedule-pipeline-job/update-to-existing-schedule.png":::

2. Select an existing schedule from the table. 

    :::image type="content" source="./media/how-to-schedule-pipeline-job/update-select-schedule.png" alt-text="Screenshot of update select schedule showing the select schedule tab." lightbox= "./media/how-to-schedule-pipeline-job/update-select-schedule.png":::

> [!IMPORTANT]
> Make sure you select the correct schedule you want to update. Once you finish update, the schedule will trigger different jobs.

3. You can also modify the job inputs/outputs, and run time settings for the future jobs triggered by the schedule.

4. Select **Review + Update** to finish the update process. There will be notification when update is completed.

5. After update is completed, in the schedule detail page, you can view the new job definition.

#### Update in schedule detail page

In schedule detail page, you can select **Update settings** to update the basic settings and advanced settings (including job input/output and runtime settings) of the schedule.

:::image type="content" source="./media/how-to-schedule-pipeline-job/schedule-update-settings.png" alt-text="Screenshot of update settings showing the basic settings tab." lightbox= "./media/how-to-schedule-pipeline-job/schedule-update-settings.png":::

--- 

### Disable a schedule

# [Azure CLI](#tab/cliv2)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

:::code language="azurecli" source="~/azureml-examples-main/cli/schedules/schedule.sh" ID="disable_schedule":::

# [Python SDK](#tab/python)

[!notebook-python[] (~/azureml-examples-main/sdk/python/schedules/job-schedule.ipynb?name=disable_schedule)]

# [studio UI](#tab/ui)

On the schedule detail page, you can disable the current schedule. You can also disable schedules from the **All schedules** tab.

---

### Enable a schedule

# [Azure CLI](#tab/cliv2)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

:::code language="azurecli" source="~/azureml-examples-main/cli/schedules/schedule.sh" ID="enable_schedule":::

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/schedules/job-schedule.ipynb?name=enable_schedule)]

# [studio UI](#tab/ui)

On the schedule detail page, you can enable the current schedule. You can also enable schedules from the **All schedules** tab.

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

> [!NOTE]
> For a simpler way to find all jobs triggered by a schedule, see the *Jobs history* on the *schedule detail page* using the studio UI.

---

## Delete a schedule

> [!IMPORTANT]
> A schedule must be disabled to be deleted. Delete is an unrecoverable action. After a schedule is deleted, you can never access or recover it.

# [Azure CLI](#tab/cliv2)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

:::code language="azurecli" source="~/azureml-examples-main/cli/schedules/schedule.sh" ID="delete_schedule":::  

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/schedules/job-schedule.ipynb?name=delete_schedule)]

# [studio UI](#tab/ui)

You can delete a schedule from the schedule detail page or all schedules tab.

---
## RBAC (Role-based-access-control) support

Since schedules are usually used for production, to reduce impact of misoperation, workspace admins may want to restrict access to creating and managing schedules within a workspace.

Currently there are three action rules related to schedules and you can configure in Azure portal. You can learn more details about [how to manage access to an Azure Machine Learning workspace.](how-to-assign-roles.md#create-custom-role)

| Action | Description                                                                | Rule                                                          |
|--------|----------------------------------------------------------------------------|---------------------------------------------------------------|
| Read   | Get and list schedules in Machine Learning workspace                        | Microsoft.MachineLearningServices/workspaces/schedules/read   |
| Write  | Create, update, disable and enable schedules in Machine Learning workspace | Microsoft.MachineLearningServices/workspaces/schedules/write  |
| Delete | Delete a schedule in Machine Learning workspace                            | Microsoft.MachineLearningServices/workspaces/schedules/delete |

## Frequently asked questions

- Why my schedules created by SDK aren't listed in UI?

    The schedules UI is for v2 schedules. Hence, your v1 schedules won't be listed or accessed via UI.

    However, v2 schedules also support v1 pipeline jobs. You don't have to publish pipeline first, and you can directly set up schedules for a pipeline job.

- Why my schedules don't trigger job at the time I set before?
  - By default schedules will use UTC timezone to calculate trigger time. You can specify timezone in the creation wizard, or update timezone in schedule detail page.
  - If you set the recurrence as the 31st day of every month, in months with less than 31 days, the schedule won't trigger jobs.
  - If you're using cron expressions, MONTH isn't supported. If you pass a value, it will be ignored and treated as *. This is a known limitation.
- Are event-based schedules supported?
  - No, V2 schedule does not support event-based schedules.

## Next steps

* Learn more about the [CLI (v2) schedule YAML schema](./reference-yaml-schedule.md).
* Learn how to [create pipeline job in CLI v2](how-to-create-component-pipelines-cli.md).
* Learn how to [create pipeline job in SDK v2](how-to-create-component-pipeline-python.md).
* Learn more about [CLI (v2) core YAML syntax](reference-yaml-core-syntax.md).
* Learn more about [Pipelines](concept-ml-pipelines.md).
* Learn more about [Component](concept-component.md).
