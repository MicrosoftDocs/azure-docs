---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 12/01/2021
ms.author: inhenkel
ms.custom: portal
---

<!-- Use the portal to add use either a user managed identity or system managed identity for account encryption -->

## Use either a user-managed identity or a system-managed identity for account encryption

You can assign either a user-managed identity or a system-managed identity for account encryption.

1. Navigate to the Media Services account in the Azure portal.
1. Select **Encryption** from the left navigation menu. The Microsoft-managed keys radio button should already be selected.
1. Select the **Customer-managed keys** radio button.  The Managed-identity dropdown list will appear.
1. Select either the user-managed identity that you want to use or select **System-assigned** from the dropdown list. The Encryption key radio buttons will appear.
1. Continue the setup for Key Vault and key.
1. Select **Save**.