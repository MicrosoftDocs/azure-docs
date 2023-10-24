---
title: Using customer-managed Keys (CMK) - Azure Health Data Services
description: This document describes how to use Customer-Managed Keys (CMK) for the DICOM service in Azure Health Data Services.
author: mmitrik
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: overview
ms.date: 10/24/2023
ms.author: mmitrik
---

# Using customer-managed keys with the DICOM service

Customer-managed keys (CMK) enable you to protect and control access to your data using keys you create and manage.  The DICOM service supports CMK, allowing you to create and manage keys using Azure Key Vault and then use those keys to encrypt the data stored by the DICOM service.  

## Key vault and key requirements

You must use one of the following Azure key stores to store your customer-managed keys:
- [Azure Key Vault](/articles/key-vault/general/overview.md)
- [Azure Key Vault Managed Hardware Security Module (HSM)](/articles/key-vault/managed-hsm/overview.md)

> [!NOTE]
> The key vault or managed HSM that stores the key must have both **soft delete** and **purge protection** enabled.

The DICOM service also requires that keys meet the following requirements:

- Key is versioned
- Key type is **RSA-HSM** or **RSA** 
- Key size is **2048-bit** or **3072-bit**

For more information, see [About keys](../../key-vault/keys/about-keys.md).

## Rotating keys

You should follow [security best practices](/articles/key-vault/secrets/secrets-best-practices.md) and rotate keys often.  At this time, keys used with the DICOM service must be rotated manually.  Keys can be rotated by updating the version of the existing key or by setting a new encryption key from a different storage location.  Always be sure to keep existing keys enabled when adding new keys.  

## Managed identities

Before you configure keys, you need to enable a managed identity for the DICOM service.  Either a system assigned or user assigned managed identity can be used for customer-managed keys.  Learn more about [managed identities for Azure resources](/articles/active-directory/managed-identities-azure-resources/overview.md)

### Moving or deleting a managed identity

If the managed identity used with customer-managed keys is changed in any way (for example, moving your DICOM service to a new tenant or subscription), the DICOM service will not automatically react to the changes and will be unable to access keys.  The service must be updated manually using an ARM template deployment.  For details, see [Use an ARM template to update the encryption key](configure-customer-managed-keys.md#use-an-arm-template-to-update-the-encryption-key)

## Recovering from lost key access

For the DICOM service to operate properly, it must always have access to the key in the key vault.  There are some scenarios where the service could lose access to the key, including:

- The key is disabled or deleted from the key vault
- The DICOM service's system assigned managed identity is disabled 
- The DICOM service's system assigned managed identity loses access to the key vault

In any scenario where the DICOM service can't access the key, API requests will return with `500` errors and your data will be inaccessible until access to the key is restored.  The Resource health view for the DICOM service can help diagnose key access issues.

If key access is lost for less than 30 minutes, data will be automatically recovered.  Once access is re-enabled, please allow 5 to 10 minutes for your DICOM service to become available again.

If key access is lost for more than 30 minutes, you will need to contact customer support to assist in recovering your data.

## Limitations

The DICOM service has some limitations when using customer-managed keys:

- The key vault must be located in the same Azure tenant as your DICOM service.
- When using a key vault with a firewall to disable public access, the option to **Allow trusted Microsoft services to bypass this firewall** must be enabled.

## Next steps

This article provided and overview of using customer-managed keys with the DICOM service. To learn how to configure customer-managed keys to encrypt data stored in the DICOM service, see

>[!div class="nextstepaction"]
>[Configure customer-managed keys for the DICOM service](configure-customer-managed-keys.md)
