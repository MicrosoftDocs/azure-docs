---
title: Get started with Enterprise IoT
description: In this tutorial, you will learn how to onboard to Microsoft Defender for IoT with an EIoT deployment
author: ElazarK
ms.author: v-ekrieg
ms.topic: tutorial
ms.date: 11/21/2021
ms.custom: template-tutorial
---

# Tutorial: Get started with Enterprise IoT

This tutorial will help you learn how to get started with your Enterprise IoT (EIoT) deployment.

Defender for IoT has extended the agentless capabilities to go beyond operational environments, and advance into the realm of enterprise environments. Coverage is now available to the entire breadth of IoT devices in your environment, including everything from corporate printers, cameras, to purpose-built devices, proprietary, and unique devices.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up a server or Virtual Machine (VM)
> * Prepare your environment
> * Register an Enterprise IoT sensor
> * Install the sensor
> * Validate your setup
> * View your enterprise IoT devices in the EIoT device inventory

## Prerequisites

An Azure subscription is required for this tutorial.

If you don't already have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

If you already have a subscription that is onboarded for Azure Defender for IoT for OT environments, you will need to create a new subscription. TO learn how to onboard a subscription, see [Onboard a subscription](how-to-manage-subscriptions.md#onboard-a-subscription).

There is a minimum security level needed to access different parts of Azure Defender for Iot. You must have a level of Security Owner, or a Subscription contributor of the subscription to onboard a subscription, and commit to a pricing. Security Reader level permissions to access the Defender for IoT user interface.

The following table describes user access permissions to Azure Defender for IoT portal tools:

| Permission | Security reader | Security admin | Subscription contributor | Subscription owner |
|--|--|--|--|--|
| View details and access software, activation files, and threat intelligence packages | ✓ | ✓ | ✓ | ✓ |
| Onboard a sensor |  | ✓ | ✓ | ✓ |
| Update pricing |  |  | ✓ | ✓ |

## Set up a server or Virtual Machine (VM)

Before you are able to deploy your Enterprise IoT sensor, you will need to configure your server, or VM, and connect a Network Interface Card (NIC) to a switch monitoring (SPAN) port.

**To set up a server, or VM**:

1. Ensure the minimum resources are set to:

    * 4C CPU

    * 8-GB ram

    * 250 GB HDD

    * 2 Network Adapters

    * OS: Ubuntu 18.04

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

    * **IoT Hub**: *.azure-devices.net

    * **Download Center**: download.microsoft.com

You can also download, and add the [Azure public IP ranges](https://www.microsoft.com/download/details.aspx?id=56519) to your firewall will allow the Azure resources that are specified above along with their region.

> [!Note]
> The Azure public IP range are updated weekly. New ranges appearing in the file will not be used in Azure for at least one week. Please download the new json file every week and perform the necessary changes at your site to correctly identify services running in Azure.

## Set up an Enterprise IoT security

A sensor is needed to discover, and continuously monitor Enterprise IoT devices. The sensor will use the Enterprise IoT network, and endpoint sensors to gain comprehensive visibility.

**To set up an Enterprise IoT security**:

1. Navigate to the [Azure portal](https://portal.azure.com#home).

1. Select **Set up Enterprise IoT Security**.

    :::image type="content" source="media/tutorial-get-started-eiot/onboard-sensor.png" alt-text="On the Getting Started page select Onboard sensor.":::

1. Enter a name for the sensor.

    :::image type="content" source="media/tutorial-get-started-eiot/onboard-sensor-screen.png" alt-text="Enter the following information into the onboarding screen.":::

1. Select a subscription from the drop-down menu.

1. Enter a meaningful site name that will assist you in locating where the sensor is located.

1. Enter a display name.

1. Enter a zone name. If no name is entered, the name `default` will be applied.

1. Select **Setup**.

1. Save the command provided to you.

    :::image type="content" source="media/tutorial-get-started-eiot/successful-registration.png" alt-text="Screenshot of the successful registration of an EIoT sensor.":::

## Install the sensor

Run the command that you received, and saved when you registered the Enterprise IoT sensor.

**To install the sensor**:

1. Sign in to the sensor's CLI using a terminal, such as PUTTY, or MobaXterm.

    :::image type="content" source="media/tutorial-get-started-eiot/terminal.png" alt-text="Screenshot of the MobaXterm terminal screen.":::

1. Run the command that you saved from the Register an EIoT sensor.

1. When the command is complete, the installation wizard will appear.

1. `What is the name of the monitored interface?` Use the Spacebar to select **ens161**, **ens192**, **ens224**, and **ens225**

    :::image type="content" source="media/tutorial-get-started-eiot/monitored-interface.png" alt-text="Screenshot of the select monitor interface selection scree.":::

1. Select **Ok**.

1. `Setup proxy server`.

    * If no, select **No**.

    * If yes, select **Yes**.

1. (Optional) If you are setting up a proxy server.

    1. Enter the proxy server host, and select **Ok**.

    1. Enter the proxy server port, and select **Ok**.

    1. Enter the proxy server username, and select **Ok**.

    1. Enter the server password, and select **Ok**.

The installation will now finish.

## Validate your setup

1. Wait 1 minute after the installation is completed, and run the following command to process the sanity of your system.

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

    Ensure that packets are being sent to the Event Hub.

## View your enterprise IoT devices in the EIoT device inventory

Once you have validated your setup, the device inventory will start to populate with all of your devices after 15 minutes.

**To view your populated device inventory**:

1. Navigate to the [Azure portal](https://portal.azure.com/#home).

1. Search for, and select **Defender for IoT**.

1. From the left side toolbar, select **Device inventory**.

The device inventory is where you will be able to view all of your device systems, and network information. To learn more about the device inventory see **INSERT LINK HERE!!!**

## Remove the sensor (optional)

You can use the following command to Remove the sensor.

```bash
sudo apt purge -y microsoft-eiot-sensor
```

## Next steps

Learn more about the device inventory. **Insert Link Here.**
