---
title: Onboard and Manage sensors in the Defender for IotT portal
description: This article describes how to onbaord, view and manage in Defender for IoT portal.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/27/2020
ms.topic: how-to
ms.service: azure
---

# Onboard and manage sensors in the Defender for IoT portal

## Onboard sensors

 Onboarding is carried out by registering the sensor with Azure Defender for IoT and downloading a sensor activation file.

**Register the sensor**

To register:

1. Go to the Defender for IoT portal Welcome page.
1. Select **Onboard sensor**.
1. Register the sensor by creating a sensor name. It is recommended to include the IP address of the sensor you installed as part of the name, or use an easily identifiable name. This will ensure easier tracking and consistent naming between the registration name in the Azure Defender for IoT portal, and the IP of the deployed sensor displayed in the sensor console.
1. Associate the sensor with an Azure subscription.
1. Choose a sensor management mode using the **Cloud connected** toggle. If the toggle is on, the sensor is cloud connected. If the toggle is off, the sensor is locally managed.

    **Cloud connected sensors:**
    Information detected by the sensor is displayed in the sensor console. In addition, alert information is delivered through an IoT Hub and can be shared with other Azure services, for example Azure Sentinel.

    **Locally managed sensors:** Information detected by sensors is displayed in the sensor console. If you are working in an air-gapped network and want a unified view of all information detected by multiple Locally managed sensors, work with the on-premises management console.

    For Cloud connected sensors, the name defined during onboarding is the name that appears in the sensor console: this name cannot be changed from the console directly. For Locally managed sensors, the name applied during onboarding will be stored in Azure, and can be updated in the sensor console.

1. Choose an IoT Hub to serve as a gateway between this sensor and Azure Defender for IoT.
1. For Cloud connected sensors, associate the sensor with an IoT Hub, and define a site name and zone. You can also add descriptive tags. The site name, zone and tags are descriptive entries that are displayed in the **Sites and Sensors** page.

**Download the sensor activation file**

The sensor activation file contains instructions regarding the management mode of the sensor. A unique activation file is needed for each sensor that is deployed. The activation file downloaded for this sensor is required by the user signing in to the sensor for the first time. This user must upload the activation file to the sensor.

To download an activation file:

1. Select **download activation file** in the Onboard Sensor page.
1. Make the file accessible to the user signing in to the sensor console for the first time.

## View onboarded sensors

Review basic information about the onboarded sensor.

To open the Sites and Sensors page:

1. Go to the Azure Defender for IoT portal.
1. Select **Sites and Sensors**.

Review information about:

- The Hub associated the onboarded sensor.
- How many sensors were onboarded
- The number of sensors that are cloud connected and locally managed
- Details added about the sensor, for example the name assigned to the sensor during onboarding; the zone associated with the sensor or other descriptive information added with tags.

Use filter and search tools to find sensor information you need.
## Manage onboarded sensors

**Export**

Export onboarded sensor information. Select the Export icon in the top of the **Sites and Sensors** page.

**Edit site name, zone and tags:**

Use the Sites and Sensors editing tools to add and edit the site name, zone and tags.

**Delete a sensor**  
If you delete a cloud connected sensor, information will not be sent to the IoT Hub. Delete locally connected sensors when you are no longer working with them.
To delete:
1. Select **...** for the sensor you want to delete. 
1. Confirm the deletion.

**Update sensor management mode**

You may want to update the mode that your sensor is managed, for example:

- **Work in the Cloud Connected mode instead of Locally managed mode**: To do this, update the activation file for your locally connected sensor with an activation file for a **Cloud Connected** sensor. After reactivation, sensor detections are displayed in both the sensor and Defender for IoT portal. After the reactivation file is successfully uploaded newly detected alert information is sent to Azure.

- **Work in the Locally Connected mode instead of Cloud Connected mode**: To do this, update the activation file for a **Cloud Connected** sensor with an activation file for a **Locally managed** sensor. After reactivation, sensor detection information is only displayed in the sensor.

- **Associate the sensor to a new IoT Hub**:  To do this, re-register then sensor and upload a new activation file.

To reactivate the sensor:

1. Navigate to the Defender for IoT, **Sites and Senors** page.

2. Select the sensor for which you want to upload a new activation file.

3. Delete it.

4. Onboard the sensor again from the **Onboarding** page in the new mode or with a new IoT Hub.

5. Download the activation file from the **Download Activation File** page.

6. Sign in to the Defender for IoT sensor console.

7. In the sensor console, select **System Settings** and then select **Reactivation**.

   :::image type="content" source="media/how-to-manage-sensors-on-the-cloud/reactivate.png" alt-text="Upload your activation file to reactivate the sensor.":::

8. Select **Upload** and select the file you saved.

9. Select **Activate**. 
## See also

[Activate and set up your sensor](how-to-activate-and-set-up-your-sensor.md)
