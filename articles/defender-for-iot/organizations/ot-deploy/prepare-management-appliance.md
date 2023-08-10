---
title: Prepare an on-premises management console appliance - Microsoft Defender for IoT
description: Learn about how to prepare an on-premises management console appliance to manage air-gapped and locally managed OT sensors with Microsoft Defender for IoT.
ms.topic: install-set-up-deploy
ms.date: 02/22/2023
---


# Prepare an on-premises management console appliance

This article is one in a series of articles describing the [deployment path](air-gapped-deploy.md) for a Microsoft Defender for IoT on-premises management console for air-gapped OT sensors.

:::image type="content" source="../media/deployment-paths/management-prepare.png" alt-text="Diagram of a progress bar with Prepare your appliance highlighted." border="false" lightbox="../media/deployment-paths/management-prepare.png":::

Just as you'd [prepared an on-premises appliance](../best-practices/plan-prepare-deploy.md#prepare-on-premises-appliances) for your OT sensors, prepare an appliance for your on-premises management console.

## Prepare a virtual appliance

If you're using a virtual appliance, ensure that you have the relevant resources configured.

For more information, see [OT monitoring with virtual appliances](../ot-virtual-appliances.md).

## Prepare a physical appliance

If you're using a physical appliance, ensure that you have the required hardware. You can buy [pre-configured appliances](../ot-pre-configured-appliances.md), or plan to [install software](../ot-deploy/install-software-ot-sensor.md) on your own appliances.

To buy pre-configured appliances, email [hardware.sales@arrow.com](mailto:hardware.sales@arrow.com?cc=DIoTHardwarePurchase@microsoft.com&subject=Information%20about%20Microsoft%20Defender%20for%20IoT%20pre-configured%20appliances&body=Dear%20Arrow%20Representative,%0D%0DOur%20organization%20is%20interested%20in%20receiving%20quotes%20for%20Microsoft%20Defender%20for%20IoT%20appliances%20as%20well%20as%20fulfillment%20options.%0D%0DThe%20purpose%20of%20this%20communication%20is%20to%20inform%20you%20of%20a%20project%20which%20involves%20[NUMBER]%20sites%20and%20[NUMBER]%20sensors%20for%20[ORGANIZATION%20NAME].%20Having%20reviewed%20potential%20appliances%20suitable%20for%20our%20project,%20we%20would%20like%20to%20obtain%20more%20information%20about:%20___________%0D%0D%0DI%20would%20appreciate%20being%20contacted%20by%20an%20Arrow%20representative%20to%20receive%20a%20quote%20for%20the%20items%20mentioned%20above.%0DI%20understand%20the%20quote%20and%20appliance%20delivery%20shall%20be%20in%20accordance%20with%20the%20relevant%20Arrow%20terms%20and%20conditions%20for%20Microsoft%20Defender%20for%20IoT%20pre-configured%20appliances.%0D%0D%0DBest%20Regards,%0D%0D%0D%0D%0D%0D//////////////////////////////%20%0D/////////%20Replace%20[NUMBER]%20with%20appropriate%20values%20related%20to%20your%20request.%0D/////////%20Replace%20[ORGANIZATION%20NAME]%20with%20the%20name%20of%20the%20organization%20you%20represent.%0D//////////////////////////////%0D%0D) request your appliance.

For more information, see [Which appliances do I need?](../ot-appliance-sizing.md)

### Prepare ancillary hardware

If you're using physical appliances, make sure that you have the following extra hardware available for each physical appliance:

- A monitor and keyboard
- Rack space
- AC power
- A LAN cable to connect the appliance's management port to the network switch
- LAN cables for connecting mirror (SPAN) ports and network terminal access points (TAPs) to your appliance

## Prepare CA-signed certificates

While the on-premises management console is installed with a default, self-signed SSH/TLS certificate, we recommend using CA-signed certificates in production deployments.

[SSH/TLS certificate requirements](../best-practices/certificate-requirements.md) are the same for on-premises management consoles as they are for OT network sensors.

If you want to deploy a CA-signed certificate during initial deployment, make sure to have the certificate prepared. If you decide to deploy with the built-in, self-signed certificate, we recommend that you still deploy a CA-signed certificate in production environments later on.

For more information, see:

- [Create SSL/TLS certificates for OT appliances](../ot-deploy/create-ssl-certificates.md)
- [Manage SSL/TLS certificates](../how-to-manage-the-on-premises-management-console.md#manage-ssltls-certificates)

## Next steps

> [!div class="step-by-step"]
> [« Defender for IoT OT deployment path](ot-deploy-path.md)

> [!div class="step-by-step"]
> [Install Microsoft Defender for IoT on-premises management console software »](install-software-on-premises-management-console.md)
