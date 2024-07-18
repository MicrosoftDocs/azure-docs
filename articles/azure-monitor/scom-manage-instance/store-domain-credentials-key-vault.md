---
ms.assetid: 
title: Store domain credentials in Azure Key Vault
description: This article describes how to store domain credentials in Azure Key Vault.
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.date: 05/22/2024
ms.service: azure-monitor
ms.subservice: operations-manager-managed-instance
ms.topic: how-to
---

# Store domain credentials in Azure Key Vault

This article describes how to store domain credentials in Azure Key Vault.

## To store domain credentials in a key vault

1. Go to the key vault resource created in [step 4](create-key-vault.md).

1. On the left pane, under **Objects**, select **Secrets**.
  
   > [!NOTE]
   > You must create two secrets to store the domain account credentials:
   > - Username
   > - Password

1. Select **Generate/Import**.
1. On the **Create a secret** page, do the following:
     1. **Upload options**: Select **Manual**.
     1. **Name**: Enter the name of the secret. For example, you can use **Username** for the username secret and **Password** for the password secret.
     1. **Secret value**: For the username value (in the format **domain\username**), enter the domain account username. For the password value, enter the domain account password. For example, if the domain is contoso.com, the username should be in the format **contoso\username**.
     1. Leave the **Content type (optional)**, **Set activation date**, **Set expiration date**, **Enabled**, and **Tags** areas as default. Select **Create** to create the secret.

## Next steps

- [Create a static IP](create-static-ip.md)