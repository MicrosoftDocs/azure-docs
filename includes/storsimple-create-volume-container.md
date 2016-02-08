<!--author=SharS last changed: 9/17/15-->

#### To create a volume container

1. In the device **Quick Start** page, click **Add a volume container**. The **Create Volume Container** dialog box appears.

    ![Create Volume Container](./media/storsimple-create-volume-container/HCS_CreateVolumeContainerM-include.png)

2. In the **Create Volume container** dialog box:
  1. Supply a **Name** for your volume container. The name must be 3 to 32 characters long.
  2. Select a **Storage Account** to associate with this volume container. You can choose the default account that is generated at the time of service creation. You can also use the **Add new** option to specify a storage account that is not linked to this service subscription.
  3. Select **Enable Cloud Storage Encryption** to enable encryption of the data sent from the device to the cloud.
  4. Provide and confirm a **Cloud Storage Encryption Key** that is 8 to 32 characters long. This key is used by the device to access encrypted data.
  5. Select **Unlimited** in the **Specify bandwidth** drop-down list if you wish to consume all the available bandwidth. You can also set this option to **Custom** to employ bandwidth controls, and specify a value between 1 and 1,000 Mbps. 
  If you have your bandwidth usage information available, you may be able to allocate bandwidth based on a schedule by specifying **Select a bandwidth template**. For a step-by-step procedure, go to [Add a bandwidth template](storsimple-manage-bandwidth-templates.md#add-a-bandwidth-template).
  6. Click the check icon ![check-icon](./media/storsimple-create-volume-container/HCS_CheckIcon-include.png) to save this volume container and exit the wizard. 

  The newly created volume container will be listed on the **Volume containers** page.

![Video available](./media/storsimple-create-volume-container/Video_icon.png) **Video available**

To watch a video that demonstrates how to create a volume container in your StorSimple solution, click [here](https://azure.microsoft.com/documentation/videos/create-a-volume-container-in-your-storsimple-solution/).