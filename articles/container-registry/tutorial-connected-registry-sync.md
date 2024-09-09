---
title: "Connected registry synchronization scheduling"
description: "Sync the Connected registry extension with Azure Arc synchronization schedule and window."
author: tejaswikolli-web
ms.author: tejaswikolli
ms.service: azure-container-registry
ms.topic: tutorial  #Don't change.
ms.date: 06/17/2024

#customer intent: Learn how to sync the connected registry extension using a synchronization schedule and window.
---

# Configuring the connected registry sync schedule and window

In this tutorial, you’ll learn how to configure the synchronization for a connected registry. The process includes updating the connected registry extension with a synchronization schedule and window.

You’ll be guided on how to update the synchronization schedule using Azure CLI commands. This tutorial covers setting up the connected registry to sync continuously every minute or to sync daily at midnight.

The commands utilize CRON expressions to define the sync schedule and the ISO 8601 duration format for the sync window. Remember to replace the placeholders with your actual registry names when executing the commands.

## Prerequisites

To complete this tutorial, you need the following resources:

* Follow the [quickstart][quickstart] as needed.

## Update the connected registry to sync every day at midnight

Run the [az acr connected-registry update][az-acr-connected-registry-update] command to update the connected registry synchronization schedule to occasionally connect and sync every day at midnight with sync window for 4 hours duration.

For example, the following command configures the connected registry `myconnectedregistry` to schedule sync daily occur every day at 12:00 PM UTC at midnight and set the synchronization window to 4 hours (PT4H). The duration for which the connected registry will sync with the parent ACR `myacrregistry` after the sync initiates.

```azurecli 
az acr connected-registry update --registry myacrregistry \ 
--name myconnectedregistry \ 
--sync-schedule "0 12 * * *" \
--sync-window PT4H
```

The configuration syncs the connected registry daily at noon UTC for 4 hours.

## Update the connected registry to sync continuously every minute  

Run the [az acr connected-registry update][az-acr-connected-registry-update] command to update the connected registry synchronization to connect and sync continuously every minute.  

For example, the following command configures the connected registry `myconnectedregistry` to schedule sync every minute with the cloud registry.

```azurecli 
az acr connected-registry update --registry myacrregistry \ 
--name myconnectedregistry \ 
--sync-schedule "* * * * *"    
```

The configuration syncs the connected registry with the cloud registry every minute.

## Next steps

- [Enable Connected registry with Azure arc CLI][quickstart]
- [Deploy the Connected registry Arc extension](tutorial-connected-registry-arc.md)
- [Upgrade Connected registry with Azure arc](tutorial-connected-registry-upgrade.md)
- [Troubleshoot Connected registry with Azure arc](troubleshoot-connected-registry-arc.md)
- [Glossary of terms](connected-registry-glossary.md)

<!-- LINKS - internal -->
[az-acr-connected-registry-update]: /cli/azure/acr/connected-registry#az-acr-connected-registry-update
[quickstart]: quickstart-connected-registry-arc-cli.md
