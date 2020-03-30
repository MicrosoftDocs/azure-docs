---
title: Terminate a Cluster
description: Free up resources after completing jobs in Azure CycleCloud.
author: adriankjohnson
ms.date: 03/30/2020
ms.author: adjohnso
---

# Terminate a Cluster

You can terminate a cluster when it has completed all the submitted jobs and the cluster is no longer needed. Terminating the cluster will free up resources associated with the cluster.

## Terminate via CycleCloud GUI

Click **Terminate** in the CycleCloud GUI to shut down all of the cluster's infrastructure. All underlying Azure resources will be cleaned up as part of the cluster termination, which may take several minutes.

:::image type="content" source="~/images/terminate-cluster.png" alt-text="terminate cluster dialog":::

## Terminate via CycleCloud CLI

The CycleCloud CLI can also terminate clusters:

```bash
cyclecloud terminate_cluster my_cluster_name
```

## Delete a Resource Group

To remove the resources no longer needed, you can simply delete the resource group. Everything within that group will be cleaned up as part of the process:

```azurecli-interactive
az group delete --name "{RESOURCE GROUP}"
```
