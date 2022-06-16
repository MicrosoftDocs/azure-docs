---
title: Update threat intelligence data
description: The threat intelligence data package is provided with each new Defender for IoT version, or if needed between releases.
ms.date: 11/09/2021
ms.topic: how-to
---
# Threat intelligence research and packages #
## Overview ##

Security teams at Microsoft carry out proprietary ICS threat intelligence and vulnerability research. These teams provide security detection, analytics, and response to Microsoft's traditional products and devices, as well as cloud infrastructure and services, and internal corporate resources.

Security teams provide you with:
- Protection from known and relevant threats.
- Insights that help you triage and prioritize threats.
- An understanding of the full context of threats before they affect your environment.
- More relevant, accurate, and actionable data.

The security teams include: 
- Microsoft Threat Intelligence Center (MSTIC)
- Microsoft Detection and Response Team (DART)
- Digital Crimes Unit (DCU)
- IoT/OT/ICS domain experts that track ICS-specific zero-days, reverse-engineering malware, campaigns, and adversaries (Section 52)

## Threat intelligence packages ##

Threat intelligence puts Microsoft platform analytics in context and supports Microsoft’s managed services for incident response and breach investigation. Threat intelligence packages contain signatures, including malware signatures, CVEs, and other security content.

Threat intelligence packages are provided approximately once a month, or more frequently as needed. Announcements about new packages are available from [Microsoft Defender for IoT](https://techcommunity.microsoft.com/t5/azure-defender-for-iot/bd-p/AzureDefenderIoT). 

You can also see the most current package delivered from the **Threat Intelligence Update** section of the **Updates** page on Defender for IoT in the Azure portal.

## Update threat intelligence packages on your sensors ##

There are three options available for updating threat intelligence packages on your sensors:

- [Automatically push packages to sensors as they're delivered by Defender for IoT.](#Automatic_update)
- [Manually push threat intelligence package to sensors as required.](#Manual_update)
- [Download a package and then upload it to a sensor or multiple sensors.](#Upload_update)

Users with Defender for IoT Security Reader permissions can automatically and manually push packages to sensors.

### Change the threat intelligence update mode ###

**To change the update mode after initial onboarding:**

1. Select the ellipsis (**...**) for a sensor and then select **Edit**.
2. Enable or disable the **Automatic Threat Intelligence Updates** toggle.

<a name="Automatic_update"></a>
### Automatically push threat intelligence updates to sensors ###

Threat intelligence packages can be automatically updated to cloud-connected sensors as they are released by Defender for IoT. Ensure automatic package updates by onboarding your cloud connected sensor and enabling the **Automatic Threat Intelligence Updates** option. For more information, see [Onboard a sensor](tutorial-onboarding.md#onboard-and-activate-the-virtual-sensor).

<a name="Manual_update"></a>
### Manually push threat intelligence updates to sensors ###

You can also manually push packages from Defender for IoT to sensors only when you feel that it is required. This gives you the ability to control when a package is installed, without the need to download and then upload it to your sensors.

**To manually push packages to sensors:**

1. Go to the Microsoft Defender for IoT **Sites and Sensors** page.
1. Select the ellipsis (**...**) for a sensor and then select **Push Threat Intelligence Update**. The **Threat Intelligence Update Status** field displays the update progress.

<a name="Upload_update"></a>
### Download packages and upload to sensors ###

You can download packages from the Azure portal and manually upload them to individual sensors. If the on-premises management console manages your sensors, you can download threat intelligence packages to the management console and push them to multiple sensors simultaneously.

:::image type="content" source="media/how-to-work-with-threat-intelligence-packages/download-screen.png" alt-text="Download updates in the Azure portal.":::

This option is available for both cloud connected and locally managed sensors.

**To upload to a single sensor:**

1. Go to the Microsoft Defender for IoT **Updates** page.

2. Download and save the **Threat Intelligence** package.

3. Sign in to the sensor console.

4. On the side menu, select **System Settings**.

5. Select **Threat Intelligence Data**, and then select **Update**.

6. Upload the new package.

<br>

**To upload to multiple sensors simultaneously:**

1. Go to the Microsoft Defender for IoT **Updates** page.

2. Download and save the **Threat Intelligence** package.

3. Sign in to the management console.

4. On the side menu, select **System Settings**.

5. In the **Sensor Engine Configuration** section, select the sensors that should receive the updated packages.  

6. In the **Select Threat Intelligence Data** section, select the plus sign (**+**).

7. Upload the package.

## Review package update status on the sensor ##

You can review the package update status and version information in the sensor **System Settings**, in the **Threat Intelligence** section.  

## Review threat intelligence package information for cloud-connected sensors ##

You can review the threat intelligence package version installed, update mode, and update status for your cloud-connected sensors.

**To review the threat intelligence package information:**

1. Go to the Microsoft Defender for IoT **Sites and Sensors** page.
1. Review the **Threat Intelligence Version** installed on each sensor. Version naming is based on the day the package was built by Defender for IoT.
1. Review the **Threat Intelligence Mode**. *Automatic* indicates that newly available  packages will be automatically installed on sensors as they're released by Defender for IoT. *Manual* indicates that you can push newly available packages directly to sensors as needed.
1. Review the **Threat Intelligence Update Status**. The following statuses may be displayed:
    - Failed
    - In Progress
    - Update Available
    - Ok

If the cloud-connected threat intelligence updates fail, review  connection information in the **Sensor Status** and **Last Connected UTC** columns in the **Sites and Sensors** page. 

## Next steps

For more information, see:

- [Onboard a sensor](tutorial-onboarding.md#onboard-and-activate-the-virtual-sensor)

- [Manage sensors from the management console](how-to-manage-sensors-from-the-on-premises-management-console.md)
