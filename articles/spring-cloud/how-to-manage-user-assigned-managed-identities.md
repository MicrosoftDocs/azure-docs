---
title: Manage user-assigned managed identities for an application in Azure Spring Cloud (Preview)
titleSuffix: Azure Spring Cloud Enterprise Tier
description: How to manage user-assigned managed identities for applications.
author: N.A.
ms.author: jiec
ms.service: spring-cloud
ms.topic: how-to
ms.date: 03/24/2022
ms.custom: devx-track-java, devx-track-azurecli
zone_pivot_groups: spring-cloud-tier-selection
---

# Manage user-assigned managed identities for an application in Azure Spring Cloud (Preview)

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to assign or remove user-assigned managed identities for an application in Azure Spring Cloud, using the Azure portal and CLI.

Managed identities for Azure resources provide an automatically managed identity in Azure Active Directory to an Azure resource such as your application in Azure Spring Cloud. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code.

## Prerequisites
TODO(jiec): Check the cli version in below requirements before publish this doc.

If you're unfamiliar with managed identities for Azure resources, see the [Managed identities for Azure resources overview section](../active-directory/managed-identities-azure-resources/overview.md).

::: zone pivot="sc-enterprise-tier"

- An already provisioned Azure Spring Cloud Enterprise tier instance. For more information, see [Quickstart: Provision an Azure Spring Cloud service instance using the Enterprise tier](quickstart-provision-service-instance-enterprise.md).
- [Azure CLI version 3.1.0 or later](/cli/azure/install-azure-cli).
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]
- At least one already provisioned user-assigned managed identity. For more information, see [Manage user-assigned managed identities](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities).

::: zone-end

::: zone pivot="sc-standard-tier"

- An already provisioned Azure Spring Cloud instance. For more information, see [Quickstart: Deploy your first application to Azure Spring Cloud](./quickstart.md).
- [Azure CLI version 3.1.0 or later](/cli/azure/install-azure-cli).
- At least one already provisioned user-assigned managed identity. For more information, see [Manage user-assigned managed identities](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities).

::: zone-end


## Assign user-assigned managed identities when create an application
Create an application and assign user-assigned managed identity at the same time.

```azurecli
az spring-cloud app create \
    --resource-group <resource-group-name> \
    --name <app-name> \
    --service <service-instance-name> \
    --user-assigned <space-separated user identity resource IDs to assign>
```

## Assign user-assigned managed identities to an existed app

Assign user-assigned managed identity requires setting an additional property on the application.

# [Portal](#tab/azure-portal)

To assign user-assigned managed identity to an existed app in the portal:

1. Navigate to an app in the portal as you normally would.
2. Scroll down to the **Settings** group in the left navigation pane.
3. Select **Identity**.
4. Within the **User assigned** tab, click "Add"
5. Choose one or more user-assigned managed identities from right panel and then click "Add" from this panel.

![Managed identity in portal](./media/enterprise/msi/app-user-mi-add.jpg)

# [Azure CLI](#tab/azure-cli)

Use `az spring-cloud app identity assign` command to assign one or more user-assigned managed identities on an existing app.

```azurecli
az spring-cloud app identity assign \
    --resource-group <resource-group-name> \
    --name <app-name> \
    --service <service-instance-name> \
    --user-assigned <space-separated user identity resource IDs to assign>
```

---

## Obtain tokens for Azure resources

An app can use its managed identity to get tokens to access other resources protected by Azure Active Directory, such as Azure Key Vault. These tokens represent the application accessing the resource, not any specific user of the application.

You may need to [configure the target resource to allow access from your application](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md). For example, if you request a token to access Key Vault, make sure you have added an access policy that includes your application's identity. Otherwise, your calls to Key Vault will be rejected, even if they include the token. To learn more about which resources support Azure Active Directory tokens, see [Azure services that support Azure AD authentication](../active-directory/managed-identities-azure-resources/services-azure-active-directory-support)

Azure Spring Cloud shares the same endpoint for token acquisition with Azure Virtual Machine. We recommend using Java SDK or spring boot starters to acquire a token.  See [How to use VM token](../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md) for various code and script examples and guidance on important topics such as handling token expiration and HTTP errors.

## Remove user-assigned managed identities from an existed app

Remove user-assigned managed identities will remove the assginment between the identities and the application. And will not delete the identities themselves.

# [Portal](#tab/azure-portal)

To remove user-assigned managed identities from an app that no longer needs it:

1. Sign in to the portal using an account associated with the Azure subscription that contains the Azure Spring Cloud instance.
1. Navigate to the desired application and select **Identity**.
1. Under **User assigned**, select target identities and then click **Remove**.

![Managed identity](./media/enterprise/msi/app-user-mi-remove.jpg)

# [Azure CLI](#tab/azure-cli)

To remove user-assigned managed identities from an app that no longer needs it, use the following command:

```azurecli
az spring-cloud app identity remove \
    --resource-group <resource-group-name> \
    --name <app-name> \
    --service <service-instance-name> \
    --user-assigned <space-separated user identity resource IDs to remove>
```

## Limitations

See [Quotas and Service Plans for Azure Spring Cloud](./quotas.md) for user-assigned managed identity limitations.

---

## Next steps

* [Access Azure Key Vault with managed identities in Spring boot starter](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/spring/azure-spring-boot-starter-keyvault-secrets/README.md#use-msi--managed-identities)
* [Learn more about managed identities for Azure resources](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/active-directory/managed-identities-azure-resources/overview.md)
* [How to use managed identities with Java SDK](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples)
