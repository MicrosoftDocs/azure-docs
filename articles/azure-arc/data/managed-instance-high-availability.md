---
title: Azure Arc enabled Managed Instance high availability
titleSuffix: Deploy Azure Arc enabled Managed Instance with high availability 
description: Learn how to deploy Azure Arc enabled Managed Instance with high availability.
author: vin-yu
ms.author: vinsonyu
ms.reviewer: mikeray
ms.date: 03/02/2021
ms.topic: conceptual
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
---

# Azure Arc enabled Managed Instance high availability

Azure Arc enabled Managed Instance is deployed on Kubernetes as a containerized application and uses kubernetes constructs such as stateful sets and persistent storage to provide built-in health monitoring, failure detection, and failover mechanisms to maintain service health. For increased reliability, you can also configure Azure Arc enabled Managed Instance to deploy with extra replicas in a high availability configuration. Monitoring, failure detection, and automatic failover are managed by the Arc data services data controller. This service is provided without user intervention – all from availability group setup, configuring database mirroring endpoints, to adding databases to the availability group or failover and upgrade coordination. This document explores both types of high availability.

## Built-in high availability 

Built-in high availability is provided by Kubernetes when remote persistent storage is configured and shared with nodes used by the Arc data service deployment. In this configuration, Kubernetes plays the role of the cluster orchestrator. When the managed instance in a container or the underlying node fails, the orchestrator bootstraps another instance of the container and attaches to the same persistent storage. This type is enabled by default when you deploy Azure Arc enabled Managed Instance.

### Verify built-in high availability

This section, you verify the built-in high availability provided by Kubernetes. When you follow the steps to test out this functionality, you delete the pod of an existing managed instance and verify that Kubernetes recovers from this action. 

### Prerequisites

- Kubernetes cluster must have [shared, remote storage](storage-configuration.md#factors-to-consider-when-choosing-your-storage-configuration) 
- An Azure Arc enabled Managed Instance deployed with one replica (default)

1. View the pods. 

   ```console
   kubectl get pods -n <namespace of data controller>
   ```

2. Delete the managed instance pod.

   ```console
   kubectl delete pod <name of managed instance>-0 -n <namespace of data controller>
   ```

   For example

   ```output
   user@pc:/# kubectl delete pod sql1-0 -n arc
   pod "sql1-0" deleted
   ```

3. View the pods to verify that the managed instance is recovering.

   ```console
   kubectl get pods -n <namespace of data controller>
   ```

   For example

   ```output
   user@pc:/# kubectl get pods -n arc
   NAME                 READY   STATUS    RESTARTS   AGE
   sql1-0               2/3     Running   0          22s
   ```

After all containers within the pod have recovered, you can connect to the managed instance.

## Deploy with Always On availability groups

For increased reliability, you can configure Azure Arc enabled Managed Instance to deploy with extra replicas in a high availability configuration. 

Capabilities that availability groups enable:

- When deployed with multiple replicas, a single availability group named `containedag` is created. By default, `containedag` has three replicas, including primary. All CRUD operations for the availability group are managed internally, including creating the availability group or joining replicas to the availability group created. Additional availability groups cannot be created in the Azure Arc enabled Managed Instance.

- All databases are automatically added to the availability group, including all user and system databases like `master` and `msdb`. This capability provides a single-system view across the availability group replicas. Notice both `containedag_master` and `containedag_msdb` databases if you connect directly to the instance. The `containedag_*` databases represent the `master` and `msdb` inside the availability group.

- An external endpoint is automatically provisioned for connecting to databases within the availability group. This endpoint `<managed_instance_name>-svc-external` plays the role of the availability group listener.

### Deploy

To deploy a managed instance with availability groups, run the following command.

```console
azdata arc sql mi create -n <name of instance> --replicas 3
```

### Check status
Once the instance has been deployed, run the following commands to check the status of your instance:

```console
azdata arc sql mi list
azdata arc sql mi show -n <name of instance>
```

Example output:

```output
user@pc:/# azdata arc sql mi list
ExternalEndpoint    Name    Replicas    State
------------------  ------  ----------  -------
20.131.31.58,1433   sql2    3/3         Ready

user@pc:/#  azdata arc sql mi show -n sql2
{
...
  "status": {
    "AGStatus": "Healthy",
    "externalEndpoint": "20.131.31.58,1433",
    "logSearchDashboard": "link to logs dashboard",
    "metricsDashboard": "link to metrics dashboard",
    "readyReplicas": "3/3",
    "state": "Ready"
  }
}
```

Notice the additional number of `Replicas` and the `AGstatus` field indicating the health of the availability group. If all replicas are up and synchronized, then this value is `healthy`. 

### Restore a database 
Additional steps are required to restore a database into an availability group. The following steps demonstrate how to restore a database into a managed instance and add it to an availability group. 

1. Expose the primary instance external endpoint by creating a new Kubernetes service.

    Determine the pod that hosts the primary replica by connecting to the managed instance and run:

    ```sql
    SELECT @@SERVERNAME
    ```
    Create the kubernetes service to the primary instance by running the command below if your kubernetes cluster uses nodePort services. Replace `podName` with the name of the server returned at previous step, `serviceName` with the preferred name for the Kubernetes service created.

    ```bash
    kubectl -n <namespaceName> expose pod <podName> --port=1533  --name=<serviceName> --type=NodePort
    ```

    For a LoadBalancer service, run the same command, except that the type of the service created is `LoadBalancer`. For example: 

    ```bash
    kubectl -n <namespaceName> expose pod <podName> --port=1533  --name=<serviceName> --type=LoadBalancer
    ```

    Here is an example of this command run against Azure Kubernetes Service, where the pod hosting the primary is `sql2-0`:

    ```bash
    kubectl -n arc-cluster expose pod sql2-0 --port=1533  --name=sql2-0-p --type=LoadBalancer
    ```

    Get the IP of the Kubernetes service created:

    ```bash
    kubectl get services -n <namespaceName>
    ```
2. Restore the database to the primary instance endpoint.

    Add the database backup file into the primary instance container.

    ```console
    kubectl cp <source file location> <pod name>:var/opt/mssql/data/<file name> -n <namespace name>
    ```

    Example

    ```console
    kubectl cp /home/WideWorldImporters-Full.bak sql2-1:var/opt/mssql/data/WideWorldImporters-Full.bak -c arc-sqlmi -n arc
    ```

    Restore the database backup file by running the command below.

    ```sql 
    RESTORE DATABASE test FROM DISK = '/var/opt/mssql/data/<file name>.bak'
    WITH MOVE '<database name>' to '/var/opt/mssql/data/<file name>.mdf'  
    ,MOVE '<database name>' to '/var/opt/mssql/data/<file name>_log.ldf'  
    ,RECOVERY, REPLACE, STATS = 5;  
    GO
    ```
    
    Example

    ```sql
    RESTORE Database WideWorldImporters
    FROM DISK = '/var/opt/mssql/data/WideWorldImporters-Full.BAK'
    WITH
    MOVE 'WWI_Primary' TO '/var/opt/mssql/data/WideWorldImporters.mdf',
    MOVE 'WWI_UserData' TO '/var/opt/mssql/data/WideWorldImporters_UserData.ndf',
    MOVE 'WWI_Log' TO '/var/opt/mssql/data/WideWorldImporters.ldf',
    MOVE 'WWI_InMemory_Data_1' TO '/var/opt/mssql/data/WideWorldImporters_InMemory_Data_1',
    RECOVERY, REPLACE, STATS = 5;  
    GO
    ```

3. Add the database to the availability group.

    For the database to be added to the AG, it must run in full recovery mode and a log backup has to be taken. Run the TSQL statements below to add the restored database into the availability group.

    ```sql
    ALTER DATABASE <databaseName> SET RECOVERY FULL;
    BACKUP DATABASE <databaseName> TO DISK='<filePath>'
    ALTER AVAILABILITY GROUP containedag ADD DATABASE <databaseName>
    ```

    The following example adds a database named `WideWorldImporters` that was restored on the instance:

    ```sql
    ALTER DATABASE WideWorldImporters SET RECOVERY FULL;
    BACKUP DATABASE WideWorldImporters TO DISK='/var/opt/mssql/data/WideWorldImporters.bak'
    ALTER AVAILABILITY GROUP containedag ADD DATABASE WideWorldImporters
    ```

> [!IMPORTANT]
> As a best practice, you should cleanup by deleting the Kubernetes service created above by running this command:
>
>```bash
>kubectl delete svc sql2-0-p -n arc
>```

### Limitations

Azure Arc enabled Managed Instance availability groups has the same [limitations as Big Data Cluster availability groups. Click here to learn more.](/sql/big-data-cluster/deployment-high-availability#known-limitations)

## Next steps

Learn more about [Features and Capabilities of Azure Arc enabled SQL Managed Instance](managed-instance-features.md)
