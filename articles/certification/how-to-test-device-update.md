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

## Test the device
1.	On the Connect + test page, select **"Yes"** for the **"Are you able to test Device Update for IoT Hub?"** question.
      > [!Note]
      > If you are not able to test Device Update and select No, you will still be able to run all other Secured-core tests, but your product will not be eligible for certification.

      :::image type="content" source="./media/how-to-adu/connect-test.png" alt-text="Dialog to confirm that you are able to test device for IoT Hub.":::

2.	Proceed with connecting your device to the test infrastructure.

3.	On the Select Requirement Validation step, select **"Upload"**.
   :::image type="content" source="./media/how-to-adu/connect-and-test.png" alt-text="Dialog that shows the selected tests that will be validated.":::

4.	Upload your .importmanifest.json file by selecting the **Choose File** button.  Select your file and then select the **Upload** button.  
      > [!Note]
      > The file extension must be .importmanifest.json.
   
      :::image type="content" source="./media/how-to-adu/upload-manifest.png" alt-text="Dialog to instruct the user to upload the .importmanifest.json file by selecting the choose File button.":::

5.	Copy and Paste the SAS URL to the location of your .SWU file in the provided input box, then select the **Validate** button.
   :::image type="content" source="./media/how-to-adu/input-sas-url.png" alt-text="Dialog that shows how the SAS url is applied.":::

6.	Once we’ve validated our service can reach the provided URL, select **Import**.   
   :::image type="content" source="./media/how-to-adu/finalize-import.png" alt-text="Dialog to inform the user that the SAS URL was reachable and that the user needs to click import.":::

      > [!Note]
      > If you receive an “Invalid SAS URL” message, generate a new SAS URL from your storage blob and try again.

7. Select **Continue** to proceed

8.	Congratulations!  You're now ready to proceed with Edge Secured-core testing. 

9.	Select the **Run tests** button to begin the testing process. Your device will be updated as the final step in our Edge Secured-core testing.