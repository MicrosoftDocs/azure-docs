---
title: Backup controller database
description: Explains how to backup the controller database for Azure Arc-enabled data services
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 04/26/2023
ms.topic: how-to
---

# Backup and recover controller database

When you deploy Azure Arc data services, the Azure Arc Data Controller is one of the most critical components that is deployed. The functions of the  data controller include:

- Provision, de-provision and update resources
- Orchestrate most of the activities for Azure Arc-enabled SQL Managed Instance such as upgrades, scale out etc. 
- Capture the billing and usage information of each Arc SQL managed instance. 

In order to perform above functions, the Data controller needs to store an inventory of all the current Arc SQL managed instances, billing, usage and the current state of all these SQL managed instances. All this data is stored  in a database called `controller` within the SQL Server instance that is deployed into the `controldb-0` pod. 

This article explains how to back up the controller database.

## Backup of data controller database

As part of built-in capabilities, the Data controller database `controller` is automatically backed up whenever there is an update - this update includes creating, deleting or updating an existing custom resource such as an Arc SQL managed instance.

## Next steps

[Azure Data Studio dashboards](azure-data-studio-dashboards.md)