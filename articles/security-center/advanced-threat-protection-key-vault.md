---
title: Set up advanced threat protection for Azure Key Vault | Microsoft Docs
description: This article explains how to set up advanced threat protection for Azure Key Vault in Azure Security Center
services: security-center
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: conceptual
ms.date: 11/04/2019
ms.author: memildin

---
# Set up advanced threat protection for Azure Key Vault (preview)

Advanced threat protection for Azure Key Vault provides an additional layer of security intelligence. This tool detects potentially harmful attempts to access or exploit Key Vault accounts. Using the native advanced threat protection in Azure Security Center, you can address threats without being a security expert, and without learning additional security monitoring systems.

When Security Center detects anomalous activity, it displays alerts. It also emails the subscription administrator with details of the suspicious activity and recommendations for how to investigate and remediate the identified threats.

## Set up advanced threat protection from Azure Security Center

By default, advanced threat protection is enabled for all of your Key Vault accounts when you subscribe to the Security Center Standard tier. For more information, see [Pricing](security-center-pricing.md).

To enable or disable the protection for a specific subscription, follow these steps.

1. From the left pane in Security Center, select **Pricing & settings**.
1. Select the subscription with the storage accounts for which you want to enable or disable threat protection.
1. Select **Pricing tier**.
1. From the **Select pricing tier by resource type** group, find the **Key Vaults** row and select **Enabled** or **Disabled**.

    [![Enabling or disabling advanced threat protection for Key Vault in Azure Security Center](media/advanced-threat-protection-key-vault/atp-for-akv-enable-atp-for-akv.png)](media/advanced-threat-protection-key-vault/atp-for-akv-enable-atp-for-akv.png#lightbox)
1. Select **Save**.


## Next steps

In this article, you learned how to enable and disable advanced threat protection for Azure Key Vault. 

For other related material, see the following article:

- [Threat detection for the Azure services layers in Security Center](security-center-alerts-service-layer.md): This article describes the alerts related to advanced threat protection for Azure Key Vault.
