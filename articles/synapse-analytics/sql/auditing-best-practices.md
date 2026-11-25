---
title: Auditing Best Practices for Production Environments
titleSuffix: Azure Synapse Analytics
description: Review best practices for Azure Synapse Analytics auditing in production environments.
author: sravanisaluru
ms.author: srsaluru
ms.reviewer: mathoma
ms.date: 10/05/2026
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: best-practice
---

# Auditing best practices for Azure Synapse Analytics production environments

[!INCLUDE [synapse-fabric-migration](../includes/synapse-fabric-migration.md)]

Here are some recommendations for using Azure Synapse Analytics SQL Auditing in production environments.

## Storage key regeneration

In production, you're likely to refresh your storage keys periodically. When writing audit logs to Azure storage, you need to resave your auditing policy when refreshing your keys. The process is as follows:

1. Open **Advanced properties** under **Storage**. In the **Storage Access Key** section, select **Secondary**. Then select **Save** at the top of the auditing configuration page.

1. Go to the Azure **Storage account** that holds the key, and navigate to **Access keys**. Select the refresh icon button to regenerate the primary access key.

1. Go back to the auditing configuration page, switch the storage access key from secondary to primary, and then select **OK**. Then select **Save** at the top of the auditing configuration page.
1. Go back to the storage configuration page and regenerate the secondary access key (in preparation for the next key's refresh cycle).

## Storage account encrypted with Azure Key Vault

When you configure auditing with a storage account as the target, which is encrypted using a key vault behind a firewall, you must set up an **access policy** for the key vault. Navigate to the Azure Key Vault access policy, add a new policy with the necessary key permissions, enable the **unwrap key** option, and select the appropriate principal (such as the storage account) to grant access.
## Related content

- [Auditing in Azure Synapse Analytics](auditing-overview.md)
- [Set up auditing for Azure Synapse Analytics](auditing-setup.md)
- [Auditing using managed identity in Azure Synapse Analytics](auditing-managed-identity.md)
