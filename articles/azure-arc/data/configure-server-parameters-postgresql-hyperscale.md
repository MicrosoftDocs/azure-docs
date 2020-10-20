--- 
title: Configure Postgres engine server parameters for your PostgreSQL Hyperscale server group on Azure Arc
titleSuffix: Azure Arc enabled data services
description: Configure Postgres engine server parameters for your PostgreSQL Hyperscale server group on Azure Arc
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# Set the database engine settings for Azure Arc enabled PostgreSQL Hyperscale

This document describes the steps to set the database engine settings of your PostgreSQL Hyperscale server group to custom (non-default) values. For details about what database engine parameters can be set and what their default value is, refer to the PostgreSQL documentation [here](https://www.postgresql.org/docs/current/runtime-config.html).

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

> [!NOTE]
> Preview does not support setting the following parameters: 
>
> - `archive_command`
> - `archive_timeout`
> - `log_directory`
> - `log_file_mode`
> - `log_filename`
> - `restore_command`
> - `shared_preload_libraries`
> - `synchronous_commit`
> - `ssl`
> - `wal_level`

## Syntax

The general format of the command to configure the database engine settings is:

```console
azdata arc postgres server edit -n <server group name>, [{--engine-settings, -e}] [{--replace-engine-settings, --re}] {'<parameter name>=<parameter value>, ...'}
```

## Show the current custom values of the parameters settings

## With [!INCLUDE [azure-data-cli-azdata](../../../includes/azure-data-cli-azdata.md)] command

```console
azdata arc postgres server show -n <server group name>
```

For example:

```console
azdata arc postgres server show -n postgres01
```

This command returns the spec of the server group in which you would see the parameters you set. If there is no engine\settings section, it means that all parameters are running on their default value:

```console
 "
...
engine": {
      "settings": {
        "default": {
          "autovacuum_vacuum_threshold": "65"
        }
      }
    },
...
```

## With kubectl command

Follow the below steps.

### 1. Retrieve the kind of custom resource definition for your server group

Run:

```console
azdata arc postgres server show -n <server group name>
```

For example:

```console
azdata arc postgres server show -n postgres01
```

This command returns the spec of the server group in which you would see the parameters you set. If there is no engine\settings section, it means that all parameters are running on their default value:

```
> {
  >"apiVersion": "arcdata.microsoft.com/v1alpha1",
  >"**kind**": "**postgresql-12**",
  >"metadata": {
    >"creationTimestamp": "2020-08-25T14:32:23Z",
    >"generation": 1,
    >"name": "postgres01",
    >"namespace": "arc",
```

In there, look for the field "kind" and set aside the value, for example: `postgresql-12`.

### 2. Describe the Kubernetes custom resource corresponding to your server group 

The general format of the command is:

```console
kubectl describe <kind of the custom resource> <server group name> -n <namespace name>
```

For example:

```console
kubectl describe postgresql-12 postgres01
```

If there are custom values set for the engine settings, it will return them. For example:

```console
Engine:
...
    Settings:
      Default:
        autovacuum_vacuum_threshold:  65
```

If you have not set custom values for any of the engine settings, the Engine Settings section of the resultset will be empty like:

```console
Engine:
...
    Settings:
      Default:
```

## Set custom values for the engine settings

The below commands set the parameters of the Coordinator node and the Worker nodes of your PostgreSQL Hyperscale to the same values. It is not yet possible to set parameters per role in your server group. That is, it is not yet possible to configure a given parameter to a specific on the Coordinator node and to another value for the Worker nodes.

## Set a single parameter

```console
azdata arc server edit -n <server group name> -e <parameter name>=<parameter value>
```

For example:

```console
azdata arc postgres server edit -n postgres01 -e shared_buffers=8MB
```

## Set multiple parameters with a single command

```console
azdata arc postgres server edit -n <server group name> -e '<parameter name>=<parameter value>, <parameter name>=<parameter value>,...'
```

For example:

```console
azdata arc postgres server edit -n postgres01 -e 'shared_buffers=8MB, max_connections=50'
```

## Reset a parameter to its default value

To reset a parameter to its default value, set it without indicating a value. 

For example:

```console
azdata arc postgres server edit -n postgres01 -e shared_buffers=
```

## Reset all parameters to their default values

```console
azdata arc postgres server edit -n <server group name> -e '' -re
```

For example:

```console
azdata arc postgres server edit -n postgres01 -e '' -re
```

## Special considerations

### Set a parameter which value contains a comma, space, or special character

```console
azdata arc postgres server edit -n <server group name> -e '<parameter name>="<parameter value>"'
```

For example:

```console
azdata arc postgres server edit -n postgres01 -e 'custom_variable_classes = "plpgsql,plperl"'
```

### Pass an environment variable in a parameter value

The environment variable should be wrapped inside "''" so that it doesn't get resolved before it's set.

For example: 

```console
azdata arc postgres server edit -n postgres01 -e 'search_path = "$user"'
```



## Next steps
- Read about [scaling out (adding worker nodes)](scale-out-postgresql-hyperscale-server-group.md) your server group
- Read about [scaling up or down (increasing/decreasing memory/vcores)](scale-up-down-postgresql-hyperscale-server-group-using-cli.md) your server group
