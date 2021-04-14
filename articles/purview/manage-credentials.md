---
title: Create and manage credentials for scans
description: Learn about the steps to create and manage credentials in Azure Purview.
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 02/11/2021
---

# Credentials for source authentication in Azure Purview

This article describes how you can create credentials in Azure Purview. These saved credentials let you quickly reuse and apply saved authentication information to your data source scans.

## Prerequisites

- An Azure key vault. To learn how to create one, see [Quickstart: Create a key vault using the Azure portal](../key-vault/general/quick-create-portal.md).

## Introduction

A credential is authentication information that Azure Purview can use to authenticate to your registered data sources. A credential object can be created for various types of authentication scenarios, such as Basic Authentication requiring username/password. Credential capture specific information required to authenticate, based on the chosen type of authentication method. Credentials use your existing Azure Key Vaults secrets for retrieving sensitive authentication information during the Credential creation process.

## Use Purview managed identity to set up scans

If you are using the Purview managed identity to set up scans, you will not have to explicitly create a credential and link your key vault to Purview to store them. For detailed instructions on adding the Purview managed identity to have access to scan your data sources, refer to the data source-specific authentication sections below:

- [Azure Blob Storage](register-scan-azure-blob-storage-source.md#setting-up-authentication-for-a-scan)
- [Azure Data Lake Storage Gen1](register-scan-adls-gen1.md#setting-up-authentication-for-a-scan)
- [Azure Data Lake Storage Gen2](register-scan-adls-gen2.md#setting-up-authentication-for-a-scan)
- [Azure SQL Database](register-scan-azure-sql-database.md)
- [Azure SQL Database Managed Instance](register-scan-azure-sql-database-managed-instance.md#setting-up-authentication-for-a-scan)
- [Azure Synapse Analytics](register-scan-azure-synapse-analytics.md#setting-up-authentication-for-a-scan)

## Create Azure Key Vaults connections in your Azure Purview account

Before you can create a Credential, first associate one or more of your existing Azure Key Vault instances with your Azure Purview account.

1. From the [Azure portal](https://portal.azure.com), select your Azure Purview account and Open Azure Purview Studio. Navigate to the **Management Center** on Azure Purview Studio and then navigate to **credentials**.

2. From the **Credentials** page, select **Manage Key Vault connections**.

   :::image type="content" source="media/manage-credentials/manage-kv-connections.png" alt-text="Manage Azure Key Vault connections":::

3. Select **+ New** from the Manage Key Vault connections page.

4. Provide the required information, then select **Create**.

5. Confirm that your Key Vault has been successfully associated with your Azure Purview account as shown in this example:

   :::image type="content" source="media/manage-credentials/view-kv-connections.png" alt-text="View Azure Key Vault connections to confirm.":::

## Grant the Purview managed identity access to your Azure Key Vault

1. Navigate to your Azure Key Vault.

2. Select the **Access policies** page.

3. Select **Add Access Policy**.

   :::image type="content" source="media/manage-credentials/add-msi-to-akv.png" alt-text="Add Purview MSI to AKV":::

4. In the **Secrets permissions** dropdown, select **Get** and **List** permissions.

5. For **Select principal**, choose the Purview managed identity. You can search for the Purview MSI using either the Purview instance name **or** the managed identity application ID. We do not currently support compound identities (managed identity name + application ID).

   :::image type="content" source="media/manage-credentials/add-access-policy.png" alt-text="Add access policy":::

6. Select **Add**.

7. Select **Save** to save the Access policy.

   :::image type="content" source="media/manage-credentials/save-access-policy.png" alt-text="Save access policy":::

## Create a new credential

These credential types are supported in Purview:

- Basic authentication: You add the **password** as a secret in key vault.
- Service Principal: You add the **service principal key** as a secret in key vault.
- SQL authentication: You add the **password** as a secret in key vault.
- Account Key: You add the **account key** as a secret in key vault.
- Role ARN: For an Amazon S3 data source, add your **role ARN** in AWS. 

For more information, see [Add a secret to Key Vault](../key-vault/secrets/quick-create-portal.md#add-a-secret-to-key-vault) and [Create a new AWS role for Purview](register-scan-amazon-s3.md#create-a-new-aws-role-for-purview).

After storing your secrets in the key vault:

1. In Azure Purview, go to the Credentials page.

2. Create your new Credential by selecting **+ New**.

3. Provide the required information. Select the **Authentication method** and a **Key Vault connection** from which to select a secret from.

4. Once all the details have been filled in, select **Create**.

   :::image type="content" source="media/manage-credentials/new-credential.png" alt-text="New credential":::

5. Verify that your new credential shows up in the list view and is ready to use.

   :::image type="content" source="media/manage-credentials/view-credentials.png" alt-text="View credential":::

## Manage your key vault connections

1. Search/find Key Vault connections by name

   :::image type="content" source="media/manage-credentials/search-kv.png" alt-text="Search key vault":::

2. Delete one or more Key Vault connections

   :::image type="content" source="media/manage-credentials/delete-kv.png" alt-text="Delete key vault":::

## Manage your credentials

1. Search/find Credentials by name.
  
2. Select and make updates to an existing Credential.

3. Delete one or more Credentials.

## Next steps

[Create a scan rule set](create-a-scan-rule-set.md)
