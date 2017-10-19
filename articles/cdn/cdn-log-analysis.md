---
title: Analyze Azure CDN usage patterns | Microsoft Docs
description: 'Customer can enable log analysis for Azure CDN.'
services: cdn
documentationcenter: ''
author: smcevoy
manager: erikre
editor: ''

ms.assetid: 95e18b3c-b987-46c2-baa8-a27a029e3076
ms.service: cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/03/2017
ms.author: v-semcev
---


# Analyze Azure CDN usage patterns

After you enable CDN for your application, you can monitor CDN usage, check the health of your delivery, and troubleshoot potential issues. Azure CDN provides these capabilities in the following two ways: 

## Verizon Core Reports

As an Azure CDN user with a Verizon standard or a Verizon premium profile, you can view Verizon Core Reports in the Verizon supplemental portal. The Verizon supplemental portal offers a variety of graphs and views and is accessible via the **Manage** option from the Azure portal. For more information, see [Core Reports from Verizon](cdn-analyze-usage-patterns.md).

## Core analytics via Azure diagnostic logs

Core analytics is available for all CDN endpoints belonging to Verizon (Standard and Premium) and Akamai (Standard) CDN profiles. Azure diagnostics logs allow core analytics to be exported to Azure storage, event hubs, or Operations Management Suite (OMS) Log Analytics. OMS Log Analytics offers a solution with graphs that are user-configurable and customizable. For more information, see [Azure diagnostic logs](cdn-azure-diagnostic-logs.md).

