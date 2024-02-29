---
title: Release notes for Azure Database for MySQL Flexible Server - January 2024
description: Learn about the release notes for Azure Database for MySQL Flexible Server January 2024.
author: xboxeer
ms.author: yuzheng1
ms.date: 12/27/2023
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Azure Database For MySQL Flexible Server January 2024 Maintenance

We are pleased to announce the January 2024 maintenance for Azure Database for MySQL Flexible Server. This maintenance incorporates several new features and resolves known issues for enhanced performance and reliability.
> [!NOTE]
> Between 2024/1/12 04:00 UTC and 2024/1/15 07:00 UTC, we strategically paused Azure MySQL maintenance to proactively address a detected issue that could lead to maintenance interruptions. We're happy to report that maintenance operations are fully restored. For those impacted, you're welcome to utilize our flexible maintenance feature to conveniently reschedule your maintenance times as needed.

## Engine version changes
There will be no engine version changes in this maintenance update.

## Features
### [Accelerated Logs V2](../concepts-accelerated-logs.md)
- Introducing a new type of disk designed to offer superior performance in storing binary logs and redo logs.

## Improvement

### [Audit Log Improvement](../concepts-audit-logs.md)
- In alignment with our users' expectations for the audit log, we have introduced wildcard support for audit log usernames and added connection status for connection logs.

## Known Issues Fix
### Support Data-in Replication in Major Version Upgrade
- During an upgrade from 5.7 to 8.0, data-in replication encounters issues due to a known bug in the MySQL community. With this January 2024 maintenance, we have addressed this concern, enabling data-in replication support for servers upgraded from version 5.7.
### Server Operations Blockage After Moving Subscription or Resource Group
- Several server operations were hindered post the transfer of subscription or resource group owing to incomplete server information updates. This issue has been resolved in this January 2024 maintenance, ensuring unhindered movement of subscriptions and resource groups.
