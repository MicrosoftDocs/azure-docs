---
title: Understand the roles required to perform common tasks in Synapse
description: An article that explains which Synapse RBAC role(s) are required to perform specific tasks
author: billgib
ms.service: synapse-analytics 
ms.topic: access control
ms.subservice: security
ms.date: 12/1/2020
ms.author: billgib
ms.reviewer: jrasnick
---
# Understand the roles required to perform common tasks in Synapse

This article will help you understand which Synapse RBAC (role-based access control) or Azure RBAC roles you need to get work done in Synapse Studio.  

## Synapse Studio access control and workflow summary 

### Accessing Synapse Studio
- You can open Synapse Studio on a Synapse workspace if you have been assigned any Synapse RBAC role on the workspace or any of its content, or if you have Azure Owner, Contributor, or Reader roles on the workspace. 

### Resource management
- You can list and view details of the workspace or any of its Azure resources (SQL pools, Spark pools, or integration runtimes) if you're an Azure Owner, Contributor, or Reader on the workspace or have been assigned any Synapse RBAC role.
- You can create SQL pools, Apache Spark pools, integration runtimes if you're an Azure Owner or Contributor on the workspace.
- You can pause or scale dedicated SQL pools, configure Spark pools or integration runtimes if you're an Azure Owner or Contributor on the workspace or a specific resource.

### Editing code artifacts

- With access to Synapse Studio, you can create new code artifacts, such as SQL scripts, notebooks, spark jobs, linked services, pipelines, dataflows, triggers, and credentials.  (These artifacts can be published or saved with additional permissions.)  
- If you're a Synapse Artifact Reader, Synapse Artifact Author, Synapse Contributor, or Synapse Administrator you can list, open, and edit already published code artifacts.

### Executing your code

- You can execute SQL scripts on SQL pools if you have the necessary SQL permissions defined in those SQL pools.  
- You can run notebooks and Spark jobs if you have Synapse Compute Manager permissions on the workspace or specific Apache Spark pools.  
- With compute usage on the workspace of specific integration runtimes and appropriate credential permissions you can execute pipelines and the activities orchestrated within them.

### Monitoring and managing execution
- You can review the status of running notebooks and jobs in Apache Spark pools if you're a Synapse Reader.
- You can review logs and cancel running jobs and pipelines if you're a Synapse Compute Manager at the workspace or for a specific Spark pool or pipeline.  

### Publishing and saving your code

- You can publish new or updated code artifacts to the service if you're a Synapse Artifact Author, Synapse Contributor, or Synapse Administrator. 
- You can commit/save code artifacts to a working branch of your configured repository if the workspace is Git-enabled and you have Git permissions. With Git enabled, publishing to the service is only recommended from the collaboration branch. 
- If you close Synapse Studio without publishing or committing any changes you've made to any code artifacts, then those changes will be lost.


## Tasks and required roles

The table below lists common tasks and for each task, the Synapse RBAC, or Azure RBAC roles required. Tasks are grouped by analytics runtime, and then organized into resource management and monitoring, code editing, code execution, code publishing, and saving.   

>[!Note]
>- Synapse Administrator is not listed for each task unless it is the only role that provides the necessary permission.  A Synapse Administrator can perform all tasks enabled by other Synapse RBAC roles.</br>
>- All Synapse RBAC roles at any scope provide you Synapse Reader permissions at the workspace
>- All Synapse RBAC permissions/actions shown in the table are prefixed microsoft/synapse/workspaces/... </br>


Task (I want to...) |Role (I need to be...)|Synapse RBAC permission/action
--|--|--
|Open Synapse Studio on a workspace|Synapse Reader, or|read
| |Azure Owner, Contributor, or Reader on the workspace|none
|List SQL pools, Apache Spark pools, integration runtimes and access their configuration details|Synapse Reader , or|read|
||Azure Owner, Contributor, or Reader on the workspace|none
|List linked services, credentials, managed private endpoints|Synapse Reader|read
**SQL pools**||
Create a dedicated SQL pool or a serverless SQL pool|Azure Owner or Contributor on the workspace|none
Manage (pause, scale, or delete) a dedicated SQL pool|Azure Owner or Contributor on the SQL pool or workspace|none
Create a SQL script</br>|Synapse Reader, or </br>Azure Owner, Contributor of the workspace, </br>*Additional SQL permissions are required to run a SQL script*.|
List and open any published SQL script| Synapse Artifact Reader, Artifact Author, Contributor|artifacts/read
Run a SQL script on a serverless SQL pool|Requires SQL permissions on the pool|none
Run a SQL script on a dedicated SQL pool|Requires SQL permissions on the pool|none
Publish a new, updated, or deleted SQL script|Synapse Artifact Author, Synapse Contributor|sqlScripts/write, delete
Commit changes to a SQL script to a Git repo|Requires Git permissions on the repo|
Assign Active Directory Admin on a dedicated SQL pool (via workspace properties in the Azure Portal)|Azure Owner, Contributor on the workspace |
**Apache Spark pools**||
Create an Apache Spark pool|Azure Owner or Contributor on the workspace|
Monitor Apache Spark applications| Synapse Reader|read
View the logs for notebook and job execution |Synapse Compute Manager|
Cancel any notebook or Spark job running on an Apache Spark pool|Synapse Compute Manager on the Apache Spark pool.|bigDataPools/useCompute
Create a notebook or job definition|Synapse Reader or Azure Owner, Contributor or Reader on the workspace</br> *Additional permissions are required to run, publish, or save*|read
List and open a published notebook or job definition, including reviewing saved outputs|Synapse Artifact Reader, Synapse Artifact Author, Synapse Contributor on the workspace|artifacts/read
Run a notebook and review its output|Compute Manager on the selected Apache Spark pool|bigDataPools/useCompute 
Publish or delete a notebook or job definition (including output) to the service|Artifact Author on the workspace|notebooks/write, delete
Commit changes to a notebook or job definition to the Git working branch|Git permissions|none
**Pipelines, Integration runtimes, Dataflows, Datasets and Triggers**||
Create, update, or delete an Integration runtime|Azure Owner or Contributor on the workspace|
Monitor Integration runtime status|Synapse Reader|read, pipelines/viewOutputs
Review pipeline runs|Artifact Author/Synapse Contributor|read, pipelines/viewOutputs 
Create a pipeline |Synapse Reader </br>[***under consideration + Synapse Credential User on WorkspaceSystemIdentity***]</br>*Additional permissions are required to publish, or save*|read, credentials/UseSecret/action
Create a dataflow, dataset, or trigger |Synapse Reader</br>*Additional permissions are required to publish, or save*|read
List and open a published pipeline |Synapse Artifact Reader | artifacts/read
Preview dataset data|Synapse Reader + Synapse Credential User on the WorkspaceSystemIdentity| 
Debug a pipeline using the default Integration runtime|Synapse Reader + Synapse Credential User on the WorkspaceSystemIdentity credential|read, </br>credentials/useSecret
Create a trigger, including trigger now|Synapse Reader + Synapse Credential User on the WorkspaceSystemIdentity|read, credentials/useSecret/action
Copy data using the Copy Data tool|Synapse Reader + Synapse Credential User on the Workspace System Identity|read, credentials/useSecret/action
Ingest data (using a schedule)|Synapse Author + Synapse Credential User on the Workspace System Identity|read, credentials/useSecret/action
Publish a new, updated or deleted pipeline, dataflow or trigger to the service|Artifact Author on the workspace|pipelines/write, delete</br>dataflows write, delete</br>triggers/write, delete
Publish a new, updated or deleted dataflow, dataset, or trigger to the service|Artifact Author on the workspace|triggers/write, delete
Save (commit) changes to pipelines, dataflows, datasets, triggers to the Git repo |Git permissions|none 
**Linked services**||
Create a linked service (includes assigning a credential)|Synapse Reader</br>*Additional permissions are required to run, publish, or save*|read
List and open a published linked service|Synapse Artifact Reader|linkedServices/write, delete  
Test connection on a linked service secured by a credential|Synapse Reader and Synapse Credential User|credentials/useSecret/action|
Publish a linked service|Synapse Artifact Author|linkedServices/write, delete
Save (commit) linked service definitions to the Git repo|Git permissions|none
**Access management**||
Review Synapse RBAC role assignments at any scope|Synapse Reader|read
Assign and remove Synapse RBAC role assignments for users, groups and service principals| Synapse Administrator at the workspace or at a specific workspace item scope|roleAssignments/write, delete
Create or remove Synapse RBAC access to code artifacts|Synapse Administrator at the workspace scope|roleAssignments/write, delete   

>[!Note]
>Guest users from another tenant are not able to review, add, or change role assignments regardless of the role they have been assigned. 

## Next Steps

Learn [how to review Synapse RBAC role assignments](./how-to-review-synapse-rbac-role-assignments.md)

Learn [how to manage Synapse RBAC role assignments](./how-to-manage-synapse-rbac-role-assignments.md). 