---
author: alkohli
ms.service: azure-data-box
ms.author: alkohli
ms.topic: include
ms.date: 10/02/2023
ms.custom: sfi-image-nochange
---



1. When the updates are available for your device, you see a notification in the **Overview** page of your Azure Stack Edge resource. Select the notification or from the top command bar, **Update device**. This will allow you to apply device software updates.

    :::image type="content" source="media/azure-stack-edge-install-2110-updates/install-updates-portal-1.png" alt-text="Screenshot showing how to select update device." lightbox="media/azure-stack-edge-install-2110-updates/install-updates-portal-1.png":::

2. In the **Device updates** blade, check that you have reviewed the license terms associated with new features in the release notes.

    Once the updates are downloaded on the device, you can choose to **Automatically install** the updates. 

    :::image type="content" source="media/azure-stack-edge-install-2110-updates/install-updates-portal-2.png" alt-text="Screenshot showing the Automatically install updates option." lightbox="media/azure-stack-edge-install-2110-updates/install-updates-portal-2.png":::

    You can also just download the updates and then **Manually install updates later**.

    :::image type="content" source="media/azure-stack-edge-install-2110-updates/install-updates-portal-3.png" alt-text="Screenshot showing the Manually install updates later option." lightbox="media/azure-stack-edge-install-2110-updates/install-updates-portal-3.png":::

3. The download of updates starts. You see a notification that the download is in progress.

    :::image type="content" source="media/azure-stack-edge-install-2110-updates/install-updates-portal-4.png" alt-text="Screenshot showing the notification that updates download is in progress." lightbox="media/azure-stack-edge-install-2110-updates/install-updates-portal-4.png":::

    A notification banner is also displayed in the Azure portal. This indicates the download progress. You can select this notification or select **Update device** to see the detailed status of the update.

    :::image type="content" source="media/azure-stack-edge-install-2110-updates/install-updates-portal-5.png" alt-text="Screenshot showing detailed update status in the Device updates blade." lightbox="media/azure-stack-edge-install-2110-updates/install-updates-portal-5.png":::


4. After the download is complete, the notification banner updates to indicate the completion. If you chose to automatically install the updates, the installation begins automatically.

    If you chose to manually install updates later, then select the notification to open the **Device updates** blade. Select **Install update**.
 
    :::image type="content" source="media/azure-stack-edge-install-2110-updates/install-updates-portal-6.png" alt-text="Screenshot showing the Install update option after updates are downloaded." lightbox="media/azure-stack-edge-install-2110-updates/install-updates-portal-6.png":::
 
5. You see a notification that the install is in progress. The portal also displays an informational alert to indicate that the install is in progress. The device goes offline and is in maintenance mode.
   
    :::image type="content" source="media/azure-stack-edge-install-2110-updates/install-updates-portal-7.png" alt-text="Screenshot showing the banner notification that the device is in maintenance mode." lightbox="media/azure-stack-edge-install-2110-updates/install-updates-portal-7.png":::

6. As this is a 1-node device, the device restarts after the updates are installed. 

    :::image type="content" source="media/azure-stack-edge-install-2110-updates/install-updates-portal-8.png" alt-text="Screenshot showing the banner notification that the device is restarting." lightbox="media/azure-stack-edge-install-2110-updates/install-updates-portal-8.png":::

7. After the restart, the device software will finish updating. The Kubernetes software update will start automatically. The device goes offline again and is in maintenance mode.

    :::image type="content" source="media/azure-stack-edge-install-2110-updates/install-updates-portal-9.png" alt-text="Screenshot showing the banner notification that the device is in maintenance mode after restart." lightbox="media/azure-stack-edge-install-2110-updates/install-updates-portal-9.png":::   


8. Once the device software and Kubernetes updates are successfully installed, the banner notification disappears. The device status updates to **Your device is online**. 

    :::image type="content" source="media/azure-stack-edge-install-2110-updates/install-updates-portal-10.png" alt-text="Screenshot showing update complete and the device is online." lightbox="media/azure-stack-edge-install-2110-updates/install-updates-portal-10.png":::

    Go to the local web UI and then go to **Software update** page. Verify that the device software and Kubernetes are successfully updated and the software version reflects that.

    


