---
title: Azure Government Security + Identity | Microsoft Docs
description: This provides a comparision of features and guidance on developing applications for Azure Government
services: azure-government
cloud: gov
documentationcenter: ''
author: ryansoc
manager: zakramer

ms.assetid: e2fe7983-5870-43e9-ae01-2d45d3102c8a
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 11/14/2016
ms.author: ryansoc

---
# Azure Government security and identity
## Key Vault
For details about Key Vault and how to use it, see the [Azure Key Vault public documentation](../key-vault/index.md).

### Data considerations
The following information identifies the Azure Government boundary for Azure Key Vault:

| Regulated/controlled data that's permitted | Regulated/controlled data that's not permitted |
| --- | --- |
| All data that's encrypted with Azure Key Vault key might contain regulated or controlled data. |Azure Key Vault metadata cannot contain export-controlled data. This metadata includes all configuration data that you entered while creating and maintaining  Key Vault.  Do not enter regulated or controlled data into the following fields: Resource group names, Key Vault names, Subscription names. |

Key Vault is generally available in Azure Government. There is no extension, so Key Vault is available through PowerShell and CLI only.

## Next steps
For supplemental information and updates, subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government blog. </a>

