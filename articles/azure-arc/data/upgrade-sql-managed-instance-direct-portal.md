---
title: Upgrade Azure SQL Managed Instance directly connected Azure Arc using the portal
description: Article describes how to upgrade Azure SQL Managed Instance directly connected Azure Arc using Azure portal
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
ms.custom: event-tier1-build-2022
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 10/11/2022
ms.topic: how-to
---

# Upgrade Azure SQL Managed Instance directly connected Azure Arc using the portal

This article describes how to upgrade Azure SQL Managed Instance deployed on a directly connected Azure Arc-enabled data controller using the portal.

## Limitations

The Azure Arc data controller must be upgraded to the new version before the managed instance can be upgraded.

If Active Directory integration is enabled then Active Directory connector must be upgraded to the new version before the managed instance can be upgraded.

The managed instance must be at the same version as the data controller and active directory connector before a data controller is upgraded.

There's no batch upgrade process available at this time.

## Upgrade the managed instance

[!INCLUDE [upgrade-sql-managed-instance-service-tiers](includes/upgrade-sql-managed-instance-service-tiers.md)]


### Upgrade

Open your SQL Managed Instance - Azure Arc resource.

Under **Settings**, select the **Upgrade Management**.

In the table of available versions, choose the version you want to upgrade to and select **Upgrade Now**.

In the confirmation dialog box, select **Upgrade**.

## Monitor the upgrade status

To view the status of your upgrade in the portal, go to the resource group of the SQL Managed Instance and select **Activity log**.  

A **Validate Deploy** option that shows the status.

[!INCLUDE [upgrade-rollback](includes/upgrade-rollback.md)]
