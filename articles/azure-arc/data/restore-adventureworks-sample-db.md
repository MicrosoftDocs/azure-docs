---
title: Restore the AdventureWorks sample database into SQL managed instance
description: Restore the AdventureWorks sample database into SQL managed instance
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Restore the AdventureWorks sample database into SQL managed instance

[AdventureWorks](https://docs.microsoft.com/en-us/sql/samples/adventureworks-install-configure?view=sql-server-ver15&tabs=tsql) is a sample database containing an OLTP database that is oftentimes used in tutorials, examples, etc.  It is provided and maintained by Microsoft as part of the [SQL Server samples GitHub repository](https://github.com/microsoft/sql-server-samples/tree/master/samples/databases).

This document describes a simple process to get the AdventureWorks sample database restored into your SQL managed instance.

## Step 1: Download the AdventureWorks backup file

Download the AdventureWorks backup (.bak) file into your SQL managed instance container.  In this example, we'll use the kubectl exec command to remotely execute a command inside of the SQL managed instance container to download the .bak file into the container.  You could do this from any location accessible by wget if you have other database backup files you want to pull to be inside of the SQL managed instance container.  Once it is inside of the SQL managed instance container it is easy to restore using standard RESTORE DATABASE T-SQL.

Run a command like this to download the .bak file substituting the value of the pod name and namespace name before you run it.
> [!NOTE]
>  Your container will need to have internet connectivity over 443 to download the file from GitHub

```terminal
kubectl exec <SQL pod name> -n <namespace name> -c mssql-miaa -- wget https://github.com/Microsoft/sql-server-samples/releases/download/adventureworks/AdventureWorks2019.bak -O /var/opt/mssql/data/AdventureWorks2019.bak

#Example:
#kubectl exec sqltest1-0 -n arc -c mssql-miaa -- wget https://github.com/Microsoft/sql-server-samples/releases/download/adventureworks/AdventureWorks2019.bak -O /var/opt/mssql/data/AdventureWorks2019.bak
```

## Step 2: Restore the AdventureWorks database

Similarly, you can run a kubectl exec command to use the sqlcmd CLI tool that is included in the SQL managed instance container to execute the T-SQL command to RESTORE DATABASE.

Run a command like this to restore the database substituting the value of the pod name, **the password**, and the namespace name before you run it.

```terminal
kubectl exec <SQL pod name> -n <namespace name> -c mssql-miaa -- /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P <password> -Q "RESTORE DATABASE AdventureWorks2019 FROM  DISK = N'/var/opt/mssql/data/AdventureWorks2019.bak' WITH MOVE 'AdventureWorks2017' TO '/var/opt/mssql/data/AdventureWorks2019.mdf', MOVE 'AdventureWorks2017_Log' TO '/var/opt/mssql/data/

#Example
#kubectl exec sqltest1-0 -n arc -- -c mssql-miaa /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P MyPassword! -Q "RESTORE DATABASE AdventureWorks2019 FROM  DISK = N'/var/opt/mssql/data/AdventureWorks2019.bak' WITH MOVE 'AdventureWorks2017' TO '/var/opt/mssql/data/AdventureWorks2019.mdf', MOVE 'AdventureWorks2017_Log' TO '/var/opt/mssql/data/AdventureWorks2019_Log.ldf'"
```
