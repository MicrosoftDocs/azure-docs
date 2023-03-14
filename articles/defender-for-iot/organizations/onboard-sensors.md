---
title: Onboard sensors to Defender for IoT in the Azure portal
description: Learn how to onboard sensors to Defender for IoT in the Azure portal.
ms.date: 06/02/2022
ms.topic: install-set-up-deploy
ms.collection:
  -       zerotrust-services
---

# Onboard OT sensors to Defender for IoT

This article describes how to onboard sensors with [Defender for IoT in the Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started).

> [!TIP]
> As part of the onboarding process, you'll assign your sensor to a site and zone. Segmenting your network by sites and zones is an integral part of implementing a [Zero Trust security strategy](concept-zero-trust.md). Assinging sensors to specific sites and zones will help you monitor for unauthorized traffic crossing segments. 
> 
> Data ingested from sensors in the same site or zone can be viewed together, segemented out from other data in your system. If there's sensor data that you want to view grouped together in the same site or zone, make sure to assign sensor sites and zones accordingly.

## Prerequisites

To perform the procedures in this article, you need:

- An [OT plan added](how-to-manage-subscriptions.md) in Defender for IoT in the Azure portal.

- A clear understanding of where your OT network sensors are placed in your network, and how you want to [segment your network into sites and zones](concept-zero-trust.md).

## Purchase sensors or download software for sensors

This procedure describes how to use the Azure portal to contact vendors for pre-configured appliances, or how to download software for you to install on your own appliances.

1. In the Azure portal, go to **Defender for IoT** > **Getting started** > **Sensor**.

1. Do one of the following steps:

    - **To buy a pre-configured appliance**, select **Contact** under **Buy preconfigured appliance**.

        This link opens an email to [hardware.sales@arrow.com](mailto:hardware.sales@arrow.com?cc=DIoTHardwarePurchase@microsoft.com&subject=Information%20about%20Microsoft%20Defender%20for%20IoT%20pre-configured%20appliances&body=Dear%20Arrow%20Representative,%0D%0DOur%20organization%20is%20interested%20in%20receiving%20quotes%20for%20Microsoft%20Defender%20for%20IoT%20appliances%20as%20well%20as%20fulfillment%20options.%0D%0DThe%20purpose%20of%20this%20communication%20is%20to%20inform%20you%20of%20a%20project%20which%20involves%20[NUMBER]%20sites%20and%20[NUMBER]%20sensors%20for%20[ORGANIZATION%20NAME].%20Having%20reviewed%20potential%20appliances%20suitable%20for%20our%20project,%20we%20would%20like%20to%20obtain%20more%20information%20about:%20___________%0D%0D%0DI%20would%20appreciate%20being%20contacted%20by%20an%20Arrow%20representative%20to%20receive%20a%20quote%20for%20the%20items%20mentioned%20above.%0DI%20understand%20the%20quote%20and%20appliance%20delivery%20shall%20be%20in%20accordance%20with%20the%20relevant%20Arrow%20terms%20and%20conditions%20for%20Microsoft%20Defender%20for%20IoT%20pre-configured%20appliances.%0D%0D%0DBest%20Regards,%0D%0D%0D%0D%0D%0D//////////////////////////////%20%0D/////////%20Replace%20[NUMBER]%20with%20appropriate%20values%20related%20to%20your%20request.%0D/////////%20Replace%20[ORGANIZATION%20NAME]%20with%20the%20name%20of%20the%20organization%20you%20represent.%0D//////////////////////////////%0D%0D)with a template request for Defender for IoT appliances. For more information, see [Pre-configured physical appliances for OT monitoring](ot-pre-configured-appliances.md).

    - **To install software on your own appliances**, do the following:

        1. Make sure that you have a supported appliance available. For more information, see [Which appliances do I need?](ot-appliance-sizing.md).

        1. Under **Select version**, select the software version you want to install. We recommend that you always select the most recent version.

        1. Select **Download**. Download the sensor software and save it in a location that you can access from your selected appliance.

           [!INCLUDE [root-of-trust](includes/root-of-trust.md)]

        1. Install your software. For more information, see [Defender for IoT installation](how-to-install-software.md).

## Onboard an OT sensor

This procedure describes how to *onboard*, or register, an OT network sensor with Defender for IoT and download a sensor activation file.

**To onboard your OT sensor to Defender for IoT**:

1. In the Azure portal, go to **Defender for IoT** > **Getting started** and select **Set up OT/ICS Security**.

    Alternately, from the Defender for IoT **Sites and sensors** page, select **Onboard OT sensor** > **OT**.

1. By default, on the **Set up OT/ICS Security** page, **Step 1: Did you set up a sensor?** and **Step 2: Configure SPAN port or TAP​** of the wizard are collapsed. If you haven't completed these steps, do so before continuing. For more information, see:

    - [Choose a traffic mirroring method for traffic monitoring](best-practices/traffic-mirroring-methods.md)
    - [Install OT monitoring software on OT sensors](ot-deploy/install-software-ot-sensor.md)

1. In **Step 3: Register this sensor with Microsoft Defender for IoT** enter or select the following values for your sensor:

    1. In the **Sensor name** field, enter a meaningful name for your OT sensor.  

        We recommend including your OT sensor's IP address as part of the name, or using another easily identifiable name. You want to keep track of the registration name in the Azure portal and the IP address of the sensor shown in the OT sensor console.

    1. In the **Subscription** field, select your Azure subscription.

        If you don't yet have a subscription to select, select **Onboard subscription** to [add an OT plan to your Azure subscription](getting-started.md).

    1. (Optional) Toggle on the **Cloud connected** option to have your OT sensor connected to Azure services, such as Microsoft Sentinel. For more information, see [Cloud-connected vs. local OT sensors](architecture.md#cloud-connected-vs-local-ot-sensors).

    1. (Optional) Toggle on the **Automatic Threat Intelligence updates** to have Defender for IoT automatically push [threat intelligence packages](how-to-work-with-threat-intelligence-packages.md) to your OT sensor.

    1. In the **Sensor version** field, verify that **22.X and above** is selected.

        If you're working with legacy OT sensor software, we recommend that you update your version. For more information, see [Update Defender for IoT OT monitoring software](update-ot-software.md).

    1. In the **Site** section, enter the following details to define your OT sensor's site.

        - In the **Resource name** field, select the site you want to use for your OT sensor, or select **Create site** to create a new one.

        - In the **Display name** field, enter a meaningful name for your site to be shown across Defender for IoT in Azure.

        - (Optional) In the **Tags** > **Key** and **Value** fields, enter tag values to help you identify and locate your site and sensor in the Azure portal.

    1. In the **Zone** field, select the zone you want to use for your OT sensor, or select **Create zone** to create a new one.

        For example:

        :::image type="content" source="media/sites-and-zones/sites-and-zones-azure.png" alt-text="Screenshot of the Set up OT/ICS Security page with site and zone details defined":::

1. When you're done with all other fields, select **Register**.

A success message appears and your activation file is automatically downloaded, and your sensor is now shown under the configured site on the Defender for IoT **Sites and sensors** page.

Until you activate your sensor, the sensor's status shows as **Pending Activation**.

Make the downloaded activation file accessible to the sensor console admin so that they can activate the sensor.

[!INCLUDE [root-of-trust](includes/root-of-trust.md)]

## Next steps

- [Install OT agentless monitoring software](how-to-install-software.md)
- [Activate and set up your sensor](how-to-activate-and-set-up-your-sensor.md)
- [Manage sensors with Defender for IoT in the Azure portal](how-to-manage-sensors-on-the-cloud.md)
- [Manage individual sensors](how-to-manage-individual-sensors.md)
- [View and manage alerts on the Defender for IoT portal (Preview)](how-to-manage-cloud-alerts.md)