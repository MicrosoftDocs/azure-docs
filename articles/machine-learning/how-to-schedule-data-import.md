---
title: Schedule data import (preview)
titleSuffix: Azure Machine Learning
description: Learn how to schedule an automated data import that brings in data from external sources.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.author: ambadal
author: AmarBadal
ms.reviewer: franksolomon
ms.date: 06/19/2023
ms.custom: data4ml, devx-track-azurecli
---

# Schedule data import jobs (preview)

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

In this article, you'll learn how to programmatically schedule data imports and use the schedule UI to do the same. You can create a schedule based on elapsed time. Time-based schedules can be used to take care of routine tasks, such as importing the data regularly to keep them up-to-date. After learning how to create schedules, you'll learn how to retrieve, update and deactivate them via CLI, SDK, and studio UI.

## Prerequisites

- You must have an Azure subscription to use Azure Machine Learning. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

# [Azure CLI](#tab/cli)

- Install the Azure CLI and the `ml` extension. Follow the installation steps in [Install, set up, and use the CLI (v2)](how-to-configure-cli.md).

- Create an Azure Machine Learning workspace if you don't have one. For workspace creation, see [Install, set up, and use the CLI (v2)](how-to-configure-cli.md).

# [Python SDK](#tab/python)

- Create an Azure Machine Learning workspace if you don't have one.
- The [Azure Machine Learning SDK v2 for Python](/python/api/overview/azure/ai-ml-readme).

# [Studio](#tab/azure-studio)

- An Azure Machine Learning workspace. See [Create workspace resources](quickstart-create-resources.md).
- Understanding of Azure Machine Learning pipelines. See [what are machine learning pipelines](concept-ml-pipelines.md), and how to create pipeline job in [CLI v2](how-to-create-component-pipelines-cli.md) or [SDK v2](how-to-create-component-pipeline-python.md).

---

## Schedule data import

To import data on a recurring basis, you must create a schedule. A `Schedule` associates a data import action, and a trigger. The trigger can either be `cron` that use cron expression to describe the wait between runs or `recurrence` that specify using what frequency to trigger job. In each case, you must first define an import data definition. An existing data import, or a data import that is defined inline, works for this. Refer to [Create a data import in CLI, SDK and UI](how-to-import-data-assets.md).

## Create a schedule

### Create a time-based schedule with recurrence pattern

# [Azure CLI](#tab/cli)

[!INCLUDE [CLI v2](includes/machine-learning-cli-v2.md)]

#### YAML: Schedule for data import with recurrence pattern
```yml
$schema: https://azuremlschemas.azureedge.net/latest/schedule.schema.json
name: simple_recurrence_import_schedule
display_name: Simple recurrence import schedule
description: a simple hourly recurrence import schedule

trigger:
  type: recurrence
  frequency: day #can be minute, hour, day, week, month
  interval: 1 #every day
  schedule:
    hours: [4,5,10,11,12]
    minutes: [0,30]
  start_time: "2022-07-10T10:00:00" # optional - default will be schedule creation time
  time_zone: "Pacific Standard Time" # optional - default will be UTC

import_data: ./my-snowflake-import-data.yaml

```
#### YAML: Schedule for data import definition inline with recurrence pattern on managed datastore
```yml
$schema: https://azuremlschemas.azureedge.net/latest/schedule.schema.json
name: inline_recurrence_import_schedule
display_name: Inline recurrence import schedule
description: an inline hourly recurrence import schedule

trigger:
  type: recurrence
  frequency: day #can be minute, hour, day, week, month
  interval: 1 #every day
  schedule:
    hours: [4,5,10,11,12]
    minutes: [0,30]
  start_time: "2022-07-10T10:00:00" # optional - default will be schedule creation time
  time_zone: "Pacific Standard Time" # optional - default will be UTC

import_data:
  type: mltable
  name: my_snowflake_ds
  path: azureml://datastores/workspacemanagedstore
  source:
    type: database
    query: select * from TPCH_SF1.REGION
    connection: azureml:my_snowflake_connection

```

`trigger` contains the following properties:

- **(Required)**  `type` specifies the schedule type, either `recurrence` or `cron`. See the following section for more details.

Next, run this command in the CLI:

```cli
> az ml schedule create -f <file-name>.yml
```

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

```python
from azure.ai.ml.data_transfer import Database
from azure.ai.ml.constants import TimeZone
from azure.ai.ml.entities import (
    ImportDataSchedule,
    RecurrenceTrigger,
    RecurrencePattern,
)
from datetime import datetime

source = Database(connection="azureml:my_sf_connection", query="select * from my_table")

path = "azureml://datastores/workspaceblobstore/paths/snowflake/schedule/${{name}}"


my_data = DataImport(
    type="mltable", source=source, path=path, name="my_schedule_sfds_test"
)

schedule_name = "my_simple_sdk_create_schedule_recurrence"

schedule_start_time = datetime.utcnow()

recurrence_trigger = RecurrenceTrigger(
    frequency="day",
    interval=1,
    schedule=RecurrencePattern(hours=1, minutes=[0, 1]),
    start_time=schedule_start_time,
    time_zone=TimeZone.UTC,
)

import_schedule = ImportDataSchedule(
    name=schedule_name, trigger=recurrence_trigger, import_data=my_data
)

ml_client.schedules.begin_create_or_update(import_schedule).result()

```
`RecurrenceTrigger` contains following properties:

- **(Required)** To provide better coding experience, we use `RecurrenceTrigger` for recurrence schedule.

# [Studio](#tab/azure-studio)

When you have a data import with satisfactory performance and outputs, you can set up a schedule to automatically trigger this import.

   1. Navigate to [Azure Machine Learning studio](https://ml.azure.com)

   1. Under **Assets** in the left navigation, select **Data**. On the **Data import** tab, select the imported data asset to which you want to attach a schedule. The **Import jobs history** page should appear, as shown in this screenshot:

      :::image type="content" source="./media/how-to-schedule-data-import/data-import-list.png" lightbox="./media/how-to-schedule-data-import/data-import-list.png" alt-text="Screenshot highlighting the imported data asset name in the Data imports tab.":::

   1. At the **Import jobs history** page, select the latest **Import job name** link, to open the pipelines job details page as shown in this screenshot:

      :::image type="content" source="./media/how-to-schedule-data-import/data-import-history.png" lightbox="./media/how-to-schedule-data-import/data-import-history.png" alt-text="Screenshot highlighting the imported data asset guid in the Import jobs history tab.":::

   1. At the pipeline job details page of any data import, select **Schedule** -> **Create new schedule** to open the schedule creation wizard, as shown in this screenshot:

      :::image type="content" source="./media/how-to-schedule-data-import/schedule-entry-button.png" lightbox="./media/how-to-schedule-data-import/schedule-entry-button.png" alt-text="Screenshot of the jobs tab, with the create new schedule button.":::

   1. The *Basic settings* of the schedule creation wizard have the properties shown in this screenshot:

      :::image type="content" source="./media/how-to-schedule-data-import/create-schedule-basic-settings.png" lightbox="./media/how-to-schedule-data-import/create-schedule-basic-settings.png" alt-text="Screenshot of schedule creation wizard showing the basic settings.":::

  - **Name**: the unique identifier of the schedule within the workspace.
  - **Description**: the schedule description.
  - **Trigger**: the recurrence pattern of the schedule, which includes the following properties.
    - **Time zone**: the trigger time calculation is based on this time zone; (UTC) Coordinated Universal Time by default.
    - **Recurrence** or **Cron expression**: select recurrence to specify the recurring pattern. Under **Recurrence**, you can specify the recurrence frequency - by minutes, hours, days, weeks, or months.
    - **Start**: the schedule first becomes active on this date. By default, the creation date of this schedule.
    - **End**: the schedule will become inactive after this date. By default, it's NONE, which means that the schedule remains active until you manually disable it.
    - **Tags**: the selected schedule tags.

    After you configure the basic settings, you can select **Review + Create**, and the schedule will automatically submit the data import based on the recurrence pattern you specified. You can also select **Next**, and navigate through the wizard to select or update the data import parameters.

---
> [!NOTE]
> These properties apply to CLI and SDK:

- **(Required)** `frequency` specifies the unit of time that describes how often the schedule fires. Can have values of `minute`, `hour`, `day`, `week`, or `month`.

- **(Required)** `interval` specifies how often the schedule fires based on the frequency, which is the number of time units to wait until the schedule fires again.

- (Optional) `schedule` defines the recurrence pattern, containing `hours`, `minutes`, and `weekdays`.
    - When `frequency` equals `day`, a pattern can specify `hours` and `minutes`.
    - When `frequency` equals `week` and `month`, a pattern can specify `hours`, `minutes` and `weekdays`.
    - `hours` should be an integer or a list, ranging between 0 and 23.
    - `minutes` should be an integer or a list, ranging between 0 and 59.
    - `weekdays` a string or list ranging from `monday` to `sunday`.
    - If `schedule` is omitted, the job(s) triggers according to the logic of `start_time`, `frequency` and `interval`.

- (Optional) `start_time` describes the start date and time, with a timezone. If `start_time` is omitted, start_time equals the job creation time. For a start time in the past, the first job runs at the next calculated run time.

- (Optional) `end_time` describes the end date and time with a timezone. If `end_time` is omitted, the schedule continues to trigger jobs until the schedule is manually disabled.

- (Optional) `time_zone` specifies the time zone of the recurrence. If omitted, the default timezone is UTC. To learn more about timezone values, see [appendix for timezone values](reference-yaml-schedule.md#appendix).

### Create a time-based schedule with cron expression

# [Azure CLI](#tab/cli)

## YAML: Schedule for a data import with cron expression

[!INCLUDE [CLI v2](includes/machine-learning-CLI-v2.md)]

#### YAML: Schedule for data import with cron expression (preview)
```yml
$schema: https://azuremlschemas.azureedge.net/latest/schedule.schema.json
name: simple_cron_import_schedule
display_name: Simple cron import schedule
description: a simple hourly cron import schedule

trigger:
  type: cron
  expression: "0 * * * *"
  start_time: "2022-07-10T10:00:00" # optional - default will be schedule creation time
  time_zone: "Pacific Standard Time" # optional - default will be UTC

import_data: ./my-snowflake-import-data.yaml
```

#### YAML: Schedule for data import definition inline with cron expression (preview)
```yml
$schema: https://azuremlschemas.azureedge.net/latest/schedule.schema.json
name: inline_cron_import_schedule
display_name: Inline cron import schedule
description: an inline hourly cron import schedule

trigger:
  type: cron
  expression: "0 * * * *"
  start_time: "2022-07-10T10:00:00" # optional - default will be schedule creation time
  time_zone: "Pacific Standard Time" # optional - default will be UTC

import_data:
  type: mltable
  name: my_snowflake_ds
  path: azureml://datastores/workspaceblobstore/paths/snowflake/${{name}}
  source:
    type: database
    query: select * from TPCH_SF1.REGION
    connection: azureml:my_snowflake_connection
```

The `trigger` section defines the schedule details and contains following properties:

- **(Required)** `type` specifies the schedule type is `cron`.

```cli
> az ml schedule create -f <file-name>.yml
```

The list continues here:

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

```python
from azure.ai.ml.data_transfer import Database
from azure.ai.ml.constants import TimeZone
from azure.ai.ml.entities import CronTrigger, ImportDataSchedule

source = Database(connection="azureml:my_sf_connection", query="select * from my_table")

path = "azureml://datastores/workspaceblobstore/paths/snowflake/schedule/${{name}}"


my_data = DataImport(
    type="mltable", source=source, path=path, name="my_schedule_sfds_test"
)

schedule_name = "my_simple_sdk_create_schedule_cron"

cron_trigger = CronTrigger(
    expression="15 10 * * 1",
    start_time=datetime.utcnow(),
    end_time="2023-12-03T18:40:00",
)
import_schedule = ImportDataSchedule(
    name=schedule_name, trigger=cron_trigger, import_data=my_data
)
ml_client.schedules.begin_create_or_update(import_schedule).result()

```

The `CronTrigger` section defines the schedule details and contains following properties:

- **(Required)** To provide better coding experience, we use `CronTrigger` for recurrence schedule.

The list continues here:

# [Studio](#tab/azure-studio)

When you have a data import with satisfactory performance and outputs, you can set up a schedule to automatically trigger this import.

   1. Navigate to [Azure Machine Learning studio](https://ml.azure.com)

   1. Under **Assets** in the left navigation, select **Data**. On the **Data import** tab, select the imported data asset to which you want to attach a schedule. The **Import jobs history** page should appear, as shown in this screenshot:

      :::image type="content" source="./media/how-to-schedule-data-import/data-import-list.png" lightbox="./media/how-to-schedule-data-import/data-import-list.png" alt-text="Screenshot highlighting the imported data asset name in the Data imports tab.":::

   1. At the **Import jobs history** page, select the latest **Import job name** link, to open the pipelines job details page as shown in this screenshot:

      :::image type="content" source="./media/how-to-schedule-data-import/data-import-history.png" lightbox="./media/how-to-schedule-data-import/data-import-history.png" alt-text="Screenshot highlighting the imported data asset guid in the Import jobs history tab.":::

   1. At the pipeline job details page of any data import, select **Schedule** -> **Create new schedule** to open the schedule creation wizard, as shown in this screenshot:

      :::image type="content" source="./media/how-to-schedule-data-import/schedule-entry-button.png" lightbox="./media/how-to-schedule-data-import/schedule-entry-button.png" alt-text="Screenshot of the jobs tab, with the create new schedule button.":::

   1. The *Basic settings* of the schedule creation wizard have the properties shown in this screenshot:

      :::image type="content" source="./media/how-to-schedule-data-import/create-schedule-basic-settings.png" lightbox="./media/how-to-schedule-data-import/create-schedule-basic-settings.png" alt-text="Screenshot of schedule creation wizard showing the basic settings.":::

  - **Name**: the unique identifier of the schedule within the workspace.
  - **Description**: the schedule description.
  - **Trigger**: the recurrence pattern of the schedule, which includes the following properties.
    - **Time zone**: the trigger time calculation is based on this time zone; (UTC) Coordinated Universal Time by default.
    - **Recurrence** or **Cron expression**: select recurrence to specify the recurring pattern. **Cron expression** allows you to specify more flexible and customized recurrence pattern.
    - **Start**: the schedule first becomes active on this date. By default, the creation date of this schedule.
    - **End**: the schedule will become inactive after this date. By default, it's NONE, which means that the schedule remains active until you manually disable it.
    - **Tags**: the selected schedule tags.

    After you configure the basic settings, you can select **Review + Create**, and the schedule will automatically submit the data import based on the recurrence pattern you specified. You can also select **Next**, and navigate through the wizard to select or update the data import parameters.

---

- **(Required)** `expression` uses a standard crontab expression to express a recurring schedule. A single expression is composed of five space-delimited fields:

    `MINUTES HOURS DAYS MONTHS DAYS-OF-WEEK`

    - A single wildcard (`*`), which covers all values for the field. A `*`, in days, means all days of a month (which varies with month and year).
    - The `expression: "15 16 * * 1"` in the sample above means the 16:15PM on every Monday.
    - The next table lists the valid values for each field:

        | Field          |   Range  | Comment                                                   |
        |----------------|----------|-----------------------------------------------------------|
        | `MINUTES`      |    0-59  | -                                                         |
        | `HOURS`        |    0-23  | -                                                         |
        | `DAYS`         |    -  |    Not supported. The value is ignored and treated as `*`.    |
        | `MONTHS`       |    -  | Not supported. The value is ignored and treated as `*`.        |
        | `DAYS-OF-WEEK` |    0-6   | Zero (0) means Sunday. Names of days also accepted. |

    - To learn more about crontab expressions, see [Crontab Expression wiki on GitHub](https://github.com/atifaziz/NCrontab/wiki/Crontab-Expression).

    > [!IMPORTANT]
    > `DAYS` and `MONTH` are not supported. If you pass one of these values, it will be ignored and treated as `*`.

- (Optional) `start_time` specifies the start date and time with the timezone of the schedule. For example, `start_time: "2022-05-10T10:15:00-04:00"` means the schedule starts from 10:15:00AM on 2022-05-10 in the UTC-4 timezone. If `start_time` is omitted, the `start_time` equals the schedule creation time. For a start time in the past, the first job runs at the next calculated run time.

- (Optional) `end_time` describes the end date, and time with a timezone. If `end_time` is omitted, the schedule continues to trigger jobs until the schedule is manually disabled.

- (Optional) `time_zone`specifies the time zone of the expression. If omitted, the timezone is UTC by default. See [appendix for timezone values](reference-yaml-schedule.md#appendix).

Limitations:

- Currently, Azure Machine Learning v2 scheduling doesn't support event-based triggers.
- Use the Azure Machine Learning SDK/CLI v2 to specify a complex recurrence pattern that contains multiple trigger timestamps. The UI only displays the complex pattern and doesn't support editing.
- If you set the recurrence as the 31st day of every month, the schedule won't trigger jobs in months with less than 31 days.

### List schedules in a workspace

# [Azure CLI](#tab/cli)

[!INCLUDE [CLI v2](includes/machine-learning-cli-v2.md)]

:::code language="azurecli" source="~/azureml-examples-main/cli/schedules/schedule.sh" ID="list_schedule":::

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/schedules/job-schedule.ipynb?name=list_schedule)]

# [Studio](#tab/azure-studio)

In the studio portal, under the **Jobs** extension, select the **All schedules** tab. That tab shows all your job schedules created by the SDK/cli/UI, in a single list. In the schedule list, you have an overview of all schedules in this workspace, as shown in this screenshot:

:::image type="content" source="./media/how-to-schedule-pipeline-job/schedule-list.png" alt-text="Screenshot of the schedule tabs, showing the list of schedule in this workspace." lightbox= "./media/how-to-schedule-pipeline-job/schedule-list.png":::

---

### Check schedule detail

# [Azure CLI](#tab/cli)

[!INCLUDE [CLI v2](includes/machine-learning-cli-v2.md)]

```cli
az ml schedule show -n simple_cron_data_import_schedule
``````

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

```python
created_schedule = ml_client.schedules.get(name=schedule_name)
[created_schedule.name]

```

# [Studio](#tab/azure-studio)

You can select a schedule name to show the schedule details page. The schedule details page contains the following tabs, as shown in this screenshot:

- **Overview**: basic information for the specified schedule.

    :::image type="content" source="./media/how-to-schedule-data-import/schedule-detail-overview.png" alt-text="Screenshot of the overview tab in the schedule details page." :::

- **Job definition**: defines the job that the specified schedule triggers, as shown in this screenshot:

  :::image type="content" source="./media/how-to-schedule-data-import/schedule-detail-job-definition.png" alt-text="Screenshot of the job definition tab in the schedule details page.":::

---

### Update a schedule

# [Azure CLI](#tab/cli)

[!INCLUDE [CLI v2](includes/machine-learning-cli-v2.md)]

```cli
az ml schedule update -n simple_cron_data_import_schedule  --set description="new description" --no-wait
```

> [!NOTE]
> To update more than just tags/description, it is recommended to use `az ml schedule create --file update_schedule.yml`

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

```python
job_schedule = ml_client.schedules.begin_create_or_update(
    schedule=job_schedule
).result()
print(job_schedule)

```

# [Studio](#tab/azure-studio)

#### Update a data import definition to existing schedule

To change the import frequency, or to create a new association for the data import job, you can update the import definition of an existing schedule.

> [!NOTE]
> To update an existing schedule, the association of the schedule with the old import definition will be removed. A schedule can have only one import job definition. However, multiple schedules can call one data import definition.

   1. Navigate to [Azure Machine Learning studio](https://ml.azure.com)

   1. Under **Assets** in the left navigation, select **Data**. On the **Data import** tab, select the imported data asset to which you want to attach a schedule. Then, the **Import jobs history** page opens, as shown in this screenshot:

      :::image type="content" source="./media/how-to-schedule-data-import/data-import-list.png" alt-text="Screenshot highlighting the imported data asset name in the Data imports tab.":::

   1. At the **Import jobs history** page, select the latest **Import job name** link, to open the pipelines job details page as shown in this screenshot:

      :::image type="content" source="./media/how-to-schedule-data-import/data-import-history.png" alt-text="Screenshot highlighting the imported data asset guid in the Import jobs history tab.":::

   1. At the pipeline job details page of any data import, select **Schedule** -> **Updated to existing schedule**, to open the Select schedule wizard, as shown in this screenshot:

      :::image type="content" source="./media/how-to-schedule-data-import/schedule-update-button.png" alt-text="Screenshot of the jobs tab with the schedule button selected, showing the create update to existing schedule button.":::

   1. Select an existing schedule from the list, as shown in this screenshot:

      :::image type="content" source="./media/how-to-schedule-data-import/update-select-schedule.png" alt-text="Screenshot of update select schedule showing the select schedule tab." :::

      > [!IMPORTANT]
      > Make sure to select the correct schedule to update. Once you finish the update, the schedule will trigger different data imports.

   1. You can also modify the source, query and change the destination path, for future data imports that the schedule triggers.

   1. Select **Review + Update** to finish the update process. The completed update will send a notification.

   1. You can view the new data import definition in the schedule details page when the update is completed.

#### Update in schedule detail page

In the schedule details page, you can select **Update settings** to update both the basic settings and advanced settings, including the job input/output and runtime settings of the schedule, as shown in this screenshot:

:::image type="content" source="./media/how-to-schedule-data-import/schedule-update-settings.png" alt-text="Screenshot of update settings showing the basic settings tab.":::

---

### Disable a schedule

# [Azure CLI](#tab/cli)

[!INCLUDE [CLI v2](includes/machine-learning-cli-v2.md)]

```cli
az ml schedule disable -n simple_cron_data_import_schedule --no-wait
```

# [Python SDK](#tab/python)

```python
job_schedule = ml_client.schedules.begin_disable(name=schedule_name).result()
job_schedule.is_enabled

```

# [Studio](#tab/azure-studio)

You can disable the current schedule at the schedule details page. You can also disable schedules at the **All schedules** tab.

---

### Enable a schedule

# [Azure CLI](#tab/cli)

[!INCLUDE [CLI v2](includes/machine-learning-cli-v2.md)]

```cli
az ml schedule enable -n simple_cron_data_import_schedule --no-wait
```

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

```python
# Update trigger expression
job_schedule.trigger.expression = "10 10 * * 1"
job_schedule = ml_client.schedules.begin_create_or_update(
    schedule=job_schedule
).result()
print(job_schedule)

```

# [Studio](#tab/azure-studio)

On the schedule details page, you can enable the current schedule. You can also enable schedules at the **All schedules** tab.

---

## Delete a schedule

> [!IMPORTANT]
> A schedule must be disabled before deletion. Deletion is an unrecoverable action. After a schedule is deleted, you can never access or recover it.

# [Azure CLI](#tab/cli)

[!INCLUDE [CLI v2](includes/machine-learning-cli-v2.md)]

```cli
az ml schedule delete -n simple_cron_data_import_schedule
```

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

```python
# Only disabled schedules can be deleted
ml_client.schedules.begin_disable(name=schedule_name).result()
ml_client.schedules.begin_delete(name=schedule_name).result()

```

# [Studio](#tab/azure-studio)

You can delete a schedule from the schedule details page or the all schedules tab.

---
## RBAC (Role-based-access-control) support

Schedules are generally used for production. To prevent problems, workspace admins may want to restrict schedule creation and management permissions within a workspace.

There are currently three action rules related to schedules, and you can configure them in Azure portal. See [how to manage access to an Azure Machine Learning workspace.](how-to-assign-roles.md#create-custom-role) to learn more.

| Action | Description                                                                | Rule                                                          |
|--------|----------------------------------------------------------------------------|---------------------------------------------------------------|
| Read   | Get and list schedules in Machine Learning workspace                        | Microsoft.MachineLearningServices/workspaces/schedules/read   |
| Write  | Create, update, disable and enable schedules in Machine Learning workspace | Microsoft.MachineLearningServices/workspaces/schedules/write  |
| Delete | Delete a schedule in Machine Learning workspace                            | Microsoft.MachineLearningServices/workspaces/schedules/delete |

## Next steps

* Learn more about the [CLI (v2) data import schedule YAML schema](./reference-yaml-schedule-data-import.md).
* Learn how to [manage imported data assets](how-to-manage-imported-data-assets.md).
