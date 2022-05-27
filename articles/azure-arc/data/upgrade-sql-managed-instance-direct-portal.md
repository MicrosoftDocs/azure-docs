---
title: Upgrade a directly connected Azure Arc-enabled Managed Instance using the portal
description: Article describes how to upgrade a directly connected Azure Arc-enabled Managed Instance using the portal
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.custom: event-tier1-build-2022
author: grrlgeek
ms.author: jeschult
ms.reviewer: mikeray
ms.date: 05/27/2022
ms.topic: how-to
---

# Upgrade a directly connected Azure Arc-enabled Managed Instance using the portal

This article describes how to upgrade a SQL Managed Instance deployed on a directly connected Azure Arc-enabled data controller using the portal.

## Limitations

The Azure Arc data controller must be upgraded to the new version before the Managed Instance can be upgraded.

The Managed Instance must be at the same version as the data controller before a data controller is upgraded.

Currently, only one Managed Instance can be upgraded at a time.

## Upgrade the Managed Instance

[!INCLUDE [upgrade-sql-managed-instance-gpandbc](upgrade-sql-managed-instance-gpandbc.md)]

### Upgrade

Open your SQL Managed Instance - Azure Arc resource.

Under **Settings**, select the **Upgrade Management** blade.

In the table of available versions, choose the version you want to upgrade to and click "Upgrade Now".

In the confirmation dialog box, click "Upgrade".

## Monitor the upgrade status

To view the status of your upgrade in the portal, go to the resource group of the SQL Managed Instance and select the **Activity log** blade.  

You will see a "Validate Deploy" option that shows the status.

## Troubleshoot upgrade problems

If you encounter any troubles with upgrading, see the [troubleshooting guide](troubleshoot-guide.md).
