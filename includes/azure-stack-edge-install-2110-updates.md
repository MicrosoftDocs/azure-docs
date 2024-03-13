---
author: alkohli
ms.service: databox
ms.author: alkohli
ms.topic: include
ms.date: 10/02/2023
---



1. When the updates are available for your device, you see a notification in the **Overview** page of your Azure Stack Edge resource. Select the notification or from the top command bar, **Update device**. This will allow you to apply device software updates.

    ![Select update device](media/azure-stack-edge-install-2110-updates/install-updates-portal-1.png)

2. In the **Device updates** blade, check that you have reviewed the license terms associated with new features in the release notes.

    Once the updates are downloaded on the device, you can choose to **Automatically install** the updates. 

    ![Select Automatically install updates option](media/azure-stack-edge-install-2110-updates/install-updates-portal-2.png)    

    You can also just download the updates and then **Manually install updates later**.

    ![Select Manually install updates later option](media/azure-stack-edge-install-2110-updates/install-updates-portal-3.png)

3. The download of updates starts. You see a notification that the download is in progress.

    ![Notification displaying updates download in progress](media/azure-stack-edge-install-2110-updates/install-updates-portal-4.png)

    A notification banner is also displayed in the Azure portal. This indicates the download progress. You can select this notification or select **Update device** to see the detailed status of the update.

    ![View detailed update status in Device updates blade](media/azure-stack-edge-install-2110-updates/install-updates-portal-5.png)


4. After the download is complete, the notification banner updates to indicate the completion. If you chose to automatically install the updates, the installation begins automatically.

    If you chose to manually install updates later, then select the notification to open the **Device updates** blade. Select **Install update**.
 
    ![Select Install update after updates are downloaded](media/azure-stack-edge-install-2110-updates/install-updates-portal-6.png)
 
5. You see a notification that the install is in progress. The portal also displays an informational alert to indicate that the install is in progress. The device goes offline and is in maintenance mode.
   
    ![Banner notification displayed that device is in maintenance ](media/azure-stack-edge-install-2110-updates/install-updates-portal-7.png)

6. As this is a 1-node device, the device restarts after the updates are installed. 

    ![Banner notification displayed that device is restarting](media/azure-stack-edge-install-2110-updates/install-updates-portal-8.png)

7. After the restart, the device software will finish updating. The Kubernetes software update will start automatically. The device goes offline again and is in maintenance mode.

    ![Banner notification displayed that device is in maintenance mode](media/azure-stack-edge-install-2110-updates/install-updates-portal-9.png)   


8. Once the device software and Kubernetes updates are successfully installed, the banner notification disappears. The device status updates to **Your device is online**. 

    ![Update complete and device is online](media/azure-stack-edge-install-2110-updates/install-updates-portal-10.png)

    Go to the local web UI and then go to **Software update** page. Verify that the device software and Kubernetes are successfully updated and the software version reflects that.

    


