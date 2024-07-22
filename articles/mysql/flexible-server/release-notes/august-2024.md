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

## Features
No new features are being introduced in this maintenance update.

## Improvement
- Many security improvements have been made to the service during this maintenance.
    
## Known Issues Fix
- Fix the issue that for some servers migrated from single server to flexible server, execute table partition leads to table corrupted
