---
title: Limit the source accounts for Azure Storage Account copy operations to accounts in the same tenant or on the same virtual network
titleSuffix: Azure Storage
description: Learn how to use the "Permitted scope of copy operations" (preview) Azure storage account setting to limit the source accounts of copy operations to the same tenant or with private links to the same virtual network.
author: jimmart-dev
ms.author: jammart
ms.service: storage
ms.topic: how-to
ms.date: 11/20/2022
ms.reviewer: santoshc 
ms.custom: template-how-to
---

# Restrict copy operations to source accounts in the same tenant or virtual network

For security reasons, storage administrators might want to limit the source accounts from which data can be copied to protected accounts. Limiting the scope of permitted copy operations helps prevent the exfiltration of data... (a better explanation here).

The **allowedCopyScope** property of a storage account is not set by default and does not return a value until you explicitly set it. The property has three possible settings:

- ***(not defined)***: Defaults to permitting copying from any storage account.
- **AAD**: Permits copying only from accounts in the same Azure AD tenant as the destination account.
- **PrivateLink**:  Permits copying only from storage accounts that have private links to the same virtual network as the destination.

When the source of a copy request does not meet the requirements you specify, the request fails with HTTP status code 403 and error message "This request is not authorized to perform this operation."

This article shows you how to limit the source accounts of copy operations to accounts in the same tenant as the destination account, or with private links to the same virtual network.

> [!IMPORTANT]
> **Permitted scope of copy operations** is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

Before changing the **Permitted scope of copy operations (preview)** setting, identify users, applications or services that would be affected by the change.

- <!-- prerequisite 1 -->
- <!-- prerequisite 2 -->
- <!-- prerequisite n -->
<!-- remove this section if prerequisites are not needed -->

<!-- 4. H2s 
Required. A how-to article explains how to do a task. The bulk of each H2 should be 
a procedure.
-->

## [Section 1 heading]
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## [Section 2 heading]
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## [Section n heading]
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

<!-- 5. Next steps
Required. Provide at least one next step and no more than three. Include some 
context so the customer can determine why they would click the link.
-->

## Next steps
<!-- Add a context sentence for the following links 
- [Write how-to guides](contribute-how-to-write-howto.md)
- [Links](links-how-to.md)
-->
<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->
