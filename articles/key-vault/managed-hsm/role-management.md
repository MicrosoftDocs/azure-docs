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

This article covers how to manage roles for a Managed HSM


> [!NOTE]
> Key Vault supports two types of resource: vaults and managed HSMs. This article is about **Managed HSM**. If you want to learn how to manage a vault, please see [Manage Key Vault using the Azure CLI ](../general/manage-with-cli2.md).

For an overview of Managed HSM, see [What is Managed HSM?](overview.md)
If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To use the Azure CLI commands in this article, you must have the following items:

* A subscription to Microsoft Azure. If you don't have one, you can sign up for a [free trial](https://azure.microsoft.com/pricing/free-trial).
* Azure Command-Line Interface version 2.0 or later. To install the latest version, see [Install the Azure CLI](/cli/azure/install-azure-cli).
* An application that will be configured to use the key or password that you create in this article. A sample application is available from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=45343). For instructions, see the included Readme file.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).

To sign in to Azure using the CLI you can type:

```azurecli
az login
```

For more information on login options via the CLI take a look at [sign in with Azure CLI](/cli/azure/authenticate-azure-cli?view=azure-cli-latest)

### Getting help with Azure Cross-Platform Command-Line Interface

This article assumes that you're familiar with the command-line interface (Bash, Terminal, Command prompt).

The --help or -h parameter can be used to view help for specific commands. Alternately, The Azure help [command] [options] format can also be used too. When in doubt about the parameters needed by a command, refer to help. For example, the following commands all return the same information:

```azurecli-interactive
az account set --help
az account set -h
```

You can also read the following articles to get familiar with Azure Resource Manager in Azure Cross-Platform Command-Line Interface:

* [Install Azure CLI](/cli/azure/install-azure-cli)
* [Get started with Azure CLI](/cli/azure/get-started-with-azure-cli)

## List available role definitions

## Create a new role assignment

### Assign roles for all keys 

```azurecli-interactive
az keyvault role assignment create --managed-hsm-name ContosoMHSM --role "Managed HSM Crypto Officer" --assignee user2@contoso.com  --scope /keys
```

### Assign role for a specific key

```azurecli-interactive
az keyvault role assignment create --managed-hsm-name ContosoMHSM --role "Managed HSM Crypto Officer" --assignee user2@contoso.com  --scope /keys/myrsakey
```



## List existing role assignments

I can view role assignments

```azurecli-interactive
az keyvault role assignment list --managed-hsm-name ContosoMHSM
```

OR
```azurecli-interactive
az keyvault role assignment list --managed-hsm-name ContosoMHSM --assignee <user, group, or service principal name>
```

OR

```azurecli-interactive
az keyvault role assignment list --managed-hsm-name ContosoMHSM --assignee <user, group, or service principal name> --scope <HSM or key>
```

OR

```azurecli-interactive
az keyvault role assignment list --managed-hsm-name ContosoMHSM --assignee <user, group, or service principal name> --scope <HSM or key> --role <role id or name>
```


## Delete a role assignment



I can delete role assignments

```azurecli-interactive
az keyvault role assignment delete --managed-hsm-name ContosoMHSM --role <role name or id> --assignee <user, group, or service principal name> --scope <HSM or key>
```

OR

```azurecli-interactive
az keyvault role assignment delete --managed-hsm-name ContosoMHSM --ids <role assignment IDs>
```

## Next steps

- For complete Azure CLI reference for key vault commands, see [Key Vault CLI reference](/cli/azure/keyvault).

- For programming references, see [the Azure Key Vault developer's guide](key-vault-developers-guide.md)

- For information on Azure Key Vault and HSMs, see [How to use HSM-Protected Keys with Azure Key Vault](key-vault-hsm-protected-keys.md).
