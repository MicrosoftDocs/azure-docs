---
title: Use managed identities to access Azure SQL Database or Azure Synapse Analytics - Azure Stream Analytics
description: This article describes how to use managed identities to authenticate your Azure Stream Analytics job to Azure SQL Database or Azure Synapse Analytics output.
author: an-emma
ms.author: raan
ms.service: azure-stream-analytics
ms.topic: how-to
ms.date: 04/29/2026
ms.custom: sfi-image-nochange
---

# Use managed identities to access Azure SQL Database or Azure Synapse Analytics from an Azure Stream Analytics job

Azure Stream Analytics supports [Managed Identity authentication](../active-directory/managed-identities-azure-resources/overview.md) for Azure SQL Database and Azure Synapse Analytics output sinks. Managed identities eliminate the limitations of user-based authentication methods, like the need to reauthenticate due to password changes or user token expirations that occur every 90 days. When you remove the need to manually authenticate, your Stream Analytics deployments can be fully automated.

A managed identity is a managed application registered in Microsoft Entra ID that represents a given Stream Analytics job. The managed application is used to authenticate to a targeted resource. This article shows you how to enable Managed Identity for an Azure SQL Database or an Azure Synapse Analytics output(s) of a Stream Analytics job through the Azure portal.

## Overview

This article shows you the steps needed to connect your Stream Analytics job to your Azure SQL Database or Azure Synapse Analytics SQL pool using Managed Identity authentication mode.

- You first create a system-assigned managed identity for your Stream Analytics job. This is your job’s identity in Microsoft Entra ID.

- Add an Active Directory admin to your SQL server or Synapse workspace, which enables Microsoft Entra ID (Managed Identity) authentication for that resource.

- Next, create a contained user representing the Stream Analytics job's identity in the database. Whenever the Stream Analytics job interacts with your SQL DB or Synapse SQL DB resource, this is the identity it will refer to for checking what permissions your Stream Analytics job has.

- Grant permissions to your Stream Analytics job to access your SQL Database or Synapse SQL pools.

- Finally, add your Azure SQL Database/Azure Synapse Analytics as output in the Stream Analytics job.

## Prerequisites

#### [Azure SQL Database](#tab/azure-sql)

To use this feature, you need:

- An Azure Stream Analytics job.

- An Azure SQL Database resource.

#### [Azure Synapse Analytics](#tab/azure-synapse)

The following are required to use this feature:

- An Azure Stream Analytics job.

- An Azure Synapse Analytics SQL pool.

- An Azure Storage account that is [configured to your Stream Analytics job](azure-synapse-analytics-output.md).

- Note: Stream Analytics account storage MSI integrated with Synapse SQL MSI isn't currently available.

---

## Create a managed identity

First, create a managed identity for your Azure Stream Analytics job.

1. In the [Azure portal](https://portal.azure.com), open your Azure Stream Analytics job.

1. From the left navigation menu, select **Managed Identity** located under **Configure**. Then, check the box next to **Use System-assigned Managed Identity** and select **Save**.

   ![Select system-assigned managed identity](./media/sql-db-output-managed-identity/system-assigned-managed-identity.png)

   Microsoft Entra ID creates a service principal for the Stream Analytics job's identity. Azure manages the life cycle of the newly created identity. When you delete the Stream Analytics job, Azure automatically deletes the associated identity (that is, the service principal).

1. You can also switch to [user-assigned managed identities](stream-analytics-user-assigned-managed-identity-overview.md). 
 
1. When you save the configuration, the Object ID (OID) of the service principal appears as the Principal ID as shown in the following section:

   ![Object ID shown as Principal ID](./media/sql-db-output-managed-identity/principal-id.png)

   The service principal has the same name as the Stream Analytics job. For example, if the name of your job is *MyASAJob*, the name of the service principal is also *MyASAJob*.

## Select an Active Directory admin

After you create a managed identity, select an Active Directory admin.

1. Go to your Azure SQL Database or Azure Synapse Analytics SQL Pool resource. Select the SQL Server or Synapse Workspace that the resource is under. You can find the link to these resources in the resource overview page next to *Server name* or *Workspace name*.

1. Select **Active Directory Admin** or **SQL Active Directory Admin** under **Settings**, for SQL Server and Synapse Workspace respectively. Then, select **Set admin**.

   ![Active Directory admin page](./media/sql-db-output-managed-identity/active-directory-admin-page.png)

1. On the Active Directory admin page, search for a user or group to be an administrator for the SQL Server and select **Select**. This user can create the **Contained Database User** in the next section.

   ![Add Active Directory admin](./media/sql-db-output-managed-identity/add-admin.png)

   The Active Directory admin page shows all members and groups of your Active Directory. Grayed out users or groups can't be selected as they're not supported as Microsoft Entra administrators. See the list of supported admins in the **Microsoft Entra features and Limitations** section of [Use Microsoft Entra authentication for authentication with SQL Database or Azure Synapse](/azure/azure-sql/database/authentication-aad-overview#azure-ad-features-and-limitations).

1. Select **Save** on the **Active Directory admin** page. The process for changing admin takes a few minutes.

## Create a contained database user

Next, create a contained database user in your Azure SQL or Azure Synapse database that is mapped to the Microsoft Entra identity. The contained database user doesn't have a login for the primary database, but it maps to an identity in the directory that is associated with the database. The Microsoft Entra identity can be an individual user account or a group. In this case, you want to create a contained database user for your Stream Analytics job.

For more information, see [Universal Authentication with SQL Database and Azure Synapse Analytics (SSMS support for MFA)](/azure/azure-sql/database/authentication-mfa-ssms-overview).

1. Connect to your Azure SQL or Azure Synapse database by using SQL Server Management Studio. The **User name** is a Microsoft Entra user with the **ALTER ANY USER** permission. The admin you set on the SQL Server is an example. Use **Microsoft Entra ID – Universal with MFA** authentication.

   ![Connect to SQL Server](./media/sql-db-output-managed-identity/connect-sql-server.png)

   The server name `<SQL Server name>.database.windows.net` might be different in different regions. For example, the China region should use `<SQL Server name>.database.chinacloudapi.cn`.

   You can specify a specific Azure SQL or Azure Synapse database by going to **Options > Connection Properties > Connect to Database**.

   ![SQL Server connection properties](./media/sql-db-output-managed-identity/sql-server-connection-properties.png)

1. When you connect for the first time, you might encounter the following window:

   ![New firewall rule window](./media/sql-db-output-managed-identity/new-firewall-rule.png)

   1. If so, go to your SQL Server or Synapse Workspace resource on the Azure portal. Under the **Security** section, open the **Firewalls and virtual network** or **Firewalls** page.
   1. Add a new rule with any rule name.
   1. Use the *From* IP address from the **New Firewall Rule** window for the *Start IP*.
   1. Use the *To* IP address from the **New Firewall Rule** window for *End IP*.
   1. Select **Save** and attempt to connect from SQL Server Management Studio again.

1. Once you're connected, create the contained database user. The following SQL command creates a contained database user that has the same name as your Stream Analytics job. Be sure to include the brackets around the *ASA_JOB_NAME*. Use the following T-SQL syntax and run the query.

   ```sql
   CREATE USER [ASA_JOB_NAME] FROM EXTERNAL PROVIDER;
   ```

    To verify if you added the contained database user correctly, run the following command in SSMS under the pertaining database and check if your *ASA_JOB_NAME* is under the “name” column.

   ```sql
   SELECT * FROM <SQL_DB_NAME>.sys.database_principals
   WHERE type_desc = 'EXTERNAL_USER'
   ```

1. For Microsoft's Microsoft Entra ID to verify if the Stream Analytics job has access to the SQL Database, you need to give Microsoft Entra permission to communicate with the database. To do this, go to the **Firewalls and virtual network** or **Firewalls** page in Azure portal again, and enable **Allow Azure services and resources to access this server** or **workspace**.

   ![Firewall and virtual network](./media/sql-db-output-managed-identity/allow-access.png)

## Grant Stream Analytics job permissions

#### [Azure SQL Database](#tab/azure-sql)

After you create a contained database user and grant access to Azure services in the portal, as described in the previous section, your Stream Analytics job has permission from Managed Identity to **CONNECT** to your Azure SQL database resource via managed identity. Grant the **SELECT** and **INSERT** permissions to the Stream Analytics job, as the job needs these permissions later in the Stream Analytics workflow. The **SELECT** permission allows the job to test its connection to the table in the Azure SQL database. The **INSERT** permission allows testing end-to-end Stream Analytics queries once you configure an input and the Azure SQL database output.

#### [Azure Synapse Analytics](#tab/azure-synapse)

After you create a contained database user and grant access to Azure services in the portal, as described in the previous section, your Stream Analytics job has permission from Managed Identity to **CONNECT** to your Azure Synapse database resource via managed identity. Grant the **SELECT**, **INSERT**, and **ADMINISTER DATABASE BULK OPERATIONS** permissions to the Stream Analytics job, as the job needs these permissions later in the Stream Analytics workflow. The **SELECT** permission allows the job to test its connection to the table in the Azure Synapse database. The **INSERT** and **ADMINISTER DATABASE BULK OPERATIONS** permissions allow testing end-to-end Stream Analytics queries once you configure an input and the Azure Synapse database output.

To grant the **ADMINISTER DATABASE BULK OPERATIONS** permission, grant all permissions that are labeled as **CONTROL** under [Implied by database permission](/sql/t-sql/statements/grant-database-permissions-transact-sql?view=azure-sqldw-latest&preserve-view=true#remarks) to the Stream Analytics job. You need this permission because the Stream Analytics job performs the **COPY** statement, which requires [ADMINISTER DATABASE BULK OPERATIONS and INSERT](/sql/t-sql/statements/copy-into-transact-sql).

---

You can grant those permissions to the Stream Analytics job by using SQL Server Management Studio. For more information, see the GRANT (Transact-SQL) reference.

To grant permission to only a certain table or object in the database, use the following T-SQL syntax and run the query.

#### [Azure SQL Database](#tab/azure-sql)

```sql
GRANT CONNECT TO ASA_JOB_NAME;
GRANT SELECT, INSERT ON OBJECT::TABLE_NAME TO ASA_JOB_NAME;
```

#### [Azure Synapse Analytics](#tab/azure-synapse)

```sql
GRANT CONNECT, CONTROL, ADMINISTER DATABASE BULK OPERATIONS TO ASA_JOB_NAME;
GRANT SELECT, INSERT ON OBJECT::TABLE_NAME TO ASA_JOB_NAME;
```

---

Alternatively, you can right-click on your Azure SQL or Azure Synapse database in SQL Server Management Studio and select **Properties > Permissions**. From the permissions menu, you can see the Stream Analytics job you added previously, and you can manually grant or deny permissions as you see fit.

To look at all the permissions you added to your *ASA_JOB_NAME* user, run the following command in SSMS under the pertaining DB:

```sql
SELECT dbprin.name, dbprin.type_desc, dbperm.permission_name, dbperm.state_desc, dbperm.class_desc, object_name(dbperm.major_id)
FROM sys.database_principals dbprin
LEFT JOIN sys.database_permissions dbperm
ON dbperm.grantee_principal_id = dbprin.principal_id
WHERE dbprin.name = '<ASA_JOB_NAME>'
```

## Create an Azure SQL Database or Azure Synapse output

#### [Azure SQL Database](#tab/azure-sql)

> [!NOTE]
> When you use SQL Managed Instance (MI) as a reference input, you must configure a public endpoint in your SQL Managed Instance. You must specify the fully qualified domain name with the port when configuring the **database** property. For example: `sampleserver.public.database.windows.net,3342`.
>

After you configure your managed identity, you're ready to add an Azure SQL Database or Azure Synapse output to your Stream Analytics job.

Make sure you create a table in your SQL Database with the appropriate output schema. You need to provide the name of this table when you add the SQL Database output to the Stream Analytics job. Also, ensure that the job has **SELECT** and **INSERT** permissions to test the connection and run Stream Analytics queries. If you haven't already done so, see the [Grant Stream Analytics job permissions](#grant-stream-analytics-job-permissions) section.

1. Go back to your Stream Analytics job, and go to the **Outputs** page under **Job Topology**.

1. Select **Add > SQL Database**. In the output properties window of the SQL Database output sink, select **Managed Identity** from the Authentication mode drop-down.

1. Fill out the rest of the properties. To learn more about creating an SQL Database output, see [Create a SQL Database output with Stream Analytics](sql-database-output.md). When you finish, select **Save**.

1. After you select **Save**, a connection test to your resource automatically triggers. Once that test successfully completes, you configured your Stream Analytics job to connect to your Azure SQL Database or Synapse SQL Database by using managed identity authentication mode.

#### [Azure Synapse Analytics](#tab/azure-synapse)

After you configure your managed identity and storage account, you can add an Azure SQL Database or Azure Synapse output to your Stream Analytics job.

Make sure you create a table in your Azure Synapse database with the appropriate output schema. You need to provide the name of this table when you add the Azure Synapse output to the Stream Analytics job. Also, ensure that the job has **SELECT** and **INSERT** permissions to test the connection and run Stream Analytics queries. If you haven't already done so, see the [Grant Stream Analytics job permissions](#grant-stream-analytics-job-permissions) section.

1. Go back to your Stream Analytics job, and navigate to the **Outputs** page under **Job Topology**.

1. Select **Add > Azure Synapse Analytics**. In the output properties window of the SQL Database output sink, select **Managed Identity** from the Authentication mode drop-down.

1. Fill out the rest of the properties. To learn more about creating an Azure Synapse output, see [Azure Synapse Analytics output from Azure Stream Analytics](azure-synapse-analytics-output.md). When you finish, select **Save**.

1. After you select **Save**, a connection test to your resource automatically triggers. Once that test successfully completes, you're ready to proceed with using Managed Identity for your Azure Synapse Analytics resource with Stream Analytics.

---
## Additional steps for SQL reference data

When you use SQL reference data, Azure Stream Analytics requires you to configure your job's storage account. The job uses this storage account to store content related to your Stream Analytics job, such as SQL reference data snapshots.  
Follow these steps to set up an associated storage account:  

1. On the **Stream Analytics job** page, under **Configure** in the left menu, select **Storage account settings**.

1. On the **Stream Analytics job** page, select **Storage account settings** under **Configure** on the left menu.
1. On the **Storage account settings** page, select **Add storage account**.
1. Follow the instructions to configure your storage account settings.

    :::image type="content" source="./media/run-job-in-virtual-network/storage-account-settings.png" alt-text="Screenshot of the Storage account settings page of a Stream Analytics job." :::

    
> [!IMPORTANT]
> - To authenticate by using a connection string, you must disable the storage account firewall settings. 
> - To authenticate by using Managed Identity, you must add your Stream Analytics job to the storage account's access control list for Storage Blob Data Contributor role and 
Storage Table Data Contributor role. If you don't give your job access, the job can't perform any operations. For more information about how to grant access, see Use Azure RBAC to assign a managed identity access to another resource. 


## Additional steps with user-assigned managed identity

Repeat the steps if you selected user-assigned managed identity to connect ASA to Synapse:
1. Create a contained database user. Replace ASA_Job_Name with User-Assigned Managed Identity. See the following example.
   ```sql
   CREATE USER [User-Assigned Managed Identity] FROM EXTERNAL PROVIDER;
   ```
1. Grant permissions to the User-Assigned Managed Identity. Replace ASA_Job_Name with User-Assigned Managed Identity.

For more details, see the preceding sections.

## Remove managed identity

You delete the managed identity you created for a Stream Analytics job only when you delete the job. You can't delete the managed identity without deleting the job. If you no longer want to use the managed identity, change the authentication method for the output. The managed identity continues to exist until you delete the job, and it's used if you decide to use managed identity authentication again.

## Next steps

* [Understand outputs from Azure Stream Analytics](stream-analytics-define-outputs.md)
* [Azure Stream Analytics output to Azure SQL Database](sql-database-output.md)
* [Increase throughput performance to Azure SQL Database from Azure Stream Analytics](stream-analytics-sql-output-perf.md)
* [Use reference data from a SQL Database for an Azure Stream Analytics job](sql-reference-data.md)
* [Update or merge records in Azure SQL Database with Azure Functions](sql-database-upsert.md)
* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
