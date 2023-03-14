---
title: Show the configuration of an Azure Arc-enabled PostgreSQL server
titleSuffix: Azure Arc-enabled data services
description: Show the configuration of an Azure Arc-enabled PostgreSQL server
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql
author: dhanmm
ms.author: dhmahaja
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---

# Show the configuration of an Azure Arc-enabled PostgreSQL server

This article explains how to display the configuration of your server. It does so by anticipating some questions you may be asking to yourself and it answers them. At times, there may be several valid answers. This article pitches the most common or useful ones. It groups those questions by theme:

- From a Kubernetes point of view
- From an Azure Arc-enabled data services point of view

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## From a Kubernetes point of view

### What are the Postgres servers deployed and how many pods are they using?

List the Kubernetes resources of type Postgres. Run the command:

```console
kubectl get postgresqls -n <namespace>
```

The output of this command shows the list of server groups created. For each, it indicates the number of pods. For example:

```output
NAME         STATE   READY-PODS   PRIMARY-ENDPOINT     AGE
postgres01   Ready   1/1          20.101.12.221:5432   12d
```

This example shows that one server is created. It runs on one pod.

### What pods are used by Azure Arc-enabled PostgreSQL servers?

Run:

```console
kubectl get pods -n <namespace>
```

The command returns the list of pods. You will see the pods used by your servers based on the names you gave to those servers. For example:

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
postgres01-0         3/3     Running   0          2d19h
```

### What is the status of the pods?

Run `kubectl get pods -n <namespace>` and look at the column `STATUS`

### What persistent volume claims (PVCs) are being used?

To understand what PVCs are used, and which are used for data, and logs, run:

```console
kubectl get pvc -n <namespace>
```

By default, the prefix of the name of a PVC indicates its usage:

- `data-`...: is PVC used for data files
- `logs-`...: is a PVC used for transaction logs/WAL files

For example:

```output
NAME                                            STATUS   VOLUME              CAPACITY   ACCESS MODES   STORAGECLASS    AGE
data-few7hh0k4npx9phsiobdc3hq-postgres01-0      Bound    local-pv-3c1a8cc5   1938Gi     RWO            local-storage   6d6h
data-few7hh0k4npx9phsiobdc3hq-postgres01-1      Bound    local-pv-8303ab19   1938Gi     RWO            local-storage   6d6h
data-few7hh0k4npx9phsiobdc3hq-postgres01-2      Bound    local-pv-55572fe6   1938Gi     RWO            local-storage   6d6h
...
logs-few7hh0k4npx9phsiobdc3hq-postgres01-0      Bound    local-pv-5e852b76   1938Gi     RWO            local-storage   6d6h
logs-few7hh0k4npx9phsiobdc3hq-postgres01-1      Bound    local-pv-55d309a7   1938Gi     RWO            local-storage   6d6h
logs-few7hh0k4npx9phsiobdc3hq-postgres01-2      Bound    local-pv-5ccd02e6   1938Gi     RWO            local-storage   6d6h
...
```

### How much memory and vCores are being used by a server?

Use kubectl to describe Postgres resources. To do so, you need its kind (name of the Kubernetes resource (CRD) for Postgres in Azure Arc) and the name of the server group.

The general format of this command is:

```console
kubectl describe <CRD name>/<server name> -n <namespace>
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
        f:scheduling:
          .:
          f:default:
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
      f:status:
        .:
        f:lastUpdateTime:
        f:logSearchDashboard:
        f:metricsDashboard:
        f:observedGeneration:
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
  Scheduling:
    Default:
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
    Data:
      Volumes:
        Class Name:  managed-premium
        Size:        5Gi
    Logs:
      Volumes:
        Class Name:  managed-premium
        Size:        5Gi
Status:
  Last Update Time:      2021-10-22T22:37:53.000000Z
  Log Search Dashboard:  https://12.235.78.99:5601/app/kibana#/discover?_a=(query:(language:kuery,query:'custom_resource_name:postgres01'))
  Metrics Dashboard:     https://12.346.578.99:3000/d/postgres-metrics?var-Namespace=arc&var-Name=postgres01
  Observed Generation:   29
  Primary Endpoint:      20.101.12.221:5432
  Ready Pods:            1/1
  State:                 Ready
Events:                  <none>
```

#### Interpret the configuration information

Let's call out some specific points of interest in the description of the `server` shown above. What does it tell us about this server?

- It was created during on October 13 2021:

   ```output
     Metadata:
     Creation Timestamp:  2021-10-13T01:09:25Z
   ```

- Resource configuration: in this example, its guaranteed 256Mi of memory. The server can not use more that 1Gi of memory. It is guaranteed one vCore and can't consume more than two vCores.

   ```console
        Scheduling:
       Default:
         Resources:
            Limits:
              Cpu:     2
              Memory:  1Gi
            Requests:
              Cpu:     1
              Memory:  256Mi
   ```

- What's the status of the server? Is it available for my applications?

   Yes, the pods is ready

   ```console
   Ready Pods:                1/1
   ```

## From an Azure Arc-enabled data services point of view

Use  Az CLI commands.

### What are the Postgres servers deployed?

Run the following command.

   ```azurecli
   az postgres server-arc list --k8s-namespace <namespace> --use-k8s
   ```

It lists the servers that are deployed.

   ```output
   [
     {
       "name": "postgres01",
       "state": "Ready"
     }
   ]
   ```


### How much memory and vCores are being used?

Run either of the following commands

```azurecli
az postgres server-arc show -n <server name>  --k8s-namespace <namespace> --use-k8s
```

For example:

```azurecli
az postgres server-arc show -n postgres01 --k8s-namespace arc --use-k8s
```

Returns the information in a format and content similar to the one returned by kubectl. Use the tool of your choice to interact with the system.

## Next steps

- [Read about how to scale up/down (increase or reduce memory and/or vCores) a server group](scale-up-down-postgresql-server-using-cli.md)
- [Read about storage configuration](storage-configuration.md)
- [Read how to monitor a database instance](monitor-grafana-kibana.md)
- [Configure security for your Azure Arc-enabled PostgreSQL server](configure-security-postgresql.md)
