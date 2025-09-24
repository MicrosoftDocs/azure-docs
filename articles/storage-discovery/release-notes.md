---
title: Release notes for the Azure Storage Discovery service | Microsoft Docs
description: Read the release notes for the Azure Storage Discovery service.
services: storage-mover
author: pthippeswamy
ms.author: shaas
ms.service: azure-storage-discovery
ms.topic: release-notes
ms.date: 08/01/2025
ms.custom: references_regions
---

# Release notes for the Azure Storage Discovery preview service

Azure Storage Discovery is a fully managed Azure service, which continuously introduces new features and improvements. This article provides a summary of key improvements that are released. The article also points out limitations and if possible, workarounds for identified issues.

## 2025 August 5

Public preview release notes for Azure Storage Discovery service.
Features included: 

- 30 days of backfill for any newly created discovery scope in Standard SKU
- 15 days of backfill for any newly created discovery scope in Free SKU
- SKU upgrade and downgrade options
- Starting October 1, 2025, Storage Discovery will begin incurring charges. Until that date, customers may observe usage costs for the following meters in the Cost Management / Cost Analysis portal: Storage Accounts monitored and Objects analyzed. These usage details are visible for transparency but will not be included in your September 2025 invoice. Billing for Storage Discovery will officially begin on October 1, 2025.

### Known Limitations

- Reports include insights for both Standard and Premium storage accounts. However, filtering specifically by performance type to isolate insights for Premium accounts isn't yet supported. We're actively working to enable this functionality in an upcoming release.

- Trend graphs in Reports may occasionally show sharp dips that don’t reflect actual changes in metrics like size or count. These dips are caused by a reporting issue and the fix is underway.
