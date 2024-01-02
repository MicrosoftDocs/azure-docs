---
title: Back up controller database
description: Explains how to back up the controller database for Azure Arc-enabled data services
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 04/26/2023
ms.topic: how-to
---

# Back up and recover controller database

When you deploy Azure Arc data services, the Azure Arc Data Controller is one of the most critical components that is deployed. The functions of the  data controller include:

- Provision, de-provision and update resources
- Orchestrate most of the activities for SQL Managed Instance enabled by Azure Arc such as upgrades, scale out etc. 
- Capture the billing and usage information of each Arc SQL managed instance. 

In order to perform above functions, the Data controller needs to store an inventory of all the current Arc SQL managed instances, billing, usage and the current state of all these SQL managed instances. All this data is stored  in a database called `controller` within the SQL Server instance that is deployed into the `controldb-0` pod. 

This article explains how to back up the controller database.

## Back up data controller database

As part of built-in capabilities, the Data controller database `controller` is automatically backed up every 5 minutes once backups are enabled. To enable backups:

- Create a `backups-controldb` `PersistentVolumeClaim` with a storage class that supports `ReadWriteMany` access:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: backups-controldb
  namespace: <namespace>
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 15Gi
  storageClassName: <storage-class>
```

- Edit the `DataController` custom resource spec to include a `backups` storage definition:

```yaml
storage:
    backups:
      accessMode: ReadWriteMany
      className: <storage-class>
      size: 15Gi
    data:
      accessMode: ReadWriteOnce
      className: managed-premium
      size: 15Gi
    logs:
      accessMode: ReadWriteOnce
      className: managed-premium
      size: 10Gi
```

The `.bak` files for the `controller` database are stored on the `backups` volume of the `controldb` pod at `/var/opt/backups/mssql`.

## Recover controller database 

There are two types of recovery possible:

1. `controller` is corrupted and you just need to restore the database
1. the entire storage that contains the `controller` data and log files is corrupted/gone and you need to recover 

### Corrupted controller database scenario

In this scenario, all the pods are up and running, you are able to connect to the `controldb` SQL Server, and there may be a corruption with the `controller` database. You just need to restore the database from a backup.

Follow these steps to restore the controller database from a backup, if the SQL Server is still up and running on the `controldb` pod, and you are able to connect to it:

1. Verify connectivity to SQL Server pod hosting the `controller` database.

   - First, retrieve the credentials for the secret. `controller-system-secret` is the secret that holds the credentials for the `system` user account that can be used to connect to the SQL instance.
      Run the following command to retrieve the secret contents:
   
      ```console
      kubectl get secret controller-system-secret --namespace [namespace] -o yaml
      ```

      For example:

      ```console
      kubectl get secret controller-system-secret --namespace arcdataservices -o yaml
      ```

   - Decode the base64 encoded credentials. The contents of the yaml file of the secret `controller-system-secret` contain a `password` and `username`. You can use any base64 decoder tool to decode the contents of the `password`.
   - Verify connectivity: With the decoded credentials, run a command such as `SELECT @@SERVERNAME` to verify connectivity to the SQL Server.

      ```powershell
      kubectl exec controldb-0 -n <namespace> -c  mssql-server -- /opt/mssql-tools/bin/sqlcmd -S localhost -U system -P "<password>" -Q "SELECT @@SERVERNAME"
      ```
   
      ```powershell
      kubectl exec controldb-0 -n contosons -c  mssql-server -- /opt/mssql-tools/bin/sqlcmd -S localhost -U system -P "<password>" -Q "SELECT @@SERVERNAME"
      ```

1. Scale the controller ReplicaSet down to 0 replicas as follows:

   ```console
   kubectl scale --replicas=0 rs/control -n <namespace>`
   ```

   For example: 

   ```console
   kubectl scale --replicas=0 rs/control -n arcdataservices
   ```

1. Connect to the `controldb` SQL Server as `system` as described in step 1.

1. Delete the corrupted controller database using T-SQL:

   ```sql
   DROP DATABASE controller
   ```

1. Restore the database from backup - after the corrupted `controllerdb` is dropped. For example:

   ```sql
   RESTORE DATABASE test FROM DISK = '/var/opt/backups/mssql/<controller backup file>.bak'
   WITH MOVE 'controller' to '/var/opt/mssql/data/controller.mdf
   ,MOVE 'controller' to '/var/opt/mssql/data/controller_log.ldf' 
   ,RECOVERY;
   GO
   ```
 
1. Scale the controller ReplicaSet back up to 1 replica.

   ```console
   kubectl scale --replicas=1 rs/control -n <namespace>
   ```

   For example: 

   ```console
   kubectl scale --replicas=1 rs/control -n arcdataservices
   ```

### Corrupted storage scenario

In this scenario, the storage hosting the Data controller data and log files, has corruption and a new storage was provisioned and you need to restore the controller database.

Follow these steps to restore the controller database from a backup with new storage for the `controldb` StatefulSet:

1. Ensure that you have a backup of the last known good state of the `controller` database

2. Scale the controller ReplicaSet down to 0 replicas as follows:

   ```console
   kubectl scale --replicas=0 rs/control -n <namespace>
   ```

   For example:

   ```console
   kubectl scale --replicas=0 rs/control -n arcdataservices
   ``
3. Scale the `controldb` StatefulSet down to 0 replicas, as follows: 

   ```console
   kubectl scale --replicas=0 sts/controldb -n <namespace>
   ```

   For example: 

   ```console
   kubectl scale --replicas=0 sts/controldb -n arcdataservices`
   ```

4. Create a kubernetes secret named `controller-sa-secret` with the following YAML: 

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

5. Edit the `controldb` StatefulSet to include a `controller-sa-secret` volume and corresponding volume mount (`/var/run/secrets/mounts/credentials/mssql-sa-password`) in the `mssql-server` container, by using `kubectl edit sts controldb -n <namespace>` command. 

6. Create new data (`data-controldb`) and logs (`logs-controldb`) persistent volume claims for the `controldb` pod as follows: 

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

7. Scale the `controldb` StatefulSet back to 1 replica using:

   ```console
   kubectl scale --replicas=1 sts/controldb -n <namespace>
   ```

8. Connect to the `controldb` SQL server as `sa` using the password in the `controller-sa-secret` secret created earlier.

9. Create a `system` login with sysadmin role using the password in the `controller-system-secret` kubernetes secret as follows:

   ```sql
   CREATE LOGIN [system] WITH PASSWORD = '<password-from-secret>'
   ALTER SERVER ROLE sysadmin ADD MEMBER [system]
   ```

10. Restore the backup using the `RESTORE` command as follows:

   ```sql
   RESTORE DATABASE [controller] FROM DISK = N'/var/opt/backups/mssql/<controller backup file>.bak' WITH FILE = 1
   ```

11. Create a `controldb-rw-user` login using the password in the `controller-db-rw-secret` secret `CREATE LOGIN [controldb-rw-user] WITH PASSWORD = '<password-from-secret>'` and associate it with the existing `controldb-rw-user` user in the controller DB `ALTER USER [controldb-rw-user] WITH LOGIN = [controldb-rw-user]`.

12. Disable the `sa` login using TSQL - `ALTER LOGIN [sa] DISABLE`.

13. Edit the `controldb` StatefulSet to remove the `controller-sa-secret` volume and corresponding volume mount.

14. Delete the `controller-sa-secret` secret.

16. Scale the controller ReplicaSet back up to 1 replica using the `kubectl scale` command.

## Related content

[Azure Data Studio dashboards](azure-data-studio-dashboards.md)
