---
title: Best Practices for FHIR Service Customer-Managed Keys
description: Learn best practices for customer-managed keys in the FHIR service, including key rotation and access updates, and improve data protection today.
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: how-to
ms.date: 06/08/2026
ms.author: kesheth
---

# Best practices for using customer-managed keys for the FHIR service

Customer-managed keys (CMK) are encryption keys that you create and manage in your own key store. This article shares best practices for customer-managed keys in the FHIR&reg; service to help you improve control over data encryption and access. You use [Azure Key Vault](/azure/key-vault/) to create and manage CMK, and then use the keys to encrypt the data stored by the FHIR&reg; service. 

## Rotate keys often

Follow security best practices and rotate keys often. You must rotate keys used with the FHIR service manually. When you rotate a key, update the version of the existing key or set a new encryption key from a different storage location. Always keep existing keys enabled when adding new keys because they're still needed to access the data that was encrypted with them.  

To rotate the key by generating a new version of the key, use the `az keyvault key rotate` command. For more information, see [Azure Key Vault rotate command](/cli/azure/keyvault/key).

## Update the FHIR service after changing a managed identity

If you change the managed identity in any way, such as moving your FHIR service to a different tenant or subscription, the FHIR service can't access your keys. You must update the service manually by using an ARM template deployment. For steps, see [Use an ARM template to update the encryption key](configure-customer-managed-keys.md#update-the-key-by-using-an-arm-template).

## Disable public access with a firewall

When you use a key vault with a firewall to disable public access, you must enable the option to **Allow trusted Microsoft services to bypass this firewall**.

## Next steps

[Configure customer-managed keys for the FHIR service](configure-customer-managed-keys.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
