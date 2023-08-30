---
title: Protect your key vaults with the Defender for Key Vault plan
description: Learn how to enable the Defender for Key Vault plan on your Azure subscription for Microsoft Defender for Cloud.
ms.topic: install-set-up-deploy
ms.date: 06/29/2023
---

# Protect your key vaults with Defender for Key Vault

Azure Key Vault is a cloud service that safeguards encryption keys and secrets like certificates, connection strings, and passwords.

Enable Microsoft Defender for Key Vault for Azure-native, advanced threat protection for Azure Key Vault, providing an additional layer of security intelligence.

Learn more about [Microsoft Defender for Key Vault](defender-for-key-vault-introduction.md).

You can learn more about Defender for Key Vault's pricing on [the pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

## Enable the Key Vault plan

Microsoft Defender for Key Vault detects unusual and potentially harmful attempts to access or exploit Key Vault accounts. This layer of protection helps you address threats even if you're not a security expert, and without the need to manage third-party security monitoring systems.

**To enable Defender for Key Vault plan on your subscription**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant subscription.

1. On the Defender plans page, toggle the Key Vault plan to **On**.

    :::image type="content" source="media/tutorial-enable-key-vault-plan/enable-key-vault.png" alt-text="Screenshot of the Defender for Cloud plans that shows where to enable the key vault plan toggle." lightbox="media/tutorial-enable-key-vault-plan/enable-key-vault.png":::

1. Select **Save**.

## Next steps

[Overview of Microsoft Defender for Key Vault](defender-for-key-vault-introduction.md)
