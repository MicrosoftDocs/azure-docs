---
title: Reprovision replica
description: This article explains how to rebuild a broken Azure Arc-enabled SQL Managed Instance replica. A replica may break due to storage corruption, for example. 
services: sql-database
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.topic: conceptual
author: MikeRayMSFT 
ms.author: mikeray
ms.reviewer: mikeray
ms.date: 10/05/2022
---

# Reprovision replica - Azure Arc-enabled SQL Managed Instance

This article describes how to provision a new replica to replace an existing replica in Azure Arc-enabled SQL Managed Instance.

When you reprovision a replica, you rebuild a new managed instance replica for an Azure Arc-enabled SQL Managed Instance deployment. Use this task to replace a replica that is failing to synchronize, for example, due to corruption of the data on the persistent volumes (PV) for that instance, or due to some recurring SQL issue.

You can reprovision a replica [via `az` CLI](#via-az-cli) or [via `kubectl`](#via-kubectl). You can't reprovision a replica from the Azure portal.

## Prerequisites

You can only reprovision a replica on a multi-replica instance.

## Via `az` CLI

Azure CLI `az sql mi-arc` command group includes `reprovision-replica`. To reprovision a replica, update the following example. Replace `<instance_name-replica_number>` with the instance name and replica number of the replica you want to replace. Replace `<namespace>`.

```az
az sql mi-arc reprovision-replica -n <instance_name-replica_number> -k <namespace> --use-k8s
```

For example, to reprovision replica 2 of instance `mySqlInstance` in namespace `arc`, use:

```az
az sql mi-arc reprovision-replica -n mySqlInstance-2 -k arc --use-k8s
```

The command runs until completion, at which point the console returns the name of the Kubernetes task:

```output
sql-reprov-replica-mySqlInstance-2-1664217002.376132 is Ready
```

At this point, you can either examine the task or delete it.

### Examine the task

The following example returns information about the state of the Kubernetes task:

```console
kubectl describe SqlManagedInstanceReprovisionReplicaTask sql-reprov-replica-mySqlInstance-2-1664217002.376132 -n arc
```

> [!IMPORTANT]
> After a replica is reprovisioned, you must delete the task before another reprovision can run on the same instance. For more information, see [Limitations](#limitations).

### Delete the task

The following example deletes the Kubernetes task:

```console
kubectl delete SqlManagedInstanceReprovisionReplicaTask sql-reprov-replica-mySqlInstance-2-1664217002.376132 -n arc
```

### Option parameter: `--no-wait`

There's an optional `--no-wait` parameter for the command. If you send the request with `--no-wait`, the output includes the name of the task to be monitored. For example:

```az
az sql mi-arc reprovision-replica -n mySqlInstance-2 -k arc --use-k8s --no-wait
Reprovisioning replica mySqlInstance-2 in namespace `arc`. Please use
`kubectl get -n arc SqlManagedInstanceReprovisionReplicaTask sql-reprov-replica-mySqlInstance-2-1664217434.531035`
to check its status or
`kubectl get -n arc SqlManagedInstanceReprovisionReplicaTask`
to view all reprovision tasks.
```

## Via kubectl

To reprovision with `kubectl`, create a custom resource. To create a custom resource to reprovision, you can create a .yaml file with this structure:

```yaml
apiVersion: tasks.sql.arcdata.microsoft.com/v1beta1
kind: SqlManagedInstanceReprovisionReplicaTask
metadata:
  name: <task name you make up>
  namespace: <namespace>
spec:
  replicaName: instance_name-replica_number
```

To use the same example as above, `mySqlinstance` replica 2, the payload is:

```yaml
apiVersion: tasks.sql.arcdata.microsoft.com/v1beta1
kind: SqlManagedInstanceReprovisionReplicaTask
metadata:
  name: my-reprovision-task-mySqlInstance-2
  namespace: arc
spec:
  replicaName: mySqlInstance-2
```

### Monitor or delete the task

Once the yaml is applied via kubectl apply, you can monitor or delete the task via kubectl:

```console
kubectl get -n arc SqlManagedInstanceReprovisionReplicaTask my-reprovision-task-mySqlInstance-2
kubectl describe -n arc SqlManagedInstanceReprovisionReplicaTask my-reprovision-task-mySqlInstance-2
kubectl delete -n arc SqlManagedInstanceReprovisionReplicaTask my-reprovision-task-mySqlInstance-2
```

> [!IMPORTANT]
> After a replica is reprovisioned, you must delete the task before another reprovision can run on the same instance. For more information, see [Limitations](#limitations).


## Limitations

- The task rejects attempts to reprovision the current primary replica. If the current primary replica is corrupted and in need of reprovisioning, fail over to a different replica, and then request the reprovisioning.

- Reprovisioning of multiple replicas in the same instance runs serially. The tasks queue and are held in `Creating` state until the currently active task finishes **and is deleted**. There's no auto-cleanup of a completed task, so this serialization will affect you even if you run the `az sql mi-arc reprovision-replica` command synchronously and wait for it to complete before requesting another reprovision. In all cases, you have to remove the task via `kubectl` before another reprovision on the same instance can run. 

More details about serialization of reprovision tasks: If you have multiple requests to reprovision a replica in one instance, you may see something like this in the output from a `kubectl get SqlManagedInstanceReprovisionReplicaTask`:

```console
kubectl get SqlManagedInstanceReprovisionReplicaTask -n arc
NAME                                                     STATUS      AGE
sql-reprov-replica-c-sql-djlexlmty-1-1664217344.304601   Completed   13m
sql-reprov-replica-c-sql-kkncursza-1-1664217002.376132   Completed   19m
sql-reprov-replica-c-sql-kkncursza-1-1664217434.531035   Creating    12m
```

That last entry for replica c-sql-kkncursza-1, `sql-reprov-replica-c-sql-kkncursza-1-1664217434.531035`, will stay in status `Creating` until the completed one `sql-reprov-replica-c-sql-kkncursza-1-1664217002.376132` is removed.
