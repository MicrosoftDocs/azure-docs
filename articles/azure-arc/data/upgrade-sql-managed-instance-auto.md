---
title: Enable automatic upgrades - Azure Arc enabled SQL Managed Instance
description: Article describes how to enable automatic upgrades of SQL Managed Instance for Azure Arc
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: grrlgeek
ms.author: jeschult
ms.reviewer: mikeray
ms.date: 01/24/2022
ms.topic: how-to
---

# Enable automatic upgrades of a SQL Managed Instance

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

You can set the `--desired-version` parameter of the `spec.update.desiredVersion` property of an Azure Arc-enabled SQL Managed Instance to `auto` to ensure that your Managed Instance will be upgraded after a data controller upgrade, with no interaction from a user. This allows for ease of management, as you do not need to manually upgrade every instance for every release.

After setting the `--desired-version` parameter of the `spec.update.desiredVersion` property to `auto` the first time, Azure Arc-enabled data service will begin an upgrade to the newest image version within five minutes for the Managed Instance. Thereafter, within five minutes of a data controller being upgraded, the Managed Instance will begin the upgrade process. This works for both directly connected and indirectly connected modes. 

If the `spec.update.desiredVersion` property is pinned to a specific version, automatic upgrades will not take place. This allows you to let most instances automatically upgrade, while manually managing instances that need a more hands-on approach.

## Enable with with Kubernetes tools (kubectl)

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