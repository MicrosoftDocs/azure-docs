---
title: Azure Synapse workspace access control overview
description: This article describes the mechanisms used to control access to an Azure Synapse workspace and the resources and code artifacts it contains.
services: synapse-analytics
author: meenalsri
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: security
ms.date: 3/07/2022
ms.author: mesrivas
ms.reviewer: wiassaf
ms.custom: ignite-fall-2021
---
# Azure Synapse access control 

This article provides an overview of the mechanisms available to control access to Azure Synapse compute resources and data.  

## Overview

Azure Synapse provides a comprehensive and fine-grained access control system, that integrates: 
- **Azure roles** for resource management and access to data in storage, 
- **Synapse roles** for managing live access to code and execution, 
- **SQL roles** for data plane access to data in SQL pools, and 
- **Git permissions** for source code control, including continuous integration and deployment support.  

Azure Synapse roles provide sets of permissions that can be applied at different scopes. This granularity makes it easy to grant appropriate access to administrators, developers, security personnel, and operators to compute resources and data.

Access control can be simplified by using security groups that are aligned with people's job roles. You only need to add and remove users from appropriate security groups to manage access.

## Access control elements

### Create and manage Azure Synapse compute resources

Azure roles are used to control management of: 
- Dedicated SQL pools
- Data Explorer pools
- Apache Spark pools
- Integration runtimes

To *create* these resources, you need to be an Azure Owner or Contributor on the resource group. To *manage* them once created, you need to be an Azure Owner or Contributor on either the resource group or the individual resources. 

An Azure Owner or Contributor can enable or disable Azure AD-only authentication for Azure Synapse workspaces. For more information on Azure AD-only authentication, see [Disabling local authentication in Azure Synapse Analytics](../sql/active-directory-authentication.md).

### Develop and execute code in Azure Synapse 
Synapse supports two development models.

- **Synapse live development**. You develop and debug code in Synapse Studio and then **publish** it to save and execute.  The Synapse service is the source of truth for code editing and execution.  Any unpublished work is lost when you close Synapse Studio.  
- **Git-enabled development**. You develop and debug code in Synapse Studio and **commit** changes to a working branch of a Git repo. Work from one or more branches is integrated into a collaboration branch, from where you **publish** it to the service. The Git repo is the source of truth for code editing, while the service is the source of truth for execution. Changes must be committed to the Git repo or published to the service before closing Synapse Studio. [Learn more](../cicd/continuous-integration-delivery.md) about using Synapse Analytics with Git.

In both development models, any user with access to Synapse Studio can create code artifacts. However, you need additional permissions to publish artifacts to the service, read published artifacts, to commit changes to Git, to execute code, and to access linked data protected by credentials. Users must have the Azure Contributor (Azure RBAC) or higher role on the Synapse workspace to configure, edit settings and disconnect a Git repository with Synapse.

### Azure Synapse roles

Azure Synapse roles are used to control access to the Synapse service. Different roles can permit you to: 

- List published code artifacts, 
- Publish code artifacts, linked services, and credential definitions,
- Execute code or pipelines that use Synapse compute resources,
- Execute code or pipelines that access linked data protected by credentials,
- View outputs associated with published code artifacts,
- Monitor compute resource status, and view runtime logs.

Azure Synapse roles can be assigned at the workspace scope or at finer-grained scopes to limit the permissions granted to specific Azure Synapse resources.

### Git permissions

When using Git-enabled development in Git mode, you need Git permissions in addition to the Synapse User or Synapse RBAC (role-based access control) roles to read code artifacts, including linked service and credential definitions. To commit changes to code artifacts in Git mode, you need Git permissions, and the Synapse Artifact Publisher (Synapse RBAC) role.

   
### Access data in SQL

When working with dedicated and serverless SQL pools, data plane access is controlled using SQL permissions. 

The creator of a workspace is assigned as the Active Directory Admin on the workspace. After creation, this role can be assigned to a different user or to a security group in the Azure portal.

**Serverless SQL pools**: Synapse Administrators are granted `db_owner` (`DBO`) permissions on the serverless SQL pool, 'Built-in'. To grant other users access to the serverless SQL pool, Synapse administrators need to run SQL scripts on the serverless pool.  

**Dedicated SQL pools**: Synapse Administrators have full access to data in dedicated SQL pools, and the ability to grant access to other users. Synapse Administrators can also perform configuration and maintenance activities on dedicated pools, except for dropping databases. Active Directory Admin permission is granted to the creator of the workspace and the workspace MSI.  Permission to access dedicated SQL pools isn't otherwise granted automatically. To grant other users or groups access to dedicated SQL pools, the Active Directory Admin or Synapse Administrator must run SQL scripts against each dedicated SQL pool.

See [How to set up Synapse Access Control](./how-to-set-up-access-control.md) for examples of SQL scripts for granting SQL permissions in SQL pools.  

### Accessing data in Data Explorer pools

When working with Data Explorer pools, data plane access is controlled through Data Explorer permissions. Synapse Administrators are granted `All Database admin` permissions on Data Explorer pools. To grant other users or groups access to Data Explorer pools, Synapse administrators should refer to [Security roles management](/azure/data-explorer/kusto/management/security-roles?context=/azure/synapse-analytics/context/context). For more information on data plane access, see [Data Explorer access control overview](/azure/data-explorer/kusto/management/access-control/index?context=/azure/synapse-analytics/context/context).


 ### Accessing system-managed data in storage

Serverless SQL pools and Apache Spark tables store their data in an ADLS Gen2 container associated with the workspace. User-installed Apache Spark libraries are also managed in the same storage account. To enable these use cases, users and the workspace MSI must be granted **Storage Blob Data Contributor** access to this workspace ADLS Gen2 storage container.  

## Using security groups as a best practice

To simplify managing access control, you can use security groups to assign roles to individuals and groups. Security groups can be created to mirror personas or job functions in your organization that need access to Synapse resources or artifacts.  These persona-based security groups can then be assigned one or more Azure roles, Synapse roles, SQL permissions, or Git permissions. With well-chosen security groups, it's easy to assign a user the required permissions by adding them to the appropriate security group. 

>[!Note]
>If using security groups to manage access, there is additional latency introduced by Azure Active Directory before changes take effect. 

## Access control enforcement in Synapse Studio

Synapse Studio will behave differently based on your permissions and the current mode:
- **Synapse live mode:** Synapse Studio will prevent you from seeing published content, publishing content, or taking other actions if you don't have the required permission.  In some cases, you'll be prevented from creating code artifacts that you can't use or save. 
- **Git-mode:** If you have Git permissions that let you commit changes to the current branch, then the commit action will be permitted if you have permission to publish changes to the live service (Synapse Artifact Publisher role).  

In some cases, you're allowed to create code artifacts even without permission to publish or commit. This allows you to execute code (with the required execution permissions). For more information on the roles required for common tasks, see [Understand the roles required to perform common tasks in Azure Synapse](./synapse-workspace-understand-what-role-you-need.md).

If a feature is disabled in Synapse Studio, a tooltip will indicate the required permission. Use the [Synapse RBAC roles guide](./synapse-workspace-synapse-rbac-roles.md#synapse-rbac-actions-and-the-roles-that-permit-them) to look up which role is required to provide the missing permission.


## Next steps

- Learn more about [Synapse RBAC](./synapse-workspace-synapse-rbac.md)
- Learn more about [Synapse RBAC roles](./synapse-workspace-synapse-rbac-roles.md)
- Learn [how to set up access control](./how-to-set-up-access-control.md) for a Synapse Workspace using security groups.
- Learn [how to review Synapse RBAC role assignments](./how-to-review-synapse-rbac-role-assignments.md)
- Learn [how to manage Synapse RBAC role assignments](./how-to-manage-synapse-rbac-role-assignments.md)
