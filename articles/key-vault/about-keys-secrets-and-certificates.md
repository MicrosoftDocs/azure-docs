---
title: About keys, secrets and certificates
description: Overview of REST interface and KV developer details
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
ms.date: 08/14/2018
ms.author: bryanla

---

# About keys, secrets, and certificates
Azure Key Vault enables users to store and use cryptographic keys within the Microsoft Azure environment. Key Vault supports multiple key types and algorithms, and enables the use of Hardware Security Modules (HSM) for high value keys. In addition, Key Vault allows users to securely store secrets. Secrets are limited size octet objects with no specific semantics. Key Vault also supports certificates, which are built on top of keys and secrets and add an automated renewal feature.

For more general information about Azure Key Vault, see [What is Azure Key Vault?](/azure/key-vault/key-vault-whatis)

**Key Vault general details**

-   [Supporting standards](#BKMK_Standards)
-   [Data types](#BKMK_DataTypes)  
-   [Objects, identifiers and, versioning](#BKMK_ObjId)  

**About keys**

-   [Keys and key types](#BKMK_KeyTypes)  
-   [RSA algorithms](#BKMK_RSAAlgorithms)  
-   [RSA-HSM algorithms](#BKMK_RSA-HSMAlgorithms)  
-   [Cryptographic protection](#BKMK_Cryptographic)
-   [Key operations](#BKMK_KeyOperations)  
-   [Key attributes](#BKMK_KeyAttributes)  
-   [Key tags](#BKMK_Keytags)  

**About secrets** 

-   [Working with Secrets](#BKMK_WorkingWithSecrets)  
-   [Secret attributes](#BKMK_SecretAttrs)  
-   [Secret tags](#BKMK_SecretTags)  
-   [Secret Access Control](#BKMK_SecretAccessControl)  

**About certificates**

-   [Composition of a Certificate](#BKMK_CompositionOfCertificate)  
-   [Certificate Attributes and Tags](#BKMK_CertificateAttributesAndTags)  
-   [Certificate Policy](#BKMK_CertificatePolicy)  
-   [Certificate Issuer](#BKMK_CertificateIssuer)  
-   [Certificate contacts](#BKMK_CertificateContacts)  
-   [Certificate Access Control](#BKMK_CertificateAccessControl)  

--

## Key Vault general details

The following sections offer general information applicable across the implementation of the Azure Key Vault service.

###  <a name="BKMK_Standards"></a> Supporting standards

The JavaScript Object Notation (JSON) and JavaScript Object Signing and Encryption (JOSE) specifications are important background information.  

-   [JSON Web Key (JWK)](http://tools.ietf.org/html/draft-ietf-jose-json-web-key)  
-   [JSON Web Encryption (JWE)](http://tools.ietf.org/html/draft-ietf-jose-json-web-encryption)  
-   [JSON Web Algorithms (JWA)](http://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms)  
-   [JSON Web Signature (JWS)](http://tools.ietf.org/html/draft-ietf-jose-json-web-signature)  

### <a name="BKMK_DataTypes"></a> Data types

Refer to the [JOSE specifications](#BKMK_Standards) for relevant data types for keys, encryption, and signing.  

-   **algorithm** - a supported algorithm for a key operation, for example, RSA1_5  
-   **ciphertext-value** - cipher text octets, encoded using Base64URL  
-   **digest-value** - the output of a hash algorithm, encoded using Base64URL  
-   **key-type** - one of the supported key types, for example RSA.  
-   **plaintext-value** - plaintext octets, encoded using Base64URL  
-   **signature-value** - output of a signature algorithm, encoded using Base64URL  
-   **base64URL** - a Base64URL [RFC4648] encoded binary value  
-   **boolean** - either true or false  
-   **Identity** - an identity from Azure Active Directory (AAD).  
-   **IntDate** - a JSON decimal value representing the number of seconds from 1970-01-01T0:0:0Z UTC until the specified UTC date/time. See [RFC3339] for details regarding date/times in general and UTC in particular.  

###  <a name="BKMK_ObjId"></a> Objects, identifiers, and versioning

Objects stored in Azure Key Vault retain versions whenever a new instance of an object is created, and each version has a unique identifier and URL. When an object is first created, it is given a unique version identifier and is marked as the current version of the object. Creation of a new instance with the same object name gives the new object a unique version identifier and causes it to become the current version.  

Objects in Azure Key Vault can be addressed using the current identifier or a version-specific identifier. For example, given a Key with the name “MasterKey”, performing operations with the current identifier causes the system to use the latest available version. Performing operations with the version-specific identifier causes the system to use that specific version of the object.  

Objects are uniquely identified within Azure Key Vault using a URL such that no two objects in the system, regardless of geo-location, have the same URL. The complete URL to an object is called the Object Identifier and consists of a prefix portion that identifies the Key Vault, the object type, a user provided Object Name, and an Object Version. The Object Name is case-insensitive and immutable. Identifiers that do not include the Object Version are referred to as Base Identifiers.  

For more information, see [Authentication, requests, and responses](authentication-requests-and-responses.md)

An object identifier has the following general format:  

`https://{keyvault-name}.vault.azure.net/{object-type}/{object-name}/{object-version}`  

Where:  

|||  
|-|-|  
|`keyvault-name`|The name for a key vault in the Microsoft Azure Key Vault service.<br /><br /> Key Vault names are selected by the user and are globally unique.<br /><br /> Key Vault name must be a string 3-24 characters in length containing only (0-9, a-z, A-Z, and -).|  
|`object-type`|The type of the object, either “keys” or “secrets”.|  
|`object-name`|An `object-name` is a user provided name for and must be unique within a Key Vault. The name must be a string 1-127 characters in length containing only 0-9, a-z, A-Z, and -.|  
|`object-version`|An `object-version` is a system generated, 32 character string identifier that is optionally used to address a unique version of an object.|  

## Key Vault keys

###  <a name="BKMK_KeyTypes"></a> Keys and key types

Cryptographic keys in Azure Key Vault are represented as JSON Web Key [JWK] objects. The base JWK/JWA specifications are also extended to enable key types unique to the Azure Key Vault implementation, for example the import of keys to Azure Key Vault using the HSM vendor (Thales) specific packaging to enable secure transportation of keys such that they may only be used in the Azure Key Vault HSMs.  

- **"Soft" keys**: A key processed in software by Key Vault, but is encrypted at rest using a system key that is in an HSM. Clients may import an existing RSA or EC key, or request that Azure Key Vault generate one.
- **"Hard" keys**: A key processed in an HSM (Hardware Security Module). These keys are protected in one of the Azure Key Vault HSM Security Worlds (there is a Security World per geography to maintain isolation). Clients may import an RSA or EC key, either in soft form or by exporting from a compatible HSM device, or request that Azure Key Vault generate one. This key type adds the T attribute to the JWK obtain to carry the HSM key material.

     For more information on geographical boundaries, see [Microsoft Azure Trust Center](https://azure.microsoft.com/support/trust-center/privacy/)  

Azure Key Vault supports RSA and Elliptic Curve keys only; future releases may support other key types such as symmetric.

-   **EC**: "Soft" Elliptic Curve key.
-   **EC-HSM**: "Hard" Elliptic Curve key.
-   **RSA**: "Soft" RSA key.
-   **RSA-HSM**: "Hard" RSA key.

Azure Key Vault supports RSA keys of sizes 2048, 3072 and 4096, and Elliptic Curve keys of type P-256, P-384, P-521 and P-256K.

### <a name="BKMK_Cryptographic"></a> Cryptographic protection

The cryptographic modules that Azure Key Vault uses, whether HSM or software, are FIPS validated. You don’t need to do anything special to run in FIPS mode. If you **create** or **import** keys as HSM-protected, they are guaranteed to be processed inside HSMs validated to FIPS 140-2 Level 2 or higher. If you **create** or **import** keys as software-protected then they are processed inside cryptographic modules validated to FIPS 140-2 Level 1 or higher. For more information, see [Keys and key types](#BKMK_KeyTypes).

###  <a name="BKMK_ECAlgorithms"></a> EC algorithms
 The following algorithm identifiers are supported with EC and EC-HSM keys in Azure Key Vault. 

#### SIGN/VERIFY

-   **ES256** - ECDSA for SHA-256 digests and keys created with curve P-256. This algorithm is described at [RFC7518].
-   **ES256K** - ECDSA for SHA-256 digests and keys created with curve P-256K. This algorithm is pending standardization.
-   **ES384** - ECDSA for SHA-384 digests and keys created with curve P-384. This algorithm is described at [RFC7518].
-   **ES512** - ECDSA for SHA-512 digests and keys created with curve P-521. This algorithm is described at [RFC7518].

###  <a name="BKMK_RSAAlgorithms"></a> RSA algorithms  
 The following algorithm identifiers are supported with RSA and RSA-HSM keys in Azure Key Vault.  

#### WRAPKEY/UNWRAPKEY, ENCRYPT/DECRYPT

-   **RSA1_5** - RSAES-PKCS1-V1_5 [RFC3447] key encryption  
-   **RSA-OAEP** - RSAES using Optimal Asymmetric Encryption Padding (OAEP) [RFC3447], with the default parameters specified by RFC 3447 in Section A.2.1. Those default parameters are using a hash function of SHA-1 and a mask generation function of MGF1 with SHA-1.  

#### SIGN/VERIFY

-   **RS256** - RSASSA-PKCS-v1_5 using SHA-256. The application supplied digest value must be computed using SHA-256 and must be 32 bytes in length.  
-   **RS384** - RSASSA-PKCS-v1_5 using SHA-384. The application supplied digest value must be computed using SHA-384 and must be 48 bytes in length.  
-   **RS512** - RSASSA-PKCS-v1_5 using SHA-512. The application supplied digest value must be computed using SHA-512 and must be 64 bytes in length.  
-   **RSNULL** - See [RFC2437], a specialized use-case to enable certain TLS scenarios.  

###  <a name="BKMK_KeyOperations"></a> Key operations

Azure Key Vault supports the following operations on key objects:  

-   **Create**: Allows a client to create a key in Azure Key Vault. The value of the key is generated by Azure Key Vault and stored and is not released to the client. Asymmetric (and in the future, Elliptic Curve and Symmetric) keys may be created in Azure Key Vault.  
-   **Import**: Allows a client to import an existing key to Azure Key Vault. Asymmetric (and in the future, Elliptic Curve and Symmetric) keys may be imported to Azure Key Vault using a number of different packaging methods within a JWK construct.  
-   **Update**: Allows a client with sufficient permissions to modify the metadata (key attributes) associated with a key previously stored within Azure Key Vault.  
-   **Delete**: Allows a client with sufficient permissions to delete a key from Azure Key Vault.  
-   **List**: Allows a client to list all keys in a given Azure Key Vault.  
-   **List versions**: Allows a client to list all versions of a given key in a given Azure Key Vault.  
-   **Get**: Allows a client to retrieve the public parts of a given key in an Azure Key Vault.  
-   **Backup**: Exports a key in a protected form.  
-   **Restore**: Imports a previously backed up key.  

For more information, see [Key operations in the Key Vault REST API reference](/rest/api/keyvault).  

Once a key has been created in Azure Key Vault, the following cryptographic operations may be performed using the key:  

-   **Sign and Verify**: Strictly, this operation is "sign hash" or “verify hash” as Azure Key Vault does not support hashing of content as part of signature creation. Applications should hash the data to be signed locally and then request that Azure Key Vault sign the hash. 
Verification of signed hashes is supported as a convenience operation for applications that may not have access to [public] key material; we recommend that, for best application performance, verify operations are performed locally.  
-   **Key Encryption / Wrapping**: A key stored in Azure Key Vault may be used to protect another key, typically a symmetric content encryption key (CEK). When the key in Azure Key Vault is asymmetric, key encryption is used, for example RSA-OAEP and the WRAPKEY/UNWRAPKEY operations are equivalent to ENCRYPT/DECRYPT. When the key in Azure Key Vault is symmetric, key wrapping is used; for example AES-KW. The WRAPKEY operation is supported as a convenience for applications that may not have access to [public] key material; it is recommended that, for best application performance, WRAPKEY operations are performed locally.  
-   **Encrypt and Decrypt**: A key stored in Azure Key Vault may be used to encrypt or decrypt a single block of data, the size of which is determined by the key type and selected encryption algorithm. The Encrypt operation is provided for convenience for applications that may not have access to [public] key material; it is recommended that, for best application performance, encrypt operations be performed locally.  

While WRAPKEY/UNWRAPKEY using asymmetric keys may seem superfluous as the operation is equivalent to ENCRYPT/DECRYPT, the use of distinct operations is considered important to provide semantic and authorization separation of these operations and consistency when other key types are supported by the service.  

Azure Key Vault does not support EXPORT operations: once a key is provisioned in the system it cannot be extracted or its key material modified.  However, users of Azure Key Vault who may require their key for other use cases, or after it has been deleted in Azure Key Vault, may use the BACKUP and RESTORE operations to export/import the key in a protected form. Keys created by the BACKUP operation are not usable outside Azure Key Vault. Alternatively, the IMPORT operation may be used against multiple Azure Key Vault instances.  

Users may restrict any of the cryptographic operations that Azure Key Vault supports on a per-key basis using the key_ops property of the JWK object.  

For more information on JWK objects, see [JSON Web Key (JWK)](http://tools.ietf.org/html/draft-ietf-jose-json-web-key).  

###  <a name="BKMK_KeyAttributes"></a> Key attributes

In addition to the key material, the following attributes may be specified. In a JSON Request, the attributes keyword and braces, ‘{‘ ‘}’, are required even if there are no attributes specified.  

- *enabled*: boolean, optional, default is **true**. Specifies whether the key is enabled and useable for cryptographic operations. The *enabled* attribute is used in conjunction with *nbf* and *exp*. When an operation occurs between *nbf* and *exp*, it will only be permitted if *enabled* is set to **true**. Operations outside the *nbf* / *exp* window are automatically disallowed, except for certain operation types under [particular conditions](#BKMK_key-date-time-ctrld-ops).
- *nbf*: IntDate, optional, default is now. The *nbf* (not before) attribute identifies the time before which the key MUST NOT be used for cryptographic operations, except for certain operation types under [particular conditions](#BKMK_key-date-time-ctrld-ops). The processing of the *nbf* attribute requires that the current date/time MUST be after or equal to the not-before date/time listed in the *nbf* attribute. Azure Key Vault MAY provide for some small leeway, usually no more than a few minutes, to account for clock skew. Its value MUST be a number containing an IntDate value.  
- *exp*: IntDate, optional, default is "forever". The *exp* (expiration time) attribute identifies the expiration time on or after which the key MUST NOT be used for cryptographic operation, except for certain operation types under [particular conditions](#BKMK_key-date-time-ctrld-ops). The processing of the *exp* attribute requires that the current date/time MUST be before the expiration date/time listed in the *exp* attribute. Azure Key Vault MAY provide for some small leeway, usually no more than a few minutes, to account for clock skew. Its value MUST be a number containing an IntDate value.  

There are additional read-only attributes that are included in any response that includes key attributes:  

- *created*: IntDate, optional. The *created* attribute indicates when this version of the key was created. This value is null for keys created prior to the addition of this attribute. Its value MUST be a number containing an IntDate value.  
- *updated*: IntDate, optional. The *updated* attribute indicates when this version of the key was updated. This value is null for keys that were last updated prior to the addition of this attribute. Its value MUST be a number containing an IntDate value.  

For more information on IntDate and other data types, see [Data types](#BKMK_DataTypes)  

#### <a name="BKMK_key-date-time-ctrld-ops"></a> Date-time controlled operations

Not-yet-valid and expired keys, those outside the *nbf* / *exp* window, will work for **decrypt**, **unwrap** and **verify** operations (won’t return 403, Forbidden). The rationale for using the not-yet-valid state is to allow a key to be tested before production use. The rationale for using the expired state is to allow recovery operations on data that was created when the key was valid. Also, you can disable access to a key using Key Vault policies, or by updating the *enabled* key attribute to **false**.

For more information on data types see, [Data types](#BKMK_DataTypes).

For further information on other possible attributes, see the [JSON Web Key (JWK)](http://tools.ietf.org/html/draft-ietf-jose-json-web-key).

### <a name="BKMK_Keytags"></a> Key tags

You can specify additional application-specific metadata in the form of tags. Azure Key Vault supports up to 15 tags, each of which can have a 256 character name and a 256 character value.  

>[!Note]
>Tags are readable by a caller if they have the *list* or *get* permission to that object type; keys, secrets, or certificates.

###  <a name="BKMK_KeyAccessControl"></a> Key access control

Access control for keys managed by Key Vault is provided at the level of a Key Vault that acts as the container of keys. There is an access control policy for keys that is distinct from the access control policy for secrets in the same Key Vault. Users may create one or more vaults to hold keys and are required to maintain scenario appropriate segmentation and management of keys. Access control for keys is independent of access control for secrets.  

The following permissions can be granted, on a per user / service principal basis, in the keys access control entry on a vault. These permissions closely mirror the operations allowed on a key object:  

-   *create*: Create new keys
-   *get*: Read the public part of a key, plus its attributes
-   *list*: List the keys or versions of a key stored in a key vault
-   *update*: Update the attributes for a key
-   *delete*: Delete the key object
-   *sign*: Use the key to sign digests
-   *verify*: Use the key to verify digests
-   *wrapKey*: Use the key to protect a symmetric key
-   *unwrapKey*: Use the key to unprotect wrapped symmetric keys
-   *encrypt*: Use the key to protect an arbitrary sequence of bytes
-   *decrypt*: Use the key to unprotect a sequence of bytes
-   *import*: Import a key to a key vault
-   *backup*: Backup a key in a key vault
-   *restore*: Restore a backed up key to a key vault
-   *all*: All permissions

## Key Vault secrets 

###  <a name="BKMK_WorkingWithSecrets"></a> Working with secrets

Secrets in Azure Key Vault are octet sequences with a maximum size of 25k bytes each. The Azure Key Vault service does not provide any semantics for secrets; it merely accepts the data, encrypts and stores it, returning a secret identifier, “id”, that may be used to retrieve the secret at a later time.  

For highly sensitive data, clients should consider additional layers of protection for data that is stored in Azure Key Vault; for example by pre-encrypting data using a separate protection key.  

Azure Key Vault also supports a contentType field for secrets. Clients may specify the content type, “contentType”, of a secret to assist in interpreting the secret data when it is retrieved. The maximum length of this field is 255 characters. There are no pre-defined values. The suggested usage is as a hint for interpreting the secret data. For instance, an implementation may store both passwords and certificates as secrets then use this field to indicate which. There are no predefined values.  

###  <a name="BKMK_SecretAttrs"></a> Secret attributes

In addition to the secret data, the following attributes may be specified:  

- *exp*: IntDate, optional, default is **forever**. The *exp* (expiration time) attribute identifies the expiration time on or after which the secret data SHOULD NOT be retrieved, except in [particular situations](#BKMK_secret-date-time-ctrld-ops). This field is for **informational** purposes only as it informs users of key vault service that a particular secret may not be used. Its value MUST be a number containing an IntDate value.   
- *nbf*: IntDate, optional, default is **now**. The *nbf* (not before) attribute identifies the time before which the secret data SHOULD NOT be retrieved, except in [particular situations](#BKMK_secret-date-time-ctrld-ops). This field is for **informational** purposes only. Its value MUST be a number containing an IntDate value. 
- *enabled*: boolean, optional, default is **true**. This attribute specifies whether or not the secret data can be retrieved. The enabled attribute is used in conjunction with and *exp* when an operation occurs between and exp, it will only be permitted if enabled is set to **true**. Operations outside the *nbf* and *exp* window are automatically disallowed, except in [particular situations](#BKMK_secret-date-time-ctrld-ops).  

There are additional read-only attributes that are included in any response that includes secret attributes:  

- *created*: IntDate, optional. The created attribute indicates when this version of the secret was created. This value is null for secrets created prior to the addition of this attribute. Its value must be a number containing an IntDate value.  
- *updated*: IntDate, optional. The updated attribute indicates when this version of the secret was updated. This value is null for secrets that were last updated prior to the addition of this attribute. Its value must be a number containing an IntDate value.

#### <a name="BKMK_secret-date-time-ctrld-ops"></a> Date-time controlled operations

A secret's **get** operation will work for not-yet-valid and expired secrets, outside the *nbf* / *exp* window. Calling a secret's **get** operation, for a not-yet-valid secret, can be used for test purposes. Retrieving (**get**ing) an expired secret, can be used for recovery operations.

For more information on data types see, [Data types](#BKMK_DataTypes).  

###  <a name="BKMK_SecretAccessControl"></a> Secret Access Control

Access Control for secrets managed in Azure Key Vault is provided at the level of a Key Vault that acts as the container of those secrets. There is an access control policy for secrets that is distinct from the access control policy for keys in the same Key Vault. Users may create one or more vaults to hold secrets and are required to maintain scenario appropriate segmentation and management of secrets. Access controls for secrets are independent of access control for Keys.  

The following permissions can be used, on a per-principal basis, in the secrets access control entry on a vault, and closely mirror the operations allowed on a secret object:  

-   *set*: Create new secrets  
-   *get*: Read a secret  
-   *list*: List the secrets or versions of a secret stored in a Key Vault  
-   *delete*: Delete the secret  
-   *all*: All permissions  

For more information on working with secrets, see [Secret operations in the Key Vault REST API reference](/rest/api/keyvault).  

###  <a name="BKMK_SecretTags"></a> Secret tags  
You can specify additional application-specific metadata in the form of tags. Azure Key Vault supports up to 15 tags, each of which can have a 256 character name and a 256 character value.  

>[!Note]
>Tags are readable by a caller if they have the *list* or *get* permission to that object type; keys, secrets, or certificates.

## Key Vault Certificates

Key Vault certificates support provides for management of your x509 certificates and the following behaviors:  

-   Allows a certificate owner to create a certificate through a Key Vault creation process or through the import of an existing certificate. This includes both self-signed and Certificate Authority generated certificates.
-   Allows a Key Vault certificate owner to implement secure storage and management of X509 certificates without interaction with private key material.  
-   Allows a certificate owner to create a policy that directs Key Vault to manage the life-cycle of a certificate.  
-   Allows certificate owners to provide contact information for notification about life-cycle events of expiration and renewal of certificate.  
-   Supports automatic renewal with selected issuers - Key Vault partner X509 certificate providers / certificate authorities.

>[!Note]
>Non-partnered providers/authorities are also allowed but, will not support the auto renewal feature.

###  <a name="BKMK_CompositionOfCertificate"></a> Composition of a Certificate

When a Key Vault certificate is created, an addressable key and secret are also created with the same name. The Key Vault key allows key operations and the Key Vault secret allows retrieval of the certificate value as a secret. A Key Vault certificate also contains public x509 certificate metadata.  

The identifier and version of certificates is similar to that of keys and secrets. A specific version of an addressable key and secret created with the Key Vault certificate version is available in the Key Vault certificate response.
 
![Cetificates are complex objects](media/azure-key-vault.png)

###  <a name="BKMK_CertificateExportableOrNonExportableKey"></a> Exportable or Non-exportable key

When a Key Vault  certificate is created, it can be retrieved from the addressable secret with the private key in either PFX or PEM format if the policy used to create the certificate indicated that the key is exportable. If the policy used to create the Key Vault certificate indicated the key to be non-exportable, then the private key is not a part of the value when retrieved as a secret.  

The addressable key becomes more relevant with non-exportable KV certificates. The addressable KV key’s operations are mapped from *keyusage* field of the KV certificate policy used to create the KV Certificate.  

Two types of key are supported – *RSA* or *RSA HSM* with certificates. Exportable is only allowed with RSA, not supported by RSA HSM.  

###  <a name="BKMK_CertificateAttributesAndTags"></a> Certificate Attributes and Tags

In addition to certificate metadata, an addressable key and, an addressable secret, a Key Vault certificate also contains attributes and tags.  

#### Attributes

The certificate attributes are mirrored to attributes of the addressable key and secret created when KV certificate is created.  

A Key Vault certificate has the following attributes:  

-   *enabled*: boolean, optional, default is **true**. This attribute can be specified to indicate if the certificate data can be retrieved as secret or operable as a key. This is used in conjunction with *nbf* and *exp* when an operation occurs between *nbf* and *exp*, it will only be permitted if enabled is set to true. Operations outside the *nbf* and *exp* window are automatically disallowed.  

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
> Tags are readable by a caller if they have the *list* or *get* permission to that object type; keys, secrets, or certificates.

###  <a name="BKMK_CertificatePolicy"></a> Certificate policy

A certificate policy contains information on how to create and manage lifecycle of a KV certificate. When a certificate with private key is imported into the key vault, a default policy is created by reading the x509 certificate.  

When a KV certificate is created from scratch, a policy needs to be supplied to Key Vault to inform it on how to create this KV certificate version or the next KV certificate version. Once a policy has been established, it is not required with successive create operations to create next KV certificate versions.  

There is only one instance of a policy for all the versions of a KV certificate.  

At a high level, a certificate policy contains the following:  

-   X509 certificate properties: Contains subject name, subject alternate names etc. used to create an x509 certificate request.  
-   Key Properties: contains key type, key length, exportable and reuse key fields. These fields instruct key vault on how to generate a key.  
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

###  <a name="BKMK_CertificateIssuer"></a> Certificate Issuer

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

###  <a name="BKMK_CertificateContacts"></a> Certificate contacts

Certificate contacts contain contact information to send notifications triggered by certificate lifetime events. The contacts information is shared by all the certificates in the key vault. A notification is sent to all the specified contacts for an event for any certificate in the key vault.  

If a certificate's policy is set to auto-renewal, then a notification is sent on the following events.  

-   Before certificate renewal
-   After certificate renewal, stating if the certificate was successfully renewed, or if there was an error, requiring manual renewal of the certificate.  

 If a certificate's policy is set to be manually renewed (email only), then a notification is sent when it’s time to renew the certificate.  

###  <a name="BKMK_CertificateAccessControl"></a> Certificate Access Control

 Access control for certificates is managed by Key Vault and is provided at the level of a Key Vault that acts as the container of those certificates. There is an access control policy for certificates that is distinct from the access control policy for keys and secrets in the same Key Vault. Users may create one or more vaults to hold certificates and are required to maintain scenario appropriate segmentation and management of certificates.  

 The following permissions can be used, on a per-principal basis, in the secrets access control entry on a key vault, and closely mirrors the operations allowed on a secret object:  

-   *get*: allows get of the current certificate version or any version of a certificate 
-   *list*: allows list of the current certificates or versions of a certificate  
-   *delete*: allows delete of a certificate, its policy and all of its versions  
-   *create*: allows create of a Key Vault certificate.  
-   *import*: allows import of certificate material into a Key Vault Certificate.  
-   *update*: allows update of a certificate.  
-   *managecontacts*: allows management of Key Vault certificate contacts  
-   *getissuers*: allows get of a certificate's issuers  
-   *listissuers*: allows list of certificate's issuers  
-   *setissuers*: allows create or update of Key Vault certificate issuers  
-   *deleteissuers*: allows delete of Key Vault certificate issuers  
-   *all*: grants all permissions  

For more information, see the [Certificate operations in the Key Vault REST API reference](/rest/api/keyvault). 

## See Also

- [Authentication, requests, and responses](authentication-requests-and-responses.md)
- [Key Vault versions](key-vault-versions.md)
- [Key Vault Developer's Guide](/azure/key-vault/key-vault-developers-guide)
