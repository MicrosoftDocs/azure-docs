---
title: Azure Key Vault Managed HSM - Third-party solutions | Microsoft Docs
description: Learn about third-party solutions integrated with Managed HSM.
services: key-vault
author: mbaldwin
editor: ''

ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: conceptual
ms.date: 11/14/2022
ms.author: mbaldwin

---

# Third-party solutions

Azure Key Vault Managed HSM is a fully managed, highly available, single-tenant, standards-compliant cloud service that enables you to safeguard cryptographic keys for your cloud applications, using **FIPS  140-2 Level 3** validated HSMs. [Learn more](overview.md).

Several vendors have worked closely with Microsoft to integrate their solutions with Managed HSM. The table below lists these solutions with a brief description (provided by vendor). Links to their Azure Marketplace offering and documentation are also provided.


## Third-party solutions integrated with Managed HSM

| Vendor name | Solution description |
|-------------|-------------------------------------------------|
|[Cloudflare](https://cloudflare.com)|Cloudflare’s Keyless SSL enables your websites to use Cloudflare’s SSL service while keeping custody of their private keys in Managed HSM. This service, coupled with Managed HSM helps a high level of protection by safeguarding your private keys, performing signing and encryption operations internally, providing access controls, and storing keys in a tamper-resistant FIPS 140-2 Level 3 HSM. <br>[Documentation](https://developers.cloudflare.com/ssl/keyless-ssl/hardware-security-modules/azure-managed-hsm)
|[NewNet Communication Technologies](https://newnet.com/)|NewNet’s Secure Transaction Cloud(STC) is an Industry first Cloud based secure payment routing, switching, transport solution augmented with Cloud based virtualized HSM, handling Mobile, Web, In-Store payments. STC enables cloud transformation for payment entities & rapid deployment for green field payment providers.<br/>[Azure Marketplace offering](https://azuremarketplace.microsoft.com/marketplace/apps/newnetcommunicationtechnologies1589991852134.secure_transaction_cloud?tab=overview)<br/>[Documentation](https://newnet.com/business-units/secure-transactions/products/secure-transaction-cloud-stc/)|
|[PrimeKey](https://www.primekey.com)|EJBCA Enterprise, world's most used PKI (public key infrastructure), provides the basic security services for trusted identities and secure communication for any use case. A single instance of EJBCA Enterprise supports multiple CAs and levels to enable you to build complete infrastructure(s) for multiple use cases.<br>[Azure Marketplace offering](https://azuremarketplace.microsoft.com/marketplace/apps/primekey.ejbca_enterprise_cloud_edition_private_vhd)<br/>[Documentation](https://doc.primekey.com/x/a4z_/)|
|[HashiCorp Vault](https://www.hashicorp.com/products/vault)| HashiCorp Vault is an identity-based security solution that leverages trusted sources of identity to keep secrets and application data secure, including API keys, passwords, or certificates. HashiCorp Vaults must be unsealed with an unsealing key to provide access to data. Hardware-backed keys stored in Managed HSM can be used to automatically unseal a HashiCorp Vault and reduce the operational overhead associated with storing and serving this unsealing key. <br>[Documentation](https://www.vaultproject.io/docs/configuration/seal/azurekeyvault)|



## Next steps
* [Managed HSM overview](overview.md)
* [Managed HSM best practices](best-practices.md)

