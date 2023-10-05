---
title: Tutorial - Import a certificate in Key Vault using Azure portal | Microsoft Docs
description: Tutorial showing how to import a certificate in Azure Key Vault
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: certificates
ms.topic: tutorial
ms.custom: mvc
ms.date: 03/16/2022
ms.author: sebansal 
ms.devlang: azurecli
---
# Tutorial: Import a certificate in Azure Key Vault

Azure Key Vault is a cloud service that provides a secure store for secrets. You can securely store keys, passwords, certificates, and other secrets. Azure key vaults may be created and managed through the Azure portal. In this tutorial, you create a key vault, then use it to import a certificate. For more information on Key Vault, review the [Overview](../general/overview.md).

The tutorial shows you how to:

> [!div class="checklist"]
> * Create a key vault.
> * Import a certificate in Key Vault using the portal.
> * Import a certificate in Key Vault using the CLI.
> * Import a certificate in Key Vault using PowerShell.


Before you begin, read [Key Vault basic concepts](../general/basic-concepts.md). 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a key vault

Create a key vault using one of these three methods:

- [Create a key vault using the Azure portal](../general/quick-create-portal.md)
- [Create a key vault using the Azure CLI](../general/quick-create-cli.md)
- [Create a key vault using Azure PowerShell](../general/quick-create-powershell.md)

## Import a certificate to your key vault

To import a certificate to the vault, you need to have a PEM or PFX certificate file to be on disk. If the certificate is in PEM format, the PEM file must contain the key as well as x509 certificates. This operation requires the certificates/import permission.

> [!IMPORTANT]
> In Azure Key Vault, supported certificate formats are PFX and PEM.
> - .pem file format contains one or more X509 certificate files.
> - .pfx file format is an archive file format for storing several cryptographic objects in a single file i.e. server certificate (issued for your domain), a matching private key, and may optionally include an intermediate CA.  

In this case, we will create a certificate called **ExampleCertificate**, or import a certificate called **ExampleCertificate**  with a path of **/path/to/cert.pem". You can import a certificate with the Azure portal, Azure CLI, or Azure PowerShell.

# [Azure portal](#tab/azure-portal)

1. On the page for your key vault, select **Certificates**.
2. Click on **Generate/Import**.
3. On the **Create a certificate** screen choose the following values:
    - **Method of Certificate Creation**: Import.
    - **Certificate Name**: ExampleCertificate.
    - **Upload Certificate File**: select the certificate file from disk
    - **Password** : If you are uploading a password protected certificate file, provide that password here. Otherwise, leave it blank. Once the certificate file is successfully imported, key vault will remove that password.
4. Click **Create**.

:::image type="content" source="../media/certificates/tutorial-import-cert/cert-import.png" alt-text="Importing a certificate through the Azure portal":::

When importing a .pem file, check if the format is the following:

-----BEGIN CERTIFICATE-----<br>
MIID2TCCAsGg...<br>
-----END CERTIFICATE-----<br>
-----BEGIN PRIVATE KEY-----<br>
MIIEvQIBADAN...<br>
-----END PRIVATE KEY-----<br>

When importing a certificate, Azure Key vault will automatically populate certificate parameters (i.e. validity period, Issuer name, activation date etc.).

Once you receive the message that the certificate has been successfully imported, you may click on it on the list to view its properties.

:::image type="content" source="../media/certificates/tutorial-import-cert/cert-properties.png" alt-text="Properties of a newly imported certificate in the Azure portal":::

# [Azure CLI](#tab/azure-cli)

Import a certificate into your key vault using the Azure CLI [az keyvault certificate import](/cli/azure/keyvault/certificate#az-keyvault-certificate-import) command:

```azurecli
az keyvault certificate import --vault-name "<your-key-vault-name>" -n "ExampleCertificate" -f "/path/to/ExampleCertificate.pem"
```

After importing the certificate, you can view the certificate using the Azure CLI [az keyvault certificate show](/cli/azure/keyvault/certificate#az-keyvault-certificate-show) command.

```azurecli
az keyvault certificate show --vault-name "<your-key-vault-name>" --name "ExampleCertificate"
```

# [Azure PowerShell](#tab/azure-powershell)

You can import a certificate into Key Vault using the Azure PowerShell [Import-AzKeyVaultCertificate](/powershell/module/az.keyvault/import-azkeyvaultcertificate) cmdlet.

```azurepowershell
$Password = ConvertTo-SecureString -String "123" -AsPlainText -Force
Import-AzKeyVaultCertificate -VaultName "<your-key-vault-name>" -Name "ExampleCertificate" -FilePath "C:\path\to\ExampleCertificate.pem" -Password $Password
```

After importing the certificate, you can view the certificate using the Azure PowerShell [Get-AzKeyVaultCertificate](/powershell/module/az.keyvault/get-azkeyvaultcertificate) cmdlet

```azurepowershell
Get-AzKeyVaultCertificate -VaultName "<your-key-vault-name>" -Name "ExampleCertificate"
```

---

Now, you have created a Key vault, imported a certificate and viewed a certificate's properties.

## Clean up resources

Other Key Vault quickstarts and tutorials build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, you may wish to leave these resources in place.
When no longer needed, delete the resource group, which deletes the Key Vault and related resources. To delete the resource group through the portal:

1. Enter the name of your resource group in the Search box at the top of the portal. When you see the resource group used in this quickstart in the search results, select it.
2. Select **Delete resource group**.
3. In the **TYPE THE RESOURCE GROUP NAME:** box type in the name of the resource group and select **Delete**.

## Next steps

In this tutorial, you created a Key Vault and imported a certificate in it. To learn more about Key Vault and how to integrate it with your applications, continue on to the articles below.

- Read more about [Managing certificate creation in Azure Key Vault](./create-certificate-scenarios.md)
- See examples of [Importing Certificates Using REST APIs](/rest/api/keyvault/certificates/import-certificate/import-certificate)
- Review the [Key Vault security overview](../general/security-features.md)
