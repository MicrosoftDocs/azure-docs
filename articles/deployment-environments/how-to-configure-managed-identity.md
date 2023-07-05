---
title: Configure a managed identity
titleSuffix: Azure Deployment Environments
description: Learn how to configure a managed identity to deploy environments in your Azure Deployment Environments dev center.
ms.service: deployment-environments
ms.custom: ignite-2022, build-2023
author: RoseHJM
ms.author: rosemalcolm
ms.date: 04/25/2023
ms.topic: how-to
---

# Configure a managed identity for a dev center

A [managed identity](../active-directory/managed-identities-azure-resources/overview.md) adds elevated-privileges capabilities and secure authentication to any service that supports Azure Active Directory (Azure AD) authentication. Azure Deployment Environments uses identities to give development teams self-serve deployment capabilities without giving them access to the subscriptions in which Azure resources are created.

The managed identity that's attached to a dev center should be [assigned the Owner role in the deployment subscriptions](how-to-configure-managed-identity.md#assign-a-subscription-role-assignment-to-the-managed-identity) for each environment type. When an environment deployment is requested, the service grants appropriate permissions to the deployment identities that are set up for the environment type to deploy on behalf of the user.
The managed identity that's attached to a dev center also is used to add to a [catalog](how-to-configure-catalog.md) and access [environment definitions](configure-environment-definition.md) in the catalog.

In this article, you learn how to:

> [!div class="checklist"]
>
> - Add a managed identity to your dev center
> - Assign a subscription role assignment to a managed identity
> - Grant access to a key vault secret for a managed identity

## Add a managed identity

In Azure Deployment Environments, you can choose between two types of managed identities:

- **System-assigned identity**: A system-assigned identity is tied either to your dev center or to the project environment type. A system-assigned identity is deleted when the attached resource is deleted. A dev center or a project environment type can have only one system-assigned identity.
- **User-assigned identity**: A user-assigned identity is a standalone Azure resource that you can assign to your dev center or to a project environment type. For Azure Deployment Environments, a dev center or a project environment type can have only one user-assigned identity.

As a security best practice, if you choose to use user-assigned identities, use different identities for your project and your dev center. Project identities should have more limited access to resources compared to a dev center.

> [!NOTE]
> In Azure Deployment Environments, if you add both a system-assigned identity and a user-assigned identity, only the user-assigned identity is used.

### Add a system-assigned managed identity to a dev center

1. Sign in to the [Azure portal](https://portal.azure.com/) and go to Azure Deployment Environments.
1. On **Dev centers**, select your dev center.
1. On the left menu under **Settings**, select **Identity**.
1. Under **System assigned**, set **Status** to **On**.
1. Select **Save**.
1. In the **Enable system assigned managed identity** dialog, select **Yes**.

:::image type="content" source="./media/configure-managed-identity/configure-system-assigned-managed-identity.png" alt-text="Screenshot that shows the system-assigned managed identity.":::

### Add a user-assigned managed identity to a dev center

1. Sign in to the [Azure portal](https://portal.azure.com/) and go to Azure Deployment Environments.
1. On **Dev centers**, select your dev center.
1. On the left menu under **Settings**, select **Identity**.
1. Under **User assigned**, select **Add** to attach an existing identity.

   :::image type="content" source="./media/configure-managed-identity/configure-user-assigned-managed-identity.png" alt-text="Screenshot that shows the user-assigned managed identity.":::

1. On **Add user assigned managed identity**, enter or select the following information:

    1. On **Subscription**, select the subscription in which the identity exists.
    1. On **User assigned managed identities**, select an existing identity.
    1. Select **Add**.

## Assign a subscription role assignment to the managed identity

The identity that's attached to the dev center should be assigned the Owner role for all the deployment subscriptions and the Reader role for all subscriptions that contain the relevant project. When a user creates or deploys an environment, the service grants appropriate access to the deployment identity that's attached to the project environment type. The deployment identity uses the access to perform deployments on behalf of the user. You can use the managed identity to empower developers to create environments without granting them access to the subscription.

### Add a role assignment to a system-assigned managed identity

1. In the Azure portal, go to your dev center.
1. On the left menu under **Settings**, select **Identity**.
1. Under **System assigned** > **Permissions**, select **Azure role assignments**.
  
    :::image type="content" source="./media/configure-managed-identity/system-assigned-azure-role-assignment.png" alt-text="Screenshot that shows the Azure role assignment for system-assigned identity.":::

1. On **Azure role assignments**, select **Add role assignment (Preview)**, and then enter or select the following information:

    1. For **Scope**, select **Subscription**.
    1. For **Subscription**, select the subscription in which to use the managed identity.
    1. For **Role**, select **Owner**.
    1. Select **Save**.

### Add a role assignment to a user-assigned managed identity

1. In the Azure portal, go to your dev center.
1. On the left menu under **Settings**, select **Identity**.
1. Under **User assigned**, select the identity.
1. On the left menu, select **Azure role assignments**.
1. On **Azure role assignments**, select **Add role assignment (Preview)**, and then enter or select the following information:

    1. For **Scope**, select **Subscription**.
    1. For **Subscription**, select the subscription in which to use the managed identity.
    1. For **Role**, select **Owner**.
    1. Select **Save**.

## Grant the managed identity access to the key vault secret

You can set up your key vault to use either a [key vault access policy'](../key-vault/general/assign-access-policy.md) or [Azure role-based access control](../key-vault/general/rbac-guide.md).

> [!NOTE]
> Before you can add a repository as a catalog, you must grant the managed identity access to the key vault secret that contains the repository's personal access token.

### Key vault access policy

If the key vault is configured to use a key vault access policy:

1. In the Azure portal, go to the key vault that contains the secret with the personal access token.
1. On the left menu, select **Access policies**, and then select **Create**.
1. On **Create an access policy**, enter or select the following information:

    1. On the **Permissions** tab, under **Secret permissions**, select the **Get** checkbox, and then select **Next**.
    1. On the **Principal** tab, select the identity that's attached to the dev center.
    1. Select **Review + create**, and then select **Create**.

### Azure role-based access control

If the key vault is configured to use Azure role-based access control:

1. In the Azure portal, go to the key vault that contains the secret with the personal access token.
1. On the left menu, select **Access control (IAM)**.
1. Select the identity, and in the left menu, select **Azure role assignments**.
1. Select **Add role assignment**, and then enter or select the following information:

    1. For **Scope**, select the key vault.
    1. For **Subscription**, select the subscription that contains the key vault.
    1. For **Resource**, select the key vault.
    1. For **Role**, select **Key Vault Secrets User**.
    1. Select **Save**.

## Next steps

- Learn how to [add and configure a catalog](how-to-configure-catalog.md).
- Learn how to [create and configure a project environment type](how-to-configure-project-environment-types.md).
