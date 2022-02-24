---
title: Use managed identity to access Azure key vault
titleSuffix: Azure Load Testing
description: Learn how to enable managed identity for Azure Load Testing and use it to read secrets from your Azure key vault.
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 11/30/2021
ms.topic: how-to
---

# Use managed identities for Azure Load Testing Preview

This article shows how you can create a managed identity for an Azure Load Testing Preview resource and how to use it to read secrets from your Azure key vault.

A managed identity in Azure Active Directory (Azure AD) allows your resource to easily access other Azure AD-protected resources, such as Azure Key Vault. The identity is managed by the Azure platform. For more information about managed identities in Azure AD, see [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).

Azure Load Testing supports only system-assigned identities. A system-assigned identity is associated with your Azure Load Testing resource and is removed when your resource is deleted. A resource can have only one system-assigned identity.

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  

- An Azure Load Testing resource. If you need to create an Azure Load Testing resource, see the quickstart [Create and run a load test](./quickstart-create-and-run-load-test.md).

## Set a system-assigned identity  

To add a system-assigned identity for your Azure Load Testing resource, you need to enable a property on the resource. You can set this property by using the Azure portal or by using an Azure Resource Manager (ARM) template.

### Use the Azure portal

To set up a managed identity in the portal, you first create an Azure Load Testing resource and then enable the feature.

1. In the [Azure portal](https://portal.azure.com), go to your Azure Load Testing resource.

1. On the left pane, select **Identity**.

1. Switch the system-assigned identity status to **On**, and then select **Save**.

    :::image type="content" source="media/how-to-use-a-managed-identity/system-assigned-managed-identity.png" alt-text="Screenshot that shows how to turn on system-assigned managed identity for Azure Load Testing.":::

### Use an ARM template

You can use an ARM template to automate the deployment of your Azure resources. You can create any resource of type `Microsoft.LoadTestService/loadtests` with an identity by including the following property in the resource definition:

```json
"identity": {
    "type": "SystemAssigned"
}
```

By adding the system-assigned type, you're telling Azure to create and manage the identity for your resource. For example, an Azure Load Testing resource might look like the following:

```json
{
    "type": "Microsoft.LoadTestService/loadtests",
    "apiVersion": "2021-09-01-preview",
    "name": "[parameters('name')]",
    "location": "[parameters('location')]",
    "tags": "[parameters('tags')]",
    "identity": {
        "type": "SystemAssigned"
    }
}
```

When the resource is created, it gets the following additional properties:

```json
"identity": {
    "type": "SystemAssigned",
    "tenantId": "<TENANTID>",
    "principalId": "<PRINCIPALID>"
}
```

The `tenantId` property identifies which Azure AD tenant the identity belongs to. The `principalId` is a unique identifier for the resource's new identity. Within Azure AD, the service principal has the same name as the Azure Load Testing resource.

## Grant access to your Azure key vault

A managed identity allows the Azure Load testing resource to access other Azure resources. In this section, you grant the Azure Load Testing service access to read secret values from your key vault.

If you don't already have a key vault, follow the instructions in [Azure Key Vault quickstart](../key-vault/secrets/quick-create-cli.md) to create it.

1. In the Azure portal, go to your Azure Key Vault resource.

1. On the left pane, under **Settings**, select **Access Policies**, and then **Add Access Policy**.

1. In the **Secret permissions** dropdown list, select **Get**.

    :::image type="content" source="media/how-to-use-a-managed-identity/key-vault-add-policy.png" alt-text="Screenshot that shows how to add an access policy to your Azure key vault.":::

1. Select **Select principal**, and then select the system-assigned principal for your Azure Load Testing resource.

    The name of the system-assigned principal is the same name as the Azure Load Testing resource.

1. Select **Add**.

You've now granted access to your Azure Load Testing resource to read the secret values from your Azure key vault.

## Next steps

To learn how to parameterize a load test by using secrets, see [Parameterize a load test](./how-to-parameterize-load-tests.md).