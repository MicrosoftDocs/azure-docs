---
title: Create SSH keys in the Azure portal 
description: Learn how to generate and store SSH keys in the Azure portal for connecting the Linux VMs.
author: mattmcinnes
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: article
ms.date: 04/27/2023
ms.author: mattmcinnes

---

# Generate and store SSH keys in the Azure portal

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

If you frequently use the portal to deploy Linux VMs, you can simplify using SSH keys by integrating them into Azure. There are several ways to create SSH keys for use with Azure. 

- You can create SSH keys when you first create a VM. Your keys aren't tied to a specific VM and you can use them in future applications.

- You can create SSH keys in the Azure portal separate from a VM. You can use them with both new and old VMs.

- You can create SSH keys externally and upload them for use in Azure.

You can reuse your stored keys in various of applications to fit your organization's needs. 

For more detailed information about creating and using SSH keys with Linux VMs, see [Use SSH keys to connect to Linux VMs](./linux/ssh-from-windows.md).

## Generate new keys

1. Open the [Azure portal](https://portal.azure.com).

1. At the top of the page, type *SSH* to search. Under **Marketplace**, select **SSH keys**.

1. On the **SSH Key** page, select **Create**.

   :::image type="content" source="./media/ssh-keys/portal-sshkey.png" alt-text="Create a new resource group and generate an SSH key pair":::

1. In **Resource group** select **Create new** to create a new resource group to store your keys. Type a name for your resource group and select **OK**.

1. In **Region** select a region to store your keys. You can use the keys in any region, this option is just the region where you store them.

1. Type a name for your key in **Key pair name**.

1. In **SSH public key source**, select **Generate public key source**. 

1. When you're done, select **Review + create**.

1. After it passes validation, select **Create**.

1. You'll get a pop-up window to, select **Download private key and create resource** that downloads the SSH key as a .pem file.

   :::image type="content" source="./media/ssh-keys/download-key.png" alt-text="Download the private key as a .pem file":::

1. Once you've downloaded the .pem file, you might want to move it somewhere on your computer where it's easy to point to from your SSH client.


## Connect to the VM

On your local computer, open a PowerShell prompt and type:

```powershell
ssh -i <path to the .pem file> username@<ipaddress of the VM>
```

For example, type: `ssh -i /Downloads/mySSHKey.pem azureuser@123.45.67.890` and replace the example IP address at the end of the command with your VM's [public IP address](/azure/virtual-network/ip-services/public-ip-addresses).

## Upload an SSH key

You can also upload a public SSH key to store in Azure. For information about how to create an SSH key pair, see [Use SSH keys to connect to Linux VMs](./linux/ssh-from-windows.md).

1. Open the [Azure portal](https://portal.azure.com).

1. At the top of the page, type *SSH* to search. Under **Marketplace*, select **SSH keys**.

1. On the **SSH Key** page, select **Create**.

   :::image type="content" source="./media/ssh-keys/upload.png" alt-text="Upload an SSH public key to be stored in Azure":::

1. In **Resource group** select **Create new** to create a new resource group to store your keys. Type a name for your resource group and select **OK**.

1. In **Region** select a region to store your keys. You can use the keys in any region, this option is just the region where they're stored.

1. Type a name for your key in **Key pair name**.

1. In **SSH public key source**, select **Upload existing public key**. 

1. Paste the full contents of the public key into **Upload key** and then select **Review + create**.

1. After validation completes, select **Create**. 

Once you upload the key, you can choose to use it when you create a VM.

## List keys

Azure stores your SSH keys created in the portal as resources, so you can filter your resources view to see all of them.

1. In the portal, select **All resource**.
1. In the filters, select **Type**, unselect the **Select all** option to clear the list.
1. Type **SSH** in the filter and select **SSH key**.

   :::image type="content" source="./media/ssh-keys/filter.png" alt-text="Screenshot of how to filter the list to see all of your SSH keys.":::

## Get the public key

If you need your public key, you can easily copy it from the portal page for the key. Just list your keys (using the process in the last section) then select a key from the list. The page for your key opens and you can click the **Copy to clipboard** icon next to the key to copy it.

## Next steps

To learn more about using SSH keys with Azure VMs, see [Use SSH keys to connect to Linux VMs](./linux/ssh-from-windows.md).
