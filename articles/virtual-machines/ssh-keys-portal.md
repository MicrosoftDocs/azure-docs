---
title: Create SSH keys in the Azure portal 
description: Learn how to generate and store SSH keys in the Azure portal for connecting the Linux VMs.
author: cynthn
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: article
ms.date: 08/25/2020
ms.author: cynthn

---

# Generate and store SSH keys in the Azure portal

If you frequently use the portal to deploy Linux VMs, you can make using SSH keys simpler by creating them directly in the portal, or uploading them from your computer.

You can create a SSH keys when you first create a VM, and reuse them for other VMs. Or, you can create SSH keys separately, so that you have a set of keys stored in Azure to fit your organizations needs. 

If you have existing keys and you want to simplify using them in the portal, you can upload them and store them in Azure for reuse.

For more detailed information about creating and using SSH keys with Linux VMs, see [Use SSH keys to connect to Linux VMs](./linux/ssh-from-windows.md).

## Generate new keys

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


## Connect to the VM

On your local computer, open a PowerShell prompt and type:

```powershell
ssh -i <path to the .pem file> username@<ipaddress of the VM>
```

For example, type: `ssh -i /Downloads/mySSHKey.pem azureuser@123.45.67.890`


## Upload an SSH key

You can also upload a public SSH key to store in Azure. For information about how to create an SSH key pair, see [Use SSH keys to connect to Linux VMs](./linux/ssh-from-windows.md).

1. Open the [Azure portal](https://portal.azure.com).

1. At the top of the page, type *SSH* to search. Under **Marketplace*, select **SSH keys**.

1. On the **SSH Key** page, select **Create**.

   :::image type="content" source="./media/ssh-keys/upload.png" alt-text="Upload an SSH public key to be stored in Azure":::

1. In **Resource group** select **Create new** to create a new resource group to store your keys. Type a name for your resource group and select **OK**.

1. In **Region** select a region to store your keys. You can use the keys in any region, this is just the region where they will be stored.

1. Type a name for your key in **Key pair name**.

1. In **SSH public key source**, select **Upload existing public key**. 

1. Paste the full contents of the public key into **Upload key** and then select **Review + create**.

1. After validation completes, select **Create**. 

Once the key has been uploaded, you can choose to use it when you create a VM.

## List keys

SSH keys created in the portal are stored as resources, so you can filter your resources view to see all of them.

1. In the portal, select **All resource**.
1. In the filters, select **Type**, unselect the **Select all** option to clear the list.
1. Type **SSH** in the filter and select **SSH key**.

   :::image type="content" source="./media/ssh-keys/filter.png" alt-text="Screenshot of how to filter the list to see all of your SSH keys.":::

## Get the public key

If you need your public key, you can easily copy it from the portal page for the key. Just list your keys (using the process in the last section) then select a key from the list. The page for your key will open and you can click the **Copy to clipboard** icon next to the key to copy it.

## Next steps

To learn more about using SSH keys with Azure VMs, see [Use SSH keys to connect to Linux VMs](./linux/ssh-from-windows.md).
