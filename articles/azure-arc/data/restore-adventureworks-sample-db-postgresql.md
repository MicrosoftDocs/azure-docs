---
title: Restore the AdventureWorks sample database to PostgreSQL
description: Restore the AdventureWorks sample database to PostgreSQL
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Restore the AdventureWorks sample database to PostgreSQL

[AdventureWorks](/sql/samples/adventureworks-install-configure) is a sample database containing an OLTP database used in tutorials, and examples. It's provided and maintained by Microsoft as part of the [SQL Server samples GitHub repository](https://github.com/microsoft/sql-server-samples/tree/master/samples/databases).

An open-source project has converted the AdventureWorks database to be compatible with PostgreSQL
- [Original project](https://github.com/lorint/AdventureWorks-for-Postgres)
- [Follow on project that pre-converts the CSV files to be compatible with PostgreSQL](https://github.com/NorfolkDataSci/adventure-works-postgres)

This document describes a simple process to get the AdventureWorks sample database restored into your PostgreSQL instance.

## Download the AdventureWorks backup file

Download the AdventureWorks .sql file into your PostgreSQL instance container. In this example, we'll use the `kubectl exec` command to remotely execute a command in the PostgreSQL instance container to download the file into the container. You could download this file from any location accessible by `curl`. Use this same method if you have other database back up files you want to pull in the PostgreSQL instance container. Once it's in the PostgreSQL instance container, it's easy to create the database, schema, and populate the data.

Run a command like this to download the files replace the value of the pod name and namespace name before you run it:

> [!NOTE]
>  Your container will need to have internet connectivity over 443 to download the file from GitHub

> [!NOTE]
>  Use the pod name with 'r###' at the end not any of the 's###' pod names.  If you are not sure of the pod name run the command `kubectl get pod`

```console
kubectl exec <PostgreSQL pod name> -n <namespace name> -c database  -- /bin/bash -c "cd /tmp && curl -k -O https://raw.githubusercontent.com/microsoft/azure_arc/master/azure_arc_data_jumpstart/aks/arm_template/postgres_hs/AdventureWorks.sql"

#Example:
#kubectl exec postgres02-r000 -n arc -c database -- /bin/bash -c "cd /tmp && curl -k -O https://raw.githubusercontent.com/microsoft/azure_arc/master/azure_arc_data_jumpstart/aks/arm_template/postgres_hs/AdventureWorks.sql"
```

## Restore the AdventureWorks database

Similarly, you can run a `kubectl exec` command to use the `psql` CLI tool that is included in the PostgreSQL instance container to create and load the database.

Run a command like this to create the empty database first, insert the value of the pod name and the namespace name before you run it.

```console
kubectl exec <PostgreSQL pod name> -n <namespace name> -c database -- psql -c 'CREATE DATABASE "adventureworks";'

#Example
#kubectl exec postgres02-r000 -n arc -c database -- psql -c 'CREATE DATABASE "adventureworks";'
```

Then, run a command like this to restore the database. Replace the value of the pod name and the namespace name before you run it.

```console
kubectl exec <PostgreSQL pod name> -n <namespace name> -c database -- psql -d adventureworks -f /tmp/AdventureWorks.sql

#Example
#kubectl exec postgres02-r000 -n arc -c database -- psql -d adventureworks -f /tmp/AdventureWorks.sql
```