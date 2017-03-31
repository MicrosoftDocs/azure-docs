<!--author=alkohli last changed: 02/10/2017-->

> [NOTE!] You cannot modify the encryption settings and the storage account credentials associated with a volume container after it is created.

#### To modify a volume container

1. Go to your StorSimple Device Manager service and then navigate to **Management > Volume containers**.

2. From the tabular list of volume containers, select the volume container you want to modify. On the **Devices** page, select the device, double-click it, and then click the **Volume containers** tab.

2. In the tabular listing of the volume containers, select the volume container that you want to modify. Right-click **...** and then select **Modify**.
3. In the **Modify Volume container** blade, do the following steps:
   
   1. Change the name of the volume container and modify the associated bandwidth setting. 
      
       ![Modify Volume Container with Bandwidth Template 1](./media/storsimple-modify-volume-container/HCS_ModifyVCBT1-include.png)
   2. The encryption key and storage account cannot be changed after they are specified. If you specified **Select a bandwidth template**, click the arrow to proceed to the next page.
4. In the next page of the **Modify Volume Container** dialog box:
   
   1. From the drop-down list, choose an existing bandwidth template.
   2. Review the schedule settings for the specified bandwidth template.
      
       ![Modify Volume Container with Bandwidth Template 2](./media/storsimple-modify-volume-container/HCS_ModifyVCBT2-include.png)
   3. Click the check icon ![check icon](./media/storsimple-modify-volume-container/HCS_CheckIcon-include.png) to save the updated settings. The **Volume containers** page will be updated to reflect the changes.

