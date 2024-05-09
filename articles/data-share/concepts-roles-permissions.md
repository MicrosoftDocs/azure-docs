---
title: Roles and requirements for Azure Data Share   
description: Learn about the permissions required to share and receive data using Azure Data Share.
author: sidontha
ms.author: sidontha
ms.service: data-share
ms.topic: conceptual
ms.date: 01/03/2023
ms.custom: subject-rbac-steps
---

# Roles and requirements for Azure Data Share

This article describes roles and permissions required to share and receive data using Azure Data Share service. 

## Roles and requirements

With Azure Data Share service, you can share data without exchanging credentials between data provider and consumer. For snapshot-based sharing, Azure Data Share service uses Managed Identities (previously known as MSIs) to authenticate to Azure data store.

To create shares in Azure Data share, a user will need these permissions:

- Data share account permissions: **Contributor**
- Storage resource group: **Reader** (Read permissions on the resource group where your storage accounts or databases live you permission to browse for them in the portal.)
- Source permissions, depending on the source:
    - [Storage and data lake sharing](#storage-and-data-lake-sharing)
    - [Azure SQL sharing](#sql-database-sharing)
    - [Azure Synapse analytics sharing](#azure-synapse-analytics-sharing)

### Storage and data lake sharing

|Data store type|Action|Role on source data store|Role on target data store|Note|
|--|--|--|--|--|
|Azure Blob Storage|Share data|Storage Account Contributor\*\*||\*\*Instead, you could create a [custom role with the necessary storage actions](#custom-roles-for-data-share)|
||Receive Data||Storage Account Contributor\*\*|\*\*Instead, you could create a [custom role with the necessary storage actions](#custom-roles-for-data-share)|
||Automatically assign MI permissions to share|A role with *Microsoft.Authorization/role assignments/write*\*||Optional. Instead, you could [assign the MI permissions manually.](#assign-mi-permissions-manually)|
||Automatically assign MI permissions to receive||A role with *Microsoft.Authorization/role assignments/write*\*|Optional. Instead, you could [assign the MI permissions manually.](#assign-mi-permissions-manually)|
|Azure Data Lake Gen 1|Share data|[Access and write permissions on the files you want to share.](../data-lake-store/data-lake-store-access-control.md#permissions)|||
||Receive Data|||Not Supported|
||Automatically assign MI permissions to share|A role with *Microsoft.Authorization/role assignments/write*\*||Optional. Instead, you could [assign the MI permissions manually.](#assign-mi-permissions-manually)|
||Automatically assign MI permissions to receive|||Not supported.|
|Azure Data Lake Gen 2|Share data|Storage Account Contributor\*\*||\*\*Instead, you could create a [custom role with the necessary storage actions](#custom-roles-for-data-share)|
||Receive Data||Storage Account Contributor\*\*|\*\*Instead, you could create a [custom role with the necessary storage actions](#custom-roles-for-data-share)|
||Automatically assign MI permissions to share|A role with *Microsoft.Authorization/role assignments/write*\*||Optional. Instead, you could [assign the MI permissions manually.](#assign-mi-permissions-manually)|
||Automatically assign MI permissions to receive||A role with *Microsoft.Authorization/role assignments/write*\*|Optional. Instead, you could [assign the MI permissions manually.](#assign-mi-permissions-manually)|

\* This permission exists in the **Owner** role.

For more information about sharing to and from Azure storage, see [the article to share and receive data from Azure Blob Storage and Azure Data Lake Storage.](how-to-share-from-storage.md)

### SQL database sharing

To share data from SQL, you can use either:

- [Microsoft Entra authentication](#microsoft-entra-authentication-to-share)
- [SQL authentication](#sql-authentication-to-share)

To receive data into SQL, you'll need to [assign permissions to receive data](#authentication-to-receive-in-sql).

#### Microsoft Entra authentication to share

These prerequisites cover the authentication you'll need so Azure Data Share can connect with your Azure SQL Database:

- You'll need permission to write to the databases on SQL server: *Microsoft.Sql/servers/databases/write*. This permission exists in the **Contributor** role.
- SQL Server **Microsoft Entra Admin** permissions.
- SQL Server Firewall access:
    1. In the [Azure portal](https://portal.azure.com/), navigate to your SQL server. Select *Firewalls and virtual networks* from left navigation.
    1. Select **Yes** for *Allow Azure services and resources to access this server*.
    1. Select **+Add client IP**. Client IP address can change, so you might need to add your client IP again next time you share data from the portal.
    1. Select **Save**.

#### SQL authentication to share

You can follow the [step by step demo video](https://youtu.be/hIE-TjJD8Dc) to configure authentication, or complete each of these prerequisites:

- Permission to write to the databases on SQL server: *Microsoft.Sql/servers/databases/write*. This permission exists in the **Contributor** role.
- Permission for the Azure Data Share resource's managed identity to access the database:
    1. In the [Azure portal](https://portal.azure.com/), navigate to the SQL server and set yourself as the **Microsoft Entra Admin**.
    1. Connect to the Azure SQL Database/Data Warehouse using the [Query Editor](/azure/azure-sql/database/connect-query-portal#connect-using-azure-active-directory) or SQL Server Management Studio with Microsoft Entra authentication.
    1. Execute the following script to add the Data Share resource-Managed Identity as a db_datareader. Connect using Active Directory and not SQL Server authentication.

        ```sql
        create user "<share_acct_name>" from external provider;     
        exec sp_addrolemember db_datareader, "<share_acct_name>"; 
        ```

       > [!Note]
       > The *<share_acc_name>* is the name of your Data Share resource.

- An Azure SQL Database User with **'db_datareader'** access to navigate and select the tables or views you wish to share.

- SQL Server Firewall access:
    1. In the [Azure portal](https://portal.azure.com/), navigate to SQL server. Select *Firewalls and virtual networks* from left navigation.
    1. Select **Yes** for *Allow Azure services and resources to access this server*.
    1. Select **+Add client IP**. Client IP address can change, so you might need to add your client IP again next time you share data from the portal.
    1. Select **Save**.

#### Authentication to receive in SQL

For a SQL server where you're the **Microsoft Entra admin** of the SQL server, complete these prerequisites before accepting a data share:

- An [Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart) or [Azure Synapse Analytics (formerly Azure SQL DW)](../synapse-analytics/get-started-create-workspace.md).
- Permission to write to the databases on SQL server: *Microsoft.Sql/servers/databases/write*. This permission exists in the **Contributor** role.
- SQL Server Firewall access:
    1. In the [Azure portal](https://portal.azure.com/), navigate to your SQL server. Select **Firewalls and virtual networks** from left navigation.
    1. Select **Yes** for *Allow Azure services and resources to access this server*.
    1. Select **+Add client IP**. Client IP address can change, so you might need to add your client IP again next time you share data from the portal.
    1. Select **Save**.

For a SQL server where you're **not** the **Microsoft Entra admin**, complete these prerequisites before accepting a data share:

You can follow the [step by step demo video](https://youtu.be/aeGISgK1xro), or the steps below to configure prerequisites.

- An [Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart) or [Azure Synapse Analytics (formerly Azure SQL DW)](../synapse-analytics/get-started-create-workspace.md).
- Permission to write to databases on the SQL server: *Microsoft.Sql/servers/databases/write*. This permission exists in the **Contributor** role.
- Permission for the Data Share resource's managed identity to access the Azure SQL Database or Azure Synapse Analytics:
    1. In the [Azure portal](https://portal.azure.com/), navigate to the SQL server and set yourself as the **Microsoft Entra Admin**.
    1. Connect to the Azure SQL Database/Data Warehouse using the [Query Editor](/azure/azure-sql/database/connect-query-portal#connect-using-azure-active-directory) or SQL Server Management Studio with Microsoft Entra authentication.
    1. Execute the following script to add the Data Share Managed Identity as a 'db_datareader, db_datawriter, db_ddladmin'.

        ```sql
        create user "<share_acc_name>" from external provider; 
        exec sp_addrolemember db_datareader, "<share_acc_name>"; 
        exec sp_addrolemember db_datawriter, "<share_acc_name>"; 
        exec sp_addrolemember db_ddladmin, "<share_acc_name>";
        ```

       > [!Note]
       > The *<share_acc_name>* is the name of your Data Share resource.

- SQL Server Firewall access:
    1. In the [Azure portal](https://portal.azure.com/), navigate to the SQL server and select **Firewalls and virtual networks**.
    1. Select **Yes** for **Allow Azure services and resources to access this server**.
    1. Select **+Add client IP**. Client IP address can change, so you might need to add your client IP again next time you share data from the portal.
    1. Select **Save**.

For more information about sharing to and from Azure SQL, see [the article to share and receive data from Azure SQL Database.](how-to-share-from-sql.md)

### Azure synapse analytics sharing

#### Share

- Permission to write to the SQL pool in Synapse workspace: *Microsoft.Synapse/workspaces/sqlPools/write*. This permission exists in the **Contributor** role.
- Permission for the Data Share resource's managed identity to access Synapse workspace SQL pool:
    1. In the [Azure portal](https://portal.azure.com/), navigate to your Synapse workspace. Select **SQL Active Directory admin** from left navigation and set yourself as the **Microsoft Entra admin**.
    1. Open the Synapse Studio, select **Manage** from the left navigation. Select **Access control** under Security. Assign yourself the **SQL admin** or **Workspace admin** role.
    1. Select **Develop** from the left navigation in the Synapse Studio. Execute the following script in SQL pool to add the Data Share resource-Managed Identity as a db_datareader.

        ```sql
        create user "<share_acct_name>" from external provider;     
        exec sp_addrolemember db_datareader, "<share_acct_name>"; 
        ```

       > [!Note]
       > The *<share_acc_name>* is the name of your Data Share resource.

- Synapse workspace Firewall access:
    1. In the [Azure portal](https://portal.azure.com/), navigate to Synapse workspace. Select **Firewalls** from left navigation.
    1. Select **ON** for **Allow Azure services and resources to access this workspace**.
    1. Select **+Add client IP**. Client IP address can change, so you might need to add your client IP again next time you share data from the portal.
    1. Select **Save**.

#### Receive

- An Azure Synapse Analytics (workspace) dedicated SQL pool. Receiving data into serverless SQL pool isn't currently supported.
- Permission to write to the SQL pool in Synapse workspace: *Microsoft.Synapse/workspaces/sqlPools/write*. This permission exists in the **Contributor** role.
- Permission for the Data Share resource's managed identity to access the Synapse workspace SQL pool:
    1. In the [Azure portal](https://portal.azure.com/), navigate to Synapse workspace.
    1. Select SQL Active Directory admin from left navigation and set yourself as the **Microsoft Entra admin**.
    1. Open Synapse Studio, select **Manage** from the left navigation. Select **Access control** under Security. Assign yourself the **SQL admin** or **Workspace admin** role.
    1. In Synapse Studio, select **Develop** from the left navigation. Execute the following script in SQL pool to add the Data Share resource-Managed Identity as a 'db_datareader, db_datawriter, db_ddladmin'.

        ```sql
        create user "<share_acc_name>" from external provider; 
        exec sp_addrolemember db_datareader, "<share_acc_name>"; 
        exec sp_addrolemember db_datawriter, "<share_acc_name>"; 
        exec sp_addrolemember db_ddladmin, "<share_acc_name>";
        ```

       > [!Note]
       > The *<share_acc_name>* is the name of your Data Share resource.  

- Synapse workspace Firewall access:
    1. In the [Azure portal](https://portal.azure.com/), navigate to Synapse workspace. Select *Firewalls* from left navigation.
    1. Select **ON** for **Allow Azure services and resources to access this workspace**.
    1. Select **+Add client IP**. Client IP address is subject to change. This process might need to be repeated the next time you're sharing SQL data from Azure portal.
    1. Select **Save**.

For more information about sharing to and from Azure Synapse analytics, see [the article to share and receive data from Azure Synapse Analytics.](how-to-share-from-sql.md)

## Assign MI permissions manually

If a user has *Microsoft.Authorization/role assignments/write* permissions on a source or target data store, it will automatically assign Azure Data Share's Managed identity the permissions it needs to authenticate with the data store. You can also assign managed identity permissions manually.

If you choose to assign permissions manually, assign these permissions to your Azure Data Share resource's managed identity based on source and action:

|**Data Store Type**|**Data Provider Source Data Store**|**Data Consumer Target Data Store**|
|---|---|---|
|Azure Blob Storage| [Storage Blob Data Reader](#data-provider-example) | [Storage Blob Data Contributor](#data-consumer-example)|
|Azure Data Lake Gen1 | Owner | Not Supported|
|Azure Data Lake Gen2 | [Storage Blob Data Reader](#data-provider-example) | [Storage Blob Data Contributor](#data-consumer-example)|
|Azure SQL Database | [db_datareader](how-to-share-from-sql.md#sql-authentication)| [db_datareader, db_datawriter, db_ddladmin](how-to-share-from-sql.md#prerequisites-for-receiving-data-into-azure-sql-database-or-azure-synapse-analytics-formerly-azure-sql-dw)|
|Azure Synapse Analytics | [db_datareader](how-to-share-from-sql.md#prerequisites-for-sharing-from-azure-synapse-analytics-workspace-sql-pool) | [db_datareader, db_datawriter, db_ddladmin](how-to-share-from-sql.md#prerequisites-for-receiving-data-into-azure-synapse-analytics-workspace-sql-pool)|

### Data provider example

When you share data from a storage account, the data share resource's managed identity is granted the *Storage Blob Data Reader* role. 

This is done automatically by the Azure Data Share service when user is adding dataset via Azure portal and the user is an owner of the Azure data store, or is a member of a custom role that has the *Microsoft.Authorization/role assignments/write* permission assigned.

Alternatively, user can have the owner of the Azure data store add the data share resource's managed identity to the Azure data store manually. This action only needs to be performed once per data share resource.

To create a role assignment for the data share resource's managed identity manually, use the following steps:

1. Navigate to the Azure data store.

1. Select **Access control (IAM)**.

1. Select **Add > Add role assignment**.

   :::image type="content" source="../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png" alt-text="Screenshot that shows Access control (IAM) page with Add role assignment menu open.":::

1. On the **Role** tab, select one of the roles listed in the role assignment table in the previous section.

1. On the **Members** tab, select **Managed identity**, and then select **Select members**.

1. Select your Azure subscription.

1. Select **System-assigned managed identity**, search for your Azure Data Share resource, and then select it.

1. On the **Review + assign** tab, select **Review + assign** to assign the role.

To learn more about role assignments, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml). If you're sharing data using REST APIs, you can create role assignment using API by referencing [Assign Azure roles using the REST API](../role-based-access-control/role-assignments-rest.md). 

For SQL snapshot-based sharing, a SQL user needs to be created from an external provider in SQL Database with the same name as the Azure Data Share resource while connecting to SQL database using Microsoft Entra authentication. This user needs to be granted *db_datareader* permission. A sample script along with other prerequisites for SQL-based sharing can be found in the [Share from Azure SQL Database or Azure Synapse Analytics](how-to-share-from-sql.md) tutorial.

### Data consumer example

To receive data into storage account, consumer data share resource's managed identity needs to be granted access to the target storage account. The data share resource's managed identity needs to be granted the *Storage Blob Data Contributor* role. This is done automatically by the Azure Data Share service if the user specifies a target storage account via Azure portal and the user has proper permission. For example, user is an owner of the storage account, or is a member of a custom role that has the *Microsoft.Authorization/role assignments/write* permission assigned. 

Alternatively, user can have owner of the storage account add the data share resource's managed identity to the storage account manually. This action only needs to be performed once per data share resource. To create a role assignment for the data share resource's managed identity manually, follow the below steps.

1. Navigate to the Azure data store.

1. Select **Access control (IAM)**.

1. Select **Add > Add role assignment**.

   :::image type="content" source="../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png" alt-text="Screenshot that shows Access control (IAM) page with Add role assignment menu open.":::

1. On the **Role** tab, select one of the roles listed in the role assignment table in the previous section. For example, for a storage account, select Storage Blob Data Reader.

1. On the **Members** tab, select **Managed identity**, and then select **Select members**.

1. Select your Azure subscription.

1. Select **System-assigned managed identity**, search for your Azure Data Share resource, and then select it.

1. On the **Review + assign** tab, select **Review + assign** to assign the role.

To learn more about role assignments, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml). If you're receiving data using REST APIs, you can create role assignment using API by referencing [Assign Azure roles using the REST API](../role-based-access-control/role-assignments-rest.md). 

For SQL-based target, a SQL user needs to be created from an external provider in SQL Database with the same name as the Azure Data Share resource while connecting to SQL database using Microsoft Entra authentication. This user needs to be granted *db_datareader, db_datawriter, db_ddladmin* permission. A sample script along with other prerequisites for SQL-based sharing can be found in the [Share from Azure SQL Database or Azure Synapse Analytics](how-to-share-from-sql.md) tutorial. 

## Resource provider registration 

You might need to manually register the Microsoft.DataShare resource provider into your Azure subscription in the following scenarios: 

* View Azure Data Share invitation for the first time in your Azure tenant
* Share data from an Azure data store in a different Azure subscription from your Azure Data Share resource
* Receive data into an Azure data store in a different Azure subscription from your Azure Data Share resource

Follow these steps to register the Microsoft.DataShare resource provider into your Azure Subscription. You need *Contributor* access to the Azure subscription to register resource provider.

1. In the Azure portal, navigate to **Subscriptions**.
1. Select the subscription that you're using for Azure Data Share.
1. Select on **Resource Providers**.
1. Search for Microsoft.DataShare.
1. Select **Register**.
 
To learn more about resource provider, refer to [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md).

## Custom roles for Data Share

This section describes custom roles and permissions required within the custom roles for sharing and receiving data, specific to a Storage account. There are also prerequisites that are independent of custom role or Azure Data Share role. 

### Prerequisites for Data Share, in addition to custom role

* For storage and data lake snapshot-based sharing, to add a dataset in Azure Data Share, the provider data share resource's managed identity needs to be granted access to the source Azure data store.  For example, if using a storage account, the data share resource's managed identity is granted the Storage Blob Data Reader role.  
* To receive data into a storage account, the consumer data share resource's managed identity needs to be granted access to the target storage account. The data share resource's managed identity needs to be granted the Storage Blob Data Contributor role.  
* You might also need to manually register the Microsoft.DataShare resource provider into your Azure subscription for some scenarios. See in [Resource provider registration](#resource-provider-registration) section of this article for specific details. 

### Create custom roles and required permissions

Custom roles can be created in a subscription or resource group for sharing and receiving data. Users and groups can then be assigned the custom role. 

* For creating a custom role, there are actions required for Storage, Data Share, Resources group, and Authorization. See the [Azure resource provider operations document](../role-based-access-control/resource-provider-operations.md#microsoftdatashare) for Data Share to understand the different levels of permissions and choose the ones relevant for your custom role. 
* Alternately, you can use the Azure portal to navigate to IAM, Custom role, Add permissions, Search, search for Microsoft.DataShare permissions to see the list of actions available. 
* To learn more about custom role assignment, refer to [Azure custom roles](../role-based-access-control/custom-roles.md). Once you have your custom role, test it to verify that it works as you expect.  

The following shows an example of how the required actions will be listed in JSON view for a custom role to share and receive data. 

```json
{
"Actions": [ 

"Microsoft.Storage/storageAccounts/read",  

"Microsoft.Storage/storageAccounts/write",  

"Microsoft.Storage/storageAccounts/blobServices/containers/read", 

"Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey/action",

"Microsoft.Storage/storageAccounts/listkeys/action",

"Microsoft.DataShare/accounts/read", 

"Microsoft.DataShare/accounts/providers/Microsoft.Insights/metricDefinitions/read", 

"Microsoft.DataShare/accounts/shares/listSynchronizations/action", 

"Microsoft.DataShare/accounts/shares/synchronizationSettings/read", 

"Microsoft.DataShare/accounts/shares/synchronizationSettings/write", 

"Microsoft.DataShare/accounts/shares/synchronizationSettings/delete", 

"Microsoft.DataShare/accounts/shareSubscriptions/*", 

"Microsoft.DataShare/listInvitations/read", 

"Microsoft.DataShare/locations/rejectInvitation/action", 

"Microsoft.DataShare/locations/consumerInvitations/read", 

"Microsoft.DataShare/locations/operationResults/read", 

"Microsoft.Resources/subscriptions/resourceGroups/read", 

"Microsoft.Resources/subscriptions/resourcegroups/resources/read", 

"Microsoft.Authorization/roleAssignments/read", 
 ] 
}
```

## Next steps

- Learn more about roles in Azure - [Understand Azure role definitions](../role-based-access-control/role-definitions.md)
