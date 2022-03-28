---
title: Configure customer-managed keys for encryption
titleSuffix: Azure Load Testing
description: Learn how to configure customer-managed keys for your Azure Load Testing resource with Azure Key Vault
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 04/07/2022
ms.topic: how-to
---

# Configure customer-managed keys for your Azure Load Testing Preview resource with Azure Key Vault

Data stored in your Azure Load Testing resource is automatically and seamlessly encrypted with keys managed by Microsoft (service-managed keys). Optionally, you can choose to add a second layer of encryption with keys you manage (customer-managed keys). When you specify a customer-managed key, that key is used to protect and control access to the key that encrypts your data. Customer-managed keys offer greater flexibility to access controls and rotate them according to your own policies.

You must store customer-managed keys in [Azure Key Vault](/azure/key-vault/general/overview) and provide a key for each Azure Load Testing resource that is enabled with customer-managed keys. This key is used to encrypt the following data stored in that resource:

- Test details like test description
- Test script and configuration files
- Secrets
- Environment variables

> [!NOTE]
> Currently, customer-managed keys are available only for new Azure Load Testing resources. You should configure them during resource creation.

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Configure your Azure Key Vault

You can use a new or existing key vault to store customer-managed keys. Using customer-managed keys with Azure Load Testing requires you to set two properties on the Azure Key Vault instance that you plan to use to host your encryption keys: **Soft Delete** and **Purge Protection**. Soft delete is enabled by default when you create a new key vault and cannot be disabled. You can enable purge protection either when you create the key vault or after it is created.

To learn how to create a key vault with the Azure portal, see [Create a key vault using the Azure portal](/azure/key-vault/general/quick-create-portal). When you create the key vault, select Enable purge protection, as shown in the following image.

To enable purge protection on an existing key vault, follow these steps:

1. Navigate to your key vault in the Azure portal.
1. Under Settings, choose Properties.
1. In the Purge protection section, choose Enable purge protection.

## Add a key

Next, add a key to the key vault. Azure Load Testing encryption supports RSA keys of sizes 2048, 3072 and 4096. For more information about supported key types, see [About keys](/azure/key-vault/keys/about-keys).

To learn how to add a key with the Azure portal, see [Set and retrieve a key from Azure Key Vault using the Azure portal](/azure/key-vault/keys/quick-create-portal).

## Add an access policy to your Azure Key Vault

When you enable customer-managed keys for a resource, you must specify a managed identity that will be used to authorize access to the key vault that contains the key. The managed identity must have permissions to access the key in the key vault. Azure Load Testing supports configuring customer-managed keys by specifying a user-assigned managed identity only. To learn how to create and manage a user-assigned managed identity, see [Manage user-assigned managed identities](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp).

1. From the Azure portal, go to the Azure Key Vault instance that you plan to use to host your encryption keys. Select **Access Policies** from the left menu:

1. Select **+ Add Access Policy**.

1. Under the **Key permissions** drop-down menu, select **Get**, **Unwrap Key**, and **Wrap Key** permissions:

1. Under **Select principal**, select **None selected**.

1. Search for the user-assigned managed identity you created and select it.

1. Choose **Select** at the bottom.

1. Select **Add** to add the new access policy.

1. Select **Save** on the Key Vault instance to save all changes.

## Configure customer-managed keys for a new Azure Load Testing resource

To configure customer-managed keys for a new Azure Load Testing resource, follow these steps:

# [Azure portal](#tab/portal)

1. In the Azure portal, navigate to the Azure Load Testing page, and select the Create button to create a new resource.

1. Follow the steps outlined [here](/azure/load-testing/quickstart-create-and-run-load-test#create_resource) to fill out the fields on the **Basics** tab.

1. Go to the **Encryption** tab. In the **Encryption type** field, select **Customer-managed keys (CMK)**.

1. In the **Key URI** field, paste the URI/key identifier of the Azure Key Vault key. Omit the key version from the URI to enable automatic updating of the key version.

1. For the **User-assigned identity**field, select an existing user-assigned managed identity.

1. Select **Review + create** to validate and create the new resource.

# [ARM template](#tab/arm)

You can use an ARM template to automate the deployment of your Azure resources. You can create any resource of type `Microsoft.LoadTestService/loadtests` with customer managed key enabled for encryption by adding the following properties:

```json
"encryption": {
    "identity": {
        "userAssignedIdentity": "[parameters('encryptionIdentity')]"
    },
    "keyUri": "[parameters('keyUri')]"
}
```

For example, an Azure Load Testing resource might look like the following:

```json
{
    "type": "Microsoft.LoadTestService/loadtests",
    "apiVersion": "2021-09-01-preview",
    "name": "[parameters('name')]",
    "location": "[parameters('location')]",
    "tags": "[parameters('tags')]",
    "encryption": {
        "identity": {
            "userAssignedIdentity": "[parameters('encryptionIdentity')]"
        },
        "keyUri": "[parameters('keyUri')]"
    }
}
```

## Change the encryption identity for an existing resource

To change the managed identity for customer-managed keys on an existing resource follow these steps:

1. Navigate to your Azure Load Testing resource.

1. On the Settings blade for the resource, click Encryption. The **Encryption type** shows the encryption selected for the resource while creation.

1. If the selected encryption type is *Customer-managed keys*, select the type of identity to use to authenticate access to the key vault. The options include System-assigned (the default) or User-assigned. To learn more about each type of managed identity, see [Managed identity types](/azure/active-directory/managed-identities-azure-resources/overview#managed-identity-types).

    - If you select System-assigned, the system-assigned managed identity for the resource is created under the covers, if it does not already exist.
    - If you select User-assigned, then you must select an existing user-assigned identity that has permissions to access the key vault. To learn how to create a user-assigned identity, see [Use managed identities for Azure Load Testing Preview](how-to-use-a-managed-identity.md).

1. Save your changes.

> [!NOTE]
> The managed identity selected should have access granted on the Azure Key Vault.

## Key rotation

Azure Load Testing can automatically update the customer-managed key that is used for encryption to use the latest key version if the key version is omitted from the key URI. When the customer-managed key is rotated in Azure Key Vault, Azure Load Testing will automatically begin using the latest version of the key for encryption. To configure automatic key rotation, omit the key version from the key URI while configuring customer managed key on your Azure Load Testing resource.

## Frequently asked questions

### Is there an additional charge to enable customer-managed keys?

No, there's no charge to enable this feature.

### Are customer-managed keys supported for existing Azure Load Testing resources?

This feature is currently available only for new resources.

### How can I tell if customer-managed keys are enabled on my Azure Cosmos account?

From the Azure portal, go to your Azure Load Testing resource. Go to the **Encryption** section in the left menu. Check the **Encryption type** on your resource.

### How do I revoke an encryption key?

Key revocation is done by disabling the latest version of the key. Alternatively, to revoke all keys from an Azure Key Vault instance, you can delete the access policy granted to the Managed identity.

### What operations are available after a customer-managed key is revoked?

The only operation possible when the encryption key has been revoked is resource deletion.

## Next steps

- Start using Azure Load Testing [Tutorial: Use a load test to identify performance bottlenecks](./tutorial-identify-bottlenecks-azure-portal.md)
