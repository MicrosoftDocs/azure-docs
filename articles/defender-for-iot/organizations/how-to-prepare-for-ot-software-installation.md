---
title: Prepare to install OT network monitoring software - Microsoft Defender for IoT
description: Learn how to install agentless monitoring software for an OT sensor and an on-premises management console for Microsoft Defender for IoT. Use this article if you're reinstalling software on a pre-configured appliance, or if you've chosen to install software on your own appliances.
ms.date: 12/13/2022
ms.topic: how-to
---

# Prepare for OT agentless monitoring software installation

This article describes how to prepare to install agentless monitoring software for OT sensors and on-premises management consoles. You might need the procedures in this article if you're reinstalling software on a pre-configured appliance, or if you've chosen to install software on your own appliances.

## Download software files from the Azure portal

Download OT sensor and on-premises management console software from the Azure portal.

On the Defender for IoT > **Getting started** page, select the **Sensor**, **On-premises management console**, or **Updates** tab and locate the software you need.

If you're updating from a previous version, check the options carefully to ensure that you have the correct update path for your situation.

Mount the ISO file onto your hardware appliance or VM using one of the following options:

- **Physical media** – burn the ISO file to your external storage, and then boot from the media.

    -	DVDs: First burn the software to the DVD as an image
    -	USB drive: First make sure that you’ve created a bootable USB drive with software such as [Rufus](https://rufus.ie/en/), and then save the software to the USB drive. USB drives must have USB version 3.0 or later.

    Your physical media must have a minimum of 4-GB storage.

- **Virtual mount** – use iLO for HPE appliances, or iDRAC for Dell appliances to boot the ISO file.

## Pre-installation configuration

Each appliance type comes with its own set of instructions that are required before installing Defender for IoT software.

Make sure that you've completed any specific procedures required for your appliance before installing Defender for IoT software. For more information, see the [OT monitoring appliance catalog](appliance-catalog/appliance-catalog-overview.md).

For more information, see:

- [Which appliances do I need?](ot-appliance-sizing.md)
- [Pre-configured physical appliances for OT monitoring](ot-pre-configured-appliances.md), including the catalog of available appliances
- [OT monitoring with virtual appliances](ot-virtual-appliances.md)

## Configure tunneling access for sensors through the on-premises management console

Enhance system security by preventing direct user access to the sensor.

Instead of direct access, use proxy tunneling to let users access the sensor from the on-premises management console with a single firewall rule. This technique narrows the possibility of unauthorized access to the network environment beyond the sensor. The user's experience when signing in to the sensor remains the same.

When tunneling access is configured, users use the following URL syntax to access their sensor consoles: `https://<on-premises management console address>/<sensor address>/<page URL>`

For example, the following image shows a sample architecture where users access the sensor consoles via the on-premises management console.

:::image type="content" source="media/tutorial-install-components/sensor-system-graph.png" alt-text="Screenshot that shows access to the sensor." border="false":::

The interface between the IT firewall, on-premises management console, and the OT firewall is done using a reverse proxy with URL rewrites. The interface between the OT firewall and the sensors is done using reverse SSH tunnels.

**To enable tunneling access for sensors**:

1. Sign in to the on-premises management console's CLI with the *cyberx* or the *support* user credentials. For more information, see [Default privileged on-premises users](roles-on-premises.md#default-privileged-on-premises-users).

1. Enter `sudo cyberx-management-tunnel-enable`.

1. Select **Enter**.

1. Enter `--port 10000`.

## Next steps

For more information, see:

- [Install OT monitoring software on OT sensors](how-to-install-software.md)
- [Install OT monitoring software on an on-premises management console](how-to-install-ot-software-on-premises-management-console.md)
- [Prepare your OT network for Microsoft Defender for IoT](how-to-set-up-your-network.md)
- [Troubleshoot the sensor and on-premises management console](how-to-troubleshoot-the-sensor-and-on-premises-management-console.md)
- [Which appliances do I need?](ot-appliance-sizing.md)
- [Pre-configured physical appliances for OT monitoring](ot-pre-configured-appliances.md)
- [OT monitoring with virtual appliances](ot-virtual-appliances.md)
