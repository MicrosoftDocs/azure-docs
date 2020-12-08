---
title: Delete Azure Arc data controller
description: Delete Azure Arc data controller
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# Delete Azure Arc data controller

The following article describes how to delete an Azure Arc data controller.

Before you proceed, ensure all the data services that have been create on the data controller are removed as follows:

## Log in to the data controller

Log in to the data controller that you want to delete:

```
azdata login
```

## List & delete existing data services

Run the following command to check if there are any SQL managed instances created:

```
azdata arc sql mi list
```

For each SQL managed instance from the list above, run the delete command as follows:

```
azdata arc sql mi delete -n <name>
# for example: azdata arc sql mi delete -n sqlinstance1
```

Similarly, to check for PostgreSQL Hyperscale instances, run:

```
azdata arc postgres server list
```

And, for each PostgreSQL Hyperscale instance, run the delete command as follows:
```
azdata arc postgres server delete -n <name>
# for example: azdata arc postgres server delete -n pg1
```

## Delete controller

After all the SQL managed instances and PostgreSQL Hyperscale instances have been removed, the data controller can be deleted as follows:

```
azdata arc dc delete -n <name> -ns <namespace>
# for example: azdata arc dc delete -ns arc -n arcdc
```

### Remove SCCs (Red Hat OpenShift only)

```console
oc adm policy remove-scc-from-user privileged -z default -n arc
oc adm policy remove-scc-from-user anyuid     -z default -n arc
```

### Delete Cluster level objects

In addition to the namespace scoped objects if you also want to delete the cluster level objects such as the CRDs, `clusterroles` and `clusterrolebindings` run the following commands:

```console
# Cleanup azure arc data service artifacts
#Delete CRDs
kubectl delete crd datacontrollers.arcdata.microsoft.com 
kubectl delete crd sqlmanagedinstances.sql.arcdata.microsoft.com 
kubectl delete crd postgresql-11s.arcdata.microsoft.com 
kubectl delete crd postgresql-12s.arcdata.microsoft.com
#Delete clusterrole
kubectl delete clusterrole <namespace>:cr-arc-metricsdc-reader
#For example: kubectl delete clusterrole arc:cr-arc-metricsdc-reader
#Delete rolebinding
kubectl delete clusterrolebinding <namespace>:crb-arc-metricsdc-reader
#For example: kubectl delete clusterrolebinding arc:crb-arc-metricsdc-reader
```

### Optionally, delete the Azure Arc data controller namespace


```console
kubectl delete ns <nameSpecifiedDuringCreation>
# for example: kubectl delete ns arc
```

## Next steps

[What are Azure Arc enabled data services?](overview.md)
