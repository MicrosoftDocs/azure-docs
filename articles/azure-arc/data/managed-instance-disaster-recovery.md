---
title: Disaster recovery - Azure Arc-enabled SQL Managed Instance
description: Describes disaster recovery for Azure Arc-enabled SQL Managed Instance
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
ms.custom: event-tier1-build-2022
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 04/06/2022
ms.topic: conceptual
---

# Azure Arc-enabled SQL Managed Instance - disaster recovery 

To configure disaster recovery in Azure Arc-enabled SQL Managed Instance, set up failover groups.

## Background

The distributed availability groups used in Azure Arc-enabled SQL Managed Instance is the same technology that is in SQL Server. Because Azure Arc-enabled SQL Managed Instance runs on Kubernetes, there's no Windows failover cluster involved.  For more information, see [Distributed availability groups](/sql/database-engine/availability-groups/windows/distributed-availability-groups).

> [!NOTE]
> - The Azure Arc-enabled SQL Managed Instance in both geo-primary and geo-secondary sites need to be identical in terms of their compute & capacity, as well as service tiers they are deployed in.
> - Distributed availability groups can be setup for either General Purpose or Business Critical service tiers. 

To configure disaster recovery:

1. Create custom resource for distributed availability group at the primary site
1. Create custom resource for distributed availability group at the secondary site
1. Copy the mirroring certificates
1. Set up the distributed availability group between the primary and secondary sites

The following image shows a properly configured distributed availability group:

![A properly configured distributed availability group](.\media\business-continuity\dag.png)

### Configure distributed availability groups 

1. Provision the managed instance in the primary site.

   ```azurecli
   az sql mi-arc create --name <primaryinstance> --tier bc --replicas 3 --k8s-namespace <namespace> --use-k8s
   ```

2. Provision the managed instance in the secondary site and configure as a disaster recovery instance. At this point, the system databases are not part of the contained availability group.

> [!NOTE]
> - It is important to specify `--license-type DisasterRecovery` **during** the Azure Arc SQL MI creation. This will allow the DR instance to be seeded from the primary instance in the primary data center. Updating this property post deployment will not have the same effect.



   ```azurecli
   az sql mi-arc create --name <secondaryinstance> --tier bc --replicas 3 --license-type DisasterRecovery --k8s-namespace <namespace> --use-k8s
   ```

3. Copy the mirroring certificates from each site to a location that's accessible to both the geo-primary and geo-secondary instances. 

   ```azurecli
   az sql mi-arc get-mirroring-cert --name <primaryinstance> --cert-file $HOME/sqlcerts/<name>.pem​ --k8s-namespace <namespace> --use-k8s
   az sql mi-arc get-mirroring-cert --name <secondaryinstance> --cert-file $HOME/sqlcerts/<name>.pem --k8s-namespace <namespace> --use-k8s
   ```

   Example:

   ```azurecli
   az sql mi-arc get-mirroring-cert --name sqlprimary --cert-file $HOME/sqlcerts/sqlprimary.pem​ --k8s-namespace my-namespace --use-k8s
   az sql mi-arc get-mirroring-cert --name sqlsecondary --cert-file $HOME/sqlcerts/sqlsecondary.pem --k8s-namespace my-namespace --use-k8s
   ```

4. Create the failover group resource on both sites. 


   > [!NOTE]
   > Ensure the SQL instances have different names for both primary and secondary sites, and the `shared-name` value should be identical on both sites.
   
    ```azurecli
    az sql instance-failover-group-arc create --shared-name <name of failover group> --name <name for primary DAG resource> --mi <local SQL managed instance name> --role primary --partner-mi <partner SQL managed instance name>  --partner-mirroring-url tcp://<secondary IP> --partner-mirroring-cert-file <secondary.pem> --k8s-namespace <namespace> --use-k8s


    az sql instance-failover-group-arc create --shared-name <name of failover group> --name <name for secondary DAG resource> --mi <local SQL managed instance name> --role secondary --partner-mi <partner SQL managed instance name>  --partner-mirroring-url tcp://<primary IP> --partner-mirroring-cert-file <primary.pem> --k8s-namespace <namespace> --use-k8s
    ```

    Example:

    ```azurecli
    az sql instance-failover-group-arc create --shared-name myfog --name primarycr --mi sqlinstance1 --role primary --partner-mi sqlinstance2  --partner-mirroring-url tcp://10.20.5.20:970 --partner-mirroring-cert-file $HOME/sqlcerts/sqlinstance2.pem --k8s-namespace my-namespace --use-k8s

    az sql instance-failover-group-arc create --shared-name myfog --name secondarycr --mi sqlinstance2 --role secondary --partner-mi sqlinstance1  --partner-mirroring-url tcp://10.10.5.20:970 --partner-mirroring-cert-file $HOME/sqlcerts/sqlinstance1.pem --k8s-namespace my-namespace --use-k8s
    ```

## Manual failover from primary to secondary instance

Use `az sql instance-failover-group-arc ...` to initiate a failover from primary to secondary. The following command initiates a failover from the primary instance to the secondary instance. Any pending transactions on the geo-primary instance are replicated over to the geo-secondary instance before the failover. 

```azurecli
az sql instance-failover-group-arc update --name <name of DAG resource> --role secondary --k8s-namespace <namespace> --use-k8s 
```

Example:

```azurecli
az sql instance-failover-group-arc update --name myfog --role secondary --k8s-namespace my-namespace --use-k8s 
```

## Forced failover

In the circumstance when the geo-primary instance becomes unavailable, the following commands can be run on the geo-secondary DR instance to promote to primary with a forced failover incurring potential data loss.

Run the below command on geo-primary, if available:

```azurecli
az sql instance-failover-group-arc update --k8s-namespace my-namespace --name primarycr --use-k8s --role force-secondary
```

On the geo-secondary DR instance, run the following command to promote it to primary role, with data loss.

```azurecli
az sql instance-failover-group-arc update --k8s-namespace my-namespace --name secondarycr --use-k8s --role force-primary-allow-data-loss
```
## Limitation

When you use [SQL Server Management Studio Object Explorer to create a database](/sql/relational-databases/databases/create-a-database#SSMSProcedure), the application returns an error. You can [create new databases with T-SQL](/sql/relational-databases/databases/create-a-database#TsqlProcedure).
