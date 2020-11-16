---
title: Synapse RBAC roles
description: An article that explains the built-in Synapse RBAC roles
author: billgib
ms.service: synapse-analytics 
ms.topic: access control
ms.subservice: security
ms.date: 12/1/2020
ms.author: billgib
ms.reviewer: jrasnick
---

# Synapse RBAC Roles

The article explains the built-in Synapse RBAC roles and when you would use each.  

## Built-in Synapse RBAC roles

The following table describes the permissions of each built-in role and the scopes at which they can be used.

> [!Note]
> Users with any Synapse RBAC role at any scope automatically have the Synapse Reader role at workspace scope

>[!Note]
>The Apache Spark Administrator and SQL Administrator roles are deprecated and can no longer be used in new role assignments.  Although deprecated, these roles are updated to the Synapse RBAC model. These roles are highlighted with an '*' in the tables below.

>[!Note]
>Where 'future' permissions are noted for a role below, these permissions will be added to the role in a later release and will automatically apply to all principals with that role. 

|Role |Permissions|Scopes|
|---|---|---|
| Synapse Administrator  |Full Synapse access to all resources (SQL Pools, Apache Spark Pools, Integration Runtimes) and code artifacts, including granting access.  Includes administrative access to SQL Pools.</br>_Can read and write artifacts.</br> Can perform all actions on Spark activities.</br>Can connect to SQL pool and SQL serverless endpoints with SQL datareader, datawriter, connect, and grant permissions at the workspace (server) level if role is assigned at workspace scope.</br> Can view Spark pool logs.</br> Can view saved notebook and pipeline output. </br> Can use the secrets stored by linked services or credentials.</br>Can grant Synapse RBAC access to others_|Workspace </br> Spark pool<br/>Integration runtime </br>Linked service</br>Credential |
|Synapse Contributor|Full Synapse access to Apache Spark Pools, Apache Spark job definitions, and notebooks, excluding granting access/br.</br>_Can read and write artifacts</br>Can view saved notebook and pipeline output</br>Can perform all actions on Spark activities.</br>Can view Spark pool logs</br>FUTURE: Can connect to SQL pool and SQL serverless endpoints with SQL datareader, datawriter and connect permissions_|Workspace </br> Spark pool<br/> Integration runtime|
|Synapse Artifact Author|Full Synapse access to code artifacts, excluding granting access.</br>_Can read and write artifacts</br>Can view saved Spark notebook, Spark job, and pipeline output_|Workspace
|Synapse Artifact Reader|Read access to code artifacts.|Workspace
|Synapse Compute Manager|Submission and cancelling of jobs, including jobs submitted by others and viewing logs and output.</br>_Can submit and cancel jobs, including jobs submitted by others</br>Can view Spark pool logs</br>Can view notebook and pipeline output._|Workspace</br>Spark pool</br>Integration runtime|
|Synapse Credential User|Runtime and configuration-time use of secrets within credentials and linked services in activities like pipeline runs.</br>_Can access data in a linked service that is protected by a credential_|Workspace </br>Linked Service</br>Credential
|Synapse Managed Private Endpoint Administrator|Creation and management of private endpoints.|Workspace|
|Synapse Reader|Access to metadata for Spark pools, Integration runtimes. Does not give access to data. </br>_Can list and read Spark pools, Integration Runtimes._|Workspace, Spark pool</br>Linked service </br>Credential|
|_DEPRECATED ROLES_|_The following roles are deprecated and cannot be assigned_|
|Apache Spark Administrator*</br>|Full Synapse access to Apache Spark Pools, Apache Spark job definitions, and notebooks, excluding granting access. </br>_Can perform all actions on Spark artifacts</br>Can perform all actions on Spark activities_|Workspace</br>Spark pool|
|SQL Administrator*|Full Synapse access to SQL On-demand and SQL scripts, excluding granting access. </br>_Can perform all actions on SQL script artifacts</br>Can perform all activities on SQL activities<br/>Can connect to SQL pool and SQL serverless endpoints with {datareader, datawriter, connect, and grant} at the workspace (server) level if role is assigned at the workspace scope._|Workspace|
  

## Synapse RBAC roles and the actions they permit

The following table lists the built-in roles and the actions each supports.

Role|Actions
--|--
Synapse Administrator|workspaces/read</br>workspaces/roleAssignments/write, delete</br>workspaces/managedPrivateEndpoint/write, delete</br>workspaces/bigDataPools/useCompute/action</br>workspaces/bigDataPools/viewLogs/action</br>workspaces/integrationRuntimes/useCompute/action</br>workspaces/integrationRuntimes/viewLogs/action</br>workspaces/artifacts/read</br>workspaces/notebooks/write, delete</br>workspaces/sparkJobDefinitions/write, delete</br>workspaces/sqlScripts/write, delete</br>workspaces/dataFlows/write, delete</br>workspaces/pipelines/write, delete</br>workspaces/triggers/write, delete</br>workspaces/datasets/write, delete</br>workspaces/libraries/write, delete</br>workspaces/linkedServices/write, delete</br>workspaces/credentials/write, delete</br>workspaces/notebooks/viewOutputs/action</br>workspaces/pipelines/viewOutputs/action</br>workspaces/linkedServices/useSecret/action</br>workspaces/credentials/useSecret/action|
|Synapse Contributor|workspaces/read</br>workspaces/bigDataPools/useCompute/action</br>workspaces/bigDataPools/viewLogs/action</br>workspaces/integrationRuntimes/useCompute/action</br>workspaces/integrationRuntimes/viewLogs/action</br>workspaces/artifacts/read</br>workspaces/notebooks/write, delete</br>workspaces/sparkJobDefinitions/write, delete</br>workspaces/sqlScripts/write, delete</br>workspaces/dataFlows/write, delete</br>workspaces/pipelines/write, delete</br>workspaces/triggers/write, delete</br>workspaces/datasets/write, delete</br>workspaces/libraries/write, delete</br>workspaces/linkedServices/write, delete</br>workspaces/credentials/write, delete</br>workspaces/notebooks/viewOutputs/action</br>workspaces/pipelines/viewOutputs/action|
|Synapse Artifact Author|workspaces/read</br>workspaces/artifacts/read</br>workspaces/notebooks/write, delete</br>workspaces/sparkJobDefinitions/write, delete</br>workspaces/sqlScripts/write, delete</br>workspaces/dataFlows/write, delete</br>workspaces/pipelines/write, delete</br>workspaces/triggers/write, delete</br>workspaces/datasets/write, delete</br>workspaces/libraries/write, delete</br>workspaces/linkedServices/write, delete</br>workspaces/credentials/write, delete|
|Synapse Artifact Reader|workspaces/read</br>workspaces/artifacts/read|
|Synapse Compute Manager|workspaces/read</br>workspaces/bigDataPools/useCompute/action</br>workspaces/bigDataPools/viewLogs/action</br>workspaces/integrationRuntimes/useCompute/action</br>workspaces/integrationRuntimes/viewLogs/action|
|Synapse Credential User|workspaces/read</br>workspaces/linkedServices/useSecret/action</br>workspaces/credentials/useSecret/action|
|Synapse Managed Private Endpoint Administrator|workspaces/read</br>workspaces/managedPrivateEndpoint/write, delete|
|Synapse Reader|workspaces/read|
|_DEPRECATED ROLES_|_The following roles are deprecated_|
|Apache Spark Administrator*|workspaces/read</br>workspaces/bigDataPools/useCompute/action</br>workspaces/bigDataPools/viewLogs/action</br>workspaces/artifacts/read</br>workspaces/notebooks/write, delete</br>workspaces/sparkJobDefinitions/write, delete</br>workspaces/linkedServices/write, delete</br>workspaces/credentials/write, delete|
|SQL Administrator*|workspaces/read</br>workspaces/artifacts/read</br>workspaces/sqlScripts/write, delete</br>workspaces/linkedServices/write, delete</br>workspaces/credentials/write, delete|

## Synapse RBAC actions and the roles that permit them

The following table lists Synapse actions and the built-in roles that permit these actions:

>[!Note]
>All actions listed in the tables below are prefixed, "Microsoft.Synapse/..."</br>

Action|Role
--|--
workspaces/read|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author</br>Synapse Artifact Reader</br>Synapse Compute Manager</br>Synapse Credential User</br>Synapse Private Endpoint Manager</br>Synapse Reader</br>Apache Spark Administrator*</br>SQL Administrator* 
workspaces/roleAssignments/write, delete|Synapse Administrator
workspaces/managedPrivateEndpoint/write, delete|Synapse Administrator</br>Synapse Private Endpoint Manager
workspaces/bigDataPools/useCompute/action|Synapse Administrator</br>Synapse Contributor</br>Synapse Compute Manager</br>Apache Spark Administrator*
workspaces/bigDataPools/viewLogs/action|Synapse Administrator</br>Synapse Contributor</br>Synapse Compute Manager</br>Apache Spark Administrator*
workspaces/integrationRuntimes/useCompute/action|Synapse Administrator</br>Synapse Contributor</br>Synapse Compute Manager
workspaces/integrationRuntimes/viewLogs/action|Synapse Administrator</br>Synapse Contributor</br>Synapse Compute Manager
workspaces/artifacts/read|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author</br>Synapse Artifact Reader</br>Apache Spark Administrator*</br>SQL Administrator*
workspaces/notebooks/write, delete|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author</br>Apache Spark Administrator*
workspaces/sparkJobDefinitions/write, delete|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author</br>Apache Spark Administrator*
workspaces/sqlScripts/write, delete|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author</br>SQL Administrator*
workspaces/dataFlows/write, delete|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/pipelines/write, delete|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/triggers/write, delete|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/datasets/write, delete|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/libraries/write, delete|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/linkedServices/write, delete|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/credentials/write, delete|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/notebooks/viewOutputs/action|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author</br>Synapse Artifact Reader
workspaces/pipelines/viewOutputs/action|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author</br>Synapse Artifact Reader
workspaces/linkedServices/useSecret/action|Synapse Administrator</br>Synapse Credential User
workspaces/credentials/useSecret/action|Synapse Administrator</br>Synapse Credential User