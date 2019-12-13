---
title: How to set up advanced threat protection for Azure Key Vault | Microsoft Docs
description: This article explains how to set up advanced threat protection for Azure Key Vault in Azure Security Center
services: security-center
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: conceptual
ms.date: 11/04/2019
ms.author: memildin

---
# How to set up advanced threat protection for Azure Key Vault (Preview)

Advanced threat protection for Azure Key Vault provides an additional layer of security intelligence. This tool detects potentially harmful attempts to access or exploit Key Vault accounts. Using Security Center's native advanced threat protection, you can address threats without being a security expert, and without learning additional security monitoring systems.

When Security Center detects anomalous activity, it displays alerts. It also emails the subscription administrator with details of the suspicious activity and recommendations for how to investigate and remediate the identified threats. 

> [!NOTE]
> Advanced threat protection for Azure Key Vault is currently only available in North America regions.

## To set up advanced threat protection from Azure Security Center

By default, advanced threat protection is enabled for all of your Key Vault accounts when you subscribe to Security Center's Standard tier (see [pricing](security-center-pricing.md)). 

To enable or disable the protection for a specific subscription:

1. From Security Center's sidebar, click **Pricing & settings**.
1. Select the subscription with the storage accounts for which you want to enable or disable threat protection.
1. Click **Pricing tier**.
1. From the **Select pricing tier by resource type** group, find the Key Vaults row and click **Enabled** or **Disabled**.
    [![Enabling or disabling the advanced threat protection for Key Vault in Azure Security Center](media/advanced-threat-protection-key-vault/atp-for-akv-enable-atp-for-akv.png)](media/advanced-threat-protection-key-vault/atp-for-akv-enable-atp-for-akv.png#lightbox)
1. Click **Save**.


## Next steps

In this article, you learned how to enable and disable advanced threat protection for Azure Key Vault. 

For other related material, see the following article:

- [Threat detection for the Azure services layers in Security Center](security-center-alerts-service-layer.md) - This article describes the alerts related to advanced threat protection for Azure Key Vault