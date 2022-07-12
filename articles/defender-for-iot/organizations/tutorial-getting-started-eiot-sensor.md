---
title: Get started with Enterprise IoT - Microsoft Defender for IoT
description: In this tutorial, you'll learn how to onboard to Microsoft Defender for IoT with an Enterprise IoT deployment
ms.topic: tutorial
ms.date: 07/11/2022
ms.custom: template-tutorial
---

# Tutorial: Get started with Enterprise IoT monitoring

This tutorial describes how to get started with your Enterprise IoT monitoring deployment with Microsoft Defender for IoT.

Defender for IoT supports the entire breadth of IoT devices in your environment, including everything from corporate printers and cameras, to purpose-built, proprietary, and unique devices.

Integrate with [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration) for analytics features that include alerts, vulnerabilities, and recommendations for your enterprise devices.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up a server or Virtual Machine (VM)
> * Prepare your networking requirements
> * Set up an Enterprise IoT sensor in the Azure portal
> * Install the sensor software
> * Validate your setup
> * View detected Enterprise IoT devices in the Azure portal
> * View devices, alerts, vulnerabilities, and recommendations in Defender for Endpoint

> [!IMPORTANT]
> The **Enterprise IoT network sensor** is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

Before you start, make sure that you have:

- A Defender for IoT plan added to your Azure subscription. 

    You can add a plan from Defender for IoT in the Azure portal, or from Defender for Endpoint. If you already have a subscription that has Defender for IoT onboarded for OT environments, you’ll need to edit the plan to add Enterprise IoT.

    For more information, see  [Quickstart: Get started with Defender for IoT](getting-started.md), [Edit a plan](how-to-manage-subscriptions.md#edit-a-plan), or the [Defender for Endpoint documentation](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration).

- Required Azure permissions, as listed in [Quickstart: Getting Started with Defender for IoT](getting-started.md#permissions).

## Set up a server or Virtual Machine (VM)

Before you deploy your Enterprise IoT sensor, you'll need to configure your server or VM, and connect a Network Interface Card (NIC) to a switch monitoring (SPAN) port.

**To set up a server or VM**:

1. Ensure that your resources are set to one of the following specifications:

    | Tier | Requirements |
    |--|--|
    | **Minimum** | To support up to 1 Gbps: <br><br>- 4 CPUs, each with 2.4 GHz or more<br>- 16-GB RAM of DDR4 or better<br>- 250 GB HDD |
    | **Recommended** | To support up to 15 Gbps: <br><br>-	8 CPUs, each with 2.4 GHz or more<br>-  32-GB RAM of DDR4 or better<br>- 500 GB HDD |

    Make sure that your server or VM also has:

    - Two network adapters
    - Ubuntu 18.04 operating system

1. Connect a NIC to a switch as follows:

    - **Physical device** - Connect a monitoring network interface (NIC) to a switch monitoring (SPAN) port.

    - **VM** - Connect a vNIC to a vSwitch in promiscuous mode.

        For a VM, run the following command to enable the network adapter in promiscuous mode.

        ```bash
        ifconfig <monitoring port> up promisc
        ```

1. Validate incoming traffic to the monitoring port. Run:

    ```bash
    ifconfig <monitoring interface>
    ```

    If the number of RX packets increases each time, the interface is receiving incoming traffic. Repeat this step for each interface you have.

## Prepare networking requirements

This procedure describes how to prepare networking requirements on your server or VM to work with Defender for IoT with Enterprise IoT networks.

**To prepare your networking requirements**:

1. Open the following ports in your firewall:

    - **HTTPS** - 443 TCP
    - **DNS** - 53 TCP

1. Make sure that your server or VM can access the cloud using HTTP on port 443 to the following Microsoft domains:

    - **EventHub**: `*.servicebus.windows.net`
    - **Storage**: `*.blob.core.windows.net`
    - **Download Center**: `download.microsoft.com`
    - **IoT Hub**: `*.azure-devices.net`

### (Optional) Download Azure public IP ranges

You can also download and add the [Azure public IP ranges](https://www.microsoft.com/download/details.aspx?id=56519) so your firewall will allow the Azure domains that are specified above, along with their region.

> [!Note]
> The Azure public IP ranges are updated weekly. New ranges appearing in the file will not be used in Azure for at least one week. To use this option, download the new json file every week and perform the necessary changes at your site to correctly identify services running in Azure.

## Set up an Enterprise IoT sensor

You'll need a Defender for IoT network sensor to discover and continuously monitor Enterprise IoT devices. Defender for IoT sensors use the Enterprise IoT network and endpoint sensors to gain comprehensive visibility.

**Prerequisites**: Make sure that you've completed [Set up a server or Virtual Machine (VM)](#set-up-a-server-or-virtual-machine-vm) and [Prepare networking requirements](#prepare-networking-requirements), including verifying that you have the listed required resources.

**To set up an Enterprise IoT sensor**:

1. In the Azure portal, go to **Defender for IoT** > **Getting started**.

1. Select **Set up Enterprise IoT Security**.

    :::image type="content" source="media/tutorial-get-started-eiot/onboard-sensor.png" alt-text="Screenshot of the Getting started page for Enterprise IoT security.":::

1. In the **Sensor name** field, enter a meaningful name for your sensor.

1. From the **Subscription** drop-down menu, select the subscription where you want to add your sensor.

1. Select **Register**. A **Sensor registration successful** screen shows your next steps and the command you'll need to start the sensor installation.

    For example:

    :::image type="content" source="media/tutorial-get-started-eiot/successful-registration.png" alt-text="Screenshot of the successful registration of an Enterprise IoT sensor.":::

1. Copy the command to a safe location, and continue by [installing the sensor](#install-the-sensor) software.


## Install the sensor

Run the command that you received and saved when you registered the Enterprise IoT sensor. The installation process checks to see if the required Docker version is already installed. If it’s not, the sensor installation also installs the latest Docker version.

**To install the sensor**:

1. Sign in to the sensor's CLI using a terminal, such as PUTTY, or MobaXterm.

1. Run the command that you saved from [setting up an Enterprise IoT sensor](#set-up-an-enterprise-iot-sensor).

    The installation wizard appears when the command process completes:

    - In the **What is the name of the monitored interface?** screen, use the SPACEBAR to select the interfaces you want to monitor with your sensor, and then select OK.

    - In the **Set up proxy server** screen, select whether to set up a proxy server for your sensor (**Yes** / **No**).

        (Optional) If you're setting up a proxy server, define the following values, selecting **Ok** after each option:

        - Proxy server host
        - Proxy server port
        - Proxy server username
        - Proxy server password

The installation process completes.

## Validate your setup

Wait 1 minute after your sensor installation has completed before starting to validate your sensor setup.

**To validate the sensor setup**:

1. To process your system sanity, run:

    ```bash
    sudo docker ps
    ```

1. In the results that display, ensure that the following containers are up:

    - `compose_statistics-collector_1`
    - `compose_cloud-communication_1`
    - `compose_horizon_1`
    - `compose_attributes-collector_1`
    - `compose_properties_1`

1. Check your port validation to see which interface is defined to handle port mirroring. Run:

    ```bash
    sudo docker logs compose_horizon_1
    ````

    For example:

    :::image type="content" source="media/tutorial-get-started-eiot/defined-interface.png" alt-text="Screenshot of a result showing an interface defined to handle port monitoring.":::

1. Wait 5 minutes and then check your traffic D2C sanity. Run:

    ```bash
    sudo docker logs -f compose_attributes-collector_1
    ```

    Check your results to ensure that packets are being sent to the Event Hubs.

## View detected Enterprise IoT devices in Azure

Once you've validated your setup, the **Device inventory** page will start to populate with all of your devices after 15 minutes.

- View your devices and network information in the Defender for IoT **Device inventory** page on the Azure portal.

    To view your device inventory, go to **Defender for IoT** > **Device inventory**.

- You can also view your sensors from the **Sites and sensors** page. Enterprise IoT sensors are all automatically added to the same site, named **Enterprise network**.

For more information, see:

- [Manage your IoT devices with the device inventory for organizations](how-to-manage-device-inventory-for-organizations.md)
- [Manage sensors with Defender for IoT in the Azure portal](how-to-manage-sensors-on-the-cloud.md)

> [!TIP]
> If you don't see your Enterprise IoT data in Defender for IoT as expected, make sure that you're viewing the Azure portal with the correct subscriptions selected. For more information, see [Manage Azure portal settings](/azure/azure-portal/set-preferences).

## Microsoft Defender for Endpoint integration

Once you’ve onboarded a plan and set up your sensor, your device data integrates automatically with Microsoft Defender for Endpoint. Discovered devices appear in both the Defender for IoT and Defender for Endpoint portals. Use this integration to extend security analytics capabilities for your Enterprise IoT devices and providing complete coverage.

In Defender for Endpoint, you can view discovered IoT devices and related alerts, vulnerabilities, and recommendations. For more information, see:

- [Microsoft Defender for IoT integration](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration)
- [Defender for Endpoint device inventory](/microsoft-365/security/defender-endpoint/machines-view-overview)
- [View and organize the Microsoft Defender for Endpoint Alerts queue](/microsoft-365/security/defender-endpoint/alerts-queue)
- [Vulnerabilities in my organization](/microsoft-365/security/defender-vulnerability-management/)
- [Security recommendations](/microsoft-365/security/defender-vulnerability-management/tvm-security-recommendation)

## Remove an Enterprise IoT network sensor (optional)

Remove a sensor if it's no longer in use with Defender for IoT.

**To remove a sensor**, run the following command on the sensor server or VM:

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
