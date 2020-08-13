---
title: Export certificate from Azure Key Vault
description: Export certificate from Azure Key Vault
services: key-vault
author: sebansal
tags: azure-key-vault

ms.service: key-vault
ms.subservice: certificates
ms.topic: tutorial
ms.custom: mvc, devx-track-azurecli
ms.date: 08/11/2020
ms.author: sebansal
#Customer intent:As a security admin who is new to Azure, I want to use Key Vault to securely store certificates in Azure
---
# Export certificate from Azure Key Vault

Azure Key Vault allows you to easily provision, manage, and deploy digital certificates for your network and to enable secure communications for applications. For more general information about Certificates, see [Azure Key Vault Certificates](https://docs.microsoft.com/azure/key-vault/certificates/about-certificates)

## About Azure key vault certificate

### Composition of certificate
When a Key Vault certificate is created, an addressable key and secret are also created with the same name. The Key Vault key allows key operations and the Key Vault secret allows retrieval of the certificate value as a secret. A Key Vault certificate also contains public x509 certificate metadata. [Read more](https://docs.microsoft.com/azure/key-vault/certificates/about-certificates#composition-of-a-certificate)

### Exportable or non-exportable Keys
When a Key Vault certificate is created, it can be retrieved from the addressable secret with the private key in either PFX or PEM format. The policy used to create the certificate must indicate that the key is exportable. If the policy indicates non-exportable, then the private key isn't a part of the value when retrieved as a secret.

Two types of key are supported – RSA or RSA HSM with certificates. Exportable is only allowed with RSA, not supported by RSA HSM. [Read more](https://docs.microsoft.com/azure/key-vault/certificates/about-certificates#exportable-or-non-exportable-key)

Stored certificate in Azure Key Vault can be exported using Azure CLI, PowerShell or Portal.

> [!NOTE]
> It is important to note that you would only require password of a certificate when importing it in the key vault. Key Vault would not save the associated password, therefore when you would export the certificate, the password would be blank.

## Exporting certificate using CLI
The following command will allow you to download the **public portion** of a Key Vault certificate.

```azurecli
az keyvault certificate download --file
                                 [--encoding {DER, PEM}]
                                 [--id]
                                 [--name]
                                 [--subscription]
                                 [--vault-name]
                                 [--version]
```
For examples and parameter definitions, [view here](https://docs.microsoft.com/cli/azure/keyvault/certificate?view=azure-cli-latest#az-keyvault-certificate-download)



If you want to download the whole certificate i.e. **both public and private portion of its composition**, then it can be accomplished by downloading the certificate as a secret.

```azurecli
az keyvault secret download –file {nameofcert.pfx}
                            [--encoding {ascii, base64, hex, utf-16be, utf-16le, utf-8}]
                            [--id]
                            [--name]
                            [--subscription]
                            [--vault-name]
                            [--version]
```
For parameter definitions, [view here](https://docs.microsoft.com/cli/azure/keyvault/secret?view=azure-cli-latest#az-keyvault-secret-download)


## Exporting certificate using PowerShell

This command gets the certificate named TestCert01 from the key vault named ContosoKV01. To download the certificate as pfx file, run following command. These commands access SecretId and then save the content as a pfx file.

```azurepowershell
$cert = Get-AzKeyVaultCertificate -VaultName "ContosoKV01" -Name "TestCert01"
$kvSecret = Get-AzKeyVaultSecret -VaultName "ContosoKV01" -Name $Cert.Name
$kvSecretBytes = [System.Convert]::FromBase64String($kvSecret.SecretValueText)
$certCollection = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2Collection
$certCollection.Import($kvSecretBytes,$null,[System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::Exportable)
$password = '******'
$protectedCertificateBytes = $certCollection.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Pkcs12, $password)
$pfxPath = [Environment]::GetFolderPath("Desktop") + "\MyCert.pfx"
[System.IO.File]::WriteAllBytes($pfxPath, $protectedCertificateBytes)
```
This will export the entire chain of certificates with private key and this certificate will be password protected.
For more information on ```Get-AzKeyVaultCertificate``` command and parameters, refer to [Example 2](https://docs.microsoft.com/powershell/module/az.keyvault/Get-AzKeyVaultCertificate?view=azps-4.4.0)

## Exporting certificate using Portal

On the portal, when you create/import a certificate in Certificate blade, you will receive the notification that the certificate has been successfully created. When you select the certificate, you can click on the current version, and you will see the option to download.


By clicking "Download in CER format" or "Download in PFX/PEM format" button, you can download the certificate.


![Certificate download](../media/certificates/quick-create-portal/current-version-shown.png)


## Exporting App Service Certificate from key vault

Azure App Service Certificates provide a convenient way to purchase SSL certificates and assign them to Azure Apps right from within the portal. These certificates can also be exported from the portal as PFX files to be used elsewhere.
Once imported, the app service certificates can be **located under secrets**.

For steps to export app service certificates, [read here](https://social.technet.microsoft.com/wiki/contents/articles/37431.exporting-azure-app-service-certificates.aspx)

## Read more
* [Various certificate file types and definitions](https://docs.microsoft.com/archive/blogs/kaushal/various-ssltls-certificate-file-typesextensions)