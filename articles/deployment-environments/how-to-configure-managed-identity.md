---
title: Configure a managed identity for Azure Deployment Environments
titleSuffix: Azure Deployment Environments
description: Learn how to configure a managed identity to deploy environments in your Azure Deployment Environments dev center.
ms.service: azure-deployment-environments
ms.custom: build-2023
author: RoseHJM
ms.author: rosemalcolm
ms.date: 03/17/2025
ms.topic: how-to

#customer intent: As a platform engineer, I want to configure a managed identity for a dev center so that I can enable secure deployment for my development teams.
---

# Configure a managed identity for a dev center

This guide explains how to add and configure a managed identity for your Azure Deployment Environments dev center to enable secure deployment for development teams.

Azure Deployment Environments uses managed identities to give development teams self-serve deployment capabilities without giving them access to the subscriptions in which Azure resources are created. A [managed identity](../active-directory/managed-identities-azure-resources/overview.md) adds elevated-privileges capabilities and secure authentication to any service that supports Microsoft Entra authentication.

The managed identity attached to a dev center should be [assigned both the Contributor role and the User Access Administrator role](#assign-a-subscription-role-assignment) in the deployment subscriptions for each environment type. When an environment deployment is requested, the service grants appropriate permissions to the deployment identities that are set up for the environment type to deploy on behalf of the user. The managed identity attached to a dev center also is used to add to a [catalog](how-to-configure-catalog.md) and access [environment definitions](configure-environment-definition.md) in the catalog.

## Prerequisites

- A [dev center](how-to-create-configure-dev-center.md).

## Add a managed identity

In Azure Deployment Environments, you can choose between two types of managed identities:

- **System-assigned identity**: A system-assigned identity is tied either to your dev center or to the project environment type. A system-assigned identity is deleted when the attached resource is deleted. A dev center or a project environment type can have only one system-assigned identity.
- **User-assigned identity**: A user-assigned identity is a standalone Azure resource that you can assign to your dev center or to a project environment type. For Azure Deployment Environments, a dev center or a project environment type can have only one user-assigned identity.

As a security best practice, if you choose to use user-assigned identities, use different identities for your project and for your dev center. Project identities should have more limited access to resources than dev centers.

> [!NOTE]
> In Azure Deployment Environments, if you add both a system-assigned identity and a user-assigned identity, only the user-assigned identity is used.

### Add a system-assigned managed identity

1. Sign in to the [Azure portal](https://portal.azure.com) and go to Azure Deployment Environments.
1. In the left menu, select **Dev centers**.
1. On the **Dev centers** page, select your dev center.
1. In the left menu, under **Settings**, select **Identity**.
1. On the **System assigned** tab, set **Status** to **On**.
1. Select **Save**.

    :::image type="content" source="media/configure-managed-identity/configure-system-assigned-managed-identity.png" alt-text="Screenshot that shows the system-assigned managed identity." lightbox="media/configure-managed-identity/configure-system-assigned-managed-identity.png":::

1. In the **Enable system assigned managed identity** dialog, select **Yes**.

### Add a user-assigned managed identity

1. Sign in to the [Azure portal](https://portal.azure.com) and go to Azure Deployment Environments.
1. In the left menu, select **Dev centers**.
1. On the **Dev centers** page, select your dev center.
1. On the left menu, under **Settings**, select **Identity**.
1. On the **User assigned** tab, select **Add** to attach an existing identity.

   :::image type="content" source="media/configure-managed-identity/configure-user-assigned-managed-identity.png" alt-text="Screenshot that shows the user-assigned managed identity." lightbox="media/configure-managed-identity/configure-user-assigned-managed-identity.png":::

1. On **Add user assigned managed identity**, enter or select the following information:

    1. On **Subscription**, select the subscription in which the identity exists.
    1. On **User assigned managed identities**, select an existing identity.
    1. Select **Add**.

## Assign a subscription role assignment

The identity attached to the dev center should be assigned the Contributor and User Access Administrator roles for all the deployment subscriptions and the Reader role for all subscriptions that contain the relevant project. When a user creates or deploys an environment, the service grants appropriate access to the deployment identity that's attached to the project environment type. The deployment identity uses the access to perform deployments on behalf of the user. You can use the managed identity to enable developers to create environments without granting them access to the subscription.

### Add a role assignment to a system-assigned managed identity

1. In the Azure portal, navigate to your dev center in Azure Deployment Environments.
1. In the left menu, under **Settings**, select **Identity**.
1. Under **System assigned** > **Permissions**, select **Azure role assignments**.
  
    :::image type="content" source="media/configure-managed-identity/system-assigned-azure-role-assignment.png" alt-text="Screenshot that shows the Azure role assignment for system-assigned identity." lightbox="media/configure-managed-identity/system-assigned-azure-role-assignment.png":::

1. To grant Contributor access to the subscription, select **Add role assignment (Preview)**, enter or select the following information, and then select **Save**:

    |Name     |Value     |
    |---------|----------|
    |**Scope**|Subscription|
    |**Subscription**|Select the subscription in which to use the managed identity.|
    |**Role**|Contributor|

1. To grant User Access Administrator access to the subscription, select **Add role assignment (Preview)**, enter or select the following information, and then select **Save**:

    |Name     |Value     |
    |---------|----------|
    |**Scope**|Subscription|
    |**Subscription**|Select the subscription in which to use the managed identity.|
    |**Role**|User Access Administrator|

### Add a role assignment to a user-assigned managed identity

1. In the Azure portal, navigate to your dev center.
1. In the left menu, under **Settings**, select **Identity**.
1. Under **User assigned**, select the identity name.
1. In the left menu, select **Azure role assignments**.
1. To grant Contributor access to the subscription, select **Add role assignment (Preview)**, enter or select the following information, and then select **Save**:

    |Name     |Value     |
    |---------|----------|
    |**Scope**|Subscription|
    |**Subscription**|Select the subscription in which to use the managed identity.|
    |**Role**|Contributor|

1. To grant User Access Administrator access to the subscription, select **Add role assignment (Preview)**, enter or select the following information, and then select **Save**:

    |Name     |Value     |
    |---------|----------|
    |**Scope**|Subscription|
    |**Subscription**|Select the subscription in which to use the managed identity.|
    |**Role**|User Access Administrator|

## Grant the managed identity access to the key vault secret

You can set up your key vault to use either a [key vault access policy](/azure/key-vault/general/assign-access-policy) or [Azure role-based access control](/azure/key-vault/general/rbac-guide).

> [!NOTE]
> Before you can add a repository as a catalog, you must grant the managed identity access to the key vault secret that contains the repository's personal access token.

### Key vault access policy

[!INCLUDE [contributor-role-warning.md](~/reusable-content/ce-skilling/azure/includes/key-vault/includes/key-vault-contributor-role-warning.md)]

If the key vault is configured to use a key vault access policy:

1. In the Azure portal, go to the key vault that contains the secret with the personal access token.
1. In the left menu, select **Access policies**, and then select **Create**.
1. On **Create an access policy**, enter or select the following information:

    1. On the **Permissions** tab, under **Secret permissions**, select the **Get** checkbox, and then select **Next**.
    1. On the **Principal** tab, select the identity that's attached to the dev center.
    1. Select **Review + create**, and then select **Create**.

### Azure role-based access control

If the key vault is configured to use Azure role-based access control:

1. In the Azure portal, go to the key vault that contains the secret with the personal access token.
1. In the left menu, select **Access control (IAM)**.
1. Select the identity, and, in the left menu, select **Azure role assignments**.
1. Select **Add role assignment**, and then enter or select the following information:

    1. For **Scope**, select the key vault.
    1. For **Subscription**, select the subscription that contains the key vault.
    1. For **Resource**, select the key vault.
    1. For **Role**, select **Key Vault Secrets User**.
    1. Select **Save**.

## Related content

- [Add and configure a catalog](how-to-configure-catalog.md)
- [Create and configure a project environment type](how-to-configure-project-environment-types.md)
