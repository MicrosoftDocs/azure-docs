--- 
title: List the Azure Arc enabled PostgreSQL Hyperscale server groups created in an Azure Arc Data Controller
description: List the Azure Arc enabled PostgreSQL Hyperscale server groups created in an Azure Arc Data Controller
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# List the Azure Arc enabled PostgreSQL Hyperscale server groups created in an Azure Arc Data Controller

This article explains how you can retrieve the list of server groups created in your Arc Data Controller.

To retrieve this list, use either of the following methods once you are connected to the Arc Data Controller:

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## From CLI with azdata
The general format of the command is:
```console
azdata arc postgres server list
```

It will return an output like:
```console
Name        State    Workers
----------  -------  ---------
postgres01  Ready    2
postgres02  Ready    2
```
For more details about the parameters available for this command, run:
```console
azdata arc postgres server list --help
```

## From CLI with kubectl
Run either of the following commands.

**To list the server groups irrespective of the version of Postgres, run:**
```console
kubectl get postgresqls
```
It will return an output like:
```console
NAME                                             STATE   READY-PODS   EXTERNAL-ENDPOINT   AGE
postgresql-12.arcdata.microsoft.com/postgres01   Ready   3/3          10.0.0.4:30499      51s
postgresql-12.arcdata.microsoft.com/postgres02   Ready   3/3          10.0.0.4:31066      6d
```

**To list the server groups of a specific version of Postgres, run:**
```console
kubectl get postgresql-12
```

To list the server groups running the version 11 of Postgres, replace _postgresql-12_ with _postgresql-11_.

## Next steps:

* [Read the article about how to get the connection end points and form the connection strings to connect to your server group](get-connection-endpoints-and-connection-strings-postgres-hyperscale.md)
* [Read the article about showing the configuration of an Azure Arc enabled PostgreSQL Hyperscale server group](show-configuration-postgresql-hyperscale-server-group.md)
