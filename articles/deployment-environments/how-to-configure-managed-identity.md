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

A [managed identity](../active-directory/managed-identities-azure-resources/overview.md) provides elevated privilege capabilities and secure authentication to any service that supports Azure Active Directory (Azure AD) authentication. Azure Deployment Environments Preview uses identities to provide self-serve capabilities to development teams without giving them access to the subscriptions in which the Azure resources are created.

The managed identity attached to the dev center should be [granted Owner access to the deployment subscriptions](how-to-configure-managed-identity.md) configured per environment type. When an environment deployment is requested, the service grants appropriate permissions to the deployment identities configured per environment type to perform deployments on behalf of the user.
The managed identity attached to a dev center will also be used to connect to a [catalog](how-to-configure-catalog.md) and access the [catalog items](configure-catalog-item.md) made available through the catalog.

In this article, you learn:

> [!div class="checklist"]
>
> - Types of managed identities you can use in your dev center
> - How to assign a subscription role assignment to a managed identity
> - How to assign the identity access to a key vault secret

> [!IMPORTANT]
> Azure Deployment Environments currently is in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise are not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Types of managed identities

In Azure Deployment Environments, you can use two types of managed identities:

- **System-assigned identity**: A system-assigned identity is tied either to your dev center or to the project environment type. A system-assigned identity is deleted when the attached resource is deleted. A dev center or a project environment type can have only one system-assigned identity.
- **User-assigned identity**: A user-assigned identity is a standalone Azure resource that can be assigned to your dev center or to a project environment type. For Azure Deployment Environments Preview, a dev center or a project environment type can have only one user-assigned identity.

> [!NOTE]
> In Azure Deployment Environments Preview, if you add both a system-assigned identity and a user-assigned identity, only the user-assigned identity is used.

### Configure a system-assigned managed identity for a dev center

1. Sign in to the [Azure portal](https://portal.azure.com/) and go to Azure Deployment Environments.
1. In **Dev centers**, select your dev center.
1. In the left menu under **Settings**, select **Identity**.
1. Under **System assigned**, set **Status** to **On**.
1. Select **Save**.
1. In **Enable system assigned managed identity**, select **Yes**.

:::image type="content" source="./media/configure-managed-identity/configure-system-assigned-managed-identity.png" alt-text="Screenshot that shows the system assigned managed identity.":::

### Configure a user-assigned managed identity for a dev center

1. Sign in to the [Azure portal](https://portal.azure.com/) and go to Azure Deployment Environments.
1. In **Dev centers**, select your dev center.
1. In the left menu under **Settings**, select **Identity**.
1. Under **User assigned**, select **Add** to attach an existing identity.

   :::image type="content" source="./media/configure-managed-identity/configure-user-assigned-managed-identity.png" alt-text="Screenshot that shows the user assigned managed identity.":::

1. In **Add user assigned managed identity**, enter or select the following information:

    1. In **Subscription**, select the subscription where the identity exists.
    1. In **User assigned managed identities**, select an existing identity.
    1. Select **Add**.

## Assign a subscription role assignment to the managed identity

The identity that's attached to the dev center should be granted Owner access to all the deployment subscriptions and Reader access to all subscriptions that that contain the relevant project. When a user creates or deploys an environment, the service grants appropriate access to the deployment identity that's attached to a project environment type. The deployment identity uses the access to perform deployments on behalf of the user. You can use the managed identity to empower developers to create environments without granting them access to the subscription.

To add a role assignment to a managed identity:

1. For a system-assigned identity, select **Azure role assignments**.
  
    :::image type="content" source="./media/configure-managed-identity/system-assigned-azure-role-assignment.png" alt-text="Screenshot that shows the Azure role assignment for system assigned identity.":::

1. For the user-assigned identity, select the specific identity, and then select the **Azure role assignments** from the left pane.

1. On the **Azure role assignments** page, select **Add role assignment (Preview)** and provide the following details:

    1. For **Scope**, select **SubScription** from the dropdown. 
    1. For **Subscription**, select the target subscription to use from the dropdown.
    1. For **Role**, select **Owner** from the dropdown.
    1. Select **Save**.

## Assign the managed identity access to the key vault secret

You can set up your key vault to use either a [key vault access policy'](../key-vault/general/assign-access-policy.md) or the [Azure role-based access control](../key-vault/general/rbac-guide.md) permission model.

> [!NOTE]
> Providing the identity with access to the key vault secret, which contains the repository's personal access token, is a prerequisite to adding the repo as a catalog.

### Key vault access policy

If the key vault is configured to use the key vault access policy permission model:

1. In the [Azure portal](https://portal.azure.com/), go to the key vault that contains the personal access token secret.
1. In the left menu, select **Access policies**, and then select **Create**.
1. In **Create an access policy**, enter or select the following information:

    1. Under **Permissions**, under **Secret permissions**, select the **Get** checkbox. Select **Next**.
    1. Under **Principal**, select the identity that's attached to the dev center.
    1. Select **Review + create**, and then select **Create**.

### Azure role-based access control

If the Key Vault is configured to use **Azure role-based access control** permission model,

1. Select the specific identity and select the **Azure role assignments** from the left pane.
1. Select **Add Role Assignment** and provide the following details:

    1. Select Key Vault from the **Scope** dropdown.
    1. Select the **Subscription** in which the Key Vault exists.
    1. Select the specific Key Vault for **Resource**.
    1. Select **Key Vault Secrets User** from the dropdown for **Role**.
    1. Select **Save**.

## Next steps

- Learn how to [add and configure a catalog](how-to-configure-catalog.md).
- Learn how to [create and configure a project environment type](how-to-configure-project-environment-types.md).
