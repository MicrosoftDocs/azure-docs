---
title: Show the configuration of an Azure Arc-enabled PostgreSQL Hyperscale server group
titleSuffix: Azure Arc-enabled data services
description: Show the configuration of an Azure Arc-enabled PostgreSQL Hyperscale server group
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql
author: grrlgeek
ms.author: jeschult
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---

# Show the configuration of an Azure Arc-enabled PostgreSQL Hyperscale server group

This article explains how to display the configuration of your server group(s). It does so by anticipating some questions you may be asking to yourself and it answers them. At times, there may be several valid answers. This article pitches the most common or useful ones. It groups those questions by theme:

- From a Kubernetes point of view
- From an Azure Arc-enabled data services point of view

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## From a Kubernetes point of view

### What are the Postgres server groups deployed and how many pods are they using?

List the Kubernetes resources of type Postgres. Run the command:

```console
kubectl get postgresqls -n <namespace>
```

The output of this command shows the list of server groups created. For each, it indicates the number of pods. For example:

```output
NAME         STATE   READY-PODS   PRIMARY-ENDPOINT     AGE
postgres01   Ready   5/5          20.101.12.221:5432   12d
```

This example shows that one server group is created. It runs on five pods: one coordinator and four workers.

### What pods are used by Azure Arc-enabled PostgreSQL Hyperscale server groups?

Run:

```console
kubectl get pods -n <namespace>
```

The command returns the list of pods. You will see the pods used by your server groups based on the names you gave to those server groups. For example:

```console
NAME                 READY   STATUS    RESTARTS   AGE
bootstrapper-4jrtl   1/1     Running   0          12d
control-kz8gh        2/2     Running   0          12d
controldb-0          2/2     Running   0          12d
logsdb-0             3/3     Running   0          12d
logsui-qjkgz         3/3     Running   0          12d
metricsdb-0          2/2     Running   0          12d
metricsdc-4jslw      2/2     Running   0          12d
metricsdc-4tl2g      2/2     Running   0          12d
metricsdc-fkxv2      2/2     Running   0          12d
metricsdc-hs4h5      2/2     Running   0          12d
metricsdc-tvz22      2/2     Running   0          12d
metricsui-7pcch      2/2     Running   0          12d
postgres01c0-0       3/3     Running   0          2d19h
postgres01w0-0       3/3     Running   0          2d19h
postgres01w0-1       3/3     Running   0          2d19h
postgres01w0-2       3/3     Running   0          2d19h
postgres01w0-3       3/3     Running   0          2d19h
```

### What pod is used for what role in the server group?

Any pod name suffixed with `c` represents a coordinator node. Any node name suffixed by `w`  is worker node, such as the five pods that host the server group:

- `postgres01c0-0` the coordinator node
- `postgres01w0-0` a worker node
- `postgres01w0-1` a worker node
- `postgres01w0-2` a worker node
- `postgres01w0-3` a worker node

You may ignore for now the character `0` displayed after `c` and `w` (ServerGroupName`c0`-x or ServerGroupName`w0`-x). It will be a notation used when the product will offer high availability experiences.

### What is the status of the pods?

Run `kubectl get pods -n <namespace>` and look at the column `STATUS`

### What persistent volume claims (PVCs) are being used?

To understand what PVCs are used, and which are used for data, logs, and backups, run:

```console
kubectl get pvc -n <namespace>
```

By default, the prefix of the name of a PVC indicates its usage:

- `backups-`...: is a PVC used for backups
- `data-`...: is PVC used for data files
- `logs-`...: is a PVC used for transaction logs/WAL files

For example:

```output
NAME                                            STATUS   VOLUME              CAPACITY   ACCESS MODES   STORAGECLASS    AGE
backups-few7hh0k4npx9phsiobdc3hq-postgres01-0   Bound    local-pv-485e37db   1938Gi     RWO            local-storage   6d6h
backups-few7hh0k4npx9phsiobdc3hq-postgres01-1   Bound    local-pv-9d3d4a15   1938Gi     RWO            local-storage   6d6h
backups-few7hh0k4npx9phsiobdc3hq-postgres01-2   Bound    local-pv-7b8dd819   1938Gi     RWO            local-storage   6d6h
...
data-few7hh0k4npx9phsiobdc3hq-postgres01-0      Bound    local-pv-3c1a8cc5   1938Gi     RWO            local-storage   6d6h
data-few7hh0k4npx9phsiobdc3hq-postgres01-1      Bound    local-pv-8303ab19   1938Gi     RWO            local-storage   6d6h
data-few7hh0k4npx9phsiobdc3hq-postgres01-2      Bound    local-pv-55572fe6   1938Gi     RWO            local-storage   6d6h
...
logs-few7hh0k4npx9phsiobdc3hq-postgres01-0      Bound    local-pv-5e852b76   1938Gi     RWO            local-storage   6d6h
logs-few7hh0k4npx9phsiobdc3hq-postgres01-1      Bound    local-pv-55d309a7   1938Gi     RWO            local-storage   6d6h
logs-few7hh0k4npx9phsiobdc3hq-postgres01-2      Bound    local-pv-5ccd02e6   1938Gi     RWO            local-storage   6d6h
...
```

### How much memory and vCores are being used and what extensions were created for a server group?

Use kubectl to describe Postgres resources. To do so, you need its kind (name of the Kubernetes resource (CRD) for Postgres in Azure Arc) and the name of the server group.

The general format of this command is:

```console
kubectl describe <CRD name>/<server group name> -n <namespace>
```

For example:

```console
kubectl describe postgresql/postgres01 -n arc
```

This command shows the configuration of the server group:

```output
Name:         postgres01
Namespace:    arc
Labels:       <none>
Annotations:  <none>
API Version:  arcdata.microsoft.com/v1beta2
Kind:         PostgreSql
Metadata:
  Creation Timestamp:  2021-10-13T01:09:25Z
  Generation:          29
  Managed Fields:
    API Version:  arcdata.microsoft.com/v1beta2
    Fields Type:  FieldsV1
    fieldsV1:
      f:spec:
        .:
        f:dev:
        f:engine:
          .:
          f:extensions:
          f:version:
        f:scale:
          .:
          f:replicas:
          f:workers:
        f:scheduling:
          .:
          f:default:
            .:
            f:resources:
              .:
              f:requests:
                .:
                f:memory:
          f:roles:
            .:
            f:coordinator:
              .:
              f:resources:
                .:
                f:limits:
                  .:
                  f:cpu:
                  f:memory:
                f:requests:
                  .:
                  f:cpu:
                  f:memory:
            f:worker:
              .:
              f:resources:
                .:
                f:limits:
                  .:
                  f:cpu:
                  f:memory:
                f:requests:
                  .:
                  f:cpu:
                  f:memory:
        f:services:
          .:
          f:primary:
            .:
            f:port:
            f:type:
        f:storage:
          .:
          f:backups:
            .:
            f:volumes:
          f:data:
            .:
            f:volumes:
          f:logs:
            .:
            f:volumes:
    Manager:      OpenAPI-Generator
    Operation:    Update
    Time:         2021-10-22T22:37:51Z
    API Version:  arcdata.microsoft.com/v1beta2
    Fields Type:  FieldsV1
    fieldsV1:
      f:IsValid:
      f:spec:
        f:scale:
          f:syncReplicas:
      f:status:
        .:
        f:logSearchDashboard:
        f:metricsDashboard:
        f:observedGeneration:
        f:podsStatus:
        f:primaryEndpoint:
        f:readyPods:
        f:state:
    Manager:         unknown
    Operation:       Update
    Time:            2021-10-22T22:37:53Z
  Resource Version:  1541521
  UID:               23565e53-2e7a-4cd6-8f80-3a79397e1d7a
Spec:
  Dev:  false
  Engine:
    Extensions:
      Name:   citus
    Version:  12
  Scale:
    Replicas:       1
    Sync Replicas:  0
    Workers:        4
  Scheduling:
    Default:
      Resources:
        Requests:
          Memory:  256Mi
    Roles:
      Coordinator:
        Resources:
          Limits:
            Cpu:     2
            Memory:  1Gi
          Requests:
            Cpu:     1
            Memory:  256Mi
      Worker:
        Resources:
          Limits:
            Cpu:     2
            Memory:  1Gi
          Requests:
            Cpu:     1
            Memory:  256Mi
  Services:
    Primary:
      Port:  5432
      Type:  LoadBalancer
  Storage:
    Backups:
      Volumes:
        Size:  5Gi
    Data:
      Volumes:
        Class Name:  managed-premium
        Size:        5Gi
    Logs:
      Volumes:
        Class Name:  managed-premium
        Size:        5Gi
Status:
  Log Search Dashboard:  https://12.235.78.99:5601/app/kibana#/discover?_a=(query:(language:kuery,query:'custom_resource_name:postgres01'))
  Metrics Dashboard:     https://12.346.578.99:3000/d/postgres-metrics?var-Namespace=arc&var-Name=postgres01
  Observed Generation:   29
  Pods Status:
    Conditions:
      Last Transition Time:  2021-10-22T22:37:53.000000Z
      Status:                True
      Type:                  Initialized
      Last Transition Time:  2021-10-22T22:40:55.000000Z
      Status:                True
      Type:                  Ready
      Last Transition Time:  2021-10-22T22:40:55.000000Z
      Status:                True
      Type:                  ContainersReady
      Last Transition Time:  2021-10-22T22:37:53.000000Z
      Status:                True
      Type:                  PodScheduled
    Name:                    postgres01w0-1
    Role:                    worker
    Conditions:
      Last Transition Time:  2021-10-22T22:37:53.000000Z
      Status:                True
      Type:                  Initialized
      Last Transition Time:  2021-10-22T22:42:41.000000Z
      Status:                True
      Type:                  Ready
      Last Transition Time:  2021-10-22T22:42:41.000000Z
      Status:                True
      Type:                  ContainersReady
      Last Transition Time:  2021-10-22T22:37:53.000000Z
      Status:                True
      Type:                  PodScheduled
    Name:                    postgres01c0-0
    Role:                    coordinator
    Conditions:
      Last Transition Time:  2021-10-22T22:37:54.000000Z
      Status:                True
      Type:                  Initialized
      Last Transition Time:  2021-10-22T22:40:52.000000Z
      Status:                True
      Type:                  Ready
      Last Transition Time:  2021-10-22T22:40:52.000000Z
      Status:                True
      Type:                  ContainersReady
      Last Transition Time:  2021-10-22T22:37:54.000000Z
      Status:                True
      Type:                  PodScheduled
    Name:                    postgres01w0-3
    Role:                    worker
    Conditions:
      Last Transition Time:  2021-10-22T22:37:53.000000Z
      Status:                True
      Type:                  Initialized
      Last Transition Time:  2021-10-22T22:38:35.000000Z
      Status:                True
      Type:                  Ready
      Last Transition Time:  2021-10-22T22:38:35.000000Z
      Status:                True
      Type:                  ContainersReady
      Last Transition Time:  2021-10-22T22:37:53.000000Z
      Status:                True
      Type:                  PodScheduled
    Name:                    postgres01w0-0
    Role:                    worker
    Conditions:
      Last Transition Time:  2021-10-22T22:37:53.000000Z
      Status:                True
      Type:                  Initialized
      Last Transition Time:  2021-10-22T22:42:40.000000Z
      Status:                True
      Type:                  Ready
      Last Transition Time:  2021-10-22T22:42:40.000000Z
      Status:                True
      Type:                  ContainersReady
      Last Transition Time:  2021-10-22T22:37:53.000000Z
      Status:                True
      Type:                  PodScheduled
    Name:                    postgres01w0-2
    Role:                    worker
  Primary Endpoint:          20.101.12.221:5432
  Ready Pods:                5/5
  Running Version:           v1.1.0_2021-10-12_patching_0bcb7bcaf
  State:                     Ready
Events:                      <none>
```

#### Interpret the configuration information

Let's call out some specific points of interest in the description of the `servergroup` shown above. What does it tell us about this server group?

- It is of version 12 of Postgres and runs the Citus extension:

   ```output
   Spec:
     Dev:  false
     Engine:
       Extensions:
         Name:   citus
       Version:  12
   ```

- It was created during on October 13 2021:

   ```output
     Metadata:
     Creation Timestamp:  2021-10-13T01:09:25Z
   ```

- It uses four worker nodes:

   ```output
        Scale:
          Replicas:       1
          Sync Replicas:  0
          Workers:        4
   ```

- Resource configuration: in this example, its coordinator and workers are guaranteed 256Mi of memory. The coordinator and the worker nodes can not use more that 1Gi of memory. Both the coordinator and the workers are guaranteed one vCore and can't consume more than two vCores.

   ```console
        Scheduling:
       Default:
         Resources:
           Requests:
             Memory:  256Mi
       Roles:
         Coordinator:
           Resources:
             Limits:
               Cpu:     2
               Memory:  1Gi
             Requests:
               Cpu:     1
               Memory:  256Mi
         Worker:
           Resources:
             Limits:
               Cpu:     2
               Memory:  1Gi
             Requests:
               Cpu:     1
               Memory:  256Mi
   ```

- What's the status of the server group? Is it available for my applications?

   Yes, all pods (coordinator node and all four workers nodes are ready)

   ```console
   Ready Pods:                5/5
   ```

## From an Azure Arc-enabled data services point of view

Use  Az CLI commands.

### What are the Postgres server groups deployed and how many workers are they using?

Run the following command.

   ```azurecli
   az postgres arc-server list --k8s-namespace <namespace> --use-k8s
   ```

It lists the server groups that are deployed.

   ```output
   [
     {
       "name": "postgres01",
       "replicas": 1,
       "state": "Ready",
       "workers": 4
     }
   ]
   ```

It also indicates how many worker nodes does the server group use. Each worker node is deployed on one pod to which you need to add one pod used to host the coordinator node.

### How much memory and vCores are being used and what extensions were created for a group?

Run either of the following commands

```azurecli
az postgres arc-server show -n <server group name>  --k8s-namespace <namespace> --use-k8s
```

For example:

```azurecli
az postgres arc-server show -n postgres01 --k8s-namespace arc --use-k8s
```

Returns the information in a format and content similar to the one returned by kubectl. Use the tool of your choice to interact with the system.

## Next steps

- [Read about the concepts of Azure Arc-enabled PostgreSQL Hyperscale](concepts-distributed-postgres-hyperscale.md)
- [Read about how to scale out (add worker nodes) a server group](scale-out-in-postgresql-hyperscale-server-group.md)
- [Read about how to scale up/down (increase or reduce memory and/or vCores) a server group](scale-up-down-postgresql-hyperscale-server-group-using-cli.md)
- [Read about storage configuration](storage-configuration.md)
- [Read how to monitor a database instance](monitor-grafana-kibana.md)
- [Use PostgreSQL extensions in your Azure Arc-enabled PostgreSQL Hyperscale server group](using-extensions-in-postgresql-hyperscale-server-group.md)
- [Configure security for your Azure Arc-enabled PostgreSQL Hyperscale server group](configure-security-postgres-hyperscale.md)
