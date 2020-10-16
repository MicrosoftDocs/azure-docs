---
title: Placement of a PostgreSQL Hyperscale server group on the Kubernetes cluster nodes
description: Explains how PostgreSQL instances forming a PostgreSQL Hyperscale server group are placed on the Kubernetes cluster nodes
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# Azure Arc enabled PostgreSQL Hyperscale server group placement

In this article we are taking an example to illustrate how the PostgreSQL instances of Azure Arc enabled PostgreSQL Hyperscale server group are placed on the physical nodes of the Kubernetes cluster that hosts them. 

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Configuration

In this example we are using an Azure Kubernetes Service (AKS) cluster that has four physical nodes. 

:::image type="content" source="media/migrate-postgresql-data-into-postgresql-hyperscale-server-group/1_cluster_portal.png" alt-text="4 node AKS cluster in Azure portal":::

List the physical nodes of the Kubernetes cluster by running the command:

```console
kubectl get nodes
```

Which shows the four physical nodes inside the Kubernetes cluster:

```output
NAME                                STATUS   ROLES   AGE   VERSION
aks-agentpool-42715708-vmss000000   Ready    agent   11h   v1.17.9
aks-agentpool-42715708-vmss000001   Ready    agent   11h   v1.17.9
aks-agentpool-42715708-vmss000002   Ready    agent   11h   v1.17.9
aks-agentpool-42715708-vmss000003   Ready    agent   11h   v1.17.9
```

The architecture can be represented as:

:::image type="content" source="media/migrate-postgresql-data-into-postgresql-hyperscale-server-group/2_logical_cluster.png" alt-text="Logical representation of 4 nodes grouped in a Kubernetes cluster":::

The Kubernetes cluster hosts one Azure Arc Data Controller and one Azure Arc enabled PostgreSQL Hyperscale server group. 
This server group is constituted of three PostgreSQL instances: one coordinator and two workers.

List the pods with the command:

```console
kubectl get pods -n arc3
```
Which produces the following output:

```output
NAME                 READY   STATUS    RESTARTS   AGE
…
postgres01-0         3/3     Running   0          9h
postgres01-1         3/3     Running   0          9h
postgres01-2         3/3     Running   0          9h
```
Each of those pods host a PostgreSQL instance. Together they form the Azure Arc enabled PostgreSQL Hyperscale server group:

```output
Pod name	    Role in the server group
postgres01-0  Coordinator
postgres01-1	Worker
postgres01-2	Worker
```

## Placement
Let’s look at how Kubernetes places the pods of the server group. Describe each pod and identify on which physical node of the Kubernetes cluster they are placed. 
For example, for the Coordinator, run the following command:

```console
kubectl describe pod postgres01-0 -n arc3
```

Which produces the following output:

```output
Name:         postgres01-0
Namespace:    arc3
Priority:     0
Node:         aks-agentpool-42715708-vmss000000
Start Time:   Thu, 17 Sep 2020 00:40:33 -0700
…
```

As we run this command for each of the pods, we summarize the current placement as:

| Server group role|Server group pod|Kubernetes physical node hosting the pod |
|--|--|--|
| Worker|postgres01-1|aks-agentpool-42715708-vmss000002 |
| Worker|postgres01-2|aks-agentpool-42715708-vmss000003 |

And note also, in the description of the pods, the names of the containers that each pod hosts. For example, for the second worker, run the following command:

```console
kubectl describe pod postgres01-2 -n arc3
```

Which produces the following output:

```output
…
Node:         aks-agentpool-42715708-vmss000003/10.240.0.7
..
Containers:
  Fluentbit:
…
  Postgres:
…
  Telegraf:
…
```

Each pod that is part of the Azure Arc enabled PostgreSQL Hyperscale server group hosts the following three containers:

|Containers|Description
|----|----|
|`Fluentbit` |Data * log collector: https://fluentbit.io/
|`Postgres`|PostgreSQL instance part of the Azure Arc enabled PosgreSQL Hyperscale server group
|`Telegraf` |Metrics collector: https://www.influxdata.com/time-series-platform/telegraf/

The architecture looks like:

:::image type="content" source="media/migrate-postgresql-data-into-postgresql-hyperscale-server-group/3_pod_placement.png" alt-text="3 pods each placed on separate nodes":::

It means that, at this point, each PostgreSQL instance constituting the Azure Arc enabled PostgreSQL Hyperscale server group is hosted on specific physical host within the Kubernetes container. This is the best configuration to help get the most performance out of the Azure Arc enabled PostgreSQL Hyperscale server group as each role (coordinator and workers) uses the resources of each physical node. Those resources are not shared among several PostgreSQL roles.

## Scale out Azure Arc enabled PostgreSQL Hyperscale

Now, let’s scale out to add a third worker node to the server group and observe what happens. It will create a fourth PostgreSQL instance that will be hosted in a fourth pod.
To scale out run the command:

```console
azdata arc postgres server edit --name postgres01 --workers 3
```

That produces the following output:

```output
Updating postgres01 in namespace `arc3`
postgres01 is Ready
```

List the server groups deployed in the Azure Arc Data Controller and verify that the server group now runs with three workers. Run the command:

```console
azdata arc postgres server list
```

And observe that it did scale out from two workers to three workers:

```output
Name        State    Workers
----------  -------  ---------
postgres01  Ready    3
```

As we did earlier, observe that the server group now uses a total of four pods:

```console
kubectl get pods -n arc3
```

```output
NAME                 READY   STATUS    RESTARTS   AGE
…
postgres01-0         3/3     Running   0          11h
postgres01-1         3/3     Running   0          11h
postgres01-2         3/3     Running   0          11h
postgres01-3         3/3     Running   0          5m2s
```

And describe the new pod to identify on which of the physical nodes of the Kubernetes cluster it is hosted.
Run the command:

```console
kubectl describe pod postgres01-3 -n arc3
```

To identify the name of the hosting node:

```output
Name:         postgres01-3
Namespace:    arc3
Priority:     0
Node:         aks-agentpool-42715708-vmss000000
```

The placement of the PostgreSQL instances on the physical nodes of the cluster is now:

|Server group role|Server group pod|Kubernetes physical node hosting the pod
|-----|-----|-----
|Coordinator|postgres01-0|aks-agentpool-42715708-vmss000000
|Worker|postgres01-1|aks-agentpool-42715708-vmss000002
|Worker|postgres01-2|aks-agentpool-42715708-vmss000003
|Worker|postgres01-3|aks-agentpool-42715708-vmss000000

And notice that the pod of the new worker (postgres01-3) has been placed on the same node as the coordinator. 

The architecture looks like:

:::image type="content" source="media/migrate-postgresql-data-into-postgresql-hyperscale-server-group/4_pod_placement_.png" alt-text="Fourth pod on same node as coordinator":::

Why isn’t the new worker/pod placed on the remaining physical node of the Kubernetes cluster aks-agentpool-42715708-vmss000003?

The reason is that the last physical node of the Kubernetes cluster is actually hosting several pods that host additional components that are required to run Azure Arc enabled data services. 
Kubernetes assessed that the best candidate – at the time of scheduling – to host the additional worker is the aks-agentpool-42715708-vmss000000 physical node. 

Using the same commands as above; we see what each physical node is hosting:

|Other pods names\* |Usage|Kubernetes physical node hosting the pods
|----|----|----
|bootstrapper-jh48b|This is a service which handles incoming requests to create, edit, and delete custom resources such as SQL managed instances, PostgreSQL Hyperscale server groups, and data controllers|aks-agentpool-42715708-vmss000003
|control-gwmbs||aks-agentpool-42715708-vmss000002
|controldb-0|This is the controller data store which is used to store configuration and state for the data controller.|aks-agentpool-42715708-vmss000001
|controlwd-zzjp7|This is the controller "watch dog" service that keeps an eye on the availability of the data controller.|aks-agentpool-42715708-vmss000000
|logsdb-0|This is an Elastic Search instance that is used to store all the logs collected across all the Arc data services pods. Elasticsearch, receives data from `Fluentbit` container of each pod|aks-agentpool-42715708-vmss000003
|logsui-5fzv5|This is a Kibana instance that sits on top of the Elastic Search database to present a log analytics GUI.|aks-agentpool-42715708-vmss000003
|metricsdb-0|This is an InfluxDB instance that is used to store all the metrics collected across all the Arc data services pods. InfluxDB, receives data from the `Telegraf` container of each pod|aks-agentpool-42715708-vmss000000
|metricsdc-47d47|This is a daemonset deployed on all the Kubernetes nodes in the cluster to collect node-level metrics about the nodes.|aks-agentpool-42715708-vmss000002
|metricsdc-864kj|This is a daemonset deployed on all the Kubernetes nodes in the cluster to collect node-level metrics about the nodes.|aks-agentpool-42715708-vmss000001
|metricsdc-l8jkf|This is a daemonset deployed on all the Kubernetes nodes in the cluster to collect node-level metrics about the nodes.|aks-agentpool-42715708-vmss000003
|metricsdc-nxm4l|This is a daemonset deployed on all the Kubernetes nodes in the cluster to collect node-level metrics about the nodes.|aks-agentpool-42715708-vmss000000
|metricsui-4fb7l|This is a Grafana instance that sits on top of the InfluxDB database to present a monitoring dashboard GUI.|aks-agentpool-42715708-vmss000003
|mgmtproxy-4qppp|This is a web application proxy layer that sits in front of the Grafana and Kibana instances.|aks-agentpool-42715708-vmss000002

> \* The suffix on pod names will vary on other deployments. Also, we are listing here only the pods hosted inside the Kubernetes namespace of the Azure Arc Data Controller.

The architecture looks like:

:::image type="content" source="media/migrate-postgresql-data-into-postgresql-hyperscale-server-group/5_full_list_of_pods.png" alt-text="All pods in namespace on various nodes":::

This means that the coordinator nodes (Pod 1) of the Azure Arc enabled Postgres Hyperscale server group shares the same physical resources as the third worker node (Pod 4) of the server group. That is acceptable as the coordinator node is typically using very little resources in comparison to what a Worker node may be using. From this you may infer that you should carefully chose:
- the size of the Kubernetes cluster and the characteristics of each of its physical nodes (memory, vCore)
- the number of physical nodes inside the Kubernetes cluster
- the applications or workloads you host on the Kubernetes cluster.

The implication of hosting too many workloads on the Kubernetes cluster is throttling may happen for the Azure Arc enabled PostgreSQL Hyperscale server group. If that happens, you will not benefit so much from its capability to scale horizontally. The performance you get out of the system is not just about the placement or the physical characteristics of the physical nodes or the storage system. The performance you get is also about how you configure each of the resources running inside the Kubernetes cluster (including Azure Arc enabled PostgreSQL Hyperscale), for instance the requests and limits you set for memory and vCore. The amount of workload you can host on a given Kubernetes cluster is relative to the characteristics of the Kubernetes cluster, the nature of the workloads, the number of users, how the operations of the Kubernetes cluster are done…

## Scale out AKS

Let’s demonstrate that scaling horizontally both the AKS cluster and the Azure Arc enabled PostgreSQL Hyperscale server is a way to benefit the most from the high performance of Azure Arc enabled PostgreSQL Hyperscale.
Let’s add a fifth node to the AKS cluster:

:::row:::
    :::column:::
        Before
    :::column-end:::
    :::column:::
        After
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        :::image type="content" source="media/migrate-postgresql-data-into-postgresql-hyperscale-server-group/6_layout_before.png" alt-text="Azure portal layout before":::
    :::column-end:::
    :::column:::
        :::image type="content" source="media/migrate-postgresql-data-into-postgresql-hyperscale-server-group/7_layout_after.png" alt-text="Azure portal layout after":::
    :::column-end:::
:::row-end:::

The architecture looks like:

:::image type="content" source="media/migrate-postgresql-data-into-postgresql-hyperscale-server-group/8_logical_layout_after.png" alt-text="Logical layout on Kubernetes cluster after update":::

Let’s look at what pods of the Arc Data Controller namespace are hosted on the new AKS physical node by running the command:

```console
kubectl describe node aks-agentpool-42715708-vmss000004
```

And let’s update the representation of the architecture of our system:

:::image type="content" source="media/migrate-postgresql-data-into-postgresql-hyperscale-server-group/9_updated_list_of_pods.png" alt-text="All pods on logical diagram of cluster":::

We can observe that the new physical node of the Kubernetes cluster is hosting only the metrics pod that is necessary for Azure Arc data services. 
Note that, in this example, we are focusing only on the namespace of the Arc Data Controller, we are not representing the other pods.

## Scale out Azure Arc enabled PostgreSQL Hyperscale again

The fifth physical node is not hosting any workload yet. As we scale out the Azure Arc enabled PostgreSQL Hyperscale, Kubernetes will optimize the placement of the new PostgreSQL pod and should not collocate it on physical nodes that are already hosting more workloads. 
Run the following command to scale the Azure Arc enabled PostgreSQL Hyperscale from 3 to 4 workers. At the end of the operation, the server group will be constituted and distributed across five PostgreSQL instances, one coordinator and four workers.

```console
azdata arc postgres server edit --name postgres01 --workers 4
```

That produces the following output:

```output
Updating postgres01 in namespace `arc3`
postgres01 is Ready
```

List the server groups deployed in the Data Controller and verify the server group now runs with four workers:

```console
azdata arc postgres server list
```

And observe that it did scale out from three to four workers. 

```console
Name        State    Workers
----------  -------  ---------
postgres01  Ready    4
```

As we did earlier, observe the server group now uses four pods:

```output
kubectl get pods -n arc3

NAME                 READY   STATUS    RESTARTS   AGE
…
postgres01-0         3/3     Running   0          13h
postgres01-1         3/3     Running   0          13h
postgres01-2         3/3     Running   0          13h
postgres01-3         3/3     Running   0          179m
postgres01-4         3/3     Running   0          3m13s
```

The shape of the server group is now:

|Server group role|Server group pod
|----|-----
|Coordinator|postgres01-0
|Worker|postgres01-1
|Worker|postgres01-2
|Worker|postgres01-3
|Worker|postgres01-4

Let’s describe the postgres01-4 pod to identify in what physical node it is hosted:

```console
kubectl describe pod postgres01-4 -n arc3
```

And observe on what pods it runs:

|Server group role|Server group pod| Pod
|----|-----|------
|Coordinator|postgres01-0|aks-agentpool-42715708-vmss000000
|Worker|postgres01-1|aks-agentpool-42715708-vmss000002
|Worker|postgres01-2|aks-agentpool-42715708-vmss000003
|Worker|postgres01-3|aks-agentpool-42715708-vmss000000
|Worker|postgres01-4|aks-agentpool-42715708-vmss000004

And the architecture looks like:

:::image type="content" source="media/migrate-postgresql-data-into-postgresql-hyperscale-server-group/10_kubernetes_schedules_newest_pod.png" alt-text="Kubernetes schedules newest pod in node with lowest usage":::

Kubernetes did schedule the new PostgreSQL pod in the least loaded physical node of the Kubernetes cluster.

## Summary

To benefit the most from the scalability and the performance of scaling Azure Arc enabled server group horizontally, you should avoid resource contention inside the Kubernetes cluster:
- between the Azure Arc enabled PostgreSQL Hyperscale server group and other workloads hosted on the same Kubernetes cluster
- between all the PostgreSQL instances that constitute the Azure Arc enabled PostgreSQL Hyperscale server group

You can achieve this in several ways:
- Scale out both Kubernetes and Azure Arc enabled Postgres Hyperscale: consider scaling horizontally the Kubernetes cluster the same way you are scaling the Azure Arc enabled PostgreSQL Hyperscale server group. Add a physical node to the cluster for each worker you add to the server group.
- Scale out Azure Arc enabled Postgres Hyperscale without scaling out Kubernetes: by setting the right resource constraints (request and limits on memory and vCore) on the workloads hosted in Kubernetes (Azure Arc enabled PostgreSQL Hyperscale included), you will enable the colocation of workloads on Kubernetes and reduce the risk of resource contention. You need to make sure that the physical characteristics of the physical nodes of the Kubernetes cluster can honor the resources constraints you define. You should also ensure that equilibrium remains as the workloads evolve over time or as more workloads are added in the Kubernetes cluster.
- Use the Kubernetes mechanisms (pod selector, affinity, anti-affinity) to influence the placement of the pods.

## Next steps

[Scale out your Azure Arc enabled PostgreSQL Hyperscale server group by adding more worker nodes](scale-out-postgresql-hyperscale-server-group.md)
