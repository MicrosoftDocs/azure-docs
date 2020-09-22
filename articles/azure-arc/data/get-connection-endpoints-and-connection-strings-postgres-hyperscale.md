--- 
title: Get connection endpoints and form connection strings for your Arc enabled PostgreSQL Hyperscale server group
titleSuffix: Azure Arc enabled data services
description: Get connection endpoints and form connection strings for your Arc enabled PostgreSQL Hyperscale server group
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# Get connection endpoints and form connection strings for your Arc enabled PostgreSQL Hyperscale server group

This article explains how you can retrieve the connection endpoints for your server group and how you form connection strings you will use with your applications and/or tools.


[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Get connection end points:

### From CLI with azdata
#### 1. Connect to your Arc Data Controller:
- If you already have a session opened on the host of the Arc Data Controller:
Run the following command:
```console
azdata login
```

- If you do not have a session opened on the host of the Arc Data Controller:
run the following command 
```console
azdata login --endpoint https://<external IP address of host/data controller>:30080
```

#### 2. Show the connection endpoints
Run the following command:
```console
azdata arc postgres endpoint list -n <server group name>
```
It returns an output like:
```console
[
  {
    "Description": "PostgreSQL Instance",
    "Endpoint": "postgresql://postgres:<replace with password>@12.345.123.456:1234"
  },
  {
    "Description": "Log Search Dashboard",
    "Endpoint": "https://12.345.123.456:12345/kibana/app/kibana#/discover?_a=(query:(language:kuery,query:'custom_resource_name:\"postgres01\"'))"
  },
  {
    "Description": "Metrics Dashboard",
    "Endpoint": "https://12.345.123.456:12345/grafana/d/postgres-metrics?var-Namespace=arc3&var-Name=postgres01"
  }
]
```
Use these end points to:
- Form your connection strings and connect with your client tools or applications
- Access the Grafana and Kibana dashboards from your browser

For example, you can use the end point named _PostgreSQL Instance_ to connect with psql to your server group. For example:
```console
psql postgresql://postgres:MyPassworkd@12.345.123.456:1234
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
> - About azdata: the lease associated to your connection lasts about 10 hours. After that you need to reconnect. If your lease has expired, you will get the following error message when you try to execute a command with azdata (other than azdata login):
> _ERROR: (401)_
> _Reason: Unauthorized_
> _HTTP response headers: HTTPHeaderDict({'Date': 'Sun, 06 Sep 2020 16:58:38 GMT', 'Content-Length': '0', 'WWW-Authenticate': '_
> _Basic realm="Login_ credentials required", Bearer error="invalid_token", error_description="The token is expired"'})_
> When this happens, you need to reconnect with azdata as explained above.

## From CLI with kubectl
- If your server group is of Postgres version 12 (default), then the following command:
```console
kubectl get postgresql-12/<server group name>
```
- If your server group is of Postgres version 11, then the following command:
```console
kubectl get postgresql-11/<server group name>
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

### Web App

```webapp
Database=postgres; Data Source=192.168.1.121; User Id=postgres; Password={your_password_here}
```

## Next steps
- Read about [scaling out (adding worker nodes)](scale-out-postgresql-hyperscale-server-group.md) your server group
- Read about [scaling up or down (increasing/decreasing memory/vcores)](scale-up-down-postgresql-hyperscale-server-group-using-cli.md) your server group


