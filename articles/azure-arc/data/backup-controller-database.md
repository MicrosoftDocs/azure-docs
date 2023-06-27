---
title: Backup controller database
description: Explains how to backup the controller database for Azure Arc-enabled data services
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 04/26/2023
ms.topic: how-to
---

# Backup controller database 

When you deploy Azure Arc data services, the Azure Arc Data Controller is one of the most critical components of the deployment. The data controller:

- Provisions and deprovisions resources
- Orchestrates most of the activities for Azure Arc-enabled SQL Managed Instance
- Captures the billing and usage information of each Arc SQL managed instance. 

All information such as inventory of all the Arc SQL managed instances, billing, usage and the current state of all these SQL managed instances is stored in a database called `controller` under the SQL Server instance that is deployed into the `controldb-0` pod. 

This article explains how to back up the controller database.

Following steps are needed in order to back up the `controller` database:

1. Retrieve the credentials for the secret
1. Decode the base64 encoded credentials
1. Use the decoded credentials to connect to the SQL instance hosting the controller database, and issue the `BACKUP` command

## Retrieve the credentials for the secret

`controller-db-rw-secret` is the secret that holds the credentials for the `controldb-rw-user` user account that can be used to connect to the SQL instance. 
Run the following command to retrieve the secret contents:

```azurecli
kubectl get secret controller-db-rw-secret --namespace [namespace] -o yaml
```

For example:

```azurecli
kubectl get secret controller-db-rw-secret --namespace arcdataservices -o yaml
```

## Decode the base64 encoded credentials

The contents of the yaml file of the secret `controller-db-rw-secret` contain a `password` and `username`. You can use any base64 decoder tool to decode the contents of the `password`.

## Back up the database

With the decoded credentials, run the following command to issue a T-SQL `BACKUP` command to back up the controller database.

```azurecli
kubectl exec controldb-0 -n contosons -c  mssql-server -- /opt/mssql-tools/bin/sqlcmd -S localhost -U controldb-rw-user -P "<password>" -Q "BACKUP DATABASE [controller] TO  DISK = N'/var/opt/controller.bak' WITH NOFORMAT, NOINIT,  NAME = N'Controldb-Full Database Backup', SKIP, NOREWIND, NOUNLOAD,  STATS = 10, CHECKSUM"
```

Once the backup is created, you can move the `controller.bak` file to a remote storage for any recovery purposes. 

> [!TIP]
> Back up the controller database before and after any custom resource changes such as creating or deleting an Arc-enabled SQL Managed Instance.

## Next steps

[Azure Data Studio dashboards](azure-data-studio-dashboards.md)