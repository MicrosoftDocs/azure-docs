---
title: Encrypt Azure Data Factory with customer-managed key
description: Enhance Data Factory security with Bring Your Own Key (BYOK)
author: dcstwh
ms.author: weetok
ms.service: data-factory
ms.subservice: security
ms.topic: quickstart
ms.date: 10/14/2022
ms.reviewer: mariozi
ms.custom: mode-other
---
# Encrypt Azure Data Factory with customer-managed keys

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

Azure Data Factory encrypts data at rest, including entity definitions and any data cached while runs are in progress. By default, data is encrypted with a randomly generated Microsoft-managed key that is uniquely assigned to your data factory. For extra security guarantees, you can now enable Bring Your Own Key (BYOK) with customer-managed keys feature in Azure Data Factory. When you specify a customer-managed key, Data Factory uses __both__ the factory system key and the CMK to encrypt customer data. Missing either would result in Deny of Access to data and factory.

Azure Key Vault is required to store customer-managed keys. You can either create your own keys and store them in a key vault, or you can use the Azure Key Vault APIs to generate keys. Key vault and Data Factory must be in the same Azure Active Directory (Azure AD) tenant and in the same region, but they may be in different subscriptions. For more information about Azure Key Vault, see [What is Azure Key Vault?](../key-vault/general/overview.md)

## About customer-managed keys

The following diagram shows how Data Factory uses Azure Active Directory and Azure Key Vault to make requests using the customer-managed key:

  :::image type="content" source="media/enable-customer-managed-key/encryption-customer-managed-keys-diagram.png" alt-text="Diagram showing how customer-managed keys work in Azure Data Factory.":::

The following list explains the numbered steps in the diagram:

1. An Azure Key Vault admin grants permissions to encryption keys to the managed identity that's associated with the Data Factory
1. A Data Factory admin enables customer-managed key feature in the factory
1. Data Factory uses the managed identity that's associated with the factory to authenticate access to Azure Key Vault via Azure Active Directory
1. Data Factory wraps the factory encryption key with the customer key in Azure Key Vault
1. For read/write operations, Data Factory sends requests to Azure Key Vault to unwrap the account encryption key to perform encryption and decryption operations

There are two ways of adding Customer Managed Key encryption to data factories. One is during factory creation time in Azure portal, and the other is post factory creation, in Data Factory UI.

## Prerequisites - configure Azure Key Vault and generate keys

### Enable Soft Delete and Do Not Purge on Azure Key Vault

Using customer-managed keys with Data Factory requires two properties to be set on the Key Vault, __Soft Delete__ and __Do Not Purge__. These properties can be enabled using either PowerShell or Azure CLI on a new or existing key vault. To learn how to enable these properties on an existing key vault, see [Azure Key Vault recovery management with soft delete and purge protection](../key-vault/general/key-vault-recovery.md)

If you are creating a new Azure Key Vault through Azure portal, __Soft Delete__ and __Do Not Purge__ can be enabled as follows:

  :::image type="content" source="media/enable-customer-managed-key/01-enable-purge-protection.png" alt-text="Screenshot showing how to enable Soft Delete and Purge Protection upon creation of Key Vault.":::

### Grant Data Factory access to Azure Key Vault

Make sure Azure Key Vault and Azure Data Factory are in the same Azure Active Directory (Azure AD) tenant and in the _same region_. From Azure Key Vault access control, grant data factory following permissions: _Get_, _Unwrap Key_, and _Wrap Key_. These permissions are required to enable customer-managed keys in Data Factory.

* If you want to add customer managed key encryption [after factory creation in Data Factory UI](#post-factory-creation-in-data-factory-ui), ensure data factory's managed service identity (MSI) has the three permissions to Key Vault
* If you want to add customer managed key encryption [during factory creation time in Azure portal](#during-factory-creation-in-azure-portal), ensure the user-assigned managed identity (UA-MI) has the three permissions to Key Vault

  :::image type="content" source="media/enable-customer-managed-key/02-access-policy-factory-managed-identities.png" alt-text="Screenshot showing how to enable Data Factory Access to Key Vault.":::

### Generate or upload customer-managed key to Azure Key Vault

You can either create your own keys and store them in a key vault. Or you can use the Azure Key Vault APIs to generate keys. Only RSA keys are supported with Data Factory encryption. RSA-HSM  is also supported. For more information, see [About keys, secrets, and certificates](../key-vault/general/about-keys-secrets-certificates.md).

  :::image type="content" source="media/enable-customer-managed-key/03-create-key.png" alt-text="Screenshot showing how to generate Customer-Managed Key.":::

## Enable customer-managed keys

### Post factory creation in Data Factory UI

This section walks through the process to add customer managed key encryption in Data Factory UI, _after_ factory is created.

> [!NOTE]
> A customer-managed key can only be configured on an empty data Factory. The data factory can't contain any resources such as linked services, pipelines and data flows. It is recommended to enable customer-managed key right after factory creation.

> [!IMPORTANT]
> This approach does not work with managed virtual network enabled factories. Please consider the [alternative route](#during-factory-creation-in-azure-portal), if you want encrypt such factories.

1. Make sure that data factory's Managed Service Identity (MSI) has _Get_, _Unwrap Key_ and _Wrap Key_ permissions to Key Vault.

1. Ensure the Data Factory is empty. The data factory can't contain any resources such as linked services, pipelines, and data flows. For now, deploying customer-managed key to a non-empty factory will result in an error.

1. To locate the key URI in the Azure portal, navigate to Azure Key Vault, and select the Keys setting. Select the wanted key, then select the key to view its versions. Select a key version to view the settings

1. Copy the value of the Key Identifier field, which provides the URI
  :::image type="content" source="media/enable-customer-managed-key/04-get-key-identifier.png" alt-text="Screenshot of getting key URI from Key Vault.":::

1. Launch Azure Data Factory portal, and using the navigation bar on the left, jump to Data Factory Management Portal

1. Click on the __Customer managed key__ icon
  :::image type="content" source="media/enable-customer-managed-key/05-customer-managed-key-configuration.png" alt-text="Screenshot how to enable Customer-managed Key in Data Factory UI.":::

1. Enter the URI for customer-managed key that you copied before

1. Click __Save__ and customer-managed key encryption is enabled for Data Factory

### During factory creation in Azure portal

This section walks through steps to add customer managed key encryption in Azure portal, _during_ factory deployment.

To encrypt the factory, Data Factory needs to first retrieve customer-managed key from Key Vault. Since factory deployment is still in progress, Managed Service Identity (MSI) isn't available yet to authenticate with Key Vault. As such, to use this approach, customer needs to assign a user-assigned managed identity (UA-MI) to data factory. We will assume the roles defined in the UA-MI and authenticate with Key Vault.

To learn more about user-assigned managed identity, see [Managed identity types](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types) and [Role assignment for user assigned managed identity](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md).

1. Make sure that User-assigned Managed Identity (UA-MI) has _Get_, _Unwrap Key_ and _Wrap Key_ permissions to Key Vault

1. Under __Advanced__ tab, check the box for _Enable encryption using a customer managed key_
  :::image type="content" source="media/enable-customer-managed-key/06-user-assigned-managed-identity.png" alt-text="Screenshot of Advanced tab for data factory creation experience in Azure portal.":::

1. Provide the url for the customer managed key stored in Key Vault

1. Select an appropriate user assigned managed identity to authenticate with Key Vault

1. Continue with factory deployment

## Update Key Version

When you create a new version of a key, update data factory to use the new version. Follow similar steps as described in section [Data Factory UI](#post-factory-creation-in-data-factory-ui), including:

1. Locate the URI for the new key version through Azure Key Vault Portal

1. Navigate to __Customer-managed key__ setting

1. Replace and paste in the URI for the new key

1. Click __Save__ and Data Factory will now encrypt with the new key version

## Use a Different Key

To change key used for Data Factory encryption, you have to manually update the settings in Data Factory. Follow similar steps as described in section [Data Factory UI](#post-factory-creation-in-data-factory-ui), including:

1. Locate the URI for the new key through Azure Key Vault Portal

1. Navigate to __Customer managed key__ setting

1. Replace and paste in the URI for the new key

1. Click __Save__ and Data Factory will now encrypt with the new key

## Disable Customer-managed Keys

By design, once the customer-managed key feature is enabled, you can't remove the extra security step. We will always expect a customer provided key to encrypt factory and data.

## Customer managed key and continuous integration and continuous deployment

By default, CMK configuration is not included in the factory Azure Resource Manager (ARM) template. To include the customer managed key encryption settings in ARM template for continuous integration (CI/CD):

1. Ensure the factory is in Git mode
1. Navigate to management portal - customer managed key section
1. Check _Include in ARM template_ option

  :::image type="content" source="media/enable-customer-managed-key/07-include-in-template.png" alt-text="Screenshot of including customer managed key setting in ARM template.":::

The following settings will be added in ARM template. These properties can be parameterized in Continuous Integration and Delivery pipelines by editing the [Azure Resource Manager parameters configuration](continuous-integration-delivery-resource-manager-custom-parameters.md)

  :::image type="content" source="media/enable-customer-managed-key/08-template-with-customer-managed-key.png" alt-text="Screenshot of including customer managed key setting in Azure Resource Manager template.":::

> [!NOTE]
> Adding the encryption setting to the ARM templates adds a factory-level setting that will override other factory level settings, such as git configurations, in other environments. If you have these settings enabled in an elevated environment such as UAT or PROD, please refer to [Global Parameters in CI/CD](author-global-parameters.md#cicd).

## Next steps

Go through the [tutorials](tutorial-copy-data-dot-net.md) to learn about using Data Factory in more scenarios.
