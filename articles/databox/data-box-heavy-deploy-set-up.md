---
title: Tutorial to set up Azure Data Box Heavy| Microsoft Docs
description: In this tutorial, learn how to cable your Azure Data Box Heavy, connect Azure Data Box heavy, and turn on Azure Data Box Heavy.
services: databox
author: stevenmatthew

ms.service: databox
ms.subservice: heavy
ms.topic: tutorial
ms.date: 10/18/2019
ms.author: shaas

# Customer intent: As an IT admin, I need to be able to set up Data Box Heavy to upload on-premises data from my server onto Azure.
---
::: zone target = "docs"

# Tutorial: Cable and connect to your Azure Data Box Heavy

::: zone-end

::: zone target = "chromeless"

## Get started with Azure Data Box Heavy

::: zone-end

::: zone target = "docs"

This tutorial describes how to cable, connect, and turn on your Azure Data Box Heavy.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Cable your Data Box Heavy
> * Connect to your Data Box Heavy

::: zone-end

::: zone target = "chromeless"

This guide provides instructions on how to review prerequisites, cable and connect your device, copy data, upload to Azure and then verify the uploaded data.

::: zone-end

## Prerequisites

Before you begin, make sure that:

1. You complete the [Tutorial: Order Azure Data Box Heavy](data-box-heavy-deploy-ordered.md).
2. You receive your Data Box Heavy, and the order status in the portal is **Delivered**.
   - If you used White Glove service for your order, the delivery service uncrated the device and took the crate with them to use when you return the device.
   - If you managed shipping via another carrier, you uncrated the device and saved the crate to use when you return the device. *You must return the device in the same crate in which it was shipped.*
1. You review the [Data Box Heavy safety guidelines](data-box-safety.md).
1. You must have access to a flat site in the datacenter with proximity to an available network connection that can accommodate a device with this footprint. This device can't be mounted on a rack.
1. You receive four grounded power cords to use with your storage device.
1. You should have a host computer connected to the datacenter network. Your Data Box Heavy copies the data from this computer. Your host computer must run a [Supported operating system](data-box-heavy-system-requirements.md).
1. Your datacenter has a high-speed network. We strongly recommend that you have at least one 10-GbE connection. 
1. You have a laptop with RJ-45 cable to connect to the local UI and configure the device. Use the laptop to configure each node of the device once.
1. The following cables are shipped with the device -
   - 4 x Mellanox passive copper cables VPI 2M - MC2206130-002
   - 4 x Mellanox Ethernet cable adapters - MAM1Q00A-QSA
   - Regional power cord 
1. You have one 40-Gbps cable or 10-Gbps cable per device node. If you have your own cables - 
    - Choose cables that are compatible with the Mellanox MCX314A-BCCT network interface.
    - For the 40-Gbps cable, device end of the cable needs to be QSFP+.
    - For the 10-Gbps cable, you need an SFP+ cable that plugs into a 10-Gbps switch on one end, with a QSFP+ to SFP+ adapter (or the QSA adapter) for the end that plugs into the device.

::: zone target = "docs"

## Cable your device for power

Take the following steps to cable your device.

1. Inspect the device for any evidence of tampering, or any other obvious damage. Don't proceed if the device shows signs of tampering with or is severely damaged. [Contact Microsoft Support](data-box-disk-contact-microsoft-support.md) immediately to help you assess whether the device is in good working order and if they need to ship you a replacement.
2. Move the device to the installation site.

    :::image type="content" source="media/data-box-heavy-deploy-set-up/data-box-heavy-install-site.png" alt-text="Screenshot of the Data Box Heavy device installation site." :::

3. Lock the rear casters on the device as shown.

    :::image type="content" source="media/data-box-heavy-deploy-set-up/data-box-heavy-casters-locked.png" alt-text="Screenshot of the Data Box Heavy device's casters locked.":::

4. Locate the knobs that unlock the front and the back doors of the device. Unlock and move the front door until it's flush with the side of the device. Repeat the process with the back door as well.
    Both the doors must stay open when the device is operational to allow for optimum front-to-back air flow through the device.

    :::image type="content" source="media/data-box-heavy-deploy-set-up/data-box-heavy-doors-open.png" alt-text="Screenshot of Data Box Heavy doors open.":::

5. The tray at the back of the device should have four power cables. Remove all the cables from the tray and place them aside.

    :::image type="content" source="media/data-box-heavy-deploy-set-up/data-box-heavy-power-cords-tray.png" alt-text="Screenshot of the Data Box Heavy power cords in the tray.":::

6. The next step is to identify the various ports at the back of the device. There are two device nodes, **NODE1** and **NODE2**. Each node has four network interfaces, **MGMT**, **DATA1**, **DATA2**, **DATA3**. **MGMT** is used to configure management during the initial configuration of the device. **DATA1**-**DATA3** are data ports. **MGMT** and **DATA3** ports are 1 Gbps, whereas **DATA1**, **DATA2** can work as 40-Gbps ports or 10-Gbps ports. At the bottom of the two device nodes, are four power supply units (PSUs) that are shared across the two device nodes. As you face this device, the **PSUs** are **PSU1**, **PSU2**, **PSU3**, and **PSU4** from left to right.

    :::image type="content" source="media/data-box-heavy-deploy-set-up/data-box-heavy-ports.png" alt-text="Screenshot of the Data Box Heavy ports.":::

7. Connect all four power cables to the device's power supplies. The green LEDs turn on and blink.
8. Turn on the device nodes using the power buttons in the front plane. Keep the power button depressed for a few seconds until the blue lights illuminate. All green LEDs for the power supplies in the back of the device should now be solid. The front operating panel of the device also contains fault LEDs. A lit fault LED indicates a faulty PSU or a fan, or an issue with the disk drives.  

    :::image type="content" source="media/data-box-heavy-deploy-set-up/data-box-heavy-front-ops-panel.png" alt-text="Screenshot of the Data Box Heavy front ops panel.":::

## Cable first node for network

On one of the nodes of the device, take the following steps to cable for network.

1. Connect the host computer to the 1-Gbps management port using a CAT 6 RJ-45 network cable. This cable is shown in the photo at top-right, attached to plug labeled `MGMT`.
2. Connect at least one 40-Gbps (preferred over 1 Gbps) network interface for data using a QSFP+ cable (fiber or copper). When using a 10-Gbps switch, connect the 40-Gbps network interface for data using an SFP+ cable with a QSFP+ to SFP+ adapter (the QSA adapter).

    :::image type="content" source="media/data-box-heavy-deploy-set-up/data-box-heavy-ports-cabled.png" alt-text="Screenshot of Data Box Heavy ports cabled.":::

    > [!IMPORTANT]
    > DATA 1 and DATA2 are switched and do not match what is displayed in the local web UI.
    > The 40 Gbps cable adapter connects when inserted the way as shown.

    :::image type="content" source="media/data-box-heavy-deploy-set-up/data-box-heavy-cable-adaptor.png" alt-text="Screenshot of the Data Box Heavy 40-Gbps cable adaptor.":::

## Configure first node

Take the following steps to set up your device using the local configuration and the Azure portal.

1. Download the device credentials from portal. Go to **General > Device details**. Copy the **Device password**. These passwords are tied to a specific order in the portal. Two device serial numbers are visible. These serial numbers correspond to the two nodes in Data Box Heavy. The device administrator password for both nodes is the same.

    :::image type="content" source="media/data-box-heavy-deploy-set-up/data-box-heavy-device-credentials.png" alt-text="Screenshot of Data Box Heavy device credentials.":::

2. Connect your client workstation to the device via a CAT6 RJ-45 network cable.
3. Configure the Ethernet adapter on the computer you're using to connect to device with a static IP address of `192.168.100.5` and subnet `255.255.255.0`.

    :::image type="content" source="media/data-box-heavy-deploy-set-up/data-box-heavy-connect-local-web-ui.png" alt-text="Screenshot showing the initial connection to the Data Box Heavy local web UI.":::

4. Connect to the local web UI of the device at the following URL: `http://192.168.100.10`. Select **Advanced**, then select **Proceed to 192.168.100.10 (unsafe)**.
5. The **Sign in** page for the local web UI is displayed.
    
    - One of the node serial numbers on this page matches across both the portal UI and the local web UI. Make a note of the node number to the serial number mapping. There are two nodes and two device serial numbers in the portal. This mapping helps you understand which node corresponds to which serial number.
    - The device is locked at this point.
    - Provide the device administrator password obtained in the previous step and select **Sign in** to sign into the device.

    :::image type="content" source="media/data-box-heavy-deploy-set-up/data-box-heavy-unlock-device.png" alt-text="Screenshot the Data Box Heavy sign in screen using the local web UI.":::

5. On the Dashboard, ensure that the network interfaces are configured. There are four network interfaces on your device node, two 1 Gbps, and two 40 Gbps. One of the 1-Gbps interfaces is a management interface and hence not user configurable. The remaining three network interfaces are dedicated to data and configured by the user.

- If DHCP is enabled in your environment, network interfaces are automatically configured.
- If DHCP isn't enabled, go to Set network interfaces, and assign static IPs if needed.

    :::image type="content" source="media/data-box-heavy-deploy-set-up/data-box-heavy-dashboard-1.png" alt-text="Screenshot of the Data Box Heavy dashboard while configuring node 1.":::

## Configure second node

Do the steps detailed in the [Configure the first node](#configure-first-node) for the second node of the device.

:::image type="content" source="media/data-box-heavy-deploy-set-up/data-box-heavy-dashboard-2.png" alt-text="Screenshot of the Data Box Heavy dashboard while configuring node 2.":::

After the device setup is complete, you can connect to the device shares and copy the data from your computer to the device.

## Next steps

In this tutorial, you learned about Azure Data Box Heavy topics such as:

> [!div class="checklist"]
> * Cable your Data Box Heavy
> * Connect to your Data Box Heavy

Advance to the next tutorial to learn how to copy data on your Data Box Heavy.

> [!div class="nextstepaction"]
> [Copy your data to Azure Data Box](./data-box-heavy-deploy-copy-data.md)

::: zone-end
