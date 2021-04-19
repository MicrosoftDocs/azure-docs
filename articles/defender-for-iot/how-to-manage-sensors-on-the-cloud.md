---
title: Manage sensors in the Defender for IoT portal
description: Learn how to onboard, view, and manage sensors in the Defender for IoT portal.
ms.date: 4/18/2021
ms.topic: how-to
---

# Manage sensors ain the Defender for IoT portal

This article describes how to onboard, view, and manage sensors in the [Defender for IoT portal](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started).

## Onboard sensors

You onboard a sensor by registering it with Azure Defender for IoT and downloading a sensor activation file.

### Register the sensor

To register:

1. Go to the **Welcome** page in the [Defender for IoT portal](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started).
1. Select **Onboard sensor**.
1. Create a sensor name. We recommend that you include the IP address of the sensor you installed as part of the name, or use an easily identifiable name. This will ensure easier tracking and consistent naming between the registration name in the Azure [Defender for IoT portal](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started) and the IP of the deployed sensor displayed in the sensor console.
1. Associate the sensor with an Azure subscription.
1. Choose a sensor management mode by using the **Cloud connected** toggle. If the toggle is on, the sensor is cloud connected. If the toggle is off, the sensor is locally managed.

   - **Cloud-connected sensors**: Information that the sensor detects is displayed in the sensor console. Alert information is delivered through an IoT hub and can be shared with other Azure services, such as Azure Sentinel.

   - **Locally managed sensors**: Information that sensors detect is displayed in the sensor console. If you're working in an air-gapped network and want a unified view of all information detected by multiple locally managed sensors, work with the on-premises management console.

   For cloud-connected sensors, the name defined during onboarding is the name that appears in the sensor console. You can't change this name from the console directly. For locally managed sensors, the name applied during onboarding will be stored in Azure and can be updated in the sensor console.

1. Choose an IoT hub to serve as a gateway between this sensor and Azure Defender for IoT.
1. If the sensor is cloud connected, associate it with an IoT hub, and then define a site name and zone. You can also add descriptive tags. The site name, zone, and tags are descriptive entries on the [Sites and Sensors page](#view-onboarded-sensors).

### Download the sensor activation file

The sensor activation file contains instructions about the management mode of the sensor. You download a unique activation file for each sensor that you deploy. A user who signs in to the sensor console for the first time uploads the activation file to the sensor.

To download an activation file:

1. On the **Onboard Sensor** page, select **download activation file**.
1. Make the file accessible to the user who's signing in to the sensor console for the first time.

## View onboarded sensors

On the [Defender for IoT portal](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started), you can view basic information about onboarded sensors.

1. Select **Sites and Sensors**.
1. Use filter and search tools to find sensor and threat intelligence information that you need.

- How many sensors were onboarded
- The number of sensors that are cloud connected and locally managed
- The hub associated with an onboarded sensor
- Details added about a sensor, such as the name assigned to the sensor during onboarding, the zone associated with the sensor, or other descriptive information added with tags

## Manage onboarded sensors

Use the [Defender for IoT portal](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started) for management tasks related to sensors.

Onboarded sensors can be viewed on the **Sites and Sensors** page. You can also edit sensor information from this page.

### Export sensor details

To export onboarded sensor information, select the **Export** icon on the top of the **Sites and Sensors** page.

### Edit sensor zone details

Use the **Sites and Sensors** edit options to edit the sensor name and zone.

To edit:

1. Select the **ellipsis** (**...**) for the sensor you want to edit.
1. Select **Edit**.
1. Update the sensor zone, or create a new zone.

### Delete a sensor

If you delete a cloud-connected sensor, information won't be sent to the IoT hub. Delete locally connected sensors when you're no longer working with them.

To delete a sensor:

1. Select the ellipsis (**...**) for the sensor you want to delete.
1. Confirm the deletion.

### Reactivate a sensor 

You may need to reactivate your sensor because you want to:

- **Work in cloud-connected mode instead of locally managed mode**: After reactivation, sensor detections are displayed in the sensor and newly detected alert information is delivered through the IoT hub. This information can be shared with other Azure services, such as Azure Sentinel.

- **Work in locally managed mode instead of cloud-connected mode**: After reactivation, sensor detection information is displayed only in the sensor.

- **Associate the sensor to a new IoT hub**:  To do this, re-register the sensor with a new hub, and then download a new activation file.

To reactivate a sensor:

1. Go to **Sites and Sensors** page on the [Defender for IoT portal](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started).

2. Select the sensor for which you want to upload a new activation file.

3. Delete the sensor.

4. Onboard the sensor again in the new mode or with a new IoT hub by selecting **Onboard a sensor** from the Getting Started page.

5. Download the activation file.

1. Sign in to the Defender for IoT sensor console.

7. In the sensor console, select **System Settings** and then select **Reactivation**.

   :::image type="content" source="media/how-to-manage-sensors-on-the-cloud/reactivate.png" alt-text="Upload your activation file to reactivate the sensor.":::

8. Select **Upload** and select the file you saved from the Onboard sensor page.

9. Select **Activate**.

## Next steps

[Activate and set up your sensor](how-to-activate-and-set-up-your-sensor.md)
