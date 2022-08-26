---
title: Configure Postgres engine server parameters for your PostgreSQL Hyperscale server group on Azure Arc
titleSuffix: Azure Arc-enabled data services
description: Configure Postgres engine server parameters for your PostgreSQL Hyperscale server group on Azure Arc
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql
author: grrlgeek
ms.author: jeschult
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---

# Set the database engine settings for Azure Arc-enabled PostgreSQL Hyperscale

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

## Show current custom values if they have been set

**With an Az CLI command:**

```azurecli
az postgres arc-server show -n <server group name> --k8s-namespace <namespace> --use-k8s
```

For example:

```azurecli
az postgres arc-server show -n postgres01 --k8s-namespace arc --use-k8s 
```


**Or with a kubectl command:**
```console
   kubectl describe postgresql <server group name> -n <namespace name>
   ```

   For example:

   ```console
   kubectl describe postgresql postgres01 -n arc
```

Both these commands returns the specs of the server group in which you would see the parameters you set. If there is no engine\settings section, it means that all parameters are running on their default value:

:::row:::
    :::column:::
        Example of an output when no custom values have been set for any of the Postgres engine settings. The specs do not show a section engine\settings.
    :::column-end:::
    :::column:::
        ```console
          ...
          "spec": {
            "dev": false,
            "engine": {
              "extensions": [
                {
                  "name": "citus"
                }
              ],
              "version": 12
            },
            "scale": {
              "replicas": 1,
              "syncReplicas": "0",
          "workers": 4
            },
            ...
        ```
        :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        Example of an output when custom values have been set for some of Postgres engine setting. The specs do show a section engine\settings.
    :::column-end:::
    :::column:::
        ```console
             ...
                Spec:
                  Dev:  false
                  Engine:
                    Extensions:
                      Name:  citus
                    Settings:
                      Default:
                        max_connections:  51
                      Roles:
                        Coordinator:
                          max_connections:  53
                        Worker:
                          max_connections:  52
                    Version:                12
                  Scale:
                    Replicas:       1
                    Sync Replicas:  0
                    Workers:        4
            ...
            ```
    :::column-end:::
:::row-end:::


The default value is, refer to the PostgreSQL documentation [here](https://www.postgresql.org/docs/current/runtime-config.html).



## Set custom values for engine settings

### Set a single parameter

**On both coordinator and worker roles:**

General syntax of the command:
```azurecli
az postgres arc-server edit -n <servergroup name> --engine-settings  '<ParameterName>=<CustomParameterValue>' --k8s-namespace <namespace> --use-k8s
```

For example:
```azurecli
az postgres arc-server edit -n postgres01 --engine-settings  'max_connections=51' --k8s-namespace arc --use-k8s
```

**On the worker role only:**

General syntax of the command:
```azurecli
az postgres arc-server edit -n <servergroup name> --worker-settings '<ParameterName>=<CustomParameterValue>' --k8s-namespace <namespace> --use-k8s
```

For example:
```azurecli
az postgres arc-server edit -n postgres01 --worker-settings 'max_connections=52' --k8s-namespace arc --use-k8s
```

**On the coordinator role only:**

General syntax of the command:
```azurecli
az postgres arc-server edit -n <servergroup name> --coordinator-settings '<ParameterName>=<CustomParameterValue>' --k8s-namespace <namespace> --use-k8s
```

For example:
```azurecli
az postgres arc-server edit -n postgres01 --coordinator-settings 'max_connections=53' --k8s-namespace arc --use-k8s
```



### Set multiple parameters with a single command

**On both coordinator and worker roles:**  
 
General syntax of the command:
```azurecli
az postgres arc-server edit -n <servergroup name> --engine-settings  '<ParameterName1>=<CustomParameterValue1>, ..., <ParameterNameN>=<CustomParameterValueN>' --k8s-namespace <namespace> --use-k8s
```

For example:
```azurecli
az postgres arc-server edit -n postgres01 --engine-settings  'shared_buffers=8MB, max_connections=60' --k8s-namespace arc --use-k8s
```

**On the worker role only:**

General syntax of the command:
```azurecli
az postgres arc-server edit -n <servergroup name> --worker-settings '<ParameterName1>=<CustomParameterValue1>, ..., <ParameterNameN>=<CustomParameterValueN>' --k8s-namespace <namespace> --use-k8s
```

For example:
```azurecli
az postgres arc-server edit -n postgres01 --worker-settings 'shared_buffers=8MB, max_connections=60' --k8s-namespace arc --use-k8s
```

**On the coordinator role only:**

General syntax of the command:
```azurecli
az postgres arc-server edit -n <servergroup name> --coordinator-settings '<ParameterName1>=<CustomParameterValue1>, ..., <ParameterNameN>=<CustomParameterValueN>' --k8s-namespace <namespace> --use-k8s
```

For example:
```azurecli
az postgres arc-server edit -n postgres01 --coordinator-settings 'shared_buffers=8MB, max_connections=60' --k8s-namespace arc --use-k8s
```

### Reset one parameter to its default value

**On both coordinator and worker roles:**

General syntax of the command:
```azurecli
az postgres arc-server edit -n <servergroup name> --engine-settings '<ParameterName>='  --coordinator-settings '<ParameterName>=' --worker-settings '<ParameterName>=' --k8s-namespace <namespace> --use-k8s
```
For example:
```azurecli
az postgres arc-server edit -n postgres01 --engine-settings  'shared_buffers='  --coordinator-settings 'shared_buffers=' --worker-settings 'shared_buffers=' --k8s-namespace arc --use-k8s
```

**On the coordinator role only:**

General syntax of the command:
```azurecli
az postgres arc-server edit -n <servergroup name> --coordinator-settings '<ParameterName>=' --k8s-namespace <namespace> --use-k8s
```
For example:
```azurecli
az postgres arc-server edit -n postgres01 --coordinator-settings 'shared_buffers=' --k8s-namespace arc --use-k8s
```

**On the worker role only:**

General syntax of the command:
```azurecli
az postgres arc-server edit -n <servergroup name> --worker-settings '<ParameterName>=' --k8s-namespace <namespace> --use-k8s
```
For example:
```azurecli
az postgres arc-server edit -n postgres01 --worker-settings 'shared_buffers=' --k8s-namespace arc --use-k8s
````

### Reset all parameters to their default values

**On both coordinator and worker roles:**

General syntax of the command:
```azurecli
az postgres arc-server edit -n <servergroup name> --engine-settings  `'`' --worker-settings `'`' --coordinator-settings `'`' --replace-settings --k8s-namespace <namespace> --use-k8s
```

For example:
```azurecli
az postgres arc-server edit -n postgres01 --engine-settings  `'`' --worker-settings `'`' --coordinator-settings `'`'  --replace-settings --k8s-namespace arc --use-k8s
```

**On the coordinator role only:**

General syntax of the command:
```azurecli
az postgres arc-server edit -n <servergroup name> --coordinator-settings `'`'  --replace-settings --k8s-namespace <namespace> --use-k8s

```
For example:
```azurecli
az postgres arc-server edit -n postgres01 --coordinator-settings `'`'  --replace-settings --k8s-namespace arc --use-k8s
```

**On the worker role only:**

General syntax of the command:
```azurecli
az postgres arc-server edit -n <servergroup name> --worker-settings `'`'  --replace-settings --k8s-namespace <namespace> --use-k8s
```
For example:
```azurecli
az postgres arc-server edit -n postgres01 --worker-settings `'`'  --replace-settings --k8s-namespace arc --use-k8s
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
