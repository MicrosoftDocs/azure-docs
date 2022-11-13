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

In this tutorial, you learn about:

> [!div class="checklist"]
> * Integration with Microsoft Defender for Endpoint
> * Prerequisites for Enterprise IoT network monitoring with Defender for IoT
> * How to prepare a physical appliance or VM as a network sensor
> * How to onboard an Enterprise IoT sensor and install software
> * How to view detected Enterprise IoT devices in the Azure portal
> * How to view devices, alerts, vulnerabilities, and recommendations in Defender for Endpoint

## Microsoft Defender for Endpoint integration

Defender for IoT integrates with [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/) to extend your security analytics capabilities, providing complete coverage across your Enterprise IoT devices. Defender for Endpoint analytics features include alerts, vulnerabilities, and recommendations for your enterprise devices.

Microsoft 365 P2 customers can onboard a plan for Enterprise IoT through the Microsoft Defender for Endpoint portal. After you've onboarded a plan for Enterprise IoT, view discovered IoT devices and related alerts, vulnerabilities, and recommendations in Defender for Endpoint.

Microsoft 365 P2 customers can also install the Enterprise IoT network sensor (currently in **Public Preview**) to gain more visibility into additional IoT segments of the corporate network that were not previously covered by Defender for Endpoint. Deploying a network sensor is not a prerequisite for onboarding Enterprise IoT.

For more information, see [Onboard with Microsoft Defender for IoT in Defender for Endpoint](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration).

> [!IMPORTANT]
> The **Enterprise IoT network sensor** is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

Before starting this tutorial, make sure that you have the following prerequisites.

### Azure subscription prerequisites

- Make sure that you've added a Defender for IoT plan for Enterprise IoT networks to your Azure subscription from Microsoft Defender for Endpoint.
For more information, see [Onboard with Microsoft Defender for IoT](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration).

- Access to the Azure portal as a [Security Admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner). For more information, see [Azure user roles for OT and Enterprise IoT monitoring with Defender for IoT](roles-azure.md).

### Physical appliance or VM requirements

You can use a physical appliance or a virtual machine as your network sensor. In either case, make sure that your machine has the following specifications:

| Tier | Requirements |
|--|--|
| **Minimum** | To support up to 1 Gbps: <br><br>- 4 CPUs, each with 2.4 GHz or more<br>- 16-GB RAM of DDR4 or better<br>- 250 GB HDD |
| **Recommended** | To support up to 15 Gbps: <br><br>-	8 CPUs, each with 2.4 GHz or more<br>-  32-GB RAM of DDR4 or better<br>- 500 GB HDD |

Make sure that your physical appliance or VM also has:

- [Ubuntu 18.04 Server](https://releases.ubuntu.com/18.04/) operating system. If you don't yet have Ubuntu installed, download the installation files to an external storage, such as a DVD or disk-on-key, and install it on your appliance or VM. For more information, see the Ubuntu [Image Burning Guide](https://help.ubuntu.com/community/BurningIsoHowto).

- Network adapters, at least one for your switch monitoring (SPAN) port, and one for your management port to access the sensor's user interface

## Prepare a physical appliance or VM

This procedure describes how to prepare your physical appliance or VM to install the Enterprise IoT network sensor software.

**To prepare your appliance**:

1. Connect a network interface (NIC) from your physical appliance or VM to a switch as follows:

    - **Physical appliance** - Connect a monitoring NIC to a SPAN port directly by a copper or fiber cable.

    - **VM** - Connect a vNIC to a vSwitch, and configure your vSwitch security settings to accept *Promiscuous mode*. For more information, see, for example [Configure a SPAN monitoring interface for a virtual appliance](extra-deploy-enterprise-iot.md#configure-a-span-monitoring-interface-for-a-virtual-appliance).

1. <a name="sign-in"></a>Sign in to your physical appliance or VM and run the following command to validate incoming traffic to the monitoring port:

    ```bash
    ifconfig
    ```

    The system displays a list of all monitored interfaces.

    Identify the interfaces that you want to monitor, which are usually the interfaces with no IP address listed. Interfaces with incoming traffic will show an increasing number of RX packets.

1. For each interface you want to monitor, run the following command to enable Promiscuous mode in the network adapter:

    ```bash
    ifconfig <monitoring port> up promisc
    ```

    Where `<monitoring port>` is an interface you want to monitor. Repeat this step for each interface you want to monitor.

1. Ensure network connectivity by opening the following ports in your firewall:

    | Protocol | Transport | In/Out | Port  | Purpose |
    |--|--|--|--|--|
    | HTTPS | TCP | In/Out | 443 | Cloud connection |
    | DNS | TCP/UDP | In/Out | 53  | Address resolution |


1. Make sure that your physical appliance or VM can access the cloud using HTTPS on port 443 to the following Microsoft endpoints:

    - **EventHub**: `*.servicebus.windows.net`
    - **Storage**: `*.blob.core.windows.net`
    - **Download Center**: `download.microsoft.com`
    - **IoT Hub**: `*.azure-devices.net`

    > [!TIP]
    > You can also download and add the [Azure public IP ranges](https://www.microsoft.com/download/details.aspx?id=56519) so your firewall will allow the Azure endpoints that are specified above, along with their region.
    >
    > The Azure public IP ranges are updated weekly. New ranges appearing in the file will not be used in Azure for at least one week. To use this option, download the new json file every week and perform the necessary changes at your site to correctly identify services running in Azure.

## Register an Enterprise IoT sensor

This procedure describes how to register your Enterprise IoT sensor with Defender for IoT and then install the sensor software on the physical appliance or VM that you're using as your network sensor.

> [!NOTE]
> This procedure describes how to install sensor software on a VM using ESXi. Enterprise IoT sensors are also supported using Hyper-V.
>

**Prerequisites**: Make sure that you have all [Prerequisites](#prerequisites) satisfied and have completed [Prepare a physical appliance or VM](#prepare-a-physical-appliance-or-vm).

**To register your Enterprise IoT sensor**:

1. In the Azure portal, go to **Defender for IoT** > **Getting started** > **Set up Enterprise IoT Security**.

    :::image type="content" source="media/tutorial-get-started-eiot/onboard-sensor.png" alt-text="Screenshot of the Getting started page for Enterprise IoT security.":::

1. On the **Set up Enterprise IoT Security** page, enter the following details, and then select **Register**:

    - In the **Sensor name** field, enter a meaningful name for your sensor.
    - From the **Subscription** drop-down menu, select the subscription where you want to add your sensor.

    A **Sensor registration successful** screen shows your next steps and the command you'll need to start the sensor installation.

    For example:

    :::image type="content" source="media/tutorial-get-started-eiot/successful-registration.png" alt-text="Screenshot of the successful registration of an Enterprise IoT sensor.":::

1. Copy the command to a safe location, where you'll be able to copy it to your physical appliance or VM in order to [install the sensor](#install-the-sensor-software).


## Install the sensor software

Run the command that you received and saved when you registered the Enterprise IoT sensor.

The installation process checks to see if the required Docker version is already installed. If it’s not, the sensor installation also installs the latest Docker version.

<a name="install"></a>**To install the sensor**:

1. On your physical appliance or VM, sign in to the sensor's CLI using a terminal, such as PuTTY, or MobaXterm.

1. Run the command that you'd saved from the Azure portal. For example:

    :::image type="content" source="media/tutorial-get-started-eiot/enter-command.png" alt-text="Screenshot of running the command to install the Enterprise IoT sensor monitoring software.":::

    The command process checks to see if the required Docker version is already installed. If it’s not, the sensor installation also installs the latest Docker version.

    When the command process completes, the Ubuntu **Configure microsoft-eiot-sensor** wizard appears. In this wizard, use the up or down arrows to navigate, and the SPACE bar to select an option. Press ENTER to advance to the next screen.

1. In the **Configure microsoft-eiot-sensor** wizard, in the **What is the name of the monitored interface?** screen, select one or more interfaces that you want to monitor with your sensor, and then select **OK**.

    For example:

    :::image type="content" source="media/tutorial-get-started-eiot/install-monitored-interface.png" alt-text="Screenshot of the Configuring microsoft-eiot-sensor screen.":::

1. In the **Set up proxy server?** screen, select whether to set up a proxy server for your sensor. For example:

    :::image type="content" source="media/tutorial-get-started-eiot/proxy.png" alt-text="Screenshot of the Set up a proxy server? screen.":::

    If you're setting up a proxy server, select **Yes**, and then define the proxy server host, port, username, and password, selecting **Ok** after each option.

    The installation takes a few minutes to complete.

1. In the Azure portal, check that the **Sites and sensors** page now lists your new sensor.

    For example:

    :::image type="content" source="media/tutorial-get-started-eiot/view-sensor-listed.png" alt-text="Screenshot of your new Enterprise IoT sensor listed in the Sites and sensors page.":::

In the **Sites and sensors** page, Enterprise IoT sensors are all automatically added to the same site, named **Enterprise network**. For more information, see [Manage sensors with Defender for IoT in the Azure portal](how-to-manage-sensors-on-the-cloud.md).

> [!TIP]
> If you don't see your Enterprise IoT data in Defender for IoT as expected, make sure that you're viewing the Azure portal with the correct subscriptions selected. For more information, see [Manage Azure portal settings](../../azure-portal/set-preferences.md).
>
> If you still don't view your data as expected, [validate your sensor setup](extra-deploy-enterprise-iot.md#validate-your-enterprise-iot-sensor-setup) from the CLI.

## View detected Enterprise IoT devices in Azure

Once you've validated your setup, the **Device inventory** page will start to populate with all of your devices after 15 minutes.

View your devices and network information in the Defender for IoT **Device inventory** page on the Azure portal.

For more information, see [Manage your IoT devices with the device inventory for organizations](how-to-manage-device-inventory-for-organizations.md).

## Delete an Enterprise IoT network sensor (optional)

Remove a sensor if it's no longer in use with Defender for IoT.

1. From the **Sites and sensors** page on the Azure portal, locate your sensor in the grid.
1. In the row for your sensor, select the **...** options menu on the right > **Delete sensor**.

Alternately, remove your sensor manually from the CLI. For more information, see [Extra steps and samples for Enterprise IoT deployment](extra-deploy-enterprise-iot.md#remove-an-enterprise-iot-network-sensor-optional).

> [!IMPORTANT]
> If you want to cancel your plan for Enterprise IoT networks only, do so from [Defender for Endpoint](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration).
>
> If you want to cancel your plan for both OT and Enterprise IoT networks together, you can use the [**Pricing**](how-to-manage-subscriptions.md) page in Defender for IoT in the Azure portal.
>

For more information, see [Sensor management options from the Azure portal](how-to-manage-sensors-on-the-cloud.md#sensor-management-options-from-the-azure-portal).

## Next steps

Continue viewing device data in both the Azure portal and Defender for Endpoint, depending on your organization's needs.

- [Manage sensors with Defender for IoT in the Azure portal](how-to-manage-sensors-on-the-cloud.md)
- [Threat intelligence research and packages](how-to-work-with-threat-intelligence-packages.md)
- [Manage your IoT devices with the device inventory for organizations](how-to-manage-device-inventory-for-organizations.md)
- [View and manage alerts on the Defender for IoT portal](how-to-manage-cloud-alerts.md)
- [Use Azure Monitor workbooks in Microsoft Defender for IoT (Public preview)](workbooks.md)
- [OT threat monitoring in enterprise SOCs](concept-sentinel-integration.md)
- [Enterprise IoT networks frequently asked questions](faqs-eiot.md)

In Defender for Endpoint, also view alerts data, recommendations and vulnerabilities related to your network traffic.

For more information in the Defender for Endpoint documentation, see:

- [Onboard with Microsoft Defender for IoT in Defender for Endpoint](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration)
- [Defender for Endpoint device inventory](/microsoft-365/security/defender-endpoint/machines-view-overview)
- [Alerts in Defender for Endpoint](/microsoft-365/security/defender-endpoint/alerts-queue)
- [Security recommendations in Defender for Endpoint](/microsoft-365/security/defender-vulnerability-management/tvm-security-recommendation)
- [Defender for Endpoint: Vulnerabilities in my organization](/microsoft-365/security/defender-vulnerability-management/tvm-security-recommendation)