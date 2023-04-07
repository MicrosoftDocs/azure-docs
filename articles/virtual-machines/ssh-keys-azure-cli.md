---
title: Create SSH keys with the Azure CLI
description: Learn how to generate and store SSH keys with the Azure CLI for connecting to Linux VMs.
author: cynthn
ms.collection: linux
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.custom: devx-track-azurecli
ms.topic: article
ms.date: 11/17/2021
ms.author: cynthn
---

# Generate and store SSH keys with the Azure CLI

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

You can create SSH keys before creating a VM, and store them in Azure. Each newly created SSH key is also stored locally.

If you have existing SSH keys, you can upload and store them in Azure for reuse.

For a more detailed overview of SSH, see [Detailed steps: Create and manage SSH keys for authentication to a Linux VM in Azure](./linux/create-ssh-keys-detailed.md).

For more detailed information about creating and using SSH keys with Linux VMs, see [Use SSH keys to connect to Linux VMs](./linux/ssh-from-windows.md).

## Generate new keys

1. After you sign in, use the [az sshkey create](/cli/azure/sshkey#az-sshkey-create) command to create the new SSH key:

    ```azurecli
    az sshkey create --name "mySSHKey" --resource-group "myResourceGroup"
   ```

1. The resulting output lists the new key files' paths:

    ```azurecli
    Private key is saved to "/home/user/.ssh/7777777777_9999999".
    Public key is saved to "/home/user/.ssh/7777777777_9999999.pub".
   ```

1. Change the permissions for the private key file for privacy:

    ```azurecli
    chmod 600 /home/user/.ssh/7777777777_9999999
    ```

## Connect to the VM

On your local computer, open a Bash prompt:

```azurecli
ssh -identity_file <path to the private key file> username@<ipaddress of the VM>
```

For example, enter: `ssh -i /home/user/.ssh/mySSHKey azureuser@123.45.67.890`

## Upload an SSH key

You can upload a public SSH key to store in Azure. 

Use the [az sshkey create](/cli/azure/sshkey#az-sshkey-create) command to upload an SSH public key by specifying its file:

```azurecli
az sshkey create --name "mySSHKey" --public-key "@/home/user/.ssh/7777777777_9999999.pub" --resource-group "myResourceGroup"
```

## List keys

Use the [az sshkey list](/cli/azure/sshkey#az-sshkey-list) command to list all public SSH keys, optionally specifying a resource group:

```azurecli
az sshkey list --resource-group "myResourceGroup"
```

## Get the public key

Use the [az sshkey show](/cli/azure/sshkey#az-sshkey-show) command to show the values of a public SSH key:

```azurecli
az sshkey show --name "mySSHKey" --resource-group "myResourceGroup"
```

## Next steps

To learn more about using SSH keys with Azure VMs, see [Use SSH keys to connect to Linux VMs](./linux/ssh-from-windows.md).
