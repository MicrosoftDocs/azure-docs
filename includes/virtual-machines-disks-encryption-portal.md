---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 01/10/2020
 ms.author: rogarana
 ms.custom: include file
---
### Portal

Setting up customer-managed keys for your disks will require you to create resources in a particular order, if you're doing it for the first time. First, you will need to create and set up an Azure Key Vault.

#### Setting up your Azure Key Vault

1. Sign into the [Azure portal](https://portal.azure.com/) and search for Key Vault
1. Search for and select **Key Vaults**.

![sse-key-vault-portal-search.png](media/virtual-machines-disk-encryption-portal/sse-key-vault-portal-search.png)

> [!IMPORTANT]
> Your Azure key vault, disk encryption set, VM, disks, and snapshots must all be in the same region and subscription for deployment to succeed.

1. Select **+Add** to create a new Key Vault.
1. Create a new resource group
1. Enter a key vault name, select a region, and select a pricing tier.
1. Select **Review + Create**, verify your choices, then select **Create**.

![sse-create-a-key-vault.png](media/virtual-machines-disk-encryption-portal/sse-create-a-key-vault.png)

1. Once your key vault finishes deploying, select it.
1. Select **Keys** under **Settings**.
1. Select **Generate/Import**

![sse-key-vault-generate-settings.png](media/virtual-machines-disk-encryption-portal/sse-key-vault-generate-settings.png)

1. Keep both **Key Type** set to **RSA** and **RSA Key Size** set to **2080**.
1. Fill in the remaining selections as you like and then select **Create**.

![sse-create-a-key-generate.png](media/virtual-machines-disk-encryption-portal/sse-create-a-key-generate.png)

#### Setting up your disk encryption set

To create and configure disk encryption sets, you must use the following link: https://aka.ms/diskencryptionsets. Disk encryption set creation is not yet available in the public Azure portal.

1. Open the [disk encryption sets link](https://aka.ms/diskencryptionsets).
1. Select **+Add**.

![sse-create-disk-encryption-set.png](media/virtual-machines-disk-encryption-portal/sse-create-disk-encryption-set.png)

1. Select your resource group, name your encryption set, and select the same region as your key vault.
1. Select **Key vault and key**.
1. Select the key vault and key you created previously, as well as the version.
1. Press **Select**.
1. Select **Review + Create** and then **Create**.

![sse-disk-enc-set-blade-key.png](media/virtual-machines-disk-encryption-portal/sse-disk-enc-set-blade-key.png)

1. Open the disk encryption set once it finishes creating and select the alert that pops up.

![sse-disk-enc-alert-fix.png](media/virtual-machines-disk-encryption-portal/sse-disk-enc-alert-fix.png)

Two notifications should pop up and succeed. Doing this will allow you to use the set with your key vault.

![disk-enc-notification-success.png](media/virtual-machines-disk-encryption-portal/disk-enc-notification-success.png)

#### Deploy a VM

Now that you've created and set up your key vault and the disk encryption set, you can deploy a VM using the encryption.
The VM deployment process is similar to the standard deployment process, the only differences are that you need to deploy the VM in the same region as your other resources and you opt to use a customer managed key.

1. Search for **Virtual Machines** and select **+ Add** to create a VM.
1. On the **Basic** tab, select the same region as your disk encryption set and Azure Key Vault.
1. Fill in the other values on the **Basic** tab as you like.

![sse-create-a-vm-region.png](media/virtual-machines-disk-encryption-portal/sse-create-a-vm-region.png)

1. On the **Disks** tab, select **Encryption at rest with customer-managed key**.
1. Select your disk encryption set in the **Disk encryption set** drop-down.
1. Make the remaining selections as you like.

![sse-create-vm-select-cmk-encryption-set.png](media/virtual-machines-disk-encryption-portal/sse-create-vm-select-cmk-encryption-set.png)