--- 
title: "Quickstart: Interactive Data Wrangling with Apache Spark (preview)"
titleSuffix: Azure Machine Learning
description: Learn how to perform interactive data wrangling with Apache Spark in Azure Machine Learning
author: ynpandey
ms.author: franksolomon
ms.reviewer: franksolomon
ms.service: machine-learning
ms.subservice: mldata
ms.topic: quickstart 
ms.date: 02/10/2023
#Customer intent: As a Full Stack ML Pro, I want to perform interactive data wrangling in Azure Machine Learning, with Apache Spark.
---

# Quickstart: Interactive Data Wrangling with Apache Spark in Azure Machine Learning (preview)

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

To handle interactive Azure Machine Learning notebook data wrangling, Azure Machine Learning integration, with Azure Synapse Analytics (preview), provides easy access to the Apache Spark framework. This access allows for Azure Machine Learning Notebook interactive data wrangling.

In this quickstart guide, you'll learn how to perform interactive data wrangling using Azure Machine Learning Managed (Automatic) Synapse Spark compute, Azure Data Lake Storage (ADLS) Gen 2 storage account, and user identity passthrough.

## Prerequisites
- An Azure subscription; if you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free) before you begin.
- An Azure Machine Learning workspace. See [Create workspace resources](./quickstart-create-resources.md).
- An Azure Data Lake Storage (ADLS) Gen 2 storage account. See [Create an Azure Data Lake Storage (ADLS) Gen 2 storage account](../storage/blobs/create-data-lake-storage-account.md).
- To enable this feature:
  1. Navigate to the Azure Machine Learning studio UI
  2. In the icon section at the top right of the screen, select **Manage preview features** (megaphone icon)
  3. In the **Managed preview feature** panel, toggle the **Run notebooks and jobs on managed Spark** feature to **on**
  :::image type="content" source="media/quickstart-spark-data-wrangling/how-to-enable-managed-spark-preview.png" lightbox="media/quickstart-spark-data-wrangling/how-to-enable-managed-spark-preview.png" alt-text="Screenshot showing the option to enable the Managed Spark preview.":::

## Add role assignments in Azure storage accounts

We must ensure that the input and output data paths are accessible, before we start interactive data wrangling. To enable read and write access, assign **Contributor** and **Storage Blob Data Contributor** roles to the user identity of the logged-in user.

To assign appropriate roles to the user identity:

1. Open the [Microsoft Azure portal](https://portal.azure.com).
1. Search and select the **Storage accounts** service.

    :::image type="content" source="media/quickstart-spark-data-wrangling/find-storage-accounts-service.png" lightbox="media/quickstart-spark-data-wrangling/find-storage-accounts-service.png" alt-text="Expandable screenshot showing Storage accounts service search and selection, in Microsoft Azure portal.":::

1. On the **Storage accounts** page, select the Azure Data Lake Storage (ADLS) Gen 2 storage account from the list. A page showing the storage account **Overview** will open.

    :::image type="content" source="media/quickstart-spark-data-wrangling/storage-accounts-list.png" lightbox="media/quickstart-spark-data-wrangling/storage-accounts-list.png" alt-text="Expandable screenshot showing selection of the Azure Data Lake Storage (ADLS) Gen 2 storage account  Storage account.":::

1. Select **Access Control (IAM)** from the left panel
1. Select **Add role assignment**

    :::image type="content" source="media/quickstart-spark-data-wrangling/storage-account-add-role-assignment.png" lightbox="media/quickstart-spark-data-wrangling/storage-account-add-role-assignment.png" alt-text="Screenshot showing the Azure access keys screen.":::

1. Find and select role **Storage Blob Data Contributor**
1. Select **Next**

    :::image type="content" source="media/quickstart-spark-data-wrangling/add-role-assignment-choose-role.png" lightbox="media/quickstart-spark-data-wrangling/add-role-assignment-choose-role.png" alt-text="Screenshot showing the Azure add role assignment screen.":::

1. Select **User, group, or service principal**.
1. Select **+ Select members**.
1. Search for the user identity below **Select**
1. Select the user identity from the list, so that it shows under **Selected members**
1. Select the appropriate user identity
1. Select **Next**

    :::image type="content" source="media/quickstart-spark-data-wrangling/add-role-assignment-choose-members.png" lightbox="media/quickstart-spark-data-wrangling/add-role-assignment-choose-members.png" alt-text="Screenshot showing the Azure add role assignment screen Members tab.":::

1. Select **Review + Assign**

    :::image type="content" source="media/quickstart-spark-data-wrangling/add-role-assignment-review-and-assign.png" lightbox="media/quickstart-spark-data-wrangling/add-role-assignment-review-and-assign.png" alt-text="Screenshot showing the Azure add role assignment screen review and assign tab.":::
1. Repeat steps 2-13 for **Contributor** role assignment.

Once the user identity has the appropriate roles assigned, data in the Azure storage account should become accessible.

## Managed (Automatic) Spark compute in Azure Machine Learning Notebooks

A Managed (Automatic) Spark compute is available in Azure Machine Learning Notebooks by default. To access it in a notebook, start in the **Compute** selection menu, and select **Azure Machine Learning Spark Compute** under **Azure Machine Learning Spark**.

:::image type="content" source="media/quickstart-spark-data-wrangling/select-azure-ml-spark-compute.png" lightbox="media/quickstart-spark-data-wrangling/select-azure-ml-spark-compute.png" alt-text="Screenshot highlighting the selected Azure Machine Learning Spark option, located at the Compute selection menu.":::

## Interactive data wrangling with Titanic data

> [!TIP]
> Data wrangling with a Managed (Automatic) Spark compute, and user identity passthrough for data access in an Azure Data Lake Storage (ADLS) Gen 2 storage account, both require the lowest number of configuration steps.

The data wrangling code shown here uses the `titanic.csv` file, available [here](https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/spark/data/titanic.csv). Upload this file to a container created in the Azure Data Lake Storage (ADLS) Gen 2 storage account. This Python code snippet shows interactive data wrangling with an Azure Machine Learning Managed (Automatic) Spark compute, user identity passthrough, and an input/output data URI, in the `abfss://<FILE_SYSTEM_NAME>@<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net/<PATH_TO_DATA>` format. Here, `<FILE_SYSTEM_NAME>` matches the container name.

```python
import pyspark.pandas as pd
from pyspark.ml.feature import Imputer

df = pd.read_csv(
    "abfss://<FILE_SYSTEM_NAME>@<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net/data/titanic.csv",
    index_col="PassengerId",
)
imputer = Imputer(inputCols=["Age"], outputCol="Age").setStrategy(
    "mean"
)  # Replace missing values in Age column with the mean value
df.fillna(
    value={"Cabin": "None"}, inplace=True
)  # Fill Cabin column with value "None" if missing
df.dropna(inplace=True)  # Drop the rows which still have any missing value
df.to_csv(
    "abfss://<FILE_SYSTEM_NAME>@<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net/data/wrangled",
    index_col="PassengerId",
)
```

> [!NOTE]
> Only the Spark runtime version 3.2 supports `pyspark.pandas`, used in this Python code sample.

:::image type="content" source="media/quickstart-spark-data-wrangling/managed-spark-interactive-data-wrangling.png" lightbox="media/quickstart-spark-data-wrangling/managed-spark-interactive-data-wrangling.png" alt-text="Screenshot showing use of a Managed (Automatic) Spark compute, for interactive data wrangling.":::

## Next steps
- [Apache Spark in Azure Machine Learning (preview)](./apache-spark-azure-ml-concepts.md)
- [Quickstart: Submit Apache Spark jobs in Azure Machine Learning (preview)](./quickstart-spark-jobs.md)
- [Attach and manage a Synapse Spark pool in Azure Machine Learning (preview)](./how-to-manage-synapse-spark-pool.md)
- [Interactive Data Wrangling with Apache Spark in Azure Machine Learning (preview)](./interactive-data-wrangling-with-apache-spark-azure-ml.md)
- [Submit Spark jobs in Azure Machine Learning (preview)](./how-to-submit-spark-jobs.md)
- [Code samples for Spark jobs using Azure Machine Learning CLI](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/spark)
- [Code samples for Spark jobs using Azure Machine Learning Python SDK](https://github.com/Azure/azureml-examples/tree/main/sdk/python/jobs/spark)