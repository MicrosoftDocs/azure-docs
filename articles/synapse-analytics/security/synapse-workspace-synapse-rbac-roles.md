---
title: Synapse RBAC roles
description: An article that explains the built in Synapse RBAC roles
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

## Built-in roles

The following table lists the permissions of each built-in role and the scopes at which they can be used.

> [!Note]
> Users with any Synapse RBAC role at any scope automatically have the Synapse Reader role at workspace scope.

|Role |Permissions|Scopes|
|---|---|---|
| Synapse Administrator  | Can read and write artifacts. </br> Can perform all actions on Spark, and Scope activities. <br/>Can connect to SQL endpoints with {datareader, datawriter, connect, and grant} at the workspace (server) level if role is assigned at the workspace scope.</br> Can view Spark pool logs.</br> Can view notebook and pipeline output. </br> Can use the secrets stored by linked services or credentials.</br>Can grant Synapse RBAC access to others|Workspace </br> Spark pool<br/> Scope pool</br>Integration Runtime </br>Linked service</br>Credential |
|Synapse Contributor|Can read and write artifacts</br>Can view notebook and pipeline output</br>Can perform all actions on Spark, and Scope activities.</br>Can view Spark pool logs</br>Can view notebook and pipeline output|Workspace </br> Spark pool<br/> Scope pool</br>Integration Runtime|
|Synapse Artifact Author|Can read and write artifacts</br>Can view Spark notebook, Spark job, and pipeline output|Workspace
|Synapse Artifact Reader|Read access to code artifacts.|Workspace
|Synapse Compute Manager|Can submit and cancel jobs, including jobs submitted by others</br>Can view Spark pool logs</br>Can view notebook and pipeline output.|Spark pool</br>Scope pool|
|Synapse Credential User|Runtime and configuration-time use of secrets within credentials and linked services in activities like pipeline runs.|Workspace </br>Linked Service</br>Credential
|Synapse Managed Private Endpoint Administrator|Creation and management of private endpoints.|Workspace|
|Synapse Reader|Can list and read metadata for Spark pools, Scope pools, Integration runtimes|Workspace, Spark pool</br>Scope pool</br>Linked service </br>Credential|
|**DEPRECATED ROLES**|_The following roles are deprecated_|
|Apache Spark Administrator|Can perform all actions on Spark artifacts</br>Can perform all actions on Spark activities|Workspace</br>Spark pool|
|SQL Administrator|Can perform all actions on SQL script artifacts</br>Can perform all activities on SQL and Scope activities<br/>Can connect to SQL endpoints with {datareader, datawriter, connect, and grant} at the workspace (server) level if role is assigned at the workspace scope.|Workspace|
|Scope Adminstrator|Can performan |
>[!Note]
>Deprecated roles can no longer be used in new role assignments.  While deprecated, these roles are updated to the Synapse RBAC model as described later.   

## Synapse RBAC Actions

The following table lists Synapse actions and the built-in roles that permit these actions:

>[!Note]
>All actions in this document are prefixed Microsoft.Synapse/...

Action|Role
--|--
workspaces/read|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author</br>Synapse Artifact Reader</br>Synapse Compute Manager</br>Synapse Credential User</br>Synapse Private Endpoint Manager</br>Synapse Reader 
workspaces/roleAssignments/write|Synapse Administrator
workspaces/roleAssignments/delete|Synapse Administrator
workspaces/managedPrivateEndpoint/write|Synapse Administrator</br>Synapse Private Endpoint Manager
workspaces/managedPrivateEndpoint/delete|Synapse Administrator</br>Synapse Private Endpoint Manager
workspaces/bigDataPools/useCompute/action|Synapse Administrator</br>Synapse Contributor</br>Synapse Compute Manager
workspaces/bigDataPools/viewLogs/action|Synapse Administrator</br>Synapse Contributor</br>Synapse Compute Manager
workspaces/scopePools/useCompute/action|Synapse Administrator</br>Synapse Contributor</br>Synapse Compute Manager
workspaces/scopePools/viewLogs/action|Synapse Administrator</br>Synapse Contributor</br>Synapse Compute Manager
workspaces/integrationRuntimes/useCompute/action|Synapse Administrator</br>Synapse Contributor</br>Synapse Compute Manager
workspaces/integrationRuntimes/viewLogs/action|Synapse Administrator</br>Synapse Contributor</br>Synapse Compute Manager
workspaces/artifacts/read|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author</br>Synapse Artifact Reader
workspaces/notebooks/write|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/sparkJobDefinitions/write|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/sqlScripts/write|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/dataFlows/write|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/pipelines/write|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/triggers/write|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/datasets/write|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/libraries/write|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/linkedServices/write|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/credentials/write|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/notebooks/delete|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/sparkJobDefinitions/delete|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/sqlScripts/delete|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/dataFlows/delete|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/pipelines/delete|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/triggers/delete|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/datasets/delete|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/libraries/delete|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/linkedServices/delete|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/credentials/delete|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author
workspaces/notebooks/viewOutputs/action|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author</br>Synapse Artifact Reader
workspaces/pipelines/viewOutputs/action|Synapse Administrator</br>Synapse Contributor</br>Synapse Artifact Author</br>Synapse Artifact Reader
workspaces/linkedServices/useSecret/action|Synapse Administrator</br>Synapse Credential User
workspaces/credentials/useSecret/action|Synapse Administrator</br>Synapse Credential User

## Synapse RBAC actions supported by deprecated roles

The following actions are permitted by the deprecated Synapse RBAC roles.

Action|Role
--|--
workspaces/read|Apache Spark Administrator</br>SQL Administrator</br>Scope Administrator
workspaces/bigDataPools/useCompute/action|Apache Spark Administrator
workspaces/bigDataPools/viewLogs/action|Apache Spark Administrator
workspaces/scopePools/useCompute/action|Scope Administrator
workspaces/scopePools/viewLogs/action|Scope Administrator
workspaces/artifacts/read|Apache Spark Administrator</br>SQL Administrator</br>Scope Administrator
workspaces/notebooks/write, delete|Apache Spark Administrator
workspaces/sparkJobDefinitions/write, delete|Apache Spark Administrator
workspaces/sqlScripts/write, delete|SQL Administrator
workspaces/scopeJobDefinitions/write, delete|Scope Administrator
workspaces/linkedServices/write, delete|Apache Spark Administrator</br>SQL Administrator</br>Scope Administrator
workspaces/credentials/write, delete|Apache Spark Administrator</br>SQL Administrator</br>Scope Administrator