--- 
title: "Quickstart: Apache Spark jobs in Azure Machine Learning (preview)"
titleSuffix: Azure Machine Learning
description: Learn how to submit Apache Spark jobs with Azure Machine Learning
author: ynpandey
ms.author: franksolomon
ms.reviewer: franksolomon
ms.service: machine-learning
ms.subservice: mldata
ms.topic: quickstart 
ms.date: 12/13/2022
#Customer intent: As a Full Stack ML Pro, I want to submit a Spark job in Azure Machine Learning.
---

# Quickstart: Apache Spark jobs in Azure Machine Learning (preview)

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

The Azure Machine Learning integration, with Azure Synapse Analytics (preview), provides easy access to distributed computing capability - backed by Azure Synapse - for scaling Apache Spark jobs on Azure Machine Learning.

In this quickstart guide, you'll learn how to submit a Spark job using Azure Machine Learning Managed (Automatic) Synapse Spark compute, Azure Data Lake Storage (ADLS) Gen 2 storage account, and user identity passthrough in a few simple steps.

## Prerequisites

# [CLI](#tab/cli)
[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]
- An Azure subscription; if you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free) before you begin.
- An Azure Machine Learning workspace. See [Create workspace resources](./quickstart-create-resources.md).
- An Azure Data Lake Storage (ADLS) Gen 2 storage account. See [Create an Azure Data Lake Storage (ADLS) Gen 2 storage account](../storage/blobs/create-data-lake-storage-account.md).
- [Create an Azure Machine Learning compute instance](./concept-compute-instance.md#create).
- [Install Azure Machine Learning CLI](./how-to-configure-cli.md?tabs=public).

> [!TIP]
> You can submit a Spark job from:
>  - [terminal of an Azure Machine Learning compute instance](./how-to-access-terminal.md#access-a-terminal). 
>  - terminal of [Visual Studio Code connected to an Azure Machine Learning compute instance](./how-to-set-up-vs-code-remote.md?tabs=studio).
>  - your local computer that has [the Azure Machine Learning CLI](./how-to-configure-cli.md?tabs=public) installed.

# [Python SDK](#tab/sdk)
[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]
- An Azure subscription; if you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free) before you begin.
- An Azure Machine Learning workspace. See [Create workspace resources](./quickstart-create-resources.md).
- An Azure Data Lake Storage (ADLS) Gen 2 storage account. See [Create an Azure Data Lake Storage (ADLS) Gen 2 storage account](../storage/blobs/create-data-lake-storage-account.md).
- [Configure your development environment](./how-to-configure-environment.md), or [create an Azure Machine Learning compute instance](./concept-compute-instance.md#create).
- [Install Azure Machine Learning SDK for Python](/python/api/overview/azure/ml/installv2).

> [!TIP]
> You can submit a Spark job from:
>  - an Azure Machine Learning Notebook connected to an Azure Machine Learning compute instance. 
>  - [Visual Studio Code connected to an Azure Machine Learning compute instance](./how-to-set-up-vs-code-remote.md?tabs=studio).
>  - your local computer that has [the Azure Machine Learning SDK for Python](/python/api/overview/azure/ml/installv2) installed.

---

## Add role assignments in Azure storage accounts

Before we submit an Apache Spark job, we must ensure that input, and output, data paths are accessible. Assign **Contributor** and **Storage Blob Data Contributor** roles to the user identity of the logged-in user to enable read and write access.

To assign appropriate roles to the user identity:

1. Navigate to the Azure Data Lake Storage (ADLS) Gen 2 storage account page in the Microsoft Azure portal.
1. Select **Access Control (IAM)** from the left panel.
1. Select **Add role assignment**.

    :::image type="content" source="media/quickstart-spark-jobs/storage-account-add-role-assignment.png" alt-text="Screenshot showing the Azure access keys screen.":::

1. Search for the role **Storage Blob Data Contributor**.
1. Select the role: **Storage Blob Data Contributor**.
1. Select **Next**.

    :::image type="content" source="media/quickstart-spark-jobs/add-role-assignment-choose-role.png" alt-text="Screenshot showing the Azure add role assignment screen.":::

1. Select **User, group, or service principal**.
1. Select **+ Select members**.
1. In the textbox under **Select**, search for the user identity.
1. Select the user identity from the list so that it shows under **Selected members**.
1. Select the appropriate user identity.
1. Select **Next**.

    :::image type="content" source="media/quickstart-spark-jobs/add-role-assignment-choose-members.png" alt-text="Screenshot showing the Azure add role assignment screen Members tab.":::

1. Select **Review + Assign**.

    :::image type="content" source="media/quickstart-spark-jobs/add-role-assignment-review-and-assign.png" alt-text="Screenshot showing the Azure add role assignment screen review and assign tab.":::
1. Repeat steps 2-13 for **Contributor** role assignment.

Data in the Azure storage account should become accessible once the user identity or service principal has appropriate roles assigned.

## Create parametrized Python code
A Spark job requires a Python script that takes arguments, which can be developed by modifying the Python code developed from [interactive data wrangling](./interactive-data-wrangling-with-apache-spark-azure-ml.md). A sample Python script is shown here.

```python
# titanic.py
import argparse
from operator import add
import pyspark.pandas as pd
from pyspark.ml.feature import Imputer

parser = argparse.ArgumentParser()
parser.add_argument("--titanic_data")
parser.add_argument("--wrangled_data")

args = parser.parse_args()
print(args.wrangled_data)
print(args.titanic_data)

df = pd.read_csv(args.titanic_data, index_col="PassengerId")
imputer = Imputer(inputCols=["Age"], outputCol="Age").setStrategy(
    "mean"
)  # Replace missing values in Age column with the mean value
df.fillna(
    value={"Cabin": "None"}, inplace=True
)  # Fill Cabin column with value "None" if missing
df.dropna(inplace=True)  # Drop the rows which still have any missing value
df.to_csv(args.wrangled_data, index_col="PassengerId")
```

> [!NOTE]
> This Python code sample uses `pyspark.pandas`, which is only supported by Spark runtime version 3.2.

The above script takes two arguments `--titanic_data` and `--wrangled_data`, which pass the path of input data and output folder respectively. The script uses `titanic.csv` file, which can be [found here](https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/spark/data/titanic.csv). This file should be uploaded to the Azure Data Lake Storage (ADLS) Gen 2 storage account.

## Submit a standalone Spark job

# [CLI](#tab/cli)
[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]
This example YAML specification shows a standalone Spark job. It uses an Azure Machine Learning Managed (Automatic) Spark compute, user identity passthrough, and input/output data URI in format `abfss://<FILE_SYSTEM_NAME>@<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net/<PATH_TO_DATA>`:

```yaml
$schema: http://azureml/sdk-2-0/SparkJob.json
type: spark

code: ./src 
entry:
  file: titanic.py

conf:
  spark.driver.cores: 1
  spark.driver.memory: 2g
  spark.executor.cores: 2
  spark.executor.memory: 2g
  spark.executor.instances: 2

inputs:
  titanic_data:
    type: uri_file
    path: abfss://<FILE_SYSTEM_NAME>@<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net/data/titanic.csv
    mode: direct

outputs:
  wrangled_data:
    type: uri_folder
    path: abfss://<FILE_SYSTEM_NAME>@<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net/data/wrangled/
    mode: direct

args: >-
  --titanic_data ${{inputs.titanic_data}}
  --wrangled_data ${{outputs.wrangled_data}}

identity:
  type: user_identity

resources:
  instance_type: standard_e4s_v3
  runtime_version: "3.2"
```

In the above YAML specification file:
- `code` property defines relative path of the folder containing parameterized `titanic.py` file.
- `resource` property defines `instance_type` and Apache Spark `runtime_version` used by Managed (Automatic) Spark compute.

The YAML file shown can be used in the `az ml job create` command, with the `--file` parameter, to create a standalone Spark job as shown:

```azurecli
az ml job create --file <YAML_SPECIFICATION_FILE_NAME>.yaml --subscription <SUBSCRIPTION_ID> --resource-group <RESOURCE_GROUP> --workspace-name <AML_WORKSPACE_NAME>
```

# [Python SDK](#tab/sdk)
[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]
This Python code snippet shows the creation of a standalone Spark job, with an Azure Machine Learning Managed (Automatic) Spark compute, user identity passthrough, and input/output data URI in format `abfss://<FILE_SYSTEM_NAME>@<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net/<PATH_TO_DATA>`: 

```python
from azure.ai.ml import MLClient, spark, Input, Output
from azure.identity import DefaultAzureCredential
from azure.ai.ml.entities import UserIdentityConfiguration

subscription_id = "<SUBSCRIPTION_ID>"
resource_group = "<RESOURCE_GROUP>"
workspace_name = "<AML_WORKSPACE_NAME>"
ml_client = MLClient(
    DefaultAzureCredential(), subscription_id, resource_group, workspace_name
)

spark_job = spark(
    display_name="Titanic-Spark-Job-SDK",
    code="./src",
    entry={"file": "titanic.py"},
    driver_cores=1,
    driver_memory="2g",
    executor_cores=2,
    executor_memory="2g",
    executor_instances=2,
    resources={
        "instance_type": "Standard_E8S_V3",
        "runtime_version": "3.2.0",
    },
    inputs={
        "titanic_data": Input(
            type="uri_file",
            path="abfss://<FILE_SYSTEM_NAME>@<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net/data/titanic.csv",
            mode="direct",
        ),
    },
    outputs={
        "wrangled_data": Output(
            type="uri_folder",
            path="abfss://<FILE_SYSTEM_NAME>@<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net/data/wrangled/",
            mode="direct",
        ),
    },
    identity=UserIdentityConfiguration(),
    args="--titanic_data ${{inputs.titanic_data}} --wrangled_data ${{outputs.wrangled_data}}",
)

returned_spark_job = ml_client.jobs.create_or_update(spark_job)

# Wait until the job completes
ml_client.jobs.stream(returned_spark_job.name)
```

In the above code sample:
- `code` parameter defines relative path of the folder containing parameterized `titanic.py` file.
- `resource` parameter defines `instance_type` and Apache Spark `runtime_version` used by Managed (Automatic) Spark compute.

---

## Next steps
- [Attach and manage a Synapse Spark pool in Azure Machine Learning (preview)](./how-to-manage-synapse-spark-pool)
- [Interactive Data Wrangling with Apache Spark in Azure Machine Learning (preview)](./interactive-data-wrangling-with-apache-spark-azure-ml.md)
- [Submit Spark jobs in Azure Machine Learning (preview)](./how-to-submit-spark-jobs.md)
- [Code samples for Spark jobs using Azure Machine Learning CLI](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/spark)
- [Code samples for Spark jobs using Azure Machine Learning Python SDK](https://github.com/Azure/azureml-examples/tree/main/sdk/python/jobs/spark)