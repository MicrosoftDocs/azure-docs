---
title: Disaster recovery - Azure Arc-enabled SQL Managed Instance
description: Describes disaster recovery for Azure Arc-enabled SQL Managed Instance
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 01/27/2022
ms.topic: conceptual
---

# Azure Arc-enabled SQL Managed Instance - disaster recovery (preview)

Disaster Recovery in Azure Arc-enabled SQL Managed Instance is achieved using distributed availability groups.

Disaster recovery features for Azure Arc-enabled SQL Managed Instance are available as preview.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Background

Conceptually the distributed availability groups (DAGs) used in Azure Arc-enabled SQL Managed Instance is the same technology that is in SQL Server as described in [Distributed availability groups](/sql/database-engine/availability-groups/windows/distributed-availability-groups). In the case of Azure SQL Managed Instance for Azure Arc, both geo-primary and geo-secondary sites are hosted on Kubernetes and there is no Windows failover cluster involved. 

> [!NOTE]
> 1. The Azure Arc-enabled SQL Managed Instance in both geo-primary and geo-secondary sites need to be identical in terms of their compute & capacity, as well as service tiers they are deployed in.
> 2. Distributed availability groups can be setup for either general purpose or business critical service tiers. 

To configure disaster recovery:

1. Create distributed availability group custom resources on the primary site
1. Create distributed availability group custom resources on the secondary site
1. Copy the mirroring certificates
1. Set up the distributed availability group between the primary and secondary sites.

The following image shows a properly configured distributed availability group:

![A properly configured distributed availability group](.\media\business-continuity\dag.png)

### Configure distributed availability groups 

1. Provision the managed instance in the primary site.

   ```azurecli
   az sql mi-arc create --name sqlprimary --tier bc --replicas 3 --k8s-namespace my-namespace --use-k8s
   ```

2. Provision the managed instance in the secondary site and configure as a DR instance. At this point the system databases are not part of the contained availability group yet.

   ```azurecli
   az sql mi-arc create --name sqlsecondary --tier bc --replicas 3 --disaster-recovery-site true --k8s-namespace my-namespace --use-k8s
  ```

3. Copy the mirroring certificates from each site to a location thats accessible to both the geo-primary and geo-secondary instances. 

   ```azurecli
   az sql mi-arc get-mirroring-cert --name <primaryinstance> --cert-file $HOME/sqlcerts/<name>.pem​ --k8s-namespace <namespace> --use-k8s
   az sql mi-arc get-mirroring-cert --name <secondaryinstance> --cert-file $HOME/sqlcerts/<name>.pem --k8s-namespace <namespace> --use-k8s
   ```

   Example:

   ```azurecli
   az sql mi-arc get-mirroring-cert --name sqlprimary --cert-file $HOME/sqlcerts/sqlprimary.pem​ --k8s-namespace my-namespace --use-k8s
   az sql mi-arc get-mirroring-cert --name sqlsecondary --cert-file $HOME/sqlcerts/sqlsecondary.pem --k8s-namespace my-namespace --use-k8s
   ```

4. Create the distributed availability group resource on both sites. 

   Use `az sql mi-arc dag...` to complete the task. The command seeds system databases in the disaster recovery instance contained availability group, from the primary instance contained availability group.
 
   > [!NOTE]
   > The distributed availability group name should be identical on both sites.

   ```azurecli
   az sql mi-arc dag create --dag-name <name of DAG> --name <name for primary DAG resource> --local-instance-name <primary instance name> --role primary --remote-instance-name <secondary instance name>  --remote-mirroring-url tcp://<secondary IP> --remote-mirroring-cert-file <secondary.pem> --k8s-namespace <namespace> --use-k8s

   az sql mi-arc dag create --dag-name <name of DAG> --name <name for secondary DAG resource> --local-instance-name <secondary instance name> --role secondary --remote-instance-name <primary instance name> --remote-mirroring-url tcp://<primary IP> --remote-mirroring-cert-file <primary.pem> --k8s-namespace <namespace> --use-k8s
   ```


   Example:
   ```azurecli
   az sql mi-arc dag create --dag-name dagtest --name dagPrimary --local-instance-name sqlPrimary --role primary --remote-instance-name sqlSecondary --remote-mirroring-url tcp://10.20.5.20:970 --remote-mirroring-cert-file $HOME/sqlcerts/sqlsecondary.pem --k8s-namespace my-namespace --use-k8s

   az sql mi-arc dag create --dag-name dagtest --name dagSecondary --local-instance-name sqlSecondary  --role secondary --remote-instance-name sqlPrimary --remote-mirroring-url tcp://10.20.5.50:970 --remote-mirroring-cert-file $HOME/sqlcerts/sqlprimary.pem --k8s-namespace my-namespace --use-k8s
   ```

After you complete the steps above, you have configured the distributed availability group.

## Auto failover from primary to secondary instance

The following command initiates a failover from the primary instance to the secondary instance. Any pending transactions on the geo-primary instance are replicated over to the geo-secondary disaster recovery instance before the failover. 

```azurecli
az sql mi-arc dag edit --name <name of DAG> --role secondary --k8s-namespace <namespace> --use-k8s 
```

Example:

```azurecli
az sql mi-arc dag edit --name dagtest --role secondary --k8s-namespace <namespace> --use-k8s 
```


## Forced failover

In the circumstance when the geo-primary instance becomes unavailable, the following commands can be run on the geo-secondary DR instance to promote to primary with a forced failover incurring potential data loss.

Run the below command on geo-primary, if available:

```azurecli
az sql mi-arc dag edit -k test --name dagtestp --use-k8s --role force-secondary
```

On the geo-secondary DR instance, run the following command to promote it to primary role, with data loss.

```azurecli
az sql mi-arc dag edit -k test --name dagtests --use-k8s --role force-primary-allow-data-loss
```
