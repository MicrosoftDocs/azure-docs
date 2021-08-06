--- 
title: Configure Postgres engine server parameters for your PostgreSQL Hyperscale server group on Azure Arc
titleSuffix: Azure Arc—enabled data services
description: Configure Postgres engine server parameters for your PostgreSQL Hyperscale server group on Azure Arc
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

# Set the database engine settings for Azure Arc—enabled PostgreSQL Hyperscale

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

```azurecli
az postgres arc-server edit -n <server group name>, [{--engine-settings, -e}] [{--replace-settings , --re}] {'<parameter name>=<parameter value>, ...'} --k8s-namespace <namespace> --use-k8s
```

## Show current custom values

### With [!INCLUDE [azure-data-cli-azdata](../../../includes/azure-data-cli-azdata.md)] command

```azurecli
az postgres arc-server show -n <server group name> --k8s-namespace <namespace> --use-k8s
```

For example:

```azurecli
az postgres arc-server show -n postgres01 --k8s-namespace <namespace> --use-k8s 
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

### With kubectl command

Follow the below steps.

1. Retrieve the kind of custom resource definition for your server group

   Run:

   ```azurecli
   az postgres arc-server show -n <server group name> --k8s-namespace <namespace> --use-k8s
   ```

   For example:

   ```azurecli
   az postgres arc-server show -n postgres01 --k8s-namespace <namespace> --use-k8s
   ```

   This command returns the spec of the server group in which you would see the parameters you set. If there is no engine\settings section, it means that all parameters are running on their default value:

   ```output
   > {
     >"apiVersion": "arcdata.microsoft.com/v1alpha1",
     >"**kind**": "**postgresql-12**",
     >"metadata": {
       >"creationTimestamp": "2020-08-25T14:32:23Z",
       >"generation": 1,
       >"name": "postgres01",
       >"namespace": "arc",  
   ```

   In the output results, look for the field `kind` and set aside the value, for example: `postgresql-12`.

2. Describe the Kubernetes custom resource corresponding to your server group 

   The general format of the command is:

   ```console
   kubectl describe <kind of the custom resource> <server group name> -n <namespace name>
   ```

   For example:

   ```console
   kubectl describe postgresql-12 postgres01
   ```

   If there are custom values set for the engine settings, it returns them. For example:

   ```output
   Engine:
   ...
    Settings:
      Default:
        autovacuum_vacuum_threshold:  65
   ```

   If you have not set custom values for any of the engine settings, the Engine Settings section of the `resultset` will be empty like:

   ```output
   Engine:
   ...
       Settings:
         Default:
   ```

## Set custom values for engine settings

The below commands set the parameters of the Coordinator node and the Worker nodes of your PostgreSQL Hyperscale to the same values. It is not yet possible to set parameters per role in your server group. That is, it is not yet possible to configure a given parameter to a specific on the Coordinator node and to another value for the Worker nodes.

### Set a single parameter

```azurecli
az postgres arc-server edit -n <server group name> --engine-settings  <parameter name>=<parameter value> --k8s-namespace <namespace> --use-k8s
```

For example:

```azurecli
az postgres arc-server edit -n postgres01 --engine-settings  shared_buffers=8MB --k8s-namespace <namespace> --use-k8s
```

### Set multiple parameters with a single command

```azurecli
az postgres arc-server edit -n <server group name> --engine-settings  '<parameter name>=<parameter value>, <parameter name>=<parameter value>, --k8s-namespace <namespace> --use-k8s...'
```

For example:

```azurecli
az postgres arc-server edit -n postgres01 --engine-settings  'shared_buffers=8MB, max_connections=50' --k8s-namespace <namespace> --use-k8s
```

### Reset a parameter to its default value

To reset a parameter to its default value, set it without indicating a value. 

For example:

```azurecli
az postgres arc-server edit -n postgres01 --k8s-namespace <namespace> --use-k8s --engine-settings  shared_buffers=
```

### Reset all parameters to their default values

```azurecli
az postgres arc-server edit -n <server group name> --engine-settings  '' -re --k8s-namespace <namespace> --use-k8s
```

For example:

```azurecli
az postgres arc-server edit -n postgres01 --engine-settings  '' -re --k8s-namespace <namespace> --use-k8s
```

## Special considerations

### Set a parameter which value contains a comma, space, or special character

```azurecli
az postgres arc-server edit -n <server group name> --engine-settings  '<parameter name>="<parameter value>"' --k8s-namespace <namespace> --use-k8s
```

For example:

```azurecli
az postgres arc-server edit -n postgres01 --engine-settings  'custom_variable_classes = "plpgsql,plperl"' --k8s-namespace <namespace> --use-k8s
```

### Pass an environment variable in a parameter value

The environment variable should be wrapped inside "''" so that it doesn't get resolved before it's set.

For example: 

```azurecli
az postgres arc-server edit -n postgres01 --engine-settings  'search_path = "$user"' --k8s-namespace <namespace> --use-k8s
```

## Next steps
- Read about [scaling out (adding worker nodes)](scale-out-in-postgresql-hyperscale-server-group.md) your server group
- Read about [scaling up or down (increasing/decreasing memory/vcores)](scale-up-down-postgresql-hyperscale-server-group-using-cli.md) your server group
