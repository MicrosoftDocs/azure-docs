---
author: alkohli
ms.service: storsimple
ms.topic: include
ms.date: 10/26/2018
ms.author: alkohli
---
#### To delete a cloud appliance

1. Sign in to the Azure portal.
2. You can only delete a deactivated device that does not contain data. Delete the data on the device first or you can [fail over the data](../articles/storsimple/storsimple-8000-device-failover-cloud-appliance.md) in volume containers to another device. Once the data is deleted, you are ready to deactivate the device.
3. In your StorSimple Device Manager service page, click **Devices** and then select the device. Right-click and select **Deactivate**.
4. Once the device is deactivated, right-click the device and select **Delete**.

    ![Select deactivated device and click delete](./media/storsimple-8000-delete-cloud-appliance/delete-cloud-appliance1.png)

5. Type the device name to confirm the deletion. After the device is deleted, the device list updates.

    ![Confirm deletion](./media/storsimple-8000-delete-cloud-appliance/delete-cloud-appliance2.png)

6. You are notified after the device is deleted.

    ![Notification for successful device deletion](./media/storsimple-8000-delete-cloud-appliance/delete-cloud-appliance4.png)

7. The list of devices updates to indicate the deleted device.

    ![Updated device list](./media/storsimple-8000-delete-cloud-appliance/delete-cloud-appliance5.png)
