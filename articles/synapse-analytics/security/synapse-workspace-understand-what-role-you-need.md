---
title: Understand the roles required to perform common tasks in Azure Synapse
description: Understand which Synapse RBAC (role-based access control) roles or Azure RBAC roles you need to get work done in Synapse Studio.  
author: meenalsri
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: security
ms.date: 04/22/2022
ms.author: mesrivas
ms.reviewer: sngun, wiassaf
ms.custom: ignite-fall-2021
---
# Understand the roles required to perform common tasks in Azure Synapse

This article will help you understand which Synapse RBAC (role-based access control) roles or Azure RBAC roles you need to get work done in Synapse Studio. To manage role membership, see [Manage Synapse RBAC role assignments](./how-to-manage-synapse-rbac-role-assignments.md).

## Synapse Studio access control and workflow summary 

### Access Synapse Studio

You can open Synapse Studio and view details of the workspace and list any of its Azure resources such as SQL pools, Spark pools, or Integration runtimes. You will see if you've been assigned any Synapse RBAC role or have the Azure Owner, Contributor, or Reader role on the workspace.

### Resource management

You can create SQL pools, Data Explorer pools, and Apache Spark pools if you are an Azure Owner or Contributor on the resource group. You can create an Integration Runtime if you are an Azure Owner or Contributor on the workspace. When using ARM templates for automated deployment, you need to be an Azure Contributor on the resource group.

You can pause or scale a dedicated SQL pool, configure a Spark pool, or an integration runtime if you're an Azure Owner or Contributor on the workspace or that resource.

### View and edit code artifacts

With access to Synapse Studio, you can create new code artifacts, such as SQL scripts, KQL scripts, notebooks, spark jobs, linked services, pipelines, dataflows, triggers, and credentials. These artifacts can be published or saved with additional permissions.  

If you're a Synapse Artifact User, Synapse Artifact Publisher, Synapse Contributor, or Synapse Administrator you can list, open, and edit already published code artifacts, including scheduled pipelines.

### Execute your code

You can execute SQL scripts on SQL pools if you have the necessary SQL permissions defined in the SQL pools. You can execute KQL scripts on Data Explorer pools if you have the necessary permissions.  

You can run notebooks and Spark jobs if you have Synapse Compute Operator permissions on the workspace or specific Apache Spark pools.  

With Compute Operator permissions on the workspace or specific integration runtimes, and appropriate credential permissions you can execute pipelines.

### Monitor and manage execution

You can review the status of running notebooks and jobs in Apache Spark pools if you're a Synapse User.

You can review logs and cancel running jobs and pipelines if you're a Synapse Compute Operator at the workspace or for a specific Spark pool or pipeline.  

### Debug pipelines

You can review and make changes in pipelines as a Synapse User, but if you want to be able to debug it you also need to have Synapse Credential User.

### Publish and save your code

You can publish new or updated code artifacts to the service if you're a Synapse Artifact Publisher, Synapse Contributor, or Synapse Administrator. 

You can commit code artifacts to a working branch of a Git repository if the workspace is Git-enabled and you have Git permissions. With Git enabled, publishing is only allowed from the collaboration branch.

If you close Synapse Studio without publishing or committing changes to code artifacts, then those changes will be lost.

## Tasks and required roles

The table below lists common tasks and for each task, the Synapse RBAC, or Azure RBAC roles required.  

>[!Note]
> Synapse Administrator is not listed for each task unless it is the only role that provides the necessary permission. A Synapse Administrator can perform all tasks enabled by other Synapse RBAC roles.</br>

> [!Note]
> Guest users from another tenant are also able to review, add, or change role assignments once they have been assigned as Synapse Administrator. 

The minimum Synapse RBAC role required is shown. 

All Synapse RBAC roles at any scope provide you Synapse User permissions at the workspace.

All Synapse RBAC permissions/actions shown in the table are prefixed `Microsoft/Synapse/workspaces/...`.


Task (I want to...) |Role (I need to be...)|Synapse RBAC permission/action
--|--|--
|Open Synapse Studio on a workspace|Synapse User or |read
| |Azure Owner or Contributor, or Reader on the workspace|none
|List SQL pools or Data Explorer pools or Apache Spark pools, or Integration runtimes and access their configuration details|Synapse User or|read|
||Azure Owner or Contributor, or Reader on the workspace|none
|List linked services or credentials or managed private endpoints|Synapse User|read
SQL POOLS|
Create a dedicated SQL pool or a serverless SQL pool|Azure Owner or Contributor on the resource group|none
Manage (pause or scale, or delete) a dedicated SQL pool|Azure Owner or Contributor on the SQL pool or workspace|none
Create a SQL script</br>|Synapse User or </br>Azure Owner or Contributor on the workspace. </br></br>*Additional SQL permissions are required to run a SQL script, publish, or commit changes*.|
List and open any published SQL script| Synapse Artifact User or Artifact Publisher, or Synapse Contributor|artifacts/read
Run a SQL script on a serverless SQL pool|SQL permissions on the pool (granted automatically to a Synapse Administrator)|none
Run a SQL script on a dedicated SQL pool|SQL permissions on the pool (granted automatically to a Synapse Administrator)|none
Publish a new or updated, or deleted SQL script|Synapse Artifact Publisher or Synapse Contributor|sqlScripts/write, delete
Commit changes to a SQL script to the Git repo|Requires Git permissions on the repo|
Assign Active Directory Admin on the workspace (via workspace properties in the Azure Portal)|Azure Owner or Contributor on the workspace |
DATA EXPLORER POOLS|
Create a Data Explorer pool |Azure Owner or Contributor on the resource group|none
Manage (pause or scale, or delete) a Data Explorer pool|Azure Owner or Contributor on the Data Explorer pool or workspace|none
Create a KQL script</br>|Synapse User. </br></br>*Additional Data Explorer permissions are required to run a script, publish, or commit changes*.|
List and open any published KQL script| Synapse Artifact User or Artifact Publisher, or Synapse Contributor|artifacts/read
Run a KQL script on a Data Explorer pool| Data Explorer permissions on the pool (granted automatically to a Synapse Administrator)|none
Publish new, update, or delete KQL script|Synapse Artifact Publisher or Synapse Contributor|kqlScripts/write, delete
Commit changes to a KQL script to the Git repo|Requires Git permissions on the repo|
APACHE SPARK POOLS|
Create an Apache Spark pool|Azure Owner or Contributor on the resource group|
Monitor Apache Spark applications| Synapse User|read
View the logs for completed notebook and job execution |Synapse Monitoring Operator|
Cancel any notebook or Spark job running on an Apache Spark pool|Synapse Compute Operator on the Apache Spark pool.|bigDataPools/useCompute
Create a notebook or job definition|Synapse User or </br>Azure Owner or Contributor, or Reader on the workspace</br></br> *Additional permissions are required to run, publish, or commit changes*|read</br></br></br></br></br> 
List and open a published notebook or job definition, including reviewing saved outputs|Synapse Artifact User or Synapse Monitoring Operator on the workspace|artifacts/read
Run a notebook and review its output, or submit a Spark job|Synapse Apache Spark Administrator or Synapse Compute Operator on the selected Apache Spark pool|bigDataPools/useCompute 
Publish or delete a notebook or job definition (including output) to the service|Artifact Publisher on the workspace or Synapse Apache Spark Administrator|notebooks/write, delete
Commit changes to a notebook or job definition to the Git repo|Git permissions|none
PIPELINES, INTEGRATION RUNTIMES, DATAFLOWS, DATASETS & TRIGGERS|
Create, update, or delete an Integration runtime|Azure Owner or Contributor on the workspace|
Monitor Integration runtime status|Synapse Monitoring Operator|read, integrationRuntimes/viewLogs
Review pipeline runs|Synapse Monitoring Operator|read, pipelines/viewOutputs 
Create a pipeline |Synapse User</br></br>*Additional Synapse permissions are required to debug, add triggers, publish, or commit changes*|read
Create a dataflow or dataset |Synapse User</br></br>*Additional Synapse permissions are required to publish, or commit changes*|read
List and open a published pipeline |Synapse Artifact User or Synapse Monitoring Operator | artifacts/read
Preview dataset data|Synapse User and Synapse Credential User on the WorkspaceSystemIdentity| 
Debug a pipeline using the default Integration runtime|Synapse User and Synapse Credential User on the WorkspaceSystemIdentity credential|read, </br>credentials/useSecret
Create a trigger, including trigger now (requires permission to execute the pipeline)|Synapse User and Synapse Credential User on the WorkspaceSystemIdentity|read, credentials/useSecret/action
Execute/run a pipeline|Synapse User and Synapse Credential User on the WorkspaceSystemIdentity|read, credentials/useSecret/action
Copy data using the Copy Data tool|Synapse User and Synapse Credential User on the Workspace System Identity|read, credentials/useSecret/action
Ingest data (using a schedule)|Synapse Author and Synapse Credential User on the Workspace System Identity|read, credentials/useSecret/action
Publish a new, updated, or deleted pipeline, dataflow, or trigger to the service|Synapse Artifact Publisher on the workspace|pipelines/write, delete</br>dataflows/write, delete</br>triggers/write, delete
Commit changes to pipelines, dataflows, datasets, or triggers to the Git repo |Git permissions|none 
LINKED SERVICES|
Create a linked service (includes assigning a credential)|Synapse User</br></br>*Additional permissions are required to use a linked service with credentials, or to publish, or commit changes*|read
List and open a published linked service|Synapse Artifact User|linkedServices/write, delete  
Test connection on a linked service secured by a credential|Synapse User and Synapse Credential User|credentials/useSecret/action|
Publish a linked service|Synapse Artifact Publisher or Synapse Linked Data Manager|linkedServices/write, delete
Commit linked service definitions to the Git repo|Git permissions|none
ACCESS MANAGEMENT|
Review Synapse RBAC role assignments at any scope|Synapse User|read
Assign and remove Synapse RBAC role assignments for users, groups, and service principals| Synapse Administrator at the workspace or at a specific workspace item scope|roleAssignments/write, delete


## Next steps

 - [Review Synapse RBAC role assignments](./how-to-review-synapse-rbac-role-assignments.md)
 - [Manage Synapse RBAC role assignments](./how-to-manage-synapse-rbac-role-assignments.md)
