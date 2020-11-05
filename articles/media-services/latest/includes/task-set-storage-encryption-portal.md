---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 11/04/2020
ms.author: inhenkel
ms.custom: portal
---

<!--Set the encryption on storage account in the portal-->

## Set the ecryption on a storage account

1. In the Azure portal, enter the name of the storage account you want to encrypt in the **Search** field at the top of the screen.  Matches will appear below the search field.
1. Select the storage account you are looking for. The storage account screen will appear.
1. Select **Encryption**.
1. Select either Microsoft-managed keys or Customer-managed keys.

### Use Microsoft-managed keys

By default, data in the storage account is encrypted using Microsoft-managed keys.

### Use customer-managed keys

1. Select **Customer-managed keys**.
1. Select either **Enter key URI** or **Select from key vault**.
    1. If you select **Enter key URI** enter the key URI in the Key URI field and select the subscription. (It may already be selected for you.)
    1. If you select **Select from key vault**, you will then select **Select a key vault and key**. The Select key from Azure Key Vault screen will appear.
1. Select the **Key Vault** you want to use and either select a key you already have in your key vault or **create a new key**.
    1. If you choose to create a new key, select **Generate** or **Import** from the **Options** drop down. You can import only RSA keys.
    1. To generate a new key, give the key a name in the **Name** field then select the Key type:
        1. RSA - Key Sizes:  2048,3072 or 4096
        1. EC - Eliptic Curve Names: P-256, P-384, P-521, or P-256K
        1. Optionally, you can set the activation and expiration dates of the key.
        1. Select **Yes** to enable automatic key rotation.
        1. Click **Create**.
    1. To import a key, select the file to upload by clicking anyhere in the **Select a file field**.
        1. Give the key a name in the **Name** field.
        1. Optionally, you can set the activation and expiration dates of the key.
        1. Select **Yes** to enable automatic key rotation.
        1. Click **Create**.
    1. Select **Select** to select this key to encrypt your storage account. You will be taken back to the Encryption screen.
1. **IMPORTANT!** Select **Save** to save your encryption settings or everything you just did will be lost.
