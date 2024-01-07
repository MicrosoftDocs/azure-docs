---
title: Create and manage credentials for scans
description: Learn about the steps to create and manage credentials in Microsoft Purview.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 10/12/2022
ms.custom: ignite-fall-2021, fasttrack-edit
---

# Credentials for source authentication in Microsoft Purview

This article describes how you can create credentials in Microsoft Purview. These saved credentials let you quickly reuse and apply saved authentication information to your data source scans.

## Prerequisites

- An Azure key vault. To learn how to create one, see [Quickstart: Create a key vault using the Azure portal](../key-vault/general/quick-create-portal.md).

## Introduction

A credential is authentication information that Microsoft Purview can use to authenticate to your registered data sources. A credential object can be created for various types of authentication scenarios, such as Basic Authentication requiring username/password. Credential capture specific information required to authenticate, based on the chosen type of authentication method. Credentials use your existing Azure Key Vaults secrets for retrieving sensitive authentication information during the Credential creation process.

In Microsoft Purview, there are few options to use as authentication method to scan data sources such as the following options. Learn from each [data source article](azure-purview-connector-overview.md) for its supported authentication.

- [Microsoft Purview system-assigned managed identity](#use-microsoft-purview-system-assigned-managed-identity-to-set-up-scans)
- [User-assigned managed identity](#create-a-user-assigned-managed-identity) (preview)
- Account Key (using [Key Vault](#create-azure-key-vaults-connections-in-your-microsoft-purview-account))
- SQL Authentication (using [Key Vault](#create-azure-key-vaults-connections-in-your-microsoft-purview-account))
- Service Principal (using [Key Vault](#create-azure-key-vaults-connections-in-your-microsoft-purview-account))
- Consumer Key (using [Key Vault](#create-azure-key-vaults-connections-in-your-microsoft-purview-account))
- And more

Before creating any credentials, consider your data source types and networking requirements to decide which authentication method you need for your scenario.

## Use Microsoft Purview system-assigned managed identity to set up scans

If you're using the Microsoft Purview system-assigned managed identity (SAMI) to set up scans, you won't need to create a credential and link your key vault to Microsoft Purview to store them. For detailed instructions on adding the Microsoft Purview SAMI to have access to scan your data sources, refer to the data source-specific authentication sections below:

- [Azure Blob Storage](register-scan-azure-blob-storage-source.md#authentication-for-a-scan)
- [Azure Data Lake Storage Gen1](register-scan-adls-gen1.md#authentication-for-a-scan)
- [Azure Data Lake Storage Gen2](register-scan-adls-gen2.md#authentication-for-a-scan)
- [Azure SQL Database](register-scan-azure-sql-database.md)
- [Azure SQL Managed Instance](register-scan-azure-sql-managed-instance.md#authentication-for-registration)
- [Azure Synapse Workspace](register-scan-synapse-workspace.md#authentication-for-registration)
- [Azure Synapse dedicated SQL pools (formerly SQL DW)](register-scan-azure-synapse-analytics.md#authentication-for-registration)

## Grant Microsoft Purview access to your Azure Key Vault

To give Microsoft Purview access to your Azure Key Vault, there are two things you'll need to confirm:

- [Firewall access to the Azure Key Vault](#firewall-access-to-azure-key-vault)
- [Microsoft Purview permissions on the Azure Key Vault](#microsoft-purview-permissions-on-the-azure-key-vault)

### Firewall access to Azure Key Vault

If your Azure Key Vault has disabled public network access, you have two options to allow access for Microsoft Purview.

- [Trusted Microsoft services](#trusted-microsoft-services)
- [Private endpoint connections](#private-endpoint-connections)

#### Trusted Microsoft services

Microsoft Purview is listed as one of [Azure Key Vault's trusted services](../key-vault/general/overview-vnet-service-endpoints.md#trusted-services), so if public network access is disabled on your Azure Key Vault you can enable access only to trusted Microsoft services, and Microsoft Purview will be included.

You can enable this setting in your Azure Key Vault under the **Networking** tab.

At the bottom of the page, under Exception, enable the **Allow trusted Microsoft services to bypass this firewall** feature.

:::image type="content" source="media/manage-credentials/trusted-keyvault-services.png" alt-text="Azure Key Vault networking page with the Allow trusted Microsoft services to bypass this firewall feature enabled.":::

#### Private endpoint connections

To connect to Azure Key Vault with private endpoints, follow [Azure Key Vault's private endpoint documentation](../key-vault/general/private-link-service.md).

> [!NOTE]
> Private endpoint connection option is supported when using Azure integration runtime in [managed virtual network](catalog-managed-vnet.md) to scan the data sources. For self-hosted integration runtime, you need to enable [trusted Microsoft services](#trusted-microsoft-services).

### Microsoft Purview permissions on the Azure Key Vault

Currently Azure Key Vault supports two permission models:

- [Option 1 - Access Policies](#option-1---assign-access-using-key-vault-access-policy)
- [Option 2 - Role-based Access Control](#option-2---assign-access-using-key-vault-azure-role-based-access-control)

Before assigning access to the Microsoft Purview system-assigned managed identity (SAMI), first identify your Azure Key Vault permission model from Key Vault resource **Access Policies** in the menu. Follow steps below based on relevant the permission model.  

:::image type="content" source="media/manage-credentials/akv-permission-model.png" alt-text="Azure Key Vault Permission Model":::

#### Option 1 - Assign access using Key Vault Access Policy  

Follow these steps only if permission model in your Azure Key Vault resource is set to **Vault Access Policy**:

1. Navigate to your Azure Key Vault.

2. Select the **Access policies** page.

3. Select **Add Access Policy**.

   :::image type="content" source="media/manage-credentials/add-msi-to-akv-2.png" alt-text="Add Microsoft Purview managed identity to AKV":::

4. In the **Secrets permissions** dropdown, select **Get** and **List** permissions.

5. For **Select principal**, choose the Microsoft Purview system managed identity. You can search for the Microsoft Purview SAMI using either the Microsoft Purview instance name **or** the managed identity application ID. We don't currently support compound identities (managed identity name + application ID).

   :::image type="content" source="media/manage-credentials/add-access-policy.png" alt-text="Add access policy":::

6. Select **Add**.

7. Select **Save** to save the Access policy.

   :::image type="content" source="media/manage-credentials/save-access-policy.png" alt-text="Save access policy":::

#### Option 2 - Assign access using Key Vault Azure role-based access control 

Follow these steps only if permission model in your Azure Key Vault resource is set to **Azure role-based access control**:

1. Navigate to your Azure Key Vault.

2. Select **Access Control (IAM)** from the left navigation menu.

3. Select **+ Add**.

4. Set the **Role** to **Key Vault Secrets User** and enter your Microsoft Purview account name under **Select** input box. Then, select Save to give this role assignment to your Microsoft Purview account.

   :::image type="content" source="media/manage-credentials/akv-add-rbac.png" alt-text="Azure Key Vault RBAC":::

## Create Azure Key Vaults connections in your Microsoft Purview account

Before you can create a Credential, first associate one or more of your existing Azure Key Vault instances with your Microsoft Purview account.

1. From the [Azure portal](https://portal.azure.com), select your Microsoft Purview account and open the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/). Navigate to the **Management Center** in the studio and then navigate to **credentials**.

2. From the **Credentials** page, select **Manage Key Vault connections**.

   :::image type="content" source="media/manage-credentials/manage-kv-connections.png" alt-text="Manage Azure Key Vault connections":::

3. Select **+ New** from the Manage Key Vault connections page.

4. Provide the required information, then select **Create**.

5. Confirm that your Key Vault has been successfully associated with your Microsoft Purview account as shown in this example:

   :::image type="content" source="media/manage-credentials/view-kv-connections.png" alt-text="View Azure Key Vault connections to confirm.":::

## Create a new credential

These credential types are supported in Microsoft Purview:

- Basic authentication: You add the **password** as a secret in key vault.
- Service Principal: You add the **service principal key** as a secret in key vault.
- SQL authentication: You add the **password** as a secret in key vault.
- Windows authentication: You add the **password** as a secret in key vault.
- Account Key: You add the **account key** as a secret in key vault.
- Role ARN: For an Amazon S3 data source, add your **role ARN** in AWS.
- Consumer Key: For Salesforce data sources, you can add the **password** and the **consumer secret** in key vault.
- User-assigned managed identity (preview): You can add user-assigned managed identity credentials. For more information, see the [create a user-assigned managed identity section](#create-a-user-assigned-managed-identity) below.

For more information, see [Add a secret to Key Vault](../key-vault/secrets/quick-create-portal.md#add-a-secret-to-key-vault) and [Create a new AWS role for Microsoft Purview](register-scan-amazon-s3.md#create-a-new-aws-role-for-microsoft-purview).

After storing your secrets in the key vault:

1. In Microsoft Purview, go to the Credentials page.

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

The following steps will show you how to create a UAMI for Microsoft Purview to use.

### Supported data sources for UAMI

* [Azure Data Lake Gen 1](register-scan-adls-gen1.md) 
* [Azure Data Lake Gen 2](register-scan-adls-gen2.md) 
* [Azure SQL Database](register-scan-azure-sql-database.md) 
* [Azure SQL Managed Instance](register-scan-azure-sql-managed-instance.md)	 
* [Azure SQL Dedicated SQL pools](register-scan-azure-synapse-analytics.md) 
* [Azure Blob Storage](register-scan-azure-blob-storage-source.md) 

### Create a user-assigned managed identity

1. In the [Azure portal](https://portal.azure.com/) navigate to your Microsoft Purview account.

1. In the **Managed identities** section on the left menu, select the **+ Add** button to add user assigned managed identities.  
    
    :::image type="content" source="media/manage-credentials/create-new-managed-identity.png" alt-text="Screenshot showing managed identity screen in the Azure portal with user-assigned and add highlighted.":::
   
1. After finishing the setup, go back to your Microsoft Purview account in the Azure portal. If the managed identity is successfully deployed, you'll see the Microsoft Purview account's status as **Succeeded**.

   :::image type="content" source="media/manage-credentials/status-successful.png" alt-text="Screenshot the Microsoft Purview account in the Azure portal with Status highlighted under the overview tab and essentials menu.":::


1. Once the managed identity is successfully deployed, navigate to the [Microsoft Purview governance portal](https://web.purview.azure.com/), by selecting the **Open Microsoft Purview governance portal** button.

1. In the [Microsoft Purview governance portal](https://web.purview.azure.com/), navigate to the Management Center in the studio and then navigate to the Credentials section.

1. Create a user-assigned managed identity by selecting **+New**. 
1. Select the Managed identity authentication method, and select your user assigned managed identity from the drop-down menu.

   :::image type="content" source="media/manage-credentials/new-user-assigned-managed-identity-credential.png" alt-text="Screenshot showing the new managed identity creation tile, with the Learn More link highlighted.":::  

    >[!NOTE]
    > If the portal was open during creation of your user assigned managed identity, you'll need to refresh the Microsoft Purview web portal to load the settings finished in the Azure portal.

1. After all the information is filled in, select **Create**.


## Next steps

[Create a scan rule set](create-a-scan-rule-set.md)
