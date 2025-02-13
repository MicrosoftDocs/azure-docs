---
title: Enable System-Assigned Managed Identity for Applications in Azure Spring Apps
titleSuffix: Azure Spring Apps Enterprise plan
description: How to enable system-assigned managed identity for applications.
author: KarlErickson
ms.author: xiading
ms.service: azure-spring-apps
ms.topic: how-to
ms.date: 06/27/2024
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli
zone_pivot_groups: spring-apps-tier-selection
---

# Enable system-assigned managed identity for an application in Azure Spring Apps

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Basic/Standard ✅ Enterprise

This article shows you how to enable and disable system-assigned managed identities for an application in Azure Spring Apps, using the Azure portal and CLI.

Managed identities for Azure resources provide an automatically managed identity in Microsoft Entra ID to an Azure resource such as your application in Azure Spring Apps. You can use this identity to authenticate to any service that supports Microsoft Entra authentication, without having credentials in your code.

## Prerequisites

If you're unfamiliar with managed identities for Azure resources, see [What are managed identities for Azure resources?](/entra/identity/managed-identities-azure-resources/overview)

::: zone pivot="sc-enterprise"

- An already provisioned Azure Spring Apps Enterprise plan instance. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise plan](../enterprise/quickstart-deploy-apps-enterprise.md).
- [Azure CLI version 2.45.0 or higher](/cli/azure/install-azure-cli).
- [!INCLUDE [install-app-user-identity-extension](../enterprise/includes/install-app-user-identity-extension.md)]

::: zone-end

::: zone pivot="sc-standard"

- An already provisioned Azure Spring Apps instance. For more information, see [Quickstart: Deploy your first application to Azure Spring Apps](./quickstart.md).
- [Azure CLI version 2.45.0 or higher](/cli/azure/install-azure-cli).
- [!INCLUDE [install-app-user-identity-extension](../enterprise/includes/install-app-user-identity-extension.md)]

::: zone-end

## Add a system-assigned identity

Creating an app with a system-assigned identity requires setting another property on the application.

### [Portal](#tab/azure-portal)

To set up a managed identity in the portal, first create an app, and then enable the feature.

1. Create an app in the portal as you normally would. Navigate to it in the portal.
2. Scroll down to the **Settings** group in the left navigation pane.
3. Select **Identity**.
4. Within the **System assigned** tab, switch **Status** to **On**. Select **Save**.

### [Azure CLI](#tab/azure-cli)

You can enable system-assigned managed identity during app creation or on an existing app.

### Enable system-assigned managed identity during creation of an app

The following example creates an app named `app_name` with a system-assigned managed identity, as requested by the `--assign-identity` parameter.

```azurecli
az spring app create \
    --resource-group <resource-group-name> \
    --name <app-name> \
    --service <service-instance-name> \
    --system-assigned
```

### Enable system-assigned managed identity on an existing app**

Use `az spring app identity assign` command to enable the system-assigned identity on an existing app.

```azurecli
az spring app identity assign \
    --resource-group <resource-group-name> \
    --name <app-name> \
    --service <service-instance-name> \
    --system-assigned
```

---

## Obtain tokens for Azure resources

An app can use its managed identity to get tokens to access other resources protected by Microsoft Entra ID, such as Azure Key Vault. These tokens represent the application accessing the resource, not any specific user of the application.

You might need to configure the target resource to enable access from your application. For more information, see [Assign a managed identity access to an Azure resource or another resource](/entra/identity/managed-identities-azure-resources/how-to-assign-access-azure-resource). For example, if you request a token to access Key Vault, make sure you have added an access policy that includes your application's identity. Otherwise, your calls to Key Vault are rejected, even if they include the token. To learn more about which resources support Microsoft Entra tokens, see [Azure services that can use managed identities to access other services](/entra/identity/managed-identities-azure-resources/managed-identities-status).

Azure Spring Apps shares the same endpoint for token acquisition with Azure Virtual Machine. We recommend using Java SDK or spring boot starters to acquire a token. For various code and script examples and guidance on important topics such as handling token expiration and HTTP errors, see [How to use managed identities for Azure resources on an Azure VM to acquire an access token](/entra/identity/managed-identities-azure-resources/how-to-use-vm-token).

## Disable system-assigned identity from an app

Removing a system-assigned identity also deletes it from Microsoft Entra ID. Deleting the app resource automatically removes system-assigned identities from Microsoft Entra ID.

### [Portal](#tab/azure-portal)

Use the following steps to remove system-assigned managed identity from an app that no longer needs it:

1. Sign in to the portal using an account associated with the Azure subscription that contains the Azure Spring Apps instance.
1. Navigate to the desired application and select **Identity**.
1. Under **System assigned**/**Status**, select **Off** and then select **Save**:

### [Azure CLI](#tab/azure-cli)

To remove system-assigned managed identity from an app that no longer needs it, use the following command:

```azurecli
az spring app identity remove \
    --resource-group <resource-group-name> \
    --name <app-name> \
    --service <service-instance-name> \
    --system-assigned
```

---

## Get the client ID from the object ID (principal ID)

Use the following command to get the client ID from the object/principal ID value:

```azurecli
az ad sp show --id <object-ID> --query appId
```

---

## Next steps

* [What are managed identities for Azure resources?](/entra/identity/managed-identities-azure-resources/overview)
* [How to use managed identities with Java SDK](https://github.com/Azure-Samples/azure-spring-apps-samples)
