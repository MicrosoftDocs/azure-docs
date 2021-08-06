--- 
title: Get connection endpoints and form the connection strings for your Azure Arc–enabled PostgreSQL Hyperscale server group
titleSuffix: Azure Arc–enabled data services
description: Get connection endpoints and form connection strings for your Azure Arc–enabled PostgreSQL Hyperscale server group
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

# Get connection endpoints and form the connection strings for your Azure Arc–enabled PostgreSQL Hyperscale server group

This article explains how you can retrieve the connection endpoints for your server group and how you can form the connection strings which can be used with your applications and/or tools.


[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Get connection end points:

Run the following command:
```azurecli
az postgres arc-server endpoint list -n <server group name> --k8s-namespace <namespace> --use-k8s
```
For example:
```azurecli
az postgres arc-server endpoint list -n postgres01 --k8s-namespace <namespace> --use-k8s
```

It shows the list of endpoints: the PostgreSQL endpoint that you use to connect your application and use the database, Kibana and Grafana endpoints for log analytics and monitoring. For example: 
```console
Arc
 ===================================================================================================================
 Postgres01 Instance
 -------------------------------------------------------------------------------------------------------------------
 Description           Endpoint

 PostgreSQL Instance   postgresql://postgres:<replace with password>@12.345.567.89:5432
 Log Search Dashboard  https://89.345.712.81:30777/kibana/app/kibana#/discover?_a=(query:(language:kuery,query:'custom_resource_name:postgres01'))
 Metrics Dashboard     https://89.345.712.81:30777/grafana/d/postgres-metrics?var-Namespace=arc&var-Name=postgres01

```
Use these end points to:
- Form your connection strings and connect with your client tools or applications
- Access the Grafana and Kibana dashboards from your browser

For example, you can use the end point named _PostgreSQL Instance_ to connect with psql to your server group. For example:
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
> _ERROR: (401)_
> _Reason: Unauthorized_
> _HTTP response headers: HTTPHeaderDict({'Date': 'Sun, 06 Sep 2020 16:58:38 GMT', 'Content-Length': '0', 'WWW-Authenticate': '_
> _Basic realm="Login_ credentials required", Bearer error="invalid_token", error_description="The token is expired"'})_
> When this happens, you need to reconnect with azdata as explained above.

## From CLI with kubectl
```console
kubectl get postgresqls/<server group name> -n <namespace name>
```

Those commands will produce output like the one below. You can use that information to form your connection strings:
```console
NAME         STATE   READY-PODS   EXTERNAL-ENDPOINT   AGE
postgres01   Ready   3/3          123.456.789.4:31066      5d20h
``` 

## Form connection strings:
Use the below table of templates of connections strings for your server group. You can then copy/paste and customize them as further needed:

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

## Next steps
- Read about [scaling out (adding worker nodes)](scale-out-in-postgresql-hyperscale-server-group.md) your server group
- Read about [scaling up or down (increasing/decreasing memory/vcores)](scale-up-down-postgresql-hyperscale-server-group-using-cli.md) your server group
