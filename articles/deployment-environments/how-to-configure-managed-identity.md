---
title: Configure a managed identity
titleSuffix: Azure Deployment Environments
description: Learn how to configure a managed identity that'll be used to deploy environments.
ms.service: deployment-environments
ms.author: meghaanand
author: anandmeg
ms.date: 08/18/2022
ms.topic: how-to
---

# Configure a managed identity

A [Managed Identity](../active-directory/managed-identities-azure-resources/overview.md) is used to provide elevation-of-privilege capabilities and securely authenticate to any service that supports Azure Active Directory (Azure AD) authentication. Azure Deployment Environments service will use the managed identity attached to the dev center to deploy an environment. This managed identity will need to have appropriate access to the subscriptions in which the Azure resources are created. You won't need to grant access to the development teams to the target subscriptions.

In this article, you'll learn about:

* Types of managed identities
* Assigning a role assignment to the managed identity
* Assigning the identity with access to the Key Vault secret

## Types of managed identities

In Azure Deployment Environments, you can use two types of managed identities:

* A **system-assigned identity** is tied to your dev center and is deleted when your dev center is deleted. A dev center can only have one system-assigned identity.
* A **user-assigned identity** is a standalone Azure resource that can be assigned to your dev center.

> [!NOTE]
> If you add both a system-assigned identity and a user-assigned identity, only the user-assigned identity will be used by the service.

### Configure a system-assigned managed identity

1. Go to your dev center home page.
1. Select **Identity** from the left pane.
1. On the **System assigned** tab, set the **Status** to **On**, select **Save** and confirm enabling a System assigned managed identity

### Configure a user-assigned managed identity  

1. Go to you dev center home page.
1. Select **Identity** from the left pane.
1. Switch to **User assigned** tab and select **+ Add** to attach an existing identity.
1. On the **Add user assigned managed identity** page, add the following details:
    1. Select the **Subscription** in which the identity exists.
    1. Select an existing identity for **User assigned managed identities**.
    3. Select **Add**.

## Assign a role assignment to the managed identity

An identity attached to a dev center will be used to deploy environments. You'll need to grant this identity 'Owner' access to all the target subscriptions in which the resources are created, as well as 'Reader' access to all subscriptions that a project lives in.

1. To add a role assignment to the managed identity:
    1. For a system-assigned identity, select **Azure role assignments**.
    1. For the user-assigned identity, select the specific identity, and then select the **Azure role assignments** from the left pane.

2. On the Azure role assignments page, select **Add role assignment** and provide the following details:
    1. Select **SubScription** from the dropdown for **Scope**. 
    2. Select the target **Subscription** to use from the dropdown.
    3. Select **Owner** from the dropdown for **Role**.
    1. Select **Save**.

## Assign the managed identity access to the Key Vault secret

>[!NOTE] 
> Providing the identity with access to the Key Vault secret, which contains the repo's personal access token (PAT), is a pre-requisite to adding the repo as a catalog.

To grant the identity access to the secret:

A Key Vault can be configured to use either the [Vault access policy'](../key-vault/general/assign-access-policy.md) or the [Azure role-based access control](../key-vault/general/rbac-guide.md) permission model.

1. If the Key Vault is configured to use the **Vault access policy** permission model, 
    1. Access the [Azure Portal](https://portal.azure.com/) and search for the specific Key Vault that contains the PAT secret.
    1. Select **Access policies** from the left pane.
    1. Select **+ Create**.
    1. On the **Create an access policy** page, provide the following details:
        1.  Enable **Get** for **Secret permissions** on the **Permissions** page.
        1.  Select the identity that is attached to the dev center as **Principal**.
        1. Select **Create** on the **Review + create** page.

2. If the Key Vault is configured to use **Azure role-based access control** permission model,
    1. Select the specific identity and select the **Azure role assignments** from the left pane.
    1. Select **Add Role Assignment** and provide the following details:
        1. Select Key Vault from the **Scope** dropdown.
        1. Select the **Subscription** in which the Key Vault exists.
        1. Select the specific Key Vault for **Resource**.
        1. Select **Key Vault Secrets User** from the dropdown for **Role**.
        1. Select **Save**.

## Next steps

* [Configure a Catalog](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/configure-catalog.md)