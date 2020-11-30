---
title: How to set up and secure your Synapse workspace (preview)
description: This article will teach you how to use roles and access control to control activities and access to data in a Synapse workspace.
services: synapse-analytics 
author: billgib 
ms.service: synapse-analytics 
ms.topic: how-to 
ms.subservice: security 
ms.date: 12/03/2020 
ms.author: billgib
ms.reviewer: jrasnick
---
# How to set up and secure your Synapse workspace 

This article will teach you how to use Azure roles, Synapse roles, SQL permissions, and Git permissions to control access and use of Synapse workspace and the data it contains and accesses.   

You will set up a workspace and provide it with a basic access control system suitable for many projects.  It then describes more advanced options for finer-grained control should you need it.  

The process is simplified by using security groups that are aligned with roles.  You only need to add and remove users from security groups to manage access.

Before you start, read the [Synapse access control overview](./synapse-workspace-access-control-overview) to familiarize yourself with the access control mechanisms used by Synapse.

In this article, you'll first set up a workspace and configure access control for the Synapse live model and then consider how to adjust access control patterns for the Git-enabled model.   

## Access control mechanisms

> [!NOTE]
> The approach taken in this article is to create several security groups and then configure the workspace to use them consistently. After the groups are set up, an admin only need to manage membership within the security groups.

To secure a Synapse workspace, you'll follow a pattern of configuring the following items:

- **Security Groups**, to manage groups of users with similar access requirements.
- **Azure roles**, to control creation and management of SQL pools, Apache Spark pools and Integration runtimes and access to data lake storage accounts.
- **Synapse roles**, to control access to development artifacts and use of Synapse compute resources.
- **SQL permissions**, to control administrative and data plane access to SQL pools. 
- **Git permissions**, if you choose to configure Git-support for the workspace.
 
## Steps to secure a Synapse workspace

This document uses standard names to simplify the instructions. Replace them with names of your choice.

|Setting | Example value | Description |
| :------ | :-------------- | :---------- |
| **Synapse workspace** | `workspace1` |  The name that the Synapse workspace will have. |
| **ADLSGEN2 account** | `storage1` | The ADLS account to use with your workspace. |
| **Container** | `container1` | The container in STG1 that the workspace will use by default. |
| **Active directory tenant** | `contoso` | the active directory tenant name.|
||||

## STEP 1: Set up security groups

>[!Note] During the preview, it was recommended to create security groups mapped to the Synapse **Synapse SQL Administrator** and **Synapse Apache Spark Administrator** roles.  With the introduction of new finer-grained Synapse RBAC roles and scopes, it is now recommended that you use these new capabilities to control access to your workspace.  These new roles and scopes provide more configuration flexibility and recognize that developers often use a mix of SQL and Spark in creating analytics applications and may need to be granted access to specific resources within the workspace. [Learn more](./synapse-workspace-synapse-rbac.md).

Create the following security groups for your workspace:

- **`workspace1_SynapseAdministrators`**, for users who need complete control over the workspace.  Add yourself to this security group, at least initially.
- **`workspace1_SynapseContributors`**, for developers who need to develop, debug, and publish code to the service.   
- **`workspace1_SynapseComputeOperators`**, for users who need to manage and monitor Apache Spark pools and Integration runtimes.
- **`workspace1_SynapseCredentialUsers`**, for users who need to debug and run orchestration pipelines using the workspace MSI (managed service identity) credential and cancel pipeline runs.   

You'll assign Synapse roles to these groups at the workspace scope shortly.  

Additionally create the **`workspace1_SQLAdministrators`**, group for users who need Active Directory Admin authority within SQL pools in the workspace. 

The `workspace1_SynapseSQLAdministrators` group 

For a basic setup, these five groups are sufficient. Later, you can consider adding security groups to handle users who need more specialized access or to give users access only to specific resources.

> [!NOTE]
>- Learn how to create a security group in [this article](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-groups-create-azure-portal).
>- Learn how to add a security group from another security group in [this article](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-groups-membership-azure-portal).

>[!Tip]
>Individual Synapse users can use Azure Active Directory in the Azure portal to view their group memberships to determine which roles they've been granted.

## STEP 2: Prepare your ADLS Gen2 storage account

A Synapse workspace uses a default storage container:
  - Storing the backing data files for Spark tables
  - Execution logs for Spark jobs

Identify the following information about your storage:

- The ADLS Gen2 account to use for your workspace. This document calls it `storage1`. `storage1` is considered the "primary" storage account for your workspace.
- The container inside `workspace1` that your Synapse workspace will use by default. This document calls it `container1`. 

>[!Important]
>`storage1` must have the hierarchical namespace enabled to be an ADLS Gen2 account.

- Using the Azure portal, assign the following Azure roles on `container1` to the security groups 

  - Assign the **Storage Blob Data Contributor** role to `workspace1_SynapseAdmins` 
  - Assign the **Storage Blob Data Contributor** role to `workspace1_SynapseContributors`
  - Assign the **Storage Blob Data Contributor** role to `workspace1_SynapseComputeOperators`  **<< VALIDATE**

## STEP 3: Create and configure your Synapse Workspace

In the Azure portal, create a Synapse workspace:

- Select your subscription
- Select or create a resource group for which you have the Azure **Owner** role.
- Name the workspace `workspace1`
- Choose `storage1` for the Storage account
- Choose `container1` for the container that is being used as the "filesystem".
- Open WS1 in Synapse Studio
- Navigate to **Manage** > **Access Control** and assign the following Synapse roles at *workspace scope* to the security groups.
  - Assign the **Synapse Administrator** role to `workspace1_SynapseAdministrators` 
  - Assign the **Synapse Contributor** role to `workspace1_SynapseContributors` 
  - Assign the **Synapse SQL Compute Operator** role to `workspace1_SynapseComputeOperators`

## STEP 4: Grant the workspace MSI access to the default storage container

To run pipelines and perform system tasks, Synapse requires that the workspace managed service identity (MSI) needs access to `container1` in the default ADLS Gen2 account.

- Open the Azure portal
- Locate the storage account, `storage1`, and then `container1`
- Using **Access Control (IAM)**, ensure that the **Storage Blob Data Contributor** role is assigned to the workspace MSI
  - If it's not assigned, assign it.
  - The MSI has the same name as the workspace. In this article, it would be `workspace1`.

## STEP 5: Grant the Synapse Administrators the Azure Contributor role on the workspace 

To create SQL pools, Apache Spark pools and Integration runtimes, users must have at least Azure Contributor access on the workspace. This role also allows them to manage the resources, including pausing and scaling.   

- Open the Azure portal
- Locate the workspace, `workspace1`
- Assign the **Azure Contributor** role on `workspace1` to `workspace1_SynapseAdministrators`. 

## STEP 6: Assign SQL Active Directory Admin role (optional)

The workstation creator is automatically set up as the Active Directory Admin at the workspace (server).  Only a single user or group can be granted this role. 

In this step, you assign the Active Directory Admin on the workspace  to the `workspace1_SynapseSQLAdministrators` security group.  Assigning this role gives this group highly privileged admin access to all SQL pools.   

- Open the Azure portal
- Navigate to `workspace1`
- Under **Settings**, select **SQL Active Directory admin**
- Select **Set admin** and choose **`workspace1_SynapseSQLAdministrators`**

>[!Note]
>This step is optional.  You may choose to grant the SQL administrators group a less privileged role. To assign `db_owner` or other SQL roles, you must run scripts on each SQL database.  [Learn more](../sql/access-control.md). 

## STEP 7: Grant access to serverless SQL pools

By default, all users assigned the Synapse Administrator role also receive the `db_owner` SQL role on the serverless SQL pool, 'Built-in'.

Access to SQL pools for other users and the workspace MSI is otherwise controlled using SQL permissions, which require that SQL scripts are run on each pool database.  There are three cases addressed by running scripts:
1. Granting other users access to the serverless SQL pool, 'Built-in'
2. Granting any user access access to dedicated pools
3. Granting the workspace MSI access to a SQL pool to enable pipelines that require SQL pool access to run successfully.

Examples of each of these scripts are included below.

To grant access to a dedicated SQL pool, the scripts can be run by the workspace creator or any member of the `workspace1_SynapseSQL Administrators` group.  

To grant access to the serverless SQL pool, 'Built-in', the scripts can additionally be run by any member of the  `workspace1_SynapseAdministrators` group. 

> [!TIP]
> The below steps need to be run for **each** SQL pool to grant user access to all SQL databases except in section [Server level permission](#server-level-permission) where you can assign user a sysadmin role.

### STEP 7.1: Serverless SQL pools

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

### STEP 7.2: Dedicated SQL pools

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

After creating the users, validate that the serverless SQL pool can query the storage account.

### STEP 7.3: Access control to workspace pipeline runs

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


## STEP 8: Maintain access control

The initial configuration for your access control system is finished.

Now, to manage access for users, you can add and remove users to the security groups you have set up.

Although you can manually assign users to Synapse roles, if you do, it won't configure things consistently. Instead, only add or remove users to the security groups.

## STEP N+1: Verify access for users in the roles

Users in each role need to complete the following steps:

| Number | Step | Synapse Administrators | Synapse Contributors | Synapse Compute Operators |
| --- | --- | --- | --- | --- |
| 1 | Upload a parquet file into `container1` | YES | YES | YES |
| 2 | Read the parquet file using a serverless SQL pool | YES | NO | YES |
| 3 | Create a Spark pool | YES [1] | YES [1] | NO  |
| 4 | Reads the parquet file with a Notebook | YES | YES | NO |
| 5 | Create a pipeline from the Notebook and Trigger the pipeline to run now | YES | NO | NO |
| 6 | Create a SQL pool and run a SQL script such as &quot;SELECT 1&quot; | YES [1] | NO | YES[1] |

> [!NOTE]
> [1] To create SQL or Spark pools the user must have at least Azure Contributor role on the Synapse workspace.
>
 
>[!TIP]
> - Some steps will deliberately not be allowed depending on the role.
> - Keep in mind that some tasks may fail if the security was not fully configured. These tasks are noted in the table.

## STEP 8: Network Security

To configure the workspace firewall, virtual network, and [Private Link](../../azure-sql/database/private-endpoint-overview.md).

## STEP 9: Completion

Your workspace is now fully configured and secured.

## How roles interact with Synapse Studio

Synapse Studio will behave differently based on user roles. Some items may be hidden or disabled if a user doesn't have the required permissions. The following table summarizes the effect on Synapse Studio.

| Task | Workspace Admins | Spark admins | SQL admins |
| --- | --- | --- | --- |
| Open Synapse Studio | YES | YES | YES |
| View Home hub | YES | YES | YES |
| View Data Hub | YES | YES | YES |
| Data Hub / See linked ADLS Gen2 accounts and containers | YES [1] | YES[1] | YES[1] |
| Data Hub / See Databases | YES | YES | YES |
| Data Hub / See objects in databases | YES | YES | YES |
| Data Hub / Access data in SQL pool databases | YES   | NO   | YES   |
| Data Hub / Access data in SQL on-demand databases | YES [2]  | NO  | YES [2]  |
| Data Hub / Access data in Spark databases | YES [2] | YES [2] | YES [2] |
| Use the Develop hub | YES | YES | YES |
| Develop Hub / author SQL Scripts | YES | NO | YES |
| Develop Hub / author Spark Job Definitions | YES | YES | NO |
| Develop Hub / author Notebooks | YES | YES | NO |
| Develop Hub / author Dataflows | YES | NO | NO |
| Use the Orchestrate hub | YES | YES | YES |
| Orchestrate hub / use Pipelines | YES | NO | NO |
| Use the Manage Hub | YES | YES | YES |
| Manage Hub / SQL pools | YES | NO | YES |
| Manage Hub / Spark pools | YES | YES | NO |
| Manage Hub / Triggers | YES | NO | NO |
| Manage Hub / Linked services | YES | YES | YES |
| Manage Hub / Access Control (assign users to Synapse workspace roles) | YES | NO | NO |
| Manage Hub / Integration runtimes | YES | YES | YES |
| Use the Monitor Hub | YES | YES | YES |
| Monitor Hub / Orchestration / Pipeline runs  | YES | NO | NO |
| Monitor Hub / Orchestration / Trigger runs  | YES | NO | NO |
| Monitor Hub / Orchestration / Integration runtimes  | YES | YES | YES |
| Monitor Hub / Activities / Spark applications | YES | YES | NO  |
| Monitor Hub / Activities / SQL requests | YES | NO | YES |
| Monitor Hub / Activities / Spark pools | YES | YES | NO  |
| Monitor Hub / Triggers | YES | NO | NO |
| Manage Hub / Linked services | YES | YES | YES |
| Manage Hub / Access Control (assign users to Synapse workspace roles) | YES | NO | NO |
| Manage Hub / Integration runtimes | YES | YES | YES |


> [!NOTE]
> [1] Access to data in containers depends on the access control in ADLS Gen2. </br>
> [2] SQL OD tables and Spark tables store their data in ADLS Gen2 and access requires the appropriate permissions on ADLS Gen2.

## Next steps

Create a [Synapse Workspace](../quickstart-create-workspace.md)
