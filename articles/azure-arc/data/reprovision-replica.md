---
title: Reprovision replica
description: Explains how to rebuild a broken Azure Arc-enabled SQL Managed Instance replica.
services: sql-database
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
ms.topic: conceptual
author: MikeRayMSFT 
ms.author: mikeray
ms.reviewer: mikeray
ms.date: 10/05/2022
---

# Reprovision replica

The reprovision replica task lets you rebuild a broken sql instance replica. It is intended to be used for a replica that is failing to synchronize, perhaps due to corruption of the data on the persistent volumes (PV) for that instance, or due to some recurring SQL issue, for example.

Support for reprovisioning of a replica is provided only via `az` CLI and kube-native. There is no portal support.

## Prerequisites

Reprovisioning can only be performed on a multi-replica instance.

## Request a reprovision replica

Request provisioning [via `az` CLI](#via-az-cli) or [via `kubectl`](#via-kubectl).

### Via `az` CLI

```az
az sql mi-arc reprovision-replica -n <instance_name-replica_number> -k <namespace> --use-k8s
```

For example, for replica 2 of instance mySqlInstance in namespace arc, the command would be:

```az
az sql mi-arc reprovision-replica -n mySqlInstance-2 -k arc --use-k8s
```

This runs until completion at which point the console returns:

```az
sql-reprov-replica-mySqlInstance-2-1664217002.376132 is Ready
```

The name of the thing that is ready, is the kubernetes task. At this point you can either examine the task:

```console
kubectl describe SqlManagedInstanceReprovisionReplicaTask sql-reprov-replica-mySqlInstance-2-1664217002.376132 -n arc
```

Or delete it:

```console
kubectl delete SqlManagedInstanceReprovisionReplicaTask sql-reprov-replica-mySqlInstance-2-1664217002.376132 -n arc
```

There is an optional `--no-wait` parameter for the command. If you send the request with `--no-wait`, the output will include the name of the task to be monitored. For example:

```az
az sql mi-arc reprovision-replica -n mySqlInstance-2 -k arc --use-k8s --no-wait
Reprovisioning replica mySqlInstance-2 in namespace `arc`. Please use
`kubectl get -n arc SqlManagedInstanceReprovisionReplicaTask sql-reprov-replica-mySqlInstance-2-1664217434.531035`
to check its status or
`kubectl get -n arc SqlManagedInstanceReprovisionReplicaTask`
to view all reprovision tasks.
```

## Via kubectl

The CRD for reprovision replica is fairly simple. You can create a yaml file with this structure:

```yaml
apiVersion: tasks.sql.arcdata.microsoft.com/v1beta1
kind: SqlManagedInstanceReprovisionReplicaTask
metadata:
  name: <task name you make up>
  namespace: <namespace>
spec:
  replicaName: instance_name-replica_number
```

To use the same example as above, mySqlinstance replica 2, the payload would be:

```yaml
apiVersion: tasks.sql.arcdata.microsoft.com/v1beta1
kind: SqlManagedInstanceReprovisionReplicaTask
metadata:
  name: my-reprovision-task-mySqlInstance-2
  namespace: arc
spec:
  replicaName: mySqlInstance-2
```

Once the yaml is applied via kubectl apply, you can monitor or delete the task via kubectl:

```console
kubectl get -n arc SqlManagedInstanceReprovisionReplicaTask my-reprovision-task-mySqlInstance-2
kubectl describe -n arc SqlManagedInstanceReprovisionReplicaTask my-reprovision-task-mySqlInstance-2
kubectl delete -n arc SqlManagedInstanceReprovisionReplicaTask my-reprovision-task-mySqlInstance-2
```

## Limitations

- The task should reject attempts to reprovision the current primary replica. If the current primary is believed to be corrupted and in need of reprovisioning, the user should fail over to a different primary and then request the reprovisioning.

- Reprovisioning of multiple replicas in the same instance will serialize; the tasks will accumulate and be held in "Creating" state until the currently active task finishes *and is deleted*. There is no auto-cleanup of a completed task, so this serialization will affect the user even if they run the az command synchronously and wait for it to complete before requesting another reprovision. In all cases they will have to remove the task via kubectl before another reprovision on the same instance can run. **There is no warning about this, either in the az cli or in kubectl.**


More about that second limitation: If you have multiple requests to reprovision a replica in one instance, you may see something like this in the output from a `kubectl get SqlManagedInstanceReprovisionReplicaTask`:

```console
kubectl get SqlManagedInstanceReprovisionReplicaTask -n arc
NAME                                                     STATUS      AGE
sql-reprov-replica-c-sql-djlexlmty-1-1664217344.304601   Completed   13m
sql-reprov-replica-c-sql-kkncursza-1-1664217002.376132   Completed   19m
sql-reprov-replica-c-sql-kkncursza-1-1664217434.531035   Creating    12m
```

That last entry for replica c-sql-kkncursza-1, `sql-reprov-replica-c-sql-kkncursza-1-1664217434.531035`, will stay in status `Creating` until the completed one `sql-reprov-replica-c-sql-kkncursza-1-1664217002.376132` is removed.
