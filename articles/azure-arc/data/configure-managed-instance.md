---
title: Configure Azure Arc-enabled SQL managed instance
description: Configure Azure Arc-enabled SQL managed instance
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 02/22/2022
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

