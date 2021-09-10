---
title: How to set up access control for your Synapse workspace
description: This article will teach you how to control access to an Azure Synapse workspace using Azure roles, Synapse roles, SQL permissions, and Git permissions.
services: synapse-analytics 
author: meenalsri
ms.service: synapse-analytics 
ms.topic: how-to 
ms.subservice: security 
ms.date: 8/05/2021
ms.author: ronytho
ms.reviewer: jrasnick, wiassaf
ms.custom: subject-rbac-steps
---

# How to set up access control for your Azure Synapse workspace 

This article will teach you how to control access to a Microsoft Azure Synapse workspace using Azure roles, Azure Synapse roles, SQL permissions, and Git permissions.   

In this guide, you'll set up a workspace and configure a basic access control system suitable for many Azure Synapse projects.  It then describes more advanced options for finer-grained control should you need it.  

Azure Synapse access control can be simplified by using security groups that are aligned with the roles and personas in your organization.  You only need to add and remove users from security groups to manage access.

Before you start this walkthrough, read the [Azure Synapse access control overview](./synapse-workspace-access-control-overview.md) to familiarize yourself with the access control mechanisms used by Azure Synapse Analytics.   

## Access control mechanisms

> [!NOTE]
> The approach taken in this guide is to create several security groups and then assign roles to these groups. After the groups are set up, you only need to manage membership within the security groups to control access to the workspace.

To secure an Azure Synapse workspace, you'll follow a pattern of configuring the following items:

- **Security Groups**, to group users with similar access requirements.
- **Azure roles**, to control who can create and manage SQL pools, Apache Spark pools and Integration runtimes, and access ADLS Gen2 storage.
- **Synapse roles**, to control access to published code artifacts, use of Apache Spark compute resources and Integration runtimes 
- **SQL permissions**, to control administrative and data plane access to SQL pools. 
- **Git permissions**, to control who can access code artifacts in source control if you configure Git-support for the workspace 
 
## Steps to secure an Azure Synapse workspace

This document uses standard names to simplify the instructions. Replace them with names of your choice.

|Setting | Standard name | Description |
| :------ | :-------------- | :---------- |
| **Synapse workspace** | `workspace1` |  The name that the Azure Synapse workspace will have. |
| **ADLSGEN2 account** | `storage1` | The ADLS account to use with your workspace. |
| **Container** | `container1` | The container in STG1 that the workspace will use by default. |
| **Active directory tenant** | `contoso` | the active directory tenant name.|
||||

## STEP 1: Set up security groups

>[!Note] 
>During the preview, it was recommended to create security groups mapped to the Azure Synapse **Synapse SQL Administrator** and **Synapse Apache Spark Administrator** roles.  With the introduction of new finer-grained Synapse RBAC roles and scopes, it is now recommended that you use these new capabilities to control access to your workspace.  These new roles and scopes provide more configuration flexibility and recognize that developers often use a mix of SQL and Spark in creating analytics applications and may need to be granted access to specific resources rather than the entire workspace. [Learn more](./synapse-workspace-synapse-rbac.md) about Synapse RBAC.

Create the following security groups for your workspace:

- **`workspace1_SynapseAdministrators`**, for users who need complete control over the workspace.  Add yourself to this security group, at least initially.
- **`workspace1_SynapseContributors`**, for developers who need to develop, debug, and publish code to the service.   
- **`workspace1_SynapseComputeOperators`**, for users who need to manage and monitor Apache Spark pools and Integration runtimes.
- **`workspace1_SynapseCredentialUsers`**, for users who need to debug and run orchestration pipelines using the workspace MSI (managed service identity) credential and cancel pipeline runs.   

You'll assign Synapse roles to these groups at the workspace scope shortly.  

Also create this security group: 
- **`workspace1_SQLAdmins`**, group for users who need SQL Active Directory Admin authority within SQL pools in the workspace. 

The `workspace1_SQLAdmins` group will be used when you configure SQL permissions in SQL pools as you create them. 

For a basic setup, these five groups are sufficient. Later, you can  add security groups to handle users who need more specialized access or to give users access only to specific resources.

> [!NOTE]
>- Learn how to create a security group in [this article](../../active-directory/fundamentals/active-directory-groups-create-azure-portal.md).
>- Learn how to add a security group from another security group in [this article](../../active-directory/fundamentals/active-directory-groups-membership-azure-portal.md).

>[!Tip]
>Individual Synapse users can use Azure Active Directory in the Azure portal to view their group memberships to determine which roles they've been granted.

## STEP 2: Prepare your ADLS Gen2 storage account

An Azure Synapse workspace uses a default storage container for:
  - Storing the backing data files for Spark tables
  - Execution logs for Spark jobs
  - Managing libraries that you choose to install

Identify the following information about your storage:

- The ADLS Gen2 account to use for your workspace. This document calls it `storage1`. `storage1` is considered the "primary" storage account for your workspace.
- The container inside `workspace1` that your Synapse workspace will use by default. This document calls it `container1`. 
 
- Select **Access control (IAM)**.

- Select **Add** > **Add role assignment** to open the Add role assignment page.

- Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).
    
    | Setting | Value |
    | --- | --- |
    | Role | Storage Blob Data Contributor |
    | Assign access to |SERVICEPRINCIPAL |
    | Members |workspace1_SynapseAdmins, workspace1_SynapseContributors, and workspace1_SynapseComputeOperators|

    ![Add role assignment page in Azure portal.](../../../includes/role-based-access-control/media/add-role-assignment-page.png)

## STEP 3: Create and configure your Azure Synapse Workspace

In the Azure portal, create an Azure Synapse workspace:

- Select your subscription

- Select or create a resource group for which you have the Azure **Owner** role.

- Name the workspace `workspace1`

- Choose `storage1` for the Storage account

- Choose `container1` for the container that is being used as the "filesystem".

- Open WS1 in Synapse Studio

- Navigate to **Manage** > **Access Control** and assign Synapse roles at *workspace scope* to the security groups as follows:
  - Assign the **Synapse Administrator** role to `workspace1_SynapseAdministrators` 
  - Assign the **Synapse Contributor** role to `workspace1_SynapseContributors` 
  - Assign the **Synapse Compute Operator** role to `workspace1_SynapseComputeOperators`

## STEP 4: Grant the workspace MSI access to the default storage container

To run pipelines and perform system tasks, Azure Synapse requires that the workspace managed service identity (MSI) needs access to `container1` in the default ADLS Gen2 account. For more information, see [Azure Synapse workspace managed identity](synapse-workspace-managed-identity.md).

- Open the Azure portal
- Locate the storage account, `storage1`, and then `container1`
- Select **Access control (IAM)**.
- Select **Add** > **Add role assignment** to open the Add role assignment page.
- Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).
    
    | Setting | Value |
    | --- | --- |
    | Role | Storage Blob Contributor |
    | Assign access to | MANAGEDIDENTITY |
    | Members | managed identity name  |

    > [!NOTE]
    > The managed identity name is also the workspace name.

    ![Add role assignment page in Azure portal.](../../../includes/role-based-access-control/media/add-role-assignment-page.png)


## STEP 5: Grant Synapse administrators the Azure Contributor role on the workspace 

To create SQL pools, Apache Spark pools and Integration runtimes, users must have at least Azure Contributor role at the workspace. The contributor role also allows these users to manage the resources, including pausing and scaling. If you are using Azure portal or Synapse Studio to create SQL pools, Apache Spark pools and Integration runtimes, then you need Azure Contributor role at the resource group level. 

- Open the Azure portal
- Locate the workspace, `workspace1`
- Select **Access control (IAM)**.
- Select **Add** > **Add role assignment** to open the Add role assignment page.
- Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).
    
    | Setting | Value |
    | --- | --- |
    | Role | Contributor |
    | Assign access to | SERVICEPRINCIPAL |
    | Members | workspace1_SynapseAdministrators  |

    ![Add role assignment page in Azure portal.](../../../includes/role-based-access-control/media/add-role-assignment-page.png) 

## STEP 6: Assign SQL Active Directory Admin role

The workspace creator is automatically set up as the SQL Active Directory Admin for the workspace.  Only a single user or group can be granted this role. In this step, you assign the SQL Active Directory Admin on the workspace  to the `workspace1_SQLAdmins` security group.  Assigning this role gives this group highly privileged admin access to all SQL pools and databases in the workspace.   

- Open the Azure portal
- Navigate to `workspace1`
- Under **Settings**, select **SQL Active Directory admin**
- Select **Set admin** and choose **`workspace1_SQLAdmins`**

>[!Note]
>Step 6 is optional.  You might choose to grant the `workspace1_SQLAdmins` group a less privileged role. To assign `db_owner` or other SQL roles, you must run scripts on each SQL database. 

## STEP 7: Grant access to SQL pools

By default, all users assigned the Synapse Administrator role are also assigned the SQL `db_owner` role on the serverless SQL pool, 'Built-in', and all its databases.

Access to SQL pools for other users and for the workspace MSI is controlled using SQL permissions.  Assigning SQL permissions requires that SQL scripts are run on each SQL database after creation.  There are three cases that require you run these scripts:
1. Granting other users access to the serverless SQL pool, 'Built-in', and its databases
2. Granting any user access to dedicated pool databases
3. Granting the workspace MSI access to a SQL pool database to enable pipelines that require SQL pool access to run successfully.

Example SQL scripts are included below.

To grant access to a dedicated SQL pool database, the scripts can be run by the workspace creator or any member of the `workspace1_SQLAdmins` group.  

To grant access to the serverless SQL pool, 'Built-in', the scripts can be run by any member of the `workspace1_SQLAdmins` group or the  `workspace1_SynapseAdministrators` group. 

> [!TIP]
> The steps below need to be run for **each** SQL pool to grant user access to all SQL databases except in section [Workspace-scoped permission](#workspace-scoped-permission) where you can assign a user a sysadmin role at the workspace level.

### STEP 7.1: Serverless SQL pool, Built-in

In this section, there are script examples showing how to give a user permission to access a particular database or to all databases in the serverless SQL pool, 'Built-in'.

> [!NOTE]
> In the script examples, replace *alias* with the alias of the user or group being granted access, and *domain* with the company domain you are using.

#### Database-scoped permission

To grant access to a user to a **single** serverless SQL database, follow the steps in this example:

1. Create LOGIN

    ```sql
    use master
    go
    CREATE LOGIN [alias@domain.com] FROM EXTERNAL PROVIDER;
    go
    ```

2. Create USER

    ```sql
    use yourdb -- Use your database name
    go
    CREATE USER alias FROM LOGIN [alias@domain.com];
    ```

3. Add USER to members of the specified role

    ```sql
    use yourdb -- Use your database name
    go
    alter role db_owner Add member alias -- Type USER name from step 2
    ```

#### Workspace-scoped permission

To grant full access to **all** serverless SQL pools in the workspace, use the script in this example:

```sql
use master
go
CREATE LOGIN [alias@domain.com] FROM EXTERNAL PROVIDER;
ALTER SERVER ROLE sysadmin ADD MEMBER [alias@domain.com];
```

### STEP 7.2: Dedicated SQL pools

To grant access to a **single** dedicated SQL pool database, follow these steps in the Azure Synapse SQL script editor:

1. Create the user in the database by running the following command on the target database, selected using the *Connect to* dropdown:

    ```sql
    --Create user in the database
    CREATE USER [<alias@domain.com>] FROM EXTERNAL PROVIDER;
    ```

2. Grant the user a role to access the database:

    ```sql
    --Grant role to the user in the database
    EXEC sp_addrolemember 'db_owner', '<alias@domain.com>';
    ```

> [!IMPORTANT]
> *db_datareader* and *db_datawriter* can work for read/write permissions if granting *db_owner* permission is not desired.
> For a Spark user to read and write directly from Spark into or from a SQL pool, *db_owner* permission is required.

After creating the users, run queries to validate that the serverless SQL pool can query the storage account.

### STEP 7.3: SQL access control for Azure Synapse pipeline runs

### Workspace managed identity

> [!IMPORTANT]
> To run pipelines successfully that include datasets or activities that reference a SQL pool, the workspace identity needs to be granted access to the SQL pool.

For more information on the workspace managed identity, see [Azure Synapse workspace managed identity](synapse-workspace-managed-identity.md). Run the following commands on each SQL pool to allow the workspace managed system identity to run pipelines on the SQL pool database(s):  

>[!note]
>In the scripts below, for a dedicated SQL pool database, `<databasename>` is the same as the pool name.  For a database in the serverless SQL pool 'Built-in', `<databasename>` is the name of the database.

```sql
--Create a SQL user for the workspace MSI in database
CREATE USER [<workspacename>] FROM EXTERNAL PROVIDER;

--Granting permission to the identity
GRANT CONTROL ON DATABASE::<databasename> TO <workspacename>;
```

This permission can be removed by running the following script on the same SQL pool:

```sql
--Revoke permission granted to the workspace MSI
REVOKE CONTROL ON DATABASE::<databasename> TO <workspacename>;

--Delete the workspace MSI user in the database
DROP USER [<workspacename>];
```

## STEP 8: Add users to security groups

The initial configuration for your access control system is complete.

To manage access, you can add and remove users to the security groups you've set up.  Although you can manually assign users to Azure Synapse roles, if you do, it won't configure their permissions consistently. Instead, only add or remove users to the security groups.

## STEP 9: Network security

As a final step to secure your workspace, you should secure network access, using the [workspace firewall](./synapse-workspace-ip-firewall.md).

- With and without a [managed virtual network](./synapse-workspace-managed-vnet.md), you can connect to your workspace from public networks. For more information, see [Connectivity Settings](connectivity-settings.md).
- Access from public networks can be controlled by enabling the [public network access feature](connectivity-settings.md#public-network-access) or the [workspace firewall](./synapse-workspace-ip-firewall.md).
- Alternatively, you can connect to your workspace using a [managed private endpoint](synapse-workspace-managed-private-endpoints.md) and [private Link](../../azure-sql/database/private-endpoint-overview.md). Azure Synapse workspaces without the [Azure Synapse Analytics Managed Virtual Network](synapse-workspace-managed-vnet.md) do not have the ability to connect via managed private endpoints.

## STEP 10: Completion

Your workspace is now fully configured and secured.

## Supporting more advanced scenarios

This guide has focused on setting up a basic access control system. You can support more advanced scenarios by creating additional security groups and assigning these groups more granular roles at more specific scopes. Consider the following cases:

**Enable Git-support** for the workspace for more advanced development scenarios including CI/CD.  While in Git mode, Git permissions will determine whether a user can commit changes to their working branch.  Publishing to the service only takes place from the collaboration branch.  Consider creating a security group for developers who need to develop and debug updates in a working branch but don't need  to publish changes to the live service.

**Restrict developer access** to specific resources.  Create additional finer-grained security groups for developers who need access only to specific resources.  Assign these groups appropriate Azure Synapse roles that are scoped to specific Spark pools, Integration runtimes, or credentials.

**Restrict operators from accessing code artifacts**.  Create security groups for operators who need to monitor operational status of Synapse compute resources and view logs but who don't need access to code or to publish updates to the service. Assign these groups the Compute Operator role scoped to specific Spark pools and Integration runtimes.  

## Next steps

 - Learn [how to manage Azure Synapse RBAC role assignments](./how-to-manage-synapse-rbac-role-assignments.md)
 - Create a [Synapse Workspace](../quickstart-create-workspace.md)
