---
title: Backup controller database
description: Explains how to backup the controller database for Azure Arc-enabled data services
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 04/26/2023
ms.topic: how-to
---

# Backup and recover controller database

When you deploy Azure Arc data services, the Azure Arc Data Controller is one of the most critical components that is deployed. The functions of the  data controller include:

- Provision, de-provision and update resources
- Orchestrate most of the activities for Azure Arc-enabled SQL Managed Instance such as upgrades, scale out etc. 
- Capture the billing and usage information of each Arc SQL managed instance. 

In order to perform above functions, the Data controller needs to store an inventory of all the current Arc SQL managed instances, billing, usage and the current state of all these SQL managed instances. All this data is stored  in a database called `controller` within the SQL Server instance that is deployed into the `controldb-0` pod. 

This article explains how to back up the controller database.

## Backup of data controller database

As part of built-in capabilities, the Data controller database `controller` is automatically backed up whenever there is an update - this update includes creating, deleting or updating an existing custom resource such as an Arc SQL managed instance.

The `.bak` files for the `controller` database will be stored in the same storage class specified for the data and logs via the `--storage-class` parameter.

## Recover controller database 

There are two types of recovery possible:

1. `controllerdb` is corrupted and you just need to restore the database

1. the entire storage that contains the `controllerdb` data and log files is corrupted/gone and you need to recover 

### Restore controllerdb from backup



Follow these steps to restore the controller database from a backup, if the SQL Server is still up and running on the controldb pod, and you are able to connect to it:

1. Verify connectivity to SQL Server pod hosting the `controllerdb` database. 

- First, retrieve the credentials for the secret. `ontroller-db-rw-secret` is the secret that holds the credentials for the `controldb-rw-user` user account that can be used to connect to the SQL instance.
Run the following command to retrieve the secret contents:


```azurecli
kubectl get secret controller-db-rw-secret --namespace [namespace] -o yaml
```

For example:


```azurecli
kubectl get secret controller-db-rw-secret --namespace arcdataservices -o yaml
```

- Decode the base64 encoded credentials: The contents of the yaml file of the secret `controller-db-rw-secret` contain a `password` and `username`. You can use any base64 decoder tool to decode the contents of the `password`.

Verify connectivity: With the decoded credentials, run a command such as `SELECT @@SERVERNAME` to verify connectivity to the SQL Server.

`kubectl exec controldb-0 -n contosons -c  mssql-server -- /opt/mssql-tools/bin/sqlcmd -S localhost -U controldb-rw-user -P "<password>" -Q "SELECT @@SERVERNAME"`

For example:


```
kubectl exec controldb-0 -n contosons -c  mssql-server -- /opt/mssql-tools/bin/sqlcmd -S localhost -U controldb-rw-user -P "<password>" -Q "SELECT @@SERVERNAME"
```

1. Ensure that you have a backup of the last known good state of the controller database
1. Scale the controller ReplicaSet and the controldb StatefulSet down to 0 replicas

3. Connect to the controldb SQL Server as `system`

1. Delete the corrupted controller database

1. Restore the backup

1. Scale the controller ReplicaSet back up to 1 replica

## Next steps

[Azure Data Studio dashboards](azure-data-studio-dashboards.md)