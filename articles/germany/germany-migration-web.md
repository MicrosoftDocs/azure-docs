---
title: Migration from Azure Germany compute resources to public Azure
description: Provides help for migrating web resources
author: gitralf
ms.author: ralfwi 
ms.date: 7/20/2018
ms.topic: article
ms.custom: bfmigrate
---

# Web

## App Service - Web Apps

This service is already covered under [Compute](./germany-migration-compute.md#app-service-web-apps)

## Notification Hubs

You can export and import all registration tokens along with tags from one Hub to another. Here's how:

- [Export the existing Hub registrations](https://msdn.microsoft.com/en-us/library/azure/dn790624.aspx) into an Azure Blob Storage container.
- Create a new Notification Hub in the target environment
- [Import your Registration Tokens](https://msdn.microsoft.com/en-us/library/azure/dn790624.aspx) from Azure Blob Storage to your new Hub
