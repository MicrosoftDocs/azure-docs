---
title: Set up an encryption cert on Windows clusters
description: Learn how to set up an encryption certificate and encrypt secrets on Windows clusters.

ms.topic: conceptual
ms.date: 01/04/2019
---
# Set up an encryption certificate and encrypt secrets on Windows clusters
This article shows how to set up an encryption certificate and use it to encrypt secrets on Windows clusters. For Linux clusters, see [Set up an encryption certificate and encrypt secrets on Linux clusters.][secret-management-linux-specific-link]

[Azure Key Vault][key-vault-get-started] is used here as a safe storage location for certificates and as a way to get certificates installed on Service Fabric clusters in Azure. If you are not deploying to Azure, you do not need to use Key Vault to manage secrets in Service Fabric applications. However, *using* secrets in an application is cloud platform-agnostic to allow applications to be deployed to a cluster hosted anywhere. 

## Obtain a data encipherment certificate
A data encipherment certificate is used strictly for encryption and decryption of [parameters][parameters-link] in a service's Settings.xml and [environment variables][environment-variables-link] in a service's ServiceManifest.xml. It is not used for authentication or signing of cipher text. The certificate must meet the following requirements:

* The certificate must contain a private key.
* The certificate must be created for key exchange, exportable to a Personal Information Exchange (.pfx) file.
* The certificate key usage must include Data Encipherment (10), and should not include Server Authentication or Client Authentication. 
  
  For example, when creating a self-signed certificate using PowerShell, the `KeyUsage` flag must be set to `DataEncipherment`:
  
  ```powershell
  New-SelfSignedCertificate -Type DocumentEncryptionCert -KeyUsage DataEncipherment -Subject mydataenciphermentcert -Provider 'Microsoft Enhanced Cryptographic Provider v1.0'
  ```

## Install the certificate in your cluster
This certificate must be installed on each node in the cluster. See [how to create a cluster using Azure Resource Manager][service-fabric-cluster-creation-via-arm] for setup instructions. 

## Encrypt application secrets
The following PowerShell command is used to encrypt a secret. This command only encrypts the value; it does **not** sign the cipher text. You must use the same encipherment certificate that is installed in your cluster to produce ciphertext for secret values:

```powershell
Invoke-ServiceFabricEncryptText -CertStore -CertThumbprint "<thumbprint>" -Text "mysecret" -StoreLocation CurrentUser -StoreName My
```

The resulting base-64 encoded string contains both the secret ciphertext as well as information about the certificate that was used to encrypt it.

## Next steps
Learn how to [Specify encrypted secrets in an application.][secret-management-specify-encrypted-secrets-link]

<!-- Links -->
[key-vault-get-started]:../key-vault/general/overview.md
[service-fabric-cluster-creation-via-arm]: service-fabric-cluster-creation-via-arm.md
[parameters-link]:service-fabric-how-to-parameterize-configuration-files.md
[environment-variables-link]: service-fabric-how-to-specify-environment-variables.md
[secret-management-linux-specific-link]: service-fabric-application-secret-management-linux.md
[secret-management-specify-encrypted-secrets-link]: service-fabric-application-secret-management.md#specify-encrypted-secrets-in-an-application
