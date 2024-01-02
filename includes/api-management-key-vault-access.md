---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 01/11/2023
ms.author: danlep
---

### Configure access to key vault
1. In the portal, navigate to your key vault.
1. In the left menu, select **Access configuration**, and note the **Permission model** that is configured.
1. Depending on the permission model, configure either a [key vault access policy](../articles/key-vault/general/assign-access-policy.md) or [Azure RBAC access](../articles/key-vault/general/rbac-guide.md) for an API Management managed identity.
    
    **To add a key vault access policy:<br/>**
    
    1. In the left menu, select **Access policies**.
    1. On the **Access policies** page,select **+ Create**.
    1. On the **Permissions** tab, under **Secret permissions**, select **Get** and **List**, then select **Next**.
    1. On the **Principal** tab,  **Select principal**, search for  the resource name of your managed identity, and then select **Next**.
         If you're using a system-assigned identity, the principal is the name of your API Management instance.
    1. Select **Next** again. On the **Review + create** tab, select **Create**.
    
    **To configure Azure RBAC access:<br/>**

    1. In the left menu, select **Access control (IAM)**.
    1. On the **Access control (IAM)** page, select **Add role assignment**.
    1. On the **Role** tab, select **Key Vault Secrets User**.
    1. On the **Members** tab, select **Managed identity** > **+ Select members**.
    1. On the **Select managed identity** page, select the system-assigned managed identity or a user-assigned managed identity associated with your API Management instance, and then select **Select**.
    1. Select **Review + assign**.
