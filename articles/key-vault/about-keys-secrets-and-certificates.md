---
title: About Azure Key Vault keys, secrets and certificates
description: Overview of Azure Key Vault REST interface and developer details for keys, secrets and certificates.
services: key-vault
documentationcenter:
author: BryanLa
manager: mbaldwin
tags: azure-resource-manager

ms.assetid: abd1b743-1d58-413f-afc1-d08ebf93828a
ms.service: key-vault
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 10/12/2018
ms.author: bryanla
---

# About keys, secrets, and certificates

Azure Key Vault enables Microsoft Azure applications and users to store and use several types of secret/key data:

- Cryptographic keys: Supports multiple key types and algorithms, and enables the use of Hardware Security Modules (HSM) for high value keys. 
- Secrets: Provides secure storage of secrets, such as passwords and database connection strings.
- Certificates: Supports certificates, which are built on top of keys and secrets and add an automated renewal feature.
- Azure Storage: Can manage keys of an Azure Storage account for you. Internally, Key Vault can list (sync) keys with an Azure Storage Account, and regenerate (rotate) the keys periodically. 

For more general information about Key Vault, see [What is Azure Key Vault?](/azure/key-vault/key-vault-whatis)

## Azure Key Vault

The following sections offer general information applicable across the implementation of the Key Vault service.

###  Supporting standards

The JavaScript Object Notation (JSON) and JavaScript Object Signing and Encryption (JOSE) specifications are important background information.  

-   [JSON Web Key (JWK)](http://tools.ietf.org/html/draft-ietf-jose-json-web-key)  
-   [JSON Web Encryption (JWE)](http://tools.ietf.org/html/draft-ietf-jose-json-web-encryption)  
-   [JSON Web Algorithms (JWA)](http://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms)  
-   [JSON Web Signature (JWS)](http://tools.ietf.org/html/draft-ietf-jose-json-web-signature)  

### Data types

Refer to the JOSE specifications for relevant data types for keys, encryption, and signing.  

-   **algorithm** - a supported algorithm for a key operation, for example, RSA1_5  
-   **ciphertext-value** - cipher text octets, encoded using Base64URL  
-   **digest-value** - the output of a hash algorithm, encoded using Base64URL  
-   **key-type** - one of the supported key types, for example RSA (Rivest-Shamir-Adleman).  
-   **plaintext-value** - plaintext octets, encoded using Base64URL  
-   **signature-value** - output of a signature algorithm, encoded using Base64URL  
-   **base64URL** - a Base64URL [RFC4648] encoded binary value  
-   **boolean** - either true or false  
-   **Identity** - an identity from Azure Active Directory (AAD).  
-   **IntDate** - a JSON decimal value representing the number of seconds from 1970-01-01T0:0:0Z UTC until the specified UTC date/time. See RFC3339 for details regarding date/times, in general and UTC in particular.  

###  Objects, identifiers, and versioning

Objects stored in Key Vault are versioned whenever a new instance of an object is created. Each version is assigned a unique identifier and URL. When an object is first created, it's given a unique version identifier and marked as the current version of the object. Creation of a new instance with the same object name gives the new object a unique version identifier, causing it to become the current version.  

Objects in Key Vault can be addressed using the current identifier or a version-specific identifier. For example, given a Key with the name `MasterKey`, performing operations with the current identifier causes the system to use the latest available version. Performing operations with the version-specific identifier causes the system to use that specific version of the object.  

Objects are uniquely identified within Key Vault using a URL. No two objects in the system have the same URL, regardless of geo-location. The complete URL to an object is called the Object Identifier. The URL consists of a prefix that identifies the Key Vault, object type, user provided Object Name, and an Object Version. The Object Name is case-insensitive and immutable. Identifiers that don't include the Object Version are referred to as Base Identifiers.  

For more information, see [Authentication, requests, and responses](authentication-requests-and-responses.md)

An object identifier has the following general format:  

`https://{keyvault-name}.vault.azure.net/{object-type}/{object-name}/{object-version}`  

Where:  

|||  
|-|-|  
|`keyvault-name`|The name for a key vault in the Microsoft Azure Key Vault service.<br /><br /> Key Vault names are selected by the user and are globally unique.<br /><br /> Key Vault name must be a 3-24 character string, containing only 0-9, a-z, A-Z, and -.|  
|`object-type`|The type of the object, either "keys" or "secrets".|  
|`object-name`|An `object-name` is a user provided name for and must be unique within a Key Vault. The name must be a 1-127 character string, containing only 0-9, a-z, A-Z, and -.|  
|`object-version`|An `object-version` is a system-generated, 32 character string identifier that is optionally used to address a unique version of an object.|  

## Key Vault keys

###  Keys and key types

Cryptographic keys in Key Vault are represented as JSON Web Key [JWK] objects. The base JWK/JWA specifications are also extended to enable key types unique to the Key Vault implementation. For example, importing keys using  HSM vendor-specific packaging, enables secure transportation of keys that may only be used in Key Vault HSMs.  

- **"Soft" keys**: A key processed in software by Key Vault, but is encrypted at rest using a system key that is in an HSM. Clients may import an existing RSA or EC (Elliptic Curve) key, or request that Key Vault generate one.
- **"Hard" keys**: A key processed in an HSM (Hardware Security Module). These keys are protected in one of the Key Vault HSM Security Worlds (there's one Security World per geography to maintain isolation). Clients may import an RSA or EC key, in soft form or by exporting from a compatible HSM device. Clients may also request Key Vault to generate a key. This key type adds the T attribute to the JWK obtain to carry the HSM key material.

     For more information on geographical boundaries, see [Microsoft Azure Trust Center](https://azure.microsoft.com/support/trust-center/privacy/)  

Key Vault supports RSA and Elliptic Curve keys only. 

-   **EC**: "Soft" Elliptic Curve key.
-   **EC-HSM**: "Hard" Elliptic Curve key.
-   **RSA**: "Soft" RSA key.
-   **RSA-HSM**: "Hard" RSA key.

Key Vault supports RSA keys of sizes 2048, 3072 and 4096. Key Vault supports Elliptic Curve key types P-256, P-384, P-521, and P-256K.

### Cryptographic protection

The cryptographic modules that Key Vault uses, whether HSM or software, are FIPS (Federal Information Processing Standards) validated. You don’t need to do anything special to run in FIPS mode. Keys **created** or **imported** as HSM-protected are  processed inside an HSM, validated to FIPS 140-2 Level 2 or higher. Keys **created** or **imported** as software-protected, are processed inside cryptographic modules validated to FIPS 140-2 Level 1 or higher. For more information, see [Keys and key types](#keys-and-key-types).

###  EC algorithms
 The following algorithm identifiers are supported with EC and EC-HSM keys in Key Vault. 

#### SIGN/VERIFY

-   **ES256** - ECDSA for SHA-256 digests and keys created with curve P-256. This algorithm is described at [RFC7518].
-   **ES256K** - ECDSA for SHA-256 digests and keys created with curve P-256K. This algorithm is pending standardization.
-   **ES384** - ECDSA for SHA-384 digests and keys created with curve P-384. This algorithm is described at [RFC7518].
-   **ES512** - ECDSA for SHA-512 digests and keys created with curve P-521. This algorithm is described at [RFC7518].

###  RSA algorithms  
 The following algorithm identifiers are supported with RSA and RSA-HSM keys in Key Vault.  

#### WRAPKEY/UNWRAPKEY, ENCRYPT/DECRYPT

-   **RSA1_5** - RSAES-PKCS1-V1_5 [RFC3447] key encryption  
-   **RSA-OAEP** - RSAES using Optimal Asymmetric Encryption Padding (OAEP) [RFC3447], with the default parameters specified by RFC 3447 in Section A.2.1. Those default parameters are using a hash function of SHA-1 and a mask generation function of MGF1 with SHA-1.  

#### SIGN/VERIFY

-   **RS256** - RSASSA-PKCS-v1_5 using SHA-256. The application supplied digest value must be computed using SHA-256 and must be 32 bytes in length.  
-   **RS384** - RSASSA-PKCS-v1_5 using SHA-384. The application supplied digest value must be computed using SHA-384 and must be 48 bytes in length.  
-   **RS512** - RSASSA-PKCS-v1_5 using SHA-512. The application supplied digest value must be computed using SHA-512 and must be 64 bytes in length.  
-   **RSNULL** - See [RFC2437], a specialized use-case to enable certain TLS scenarios.  

###  Key operations

Key Vault supports the following operations on key objects:  

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
Verification of signed hashes is supported as a convenience operation for applications that may not have access to [public] key material. For best application performance, verify that operations are performed locally.  
-   **Key Encryption / Wrapping**: A key stored in Key Vault may be used to protect another key, typically a symmetric content encryption key (CEK). When the key in Key Vault is asymmetric, key encryption is used. For example, RSA-OAEP and the WRAPKEY/UNWRAPKEY operations are equivalent to ENCRYPT/DECRYPT. When the key in Key Vault is symmetric, key wrapping is used. For example, AES-KW. The WRAPKEY operation is supported as a convenience for applications that may not have access to [public] key material. For best application performance, WRAPKEY operations should be performed locally.  
-   **Encrypt and Decrypt**: A key stored in Key Vault may be used to encrypt or decrypt a single block of data. The size of the block is determined by the key type and selected encryption algorithm. The Encrypt operation is provided for convenience, for applications that may not have access to [public] key material. For best application performance, encrypt operations should be performed locally.  

While WRAPKEY/UNWRAPKEY using asymmetric keys may seem superfluous (as the operation is equivalent to ENCRYPT/DECRYPT), the use of distinct operations is important. The distinction provides semantic and authorization separation of these operations, and consistency when other key types are supported by the service.  

Key Vault doesn't support EXPORT operations. Once a key is provisioned in the system, it cannot be extracted or its key material modified. However, users of Key Vault may require their key for other use cases, such as after it has been deleted. In this case, they may use the BACKUP and RESTORE operations to export/import the key in a protected form. Keys created by the BACKUP operation are not usable outside Key Vault. Alternatively, the IMPORT operation may be used against multiple Key Vault instances.  

Users may restrict any of the cryptographic operations that Key Vault supports on a per-key basis using the key_ops property of the JWK object.  

For more information on JWK objects, see [JSON Web Key (JWK)](http://tools.ietf.org/html/draft-ietf-jose-json-web-key).  

###  Key attributes

In addition to the key material, the following attributes may be specified. In a JSON Request, the attributes keyword and braces, ‘{‘ ‘}’, are required even if there are no attributes specified.  

- *enabled*: boolean, optional, default is **true**. Specifies whether the key is enabled and useable for cryptographic operations. The *enabled* attribute is used in conjunction with *nbf* and *exp*. When an operation occurs between *nbf* and *exp*, it will only be permitted if *enabled* is set to **true**. Operations outside the *nbf* / *exp* window are automatically disallowed, except for certain operation types under [particular conditions](#date-time-controlled-operations).
- *nbf*: IntDate, optional, default is now. The *nbf* (not before) attribute identifies the time before which the key MUST NOT be used for cryptographic operations, except for certain operation types under [particular conditions](#date-time-controlled-operations). The processing of the *nbf* attribute requires that the current date/time MUST be after or equal to the not-before date/time listed in the *nbf* attribute. Key Vault MAY provide for some small leeway, normally no more than a few minutes, to account for clock skew. Its value MUST be a number containing an IntDate value.  
- *exp*: IntDate, optional, default is "forever". The *exp* (expiration time) attribute identifies the expiration time on or after which the key MUST NOT be used for cryptographic operation, except for certain operation types under [particular conditions](#date-time-controlled-operations). The processing of the *exp* attribute requires that the current date/time MUST be before the expiration date/time listed in the *exp* attribute. Key Vault MAY provide for some small leeway, typically no more than a few minutes, to account for clock skew. Its value MUST be a number containing an IntDate value.  

There are additional read-only attributes that are included in any response that includes key attributes:  

- *created*: IntDate, optional. The *created* attribute indicates when this version of the key was created. The value is null for keys created prior to the addition of this attribute. Its value MUST be a number containing an IntDate value.  
- *updated*: IntDate, optional. The *updated* attribute indicates when this version of the key was updated. The value is null for keys that were last updated prior to the addition of this attribute. Its value MUST be a number containing an IntDate value.  

For more information on IntDate and other data types, see [Data types](#data-types)  

#### Date-time controlled operations

Not-yet-valid and expired keys, outside the *nbf* / *exp* window, will work for **decrypt**, **unwrap**, and **verify** operations (won’t return 403, Forbidden). The rationale for using the not-yet-valid state is to allow a key to be tested before production use. The rationale for using the expired state is to allow recovery operations on data that was created when the key was valid. Also, you can disable access to a key using Key Vault policies, or by updating the *enabled* key attribute to **false**.

For more information on data types, see [Data types](#data-types).

For more information on other possible attributes, see the [JSON Web Key (JWK)](http://tools.ietf.org/html/draft-ietf-jose-json-web-key).

### Key tags

You can specify additional application-specific metadata in the form of tags. Key Vault supports up to 15 tags, each of which can have a 256 character name and a 256 character value.  

>[!Note]
>Tags are readable by a caller if they have the *list* or *get* permission to that object type (keys, secrets, or certificates).

###  Key access control

Access control for keys managed by Key Vault is provided at the level of a Key Vault that acts as the container of keys. The access control policy for keys, is distinct from the access control policy for secrets in the same Key Vault. Users may create one or more vaults to hold keys, and are required to maintain scenario appropriate segmentation and management of keys. Access control for keys is independent of access control for secrets.  

The following permissions can be granted, on a per user / service principal basis, in the keys access control entry on a vault. These permissions closely mirror the operations allowed on a key object:  

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

## Key Vault secrets 

### Working with secrets

From a developer's perspective, Key Vault APIs accept and return secret values as strings. Internally, Key Vault stores and manages secrets as sequences of octets (8-bit bytes), with a maximum size of 25k bytes each. The Key Vault service doesn't provide semantics for secrets. It merely accepts the data, encrypts it, stores it, and returns a secret identifier ("id"). The identifier can be used to retrieve the secret at a later time.  

For highly sensitive data, clients should consider additional layers of protection for data. Encrypting data using a separate protection key prior to storage in Key Vault is one example.  

Key Vault also supports a contentType field for secrets. Clients may specify the content type of a secret to assist in interpreting the secret data when it's retrieved. The maximum length of this field is 255 characters. There are no pre-defined values. The suggested usage is as a hint for interpreting the secret data. For instance, an implementation may store both passwords and certificates as secrets, then use this field to differentiate. There are no predefined values.  

### Secret attributes

In addition to the secret data, the following attributes may be specified:  

- *exp*: IntDate, optional, default is **forever**. The *exp* (expiration time) attribute identifies the expiration time on or after which the secret data SHOULD NOT be retrieved, except in [particular situations](#date-time-controlled-operations). This field is for **informational** purposes only as it informs users of key vault service that a particular secret may not be used. Its value MUST be a number containing an IntDate value.   
- *nbf*: IntDate, optional, default is **now**. The *nbf* (not before) attribute identifies the time before which the secret data SHOULD NOT be retrieved, except in [particular situations](#date-time-controlled-operations). This field is for **informational** purposes only. Its value MUST be a number containing an IntDate value. 
- *enabled*: boolean, optional, default is **true**. This attribute specifies whether the secret data can be retrieved. The enabled attribute is used in conjunction with and *exp* when an operation occurs between and exp, it will only be permitted if enabled is set to **true**. Operations outside the *nbf* and *exp* window are automatically disallowed, except in [particular situations](#date-time-controlled-operations).  

There are additional read-only attributes that are included in any response that includes secret attributes:  

- *created*: IntDate, optional. The created attribute indicates when this version of the secret was created. This value is null for secrets created prior to the addition of this attribute. Its value must be a number containing an IntDate value.  
- *updated*: IntDate, optional. The updated attribute indicates when this version of the secret was updated. This value is null for secrets that were last updated prior to the addition of this attribute. Its value must be a number containing an IntDate value.

#### Date-time controlled operations

A secret's **get** operation will work for not-yet-valid and expired secrets, outside the *nbf* / *exp* window. Calling a secret's **get** operation, for a not-yet-valid secret, can be used for test purposes. Retrieving (**get**ting) an expired secret, can be used for recovery operations.

For more information on data types, see [Data types](#data-types).  

### Secret access control

Access Control for secrets managed in Key Vault, is provided at the level of the Key Vault that contains those secrets. The access control policy for secrets, is distinct from the access control policy for keys in the same Key Vault. Users may create one or more vaults to hold secrets, and are required to maintain scenario appropriate segmentation and management of secrets.   

The following permissions can be used, on a per-principal basis, in the secrets access control entry on a vault, and closely mirror the operations allowed on a secret object:  

- Permissions for secret management operations
  - *get*: Read a secret  
  - *list*: List the secrets or versions of a secret stored in a Key Vault  
  - *set*: Create a secret  
  - *delete*: Delete a secret  
  - *recover*: Recover a deleted secret
  - *backup*: Back up a secret in a key vault
  - *restore*: Restore a backed up secret to a key vault

- Permissions for privileged operations
  - *purge*: Purge (permanently delete) a deleted secret

For more information on working with secrets, see [Secret operations in the Key Vault REST API reference](/rest/api/keyvault). For information on establishing permissions, see [Vaults - Create or Update](/rest/api/keyvault/vaults/createorupdate) and [Vaults - Update Access Policy](/rest/api/keyvault/vaults/updateaccesspolicy). 

### Secret tags  
You can specify additional application-specific metadata in the form of tags. Key Vault supports up to 15 tags, each of which can have a 256 character name and a 256 character value.  

>[!Note]
>Tags are readable by a caller if they have the *list* or *get* permission to that object type (keys, secrets, or certificates).

## Key Vault Certificates

Key Vault certificates support provides for management of your x509 certificates and the following behaviors:  

-   Allows a certificate owner to create a certificate through a Key Vault creation process or through the import of an existing certificate. Includes both self-signed and Certificate Authority generated certificates.
-   Allows a Key Vault certificate owner to implement secure storage and management of X509 certificates without interaction with private key material.  
-   Allows a certificate owner to create a policy that directs Key Vault to manage the life-cycle of a certificate.  
-   Allows certificate owners to provide contact information for notification about life-cycle events of expiration and renewal of certificate.  
-   Supports automatic renewal with selected issuers - Key Vault partner X509 certificate providers / certificate authorities.

>[!Note]
>Non-partnered providers/authorities are also allowed but, will not support the auto renewal feature.

### Composition of a Certificate

When a Key Vault certificate is created, an addressable key and secret are also created with the same name. The Key Vault key allows key operations and the Key Vault secret allows retrieval of the certificate value as a secret. A Key Vault certificate also contains public x509 certificate metadata.  

The identifier and version of certificates is similar to that of keys and secrets. A specific version of an addressable key and secret created with the Key Vault certificate version is available in the Key Vault certificate response.
 
![Certificates are complex objects](media/azure-key-vault.png)

### Exportable or Non-exportable key

When a Key Vault certificate is created, it can be retrieved from the addressable secret with the private key in either PFX or PEM format. The policy used to create the certificate must indicate that the key is exportable. If the policy indicates non-exportable, then the private key isn't a part of the value when retrieved as a secret.  

The addressable key becomes more relevant with non-exportable KV certificates. The addressable KV key’s operations are mapped from *keyusage* field of the KV certificate policy used to create the KV Certificate.  

Two types of key are supported – *RSA* or *RSA HSM* with certificates. Exportable is only allowed with RSA, not supported by RSA HSM.  

### Certificate Attributes and Tags

In addition to certificate metadata, an addressable key and addressable secret, a Key Vault certificate also contains attributes and tags.  

#### Attributes

The certificate attributes are mirrored to attributes of the addressable key and secret created when KV certificate is created.  

A Key Vault certificate has the following attributes:  

-   *enabled*: boolean, optional, default is **true**. Can be specified to indicate if the certificate data can be retrieved as secret or operable as a key. Also used in conjunction with *nbf* and *exp* when an operation occurs between *nbf* and *exp*, and will only be permitted if enabled is set to true. Operations outside the *nbf* and *exp* window are automatically disallowed.  

There are additional read-only attributes that are included in response:

-   *created*: IntDate: indicates when this version of the certificate was created.  
-   *updated*: IntDate: indicates when this version of the certificate was updated.  
-   *exp*: IntDate:  contains the value of the expiry date of the x509 certificate.  
-   *nbf*: IntDate: contains the value of the  date of the x509 certificate.  

> [!Note] 
> If a Key Vault certificate expires, it’s addressable key and secret become inoperable.  

#### Tags

 Client specified dictionary of key value pairs, similar to tags in keys and secrets.  

 > [!Note]
> Tags are readable by a caller if they have the *list* or *get* permission to that object type (keys, secrets, or certificates).

### Certificate policy

A certificate policy contains information on how to create and manage lifecycle of a Key Vault certificate. When a certificate with private key is imported into the key vault, a default policy is created by reading the x509 certificate.  

When a Key Vault certificate is created from scratch, a policy needs to be supplied. The policy specifies how to create this Key Vault certificate version, or the next Key Vault certificate version. Once a policy has been established, it isn't required with successive create operations for future  versions. There's only one instance of a policy for all the versions of a Key Vault certificate.  

At a high level, a certificate policy contains the following information:  

-   X509 certificate properties: Contains subject name, subject alternate names, and other properties used to create an x509 certificate request.  
-   Key Properties: contains key type, key length, exportable, and reuse key fields. These fields instruct key vault on how to generate a key.  
-   Secret properties: contains secret properties such as content type of addressable secret to generate the secret value, for retrieving certificate as a secret.  
-   Lifetime Actions: contains lifetime actions for the KV Certificate. Each lifetime action contains:  

     - Trigger: specified via days before expiry or lifetime span percentage  

     - Action: specifying action type – *emailContacts* or *autoRenew*  

-   Issuer: Parameters about the certificate issuer to use to issue x509 certificates.  
-   Policy Attributes: contains attributes associated with the policy  

#### X509 to Key Vault usage mapping

The following table represents the mapping of x509 key usage policy to effective key operations of a key created as part of a Key Vault certificate creation.

|**X509 Key Usage flags**|**Key Vault key ops**|**Default behavior**|
|----------|--------|--------|
|DataEncipherment|encrypt, decrypt| N/A |
|DecipherOnly|decrypt| N/A  |
|DigitalSignature|sign, verify| Key Vault default without a usage specification at certificate creation time | 
|EncipherOnly|encrypt| N/A |
|KeyCertSign|sign, verify|N/A|
|KeyEncipherment|wrapKey, unwrapKey| Key Vault default without a usage specification at certificate creation time | 
|NonRepudiation|sign, verify| N/A |
|crlsign|sign, verify| N/A |

### Certificate Issuer

A Key Vault certificate object holds a configuration used to communicate with a selected certificate issuer provider to order x509 certificates.  

-   Key Vault partners with following certificate issuer providers for SSL certificates

|**Provider Name**|**Locations**|
|----------|--------|
|DigiCert|Supported in all key vault service locations in public cloud and Azure Government|
|GlobalSign|Supported in all key vault service locations in public cloud and Azure Government|

Before a certificate issuer can be created in a Key Vault, following prerequisite steps 1 and 2 must be successfully accomplished.  

1. Onboard to Certificate Authority (CA) Providers  

    -   An organization administrator must on-board their company (ex. Contoso) with at least one CA provider.  

2. Admin creates requester credentials for Key Vault to enroll (and renew) SSL certificates  

    -   Provides the configuration to be used to create an issuer object of the provider in the key vault  

For more information on creating Issuer objects from the Certificates portal, see the [Key Vault Certificates blog](http://aka.ms/kvcertsblog)  

Key Vault allows for creation of multiple issuer objects with different issuer provider configuration. Once an issuer object is created, its name can be referenced in one or multiple certificate policies. Referencing the issuer object instructs Key Vault to use configuration as specified in the issuer object when requesting the x509 certificate from CA provider during the certificate creation and renewal.  

Issuer objects are created in the vault and can only be used with KV certificates in the same vault.  

### Certificate contacts

Certificate contacts contain contact information to send notifications triggered by certificate lifetime events. The contacts information is shared by all the certificates in the key vault. A notification is sent to all the specified contacts for an event for any certificate in the key vault.  

If a certificate's policy is set to auto renewal, then a notification is sent on the following events.  

-   Before certificate renewal
-   After certificate renewal, stating if the certificate was successfully renewed, or if there was an error, requiring manual renewal of the certificate.  

 When a certificate policy that is set to be manually renewed (email only), a notification is sent when it’s time to renew the certificate.  

### Certificate Access Control

 Access control for certificates is managed by Key Vault, and is provided by the Key Vault that contains those certificates. The access control policy for certificates is distinct from the access control policies for keys and secrets in the same Key Vault. Users may create one or more vaults to hold certificates, to maintain scenario appropriate segmentation and management of certificates.  

 The following permissions can be used, on a per-principal basis, in the secrets access control entry on a key vault, and closely mirrors the operations allowed on a secret object:  

- Permissions for certificate management operations
  - *get*: Get the current certificate version, or any version of a certificate 
  - *list*: List the current certificates, or versions of a certificate  
  - *update*: Update a certificate
  - *create*: Create a Key Vault certificate
  - *import*: Import certificate material into a Key Vault certificate
  - *delete*: Delete a certificate, its policy, and all of its versions  
  - *recover*: Recover a deleted certificate
  - *backup*: Back up a certificate in a key vault
  - *restore*: Restore a backed-up certificate to a key vault
  - *managecontacts*: Manage Key Vault certificate contacts  
  - *manageissuers*: Manage Key Vault certificate authorities/issuers
  - *getissuers*: Get a certificate's authorities/issuers
  - *listissuers*: List a certificate's authorities/issuers  
  - *setissuers*: Create or update a Key Vault certificate's authorities/issuers  
  - *deleteissuers*: Delete a Key Vault certificate's authorities/issuers  
 
- Permissions for privileged operations
  - *purge*: Purge (permanently delete) a deleted certificate

For more information, see the [Certificate operations in the Key Vault REST API reference](/rest/api/keyvault). For information on establishing permissions, see [Vaults - Create or Update](/rest/api/keyvault/vaults/createorupdate) and [Vaults - Update Access Policy](/rest/api/keyvault/vaults/updateaccesspolicy).

## Azure Storage account key management

Key Vault can manage Azure storage account keys:

- Internally, Key Vault can list (sync) keys with an Azure storage account. 
- Key Vault regenerates (rotates) the keys periodically.
- Key values are never returned in response to caller.
- Key Vault manages keys of both storage accounts and classic storage accounts.

For more information, see [Azure Key Vault Storage Account Keys](key-vault-ovw-storage-keys.md)

### Storage account access control

The following permissions can be used when authorizing a user or application principal to perform operations on a managed storage account:  

- Permissions for managed storage account and SaS-definition operations
  - *get*: Gets information about a storage account 
  - *list*: List storage accounts managed by a Key Vault
  - *update*: Update a storage account
  - *delete*: Delete a storage account  
  - *recover*: Recover a deleted storage account
  - *backup*: Back up a storage account
  - *restore*: Restore a backed-up storage account to a Key Vault
  - *set*: Create or update a storage account
  - *regeneratekey*: Regenerate a specified key value for a storage account
  - *getsas*: Get information about a SAS definition for a storage account
  - *listsas*: List storage SAS definitions for a storage account
  - *deletesas*: Delete a SAS definition from a storage account
  - *setsas*: Create or update a new SAS definition/attributes for a storage account

- Permissions for privileged operations
  - *purge*: Purge (permanently delete) a managed storage account

For more information, see the [Storage account operations in the Key Vault REST API reference](/rest/api/keyvault). For information on establishing permissions, see [Vaults - Create or Update](/rest/api/keyvault/vaults/createorupdate) and [Vaults - Update Access Policy](/rest/api/keyvault/vaults/updateaccesspolicy).

## See Also

- [Authentication, requests, and responses](authentication-requests-and-responses.md)
- [Key Vault versions](key-vault-versions.md)
- [Key Vault Developer's Guide](/azure/key-vault/key-vault-developers-guide)
