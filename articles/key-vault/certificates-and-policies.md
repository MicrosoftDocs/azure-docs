---
ms.assetid: 63a42254-f2ea-4beb-9aff-d23341006538
title: Azure Key Vault certificates and policies | Microsoft Docs
ms.service: key-vault
author: BrucePerlerMS
ms.author: bruceper
manager: mbaldwin
ms.date: 06/14/2017
---
# Azure Key Vault certificates and policies

A certificate and policy are the two primary resources that comprise a Key Vault certificate. A policy may be used for multiple certificates and contains important information about how a certificate behaves.

Following are a list of the tasks with each certificates and certificate policies.

## Tasks

### Certificate operations

 The Azure Key Vault REST API supports the following operations on certificates.  

-   [Create a certificate ](xref:keyvault.createcertificate)
-   [Import a certificate](xref:keyvault.importcertificate)  
-   [List versions of a certificate](xref:keyvault.getcertificateversions)  
-   [List certificates](xref:keyvault.getcertificates)  
-   [Get a certificate](xref:keyvault.getcertificate)  
-   [Delete a certificate](xref:keyvault.deletecertificate)  
-   [Update a certificate](xref:keyvault.updatecertificate)  
-   [Merge a certificate](xref:keyvault.mergecertificate)

### Certificate management operations

These REST operations are for the management of certificate operations associated with a Key Vault certificate.

-   [Delete certificate operation](xref:keyvault.deletecertificateoperation)
-   [Get certificate operation](xref:keyvault.getcertificateoperation)
-   [Update certificate operation](xref:keyvault.updatecertificateoperation)

For usage detail and examples, see [Monitor and manage certificate creation](https://docs.microsoft.com/rest/api/keyvault/create-certificate-scenarios).

### Certificate policy operations

 The following operations are available on a certificate policy:  

-   [Get a certificate policy](xref:keyvault.getcertificatepolicy)  
-   [Update a certificate policy](xref:keyvault.updatecertificatepolicy)

### Soft-delete operations

The soft-delete feature supports these operations for deleted certificates:

- [Get deleted certificate](xref:keyvault.getdeletedcertificate)
- [Get deleted certificates](xref:keyvault.getdeletedcertificates)
- [Purge deleted certificate](xref:keyvault.purgedeletedcertificate)
- [Recover deleted certificate](xref:keyvault.recoverdeletedcertificate)

For more information on Key Vault's soft-delete feature, see [Azure Key Vault soft-delete feature overview](https://docs.microsoft.com/azure/key-vault/key-vault-ovw-soft-delete).

## Certificate and policy resource details

Certificates and their supporting policies are complex resources with the following elements.

### Certificate resource

A certificate resource is composed of the following elements:

|Element Name|Type|Description|  
|------------------|----------|-----------------|  
|Id|String|Versioned external id of the Key Vault certificate.|  
|Kid|String|Versioned external id of the key associated with the Key Vault certificate|  
|Sid|String|Versioned external id of secret associated with the Key Vault certificate|  
|x5t|String|Readonly. The "x5t" (X.509 Certificate SHA-1 Thumbprint) member is a base64 url encoded SHA-1 thumbprint (a.k.a. digest) of the DER encoding of an X.509 certificate [RFC5280].|  
|Cer|String|Readonly. X509 public certificate in base64|  
|Attributes||Complex type containing attributes associated with the certificate object.|  
|Attributes.Enabled|Boolean|Default is true. Specifies whether the certificate is enabled for non-management operations (for example, export).|  
|Attributes.Nbf|IntDate|Read-only field for client. Nbf date of x509 certificate. The x509 certificate’s not before is used to fill this nbf value.|  
|Attributes.Exp|IntDate|Read-only field for client. Exp date of x509 certificate. The x509 certificate’s expiry  is used to fill this exp value.|  
|Attributes.Created|IntDate|Read-only field for the client. The date when certificate object was created.|  
|Attributes.Updated|IntDate|Read-only field for the client. The date when certificate object was last updated.|  
|Tags|Complex type|user provided set of key value pairs associated with certificate object|  

### Policy resource  

A policy resource is used to aggregate several complex types used by a Key Vault certificate. A policy may be referenced by more than one Key Vault certificate.

|Element Name|Type|Description|  
|------------------|----------|-----------------|  
|Id|String|Identity of the certificate policy|  
|x509_props||Complex type containing *subjectname*, subject alternate names etc. used for create a csr.|  
|key_props||Complex type containing kty, key_length, exportable, and reuse_key fields. These fields are used to generate a key.|  
|secret_props||Complex type containing secret properties such as content type used for generating a secret.|  
|lifetime_actions||Complex type containing lifetime actions. Each lifetime action contains<br /><br /> Trigger – specified via days before expiry or lifetime span percentage<br /><br /> Action – specifying action type – EmailContacts or AutoRenew.|  
|Issuer||Information about the x509 certificate issuer.|  
|attributes||Complex type containing attributes associated with the policy|  

 #### D509 props  

 Some of these fields are required on create as specified. On import the values are parsed from imported x509 certificate. CA is an abbreviation for certificate authority.  

|Element Name|Type|Description|  
|------------------|----------|-----------------|  
|Subject|String|X500 Distinguished Name. If this value is absent, then “sans” must not be absent on create.|  
|Sans||Complex type group for subject alternate names. If this value is absent, then “subject” must not be absent on create.<br /><br /> emails - array - Array of emails addresses<br /><br /> dns_names - array - X500 Distinguished Names.<br /><br /> upns - array - Array of user principal names|  
|Ekus|Array|(optional) Enhanced key usage values to put in the csr. If not specified, ServerAuthEku = "1.3.6.1.5.5.7.3.1" and  ClientAuthEku = "1.3.6.1.5.5.7.3.2" are put by default at create (not import). Can be an empty array.|  
|key_usage|Array|(optional) Possible values: digitalSignature nonRepudiation keyEncipherment dataEncipherment keyAgreement keyCertSign cRLSign encipherOnly decipherOnly Can be an empty array. (Optional). Defaults to [digitalSignature, keyEncipherment] on create (not import)|  
|basic_contraints|Complex type|Complex type for basic constraints. Optional. Defaults to values for an end entity certificate on create (not import)<br /><br /> CA: boolean - (optional) indicates if the x509 cert is a CA cert path_len_contraint: number (int) - (optional) number of allowed children if x509 cert is CA cert.|  
|validity_months|number (int)|Expected validity of certificate in months. Optional. Default is 12 on create. On import takes the value from imported certificate.|  

 #### Key props 
Elements of a policy's key.

|Element Name|Type|Description|  
|------------------|----------|-----------------|  
|kty|String|Key Type. Supported values = RSA or RSA-HSM (optional). Default to RSA|  
|key_len|number (int)|Key length. Only supported value is 2048 for now. (optional) Default value is 2048|  
|exportable|Boolean|Specifies if private key is exportable. This value must be false with kty = RSA-HSM. (optional). Defaults to true when kty is RSA and false for RSA-HSM|  
|reuse_key|Boolean|Specifies if to reuse key from the current Key Vault certificate when create a new one.<br /><br /> This value is ignored when creating Key Vault certificate for the first time, or importing a certificate.<br /><br /> Default value is false.|  

#### Secret props
 Elements of a policy's secret.

|Element Name|Type|Description|  
|------------------|----------|-----------------|  
|contentType|string|MIME type for X509 certificate representation. Supported values are application/x-pkcs12, application/x-pem-file|  

#### lifetime_actions

 `Lifetime_actions` is an array of `LifetimeAction` types.

#### LifetimeAction

  LifetimeAction contains Action and Trigger information of the policy.

|Element Name|Type|Description|  
|------------------|----------|-----------------|  
|Action|Complex type| Reference to the type of action.|  
|Trigger|Complex type| Reference to the type of trigger.|  

 **Action**  
  Specifies the action to take when the associated trigger happens.

|Element Name|Type|Description|  
|------------------|----------|-----------------|  
|action_type|string|One of "EmailContacts" or "AutoRenew"|  

 **Trigger**  
 Specifies the type of event to trigger an Action on.

|Element Name|Type|Description|  
|------------------|----------|-----------------|  
|lifetime_percentage|number (int)|% of a certificate's lifetime on which to trigger. Value should be between 1 and 99 (inclusive).|  
|days_before_expiry|number (int)|Days before expiry.|  

 Trigger is a union of lifetime_percentage and dbe so, only one or the other is allowed.  

 #### Issuer

 Information about the certificate issuer provider.

|Element Name|Type|Description|  
|------------------|----------|-----------------|  
|name|String|Possible values are "Unknown", "Self" or {IssuerName}. Default value is "Unknown" which represents an out of band issuer. "Self" is for a self-signed issuance of x509 certificate.<br /><br /> IssuerName is name of the object created using an partner issuers provider created as /certificates/issuers/{issuerName}|  
|cty|String|Certificate type that should be supplied to the issuer provider. This field is optional. The allowed values depend on the issuer provider. The following values are allowed with specified providers<br /><br /> DigiCert: OV-SSL, EV-SSL (defaults to OV-SSL if nothing is specified)<br /><br /> GlobalSign: OV-SSL, EV-SSL (defaults to OV-SSL if nothing is specified)|  

#### Attributes

 Additional elements of a policy resource.

|Element Name|Type|Description|  
|------------------|----------|-----------------|  
|Enabled|Boolean|Default is true. Specifies whether the policy is enabled or disabled. Disabling a policy disables the lifetime management on the Key Vault certificate|  
|Created|IntDate|Read-only field for the client. This contains the date when the policy was created.|  
|Updated|IntDate|Read-only field for the client. This contains the date when the policy was last updated.|  



## See Also
- [About keys, secrets and certificates](about-keys--secrets-and-certificates.md)
