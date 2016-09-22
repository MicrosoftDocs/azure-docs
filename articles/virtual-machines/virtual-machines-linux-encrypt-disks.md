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
For enhanced virtual machine (VM) security and compliance, you can encrypt virtual disks at rest. Disks are encrypted using cryptographic keys secured in Azure Key Vault that you control and can audit the use of. There is no charge for encrypting virtual disks in Azure.


## Quick commands
The following section provides quick reference commands to help you understand the process of encrypting disks on your VM. More detailed information and context to what each step is doing can be found the rest of the document.

Replace all `<example parameters>` with your own names, required location, and key values.

Enable the Azure Key Vault provider within your Azure subscription and create a resource group as follows:

```bash
azure provider register Microsoft.KeyVault
azure group create <TestEncrypt> --location <WestUS>
```

Create an Azure Key Vault as follows:

```bash
azure keyvault create --vault-name <TestKeyVault> --resource-group <TestEncrypt> \
  --location  <WestUS>
```

Create an encryption key within your Key Vault and enable it for use as disk encryption:

```bash
azure keyvault key create --vault-name <TestKeyVault> --key-name <TestEncryptKey> \
  --destination software
azure keyvault set-policy --vault-name <TestKeyVault> --resource-group <TestEncrypt> \
  --enabled-for-disk-encryption true
```

Create an Azure Active Directory application that is used for handling the authentication and exchanging of cryptographic keys from Key Vault. The `--home-page` and `--identifier-uris` do not need to be actual routable address:

```bash
azure ad app create --name <TestEncryptApp> \
  --home-page <http://testencrypt.contoso.com> \
  --identifier-uris <http://testencrypt.contoso.com> \
  --password P@ssw0rd!
```

Note the `applicationId` that is shown in the output from the preceding command to create the Azure Active Directory app. This application ID is used in some of the following steps:

```bash
azure ad sp create --applicationId <applicationId>
azure keyvault set-policy --vault-name <TestKeyVault> --spn <applicationId> \
  --perms-to-keys [\"all\"] --perms-to-secrets [\"all\"]
```

Add a data disk to an existing VM:

```bash
azure vm disk attach-new --resource-group <TestEncrypt> --vm-name <TestVM> \
  --size-in-gb 5
```

Review the details for your Key Vault and the key you created, as you need the Key Vault ID, URI, and then key URL in the final step:

```bash
azure keyvault show <TestKeyVault>
azure keyvault key show <TestKeyVault> <TestEncryptKey>
```

Now go ahead and actually encrypt your disks:

```bash
azure vm enable-disk-encryption --resource-group TestEncrypt --vm-name TestVM \
  --aad-client-id <applicationId> --aad-client-secret <applicationPassword> \
  --disk-encryption-key-vault-url <keyvault vaultURI> \
  --disk-encryption-key-vault-id <keyvault Id> \
  --key-encryption-key-url <key kid> \
  --key-encryption-key-vault-id <keyvault Id> \
  --volume-type Data
```

The Azure CLI doesn't provide verbose errors during the encryption process. For additional troubleshooting information, review `/var/log/azure/Microsoft.OSTCExtensions.AzureDiskEncryptionForLinux/0.x.x.x/extension.log`. As the preceding command has many variables and you may not get much indication as to why the process fails, the following example is the complete command for reference:

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

Finally, review the encryption status again to confirm that your virtual disks have now been encrypted:

```bash
azure vm show-disk-encryption-status -g TestEncrypt -n TestVM
```


## Supporting services and encryption process
To encrypt a virtual disk, there are some prerequisites and supporting Azure services that provide the security mechanisms. Disk encryption relies on the following components:

- **Azure Key Vault** - used to safeguard cryptographic keys and secrets used for the disk encryption/decryption process. If one exists, you can use an existing Azure Key Vault. You do not have to dedicate a Key Vault to encrypting disks. To separate administrative boundaries and key visibility, you can create a dedicated Key Vault if desired.
- **Azure Active Directory** - handles the secure exchanging of required cryptographic keys and authentication for requested actions. You can typically use an existing Azure Active Directory instance for housing your application. The application is more of an endpoint for the Key Vault and Virtual Machine services to request and get issued the appropriate cryptographic keys. You are not developing an actual application that integrates with Azure Active Directory.

The process for encrypting a VM is as follows:

- Create a cryptographic key within an Azure Key Vault.
- Configure the cryptographic key to be usable for encrypting disks.
- To read the cryptographic key from the Azure Key Vault, create an Azure Active Directory application with permissions.
- Request the disks for a VM be encrypted, specifying the Azure Active Directory application and appropriate cryptographic key to be used.
- Azure Active Directory application requests the required cryptographic key from Azure Key Vault.
- The disks are encrypted using the cryptographic key provided from the Azure Active Directory application.


## Create the Azure Key Vault and keys
This first step is to create a Key Vault to store your cryptographic keys. Azure Key Vault can store keys, secrets, or passwords that allow you to securely implement them in your applications and services. For disk encryption, you use Key Vault to store a cryptographic key that is used to encrypt or decrypt your virtual disks. 

Replace all `<example parameters>` with your own names, required location, and key values.

Enable the Azure Key Vault provider within your Azure subscription and create a resource group as follows:

```bash
azure provider register Microsoft.KeyVault
azure group create <TestEncrypt> --location <WestUS>
```

The Azure Key Vault containing the cryptographic keys and associated compute resources such as storage and the VM itself must reside in the same region. Create an Azure Key Vault as follows:

```bash
azure keyvault create --vault-name <TestKeyVault> --resource-group <TestEncrypt> \
  --location  <WestUS>
```

You can store cryptographic keys using software or Hardware Security Model (HSM) protection. Using a HSM requires a premium Key Vault. There is an additional cost to creating a premium Key Vault rather than standard Key Vault that stores software-protected keys. To create a premium Key Vault, in the preceding step you add `--sku Premium` to the command. The following example uses software-protected keys since we created a standard Key Vault. For both protection models, the Azure platform needs to be granted access to request the cryptographic keys when the VM boots to decrypt the virtual disks. Create an encryption key within your Key Vault and enable it for use as disk encryption as follows:

```bash
azure keyvault key create --vault-name <TestKeyVault> --key-name <TestEncryptKey> \
  --destination software
azure keyvault set-policy --vault-name <TestKeyVault> --resource-group <TestEncrypt> \
  --enabled-for-disk-encryption true
```


## Create the Azure Active Directory application

When virtual disks are encrypted or decrypted, you use an Azure Active Directory application to handle the authentication and exchanging of cryptographic keys from Key Vault. The Azure Active Directory application acts as an endpoint to allow the Azure platform to request the appropriate cryptographic keys on behalf of the VM. A default Azure Active Directory is available in your subscription, though many organizations have dedicated Azure Active Directory directories.

As you are not creating a functioning Azure Active directory, the `--home-page` and `--identifier-uris` parameters in the following example do not need to be actual routable address. The following example also specifies a password-based secret rather than generating keys from within the Azure portal. Create your Azure Active Directory application as follows:

```bash
azure ad app create --name <TestEncryptApp> \
  --home-page <http://testencrypt.contoso.com> \
  --identifier-uris <http://testencrypt.contoso.com> \
  --password P@ssw0rd!
```

Make a note of the `applicationId` that is shown in the output from the preceding command. This application ID is used in some of the remaining steps. Next, you create a service principal name (SPN) so that the application is accessible within your environment. To successfully encrypt or decrypt virtual disks, permissions on the cryptographic key stored in Key Vault must be set to permit the Azure Active Directory application to read the keys. Create the SPN and set the appropriate permissions as follows:

```bash
azure ad sp create --applicationId <applicationId>
azure keyvault set-policy --vault-name <TestKeyVault> --spn <applicationId> \
  --perms-to-keys [\"all\"] --perms-to-secrets [\"all\"]
```


## Add a virtual disk and review encryption status

To actually encrypt some virtual disks, lets add a disk to an existing VM. Add a data disk to an existing VM as follows:

```bash
azure vm disk attach-new --resource-group <TestEncrypt> --vm-name <TestVM> \
  --size-in-gb 5
```

The virtual disks are not currently encrypted. Review the current encryption status of your VM as follows:

```bash
azure vm show-disk-encryption-status -g TestEncrypt -n TestVM
```


## Encrypt virtual disks

Now you are ready to actually encrypt virtual disks. First, lets review the details for your Key Vault and the key you created, as you need the Key Vault ID, URI, and then key URL in the final step:

```bash
azure keyvault show <TestKeyVault>
azure keyvault key show <TestKeyVault> <TestEncryptKey>
```

To encrypt the virtual disks, you bring together all the previous components:

- You specify the Azure Active Directory application and password
- You specify the Key Vault to store the metadata for your encrypted disks
- You specify the cryptographic keys to use for the actual encryption and decryption
- You specify whether you want to encrypt the OS disk, the data disks, or all

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

The Azure CLI doesn't provide verbose errors during the encryption process. For additional troubleshooting information, review `/var/log/azure/Microsoft.OSTCExtensions.AzureDiskEncryptionForLinux/0.x.x.x/extension.log`. As the preceding command has many variables and you may not get much indication as to why the process fails, the following example is the complete command for reference:

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

Lets review the encryption status again to confirm that your virtual disks have now been encrypted:

```bash
azure vm show-disk-encryption-status -g TestEncrypt -n TestVM
```


## Next steps
