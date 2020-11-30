---
title: Manage access to SQL pools
description: Learn how to manage access control to SQL pools in an Azure Synapse Analytics workspace.
services: synapse-analytics
author: billgib
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: sql
ms.date: 12/01/2020
ms.author: billgib
ms.reviewer: jrasnick
---

# Manage access to SQL pools

This article describes how to manage data plane access to SQL pool databases in Azure Synapse Analytics.

Access control for SQL pools is controlled using SQL permissions in the database. Assigning these permissions requires scripts are run either at the workspace server level or on each SQL pool database.  

Access control for other Synapse resources and code artifacts is described [here](../security/synapse-workspace-access-control-overview.md).

## Access Control for Workspace

For a production deployment into an Azure Synapse workspace, we suggest organizing your environment to make it easy to provision users and admins.

> [!NOTE]
> The approach taken here is to create several security groups and then configure the workspace to use them consistently. After the groups are set up, an admin only need to manage membership within the security groups.

### Step 1: Set up security groups with names following this pattern

1. Create security group called `Synapse_WORKSPACENAME_Users`
2. Create security group called `Synapse_WORKSPACENAME_Admins`
3. Add `Synapse_WORKSPACENAME_Admins` to `Synapse_WORKSPACENAME_Users`

> [!NOTE]
> Learn how to create a security group in [this article](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-groups-create-azure-portal).
>
> Learn how to add a security group from another security group in [this article](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-groups-membership-azure-portal).
>
> WORKSPACENAME - you should replace this part with your actual workspace name.

### Step 2: Prepare the Default ADLS Gen2 Account

When you provisioned your workspace, you had to pick an [Azure Data Lake Storage Gen2](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-introduction) account and a container for the filesystem for the workspace to use.

1. Open the [Azure portal](https://portal.azure.com)
2. Navigate to the Azure Data Lake Storage Gen2 account
3. Navigate to container (filesystem) you picked for the Azure Synapse workspace
4. Select **Access Control (IAM)**
5. Assign the following roles:
   1. **Reader** role to:  `Synapse_WORKSPACENAME_Users`
   2. **Storage Blob Data Owner** role to:  `Synapse_WORKSPACENAME_Admins`
   3. **Storage Blob Data Contributor** role to: `Synapse_WORKSPACENAME_Users`
   4. **Storage Blob Data Owner** role to:  `WORKSPACENAME`

> [!NOTE]
> WORKSPACENAME - you should replace this part with your actual workspace name.

### Step 3: Configure the workspace admin list

1. Go to the [**Azure Synapse Web UI**](https://web.azuresynapse.net)
2. Go to **Manage**  > **Security** > **Access control**
3. Select **Add Admin**, and select `Synapse_WORKSPACENAME_Admins`

### Step 4: Configure SQL Admin Access for the workspace

1. Go to the [Azure portal](https://portal.azure.com)
2. Navigate to your workspace
3. Go to **Settings** > **Active Directory admin**
4. Select **Set Admin**
5. Select `Synapse_WORKSPACENAME_Admins`
6. Choose **Select**
7. Select **Save**

> [!NOTE]
> WORKSPACENAME - you should replace this part with your actual workspace name.

### Step 5: Add and Remove Users and Admins to Security groups

1. Add users that need administrative access to `Synapse_WORKSPACENAME_Admins`
2. Add all other users to `Synapse_WORKSPACENAME_Users`

> [!NOTE]
> Learn how to add user as a member to a security group in [this article](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-groups-members-azure-portal)
> 
> WORKSPACENAME - you should replace this part with your actual workspace name.

## Access Control to data

Access control to the underlying data is split into three parts:

- Data-plane access to the storage account (already configured above in Step 2)
- Data-plane access to the SQL Databases (for both SQL pools and SQL on-demand)
- Creating a credential for SQL on-demand databases over the storage account

## Access control to SQL pools

> [!TIP]
> The below steps need to be run for **each** SQL pool to grant user access to all SQL databases except in section [Server level permission](#server-level-permission) where you can assign user a sysadmin role.

### Serverless SQL pools

In this section, you can find examples on how to give a user a permission to a particular database or full server permissions.

#### Database level permission

To grant access to a user to a **single** serverless SQL pool, follow the steps in this example:

1. Create LOGIN

    ```sql
    use master
    go
    CREATE LOGIN [alias@domain.com] FROM EXTERNAL PROVIDER;
    go
    ```

2. Create USER

    ```sql
    use yourdb -- Use your DB name
    go
    CREATE USER alias FROM LOGIN [alias@domain.com];
    ```

3. Add USER to members of the specified role

    ```sql
    use yourdb -- Use your DB name
    go
    alter role db_owner Add member alias -- Type USER name from step 2
    ```

> [!NOTE]
> Replace alias with alias of the user or group you would like to give access and domain with the company domain you are using.

#### Server level permission

To grant full access to a user to **all** SQL on-demand databases, follow the step in this example:

```sql
CREATE LOGIN [alias@domain.com] FROM EXTERNAL PROVIDER;
ALTER SERVER ROLE  sysadmin  ADD MEMBER [alias@domain.com];
```

### Dedicated SQL pools

To grant access to a user to a **single** SQL Database, follow these steps:

1. Create the user in the database by running the following command targeting the desired database in the context selector (dropdown to select databases):

    ```sql
    --Create user in SQL DB
    CREATE USER [<alias@domain.com>] FROM EXTERNAL PROVIDER;
    ```

2. Grant the user a role to access the database:

    ```sql
    --Create user in SQL DB
    EXEC sp_addrolemember 'db_owner', '<alias@domain.com>';
    ```

> [!IMPORTANT]
> *db_datareader* and *db_datawriter* can work for read/write permissions if granting *db_owner* permission is undesired.
> For a Spark user to read and write directly from Spark into/from a SQL pool, *db_owner* permission is required.

After creating the users, validate that SQL on-demand can query the storage account.

## Access control to workspace pipeline runs

### Workspace-managed identity

> [!IMPORTANT]
> To successfully run pipelines that include datasets or activities that reference a SQL pool, the workspace identity needs to be granted access to the SQL pool directly.

Run the following commands on each SQL pool to allow the workspace-managed identity to run pipelines on the SQL pool database:

```sql
--Create user in DB
CREATE USER [<workspacename>] FROM EXTERNAL PROVIDER;

--Granting permission to the identity
GRANT CONTROL ON DATABASE::<SQLpoolname> TO <workspacename>;
```

This permission can be removed by running the following script on the same SQL pool:

```sql
--Revoking permission to the identity
REVOKE CONTROL ON DATABASE::<SQLpoolname> TO <workspacename>;

--Deleting the user in the DB
DROP USER [<workspacename>];
```

## Next steps

For an overview of Synapse workspace-managed identity, see [Azure Synapse workspace managed identity](../security/synapse-workspace-managed-identity.md). To learn more about database principals, see [Principals](https://msdn.microsoft.com/library/ms181127.aspx). Additional information about database roles, can be found in the [Database roles](https://msdn.microsoft.com/library/ms189121.aspx) article.
