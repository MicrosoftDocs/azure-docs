---
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: include
ms.date: 10/26/2023
---

You need to set up a storage account to store the diagnostics package.

1. [Create a storage account](../../storage/common/storage-account-create.md) for diagnostics with the following additional configuration:
    1. In the **Data protection** tab, under **Access control**, select **Enable version-level immutability support**. This will allow you to specify a time-based retention policy for the account in the next step.
    1. If you would like the content of your storage account to be automatically deleted after a period of time, [configure a default time-based retention policy](../../storage/blobs/immutable-policy-configure-version-scope.md#configure-a-default-time-based-retention-policy) for your storage account.
    1. [Create a container](../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container) for your diagnostics.
    1. Make a note of the **Container blob** URL. For example:  
    `https://storageaccountname.blob.core.windows.net/diagscontainername`  
        1. Navigate to your **Storage account**.
        1. Select the **...** symbol on the right side of the container blob that you want to use for diagnostics collection.
        1. Select **Container properties** in the context menu.
        1. Copy the contents of the **URL** field in the **Container properties** view.
1. Create a [User-assigned identity](../../active-directory/managed-identities-azure-resources/overview.md) and assign it to the storage account created above with the **Storage Blob Data Contributor** role.  
    > [!TIP]
    > You may have already created and associated a user-assigned identity when creating the site.
1. Navigate to the **Packet core control plane** resource for the site.
1. Select **Identity** under **Settings** in the left side menu.
1. Select **Add**.
1. Select the user-signed managed identity you created and select **Add**.