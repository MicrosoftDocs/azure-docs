--- 
title: Show the configuration of an Azure Arc–enabled PostgreSQL Hyperscale server group
titleSuffix: Azure Arc–enabled data services
description: Show the configuration of an Azure Arc–enabled PostgreSQL Hyperscale server group
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

 
# Show the configuration of an Azure Arc–enabled PostgreSQL Hyperscale server group

This article explains how to display the configuration of your server group(s). It does so by anticipating some questions you may be asking to yourself and it answers them. At times there may be several valid answers. This article pitches the most common or useful ones. It groups those questions by theme:

- from a Kubernetes point of view
- from an Azure Arc–enabled data services point of view

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## From a Kubernetes point of view

### How many pods are used by Azure Arc–enabled PostgreSQL Hyperscale?

List the Kubernetes resources of type Postgres. Run the command:

```console
kubectl get postgresqls [-n <namespace name>]
```

The output of this command shows the list of server groups created. For each, it indicates the number of pods. For example:

```output
NAME                                             STATE   READY-PODS   EXTERNAL-ENDPOINT   AGE
postgresql-12.arcdata.microsoft.com/postgres01   Ready   3/3          10.0.0.4:30499      6h34m
postgresql-12.arcdata.microsoft.com/postgres02   Ready   3/3          10.0.0.4:31066      6d7h
```

This example shows that 2 server groups are created and each runs on 3 pods (1 coordinator + 2 workers). That means the server groups created in this Azure Arc Data Controller use 6 pods.

### What pods are used by Azure Arc–enabled PostgreSQL Hyperscale server groups?

Run:

```console
kubectl get pods [-n <namespace name>]
```

This returns the list of pods. You will see the pods used by your server groups based on the names you gave to those server groups. For example:

```console 
NAME                 READY   STATUS    RESTARTS   AGE
bootstrapper-vdltm   1/1     Running   0          6d8h
control-h6kc9        2/2     Running   0          6d8h
controldb-0          2/2     Running   0          6d8h
controlwd-96sbn      1/1     Running   0          6d8h
logsdb-0             1/1     Running   0          6d8h
logsui-7wkg2         1/1     Running   0          6d8h
metricsdb-0          1/1     Running   0          6d8h
metricsdc-28ffl      1/1     Running   0          6d8h
metricsui-k7qsh      1/1     Running   0          6d8h
mgmtproxy-gd84z      2/2     Running   0          6d8h
postgres01-0         3/3     Running   0          6h50m
postgres01-1         3/3     Running   0          6h50m
postgres01-2         3/3     Running   0          6h50m
postgres02-0         3/3     Running   0          22h
postgres02-1         3/3     Running   0          22h
postgres02-2         3/3     Running   0          22h
```

In this example, the six pods that host the two server groups that are created are:
- `postgres01-0`
- `postgres01-1`
- `postgres01-2`
- `postgres02-0`
- `postgres02-1`
- `postgres02-2`  

### What server group pod is used for what role the server group?

Any pod name suffixed with `-0` represents a coordinator node. Any node name suffixed by `-x` where is 1 or greater is worker node. In the above example:
- The coordinators are: `postgres01-0`, `postgres02-0`
- The workers are: `postgres01-2`, `postgres01-2`, `postgres02-1`, `postgres02-2`

### What is the status of the pods?

Run `kubectl get pods` and look at the column `STATUS`

### What persistent volume claims (PVCs) are being used? 

To understand what PVCs are used, as well as which are used for data, logs and backups, run: 

```console
kubectl get pvc [-n <namespace name>]
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


## From an Azure Arc–enabled data services point of view:

* How many server groups are created in an Arc Data Controller?
* What are their names?
* How many worker nodes do they use?
* What version of Postgres do they run?

Use either of the following commands.
- **With kubectl:**

   ```console
   kubectl get postgresqls [-n <namespace name>]
   ``` 

   For example it produces the below output where each line is a `servergroup`. The structure of the name in the below display is formed as:

   `<Name-Of-Custom-Resource-Definition>`/`<Server-Group-Name>`

   ```output
   NAME                                             STATE   READY-PODS   EXTERNAL-ENDPOINT   AGE
   postgresql-12.arcdata.microsoft.com/postgres01   Ready   3/3          10.0.0.4:30499      7h15m
   postgresql-12.arcdata.microsoft.com/postgres02   Ready   3/3          10.0.0.4:31066      6d7h
   ```

   The output above shows 2 server groups that are of Postgres version 12. If the version was Postgres 11, the name of the CRD would be postgresql-11.arcdata.microsoft.com instead.

   Each of them runs on 3 nodes/pods: 1 coordinator and 2 workers.

- **With Azure CLI (az):**

Run the following command. The output shows similar information to what kubectl shows:

   ```azurecli
   az postgres arc-server list --k8s-namespace <namespace> --use-k8s

   `output
   Name        State    Workers
   ----------  -------  ---------
   postgres01  Ready    2
   postgres02  Ready    2
   ```


### How much memory and vCores are being used and what extensions were created for a group?

Run either of the following commands

**With Kubectl:**

Use kubectl to describe a Postgres resources. To do so, you need its kind (name of the Kubernetes resource (CRD) for the corresponding Postgres version as shown above) and the name of the server group.
The general format of this command is:

```console
kubectl describe <CRD name>/<server group name> [-n <namespace name>]
```

For example:

```console
kubectl describe postgresql-12/postgres02
```

This commands shows the configuration of the server group:

```output
Name:         postgres02
Namespace:    arc
Labels:       <none>
Annotations:  <none>
API Version:  arcdata.microsoft.com/v1alpha1
Kind:         postgresql-12
Metadata:
  Creation Timestamp:  2020-08-31T21:01:07Z
  Generation:          10
  Resource Version:    569516
  Self Link:           /apis/arcdata.microsoft.com/v1alpha1/namespaces/arc/postgresql-12s/postgres02
  UID:                 8a9cd118-361b-4a2e-8a9d-5f9257bf6abb
Spec:
  Engine:
    Extensions:
      Name:  citus
      Name:  pg_stat_statements
  Scale:
    Workers:  2
  Scheduling:
    Default:
      Resources:
        Limits:
          Cpu:     4
          Memory:  1024Mi
        Requests:
          Cpu:     1
          Memory:  512Mi
  Service:
    Type:  NodePort
  Storage:
    Data:
      Class Name:  local-storage
      Size:        5Gi
    Logs:
      Class Name:  local-storage
      Size:        5Gi
Status:
  External Endpoint:  10.0.0.4:31066
  Ready Pods:         3/3
  State:              Ready
Events:               <none>
```

>[!NOTE]
>Prior to October 2020 release, `Workers` was `Shards` in the previous example. See [Release notes - Azure Arc–enabled data services (Preview)](release-notes.md) for more information.

Let's call out some specific points of interest in the description of the `servergroup` shown above. What does it tell us about this server group?

- It is of version 12 of Postgres: 
   > ```json
   > Kind:         `postgresql-12`
   > ```
- It was created during the month of August 2020:
   > ```json
   > Creation Timestamp:  `2020-08-31T21:01:07Z`
   > ```
- Two Postgres extensions were created in this server group: `citus` and `pg_stat_statements`
   > ```json
   > Engine:
   >    Extensions:
   >      Name:  `citus`
   >      Name:  `pg_stat_statements`
   > ```
- It uses two worker nodes
   > ```json
   > Scale:
   >    Workers:  `2`
   > ```
- It is guaranteed to use 1 cpu/vCore and 512MB of Ram per node. It will use more than 4 cpu/vCores and 1024MB of memory:
   > ```json
   > Scheduling:
   >    Default: 
   >      Resources:
   >        Limits:
   >          Cpu:     4
   >          Memory:  1024Mi
   >        Requests:
   >          Cpu:     1
   >          Memory:  512Mi
   > ```
 - It is available for queries and does not have any problem. All nodes are up and running:
   > ```json
   > Status:
   >  ...
   >  Ready Pods:         3/3
   >  State:              Ready
   > ```

**With Azure CLI (az):**

The general format of the command is:

```azurecli
az postgres arc-server show -n <server group name>  --k8s-namespace <namespace> --use-k8s
```

For example:

```azurecli
az postgres arc-server show -n postgres02 --k8s-namespace <namespace> --use-k8s
```

Returns the below output in a format and content very similar to the one returned by kubectl.

```console
{
  "apiVersion": "arcdata.microsoft.com/v1alpha1",
  "kind": "postgresql-12",
  "metadata": {
    "creationTimestamp": "2020-08-31T21:01:07Z",
    "generation": 10,
    "name": "postgres02",
    "namespace": "arc",
    "resourceVersion": "569516",
    "selfLink": "/apis/arcdata.microsoft.com/v1alpha1/namespaces/arc/postgresql-12s/postgres02",
    "uid": "8a9cd118-361b-4a2e-8a9d-5f9257bf6abb"
  },
  "spec": {
    "engine": {
      "extensions": [
        {
          "name": "citus"
        },
        {
          "name": "pg_stat_statements"
        }
      ]
    },
    "scale": {
      "workers": 2
    },
    "scheduling": {
      "default": {
        "resources": {
          "limits": {
            "cpu": "4",
            "memory": "1024Mi"
          },
          "requests": {
            "cpu": "1",
            "memory": "512Mi"
          }
        }
      }
    },
    "service": {
      "type": "NodePort"
    },
    "storage": {
      "data": {
        "className": "local-storage",
        "size": "5Gi"
      },
      "logs": {
        "className": "local-storage",
        "size": "5Gi"
      }
    }
  },
  "status": {
    "externalEndpoint": "10.0.0.4:31066",
    "readyPods": "3/3",
    "state": "Ready"
  }
}
```

## Next steps
- [Read about the concepts of Azure Arc–enabled PostgreSQL Hyperscale](concepts-distributed-postgres-hyperscale.md)
- [Read about how to scale out (add worker nodes) a server group](scale-out-in-postgresql-hyperscale-server-group.md)
- [Read about how to scale up/down (increase or reduce memory and/or vCores) a server group](scale-up-down-postgresql-hyperscale-server-group-using-cli.md)
- [Read about storage configuration](storage-configuration.md)
- [Read how to monitor a database instance](monitor-grafana-kibana.md)
- [Use PostgreSQL extensions in your Azure Arc–enabled PostgreSQL Hyperscale server group](using-extensions-in-postgresql-hyperscale-server-group.md)
- [Configure security for your Azure Arc–enabled PostgreSQL Hyperscale server group](configure-security-postgres-hyperscale.md)
