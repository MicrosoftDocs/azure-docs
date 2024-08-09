---
title: Release notes for Azure Database for MySQL Flexible Server - August 2024
description: Learn about the release notes for Azure Database for MySQL Flexible Server August 2024.
author: xboxeer
ms.author: yuzheng1
ms.date: 08/01/2024
ms.service: azure-database-mysql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Azure Database For MySQL Flexible Server August 2024 Maintenance
We're pleased to announce the June 2024 maintenance for Azure Database for MySQL Flexible Server. This maintenance updates all existing 8.0.34 and afterwards engine version servers to 8.0.37 engine version, along with several security improvements, known issue fixes. 

## Engine version changes
Existing engine version >=8.0.34 server upgrades to 8.0.37 engine version.
To check your engine version, run `SELECT VERSION();` command at the MySQL prompt

> [!NOTE]
> Percona has identified a [critical bug](https://www.percona.com/blog/do-not-upgrade-to-any-version-of-mysql-after-8-0-37/?utm_campaign=2024-blog-q3&utm_content=300046226&utm_medium=social&utm_source=linkedin&hss_channel=lcp-421929) in MySQL versions 8.0.38, 8.4.1, and 9.0.0 that causes the MySQL daemon to crash upon restart if over 10,000 tables exist. Azure MySQL will not upgrade to the buggy MySQL versions 8.0.38, 8.4.1, and 9.0.0 in the August maintenance. Instead, we will skip these versions and upgrade directly to a future MySQL engine version that has resolved this issue. Microsoft Azure MySQL remains committed to providing our customers with the most secure and stable PaaS database service.

## Features
No new features are being introduced in this maintenance update.

## Improvement
- Many security improvements have been made to the service during this maintenance.
    
## Known Issues Fix
- Fix the issue that for some servers migrated from single server to flexible server, execute table partition leads to table corrupted
- Fix the issue that for some servers with audit/slow log enabled, when large number of logs is generated, these servers might be missing server metrics and start operation might be stuck for these servers if they are in stopped state
