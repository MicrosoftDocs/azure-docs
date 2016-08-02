<properties
    pageTitle="Create a Linux VM using the Azure Portal | Microsoft Azure"
    description="Create a Linux VM using the Azure Portal."
    services="virtual-machines-linux"
    documentationCenter=""
    authors="vlivech"
    manager="timlt"
    editor=""
    tags="azure-resource-manager"
/>

<tags
    ms.service="virtual-machines-linux"
    ms.workload="infrastructure-services"
    ms.tgt_pltfrm="vm-linux"
    ms.devlang="na"
    ms.topic="hero-article"
    ms.date="04/29/2016"
    ms.author="v-livech"
/>

# Create a Linux VM on Azure using the Portal

This article shows how to use the [Azure Portal](https://portal.azure.com/) to create a Linux Virtual Machine quickly. The only requirements are [an Azure account](https://azure.microsoft.com/pricing/free-trial/) and [SSH public and private key files](virtual-machines-linux-mac-create-ssh-keys.md).

> [AZURE.NOTE] If you choose to use a password to secure access to your VM, the password must be greater than 12 characters, and have at least one upper case character, at least one lowercase character, at least one special character, and at least one number. 


1. Signed into the Azure Portal with your Azure account identity, click **+ New** in the upper left corner:

    ![screen1](../media/virtual-machines-linux-quick-create-portal/screen1.png)

2. Click **Virtual Machines** in the **Marketplace** then **Ubuntu Server 14.04 LTS** from the **Featured Apps** images list.  Verify at the bottom that the deployment model is `Resource Manager` and then click **Create**.

    ![screen2](../media/virtual-machines-linux-quick-create-portal/screen2.png)

3. On the **Basics** page, enter:
    - a name for the VM
    - a username for the Admin User
    - the Authentication Type set to **SSH public key**
    - your SSH public Key as a string (by default, from your `~/.ssh/` directory)
    - a resource group name (to create a new deployment group) or select an existing group

    and Click **OK** to continue and choose the VM size; it should look something like the following:

    ![screen3](../media/virtual-machines-linux-quick-create-portal/screen3.png)

4. Choose the **DS1** size, which installs Ubuntu on a Premium SSD, and click **Select** to configure settings.

    ![screen4](../media/virtual-machines-linux-quick-create-portal/screen4.png)

5. In **Settings**, leave the defaults for Storage and Network values, and click **OK** to view the summary.  Notice the disk type has been set to Premium SSD by choosing DS1, the **S** notates SSD.

    ![screen5](../media/virtual-machines-linux-quick-create-portal/screen5.png)

6. Confirm the settings for your new Ubuntu VM, and click **OK**.

    ![screen6](../media/virtual-machines-linux-quick-create-portal/screen6.png)

7. Open the Portal Dashboard and in **Network interfaces** choose your NIC

    ![screen7](../media/virtual-machines-linux-quick-create-portal/screen7.png)

8. Open the Public IP addresses menu under the NIC settings

    ![screen8](../media/virtual-machines-linux-quick-create-portal/screen8.png)

9. SSH into the public IP using your SSH public key

```
ssh -i ~/.ssh/azure_id_rsa ubuntu@13.91.99.206
```

## Next Steps

Now you've created a Linux VM quickly to use for testing or demonstration purposes. To create a Linux VM customized for your infrastructure you can follow any of the articles below.

- [Create a Linux VM on Azure using Templates](virtual-machines-linux-cli-deploy-templates.md)
- [Create a SSH Secured Linux VM on Azure using Templates](virtual-machines-linux-create-ssh-secured-vm-from-template.md)
- [Create a Linux VM using the Azure CLI](virtual-machines-linux-create-cli-complete.md)

Those articles will get you started in building an Azure infrastructure as well as any number of proprietary and open-source infrastructure deployment, configuration, and orchestration tools.
