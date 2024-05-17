---
title: Azure Synapse RBAC roles
description: This article describes the built-in Synapse RBAC (role-based access control) roles, the permissions they grant, and the scopes at which they can be used.
author: meenalsri
ms.author: mesrivas
ms.reviewer: sngun, wiassaf
ms.date: 06/16/2023
ms.service: synapse-analytics
ms.subservice: security
ms.topic: conceptual
---

# Synapse RBAC Roles

The article describes the built-in Synapse RBAC (role-based access control) roles, the permissions they grant, and the scopes at which they can be used.  

For more information on reviewing and assigning Synapse role memberships, see [how to review Synapse RBAC role assignments](./how-to-review-synapse-rbac-role-assignments.md) and [how to assign Synapse RBAC roles](./how-to-manage-synapse-rbac-role-assignments.md).

## Built-in Synapse RBAC roles and scopes

The following table describes the built-in roles and the scopes at which they can be used.

> [!NOTE]
> Users with any Synapse RBAC role at any scope automatically have the Synapse User role at workspace scope. 

> [!IMPORTANT]
> Synapse RBAC roles do not grant permissions to create or manage SQL pools, Apache Spark pools, and Integration runtimes in Azure Synapse workspaces. Azure Owner or Azure Contributor roles on the resource group are required for these actions.

|Role |Permissions|Scopes|
|---|---|-----|
|Synapse Administrator  |Full Synapse access to serverless and dedicated SQL pools, Data Explorer pools, Apache Spark pools, and Integration runtimes.  Includes create, read, update, and delete access to all published code artifacts.  Includes Compute Operator, Linked Data Manager, and Credential User permissions on the workspace system identity credential.  Includes assigning Synapse RBAC roles. In addition to Synapse Administrator, Azure Owners can also assign Synapse RBAC roles. Azure permissions are required to create, delete, and manage compute resources. Synapse RBAC roles can be assigned even when the associated subscription is disabled.</br></br>_Can read and write artifacts</br> Can do all actions on Spark activities.</br> Can view Spark pool logs</br> Can view saved notebook and pipeline output </br> Can use the secrets stored by linked services or credentials</br>Can assign and revoke Synapse RBAC roles at current scope_|Workspace </br> Spark pool<br/>Integration runtime </br>Linked service</br>Credential |
|Synapse Apache Spark Administrator</br>|Full Synapse access to Apache Spark Pools.  Create, read, update, and delete access to published Spark job definitions, notebooks and their outputs, and to libraries, linked services, and credentials.  Includes read access to all other published code artifacts. Doesn't include permission to use credentials and run pipelines. Doesn't include granting access. </br></br>_Can do all actions on Spark artifacts</br>Can do all actions on Spark activities_|Workspace</br>Spark pool|
|Synapse SQL Administrator|Full Synapse access to serverless SQL pools.  Create, read, update, and delete access to published SQL scripts, credentials, and linked services.  Includes read access to all other published code artifacts.  Doesn't include permission to use credentials and run pipelines. Doesn't include granting access. </br></br>*Can do all actions on SQL scripts<br/>Can connect to SQL serverless endpoints with SQL `db_datareader`, `db_datawriter`, `connect`, and `grant` permissions*|Workspace|
|Synapse Contributor|Full Synapse access to Apache Spark pools and Integration runtimes. Includes create, read, update, and delete access to all published code artifacts and their outputs, including scheduled pipelines, credentials and linked services.  Includes compute operator permissions. Doesn't include permission to use credentials and run pipelines. Doesn't include granting access. </br></br>_Can read and write artifacts</br>Can view saved notebook and pipeline output</br>Can do all actions on Spark activities</br>Can view Spark pool logs_|Workspace </br> Spark pool<br/> Integration runtime|
|Synapse Artifact Publisher|Create, read, update, and delete access to published code artifacts and their outputs, including scheduled pipelines. Doesn't include permission to run code or pipelines, or to grant access. </br></br>_Can read published artifacts and publish artifacts</br>Can view saved notebook, Spark job, and pipeline output_|Workspace
|Synapse Artifact User|Read access to published code artifacts and their outputs. Can create new artifacts but can't publish changes or run code without additional permissions.|Workspace
|Synapse Compute Operator |Submit Spark jobs and notebooks and view logs.  Includes canceling Spark jobs submitted by any user. Requires additional use credential permissions on the workspace system identity to run pipelines, view pipeline runs and outputs. </br></br>_Can submit and cancel jobs, including jobs submitted by others</br>Can view Spark pool logs_|Workspace</br>Spark pool</br>Integration runtime|
|Synapse Monitoring Operator |Read published code artifacts, including logs and outputs for pipeline runs and completed notebooks. Includes ability to list and view details of Apache Spark pools, Data Explorer pools, and Integration runtimes. Requires additional permissions to run/cancel pipelines, Spark notebooks, and Spark jobs.|Workspace |
|Synapse Credential User|Runtime and configuration-time use of secrets within credentials and linked services in activities like pipeline runs. To run pipelines, this role is required, scoped to the workspace system identity. </br></br>_Scoped to a credential, permits access to data via a linked service that is protected by the credential (may also require compute use permission) </br>Allows execution of pipelines protected by the workspace system identity credential_|Workspace </br>Linked Service</br>Credential
|Synapse Linked Data Manager|Creation and management of managed private endpoints, linked services, and credentials. Can create managed private endpoints that use linked services protected by credentials|Workspace|
|Synapse User|List and view details of SQL pools, Apache Spark pools, Integration runtimes, and published linked services and credentials. Doesn't include other published code artifacts.  Can create new artifacts but can't run or publish without additional permissions. </br></br>_Can list and read Spark pools, Integration runtimes._|Workspace, Spark pool</br>Linked service </br>Credential|

## Synapse RBAC roles and the actions they permit

> [!NOTE]
>- All actions listed in the tables below are prefixed, "Microsoft.Synapse/..."</br>
>- All artifact read, write, and delete actions are with respect to published artifacts in the live service.  These permissions do not affect access to artifacts in a connected Git repo.  

The following table lists the built-in roles and the actions/permissions that each support.

Role|Actions
--|--
Synapse Administrator|workspaces/read</br>workspaces/roleAssignments/write, delete</br>workspaces/managedPrivateEndpoint/write, delete</br>workspaces/bigDataPools/useCompute/action</br>workspaces/bigDataPools/viewLogs/action</br>workspaces/integrationRuntimes/useCompute/action</br>workspaces/integrationRuntimes/viewLogs/action</br>workspaces/artifacts/read</br>workspaces/notebooks/write, delete</br>workspaces/sparkJobDefinitions/write, delete</br>workspaces/sqlScripts/write, delete</br>workspaces/kqlScripts/write, delete</br>workspaces/dataFlows/write, delete</br>workspaces/pipelines/write, delete</br>workspaces/triggers/write, delete</br>workspaces/datasets/write, delete</br>workspaces/libraries/write, delete</br>workspaces/linkedServices/write, delete</br>workspaces/credentials/write, delete</br>workspaces/notebooks/viewOutputs/action</br>workspaces/pipelines/viewOutputs/action</br>workspaces/linkedServices/useSecret/action</br>workspaces/credentials/useSecret/action</br>workspaces/linkConnections/read</br>workspaces/linkConnections/write</br>workspaces/linkConnections/delete</br>workspaces/linkConnections/useCompute/action|
|Synapse Apache Spark Administrator|workspaces/read</br>workspaces/bigDataPools/useCompute/action</br>workspaces/bigDataPools/viewLogs/action</br>workspaces/notebooks/viewOutputs/action</br>workspaces/artifacts/read</br>workspaces/notebooks/write, delete</br>workspaces/sparkJobDefinitions/write, delete</br>workspaces/libraries/write, delete</br>workspaces/linkedServices/write, delete</br>workspaces/credentials/write, delete|
|Synapse SQL Administrator|workspaces/read</br>workspaces/artifacts/read</br>workspaces/sqlScripts/write, delete</br>workspaces/linkedServices/write, delete</br>workspaces/credentials/write, delete|
|Synapse Contributor|workspaces/read</br>workspaces/bigDataPools/useCompute/action</br>workspaces/bigDataPools/viewLogs/action</br>workspaces/integrationRuntimes/useCompute/action</br>workspaces/integrationRuntimes/viewLogs/action</br>workspaces/artifacts/read</br>workspaces/notebooks/write, delete</br>workspaces/sparkJobDefinitions/write, delete</br>workspaces/sqlScripts/write, delete</br>workspaces/kqlScripts/write, delete</br>workspaces/dataFlows/write, delete</br>workspaces/pipelines/write, delete</br>workspaces/triggers/write, delete</br>workspaces/datasets/write, delete</br>workspaces/libraries/write, delete</br>workspaces/linkedServices/write, delete</br>workspaces/credentials/write, delete</br>workspaces/notebooks/viewOutputs/action</br>workspaces/pipelines/viewOutputs/action</br>workspaces/linkConnections/read</br>workspaces/linkConnections/write</br>workspaces/linkConnections/delete</br>workspaces/linkConnections/useCompute/action|
|Synapse Artifact Publisher|workspaces/read</br>workspaces/artifacts/read</br>workspaces/notebooks/write, delete</br>workspaces/sparkJobDefinitions/write, delete</br>workspaces/sqlScripts/write, delete</br>workspaces/kqlScripts/write, delete</br>workspaces/dataFlows/write, delete</br>workspaces/pipelines/write, delete</br>workspaces/triggers/write, delete</br>workspaces/datasets/write, delete</br>workspaces/libraries/write, delete</br>workspaces/linkedServices/write, delete</br>workspaces/credentials/write, delete</br>workspaces/notebooks/viewOutputs/action</br>workspaces/pipelines/viewOutputs/action|
|Synapse Artifact User|workspaces/read</br>workspaces/artifacts/read</br>workspaces/notebooks/viewOutputs/action</br>workspaces/pipelines/viewOutputs/action|
|Synapse Compute Operator |workspaces/read</br>workspaces/bigDataPools/useCompute/action</br>workspaces/bigDataPools/viewLogs/action</br>workspaces/integrationRuntimes/useCompute/action</br>workspaces/integrationRuntimes/viewLogs/action</br>workspaces/linkConnections/read</br>workspaces/linkConnections/useCompute/action|
|Synapse Monitoring Operator |workspaces/read</br>workspaces/artifacts/read</br>workspaces/notebooks/viewOutputs/action</br>workspaces/pipelines/viewOutputs/action</br>workspaces/integrationRuntimes/viewLogs/action</br>workspaces/bigDataPools/viewLogs/action|
|Synapse Credential User|workspaces/read</br>workspaces/linkedServices/useSecret/action</br>workspaces/credentials/useSecret/action|
|Synapse Linked Data Manager|workspaces/read</br>workspaces/managedPrivateEndpoint/write, delete</br>workspaces/linkedServices/write, delete</br>workspaces/credentials/write, delete|
|Synapse User|workspaces/read|

## Synapse RBAC actions and the roles that permit them

The following table lists Synapse actions and the built-in roles that permit these actions:

Action|Role
--|--
workspaces/read|Synapse Administrator</br>Synapse Apache Spark Administrator</br>Synapse SQL Administrator</br>Synapse Contributor</br>Synapse Artifact Publisher</br>Synapse Artifact User</br>Synapse Compute Operator </br>Synapse Monitoring Operator </br>Synapse Credential User</br>Synapse Linked Data Manager</br>Synapse User 
workspaces/roleAssignments/write, delete|Synapse Administrator
workspaces/managedPrivateEndpoint/write, delete|Synapse Administrator</br>Synapse Linked Data Manager
workspaces/bigDataPools/useCompute/action|Synapse Administrator</br>Synapse Apache Spark Administrator</br>Synapse Contributor</br>Synapse Compute Operator </br>Synapse Monitoring Operator
workspaces/bigDataPools/viewLogs/action|Synapse Administrator</br>Synapse Apache Spark Administrator</br>Synapse Contributor</br>Synapse Compute Operator
workspaces/integrationRuntimes/useCompute/action|Synapse Administrator</br>Synapse Contributor</br>Synapse Compute Operator</br>Synapse Monitoring Operator
workspaces/integrationRuntimes/viewLogs/action|Synapse Administrator</br>Synapse Contributor</br>Synapse Compute Operator</br>Synapse Monitoring Operator
workspaces/linkConnections/read|Synapse Administrator</br>Synapse Contributor</br>Synapse Compute Operator
workspaces/linkConnections/useCompute/action|Synapse Administrator</br>Synapse Contributor</br>Synapse Compute Operator
workspaces/artifacts/read|Synapse Administrator</br>Synapse Apache Spark Administrator</br>Synapse SQL Administrator</br>Synapse Contributor</br>Synapse Artifact Publisher</br>Synapse Artifact User
workspaces/notebooks/write, delete|Synapse Administrator</br>Synapse Apache Spark Administrator</br>Synapse Contributor</br>Synapse Artifact Publisher
workspaces/sparkJobDefinitions/write, delete|Synapse Administrator</br>Synapse Apache Spark Administrator</br>Synapse Contributor</br>Synapse Artifact Publisher
workspaces/sqlScripts/write, delete|Synapse Administrator</br>Synapse SQL Administrator</br>Synapse Contributor</br>Synapse Artifact Publisher
workspaces/kqlScripts/write, delete|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Publisher
workspaces/dataFlows/write, delete|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Publisher
workspaces/pipelines/write, delete|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Publisher
workspaces/linkConnections/write, delete|Synapse Administrator</br>Synapse Contributor
workspaces/triggers/write, delete|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Publisher
workspaces/datasets/write, delete|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Publisher
workspaces/libraries/write, delete|Synapse Administrator</br>Synapse Apache Spark Administrator</br>Synapse Contributor</br>Synapse Artifact Publisher
workspaces/linkedServices/write, delete|Synapse Administrator</br>Synapse Apache Spark Administrator</br>Synapse SQL Administrator</br>Synapse Contributor</br>Synapse Artifact Publisher</br>Synapse Linked Data Manager
workspaces/credentials/write, delete|Synapse Administrator</br>Synapse Apache Spark Administrator</br>Synapse SQL Administrator</br>Synapse Contributor</br>Synapse Artifact Publisher</br>Synapse Linked Data Manager
workspaces/notebooks/viewOutputs/action|Synapse Administrator</br>Synapse Apache Spark Administrator</br>Synapse Contributor</br>Synapse Artifact Publisher</br>Synapse Artifact User
workspaces/pipelines/viewOutputs/action|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Publisher</br>Synapse Artifact User
workspaces/linkedServices/useSecret/action|Synapse Administrator</br>Synapse Credential User
workspaces/credentials/useSecret/action|Synapse Administrator</br>Synapse Credential User

## Synapse RBAC scopes and their supported roles

The table below lists Synapse RBAC scopes and the roles that can be assigned at each scope. 

>[!NOTE]
> To create or delete an object you must have permissions at a higher-level scope.

Scope|Roles
--|--
Workspace |Synapse Administrator</br>Synapse Apache Spark Administrator</br>Synapse SQL Administrator</br>Synapse Contributor</br>Synapse Artifact Publisher</br>Synapse Artifact User</br>Synapse Compute Operator </br>Synapse Monitoring Operator </br>Synapse Credential User</br>Synapse Linked Data Manager</br>Synapse User
Apache Spark pool | Synapse Administrator </br>Synapse Contributor </br> Synapse Compute Operator
Integration runtime | Synapse Administrator </br>Synapse Contributor </br> Synapse Compute Operator
Linked service |Synapse Administrator </br>Synapse Credential User
Credential |Synapse Administrator </br>Synapse Credential User
 
>[!NOTE]
> All artifact roles and actions are scoped at the workspace level. 

## Next steps

- Learn [how to review Synapse RBAC role assignments](./how-to-review-synapse-rbac-role-assignments.md) for a workspace.
- Learn [how to assign Synapse RBAC roles](./how-to-manage-synapse-rbac-role-assignments.md)
