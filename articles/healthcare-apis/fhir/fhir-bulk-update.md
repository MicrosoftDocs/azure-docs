---
title: Perform bulk updates on FHIR data in Azure Health Data Services
description: Learn how to bulk update resources from the FHIR service in Azure Health Data Services.
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: conceptual
ms.date: 09/17/2025
ms.author: kesheth
---

# Perform bulk updates on FHIR data

The $bulk-update operation allows you to update multiple FHIR resources in bulk using asynchronous processing. It supports: 
 - System-level updates across all resource types
 - Updates scoped to individual resource types
 - Multi-resource operations in a single request

> [!NOTE]
> Use the $bulk-update operation with caution. Updated resources can't be rolled back once committed. We recommend that you first run a FHIR search with the same parameters as the bulk update job to verify the data that you want to update.

Bulk update operation uses the supported patch types listed below to perform updates.
 - replace: Replace an existing value. It leverages the FHIR Patch "replace" semantic, ensuring updates remain idempotent
 - upsert: This operation adds a value if it doesn’t exist, or replace if it does

> [!NOTE]
> Other Patch operations (e.g., add, move, delete, insert) are not supported.

## Prerequisites for bulk update operation
