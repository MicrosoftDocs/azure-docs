---
title: Migration from Azure Germany compute resources to public Azure
description: Provides help for migrating management resources
author: gitralf
ms.author: ralfwi 
ms.date: 7/20/2018
ms.topic: article
ms.custom: bfmigrate
---

# Management Tools

## Backup

Unfortunately, Azure Backup jobs and snapshots can't be migrated from Azure Germany to global Azure.

## Scheduler

Azure Scheduler is being deprecated. Use Azure Logic apps instead to create scheduling jobs.

- [Transitioning from Scheduler to Logic Apps](../scheduler/scheduler-to-logic-apps.md)

## Traffic Manager

This service is already covered under [Networking](./germany-migration-networking.md#traffic-manager)

## Network Watcher

This service is already covered under [Networking](./germany-migration-networking.md#network-watcher)

## Site Recovery

## Azure Policy
