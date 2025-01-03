---
title: Use managed identities to access Azure Key Vault certificates
titleSuffix: Azure Front Door
description: This article shows you how to set up managed identities with Azure Front Door to access certificates in an Azure Key Vault.
services: networking
author: duongau
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 11/12/2024
ms.author: duau
---

# Use managed identities to access Azure Key Vault certificates

Managed identities provided by Microsoft Entra ID enable your Azure Front Door instance to securely access other Microsoft Entra protected resources, such as Azure Key Vault, without the need to manage credentials. For more information, see [What are managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md).

> [!NOTE]
> Managed identity support in Azure Front Door is limited to accessing Azure Key Vault. It can't be used to authenticate from Front Door to origins such as Blob Storage or Web Apps.

After you enable managed identity for Azure Front Door and granting the necessary permissions to your Azure Key Vault, Front Door will use the managed identity to access certificates. Without these permissions, custom certificate autorotation and adding new certificates fail. If managed identity is disabled, Azure Front Door will revert to using the original configured Microsoft Entra App, which isn't recommended and will be deprecated in the future.

Azure Front Door supports two types of managed identities:

* **System-assigned identity**: This identity is tied to your service and is deleted if the service is deleted. Each service can have only one system-assigned identity.
* **User-assigned identity**: This is a standalone Azure resource that can be assigned to your service. Each service can have multiple user-assigned identities.

Managed identities are specific to the Microsoft Entra tenant where your Azure subscription is hosted. If a subscription is moved to a different directory, you need to recreate and reconfigure the identity.

You can configure Azure Key Vault access using either [role-based access control (RBAC)](#role-based-access-control-rbac) or [access policy](#access-policy).

## Prerequisites

Before setting up managed identity for Azure Front Door, ensure you have an Azure Front Door Standard or Premium profile. To create a new profile, see [create an Azure Front Door](create-front-door-portal.md).

## Enable managed identity

1. Navigate to your existing Azure Front Door profile. Select **Identity** under *Security* in the left menu.

    :::image type="content" source="./media/managed-identity/overview.png" alt-text="Screenshot of the identity button under settings for a Front Door profile.":::

1. Choose either a **System assigned** or **User assigned** managed identity.

    * **[System assigned](#system-assigned)** - A managed identity tied to the Azure Front Door profile lifecycle, used to access Azure Key Vault.
    
    * **[User assigned](#user-assigned)** - A standalone managed identity resource with its own lifecycle, used to authenticate to Azure Key Vault.

    ### System assigned
    
    1. Toggle the *Status* to **On** and select **Save**.
    
        :::image type="content" source="./media/managed-identity/system-assigned.png" alt-text="Screenshot of the system assigned managed identity configuration page.":::
    
    1. Confirm the creation of a system managed identity for your Front Door profile by selecting **Yes** when prompted.
    
        :::image type="content" source="./media/managed-identity/system-assigned-confirm.png" alt-text="Screenshot of the system assigned managed identity confirmation message.":::
    
    1. Once created and registered with Microsoft Entra ID, use the **Object (principal) ID** to grant Azure Front Door access to your Azure Key Vault.
    
        :::image type="content" source="./media/managed-identity/system-assigned-created.png" alt-text="Screenshot of the system assigned managed identity registered with Microsoft Entra ID.":::
    
    ### User assigned

    To use a user-assigned managed identity, you must have one already created. For instructions on creating a new identity, see [create a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md).

    1. In the **User assigned** tab, select **+ Add** to add a user-assigned managed identity.

        :::image type="content" source="./media/managed-identity/user-assigned.png" alt-text="Screenshot of the user-assigned managed identity configuration page.":::

    1. Search for and select the user-assigned managed identity. Then select **Add** to attach it to the Azure Front Door profile.

        :::image type="content" source="./media/managed-identity/add-user-managed-identity.png" alt-text="Screenshot of the add user-assigned managed identity page.":::

    1. The name of the selected user-assigned managed identity appears in the Azure Front Door profile.

        :::image type="content" source="./media/managed-identity/user-assigned-configured.png" alt-text="Screenshot of the user-assigned managed identity added to the Front Door profile.":::

    ---

## Configure Key Vault access

You can configure Azure Key Vault access using either of the following methods:

* **[Role-based access control (RBAC)](#role-based-access-control-rbac)** - Provides fine-grained access control using Azure Resource Manager.
* **[Access policy](#access-policy)** - Uses native Azure Key Vault access control.

For more information, see [Azure role-based access control (Azure RBAC) vs. access policy](/azure/key-vault/general/rbac-access-policy).

### Role-based access control (RBAC)

1. Navigate to your Azure Key Vault. Select **Access control (IAM)** from the *Settings* menu, then select **+ Add** and choose **Add role assignment**.

    :::image type="content" source="./media/managed-identity/role-based-access-control.png" alt-text="Screenshot of the access control (IAM) page for a Key Vault.":::

1. On the *Add role assignment* page, search for **Key Vault Secret User** and select it from the search results.

    :::image type="content" source="./media/managed-identity/role-based-access-control-search.png" alt-text="Screenshot of the add role assignment page for a Key Vault.":::

1. Go to the **Members** tab, select **Managed identity**, then select **+ Select members**.

    :::image type="content" source="./media/managed-identity/role-based-access-control-members.png" alt-text="Screenshot of the members tab for the add role assignment page for a Key Vault.":::

1. Choose the *system-assigned* or *user-assigned* managed identity associated with your Azure Front Door, then select **Select**.

    :::image type="content" source="./media/managed-identity/role-based-access-control-select.png" alt-text="Screenshot of the select members page for the add role assignment page for a Key Vault.":::

1. Select **Review + assign** to finalize the role assignment.

    :::image type="content" source="./media/managed-identity/role-based-access-control-review.png" alt-text="Screenshot of the review and assign page for the add role assignment page for a Key Vault.":::

### Access policy

1. Navigate to your Azure Key Vault. Under *Settings*, select **Access policies** and then select **+ Create**.

    :::image type="content" source="./media/managed-identity/access-policies.png" alt-text="Screenshot of the access policies page for a Key Vault.":::

1. On the *Create an access policy* page, go to the **Permissions** tab. Under *Secret permissions*, select **List** and **Get**. Then select **Next** to proceed to the principal tab.

    :::image type="content" source="./media/managed-identity/permissions.png" alt-text="Screenshot of the permissions tab for the Key Vault access policy.":::

1. On the *Principal* tab, enter the **object (principal) ID** for a system-assigned managed identity or the **name** for a user-assigned managed identity. Then select **Review + create**. The *Application* tab is skipped as Azure Front Door is automatically selected.

    :::image type="content" source="./media/managed-identity/system-principal.png" alt-text="Screenshot of the principal tab for the Key Vault access policy.":::

1. Review the access policy settings and select **Create** to finalize the access policy.

    :::image type="content" source="./media/managed-identity/create.png" alt-text="Screenshot of the review and create tab for the Key Vault access policy.":::

## Verify access

1. Go to the Azure Front Door profile where you enabled managed identity and select **Secrets** under *Security*.

    :::image type="content" source="./media/managed-identity/secrets.png" alt-text="Screenshot of accessing secrets from under settings of a Front Door profile.":::

1. Confirm that **Managed identity** appears under the *Access role* column for the certificate used in Front Door. If setting up managed identity for the first time, add a certificate to Front Door to see this column.

    :::image type="content" source="./media/managed-identity/confirm-set-up.png" alt-text="Screenshot of Azure Front Door using managed identity to access certificate in Key Vault.":::

## Next steps

* Learn more about [End-to-end TLS encryption](end-to-end-tls.md).
* Learn how to [configure HTTPS on an Azure Front Door custom domain](standard-premium/how-to-configure-https-custom-domain.md).
