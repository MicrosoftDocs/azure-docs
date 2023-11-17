---
title: About Azure Key Vault certificates
description: Get an overview of the Azure Key Vault REST interface and certificates.
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: certificates
ms.topic: overview
ms.date: 01/04/2023
ms.author: mbaldwin
---

# About Azure Key Vault certificates

Azure Key Vault certificate support provides for management of your X.509 certificates and the following behaviors:  

- Allows a certificate owner to create a certificate through a key vault creation process or through the import of an existing certificate. Imported certificates include both self-signed certificates and certificates that are generated from a certificate authority (CA).
- Allows a Key Vault certificate owner to implement secure storage and management of X.509 certificates without interacting with private key material.  
- Allows a certificate owner to create a policy that directs Key Vault to manage the lifecycle of a certificate.  
- Allows a certificate owner to provide contact information for notifications about the lifecycle events of expiration and renewal.  
- Supports automatic renewal with selected issuers: Key Vault partner X.509 certificate providers and CAs.

  > [!Note]
  > Non-partnered providers and authorities are also allowed but don't support automatic renewal.

For details on certificate creation, see [Certificate creation methods](create-certificate.md).

## Composition of a certificate

When a Key Vault certificate is created, an addressable key and secret are also created with the same name. The Key Vault key allows key operations, and the Key Vault secret allows retrieval of the certificate value as a secret. A Key Vault certificate also contains public X.509 certificate metadata.  

The identifier and version of certificates are similar to those of keys and secrets. A specific version of an addressable key and secret created with the Key Vault certificate version is available in the Key Vault certificate response.
 
![Diagram that shows the role of certificates in a key vault.](../media/azure-key-vault.png)

## Exportable or non-exportable key

When a Key Vault certificate is created, it can be retrieved from the addressable secret with the private key in either PFX or PEM format. The policy that's used to create the certificate must indicate that the key is exportable. If the policy indicates that the key is non-exportable, then the private key isn't a part of the value when it's retrieved as a secret.  

The addressable key becomes more relevant with non-exportable Key Vault certificates. The addressable Key Vault key's operations are mapped from the `keyusage` field of the Key Vault certificate policy that's used to create the Key Vault certificate.  

The following table lists supported key types. 

|Key type|About|Security|
|--|--|--|
|**RSA**| Software-protected RSA key|FIPS 140-2 Level 1|
|**RSA-HSM**| HSM-protected RSA key (Premium SKU only)|FIPS 140-2 Level 2 HSM|
|**EC**| Software-protected elliptic curve key|FIPS 140-2 Level 1|
|**EC-HSM**| HSM-protected elliptic curve key (Premium SKU only)|FIPS 140-2 Level 2 HSM|
|**oct**| Software-protected octet key| FIPS 140-2 Level 1|


Exportable keys are allowed only with RSA and EC. HSM keys are non-exportable. For more information about key types, see [Create certificates](/rest/api/keyvault/certificates/create-certificate/create-certificate#jsonwebkeytype).

## Certificate attributes and tags

In addition to certificate metadata, an addressable key, and an addressable secret, a Key Vault certificate contains attributes and tags.  

### Attributes

The certificate attributes are mirrored to attributes of the addressable key and secret that are created when the Key Vault certificate is created.  

A Key Vault certificate has the following attribute:  

- `enabled`: This Boolean attribute is optional. Default is `true`. It can be specified to indicate if the certificate data can be retrieved as a secret or operable as a key. 

  This attribute is also used with `nbf` and `exp` when an operation occurs between `nbf` and `exp`, but only if `enabled` is set to `true`. Operations outside the `nbf` and `exp` window are automatically disallowed.  

A response includes these additional read-only attributes:

- `created`: `IntDate` indicates when this version of the certificate was created.  
- `updated`: `IntDate` indicates when this version of the certificate was updated.  
- `exp`: `IntDate` contains the value of the expiration date of the X.509 certificate.  
- `nbf`: `IntDate` contains the value of the "not before" date of the X.509 certificate.  

> [!Note] 
> If a Key Vault certificate expires it can still be retrieved, but certificate may become inoperable in scenarios like TLS protection where expiration of certificate is validated.  

### Tags

Tags for certificates are a client-specified dictionary of key/value pairs, much like tags in keys and secrets.  

> [!Note]
> A caller can read tags if they have the *list* or *get* permission to that object type (keys, secrets, or certificates).

## Certificate policy

A certificate policy contains information on how to create and manage the lifecycle of a Key Vault certificate. When a certificate with private key is imported into the key vault, the Key Vault service creates a default policy by reading the X.509 certificate.  

When a Key Vault certificate is created from scratch, a policy needs to be supplied. The policy specifies how to create this Key Vault certificate version or the next Key Vault certificate version. After a policy has been established, it isn't required with successive create operations for future versions. There's only one instance of a policy for all the versions of a Key Vault certificate.  

At a high level, a certificate policy contains the following information:   

- X.509 certificate properties, which include subject name, subject alternate names, and other properties that are used to create an X.509 certificate request.  
- Key properties, which include key type, key length, exportable, and `ReuseKeyOnRenewal` fields. These fields instruct Key Vault on how to generate a key. 
    
  [Supported key types](/rest/api/keyvault/certificates/create-certificate/create-certificate#jsonwebkeytype) are RSA, RSA-HSM, EC, EC-HSM, and oct.
- Secret properties, such as the content type of an addressable secret to generate the secret value, for retrieving a certificate as a secret.  
- Lifetime actions for the Key Vault certificate. Each lifetime action contains:  

  - Trigger: Specified as days before expiration or lifetime span percentage.  
  - Action: `emailContacts` or `autoRenew`.  
- Certificates validation type: organization validated (OV-SSL) and extended validation (EV-SSL) for DigiCert and GlobalSign issuers.
- Parameters about the certificate issuer to use for issuing X.509 certificates.  
- Attributes associated with the policy. 

For more information, see [Set-AzKeyVaultCertificatePolicy](/powershell/module/az.keyvault/set-azkeyvaultcertificatepolicy).

### Mapping X.509 usage to key operations

The following table represents the mapping of X.509 key usage policies to effective key operations of a key that's created as part of Key Vault certificate creation.

|X.509 key usage flags|Key Vault key operations|Default behavior|
|----------|--------|--------|
|`DataEncipherment`|`encrypt`, `decrypt`| Not applicable |
|`DecipherOnly`|`decrypt`| Not applicable |
|`DigitalSignature`|`sign`, `verify`| Key Vault default without a usage specification at certificate creation time |
|`EncipherOnly`|`encrypt`| Not applicable |
|`KeyCertSign`|`sign`, `verify`|Not applicable|
|`KeyEncipherment`|`wrapKey`, `unwrapKey`| Key Vault default without a usage specification at certificate creation time |
|`NonRepudiation`|`sign`, `verify`| Not applicable |
|`crlsign`|`sign`, `verify`| Not applicable |

## Certificate issuer

A Key Vault certificate object holds a configuration that's used to communicate with a selected certificate issuer provider to order X.509 certificates.  

Key Vault partners with the following certificate issuer providers for TLS/SSL certificates.

|Provider name|Locations|
|----------|--------|
|DigiCert|Supported in all Key Vault service locations in public cloud and Azure Government|
|GlobalSign|Supported in all Key Vault service locations in public cloud and Azure Government|

Before a certificate issuer can be created in a key vault, an administrator must take the following prerequisite steps:

1. Onboard the organization with at least one CA provider.  

1. Create requester credentials for Key Vault to enroll (and renew) TLS/SSL certificates. This step provides the configuration for creating an issuer object of the provider in the key vault.  

For more information on creating issuer objects from the certificate portal, see the [Key Vault Team Blog](/archive/blogs/kv/manage-certificates-via-azure-key-vault).  

Key Vault allows for the creation of multiple issuer objects with different issuer provider configurations. After an issuer object is created, its name can be referenced in one or multiple certificate policies. Referencing the issuer object instructs Key Vault to use the configuration as specified in the issuer object when it's requesting the X.509 certificate from the CA provider during certificate creation and renewal.  

Issuer objects are created in the vault. They can be used only with Key Vault certificates in the same vault.  

>[!Note]
>Publicly trusted certificates are sent to CAs and certificate transparency (CT) logs outside the Azure boundary during enrollment. They're covered by the GDPR policies of those entities.

## Certificate contacts

Certificate contacts contain contact information for sending notifications triggered by certificate lifetime events. All the certificates in the key vault share the contact information. 

A notification is sent to all the specified contacts for an event for any certificate in the key vault. For information on how to set a certificate contact, see [Renew your Azure Key Vault certificates](overview-renew-certificate.md#steps-to-set-certificate-notifications).  

## Certificate access control

Key Vault manages access control for certificates. The key vault that contains those certificates provides access control. The access control policy for certificates is distinct from the access control policies for keys and secrets in the same key vault. 

Users can create one or more vaults to hold certificates, to maintain scenario-appropriate segmentation and management of certificates. For more information, see [Certificate access control](certificate-access-control.md).

## Certificate use cases

### Secure communication and authentication

TLS certificates can help encrypt communications over the internet and establish the identity of websites. This encryption makes the entry point and mode of communication more secure. Additionally, a chained certificate that's signed by a public CA can help verify that the entities holding the certificates are legitimate. 

As an example, here are some use cases of using certificates to secure communication and enable authentication:

* **Intranet/internet websites**: Protect access to your intranet site and ensure encrypted data transfer over the internet through TLS certificates.
* **IoT and networking devices**: Protect and secure your devices by using certificates for authentication and communication.
* **Cloud/multicloud**: Secure cloud-based applications on-premises, cross-cloud, or in your cloud provider's tenant.

## Next steps
- [Certificate creation methods](create-certificate.md)
- [About Key Vault](../general/overview.md)
- [About keys, secrets, and certificates](../general/about-keys-secrets-certificates.md)
- [About keys](../keys/about-keys.md)
- [About secrets](../secrets/about-secrets.md)
- [Key management in Azure](../../security/fundamentals/key-management.md)
- [Authentication, requests, and responses](../general/authentication-requests-and-responses.md)
- [Key Vault developer's guide](../general/developers-guide.md)
