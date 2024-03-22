---
author: stevenmatthew
ms.service: databox  
ms.topic: include
ms.date: 06/19/2020
ms.author: shaas
---

Final step is to prepare the device to ship. In this step, all the device shares are taken offline. The shares cannot be accessed once you start this process. You can also choose to clean up device whereby the local data on the device is erased permanently. Once the step is complete, your e-ink display will show the return shipping label.

> [!IMPORTANT]
> - You can choose to erase the data on the device permanently in this step and clean up the device. The data in your Azure Storage account will stay and accrue charges. We recommend that you delete this data only after you have verified that data copy to an on-premises data server is complete.

1. Go to **Prepare to ship** and select **Start preparation**. 
   
    ![Prepare to ship 1](media/data-box-export-prepare-to-ship/prepare-to-ship1.png)

 
2. The prepare to ship starts and the device shares go offline. By default, the device clean up is performed and Data Box erases the data on its disks. 


    ![Prepare to ship 2](media/data-box-export-prepare-to-ship/prepare-to-ship2.png)

    You can opt out of the cleanup procedure by unchecking the combo box. In this case, the device data is erased later at the datacenter.

    ![Prepare to ship 3](media/data-box-export-prepare-to-ship/prepare-to-ship3.png)


3. Once the **Prepare to ship** starts, you will see a progress notification with a progress bar.

    ![Prepare to ship 4](media/data-box-export-prepare-to-ship/prepare-to-ship4.png)

4. After the prepare to ship and the device cleanup (if selected) is complete, the E-ink display on your device will also display the return the shipping label. 

    You also see a completion reference number which is used for different things depending on the country/region in which you are located. You can also view the instructions for return shipment. Depending on the type of shipping you chose, Microsoft managed or self managed, the instructions will vary. 
        
    ![Prepare to ship 5](media/data-box-export-prepare-to-ship/prepare-to-ship5.png)


5. Shut down the device. Locate the power button on the front operating panel of the device. Turn off the device.

    ![Data Box power button](media/data-box-export-prepare-to-ship/data-box-powered-door-open.png)

6. Remove the cables. The next step is to ship the device to Microsoft.

