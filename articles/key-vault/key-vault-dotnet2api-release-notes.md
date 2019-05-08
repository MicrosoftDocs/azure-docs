---
title: Key Vault .NET 2.x API Release Notes| Microsoft Docs
description: .NET developers will use this API to code for Azure Key Vault
services: key-vault
author: msmbaldwin
manager: barbkess
editor: bryanla

ms.service: key-vault
ms.topic: conceptual
ms.date: 05/02/2017
ms.author: mbaldwin

---
# Azure Key Vault .NET 2.0 - Release Notes and Migration Guide
The following information helps migrating to the 2.0 version of the Azure Key Vault library for C# and .NET.  Apps written for earlier versions need to be updating to support the latest version.  These changes are needed to fully support new and improved features, such as **Key Vault certificates**.

## Key Vault certificates

Key Vault certificates manage x509 certificates and supports the following behaviors:  

* Create certificates through a Key Vault creation process or import existing certificate. This includes both self-signed and Certificate Authority (CA) generated certificates.
* Securely store and manage x509 certificate storage without interaction using private key material.  
* Define policies that direct Key Vault to manage the certificate lifecycle.  
* Provide contact information for lifecycle events, such as expiration warnings and renewal notifications.  
* Automatically renew certificates with selected issuers (Key Vault partner X509 certificate providers and certificate authorities).* Support certificate from alternate (non-partner) provides and certificate authorities (does not support auto-renewal).  

## .NET support

* **.NET 4.0** is not supported by the 2.0 version of the Azure Key Vault .NET library
* **.NET Framework 4.5.2** is supported by the 2.0 version of the Azure Key Vault .NET library
* **.NET Standard 1.4** is supported by the 2.0 version of the Azure Key Vault .NET library

## Namespaces

* The namespace for **models** is changed from **Microsoft.Azure.KeyVault** to **Microsoft.Azure.KeyVault.Models**.
* The **Microsoft.Azure.KeyVault.Internal** namespace is dropped.
* The following Azure SDK dependencies namespaces have 

    - **Hyak.Common** is now **Microsoft.Rest**.
    - **Hyak.Common.Internals** is now **Microsoft.Rest.Serialization**.

## Type changes

* *Secret* changed to *SecretBundle*
* *Dictionary* changed to *IDictionary*
* *List<T>, string []* changed to *IList<T>*
* *NextList* changed to  *NextPageLink*

## Return types

* **KeyList** and **SecretList** now returns *IPage<T>* instead of *ListKeysResponseMessage*
* The generated **BackupKeyAsync** now returns *BackupKeyResult*, which contains *Value* (back-up blob). Previously, the method was wrapped and returned just the value.

## Exceptions

* *KeyVaultClientException* is changed to *KeyVaultErrorException*
* The service error changed from *exception.Error* to *exception.Body.Error.Message*.
* Removed additional info from the error message for **[JsonExtensionData]**.

## Constructors

* Instead of accepting an *HttpClient* as a constructor argument, the constructor only accepts *HttpClientHandler* or *DelegatingHandler[]*.

## Downloaded packages

When a client processes a Key Vault dependency, the following packages are downloaded:

### Previous package list

* `package id="Hyak.Common" version="1.0.2" targetFramework="net45"`
* `package id="Microsoft.Azure.Common" version="2.0.4" targetFramework="net45"`
* `package id="Microsoft.Azure.Common.Dependencies" version="1.0.0" targetFramework="net45"`
* `package id="Microsoft.Azure.KeyVault" version="1.0.0" targetFramework="net45"`
* `package id="Microsoft.Bcl" version="1.1.9" targetFramework="net45"`
* `package id="Microsoft.Bcl.Async" version="1.0.168" targetFramework="net45"`
* `package id="Microsoft.Bcl.Build" version="1.0.14" targetFramework="net45"`
* `package id="Microsoft.Net.Http" version="2.2.22" targetFramework="net45"`

### Current package list

* `package id="Microsoft.Azure.KeyVault" version="2.0.0-preview" targetFramework="net45"`
* `package id="Microsoft.Rest.ClientRuntime" version="2.2.0" targetFramework="net45"`
* `package id="Microsoft.Rest.ClientRuntime.Azure" version="3.2.0" targetFramework="net45"`

## Class changes

* **UnixEpoch** class has been removed.
* **Base64UrlConverter** class is renamed to **Base64UrlJsonConverter**.

## Other changes

* Support for the configuration of KV operation retry policy on transient failures has been added to this version of the API.

## Microsoft.Azure.Management.KeyVault NuGet

* For the operations that returned a *vault*, the return type was a class that contained a **Vault** property. The return type is now *Vault*.
* *PermissionsToKeys* and *PermissionsToSecrets* are now *Permissions.Keys* and *Permissions.Secrets*
* Certain return types changes apply to the control-plane as well.

## Microsoft.Azure.KeyVault.Extensions NuGet

* The package is broken up to **Microsoft.Azure.KeyVault.Extensions** and **Microsoft.Azure.KeyVault.Cryptography** for the cryptography operations.

