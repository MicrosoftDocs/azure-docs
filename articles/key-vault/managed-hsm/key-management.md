---
title: Manage a Managed HSM using CLI - Azure Key Vault | Microsoft Docs
description: Use this article to automate common tasks in Key Vault by using the Azure CLI 
services: key-vault
author: amitbapat
manager: msmbaldwin

ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: tutorial
ms.date: 09/15/2020
ms.author: ambapat

---
# Manage a Managed HSM using the Azure CLI 


> [!NOTE] Key Vault supports two types of resource: vaults and managed HSMs. This article is about **Managed HSM**. If you want to learn how to manage a vault, please see [Manage Key Vault using the Azure CLI ](../general/manage-with-cli2.md).

For an overview of Managed HSM, see [What is Managed HSM?](overview.md)
If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To use the Azure CLI commands in this article, you must have the following items:

* A subscription to Microsoft Azure. If you don't have one, you can sign up for a [free trial](https://azure.microsoft.com/pricing/free-trial).
* Azure Command-Line Interface version 2.0 or later. To install the latest version, see [Install the Azure CLI](/cli/azure/install-azure-cli).
* An application that will be configured to use the key or password that you create in this article. A sample application is available from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=45343). For instructions, see the included Readme file.

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

## Create an HSM key

### Create an RSA key

The example below shows how to create a 3070-bit **RSA** key that will be only used for **get, wrap, unwrap** operations (--ops).

```azurecli
az keyvault key create --hsm-name ContosoMHSM --name myrsakey --ops get wrap unwrap --expires <expiry date and time> --not-before <active date and time> --tags ‘tag1[=value1] tag2[=value2]’ --kty RSA-HSM
```

Note, that the `get` operation only returns the public key and key attributes. It does not return the private key (in case of asymmetric key), or the key material (in case of symmetric key).


### Create an EC key

The example below shows how to create an **EC** key with P-256 curve that will be only used for **sign and verify** operations (--ops) and has two tags, **usage** and **appname**. Tags help you add additional metadata to the key for tracking and managing.


```azurecli
az keyvault key create --hsm-name ContosoMHSM --name myec256key --ops sign verify  --tags ‘usage=signing] appname=myapp’ --kty EC-HSM --curve P-256
```

### Create a 256-bit symmetric key

The example below shows how to create a 3070-bit **symmetric** key that will be only used for **encrypt and decrypt** operations (--ops).

```azurecli
az keyvault key create --hsm-name ContosoMHSM --name myaeskey --ops encrypt decrypt  --tags --kty oct-HSM --size 256
```


## View key attributes and tags

Use following command to view attributes, versions and tags for a key.

```azurecli
az keyvault key show --hsm-name ContosoHSM --name myrsakey

```
You can also use the full key URI like this
```azurecli

az keyvault key show --id https://ContosoMHSM.managedhsm.azure.net/keys/myrsakey

```





## Next steps

- For complete Azure CLI reference for key vault commands, see [Key Vault CLI reference](/cli/azure/keyvault).

- For programming references, see [the Azure Key Vault developer's guide](key-vault-developers-guide.md)

- For information on Azure Key Vault and HSMs, see [How to use HSM-Protected Keys with Azure Key Vault](key-vault-hsm-protected-keys.md).
