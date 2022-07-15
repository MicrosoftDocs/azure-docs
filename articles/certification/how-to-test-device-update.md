---
title: How to test Device Update for IoT Hub
description: A guide describing how to test Device Update for IoT Hub on a Linux host in preparation for Edge Secured-core certification.
author: cbroad
ms.author: cbroad
ms.service: certification
ms.topic: how-to 
ms.date: 06/20/2022
ms.custom: template-how-to 
---

# How to test Device Update for IoT Hub
The [Device Update for IoT Hub](..\iot-hub-device-update\understand-device-update.md) test exercises your device’s ability to receive an update from IoT Hub. The following steps will guide you through the process to test Device Update for IoT Hub when attempting device certification.

## Prerequisites
* Device must be capable of running Linux [IoT Edge supported container](..\iot-edge\support.md).
* Your device must be capable of receiving an [.SWU update](https://swupdate.org/) and be able to return to a running and connected state after the update is applied.  
* The update package and manifest must be applicable to the device under test.  (Example: If the device is running “Version 1.0”, the update should be “Version 2.0”.)
* Upload your .SWU file to a blob storage location of your choice.
* Create a SAS URL for accessing the uploaded .SWU file.  

## Testing the device
   1.	On the Connect + test page, select **"Yes"** for the **"Are you able to test Device Update for IoT Hub?"** question.
   > [!Note]
   > If you are not able to test Device Update and select No, you will still be able to run all other Secured-core tests, but your product will not be eligible for certification.

:::image type="content" source="./media/how-to-adu/connect-test.png" alt-text="Dialog that shows the Connect + test user interface to select OS and Firmware interface.":::

2.	Proceed with connecting your device to the test infrastructure.

3.  Select **"Upload"** to upload the ".manifest.json" file.

4.	On the Select Requirement Validation step, select the **"Upload"** button at the bottom of the page.

   :::image type="content" source="./media/how-to-adu/select-tests.png" alt-text="Dialog that shows the selected tests that will be validated.":::

5.	Upload your .importmanifest.json file by selecting the **Choose File** button.  Select your file and then select the **Upload** button.  
   > [!Note]
   > The file extension must be .importmanifest.json.
   
   :::image type="content" source="./media/how-to-adu/upload-swu.png" alt-text="Dialog that shows how the SWU file can be uploaded.":::

6.	Copy and Paste the SAS URL to the location of your .SWU file in the provided input box, then select the **Validate** button.
   :::image type="content" source="./media/how-to-adu/validate-swu.png" alt-text="Dialog that shows how the SAS url is applied.":::

7.	Once we’ve validated our service can reach the provided URL, select **Import**.   
   :::image type="content" source="./media/how-to-adu/staging-complete.png" alt-text="Dialog that shows the staging process is complete":::

   > [!Note]
   > If you receive an “Invalid SAS URL” message, generate a new SAS URL from your storage blob and try again.

8.  Select **Continue** to proceed

9.	Congratulations!  You're now ready to proceed with Edge Secured-core testing. 

10.	Select the **Run tests** button to begin the testing process. Your device will be updated as the final step in our Edge Secured-core testing.