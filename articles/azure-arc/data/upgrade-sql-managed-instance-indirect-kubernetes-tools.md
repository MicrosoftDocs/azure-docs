---
title: Upgrade Azure SQL Managed Instance indirectly connected to Azure Arc using Kubernetes tools
description: Article describes how to upgrade an indirectly connected SQL Managed Instance enabled by Azure Arc using Kubernetes tools
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
ms.custom: event-tier1-build-2022
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 10/11/2022    
ms.topic: how-to
---

# Upgrade Azure SQL Managed Instance indirectly connected to Azure Arc using Kubernetes tools

This article describes how to upgrade Azure SQL Managed Instance deployed on an indirectly connected Azure Arc-enabled data controller using Kubernetes tools.

## Prerequisites

### Install tools

Before you can proceed with the tasks in this article, you need:

- To connect and authenticate to a Kubernetes cluster
- An existing Kubernetes context selected

You need an indirectly connected data controller with the `imageTag v1.0.0_2021-07-30` or greater.

## Limitations

The Azure Arc Data Controller must be upgraded to the new version before the managed instance can be upgraded.

If Active Directory integration is enabled then Active Directory connector must be upgraded to the new version before the managed instance can be upgraded.

The managed instance must be at the same version as the data controller and active directory connector before a data controller is upgraded.

There's no batch upgrade process available at this time.

## Upgrade the managed instance

[!INCLUDE [upgrade-sql-managed-instance-service-tiers](includes/upgrade-sql-managed-instance-service-tiers.md)]


### Upgrade

Use a kubectl command to view the existing spec in yaml.

```console
kubectl --namespace <namespace> get sqlmi <sqlmi-name> --output yaml
```

Run kubectl patch to update the desired version.

```console
kubectl patch sqlmi <sqlmi-name> --namespace <namespace> --type merge --patch '{"spec": {"update": {"desiredVersion": "v1.1.0_2021-11-02"}}}'
```

## Monitor

You can monitor the progress of the upgrade with kubectl as follows:

```console
kubectl describe sqlmi --namespace <namespace>
```

### Output

The output for the command will show the resource information. Upgrade information will be in Status.

During the upgrade, ```State``` will show ```Updating``` and ```Running Version``` will be the current version:

```output
Status:
  Log Search Dashboard:  https://30.88.222.48:5601/app/kibana#/discover?_a=(query:(language:kuery,query:'custom_resource_name:sqlmi-1'))
  Metrics Dashboard:     https://30.88.221.32:3000/d/40q72HnGk/sql-managed-instance-metrics?var-hostname=sqlmi-1-0
  Observed Generation:   2
  Primary Endpoint:      30.76.129.38,1433
  Ready Replicas:        1/1
  Running Version:       v1.0.0_2021-07-30
  State:                 Updating
```

When the upgrade is complete, ```State``` will show ```Ready``` and ```Running Version``` will be the new version:

```output
Status:
  Log Search Dashboard:  https://30.88.222.48:5601/app/kibana#/discover?_a=(query:(language:kuery,query:'custom_resource_name:sqlmi-1'))
  Metrics Dashboard:     https://30.88.221.32:3000/d/40q72HnGk/sql-managed-instance-metrics?var-hostname=sqlmi-1-0
  Observed Generation:   2
  Primary Endpoint:      30.76.129.38,1433
  Ready Replicas:        1/1
  Running Version:       <version-tag>
  State:                 Ready
```

[!INCLUDE [upgrade-rollback](includes/upgrade-rollback.md)]
