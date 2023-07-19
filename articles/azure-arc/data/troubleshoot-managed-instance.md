---
title: Troubleshoot connection to failover group - Azure Arc-enabled SQL Managed Instance
description: Describes how to troubleshoot issues with connections to failover group resources in Azure Arc-enabled data services
author: MikeRayMSFT
ms.author: mikeray
ms.topic: troubleshooting-general 
ms.date: 03/15/2023
---

# Troubleshoot Azure Arc-enabled SQL Managed Instance deployments

This article identifies potential issues, and describes how to diagnose root causes for these issues for deployments of Azure Arc-enabled data services. 

## Connection to Azure Arc-enabled SQL Managed Instance failover group

This section describes how to troubleshoot issues connecting to a failover group.

### Check failover group connections & synchronization state

```console
kubectl -n $nameSpace get fog $fogName -o jsonpath-as-json='{.status}'
```

**Results**:

On each side, there are two replicas for one failover group. Check the value of `connectedState`, and `synchronizationState` for each replica.

If one of `connectedState` isn't equal to `CONNECTED`, see the instructions under [Check parameters](#check-parameters).

If one of `synchronizationState` isn't equal to `HEALTHY`, focus on the instance which `synchronizationState` isn't equal to `HEALTHY`". Refer to [Can't connect to Arc-enabled SQL Managed Instance](#cant-connect-to-arc-enabled-sql-managed-instance) for how to debug.

### Check parameters

On both geo-primary and geo-secondary, check failover spec against `$sqlmiName` instance on other side.

### Command on local

Run the following command against the local instance to get the spec for the local instance.

```console
kubectl -n $nameSpace get fog $fogName -o jsonpath-as-json='{.spec}'
```

### Command on remote

Run the following command against the remote instance:

```console
kubectl -n $nameSpace get sqlmi $sqlmiName -o jsonpath-as-json='{.status.highAvailability.mirroringCertificate}'
kubectl -n $nameSpace get sqlmi $sqlmiName -o jsonpath-as-json='{.status.endpoints.mirroring}'
```

**Results**:

Compare the results from the remote instance with the results from the local instance. 

* `partnerMirroringURL`, and `partnerMirroringCert` from the local instance has to match remote instance values from:
  * `kubectl -n $nameSpace get sqlmi $sqlmiName -o jsonpath-as-json='{.status.endpoints.mirroring}'`
  * `kubectl -n $nameSpace get sqlmi $sqlmiName -o jsonpath-as-json='{.status.highAvailability.mirroringCertificate}'`

* `partnerMI` from `kubectl -n $nameSpace get fog $fogName -o jsonpath-as-json='{.spec}'` has to match with `$sqlmiName` from remote instance.

* `sharedName` from `kubectl -n $nameSpace get fog $fogName -o jsonpath-as-json='{.spec}'` is optional. If it isn't presented, it's same as `sourceMI`. The `sharedName` from both site should be same if presented. 

* Role from `kubectl -n $nameSpace get fog $fogName -o jsonpath-as-json='{.spec}'` should be different between two sites. One side should be primary, other should be secondary.

If any one of values described doesn't match the comparison, delete failover group on both sites and re-create.

If nothing is wrong, follow the instructions under [Check mirroring endpoints for both sides](#check-mirroring-endpoints-for-both-sides).

### Check mirroring endpoints for both sides

On both geo-primary and geo-secondary, checks external mirroring endpoint is exposed by following commands.

```console
kubectl -n test get services $sqlmiName-external-svc -o jsonpath-as-json='{.spec.ports}'
```

**Results**

* `port-mssql-mirroring` should be presented on the list. The failover group on the other side should use the same value for `partnerMirroringURL`. If the values don't match, correct the mistake and retry from the beginning.

### Verify SQL Server can reach external endpoint of another site

Although you can't ping mirroring endpoint of another site directly, use the following command to reach another side external endpoint of the SQL Server tabular data stream (TDS) port.

```console
kubectl exec -ti -n $nameSpace $sqlmiName-0 -c arc-sqlmi -- /opt/mssql-tools/bin/sqlcmd -S $remotePrimaryEndpoint -U $remoteUser -P $remotePassword -Q "SELECT @@ServerName"
```

**Results**

If SQL server can use external endpoint TDS, there is a good chance it can reach external mirroring endpoint because they are defined and activated in the same service, specifically `$sqlmiName-external-svc`.

## Can't connect to Arc-enabled SQL Managed Instance

This section identifies specific steps you can take to troubleshoot connections to Azure Arc-enabled SQL managed instances.

> [!NOTE]
> You can't connect to an Azure Arc-enabled SQL Managed Instance if the instance license type is `DisasterRecovery`.

### Check the managed instance status

SQL Managed Instance (SQLMI) status info indicates if the instance is ready or not.

```console
kubectl -n $nameSpace get sqlmi $sqlmiName -o jsonpath-as-json='{.status}'
```

**Results**

The state should be `Ready`. If the value isn't `Ready`, you need to wait. If state is error, get the message field, collect logs, and contact support. See [Collect the logs](#collect-the-logs).

### Check the routing label for stateful set
The routing label for stateful set is used to route external endpoint to a matched pod. The name of the label is `role.ag.mssql.microsoft.com`.

```console
kubectl -n $nameSpace get pods $sqlmiName-0 -o jsonpath-as-json='{.metadata.labels}'
kubectl -n $nameSpace get pods $sqlmiName-1 -o jsonpath-as-json='{.metadata.labels}'
kubectl -n $nameSpace get pods $sqlmiName-2 -o jsonpath-as-json='{.metadata.labels}'
```

**Results**

If you didn't find primary, kill the pod that doesn't have any `role.ag.mssql.microsoft.com` label. If this doesn't resolve the issue, collect logs and contact support. See [Collect the logs](#collect-the-logs).

### Get Replica state from local container connection

Use `localhost,1533` to connect sql in each replica of `statefulset`. This connection should always succeed. Use this connection to query the SQL HA replica state.

```console
kubectl exec -ti -n $nameSpace $sqlmiName-0 -c arc-sqlmi -- /opt/mssql-tools/bin/sqlcmd -S localhost,1533 -U $User -P $Password -Q "SELECT * FROM sys.dm_hadr_availability_replica_states"
kubectl exec -ti -n $nameSpace $sqlmiName-1 -c arc-sqlmi -- /opt/mssql-tools/bin/sqlcmd -S localhost,1533 -U $User -P $Password -Q "SELECT * FROM sys.dm_hadr_availability_replica_states"
kubectl exec -ti -n $nameSpace $sqlmiName-2 -c arc-sqlmi -- /opt/mssql-tools/bin/sqlcmd -S localhost,1533 -U $User -P $Password -Q "SELECT * FROM sys.dm_hadr_availability_replica_states"
```

**Results**

All replicas should be connected & healthy. Here is the detailed description of the query results [sys.dm_hadr_availability_replica_states](/sql/relational-databases/system-dynamic-management-views/sys-dm-hadr-availability-replica-states-transact-sql).

If you find it isn't synchronized or not connected unexpectedly, try to kill the pod which has the problem. If problem persists, collect logs and contact support. See [Collect the logs](#collect-the-logs).

> [!NOTE]
> If there are some large database in the instance, the seeding process to secondary could take a while. If this happens, wait for seeding to complete.

## Check SQLMI SQL engine listener

SQL engine listener is the component which routes connections to the failover group.

```console
kubectl exec -ti -n $nameSpace $sqlmiName-0 -c arc-sqlmi -- /opt/mssql-tools/bin/sqlcmd -S localhost,1433 -U $User -P $Password -Q "SELECT @@ServerName"
kubectl exec -ti -n $nameSpace $sqlmiName-1 -c arc-sqlmi -- /opt/mssql-tools/bin/sqlcmd -S localhost,1433 -U $User -P $Password -Q "SELECT @@ServerName"
kubectl exec -ti -n $nameSpace $sqlmiName-2 -c arc-sqlmi -- /opt/mssql-tools/bin/sqlcmd -S localhost,1433 -U $User -P $Password -Q "SELECT @@ServerName"
```

**Results**

You should get `ServerName` from `Listener` of each replica. If you can't get `ServerName`, kill the pods which have the problem. If the problem persists after recovery, collect logs and contact support. See [Collect the logs](#collect-the-logs).

### Check Kubernetes network connection

Inside Kubernetes cluster, there is kubernetes network on top which allow communication between pods and routing. Check if SQLMI pods can communicate with each other via cluster IP. Run this for all the replicas.


```console
kubectl exec -ti -n $nameSpace $sqlmiName-0 -c arc-sqlmi -- /opt/mssql-tools/bin/sqlcmd -S $(kubectl -n test get service $sqlmiName-p-svc -o jsonpath={'.spec.clusterIP'}),1533 -U $User -P $Password -Q "SELECT @@ServerName"
```

**Results**

You should be able to reach any Cluster IP address for the pods of stateful set from another pod. If this isn't the case, refer to [Kubernetes documentation - Cluster networking](https://kubernetes.io/docs/concepts/cluster-administration/networking/) for detailed information or get service provider to resolve the issue.

### Check the Kubernetes load balancer or `nodeport` services

Load balancer or `nodeport` services are the services that expose a service port to the external network.

```console
kubectl -n $nameSpace expose pod $sqlmiName-0 --port=1533  --name=ha-$sqlmiName-0 --type=LoadBalancer
kubectl -n $nameSpace expose pod $sqlmiName-1 --port=1533  --name=ha-$sqlmiName-1 --type=LoadBalancer
kubectl -n $nameSpace expose pod $sqlmiName-2 --port=1533  --name=ha-$sqlmiName-2 --type=LoadBalancer
```

**Results**

You should be able to connect to exposed external port (which has been confirmed from internal at step 3). If you can't connect to external port, refer to [Kubernetes documentation - Create an external load balancer](https://kubernetes.io/docs/tasks/access-application-cluster/create-external-load-balancer/) and get service provider help on the issues.

You can use any client like `SqlCmd`, SQL Server Management Studio (SSMS), or Azure Data Studio (ADS) to test this out.

## Connection between failover groups is lost

If the failover groups between primary and geo-secondary Arc SQL Managed instances is configured to be in `sync` mode and the connection is lost for whatever reason for an extended period of time, then the logs on the primary Arc SQL managed instance cannot be truncated until the transactions are sent to the geo-secondary. This could lead to the logs filling up and potentially running out of space on the primary site. To break out of this situation, remove the failover groups and re-configure when the connection between the sites is re-established. 

The failover groups can be removed on both primary as well as secondary site as follows:

IF the data controller is deployed in `indirect` mode: 
`kubectl delete fog <failovergroup name>`

and if the data controller is deployed in `direct` mode, provide the `sharedname` and the failover group is deleted on both sites: 
`az sql instance-failover-group-arc delete --name fogcr --mi <arcsqlmi> --resource-group <resource group>`


Once the failover group on the primary site is deleted, logs can be truncated to free up space.

## Collect the logs

If the previous steps all succeeded without any problem and you still can't log in, collect the logs and contact support

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

[Get logs to troubleshoot Azure Arc-enabled data services](troubleshooting-get-logs.md)
