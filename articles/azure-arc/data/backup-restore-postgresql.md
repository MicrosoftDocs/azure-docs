---
title: Backup and restore for Azure Database for PostgreSQL server
description: Explains how to back up and restore for Azure Database for PostgreSQL servers
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql
author: dhanmm
ms.author: dhmahaja
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---

# Back up and restore Azure Arc-enabled PostgreSQL servers

Automated backups can be enabled by including the `--storage-class-backups` argument when creating an Azure Arc-enabled PostgreSQL server. Restore is not supported in the current preview release.

- Read about [scaling up or down (increasing/decreasing memory/vcores)](scale-up-down-postgresql-server-using-cli.md) your server.
