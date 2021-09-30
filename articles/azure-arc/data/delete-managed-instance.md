---
title: Delete Azure Arc-enabled SQL Managed Instance
description: Delete Azure Arc-enabled SQL Managed Instance
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

# Delete Azure Arc-enabled SQL Managed Instance
This article describes how you can delete an Azure Arc-enabled SQL Managed Instance.


## View Existing Azure Arc-enabled SQL Managed Instances
To view SQL Managed Instances, run the following command:

```azurecli
az sql mi-arc list --k8s-namespace <namespace> --use-k8s
```

Output should look something like this:

```console
Name    Replicas    ServerEndpoint    State
------  ----------  ----------------  -------
demo-mi 1/1         10.240.0.4:32023  Ready
```

## Delete a Azure Arc-enabled SQL Managed Instance
To delete a SQL Managed Instance, run the following command:

```azurecli
az sql mi-arc delete -n <NAME_OF_INSTANCE> --k8s-namespace <namespace> --use-k8s
```

Output should look something like this:

```azurecli
# az sql mi-arc delete -n demo-mi --k8s-namespace <namespace> --use-k8s
Deleted demo-mi from namespace arc
```

## Reclaim the Kubernetes Persistent Volume Claims (PVCs)

Deleting a SQL Managed Instance does not remove its associated [PVCs](https://kubernetes.io/docs/concepts/storage/persistent-volumes/). This is by design. The intention is to help the user to access the database files in case the deletion of instance was accidental. Deleting PVCs is not mandatory. However it is recommended. If you don't reclaim these PVCs, you'll eventually end up with errors as your Kubernetes cluster will out of disk space. To reclaim the PVCs, take the following steps:

### 1. List the PVCs for the server group you deleted
To list the PVCs, run the following command:
```console
kubectl get pvc
```

In the follow example below, notice the PVCs for the SQL Managed Instances you deleted.
```console
# kubectl get pvc -n arc

NAME                    STATUS    VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS      AGE
data-demo-mi-0        Bound     pvc-1030df34-4b0d-4148-8986-4e4c20660cc4   5Gi        RWO            managed-premium   13h
logs-demo-mi-0        Bound     pvc-11836e5e-63e5-4620-a6ba-d74f7a916db4   5Gi        RWO            managed-premium   13h
```

### 2. Delete each of the PVCs
Delete the data and log PVCs for each of the SQL Managed Instances you deleted.
The general format of this command is: 
```console
kubectl delete pvc <name of pvc>
```

For example:
```console
kubectl delete pvc data-demo-mi-0 -n arc
kubectl delete pvc logs-demo-mi-0 -n arc
```

Each of these kubectl commands will confirm the successful deleting of the PVC. For example:
```console
persistentvolumeclaim "data-demo-mi-0" deleted
persistentvolumeclaim "logs-demo-mi-0" deleted
```
  

> [!NOTE]
> As indicated, not deleting the PVCs might eventually get your Kubernetes cluster in a situation where it will throw errors. Some of these errors may include being unable to create, read, update, delete resources from the Kubernetes API, or being able to run commands like `az arcdata dc export` as the controller pods may be evicted from the Kubernetes nodes because of this storage issue (normal Kubernetes behavior).
>
> For example, you may see messages in the logs similar to:  
> - Annotations:    microsoft.com/ignore-pod-health: true  
> - Status:         Failed  
> - Reason:         Evicted  
> - Message:        The node was low on resource: ephemeral-storage. Container controller was using 16372Ki, which exceeds its request of 0.

## Next steps

Learn more about [Features and Capabilities of Azure Arc-enabled SQL Managed Instance](managed-instance-features.md)

[Start by creating a Data Controller](create-data-controller.md)

Already created a Data Controller? [Create an Azure Arc-enabled SQL Managed Instance](create-sql-managed-instance.md)
