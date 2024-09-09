---
title: "Sync Connected registry with Azure arc"
description: "Sync the Connected registry extension with Azure Arc synchronization schedule and window."
author: tejaswikolli-web
ms.author: tejaswikolli
ms.service: azure-container-registry
ms.topic: tutorial  #Don't change.
ms.date: 06/17/2024

#customer intent: Learn how to sync the Connected registry extension with with synchronization schedule and window.
---

# Sync Connected registry with Azure Arc in Scheduled window

In this tutorial, you learn how to synchronize the Connected registry extension with Azure Arc. The synchronization process includes updating the Connected registry extension with synchronization schedule and window.

The tutorial helps you to update the synchronization schedule for a Connected registry in Azure Container Registry using Azure CLI commands. It guides you on how to set up the Connected registry to sync continuously every minute or sync every day at midnight.

The commands use CRON expressions to define the sync schedule and ISO 8601 duration format for the sync window. Remember to replace the placeholders with your actual registry names when executing the commands.

You learn how to:

> [!div class="checklist"]
> - [Update the Connected registry to sync every day at midnight](#update-the-connected-registry-to-sync-every-day-at-midnight).
> - [Update the Connected registry to sync continuously every minute](#update-the-connected-registry-to-sync-continuously-every-minute).

## Prerequisites

To complete this tutorial, you need the following resources:

* Follow the [quickstart][quickstart] to create an Azure Arc-enabled Kubernetes cluster. Deploying Secure-by-default settings imply the following configuration is being used: HTTPS, Read Only, Trust Distribution, Cert Manager service.

## Update the Connected registry to sync every day at midnight

1. Run the [az acr connected-registry update][az-acr-connected-registry-update] command to update the Connected registry synchronization schedule to occasionally connect and sync every day at midnight with sync window for 4 hours duration.

For example, the following command configures the connected registry `myconnectedregistry` to schedule sync daily occur every day at 12:00 PM UTC at midnight and set the synchronization window to 4 hours (PT4H). The duration for which the connected registry will sync with the parent ACR `myacrregistry` after the sync initiates.

```azurecli 
az acr connected-registry update --registry myacrregistry \ 
--name myconnectedregistry \ 
--sync-schedule "0 12 * * *" \
--sync-window PT4H
```

The configuration sync for the connected registry daily at noon UTC for 4 hours.

## Update the Connected registry and sync continuously every minute  

1. Run the [az acr connected-registry update][az-acr-connected-registry-update] command to update the Connected registry synchronization to connect and sync continuously every minute.  

For example, the following command configures the connected registry `myconnectedregistry` to schedule sync every minute.

```azurecli 
az acr connected-registry update --registry myacrregistry \ 
--name myconnectedregistry \ 
--sync-schedule "* * * * *"    
```

The configuration syncs every minute with the connected registry.

## Next steps

> [!div class="nextstepaction"]
> [Enable Connected registry with Azure arc CLI][quickstart]
> [Deploy the Connected registry Arc extension](tutorial-connected-registry-arc.md)
> [Upgrade Connected registry with Azure arc](tutorial-connected-registry-upgrade.md)
> [Troubleshoot Connected registry with Azure arc](troubleshoot-connected-registry-arc.md)
> [Glossary of terms](connected-registry-glossary.md)

<!-- LINKS - internal -->
[az-acr-connected-registry-update]: /cli/azure/acr/connected-registry#az-acr-connected-registry-update
[quickstart]: quickstart-connected-registry-arc-cli.md