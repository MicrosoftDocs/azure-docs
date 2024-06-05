---
title: Scale up and down an Azure Database for PostgreSQL server using CLI (az or kubectl)
description: Scale up and down an Azure Database for PostgreSQL server using CLI (az or kubectl)
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql
author: dhanmm
ms.author: dhmahaja
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---
# Scale up and down an Azure Database for PostgreSQL server using CLI (az or kubectl)

There are times when you may need to change the characteristics or the definition of a server. For example:

- Scale up or down the number of vCores that the server uses
- Scale up or down the memory that the server uses

This guide explains how to scale vCore and/or memory.

Scaling up or down the vCore or memory settings of your server means you have the possibility to set a minimum and/or a maximum for each of the vCore and memory settings. If you want to configure your server to use a specific number of vCore or a specific amount of memory, you would set the minimum settings equal to the maximum settings. Before increasing the value set for vCores and Memory, you must ensure that 
- you have enough resources available in the physical infrastructure that hosts your deployment and 
- workloads collocated on the same system are not competing for the same vCores or Memory.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Show the current definition of the server

To show the current definition of your server and see what are the current vCore and Memory settings, run either of the following command:

### With Azure CLI (az)

```azurecli
az postgres server-arc show -n <server name> --k8s-namespace <namespace> --use-k8s
```
### CLI with kubectl

```console
kubectl describe postgresql/<server name> -n <namespace name>
```

It returns the configuration of your server group. If you have created the server with the default settings, you should see the definition as follows:

```json
Spec:
  Dev:  false
  Scheduling:
    Default:
      Resources:
        Requests:
          Memory:  256Mi
...
```

## Interpret the definition of the server

In the definition of a server, the section that carries the settings of minimum or maximum vCore per node and minimum or maximum memory per node is the **"scheduling"** section. In that section, the maximum settings will be persisted in a subsection called **"limits"** and the minimum settings are persisted in the subsection called **"requests"**.

If you set minimum settings that are different from the maximum settings, the configuration guarantees that your server is allocated the requested resources if it needs. It will not exceed the limits you set.

The resources (vCores and memory) that will actually be used by your server are up to the maximum settings and depend on the workloads and the resources available on the cluster. If you do not cap the settings with a max, your server may use up to all the resources that the Kubernetes cluster allocates to the Kubernetes nodes your server is scheduled on.

In a default configuration, only the minimum memory is set to 256Mi as it is the minimum amount of memory that is recommended to run PostgreSQL server.

> [!NOTE]
> Setting a minimum does not mean the server will necessarily use that minimum. It means that if the server needs it, it is guaranteed to be allocated at least this minimum. For example, let's consider we set `--minCpu 2`. It does not mean that the server will be using at least 2 vCores at all times. It instead means that the sever may start using less than 2 vCores if it does not need that much and it is guaranteed to be allocated at least 2 vCores if it needs them later on. It implies that the Kubernetes cluster allocates resources to other workloads in such a way that it can allocate 2 vCores to the server if it ever needs them. Also, scaling up and down is not a online operation as it requires the restart of the kubernetes pods.

>[!NOTE]
>Before you modify the configuration of your system please make sure to familiarize yourself with the Kubernetes resource model [here](https://github.com/kubernetes/design-proposals-archive/blob/main/scheduling/resources.md#resource-quantities)

## Scale up and down the server

Scaling up refers to increasing the values for the vCores and/or memory settings of your server.
Scaling down refers to decreasing the values for the vCores and/or memory settings of your server.

The settings you are about to set have to be considered within the configuration you set for your Kubernetes cluster. Make sure you are not setting values that your Kubernetes cluster won't be able to satisfy. That could lead to errors or unpredictable behavior like unavailability of the database instance. As an example, if the status of your server stays in status _updating_ for a long time after you change the configuration, it may be an indication that you set the below parameters to values that your Kubernetes cluster cannot satisfy. If that is the case, revert the change or read the _troubleshooting_section.

What settings should you set?
- To set minimum vCore, set `--cores-request`.
- To set maximum vCore, set `--cores-limit`.
- To set minimum memory, set `--memory-request`
- To set maximum memory, set `--memory-limit`


> [!CAUTION]
> With Kubernetes, configuring a limit setting without configuring the corresponding request setting forces the request value to be the same value as the limit. This could potentially lead to the unavailability of your server as its pods may not be rescheduled if there isn't a Kubernetes node available with sufficient resources. As such, to avoid this situation, the below examples show how to set both the request and the limit settings.


**The general syntax is:**

```azurecli
az postgres server-arc edit -n <server name> --memory-limit/memory-request/cores-request/cores-limit <val> --k8s-namespace <namespace> --use-k8s
```

The value you indicate for the memory setting is a number followed by a unit of volume. For example, to indicate 1Gb, you would indicate 1024Mi or 1Gi.
To indicate a number of cores, you just pass a number without unit. 

### Examples using the Azure CLI

**Configure the server to not exceed 2 cores:**

```azurecli
 az postgres server-arc edit -n postgres01 --cores-request 1, --cores-limit 2  --k8s-namespace arc --use-k8s
```


> [!NOTE]
> For details about those parameters, run `az postgres server-arc update --help`.

### Example using Kubernetes native tools like `kubectl`

Run the command: 
```console
kubectl edit postgresql/<server name> -n <namespace name>
```

This takes you in the `vi` editor where you can navigate and change the configuration. Use the following to map the desired setting to the name of the field in the specification:

> [!CAUTION]
> Below is an example provided to illustrate how you could edit the configuration. Before updating the configuration, make sure to set the parameters to values that the Kubernetes cluster can honor.

For example if you want to set the following settings for both the coordinator and the worker roles to the following values:
- Minimum vCore = `2` 
- Maximum vCore = `4`
- Minimum memory = `512Mb`
- Maximum Memory = `1Gb` 

You would set the definition your server group so that it matches the below configuration:

```json
...
  spec:
  dev: false
  scheduling:
    default:
      resources:
        requests:
          cpu: "2"
          memory: 256Mi
        limits:
          cpu: "4"
          memory: 1Gi
...
```

If you are not familiar with the `vi` editor, see a description of the commands you may need [here](https://www.computerhope.com/unix/uvi.htm):
- Edit mode: `i`
- Move around with arrows
- Stop editing: `esc`
- Exit without saving: `:qa!`
- Exit after saving: `:qw!`


## Reset to default values
To reset core/memory limits/requests parameters to their default values, edit them and pass an empty string instead of an actual value. For example, if you want to reset the core limit parameter, run the following commands:

```azurecli
az postgres server-arc edit -n postgres01 --cores-request '' --k8s-namespace arc --use-k8s
az postgres server-arc edit -n postgres01 --cores-limit '' --k8s-namespace arc --use-k8s
```

or 
```azurecli
az postgres server-arc edit -n postgres01 --cores-request '' --cores-limit '' --k8s-namespace arc --use-k8s
```

## Related content

- [Storage configuration and Kubernetes storage concepts](storage-configuration.md)
- [Kubernetes resource model](https://github.com/kubernetes/design-proposals-archive/blob/main/scheduling/resources.md#resource-quantities)
