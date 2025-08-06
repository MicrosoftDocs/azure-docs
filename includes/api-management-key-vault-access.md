---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 01/11/2023
ms.author: danlep
---

### Configure access to key vault

1. In the portal, go to your key vault.
1. In the left menu, select **Access configuration**. Note the **Permission model** that's configured.
1. Depending on the permission model, configure either a [key vault access policy](/azure/key-vault/general/assign-access-policy) or [Azure RBAC access](/azure/key-vault/general/rbac-guide) for an API Management managed identity.
    
**To add a key vault access policy:**

1. In the left menu, select **Access policies**.
1. On the **Access policies** page, select **+ Create**.
1. On the **Permissions** tab, under **Secret permissions**, select **Get** and **List**, and then select **Next**.
1. On the **Principal** tab,  select **Principal**, search for  the resource name of your managed identity, and then select **Next**.
     If you're using a system-assigned identity, the principal is the name of your API Management instance.
1. Select **Next** again. On the **Review + create** tab, select **Create**.

    

