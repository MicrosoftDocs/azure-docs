---
title: Delete an Azure Arc-enabled PostgreSQL server
description: Delete an Azure Arc-enabled Postgres Hyperscale server group
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql
ms.custom: devx-track-azurecli
author: dhanmm
ms.author: dhmahaja
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

# Delete an Azure Arc-enabled PostgreSQL server

This document describes the steps to delete a server from your Azure Arc setup.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Delete the server

As an example, let's consider we want to delete the _postgres01_ instance from the below setup:

```azurecli
az postgres server-arc list --k8s-namespace <namespace> --use-k8s
Name        State  
----------  -------
postgres01  Ready  
```

The general format of the delete command is:
```azurecli
az postgres server-arc delete -n <server name> --k8s-namespace <namespace> --use-k8s
```
When you execute this command, you will be requested to confirm the deletion of the server. If you are using scripts to automate deletions you will need to use the --force parameter to bypass the confirmation request. For example, you would run a command like: 
```azurecli
az postgres server-arc delete -n <server name> --force --k8s-namespace <namespace> --use-k8s
```

For more details about the delete command, run:
```azurecli
az postgres server-arc delete --help 
```

### Delete the server used in this example

```azurecli
az postgres server-arc delete -n postgres01 --k8s-namespace <namespace> --use-k8s
```

## Reclaim the Kubernetes Persistent Volume Claims (PVCs)

A PersistentVolumeClaim (PVC) is a request for storage by a user from Kubernetes cluster while creating and adding storage to a PostgreSQL server. Deleting a server group does not remove its associated [PVCs](https://kubernetes.io/docs/concepts/storage/persistent-volumes/). This is by design. The intention is to help the user to access the database files in case the deletion of instance was accidental. Deleting PVCs is not mandatory. However it is recommended. If you don't reclaim these PVCs, you'll eventually end up with errors as your Kubernetes cluster will think it's running out of disk space or usage of the same PostgreSQL server name while creating new one might cause inconsistencies. 
To reclaim the PVCs, take the following steps:

### 1. List the PVCs for the server group you deleted

To list the PVCs, run this command:

```console
kubectl get pvc [-n <namespace name>]
```

It returns the list of PVCs, in particular the PVCs for the server group you deleted. For example:

```output
kubectl get pvc
NAME                                         STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
data-few7hh0k4npx9phsiobdc3hq-postgres01-0   Bound    pvc-72ccc225-dad0-4dee-8eae-ed352be847aa   5Gi        RWO            default        2d18h
data-few7hh0k4npx9phsiobdc3hq-postgres01-1   Bound    pvc-ce6f0c51-faed-45ae-9472-8cdf390deb0d   5Gi        RWO            default        2d18h
data-few7hh0k4npx9phsiobdc3hq-postgres01-2   Bound    pvc-5a863ab9-522a-45f3-889b-8084c48c32f8   5Gi        RWO            default        2d18h
data-few7hh0k4npx9phsiobdc3hq-postgres01-3   Bound    pvc-00e1ace3-1452-434f-8445-767ec39c23f2   5Gi        RWO            default        2d15h
logs-few7hh0k4npx9phsiobdc3hq-postgres01-0   Bound    pvc-8b810f4c-d72a-474a-a5d7-64ec26fa32de   5Gi        RWO            default        2d18h
logs-few7hh0k4npx9phsiobdc3hq-postgres01-1   Bound    pvc-51d1e91b-08a9-4b6b-858d-38e8e06e60f9   5Gi        RWO            default        2d18h
logs-few7hh0k4npx9phsiobdc3hq-postgres01-2   Bound    pvc-8e5ad55e-300d-4353-92d8-2e383b3fe96e   5Gi        RWO            default        2d18h
logs-few7hh0k4npx9phsiobdc3hq-postgres01-3   Bound    pvc-f9e4cb98-c943-45b0-aa07-dd5cff7ea585   5Gi        RWO            default        2d15h
```
There are 8 PVCs for this server group.

### 2. Delete each of the PVCs

Delete the data and log PVCs for the PostgreSQL server you deleted.

The general format of this command is: 

```console
kubectl delete pvc <name of pvc>  [-n <namespace name>]
```

For example:

```console
kubectl delete pvc data-few7hh0k4npx9phsiobdc3hq-postgres01-0
kubectl delete pvc data-few7hh0k4npx9phsiobdc3hq-postgres01-1
kubectl delete pvc data-few7hh0k4npx9phsiobdc3hq-postgres01-2
kubectl delete pvc data-few7hh0k4npx9phsiobdc3hq-postgres01-3
kubectl delete pvc logs-few7hh0k4npx9phsiobdc3hq-postgres01-0
kubectl delete pvc logs-few7hh0k4npx9phsiobdc3hq-postgres01-1
kubectl delete pvc logs-few7hh0k4npx9phsiobdc3hq-postgres01-2
kubectl delete pvc logs-few7hh0k4npx9phsiobdc3hq-postgres01-3
```

Each of these kubectl commands will confirm the successful deleting of the PVC. For example:

```output
persistentvolumeclaim "data-postgres01-0" deleted
```
  

>[!NOTE]
> As indicated, not deleting the PVCs might eventually get your Kubernetes cluster in a situation where it will throw errors. Some of these errors may include being unable to create, read, update, delete resources from the Kubernetes API, or being able to run commands like `az arcdata dc export` as the controller pods may be evicted from the Kubernetes nodes because of this storage issue (normal Kubernetes behavior).
>
> For example, you may see messages in the logs similar to:  
> ```output
> Annotations:    microsoft.com/ignore-pod-health: true  
> Status:         Failed  
> Reason:         Evicted  
> Message:        The node was low on resource: ephemeral-storage. Container controller was using 16372Ki, which exceeds its request of 0.
> ```
    
## Next step
Create [Azure Arc-enabled PostgreSQL server](create-postgresql-server.md)
