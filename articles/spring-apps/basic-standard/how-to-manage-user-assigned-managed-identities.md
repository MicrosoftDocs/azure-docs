---
title: Manage User-Assigned Managed Identities for an Application in Azure Spring Apps
description: How to manage user-assigned managed identities for applications.
author: KarlErickson
ms.author: jiec
ms.service: azure-spring-apps
ms.topic: how-to
ms.date: 06/27/2024
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli
zone_pivot_groups: spring-apps-tier-selection
---

# Manage user-assigned managed identities for an application in Azure Spring Apps

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Basic/Standard ✅ Enterprise

This article shows you how to assign or remove user-assigned managed identities for an application in Azure Spring Apps, using the Azure portal and Azure CLI.

Managed identities for Azure resources provide an automatically managed identity in Microsoft Entra ID to an Azure resource such as your application in Azure Spring Apps. You can use this identity to authenticate to any service that supports Microsoft Entra authentication, without having credentials in your code.

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, see [What are managed identities for Azure resources?](/entra/identity/managed-identities-azure-resources/overview)

::: zone pivot="sc-enterprise"

- An already provisioned Azure Spring Apps Enterprise plan instance. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise plan](../enterprise/quickstart-deploy-apps-enterprise.md).
- [Azure CLI version 2.45.0 or higher](/cli/azure/install-azure-cli).
- [!INCLUDE [install-app-user-identity-extension](../enterprise/includes/install-app-user-identity-extension.md)]
- At least one already provisioned user-assigned managed identity. For more information, see [Manage user-assigned managed identities](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities).

::: zone-end

::: zone pivot="sc-standard"

- An already provisioned Azure Spring Apps instance. For more information, see [Quickstart: Deploy your first application to Azure Spring Apps](./quickstart.md).
- [Azure CLI version 2.45.0 or higher](/cli/azure/install-azure-cli).
- [!INCLUDE [install-app-user-identity-extension](../enterprise/includes/install-app-user-identity-extension.md)]
- At least one already provisioned user-assigned managed identity. For more information, see [Manage user-assigned managed identities](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities).

::: zone-end

## Assign user-assigned managed identities when creating an application

Create an application and assign user-assigned managed identity at the same time by using the following command:

```azurecli
az spring app create \
    --resource-group <resource-group-name> \
    --name <app-name> \
    --service <service-instance-name> \
    --user-assigned <space-separated user identity resource IDs to assign>
```

## Assign user-assigned managed identities to an existing application

Assigning user-assigned managed identity requires setting another property on the application.

### [Azure portal](#tab/azure-portal)

To assign user-assigned managed identity to an existing application in the Azure portal, follow these steps:

1. Navigate to an application in the Azure portal as you normally would.
2. Scroll down to the **Settings** group in the left navigation pane.
3. Select **Identity**.
4. Within the **User assigned** tab, select **Add**.
5. Choose one or more user-assigned managed identities from right panel and then select **Add** from this panel.

### [Azure CLI](#tab/azure-cli)

Use the following command to assign one or more user-assigned managed identities on an existing app:

```azurecli
az spring app identity assign \
    --resource-group <resource-group-name> \
    --name <app-name> \
    --service <service-instance-name> \
    --user-assigned <space-separated user identity resource IDs to assign>
```

---

## Obtain tokens for Azure resources

An application can use its managed identity to get tokens to access other resources protected by Microsoft Entra ID, such as Azure Key Vault. These tokens represent the application accessing the resource, not any specific user of the application.

You might need to configure the target resource to enable access from your application. For more information, see [Assign a managed identity access to an Azure resource or another resource](/entra/identity/managed-identities-azure-resources/how-to-assign-access-azure-resource). For example, if you request a token to access Key Vault, be sure you've added an access policy that includes your application's identity. Otherwise, your calls to Key Vault are rejected, even if they include the token. To learn more about which resources support Microsoft Entra tokens, see [Azure services that support Microsoft Entra authentication](/entra/identity/managed-identities-azure-resources/services-id-authentication-support)

Azure Spring Apps shares the same endpoint for token acquisition with Azure Virtual Machines. We recommend using Java SDK or Spring Boot starters to acquire a token. For various code and script examples, and guidance on important topics such as handling token expiration and HTTP errors, see [How to use managed identities for Azure resources on an Azure VM to acquire an access token](/entra/identity/managed-identities-azure-resources/how-to-use-vm-token).

## Remove user-assigned managed identities from an existing app

Removing user-assigned managed identities removes the assignment between the identities and the application, and doesn't delete the identities themselves.

### [Azure portal](#tab/azure-portal)

To remove user-assigned managed identities from an application that no longer needs it, follow these steps:

1. Sign in to the Azure portal using an account associated with the Azure subscription that contains the Azure Spring Apps instance.
1. Navigate to the desired application and select **Identity**.
1. Under **User assigned**, select target identities and then select **Remove**.

### [Azure CLI](#tab/azure-cli)

To remove user-assigned managed identities from an application that no longer needs it, use the following command:

```azurecli
az spring app identity remove \
    --resource-group <resource-group-name> \
    --name <app-name> \
    --service <service-instance-name> \
    --user-assigned <space-separated user identity resource IDs to remove>
```

---

## Limitations

For user-assigned managed identity limitations, see [Quotas and service plans for Azure Spring Apps](./quotas.md).

## Next steps

- [What are managed identities for Azure resources?](/entra/identity/managed-identities-azure-resources/overview)
- [How to use managed identities with Java SDK](https://github.com/Azure-Samples/azure-spring-apps-samples)
