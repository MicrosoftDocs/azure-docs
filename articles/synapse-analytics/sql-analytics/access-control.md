---
title: Manage access to workspaces, data, and pipelines
description: Learn how to manage access control to workspaces, data, and pipelines in an Azure Synapse Analytics workspace.
services: sql-analytics
author: azaricstefan
ms.service: synapse-analytics
ms.topic: overview
ms.subservice:
ms.date: 01/13/2019
ms.author: v-stazar
ms.reviewer: jrasnick
---

# Manage access to workspaces, data, and pipelines

## Notes to the reader

- For GA, RBAC will be more developed through the introduction of Synapse-specific Azure RBAC roles

## Access Control for Workspace

For a production deployment into a Synapse workspace, we suggest organizing your environment to make it easy to provision users and admins.

> [!NOTE]
> The approach taken here is to pre-create several security groups and then configure the workspace to use them consistently. So after the groups are setup, an admin only need to manage membership within the security groups.

### STEP 1: Set up security groups with names following this pattern

- Create security group called `Synapse_WORKSPACENAME_Users`
- Create security group called `Synapse_WORKSPACENAME_Admins`
- Add `Synapse_WORKSPACENAME_Admins` to `ProjectSynapse_WORKSPACENAME_Users`

### STEP 2: Prepare the Default ADLS Gen2 Account

When you provisioned your workspace you had to pick an ADLSGEN2 account and a container for the filesystem for the workspace to use.

- Open the Azure Portal (https://portal.azure.com)
- Navigate to the ADLSGEN2 account
- Navigate to container (filesystem) you picked for the Azure Synapse workspace
- Click **Access Control (IAM)**
- Assign roles
  - **Reader** role:  `Synapse_WORKSPACENAME_Users`
  - **Storage Blob Data Owner** role:  `Synapse_WORKSPACENAME_Admins`
  - **Storage Blob Data Contributor** role: `Synapse_WORKSPACENAME_Users`
  - **Storage Blob Data Owner** role:  `WORKSPACENAME`
  
### STEP 3: Configure the workspace admin list

- Go to the **Azure Synapse Web UI** (https://web.azuresynapse.net)
- Go to the **Manage**  > **Security** > **Access control**
- Click **Add Admin**, and select `Synapse_WORKSPACENAME_Admins`

### STEP 4: Configure SQL Admin Access for the workspace

- Open the Azure portal (https://portal.azure.com)
- Navigate to your workspace
- Go to **Settings** > **Active Directory admin**
- Click **Set Admin**
- Select `Synapse_WORKSPACENAME_Admins`
- click **Select**
- click **Save**

### STEP 5: Add and Remove Users and Admins to Security groups

- Add users that need administrative access to `Synapse_WORKSPACENAME_Admins`
- Add all other users to `Synapse_WORKSPACENAME_Users`

## Access Control to data

Access control to the underlying data is split into three parts:

- Data-plane access to the storage account (already configured above in Step 2)
- Data-plane access to the SQL Databases (for both SQL pools and SQL on-demand)
- Creating a credential for SQL on-demand databases over the storage account

> [!TIP]
> Note that the below steps need to be run for **each** SQL database to grant a user access to all SQL databases.

## Access control to SQL Databases

### SQL on-demand

To grant access to a user to a **single** SQL on-demand database, there are three steps:

1. Create LOGIN

    ```sql
    use master
    go
    CREATE LOGIN [John.Thomas@microsoft.com] FROM EXTERNAL PROVIDER;
    go
    ```

2. Create USER

    ```sql
    use yourdb -- Use your DB name
    go
    CREATE USER john FROM LOGIN [John.Thomas@microsoft.com];
    ```

3. Add USER to members of the specified role

    ```sql
    use yourdb -- Use your DB name
    go
    alter role db_owner Add member john -- Type USER name from step 2
    ```

### SQL Pools

To grant access to a user to a **single** SQL Database, there are two steps:

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
> *db_datareader* and *db_datawriter* can work for read/write if granting *db_owner* permission is undesired.
> For a Spark user to read and write directly from Spark into/from a SQL pool, *db_owner* permission is required.

After creating the users, validate that SQL on-demand can query the storage account:

- Run the following command targeting the **master** database of SQL on-demand:

    ```sql
    CREATE CREDENTIAL [https://<storageaccountname>.dfs.core.windows.net]
    WITH IDENTITY='User Identity';
    ```

## Access control to workspace pipeline runs

### Workspace-managed identity

> [!IMPORTANT]
> To successfully run pipelines that include datasets or activities that reference to a SQL pool, the workspace identity needs to be granted access to the SQL pool directly.

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
