---
title: GPv1 storage account retirement FAQ
titleSuffix: Azure Storage
description: FAQ page for the retirement of Azure GPv1 storage accounts.
Services: storage
author: gtrossell

ms.service: azure-storage
ms.topic: how-to
ms.date: 07/22/2025
ms.author: akashdubey
ms.subservice: storage-common-concepts
ms.custom: devx-track-arm-template

# CustomerIntent As a storage admin, I want to find answers to common questions about the retirement of GPv1 storage accounts, so that I can plan my upgrade to GPv2 and avoid service disruption.
---

# Upgrade to general-purpose v2 storage accounts FAQ
General-purpose v2 (GPv2) storage accounts are the recommended account type for most Azure Storage scenarios. GPv2 accounts provide access to the latest Azure Storage features, including blob tiering, lifecycle management, and advanced redundancy options. They also offer the most cost-effective pricing model for a wide range of workloads.

This FAQ addresses common questions about upgrading from general-purpose v1 (GPv1) storage accounts to GPv2. It covers upgrade procedures, billing considerations, feature differences, and guidance for selecting the right access tier. Use this resource to plan your upgrade and ensure a smooth transition before GPv1 retirement.

>[!IMPORTANT]
>Microsoft will retire GPv1 storage accounts on September 1, 2026. All GPv1 accounts must be upgraded to GPv2 before this date to avoid service disruption.

## GPv1 vs GPv2 FAQs
| Question | Answer |
|----------|--------|
| What is a GPv1 storage account? | A GPv1 account is the original “general-purpose” Azure Storage account type. It supports all four core storage services (Blobs, Files, Queues, Tables) and the classic redundancy SKUs (LRS, GRS, RA-GRS). It predates Blob tiering and many newer management features. |
| Can I still create a new GPv1 account? | From the retirement date onwards all new account creation will be blocked. |
| Which redundancy options are available on GPv2 accounts? | Local redundant storage (LRS), Geo-redundant storage (GRS), Zone-redundant storage (ZRS), Read-access geo-redundant storage (RA-GZRS), and Read-access geo-redundant storage (RA-GRS) are supported. |
| Does GPv1 support Hot, Cool, or Archive blob tiers or lifecycle management policies? | No. |
| How does pricing differ from GPv2? | GPv1 has lower transaction prices but slightly higher capacity prices than GPv2. For most workloads, GPv2 is cheaper overall once tiering and optimized capacity pricing are factored in. |
| Can I upgrade from GPv1 to GPv2 later? Will anything break? | You can switch to GPv2 with a one-click “Upgrade” in the portal or via CLI/PowerShell. The change is reversible during a short validation window and is non-disruptive—you keep the same endpoint names and data. |
| Which Azure Files and other new features won’t I get in GPv1? | Many recent innovations—SMB multichannel, NFS 3.0, premium file shares, Data Lake (HNS), point-in-time restore for blobs, and advanced Azure Files features—require GPv2 or newer account kinds. |
| What would my bill look like after the upgrade? How do I calculate the new billing amount? | Your bill will reflect GPv2 pricing, which differs slightly from GPv1. **Key differences:**<br>• GPv2 charges for both read/write operations<br>• Tier-based pricing applies (Hot, Cool, Cold, Archive)<br>• Redundancy flexibility<br>Use the Azure Pricing Calculator and your current invoice data to estimate the new costs. |
| Is the upgrade permanent? | Yes. Once a storage account is upgraded from GPv1 to GPv2, it can't be reverted. The upgrade enables newer features and pricing structures. |
| I can't upgrade by the retirement date. Can I get an exception? | No. Microsoft won't grant exceptions. All GPv1 accounts must be upgraded by the announced deadline to avoid disruption. |
| What happens if I haven’t upgraded by the retirement date? Will I lose access to my data? | Microsoft may automatically upgrade your account, but you risk access disruption and billing misalignment. Data will be preserved, but access could be temporarily impacted. |
| Will the upgrade require downtime? | No. The upgrade is non-disruptive and doesn't require downtime. You can access data and services continuously. |
| Will there be any data loss? | No. The upgrade process is safe and doesn't delete or move your data. All blobs, containers, and metadata remain intact. |
| Will my existing application continue to work seamlessly after the upgrade? | In most cases, yes. API endpoints remain unchanged. However, review any hardcoded pricing assumptions or tier-unaware logic to ensure compatibility with GPv2 features. |
| What if I need help with the upgrade process? | Microsoft provides various resources to assist with the upgrade, including documentation, support forums, and direct support channels. |
| What happens if I don't upgrade by the deadline? | If you don't upgrade by the deadline, your GPv1 account will be automatically upgraded to GPv2. |