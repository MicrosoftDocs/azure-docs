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
   ms.date="09/21/2016"
   ms.author="iainfou"/>

# Encrypting disks on a Linux VM
For enhanced security of your VMs, you can encrypt the virtual disks attached to your VMs.

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
azure keyvault create --vault-name <TestKeyVault> --resource-group <TestEncrypt> --location  <WestUS>
```

Create an encryption key within your Key Vault and enable it for use as disk encryption:

```bash
azure keyvault key create --vault-name <TestKeyVault> --key-name <TestEncryptKey> \
  --destination software
azure keyvault set-policy --vault-name <TestKeyVault> --resource-group <TestEncrypt> \
  --enabled-for-disk-encryption true
```

Create an Azure Active Directory application that will be used for handling the authentication and exchanging of cryptopgraphic keys from Key Vault. The `--home-page` and `--identifier-uris` doesn't need to be actual routable address:

```bash
azure ad app create --name <TestEncryptApp> --home-page <http://testencrypt.contoso.com> \
  --identifier-uris <http://testencrypt.contoso.com> --password P@ssw0rd!
```

Note the `applicationId` that is shown in the output from the above command to create the Azure Active Directory app. This application ID is used in some of the following steps:

```bash
azure ad sp create --applicationId <applicationId>
azure keyvault set-policy --vault-name <TestKeyVault> --spn <applicationId> \
  --perms-to-keys [\"all\"] --perms-to-secrets [\"all\"]
```

Add a data disk to an existing VM:

```bash
azure vm disk attach-new --resource-group <TestEncrypt> --vm-name <TestVM> --size-in-gb 5
```

Review the details for your Key Vault and the key you created, as you need the Key Vault ID, URI, and then key URL in the final step:

```bash
azure keyvault show <TestKeyVault>
azure keyvault key show <TestKeyVault> <TestEncryptKey>
```

Now go ahead and actually encrypt your disks.
```bash
azure vm enable-disk-encryption --resource-group TestEncrypt --vm-name TestVM \
  --aad-client-id <applicationId> --aad-client-secret <applicationPassword> \
  --disk-encryption-key-vault-url <keyvault vaultURI> \
  --disk-encryption-key-vault-id <keyvault Id> \
  --key-encryption-key-url <key kid> \
  --key-encryption-key-vault-id <keyvault Id> \
  --volume-type Data
```

The Azure CLI doesn't provide verbose errors as to why the encryption process. You need to review `/var/log/azure/Microsoft.OSTCExtensions.AzureDiskEncryptionForLinux/0.x.x.x/extension.log` for additional details. Since the preceeding command has a lot of variables and you won't get much indication as to why the process fails, the following is a sample complete command for reference:

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

Finally, view the encryption status to confirm your disks have been encrypted:

```bash
azure vm show-disk-encryption-status -g TestEncrypt -n TestVM
```


## Supporting services and encryption process
To encrypt a virtual disk, there are some prerequistes and supporting Azure services that provide the security mechanisms. Disk encryption relies on the following:

- **Azure Key Vault** - used to safeguard cryptographic keys and secrets used for the disk encryption/decryption process. You can use an existing Azure Key Vault, if one exists. It does not need to be dedicated Key Vault for encrypting disks unless you wish to separate administrative boundaries and visibility.
- **Azure Active Directory** - handles the secure exchanging of required cryptographic keys and authentication for requested actions. You can typically use an existing Azure Active Directory instance for housing your application. The application is more of an endpoint for the Key Vault and Virtual Machine services to request and get issued the appropriate cryptographic keys. You are not developing an actual application that integrates with Azure Active Directory.

The process for encrypting a VM is as follows:

- Create a cryptopgraphic key within an Azure Key Vault
- Configure the cryptographic key to be usable for encrypting disks
- Create an Azure Active Directory application with permissions to read the cryptopgraphic key from the Azure Key Vault
- Request the disks for a VM be encrypted, specifying the the Azure Active Directory application and appropriate cryptographic key to be used
- Azure Active Directory application requests the required cryptographic key from Azure Key Vault
- The disks are encrypted using the cryptographic key provided from the Azure Active Directory application


## Create the Azure Key Vault and keys
This first section
Replace all `<example parameters>` with your own names, required location, and key values.

Enable the Azure Key Vault provider within your Azure subscription and create a resource group as follows:

```bash
azure provider register Microsoft.KeyVault
azure group create <TestEncrypt> --location <WestUS>
```

Create an Azure Key Vault as follows:

```bash
azure keyvault create --vault-name <TestKeyVault> --resource-group <TestEncrypt> --location  <WestUS>
```

Create an encryption key within your Key Vault and enable it for use as disk encryption:

```bash
azure keyvault key create --vault-name <TestKeyVault> --key-name <TestEncryptKey> \
  --destination software
azure keyvault set-policy --vault-name <TestKeyVault> --resource-group <TestEncrypt> \
  --enabled-for-disk-encryption true
```


## Next steps
