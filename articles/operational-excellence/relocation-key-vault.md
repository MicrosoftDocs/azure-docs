---
title: Relocation guidance in Azure Key Vault
description: Learn how to relocate Azure Key Vault to a new region
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 01/10/2024
ms.service: postgresql
ms.topic: how-to
---

# Relocation guidance for Azure Key Vault

This article covers relocation guidance for Azure Key Vault across regions. Although Key Vault doesn't by default support move operations across geographies, there are some approaches that you can take to achieve a relocation.



## Prerequisites

- Identify all Key Vault dependant resources.
- Depending on your Azure Key Vault deployment, the following dependent resources may need to be deployed and configured in the target region prior to relocation:
    - [Public IP](/azure/virtual-network/move-across-regions-publicip-portal)
    - [Azure Private Link](./relocation-private-link.md)
    - [Virtual Network](./relocation-virtual-network.md)

## Supported relocation methods

Relocation for Key Vault can follow two of the three [relocation methods](/azure/cloud-adoption-framework/relocate/select#select-a-relocation-method) - Cold Standby and Warm Standby. This section describes each of these methods as well as some additional considerations.

In the diagram below,

- **Warm standby** is depicted by the amber flow lines which comprises of redeployment of the target instance and updating dependent configuration and endpoints. 

- **Cold standby** is depicted by the red flow lines which comprises of redeployment of the target instance along with data movement and updating dependent configuration and endpoints.


:::image type="content" source="media/relocation/keyvault/akv_pattern_design.png" alt-text="Diagram illustrating warm and cold standby relocation methods for Key Vault.":::