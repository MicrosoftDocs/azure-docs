---
title: Upgrade an indirectly connected Azure Arc-enabled Managed Instance using Kubernetes tools
description: Article describes how to upgrade an indirectly connected Azure Arc-enabled Managed Instance using Kubernetes tools
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.custom: event-tier1-build-2022
author: grrlgeek
ms.author: jeschult
ms.reviewer: mikeray
ms.date: 11/08/2021
ms.topic: how-to
---

# Upgrade an an indirectly connected Azure Arc-enabled Managed Instance using Kubernetes tools

This article describes how to upgrade a SQL Managed Instance deployed on an indirectly connected Azure Arc-enabled data controller using Kubernetes tools.

## Prerequisites

### Install tools

Before you can proceed with the tasks in this article you need:

- To connect and authenticate to a Kubernetes cluster
- An existing Kubernetes context selected

You need an indirectly connected data controller with the `imageTag v1.0.0_2021-07-30` or greater.

## Limitations

The Azure Arc Data Controller must be upgraded to the new version before the Managed Instance can be upgraded.

Currently, only one Managed Instance can be upgraded at a time.

## Upgrade the Managed Instance

### General Purpose

During a SQL Managed Instance General Purpose upgrade, the containers in the pod will be upgraded and will be reprovisioned. This will cause a short amount of downtime as the new pod is created. You will need to build resiliency into your application, such as connection retry logic, to ensure minimal disruption. Read [Overview of the reliability pillar](/azure/architecture/framework/resiliency/overview) for more information on architecting resiliency.

### Business Critical 

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

You can monitor the progress of the upgrade with kubectl. 

### kubectl

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

## Troubleshoot upgrade problems

If you encounter any troubles with upgrading, see the [troubleshooting guide](troubleshoot-guide.md).
