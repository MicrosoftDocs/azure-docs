<properties
   pageTitle="Learn how to encrypt disks on a Linux VM | Microsoft Azure"
   description="How to encrypt disks on a Linux VM using the Azure CLI"
   services="virtual-machines-linux"
   documentationCenter=""
   authors="iainfoulds"
   manager="timlt"
   editor=""/>

<tags
   ms.service="virtual-machines-linux"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure"
   ms.date="09/22/2016"
   ms.author="iainfou"/>

# Encrypting disks on a Linux VM
For enhanced virtual machine (VM) security and compliance, virtual disks in Azure can be encrypted at rest. Disks are encrypted using cryptographic keys that are secured in an Azure Key Vault. You control these crytographic keys and can audit their use. There is no charge for encrypting virtual disks in Azure. This article details how to encrypt virtual disks on a Linux VM using the Azure CLI. Only VMs created using the Resource Manager deployment model can be encrypted.


## Quick commands
The following section details the base commands to encrypt virtual disks on your VM. More detailed information and context for each step can be found the rest of the document.

You need the [latest Azure CLI](../xplat-cli-install.md) installed and logged in using the Resource Manager mode (`azure config mode arm`). Replace all `<example parameters>` with your own names, required location, and key values.

First, enable the Azure Key Vault provider within your Azure subscription and create a resource group as follows:

```bash
azure provider register Microsoft.KeyVault
azure group create <TestEncrypt> --location <WestUS>
```

Create an Azure Key Vault as follows:

```bash
azure keyvault create --vault-name <TestKeyVault> --resource-group <TestEncrypt> \
  --location  <WestUS>
```

Create a cryptographic key in your Key Vault and enable it for disk encryption as follows::

```bash
azure keyvault key create --vault-name <TestKeyVault> --key-name <TestEncryptKey> \
  --destination software
azure keyvault set-policy --vault-name <TestKeyVault> --resource-group <TestEncrypt> \
  --enabled-for-disk-encryption true
```

Create an endpoint using Azure Active Directory for handling the authentication and exchanging of cryptographic keys from Key Vault. The `--home-page` and `--identifier-uris` do not need to be actual routable address:

```bash
azure ad app create --name <TestEncryptApp> \
  --home-page <http://testencrypt.contoso.com> \
  --identifier-uris <http://testencrypt.contoso.com> \
  --password P@ssw0rd!
```

Note the `applicationId` shown in the output from the preceding command to create the Azure Active Directory app. This application ID is used in the following steps:

```bash
azure ad sp create --applicationId <applicationId>
azure keyvault set-policy --vault-name <TestKeyVault> --spn <applicationId> \
  --perms-to-keys [\"all\"] --perms-to-secrets [\"all\"]
```

Add a data disk to an existing VM as follows:

```bash
azure vm disk attach-new --resource-group <TestEncrypt> --vm-name <TestVM> \
  --size-in-gb 5
```

Review the details for your Key Vault and the key you created. You need the Key Vault ID, URI, and key URL in the final step:

```bash
azure keyvault show <TestKeyVault>
azure keyvault key show <TestKeyVault> <TestEncryptKey>
```

Encrypt your disks as follows:

```bash
azure vm enable-disk-encryption --resource-group TestEncrypt --vm-name TestVM \
  --aad-client-id <applicationId> --aad-client-secret <applicationPassword> \
  --disk-encryption-key-vault-url <keyvault vaultURI> \
  --disk-encryption-key-vault-id <keyvault Id> \
  --key-encryption-key-url <key kid> \
  --key-encryption-key-vault-id <keyvault Id> \
  --volume-type Data
```

The Azure CLI doesn't provide verbose errors during the encryption process. For additional troubleshooting information, review `/var/log/azure/Microsoft.OSTCExtensions.AzureDiskEncryptionForLinux/0.x.x.x/extension.log`. As the preceding command has many variables and you may not get much indication as to why the process fails, a complete command example would be as follows:

```bash
azure vm enable-disk-encryption -g TestEncrypt -n TestVM \
  --aad-client-id 147bc426-595d-4bad-b267-58a7cbd8e0b6 \
  --aad-client-secret P@ssw0rd! \
  --disk-encryption-key-vault-url https://TestKeyVault.vault.azure.net/ \ 
  --disk-encryption-key-vault-id /subscriptions/guid/resourceGroups/TestEncrypt/providers/Microsoft.KeyVault/vaults/TestKeyVault \
  --key-encryption-key-url https://testkeyvault.vault.azure.net/keys/TestEncryptKey/6f5fe9383f4e42d0a41553ebc6a82dd1 \
  --key-encryption-key-vault-id /subscriptions/guid/resourceGroups/TestEncrypt/providers/Microsoft.KeyVault/vaults/TestKeyVault \
  --volume-type Data
```

Finally, review the encryption status again to confirm that your virtual disks have now been encrypted as follows:

```bash
azure vm show-disk-encryption-status -g TestEncrypt -n TestVM
```

## Overview of disk encryption
Virtual disks on Linux VMs are encrypted at rest using [dm-crypt](https://wikipedia.org/wiki/Dm-crypt). Cryptographic keys are stored in Azure Key Vault using software-protection, or you can import or generate your keys in Hardware Security Modules (HSMs) certified to FIPS 140-2 level 2 standards. You retain control of these cryptographic keys and can audit their use. These crytographic keys are used to encrypt and decrypt virtual disks attached to your VM. An Azure Active Directory endpoint provides a secure mechanism for issuing these cryptographic keys as VMs are powered on and off.

The process for encrypting a VM is as follows:

- Create a cryptographic key in an Azure Key Vault.
- Configure the cryptographic key to be usable for encrypting disks.
- To read the cryptographic key from the Azure Key Vault, create an endpoint using Azure Active Directory with the appropriate permissions.
- Issue the command to encrypt your virtual disks, specifying the Azure Active Directory endpoint and appropriate cryptographic key to be used.
- The Azure Active Directory endpoint requests the required cryptographic key from Azure Key Vault.
- The virtual disks are encrypted using the provided cryptographic key.


## Supporting services and encryption process
Disk encryption relies on the following additional components:

- **Azure Key Vault** - used to safeguard cryptographic keys and secrets used for the disk encryption/decryption process. 
  - If one exists, you can use an existing Azure Key Vault. You do not have to dedicate a Key Vault to encrypting disks.
  - To separate administrative boundaries and key visibility, you can create a dedicated Key Vault.
- **Azure Active Directory** - handles the secure exchanging of required cryptographic keys and authentication for requested actions. 
  - You can typically use an existing Azure Active Directory instance for housing your application. 
  - The application is more of an endpoint for the Key Vault and Virtual Machine services to request and get issued the appropriate cryptographic keys. You are not developing an actual application that integrates with Azure Active Directory.


## Requirements and limitations
Supported scenarios and requirements for disk encryption:

- The following Linux server SKUs - Ubuntu, CentOS, SUSE and SUSE Linux Enterprise Server (SLES) and Red Hat Enterprise Linux.
- All resources (such as Key Vault, Storage account, and VM) must be in the same Azure region and subscription.
- Standard A, D and G series VMs.

Disk encryption is not supported in the following scenarios:

- Basic-tier VMs and Standard DS (Premium storage) VMs.
- VMs created using the Classic deployment model.
- Disabling disk encryption on Linux VMs.


## Create the Azure Key Vault and keys
To complete the remainder of this guide, you need the [latest Azure CLI](../xplat-cli-install.md) installed and logged in using the Resource Manager mode (`azure config mode arm`). 

Throughout the command examples, replace all `<example parameters>` with your own names, required location, and key values.

The first step is to create an Azure Key Vault to store your cryptographic keys. Azure Key Vault can store keys, secrets, or passwords that allow you to securely implement them in your applications and services. For virtual disk encryption, you use Key Vault to store a cryptographic key that is used to encrypt or decrypt your virtual disks. 

Enable the Azure Key Vault provider in your Azure subscription, then create a resource group as follows:

```bash
azure provider register Microsoft.KeyVault
azure group create <TestEncrypt> --location <WestUS>
```

The Azure Key Vault containing the cryptographic keys and associated compute resources such as storage and the VM itself must reside in the same region. Create an Azure Key Vault as follows:

```bash
azure keyvault create --vault-name <TestKeyVault> --resource-group <TestEncrypt> \
  --location  <WestUS>
```

You can store cryptographic keys using software or Hardware Security Model (HSM) protection. Using a HSM requires a premium Key Vault. There is an additional cost to creating a premium Key Vault rather than standard Key Vault that stores software-protected keys. To create a premium Key Vault, in the preceding step add `--sku Premium` to the command. The following example uses software-protected keys since we created a standard Key Vault. 

For both protection models, the Azure platform needs to be granted access to request the cryptographic keys when the VM boots to decrypt the virtual disks. Create an encryption key within your Key Vault, then enable it for use with virtual disk encryption as follows:

```bash
azure keyvault key create --vault-name <TestKeyVault> --key-name <TestEncryptKey> \
  --destination software
azure keyvault set-policy --vault-name <TestKeyVault> --resource-group <TestEncrypt> \
  --enabled-for-disk-encryption true
```


## Create the Azure Active Directory application
When virtual disks are encrypted or decrypted, you use an endpoint to handle the authentication and exchanging of cryptographic keys from Key Vault. This endpoint, an Azure Active Directory application, allows the Azure platform to request the appropriate cryptographic keys on behalf of the VM. A default Azure Active Directory instance is available in your subscription, though many organizations have dedicated Azure Active Directory directories.

As you are not creating a full Azure Active Directory application, the `--home-page` and `--identifier-uris` parameters in the following example do not need to be actual routable address. The following example also specifies a password-based secret rather than generating keys from within the Azure portal. As this time, generating keys cannot be done from the Azure CLI. 

Create your Azure Active Directory application as follows:

```bash
azure ad app create --name <TestEncryptApp> \
  --home-page <http://testencrypt.contoso.com> \
  --identifier-uris <http://testencrypt.contoso.com> \
  --password P@ssw0rd!
```

Make a note of the `applicationId` that is returned in the output from the preceding command. This application ID is used in some of the remaining steps. Next, create a service principal name (SPN) so that the application is accessible within your environment. To successfully encrypt or decrypt virtual disks, permissions on the cryptographic key stored in Key Vault must be set to permit the Azure Active Directory application to read the keys. 

Create the SPN and set the appropriate permissions as follows:

```bash
azure ad sp create --applicationId <applicationId>
azure keyvault set-policy --vault-name <TestKeyVault> --spn <applicationId> \
  --perms-to-keys [\"all\"] --perms-to-secrets [\"all\"]
```


## Add a virtual disk and review encryption status
To actually encrypt some virtual disks, lets add a disk to an existing VM. Add a 5Gb data disk to an existing VM as follows:

```bash
azure vm disk attach-new --resource-group <TestEncrypt> --vm-name <TestVM> \
  --size-in-gb 5
```

The virtual disks are not currently encrypted. Review the current encryption status of your VM as follows:

```bash
azure vm show-disk-encryption-status -g TestEncrypt -n TestVM
```


## Encrypt virtual disks
To actually now encrypt the virtual disks, you bring together all the previous components:

- Specify the Azure Active Directory application and password.
- Specify the Key Vault to store the metadata for your encrypted disks.
- Specify the cryptographic keys to use for the actual encryption and decryption.
- Specify whether you want to encrypt the OS disk, the data disks, or all.

First, lets review the details for your Azure Key Vault and the key you created, as you need the Key Vault ID, URI, and then key URL in the final step:

```bash
azure keyvault show <TestKeyVault>
azure keyvault key show <TestKeyVault> <TestEncryptKey>
```

Encrypt your virtual disks using the output from the `azure keyvault show` and `azure keyvault key show` commands as follows:

```bash
azure vm enable-disk-encryption --resource-group TestEncrypt --vm-name TestVM \
  --aad-client-id <applicationId> --aad-client-secret <applicationPassword> \
  --disk-encryption-key-vault-url <keyvault vaultURI> \
  --disk-encryption-key-vault-id <keyvault Id> \
  --key-encryption-key-url <key kid> \
  --key-encryption-key-vault-id <keyvault Id> \
  --volume-type Data
```

As the preceding command has many variables, the following example is the complete command for reference:

```bash
azure vm enable-disk-encryption -g TestEncrypt -n TestVM \
  --aad-client-id 147bc426-595d-4bad-b267-58a7cbd8e0b6 \
  --aad-client-secret P@ssw0rd! \
  --disk-encryption-key-vault-url https://TestKeyVault.vault.azure.net/ \ 
  --disk-encryption-key-vault-id /subscriptions/guid/resourceGroups/TestEncrypt/providers/Microsoft.KeyVault/vaults/TestKeyVault \
  --key-encryption-key-url https://testkeyvault.vault.azure.net/keys/TestEncryptKey/6f5fe9383f4e42d0a41553ebc6a82dd1 \
  --key-encryption-key-vault-id /subscriptions/guid/resourceGroups/TestEncrypt/providers/Microsoft.KeyVault/vaults/TestKeyVault \
  --volume-type Data
```

The Azure CLI doesn't provide verbose errors during the encryption process. For additional troubleshooting information, review `/var/log/azure/Microsoft.OSTCExtensions.AzureDiskEncryptionForLinux/0.x.x.x/extension.log` on the VM you are encrypting.

Finally, lets review the encryption status again to confirm that your virtual disks have now been encrypted:

```bash
azure vm show-disk-encryption-status -g TestEncrypt -n TestVM
```


## Next steps
