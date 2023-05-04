---
title: Sizing guidance
description: Plan for the size of a deployment of Azure Arc-enabled data services.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.custom: event-tier1-build-2022
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

# Sizing Guidance


## Overview of sizing guidance

When planning for the deployment of Azure Arc data services, plan the correct amount of:

- Compute
- Memory
- Storage 

These resources are required for: 

- The data controller
- SQL managed instances
- PostgreSQL servers

Because Azure Arc-enabled data services deploy on Kubernetes, you have the flexibility of adding more capacity to your Kubernetes cluster over time by compute nodes or storage. This guide explains minimum requirements and recommends sizes for some common requirements.

## General sizing requirements

> [!NOTE]
> If you are not familiar with the concepts in this article, you can read more about [Kubernetes resource governance](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) and [Kubernetes size notation](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#resource-units-in-kubernetes).

Cores numbers must be an integer value greater than or equal to one.

When you deploy with Azure CLI (az), use a power of two number to set the memory values. Specifically, use the suffixes: 

- `Ki`
- `Mi`
- `Gi`

Limit values must always be greater than to the request value, if specified.

Limit values for cores are the billable metric on SQL managed instance and PostgreSQL servers.

## Minimum deployment requirements

A minimum size Azure Arc-enabled data services deployment could be considered to be the Azure Arc data controller plus one SQL managed instance plus one PostgreSQL server.  For this configuration, you need at least 16-GB RAM and 4 cores of _available_ capacity on your Kubernetes cluster.  You should ensure that you have a minimum Kubernetes node size of 8-GB RAM and 4 cores and a sum total capacity of 16-GB RAM available across all of your Kubernetes nodes.  For example, you could have 1 node at 32-GB RAM and 4 cores or you could have 2 nodes with 16-GB RAM and 4 cores each.

See the [storage-configuration](storage-configuration.md) article for details on storage sizing.

## Data controller sizing details

The data controller is a collection of pods that are deployed to your Kubernetes cluster to provide an API, the controller service, the bootstrapper, and the monitoring databases and dashboards.  This table describes the default values for memory and CPU requests and limits.

|Pod name|CPU request|Memory request|CPU limit|Memory limit|
|---|---|---|---|---|
|**`bootstrapper`**|`100m`|`100Mi`|`200m`|`200Mi`|
|**`control`**|`400m`|`2Gi`|`1800m`|`2Gi`|
|**`controldb`**|`200m`|`4Gi`|`800m`|`6Gi`|
|**`logsdb`**|`200m`|`1600Mi`|`2`|`1600Mi`|
|**`logsui`**|`100m`|`500Mi`|`2`|`2Gi`|
|**`metricsdb`**|`200m`|`800Mi`|`400m`|`2Gi`|
|**`metricsdc`**|`100m`|`200Mi`|`200m`|`300Mi`|
|**`metricsui`**|`20m`|`200Mi`|`500m`|`200Mi`|

`metricsdc` is a `daemonset`, which is created on each of the Kubernetes nodes in your cluster.  The numbers in the table are _per node_. If you set `allowNodeMetricsCollection = false` in your deployment profile file before you create the data controller, this `daemonset` isn't created.

You can override the default settings for the `controldb` and control pods in your data controller YAML file.  Example:

```yaml
  resources:
    controller:
      limits:
        cpu: "1000m"
        memory: "3Gi"
      requests:
        cpu: "800m"
        memory: "2Gi"
    controllerDb:
      limits:
        cpu: "800m"
        memory: "8Gi"
      requests:
        cpu: "200m"
        memory: "4Gi"
```

See the [storage-configuration](storage-configuration.md) article for details on storage sizing.

## SQL managed instance sizing details

Each SQL managed instance must have the following minimum resource requests and limits:

|Service tier|General Purpose|Business Critical|
|---|---|---|
|CPU request|Minimum: 1<br/> Maximum: 24<br/> Default: 2|Minimum: 3<br/> Maximum: unlimited<br/> Default: 4|
|CPU limit|Minimum: 1<br/> Maximum: 24<br/> Default: 2|Minimum: 3<br/> Maximum: unlimited<br/> Default: 4|
|Memory request|Minimum: `2Gi`<br/> Maximum: `128Gi`<br/> Default: `4Gi`|Minimum: `2Gi`<br/> Maximum: unlimited<br/> Default: `4Gi`|
|Memory limit|Minimum: `2Gi`<br/> Maximum: `128Gi`<br/> Default: `4Gi`|Minimum: `2Gi`<br/> Maximum: unlimited<br/> Default: `4Gi`|

Each SQL managed instance pod that is created has three containers:

|Container name|CPU Request|Memory Request|CPU Limit|Memory Limit|Notes|
|---|---|---|---|---|---|
|`fluentbit`|`100m`|`100Mi`|Not specified|Not specified|The `fluentbit` container resource requests are _in addition to_ the requests specified for the SQL managed instance.|
|`arc-sqlmi`|User specified or not specified.|User specified or not specified.|User specified or not specified.|User specified or not specified.|
|`collectd`|Not specified|Not specified|Not specified|Not specified|

The default volume size for all persistent volumes is `5Gi`.

## PostgreSQL server sizing details

Each PostgreSQL server node must have the following minimum resource requests:
- Memory: `256Mi`
- Cores: 1

Each PostgreSQL server pod that is created has three containers:

|Container name|CPU Request|Memory Request|CPU Limit|Memory Limit|Notes|
|---|---|---|---|---|---|
|`fluentbit`|`100m`|`100Mi`|Not specified|Not specified|The `fluentbit` container resource requests are _in addition to_ the requests specified for the PostgreSQL server.|
|`postgres`|User specified or not specified.|User specified or `256Mi` (default).|User specified or not specified.|User specified or not specified.||
|`arc-postgresql-agent`|Not specified|Not specified|Not specified|Not specified||

## Cumulative sizing

The overall size of an environment required for Azure Arc-enabled data services is primarily a function of the number and size of the database instances. The overall size can be difficult to predict ahead of time knowing that the number of instances may grow and shrink and the amount of resources that are required for each database instance can change.

The baseline size for a given Azure Arc-enabled data services environment is the size of the data controller, which requires 4 cores and 16-GB RAM. From there, add the cumulative total of cores and memory required for the database instances. SQL Managed Instance requires one pod for each instance. PostgreSQL server creates one pod for each server.

In addition to the cores and memory you request for each database instance, you should add `250m` of cores and `250Mi` of RAM for the agent containers.

### Example sizing calculation

Requirements:

- **"SQL1"**: 1 SQL managed instance with 16-GB RAM, 4 cores
- **"SQL2"**: 1 SQL managed instance with 256-GB RAM, 16 cores
- **"Postgres1"**: 1 PostgreSQL server at 12-GB RAM, 4 cores

Sizing calculations:

- The size of "SQL1" is: `1 pod * ([16Gi RAM, 4 cores] + [250Mi RAM, 250m cores])`. For the agents per pod use `16.25 Gi` RAM and 4.25 cores.
- The size of "SQL2" is: `1 pod * ([256Gi RAM, 16 cores] + [250Mi RAM, 250m cores])`. For the agents per pod use `256.25 Gi` RAM and 16.25 cores.
- The total size of SQL 1 and SQL 2 is: 
  - `(16.25 GB + 256.25 Gi) = 272.5-GB RAM`
  - `(4.25 cores + 16.25 cores) = 20.5 cores`

- The size of "Postgres1" is: `1 pod * ([12Gi RAM, 4 cores] + [250Mi RAM, 250m cores])`. For the agents per pod use `12.25 Gi` RAM and  `4.25` cores.

- The total capacity required:
  - For the database instances: 
     - 272.5-GB RAM
     - 20.5 cores 
  - For SQL:
     - 12.25-GB RAM
     - 4.25 cores 
  - For PostgreSQL server 
     - 284.75-GB RAM
     - 24.75 cores

- The total capacity required for the database instances plus the data controller is: 
  - For the database instance
    - 284.75-GB RAM
    - 24.75 cores 
  - For the data controller
    - 16-GB RAM
    - 4 cores
  - In total:
    - 300.75-GB RAM
    - 28.75 cores.

See the [storage-configuration](storage-configuration.md) article for details on storage sizing.

## Other considerations

Keep in mind that a given database instance size request for cores or RAM cannot exceed the available capacity of the Kubernetes nodes in the cluster.  For example, if the largest Kubernetes node you have in your Kubernetes cluster is 256-GB RAM and 24 cores, you can't create a database instance with a request of 512-GB RAM and 48 cores.  

Maintain at least 25% of available capacity across the Kubernetes nodes. This capacity allows Kubernetes to:

- Efficiently schedule pods to be created
- Enable elastic scaling
- Supports rolling upgrades of the Kubernetes nodes
- Facilitates longer term growth on demand

In your sizing calculations, add the resource requirements of the Kubernetes system pods and any other workloads, which may be sharing capacity with Azure Arc-enabled data services on the same Kubernetes cluster.

To maintain high availability during planned maintenance and disaster continuity, plan for at least one of the Kubernetes nodes in your cluster to be unavailable at any given point in time.  Kubernetes attempts to reschedule the pods that were running on a given node that was taken down for maintenance or due to a failure.  If there is no available capacity on the remaining nodes those pods won't be rescheduled for creation until there is available capacity again.  Be extra careful with large database instances. For example, if there is only one Kubernetes node big enough to meet the resource requirements of a large database instance and that node fails, then Kubernetes won't schedule that database instance pod onto another Kubernetes node.

Keep the [maximum limits for a Kubernetes cluster size](https://kubernetes.io/docs/setup/best-practices/cluster-large/) in mind.

Your Kubernetes administrator may have set up [resource quotas](https://kubernetes.io/docs/concepts/policy/resource-quotas/) on your namespace/project.  Keep these quotas in mind when planning your database instance sizes.
