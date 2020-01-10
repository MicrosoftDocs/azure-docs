---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 01/06/2020
 ms.author: rogarana
 ms.custom: include file
---
### Portal

Setting up customer-managed keys for your disks will require you to create resources in a particular order, if you're doing it for the first time. First, you will need to create and setup an Azure Key Vault.

#### Setting up your Azure Key Vault

1. Sign into the Azure portal and search for Key Vault
1. Search for and select **Key Vaults**.

![sse-key-vault-portal-search.png](media/virtual-machines-disk-encryption-portal/sse-key-vault-portal-search.png)

1. Select **+Add** to create a new Key Vault.
1. Create a new resource group
1. Enter a key vault name, select a region, and select a pricing tier.
1. Select **Review + Create**, verify your choices, then select **Create**.

<image>

1. Once your key vault finishes deploying, select it.
1. Select **Keys** under **Settings**.
1. Select **Generate/Import**
1. Fill in the selections as you like and then select **Create**.

#### Setting up your disk encryption set

Disk encryption sets are only available through [this link](https://aka.ms/diskencryptionsets). They cannot yet be searched in the portal.

1. Open the [disk encryption sets link](https://aka.ms/diskencryptionsets).
1. Select **+Add**.

<Image>

1. Select your resource group, name your encryption set, and select the same region as your key vault.
1. Select **Key vault and key**.

<Image>

1. Select the key vault and key you created previously, as well as the version.
1. Press **Select**.
1. Select **Review + Create** and then **Create**.
1. Open the disk encryption set once it finishes creating and select the alert that pops up.
     Two notifications should pop up and succeed. Doing this will allow you to use the set with your key vault.

#### Deploy a VM

Now that you've created and set up your key vault and the disk encryption set, you can deploy a VM using the encryption.
The VM deployment process is similar to the standard deployment process, the only differences are that you need to deploy the VM in the same region as your other resources and you opt to use a customer managed key.

1. 