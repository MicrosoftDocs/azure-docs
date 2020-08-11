---
title: Scale up and down an Azure Database for PostgreSQL Hyperscale server group using CLI (azdata)
description: Scale up and down an Azure Database for PostgreSQL Hyperscale server group using CLI (azdata)
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Scenario: Scale up and down an Azure Database for PostgreSQL Hyperscale server group using CLI (azdata)

There are times when you may need to change the characteristics or the definition of a server group:

- Scale up or down the number of vCore that each of the coordinator or the worker nodes use
- Scale up or down the memory that each of the coordinator or the worker nodes use
- Resize the storage volume used for the data or the backups of the server group
This guide explains you how to scale vCore and memory. We'll explain how to resize a storage volume in a later iteration of this guide.

Scaling up or down the vCore or memory settings of your server group means you have the possibility to set a min and/or a max for each of the vCore and memory settings. If you want to configure your server group to use a specific number of vCore or a specific amount of memory you would set the min settings equal to the max settings.

## Show the current definition of the server group

Let's start by looking at the current definition of your server group and see what are the current vCore and Memory settings. Run the following command:

```terminal
azdata postgres server export -n <the name of your server group>
```

It returns the configuration of your server group. If you have created the server group with the default settings (where you do not set any particular vCore or memory value like what we guide you through in an earlier guide) you should see the definition of your server group as follows:

```terminal
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
      requests:
        memory: 256Mi
  service:
    port: 5432
    type: NodePort
  storage:
    volumeSize: 1Gi
```

## Interpret the definition of the server group

In the definition of a server group, the section that carries the settings of min/max vCore per node and min/max memory per node is the **"scheduling"** section. In that section, the max settings will be persisted in a subsection called **"limits"** and the min settings are persisted in the subsection called **"requests"**.

If you set min settings that are different from the max settings, your server group is guaranteed to be allocated the requested resources if it needs* but it will not exceed the limits you set.

The resources (vCores and memory) that will actually be used by your server group are up to the max settings and depend on the workloads and the resources available on the cluster. If you do not cap the settings with a max, your server group may use up to all the resources that the Kubernetes cluster on the Kubernetes nodes it gets scheduled on.

Those vCore and memory settings apply per nodes, coordinator node and worker nodes. At this point we do not support setting the definitions of the coordinator node and the worker nodes separately. This is an element on the road map.

In a default configuration, only the minimum memory is set to 256Mi as it is the minimum amount of memory that is recommended to run PostgreSQL Hyperscale.

> [!NOTE]
>  Setting a minimum does not mean the server group will necessarily use that minimum. It means that if the server group needs it, it is guaranteed to be allocated at least this minimum. For example, let's consider we set --minCpu 2. It does not mean that the server group will be using at least 2 vCores at all times. I instead means that the sever group may start using less than 2 vCores if it does not need them and it is guaranteed to be allocated at least 2 vCores if it needs later on. It implies that the Kubernetes cluster allocates resources to other workloads in such a way that it can allocate 2 vCores to the server group if it ever needs them._

## Scale up the server group

Now let's assume you want to scale up the definition of your server group to this:

- Min vCore = 2
- Max vCore = 4
- Min memory = 512Mb
- Max Memory = 1Gb

You would use the following command:

```terminal
azdata postgres server update -n <the name of your server group> -i --minCpu 2  --maxCpu 4  --minMemoryMb 512  --maxMemoryMb 1024
```

The command executes successfully when it shows:

```terminal
PostgreSQL server group '<the name of the workspace>.<the name of your server group>' edited.
```

## Show the scaled up definition of the server group

Now, run again the command to display the definition of the server group and verify it is set as you desire:

```terminal
azdata postgres server export -n <the name of your server group>
```

It will show the new definition of the server group:

```terminal
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

To scale down the server group you simply execute the same command but set lesser values for the settings you want to scale down.

## Getting more details about the azdata postgres server update command

As side note, if you want to know the details about how to use this edit command, run the following query:

```terminal
azdata postgres server update --help
```

## Next steps

Try out other [scenarios](https://github.com/microsoft/Azure-data-services-on-Azure-Arc/tree/master/scenarios)
