--- 
title: "Configure Apache Spark jobs in Azure Machine Learning"
titleSuffix: Azure Machine Learning
description: Learn how to submit Apache Spark jobs with Azure Machine Learning
author: ynpandey
ms.author: yogipandey
ms.reviewer: franksolomon
ms.service: machine-learning
ms.subservice: mldata
ms.custom: build-2023, devx-track-python
ms.topic: how-to 
ms.date: 05/22/2023
#Customer intent: As a Full Stack ML Pro, I want to submit a Spark job in Azure Machine Learning.
---

# Configure Apache Spark jobs in Azure Machine Learning

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

The Azure Machine Learning integration, with Azure Synapse Analytics, provides easy access to distributed computing capability - backed by Azure Synapse - for scaling Apache Spark jobs on Azure Machine Learning.

In this article, you learn how to submit a Spark job using Azure Machine Learning serverless Spark compute, Azure Data Lake Storage (ADLS) Gen 2 storage account, and user identity passthrough in a few simple steps.

For more information about **Apache Spark in Azure Machine Learning** concepts, see [this resource](./apache-spark-azure-ml-concepts.md).

## Prerequisites

# [CLI](#tab/cli)
[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]
- An Azure subscription; if you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free) before you begin.
- An Azure Machine Learning workspace. See [Create workspace resources](./quickstart-create-resources.md).
- An Azure Data Lake Storage (ADLS) Gen 2 storage account. See [Create an Azure Data Lake Storage (ADLS) Gen 2 storage account](../storage/blobs/create-data-lake-storage-account.md).
- [Create an Azure Machine Learning compute instance](./concept-compute-instance.md#create).
- [Install Azure Machine Learning CLI](./how-to-configure-cli.md?tabs=public).

# [Python SDK](#tab/sdk)
[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]
- An Azure subscription; if you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free) before you begin.
- An Azure Machine Learning workspace. See [Create workspace resources](./quickstart-create-resources.md).
- An Azure Data Lake Storage (ADLS) Gen 2 storage account. See [Create an Azure Data Lake Storage (ADLS) Gen 2 storage account](../storage/blobs/create-data-lake-storage-account.md).
- [Configure your development environment](./how-to-configure-environment.md), or [create an Azure Machine Learning compute instance](./concept-compute-instance.md#create).
- [Install Azure Machine Learning SDK for Python](/python/api/overview/azure/ai-ml-readme).

# [Studio UI](#tab/studio-ui)
- An Azure subscription; if you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free) before you begin.
- An Azure Machine Learning workspace. See [Create workspace resources](./quickstart-create-resources.md).
- An Azure Data Lake Storage (ADLS) Gen 2 storage account. See [Create an Azure Data Lake Storage (ADLS) Gen 2 storage account](../storage/blobs/create-data-lake-storage-account.md).

---

## Add role assignments in Azure storage accounts

Before we submit an Apache Spark job, we must ensure that input, and output, data paths are accessible. Assign **Contributor** and **Storage Blob Data Contributor** roles to the user identity of the logged-in user to enable read and write access.

To assign appropriate roles to the user identity:

1. Open the [Microsoft Azure portal](https://portal.azure.com).
1. Search for, and select, the **Storage accounts** service.

    :::image type="content" source="media/quickstart-spark-jobs/find-storage-accounts-service.png" lightbox="media/quickstart-spark-jobs/find-storage-accounts-service.png" alt-text="Expandable screenshot showing search for and selection of Storage accounts service, in Microsoft Azure portal.":::

1. On the **Storage accounts** page, select the Azure Data Lake Storage (ADLS) Gen 2 storage account from the list. A page showing **Overview** of the storage account opens.

    :::image type="content" source="media/quickstart-spark-jobs/storage-accounts-list.png" lightbox="media/quickstart-spark-jobs/storage-accounts-list.png" alt-text="Expandable screenshot showing selection of Azure Data Lake Storage (ADLS) Gen 2 storage account  Storage account.":::

1. Select **Access Control (IAM)** from the left panel.
1. Select **Add role assignment**.

    :::image type="content" source="media/quickstart-spark-jobs/storage-account-add-role-assignment.png" lightbox="media/quickstart-spark-jobs/storage-account-add-role-assignment.png" alt-text="Expandable screenshot showing the Azure access keys screen.":::

1. Search for the role **Storage Blob Data Contributor**.
1. Select the role: **Storage Blob Data Contributor**.
1. Select **Next**.

    :::image type="content" source="media/quickstart-spark-jobs/add-role-assignment-choose-role.png" lightbox="media/quickstart-spark-jobs/add-role-assignment-choose-role.png" alt-text="Expandable screenshot showing the Azure add role assignment screen.":::

1. Select **User, group, or service principal**.
1. Select **+ Select members**.
1. In the textbox under **Select**, search for the user identity.
1. Select the user identity from the list so that it shows under **Selected members**.
1. Select the appropriate user identity.
1. Select **Next**.

    :::image type="content" source="media/quickstart-spark-jobs/add-role-assignment-choose-members.png" lightbox="media/quickstart-spark-jobs/add-role-assignment-choose-members.png" alt-text="Expandable screenshot showing the Azure add role assignment screen Members tab.":::

1. Select **Review + Assign**.

    :::image type="content" source="media/quickstart-spark-jobs/add-role-assignment-review-and-assign.png" lightbox="media/quickstart-spark-jobs/add-role-assignment-review-and-assign.png" alt-text="Expandable screenshot showing the Azure add role assignment screen review and assign tab.":::
1. Repeat steps 2-13 for **Storage Blob Contributor** role assignment.

Data in the Azure Data Lake Storage (ADLS) Gen 2 storage account should become accessible once the user identity has appropriate roles assigned.

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
>  - This Python code sample uses `pyspark.pandas`, which is only supported by Spark runtime version 3.2.
>  - Please ensure that `titanic.py` file is uploaded to a folder named `src`. The `src` folder should be located in the same directory where you have created the Python script/notebook or the YAML specification file defining the standalone Spark job.

That script takes two arguments: `--titanic_data` and `--wrangled_data`. These arguments pass the input data path, and the output folder, respectively. The script uses the `titanic.csv` file, [available here](https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/spark/data/titanic.csv). Upload this file to a container created in the Azure Data Lake Storage (ADLS) Gen 2 storage account.

## Submit a standalone Spark job

# [CLI](#tab/cli)
[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

> [!TIP]
> You can submit a Spark job from:
>  - [terminal of an Azure Machine Learning compute instance](./how-to-access-terminal.md#access-a-terminal). 
>  - terminal of [Visual Studio Code connected to an Azure Machine Learning compute instance](./how-to-set-up-vs-code-remote.md?tabs=studio).
>  - your local computer that has [the Azure Machine Learning CLI](./how-to-configure-cli.md?tabs=public) installed.

This example YAML specification shows a standalone Spark job. It uses an Azure Machine Learning serverless Spark compute, user identity passthrough, and input/output data URI in the `abfss://<FILE_SYSTEM_NAME>@<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net/<PATH_TO_DATA>` format. Here, `<FILE_SYSTEM_NAME>` matches the container name.

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
- `resource` property defines `instance_type` and Apache Spark `runtime_version` used by serverless Spark compute. The following instance types are currently supported:
    - `standard_e4s_v3`
    - `standard_e8s_v3`
    - `standard_e16s_v3`
    - `standard_e32s_v3`
    - `standard_e64s_v3`

The YAML file shown can be used in the `az ml job create` command, with the `--file` parameter, to create a standalone Spark job as shown:

```azurecli
az ml job create --file <YAML_SPECIFICATION_FILE_NAME>.yaml --subscription <SUBSCRIPTION_ID> --resource-group <RESOURCE_GROUP> --workspace-name <AML_WORKSPACE_NAME>
```

# [Python SDK](#tab/sdk)
[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

> [!TIP]
> You can submit a Spark job from:
>  - an Azure Machine Learning Notebook connected to an Azure Machine Learning compute instance. 
>  - [Visual Studio Code connected to an Azure Machine Learning compute instance](./how-to-set-up-vs-code-remote.md?tabs=studio).
>  - your local computer that has [the Azure Machine Learning SDK for Python](/python/api/overview/azure/ai-ml-readme) installed.

This Python code snippet shows a standalone Spark job creation, with an Azure Machine Learning serverless Spark compute, user identity passthrough, and input/output data URI in the `abfss://<FILE_SYSTEM_NAME>@<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net/<PATH_TO_DATA>`format. Here, the `<FILE_SYSTEM_NAME>` matches the container name.

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
- `resource` parameter defines `instance_type` and Apache Spark `runtime_version` used by serverless Spark compute (preview). The following instance types are currently supported:
    - `Standard_E4S_V3`
    - `Standard_E8S_V3`
    - `Standard_E16S_V3`
    - `Standard_E32S_V3`
    - `Standard_E64S_V3`

# [Studio UI](#tab/studio-ui)

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

First, upload the parameterized Python code `titanic.py` to the Azure Blob storage container for workspace default datastore `workspaceblobstore`. To submit a standalone Spark job using the Azure Machine Learning studio UI:

1. Select **+ New**, located near the top right side of the screen.
2. Select **Spark job (preview)**.
3. On the **Compute** screen:

   1. Under **Select compute type**, select **Spark serverless** for serverless Spark compute.
   2. Select **Virtual machine size**. The following instance types are currently supported:
      - `Standard_E4s_v3`
      - `Standard_E8s_v3`
      - `Standard_E16s_v3`
      - `Standard_E32s_v3`
      - `Standard_E64s_v3`
   3. Select **Spark runtime version** as **Spark 3.2**.
   4. Select **Next**.
4. On the **Environment** screen, select **Next**.
5. On **Job settings** screen:
    1. Provide a job **Name**, or use the job **Name**, which is generated by default.
    2. Select an **Experiment name** from the dropdown menu.
    3. Under **Add tags**, provide **Name** and **Value**, then select **Add**. Adding tags is optional.
    4. Under the **Code** section:
        1. Select **Azure Machine Learning workspace default blob storage** from **Choose code location** dropdown.
        2. Under **Path to code file to upload**, select **Browse**.
        3. In the pop-up screen titled **Path selection**, select the path of code file `titanic.py` on the workspace default datastore `workspaceblobstore`.
        4. Select **Save**.
        5. Input `titanic.py` as the name of **Entry file** for the standalone job.
        6. To add an input, select **+ Add input** under **Inputs** and
            1. Enter **Input name** as `titanic_data`. The input should refer to this name later in the **Arguments**.
            2. Select **Input type** as **Data**.
            3. Select **Data type** as **File**.
            4. Select **Data source** as **URI**.
            5. Enter an Azure Data Lake Storage (ADLS) Gen 2 data URI for `titanic.csv` file in the `abfss://<FILE_SYSTEM_NAME>@<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net/<PATH_TO_DATA>` format. Here, `<FILE_SYSTEM_NAME>` matches the container name.
        7.  To add an input, select **+ Add output** under **Outputs** and
            1. Enter **Output name** as `wrangled_data`. The output should refer to this name later in the **Arguments**.
            2. Select **Output type** as **Folder**.
            3. For **Output URI destination**, enter an Azure Data Lake Storage (ADLS) Gen 2 folder URI in the `abfss://<FILE_SYSTEM_NAME>@<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net/<PATH_TO_DATA>` format. Here `<FILE_SYSTEM_NAME>` matches the container name.
        8.  Enter **Arguments**  as `--titanic_data ${{inputs.titanic_data}} --wrangled_data ${{outputs.wrangled_data}}`.
    5. Under the **Spark configurations** section:
        1. For **Executor size**:
            1. Enter the number of executor **Cores** as 2 and executor **Memory (GB)** as 2.
            2. For **Dynamically allocated executors**, select **Disabled**.
            3. Enter the number of **Executor instances** as 2.
        2. For **Driver size**, enter number of driver **Cores** as 1 and driver **Memory (GB)** as 2.
    6. Select **Next**.
6. On the **Review** screen:
    1. Review the job specification before submitting it.
    2. Select **Create** to submit the standalone Spark job.

> [!NOTE]
> A standalone job submitted from the Studio UI using an Azure Machine Learning serverless Spark compute defaults to user identity passthrough for data access.


---

> [!TIP]
> You might have an existing Synapse Spark pool in your Azure Synapse workspace. To use an existing Synapse Spark pool, please follow the instructions to [attach a Synapse Spark pool in Azure Machine Learning workspace](./how-to-manage-synapse-spark-pool.md).

## Next steps
- [Apache Spark in Azure Machine Learning](./apache-spark-azure-ml-concepts.md)
- [Quickstart: Interactive Data Wrangling with Apache Spark](./apache-spark-environment-configuration.md)
- [Attach and manage a Synapse Spark pool in Azure Machine Learning](./how-to-manage-synapse-spark-pool.md)
- [Interactive Data Wrangling with Apache Spark in Azure Machine Learning](./interactive-data-wrangling-with-apache-spark-azure-ml.md)
- [Submit Spark jobs in Azure Machine Learning](./how-to-submit-spark-jobs.md)
- [Code samples for Spark jobs using Azure Machine Learning CLI](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/spark)
- [Code samples for Spark jobs using Azure Machine Learning Python SDK](https://github.com/Azure/azureml-examples/tree/main/sdk/python/jobs/spark)
