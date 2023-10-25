---
title: Import data (preview)
titleSuffix: Azure Machine Learning
description: Learn how to import data from external sources to the Azure Machine Learning platform.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.author: ambadal
author: AmarBadal
ms.reviewer: franksolomon
ms.date: 06/19/2023
ms.custom: data4ml
---

# Import data assets (preview)
[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

In this article, you'll learn how to import data into the Azure Machine Learning platform from external sources. A successful import automatically creates and registers an Azure Machine Learning data asset with the name provided during the import. An Azure Machine Learning data asset resembles a web browser bookmark (favorites). You don't need to remember long storage paths (URIs) that point to your most-frequently used data. Instead, you can create a data asset, and then access that asset with a friendly name.

A data import creates a cache of the source data, along with metadata, for faster and reliable data access in Azure Machine Learning training jobs. The data cache avoids network and connection constraints. The cached data is versioned to support reproducibility. This provides versioning capabilities for data imported from SQL Server sources. Additionally, the cached data provides data lineage for auditing tasks. A data import uses ADF (Azure Data Factory pipelines) behind the scenes, which means that users can avoid complex interactions with ADF. Behind the scenes, Azure Machine Learning also handles management of ADF compute resource pool size, compute resource provisioning, and tear-down, to optimize data transfer by determining proper parallelization.

The transferred data is partitioned and securely stored in Azure storage, as parquet files. This enables faster processing during training. ADF compute costs only involve the time used for data transfers. Storage costs only involve the time needed to cache the data, because cached data is a copy of the data imported from an external source. Azure storage hosts that external source.

The caching feature involves upfront compute and storage costs. However, it pays for itself, and can save money, because it reduces recurring training compute costs, compared to direct connections to external source data during training. It caches data as parquet files, which makes job training faster and more reliable against connection timeouts for larger data sets. This leads to fewer reruns, and fewer training failures.

You can import data from Amazon S3, Azure SQL, and Snowflake.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

To create and work with data assets, you need:

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* An Azure Machine Learning workspace. [Create workspace resources](quickstart-create-resources.md).

* The [Azure Machine Learning CLI/SDK installed](how-to-configure-cli.md).

* [Workspace connections created](how-to-connection.md)

> [!NOTE]
> For a successful data import, please verify that you installed the latest azure-ai-ml package (version 1.5.0 or later) for SDK, and the ml extension (version 2.15.1 or later).
>
> If you have an older SDK package or CLI extension, please remove the old one and install the new one with the code shown in the tab section. Follow the instructions for SDK and CLI as shown here:

### Code versions

# [Azure CLI](#tab/cli)

```cli
az extension remove -n ml
az extension add -n ml --yes
az extension show -n ml #(the version value needs to be 2.15.1 or later)
```

# [Python SDK](#tab/python)

```python
pip uninstall azure-ai-ml
pip show azure-ai-ml #(the version value needs to be 1.5.0 or later)
```

# [Studio](#tab/azure-studio)

Not available.

---

## Import from an external database as a mltable data asset

> [!NOTE]
> The external databases can have Snowflake, Azure SQL, etc. formats.

The following code samples can import data from external databases. The `connection` that handles the import action determines the external database data source metadata. In this sample, the code imports data from a Snowflake resource. The connection points to a Snowflake source. With a little modification, the connection can point to an Azure SQL database source and an Azure SQL database source. The imported asset `type` from an external database source is `mltable`.

# [Azure CLI](#tab/cli)

Create a `YAML` file `<file-name>.yml`:

```yaml
$schema: http://azureml/sdk-2-0/DataImport.json
# Supported connections include:
# Connection: azureml:<workspace_connection_name>
# Supported paths include:
# Datastore: azureml://datastores/<data_store_name>/paths/<my_path>/${{name}}


type: mltable
name: <name>
source:
  type: database
  query: <query>
  connection: <connection>
path: <path>
```

Next, run the following command in the CLI:

```cli
> az ml data import -f <file-name>.yml
```

# [Python SDK](#tab/python)
```python

from azure.ai.ml.entities import DataImport
from azure.ai.ml.data_transfer import Database
from azure.ai.ml import MLClient

# Supported connections include:
# Connection: azureml:<workspace_connection_name>
# Supported paths include:
# path: azureml://datastores/<data_store_name>/paths/<my_path>/${{name}}

ml_client = MLClient.from_config()

data_import = DataImport(
    name="<name>",
    source=Database(connection="<connection>", query="<query>"),
    path="<path>"
    )
ml_client.data.import_data(data_import=data_import)

```

# [Studio](#tab/azure-studio)

> [!NOTE]
> The example seen here describes the process for a Snowflake database. However, this process covers other external database formats, like Azure SQL, etc.

1. Navigate to the [Azure Machine Learning studio](https://ml.azure.com).

1. Under **Assets** in the left navigation, select **Data**. Next, select the **Data Import** tab. Then select Create as shown in this screenshot:

   :::image type="content" source="media/how-to-import-data-assets/create-new-data-import.png" lightbox="media/how-to-import-data-assets/create-new-data-import.png" alt-text="Screenshot showing creation of a new data import in Azure Machine Learning studio UI.":::

1. At the Data Source screen, select Snowflake, and then select Next, as shown in this screenshot:

   :::image type="content" source="media/how-to-import-data-assets/select-source-for-snowflake-data-asset.png" lightbox="media/how-to-import-data-assets/select-source-for-snowflake-data-asset.png" alt-text="Screenshot showing selection of a Snowflake data asset.":::

1. At the Data Type screen, fill in the values. The **Type** value defaults to **Table (mltable)**. Then select Next, as shown in this screenshot:

   :::image type="content" source="media/how-to-import-data-assets/select-snowflake-data-asset-type.png" lightbox="media/how-to-import-data-assets/select-snowflake-data-asset-type.png" alt-text="Screenshot that shows selection of a Snowflake data asset type.":::

1. At the Create data import screen, fill in the values, and select Next, as shown in this screenshot:

   :::image type="content" source="media/how-to-import-data-assets/create-snowflake-data-import.png" lightbox="media/how-to-import-data-assets/create-snowflake-data-import.png" alt-text="Screenshot that shows details of the data source selection.":::

1. Fill in the values at the Choose a datastore to output screen, and select Next, as shown in this screenshot. **Workspace managed datastore** is selected by default; the path is automatically assigned by the system when you choose manged datastore. If you select **Workspace managed datastore**, the **Auto delete setting** dropdown appears. It offers a data deletion time window of 30 days by default, and [how to manage imported data assets](./how-to-manage-imported-data-assets.md) explains how to change this value.

   :::image type="content" source="media/how-to-import-data-assets/choose-snowflake-datastore-to-output.png" lightbox="media/how-to-import-data-assets/choose-snowflake-datastore-to-output.png" alt-text="Screenshot that shows details of the data source to output.":::

   > [!NOTE]
   > To choose your own datastore, select **Other datastores**. In this case, you must select the path for the location of the data cache.

1. You can add a schedule. Select **Add schedule** as shown in this screenshot:
   
   :::image type="content" source="media/how-to-import-data-assets/create-data-import-add-schedule.png" lightbox="media/how-to-import-data-assets/create-data-import-add-schedule.png" alt-text="Screenshot that shows the selection of the Add schedule button.":::
   
   A new panel opens, where you can define a **Recurrence** schedule, or a **Cron** schedule. This screenshot shows the panel for a **Recurrence** schedule:
   
   :::image type="content" source="media/how-to-import-data-assets/create-data-import-recurrence-schedule.png" lightbox="media/how-to-import-data-assets/create-data-import-recurrence-schedule.png" alt-text="A screenshot that shows selection of the Add recurrence schedule button.":::

   - **Name**: the unique identifier of the schedule within the workspace.
   - **Description**: the schedule description.
   - **Trigger**: the recurrence pattern of the schedule, which includes the following properties.
     - **Time zone**: the trigger time calculation is based on this time zone; (UTC) Coordinated Universal Time by default.
     - **Recurrence** or **Cron expression**: select recurrence to specify the recurring pattern. Under **Recurrence**, you can specify the recurrence frequency - by minutes, hours, days, weeks, or months.
     - **Start**: the schedule first becomes active on this date. By default, the creation date of this schedule.
     - **End**: the schedule will become inactive after this date. By default, it's NONE, which means that the schedule will always be active until you manually disable it.
     - **Tags**: the selected schedule tags.

   > [!NOTE]
   > **Start** specifies the start date and time with the timezone of the schedule. If start is omitted, the start time equals the schedule creation time. For a start time in the past, the first job runs at the next calculated run time.

   The next screenshot shows the last screen of this process. Review your choices, and select Create. At this screen, and the other screens in this process, select Back to move to earlier screens to change your choices of values.

   :::image type="content" source="media/how-to-import-data-assets/create-snowflake-data-import-review-values-and-create.png" lightbox="media/how-to-import-data-assets/create-snowflake-data-import-review-values-and-create.png" alt-text="Screenshot that shows all parameters of the data import.":::
   
   This screenshot shows the panel for a **Cron** schedule:
   
   :::image type="content" source="media/how-to-import-data-assets/create-data-import-cron-expression-schedule.png" lightbox="media/how-to-import-data-assets/create-data-import-cron-expression-schedule.png" alt-text="Screenshot that shows selection of the Add schedule button.":::

   - **Name**: the unique identifier of the schedule within the workspace.
   - **Description**: the schedule description.
   - **Trigger**: the recurrence pattern of the schedule, which includes the following properties.
      - **Time zone**: the trigger time calculation is based on this time zone; (UTC) Coordinated Universal Time by default.
      - **Recurrence** or **Cron expression**: select cron expression to specify the cron details.

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

      - **Start**: the schedule first becomes active on this date. By default, the creation date of this schedule.
      - **End**: the schedule will become inactive after this date. By default, it's NONE, which means that the schedule will always be active until you manually disable it.
      - **Tags**: the selected schedule tags.

   > [!NOTE]
   > **Start** specifies the start date and time with the timezone of the schedule. If start is omitted, the start time equals the schedule creation time. For a start time in the past, the first job runs at the next calculated run time.

   The next screenshot shows the last screen of this process. Review your choices, and select Create. At this screen, and the other screens in this process, select Back to move to earlier screens to change your choices of values.

   :::image type="content" source="media/how-to-import-data-assets/create-snowflake-data-import-review-values-and-create.png" lightbox="media/how-to-import-data-assets/create-snowflake-data-import-review-values-and-create.png" alt-text="Screenshot that shows all parameters of the cron data import.":::

---

## Import data from an external file system as a folder data asset

> [!NOTE]
> An Amazon S3 data resource can serve as an external file system resource.

The `connection` that handles the data import action determines the details of the external data source. The connection defines an Amazon S3 bucket as the target. The connection expects a valid `path` value. An asset value imported from an external file system source has a `type` of `uri_folder`.

The next code sample imports data from an Amazon S3 resource.

# [Azure CLI](#tab/cli)

Create a `YAML` file `<file-name>.yml`:

```yaml
$schema: http://azureml/sdk-2-0/DataImport.json
# Supported connections include:
# Connection: azureml:<workspace_connection_name>
# Supported paths include:
# path: azureml://datastores/<data_store_name>/paths/<my_path>/${{name}}


type: uri_folder
name: <name>
source:
  type: file_system
  path: <path_on_source>
  connection: <connection>
path: <path>
```

Next, execute this command in the CLI:

```cli
> az ml data import -f <file-name>.yml
```

# [Python SDK](#tab/python)
```python

from azure.ai.ml.entities import DataImport
from azure.ai.ml.data_transfer import FileSystem
from azure.ai.ml import MLClient

# Supported connections include:
# Connection: azureml:<workspace_connection_name>
# Supported paths include:
# path: azureml://datastores/<data_store_name>/paths/<my_path>/${{name}}

ml_client = MLClient.from_config()

data_import = DataImport(
    name="<name>",
    source=FileSystem(connection="<connection>", path="<path_on_source>"),
    path="<path>"
    )
ml_client.data.import_data(data_import=data_import)

```

# [Studio](#tab/azure-studio)

1. Navigate to the [Azure Machine Learning studio](https://ml.azure.com).

1. Under **Assets** in the left navigation, select **Data**. Next, select the Data Import tab. Then select Create as shown in this screenshot:

   :::image type="content" source="media/how-to-import-data-assets/create-new-data-import.png" lightbox="media/how-to-import-data-assets/create-new-data-import.png" alt-text="Screenshot showing creation of a data import in Azure Machine Learning studio UI.":::

1. At the Data Source screen, select S3, and then select Next, as shown in this screenshot:

   :::image type="content" source="media/how-to-import-data-assets/select-source-for-s3-data-asset.png" lightbox="media/how-to-import-data-assets/select-source-for-s3-data-asset.png" alt-text="Screenshot showing selection of an S3 data asset.":::

1. At the Data Type screen, fill in the values. The **Type** value defaults to **Folder (uri_folder)**. Then select Next, as shown in this screenshot:

   :::image type="content" source="media/how-to-import-data-assets/select-s3-data-asset-type.png" lightbox="media/how-to-import-data-assets/select-s3-data-asset-type.png" alt-text="Screenshot showing selection of a Snowflake data asset type.":::

1. At the Create data import screen, fill in the values, and select Next, as shown in this screenshot:

   :::image type="content" source="media/how-to-import-data-assets/create-s3-data-import.png" lightbox="media/how-to-import-data-assets/create-s3-data-import.png" alt-text="Screenshot showing details of the data source selection.":::

1. Fill in the values at the Choose a datastore to output screen, and select Next, as shown in this screenshot. **Workspace managed datastore** is selected by default; the path is automatically assigned by the system when you choose managed datastore. If you select **Workspace managed datastore**, the **Auto delete setting** dropdown appears. It offers a data deletion time window of 30 days by default, and [how to manage imported data assets](./how-to-manage-imported-data-assets.md) explains how to change this value.

   :::image type="content" source="media/how-to-import-data-assets/choose-s3-datastore-to-output.png" lightbox="media/how-to-import-data-assets/choose-s3-datastore-to-output.png" alt-text="Screenshot showing details of the data source to output.":::

1. You can add a schedule. Select **Add schedule** as shown in this screenshot:
   
   :::image type="content" source="media/how-to-import-data-assets/create-data-import-add-schedule.png" lightbox="media/how-to-import-data-assets/create-data-import-add-schedule.png" alt-text="Screenshot showing selection of the Add schedule button.":::
   
1. A new panel opens, where you can define a **Recurrence** schedule, or a **Cron** schedule. This screenshot shows the panel for a **Recurrence** schedule:
   
   :::image type="content" source="media/how-to-import-data-assets/create-data-import-recurrence-schedule.png" lightbox="media/how-to-import-data-assets/create-data-import-recurrence-schedule.png" alt-text="A screenshot showing selection of the Add schedule button.":::

   - **Name**: the unique identifier of the schedule within the workspace.
   - **Description**: the schedule description.
   - **Trigger**: the recurrence pattern of the schedule, which includes the following properties.
     - **Time zone**: the trigger time calculation is based on this time zone; (UTC) Coordinated Universal Time by default.
     - **Recurrence** or **Cron expression**: select recurrence to specify the recurring pattern. Under **Recurrence**, you can specify the recurrence frequency - by minutes, hours, days, weeks, or months.
     - **Start**: the schedule first becomes active on this date. By default, the creation date of this schedule.
     - **End**: the schedule will become inactive after this date. By default, it's NONE, which means that the schedule will always be active until you manually disable it.
     - **Tags**: the selected schedule tags.

   > [!NOTE]
   > **Start** specifies the start date and time with the timezone of the schedule. If start is omitted, the start time equals the schedule creation time. For a start time in the past, the first job runs at the next calculated run time.

1. As shown in the next screenshot, review your choices at the last screen of this process, and select Create. At this screen, and the other screens in this process, select Back to move to earlier screens if you'd like to change your choices of values.

   :::image type="content" source="media/how-to-import-data-assets/choose-s3-datastore-to-output.png" lightbox="media/how-to-import-data-assets/choose-s3-datastore-to-output.png" alt-text="Screenshot showing details of the data source to output.":::

1. The next screenshot shows the last screen of this process. Review your choices, and select Create. At this screen, and the other screens in this process, select Back to move to earlier screens to change your choices of values.

   :::image type="content" source="media/how-to-import-data-assets/create-s3-data-import-review-values-and-create.png" lightbox="media/how-to-import-data-assets/create-s3-data-import-review-values-and-create.png" alt-text="Screenshot showing all parameters of the data import.":::

   This screenshot shows the panel for a **Cron** schedule:

   :::image type="content" source="media/how-to-import-data-assets/create-data-import-cron-expression-schedule.png" lightbox="media/how-to-import-data-assets/create-data-import-cron-expression-schedule.png" alt-text="Screenshot showing the selection of the Add schedule button.":::

   - **Name**: the unique identifier of the schedule within the workspace.
   - **Description**: the schedule description.
   - **Trigger**: the recurrence pattern of the schedule, which includes the following properties.
      - **Time zone**: the trigger time calculation is based on this time zone; (UTC) Coordinated Universal Time by default.
      - **Recurrence** or **Cron expression**: select cron expression to specify the cron details.

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

      - **Start**: the schedule first becomes active on this date. By default, the creation date of this schedule.
      - **End**: the schedule will become inactive after this date. By default, it's NONE, which means that the schedule will always be active until you manually disable it.
      - **Tags**: the selected schedule tags.

   > [!NOTE]
   > **Start** specifies the start date and time with the timezone of the schedule. If start is omitted, the start time equals the schedule creation time. For a start time in the past, the first job runs at the next calculated run time.

   The next screenshot shows the last screen of this process. Review your choices, and select Create. At this screen, and the other screens in this process, select Back to move to earlier screens to change your choices of values.

   :::image type="content" source="media/how-to-import-data-assets/create-s3-data-import-review-values-and-create.png" lightbox="media/how-to-import-data-assets/create-s3-data-import-review-values-and-create.png" alt-text="Screenshot showing all parameters of the S3 cron data import.":::

---

## Check the import status of external data sources

The data import action is an asynchronous action. It can take a long time. After submission of an import data action via the CLI or SDK, the Azure Machine Learning service might need several minutes to connect to the external data source. Then, the service would start the data import, and handle data caching and registration. The time needed for a data import also depends on the size of the source data set.

The next example returns the status of the submitted data import activity. The command or method uses the "data asset" name as the input to determine the status of the data materialization.

# [Azure CLI](#tab/cli)

```cli
> az ml data list-materialization-status --name <name>
```

# [Python SDK](#tab/python)

```python
from azure.ai.ml.entities import DataImport
from azure.ai.ml import MLClient

ml_client = MLClient.from_config()

ml_client.data.show_materialization_status(name="<name>")

```

# [Studio](#tab/azure-studio)

Not available.

---

## Next steps

- [Import data assets on a schedule](reference-yaml-schedule-data-import.md)
- [Access data in a job](how-to-read-write-data-v2.md#access-data-in-a-job)
- [Working with tables in Azure Machine Learning](how-to-mltable.md)
- [Access data from Azure cloud storage during interactive development](how-to-access-data-interactive.md)