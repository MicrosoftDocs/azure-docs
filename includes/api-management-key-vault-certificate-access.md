---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 02/21/2025
ms.author: danlep
---   
[!INCLUDE [api-management-key-vault-access](api-management-key-vault-access.md)]
    
**To configure Azure RBAC access:**

1. In the left menu, select **Access control (IAM)**.
1. On the **Access control (IAM)** page, select **Add role assignment**.
1. On the **Role** tab, select **Key Vault Certificate User**.
1. On the **Members** tab, select **Managed identity** > **+ Select members**.
1. In the **Select managed identities** window, select the system-assigned managed identity or a user-assigned managed identity that's associated with your API Management instance, and then click **Select**.
1. Select **Review + assign**.