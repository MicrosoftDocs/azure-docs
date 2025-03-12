---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 02/21/2025
ms.author: danlep
---   
[!INCLUDE [api-management-key-vault-access](api-management-key-vault-access.md)]
    
**To configure Azure RBAC access:<br/>**

1. In the left menu, select **Access control (IAM)**.
1. On the **Access control (IAM)** page, select **Add role assignment**.
1. On the **Role** tab, select **Key Vault Secrets User**.
1. On the **Members** tab, select **Managed identity** > **+ Select members**.
1. On the **Select managed identity** page, select the system-assigned managed identity or a user-assigned managed identity associated with your API Management instance, and then select **Select**.
1. Select **Review + assign**.