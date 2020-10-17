---
title: About keys - Azure Key Vault
description: Overview of Azure Key Vault REST interface and developer details for keys.
services: key-vault
author: amitbapat
manager: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: keys
ms.topic: overview
ms.date: 09/15/2020
ms.author: ambapat
---

# About keys

Azure Key Vault provides two types of resources to store and manage cryptographic keys:

|Resource type|Key protection methods|Data-plane endpoint base URL|
|--|--|--|
| **Vaults** | Software-protected<br/><br/>and<br/><br/>HSM-protected (with Premium SKU)</li></ul> | https://{vault-name}.vault.azure.net |
| **Managed HSM pools** | HSM-protected | https://{hsm-name}.managedhsm.azure.net |
||||

- **Vaults** - Vaults provide a low-cost, easy to deploy, multi-tenant, zone-resilient (where available), highly available key management solution suitable for most common cloud application scenarios.
- **Managed HSMs** - Managed HSM provides single-tenant, zone-resilient (where available), highly available HSMs to store and manage your cryptographic keys. Most suitable for applications and usage scenarios that handle high value keys. Also helps to meet most stringent security, compliance, and regulatory requirements. 

> [!NOTE]
> Vaults also allow you to store and manage several types of objects like secrets, certificates and storage account keys, in addition to cryptographic keys.

Cryptographic keys in Key Vault are represented as JSON Web Key [JWK] objects. The JavaScript Object Notation (JSON) and JavaScript Object Signing and Encryption (JOSE) specifications are:

-   [JSON Web Key (JWK)](https://tools.ietf.org/html/draft-ietf-jose-json-web-key)  
-   [JSON Web Encryption (JWE)](http://tools.ietf.org/html/draft-ietf-jose-json-web-encryption)  
-   [JSON Web Algorithms (JWA)](http://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms)  
-   [JSON Web Signature (JWS)](https://tools.ietf.org/html/draft-ietf-jose-json-web-signature) 

The base JWK/JWA specifications are also extended to enable key types unique to the Azure Key Vault and Managed HSM implementations. 

HSM-protected keys (also referred to as HSM-keys) are processed in an HSM (Hardware Security Module) and always remain HSM protection boundary. 

- Vaults use **FIPS 140-2 Level 2** validated HSMs to protect HSM-keys in shared HSM backend infrastructure. 
- Managed HSM pools uses **FIPS 140-2 Level 3** validated HSM modules to protect your keys. Each HSM pool is an isolated single-tenant instance with it's own [security domain](../managed-hsm/security-domain.md) providing complete cryptographic isolation from all other HSM pools sharing the same hardware infrastructure.

These keys are protected in single-tenant HSM-pools. You can import an RSA, EC, and symmetric key, in soft form or by exporting from a supported HSM device. You can also generate keys in HSM pools. When you import HSM keys using the method described in the [BYOK (bring your own key) specification](../keys/byok-specification.md), it enables secure transportation key material into Managed HSM pools. 

For more information on geographical boundaries, see [Microsoft Azure Trust Center](https://azure.microsoft.com/support/trust-center/privacy/)

## Key types, protection methods and algorithms

Key Vault supports RSA, EC and symmetric keys. 

### HSM-protected keys

|Key type|Vaults (Premium SKU only)|Managed HSM pools|
|--|--|--|--|
**EC-HSM**: Elliptic Curve key|FIPS 140-2 Level 2 HSM|FIPS 140-2 Level 3 HSM
**RSA-HSM**: RSA key|FIPS 140-2 Level 2 HSM|FIPS 140-2 Level 3 HSM
**oct-HSM**: Symmetric|Not supported|FIPS 140-2 Level 3 HSM
||||

### Software-protected keys

|Key type|Vaults|Managed HSM pools|
|--|--|--|--|
**RSA**: "Software-protected" RSA key|FIPS 140-2 Level 1|Not supported
**EC**: "Software-protected" Elliptic Curve key|FIPS 140-2 Level 1|Not supported
||||

### Supported algorithms

|Key types/sizes/curves| Encrypt/Decrypt<br>(Wrap/Unwrap) | Sign/Verify | 
| --- | --- | --- |
|EC-P256, EC-P256K, EC-P384, EC-521|NA|ES256<br>ES256K<br>ES384<br>ES512|
|RSA 2K, 3K, 4K| RSA1_5<br>RSA-OAEP<br>RSA-OAEP-256|PS256<br>PS384<br>PS512<br>RS256<br>RS384<br>RS512<br>RSNULL| 
|AES 128-bit, 256-bit| AES-KW<br>AES-GCM<br>AES-CBC| NA| 
|||

###  EC algorithms
 The following algorithm identifiers are supported with EC-HSM keys

#### Curve Types

-   **P-256** - The NIST curve P-256, defined at [DSS FIPS PUB 186-4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.186-4.pdf).
-   **P-256K** - The SEC curve SECP256K1, defined at [SEC 2: Recommended Elliptic Curve Domain Parameters](https://www.secg.org/sec2-v2.pdf).
-   **P-384** - The NIST curve P-384, defined at [DSS FIPS PUB 186-4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.186-4.pdf).
-   **P-521** - The NIST curve P-521, defined at [DSS FIPS PUB 186-4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.186-4.pdf).

#### SIGN/VERIFY

-   **ES256** - ECDSA for SHA-256 digests and keys created with curve P-256. This algorithm is described at [RFC7518](https://tools.ietf.org/html/rfc7518).
-   **ES256K** - ECDSA for SHA-256 digests and keys created with curve P-256K. This algorithm is pending standardization.
-   **ES384** - ECDSA for SHA-384 digests and keys created with curve P-384. This algorithm is described at [RFC7518](https://tools.ietf.org/html/rfc7518).
-   **ES512** - ECDSA for SHA-512 digests and keys created with curve P-521. This algorithm is described at [RFC7518](https://tools.ietf.org/html/rfc7518).

###  RSA algorithms  
 The following algorithm identifiers are supported with RSA and RSA-HSM keys  

#### WRAPKEY/UNWRAPKEY, ENCRYPT/DECRYPT

-   **RSA1_5** - RSAES-PKCS1-V1_5 [RFC3447] key encryption  
-   **RSA-OAEP** - RSAES using Optimal Asymmetric Encryption Padding (OAEP) [RFC3447], with the default parameters specified by RFC 3447 in Section A.2.1. Those default parameters are using a hash function of SHA-1 and a mask generation function of MGF1 with SHA-1.  
-  **RSA-OAEP-256** – RSAES using Optimal Asymmetric Encryption Padding with a hash function of SHA-256 and a mask generation function of MGF1 with SHA-256

#### SIGN/VERIFY

-   **PS256** - RSASSA-PSS using SHA-256 and MGF1 with SHA-256, as described in [RFC7518](https://tools.ietf.org/html/rfc7518).
-   **PS384** - RSASSA-PSS using SHA-384 and MGF1 with SHA-384, as described in [RFC7518](https://tools.ietf.org/html/rfc7518).
-   **PS512** - RSASSA-PSS using SHA-512 and MGF1 with SHA-512, as described in [RFC7518](https://tools.ietf.org/html/rfc7518).
-   **RS256** - RSASSA-PKCS-v1_5 using SHA-256. The application supplied digest value must be computed using SHA-256 and must be 32 bytes in length.  
-   **RS384** - RSASSA-PKCS-v1_5 using SHA-384. The application supplied digest value must be computed using SHA-384 and must be 48 bytes in length.  
-   **RS512** - RSASSA-PKCS-v1_5 using SHA-512. The application supplied digest value must be computed using SHA-512 and must be 64 bytes in length.  
-   **RSNULL** - See [RFC2437](https://tools.ietf.org/html/rfc2437), a specialized use-case to enable certain TLS scenarios.  

###  Symmetric key algorithms
- **AES-KW** - AES Key Wrap ([RFC3394](https://tools.ietf.org/html/rfc3394)).
- **AES-GCM** - AES encryption in Galois Counter Mode ([NIST SP800-38d](https://csrc.nist.gov/publications/sp800))
- **AES-CBC** - AES encryption in Cipher Block Chaining Mode ([NIST SP800-38a](https://csrc.nist.gov/publications/sp800))

> [!NOTE] 
> Current AES-GCM implementation and the corresponding APIs are experimental. The implementation and the APIs may change substantially in the future iterations. 

##  Key operations

Managed HSM supports the following operations on key objects:  

-   **Create**: Allows a client to create a key in Key Vault. The value of the key is generated by Key Vault and stored, and isn't released to the client. Asymmetric keys may be created in Key Vault.  
-   **Import**: Allows a client to import an existing key to Key Vault. Asymmetric keys may be imported to Key Vault using a number of different packaging methods within a JWK construct. 
-   **Update**: Allows a client with sufficient permissions to modify the metadata (key attributes) associated with a key previously stored within Key Vault.  
-   **Delete**: Allows a client with sufficient permissions to delete a key from Key Vault.  
-   **List**: Allows a client to list all keys in a given Key Vault.  
-   **List versions**: Allows a client to list all versions of a given key in a given Key Vault.  
-   **Get**: Allows a client to retrieve the public parts of a given key in a Key Vault.  
-   **Backup**: Exports a key in a protected form.  
-   **Restore**: Imports a previously backed up key.  

For more information, see [Key operations in the Key Vault REST API reference](/rest/api/keyvault).  

Once a key has been created in Key Vault, the following cryptographic operations may be performed using the key:  

-   **Sign and Verify**: Strictly, this operation is "sign hash" or "verify hash", as Key Vault doesn't support hashing of content as part of signature creation. Applications should hash the data to be signed locally, then request that Key Vault sign the hash. 
Verification of signed hashes is supported as a convenience operation for applications that may not have access to [public] key material. For best application performance, VERIFY operations should be performed locally.  
-   **Key Encryption / Wrapping**: A key stored in Key Vault may be used to protect another key, typically a symmetric content encryption key (CEK). When the key in Key Vault is asymmetric, key encryption is used. For example, RSA-OAEP and the WRAPKEY/UNWRAPKEY operations are equivalent to ENCRYPT/DECRYPT. When the key in Key Vault is symmetric, key wrapping is used. For example, AES-KW. The WRAPKEY operation is supported as a convenience for applications that may not have access to [public] key material. For best application performance, WRAPKEY operations should be performed locally.  
-   **Encrypt and Decrypt**: A key stored in Key Vault may be used to encrypt or decrypt a single block of data. The size of the block is determined by the key type and selected encryption algorithm. The Encrypt operation is provided for convenience, for applications that may not have access to [public] key material. For best application performance, ENCRYPT operations should be performed locally.  

While WRAPKEY/UNWRAPKEY using asymmetric keys may seem superfluous (as the operation is equivalent to ENCRYPT/DECRYPT), the use of distinct operations is important. The distinction provides semantic and authorization separation of these operations, and consistency when other key types are supported by the service.  

Key Vault doesn't support EXPORT operations. Once a key is provisioned in the system, it cannot be extracted or its key material modified. However, users of Key Vault may require their key for other use cases, such as after it has been deleted. In this case, they may use the BACKUP and RESTORE operations to export/import the key in a protected form. Keys created by the BACKUP operation are not usable outside Key Vault. Alternatively, the IMPORT operation may be used against multiple Key Vault instances.  

Users may restrict any of the cryptographic operations that Key Vault supports on a per-key basis using the key_ops property of the JWK object.  

For more information on JWK objects, see [JSON Web Key (JWK)](https://tools.ietf.org/html/draft-ietf-jose-json-web-key-41).  

## Key attributes

In addition to the key material, the following attributes may be specified. In a JSON Request, the attributes keyword and braces, '{' '}', are required even if there are no attributes specified.  

- *enabled*: boolean, optional, default is **true**. Specifies whether the key is enabled and useable for cryptographic operations. The *enabled* attribute is used in conjunction with *nbf* and *exp*. When an operation occurs between *nbf* and *exp*, it will only be permitted if *enabled* is set to **true**. Operations outside the *nbf* / *exp* window are automatically disallowed, except for certain operation types under [particular conditions](#date-time-controlled-operations).
- *nbf*: IntDate, optional, default is now. The *nbf* (not before) attribute identifies the time before which the key MUST NOT be used for cryptographic operations, except for certain operation types under [particular conditions](#date-time-controlled-operations). The processing of the *nbf* attribute requires that the current date/time MUST be after or equal to the not-before date/time listed in the *nbf* attribute. Key Vault MAY provide for some small leeway, normally no more than a few minutes, to account for clock skew. Its value MUST be a number containing an IntDate value.  
- *exp*: IntDate, optional, default is "forever". The *exp* (expiration time) attribute identifies the expiration time on or after which the key MUST NOT be used for cryptographic operation, except for certain operation types under [particular conditions](#date-time-controlled-operations). The processing of the *exp* attribute requires that the current date/time MUST be before the expiration date/time listed in the *exp* attribute. Key Vault MAY provide for some small leeway, typically no more than a few minutes, to account for clock skew. Its value MUST be a number containing an IntDate value.  

There are additional read-only attributes that are included in any response that includes key attributes:  

- *created*: IntDate, optional. The *created* attribute indicates when this version of the key was created. The value is null for keys created prior to the addition of this attribute. Its value MUST be a number containing an IntDate value.  
- *updated*: IntDate, optional. The *updated* attribute indicates when this version of the key was updated. The value is null for keys that were last updated prior to the addition of this attribute. Its value MUST be a number containing an IntDate value.  

For more information on IntDate and other data types, see [About keys, secrets, and certificates: [Data types](../general/about-keys-secrets-certificates.md#data-types).

### Date-time controlled operations

Not-yet-valid and expired keys, outside the *nbf* / *exp* window, will work for **decrypt**, **unwrap**, and **verify** operations (won't return 403, Forbidden). The rationale for using the not-yet-valid state is to allow a key to be tested before production use. The rationale for using the expired state is to allow recovery operations on data that was created when the key was valid. Also, you can disable access to a key using Key Vault policies, or by updating the *enabled* key attribute to **false**.

For more information on data types, see [Data types](../general/about-keys-secrets-certificates.md#data-types).

For more information on other possible attributes, see the [JSON Web Key (JWK)](https://tools.ietf.org/html/draft-ietf-jose-json-web-key-41).

## Key tags

You can specify additional application-specific metadata in the form of tags. Key Vault supports up to 15 tags, each of which can have a 256 character name and a 256 character value.  

> [!NOTE] 
> Tags are readable by a caller if they have the *list* or *get* permission to that key.

##  Key access control

Access control for keys managed by Key Vault is provided at the level of a Key Vault that acts as the container of keys. The access control policy for keys is distinct from the access control policy for secrets in the same Key Vault. Users may create one or more vaults to hold keys, and are required to maintain scenario appropriate segmentation and management of keys. Access control for keys is independent of access control for secrets.  

The following permissions can be granted, on a per user / service principal basis, in the keys access control entry on a vault. These permissions closely mirror the operations allowed on a key object.  Granting access to an service principal in key vault is a onetime operation, and it will remain same for all Azure subscriptions. You can use it to deploy as many certificates as you want. 

- Permissions for key management operations
  - *get*: Read the public part of a key, plus its attributes
  - *list*: List the keys or versions of a key stored in a key vault
  - *update*: Update the attributes for a key
  - *create*: Create new keys
  - *import*: Import a key to a key vault
  - *delete*: Delete the key object
  - *recover*: Recover a deleted key
  - *backup*: Back up a key in a key vault
  - *restore*: Restore a backed up key to a key vault

- Permissions for cryptographic operations
  - *decrypt*: Use the key to unprotect a sequence of bytes
  - *encrypt*: Use the key to protect an arbitrary sequence of bytes
  - *unwrapKey*: Use the key to unprotect wrapped symmetric keys
  - *wrapKey*: Use the key to protect a symmetric key
  - *verify*: Use the key to verify digests  
  - *sign*: Use the key to sign digests
    
- Permissions for privileged operations
  - *purge*: Purge (permanently delete) a deleted key

For more information on working with keys, see [Key operations in the Key Vault REST API reference](/rest/api/keyvault). For information on establishing permissions, see [Vaults - Create or Update](/rest/api/keyvault/vaults/createorupdate) and [Vaults - Update Access Policy](/rest/api/keyvault/vaults/updateaccesspolicy). 

## Next steps
- [About Key Vault](../general/overview.md)
- [About Managed HSM](../managed-hsm/overview.md)
- [About secrets](../secrets/about-secrets.md)
- [About certificates](../certificates/about-certificates.md)
- [Key Vault REST API overview](../general/about-keys-secrets-certificates.md)
- [Authentication, requests, and responses](../general/authentication-requests-and-responses.md)
- [Key Vault Developer's Guide](../general/developers-guide.md)
