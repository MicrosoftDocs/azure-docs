<!--author=alkohli last changed: 01/13/17-->

If the volume container has associated volumes, take those volumes offline first. Follow the steps in [Take a volume offline](../articles/storsimple/storsimple-manage-volumes.md#take-a-volume-offline). After the volumes are offline, you can delete them. When the volume container has no associated volumes, delete the volume container. Perform the following procedure to delete a volume container.

#### To delete a volume container
1. Go to your StorSimple Device Manager service and click **Devices**. Select and click the device and then go to **Settings > Manage > Volume containers**.

    ![Volume containers blade](./media/storsimple-8000-create-volume-container/createvolumecontainer2.png)

2. From the tabular list of volume containers, select the volume container you want to delete, right click **...** and then select **Delete**.

    ![Delete volume container](./media/storsimple-8000-delete-volume-container/deletevolumecontainer1.png)

3. If a volume container has no associated volumes, then it can be deleted. When prompted for confirmation, review and select the checkbox stating the impact of deleting the volume container. Click **Delete** to then delete the volume container.

    ![Confirm deletion](./media/storsimple-8000-delete-volume-container/deletevolumecontainer2.png)

The list of volume containers is updated to reflect the deleted volume container.

![](./media/storsimple-8000-delete-volume-container/deletevolumecontainer5.png)


