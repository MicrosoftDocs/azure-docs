---
title: Best practices for customer-managed keys for the DICOM service in Azure Health Data Services
description: Encrypt your data with customer-managed keys (CMK) in the DICOM service in Azure Health Data Services. Get tips on requirements, best practices, limitations, and troubleshooting.
author: mmitrik
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: overview
ms.date: 11/20/2023
ms.author: mmitrik
---

# Best practices for using customer-managed keys for the DICOM service

Customer-managed keys (CMK) are encryption keys that you create and manage in your own key store. By using CMK, you can have more flexibility and control over the encryption and access of your organization’s data. You use [Azure Key Vault](../../key-vault/index.yml) to create and manage CMK and then use the keys to encrypt the data stored by the DICOM&reg; service. 

## Rotate keys often

Follow [security best practices](../../key-vault/secrets/secrets-best-practices.md) and rotate keys often. Keys used with the DICOM service must be rotated manually. To rotate a key, update the version of the existing key or set a new encryption key from a different storage location. Always make sure to keep existing keys enabled when adding new keys because they're still needed to access the data that was encrypted with them.  

## Update the DICOM service after changing a managed identity

If you change the managed identity in any way, such as moving your DICOM service to a different tenant or subscription, the DICOM service isn't able to access your keys until you update the service manually with an ARM template deployment. For steps, see [Use an ARM template to update the encryption key](configure-customer-managed-keys.md#update-the-key-by-using-an-arm-template).

## Locate the key vault in the same tenant

The key vault must be located in the same Azure tenant as your DICOM service.

## Disable public access with a firewall

When using a key vault with a firewall to disable public access, the option to **Allow trusted Microsoft services to bypass this firewall** must be enabled.

## Next steps

[Configure customer-managed keys for the DICOM service](configure-customer-managed-keys.md)

[!INCLUDE [DICOM trademark statement](../includes/healthcare-apis-dicom-trademark.md)]