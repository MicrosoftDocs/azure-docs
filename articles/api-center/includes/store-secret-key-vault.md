---
title: Include file
description: Include file
services: api-center
author: dlepow

ms.service: azure-api-center
ms.topic: include
ms.date: 04/28/2025
ms.author: danlep
ms.custom: Include file
---


To store the API key as a secret in the key vault, see [Set and retrieve secret in Key Vault](/azure/key-vault/secrets/quick-create-portal).

#### Enable a managed identity in your API center

For this scenario, your API center uses a [managed identity](/entra/identity/managed-identities-azure-resources/overview) to access the key vault. Depending on your needs, enable either a system-assigned or one or more user-assigned managed identities. 

The following example shows how to enable a system-assigned managed identity by using the Azure portal. At a high level, configuration steps are similar for a user-assigned managed identity. 


1. In the [portal](https://azure.microsoft.com), navigate to your API center.
1. In the left menu, under **Security**, select **Managed identities**.
1. Select **System assigned**, and set the status to **On**.
1. Select **Save**.

#### Assign the Key Vault Secrets User role to the managed identity

Assign your API center's managed identity the **Key Vault Secrets User** role in your key vault. The following steps use the Azure portal.

1. In the [portal](https://azure.microsoft.com), navigate to your key vault.
1. In the left menu, select **Access control (IAM)**.
1. Select **+ Add role assignment**.
1. On the **Add role assignment** page, set the values as follows: 
    1. On the **Role** tab, select **Key Vault Secrets User**.
    1. On the **Members** tab, in **Assign access to**, select **Managed identity** > **+ Select members**.
    1. On the **Select managed identities** page, select the system-assigned managed identity of your API center that you added in the previous section. Click **Select**.
    1. Select **Review + assign** twice.
