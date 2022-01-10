---
author: alkohli
ms.service: storsimple
ms.topic: include
ms.date: 07/16/2021
ms.author: alkohli
---

#### To create a volume container

1. Go to your StorSimple Device Manager service and click **Devices**. From the tabular listing of the devices, select and click a device. 

    ![Volume container blade](./media/storsimple-8000-create-volume-container/create-volume-container-01.png)

2. In the device dashboard, click **+ Add volume container**

    ![Volume container blade 2](./media/storsimple-8000-create-volume-container/create-volume-container-02.png)

3. In the **Add volume container** blade:
   
   1. The device is automatically selected.
   2. Supply a **Name** for your volume container. The name must be 3 to 32 characters long. You cannot rename a volume container once it is created.
   3. Select **Enable Cloud Storage Encryption** to enable encryption of the data sent from the device to the cloud.
   4. Provide and confirm a **Cloud Storage Encryption Key** that is 8 to 32 characters long. This key is used by the device to access encrypted data.
   5. Select a **Storage Account** to associate with this volume container. You can choose an existing storage account or the default account that is generated at the time of service creation. You can also use the **Add new** option to specify a storage account that is not linked to this service subscription.
   6. Select **Unlimited** in the **Specify bandwidth** drop-down list if you wish to consume all the available bandwidth.
   
      If you have your bandwidth usage information available, you may be able to allocate bandwidth based on a schedule by specifying **Select a bandwidth template**. For a step-by-step procedure, go to [Add a bandwidth template](../articles/storsimple/storsimple-8000-manage-bandwidth-templates.md#add-a-bandwidth-template).

      ![Volume container blade 3](./media/storsimple-8000-create-volume-container/create-volume-container-06-b.png)<!--New graphic. Source: add-volume-container-bw-setting.-->

   7. Click **Create**.

        <!--![Volume container blade 4](./media/storsimple-8000-create-volume-container/create-volume-container-06.png)-->
   
       You are notified when the volume container is successfully created.

       ![Volume container creation notification](./media/storsimple-8000-create-volume-container/create-volume-container-08.png)

   The newly created volume container is listed in the list of volume containers for your device.

   ![Add volume container blade](./media/storsimple-8000-create-volume-container/create-volume-container-09.png)
