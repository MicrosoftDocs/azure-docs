---
title: Upgrade Active Directory connector for Azure SQL Managed Instance direct or indirect mode connected to Azure Arc
description: The article describes how to upgrade an active directory connector for direct or indirect mode connected to Azure Arc-enabled SQL Managed Instance
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
author: mikhailalmeida
ms.author: mialmei
ms.reviewer: mikeray
ms.date: 10/11/2022
ms.topic: how-to
---

# Upgrade Active Directory connector

This article describes how to upgrade the Active Directory connector.

## Prerequisites

Before you can proceed with the tasks in this article, you need:

- To connect and authenticate to a Kubernetes cluster
- An existing Kubernetes context selected
- Azure Arc data controller deployed, either in `direct` or `indirect` mode
- Active Directory connector deployed

### Install tools

To upgrade the Active Directory connector (adc), you need to have the Kubernetes tools such as kubectl installed.

The examples in this article use `kubectl`, but similar approaches could be used with other Kubernetes tools such as the Kubernetes dashboard, `oc`, or helm if you're familiar with those tools and Kubernetes yaml/json.

[Install the kubectl tool](https://kubernetes.io/docs/tasks/tools/)


## Limitations

Auto upgrade of Active Directory connector is applicable from imageTag `v1.12.0_2022-10-11` and above and the Arc data controller must be at least `v1.11.0_2022-09-13` version.

The active directory connector (adc) must be at the same version as the data controller before a data controller is upgraded.

There is no batch upgrade process available at this time.

## Upgrade Active Directory connector for previous versions

For imageTag versions `v1.11.0_2022-09-13` or lower, the Active Directory connector must be upgraded manually as below:

Use a kubectl command to view the existing spec in yaml.

```console
kubectl get adc <adc-name> --namespace <namespace> --output yaml
```

Run kubectl patch to update the desired version.

```console
kubectl patch adc <adc-name> --namespace <namespace> --type merge --patch '{"spec": {"update": {"desiredVersion": "v1.11.0_2022-09-13"}}}'
```

## Monitor

You can monitor the progress of the upgrade with kubectl as follows:

```console
kubectl describe adc <adc-name> --namespace <namespace>
```

### Output

The output for the command will show the resource information. Upgrade information will be in Status.

During the upgrade, ```State``` will show ```Updating``` and ```Running Version``` will be the current version:

```output
Status:
  Last Update Time:     2022-09-20T16:01:48.449512Z
  Observed Generation:  1
  Running Version:      v1.10.0_2022-08-09
  State:                Updating
```

When the upgrade is complete, ```State``` will show ```Ready``` and ```Running Version``` will be the new version:

```output
Status:
  Last Update Time:     2022-09-20T16:01:54.279612Z
  Observed Generation:  2
  Running Version:      v1.11.0_2022-09-13
  State:                Ready
```

[!INCLUDE [upgrade-rollback](includes/upgrade-rollback.md)]
