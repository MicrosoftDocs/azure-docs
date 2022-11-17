---
title: Restrict Azure Storage copy operations to accounts in the same tenant or with private endpoints to the same virtual network (preview)
titleSuffix: Azure Storage
description: Learn how to restrict Azure Storage copy operations to accounts in the same tenant or with private endpoints to the same virtual network.
author: jimmart-dev
ms.author: jammart
ms.service: storage
ms.topic: how-to
ms.date: 11/16/2022
ms.reviewer: santoshc 
ms.custom: template-how-to
---

# Restrict copy operations to accounts in the same tenant or with endpoints to the same virtual network (preview)

For security reasons, storage administrators might want to restrict copying data to a storage account to source accounts from trusted environments. The storage account setting **Permitted scope for copy operations (preview)** allows you to restrict the scope of allowed source storage accounts to:

- Accounts in the same Azure AD tenant
- Accounts that have a private endpoint to the same virtual network

Limiting the scope of permitted copy operations helps prevent the exfiltration of data...

This article shows how to change the permitted scope of copy operations for an existing storage account.

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
