---
title: Release notes for Azure Database for MySQL Flexible Server - February 2024
description: Learn about the release notes for Azure Database for MySQL Flexible Server February 2024.
author: xboxeer
ms.author: yuzheng1
ms.date: 02/09/2024
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Azure Database For MySQL Flexible Server February 2024 Maintenance

We're pleased to announce the February 2024 maintenance for Azure Database for MySQL Flexible Server. This maintenance mainly focuses on known issue fix, underlying OS upgrading and vulnerability patching.

## Engine version changes
 - All existing 5.7.42 engine version server will upgrade to 5.7.44 engine version.
 - All existing 8.0.34 engine version server will upgrade to 8.0.35 engine version.

To check your engine version, run `SELECT VERSION();` command at the MySQL prompt

## Features
There will be no new features in this maintenance update.

## Improvement
There will be no new improvement in this maintenance update.

## Known Issues Fix
- Fix HA standby replication dead lock issue caused by slave_preserve_commit_order.
- Fix promotion stuck issue when source server is unavailable or source region is down. Improve customer experience on replica promotion to better support disaster recovery.
- Fix the default value of character_set_server & collation_server.
- Allow customer to start InnoDB buffer pool dump.
