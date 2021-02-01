---
title: Create and manage credentials for scans
description: This article explains the steps to create and manage credentials in Azure Purview.
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 11/23/2020
---

# Credentials for source authentication in Azure Purview

This article describes how you can create credentials in Azure Purview to quickly reuse and apply saved authentication information to your data source scans.

## Prerequisites

* Azure key vault. If you don't have one already here's how (insert link to KV creation article) to create one.

## Introduction
A Credential is authentication information that Azure Purview can use to authenticate to your registered data sources. A Credential object can be created for various types of authentication scenarios (such as Basic Authentication requiring username/password) and will capture the specific information required based on the chosen type of authentication method. Credentials use your existing Azure Key Vaults secrets for retrieving sensitive authentication information during the Credential creation process.

## Using Purview managed identity to set up scans
If you are using the Purview managed identity to set up scans, you will not have to explicitly create a credential and link your key vault to Purview to store them. For detailed instructions on adding the Purview managed identity to have access to scan your data sources, refer to the data source specific authentication sections below:

- [Azure Blob Storage](register-scan-azure-blob-storage-source.md#setting-up-authentication-for-a-scan)
- [Azure Data Lake Storage Gen1](register-scan-adls-gen1.md#setting-up-authentication-for-a-scan)
- [Azure Data Lake Storage Gen2](register-scan-adls-gen2.md#setting-up-authentication-for-a-scan)
- [Azure SQL Database](register-scan-azure-sql-database.md)
- [Azure SQL Database Managed Instance](register-scan-azure-sql-database-managed-instance.md#setting-up-authentication-for-a-scan)
- [Azure Synapse Analytics](register-scan-azure-synapse-analytics.md#setting-up-authentication-for-a-scan)

## Create Azure Key Vaults connections in your Azure Purview account

Before you can create a Credential, you will first need to associate one or more of your existing Azure Key Vault instances with your Azure Purview account.

1. From the Azure Purview navigation menu, navigate to the Management Center and then navigate to credentials

2. From the Credentials command bar, select Manage Key Vault connections

    :::image type="content" source="media/manage-credentials/manage-kv-connections.png" alt-text="Manage AKV connections":::

3. Select +New from the Manage Key Vault connections panel 

4. Provide the required information, then select Create

5. Confirm that your Key Vault has been successfully associated with your Azure Purview account

    :::image type="content" source="media/manage-credentials/view-kv-connections.png" alt-text="View AKV connections":::

## Grant the Purview managed identity access to your Azure Key Vault

Navigate to your key vault -> Access policies -> Add Access Policy. Grant Get permission in the Secrets permissions dropdown, and Select Principal to be the Purview MSI. 

:::image type="content" source="media/manage-credentials/add-msi-to-akv.png" alt-text="Add Purview MSI to AKV":::


:::image type="content" source="media/manage-credentials/add-access-policy.png" alt-text="Add access policy":::


:::image type="content" source="media/manage-credentials/save-access-policy.png" alt-text="Save access policy":::

## Create a new credential

Credential type supported in Purview today:
* Basic authentication : You will add the **password** as a secret in key vault
* Service Principal : You will add the **service principal key** as a secret in key vault 
* SQL authentication : You will add the **password** as a secret in key vault
* Account Key : You will add the **account key** as a secret in key vault

Here is more information on how to add secrets to a key vault: (Insert key vault article)

After storing your secrets in your key vault, Create your new Credential by selecting +New from the Credentials command bar. Provide the required information, including selecting the Authentication method and a Key Vault instance from which to select a secret from. Once all the details have been filled in, click on create.

:::image type="content" source="media/manage-credentials/new-credential.png" alt-text="New credential":::

Verify that your new Credential shows up in the Credential list view and is ready to use

:::image type="content" source="media/manage-credentials/view-credentials.png" alt-text="View credential":::

## Manage your key vault connections

1. Search/find Key Vault connections by name

    :::image type="content" source="media/manage-credentials/search-kv.png" alt-text="Search key vault":::

1. Delete one or more Key Vault connections
 
    :::image type="content" source="media/manage-credentials/delete-kv.png" alt-text="Delete key vault":::

## Manage your credentials

1. Search/find Credentials by name
  
2. Select and make updates to an existing Credential

3. Delete one or more Credentials