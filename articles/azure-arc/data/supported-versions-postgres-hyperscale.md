---
title: Supported versions Postgres with Azure Arc-enabled PostgreSQL Hyperscale
description: Supported versions Postgres with Azure Arc-enabled PostgreSQL Hyperscale
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql
author: grrlgeek
ms.author: jeschult
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---

# Supported versions of Postgres with Azure Arc-enabled PostgreSQL Hyperscale
The list of supported versions evolves over time as we progress on ensuring parity with Postgres managed services in Azure PaaS. Today, the major versions that are supported are:
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

Note that there is only one Postgres Custom Resource Definition (CRD) in your Kubernetes cluster no matter what versions we support.
For example, run the following command:
```console
kubectl get crds
```

It will return an output like:
```console
NAME                                                             CREATED AT
dags.sql.arcdata.microsoft.com                                   2021-10-12T23:53:40Z
datacontrollers.arcdata.microsoft.com                            2021-10-13T01:00:27Z
exporttasks.tasks.arcdata.microsoft.com                          2021-10-12T23:53:39Z
healthstates.azmon.container.insights                            2021-10-12T19:04:44Z
monitors.arcdata.microsoft.com                                   2021-10-13T01:00:26Z
postgresqls.arcdata.microsoft.com                                2021-10-12T23:53:37Z
sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com   2021-10-12T23:53:38Z
sqlmanagedinstances.sql.arcdata.microsoft.com                    2021-10-12T23:53:37Z
```

In this example, this output indicates there are one CRD related to Postgres: postgresqls.arcdata.microsoft.com, shortname postgresqls. The CRD is not a Postgres instance or a Postgres server group. The presence of a CRD is not an indication that you have - or not - created a server group. The CRD is an indication of what kind of resources can be created in the Kubernetes cluster.

## How can I be notified when other versions are available?
Come back and read this article. It will be updated as appropriate.


## Next steps:
- [Read about creating Azure Arc-enabled PostgreSQL Hyperscale](create-postgresql-hyperscale-server-group.md)
- [Read about getting a list of the Azure Arc-enabled PostgreSQL Hyperscale server groups created in your Arc Data Controller](list-server-groups-postgres-hyperscale.md)
