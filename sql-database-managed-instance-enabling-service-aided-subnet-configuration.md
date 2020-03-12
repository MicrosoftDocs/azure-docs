---
title: Enabling service-aided subnet configuration for Azure SQL Database Managed Instance
description: Enabling service-aided subnet configuration for Azure SQL Database Managed Instance
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: srdan-bozovic-msft
ms.author: srbozovi
ms.date: 03/12/2020
---
# Enabling service-aided subnet configuratio for Azure SQL Database Managed Instance
Service-aided subnet configuration provides automated network configuration management for subnets hosting managed instances. 

Automated network configuration on managed instance provides security through application of most restrictive network intent policy while ensuring uninterrupted flow of management traffic required for fulfilling SLA.

Automaticaly configured network security groups and route table rules are visible to customer and annotated with prefix _Microsoft.Sql-managedInstances_UseOnly__.

Enabling service-aided configuration doesn't cause failover or interuption in connectivity.
