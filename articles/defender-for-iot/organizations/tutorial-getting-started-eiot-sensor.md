---
title: Get started with Enterprise IoT - Microsoft Defender for IoT
description: In this tutorial, you'll learn how to onboard to Microsoft Defender for IoT with an Enterprise IoT deployment
ms.topic: tutorial
ms.date: 12/12/2021
ms.custom: template-tutorial
---

# Tutorial: Get started with Enterprise IoT monitoring

This tutorial will help you learn how to get started with your Enterprise IoT monitoring deployment.

Microsoft Defender for IoT has extended the agentless capabilities to go beyond operational environments, and advance into the realm of enterprise environments. Defender for IoT supports the entire breadth of IoT devices in your environment, including everything from corporate printers, cameras, to purpose-built devices, proprietary, and unique devices.

You can extend your analytics capabilities to view alerts, vulnerabilities and recommendations for your enterprise devices with the Microsoft Defender for Endpoint integration. For more information, see the [Defender for Endpoint documentation](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up a server or Virtual Machine (VM)
> * Prepare your environment
> * Set up an Enterprise IoT sensor
> * Install the sensor
> * Validate your setup
> * View detected Enterprise IoT devices in the Azure portal
> * View devices, alerts, vulnerabilities, and recommendations in Defender for Endpoint

> [!IMPORTANT]
> The **Enterprise IoT network sensor** is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

Before you start, make sure that you have:

- A Defender for IoT plan added to your Azure subscription. You can add a plan from Defender for IoT in the Azure portal, or from Defender for Endpoint. If you already have a subscription that has Defender for IoT onboarded for OT environments, you’ll need to edit the plan to add Enterprise IoT. 
For more information, see  [Quickstart: Get started with Defender for IoT](getting-started.md), [Edit a plan](how-to-manage-subscriptions.md#edit-a-plan), or the [Defender for Endpoint documentation](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration).

- The Azure permissions, as listed in [Quickstart: Getting Started with Defender for IoT](getting-started.md#permissions). 

## Set up a server or Virtual Machine (VM)

Before you deploy your Enterprise IoT sensor, you'll need to configure your server, or VM, and connect a Network Interface Card (NIC) to a switch monitoring (SPAN) port.

**To set up a server, or VM**:

1. Ensure that your resources are set to one of the following specifications:

    | Tier | Requirements |
    |--|--|
    | **Minimum** | To support up to 1 Gbps: <br><br>- 4 CPUs, each with 2.4 GHz or more<br>- 16 GB RAM of DDR4 or better<br>- 250 GB HDD |
    | **Recommended** | To support up to 15 Gbps: <br><br>-	8 CPUs, each with 2.4 GHz or more<br>-  32 GB RAM of DDR4 or better<br>- 500 GB HDD |
   
    Make sure that your server or VM also has:
   
    * Two network adapters
    * Ubuntu 18.04 operating system.

1. Connect a NIC to a switch.

    * **Physical device** - connect a monitoring network interface (NIC) to a switch monitoring (SPAN) port.

    * **VM** - Connect a vNIC to a vSwitch in promiscuous mode.

        * For a VM, run the following command to enable the network adapter in promiscuous mode.

            ```bash
            ifconfig <monitoring port> up promisc
            ```

1. Validate incoming traffic to the monitoring port with the following command:

    ```bash
    ifconfig <monitoring interface>
    ```

    If the number of RX packets increases each time, the interface is receiving incoming traffic. Repeat this step for each interface you have.

## Prepare your environment

The environment will now have to be prepared.

**To prepare the environment**:

1. Open the following ports in your firewall:

    * HTTPS - 443 TCP

    * DNS - 53 TCP

1. Hostnames for Azure resources:

    * **EventHub**: *.servicebus.windows.net

    * **Storage**: *.blob.core.windows.net

    * **Download Center**: download.microsoft.com

    * **IoT Hub**: *.azure-devices.net

You can also download and add the [Azure public IP ranges](https://www.microsoft.com/download/details.aspx?id=56519) so your firewall will allow the Azure resources that are specified above, along with their region.

> [!Note]
> The Azure public IP ranges are updated weekly. New ranges appearing in the file will not be used in Azure for at least one week. Please download the new json file every week and perform the necessary changes at your site to correctly identify services running in Azure.

## Set up an Enterprise IoT sensor

A sensor is needed to discover and continuously monitor Enterprise IoT devices. The sensor will use the Enterprise IoT network and endpoint sensors to gain comprehensive visibility.

**Prerequisites**: Make sure that you've completed [Set up a server or Virtual Machine (VM)](#set-up-a-server-or-virtual-machine-vm) and [Prepare your environment](#prepare-your-environment), including verifying that you have the listed required resources.

**To set up an Enterprise IoT sensor**:

1. In the Azure portal, go to **Defender for IoT** > **Getting started**.

1. Select **Set up Enterprise IoT Security**.

    :::image type="content" source="media/tutorial-get-started-eiot/onboard-sensor.png" alt-text="On the Getting Started page select Onboard sensor.":::

1. In the **Sensor name** field, enter a meaningful name for your sensor.

1. From the **Subscription** drop-down menu, select the subscription where you want to add your sensor.

1. Select **Register**. A **Sensor registration successful** screen shows your next steps and the command you'll need to start the sensor installation.

    For example:

    :::image type="content" source="media/tutorial-get-started-eiot/successful-registration.png" alt-text="Screenshot of the successful registration of an Enterprise IoT sensor.":::

1. Copy the command to a safe location, and continue [below](#install-the-sensor).


## Install the sensor

Run the command that you received and saved when you registered the Enterprise IoT sensor. The installation process checks to see if the required Docker version is already installed. If it’s not, the sensor installation also installs the latest Docker version.

**To install the sensor**:

1. Sign in to the sensor's CLI using a terminal, such as PUTTY, or MobaXterm.

1. Run the command that you saved from [setting up an Enterprise IoT sensor](#set-up-an-enterprise-iot-sensor).

1. When the command is complete, the installation wizard will appear.

1. `What is the name of the monitored interface?` Use the space bar to select an interface.

    :::image type="content" source="media/tutorial-get-started-eiot/monitored-interface.png" alt-text="Screenshot of the select monitor interface selection scree.":::

1. Select **Ok**.

1. `Setup proxy server`.

    * If no, select **No**.

    * If yes, select **Yes**.

1. (Optional) If you're setting up a proxy server.

    1. Enter the proxy server host, and select **Ok**.

    1. Enter the proxy server port, and select **Ok**.

    1. Enter the proxy server username, and select **Ok**.

    1. Enter the server password, and select **Ok**.

The installation will now finish.

## Validate your setup

1. Wait 1 minute after the installation has completed, and run the following command to process the sanity of your system.

    ```bash
    sudo docker ps
    ```

1. Ensure the following containers are up:

    * compose_statistics-collector_1

    * compose_cloud-communication_1

    * compose_horizon_1

    * compose_attributes-collector_1

    * compose_properties_1

    :::image type="content" source="media/tutorial-get-started-eiot/up-healthy.png" alt-text="Screenshot showing the containers are up and healthy.":::

1. Monitor port validation with the following command to see which interface is defined to handle port mirroring:

    ```bash
    sudo docker logs compose_horizon_1
    ````

    :::image type="content" source="media/tutorial-get-started-eiot/defined-interface.png" alt-text="Run the command to see which interface is defined to handle port monitoring.":::

1. Wait 5 minutes, and run the following command to check the traffic D2C sanity:

    ```bash
    sudo docker logs -f compose_attributes-collector_1
    ```

    Ensure that packets are being sent to the Event Hubs.

## View detected Enterprise IoT devices in Azure

You can view your devices and network information in the Defender for IoT **Device inventory** page.

Once you've validated your setup, the **Device inventory** page will start to populate with all of your devices after 15 minutes.

To view your device inventory in the Azure portal, go to **Defender for IoT** > **Device inventory**.

You can also view your sensors from the **Sites and sensors** page. Enterprise IoT sensors are all automatically added to the same site, named **Enterprise network**.

For more information, see:

- [Manage your IoT devices with the device inventory for organizations](how-to-manage-device-inventory-for-organizations.md)
- [Manage sensors with Defender for IoT in the Azure portal](how-to-manage-sensors-on-the-cloud.md)

> [!TIP]
> If you don't see your Enterprise IoT data in Defender for IoT as expected, make sure that you're viewing the Azure portal with the correct subscriptions selected. For more information, see [Manage Azure portal settings](/azure/azure-portal/set-preferences).

## Microsoft Defender for Endpoint integration

Once you’ve onboarded a plan and set up your sensor, your device data integrates automatically with Microsoft Defender for Endpoint. Discovered devices appear in both the Defender for IoT and Defender for Endpoint portals, extending security analytics capabilities for your Enterprise IoT devices and providing complete coverage.

In Defender for Endpoint, you can view discovered IoT devices and related alerts, vulnerabilities, and recommendations. For more information, see:

- [Microsoft Defender for IoT integration](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration)
- [Defender for Endpoint device inventory](/microsoft-365/security/defender-endpoint/machines-view-overview)
- [View and organize the Microsoft Defender for Endpoint Alerts queue](/microsoft-365/security/defender-endpoint/alerts-queue)
- [Vulnerabilities in my organization](/microsoft-365/security/defender-vulnerability-management/)
- [Security recommendations](/microsoft-365/security/defender-vulnerability-management/tvm-security-recommendation)

## Remove the sensor (optional)

Remove a sensor that's no longer in use from Defender for IoT.

**To remove a sensor**, run the following command:

```bash
sudo apt purge -y microsoft-eiot-sensor
```

## Next steps

For more information, see:

- [Manage sensors with Defender for IoT in the Azure portal](how-to-manage-sensors-on-the-cloud.md)
- [Threat intelligence research and packages](how-to-work-with-threat-intelligence-packages.md)
- [Manage your IoT devices with the device inventory for organizations](how-to-manage-device-inventory-for-organizations.md)
- [View and manage alerts on the Defender for IoT portal](how-to-manage-cloud-alerts.md)
- [Use Azure Monitor workbooks in Microsoft Defender for IoT (Public preview)](workbooks.md)
- [OT threat monitoring in enterprise SOCs](concept-sentinel-integration.md)
