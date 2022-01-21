---
title: Upgrade an an indirectly connected Azure Arc-enabled Managed Instance using the CLI
description: Article describes how to upgrade an indirectly connected Azure Arc-enabled Managed Instance using the CLI
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: grrlgeek
ms.author: jeschult
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---

# Upgrade an indirectly connected Azure Arc-enabled Managed Instance using the CLI

This article describes how to upgrade a SQL Managed Instance deployed on an indirectly connected Azure Arc-enabled data controller using the Azure CLI (`az`).

## Prerequisites

### Install tools

Before you can proceed with the tasks in this article you need to install:

- The [Azure CLI (az)](/cli/azure/install-azure-cli)
- The [`arcdata` extension for Azure CLI](install-arcdata-extension.md)

## Limitations

The Azure Arc Data Controller must be upgraded to the new version before the Managed Instance can be upgraded.

Currently, only one Managed Instance can be upgraded at a time.

## Upgrade the Managed Instance

A dry run can be performed first. This will validate the version schema and list which instance(s) will be upgraded.

````cli
az sql mi-arc upgrade --name <instance name> --k8s-namespace <namespace> --dry-run --use-k8s
````

The output will be:

```output
Preparing to upgrade sql sqlmi-1 in namespace arc to data controller version.
****Dry Run****1 instance(s) would be upgraded by this commandsqlmi-1 would be upgraded to <version-tag>.
```

### General Purpose

During a SQL Managed Instance General Purpose upgrade, the containers in the pod will be upgraded and will be reprovisioned. This will cause a short amount of downtime as the new pod is created. You will need to build resiliency into your application, such as connection retry logic, to ensure minimal disruption. Read [Overview of the reliability pillar](/azure/architecture/framework/resiliency/overview) for more information on architecting resiliency.

To upgrade the Managed Instance, use the following command:

````cli
az sql mi-arc upgrade --name <instance name> --desired-version <version> --k8s-namespace <namespace> --use-k8s
````

Example:

````cli
az sql mi-arc upgrade --name instance1 --desired-version v1.0.0.20211028 --k8s-namespace arc1 --use-k8s
````

## Monitor

You can monitor the progress of the upgrade with kubectl or CLI.

### kubectl

```console
kubectl describe sqlmi --namespace <namespace>
```

### CLI

```cli
az sql mi-arc show --name <instance name> --k8s-namespace <namespace> --use-k8s
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

## Troubleshoot upgrade problems

If you encounter any troubles with upgrading, see the [troubleshooting guide](troubleshoot-guide.md).
