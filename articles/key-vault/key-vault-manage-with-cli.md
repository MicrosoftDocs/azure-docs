---
title: Manage Azure Key Vault using CLI | Microsoft Docs
description: Use this tutorial to automate common tasks in Key Vault by using the CLI
services: key-vault
documentationcenter: ''
author: barclayn
manager: mbaldwin
tags: azure-resource-manager

ms.assetid: 66be6e44-684a-411b-802e-884628458ae7
ms.service: key-vault
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/14/2017
ms.author: barclayn

---
# Manage Key Vault using CLI

Use this tutorial to help you get started with Azure Key Vault to create a hardened container (a vault) in Azure. Azure Key vault is used to store and manage cryptographic keys and secrets. This article walks you through the process of using Azure Cross-Platform Command-Line Interface to create a vault. You will then interact with the vault to perform various common operations. 

Azure Key Vault is available in most regions. For more information, see the [Key Vault pricing page](https://azure.microsoft.com/pricing/details/key-vault/).

**Estimated time to complete:** 20 minutes

> [!NOTE]
> This tutorial does not include instructions on how to write the Azure application that one of the steps includes. This sample application is used to show how an application can be authorized  to use a key or secret stored in the key vault.
> This article focuses on configuring Azure Key Vault using the Cross-Platform Command-Line Interface. For Azure PowerShell instructions, see [this equivalent tutorial](key-vault-get-started.md).

For overview information about Azure Key Vault, see [What is Azure Key Vault?](key-vault-whatis.md)

## Prerequisites

To complete this tutorial, you must have the following:

* A subscription to Microsoft Azure. If you do not have one, you can sign up for a [free trial](https://azure.microsoft.com/pricing/free-trial).
* Command-Line Interface version 0.9.1 or later. To install the latest version and connect to your Azure subscription, see [Install and Configure the Azure Cross-Platform Command-Line Interface](../cli-install-nodejs.md).
* An application that will be configured to use the key or password that you create in this tutorial. A sample application is available from the [Microsoft Download Center](http://www.microsoft.com/download/details.aspx?id=45343). For instructions, see the accompanying Readme file.

## Getting help with Azure Cross-Platform Command-Line Interface

This tutorial assumes that you are familiar with the command-line interface (Bash, Terminal, Command prompt)

The --help or -h parameter can be used to view help for specific commands. Alternately, The azure help [command] [options] format can also be used to return the same information. For example, the following commands all return the same information:

    azure account set --help

    azure account set -h

    azure help account set

When in doubt about the parameters needed by a command, refer to help using --help, -h or azure help [command].

You can also read the following tutorials to get familiar with Azure Resource Manager deploymnent model in Azure Cross-Platform Command-Line Interface:

* [How to install and configure Azure Cross-Platform Command Line Interface](../cli-install-nodejs.md)
* [Using Azure Cross-Platform Command-Line Interface with Azure Resource Manager](../xplat-cli-azure-resource-manager.md)

## Connect to your subscriptions

To log in into Azure by using the following command:

```azurecli-interactive
azure login -u username -p password
```

or if you want to log in by typing interactively

```azurecli-interactive
azure login
```

If you have multiple subscriptions and want to specify a specific one to use for Azure Key Vault, type the following to see the subscriptions for your account:

```azurecli-interactive
azure account list
```

Then, to specify the subscription to use, type:

```azurecli-interactive
azure account set <subscription name>
```

For more information about configuring Azure Cross-Platform Command-Line Interface, see [How to Install and Configure Azure Cross-Platform Command-Line Interface](../cli-install-nodejs.md).

## Switch to using Azure Resource Manager
The Key Vault requires Azure Resource Manager, so type the following to switch to Azure Resource Manager mode:

```azurecli-interactive
azure config mode arm
```

## Create a new resource group
When using Azure Resource Manager, all related resources are created inside a resource group. We will create a new resource group 'ContosoResourceGroup' for this tutorial.

```azurecli-interactive
azure group create 'ContosoResourceGroup' 'East Asia'
```

The first parameter is resource group name and the second parameter is the location. For location, use the command `azure location list` to identify how to specify an alternative location to the one in this example. If you need more information, type: `azure help location`

## Register the Key Vault resource provider
Make sure that Key Vault resource provider is registered in your subscription:

```azurecli-interactive
azure provider register Microsoft.KeyVault
```

This only needs to be done once per subscription.

## Create a key vault

Use the `azure keyvault create` command to create a key vault. This script has three mandatory parameters: a resource group name, a key vault name, and the geographic location.

For example:
- If you use the vault name of **ContosoKeyVault**
- The resource group name of **ContosoResourceGroup**
- The location of **East Asia** type:

```azurecli-interactive
azure keyvault create --vault-name 'ContosoKeyVault' --resource-group 'ContosoResourceGroup' --location 'East Asia'
```

The output of this command shows properties of the key vault that you've just created. The two most important properties are:

* **Name**: In the example this is ContosoKeyVault. You will use this name for other Key Vault cmdlets.
* **vaultUri**: In the example this is https://contosokeyvault.vault.azure.net. Applications that use your vault through its REST API must use this URI.

Your Azure account is now authorized to perform any operations on this key vault. As yet, nobody else is.

## Add a key or secret to the key vault

If you want Azure Key Vault to create a software-protected key for you, use the `azure key create` command, and type the following:

```azurecli-interactive
azure keyvault key create --vault-name 'ContosoKeyVault' --key-name 'ContosoFirstKey' --destination software
````

However, if you have an existing key in a .pem file saved as local file in a file named softkey.pem that you want to upload to Azure Key Vault, type the following to import the key from the .PEM file, which protects the key by software in the Key Vault service:

```azurecli-interactive
azure keyvault key import --vault-name 'ContosoKeyVault' --key-name 'ContosoFirstKey' --pem-file './softkey.pem' --password 'PaSSWORD' --destination software
```

You can now reference the key that you created or uploaded to Azure Key Vault, by using its URI. Use  **https://ContosoKeyVault.vault.azure.net/keys/ContosoFirstKey** to always get the current version, and use **https://ContosoKeyVault.vault.azure.net/keys/ContosoFirstKey/cgacf4f763ar42ffb0a1gca546aygd87** to get this specific version.

To add a secret to the vault, which is a password named SQLPassword and that has the value of Pa$$w0rd to Azure Key Vault, type the following:

```azurecli-interactive
azure keyvault secret set --vault-name 'ContosoKeyVault' --secret-name 'SQLPassword' --value 'Pa$$w0rd'
```

You can now reference this password that you added to Azure Key Vault, by using its URI. Use **https://ContosoVault.vault.azure.net/secrets/SQLPassword** to always get the current version, and use **https://ContosoVault.vault.azure.net/secrets/SQLPassword/90018dbb96a84117a0d2847ef8e7189d** to get this specific version.

Let's view the key or secret that you just created:

* To view your key, type: `azure keyvault key list --vault-name 'ContosoKeyVault'`
* To view your secret, type: `azure keyvault secret list --vault-name 'ContosoKeyVault'`

## Register an application with Azure Active Directory

This step would usually be done by a developer, on a separate computer. It is not specific to Azure Key Vault but is included here, for completeness.

> [!IMPORTANT]
> To complete the tutorial, your account, the vault, and the application that you will register in this step must all be in the same Azure Active directory.

Applications that use a key vault must authenticate by using a token from Azure Active Directory. To do this, the owner of the application must first register the application in their Azure Active Directory. At the end of registration, the application owner gets the following values:

- An **Application ID** 
- An **authentication key** (also known as the shared secret). 

The application must present both these values to Azure Active Directory, to get a token. How the application is configured to do this depends on the application. For the [Key Vault sample application](https://www.microsoft.com/download/details.aspx?id=45343), the application owner sets these values in the app.config file.

For detailed steps on registering an application with Azure Active Directory you should review the article titled [Integrating applications with Azure Active Directory](../active-directory/develop/active-directory-integrating-applications.md) or [Use portal to create an Azure Active Directory application and service principal that can access resources](../azure-resource-manager/resource-group-create-service-principal-portal.md)
To register the application in Azure Active Directory:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the left, click **App registrations**. If you don't see app registrations you click on **more services** and find it there.  
    >[!NOTE]
    You must select the same directory that contains the Azure subscription with which you created your key vault. 
3. Click **New application registration**.
4. On the **Create** blade provide a name for your application, and then select **WEB APPLICATION AND/OR WEB API** (the default) and specify the **SIGN-ON URL** for your web application. If you don't have this information at this time, you can make it up for this step (for example, you could specify http://test1.contoso.com ). It does not matter if these sites exist. 

   ![New application registration](./media/key-vault-manage-with-cli/new-application-registration.png)

5. Click the **Create** button.
6. When the app registration is completed you can see the list of registered apps. Find the app that you just registered and click on it.
7. Click on the **Registered app** blade copy the **Application ID**
8. Click on **All settings**
9. On the **Settings** blade click on **keys**
10. Type in a description in the **Key description** box and select a duration, and then click **SAVE**. The page refreshes and now shows a key value. 
11. You will use the **Application ID** and the **Key** information in the next step to set permissions on your vault.

## Authorize the application to use the key or secret
To authorize the application to access the key or secret in the vault, use:

```azurecli-interactive
azure keyvault set-policy
```

For example, if your vault name is ContosoKeyVault and the application you want to authorize has a client ID of 8f8c4bbd-485b-45fd-98f7-ec6300b7b4ed, and you want to authorize the application to decrypt and sign with keys in your vault, then run the following:

```azurecli-interactive
azure keyvault set-policy --vault-name 'ContosoKeyVault' --spn 8f8c4bbd-485b-45fd-98f7-ec6300b7b4ed --perms-to-keys '[\"decrypt\",\"sign\"]'
```

> [!NOTE]
> If you are running on Windows command prompt, you should replace single quotes with double quotes, and also escape the internal double quotes. For example: "[\"decrypt\",\"sign\"]".
> 

If you want to authorize that same application to read secrets in your vault, run the following:

```azurecli-interactive
azure keyvault set-policy --vault-name 'ContosoKeyVault' --spn 8f8c4bbd-485b-45fd-98f7-ec6300b7b4ed --perms-to-secrets '[\"get\"]'
```

## If you want to use a hardware security module (HSM)
For added assurance, you can import or generate keys in hardware security modules (HSMs) that never leave the HSM boundary. The HSMs are FIPS 140-2 Level 2 validated. If this requirement doesn't apply to you, skip this section and go to [Delete the key vault and associated keys and secrets](#delete-the-key-vault-and-associated-keys-and-secrets).

To create these HSM-protected keys, you must have a vault subscription that supports HSM-protected keys.

When you create the keyvault, add the 'sku' parameter:

```azurecli-interactive
azure azure keyvault create --vault-name 'ContosoKeyVaultHSM' --resource-group 'ContosoResourceGroup' --location 'East Asia' --sku 'Premium'
```

You can add software-protected keys (as shown earlier) and HSM-protected keys to this vault. To create an HSM-protected key, set the Destination parameter to 'HSM':

```azurecli-interactive
azure keyvault key create --vault-name 'ContosoKeyVaultHSM' --key-name 'ContosoFirstHSMKey' --destination 'HSM'
```

You can use the following command to import a key from a .pem file on your computer. This command imports the key into HSMs in the Key Vault service:

```azurecli-interactive
azure keyvault key import --vault-name 'ContosoKeyVaultHSM' --key-name 'ContosoFirstHSMKey' --pem-file '/.softkey.pem' --destination 'HSM' --password 'PaSSWORD'
```

The next command imports a “bring your own key" (BYOK) package. This lets you generate your key in your local HSM, and transfer it to HSMs in the Key Vault service, without the key leaving the HSM boundary:

```azurecli-interactive
azure keyvault key import --vault-name 'ContosoKeyVaultHSM' --key-name 'ContosoFirstHSMKey' --byok-file './ITByok.byok' --destination 'HSM'
```

For more detailed instructions about how to generate this BYOK package, see [How to use HSM-Protected Keys with Azure Key Vault](key-vault-hsm-protected-keys.md).

## Delete the key vault and associated keys and secrets
If you no longer need the key vault and the key or secret that it contains, you can delete the key vault by using the azure keyvault delete command:

```azurecli-interactive
azure keyvault delete --vault-name 'ContosoKeyVault'
```

Or, you can delete an entire Azure resource group, which includes the key vault and any other resources that you included in that group:

```azurecli-interactive
azure group delete --name 'ContosoResourceGroup'
```


## Other Azure Cross-Platform Command-line Interface Commands
Other commands that you might useful for managing Azure Key Vault.

This command lists a tabular display of all keys and selected properties:

```azurecli-interactive
azure keyvault key list --vault-name 'ContosoKeyVault'
```

This command displays a full list of properties for the specified key:

```azurecli-interactive
azure keyvault key show --vault-name 'ContosoKeyVault' --key-name 'ContosoFirstKey'
```

This command lists a tabular display of all secret names and selected properties:

```azurecli-interactive
azure keyvault secret list --vault-name 'ContosoKeyVault'
```

Here's an example of how to remove a specific key:

```azurecli-interactive
azure keyvault key delete --vault-name 'ContosoKeyVault' --key-name 'ContosoFirstKey'
```

Here's an example of how to remove a specific secret:

```azurecli-interactive
azure keyvault secret delete --vault-name 'ContosoKeyVault' --secret-name 'SQLPassword'
```


## Next steps
- For programming references, see [the Azure Key Vault developer's guide](key-vault-developers-guide.md).
- For overview information about Azure Key Vault, see [What is Azure Key Vault?](key-vault-whatis.md)
- How to work with Azure Key Vault using Powershell [Azure Key Vault get started](key-vault-get-started.md).


