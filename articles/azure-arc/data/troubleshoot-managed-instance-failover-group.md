---
title: Troubleshoot connection to failover group - Azure Arc-enabled SQL Managed Instance
description: Describes how to troubleshoot issues with connections to failover group resources in Azure Arc-enabled data services
author: MikeRayMSFT
ms.author: mikeray
ms.topic: troubleshooting-general 
ms.date: 03/15/2023
---

# Troubleshoot connection to Azure Arc-enabled SQL Managed Instance failover group

This article identifies specific steps you can take to troubleshoot connections to Azure Arc-enabled SQL managed instances that are in a failover group.

## Check failover group connections & synchronization state

```console
kubectl -n $nameSpace get fog $fogName -o jsonpath-as-json='{.status}'
```

### Results

On each side, there are two replicas for one failover group. Check the value of `connectedState`, and `synchronizationState` for each replica.

If one of `connectedState` is not equal to `CONNECTED`, see the instructions under [Check parameters](#check-parameters).

If one of `synchronizationState` is not equal to `HEALTHY`, please focus on the instance which `synchronizationState` is not equal to `HEALTHY`". Refer to [`ha-connection`](../link-is-brok.md) for how to debug.

## Check parameters

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

### Results

Compare the results from the remote instance with the results from the local instance. 

* `partnerMirroringURL`, and `partnerMirroringCert` from the local instance has to match remote instance values from:
  * `kubectl -n $nameSpace get sqlmi $sqlmiName -o jsonpath-as-json='{.status.endpoints.mirroring}'`
  * `kubectl -n $nameSpace get sqlmi $sqlmiName -o jsonpath-as-json='{.status.highAvailability.mirroringCertificate}'`

* `partnerMI` from `kubectl -n $nameSpace get fog $fogName -o jsonpath-as-json='{.spec}'` has to match with `$sqlmiName` from remote instance.

* `sharedName` from `kubectl -n $nameSpace get fog $fogName -o jsonpath-as-json='{.spec}'` is optional. If it is not presented, it is same as `sourceMI`. The `sharedName` from both site should be same if presented. If it is not presented, `sourceMI` from both site should be identical.

* Role from `kubectl -n $nameSpace get fog $fogName -o jsonpath-as-json='{.spec}'` should be different between two sites. One side should be primary, other should be secondary.

If any one of above is not right, delete failover group on both sites and re-create them.

If nothing is wrong, follow the instructions under [Check mirroring endpoints for both sides](#check-mirroring-endpoints-for-both-sides).

## Check mirroring endpoints for both sides

On both geo-primary and geo-secondary, checks external mirroring endpoint is exposed by following commands.

### Commands

```console
kubectl -n test get services $sqlmiName-external-svc -o jsonpath-as-json='{.spec.ports}'
```

### Results

* `port-mssql-mirroring` should be presented on the list. The port should be used by failover group `partnerMirroringURL` on other side.

If it is not, correct the mistake and retry from the beginning.

## Verify SQL Server can reach external endpoint of another site

Although you cannot ping mirroring endpoint of another site directly, use the following command to reach another side external endpoint of the SQL Server tabular data stream (TDS) port.

### Commands

```console
kubectl exec -ti -n $nameSpace $sqlmiName-0 -c arc-sqlmi -- /opt/mssql-tools/bin/sqlcmd -S $remotePrimaryEndpoint -U $remoteUser -P $remotePassword -Q "SELECT @@ServerName"
```

### Results

If SQL server can use external endpoint TDS, there is a good chance it can reach external mirroring endpoint because they are defined and activated in the same service, specifically `$sqlmiName-external-svc`.

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