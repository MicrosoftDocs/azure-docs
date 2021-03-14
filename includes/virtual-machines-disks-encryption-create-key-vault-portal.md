---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 03/23/2020
 ms.author: rogarana
 ms.custom: include file
---
Setting up customer-managed keys for your disks will require you to create resources in a particular order, if you're doing it for the first time. First, you will need to create and set up an Azure Key Vault.

## Set up your Azure Key Vault

1. Sign into the [Azure portal](https://aka.ms/diskencryptionupdates).
1. Search for and select **Key Vaults**.

    [![Screenshot of the Azure portal with the search dialog box expanded.](./media/virtual-machines-disk-encryption-portal/server-side-encryption-key-vault-portal-search.png)](./media/virtual-machines-disk-encryption-portal/sever-side-encryption-key-vault-portal-search-expanded.png#lightbox)

    > [!IMPORTANT]
    > Your Azure key vault, disk encryption set, VM, disks, and snapshots must all be in the same region and subscription for deployment to succeed.

1. Select **+Add** to create a new Key Vault.
1. Create a new resource group.
1. Enter a key vault name, select a region, and select a pricing tier.

    > [!NOTE]
    > When creating the Key Vault instance, you must enable soft delete and purge protection. Soft delete ensures that the Key Vault holds a deleted key for a given retention period (90 day default). Purge protection ensures that a deleted key cannot be permanently deleted until the retention period lapses. These settings protect you from losing data due to accidental deletion. These settings are mandatory when using a Key Vault for encrypting managed disks.

1. Select **Review + Create**, verify your choices, then select **Create**.

    ![Screenshot of the Azure Key Vault creation experience. Showing the particular values you create](./media/virtual-machines-disk-encryption-portal/server-side-encryption-create-a-key-vault.png)

1. Once your key vault finishes deploying, select it.
1. Select **Keys** under **Settings**.
1. Select **Generate/Import**.

    ![Screenshot of the Key Vault resource settings pane. Shows the generate/import button inside settings.](./media/virtual-machines-disk-encryption-portal/sever-side-encryption-key-vault-generate-settings.png)

1. Leave both **Key Type** set to **RSA** and **RSA Key Size** set to **2048**.
1. Fill in the remaining selections as you like and then select **Create**.

    ![Screenshot of the create a key blade that appears once generate/import button is selected](./media/virtual-machines-disk-encryption-portal/server-side-encryption-create-a-key-generate.png)

## Set up your disk encryption set

1. Search for **Disk Encryption Sets** and select it.
1. On the **Disk Encryption Sets** blade select **+Add**.

    ![Screenshot of the disk encryption portal main screen. Highlighting the Add button](./media/virtual-machines-disk-encryption-portal/sever-side-encryption-create-disk-encryption-set.png)

1. Select your resource group, name your encryption set, and select the same region as your key vault.
1. For **Encryption type** select **Encryption at-rest with a customer-managed key**.

    > [!NOTE]
    > Once you create a disk encryption set with a particular encryption type, it cannot be changed. If you want to use a different encryption type, you must create a new disk encryption set.

1. Select **Click to select a key**.
1. Select the key vault and key you created previously, as well as the version.
1. Press **Select**.
1. Select **Review + Create** and then **Create**.

    ![Screenshot of the disk encryption creation blade. Showing the subscription, resource group, disk encryption set name, region, and key vault + key selector.](./media/virtual-machines-disk-encryption-portal/server-side-encryption-disk-set-blade.png)

1. Open the disk encryption set once it finishes creating and select the alert that pops up.

    ![Screenshot of alert popup: 'To associate a disk, image, or snapshot with a disk encryption set, you must grant permissions to the key vault'. Select this alert to continue](./media/virtual-machines-disk-encryption-portal/server-side-encryption-disk-encryption-set-alert-fix.png)

    Two notifications should pop up and succeed. This allows you to use the disk encryption set with your key vault.

    ![Screenshot of successful permission and role assignment for your key vault.](./media/virtual-machines-disk-encryption-portal/disk-encryption-notification-success.png)