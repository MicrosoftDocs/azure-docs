---
title: Create attack vector reports
description: Attack vector reports provide a graphical representation of a vulnerability chain of exploitable devices.
ms.date: 02/03/2022
ms.topic: how-to
---

# Create attack vector reports

Attack vector reports show a chain of vulnerable devices in a specified attack path, for devices detected by a specific OT network sensor. Simulate an attack on a specific target in your network to discover vulnerable devices and analyze attack vectors in real time.

Attack vector reports can also help evaluate mitigation activities to ensure that you're taking all required steps to reduce the risk to your network. For example, use an attack vector report to understand whether a software update would disrupt the attacker's path, or if an alternate attack path still remains.

## Prerequisites

To create attack vector reports, you must be able to access the OT network sensor you want to generate data for, as an **Admin** or **Security Analyst** user.

For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md)

## Generate an attack vector simulation

Generate an attack vector simulation so that you can view the resulting report.

**To generate an attack vector simulation:**

1. Sign into the sensor console and select **Attack vector** on the left.
1. Select **Add simulation** and enter the following values:

    | Property  | Description  |
    |---------|---------|
    | **Name** | Simulation name |
    | **Maximum Vectors** | The maximum number of attack vectors you want to include in the simulation. |
    | **Show in Device Map** | Select to show the attack vector as a group in the **Device map**. |
    | **Show All Source Devices** | Select to consider all devices as a possible attack source. |
    | **Attack Source** | Appears only, and required, if the **Show All Source Devices** option is toggled off. Select one or more devices to consider as the attack source.|
    | **Show All Target Devices** | Select to consider all devices as possible attack targets.|
    | **Attack Target** | Appears only, and required, if the **Show All Target Devices** option is toggled off. Select one or more devices to consider as the attack target.|
    | **Exclude Devices** | Select one or more devices to exclude from the attack vector simulation.|
    | **Exclude Subnets** | Select one or more subnets to exclude from the attack vector simulation.|

1. Select **Save**. Your simulation is added to the list, with the number of attack paths indicated in parenthesis.

1. Expand your simulation to view the list of possible attack vectors, and select one to view more details on the right.

    For example:

    :::image type="content" source="media/how-to-generate-reports/sample-attack-vectors.png" alt-text="Screen shot of Attack vectors report." lightbox="media/how-to-generate-reports/sample-attack-vectors.png":::

## View an attack vector in the Device Map

The Device map provides a graphical representation of vulnerable devices detected in attack vector reports. To view an attack vector in the Device map:

1. In the **Attack vector** page, make sure your simulation has **Show in Device map** toggled on.
1. Select **Device map** from the side menu.
1. Select your simulation and then select an attack vector to visualize the devices in your map. 

    For example:

    :::image type="content" source="media/how-to-generate-reports/sample-device-map.png" alt-text="Screen shot of Device map." lightbox="media/how-to-generate-reports/sample-device-map.png":::

For more information, see [Investigate sensor detections in the Device map](how-to-work-with-the-sensor-device-map.md).

## Next steps

- Enhance security posture with Azure security [recommendations](recommendations.md).

- View additional reports based on cloud-connected sensors in the Azure portal. For more information, see [Visualize Microsoft Defender for IoT data with Azure Monitor workbooks](workbooks.md)

- Continue creating other reports for more security data from your OT sensor. For more information, see:

    - [Risk assessment reporting](how-to-create-risk-assessment-reports.md)
    
    - [Sensor data mining queries](how-to-create-data-mining-queries.md)
    
    - [Create trends and statistics dashboards](how-to-create-trends-and-statistics-reports.md)
