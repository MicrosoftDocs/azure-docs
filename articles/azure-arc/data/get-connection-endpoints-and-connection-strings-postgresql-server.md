---
title: Get connection endpoints and create connection strings for your Azure Arc-enabled PostgreSQL server
titleSuffix: Azure Arc-enabled data services
description: Get connection endpoints & create connection strings for your Azure Arc-enabled PostgreSQL server
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql
author: dhanmm
ms.author: dhmahaja
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---

# Get connection endpoints & create the connection strings for your Azure Arc-enabled PostgreSQL server

This article explains how you can retrieve the connection endpoints for your server group and how you can form the connection strings, which can be used with your applications and/or tools.


[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Get connection end points:

Run the following command:
```azurecli
az postgres server-arc endpoint list -n <server name> --k8s-namespace <namespace> --use-k8s
```
For example:
```azurecli
az postgres server-arc endpoint list -n postgres01 --k8s-namespace arc --use-k8s
```

It returns the list of endpoints: the PostgreSQL endpoint, the log search dashboard (Kibana), and the metrics dashboard (Grafana). For example: 

```output
{
  "instances": [
    {
      "endpoints": [
        {
          "description": "PostgreSQL Instance",
          "endpoint": "postgresql://postgres:<replace with password>@12.345.567.89:5432"
        },
        {
          "description": "Log Search Dashboard",
          "endpoint": "https://23.456.78.99:5601/app/kibana#/discover?_a=(query:(language:kuery,query:'custom_resource_name:postgres01'))"
        },
        {
          "description": "Metrics Dashboard",
          "endpoint": "https://34.567.890.12:3000/d/postgres-metrics?var-Namespace=arc&var-Name=postgres01"
        }
      ],
      "engine": "PostgreSql",
      "name": "postgres01"
    }
  ],
  "namespace": "arc"
}
```

Use these end points to:

- Form your connection strings and connect with your client tools or applications
- Access the Grafana and Kibana dashboards from your browser

For example, you can use the end point named _PostgreSQL Instance_ to connect with psql to your server group:

```console
psql postgresql://postgres:MyPassworkd@12.345.567.89:5432
psql (10.14 (Ubuntu 10.14-0ubuntu0.18.04.1), server 12.4 (Ubuntu 12.4-1.pgdg16.04+1))
WARNING: psql major version 10, server major version 12.
         Some psql features might not work.
SSL connection (protocol: TLSv1.2, cipher: ECDHE-RSA-AES256-GCM-SHA384, bits: 256, compression: off)
Type "help" for help.

postgres=#
```
> [!NOTE]
>
> - The password of the _postgres_ user indicated in the end point named "_PostgreSQL Instance_" is the password you chose when deploying the server group.


## From CLI with kubectl

```console
kubectl get postgresqls/<server name> -n <namespace name>
```

For example:
```azurecli
kubectl get postgresqls/postgres01 -n arc
```

Those commands will produce output like the one below. You can use that information to form your connection strings:

```console
NAME         STATE   READY-PODS   PRIMARY-ENDPOINT     AGE
postgres01   Ready   3/3          12.345.567.89:5432   9d
```

## Form connection strings

Use the connections string examples below for your server group. Copy, paste, and customize them as needed:

> [!IMPORTANT]
> SSL is required for client connections. In connection string, the SSL mode parameter should not be disabled. For more information, review [https://www.postgresql.org/docs/14/runtime-config-connection.html](https://www.postgresql.org/docs/14/runtime-config-connection.html).

### ADO.NET

```ado.net
Server=192.168.1.121;Database=postgres;Port=24276;User Id=postgres;Password={your_password_here};Ssl Mode=Require;`
```

### C++ (libpq)

```cpp
host=192.168.1.121 port=24276 dbname=postgres user=postgres password={your_password_here} sslmode=require
```

### JDBC

```jdbc
jdbc:postgresql://192.168.1.121:24276/postgres?user=postgres&password={your_password_here}&sslmode=require
```

### Node.js

```node.js
host=192.168.1.121 port=24276 dbname=postgres user=postgres password={your_password_here} sslmode=require
```

### PHP

```php
host=192.168.1.121 port=24276 dbname=postgres user=postgres password={your_password_here} sslmode=require
```

### psql

```psql
psql "host=192.168.1.121 port=24276 dbname=postgres user=postgres password={your_password_here} sslmode=require"
```

### Python

```python
dbname='postgres' user='postgres' host='192.168.1.121' password='{your_password_here}' port='24276' sslmode='true'
```

### Ruby

```ruby
host=192.168.1.121; dbname=postgres user=postgres password={your_password_here} port=24276 sslmode=require
```

## Related content
- Read about [scaling up or down (increasing/decreasing memory/vcores)](scale-up-down-postgresql-server-using-cli.md) your server group
