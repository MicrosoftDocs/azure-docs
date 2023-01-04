---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 01/04/2023
ms.author: danlep
---

1. Assign permissions to the managed identity so that it can access secrets from the vault. Configure either [Azure RBAC access](../key-vault/general/rbac-guide.md) or a [key vault access policy](../key-vault/general/assign-access-policy-portal.md).
    
    To configure Azure RBAC access:

    1. In the portal, navigate to your key vault.
    1. Select **Settings** > **Access configuration**.
    1. In **Permission model**, select **Azure role-based access control**, and select **Apply**
    1. Select **Go to access control (IAM)**.
    1. On the **Access control (IAM)** page, select **Add role assignment**.
        1. On the **Role** tab, select **Key Vault Reader**.
        1. On the **Members** tab, select **Managed identity** > **+ Select members**.
        1. On the **Select managed identity** page, select a managed identity associated with your API Management instance, and then select **Select**.
        1. Select **Review + assign**.
    
    To add a key vault access policy:

    1. In the portal, navigate to your key vault.
    1. Select **Settings > Access configuration**.
    1. In **Permission model**, select **Vault access policy**, and select **Apply**.
    1. Select **Go to access policies**.
    1. Select **+Create**.
    1. Select **Secret permissions**, then select **Get** and **List**.
    1. In **Select principal**, select the resource name of your managed identity. If you're using a system-assigned identity, the principal is the name of your API Management instance.
