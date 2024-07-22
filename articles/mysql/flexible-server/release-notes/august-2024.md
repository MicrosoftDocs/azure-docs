---
title: Release notes for Azure Database for MySQL Flexible Server - August 2024
description: Learn about the release notes for Azure Database for MySQL Flexible Server August 2024.
author: xboxeer
ms.author: yuzheng1
ms.date: 08/01/2024
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Azure Database For MySQL Flexible Server August 2024 Maintenance
We're pleased to announce the June 2024 maintenance for Azure Database for MySQL Flexible Server. This maintenance updates all existing 8.0.34 and afterwards engine version servers to 8.0.37 engine version, along with several security improvements, known issue fixes. 

## Engine version changes
Existing engine version >=8.0.34 server upgrades to 8.0.37 engine version.
To check your engine version, run `SELECT VERSION();` command at the MySQL prompt

> [!NOTE]
> Percona has identified a [critical bug](https://www.percona.com/blog/do-not-upgrade-to-any-version-of-mysql-after-8-0-37/?utm_campaign=2024-blog-q3&utm_content=300046226&utm_medium=social&utm_source=linkedin&hss_channel=lcp-421929) in MySQL versions 8.0.38, 8.4.1, and 9.0.0 that causes the MySQL daemon to crash upon restart if over 10,000 tables exist. While Azure MySQL will not upgrade to these versions in the August maintenance, our managed service limits table spaces to 1,000, effectively preventing this issue and ensuring our customers remain unaffected. We will closely monitor the MySQL community for further developments.

## Features
No new features are being introduced in this maintenance update.

## Improvement
- Many security improvements have been made to the service during this maintenance.
    
## Known Issues Fix
- Fix the issue that for some servers migrated from single server to flexible server, execute table partition leads to table corrupted
