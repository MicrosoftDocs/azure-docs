---
title: Azure Synapse connectivity settings
description: An article that teaches you to configure connectivity settings in Azure Synapse Analytics 
author: RonyMSFT 
ms.service: synapse-analytics 
ms.topic: overview
ms.subservice: security 
ms.date: 03/15/2021 
ms.author: ronytho 
ms.reviewer: jrasnick
---

# Azure Synapse Analytics connectivity settings

This article will explain connectivity settings in Azure Synapse Analytics and how to configure them where applicable.


## Connection policy
The connection policy for Synapse SQL in Azure Synapse Analytics is set to *Default*. You cannot change this in Azure Synapse Analytics. You can learn more about how that affects connections to Synapse SQL in Azure Synapse Analytics [here](../../azure-sql/database/connectivity-architecture.md#connection-policy). 

## Minimal TLS version
Synapse SQL in Azure Synapse Analytics allows connections using all TLS versions. You cannot set the minimal TLS version for Synapse SQL in Azure Synapse Analytics.

## Next steps

Create an [Azure Synapse Workspace](./synapse-workspace-ip-firewall.md)