---
title: Configure Azure Arc-enabled SQL managed instance
description: Configure Azure Arc-enabled SQL managed instance
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 05/27/2022
ms.topic: how-to
---

# Configure Azure Arc-enabled SQL managed instance

This article explains how to configure Azure Arc-enabled SQL managed instance.


## Configure resources such as cores, memory


### Configure using CLI

You can update the configuration of Azure Arc-enabled SQL Managed Instances with the CLI. Run the following command to see configuration options. 

```azurecli
az sql mi-arc update --help
```

You can update the available memory and cores for an Azure Arc-enabled SQL managed instance using the following command:

```azurecli
az sql mi-arc update --cores-limit 4 --cores-request 2 --memory-limit 4Gi --memory-request 2Gi -n <NAME_OF_SQL_MI> --k8s-namespace <namespace> --use-k8s
```

The following example sets the cpu core and memory requests and limits.

```azurecli
az sql mi-arc update --cores-limit 4 --cores-request 2 --memory-limit 4Gi --memory-request 2Gi -n sqlinstance1 --k8s-namespace arc --use-k8s
```

To view the changes made to the Azure Arc-enabled SQL managed instance, you can use the following commands to view the configuration yaml file:

```azurecli
az sql mi-arc show -n <NAME_OF_SQL_MI> --k8s-namespace <namespace> --use-k8s
```

## Configure readable secondaries

When you deploy Azure Arc enabled SQL managed instance in `BusinessCritical` service tier with 2 or more replicas, by default, one secondary replica is automatically configured as `readableSecondary`. This setting can be changed, either to add or to remove the readable secondaries as follows:

```azurecli
az sql mi-arc update --name <sqlmi name>  --readable-secondaries <value> --k8s-namespace <namespace> --use-k8s
```

For example, the following example will reset the readable secondaries to 0.

```azurecli
az sql mi-arc update --name sqlmi1 --readable-secondaries 0 --k8s-namespace mynamespace --use-k8s
```
## Configure replicas

You can also scale up or down the number of replicas deployed in the `BusinessCritical` service tier as follows:

```azurecli
az sql mi-arc update --name <sqlmi name> --replicas <value> --k8s-namespace <namespace> --use-k8s
```

For example:

The following example will scale down the number of replicas from 3 to 2.

```azurecli
az sql mi-arc update --name sqlmi1 --replicas 2 --k8s-namespace mynamespace --use-k8s
```

> [Note]
> If you scale down from 2 replicas to 1 replica, you may run into a conflict with the pre-configured `--readable--secondaries` setting. You can first edit the `--readable--secondaries` before scaling down the replicas. 


## Configure Server options

You can configure server configuration settings for Azure Arc-enabled SQL managed instance after creation time. This article describes how to configure settings like enabling or disabling mssql Agent, enable specific trace flags for troubleshooting scenarios.


### Enable SQL Server agent

SQL Server agent is disabled by default. It can be enabled by running the following command:

```azurecli
az sql mi-arc update -n <NAME_OF_SQL_MI> --k8s-namespace <namespace> --use-k8s --agent-enabled true
```
As an example:
```azurecli
az sql mi-arc update -n sqlinstance1 --k8s-namespace arc --use-k8s --agent-enabled true
```

### Enable Trace flags

Trace flags can be enabled as follows:
```azurecli
az sql mi-arc update -n <NAME_OF_SQL_MI> --k8s-namespace <namespace> --use-k8s --trace-flags "3614,1234" 
```

