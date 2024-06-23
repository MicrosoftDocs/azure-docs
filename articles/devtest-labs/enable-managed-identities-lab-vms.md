---
title: Enable managed identities on your lab VMs
description: This article shows how a lab owner can enable user-assigned managed identities on your lab virtual machines. 
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 06/26/2020
ms.custom: UpdateFrequency2
---

# Enable user-assigned managed identities on lab virtual machines in Azure DevTest Labs
As a lab owner, you can enable user-assigned managed identities on your lab virtual machines (VMs) in Azure DevTest Labs.

A managed identity can be used to authenticate to any service that supports Microsoft Entra authentication, including Key Vault, without passing any credentials in the code. For more information on managed identities, see [What is managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md).

With this feature, lab users can share Azure resources such as Azure SQL Database in the context of the lab. The authentication to the resource is taken care by the identity itself. Once configured, every existing/newly created lab VM will be enabled with this identity. Lab users can access resources once logged in to their machines.

> [!NOTE]
> You can add multiple user assigned managed identities to be enabled on your lab VMs.

## Use Azure portal
To add a user assigned managed identity for lab VMs, follow these steps:

1. [Create a user-assigned managed identity in your subscription](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity)
1. Navigate to the **Configuration and policies** page for your lab.
1. Select **Identity (Preview)** on the left menu.
1. Select the **Virtual machine** tab.
1. Select **Add** to select an existing identity from a pre-populated dropdown list. 

    > [!div class="mx-imgBorder"]
    > ![Add identity button](./media/enable-managed-identities-lab-vms/add-identity-button.png)
1. Select an existing **user-managed identity** from the dropped-down list, and select **OK**. 

    > [!div class="mx-imgBorder"]
    > ![Add identity](./media/enable-managed-identities-lab-vms/add-identity.png)

## Use API

1.	After creating an identity, note the resource ID of the identity. It should look like the following sample: 

    `/subscriptions/0000000000-0000-0000-0000-00000000000000/resourceGroups/{rg}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}`.
    
2. Perform a PUT HTTPS method on the lab resource to add one or multiple user assigned identities to the **managementIdentities** field.


    ```json
    {
        "location": "southeastasia",
        "properties": {
	    ...
            "managementIdentities": {
               "/subscriptions/0000000000-0000-0000-0000-00000000000000/resourceGroups/{rg}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}": {}
	    },
	    ...
        },
	...
    }
    ```

## Next steps
To learn more about managed identities, see [What is managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md).
