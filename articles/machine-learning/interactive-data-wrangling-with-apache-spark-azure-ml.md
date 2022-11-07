---
title: Interactive data wrangling with Apache Spark in Azure Machine Learning (preview)
titleSuffix: Azure Machine Learning
description: Learn how to use Apache Spark to wrangle data with Azure Machine Learning
author: ynpandey
ms.author: franksolomon
ms.reviewer: scottpolly
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to 
ms.date: 10/25/2022
ms.custom: template-how-to 
---

# Interactive Data Wrangling with Apache Spark in Azure Machine Learning (preview)

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

Data wrangling becomes one of the most important steps in machine learning projects. The Azure Machine Learning integration, with Azure Synapse Analytics (preview), provides access to an Apache Spark pool - backed by Azure Synapse - for interactive data wrangling using Azure Machine Learning Notebooks.

In this article, you will learn how to perform data wrangling using

- Managed (Automatic) Synapse Spark compute
- Attached Synapse Spark pool

## Prerequisites

- An Azure subscription; if you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free) before you begin.
- An Azure Machine Learning workspace. See [Create workspace resources](./quickstart-create-resources.md).
- An Azure Key Vault. See [Create an Azure Key Vault](../key-vault/general/quick-create-portal.md).
- A Service Principal. See [Create a Service Principal](../active-directory/develop/howto-create-service-principal-portal.md).
- An Azure Data Lake Storage (ADLS) Gen 2 storage account. See [Create an Azure Data Lake Storage (ADLS) Gen 2 storage account](../storage/blobs/create-data-lake-storage-account.md).
- [(Optional): An attached Synapse Spark pool in the Azure Machine Learning workspace](./how-to-manage-synapse-spark-pool.md).

Before starting data wrangling tasks, you will need familiarity with the process of storing secrets

- Azure Blob storage account access key
- Shared Access Signature (SAS) token
- Azure Data Lake Storage (ADLS) Gen 2 service principal information

in the Azure Key Vault. You will also need to know how to handle role assignments in the Azure storage accounts. The following sections review these concepts. Then, we will explore the details of interactive data wrangling using the Spark pools in Azure Machine Learning Notebooks.

## Store Azure storage account credentials as secrets in Azure Key Vault

To store Azure storage account credentials as secrets in the Azure Key Vault using the Azure portal user interface:

1. Navigate to your Azure Key Vault in the Azure portal.
1. Select **Secrets** from the left panel.
1. Select **+ Generate/Import**.

    :::image type="content" source="media/interactive-data-wrangling-with-apache-spark-azure-ml/azure-key-vault-secrets-generate-import.png" alt-text="Screenshot showing the Azure Key Vault Secrets Generate Or Import tab.":::

1. At the **Create a secret** screen, enter a **Name** for the secret you want to create.
1. Navigate to Azure Blob Storage Account, in the Azure portal, as seen in the image below.

    :::image type="content" source="media/interactive-data-wrangling-with-apache-spark-azure-ml/storage-account-access-keys.png" alt-text="Screenshot showing the Azure access key and connection string values screen.":::
1. Select **Access keys** from the Azure Blob Storage Account page left panel.
1. Select **Show** next to **Key 1**, and then **Copy to clipboard** to get the storage account access key.
    > [!Note] 
    > Select appropriate options to copy
    >  - Azure Blob storage container shared access signature (SAS) tokens
    >  - Azure Data Lake Storage (ADLS) Gen 2 storage account service principal credentials
    >    - tenant ID 
    >    - client ID and 
    >    - secret
    > 
    >  on the respective user interfaces while creating Azure Key Vault secrets for them.
1. Navigate back to the **Create a secret** screen.
1. In the **Secret value** textbox, enter the access key credential for the Azure storage account, which was copied to the clipboard in the earlier step.
1. Select **Create**.

    :::image type="content" source="media/interactive-data-wrangling-with-apache-spark-azure-ml/create-a-secret.png" alt-text="Screenshot showing the Azure secret creation screen.":::

> [!TIP]
> [Azure CLI](../key-vault/secrets/quick-create-cli.md) and [Azure Key Vault secret client library for Python](../key-vault/secrets/quick-create-python.md#sign-in-to-azure) can also create Azure Key Vault secrets.

## Add role assignments in Azure storage accounts

Before we begin interactive data wrangling, we must ensure that our data is accessible in the Notebooks. First, for

- the user identity of the Notebooks session logged-in user or
- a service principal

assign **Reader** and **Storage Blob Data Reader** roles. However, in certain scenarios, we might want to write the wrangled data back to the Azure storage account. The **Reader** and **Storage Blob Data Reader** roles provide read-only access to the user identity or service principal. To enable read and write access, assign **Contributor** and **Storage Blob Data Contributor** roles to the user identity or service principal. To assign appropriate roles to the user identity or service principal:

1. Navigate to the storage account page in the Microsoft Azure portal
1. Select **Access Control (IAM)** from the left panel.
1. Select **Add role assignment**.

    :::image type="content" source="media/interactive-data-wrangling-with-apache-spark-azure-ml/storage-account-add-role-assignment.png" alt-text="Screenshot showing the Azure access keys screen.":::

1. Search for a desired role: **Storage Blob Data Contributor**, in this example.
1. Select the desired role: **Storage Blob Data Contributor**, in this example.
1. Select **Next**.

    :::image type="content" source="media/interactive-data-wrangling-with-apache-spark-azure-ml/add-role-assignment-choose-role.png" alt-text="Screenshot showing the Azure add role assignment screen.":::

1. Select **User, group, or service principal**.
1. Select **+ Select members**.
1. In the textbox under **Select**, search for the user identity or service principal.
1. Select the user identity or service principal from the list so that it shows under **Selected members**.
1. Select the appropriate user identity or service principal.
1. Select **Next**.

    :::image type="content" source="media/interactive-data-wrangling-with-apache-spark-azure-ml/add-role-assignment-choose-members.png" alt-text="Screenshot showing the Azure add role assignment screen Members tab.":::

1. Select **Review + Assign**.

    :::image type="content" source="media/interactive-data-wrangling-with-apache-spark-azure-ml/add-role-assignment-review-and-assign.png" alt-text="Screenshot showing the Azure add role assignment screen review and assign tab.":::

Data in the Azure storage account should become accessible once the user identity or service principal has appropriate roles assigned.

## Interactive Data Wrangling with Apache Spark

Azure Machine Learning offers Managed (Automatic) Spark compute, and [attached Synapse Spark pool](./how-to-manage-synapse-spark-pool.md), for interactive data wrangling with Apache Spark, in Azure Machine Learning Notebooks. The Managed (Automatic) Spark compute does not require creation of resources in the Azure Synapse workspace. Instead, a fully managed automatic Spark compute becomes directly available in the Azure Machine Learning Notebooks.

### Create and configure Managed (Automatic) Spark compute in Azure Machine Learning Notebooks

We can create a Managed (Automatic) Spark compute from the Machine Learning Notebooks user interface. To create a notebook, a first-time user should select **Notebooks** from the left panel in Azure Machine Learning studio, and then select **Start with an empty notebook**. Azure Machine Learning studio offers additional options to upload existing notebooks, and to clone notebooks from a git repository.

:::image type="content" source="media/interactive-data-wrangling-with-apache-spark-azure-ml/start-with-an-empty-notebook.png" alt-text="Screenshot showing the Azure Notebooks tab.":::

To create and configure a Managed (Automatic) Spark compute in an open notebook:

1. Select the ellipses **(…)** next to the **Compute** selection menu.
1. Select **+ Create Azure ML compute**. Sometimes, the ellipses may not appear. In this case, directly select the **+** icon next to the **Compute** selection menu.

    :::image type="content" source="media/interactive-data-wrangling-with-apache-spark-azure-ml/create-azure-ml-compute-resource-in-a-notebook.png" alt-text="Screenshot highlighting the Create Azure ML compute option of a specific Azure Notebook tab.":::

1. Select **Azure Machine Learning Spark**.
1. Select **Create**.

    :::image type="content" source="media/interactive-data-wrangling-with-apache-spark-azure-ml/add-azure-machine-learning-spark-compute-type.png" alt-text="Screenshot highlighting the Azure Machine Learning Spark option at the Add new compute type screen.":::

1. Under **Azure Machine Learning Spark**, select **AzureML Spark Compute** from the **Compute** selection menu

    :::image type="content" source="media/interactive-data-wrangling-with-apache-spark-azure-ml/select-azure-ml-spark-compute.png" alt-text="Screenshot highlighting the selected Azure Machine Learning Spark option at the Add new compute type screen.":::

The Notebooks UI also provides options for Spark session configuration, for the Managed (Automatic) Spark compute. To configure a Spark session:

1. Select a version of **Apache Spark** from the dropdown menu.
1. Select **Instance type** from the dropdown menu.
1. Input a Spark **Session timeout** value, in minutes.
1. Select the number of **Executors** for the Spark session.
1. Select **Executor size** from the dropdown menu.
1. Select **Driver size** from the dropdown menu.
1. To use a conda file to configure a Spark session, check the **Upload conda file** checkbox. Then, select **Browse**, and choose the conda file with the Spark session configuration you want.
1. Add **Configuration settings** properties, input values in the **Property** and **Value** textboxes, and select **Add**.
1. Select **Apply**.

    :::image type="content" source="media/interactive-data-wrangling-with-apache-spark-azure-ml/azure-ml-session-configuration.png" alt-text="Screenshot showing the Spark session configuration options.":::

1. Select **Stop now** in the **Stop current session** pop-up.

    :::image type="content" source="media/interactive-data-wrangling-with-apache-spark-azure-ml/stop-current-session.png" alt-text="Screenshot showing the stop current session dialog box.":::

The session configuration changes will persist and will become available to another notebook session that is started using the Managed (Automatic) Spark compute.

### Import and wrangle data from Azure Data Lake Storage (ADLS) Gen 2

You can access and wrangle data stored in Azure Data Lake Storage (ADLS) Gen 2 storage accounts with `abfss://` data URIs following one of the two data access mechanisms:

- User identity passthrough
- Service principal-based data access

> [!TIP]
> Data wrangling with a Managed (Automatic) Spark compute, and user identity passthrough to access data in Azure Data Lake Storage (ADLS) Gen 2 storage account requires the least number of configuration steps.

To start interactive data wrangling with the user identity passthrough:

- Verify that the user identity has **Contributor** and **Storage Blob Data Contributor** [role assignments](#add-role-assignments-in-azure-storage-accounts) in the Azure Data Lake Storage (ADLS) Gen 2 storage account.

- To use the Managed (Automatic) Spark compute, select **AzureML Spark Compute**, under **Azure Machine Learning Spark**, from the **Compute** selection menu.

    :::image type="content" source="media/interactive-data-wrangling-with-apache-spark-azure-ml/select-azure-machine-learning-spark.png" alt-text="Screenshot showing use of a Managed (Automatic) Spark compute.":::

- To use an attached Synapse Spark pool, select an attached Synapse Spark pool under **Synapse Spark pool (Preview)** from the **Compute** selection menu.

    :::image type="content" source="media/interactive-data-wrangling-with-apache-spark-azure-ml/select-synapse-spark-pools-preview.png" alt-text="Screenshot showing use of an attached spark pool.":::

- This Titanic data wrangling code sample shows use of a data URI in format `abfss://<FILE_SYSTEM_NAME>@<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net/<PATH_TO_DATA>` with `pyspark.pandas` and `pyspark.ml.feature.Imputer`.

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

To wrangle data by access through a service principal:

1. Verify that the service principal has **Contributor** and **Storage Blob Data Contributor** [role assignments](#add-role-assignments-in-azure-storage-accounts) in the Azure Data Lake Storage (ADLS) Gen 2 storage account.
1. [Create Azure Key Vault secrets](#store-azure-storage-account-credentials-as-secrets-in-azure-key-vault) for the service principal tenant ID, client ID and client secret values.
1. Select Managed (Automatic) Spark compute **AzureML Spark Compute** under **Azure Machine Learning Spark** from the **Compute** selection menu, or select an attached Synapse Spark pool under **Synapse Spark pool (Preview)** from the **Compute** selection menu
1. To set the service principal tenant ID, client ID and client secret in the configuration, execute the following code sample. 
     - Note that the `get_secret()` call in the code depends on name of the Azure Key Vault, and the names of the Azure Key Vault secrets created for the service principal tenant ID, client ID and client secret. The corresponding property name/values to set in the configuration are as follows:
       - Client ID property: `fs.azure.account.oauth2.client.id.<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net`
       - Client secret property: `fs.azure.account.oauth2.client.secret.<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net`
       - Tenant ID property: `fs.azure.account.oauth2.client.endpoint.<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net`
       - Tenant ID value: `https://login.microsoftonline.com/<TENANT_ID>/oauth2/token`

        ```python

        from pyspark.sql import SparkSession

        sc = SparkSession.builder.getOrCreate()
        token_library = sc._jvm.com.microsoft.azure.synapse.tokenlibrary.TokenLibrary

        # Set up service principal tenant ID, client ID and secret from Azure Key Vault
        client_id = token_library.getSecret("<KEY_VAULT_NAME>", "<CLIENT_ID_SECRET_NAME>")
        tenant_id = token_library.getSecret("<KEY_VAULT_NAME>", "<TENANT_ID_SECRET_NAME>")
        client_secret = token_library.getSecret("<KEY_VAULT_NAME>", "<CLIENT_SECRET_NAME>")

        # Set up service principal which has access of the data
        sc._jsc.hadoopConfiguration().set(
            "fs.azure.account.auth.type.<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net", "OAuth"
        )
        sc._jsc.hadoopConfiguration().set(
            "fs.azure.account.oauth.provider.type.<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net",
            "org.apache.hadoop.fs.azurebfs.oauth2.ClientCredsTokenProvider",
        )
        sc._jsc.hadoopConfiguration().set(
            "fs.azure.account.oauth2.client.id.<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net",
            client_id,
        )
        sc._jsc.hadoopConfiguration().set(
            "fs.azure.account.oauth2.client.secret.<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net",
            client_secret,
        )
        sc._jsc.hadoopConfiguration().set(
            "fs.azure.account.oauth2.client.endpoint.<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net",
            "https://login.microsoftonline.com/" + tenant_id + "/oauth2/token",
        )

        ```

1. Import and wrangle data using data URI in format `abfss://<FILE_SYSTEM_NAME>@<STORAGE_ACCOUNT_NAME>.dfs.core.windows.net/<PATH_TO_DATA>` as shown in the code sample using the Titanic data.

### Import and wrangle data from Azure Blob storage

You can access Azure Blob storage data with either the storage account access key or a shared access signature (SAS) token. You should [store these credentials in the Azure Key Vault as a secret](#store-azure-storage-account-credentials-as-secrets-in-azure-key-vault), and set them as properties in the session configuration.

To start interactive data wrangling:
1. At the Azure Machine Learning studio left panel, select **Notebooks**.
1. At the **Compute** selection menu, select the Managed (Automatic) Spark compute **AzureML Spark Compute** under **Azure Machine Learning Spark**, or select an attached Synapse Spark pool under **Synapse Spark pool (Preview)** from the **Compute** selection menu.
1. To configure the storage account access key or a shared access signature (SAS) token for data access in Azure Machine Learning Notebooks:

     - For the access key, set property `fs.azure.account.key.<STORAGE_ACCOUNT_NAME>.blob.core.windows.net` as shown in this code snippet:

        ```python

        from pyspark.sql import SparkSession

        sc = SparkSession.builder.getOrCreate()
        token_library = sc._jvm.com.microsoft.azure.synapse.tokenlibrary.TokenLibrary
        access_key = token_library.getSecret("<KEY_VAULT_NAME>", "<ACCESS_KEY_SECRET_NAME>")
        sc._jsc.hadoopConfiguration().set(
            "fs.azure.account.key.<STORAGE_ACCOUNT_NAME>.blob.core.windows.net", access_key
        )
        ```
     - For the SAS token, set property `fs.azure.sas.<BLOB_CONTAINER_NAME>.<STORAGE_ACCOUNT_NAME>.blob.core.windows.net` as shown in this code snippet:
   
        ```python

        from pyspark.sql import SparkSession

        sc = SparkSession.builder.getOrCreate()
        token_library = sc._jvm.com.microsoft.azure.synapse.tokenlibrary.TokenLibrary
        sas_token = token_library.getSecret("<KEY_VAULT_NAME>", "<SAS_TOKEN_SECRET_NAME>")
        sc._jsc.hadoopConfiguration().set(
            "fs.azure.sas.<BLOB_CONTAINER_NAME>.<STORAGE_ACCOUNT_NAME>.blob.core.windows.net",
            sas_token,
        )

        ```
        > [!NOTE]
        > The `get_secret()` calls in the above code snippets require the name of the Azure Key Vault, and the names of the secrets created for the Azure Blob storage account access key or SAS token

2. Execute the data wrangling code in the same notebook. Format the data URI as `wasbs://<BLOB_CONTAINER_NAME>@<STORAGE_ACCOUNT_NAME>.blob.core.windows.net/<PATH_TO_DATA>` similar to this code snippet

    ```python

    import pyspark.pandas as pd
    from pyspark.ml.feature import Imputer

    df = pd.read_csv(
        "wasbs://<BLOB_CONTAINER_NAME>@<STORAGE_ACCOUNT_NAME>.blob.core.windows.net/data/titanic.csv",
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
        "wasbs://<BLOB_CONTAINER_NAME>@<STORAGE_ACCOUNT_NAME>.blob.core.windows.net/data/wrangled",
        index_col="PassengerId",
    )

    ```

### Import and wrangle data from Azure Machine Learning Datastore

To access data from [Azure Machine Learning Datastore](how-to-datastore.md), define a path to data on the datastore with [URI format](how-to-create-data-assets.md?tabs=cli#supported-paths) `azureml://datastores/<DATASTORE_NAME>/paths/<PATH_TO_DATA>`. To wrangle data from an Azure Machine Learning Datastore in a Notebooks session interactively:

1. Select the Managed (Automatic) Spark compute **AzureML Spark Compute** under **Azure Machine Learning Spark** from the **Compute** selection menu, or select an attached Synapse Spark pool under **Synapse Spark pool (Preview)** from the **Compute** selection menu.
2. This code sample shows how to read and wrangle Titanic data from an Azure Machine Learning Datastore, using `azureml://` datastore URI, `pyspark.pandas` and `pyspark.ml.feature.Imputer`.

    ```python

    import pyspark.pandas as pd
    from pyspark.ml.feature import Imputer

    df = pd.read_csv(
        "azureml://datastores/workspaceblobstore/paths/data/titanic.csv",
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
        "azureml://datastores/workspaceblobstore/paths/data/wrangled",
        index_col="PassengerId",
    )

    ```

The Azure Machine Learning datastores can access data using Azure storage account credentials 

- access key
- SAS token 
- service principal

or provide credential-less data access. Depending on the datastore type and the underlying Azure storage account type, adopt an appropriate authentication mechanism to ensure data access. This table summarizes the authentication mechanisms to access data in the Azure Machine Learning datastores:

|Storage account type|Credential-less data access|Data access mechanism|Role assignments|
| ------------------------ | ------------------------ | ------------------------ | ------------------------ |
|Azure Blob|No|Access key or SAS token|No role assignments needed|
|Azure Blob|Yes|User identity passthrough<sup><b>*</b></sup>|User identity should have [appropriate role assignments](#add-role-assignments-in-azure-storage-accounts) in the Azure Blob storage account|
|Azure Data Lake Storage (ADLS) Gen 2|No|Service principal|Service principal should have [appropriate role assignments](#add-role-assignments-in-azure-storage-accounts) in the Azure Data Lake Storage (ADLS) Gen 2 storage account|
|Azure Data Lake Storage (ADLS) Gen 2|Yes|User identity passthrough|User identity should have [appropriate role assignments](#add-role-assignments-in-azure-storage-accounts) in the Azure Data Lake Storage (ADLS) Gen 2 storage account|

<sup><b>*</b></sup> user identity passthrough works for credential-less datastores that point to Azure Blob storage accounts, only if [soft delete](../storage/blobs/soft-delete-blob-overview.md) is not enabled.

## Accessing data on the default file share

The default file share is mounted to both Managed (Automatic) Spark compute and attached Synapse Spark pools.

:::image type="content" source="media/interactive-data-wrangling-with-apache-spark-azure-ml/default-file-share.png" alt-text="Screenshot showing use of a file share.":::

In Azure Machine Learning studio, files in the default file share are shown in the directory tree under the **Files** tab. Notebook code can directly access files stored in this file share with `file://` protocol, along with the absolute path of the file, without any additional configurations. This code snippet shows how to access a file stored on the default file share:

```python

import os
import pyspark.pandas as pd

abspath = os.path.abspath(".")
file = "file://" + abspath + "/Users/<USER>/data/titanic.csv"
print(file)
df = pd.read_csv(file)
df.head()

```

## Next steps

- [Code samples for interactive data wrangling with Apache Spark in Azure Machine Learning](https://github.com/Azure/azureml-examples/tree/main/sdk/python/data-wrangling)
- [Optimize Apache Spark jobs in Azure Synapse Analytics](../synapse-analytics/spark/apache-spark-performance.md)
- [What are Azure Machine Learning pipelines?](./concept-ml-pipelines.md)
- [Submit Spark jobs in Azure Machine Learning (preview)](./how-to-submit-spark-jobs.md)
