---
title: Release notes for the Azure Storage Discovery service | Microsoft Docs
description: Read the release notes for the Azure Storage Discovery service.
services: storage-discovery
author: pthippeswamy
ms.author: pthippeswamy
ms.service: azure-storage-discovery
ms.topic: release-notes
ms.date: 10/09/2025
ms.custom: references_regions
---

# Release notes for the Azure Storage Discovery service

Azure Storage Discovery is a fully managed Azure service, which continuously introduces new features and improvements. This article provides a summary of key improvements that are released. The article also points out limitations and if possible, workarounds for identified issues.

## 2025 August 6

Public Preview release notes for Azure Storage Discovery service.
Features included: 

- 30 days of backfill for any newly created discovery scope in Standard SKU
- 15 days of backfill for any newly created discovery scope in Free SKU
- SKU upgrade and downgrade options
- On October 15, 2025, Storage Discovery resources begin incurring costs. Until that date, customers may observe usage for the following meters in the Cost Management / Cost Analysis portal: Storage accounts monitored and objects analyzed. These usage details are visible for transparency but no charges are added to your September 2025 invoice.

### Known Limitations

- Reports include insights for both Standard and Premium storage accounts. However, filtering specifically by performance type to isolate insights for Premium accounts isn't yet supported. We're actively working to enable this functionality in an upcoming release.
- Trend graphs in Reports may occasionally show sharp dips that don’t reflect actual changes in metrics like size or count.
