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
ms.date: 04/18/2023
ms.custom: data4ml
---

# Import data assets (preview)
[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning SDK you are using:"]
> * [v2 ](how-to-import-data-assets.md)

In this article, learn how to import data into the Azure Machine Learning platform from external sources. A successful import automatically creates and registers an Azure Machine Learning data asset with the name provided during the import. An Azure Machine Learning data asset resembles a web browser bookmark (favorites). You don't need to remember long storage paths (URIs) that point to your most-frequently used data. Instead, you can create a data asset, and then access that asset with a friendly name.

A data import creates a cache of the source data, along with metadata, for faster and reliable data access in Azure Machine Learning training jobs. The data cache avoids network and connection constraints. The cached data is versioned to support reproducibility (which provides versioning capabilities for data imported from SQL Server sources). Additionally, the cached data provides data lineage for auditability. A data import uses ADF (Azure Data Factory pipelines) behind the scenes, which means that users can avoid complex interactions with ADF. Behind the scenes, Azure Machine Learning also handles management of ADF compute resource pool size, compute resource provisioning, and tear-down to optimize data transfer by determining proper parallelization.

The transferred data is partitioned and securely stored as parquet files in Azure storage. This enables faster processing during training. ADF compute costs only involve the time used for data transfers. Storage costs only involve the time needed to cache the data, because cached data is a copy of the data imported from an external source. That external source is hosted in Azure storage.

The caching feature involves upfront compute and storage costs. However, it pays for itself, and can save money, because it reduces recurring training compute costs compared to direct connections to external source data during training. It caches data as parquet files, which makes job training faster and more reliable against connection timeouts for larger data sets. This leads to fewer reruns, and fewer training failures.

You can now import data from Snowflake, Amazon S3 and Azure SQL.

[!INCLUDE [machine-learning-preview-generic-disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

To create and work with data assets, you need:

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* An Azure Machine Learning workspace. [Create workspace resources](quickstart-create-resources.md).

* The [Azure Machine Learning CLI/SDK installed](how-to-configure-cli.md).

* [Workspace connections created](how-to-connection.md)

> [!NOTE]
> For a successful data import, please verify that you have installed the latest azure-ai-ml package (version 1.5.0 or later) for SDK, and the ml extension (version 2.15.1 or later).  
> 
> If you have an older SDK package or CLI extension, please remove the old one and install the new one with the code shown in the tab section. Follow the instructions for SDK and CLI below:

### Code versions

# [SDK](#tab/SDK)

```python
pip uninstall azure-ai-ml
pip install azure-ai-ml
pip show azure-ai-ml #(the version value needs to be 1.5.0 or later)
```

# [CLI](#tab/CLI)

```cli
az extension remove -n ml
az extension add -n ml --yes
az extension show -n ml #(the version value needs to be 2.15.1 or later)
```

---

## Importing from an external database source as a table data asset

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

# [Python SDK](#tab/Python-SDK)
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

---

## Import data from an external file system source as a folder data asset

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

# [Python SDK](#tab/Python-SDK)
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

---

## Check the import status of external data sources

The data import action is an asynchronous action. It can take a long time. After submission of an import data action via the CLI or SDK, the Azure Machine Learning service might need several minutes to connect to the external data source. Then the service would start the data import and handle data caching and registration. The time needed for a data import also depends on the size of the source data set.

The next example returns the status of the submitted data import activity. The command or method uses the "data asset" name as the input to determine the status of the data materialization.

# [Azure CLI](#tab/cli)


```cli
> az ml data list-materialization-status --name <name>
```

# [Python SDK](#tab/Python-SDK)

```python
from azure.ai.ml.entities import DataImport
from azure.ai.ml import MLClient

ml_client = MLClient.from_config()

ml_client.data.show_materialization_status(name="<name>")

```

---

## Next steps

- [Read data in a job](how-to-read-write-data-v2.md#read-data-in-a-job)
- [Working with tables in Azure Machine Learning](how-to-mltable.md)
- [Access data from Azure cloud storage during interactive development](how-to-access-data-interactive.md)