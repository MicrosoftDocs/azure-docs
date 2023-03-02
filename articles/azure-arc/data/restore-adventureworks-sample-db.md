---
title: Restore the AdventureWorks sample database into SQL Managed Instance
description: Restore the AdventureWorks sample database into SQL Managed Instance
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

# Restore the AdventureWorks sample database into SQL Managed Instance - Azure Arc

[AdventureWorks](/sql/samples/adventureworks-install-configure) is a sample database containing an OLTP database that is often used in tutorials, and examples. It is provided and maintained by Microsoft as part of the [SQL Server samples GitHub repository](https://github.com/microsoft/sql-server-samples/tree/master/samples/databases).

This document describes a simple process to get the AdventureWorks sample database restored into your SQL Managed Instance - Azure Arc.


## Download the AdventureWorks backup file

Download the AdventureWorks backup (.bak) file into your SQL Managed Instance container. In this example, use the `kubectl exec` command to remotely execute a command inside of the SQL Managed Instance container to download the .bak file into the container. Download this file from any location accessible by `wget` if you have other database backup files you want to pull to be inside of the SQL Managed Instance container. Once it is inside of the SQL Managed Instance container it is easy to restore using standard `RESTORE DATABASE` T-SQL.

Run a command like this to download the .bak file substituting the value of the pod name and namespace name before you run it.
> [!NOTE]
>  Your container will need to have internet connectivity over 443 to download the file from GitHub

```console
kubectl exec <SQL pod name> -n <namespace name> -c arc-sqlmi -- wget https://github.com/Microsoft/sql-server-samples/releases/download/adventureworks/AdventureWorks2019.bak -O /var/opt/mssql/data/AdventureWorks2019.bak
```

Example

```console
kubectl exec sqltest1-0 -n arc -c arc-sqlmi -- wget https://github.com/Microsoft/sql-server-samples/releases/download/adventureworks/AdventureWorks2019.bak -O /var/opt/mssql/data/AdventureWorks2019.bak
```

## Restore the AdventureWorks database

Similarly, you can run a `kubectl` exec command to use the `sqlcmd` CLI tool that is included in the SQL Managed Instance container to execute the T-SQL command to RESTORE DATABASE.

Run a command like this to restore the database. Replace the value of the pod name, the password, and the namespace name before you run it.

```console
kubectl exec <SQL pod name> -n <namespace name> -c arc-sqlmi -- /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P <password> -Q "RESTORE DATABASE AdventureWorks2019 FROM  DISK = N'/var/opt/mssql/data/AdventureWorks2019.bak' WITH MOVE 'AdventureWorks2017' TO '/var/opt/mssql/data/AdventureWorks2019.mdf', MOVE 'AdventureWorks2017_Log' TO '/var/opt/mssql/data/AdventureWorks2019_Log.ldf'"
```
Example

```console
kubectl exec sqltest1-0 -n arc -c arc-sqlmi -- /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P MyPassword! -Q "RESTORE DATABASE AdventureWorks2019 FROM DISK = N'/var/opt/mssql/data/AdventureWorks2019.bak' WITH MOVE 'AdventureWorks2017' TO '/var/opt/mssql/data/AdventureWorks2019.mdf', MOVE 'AdventureWorks2017_Log' TO '/var/opt/mssql/data/AdventureWorks2019_Log.ldf'"
```
