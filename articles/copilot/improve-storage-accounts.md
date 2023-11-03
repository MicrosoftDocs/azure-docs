---
title: Improve security and resiliency of storage accounts using Microsoft Copilot for Azure (preview)
description: Learn how Microsoft Copilot for Azure (preview) can improve the security posture and data resiliency of storage accounts.
ms.date: 11/15/2023
ms.topic: conceptual
ms.service: azure
ms.author: jenhayes
author: JnHs
---

# Improve security and resiliency of storage accounts using Microsoft Copilot for Azure (preview)

Microsoft Copilot for Azure (preview) can provide contextual and dynamic responses to harden the security posture and enhance data resiliency of [storage accounts](/azure/storage/common/storage-account-overview).

Responses are dynamic and based on your specific storage account and settings. Based on your prompts, Microsoft Copilot for Azure (preview) runs a security check or a data resiliency check, and provides specific recommendations to improve your storage account.

When you ask Microsoft Copilot for Azure (preview) about improving security accounts, it automatically pulls context when possible, based on the current conversation or on the page you're viewing in the Azure portal. If the context isn't clear, you'll be prompted to specify the storage resource for which you want information.

[!INCLUDE [scenario-note](includes/scenario-note.md)]

## Sample prompts

Here are a few examples of the kinds of prompts you can use to generate Azure CLI scripts. Modify these prompts based on your real-life scenarios, or try additional prompts to create different kinds of queries.

- "How can I make this storage account more secure?"
- "Does this storage account follow security best practices?"
- "Is this storage account vulnerable?"
- "How can I prevent this storage account from being deleted?"
- "How do I protect this storage account's data from data loss or theft?"
- "Prevent malicious users from accessing this storage account."

## Examples

When you're working with a storage account, you can ask "Does this storage account follow security best practices?" Microsoft Copilot for Azure (preview) asks if you'd like to run a security check. After the check, you'll see specific recommendations about things you can do to align your storage account with security best practices.

:::image type="content" source="media/improve-storage-accounts/storage-account-security.png" lightbox="media/improve-storage-accounts/storage-account-security.png" alt-text="Screenshot showing Microsoft Copilot for Azure (preview) providing suggestions on storage account security best practices.":::

You can also ask "How do I protect this storage account's data from data loss or theft?" After confirming you'd like Microsoft Copilot for Azure (preview) to run a data resiliency check, you'll see specific recommendations for protecting its data.

:::image type="content" source="media/improve-storage-accounts/storage-account-data-resiliency.png" lightbox="media/improve-storage-accounts/storage-account-data-resiliency.png" alt-text="Screenshot showing Microsoft Copilot for Azure (preview) providing suggestions to improve storage account data resiliency.":::

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot for Azure (preview).
- Learn more about [Azure Storage](/azure/storage/common/storage-introduction).
- [Request access](https://aka.ms/MSCopilotforAzurePreview) to Microsoft Copilot for Azure (preview).
