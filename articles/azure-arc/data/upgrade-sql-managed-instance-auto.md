---
title: Enable automatic upgrades - Azure SQL Managed Instance for Azure Arc
description: Article describes how to enable automatic upgrades for Azure SQL Managed Instance deployed for Azure Arc
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 05/27/2022
ms.topic: how-to
---

# Enable automatic upgrades of an Azure SQL Managed Instance for Azure Arc


You can set the `--desired-version` parameter of the `spec.update.desiredVersion` property of a SQL Managed Instance enabled by Azure Arc to `auto` to ensure that your managed instance will be upgraded after a data controller upgrade, with no interaction from a user. This setting simplifies management, as you don't need to manually upgrade every instance for every release.

After setting the `--desired-version` parameter of the `spec.update.desiredVersion` property to `auto` the first time, the Azure Arc-enabled data service will begin an upgrade of the managed instance to the newest image version within five minutes, or within the next [Maintenance Window](maintenance-window.md). Thereafter, within five minutes of a data controller being upgraded, or within the next maintenance window, the managed instance will begin the upgrade process. This setting works for both directly connected and indirectly connected modes.

If the `spec.update.desiredVersion` property is pinned to a specific version, automatic upgrades won't take place. This property allows you to let most instances automatically upgrade, while manually managing instances that need a more hands-on approach.

## Prerequisites

Your managed instance version must be equal to the data controller version before enabling auto mode.

## Enable with Kubernetes tools (kubectl)

Use kubectl to view the existing spec in yaml.

```console
kubectl --namespace <namespace> get sqlmi <sqlmi-name> --output yaml
```

Run `kubectl patch` to set `desiredVersion` to `auto`.

```console
kubectl patch sqlmi <sqlmi-name> --namespace <namespace> --type merge --patch '{"spec": {"update": {"desiredVersion": "auto"}}}'
```

## Enable with CLI

To set the `--desired-version` to `auto`, use the following command:

Indirectly connected:

````cli
az sql mi-arc upgrade --name <instance name> --desired-version auto --k8s-namespace <namespace> --use-k8s
````

Example:

````cli
az sql mi-arc upgrade --name instance1 --desired-version auto --k8s-namespace arc1 --use-k8s
````

Directly connected:

````cli
az sql mi-arc upgrade --resource-group <resource group> --name <instance name> --desired-version auto [--no-wait]
````

Example:

````cli
az sql mi-arc upgrade --resource-group rgarc --name instance1 --desired-version auto 
````
