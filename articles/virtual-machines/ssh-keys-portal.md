---
title: Create SSH keys in the Azure portal 
description: Learn how to generate and store SSH keys in the Azure portal for connecting the Linux VMs.
author: cynthn
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: article
ms.date: 07/10/2020
ms.author: cynthn

---

# Generate and store SSH keys in the Azure portal

You can create and reuse SSH keys in the Azure portal. You can create a SSH keys when you first create a VM, and reuse them for other VMs. You can also create SSH keys separately, so that you have a set of keys stored in Azure to fit your organizations needs. And, if you have existing keys and you want to simplify using the with Azure VMs, you can upload them and store them in Azure for reuse.


************ Portal currently links to https://docs.microsoft.com/en-us/azure/virtual-machines/linux/create-ssh-keys-detailed from the SSH thing using this fwlink: https://go.microsoft.com/fwlink/?linkid=2118349  Owners are listed as mdepiet;arunrab;venkatb.**********


SSH is an encrypted connection protocol that allows secure sign-ins over unsecured connections. SSH is the default connection protocol for Linux VMs hosted in Azure. Although SSH itself provides an encrypted connection, using passwords with SSH connections still leaves the VM vulnerable to brute-force attacks or guessing of passwords. A more secure and preferred method of connecting to a VM using SSH is by using a public-private key pair, also known as SSH keys.

The public key is stored in Azure. The private key remains on your local system. Protect this private key. Do not share it.


## Generate new keys

1. Open the [Azure portal](https://portal.azure.com.

1. At the top of the page, type *SSH* to search. Under **Marketplace*, select **SSH keys**.

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

For example, type: `ssh -i /Downloads/mySSHKey.pem azureuser@123.45.67.8901`

## Upload an SSH key

You can also upload a public SSH key to store in Azure. For information about how to create an SSH key pair, see XXXXXXXX.

1. Open the [Azure portal](https://portal.azure.com.

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

## Next steps

To learn more about using SSH keys with Azure VMs, see 