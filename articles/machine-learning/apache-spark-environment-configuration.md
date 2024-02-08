--- 
title: Apache Spark - environment configuration
titleSuffix: Azure Machine Learning
description: Learn how to configure your Apache Spark environment for interactive data wrangling
author: ynpandey
ms.author: yogipandey
ms.reviewer: franksolomon
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.date: 05/22/2023
#Customer intent: As a Full Stack ML Pro, I want to perform interactive data wrangling in Azure Machine Learning with Apache Spark.
---

# Quickstart: Interactive Data Wrangling with Apache Spark in Azure Machine Learning

To handle interactive Azure Machine Learning notebook data wrangling, Azure Machine Learning integration with Azure Synapse Analytics provides easy access to the Apache Spark framework. This access allows for Azure Machine Learning Notebook interactive data wrangling.

In this quickstart guide, you learn how to perform interactive data wrangling using Azure Machine Learning serverless Spark compute, Azure Data Lake Storage (ADLS) Gen 2 storage account, and user identity passthrough.

## Prerequisites
- An Azure subscription; if you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free) before you begin.
- An Azure Machine Learning workspace. See [Create workspace resources](./quickstart-create-resources.md).
- An Azure Data Lake Storage (ADLS) Gen 2 storage account. See [Create an Azure Data Lake Storage (ADLS) Gen 2 storage account](../storage/blobs/create-data-lake-storage-account.md).

## Store Azure storage account credentials as secrets in Azure Key Vault

To store Azure storage account credentials as secrets in the Azure Key Vault using the Azure portal user interface:

1. Navigate to your Azure Key Vault in the Azure portal.
1. Select **Secrets** from the left panel.
1. Select **+ Generate/Import**.

    :::image type="content" source="media/apache-spark-environment-configuration/azure-key-vault-secrets-generate-import.png" alt-text="Screenshot showing the Azure Key Vault Secrets Generate Or Import tab.":::

1. At the **Create a secret** screen, enter a **Name** for the secret you want to create.
1. Navigate to Azure Blob Storage Account, in the Azure portal, as seen in this image:

    :::image type="content" source="media/apache-spark-environment-configuration/storage-account-access-keys.png" alt-text="Screenshot showing the Azure access key and connection string values screen.":::
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

    :::image type="content" source="media/apache-spark-environment-configuration/create-a-secret.png" alt-text="Screenshot showing the Azure secret creation screen.":::

> [!TIP]
> [Azure CLI](../key-vault/secrets/quick-create-cli.md) and [Azure Key Vault secret client library for Python](../key-vault/secrets/quick-create-python.md#sign-in-to-azure) can also create Azure Key Vault secrets.

## Add role assignments in Azure storage accounts

We must ensure that the input and output data paths are accessible before we start interactive data wrangling. First, for

- the user identity of the Notebooks session logged-in user or
- a service principal

assign **Reader** and **Storage Blob Data Reader** roles to the user identity of the logged-in user. However, in certain scenarios, we might want to write the wrangled data back to the Azure storage account. The **Reader** and **Storage Blob Data Reader** roles provide read-only access to the user identity or service principal. To enable read and write access, assign **Contributor** and **Storage Blob Data Contributor** roles to the user identity or service principal. To  assign appropriate roles to the user identity:

1. Open the [Microsoft Azure portal](https://portal.azure.com).
1. Search and select the **Storage accounts** service.

    :::image type="content" source="media/apache-spark-environment-configuration/find-storage-accounts-service.png" lightbox="media/apache-spark-environment-configuration/find-storage-accounts-service.png" alt-text="Expandable screenshot showing Storage accounts service search and selection, in Microsoft Azure portal.":::

1. On the **Storage accounts** page, select the Azure Data Lake Storage (ADLS) Gen 2 storage account from the list. A page showing the storage account **Overview** will open.

    :::image type="content" source="media/apache-spark-environment-configuration/storage-accounts-list.png" lightbox="media/apache-spark-environment-configuration/storage-accounts-list.png" alt-text="Expandable screenshot showing selection of the Azure Data Lake Storage (ADLS) Gen 2 storage account  Storage account.":::

1. Select **Access Control (IAM)** from the left panel
1. Select **Add role assignment**

    :::image type="content" source="media/apache-spark-environment-configuration/storage-account-add-role-assignment.png" lightbox="media/apache-spark-environment-configuration/storage-account-add-role-assignment.png" alt-text="Screenshot showing the Azure access keys screen.":::

1. Find and select role **Storage Blob Data Contributor**
1. Select **Next**

    :::image type="content" source="media/apache-spark-environment-configuration/add-role-assignment-choose-role.png" lightbox="media/apache-spark-environment-configuration/add-role-assignment-choose-role.png" alt-text="Screenshot showing the Azure add role assignment screen.":::

1. Select **User, group, or service principal**.
1. Select **+ Select members**.
1. Search for the user identity below **Select**
1. Select the user identity from the list, so that it shows under **Selected members**
1. Select the appropriate user identity
1. Select **Next**

    :::image type="content" source="media/apache-spark-environment-configuration/add-role-assignment-choose-members.png" lightbox="media/apache-spark-environment-configuration/add-role-assignment-choose-members.png" alt-text="Screenshot showing the Azure add role assignment screen Members tab.":::

1. Select **Review + Assign**

    :::image type="content" source="media/apache-spark-environment-configuration/add-role-assignment-review-and-assign.png" lightbox="media/apache-spark-environment-configuration/add-role-assignment-review-and-assign.png" alt-text="Screenshot showing the Azure add role assignment screen review and assign tab.":::
1. Repeat steps 2-13 for **Contributor** role assignment.

Once the user identity has the appropriate roles assigned, data in the Azure storage account should become accessible.

> [!NOTE]
> If an [attached Synapse Spark pool](./how-to-manage-synapse-spark-pool.md) points to a Synapse Spark pool in an Azure Synapse workspace that has a managed virtual network associated with it, [a managed private endpoint to storage account should be configured](../synapse-analytics/security/connect-to-a-secure-storage-account.md) to ensure data access.

## Ensuring resource access for Spark jobs

To access data and other resources, Spark jobs can use either a managed identity or user identity passthrough. The following table summarizes the different mechanisms for resource access while using Azure Machine Learning serverless Spark compute and attached Synapse Spark pool.

|Spark pool|Supported identities|Default identity|
| ---------- | -------------------- | ---------------- |
|Serverless Spark compute|User identity and managed identity|User identity|
|Attached Synapse Spark pool|User identity and managed identity|Managed identity - compute identity of the attached Synapse Spark pool|

If the CLI or SDK code defines an option to use managed identity, Azure Machine Learning serverless Spark compute relies on a user-assigned managed identity attached to the workspace. You can attach a user-assigned managed identity to an existing Azure Machine Learning workspace using Azure Machine Learning CLI v2, or with `ARMClient`.

## Next steps

- [Apache Spark in Azure Machine Learning](./apache-spark-azure-ml-concepts.md)
- [Attach and manage a Synapse Spark pool in Azure Machine Learning](./how-to-manage-synapse-spark-pool.md)
- [Interactive Data Wrangling with Apache Spark in Azure Machine Learning](./interactive-data-wrangling-with-apache-spark-azure-ml.md)
- [Submit Spark jobs in Azure Machine Learning](./how-to-submit-spark-jobs.md)
- [Code samples for Spark jobs using Azure Machine Learning CLI](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/spark)
- [Code samples for Spark jobs using Azure Machine Learning Python SDK](https://github.com/Azure/azureml-examples/tree/main/sdk/python/jobs/spark)