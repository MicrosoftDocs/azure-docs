---
author: alkohli
ms.service: storsimple
ms.topic: include
ms.date: 10/26/2018
ms.author: alkohli
---

#### To add a storage account credential in the same Azure subscription as the StorSimple Device Manager service

1. Go to your StorSimple Device Manager service. In the **Configuration** section, click **Storage account credentials**.

    ![Go to storage account credentials](./media/storsimple-8000-configure-new-storage-account-u2/createnewstorageacct1.png)

2. On the **Storage account credentials** blade, click **+ Add**.

    ![Add a storage account credential](./media/storsimple-8000-configure-new-storage-account-u2/createnewstorageacct2.png)

3. In the **Add a storage account credential** blade, do the following steps:

    1. As you are adding a storage account credential in the same Azure subscription as your service, ensure that **Current** is selected.

    2. From the **storage account** dropdown list, select an existing storage account.

    3. Based on the storage account selected, the **location** will be displayed (grayed out and cannot be changed here).

    4. Select **Enable SSL Mode** to create a secure channel for network communication between your device and the cloud. Disable **Enable SSL** only if you are operating within a private cloud.

        ![Add storage account credentials blade](./media/storsimple-8000-configure-new-storage-account-u2/createnewstorageacct3.png)

    5. Click **Add** to start the job creation for the storage account credential. You will be notified after the storage account credential is successfully created.

        ![Success notification for storage account credentials](./media/storsimple-8000-configure-new-storage-account-u2/createnewstorageacct5.png)

The newly created storage account credential will be displayed under the list of **Storage account credentials**.

![List the storage account credentials](./media/storsimple-8000-configure-new-storage-account-u2/createnewstorageacct6.png)

