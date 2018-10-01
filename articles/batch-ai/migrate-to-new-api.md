---
title: Migrate to updated Azure Batch AI API | Microsoft Docs
description: How to update Azure Batch AI code and scripts to use workspace and experiment resources
services: batch-ai
documentationcenter: na
author: dlepow
manager: jeconnoc
editor: 

ms.assetid:
ms.custom:
ms.service: batch-ai
ms.workload:
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: article
ms.date: 06/08/2018
ms.author: danlep
---

# Migrate to the updated Batch AI API

In the Batch AI REST API version 2018-05-01 and related Batch AI SDKs and tools, significant changes and new features have been introduced.

If you've used a previous version of the Batch AI API, this article explains how to modify your code and scripts to work with the new API. 

## What's changing?

In response to customer feedback, we’re removing limits on the number of jobs and making it easier to manage Batch AI resources. The new API introduces two new resources, *workspace* and *experiment*. Collect related training jobs under an experiment, and organize all related Batch AI resources (clusters, file servers, experiments, jobs) under a workspace.  

* **Workspace** - A top-level collection of all types of Batch AI resources. Clusters and file servers are contained in a workspace. Workspaces usually separate work belonging to different groups or projects. For example, you might have a dev and a test workspace. You probably need only a limited number of workspaces per subscription. 

* **Experiment** - A collection of related jobs that can be queried and managed together. For example, use an experiment to group all jobs that are performed as part of a hyper-parameter tuning sweep. 

The following image shows an example resource hierarchy. 

![](./media/migrate-to-new-api/batch-ai-resource-hierarchy.png)

## Monitor and manage existing resources
In each resource group where you already created Batch AI clusters, jobs, or file servers, the Batch AI service will create a workspace named `migrated-<region>` (for example, `migrated-eastus`) and an experiment named `migrated`. To access the previously created jobs, clusters, or file servers, you need to use the migrated workspace and experiment. 

### Portal 
To access previously created jobs, clusters, or file servers by using the portal, first select the `migrated-<region>` workspace. After you select the workspace, perform operations such as resizing or deleting a cluster, and viewing job status and outputs. 

### SDKs 
To access jobs, clusters, or file servers previously created via the Batch AI SDKs, supply the workspace name and experiment name parameters. 

If you use the Python SDK, relevant changes are shown in the following examples. Changes are similar in the other Batch AI SDKs. 


#### Get old cluster 

```python
cluster = client.clusters.get(resource_group_name, 'migrated-<region>', cluster_name)
```

#### Delete old cluster 

```python
client.clusters.delete(resource_group_name, 'migrated-<region>', cluster_name)
```

#### Get old file server 

```python
cluster = client.fileservers.get(resource_group_name, 'migrated-<region>', fileserver_name)
```

#### Delete old file server  

```python
client.fileservers.delete(resource_group_name, 'migrated-<region>', fileserver_name)
``` 


#### Get old job 

```python
cluster = client.jobs.get(resource_group_name, 'migrated-<region>', 'migrated', job_name)
```

#### Delete old job

```python
client.jobs.delete(resource_group_name, 'migrated-<region>', 'migrated', job_name)
```
 
### Azure CLI 
 
When using the Azure CLI to access previously created jobs, clusters, or file servers, use the `-w` and `-e` parameters to supply workspace and experiment names. 


#### Get old cluster

```azurecli
az batchai cluster show -g resource-group-name -w migrated-<region> -n cluster-name
```


#### Delete old cluster 

```azurecli
az batchai cluster delete -g resource-group-name -w migrated-<region> -n cluster-name
```

#### Get old file server

```azurecli
az batchai file-server show -g resource-group-name -w migrated-<region> -n fileserver-name
```


#### Delete old file server 

```azurecli
az batchai file-server delete -g resource-group-name -w migrated-<region> -n fileserver-name
``` 


#### Get old job

```azurecli
az batchai job show -g resource-group-name -w migrated-<region> -e migrated -n job-name
```


#### Delete old job 

```azurecli
az batchai job delete -g resource-group-name -w migrated-<region> -e migrated -n job-name
``` 

## Create Batch AI resources 
 
If you're using one of the existing Batch AI SDKs, you can continue to use it to create Batch AI resources (jobs, clusters, or file servers) without making code changes. However, after you upgrade to the new SDK, you need to make the following changes.
 
### Create workspace 
Depending on your scenario, you can create a workspace manually one-time via the portal or CLI. If you're using the CLI, create a workspace using the following command: 

```azurecli
az batchai workspace create -g resource-group-name -n workspace-name
```

### Create experiment 


Depending on your scenario, you can create  an experiment manually one-time via the portal or CLI. If you're using the CLI, create an experiment using the following command: 

```azurecli
az batchai experiment create -g resource-group-name -w workspace-name -n experiment-name

```

### Create clusters, file servers, and jobs
 
If you use the portal to create jobs, clusters, or file servers, the portal will guide you during the creation experience to supply the workspace name and experiment name parameters.

To create jobs, clusters, or file servers via the updated SDK, supply the workspace name parameter. If you use the Python SDK, relevant changes are shown in the following examples. Replace *workspace_name* and *experiment_name* with the workspace and experiment that you created previously. Changes are similar in the other Batch AI SDKs. 


#### Create cluster 

```python
_ = client.clusters.create(resource_group_name, workspace_name, cluster_name, cluster_create_parameters).result()
```

#### Create file server 

```python
_ = client.fileservers.create(resource_group_name, workspace_name, fileserver_name, fileserver_create_parameters).result()
```

#### Create job 

```python
_ = client.jobs.create(resource_group_name, workspace_name, experiment_name, job_name job_create_parameters).result()
```


## Next steps

* See the Batch AI API reference: [CLI](/cli/azure/batchai), [.NET](/dotnet/api/overview/azure/batchai), [Java](/java/api/overview/azure/batchai), [Node.js](/javascript/api/overview/azure/batchai), [Python](/python/api/overview/azure/batchai), and [REST](/rest/api/batchai)