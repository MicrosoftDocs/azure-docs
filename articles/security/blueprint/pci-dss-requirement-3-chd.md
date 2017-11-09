---

title: CHD requirements for PCI DSS-compliant environments
description: PCI DSS Requirement 3
services: security
documentationcenter: na
author: simorjay
manager: mbaldwin
editor: tomsh

ms.assetid: 9736f7c8-c632-4b86-8b8a-6e4f45c1a7aa
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/15/2017
ms.author: frasim

---
# CHD requirements for PCI DSS-compliant environments
## PCI DSS Requirement 3

**Protect stored cardholder data**

> [!NOTE] These requirements are defined by the [Payment Card Industry (PCI) Security Standards Council](https://www.pcisecuritystandards.org/pci_security/) as part of the [PCI Data Security Standard (DSS) Version 3.2](https://www.pcisecuritystandards.org/document_library?category=pcidss&document=pci_dss). Please refer to the PCI DSS for information on testing procedures and guidance for each requirement.

Protection methods such as encryption, truncation, masking, and hashing are critical components of cardholder data protection. If an intruder circumvents other security controls and gains access to encrypted data, without the proper cryptographic keys, the data is unreadable and unusable to that person. Other effective methods of protecting stored data should also be considered as potential risk mitigation opportunities. For example, methods for minimizing risk include not storing cardholder data unless absolutely necessary, truncating cardholder data if full PAN is not needed, and not sending unprotected PANs using end-user messaging technologies, such as e-mail and instant messaging.
Please refer to the PCI DSS and PA-DSS Glossary of Terms, Abbreviations, and Acronyms for definitions of “strong cryptography” and other PCI DSS terms.

## PCI DSS Requirement 3.1

**3.1** Keep cardholder data storage to a minimum by implementing data retention and disposal policies, procedures and processes that include at least the following for all cardholder data (CHD) storage:
- Limiting data storage amount and retention time to that which is required for legal, regulatory, and business requirements
- Specific retention requirements for cardholder data
- Processes for secure deletion of data when no longer needed
- A quarterly process for identifying and securely deleting stored cardholder data that exceeds defined retention.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Azure is responsible for ensuring the customer data designated for deletion are securely decommissioned using NIST 800-88 compliant protocols specified in its Secure Disposal policies. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore does not delete or destroy any stored CHD. However all data is encrypted and no primary account number (PAN) data is stored.<br /><br />|



## PCI DSS Requirement 3.2

**3.2** Do not store sensitive authentication data after authorization (even if encrypted). If sensitive authentication data is received, render all data unrecoverable upon completion of the authorization process. 
> - There is a business justification, and 
> - The data is stored securely.
Sensitive authentication data includes the data as cited in the following Requirements 3.2.1 through 3.2.3:


**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore does not delete or destroy any stored CHD; the sample data is stored for demo purposes only. However, all data is encrypted and no primary account number (PAN) data is stored.<br /><br />|



### PCI DSS Requirement 3.2.1

**3.2.1** Do not store the full contents of any track (from the magnetic stripe located on the back of a card, equivalent data contained on a chip, or elsewhere) after authorization. This data is alternatively called full track, track, track 1, track 2, and magnetic-stripe data. 

> [!NOTE] In the normal course of business, the following data elements from the magnetic stripe may need to be retained: 
> - The cardholder’s name 
> - Primary account number (PAN) 
> - Expiration date 
> - Service code 
>
> To minimize risk, store only these data elements as needed for business.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore does not store the full content of any CHD.|



### PCI DSS Requirement 3.2.2

**3.2.2** Do not store the card verification code or value (three-digit or four-digit number printed on the front or back of a payment card used to verify card-not-present transactions) after authorization.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore encrypts all data including the CVV samples.|



### PCI DSS Requirement 3.2.3

**3.2.3** Do not store the personal identification number (PIN) or the encrypted PIN block after authorization.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore does not store PIN information.|



## PCI DSS Requirement 3.3

**3.3** Mask PAN when displayed (the first six and last four digits are the maximum number of digits to be displayed), such that only personnel with a legitimate business need can see the full PAN. 

> [!NOTE] This requirement does not supersede stricter requirements in place for displays of cardholder data—for example, legal or payment card brand requirements for point-of-sale (POS) receipts.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore masks the primary account number (PAN) using transparent data encryption, always encrypted columns, and dynamic data masking. For more information, see [PCI Guidance - Azure SQL Database](payment-processing-blueprint.md#azure-sql-database).|



## PCI DSS Requirement 3.4

**3.4** Render PAN unreadable anywhere it is stored (including on portable digital media, backup media, and in logs) by using any of the following approaches:
- One-way hashes based on strong cryptography, (hash must be of the entire PAN)
- Truncation (hashing cannot be used to replace the truncated segment of PAN)
- Index tokens and pads (pads must be securely stored)
- Strong cryptography with associated key-management processes and procedures. 

> [!NOTE] It is a relatively trivial effort for a malicious individual to reconstruct original PAN data if they have access to both the truncated and hashed version of a PAN. Where hashed and truncated versions of the same PAN are present in an entity’s environment, additional controls must be in place to ensure that the hashed and truncated versions cannot be correlated to reconstruct the original PAN.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore encrypts all credit card data, and uses Azure Key Vault to manage keys, preventing retrieval of CHD.<br /><br />For more information, see [PCI Guidance - Encryption](payment-processing-blueprint.md#encryption-and-secrets-management).|



### PCI DSS Requirement 3.4.1

**3.4.1** If disk encryption is used (rather than file- or column-level database encryption), logical access must be managed separately and independently of native operating system authentication and access control mechanisms (for example, by not using local user account databases or general network login credentials). Decryption keys must not be associated with user accounts. 

> [!NOTE] This requirement applies in addition to all other PCI DSS encryption and key-management requirements.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore encrypts all stored data, and segregates traffic to prevent privileged elevation for DevOps functions.<br /><br />As the App Service Environment is secured and locked down, there needs to be a mechanism to allow for any DevOps releases or changes that might be necessary, such as the ability to monitor a Web App using Kudu.<br /><br />A virtual machine is established as a jumpbox (bastion host) with the following configurations:<br /><br /><ul><li>[Antimalware extension](/azure/security/azure-security-antimalware)</li><li>[OMS Monitoring extension](/azure/virtual-machines/virtual-machines-windows-extensions-oms)</li><li>[VM Diagnostics extension](/azure/virtual-machines/virtual-machines-windows-extensions-diagnostics-template)</li><li>[Bitlocker Encrypted Disk](/azure/security/azure-security-disk-encryption)</li></ul>Using Azure Key Vault aligns with Azure Government, PCI DSS, and HIPAA requirements.|



## PCI DSS Requirement 3.5

**3.5** Document and implement procedures to protect keys used to secure stored cardholder data against disclosure and misuse. 

> [!NOTE] This requirement applies to keys used to encrypt stored cardholder data, and also applies to key-encrypting keys used to protect data-encrypting keys—such key-encrypting keys must be at least as strong as the data-encrypting key.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | **For customers using Key Vault:**<br /><br />Microsoft Azure ensures that customer key vaults are logically isolated from each other, and logically isolated from the management plane of the Key Vault service. Key Vault is designed so that Microsoft does not have any standing access to the customer’s key vault. <br /><br />Keys are safeguarded by Microsoft Azure, using industry-standard algorithms, key lengths, and hardware security modules (HSMs).<br /><br />A key stored in Microsoft Azure Key Vault may be used to protect another key. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore provides documentation to illustrate and help deploy a protected key solution to protect the demo CHD.|



### PCI DSS Requirement 3.5.1

**3.5.1** *Additional requirement for service providers only:* Maintain a documented description of the cryptographic architecture that includes:
- Details of all algorithms, protocols, and keys used for the protection of cardholder data, including key strength and expiry date
- Description of the key usage for each key
- Inventory of any HSMs and other SCDs used for key management 

> [!NOTE] This requirement is a best practice until January 31, 2018, after which it becomes a requirement.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | **For customers using Key Vault:**<br /><br />Microsoft Azure ensures that customer key vaults are logically isolated from each other, and logically isolated from the management plane of the Key Vault service. Key Vault is designed so that Microsoft does not have any standing access to the customer’s key vault. <br /><br />Keys are safeguarded by Microsoft Azure, using industry-standard algorithms, key lengths, and hardware security modules (HSMs).<br /><br />A key stored in Microsoft Azure Key Vault may be used to protect another key. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore provides documentation to illustrate and help deploy a protected key solution to protect the demo CHD.|



### PCI DSS Requirement 3.5.2

**3.5.2** Restrict access to cryptographic
keys to the fewest number of custodians
necessary.


**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | **For customers using Key Vault:**<br /><br />Key Vault supports granular access policies, that allow a Key Vault owner to grant access to specific functionality to perform specific operations to specific entities. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Contoso Webstore key management is isolated to one user account (admin##@contosowebstore.com).|



### PCI DSS Requirement 3.5.3

**3.5.3** Store secret and private keys used to encrypt/decrypt cardholder data in one (or more) of the following forms at all times:
- Encrypted with a key-encrypting key that is at least as strong as the data-encrypting key, and that is stored separately from the data-encrypting key
- Within a secure cryptographic device (such as a hardware (host) security module (HSM) or PTS-approved point-of-interaction device)
- As at least two full-length key components or key shares, in accordance with an industry- accepted method 

> [!NOTE] It is not required that public keys be
stored in one of these forms.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | **For customers using Key Vault:**<br /><br />Keys are stored in the specific key vaults identified by the customer.<br /><br />Key Vault can be accessed simultaneously and globally by multiple applications, which reduces the need to copy a key and store in multiple locations. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore uses Azure Key Vault for all key management. For more information, see [PCI Guidance - Encryption](payment-processing-blueprint.md#encryption-and-secrets-management).|



### PCI DSS Requirement 3.5.4

**3.5.4** Store cryptographic keys in the
fewest possible locations.


**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | **For customers using Key Vault:**<br /><br />Keys are stored in the specific key vaults identified by the customer. <br /><br />Key Vault can be accessed simultaneously and globally by multiple applications, which reduces the need to copy a key and store in multiple locations. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore uses Azure Key Vault for all key management.For more information, see [PCI Guidance - Encryption](payment-processing-blueprint.md#encryption-and-secrets-management).|



## PCI DSS Requirement 3.6

**3.6** Fully document and implement all key-management processes and procedures for cryptographic keys used for encryption of cardholder data, including the following. 

> [!NOTE] Numerous industry standards for key management are available from various resources including NIST, which can be found at http://csrc.nist.gov.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore uses Azure Key Vault for all key management. For more information, see [PCI Guidance - Encryption](payment-processing-blueprint.md#encryption-and-secrets-management).|



### PCI DSS Requirement 3.6.1

**3.6.1** Generation of strong cryptographic keys

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | **For customers using Key Vault:** <br /><br />When generating keys in Key Vault, Azure is responsible for generating keys per the customer's specifications. Keys are generated using a HSM. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore uses Azure Key Vault for all key management. For more information, see [PCI Guidance - Encryption](payment-processing-blueprint.md#encryption-and-secrets-management).|



### PCI DSS Requirement 3.6.2

**3.6.2** Secure cryptographic key distribution

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | **For customers using Key Vault:**<br /><br />The bring your own key (BYOK) tool encapsulates the customer key, and targets a specific security vault which is tied to a specific Azure subscription. The key can only be imported to the defined subscription’s key vault, in the specified region. This process uses the encryption procedures provided by the hardware manufacturer. Customers receive a notification that the transfer was successful. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore uses Azure Key Vault for all key management. For more information, see [PCI Guidance - Encryption](payment-processing-blueprint.md#encryption-and-secrets-management).|



### PCI DSS Requirement 3.6.3

**3.6.3** Secure cryptographic key storage

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | **For customers using Key Vault:**<br /><br />Keys are stored in the HSMs, and are secured using the hardware manufacturer’s cryptographic security. The metadata on keys is stored in Azure Storage in an encrypted state, which is unique to each key vault. <br /><br /> |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore uses Azure Key Vault for all key management. For more information, see [PCI Guidance - Encryption](payment-processing-blueprint.md#encryption-and-secrets-management).|



### PCI DSS Requirement 3.6.4

**3.6.4** Cryptographic key changes for keys that have reached the end of their cryptoperiod (for example, after a defined period of time has passed and/or after a certain amount of cipher-text has been produced by a given key), as defined by the associated application vendor or key owner, and based on industry best practices and guidelines (for example, NIST Special Publication 800-57).

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | **For customers using Key Vault:**<br /><br />Key Vault supports functionality to update or roll keys, which is defined by the customer. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore uses Azure Key Vault for all key management. For more information, see [PCI Guidance - Encryption](payment-processing-blueprint.md#encryption-and-secrets-management).|



### PCI DSS Requirement 3.6.5

**3.6.5** Retirement or replacement (for example, archiving, destruction, and/or revocation) of keys as deemed necessary when the integrity of the key has been weakened (for example, departure of an employee with knowledge of a clear-text key component), or keys are suspected of being compromised. 

> [!NOTE] If retired or replaced cryptographic keys need to be retained, these keys must be securely archived (for example, by using a key-encryption key). Archived cryptographic keys should only be used for decryption/verification purposes.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | **For customers using Key Vault:**<br /><br />Key Vault supports functionality to retire or replace, which is defined by the customer. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore uses Azure Key Vault for all key management. For more information, see [PCI Guidance - Encryption](payment-processing-blueprint.md#encryption-and-secrets-management).|



### PCI DSS Requirement 3.6.6

**3.6.6** If manual clear-text cryptographic key-management operations are used, these operations must be managed using split knowledge and dual control. 

> [!NOTE] Examples of manual key-management operations include, but are not limited to: key generation, transmission, loading, storage, and destruction.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore uses Azure Key Vault for all key management. For more information, see [PCI Guidance - Encryption](payment-processing-blueprint.md#encryption-and-secrets-management).|



### PCI DSS Requirement 3.6.7

**3.6.7** Prevention of unauthorized substitution of cryptographic keys.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | **For customers using Key Vault:**<br /><br />Key Vaults are logically separated, and do not support cross-directory authorization. As a result, unauthorized substitution is prevented. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore uses Azure Key Vault for all key management. For more information, see [PCI Guidance - Encryption](payment-processing-blueprint.md#encryption-and-secrets-management).|



### PCI DSS Requirement 3.6.8

**3.6.8** Requirement for cryptographic key custodians to formally acknowledge that they understand and accept their key-custodian responsibilities.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Contoso Webstore key management is isolated to one user account (admin##@contosowebstore.com).|



## PCI DSS Requirement 3.7

**3.7** Ensure that security policies and operational procedures for protecting stored cardholder data are documented, in use, and known to all affected parties.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore uses Azure Key Vault for all key management. For more information, see [PCI Guidance - Encryption](payment-processing-blueprint.md#encryption-and-secrets-management).|




