---
title: Upgrade a directly connected Azure SQL Managed Instance for Azure Arc using the CLI
description: Article describes how to upgrade a directly connected Azure SQL Managed Instance for Azure Arc using the CLI
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

# Upgrade an Azure SQL Managed Instance directly connected to Azure Arc using the CLI

This article describes how to upgrade an Azure SQL Managed Instance deployed on a directly connected Azure Arc-enabled data controller using the Azure CLI (`az`).

## Prerequisites

### Install tools

Before you can proceed with the tasks in this article, install:

- The [Azure CLI (`az`)](/cli/azure/install-azure-cli)
- The [`arcdata` extension for Azure CLI](install-arcdata-extension.md)

The `arcdata` extension version and the image version are related. Check that you have the correct `arcdata` extension version that corresponds to the image version you want to upgrade to in the [Version log](version-log.md).

## Limitations

The Azure Arc data controller must be upgraded to the new version before the managed instance can be upgraded.

If Active Directory integration is enabled then Active Directory connector must be upgraded to the new version before the managed instance can be upgraded.

The managed instance must be at the same version as the data controller and active directory connector before a data controller is upgraded.

There's no batch upgrade process available at this time.

## Upgrade the managed instance

You can perform a dry run first. The dry run validates the version schema and lists which instance(s) will be upgraded. Use `--dry-run`. For example:

```azurecli
az sql mi-arc upgrade --resource-group <resource group> --name <instance name> --dry-run 
```

The output will be:

```output
Preparing to upgrade sql sqlmi-1 in namespace arc to data controller version.
****Dry Run****1 instance(s) would be upgraded by this commandsqlmi-1 would be upgraded to <version-tag>.
```

[!INCLUDE [upgrade-sql-managed-instance-service-tiers](includes/upgrade-sql-managed-instance-service-tiers.md)]


### Upgrade

To upgrade the managed instance, use the following command:

```azurecli
az sql mi-arc upgrade --resource-group <resource group> --name <instance name> --desired-version <imageTag> [--no-wait]
```

Example:

```azurecli
az sql mi-arc upgrade --resource-group myresource-group --name sql1 --desired-version v1.6.0_2022-05-02 [--no-wait]
```

## Monitor

You can monitor the progress of the upgrade with CLI.

### CLI example

```cli
az sql mi-arc show --resource-group <resource group> --name <instance name>
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
  Running Version:       v1.5.0_2022-04-05
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
  Running Version:       v1.6.0_2022-05-02
  State:                 Ready
```

[!INCLUDE [upgrade-rollback](includes/upgrade-rollback.md)]
