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

Unfortunately, neither Azure Backup jobs nor snapshots can be migrated from Azure Germany to public Azure. Please contact Azure Support.

## Scheduler

Azure Scheduler is being deprecated. Please use Azure Logic apps instead to create scheduling jobs.

- [Transitioning from Scheduler to Logic Apps](../scheduler/scheduler-to-logic-apps.md)

## Traffic Manager

This topic is already covered under [Networking](./germany-migration-networking#traffic-manager)

## Network Watcher

This topic is already covered under [Networking](./germany-migration-networking#network-watcher)

## Site Recovery

## Azure Policy
