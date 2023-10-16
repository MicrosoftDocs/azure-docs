---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 08/02/2023
 ms.author: rogarana
 ms.custom: include file
---
Setting up customer-managed keys for your disks requires you to create resources in a particular order, if you're doing it for the first time. First, you'll need to create and set up an Azure Key Vault.

## Set up your Azure Key Vault

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Key Vaults**.

    :::image type="content" source="media/virtual-machines-disk-encryption-portal/server-side-encryption-key-vault-portal-search.png" alt-text="Screenshot of the Azure portal with the search dialog box expanded." lightbox="media/virtual-machines-disk-encryption-portal/sever-side-encryption-key-vault-portal-search-expanded.png":::

    > [!IMPORTANT]
    > Your disk encryption set, VM, disks, and snapshots must all be in the same region and subscription for deployment to succeed. Azure Key Vaults may be used from a different subscription but must be in the same region and tenant as your disk encryption set.

1. Select **+Create** to create a new Key Vault.
1. Create a new resource group.
1. Enter a key vault name, select a region, and select a pricing tier.

    > [!NOTE]
    > When creating the Key Vault instance, you must enable soft delete and purge protection. Soft delete ensures that the Key Vault holds a deleted key for a given retention period (90 day default). Purge protection ensures that a deleted key cannot be permanently deleted until the retention period lapses. These settings protect you from losing data due to accidental deletion. These settings are mandatory when using a Key Vault for encrypting managed disks.

1. Select **Review + Create**, verify your choices, then select **Create**.

    :::image type="content" source="media/virtual-machines-disk-encryption-portal/server-side-encryption-create-a-key-vault.png" alt-text="Screenshot of the Azure Key Vault creation experience, showing the particular values you create." lightbox="media/virtual-machines-disk-encryption-portal/server-side-encryption-create-a-key-vault.png":::

1. Once your key vault finishes deploying, select it.
1. Select **Keys** under **Objects**.
1. Select **Generate/Import**.

    :::image type="content" source="media/virtual-machines-disk-encryption-portal/server-side-encryption-key-vault-generate-settings.png" alt-text="Screenshot of the Key Vault resource settings pane, shows the generate/import button inside settings." lightbox="media/virtual-machines-disk-encryption-portal/server-side-encryption-key-vault-generate-settings.png":::

1. Leave both **Key Type** set to **RSA** and **RSA Key Size** set to **2048**.
1. Fill in the remaining selections as you like and then select **Create**.

    :::image type="content" source="media/virtual-machines-disk-encryption-portal/server-side-encryption-create-a-key-generate.png" alt-text="Screenshot of the create a key pane that appears once generate/import button is selected." lightbox="media/virtual-machines-disk-encryption-portal/server-side-encryption-create-a-key-generate.png":::

### Add an Azure RBAC role

Now that you've created the Azure key vault and a key, you must add an Azure RBAC role, so you can use your Azure key vault with your disk encryption set.

1. Select **Access control (IAM)** and add a role.
1. Add either the **Key Vault Administrator**, **Owner**, or **Contributor** roles.

## Set up your disk encryption set

1. Search for **Disk Encryption Sets** and select it.
1. On the **Disk Encryption Sets** pane, select **+Create**.
1. Select your resource group, name your encryption set, and select the same region as your key vault.
1. For **Encryption type**, select **Encryption at-rest with a customer-managed key**.

    > [!NOTE]
    > Once you create a disk encryption set with a particular encryption type, it cannot be changed. If you want to use a different encryption type, you must create a new disk encryption set.

1. Make sure **Select Azure key vault and key** is selected.
1. Select the key vault and key you created previously, and the version.
1. If you want to enable [automatic rotation of customer managed keys](../articles/virtual-machines/disk-encryption.md#automatic-key-rotation-of-customer-managed-keys), select **Auto key rotation**.
1. Select **Review + Create** and then **Create**.

    :::image type="content" source="media/virtual-machines-disk-encryption-portal/server-side-encryption-disk-set-blade.png" alt-text="Screenshot of the disk encryption creation pane. Showing the subscription, resource group, disk encryption set name, region, and key vault + key selector." lightbox="media/virtual-machines-disk-encryption-portal/server-side-encryption-disk-set-blade.png":::

1. Navigate to the disk encryption set once it's deployed, and select the displayed alert.

    :::image type="content" source="media/virtual-machines-disk-encryption-portal/disk-encryption-set-perm-alert.png" alt-text="Screenshot of user selecting the 'To associate a disk, image, or snapshot with this disk encryption set, you must grant permissions to the key vault' alert." lightbox="media/virtual-machines-disk-encryption-portal/disk-encryption-set-perm-alert.png":::

1. This will grant your key vault permissions to the disk encryption set.

    :::image type="content" source="media/virtual-machines-disk-encryption-portal/disk-encryption-set-perm-confirmation.png" alt-text="Screenshot of confirmation that permissions have been granted." lightbox="media/virtual-machines-disk-encryption-portal/disk-encryption-set-perm-confirmation.png":::
