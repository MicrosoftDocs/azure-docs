---
title: Key Vault .NET 2.x API Release Notes| Microsoft Docs
description: .NET developers will use this API to code for Azure Key Vault
services: key-vault
author: BrucePerlerMS
manager: mbaldwin
editor: bruceper

ms.assetid: 1cccf21b-5be9-4a49-8145-483b695124ba
ms.service: key-vault
ms.devlang: CSharp
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/28/2017
ms.author: bruceper

---
# Azure Key Vault .NET 2.0 - Release Notes and Migration Guide
The following notes and guidance are for developers working with Azure Key Vault .NET / C# library. In the transition from the 1.0 version to the 2.0 version, a number of updates have been made that will require migration work in your code in order for you to benefit from the functional improvements and feature additions such as **Key Vault certificates** support.

## Key Vault certificates

Key Vault certificates support provides for management of your x509 certificates and the following behaviors:  

* Allows a certificate owner to create a certificate through a Key Vault creation process or through the import of an existing certificate. This includes both self-signed and Certificate Authority generated certificates.
* Allows a Key Vault certificate owner to implement secure storage and management of X509 certificates without interaction with private key material.  
* Allows a certificate owner to create a policy that directs Key Vault to manage the life-cycle of a certificate.  
* Allows certificate owners to provide contact information for notification about life-cycle events of expiration and renewal of certificate.  
* Supports automatic renewal with selected issuers - Key Vault partner X509 certificate providers / certificate authorities.
  
  * NOTE - Non-partnered providers/authorities are also allowed but, will not support the auto renewal feature.

## .NET support

* **.NET 4.0** is not supported by the 2.0 version of the Azure Key Vault .NET/C# library
* **.NET Core** is supported by the 2.0 version of the Azure Key Vault .NET/C# library

## Namespaces

* The namespace for **models** is changed from **Microsoft.Azure.KeyVault** to **Microsoft.Azure.KeyVault.Models**.
* The **Microsoft.Azure.KeyVault.Internal** namespace is dropped.
* The Azure SDK dependencies namespace are changed from **Hyak.Common** and **Hyak.Common.Internals** to **Microsoft.Rest** and **Microsoft.Rest.Serialization**

## Type changes

* *Secret* changed to *SecretBundle*
* *Dictionary* changed to *IDictionary*
* *List<T>, string []* changed to *IList<T>*
* *NextList* changed to  *NextPageLink*

## Return types

* **KeyList** and **SecretList** will return *IPage<T>* instead of *ListKeysResponseMessage*
* The generated **BackupKeyAsync** will return *BackupKeyResult* which contains *Value* (back-up blob). Before the method was wrapped and returning only the value.

## Exceptions

* *KeyVaultClientException* is changed to *KeyVaultErrorException*
* The service error is changed from *exception.Error* to *exception.Body.Error.Message*.
* Removed additional info from the error message for **[JsonExtensionData]**.

## Constructors

* Instead of accepting an *HttpClient* as a constructor argument, the constructor only accepts *HttpClientHandler* or *DelegatingHandler[]*.

## Downloaded packages

When a client is processing a  dependency on Key Vault the following were downloaded

### Previous package list

* package id="Hyak.Common" version="1.0.2" targetFramework="net45"
* package id="Microsoft.Azure.Common" version="2.0.4" targetFramework="net45"
* package id="Microsoft.Azure.Common.Dependencies" version="1.0.0" targetFramework="net45"
* package id="Microsoft.Azure.KeyVault" version="1.0.0" targetFramework="net45"
* package id="Microsoft.Bcl" version="1.1.9" targetFramework="net45"
* package id="Microsoft.Bcl.Async" version="1.0.168" targetFramework="net45"
* package id="Microsoft.Bcl.Build" version="1.0.14" targetFramework="net45"
* package id="Microsoft.Net.Http" version="2.2.22" targetFramework="net45"

### Current package list

* package id="Microsoft.Azure.KeyVault" version="2.0.0-preview" targetFramework="net45"
* package id="Microsoft.Rest.ClientRuntime" version="2.2.0" targetFramework="net45"
* package id="Microsoft.Rest.ClientRuntime.Azure" version="3.2.0" targetFramework="net45"

## Class changes

* **UnixEpoch** class has been removed
* **Base64UrlConverter** class is renamed to **Base64UrlJsonConverter**

## Other changes

* Support for the configuration of KV operation retry policy on transient failures has been added to this version of the API.

## Microsoft.Azure.Management.KeyVault NuGet

* For the operations that returned a *vault*, the return type was a class that contained a Vault property. The return type is now *Vault*.
* *PermissionsToKeys* and *PermissionsToSecrets* are now *Permissions.Keys* and *Permissions.Secrets*
* Some of the return types changes apply to the control-plane as well.

## Microsoft.Azure.KeyVault.Extensions NuGet

* The package is broken up to **Microsoft.Azure.KeyVault.Extensions** and **Microsoft.Azure.KeyVault.Cryptography** for the cryptography operations.

