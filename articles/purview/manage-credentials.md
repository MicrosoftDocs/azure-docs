---
title: Create and manage credentials for scans
description: Learn about the steps to create and manage credentials in Azure Purview.
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 11/10/2021
ms.custom: ignite-fall-2021
---

# Credentials for source authentication in Azure Purview

This article describes how you can create credentials in Azure Purview. These saved credentials let you quickly reuse and apply saved authentication information to your data source scans.

## Prerequisites

- An Azure key vault. To learn how to create one, see [Quickstart: Create a key vault using the Azure portal](../key-vault/general/quick-create-portal.md).

## Introduction

A credential is authentication information that Azure Purview can use to authenticate to your registered data sources. A credential object can be created for various types of authentication scenarios, such as Basic Authentication requiring username/password. Credential capture specific information required to authenticate, based on the chosen type of authentication method. Credentials use your existing Azure Key Vaults secrets for retrieving sensitive authentication information during the Credential creation process.

In Azure Purview, there are few options to use as authentication method to scan data sources such as the following options:

- [Azure Purview system-assigned managed identity](#use-azure-purview-system-assigned-managed-identity-to-set-up-scans)
- [User-assigned managed identity](#create-a-user-assigned-managed-identity) (preview)
- Account Key (using [Key Vault](#create-azure-key-vaults-connections-in-your-azure-purview-account))
- SQL Authentication (using [Key Vault](#create-azure-key-vaults-connections-in-your-azure-purview-account))
- Service Principal (using [Key Vault](#create-azure-key-vaults-connections-in-your-azure-purview-account))
- Consumer Key (using [Key Vault](#create-azure-key-vaults-connections-in-your-azure-purview-account))

Before creating any credentials, consider your data source types and networking requirements to decide which authentication method is needed for your scenario. Review the following decision tree to find which credential is most suitable:

   :::image type="content" source="media/manage-credentials/manage-credentials-decision-tree-small.png" alt-text="Manage credentials decision tree" lightbox="media/manage-credentials/manage-credentials-decision-tree.png":::

## Use Azure Purview system-assigned managed identity to set up scans

If you are using the Azure Purview system-assigned managed identity (SAMI) to set up scans, you will not have to explicitly create a credential and link your key vault to Azure Purview to store them. For detailed instructions on adding the Azure Purview SAMI to have access to scan your data sources, refer to the data source-specific authentication sections below:

- [Azure Blob Storage](register-scan-azure-blob-storage-source.md#authentication-for-a-scan)
- [Azure Data Lake Storage Gen1](register-scan-adls-gen1.md#authentication-for-a-scan)
- [Azure Data Lake Storage Gen2](register-scan-adls-gen2.md#authentication-for-a-scan)
- [Azure SQL Database](register-scan-azure-sql-database.md)
- [Azure SQL Database Managed Instance](register-scan-azure-sql-database-managed-instance.md#authentication-for-registration)
- [Azure Synapse Analytics](register-scan-azure-synapse-analytics.md#authentication-for-registration)

## Grant Azure Purview access to your Azure Key Vault

Currently Azure Key Vault supports two permission models:

- Option 1 - Access Policies 
- Option 2 - Role-based Access Control 

Before assigning access to the Azure Purview system-assigned managed identity (SAMI), first identify your Azure Key Vault permission model from Key Vault resource **Access Policies** in the menu. Follow steps below based on relevant the permission model.  

:::image type="content" source="media/manage-credentials/akv-permission-model.png" alt-text="Azure Key Vault Permission Model"::: 

### Option 1 - Assign access using Key Vault Access Policy  

Follow these steps only if permission model in your Azure Key Vault resource is set to **Vault Access Policy**:

1. Navigate to your Azure Key Vault.

2. Select the **Access policies** page.

3. Select **Add Access Policy**.

   :::image type="content" source="media/manage-credentials/add-msi-to-akv-2.png" alt-text="Add Azure Purview managed identity to AKV":::

4. In the **Secrets permissions** dropdown, select **Get** and **List** permissions.

5. For **Select principal**, choose the Azure Purview system managed identity. You can search for the Azure Purview SAMI using either the Azure Purview instance name **or** the managed identity application ID. We do not currently support compound identities (managed identity name + application ID).

   :::image type="content" source="media/manage-credentials/add-access-policy.png" alt-text="Add access policy":::

6. Select **Add**.

7. Select **Save** to save the Access policy.

   :::image type="content" source="media/manage-credentials/save-access-policy.png" alt-text="Save access policy":::

### Option 2 - Assign access using Key Vault Azure role-based access control 

Follow these steps only if permission model in your Azure Key Vault resource is set to **Azure role-based access control**:

1. Navigate to your Azure Key Vault.

2. Select **Access Control (IAM)** from the left navigation menu.

3. Select **+ Add**.

4. Set the **Role** to **Key Vault Secrets User** and enter your Azure Purview account name under **Select** input box. Then, select Save to give this role assignment to your Azure Purview account.

   :::image type="content" source="media/manage-credentials/akv-add-rbac.png" alt-text="Azure Key Vault RBAC":::

## Create Azure Key Vaults connections in your Azure Purview account

Before you can create a Credential, first associate one or more of your existing Azure Key Vault instances with your Azure Purview account.

1. From the [Azure portal](https://portal.azure.com), select your Azure Purview account and open the [Azure Purview Studio](https://web.purview.azure.com/resource/). Navigate to the **Management Center** in the studio and then navigate to **credentials**.

2. From the **Credentials** page, select **Manage Key Vault connections**.

   :::image type="content" source="media/manage-credentials/manage-kv-connections.png" alt-text="Manage Azure Key Vault connections":::

3. Select **+ New** from the Manage Key Vault connections page.

4. Provide the required information, then select **Create**.

5. Confirm that your Key Vault has been successfully associated with your Azure Purview account as shown in this example:

   :::image type="content" source="media/manage-credentials/view-kv-connections.png" alt-text="View Azure Key Vault connections to confirm.":::

## Create a new credential

These credential types are supported in Azure Purview:

- Basic authentication: You add the **password** as a secret in key vault.
- Service Principal: You add the **service principal key** as a secret in key vault.
- SQL authentication: You add the **password** as a secret in key vault.
- Account Key: You add the **account key** as a secret in key vault.
- Role ARN: For an Amazon S3 data source, add your **role ARN** in AWS.
- Consumer Key: For Salesforce data sources, you can add the **password** and the **consumer secret** in key vault.
- User-assigned managed identity (preview): You can add user-assigned managed identity credentials. For more information, see the [create a user-assigned managed identity section](#create-a-user-assigned-managed-identity) below.

For more information, see [Add a secret to Key Vault](../key-vault/secrets/quick-create-portal.md#add-a-secret-to-key-vault) and [Create a new AWS role for Azure Purview](register-scan-amazon-s3.md#create-a-new-aws-role-for-azure-purview).

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

## Create a user-assigned managed identity

User-assigned managed identities (UAMI) enable Azure resources to authenticate directly with other resources using Azure Active Directory (Azure AD) authentication, without the need to manage those credentials. They allow you to authenticate and assign access just like you would with a system assigned managed identity, Azure AD user, Azure AD group, or service principal. User-assigned managed identities are created as their own resource (rather than being connected to a pre-existing resource). For more information about managed identities, see the [managed identities for Azure resources documentation](../active-directory/managed-identities-azure-resources/overview.md).

The following steps will show you how to create a UAMI for Azure Purview to use.

### Supported data sources for UAMI

* [Azure Data Lake Gen 1](register-scan-adls-gen1.md) 
* [Azure Data Lake Gen 2](register-scan-adls-gen2.md) 
* [Azure SQL Database](register-scan-azure-sql-database.md) 
* [Azure SQL Database Managed Instance](register-scan-azure-sql-database-managed-instance.md)	 
* [Azure SQL Dedicated SQL pools](register-scan-azure-synapse-analytics.md) 
* [Azure Blob Storage](register-scan-azure-blob-storage-source.md) 

### Create a user-assigned managed identity

1. In the [Azure Portal](https://portal.azure.com/) navigate to your Azure Purview account.

1. In the **Managed identities** section on the left menu, select the **+ Add** button to add user assigned managed identities.  
    
    :::image type="content" source="media/manage-credentials/create-new-managed-identity.png" alt-text="Screenshot showing managed identity screen in the Azure portal with user-assigned and add highlighted.":::
   
1. After finishing the setup, go back to your Azure Purview account in the Azure Portal. If the managed identity is successfully deployed, you'll see the Azure Purview account's status as **Succeeded**.

   :::image type="content" source="media/manage-credentials/status-successful.png" alt-text="Screenshot the Azure Purview account in the Azure Portal with Status highlighted under the overview tab and essentials menu.":::


1. Once the managed identity is successfully deployed, navigate to the [Azure Purview Studio](https://web.purview.azure.com/), by selecting the **Open Azure Purview Studio** button.

1. In the [Azure Purview Studio](https://web.purview.azure.com/), navigate to the Management Center in the studio and then navigate to the Credentials section.

1. Create a user-assigned managed identity by selecting **+New**. 
1. Select the Managed identity authentication method, and select your user assigned managed identity from the drop down menu.

   :::image type="content" source="media/manage-credentials/new-user-assigned-managed-identity-credential.png" alt-text="Screenshot showing the new managed identity creation tile, with the Learn More link highlighted.":::  

    >[!NOTE]
    > If the portal was open during creation of your user assigned managed identity, you'll need to refresh the Azure Purview web portal to load the settings finished in the Azure portal.

1. After all the information is filled in, select **Create**.


## Next steps

[Create a scan rule set](create-a-scan-rule-set.md)
