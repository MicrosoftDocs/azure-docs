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

1. `controller` is corrupted and you just need to restore the database
1. the entire storage that contains the `controller` data and log files is corrupted/gone and you need to recover 

### Corrupted controller database scenario

In this scenario, all the pods are up and running, you are able to connect to the controldb SQL Server, and there may be a corruption with the `controller` database and you just need to restore the database from a backup.

Follow these steps to restore the controller database from a backup, if the SQL Server is still up and running on the controldb pod, and you are able to connect to it:

1. Verify connectivity to SQL Server pod hosting the `controller` database.
   - First, retrieve the credentials for the secret. `controller-system-secret` is the secret that holds the credentials for the `system` user account that can be used to connect to the SQL instance.
      Run the following command to retrieve the secret contents:
   
   `kubectl get secret controller-system-secret --namespace [namespace] -o yaml`
   For example:
   `kubectl get secret controller-system-secret --namespace arcdataservices -o yaml`
         - Decode the base64 encoded credentials: The contents of the yaml file of the secret `controller-system-secret` contain a `password` and `username`. You can use any base64 decoder tool to decode the contents of the `password`.
         - Verify connectivity: With the decoded credentials, run a command such as `SELECT @@SERVERNAME` to verify connectivity to the SQL Server.
         
         `kubectl exec controldb-0 -n <namespace> -c  mssql-server -- /opt/mssql-tools/bin/sqlcmd -S localhost -U system -P "<password>" -Q "SELECT @@SERVERNAME"`
         For example:
         `kubectl exec controldb-0 -n contosons -c  mssql-server -- /opt/mssql-tools/bin/sqlcmd -S localhost -U system -P "<password>" -Q "SELECT @@SERVERNAME"`
1. Scale the controller ReplicaSet down to 0 replicas as follows:
`kubectl scale --replicas=0 rs/control -n <namespace>`
For example: `kubectl scale --replicas=0 rs/control -n arcdataservices`
1. Connect to the controldb SQL Server as `system` as described in step 1.
1. Delete the corrupted controller database using T-SQL:
`DROP DATABASE controller`
1. Restore the backup - after the corrupted `controllerdb` is dropped, restore the backup as follows:
`RESTORE DATABASE test FROM DISK = '/backups/<controller backup file>.bak'`
`WITH MOVE 'controller' to '/var/opt/mssql/data/controller.mdf'  `
`,MOVE 'controller' to '/var/opt/mssql/data/controller_log.ldf'  `
`,RECOVERY;  `
`GO` 
1. Scale the controller ReplicaSet back up to 1 replica.
`kubectl scale --replicas=1 rs/control -n <namespace>`
For example: `kubectl scale --replicas=1 rs/control -n arcdataservices`

### Corrupted storage scenario

In this scenario, the storage hosting the Data controller data and log files, has corruption and a new storage was provisioned and you need to restore the controller database.

Follow these steps to restore the controller database from a backup with new storage for the controldb StatefulSet:

1. Ensure that you have a backup of the last known good state of the `controller` database

1. Scale the controller ReplicaSet down to 0 replicas as follows:

`kubectl scale --replicas=0 rs/control -n <namespace>`

For example: `kubectl scale --replicas=0 rs/control -n arcdataservices`

1. Scale the controldb StatefulSet down to 0 replicas, as follows: 

`kubectl scale --replicas=0 sts/controldb -n <namespace>`

For example: `kubectl scale --replicas=0 sts/controldb -n arcdataservices`

1. Create a kubernetes secret named `controller-sa-secret` with the following YAML: 


```yaml
   ```yml
    apiVersion: v1
    kind: Secret
    metadata:
      name: controller-sa-secret
      namespace: <namespace>
    type: Opaque
    data:
      password: <base64 encoded password>
    ```
```

1. Edit the controldb StatefulSet to include a `controller-sa-secret` volume and corresponding volume mount (/var/run/secrets/mounts/credentials/mssql-sa-password`) in the `mssql-server` container, by using `kubectl edit sts controldb -n <namespace>` command. 

1. Create new data (`data-controldb`) and logs (`logs-controldb`) persistent volume claims for the controldb pod as follows: 


```yaml
```yml
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: data-controldb
      namespace: <namespace>
    spec:
      accessModes:
        - ReadWriteOnce
      resources:
        requests:
          storage: 15Gi
      storageClassName: <storage class>
    
    ---
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: logs-controldb
      namespace: <namespace>
    spec:
      accessModes:
        - ReadWriteOnce
      resources:
        requests:
          storage: 10Gi
      storageClassName: <storage class>
    ```
```

1. Scale the controldb 

## Next steps

[Azure Data Studio dashboards](azure-data-studio-dashboards.md)