<properties
   pageTitle="Key Vault .NET 2.x API Release Notes| Microsoft Azure"
   description=".NET developers will use this API to code for Azure Key Vault"
   services="key-vault"
   documentationCenter=""
   authors="BrucePerlerMS"
   manager="mbaldwin"
   editor="bruceper" />
<tags
   ms.service="key-vault"
   ms.devlang="CSharp"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="10/06/2016"
   ms.author="bruceper" />

# Azure Key Vault .NET 2.0 - Release Notes and Migration Guide

The following notes and guidance are for developers working with the Azure Key Vault .NET / C# API. In the change from the 1.0 version to the 2.x version, a number of updates have been made that will require migration work in your code in order for you to benefit from the functional improvements and feature additions such as certificates support.

- .NET support
  - **Net 4.0** is not supported by the 2.0 version of the Azure Key Vault .NET/C# library

- Namespaces
   - The namespace for **models** is changed from **Microsoft.Azure.KeyVault** to **Microsoft.Azure.KeyVault.Models**.
   - The **Microsoft.Azure.KeyVault.Internal** namespace is dropped.
   - The Azure SDK dependencies namespace are changed from **Hyak.Common** and **Hyak.Common.Internals** to **Microsoft.Rest** and **Microsoft.Rest.Serialization**
   - Some old dependencies have been dropped

- **UnixEpoch** class has been removed
- **Base64UrlConverter** class is renamed to **Base64UrlJsonConverter**

- Type changes
    - *Secret* changed to *SecretBundle*
    - *Dictionary* changed to *IDictionary*
    - *List<T>, string []* changed to *IList<T>*
    - *NextList* changed to  *NextPageLink*

- Return types
    - **KeyList** and **SecretList** will return *IPage<T>* instead of *ListKeysResponseMessage*
    - The generated **BackupKeyAsync** will return *BackupKeyResult* which contains *Value* (back-up blob). Before the method was wrapped and returning only the value.

- Exceptions
    - *KeyVaultClientException* is changed to *KeyVaultErrorException*
    - The service error is changed from *exception.Error* to *exception.Body.Error.Message*.
    - Removed additional info from the error message for **[JsonExtensionData]**.

- Constructors
    - Instead of accepting an *HttpClient* as a constructor argument, the constructor only accepts *HttpClientHandler* or *DelegatingHandler[]*.



## Downloaded packages  
When a client was getting a dependency to Key Vault the following were downloaded
### Previous package list downloaded
    - package id="Hyak.Common" version="1.0.2" targetFramework="net45"
    - package id="Microsoft.Azure.Common" version="2.0.4" targetFramework="net45"
    - package id="Microsoft.Azure.Common.Dependencies" version="1.0.0" targetFramework="net45"
    - package id="Microsoft.Azure.KeyVault" version="1.0.0" targetFramework="net45"
    - package id="Microsoft.Bcl" version="1.1.9" targetFramework="net45"
    - package id="Microsoft.Bcl.Async" version="1.0.168" targetFramework="net45"
    - package id="Microsoft.Bcl.Build" version="1.0.14" targetFramework="net45"
    - package id="Microsoft.Net.Http" version="2.2.22" targetFramework="net45"

### Current package list downloaded
    - package id="Microsoft.Azure.KeyVault" version="2.0.0-preview" targetFramework="net45"
    - package id="Microsoft.Rest.ClientRuntime" version="2.2.0" targetFramework="net45"
    - package id="Microsoft.Rest.ClientRuntime.Azure" version="3.2.0" targetFramework="net45"




## Additional APIs and functionality introduced
  - Sync versions of the async methods have been added
  - Retry logic has been added
  - Since *KeyAttributes* and *SecretAttributes* were sharing the same properties, these are now changed to use derived properties from a class Attribute that has the common properties.


## Microsoft.Azure.Management.KeyVault NuGet
  - For the operations that returned a *vault*, the return type was a class that contained a Vault property. The return type is now *Vault*.
  - *PermissionsToKeys* and *PermissionsToSecrets* are now *Permissions.Keys* and *Permissions.Secrets*
  - Some of the return types changes apply to the control-plane as well.

## Microsoft.Azure.KeyVault.Extensions NuGet
- The package is broken up to **Microsoft.Azure.KeyVault.Extensions** and **Microsoft.Azure.KeyVault.Cryptography** for the cryptography operations.
