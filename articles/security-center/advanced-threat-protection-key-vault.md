---
title: Using Azure Defender for Key Vault
description: Learn how to This article explains how to set up advanced threat protection for Azure Key Vault in Azure Security Center
services: security-center
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: how-to
ms.date: 09/12/2020 
ms.author: memildin

---
# Use Azure Defender for Key Vault to secure your vaults

**Azure Defender for Key Vault** provides an additional layer of security intelligence for your vaults. 

This optional plan detects potentially harmful attempts to access or exploit Key Vault accounts. Using the native advanced threat protection in Azure Security Center, you can address threats without being a security expert, and without learning additional security monitoring systems.

When Azure Defender detects anomalous activity, it displays alerts. It also emails the subscription administrator with details of the suspicious activity and recommendations for how to investigate and remediate the identified threats.

## Enable Azure Defender for Key Vault

By default, advanced threat protection is enabled for all of your Key Vault accounts when you enable Azure Defender.

## Disable Azure Defender for Key Vault

To disable the protection for a specific subscription:

1. From Security Center's menu, select **Pricing & settings**.

1. Select the subscription with the storage accounts for which you want to enable or disable **Azure Defender for Key Vault**.

1. In the **Azure Defender Plans** section, toggle the plan to **Off**

    :::image type="content" source="./media/advanced-threat-protection-key-vault/disable-defender-key-plan.png" alt-text="Disabling Azure Defender for Key Vault":::

1. Select **Save**.

## Next steps

In this article, you learned how to enable and disable advanced threat protection for Azure Key Vault. 

For related material, see the following article:

- [Key Vault security alerts](alerts-reference.md#alerts-azurekv)--The Key Vault section of the reference table for all Azure Security Center alerts