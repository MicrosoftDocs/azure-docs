---
title: Configure customer-managed Keys (CMK) - Azure Health Data Services
description: This document describes how to configure Customer Managed Keys (CMK) for the DICOM service in Azure Health Data Services.
author: mmitrik
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 10/16/2023
ms.author: mmitrik
---

# Configure customer-managed keys (CMK) for the DICOM service

Customer-managed keys (CMK) enable customers to protect and control access to their data using keys they create and manage.  The DICOM service supports CMK, allowing customers to create and manage keys using Azure Key Vault and then use those keys to encrypt the data stored by the DICOM service.  This article shows how to configure Azure Key Vault and the DICOM service to use customer-managed keys.

## Create a key in Azure Key Vault

To use customer-managed keys with the DICOM service, the key must first be created in Azure Key Vault.  The DICOM service also requires that keys meet the following requirements:

- The key vault or managed HSM that stores the key must have both soft delete and purge protection enabled.

- The key type is RSA-HSM or RSA with one of the following sizes: 2048-bit, 3072-bit, or 4096-bit.

For more information, see [About keys](../../key-vault/keys/about-keys.md).

To create a key in your key vault, see [Add a key to Key Vault](../../key-vault/keys/quick-create-portal.md#add-a-key-to-key-vault)

## Enable system assigned managed identity

Before you configure keys, you need to enable a system-assigned managed identity for the DICOM service.

1. In the Azure portal, go to the DICOM instance and then select **Identity** from the left pane.

2. On the **Identity** page, select the **System assigned** tab, and then set the **Status** field to **On**. Choose **Save**.

:::image type="content" source="media/dicom-identity-sys-assign.png" alt-text="Screenshot of the system assigned managed identity toggle in the Identity page." lightbox="media/dicom-identity-sys-assign.png":::

### Assign Key Vault Crypto Officer role to the managed identity

The system assigned managed identity needs the [Key Vault Crypto Officer](../../role-based-access-control/built-in-roles.md#key-vault-crypto-officer) role in order to access keys and use them to encrypt and decrypt data.  

1. In the Azure portal, go to the key vault and then select **Access control (IAM)** from the left pane.

2. On the **Access control (IAM)** page select **Add role assignment**.

3. On the Add role assignment page, select the **Key Vault Crypto Officer** role and then select **Next**.

4. On the Members tab, select **Managed Identity** and **Select members**.

5. On the Select managed identities panel, select **DICOM Service** from the Managed identity drop down, then select your DICOM service from the list, then **Select**. 

:::image type="content" source="media/kv-add-role-assignment.png" alt-text="Screenshot of selecting the system assigned managed identity in the Add role assignment page." lightbox="media/kv-add-role-assignment.png":::

6. Review the role assignment and select **Review + assign**. 

:::image type="content" source="media/kv-add-role-review.png" alt-text="Screenshot of the role assignment with the review + assign action." lightbox="media/kv-add-role-review.png":::

## Use an ARM template to update the encryption key

## Losing access to the key

## Rotating they key
