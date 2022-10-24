---
title: Configure a managed identity
titleSuffix: Azure Deployment Environments
description: Learn how to configure a managed identity that'll be used to deploy environments.
ms.service: deployment-environments
ms.custom: ignite-2022
ms.author: meghaanand
author: anandmeg
ms.date: 10/12/2022
ms.topic: how-to
---

# Configure a managed identity

 A [Managed Identity](../active-directory/managed-identities-azure-resources/overview.md) is used to provide elevation-of-privilege capabilities and securely authenticate to any service that supports Azure Active Directory (Azure AD) authentication. Azure Deployment Environments Preview service uses identities to provide self-serve capabilities to your development teams without granting them access to the target subscriptions in which the Azure resources are created.

The managed identity attached to the dev center should be [granted 'Owner' access to the deployment subscriptions](how-to-configure-managed-identity.md) configured per environment type. When an environment deployment is requested, the service grants appropriate permissions to the deployment identities configured per environment type to perform deployments on behalf of the user.
The managed identity attached to a dev center will also be used to connect to a [catalog](how-to-configure-catalog.md) and access the [catalog items](configure-catalog-item.md) made available through the catalog.

In this article, you'll learn about:

* Types of managed identities
* Assigning a subscription role assignment to the managed identity
* Assigning the identity access to the Key Vault secret

> [!IMPORTANT]
> Azure Deployment Environments is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Types of managed identities

In Azure Deployment Environments, you can use two types of managed identities:

* A **system-assigned identity** is tied to either your dev center or the project environment type and is deleted when the attached resource is deleted. A dev center or a project environment type can have only one system-assigned identity.
* A **user-assigned identity** is a standalone Azure resource that can be assigned to your dev center or to a project environment type. For Azure Deployment Environments Preview, a dev center or a project environment type can have only one user-assigned identity.

> [!NOTE]
> If you add both a system-assigned identity and a user-assigned identity, only the user-assigned identity will be used by the service.

### Configure a system-assigned managed identity for a dev center

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Access Azure Deployment Environments.
1. Select your dev center from the list.
1. Select **Identity** from the left pane.
1. On the **System assigned** tab, set the **Status** to **On**, select **Save** and then confirm enabling a System assigned managed identity.

:::image type="content" source="./media/configure-managed-identity/configure-system-assigned-managed-identity.png" alt-text="Screenshot showing the system assigned managed identity.":::


### Configure a user-assigned managed identity for a dev center

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Access Azure Deployment Environments.
1. Select your dev center from the list.
1. Select **Identity** from the left pane.
1. Switch to the **User assigned** tab and select **+ Add** to attach an existing identity.

:::image type="content" source="./media/configure-managed-identity/configure-user-assigned-managed-identity.png" alt-text="Screenshot showing the user assigned managed identity.":::

1. On the **Add user assigned managed identity** page, add the following details:
    1. Select the **Subscription** in which the identity exists.
    1. Select an existing **User assigned managed identities** from the dropdown.
    1. Select **Add**.

## Assign a subscription role assignment to the managed identity

The identity attached to the dev center should be granted 'Owner' access to all the deployment subscriptions, as well as 'Reader' access to all subscriptions that a project lives in. When a user creates or deploys an environment, the service grants appropriate access to the deployment identity attached to a project environment type and use it to perform deployment on behalf of the user. This will allow you to empower developers to create environments without granting them access to the subscription and abstract Azure governance related constructs from them.

1. To add a role assignment to the managed identity:
    1. For a system-assigned identity, select **Azure role assignments**.
    
    :::image type="content" source="./media/configure-managed-identity/system-assigned-azure-role-assignment.png" alt-text="Screenshot showing the Azure role assignment for system assigned identity.":::

    1. For the user-assigned identity, select the specific identity, and then select the **Azure role assignments** from the left pane.

1. On the **Azure role assignments** page, select **Add role assignment (Preview)** and provide the following details:
    1. For **Scope**, select **SubScription** from the dropdown. 
    1. For **Subscription**, select the target subscription to use from the dropdown.
    1. For **Role**, select **Owner** from the dropdown.
    1. Select **Save**.

## Assign the managed identity access to the Key Vault secret

>[!NOTE] 
> Providing the identity with access to the Key Vault secret, which contains the repo's personal access token (PAT), is a prerequisite to adding the repo as a catalog.

To grant the identity access to the secret:

A Key Vault can be configured to use either the [Vault access policy'](../key-vault/general/assign-access-policy.md) or the [Azure role-based access control](../key-vault/general/rbac-guide.md) permission model.

1. If the Key Vault is configured to use the **Vault access policy** permission model, 
    1. Access the [Azure portal](https://portal.azure.com/) and search for the specific Key Vault that contains the PAT secret.
    1. Select **Access policies** from the left pane.
    1. Select **+ Create**.
    1. On the **Create an access policy** page, provide the following details:
        1. Enable **Get** for **Secret permissions** on the **Permissions** page.
        1. Select the identity that is attached to the dev center as **Principal**.
        1. Select **Create** on the **Review + create** page.

1. If the Key Vault is configured to use **Azure role-based access control** permission model,
    1. Select the specific identity and select the **Azure role assignments** from the left pane.
    1. Select **Add Role Assignment** and provide the following details:
        1. Select Key Vault from the **Scope** dropdown.
        1. Select the **Subscription** in which the Key Vault exists.
        1. Select the specific Key Vault for **Resource**.
        1. Select **Key Vault Secrets User** from the dropdown for **Role**.
        1. Select **Save**.

## Next steps

* [Configure a Catalog](how-to-configure-catalog.md)
* [Configure a project environment type](how-to-configure-project-environment-types.md)
