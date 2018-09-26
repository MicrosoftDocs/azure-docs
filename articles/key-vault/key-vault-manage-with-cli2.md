---
title: Manage Azure Key Vault using CLI | Microsoft Docs
description: Use this article to automate common tasks in Key Vault by using the Azure CLI 
services: key-vault
documentationcenter: ''
author: barclayn
manager: mbaldwin
tags: azure-resource-manager

ms.assetid:
ms.service: key-vault
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 08/28/2018
ms.author: barclayn

---
# Manage Key Vault using the Azure CLI 

This article covers how to get started working with Azure Key Vault using the Azure CLI.  You can see information on:

- How to create a hardened container (a vault) in Azure
- Adding a key, secret, or certificate to the key vault
- Registering an application with Azure Active Directory
- Authorizing an application to use a key or secret
- Setting key vault advanced access policies
- Working with Hardware security modules (HSMs)
- Deleting the key vault and associated keys and secrets
- Miscellaneous Azure Cross-Platform Command-line Interface Commands


Azure Key Vault is available in most regions. For more information, see the [Key Vault pricing page](https://azure.microsoft.com/pricing/details/key-vault/).

> [!NOTE]
> This article does not include instructions on how to write the Azure application that one of the steps includes, which shows how to authorize an application to use a key or secret in the key vault.
>

For an overview of Azure Key Vault, see [What is Azure Key Vault?](key-vault-whatis.md)
If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To use the Azure CLI commands in this article, you must have the following items:

* A subscription to Microsoft Azure. If you don't have one, you can sign up for a [free trial](https://azure.microsoft.com/pricing/free-trial).
* Azure Command-Line Interface version 2.0 or later. To install the latest version, see [Install the Azure CLI](/cli/azure/install-azure-cli).
* An application that will be configured to use the key or password that you create in this article. A sample application is available from the [Microsoft Download Center](http://www.microsoft.com/download/details.aspx?id=45343). For instructions, see the included Readme file.

### Getting help with Azure Cross-Platform Command-Line Interface

This article assumes that you're familiar with the command-line interface (Bash, Terminal, Command prompt).

The --help or -h parameter can be used to view help for specific commands. Alternately, The Azure help [command] [options] format can also be used too. When in doubt about the parameters needed by a command, refer to help. For example, the following commands all return the same information:

```azurecli
az account set --help
az account set -h
```

You can also read the following articles to get familiar with Azure Resource Manager in Azure Cross-Platform Command-Line Interface:

* [Install Azure CLI](/cli/azure/install-azure-cli)
* [Get started with Azure CLI](/cli/azure/get-started-with-azure-cli)

## How to create a hardened container (a vault) in Azure

Vaults are secured containers backed by hardware security modules. Vaults help reduce the chances of accidental loss of security information by centralizing the storage of application secrets. Key Vaults also control and log the access to anything stored in them. Azure Key Vault can handle requesting and renewing Transport Layer Security (TLS) certificates, providing the features required for a robust certificate lifecycle management solution. In the next steps, you will create a vault.

### Connect to your subscriptions

To sign in interactively, use the following command:

```azurecli
az login
```
To sign in using an organizational account, you can pass in your username and password.

```azurecli
az login -u username@domain.com -p password
```

If you have more than one subscription and need to specify which to use, type the following to see the subscriptions for your account:

```azurecli
az account list
```

Specify a subscription with the subscription parameter.

```azurecli
az account set --subscription <subscription name or ID>
```

For more information about configuring Azure Cross-Platform Command-Line Interface, see [Install Azure CLI](/cli/azure/install-azure-cli).

### Create a new resource group

When using Azure Resource Manager, all related resources are created inside a resource group. You can create a key vault in an existing resource group. If you want to use a new resource group, you can create a new one.

```azurecli
az group create -n 'ContosoResourceGroup' -l 'East Asia'
```

The first parameter is resource group name and the second parameter is the location. To get a list of all possible locations type:

```azurecli
az account list-locations
``` 

### Register the Key Vault resource provider

 You may see the error "The subscription is not registered to use namespace 'Microsoft.KeyVault'" when you try to create a new key vault. If that message appears, make sure that Key Vault resource provider is registered in your subscription. This is a one-time operation for each subscription.

```azurecli
az provider register -n Microsoft.KeyVault
```

### Create a key vault

Use the `az keyvault create` command to create a key vault. This script has three mandatory parameters: a resource group name, a key vault name, and the geographic location.

To create a new vault with the name **ContosoKeyVault**, in the resource group  **ContosoResourceGroup**, residing in the **East Asia** location, type: 

```azurecli
az keyvault create --name 'ContosoKeyVault' --resource-group 'ContosoResourceGroup' --location 'East Asia'
```

The output of this command shows properties of the key vault that you've created. The two most important properties are:

* **name**: In the example, the name is ContosoKeyVault. You'll use this name for other Key Vault commands.
* **vaultUri**: In the example, the URI is https://contosokeyvault.vault.azure.net. Applications that use your vault through its REST API must use this URI.

Your Azure account is now authorized to perform any operations on this key vault. As of yet, nobody else is authorized.

## Adding a key, secret, or certificate to the key vault

If you want Azure Key Vault to create a software-protected key for you, use the `az key create` command.

```azurecli
az keyvault key create --vault-name 'ContosoKeyVault' --name 'ContosoFirstKey' --protection software
```

If you have an existing key in a .pem file, you can upload it to Azure Key Vault. You can choose to protect the key with software or HSM. Use the following to import the key from the .pem file and protect it with software:

```azurecli
az keyvault key import --vault-name 'ContosoKeyVault' --name 'ContosoFirstKey' --pem-file './softkey.pem' --pem-password 'Pa$$w0rd' --protection software
```

You can now reference the key that you created or uploaded to Azure Key Vault, by using its URI. Use **https://ContosoKeyVault.vault.azure.net/keys/ContosoFirstKey** to always get the current version. Use https://[keyvault-name].vault.azure.net/keys/[keyname]/[key-unique-id] to get this specific version. For example, **https://ContosoKeyVault.vault.azure.net/keys/ContosoFirstKey/cgacf4f763ar42ffb0a1gca546aygd87**. 

Add a secret to the vault, which is a password named SQLPassword, and that has the value of Pa$$w0rd to Azure Key Vaults. 

```azurecli
az keyvault secret set --vault-name 'ContosoKeyVault' --name 'SQLPassword' --value 'Pa$$w0rd'
```

Reference this password by using its URI. Use **https://ContosoVault.vault.azure.net/secrets/SQLPassword** to always get the current version, and https://[keyvault-name].vault.azure.net/secret/[secret-name]/[secret-unique-id] to get this specific version. For example, **https://ContosoVault.vault.azure.net/secrets/SQLPassword/90018dbb96a84117a0d2847ef8e7189d**.

Import a certificate to the vault using a .pem or .pfx.

```azurecli
az keyvault certificate import --vault-name 'ContosoKeyVault' --file 'c:\cert\cert.pfx' --name 'ContosoCert' --password 'Pa$$w0rd'
```

Let's view the key, secret, or certificate that you created:

* To view your keys, type: 

```azurecli
az keyvault key list --vault-name 'ContosoKeyVault'
```

* To view your secrets, type: 

```azurecli
az keyvault secret list --vault-name 'ContosoKeyVault'
```

* To view certificates, type: 

```azurecli
az keyvault certificate list --vault-name 'ContosoKeyVault'
```

## Registering an application with Azure Active Directory

This step would usually be done by a developer, on a separate computer. It isn't specific to Azure Key Vault but is included here, for awareness. To complete the app registration, your account, the vault, and the application need to be in the same Azure directory.

Applications that use a key vault must authenticate by using a token from Azure Active Directory.  The owner of the application must register it in Azure Active Directory first. At the end of registration, the application owner gets the following values:

- An **Application ID** (also known as the AAD Client ID or appID)
- An **authentication key** (also known as the shared secret). 

The application must present both these values to Azure Active Directory, to get a token. How an application is configured to get a token will depend on the application. For the [Key Vault sample application](https://www.microsoft.com/download/details.aspx?id=45343), the application owner sets these values in the app.config file.

For detailed steps on registering an application with Azure Active Directory you should review the articles titled [Integrating applications with Azure Active Directory](../active-directory/develop/active-directory-integrating-applications.md), [Use portal to create an Azure Active Directory application and service principal that can access resources](../azure-resource-manager/resource-group-create-service-principal-portal.md), and [Create an Azure service principal with the Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli).

To register an application in Azure Active Directory:

```azurecli
az ad sp create-for-rbac -n "MyApp" --password 'Pa$$w0rd' --skip-assignment
# If you don't specify a password, one will be created for you.
```

## Authorizing an application to use a key or secret

To authorize the application to access the key or secret in the vault, use the `az keyvault set-policy` command.

For example, if your vault name is ContosoKeyVault, the application has an appID of 8f8c4bbd-485b-45fd-98f7-ec6300b7b4ed, and you want to authorize the application to decrypt and sign with keys in your vault, use the following command:

```azurecli
az keyvault set-policy --name 'ContosoKeyVault' --spn 8f8c4bbd-485b-45fd-98f7-ec6300b7b4ed --key-permissions decrypt sign
```

To authorize the same application to read secrets in your vault, type the following command:

```azurecli
az keyvault set-policy --name 'ContosoKeyVault' --spn 8f8c4bbd-485b-45fd-98f7-ec6300b7b4ed --secret-permissions get
```

## <a name="bkmk_KVperCLI"></a> Setting key vault advanced access policies

Use [az keyvault update](/cli/azure/keyvault#az-keyvault-update) to enable advanced policies for the key vault. 

 Enable Key Vault for deployment: Allows virtual machines to retrieve certificates stored as secrets from the vault.
 ```azurecli
 az keyvault update --name 'ContosoKeyVault' --resource-group 'ContosoResourceGroup' --enabled-for-deployment 'true'
 ``` 

Enable Key Vault for disk encryption: Required when using the vault for Azure Disk encryption.

 ```azurecli
 az keyvault update --name 'ContosoKeyVault' --resource-group 'ContosoResourceGroup' --enabled-for-disk-encryption 'true'
 ```  

Enable Key Vault for template deployment: Allows Resource Manager to retrieve secrets from the vault.
 ```azurecli 
 az keyvault update --name 'ContosoKeyVault' --resource-group 'ContosoResourceGroup' --enabled-for-template-deployment 'true'
 ```

## Working with Hardware security modules (HSMs)

For added assurance, you can import or generate keys from hardware security modules (HSMs) that never leave the HSM boundary. The HSMs are FIPS 140-2 Level 2 validated. If this requirement doesn't apply to you, skip this section and go to [Delete the key vault and associated keys and secrets](#delete-the-key-vault-and-associated-keys-and-secrets).

To create these HSM-protected keys, you must have a vault subscription that supports HSM-protected keys.

When you create the keyvault, add the 'sku' parameter:

```azurecli
az keyvault create --name 'ContosoKeyVaultHSM' --resource-group 'ContosoResourceGroup' --location 'East Asia' --sku 'Premium'
```

You can add software-protected keys (as shown earlier) and HSM-protected keys to this vault. To create an HSM-protected key, set the Destination parameter to 'HSM':

```azurecli
az keyvault key create --vault-name 'ContosoKeyVaultHSM' --name 'ContosoFirstHSMKey' --protection 'hsm'
```

You can use the following command to import a key from a .pem file on your computer. This command imports the key into HSMs in the Key Vault service:

```azurecli
az keyvault key import --vault-name 'ContosoKeyVaultHSM' --name 'ContosoFirstHSMKey' --pem-file '/.softkey.pem' --protection 'hsm' --pem-password 'PaSSWORD'
```

The next command imports a “bring your own key" (BYOK) package. This lets you generate your key in your local HSM, and transfer it to HSMs in the Key Vault service, without the key leaving the HSM boundary:

```azurecli
az keyvault key import --vault-name 'ContosoKeyVaultHSM' --name 'ContosoFirstHSMKey' --byok-file './ITByok.byok' --protection 'hsm'
```

For more detailed instructions about how to generate this BYOK package, see [How to use HSM-Protected Keys with Azure Key Vault](key-vault-hsm-protected-keys.md).

## Deleting the key vault and associated keys and secrets

If you no longer need the key vault and its keys or secrets, you can delete the key vault by using the `az keyvault delete` command:

```azurecli
az keyvault delete --name 'ContosoKeyVault'
```

Or, you can delete an entire Azure resource group, which includes the key vault and any other resources that you included in that group:

```azurecli
az group delete --name 'ContosoResourceGroup'
```

## Miscellaneous Azure Cross-Platform Command-line Interface Commands

Other commands that you might find useful for managing Azure Key Vault.

This command lists a tabular display of all keys and selected properties:

```azurecli
az keyvault key list --vault-name 'ContosoKeyVault'
```

This command displays a full list of properties for the specified key:

```azurecli
az keyvault key show --vault-name 'ContosoKeyVault' --name 'ContosoFirstKey'
```

This command lists a tabular display of all secret names and selected properties:

```azurecli
az keyvault secret list --vault-name 'ContosoKeyVault'
```

Here's an example of how to remove a specific key:

```azurecli
az keyvault key delete --vault-name 'ContosoKeyVault' --name 'ContosoFirstKey'
```

Here's an example of how to remove a specific secret:

```azurecli
az keyvault secret delete --vault-name 'ContosoKeyVault' --name 'SQLPassword'
```

## Next steps

- For complete Azure CLI reference for key vault commands, see [Key Vault CLI reference](/cli/azure/keyvault).

- For programming references, see [the Azure Key Vault developer's guide](key-vault-developers-guide.md)

- For information on Azure Key Vault and HSMs, see [How to use HSM-Protected Keys with Azure Key Vault](key-vault-hsm-protected-keys.md).
