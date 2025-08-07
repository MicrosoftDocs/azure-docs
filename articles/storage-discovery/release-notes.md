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

### Known Limitations

- Reports include insights for both Standard and Premium storage accounts. However, filtering specifically by performance type to isolate insights for Premium accounts is not yet supported. We are actively working to enable this functionality in an upcoming release.