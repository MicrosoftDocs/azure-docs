---
title: 'Exchange hybrid writeback with cloud sync'
description: This article describes how to enable exchange hybrid writeback scenarios.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''
ms.service: active-directory
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 06/07/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---




# What is Exchange Hybrid Writeback

An Exchange hybrid deployment offers organizations the ability to extend the feature-rich experience and administrative control they have with their existing on-premises Microsoft Exchange organization to the cloud. A hybrid deployment provides the seamless look and feel of a single Exchange organization between an on-premises Exchange organization and Exchange Online. 

 :::image type="content" source="media/exchange-hybrid/exchange-hybrid-1.png" alt-text="Conceptual image of exchange hybrid scenario." lightbox="media/exchange-hybrid/exchange-hybrid-1.png":::

This scenario is now supported in cloud sync.  Cloud sync accomplishes this by detecting Exchange on-premises schema attributes and then "writing back" the exchange on-line attributes to your on-premises AD environment.

For more information on Exchange Hybrid deployments, see [Exchange Hybrid](/exchange/exchange-hybrid.md)

## Prerequisites
Before deploying Exchange Hybrid with cloud sync, you need to ensure that the [provisioning agent](what-is-provisioning-agent.md) must be version 1.1.1107.0.

## How to enable
Exchange Hybrid Writeback is disabled by default.  

## Attributes synchronized
https://aka.ms/CloudSyncExchangeWritebackMappings


## Provisioning on-demand

## API for schema detection

## Next steps