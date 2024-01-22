---
title: Delete a SQL Server Managed Instance enabled by Azure Arc
description: Learn how to delete a SQL Server Managed Instance enabled by Azure Arc and optionally, reclaim associated Kubernetes persistent volume claims (PVCs).
ms.custom: kr2b-contr-experiment, devx-track-azurecli
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

# Delete a SQL Server Managed Instance enabled by Azure Arc

In this how-to guide, you'll find and then delete a SQL Managed Instance enabled by Azure Arc. Optionally, after deleting managed instances, you can reclaim associated Kubernetes persistent volume claims (PVCs).

1. Find existing instances:

   ```azurecli
   az sql mi-arc list --k8s-namespace <namespace> --use-k8s
   ```

   Example output:

   ```console
   Name    Replicas    ServerEndpoint    State
   ------  ----------  ----------------  -------
   demo-mi 1/1         10.240.0.4:32023  Ready
   ```

1. Delete the SQL Managed Instance, run one of the commands appropriate for your deployment type:

   1. **Indirectly connected mode**:

      ```azurecli
      az sql mi-arc delete --name <instance_name> --k8s-namespace <namespace> --use-k8s
      ```

      Example output:

      ```azurecli
      # az sql mi-arc delete --name demo-mi --k8s-namespace <namespace> --use-k8s
      Deleted demo-mi from namespace arc
      ```

   1. **Directly connected mode**:

      ```azurecli
      az sql mi-arc delete --name <instance_name> --resource-group <resource_group>
      ```

      Example output:

      ```azurecli
      # az sql mi-arc delete --name demo-mi --resource-group my-rg
      Deleted demo-mi from namespace arc
      ```

## Optional - Reclaim Kubernetes PVCs

A Persistent Volume Claim (PVC) is a request for storage by a user from a Kubernetes cluster while creating and adding storage to a SQL Managed Instance. Deleting PVCs is recommended but it isn't mandatory. However, if you don't reclaim these PVCs, you'll eventually end up with errors in your Kubernetes cluster. For example,  you might be unable to create, read, update, or delete resources from the Kubernetes API. You might not be able to run commands like `az arcdata dc export` because the controller pods were evicted from the Kubernetes nodes due to storage issues (normal Kubernetes behavior). You can see messages in the logs similar to:  

- Annotations:    microsoft.com/ignore-pod-health: true  
- Status:         Failed  
- Reason:         Evicted  
- Message:        The node was low on resource: ephemeral-storage. Container controller was using 16372Ki, which exceeds its request of 0.

By design, deleting a SQL Managed Instance doesn't remove its associated [PVCs](https://kubernetes.io/docs/concepts/storage/persistent-volumes/).  The intention is to ensure that you can access the database files in case the deletion was accidental.

1. To reclaim the PVCs, take the following steps:
   1. Find the PVCs for the server group you deleted.

      ```console
      kubectl get pvc
      ```

      In the example below, notice the PVCs for the SQL Managed Instances you deleted.

      ```console
      # kubectl get pvc -n arc

      NAME                    STATUS    VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS      AGE
      data-demo-mi-0        Bound     pvc-1030df34-4b0d-4148-8986-4e4c20660cc4   5Gi        RWO            managed-premium   13h
      logs-demo-mi-0        Bound     pvc-11836e5e-63e5-4620-a6ba-d74f7a916db4   5Gi        RWO            managed-premium   13h
      ```

   1. Delete the data and log PVCs for each of the SQL Managed Instances you deleted.
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
  
## Related content

Learn more about [Features and Capabilities of SQL Managed Instance enabled by Azure Arc](managed-instance-features.md)

[Start by creating a Data Controller](create-data-controller-indirect-cli.md)

Already created a Data Controller? [Create a SQL Managed Instance enabled by Azure Arc](create-sql-managed-instance.md)
