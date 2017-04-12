---
title: Threat Detection - Azure SQL Database | Microsoft Docs
description: Threat Detection detects anomalous database activities indicating potential security threats to the database. 
services: sql-database
documentationcenter: ''
author: ronitr
manager: jhubbard
editor: v-romcal

ms.assetid: b50d232a-4225-46ed-91e7-75288f55ee84
ms.service: sql-database
ms.custom: secure and protect
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.date: 07/10/2016
ms.author: ronmat; ronitr

---
# SQL Database Threat Detection

Threat Detection detects anomalous database activities indicating potential security threats to the database.  Threat Detection is currently in preview.

## Overview

Threat Detection provides a new layer of security, which enables customers to detect and respond to potential threats as they occur by providing security alerts on anomalous activities.  Users can explore the suspicious events using [SQL Database Auditing](sql-database-auditing.md) to determine if they result from an attempt to access, breach or exploit data in the database.
Threat Detection makes it simple to address potential threats to the database without the need to be a security expert or manage advanced security monitoring systems.

For example, Threat Detection detects certain anomalous database activities indicating potential SQL injection attempts. SQL injection is one of the common Web application security issues on the Internet, used to attack data-driven applications. Attackers take advantage of application vulnerabilities to inject malicious SQL statements into application entry fields, for breaching or modifying data in the database.

## Next steps

* To configure and manage threat detection, see [Configure and manage threat detection in the Azure portal](sql-database-threat-detection-portal.md).
