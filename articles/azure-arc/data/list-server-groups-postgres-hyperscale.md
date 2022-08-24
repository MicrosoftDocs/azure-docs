---
title: List the Azure Arc-enabled PostgreSQL Hyperscale server groups created in an Azure Arc Data Controller
description: List the Azure Arc-enabled PostgreSQL Hyperscale server groups created in an Azure Arc Data Controller
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql
author: grrlgeek
ms.author: jeschult
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---

# List the Azure Arc-enabled PostgreSQL Hyperscale server groups created in an Azure Arc Data Controller

This article explains how you can retrieve the list of server groups created in your Arc Data Controller.

To retrieve this list, use either of the following methods once you are connected to the Arc Data Controller:

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## From CLI with Azure CLI extension (az)

The general format of the command is:
```azurecli
az postgres arc-server list --k8s-namespace <namespace> --use-k8s
```

It will return an output like:
```console
[
  {
    "name": "postgres01",
    "replicas": 1,
    "state": "Ready",
    "workers": 4
  }
]
```
For more details about the parameters available for this command, run:
```azurecli
az postgres arc-server list --help
```

## From CLI with kubectl
Run either of the following commands.

**To list the server groups irrespective of the version of Postgres, run:**
```console
kubectl get postgresqls -n <namespace>
```
It will return an output like:
```console
NAME         STATE   READY-PODS   PRIMARY-ENDPOINT     AGE
postgres01   Ready   5/5          12.345.67.890:5432   12d
```

## Next steps:

* [Read the article about how to get the connection end points and form the connection strings to connect to your server group](get-connection-endpoints-and-connection-strings-postgres-hyperscale.md)
* [Read the article about showing the configuration of an Azure Arc-enabled PostgreSQL Hyperscale server group](show-configuration-postgresql-hyperscale-server-group.md)
