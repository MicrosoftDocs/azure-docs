---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 12/20/2021
ms.author: alkohli
---

1. In the Azure portal, go to your Azure Edge Hardware Center order item resource. In the **Overview**, go to the top command bar in the right pane and select **Return**. The return option is only enabled after you have received a device.

    ![Return device 1](media/azure-stack-edge-initiate-return-device/hardware-center-return-device-1.png)  

1. In the **Return hardware** blade, provide the following information:

    ![Return device 2](media/azure-stack-edge-initiate-return-device/hardware-center-return-device-2.png) 

    1. From the dropdown list, select a **Reason for returning**.

    1. Provide the serial number of the device. To get the device serial number, go the local web UI of the device and then go to **Overview**.  
    
       ![Device serial number 1](media/azure-stack-edge-initiate-return-device/device-serial-number-1.png) 

    1. (Optionally) Enter the **Service tag** number. The service tag number is an identifier with five or more characters, which is unique to your device. The service tag is located on the bottom-right corner of the device (as you face the device). Pull out the information tag (it is a slide-out label panel). This panel contains system information such as service tag, NIC, MAC address, and so on. 
    
       ![Service tag number 1](media/azure-stack-edge-initiate-return-device/service-tag-number-1.png)

    1. To request a return shipping box, check the **Shipping box required to return the hardware unit**.you can request it. Answer **Yes** to the question **Need an empty box to return**.
    
    1. Review the **Privacy terms**, and select the checkbox by the note that you have reviewed and agree to the privacy terms.

    1. Verify the **Pickup details**. By default, these are set to your shipping address. You can add a new address or select a different one from the saved addresses for the return pickup.

        ![Return device 3](media/azure-stack-edge-initiate-return-device/hardware-center-return-device-3.png) 

    1. Select **Initiate return**.

1. Once the return request is submitted, the order item resource starts reflecting the status of your return shipment. The status progresses from **Return initiated** to **Picked up** to **Return completed**. Use the portal to check the return status of your resource at any time.

    ![Return device 5](media/azure-stack-edge-initiate-return-device/hardware-center-return-device-4.png) 

1. Once the request is initiated, the Azure Stack Edge operations team reaches out to you to help schedule the device pickup.
