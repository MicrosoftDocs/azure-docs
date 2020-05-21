---
title: About Azure Key Vault Certificates - Azure Key Vault
description: Overview of Azure Key Vault REST interface and certificates.
services: key-vault
author: msmbaldwin
manager: rkarlin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: certificates
ms.topic: overview
ms.date: 09/04/2019
ms.author: mbaldwin
---

# About Azure Key Vault certificates

Key Vault certificates support provides for management of your x509 certificates and the following behaviors:  

-   Allows a certificate owner to create a certificate through a Key Vault creation process or through the import of an existing certificate. Includes both self-signed and Certificate Authority generated certificates.
-   Allows a Key Vault certificate owner to implement secure storage and management of X509 certificates without interaction with private key material.  
-   Allows a certificate owner to create a policy that directs Key Vault to manage the life-cycle of a certificate.  
-   Allows certificate owners to provide contact information for notification about life-cycle events of expiration and renewal of certificate.  
-   Supports automatic renewal with selected issuers - Key Vault partner X509 certificate providers / certificate authorities.

>[!Note]
>Non-partnered providers/authorities are also allowed but, will not support the auto renewal feature.

## Composition of a Certificate

When a Key Vault certificate is created, an addressable key and secret are also created with the same name. The Key Vault key allows key operations and the Key Vault secret allows retrieval of the certificate value as a secret. A Key Vault certificate also contains public x509 certificate metadata.  

The identifier and version of certificates is similar to that of keys and secrets. A specific version of an addressable key and secret created with the Key Vault certificate version is available in the Key Vault certificate response.
 
![Certificates are complex objects](../media/azure-key-vault.png)

## Exportable or Non-exportable key

When a Key Vault certificate is created, it can be retrieved from the addressable secret with the private key in either PFX or PEM format. The policy used to create the certificate must indicate that the key is exportable. If the policy indicates non-exportable, then the private key isn't a part of the value when retrieved as a secret.  

The addressable key becomes more relevant with non-exportable KV certificates. The addressable KV key's operations are mapped from *keyusage* field of the KV certificate policy used to create the KV Certificate.  

Two types of key are supported – *RSA* or *RSA HSM* with certificates. Exportable is only allowed with RSA, not supported by RSA HSM.  

## Certificate Attributes and Tags

In addition to certificate metadata, an addressable key and addressable secret, a Key Vault certificate also contains attributes and tags.  

### Attributes

The certificate attributes are mirrored to attributes of the addressable key and secret created when KV certificate is created.  

A Key Vault certificate has the following attributes:  

-   *enabled*: boolean, optional, default is **true**. Can be specified to indicate if the certificate data can be retrieved as secret or operable as a key. Also used in conjunction with *nbf* and *exp* when an operation occurs between *nbf* and *exp*, and will only be permitted if enabled is set to true. Operations outside the *nbf* and *exp* window are automatically disallowed.  

There are additional read-only attributes that are included in response:

-   *created*: IntDate: indicates when this version of the certificate was created.  
-   *updated*: IntDate: indicates when this version of the certificate was updated.  
-   *exp*: IntDate:  contains the value of the expiry date of the x509 certificate.  
-   *nbf*: IntDate: contains the value of the  date of the x509 certificate.  

> [!Note] 
> If a Key Vault certificate expires, it's addressable key and secret become inoperable.  

### Tags

 Client specified dictionary of key value pairs, similar to tags in keys and secrets.  

 > [!Note]
> Tags are readable by a caller if they have the *list* or *get* permission to that object type (keys, secrets, or certificates).

## Certificate policy

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

### X509 to Key Vault usage mapping

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

## Certificate Issuer

A Key Vault certificate object holds a configuration used to communicate with a selected certificate issuer provider to order x509 certificates.  

-   Key Vault partners with following certificate issuer providers for TLS/SSL certificates

|**Provider Name**|**Locations**|
|----------|--------|
|DigiCert|Supported in all key vault service locations in public cloud and Azure Government|
|GlobalSign|Supported in all key vault service locations in public cloud and Azure Government|

Before a certificate issuer can be created in a Key Vault, following prerequisite steps 1 and 2 must be successfully accomplished.  

1. Onboard to Certificate Authority (CA) Providers  

    -   An organization administrator must on-board their company (ex. Contoso) with at least one CA provider.  

2. Admin creates requester credentials for Key Vault to enroll (and renew) TLS/SSL certificates  

    -   Provides the configuration to be used to create an issuer object of the provider in the key vault  

For more information on creating Issuer objects from the Certificates portal, see the [Key Vault Certificates blog](https://aka.ms/kvcertsblog)  

Key Vault allows for creation of multiple issuer objects with different issuer provider configuration. Once an issuer object is created, its name can be referenced in one or multiple certificate policies. Referencing the issuer object instructs Key Vault to use configuration as specified in the issuer object when requesting the x509 certificate from CA provider during the certificate creation and renewal.  

Issuer objects are created in the vault and can only be used with KV certificates in the same vault.  

## Certificate contacts

Certificate contacts contain contact information to send notifications triggered by certificate lifetime events. The contacts information is shared by all the certificates in the key vault. A notification is sent to all the specified contacts for an event for any certificate in the key vault.  

If a certificate's policy is set to auto renewal, then a notification is sent on the following events.  

- Before certificate renewal
- After certificate renewal, stating if the certificate was successfully renewed, or if there was an error, requiring manual renewal of the certificate.  

  When a certificate policy that is set to be manually renewed (email only), a notification is sent when it's time to renew the certificate.  

## Certificate Access Control

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

## Next steps

- [About Key Vault](../general/overview.md)
- [About keys, secrets, and certificates](../general/about-keys-secrets-certificates.md)
- [About keys](../keys/about-keys.md)
- [About secrets](../secrets/about-secrets.md)
- [Authentication, requests, and responses](../general/authentication-requests-and-responses.md)
- [Key Vault Developer's Guide](../general/developers-guide.md)