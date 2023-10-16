---
title: Tutorial - Use Azure Key Vault with a virtual machine in JavaScript | Microsoft Docs
description: In this tutorial, you configure a virtual machine a JavaScript application to read a secret from your key vault.
author: msmbaldwin
ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 12/10/2021
ms.author: mbaldwin
ms.devlang: javascript
ms.custom: mvc, devx-track-js, devx-track-azurecli, devx-track-azurepowershell
# Customer intent: As a developer I want to use Azure Key vault to store secrets for my app, so that they are kept secure.
---

# Tutorial: Use Azure Key Vault with a virtual machine in JavaScript

Azure Key Vault helps you to protect keys, secrets, and certificates, such as API keys and database connection strings.

In this tutorial, you set up a Node.js application to read information from Azure Key Vault by using managed identities for Azure resources. You learn how to:

> [!div class="checklist"]
> * Create a key vault
> * Store a secret in Key Vault
> * Create an Azure Linux virtual machine
> * Enable a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) for the virtual machine
> * Grant the required permissions for the console application to read data from Key Vault
> * Retrieve a secret from Key Vault

Before you begin, read [Key Vault basic concepts](basic-concepts.md). 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Prerequisites

For Windows, Mac, and Linux:
  * [Git](https://git-scm.com/downloads)
  * This tutorial requires that you run the Azure CLI locally. You must have the Azure CLI version 2.0.4 or later installed. Run `az --version` to find the version. If you need to install or upgrade the CLI, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli).

## Log in to Azure

To log in to Azure by using the Azure CLI, enter:

```azurecli
az login
```

## Create a resource group and key vault

[!INCLUDE [Create a resource group and key vault](../../../includes/key-vault-rg-kv-creation.md)]

## Populate your key vault with a secret

[!INCLUDE [Create a secret](../../../includes/key-vault-create-secret.md)]

## Create a virtual machine

Create a VM called **myVM** using one of the following methods:

| Linux | Windows |
|--|--|
| [Azure CLI](../../virtual-machines/linux/quick-create-cli.md) | [Azure CLI](../../virtual-machines/windows/quick-create-cli.md) |
| [PowerShell](../../virtual-machines/linux/quick-create-powershell.md) | [PowerShell](../../virtual-machines/windows/quick-create-powershell.md) |
| [Azure portal](../../virtual-machines/linux/quick-create-portal.md) | [The Azure portal](../../virtual-machines/windows/quick-create-portal.md) |

To create a Linux VM using the Azure CLI, use the [az vm create](/cli/azure/vm) command.  The following example adds a user account named *azureuser*. The `--generate-ssh-keys` parameter is used to automatically generate an SSH key, and put it in the default key location (*~/.ssh*). 

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --image Ubuntu2204 \
  --admin-username azureuser \
  --generate-ssh-keys
```

Note the value of `publicIpAddress` in the output.

## Assign an identity to the VM

Create a system-assigned identity for the virtual machine by using the Azure CLI [az vm identity assign](/cli/azure/vm/identity#az-vm-identity-assign) command:

```azurecli
az vm identity assign --name "myVM" --resource-group "myResourceGroup"
```

Note the system-assigned identity that's displayed in the following code. The output of the preceding command would be: 

```output
{
  "systemAssignedIdentity": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "userAssignedIdentities": {}
}
```

## Assign permissions to the VM identity

Now you can assign the previously created identity permissions to your key vault by running the following command:

```azurecli
az keyvault set-policy --name "<your-unique-keyvault-name>" --object-id "<systemAssignedIdentity>" --secret-permissions get list
```

## Log in to the VM

To sign in to the virtual machine, follow the instructions in [Connect and sign in to an Azure virtual machine running Linux](../../virtual-machines/linux-vm-connect.md) or [Connect and sign in to an Azure virtual machine running Windows](../../virtual-machines/windows/connect-logon.md).


To log into a Linux VM, you can use the ssh command with the \<publicIpAddress\> given in the [Create a virtual machine](#create-a-virtual-machine) step:

```terminal
ssh azureuser@<PublicIpAddress>
```

## Install Node.js and npm libraries on the VM

On the virtual machine, install the two npm libraries we'll be using in our JavaScript script: [@azure/keyvault-secrets](https://www.npmjs.com/package/@azure/keyvault-secrets) and [@azure/identity](https://www.npmjs.com/package/@azure/identity).  

1. In the SSH terminal, install Node.js and npm with the following commands:

    ```bash
    curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash - && \
        sudo apt-get install -y nodejs
    ```

1. Create an app directory and initialize the Node.js package:

    ```bash
    mkdir app && cd app && npm init -y
    ```

1. Install the Azure service packages using `npm`:

    ```bash
    npm install @azure/keyvault-secrets @azure/identity
    ```

## Create and edit the sample JavaScript file

1. On the virtual machine in the `app` directory, create a JavaScript file called **index.js**. 

    ```bash
    touch index.js
    ```

1. Open the file with the [Nano](https://www.nano-editor.org/dist/latest/cheatsheet.html) text editor:

    ```bash
    nano index.js
    ```

1. Copy the following code, replacing \<your-unique-keyvault-name\> with the name of your key vault, and paste into the Nano editor:

    ```javascript
    // index.js
    
    const { SecretClient } = require("@azure/keyvault-secrets");
    const { DefaultAzureCredential } = require("@azure/identity");
    
    // Your Azure Key Vault name and secret name
    const keyVaultName = "<your-unique-keyvault-name>";
    const keyVaultUri = `https://${keyVaultName}.vault.azure.net`;
    const secretName = "mySecret";
    
    // Authenticate to Azure
    const credential = new DefaultAzureCredential();
    const client = new SecretClient(keyVaultUri, credential);
    
    // Get Secret with Azure SDK for JS
    const getSecret = async (secretName) => {
    
        return (await client.getSecret(secretName)).value;
    }
    
    getSecret(secretName).then(secretValue => {
        console.log(`The value of secret '${secretName}' in '${keyVaultName}' is: '${secretValue}'`);
    }).catch(err => {
        console.log(err);
    })
    ```

1. Save the file with <kbd>Ctrl</kbd> + <kbd>x</kbd>. 
1. When asked `Save modified buffer?`, enter <kbd>y</kbd>.
1. When asked `File Name to Write: index.js`, enter <kbd>Enter</kbd>.

## Run the sample Node.js app

Lastly, run **index.js**. If all has gone well, it should return the value of your secret:

```bash
node index.js

The value of secret 'mySecret' in '<your-unique-keyvault-name>' is: 'Success!'
```

## Clean up resources

When they are no longer needed, delete the virtual machine and your key vault.  You can do this quickly by simply deleting the resource group to which they belong:

```azurecli
az group delete -g myResourceGroup
```

## Next steps

[Azure Key Vault REST API](/rest/api/keyvault/)
