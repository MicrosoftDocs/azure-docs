---
title: Troubleshoot connection Azure Arc-enabled SQL Managed Instance
description: Describes how to troubleshoot issues with connections in Azure Arc-enabled data services
author: MikeRayMSFT
ms.author: mikeray
ms.topic: troubleshooting-general 
ms.date: 03/15/2023
---

# Troubleshoot connection to Azure Arc-enabled SQL Managed Instance

This article identifies specific steps you can take to troubleshoot connections to Azure Arc-enabled SQL managed instances.

To troubleshoot connections to resources in a failover group, see [Troubleshoot connection to Azure Arc-enabled SQL Managed Instance failover group](troubleshoot-managed-instance-connection.md).

You can't connect to an Azure Arc-enabled SQL Managed Instance if the instance license type is `DisasterRecovery`.

## Check the managed instance status

SQL Managed Instance (SQLMI) status info indicates if the instance is ready or not.

```console
kubectl -n $nameSpace get sqlmi $sqlmiName -o jsonpath-as-json='{.status}'
```

### Results

The state should be `Ready`. If it is not, you need to wait. If state is error, get the message field, collect logs, and contact support. See [Collecting the logs](#collecting-the-logs).

## Check the routing label for stateful set
The routing label for stateful set is used to route external endpoint to a matched pod. The name of the label is `role.ag.mssql.microsoft.com`.

### Commands

```console
kubectl -n $nameSpace get pods $sqlmiName-0 -o jsonpath-as-json='{.metadata.labels}'
kubectl -n $nameSpace get pods $sqlmiName-1 -o jsonpath-as-json='{.metadata.labels}'
kubectl -n $nameSpace get pods $sqlmiName-2 -o jsonpath-as-json='{.metadata.labels}'
```

### Results

If you didn't find primary, please kill the pod that doesn't have any `role.ag.mssql.microsoft.com` label. If this doesn't resolve the issue, collect logs and contact support. See [Collecting the logs](#collecting-the-logs).

## Get Replica state from local container connection

Using localhost,1533 to connect sql in each replica of statefulset should always succeed. So, it can be used to get sql HA replica state.

### Commands

```console
kubectl exec -ti -n $nameSpace $sqlmiName-0 -c arc-sqlmi -- /opt/mssql-tools/bin/sqlcmd -S localhost,1533 -U $User -P $Password -Q "SELECT * FROM sys.dm_hadr_availability_replica_states"
kubectl exec -ti -n $nameSpace $sqlmiName-1 -c arc-sqlmi -- /opt/mssql-tools/bin/sqlcmd -S localhost,1533 -U $User -P $Password -Q "SELECT * FROM sys.dm_hadr_availability_replica_states"
kubectl exec -ti -n $nameSpace $sqlmiName-2 -c arc-sqlmi -- /opt/mssql-tools/bin/sqlcmd -S localhost,1533 -U $User -P $Password -Q "SELECT * FROM sys.dm_hadr_availability_replica_states"
```

### Results

All replicas should be connected & healthy. Here is the detailed description [sys.dm_hadr_availability_replica_states](/sql/relational-databases/system-dynamic-management-views/sys-dm-hadr-availability-replica-states-transact-sql).

If you find it is not synchronized or not connected unexpectedly, try to kill the pod which has the problem. If problem persists, collect logs and get HA expert help.

> [!NOTE]
> If there are some large database in SQL MI instance, the Seeding database to secondary could take a while. please wait if this happens.

## Check SQLMI SQL Engine listener

SQL Engine listener is the commponent which connects user connection to the failover group.

### Commands

```console
kubectl exec -ti -n $nameSpace $sqlmiName-0 -c arc-sqlmi -- /opt/mssql-tools/bin/sqlcmd -S localhost,1433 -U $User -P $Password -Q "SELECT @@ServerName"
kubectl exec -ti -n $nameSpace $sqlmiName-1 -c arc-sqlmi -- /opt/mssql-tools/bin/sqlcmd -S localhost,1433 -U $User -P $Password -Q "SELECT @@ServerName"
kubectl exec -ti -n $nameSpace $sqlmiName-2 -c arc-sqlmi -- /opt/mssql-tools/bin/sqlcmd -S localhost,1433 -U $User -P $Password -Q "SELECT @@ServerName"
```

### Results

You should get `ServerName` from `Listener` of SQL Server on each replicas, If you cannot, kill the pods which have the problem. If the problem persists after recovery, collect logs and contact support. See [Collecting the logs](#collecting-the-logs).

## Check Kubernetes network connection

Inside Kurnetes cluster, there is kubernetes network on top which allow communication between pods and routing. Check if SQLMI pods can communicate with each other via cluster IP. Run this for all the replicas.

### Commands

```console
kubectl exec -ti -n $nameSpace $sqlmiName-0 -c arc-sqlmi -- /opt/mssql-tools/bin/sqlcmd -S $(kubectl -n test get service $sqlmiName-p-svc -o jsonpath={'.spec.clusterIP'}),1533 -U $User -P $Password -Q "SELECT @@ServerName"
```

### Results

You should be able to reach any Cluster IP address for the pods of stateful set from another pod. If this is not the case, please refer to [Kubernetes documentation - Cluster networking](https://kubernetes.io/docs/concepts/cluster-administration/networking/) for detailed infomation or get service provider to resolve the issue.

## Check the Kubernetes load balancer or nodeport services

Load balancer or nodeport services are the services that expose a service port to the external network.

### Commands

```console
kubectl -n $nameSpace expose pod $sqlmiName-0 --port=1533  --name=ha-$sqlmiName-0 --type=LoadBalancer
kubectl -n $nameSpace expose pod $sqlmiName-1 --port=1533  --name=ha-$sqlmiName-1 --type=LoadBalancer
kubectl -n $nameSpace expose pod $sqlmiName-2 --port=1533  --name=ha-$sqlmiName-2 --type=LoadBalancer
```

### Results

You should be able to connect to exposed external port (which has been confirmed from internal at step 3). If you cannot connect to external port, please refer to [Kubernetes documentation - Create an external load balancer](https://kubernetes.io/docs/tasks/access-application-cluster/create-external-load-balancer/) and get service provider help on the issues.

You can use any client like `SqlCmd`, SQL Server Management Studio (SSMS), or Azure Data Studio (ADS) to test this out.

## Collecting the logs

If the previous steps all succeeded without any problem and you still cannot log in, collect the logs and contact support

### Collection controller logs

```console
MyController=$(kubectl -n $nameSpace get pods --selector=app=controller -o jsonpath='{.items[*].metadata.name}')
kubectl -n $nameSpace cp  $MyController:/var/log/controller $localFolder/controller -c controller
```

### Get SQL Server and supervisor logs for each replica

Run the following command for each replica to get SQL Server and supervisor logs

```console
kubectl -n $nameSpace cp $sqlmiName-0:/var/opt/mssql/log $localFolder/$sqlmiName-0/log -c  arc-sqlmi
kubectl -n $nameSpace cp $sqlmiName-0:/var/log/arc-ha-supervisor $localFolder/$sqlmiName-0/arc-ha-supervisor -c arc-ha-supervisor
```

### Get orchestrator logs

```console
kubectl -n $nameSpace  cp $sqlmiName-ha-0:/var/log $localFolder/$sqlmiName-ha-0/log -c arc-ha-orchestrator
```

## Next steps

TODO: Add your next step link(s)

- Next step 1
- Next step 2

<!--- 9. Reference ----------------------------------------------

Optional: -->

## Reference
TODO: Add your reference link(s)

- Reference 1
- Reference 2