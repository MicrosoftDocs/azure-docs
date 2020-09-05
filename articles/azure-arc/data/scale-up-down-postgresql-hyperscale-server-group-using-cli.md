---
title: Scale up and down an Azure Database for PostgreSQL Hyperscale server group using CLI (azdata)
description: Scale up and down an Azure Database for PostgreSQL Hyperscale server group using CLI (azdata)
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---
# Scenario: Scale up and down an Azure Database for PostgreSQL Hyperscale server group using CLI (azdata)



There are times when you may need to change the characteristics or the definition of a server group:

- Scale up or down the number of vCores that each of the coordinator or the worker nodes uses
- Scale up or down the memory that each of the coordinator or the worker nodes uses
This guide explains you how to scale vCore and/or memory.

Scaling up or down the vCore or memory settings of your server group means you have the possibility to set a minimum and/or a maximum for each of the vCore and memory settings. If you want to configure your server group to use a specific number of vCore or a specific amount of memory, you would set the min settings equal to the max settings.

## Show the current definition of the server group

To show the current definition of your server group and see what are the current vCore and Memory settings, run either of the following command:

### CLI with azdata

```terminal
azdata arc postgres server show -n <server group name>
```
### CLI with kubectl

```terminal
kubectl describe postgresql-12/<server group name> 
```
> Note: if you deployed a server group of PostgreSQL version 11, run _kubectl describe postgresql-11/<server group name>_ instead.

It returns the configuration of your server group. If you have created the server group with the default settings, you should see the definition as follows:

```terminal
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

If you set min settings that are different from the max settings, your server group is guaranteed to be allocated the requested resources if it needs*. It will not exceed the limits you set.

The resources (vCores and memory) that will actually be used by your server group are up to the max settings and depend on the workloads and the resources available on the cluster. If you do not cap the settings with a max, your server group may use up to all the resources that the Kubernetes cluster allocates to the Kubernetes nodes your server group is  scheduled on.

Those vCore and memory settings apply to each of the Postgres Hyperscale nodes (coordinator node and worker nodes). It is not yet supported to set the definitions of the coordinator node and the worker nodes separately.

In a default configuration, only the minimum memory is set to 256Mi as it is the minimum amount of memory that is recommended to run PostgreSQL Hyperscale.

> **Note:** Setting a minimum does not mean the server group will necessarily use that minimum. It means that if the server group needs it, it is guaranteed to be allocated at least this minimum. For example, let's consider we set --minCpu 2. It does not mean that the server group will be using at least 2 vCores at all times. It instead means that the sever group may start using less than 2 vCores if it does not need that much and it is guaranteed to be allocated at least 2 vCores if it needs them later on. It implies that the Kubernetes cluster allocates resources to other workloads in such a way that it can allocate 2 vCores to the server group if it ever needs them.

## Scale up the server group

Let's assume you want to scale up the definition of your server group to:

- Min vCore = 2
- Max vCore = 4
- Min memory = 512Mb
- Max Memory = 1Gb

You would use either of the following approaches:

### CLI with azdata

```terminal
azdata arc postgres server edit -n <name of your server group> --cores-request 2  --cores-limit 4  --memory-request 512Mi  --memory-limit 1024Mi
```

The command executes successfully when it shows:

```terminal
<name of your server group> is Ready
```

> **Note:** For details about those parameters, run `azdata arc postgres server edit --help`

### CLI with kubectl

```terminal
kubectl edit postgresql-12/<server group name>
```
This takes you in the vi editor where you can navigate and change the configuration. Use the following to map the desired setting to the name of the field in the specification:
- Min vCore = 2 -> scheduling\default\resources\requests\cpu
- Max vCore = 4 -> scheduling\default\resources\limits\cpu
- Min memory = 512Mb -> scheduling\default\resources\requests\cpu
- Max Memory = 1Gb ->  scheduling\default\resources\limits\cpu

_If you are not familiar with the vi editor, see a description of the commands you may need [here](https://www.computerhope.com/unix/uvi.htm):_
- _edit mode: i_
- _move around with arrows_
- _stop editing: esc_
- _exit without saving: :qa!_
- _exit after saving: :qw!_


## Show the scaled up definition of the server group

Run again the command to display the definition of the server group and verify it is set as you desire:

### CLI with azdata

```terminal
azdata arc postgres server show -n <the name of your server group>
```
### CLI with kubectl

```terminal
kubectl describe postgresql-12/<server group name>
```
> Note: if you deployed a server group of PostgreSQL version 11, run _kubectl describe postgresql-11/<server group name>_ instead.


It will show the new definition of the server group:

```terminal
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
