---
title: Supported versions PostgreSQL with Azure Arc-enabled PostgreSQL server
description: Supported versions PostgreSQL with Azure Arc-enabled PostgreSQL server
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql
author: dhanmm
ms.author: dhmahaja
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---

# Supported versions of PostgreSQL with Azure Arc-enabled PostgreSQL server
The list of supported versions evolves over time as we progress on ensuring parity with PostgreSQL managed services in Azure PaaS. Today, the major version that is supported is PostgreSQL 14.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## How to choose between versions?
It's recommended you look at what versions your applications have been designed for and what are the capabilities of each of the versions. 
To learn more, read about each version on the official PostgreSQL site:
- [PostgreSQL 14 (default)](https://www.postgresql.org/docs/14/index.html)

## How to create a particular version in Azure Arc-enabled PostgreSQL server?
Currently only PostgreSQL version 14 is supported.

There's only one PostgreSQL Custom Resource Definition (CRD) in your Kubernetes cluster no matter what versions we support.
For example, run the following command:
```console
kubectl get crds
```

It returns an output like:
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

In this example, this output indicates there is one CRD related to PostgreSQL: `postgresqls.arcdata.microsoft.com`, shortname `postgresqls`. The CRD isn't a PostgreSQL server. The presence of a CRD isn't an indication that you have - or not - created a server. The CRD is an indication of what kind of resources can be created in the Kubernetes cluster.

## How can I be notified when other versions are available?
Come back and read this article. It's updated as appropriate.


## Next steps:
- [Read about creating Azure Arc-enabled PostgreSQL server](create-postgresql-server.md)
- [Read about getting a list of the Azure Arc-enabled PostgreSQL servers created in your Arc Data Controller](list-servers-postgresql.md)
