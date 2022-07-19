---
author: AlexandraKemperMS
ms.author: alkemper
ms.service: azure-app-configuration
ms.topic: include
ms.date: 05/03/2021
---

Assign the proper App Configuration role assignments to the credentials being used within the task so that the task can access the App Configuration store.

1. Go to your target App Configuration store. 
1. In the left menu, select **Access control (IAM)**.
1. In the right pane, select **Add role assignments**.
    
    :::image type="content" source="./media/azure-app-configuration-role-assignment/add-role-assignment-button.png" alt-text="Screenshot shows the Add role assignments button.":::

1. For **Role**, select **App Configuration Data Owner**. This role allows the task to read from and write to the App Configuration store. 
1. Select the service principal associated with the service connection that you created in the previous section.

    :::image type="content" source="./media/azure-app-configuration-role-assignment/add-role-assignment.png" alt-text="Screenshot shows the Add role assignment dialog.":::

1. If the store contains Key Vault references, go to relevant Key Vault and assign **Key Vault Secret User** role to the service principal created in the previous step. From the Key Vault menu, select **Access policies** and ensure [Azure role-based access control](../articles/key-vault/general/rbac-guide.md) is selected as the permission model. 
