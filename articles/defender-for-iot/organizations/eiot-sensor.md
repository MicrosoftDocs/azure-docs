---
title: Enhance device discovery with a Microsoft Defender for IoT Enterprise IoT network sensor
description: Learn how to register an Enterprise IoT network sensor in Defender for IoT for extra device visibility not covered by Defender for Endpoint.
ms.topic: tutorial
ms.date: 10/19/2022
ms.custom: enterprise-iot
---

# Discover Enterprise IoT devices with an Enterprise IoT network sensor (Public preview)

This article describes how to register an Enterprise IoT network sensor in Microsoft Defender for IoT.

**If you're a Defender for Endpoint customer** with an Enterprise IoT plan for Defender for IoT, adding an Enterprise IoT network sensor extends your network visibility to IoT segments in your corporate network not otherwise covered by Microsoft Defender for Endpoint. For example, if you have a VLAN dedicated to VoIP devices with no other endpoints, Defender for Endpoint may not be able to discover devices on that VLAN.

Customers that have set up an Enterprise IoT network sensor can see all discovered devices in the **Device inventory** in either Microsoft 365 Defender or Defender for IoT. You'll also get extra security value from more alerts, vulnerabilities, and recommendations in Microsoft 365 Defender for the newly discovered devices.

**If you're a Defender for IoT customer** working solely in the Azure portal, an Enterprise IoT network sensor provides extra device visibility to Enterprise IoT devices, such as Voice over Internet Protocol (VoIP) devices, printers, and cameras, which may not be covered by your OT network sensors.

Defender for IoT [alerts](how-to-manage-cloud-alerts.md) and [recommendations](recommendations.md) for devices discovered by the Enterprise IoT sensor only are available only in the Azure portal.

For more information, see [Securing IoT devices in the enterprise](concept-enterprise.md).

> [!IMPORTANT]
> The Enterprise IoT Network sensor is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

This section describes the prerequisites required before deploying an Enterprise IoT network sensor.

### Azure requirements

- To view Defender for IoT data in Microsoft 365 Defender, including devices, alerts, recommendations, and vulnerabilities, you must have an Enterprise IoT plan, [onboarded from Microsoft 365 Defender](eiot-defender-for-endpoint.md).  

    If you only want to view data in the Azure portal, an Enterprise IoT plan isn't required. You can also onboard your Enterprise IoT plan from Microsoft 365 Defender after registering your network sensor to bring [extra device visibility and security value](concept-enterprise.md#security-value-in-microsoft-365-defender) to your organization.

- Make sure you can access the Azure portal as a [Security admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner) user. If you don't already have an Azure account, you can [create your free Azure account today](https://azure.microsoft.com/free/).

### Network requirements

- Identify the devices and subnets you want to monitor so that you understand where to place an Enterprise IoT sensor in your network. You may want to deploy multiple Enterprise IoT sensors.

- Configure traffic mirroring in your network so that the traffic you want to monitor is mirrored to your Enterprise IoT sensor. Supported traffic mirroring methods are the same as for OT monitoring. For more information, see [Choose a traffic mirroring method for traffic monitoring](best-practices/traffic-mirroring-methods.md).

### Physical or virtual machine requirements

Allocate a physical appliance or a virtual machine (VM) to use as your network sensor. Make sure that your machine has the following specifications:

| Tier | Requirements |
|--|--|
| **Minimum** | To support up to 1 Gbps of data: <br><br>- 4 CPUs, each with 2.4 GHz or more<br>- 16-GB RAM of DDR4 or better<br>- 250 GB HDD |
| **Recommended** | To support up to 15 Gbps of data: <br><br>-	8 CPUs, each with 2.4 GHz or more<br>-  32-GB RAM of DDR4 or better<br>- 500 GB HDD |

Your machine must also have:

- The [Ubuntu 18.04 Server](https://releases.ubuntu.com/18.04/) operating system. If you don't yet have Ubuntu installed, download the installation files to an external storage, such as a DVD or disk-on-key, and then install it on your appliance or VM. For more information, see the Ubuntu [Image Burning Guide](https://help.ubuntu.com/community/BurningIsoHowto).

- Network adapters, at least one for your switch monitoring (SPAN) port, and one for your management port to access the sensor's user interface

Your Enterprise IoT sensor must have access to the Azure cloud using a [direct connection](architecture-connections.md#direct-connections). Direct connections are configured for Enterprise IoT sensors using the same procedure as for OT sensors. For more information, see [Provision sensors for cloud management](ot-deploy/provision-cloud-management.md).

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

1. For each interface you want to monitor, run the following command to enable *Promiscuous mode* in the network adapter:

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

## Register an Enterprise IoT sensor in Defender for IoT

This section describes how to register an Enterprise IoT sensor in Defender for IoT. You can start directly in the Azure portal, or, if you're a Defender for Endpoint customer with an Enterprise IoT plan, you can start in Microsoft 365.

When you're done registering your sensor, you'll continue on with installing the Enterprise IoT monitoring software on your sensor machine.

### Access sensor setup from Microsoft 365 Defender

In the navigation pane of the [https://security.microsoft.com](https://security.microsoft.com/) portal:

1. Select **Settings** \> **Device discovery** \> **Enterprise IoT**.

1. Under **Set up an Enterprise IoT Security sensor** select the **Microsoft Defender for IoT** link. For example:

    :::image type="content" source="media/enterprise-iot/defender-for-endpoint-setup-sensor.png" alt-text="Screenshot of the Defender for IoT link in Microsoft 365 Defender.":::

The **Microsoft Defender for IoT** link brings you to the sensor setup process in the Azure portal. For example:

:::image type="content" source="media/tutorial-get-started-eiot/onboard-sensor.png" alt-text="Screenshot of the Getting started page for Enterprise IoT security.":::

> [!NOTE]
> You can also access the sensor setup directly from Defender for IoT. In the Azure portal > Defender for IoT, select **Getting started** > **Set up Enterprise IoT Security**.

### Register a sensor in the Azure portal

1. On the **Set up Enterprise IoT Security** page, enter the following details, and then select **Register**:

    - In the **Sensor name** field, enter a meaningful name for your sensor.
    - From the **Subscription** drop-down menu, select the subscription where you want to add your sensor.

    A **Sensor registration successful** screen shows your next steps and the command you'll need to start the sensor installation.

    For example:

    :::image type="content" source="media/tutorial-get-started-eiot/successful-registration.png" alt-text="Screenshot of the successful registration of an Enterprise IoT sensor.":::

1. Copy the command to a safe location, where you'll be able to copy it to your physical appliance or VM in order to [install sensor software](#install-enterprise-iot-sensor-software).

## Install Enterprise IoT sensor software

This procedure describes how to install Enterprise IoT monitoring software on [your sensor machine](#prepare-a-physical-appliance-or-vm), either a physical appliance or VM.

> [!NOTE]
> While this procedure describes how to install sensor software on a VM using ESXi, enterprise IoT sensors are also supported using Hyper-V.
>

**To install sensor software**:

1. On your sensor machine, sign in to the sensor's CLI using a terminal, such as PuTTY, or MobaXterm.

1. Run the command that you'd copied from the [sensor registration](#register-a-sensor-in-the-azure-portal) step. For example:

    :::image type="content" source="media/tutorial-get-started-eiot/enter-command.png" alt-text="Screenshot of running the command to install the Enterprise IoT sensor monitoring software.":::

    The process checks to see if the required Docker version is already installed. If it’s not, the sensor installation also installs the latest Docker version.

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

## View newly detected Enterprise IoT devices

Once you've validated your setup, the Defender for IoT **Device inventory** page will start to populate with new devices detected by your sensor after 15 minutes.

If you're a Defender for Endpoint customer with an Enterprise IoT plan, you'll be able to view all detected devices in the **Device inventory** pages, in both Defender for IoT and Microsoft 365 Defender. Detected devices include both devices detected by Defender for Endpoint and devices detected by the Enterprise IoT sensor.

For more information, see [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md) and [Microsoft 365 Defender device discovery](/microsoft-365/security/defender-endpoint/machines-view-overview).

If you're on a monthly commitment, you may want to edit the number of committed devices in your Enterprise IoT plan. For more information, see:

- [Calculate committed devices for Enterprise IoT monitoring](manage-subscriptions-enterprise.md#calculate-committed-devices-for-enterprise-iot-monitoring)
- [Defender for IoT subscription billing](billing.md)
- The [Microsoft Defender for IoT pricing page](https://azure.microsoft.com/pricing/details/iot-defender/)

## Delete an Enterprise IoT network sensor

Delete a sensor if it's no longer in use with Defender for IoT.

1. From the **Sites and sensors** page on the Azure portal, locate your sensor in the grid.

1. In the row for your sensor, select the **...** options menu > **Delete sensor**.

For more information, see [Manage sensors with Defender for IoT in the Azure portal](how-to-manage-sensors-on-the-cloud.md).

> [!TIP]
> You can also remove your sensor manually from the CLI. For more information, see [Extra steps and samples for Enterprise IoT deployment](extra-deploy-enterprise-iot.md#remove-an-enterprise-iot-network-sensor-optional).

If you want to cancel your Enterprise IoT plan and stop the integration with Defender for Endpoint, use one of the following methods carefully:

- **To cancel your plan for Enterprise IoT networks only**, do so from [Microsoft 365 Defender](manage-subscriptions-enterprise.md#cancel-your-enterprise-iot-plan).
- **To cancel a plan for both OT and Enterprise IoT networks together**, use the [**Plans and pricing** page in Defender for IoT](how-to-manage-subscriptions.md#cancel-a-defender-for-iot-plan) in the Azure portal.

## Move existing sensors to a different subscription

If you've registered an Enterprise IoT network sensor, you may need to apply it to a different subscription than the one you’re currently using.

**To apply an existing sensor to a different subscription**:

1. Onboard a new plan to the new subscription
1. Register the sensors under the new subscription
1. Remove the sensors from the previous subscription

Billing changes will take effect one hour after cancellation of the previous subscription, and will be reflected on the next month's bill. Devices will be synchronized from the sensor to the new subscription automatically.

**To switch to a new subscription**:

1. In Defender for Endpoint, onboard a new Enterprise IoT plan to the new subscription you want to use. For more information, see [Onboard a Defender for IoT plan](eiot-defender-for-endpoint.md#onboard-a-defender-for-iot-plan).

1. In the Azure portal, register your Enterprise IoT sensor under the new subscription and run the activation command. For more information, see [Enhance IoT security monitoring with an Enterprise IoT network sensor (Public preview)](eiot-sensor.md).

1. Delete the legacy sensor from the previous subscription.  In Defender for IoT, go to the **Sites and sensors** page and locate the legacy sensor on the previous subscription.

1. In the row for your sensor, from the options (**...**) menu, select **Delete** to delete the sensor from the previous subscription.

1. If relevant, cancel the Defender for IoT plan from the previous subscription. For more information, see [Cancel your Enterprise IoT plan](manage-subscriptions-enterprise.md#cancel-your-enterprise-iot-plan).

## Next steps

- [Extra steps and samples for Enterprise IoT deployment](extra-deploy-enterprise-iot.md)

- [Manage sensors in the Azure portal](how-to-manage-sensors-on-the-cloud.md)

- [View and manage alerts from the Azure portal](how-to-manage-cloud-alerts.md). For more information, see [Malware engine alerts](alert-engine-messages.md#malware-engine-alerts).

- [Enhance security posture with security recommendations](recommendations.md)
