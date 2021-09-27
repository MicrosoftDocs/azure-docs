--- 
title: Supported versions Postgres with Azure Arc-enabled PostgreSQL Hyperscale
description: Supported versions Postgres with Azure Arc-enabled PostgreSQL Hyperscale
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# Supported versions of Postgres with Azure Arc-enabled PostgreSQL Hyperscale

This article explains what versions of Postgres are available with Azure Arc-enabled PostgreSQL Hyperscale.
The list of supported versions evolves over time. Today, the major versions that are supported are:
- Postgres 12 (default)
- Postgres 11

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## How to chose between versions?
It is recommend you look at what versions your applications have been designed for and what are the capabilities of each of the versions. 
To learn more, read about each version on the official Postgres site:
- [Postgres 12 (default)](https://www.postgresql.org/docs/12/index.html)
- [Postgres 11](https://www.postgresql.org/docs/11/index.html)

## How to create a particular version in Azure Arc-enabled PostgreSQL Hyperscale?
At creation time, you have the possibility to indicate what version to create by passing the _--engine-version_ parameter. 
If you do not indicate a version information, by default, a server group of Postgres version 12 will be created.

## How can I be notified when other versions are available?
Come back and read this article. It will be updated as appropriate. You can also list the kinds of custom resource definitions (CRD) in the Arc Data Controller in your Kubernetes cluster.
Run the following command:
```console
kubectl get crds
```

It will return an output like:
```console
NAME                                            CREATED AT
datacontrollers.arcdata.microsoft.com           2020-08-31T20:15:16Z
postgresql-11s.arcdata.microsoft.com            2020-08-31T20:15:16Z
postgresql-12s.arcdata.microsoft.com            2020-08-31T20:15:16Z
sqlmanagedinstances.sql.arcdata.microsoft.com   2020-08-31T20:15:16Z
```

In this example, this output indicates there are two kinds of CRD related to Postgres:
- postgresql-12s.arcdata.microsoft.com is the CRD for Postgres 12
- postgresql-11s.arcdata.microsoft.com is the CRD for Postgres 11

These are CRDs, not server groups. The presence of a CRD is not an indication that you have - or not - created a server group of that version.
The CRD is an indication of what kind of resources can be created.

## Next steps:
- [Read about creating Azure Arc-enabled PostgreSQL Hyperscale](create-postgresql-hyperscale-server-group.md)
- [Read about getting a list of the Azure Arc-enabled PostgreSQL Hyperscale server groups created in your Arc Data Controller](list-server-groups-postgres-hyperscale.md)
