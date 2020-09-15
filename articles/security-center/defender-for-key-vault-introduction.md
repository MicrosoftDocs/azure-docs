---
title: Azure Defender for Key Vault - the benefits and features
description: Learn about the benefits and features of Azure Defender for Key Vault.
author: memildin
ms.author: memildin
ms.date: 9/12/2020
ms.topic: conceptual
ms.service: security-center
manager: rkarlin

---

# Introduction to Azure Defender for Key Vault

> [!NOTE]
> This service is not currently available in Azure government and sovereign cloud regions.

Azure Key Vault is a cloud service that safeguards encryption keys and secrets like certificates, connection strings, and passwords. 

Enable **Azure Defender for Key Vault** for Azure-native, advanced threat protection for Azure Key Vault, providing an additional layer of security intelligence. 

Azure Defender detects unusual and potentially harmful attempts to access or exploit Key Vault accounts. This layer of protection allows you to address threats without being a security expert, and without the need to manage third-party security monitoring systems.  

When anomalous activities occur, Azure Defender shows alerts and optionally sends them via email to relevant members of your organization. These alerts include the details of the suspicious activity and recommendations on how to investigate and remediate threats. 

## Azure Defender for Key Vault alerts
When you get an alert from Azure Defender for Key Vault, we recommend you investigate and respond to the alert as described in [Respond to Azure Defender for Key Vault](defender-for-key-vault-usage.md). Azure Defender for Key Vault protects applications and credentials, so even if you're familiar with the application or user that triggered the alert, it's important to check the situation surrounding every alert.

The alerts appear in Key Vault's **Security** page, the Azure Defender dashboard, and Security Center's alerts page.

:::image type="content" source="./media/defender-for-key-vault-intro/key-vault-security-page.png" alt-text="Azure Key Vault's security page":::

## Next steps

In this article, you learned about Azure Defender for Key Vault.

For related material, see the following articles: 

- [Key Vault security alerts](alerts-reference.md#alerts-azurekv)--The Key Vault section of the reference table for all Azure Security Center alerts
- [Exporting alerts to a SIEM](continuous-export.md)
- [Suppress alerts from Azure Defender](alerts-suppression-rules.md)