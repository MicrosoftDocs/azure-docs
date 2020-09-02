---
title: Delete a PostgreSQL instance
description: Delete a PostgreSQL instance
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Scenario: Delete a PostgreSQL instance

This document describes the steps to delete an Azure PostgreSQL instance from your Azure Arc setup, whether that instance is a single node instance or a Hyperscale server group.

## Delete the instance

Example:
Let's consider we want to delete the postgres01 instance from the below setup:

```console
azdata arc postgres server list
Name        State    Workers
----------  -------  ---------
postgres01  Ready    3
```

Before we delete, and in anticipation of the next step below, let's look at the [Persistent Volume Claims of our Kubernetes cluster](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) (PVC):

```console
kubectl get pvc
NAME                STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
data-postgres01-0   Bound    pvc-72ccc225-dad0-4dee-8eae-ed352be847aa   5Gi        RWO            default        2d18h
data-postgres01-1   Bound    pvc-ce6f0c51-faed-45ae-9472-8cdf390deb0d   5Gi        RWO            default        2d18h
data-postgres01-2   Bound    pvc-5a863ab9-522a-45f3-889b-8084c48c32f8   5Gi        RWO            default        2d18h
data-postgres01-3   Bound    pvc-00e1ace3-1452-434f-8445-767ec39c23f2   5Gi        RWO            default        2d15h
logs-postgres01-0   Bound    pvc-8b810f4c-d72a-474a-a5d7-64ec26fa32de   5Gi        RWO            default        2d18h
logs-postgres01-1   Bound    pvc-51d1e91b-08a9-4b6b-858d-38e8e06e60f9   5Gi        RWO            default        2d18h
logs-postgres01-2   Bound    pvc-8e5ad55e-300d-4353-92d8-2e383b3fe96e   5Gi        RWO            default        2d18h
logs-postgres01-3   Bound    pvc-f9e4cb98-c943-45b0-aa07-dd5cff7ea585   5Gi        RWO            default        2d15h
```

There are a total of 8 PVCs for this instance.

Now, let's delete this instance.

```console
azdata arc postgres server delete -n postgres01
```

## Reclaim the Kubernetes Persistent Volume Claims (PVCs)

Deleting a Postgres instance does not remove its associated PVCs.

```console
kubectl get pvc

NAME                STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
data-postgres01-0   Bound    pvc-72ccc225-dad0-4dee-8eae-ed352be847aa   5Gi        RWO            default        2d19h
data-postgres01-1   Bound    pvc-ce6f0c51-faed-45ae-9472-8cdf390deb0d   5Gi        RWO            default        2d19h
data-postgres01-2   Bound    pvc-5a863ab9-522a-45f3-889b-8084c48c32f8   5Gi        RWO            default        2d19h
data-postgres01-3   Bound    pvc-00e1ace3-1452-434f-8445-767ec39c23f2   5Gi        RWO            default        2d15h
logs-postgres01-0   Bound    pvc-8b810f4c-d72a-474a-a5d7-64ec26fa32de   5Gi        RWO            default        2d19h
logs-postgres01-1   Bound    pvc-51d1e91b-08a9-4b6b-858d-38e8e06e60f9   5Gi        RWO            default        2d19h
logs-postgres01-2   Bound    pvc-8e5ad55e-300d-4353-92d8-2e383b3fe96e   5Gi        RWO            default        2d19h
logs-postgres01-3   Bound    pvc-f9e4cb98-c943-45b0-aa07-dd5cff7ea585   5Gi        RWO            default        2d15h
```

If you don't reclaim these PVCs, you'll eventually end up with errors as your Kubernetes cluster will think it's running out of disk space.

>[!NOTE] 
> Some of these errors may include being unable to login to your cluster with azdata as the pods may be evicted from the Kubernetes cluster (normal Kubernetes behavior).

You may see messages similar to the one below in the logs:  
    Annotations:    microsoft.com/ignore-pod-health: true  
    Status:         Failed  
    Reason:         Evicted  
    Message:        The node was low on resource: ephemeral-storage. Container controller was using 16372Ki, which exceeds its request of 0.  

So, to reclaim the PVCs, run the following command for each PVC

```console
kubectl delete pvc -n <name of pvc>
```

> [!NOTE]
> Deleting an instance and/or its PVCs does not delete the database file on the persistent volumes. This is by design.

The intention is to help users access the database files in case the deletion of instance was accidental.
