---
title: Data encryption models in Microsoft Azure
description: This article provides an overview of data encryption models In Microsoft Azure.
author: msmbaldwin
ms.author: mbaldwin
ms.date: 01/12/2026
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
---

# Data encryption models

To understand how Azure resource providers implement encryption at rest, you need to understand the different encryption models and their advantages and disadvantages. To ensure a common language and taxonomy, Azure resource providers share these definitions.

Azure automatically encrypts data at rest by default by using platform-managed keys. You can optionally choose other key management approaches based on your security and compliance requirements. Three scenarios exist for server-side encryption:

- **Server-side encryption using platform-managed keys (default)**
  - Azure resource providers perform the encryption and decryption operations.
  - Microsoft manages the keys automatically.
  - Enabled by default with no configuration required.
  - Full cloud functionality.

- **Server-side encryption using customer-managed keys in Azure Key Vault (optional)**
  - Azure resource providers perform the encryption and decryption operations.
  - You control keys via Azure Key Vault.
  - Requires customer configuration and management.
  - Full cloud functionality.

- **Server-side encryption using customer-managed keys on customer-controlled hardware (advanced option)**
  - Azure resource providers perform the encryption and decryption operations.
  - You control keys on customer-controlled hardware.
  - Complex configuration and limited Azure service support.
  - Full cloud functionality.

Server-side encryption models refer to encryption that the Azure service performs. In that model, the resource provider performs the encrypt and decrypt operations. For example, Azure Storage might receive data in plain text operations and perform the encryption and decryption internally. The resource provider might use encryption keys that Microsoft or the customer manages, depending on the provided configuration.

:::image type="content" source="media/encryption-models/azure-security-encryption-atrest-fig3.png" alt-text="Screenshot of Server." lightbox="media/encryption-models/azure-security-encryption-atrest-fig3.png":::

Each of the server-side encryption at rest models has distinctive characteristics of key management. These characteristics include where and how you create and store encryption keys, as well as the access models and the key rotation procedures.

For client-side encryption, consider:

- Azure services can't see decrypted data.
- Customers manage and store keys on-premises (or in other secure stores). Azure services don't have access to keys.
- Reduced cloud functionality.

The supported encryption models in Azure split into two main groups: **Client Encryption** and **Server-side Encryption**. Regardless of the encryption at rest model you use, Azure services always recommend the use of a secure transport such as TLS or HTTPS. Therefore, encryption in transport should be addressed by the transport protocol and shouldn't be a major factor in determining which encryption at rest model to use.

## Client encryption model

The client encryption model refers to encryption that the service or calling application performs outside of the Resource Provider or Azure. The service application in Azure or an application running in the customer data center can perform the encryption. In either case, when you use this encryption model, the Azure Resource Provider receives an encrypted blob of data without the ability to decrypt the data in any way or access the encryption keys. In this model, the calling service or application handles key management and keeps it opaque to the Azure service.

:::image type="content" source="media/encryption-models/azure-security-encryption-atrest-fig2.png" alt-text="Screenshot of Client.":::

## Server-side encryption using platform-managed keys (default)

For most customers, the essential requirement is to ensure that the data is encrypted whenever it is at rest. Server-side encryption using platform-managed keys (formerly called service-managed keys) fulfills this requirement by providing automatic encryption by default. This approach enables encryption at rest without requiring customers to configure or manage any encryption keys, leaving all key management aspects such as key issuance, rotation, and backup to Microsoft. 

Most Azure services implement this model as the default behavior, automatically encrypting data at rest by using platform-managed keys without any customer action required. The Azure resource provider creates the keys, places them in secure storage, and retrieves them when needed. The service has full access to the keys and maintains full control over the credential lifecycle management, providing robust encryption protection with zero management overhead for customers.

:::image type="content" source="media/encryption-models/azure-security-encryption-atrest-fig4.png" alt-text="Screenshot of managed.":::

Server-side encryption by using platform-managed keys addresses the need for encryption at rest with zero overhead to the customer. This encryption is enabled by default across Azure services, providing automatic data protection without requiring any customer configuration or management. Customers benefit from robust encryption protection immediately upon storing data in Azure services, with no additional steps, costs, or ongoing management required.

Server-side encryption with platform-managed keys implies the service has full access to store and manage the keys. While some customers might want to manage the keys because they feel they gain greater security, consider the cost and risk associated with a custom key storage solution when evaluating this model. In many cases, an organization might determine that resource constraints or risks of an on-premises solution are greater than the risk of cloud management of the encryption at rest keys. However, this model might not be sufficient for organizations that have requirements to control the creation or lifecycle of the encryption keys or to have different personnel manage a service's encryption keys than those managing the service (that is, segregation of key management from the overall management model for the service).

### Key access

When you use server-side encryption with platform-managed keys, the service manages key creation, storage, and service access. Typically, the foundational Azure resource providers store the Data Encryption Keys in a store that's close to the data and quickly accessible, while the Key Encryption Keys are stored in a secure internal store.

**Advantages**

- Simple setup.
- Microsoft manages key rotation, backup, and redundancy.
- You don't incur costs or risks associated with implementing a custom key management scheme.

**Considerations**

- No customer control over the encryption keys (key specification, lifecycle, revocation, etc.). This option is suitable for most use cases but might not meet specialized compliance requirements.
- No ability to segregate key management from the overall management model for the service. Organizations requiring separation of duties might need customer-managed keys.

## Server-side encryption using customer-managed keys in Azure Key Vault and Azure Managed HSM (optional)

For scenarios where organizations have specific requirements to control their encryption keys beyond the default platform-managed encryption, customers can optionally choose server-side encryption by using customer-managed keys in Key Vault or Azure Managed HSM. This approach builds on top of the default encryption at rest, allowing customers to use their own keys while Azure continues to handle the encryption and decryption operations.

Some services might store only the root Key Encryption Key in Azure Key Vault and store the encrypted Data Encryption Key in an internal location closer to the data. In this scenario, customers can bring their own keys to Key Vault (BYOK – Bring Your Own Key) or generate new ones, and use them to encrypt the desired resources. While the Resource Provider performs the encryption and decryption operations, it uses the customer's configured key encryption key as the root key for all encryption operations.

Loss of key encryption keys means loss of data. For this reason, don't delete keys. Always back up keys when you create or rotate them. To protect against accidental or malicious cryptographic erasure, [Soft-Delete and purge protection](/azure/key-vault/general/soft-delete-overview) must be enabled on any vault storing key encryption keys. Instead of deleting a key, set enabled to false on the key encryption key. Use access controls to revoke access to individual users or services in [Azure Key Vault](/azure/key-vault/general/security-features#access-model-overview) or [Managed HSM](/azure/key-vault/managed-hsm/secure-your-managed-hsm).

> [!NOTE]
> For a list of services that support customer-managed keys in Azure Key Vault and Azure Managed HSM, see [Services that support CMKs in Azure Key Vault and Azure Managed HSM](encryption-customer-managed-keys-support.md).

### Key access

The server-side encryption model with customer-managed keys in Azure Key Vault involves the service accessing the keys to encrypt and decrypt as needed. You make encryption at rest keys accessible to a service through an access control policy. This policy grants the service identity access to receive the key. You can configure an Azure service running on behalf of an associated subscription with an identity in that subscription. The service can perform Microsoft Entra authentication and receive an authentication token identifying itself as that service acting on behalf of the subscription. The service then presents the token to Key Vault to obtain a key to which it has been given access.

For operations using encryption keys, you can grant a service identity access to any of the following operations: decrypt, encrypt, unwrapKey, wrapKey, verify, sign, get, list, update, create, import, delete, backup, and restore.

To obtain a key for use in encrypting or decrypting data at rest, the service identity that the Resource Manager service instance runs as must have UnwrapKey (to get the key for decryption) and WrapKey (to insert a key into key vault when creating a new key).

> [!NOTE]  
> For more detail on Key Vault authorization, see the secure your key vault page in the [Azure Key Vault documentation](/azure/key-vault/general/security-features).

**Advantages**

- Full control over the keys used – encryption keys are managed in your Key Vault under your control.
- Ability to encrypt multiple services to one master.
- Can segregate key management from overall management model for the service.
- Can define service and key location across regions.

**Disadvantages**

- You have full responsibility for key access management.
- You have full responsibility for key lifecycle management.
- Additional setup and configuration overhead.

## Server-side encryption using customer-managed keys in customer-controlled hardware (specialized option)

Some Azure services enable the Host Your Own Key (HYOK) key management model for organizations with specialized security requirements. This management mode is useful in highly regulated scenarios where there's a requirement to encrypt the data at rest and manage the keys in a proprietary repository completely outside of Microsoft's control, beyond the default platform-managed encryption and optional customer-managed keys in Azure Key Vault.

In this model, the service must use the key from an external site to decrypt the Data Encryption Key (DEK). Performance and availability guarantees are affected, and configuration is significantly more complex. Additionally, since the service doesn't have access to the DEK during the encryption and decryption operations, the overall security guarantees of this model are similar to when the keys are customer-managed in Azure Key Vault. As a result, this model isn't appropriate for most organizations unless they have very specific regulatory or security requirements that can't be met with platform-managed keys or customer-managed keys in Azure Key Vault. Due to these limitations, most Azure services don't support server-side encryption using customer-managed keys in customer-controlled hardware. One of two keys in [Double Key Encryption](/microsoft-365/compliance/double-key-encryption) follows this model.

### Key access

When you use server-side encryption with customer-managed keys in customer-controlled hardware, you maintain the key encryption keys on a system that you configure. Azure services that support this model provide a way to establish a secure connection to a customer-supplied key store.

**Advantages**

- You have full control over the root key used, as the encryption keys are managed by a customer-provided store.
- Ability to encrypt multiple services to one master.
- Can segregate key management from overall management model for the service.
- Can define service and key location across regions.

**Disadvantages**

- You have full responsibility for key storage, security, performance, and availability.
- You have full responsibility for key access management.
- You have full responsibility for key lifecycle management.
- You incur significant setup, configuration, and ongoing maintenance costs.
- There's increased dependency on network availability between the customer datacenter and Azure datacenters.

## Related content

- [Services that support CMKs in Azure Key Vault and Azure Managed HSM](encryption-customer-managed-keys-support.md)
- [How encryption is used in Azure](encryption-overview.md)
- [Double encryption](double-encryption.md)
