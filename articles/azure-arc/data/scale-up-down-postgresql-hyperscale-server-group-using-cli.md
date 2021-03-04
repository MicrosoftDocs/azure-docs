---
title: Scale up and down an Azure Database for PostgreSQL Hyperscale server group using CLI (azdata or kubectl)
description: Scale up and down an Azure Database for PostgreSQL Hyperscale server group using CLI (azdata or kubectl)
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---
# Scale up and down an Azure Database for PostgreSQL Hyperscale server group using CLI (azdata or kubectl)



There are times when you may need to change the characteristics or the definition of a server group. For example:

- Scale up or down the number of vCores that each of the coordinator or the worker nodes uses
- Scale up or down the memory that each of the coordinator or the worker nodes uses

This guide explains how to scale vCore and/or memory.

Scaling up or down the vCore or memory settings of your server group means you have the possibility to set a minimum and/or a maximum for each of the vCore and memory settings. If you want to configure your server group to use a specific number of vCore or a specific amount of memory, you would set the min settings equal to the max settings.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Show the current definition of the server group

To show the current definition of your server group and see what are the current vCore and Memory settings, run either of the following command:

### CLI with azdata

```console
azdata arc postgres server show -n <server group name>
```
### CLI with kubectl

```console
kubectl describe postgresql-12/<server group name> [-n <namespace name>]
```
> [!NOTE]
> If you created a server group of PostgreSQL version 11, run `kubectl describe postgresql-11/<server group name>` instead.

It returns the configuration of your server group. If you have created the server group with the default settings, you should see the definition as follows:

```console
"scheduling": {
      "default": {
        "resources": {
          "requests": {
            "memory": "256Mi"
          }
        }
      }
    },
```

## Interpret the definition of the server group

In the definition of a server group, the section that carries the settings of min/max vCore per node and min/max memory per node is the **"scheduling"** section. In that section, the max settings will be persisted in a subsection called **"limits"** and the min settings are persisted in the subsection called **"requests"**.

If you set min settings that are different from the max settings, the configuration guarantees that your server group is allocated the requested resources if it needs. It will not exceed the limits you set.

The resources (vCores and memory) that will actually be used by your server group are up to the max settings and depend on the workloads and the resources available on the cluster. If you do not cap the settings with a max, your server group may use up to all the resources that the Kubernetes cluster allocates to the Kubernetes nodes your server group is  scheduled on.

Those vCore and memory settings apply to each of the PostgreSQL Hyperscale nodes (coordinator node and worker nodes). It is not yet supported to set the definitions of the coordinator node and the worker nodes separately.

In a default configuration, only the minimum memory is set to 256Mi as it is the minimum amount of memory that is recommended to run PostgreSQL Hyperscale.

> [!NOTE]
> Setting a minimum does not mean the server group will necessarily use that minimum. It means that if the server group needs it, it is guaranteed to be allocated at least this minimum. For example, let's consider we set `--minCpu 2`. It does not mean that the server group will be using at least 2 vCores at all times. It instead means that the sever group may start using less than 2 vCores if it does not need that much and it is guaranteed to be allocated at least 2 vCores if it needs them later on. It implies that the Kubernetes cluster allocates resources to other workloads in such a way that it can allocate 2 vCores to the server group if it ever needs them.

>[!NOTE]
>Before you modify the configuration of your system please make sure to familiarize yourself with the Kubernetes resource model [here](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/resources.md#resource-quantities)

## Scale up the server group

The settings you are about to set have to be considered within the configuration you set for your Kubernetes cluster. Make sure you are not setting values that your Kubernetes cluster won't be able to satisfy. That could lead to errors or unpredictable behavior. As an example, if the status of your server group stays in status _updating_ for a long time after you change the configuration, it may be an indication that you set the below parameters to values that your Kubernetes cluster cannot satisfy. If that is the case, revert the change or read the _troubleshooting_section.

As an example, let's assume you want to scale up the definition of your server group to:

- Min vCore = 2
- Max vCore = 4
- Min memory = 512Mb
- Max Memory = 1Gb

You would use either of the following approaches:

### CLI with azdata

```console
azdata arc postgres server edit -n <name of your server group> --cores-request <# core-request>  --cores-limit <# core-limit>  --memory-request <# memory-request>Mi  --memory-limit <# memory-limit>Mi
```

> [!CAUTION]
> Below is an example provided to illustrate how you could use the command. Before executing an edit command, make sure to set the parameters to values that the Kubernetes cluster can honor.

```console
azdata arc postgres server edit -n <name of your server group> --cores-request 2  --cores-limit 4  --memory-request 512Mi  --memory-limit 1024Mi
```

The command executes successfully when it shows:

```console
<name of your server group> is Ready
```

> [!NOTE]
> For details about those parameters, run `azdata arc postgres server edit --help`.

### CLI with kubectl

```console
kubectl edit postgresql-12/<server group name> [-n <namespace name>]
```

This takes you in the vi editor where you can navigate and change the configuration. Use the following to map the desired setting to the name of the field in the specification:

> [!CAUTION]
> Below is an example provided to illustrate how you could edit the configuration. Before updating the configuration, make sure to set the parameters to values that the Kubernetes cluster can honor.

For example:
- Min vCore = 2 -> scheduling\default\resources\requests\cpu
- Max vCore = 4 -> scheduling\default\resources\limits\cpu
- Min memory = 512Mb -> scheduling\default\resources\requests\cpu
- Max Memory = 1Gb ->  scheduling\default\resources\limits\cpu

If you are not familiar with the vi editor, see a description of the commands you may need [here](https://www.computerhope.com/unix/uvi.htm):
- edit mode: `i`
- move around with arrows
- _stop editing: `esc`
- _exit without saving: `:qa!`
- _exit after saving: `:qw!`


## Show the scaled up definition of the server group

Run again the command to display the definition of the server group and verify it is set as you desire:

### CLI with azdata

```console
azdata arc postgres server show -n <the name of your server group>
```
### CLI with kubectl

```console
kubectl describe postgresql-12/<server group name>  [-n <namespace name>]
```
> [!NOTE]
> If you created a server group of PostgreSQL version 11, run `kubectl describe postgresql-11/<server group name>` instead.


It will show the new definition of the server group:

```console
"scheduling": {
      "default": {
        "resources": {
          "limits": {
            "cpu": "4",
            "memory": "1024Mi"
          },
          "requests": {
            "cpu": "2",
            "memory": "512Mi"
          }
        }
      }
    },
```

## Scale down the server group

To scale down the server group you execute the same command but set lesser values for the settings you want to scale down. 
To remove the requests and/or limits, specify its value as empty string.

## Reset to default values
To reset core/memory limits/requests parameters to their default values, edit them and pass an empty string instead of an actual value. For example, if you want to reset the core limit (cl) parameter, run the following commands:
- on a Linux client:

```console
    azdata arc postgres server edit -n <servergroup name> -cl ""
```

- on a Windows client: 
 
```console
    azdata arc postgres server edit -n <servergroup name> -cl '""'
```


## Next steps

- [Scale out your Azure Database for PostgreSQL Hyperscale server group](scale-out-postgresql-hyperscale-server-group.md)
- [Storage configuration and Kubernetes storage concepts](storage-configuration.md)
- [Kubernetes resource model](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/resources.md#resource-quantities)
