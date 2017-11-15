---
title: Encrypt disks on a Linux VM with the Azure CLI 1.0 | Microsoft Docs
description: How to encrypt disks on a Linux VM using the Azure CLI 1.0 and the Resource Manager deployment model
services: virtual-machines-linux
documentationcenter: ''
author: iainfoulds
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 03/06/2017
ms.author: iainfou

---
# Encrypt disks on a Linux VM using the Azure CLI 1.0
For enhanced virtual machine (VM) security and compliance, virtual disks in Azure can be encrypted at rest. Disks are encrypted using cryptographic keys that are secured in an Azure Key Vault. You control these cryptographic keys and can audit their use. This article details how to encrypt virtual disks on a Linux VM using the Azure CLI 1.0 and the Resource Manager deployment model.

## CLI versions to complete the task
You can complete the task using one of the following CLI versions:

- [Azure CLI 1.0](#quick-commands) – our CLI for the classic and resource management deployment models (this article)
- [Azure CLI 2.0](encrypt-disks.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) - our next generation CLI for the resource management deployment model

## Quick commands
If you need to quickly accomplish the task, the following section details the base commands to encrypt virtual disks on your VM. More detailed information and context for each step can be found the rest of the document, [starting here](#overview-of-disk-encryption).

You need the [latest Azure CLI 1.0](../../xplat-cli-install.md) installed and logged in using the Resource Manager mode as follows:

```azurecli
azure config mode arm
```

In the following examples, replace example parameter names with your own values. Example parameter names include `myResourceGroup`, `myKeyVault`, and `myVM`.

First, enable the Azure Key Vault provider within your Azure subscription and create a resource group. The following example creates a resource group name `myResourceGroup` in the `WestUS` location:

```azurecli
azure provider register Microsoft.KeyVault
azure group create myResourceGroup --location WestUS
```

Create an Azure Key Vault. The following example creates a Key Vault named `myKeyVault`:

```azurecli
azure keyvault create --vault-name myKeyVault --resource-group myResourceGroup \
  --location WestUS
```

Create a cryptographic key in your Key Vault and enable it for disk encryption. The following example creates a key named `myKey`:

```azurecli
azure keyvault key create --vault-name myKeyVault --key-name myKey \
  --destination software
azure keyvault set-policy --vault-name myKeyVault --resource-group myResourceGroup \
  --enabled-for-disk-encryption true
```

Create an endpoint using Azure Active Directory for handling the authentication and exchanging of cryptographic keys from Key Vault. The `--home-page` and `--identifier-uris` do not need to be actual routable address. For the highest level of security, client secrets should be used instead of passwords. The Azure CLI cannot currently generate client secrets. Client secrets can only be generated in the Azure portal. The following example creates an Azure Active Directory endpoint named `myAADApp` and uses a password of `myPassword`. Specify your own password as follows:

```azurecli
azure ad app create --name myAADApp \
  --home-page http://testencrypt.contoso.com \
  --identifier-uris http://testencrypt.contoso.com \
  --password myPassword
```

Note the `applicationId` shown in the output from the preceding command. This application ID is used in the following steps:

```azurecli
azure ad sp create --applicationId myApplicationID
azure keyvault set-policy --vault-name myKeyVault --spn myApplicationID \
  --perms-to-keys [\"all\"] --perms-to-secrets [\"all\"]
```

Add a data disk to an existing VM. The following example adds a data disk to a VM named `myVM`:

```azurecli
azure vm disk attach-new --resource-group myResourceGroup --vm-name myVM \
  --size-in-gb 5
```

Review the details for your Key Vault and the key you created. You need the Key Vault ID, URI, and key URL in the final step. The following example reviews the details for a Key Vault named `myKeyVault` and key named `myKey`:

```azurecli
azure keyvault show myKeyVault
azure keyvault key show myKeyVault myKey
```

Encrypt your disks as follows, entering your own parameter names throughout:

```azurecli
azure vm enable-disk-encryption --resource-group myResourceGroup --name myVM \
  --aad-client-id myApplicationID --aad-client-secret myApplicationPassword \
  --disk-encryption-key-vault-url myKeyVaultVaultURI \
  --disk-encryption-key-vault-id myKeyVaultID \
  --key-encryption-key-url myKeyKID \
  --key-encryption-key-vault-id myKeyVaultID \
  --volume-type Data
```

The Azure CLI doesn't provide verbose errors during the encryption process. For additional troubleshooting information, review `/var/log/azure/Microsoft.OSTCExtensions.AzureDiskEncryptionForLinux/0.x.x.x/extension.log`. As the preceding command has many variables and you may not get much indication as to why the process fails, a complete command example would be as follows:

```azurecli
azure vm enable-disk-encryption --resource-group myResourceGroup --name myVM \
  --aad-client-id 147bc426-595d-4bad-b267-58a7cbd8e0b6 \
  --aad-client-secret P@ssw0rd! \
  --disk-encryption-key-vault-url https://myKeyVault.vault.azure.net/ \
  --disk-encryption-key-vault-id /subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.KeyVault/vaults/myKeyVault \
  --key-encryption-key-url https://myKeyVault.vault.azure.net/keys/myKey/6f5fe9383f4e42d0a41553ebc6a82dd1 \
  --key-encryption-key-vault-id /subscriptions/guid/resourceGroups/myResoureGroup/providers/Microsoft.KeyVault/vaults/myKeyVault \
  --volume-type Data
```

Finally, review the encryption status again to confirm that your virtual disks have now been encrypted. The following example checks the status of a VM named `myVM` in the `myResourceGroup` resource group:

```azurecli
azure vm show-disk-encryption-status --resource-group myResourceGroup --name myVM
```

## Overview of disk encryption
Virtual disks on Linux VMs are encrypted at rest using [dm-crypt](https://wikipedia.org/wiki/Dm-crypt). There is no charge for encrypting virtual disks in Azure. Cryptographic keys are stored in Azure Key Vault using software-protection, or you can import or generate your keys in Hardware Security Modules (HSMs) certified to FIPS 140-2 level 2 standards. You retain control of these cryptographic keys and can audit their use. These cryptographic keys are used to encrypt and decrypt virtual disks attached to your VM. An Azure Active Directory endpoint provides a secure mechanism for issuing these cryptographic keys as VMs are powered on and off.

The process for encrypting a VM is as follows:

1. Create a cryptographic key in an Azure Key Vault.
2. Configure the cryptographic key to be usable for encrypting disks.
3. To read the cryptographic key from the Azure Key Vault, create an endpoint using Azure Active Directory with the appropriate permissions.
4. Issue the command to encrypt your virtual disks, specifying the Azure Active Directory endpoint and appropriate cryptographic key to be used.
5. The Azure Active Directory endpoint requests the required cryptographic key from Azure Key Vault.
6. The virtual disks are encrypted using the provided cryptographic key.

## Supporting services and encryption process
Disk encryption relies on the following additional components:

* **Azure Key Vault** - used to safeguard cryptographic keys and secrets used for the disk encryption/decryption process.
  * If one exists, you can use an existing Azure Key Vault. You do not have to dedicate a Key Vault to encrypting disks.
  * To separate administrative boundaries and key visibility, you can create a dedicated Key Vault.
* **Azure Active Directory** - handles the secure exchanging of required cryptographic keys and authentication for requested actions.
  * You can typically use an existing Azure Active Directory instance for housing your application.
  * The application is more of an endpoint for the Key Vault and Virtual Machine services to request and get issued the appropriate cryptographic keys. You are not developing an actual application that integrates with Azure Active Directory.

## Requirements and limitations
Supported scenarios and requirements for disk encryption:

* The following Linux server SKUs - Ubuntu, CentOS, SUSE and SUSE Linux Enterprise Server (SLES), and Red Hat Enterprise Linux.
* All resources (such as Key Vault, Storage account, and VM) must be in the same Azure region and subscription.
* Standard A, D, DS, G, and GS series VMs.

Disk encryption is not currently supported in the following scenarios:

* Basic tier VMs.
* VMs created using the Classic deployment model.
* Disabling OS disk encryption on Linux VMs.
* Updating the cryptographic keys on an already encrypted Linux VM.

## Create the Azure Key Vault and keys
To complete the remainder of this guide, you need the [latest Azure CLI 1.0](../../xplat-cli-install.md) installed and logged in using the Resource Manager mode as follows:

```azurecli
azure config mode arm
```

Throughout the command examples, replace all example parameters with your own names, location, and key values. The following examples use a convention of `myResourceGroup`, `myKeyVault`, `myAADApp`, etc.

The first step is to create an Azure Key Vault to store your cryptographic keys. Azure Key Vault can store keys, secrets, or passwords that allow you to securely implement them in your applications and services. For virtual disk encryption, you use Key Vault to store a cryptographic key that is used to encrypt or decrypt your virtual disks.

Enable the Azure Key Vault provider in your Azure subscription, then create a resource group. The following example creates a resource group named `myResourceGroup` in the `WestUS` location:

```azurecli
azure provider register Microsoft.KeyVault
azure group create myResourceGroup --location WestUS
```

The Azure Key Vault containing the cryptographic keys and associated compute resources such as storage and the VM itself must reside in the same region. The following example creates an Azure Key Vault named `myKeyVault`:

```azurecli
azure keyvault create --vault-name myKeyVault --resource-group myResourceGroup \
  --location WestUS
```

You can store cryptographic keys using software or Hardware Security Model (HSM) protection. Using an HSM requires a premium Key Vault. There is an additional cost to creating a premium Key Vault rather than standard Key Vault that stores software-protected keys. To create a premium Key Vault, in the preceding step add `--sku Premium` to the command. The following example uses software-protected keys since we created a standard Key Vault.

For both protection models, the Azure platform needs to be granted access to request the cryptographic keys when the VM boots to decrypt the virtual disks. Create an encryption key within your Key Vault, then enable it for use with virtual disk encryption. The following example creates a key named `myKey` and then enables it for disk encryption:

```azurecli
azure keyvault key create --vault-name myKeyVault --key-name myKey \
  --destination software
azure keyvault set-policy --vault-name myKeyVault --resource-group myResourceGroup \
  --enabled-for-disk-encryption true
```


## Create the Azure Active Directory application
When virtual disks are encrypted or decrypted, you use an endpoint to handle the authentication and exchanging of cryptographic keys from Key Vault. This endpoint, an Azure Active Directory application, allows the Azure platform to request the appropriate cryptographic keys on behalf of the VM. A default Azure Active Directory instance is available in your subscription, though many organizations have dedicated Azure Active Directory directories.

As you are not creating a full Azure Active Directory application, the `--home-page` and `--identifier-uris` parameters in the following example do not need to be actual routable address. The following example also specifies a password-based secret rather than generating keys from within the Azure portal. As this time, generating keys cannot be done from the Azure CLI.

Create your Azure Active Directory application. The following example creates an application named `myAADApp` and uses a password of `myPassword`. Specify your own password as follows:

```azurecli
azure ad app create --name myAADApp \
  --home-page http://testencrypt.contoso.com \
  --identifier-uris http://testencrypt.contoso.com \
  --password myPassword
```

Make a note of the `applicationId` that is returned in the output from the preceding command. This application ID is used in some of the remaining steps. Next, create a service principal name (SPN) so that the application is accessible within your environment. To successfully encrypt or decrypt virtual disks, permissions on the cryptographic key stored in Key Vault must be set to permit the Azure Active Directory application to read the keys.

Create the SPN and set the appropriate permissions as follows:

```azurecli
azure ad sp create --applicationId myApplicationID
azure keyvault set-policy --vault-name myKeyVault --spn myApplicationID \
  --perms-to-keys [\"all\"] --perms-to-secrets [\"all\"]
```


## Add a virtual disk and review encryption status
To actually encrypt some virtual disks, lets add a disk to an existing VM. Add a 5Gb data disk to an existing VM as follows:

```azurecli
azure vm disk attach-new --resource-group myResourceGroup --vm-name myVM \
  --size-in-gb 5
```

The virtual disks are not currently encrypted. Review the current encryption status of your VM as follows:

```azurecli
azure vm show-disk-encryption-status --resource-group myResourceGroup --name myVM
```


## Encrypt virtual disks
To now encrypt the virtual disks, you bring together all the previous components:

1. Specify the Azure Active Directory application and password.
2. Specify the Key Vault to store the metadata for your encrypted disks.
3. Specify the cryptographic keys to use for the actual encryption and decryption.
4. Specify whether you want to encrypt the OS disk, the data disks, or all.

Lets review the details for your Azure Key Vault and the key you created, as you need the Key Vault ID, URI, and then key URL in the final step:

```azurecli
azure keyvault show myKeyVault
azure keyvault key show myKeyVault myKey
```

Encrypt your virtual disks using the output from the `azure keyvault show` and `azure keyvault key show` commands as follows:

```azurecli
azure vm enable-disk-encryption --resource-group myResourceGroup --name myVM \
  --aad-client-id myApplicationID --aad-client-secret myApplicationPassword \
  --disk-encryption-key-vault-url myKeyVaultVaultURI \
  --disk-encryption-key-vault-id myKeyVaultID \
  --key-encryption-key-url myKeyKID \
  --key-encryption-key-vault-id myKeyVaultID \
  --volume-type Data
```

As the preceding command has many variables, the following example is the complete command for reference:

```azurecli
azure vm enable-disk-encryption --resource-group myResourceGroup --name myVM \
  --aad-client-id 147bc426-595d-4bad-b267-58a7cbd8e0b6 \
  --aad-client-secret P@ssw0rd! \
  --disk-encryption-key-vault-url https://myKeyVault.vault.azure.net/ \
  --disk-encryption-key-vault-id /subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.KeyVault/vaults/myKeyVault \
  --key-encryption-key-url https://myKeyVault.vault.azure.net/keys/myKey/6f5fe9383f4e42d0a41553ebc6a82dd1 \
  --key-encryption-key-vault-id /subscriptions/guid/resourceGroups/myResoureGroup/providers/Microsoft.KeyVault/vaults/myKeyVault \
  --volume-type Data
```

The Azure CLI doesn't provide verbose errors during the encryption process. For additional troubleshooting information, review `/var/log/azure/Microsoft.OSTCExtensions.AzureDiskEncryptionForLinux/0.x.x.x/extension.log` on the VM you are encrypting.

Finally, lets review the encryption status again to confirm that your virtual disks have now been encrypted:

```azurecli
azure vm show-disk-encryption-status --resource-group myResourceGroup --name myVM
```


## Add additional data disks
Once you have encrypted your data disks, you can later add additional virtual disks to your VM and also encrypt them. When you run the `azure vm enable-disk-encryption` command, increment the sequence version using the `--sequence-version` parameter. This sequence version parameter allows you to perform repeated operations on the same VM.

For example, lets add a second virtual disk to your VM as follows:

```azurecli
azure vm disk attach-new --resource-group myResourceGroup --vm-name myVM \
  --size-in-gb 5
```

Rerun the command to encrypt the virtual disks, this time adding the `--sequence-version` parameter, and incrementing the value from our first run as follows:

```azurecli
azure vm enable-disk-encryption --resource-group myResourceGroup --name myVM \
  --aad-client-id myApplicationID --aad-client-secret myApplicationPassword \
  --disk-encryption-key-vault-url myKeyVaultVaultURI \
  --disk-encryption-key-vault-id myKeyVaultID \
  --key-encryption-key-url myKeyKID \
  --key-encryption-key-vault-id myKeyVaultID \
  --volume-type Data
  --sequence-version 2
```


## Next steps
* For more information about managing Azure Key Vault, including deleting cryptographic keys and vaults, see [Manage Key Vault using CLI](../../key-vault/key-vault-manage-with-cli2.md).
* For more information about disk encryption, such as preparing an encrypted custom VM to upload to Azure, see [Azure Disk Encryption](../../security/azure-security-disk-encryption.md).
