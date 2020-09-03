---
title: Scale up and down an Azure Database for PostgreSQL Hyperscale server group using CLI (azdata)
description: Scale up and down an Azure Database for PostgreSQL Hyperscale server group using CLI (azdata)
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Scale up and down an Azure Database for PostgreSQL Hyperscale server group using CLI (azdata)

There are times when you may need to change the characteristics or the definition of a server group:

- Scale up or down the number of vCore that each coordinator or worker node uses
- Scale up or down the memory that each coordinator worker node uses
- Resize the storage volume used for the data or the backups of the server group

This guide explains you how to scale vCore and memory.

Scale the vCore or memory settings of your server group up or down to set a min/max for each of the vCore and memory settings. To set a specific number for vCore or memory you would set the min settings equal to max settings.

## Show the current definition of the server group

To see what are the current vCore and Memory settings, run the following command:

```console
azdata postgres server export -n <the name of your server group>
```

This command displays the current configuration of your server group. 

```console
apiVersion: apiname.microsoft.com/v1alpha1
kind: DatabaseService
metadata:
  name: <the name of your server group>
  namespace: default
spec:
  docker:
    imagePullPolicy: Always
    imagePullSecret: mssql-pull-secret
    registry: azurearcdata.azurecr.io
    repository: azure-arc-data
  engine:
    type: Postgres
    version: 11
  monitoring:
    tina:
      dockerImageTag: image-name
      namespace: arc
  scale:
    shards: 2
  scheduling:
    resources:
      requests:
        memory: 256Mi
  service:
    port: 5432
    type: NodePort
  storage:
    volumeSize: 1Gi
```

## Interpret the definition of the server group

The **scheduling** section defines the settings of min/max vCore per node and min/max memory per node. In that section, the max settings will be persisted in a subsection called **"limits"** and the min settings are persisted in the subsection called **"requests"**.

You can set min settings that are different from the max settings. Your server group will give the requested resources it needs but it won't exceed the limits you set.

The vCore and memory resources used by the server group can be set at the max setting. This setting depends on the workloads and resources available on the cluster.  If you don't cap the settings with a max, your server group may use up to all the resources that the Kubernetes cluster on the Kubernetes nodes it gets scheduled on.

The vCore and memory settings apply per coordinator node and worker nodes. 

The default minimum memory is set to 256 MB as it is the minimum amount of memory that is recommended to run PostgreSQL Hyperscale.

> [!NOTE]
> Setting a minimum does not mean the server group will necessarily use that minimum. It means that if the server group needs it, it is guaranteed to be allocated at least this minimum. For example, let's consider we set `--minCpu 2`. It does not mean that the server group will be using at least 2 vCores at all times. I instead means that the sever group may start using less than 2 vCores if it does not need them and it is guaranteed to be allocated at least 2 vCores if it needs later on. It implies that the Kubernetes cluster allocates resources to other workloads in such a way that it can allocate 2 vCores to the server group if it ever needs them.

## Scale up the server group

Now let's assume you want to scale up the definition of your server group to:

- Min vCore = 2
- Max vCore = 4
- Min memory = 512 Mb
- Max Memory = 1 Gb

You would use the following command:

```console
azdata postgres server update -n <the name of your server group> -i --minCpu 2  --maxCpu 4  --minMemoryMb 512  --maxMemoryMb 1024
```

The command executes successfully when it shows:

```console
PostgreSQL server group '<the name of the workspace>.<the name of your server group>' edited.
```

## Show the scaled up definition of the server group

Repeat the command to display the definition of the server group and verify it's set:

```console
azdata postgres server export -n <the name of your server group>
```

It will show the new definition of the server group:

```console
apiVersion: dusky.microsoft.com/v1alpha1
kind: DatabaseService
metadata:
  name: <the name of your server group>
  namespace: default
spec:
  docker:
    imagePullPolicy: Always
    imagePullSecret: mssql-private-registry
    registry: azurearcdata.azurecr.io
    repository: azure-arc-data
  engine:
    type: Postgres
    version: 11
  monitoring:
    tina:
      dockerImageTag: private-preview-june-2020
      namespace: arc
  scale:
    shards: 2
  scheduling:
    resources:
      limits:
        cpu: '4'
        memory: 1Gi
      requests:
        cpu: '2'
        memory: 512Mi
  service:
    port: 5432
    type: NodePort
  storage:
    volumeSize: 1Gi
```

## Scale down the server group

Scale down the server group to execute the same command but set lesser values for the settings you want to scale down.

## Getting more details about the azdata postgres server update command

As side note, if you want to know the details about how to use this edit command, run the following query:

```console
azdata postgres server update --help
```

## Next steps

[Scale out your Azure Database for PostgreSQL Hyperscale server group](scale-out-postgresql-hyperscale.md)
