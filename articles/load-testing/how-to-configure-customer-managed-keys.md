---
title: Configure customer-managed keys for your Azure Load Testing resource
titleSuffix: Azure Load Testing
description: Learn how to configure customer-managed keys for your Azure Load Testing resource with Azure Key Vault
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 02/25/2022
ms.topic: how-to
---

# Configure customer-managed keys for your Azure Load Testing resource with Azure Key Vault

Data stored in your Azure Load Testing resource is automatically and seamlessly encrypted with keys managed by Microsoft (service-managed keys). Optionally, you can choose to add a second layer of encryption with keys you manage (customer-managed keys). When you specify a customer-managed key, that key is used to protect and control access to the key that encrypts your data. Customer-managed keys offer greater flexibility to access controls and rotate them according to your own policies.

You must store customer-managed keys in [Azure Key Vault](/azure/key-vault/general/overview) and provide a key for each Azure Load Testing resource that is enabled with customer-managed keys. This key is used to encrypt the following data stored in that resource:

- Test details like test description
- Test script and configuration files
- Secrets
- Environment variables

> [!NOTE]
> Currently, customer-managed keys are available only for new Azure Load Testing resources. You should configure them during account creation.

## Configure your Azure Key Vault

You can use a new or existing key vault to store customer-managed keys. Using customer-managed keys with Azure Load Testing requires you to set two properties on the Azure Key Vault instance that you plan to use to host your encryption keys: **Soft Delete** and **Purge Protection**. Soft delete is enabled by default when you create a new key vault and cannot be disabled. You can enable purge protection either when you create the key vault or after it is created.

To learn how to create a key vault with the Azure portal, see [Create a key vault using the Azure portal](/azure/key-vault/general/quick-create-portal). When you create the key vault, select Enable purge protection, as shown in the following image.

*To add* Screenshot

To enable purge protection on an existing key vault, follow these steps:

1. Navigate to your key vault in the Azure portal.
1. Under Settings, choose Properties.
1. In the Purge protection section, choose Enable purge protection.

*To add* Screenshot

## Add a key

Next, add a key to the key vault. Azure Load Testing encryption supports RSA keys of sizes 2048, 3072 and 4096. For more information about supported key types, see [About keys](/azure/key-vault/keys/about-keys).

To learn how to add a key with the Azure portal, see [Set and retrieve a key from Azure Key Vault using the Azure portal](/azure/key-vault/keys/quick-create-portal).

## Add an access policy to your Azure Key Vault

When you enable customer-managed keys for a resource, you must specify a managed identity that will be used to authorize access to the key vault that contains the key. The managed identity must have permissions to access the key in the key vault. Azure Load Testing supports configuring customer-managed keys by specifying a user-assigned managed identity only. To learn how to create and manage a user-assigned managed identity, see [Manage user-assigned managed identities](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp).

1. From the Azure portal, go to the Azure Key Vault instance that you plan to use to host your encryption keys. Select **Access Policies** from the left menu:

    *To add* Screenshot

1. Select **+ Add Access Policy**.

1. Under the **Key permissions** drop-down menu, select **Get**, **Unwrap Key**, and **Wrap Key** permissions:

    *To add* Screenshot

1. Under **Select principal**, select **None selected**.

1. Search for the user-assigned managed identity you created and select it.

1. Choose **Select** at the bottom.

1. Select **Add** to add the new access policy.

1. Select **Save** on the Key Vault instance to save all changes.

## Configure customer-managed keys for a new Azure Load Testing resource

To configure customer-managed keys for a new Azure Load Testing resource, follow these steps:

1. In the Azure portal, navigate to the Azure Load Testing page, and select the Create button to create a new resource.

1. Follow the steps outlined [here](/azure/load-testing/quickstart-create-and-run-load-test#create_resource) to fill out the fields on the **Basics** tab.

1. Go to the **Encryption** tab. In the **Encryption type** field, select **Customer-managed keys (CMK)**.

1. In the **Key URI** field, paste the URI/key identifier of the Azure Key Vault key.

1. For the **User-assigned identity**field, select an existing user-assigned managed identity.

1. Select **Review + create** to validate and create the new account.

## Next steps

To learn how to parameterize a load test by using secrets, see [Parameterize a load test](./how-to-parameterize-load-tests.md).