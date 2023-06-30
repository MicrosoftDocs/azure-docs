---
title: Onboard sensors to Defender for IoT in the Azure portal
description: Learn how to onboard sensors to Defender for IoT in the Azure portal.
ms.date: 05/28/2023
ms.topic: install-set-up-deploy
ms.collection:
  -       zerotrust-extra
---

# Onboard OT sensors to Defender for IoT

This article is one in a series of articles describing the [deployment path](ot-deploy/ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT, and describes how to onboard OT network sensors to [Microsoft Defender for IoT in the Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started).

:::image type="content" source="media/deployment-paths/progress-onboard-sensors.png" alt-text="Diagram of a progress bar with Onboard sensors highlighted." border="false" lightbox="media/deployment-paths/progress-onboard-sensors.png":::

## Prerequisites

Before you onboard an OT network sensor to Defender for IoT, make sure that you have the following:

- An [OT plan onboarded](getting-started.md) to Defender for IoT

- Access to the Azure portal as a [Security Admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner) user.

- An understanding of which [site and zone](best-practices/plan-corporate-monitoring.md#plan-ot-sites-and-zones) you'll want to assign to your sensor.

    Assigning sensors to specific sites and zones is an integral part of implementing a [Zero Trust security strategy](concept-zero-trust.md), and will help you monitor for unauthorized traffic crossing segments. For more information, see [List your planned OT sensors](best-practices/plan-prepare-deploy.md#list-your-planned-ot-sensors).

This step is performed by your deployment teams.

## Onboard an OT sensor

This procedure describes how to onboard an OT network sensor with Defender for IoT and download a sensor activation file.

**To onboard your OT sensor to Defender for IoT**:

1. In the Azure portal, go to **Defender for IoT** > **Getting started** and select **Set up OT/ICS Security**.

    Alternately, from the Defender for IoT **Sites and sensors** page, select **Onboard OT sensor** > **OT**.

1. By default, on the **Set up OT/ICS Security** page, **Step 1: Did you set up a sensor?** and **Step 2: Configure SPAN port or TAP​** of the wizard are collapsed.

    You'll install software and configure traffic mirroring later on in the deployment process, but should have your appliances ready and traffic mirroring method planned. For more information, see:

    - [Prepare on-premises appliances](best-practices/plan-prepare-deploy.md#prepare-on-premises-appliances)
    - [Choose a traffic mirroring method for traffic monitoring](best-practices/traffic-mirroring-methods.md)

1. In **Step 3: Register this sensor with Microsoft Defender for IoT** enter or select the following values for your sensor:

    1. In the **Sensor name** field, enter a meaningful name for your OT sensor.  

        We recommend including your OT sensor's IP address as part of the name, or using another easily identifiable name. You'll want to keep track of the registration name in the Azure portal and the IP address of the sensor shown in the OT sensor console.

    1. In the **Subscription** field, select your Azure subscription.

        If you don't yet have a subscription to select, select **Onboard subscription** to [add an OT plan to your Azure subscription](getting-started.md).

    1. (Optional) Toggle on the **Cloud connected** option to view detected data and manage your sensor from the Azure portal, and to connect your data to other Microsoft services, such as Microsoft Sentinel.

        For more information, see [Cloud-connected vs. local OT sensors](architecture.md#cloud-connected-vs-local-ot-sensors).

    1. (Optional) Toggle on the **Automatic Threat Intelligence updates** to have Defender for IoT automatically push [threat intelligence packages](how-to-work-with-threat-intelligence-packages.md) to your OT sensor.

    1. In the **Site** section, enter the following details:
        
        |Field name |Description  |
        |---------|---------|
        |**Resource name**     |  Select the site you want to attach your sensors to, or select **Create site** to create a new site.  <br><br>**If you're creating a new site**: <br>1. In the **New site** field, enter your site's name and select the checkmark button. <br>2.  From the **Site size** menu, select your site's size. The sizes listed in this menu are the sizes that you're licensed for, based on the licenses [you'd purchased](how-to-manage-subscriptions.md) in the Microsoft 365 admin center.  <br><br>If you're working with a legacy OT plan, the **Site size** field isn't included.   |
        |**Display name**     |    Enter a meaningful name for your site to be shown across Defender for IoT.   |
        |**Tags**     |   Enter tag key and values to help you identify and locate your site and sensor in the Azure portal.      |
        |**Zone**     | Select the zone you want to use for your OT sensor, or select **Create zone** to create a new one.        |

1. When you're done with all other fields, select **Register**. A success message appears and your activation file is automatically downloaded.

1. Select **Finish**. Your sensor is now shown under the selected site on the Defender for IoT **Sites and sensors** page.

Until you activate your sensor, the sensor's status will show as **Pending Activation**. Make the downloaded activation file accessible to the sensor console admin so that they can [activate the sensor](ot-deploy/activate-deploy-sensor.md).

[!INCLUDE [root-of-trust](includes/root-of-trust.md)]

> [!NOTE]
> Sites and zones configured on the Azure portal are not synchronized with [sites and zones configured on an on-premises management console](ot-deploy/sites-and-zones-on-premises.md).
>
> If you're working with a large deployment, we recommend that you use the Azure portal to manage cloud-connected sensors, and an on-premises management console to manage locally-managed sensors.

## Next steps

> [!div class="step-by-step"]
> [« Prepare an OT site deployment](best-practices/plan-prepare-deploy.md)

> [!div class="step-by-step"]
> [Configure traffic mirroring »](traffic-mirroring/traffic-mirroring-overview.md)
