---
title: Create attack vector reports
description: Attack vector reports provide a graphical representation of a vulnerability chain of exploitable devices.
ms.date: 02/03/2022
ms.topic: how-to
---

# Create attack vector reports

Attack vector reports show a chain of vulnerable devices in a specified attack path. Simulate an attack on a specific target in your network to discover vulnerable devices and analyze attack vectors in real time.

Attack vector reports can also help evaluate mitigation activities to ensure that you're taking all required steps to reduce the risk to your network. For example, use an attack vector report to understand whether a system upgrade would disrupt the attacker's path, or if an alternate attack path still remains. 

## Prerequisites

You must be an **Admin** or **Security Analyst** user to create an attack vector report.

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
    | **Attack Source** | Shown only, and required, if the **Show All Source Devices** option is toggled off. Select one or more devices to consider as the attack source.|
    | **Show All Target Devices** | Select to consider all devices as possible attack targets.|
    | **Attack Target** | Shown only, and required, if the **Show All Target Devices** option is toggled off. Select one or more devices to consider as the attack target.|
    | **Exclude Devices** | Select one or more devices to exclude from the attack vector simulation.|
    | **Exclude Subnets** | Select one or more subnets to exclude from the attack vector simulation.|

1. Select **Save**.

## Attack vector report contents

You can use the report that is saved from the Attack vector page to review:

- network attack paths and insights
- a risk score
- source and target devices
- a graphical representation of attack vectors

:::image type="content" source="media/how-to-generate-reports/sample-attack-vectors.png" alt-text="Screen shot of Attack vectors report.":::

## Next steps


Continue creating other reports for more security data from your OT sensor. For more information, see:

- [Risk assessment reporting](how-to-create-risk-assessment-reports.md)

- [Sensor data mining queries](how-to-create-data-mining-queries.md)

- [Create trends and statistics dashboards](how-to-create-trends-and-statistics-reports.md)
