---
title: Create SSH keys  
description: Learn how to generate and store SSH keys in the Azure portal or with Azure CLI for connecting Linux VMs.
author: cynthn
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: article
ms.date: 09/01/2021
ms.author: cynthn

---

# Generate and store SSH keys 

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

You can create SSH keys when you first create a VM, and reuse them for other VMs. Or, you can create SSH keys separately, so that you have a set of keys stored in Azure to fit your organizations needs. 

If you have existing keys and you want to simplify using them, you can upload them and store them in Azure for reuse.

For a more detailed overview of SSH, see [Detailed steps: Create and manage SSH keys for authentication to a Linux VM in Azure](./linux/create-ssh-keys-detailed.md).

For more detailed information about creating and using SSH keys with Linux VMs, see [Use SSH keys to connect to Linux VMs](./linux/ssh-from-windows.md).

## Generate new keys

### [Portal](#tab/azure-portal)

1. Open the [Azure portal](https://portal.azure.com).

1. At the top of the page, type *SSH* to search. Under **Marketplace**, select **SSH keys**.

1. On the **SSH Key** page, select **Create**.

   :::image type="content" source="./media/ssh-keys/portal-sshkey.png" alt-text="Create a new resource group and generate an SSH key pair":::

1. In **Resource group** select **Create new** to create a new resource group to store your keys. Type a name for your resource group and select **OK**.

1. In **Region** select a region to store your keys. You can use the keys in any region, this is just the region where they will be stored.

1. Type a name for your key in **Key pair name**.

1. In **SSH public key source**, select **Generate public key source**. 

1. When you are done, select **Review + create**.

1. After it passes validation, select **Create**.

1. You will then get a pop-up window to, select **Download private key and create resource**. This will download the SSH key as a .pem file.

   :::image type="content" source="./media/ssh-keys/download-key.png" alt-text="Download the private key as a .pem file":::

1. Once the .pem file is downloaded, you might want to move it somewhere on your computer where it is easy to point to from your SSH client.

### [Azure CLI](#tab/azure-cli)

Start by preparing your environment for the Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../includes/azure-cli-prepare-your-environment-no-header.md)]

1. After you sign in, use the [az sshkey create](/cli/azure/sshkey#az_sshkey_create) command to create the new SSH key:

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

---

## Connect to the VM

### [Azure PowerShell](#tab/azure-powershell2)

On your local computer, open a PowerShell prompt and enter:

```powershell
ssh -identity_file <path to the .pem file> username@<ipaddress of the VM>
```

For example, enter: `ssh -i /Downloads/mySSHKey.pem azureuser@123.45.67.890`

### [Azure CLI](#tab/azure-cli2)

On your local computer, open a Bash prompt:

```azurecli
ssh -identity_file <path to the private key file> username@<ipaddress of the VM>
```

For example, enter: `ssh -i /home/user/.ssh/mySSHKey azureuser@123.45.67.890`

---

## Upload an SSH key

You can also upload a public SSH key to store in Azure. For information about how to create an SSH key pair, see [Use SSH keys to connect to Linux VMs](./linux/ssh-from-windows.md).

### [Portal](#tab/azure-portal)

1. Open the [Azure portal](https://portal.azure.com).

1. At the top of the page, type *SSH* to search. Under **Marketplace**, select **SSH keys**.

1. On the **SSH Key** page, select **Create**.

   :::image type="content" source="./media/ssh-keys/upload.png" alt-text="Upload an SSH public key to be stored in Azure":::

1. In **Resource group** select **Create new** to create a new resource group to store your keys. Type a name for your resource group and select **OK**.

1. In **Region** select a region to store your keys. You can use the keys in any region, this is just the region where they will be stored.

1. Type a name for your key in **Key pair name**.

1. In **SSH public key source**, select **Upload existing public key**. 

1. Paste the full contents of the public key into **Upload key** and then select **Review + create**.

1. After validation completes, select **Create**. 

Once the key has been uploaded, you can choose to use it when you create a VM.

### [Azure CLI](#tab/azure-cli)

Use the [az sshkey ???](/cli/azure/sshkey#az_sshkey_???) command to upload an SSH public key:

Use the [az storage file upload](/cli/azure/storage/file?view=azure-cli-latest#az_storage_file_upload) command to upload an SSH public key:

```azurecli
az sshkey ??? --name "mySSHKey" --resource-group "myResourceGroup"
az storage file upload --share-name "myShare" --source <path to the public key file>
```

---

## List keys

### [Portal](#tab/azure-portal)

SSH keys created in the portal are stored as resources, so you can filter your resources view to see all of them.

1. In the portal, select **All resource**.
1. In the filters, select **Type**, unselect the **Select all** option to clear the list.
1. Type **SSH** in the filter and select **SSH key**.

   :::image type="content" source="./media/ssh-keys/filter.png" alt-text="Screenshot of how to filter the list to see all of your SSH keys.":::

### [Azure CLI](#tab/azure-cli)

Use the [az sshkey list](/cli/azure/sshkey#az_sshkey_list) command to list all public SSH keys, optionally specifying a resource group:

```azurecli
az sshkey list --resource-group "myResourceGroup"
```

---

## Get the public key

### [Portal](#tab/azure-portal)

If you need your public key, you can easily copy it from the portal page for the key. Just list your keys (using the process in the last section) then select a key from the list. The page for your key will open and you can click the **Copy to clipboard** icon next to the key to copy it.

### [Azure CLI](#tab/azure-cli)

Use the [az sshkey show](/cli/azure/sshkey#az_sshkey_show) command to show the values of a public SSH key:

```azurecli
az sshkey show --name "mySSHKey" --resource-group "myResourceGroup"
```

---

## Next steps

To learn more about using SSH keys with Azure VMs, see [Use SSH keys to connect to Linux VMs](./linux/ssh-from-windows.md).
