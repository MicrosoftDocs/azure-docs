---
title: Access control in Synapse workspace how to 
description: Learn how to control access to Azure Synapse workspaces using Azure roles, Synapse roles, SQL permissions, and Git permissions.
services: synapse-analytics  
author: talk2rick
ms.service: synapse-analytics 
ms.topic: how-to 
ms.subservice: security 
ms.date: 5/23/2022
ms.author: xurick
ms.reviewer: sngun, wiassaf
ms.custom: kr2b-contr-experiment
---

# How to set up access control for your Azure Synapse workspace

This article teaches you how to control access to a Microsoft Azure Synapse workspace. We'll use a combination of Azure roles, Azure Synapse roles, SQL permissions, and Git permissions to achieve this.

In this guide, you'll set up a workspace and configure a basic access control system. You can use this information in many types of Synapse projects. You'll also find advanced options for finer-grained control should you need it.

Synapse access control can be simplified by aligning roles and personas in your organization with security groups.  This enables you to manage access to security groups simply by adding and removing users.

Before you begin this walkthrough, read the [Azure Synapse access control overview](./synapse-workspace-access-control-overview.md) to familiarize yourself with access control mechanisms used by Synapse Analytics.

## Access control mechanisms

> [!NOTE]
> The approach in this guide is to create security groups. When you assign roles to these security groups, you only need to manage memberships within those groups to control access to workspaces.

To secure a Synapse workspace, you'll configure the following items:

- **Security Groups**, to group users with similar access requirements.
- **Azure roles**, to control who can create and manage SQL pools, Apache Spark pools and Integration runtimes, and access ADLS Gen2 storage.
- **Synapse roles**, to control access to published code artifacts, use of Apache Spark compute resources and integration runtimes.
- **SQL permissions**, to control administrative and data plane access to SQL pools.
- **Git permissions**, to control who can access code artifacts in source control if you configure Git-support for workspaces.

## Steps to secure a Synapse workspace

This document uses standard names to simplify instructions. Replace them with names of your choice.

|Setting | Standard name | Description |
| :------ | :-------------- | :---------- |
| **Synapse workspace** | `workspace1` |  The name that the Azure Synapse workspace will have. |
| **ADLSGEN2 account** | `storage1` | The ADLS account to use with your workspace. |
| **Container** | `container1` | The container in STG1 that the workspace will use by default. |
| **Active directory tenant** | `contoso` | the active directory tenant name.|

## Step 1: Set up security groups

>[!Note]
>During the preview, you were encouraged to create security groups and to map them to Azure Synapse **Synapse SQL Administrator** and **Synapse Apache Spark Administrator** roles.  With the introduction of new finer-grained Synapse RBAC roles and scopes, you are now encouraged to use newer options to control access to your workspace. They give you greater configuration flexibility and they acknowledge that developers often use a mix of SQL and Spark to create analytics applications. So developers may need access to individual resources rather than an entire workspace. [Learn more](./synapse-workspace-synapse-rbac.md) about Synapse RBAC.

Create the following security groups for your workspace:

- **`workspace1_SynapseAdministrators`**, for users who need complete control over a workspace.  Add yourself to this security group, at least initially.
- **`workspace1_SynapseContributors`**, for developers who need to develop, debug, and publish code to a service.
- **`workspace1_SynapseComputeOperators`**, for users who need to manage and monitor Apache Spark pools and Integration runtimes.
- **`workspace1_SynapseCredentialUsers`**, for users who need to debug and run orchestration pipelines using workspace MSI (managed service identity) credentials and cancel pipeline runs.

You'll assign Synapse roles to these groups at the workspace scope shortly.  

Also create this security group:
- **`workspace1_SQLAdmins`**, group for users who need SQL Active Directory Admin authority, within SQL pools in the workspace.

The `workspace1_SQLAdmins` group to configure SQL permissions when you create SQL pools.

These five groups are sufficient for a basic setup. Later, you can add security groups to handle users who need more specialized access or restrict access to individual resources only.

> [!NOTE]
>- Learn how to create a security group in [Create a basic group and add members using Azure Active Directory](../../active-directory/fundamentals/active-directory-groups-create-azure-portal.md).
>- Learn how to add a security group from another security group in [Add or remove a group from another group using Azure Active Directory](../../active-directory/fundamentals/active-directory-groups-membership-azure-portal.md).
>- When creating a security group make sure that the **Group Type** is **Security**. Microsoft 365 groups are not supported for Azure SQL.

>[!Tip]
>Individual Synapse users can use Azure Active Directory in the Azure portal to view their group memberships. This allows them to determine which roles they've been granted.

## Step 2: Prepare your ADLS Gen2 storage account

Synapse workspaces use default storage containers for:
  - Storage of backing data files for Spark tables
  - Execution logs for Spark jobs
  - Management of libraries that you choose to install

Identify the following information about your storage:

- The ADLS Gen2 account to use for your workspace. This document calls it `storage1`. `storage1` is considered the "primary" storage account for your workspace.
- The container inside `storage1` that your Synapse workspace will use by default. This document calls it `container1`.

- Select **Access control (IAM)**.

- Select **Add** > **Add role assignment** to open the Add role assignment page.

- Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).
    
    | Setting | Value |
    | --- | --- |
    | Role | Storage Blob Data Contributor |
    | Assign access to |SERVICEPRINCIPAL |
    | Members |workspace1_SynapseAdministrators, workspace1_SynapseContributors, and workspace1_SynapseComputeOperators|

    ![Add role assignment page in Azure portal.](../../../includes/role-based-access-control/media/add-role-assignment-page.png)

## Step 3: Create and configure your Synapse workspace

In Azure portal, create a Synapse workspace:

- Select your subscription

- Select or create a resource group for which you have an Azure **Owner** role.

- Name the workspace `workspace1`

- Choose `storage1` for the Storage account

- Choose `container1` for the container that is being used as the "filesystem".

- Open WS1 in Synapse Studio

- In Synapse Studio, navigate to **Manage** > **Access Control**. In **workspace scope**, assign Synapse roles to security groups as follows:
  - Assign the **Synapse Administrator** role to `workspace1_SynapseAdministrators`
  - Assign the **Synapse Contributor** role to `workspace1_SynapseContributors`
  - Assign the **Synapse Compute Operator** role to `workspace1_SynapseComputeOperators`

## Step 4: Grant the workspace MSI access to the default storage container

To run pipelines and perform system tasks, Azure Synapse requires managed service identity (MSI) to have access to `container1` in the default ADLS Gen2 account, for the workspace. For more information, see [Azure Synapse workspace managed identity](../../data-factory/data-factory-service-identity.md?context=/azure/synapse-analytics/context/context&tabs=synapse-analytics).

- Open Azure portal
- Locate the storage account, `storage1`, and then `container1`.
- Select **Access control (IAM)**.
- To open the **Add role assignment** page, select **Add** > **Add role assignment** .
- Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).
    
    | Setting | Value |
    | --- | --- |
    | Role | Storage Blob Data Contributor |
    | Assign access to | MANAGEDIDENTITY |
    | Members | managed identity name  |

    > [!NOTE]
    > The managed identity name is also the workspace name.

    ![Add role assignment page in Azure portal.](../../../includes/role-based-access-control/media/add-role-assignment-page.png)


## Step 5: Grant Synapse administrators an Azure Contributor role for the workspace

To create SQL pools, Apache Spark pools and Integration runtimes, users need an Azure Contributor role for the workspace, at minimum. A Contributor role also allows users to manage resources, including pausing and scaling. To use Azure portal or Synapse Studio to create SQL pools, Apache Spark pools and Integration runtimes, you need a Contributor role at the resource group level.


- Open Azure portal
- Locate the workspace, `workspace1`
- Select **Access control (IAM)**.
- To open the **Add role assignment** page, select **Add** > **Add role assignment**.
- Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

    | Setting | Value |
    | --- | --- |
    | Role | Contributor |
    | Assign access to | SERVICEPRINCIPAL |
    | Members | workspace1_SynapseAdministrators  |

    ![Add role assignment page in Azure portal.](../../../includes/role-based-access-control/media/add-role-assignment-page.png) 

## Step 6: Assign an SQL Active Directory Admin role

The *workspace creator* is automatically assigned as *SQL Active Directory Admin* for the workspace.  Only a single user or a group can be granted this role. In this step, you assign the SQL Active Directory Admin for the workspace to the `workspace1_SQLAdmins` security group.  This gives the group highly privileged admin access to all SQL pools and databases in the workspace.

- Open Azure portal
- Navigate to `workspace1`
- Under **Settings**, select **Azure Active Directory**
- Select **Set admin** and choose **`workspace1_SQLAdmins`**

>[!Note]
>Step 6 is optional.  You might choose to grant the `workspace1_SQLAdmins` group a less privileged role. To assign `db_owner` or other SQL roles, you must run scripts on each SQL database.

## Step 7: Grant access to SQL pools

The Synapse Administrator is by default given the SQL `db_owner` role for serverless SQL pools in the workspace as well.

Access to SQL pools for other users is controlled by SQL permissions.  Assigning SQL permissions requires SQL scripts to be run on each SQL database post-creation.  The following are examples that require you to run these scripts:
1. To grant users access to the serverless SQL pool, 'Built-in', and its databases.
1. To grant users access to dedicated SQL pool databases. Example SQL scripts are included later in this article.

1. To grant access to a dedicated SQL pool database, scripts can be run by the workspace creator or any member of the `workspace1_SynapseAdministrators` group.  

1. To grant access to the serverless SQL pool, 'Built-in', scripts can be run by any member of the `workspace1_SQLAdmins` group or the `workspace1_SynapseAdministrators` group.

> [!TIP]
>You can grant access to all SQL databases by taking the following steps for **each** SQL pool. Section [Configure-Workspace-scoped permissions](#configure-workspace-scoped-permissions) is an exception to the rule and it allows you to assign a user a sysadmin role at the workspace level.

### Step 7a: Serverless SQL pool, Built-in

You can use the script examples in this section to give users permission to access an individual database or all databases in the serverless SQL pool, `Built-in`.

> [!NOTE]
> In the script examples, replace *alias* with the alias of the user or group being granted access. Replace *domain* with the company domain you are using.

#### Configure Database-scoped permissions

You can grant users access to a **single** serverless SQL database with the steps outlined in this example:

1. Create a login. Change to the `master` database context.

    ```sql
    --In the master database
    CREATE LOGIN [alias@domain.com] FROM EXTERNAL PROVIDER;
    ```

2. Create user in your database. Change context to your database.

    ```sql
    -- In your database
    CREATE USER alias FROM LOGIN [alias@domain.com];
    ```

3. Add user as a member of the specified role in your database (in this case, the **db_owner** role).

    ```sql
    ALTER ROLE db_owner ADD member alias; -- Type USER name from step 2
    ```

#### Configure Workspace-scoped permissions

You can grant full access to **all** serverless SQL pools in the workspace. Run the script in this example in the `master` database:

```sql
CREATE LOGIN [alias@domain.com] FROM EXTERNAL PROVIDER;
ALTER SERVER ROLE sysadmin ADD MEMBER [alias@domain.com];
```

### Step 7b: configure Dedicated SQL pools

You can grant access to a **single**, dedicated, SQL pool database. Use these steps in the Azure Synapse SQL script editor:

1. Create a user in the database by running the following commands. Select the target database in the *Connect to* dropdown:

    ```sql
    --Create user in the database
    CREATE USER [<alias@domain.com>] FROM EXTERNAL PROVIDER;
    -- For Service Principals you would need just the display name and @domain.com is not required
    ```
    

2. Grant the user a role to access the database:

    ```sql
    --Grant role to the user in the database
    EXEC sp_addrolemember 'db_owner', '<alias@domain.com>';
    ```

> [!IMPORTANT]
> **db_datareader** and **db_datawriter** database roles can provide read/write permission when you do not want to give **db_owner** permissions.
> However, **db_owner** permission is necessary for Spark users to read and write directly from Spark into or from an SQL pool.

You can run queries to confirm that serverless SQL pools can query storage accounts, after you have created your users.

## Step 8: Add users to security groups

The initial configuration for your access control system is now complete.

You can now add and remove users to the security groups you've set up, to manage access to them. You can manually assign users to Azure Synapse roles, but this sets permissions inconsistently. Instead, only add or remove users to your security groups.

## Step 9: Network security

As a final step to secure your workspace, you should secure network access, using the [workspace firewall](./synapse-workspace-ip-firewall.md).

- With and without a [managed virtual network](./synapse-workspace-managed-vnet.md), you can connect to your workspace from public networks. For more information, see [Connectivity Settings](connectivity-settings.md).
- Access from public networks can be controlled by enabling the [public network access feature](connectivity-settings.md#public-network-access) or the [workspace firewall](./synapse-workspace-ip-firewall.md).
- Alternatively, you can connect to your workspace using a [managed private endpoint](synapse-workspace-managed-private-endpoints.md) and [private Link](/azure/azure-sql/database/private-endpoint-overview). Azure Synapse workspaces without the [Azure Synapse Analytics Managed Virtual Network](synapse-workspace-managed-vnet.md) do not have the ability to connect via managed private endpoints.

## Step 10: Completion

Your workspace is now fully configured and secured.

## Supporting more advanced scenarios

This guide has focused on setting up a basic access control system. You can support more advanced scenarios by creating additional security groups and assigning these groups more granular roles at more specific scopes. Consider the following cases:

**Enable Git-support** for the workspace for more advanced development scenarios including CI/CD.  While in Git mode, Git permissions and Synapse RBAC will determine whether a user can commit changes to their working branch. Publishing to the service only takes place from the collaboration branch.  Consider creating a security group for developers who need to develop and debug updates in a working branch but don't need to publish changes to the live service.

**Restrict developer access** to specific resources.  Create additional finer-grained security groups for developers who need access only to specific resources. Assign these groups appropriate Azure Synapse roles that are scoped to specific Spark pools, Integration runtimes, or credentials.

**Restrict operators from accessing code artifacts**.  Create security groups for operators who need to monitor operational status of Synapse compute resources and view logs but who don't need access to code or to publish updates to the service. Assign these groups the Compute Operator role scoped to specific Spark pools and Integration runtimes.  

**Disable local authentication**. By allowing only Azure Active Directory authentication, you can centrally manage access to Azure Synapse resources, such as SQL pools. Local authentication for all resources within the workspace can be disabled during or after workspace creation. For more information on Azure AD-only authentication, see [Disabling local authentication in Azure Synapse Analytics](../sql/active-directory-authentication.md).

## Next steps

 - Learn [how to manage Azure Synapse RBAC role assignments](./how-to-manage-synapse-rbac-role-assignments.md)
 - Create a [Synapse Workspace](../quickstart-create-workspace.md)
