---
title: Enhance device discovery with an Enterprise IoT network sensor - Microsoft Defender for IoT
description: Learn how to register an Enterprise IoT network sensor in Defender for IoT for additional device visibility not covered by Defender for Endpoint.
ms.topic: tutorial
ms.date: 10/19/2022
---

# Enhance device discovery with an Enterprise IoT network sensor (Public preview)

<!--these include files don't work [!INCLUDE [Microsoft 365 Defender rebranding](/microsoft-365/security/includes/microsoft-defender.md)]-->

**Applies to:**

- [Microsoft Defender for Endpoint P2](https://go.microsoft.com/fwlink/?linkid=2154037)
- [Microsoft 365 Defender](https://go.microsoft.com/fwlink/?linkid=2118804)

<!--these include files don't work [!INCLUDE[Prerelease information](/microsoft-365/security/includes/prerelease.md)]-->

> Want to experience Microsoft Defender for Endpoint? [Sign up for a free trial.](https://signup.microsoft.com/create-account/signup?products=7f379fee-c4f9-4278-b0a1-e4c8c2fcdf7e&ru=https://aka.ms/MDEp2OpenTrial?ocid=docs-wdatp-enablesiem-abovefoldlink)

Microsoft Defender for Endpoint's integration with Microsoft Defender for IoT extends your device discovery using Defender for IoT's agentless monitoring features. Integrate Defender for Endpoint and Defender for IoT to secure the enterprise IoT devices in your network, such as Voice over Internet Protocol (VoIP) devices, printers, and cameras.

This article describes how to register an Enterprise IoT network sensor in Microsoft Defender for IoT, to extend your network visibility even further, to IoT segments in your corporate network not otherwise covered by Microsoft Defender for Endpoint.

For example, devices that reside outside of the subnets where managed endpoints reside, that are blocked by a NAT, or are in a completely different network, cannot be discovered by Defender for Endpoint, but can be discovered by an Enterprise IoT network sensor. An Enterprise IoT network sensor also provides specific classifications for devices that are classified as *unknown* by Defender for Endpoint.

Customers that have set up an Enterprise IoT network sensor can see all discovered devices in the **Device inventory** in either Defender for Endpoint or Defender for IoT.

For more information, see [Secure Enterprise IoT network resources with Defender for Endpoint and Defender for IoT](concept-eiot.md).

> [!IMPORTANT]
> The Enterprise IoT Network sensor is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

Before you start adding a sensor:

- Make sure that you've [onboarded to Defender for IoT from Defender for Endpoint](eiot-mde.md).

- Make sure you can access the Azure portal as a [Security admin](/azure/role-based-access-control/built-in-roles#security-admin), [Contributor](/azure/role-based-access-control/built-in-roles#contributor), or [Owner](/azure/role-based-access-control/built-in-roles#owner) user.

You'll also need a physical appliance or a virtual machine (VM) to use as your network sensor. Make sure that your machine has the following specifications:

| Tier | Requirements |
|--|--|
| **Minimum** | To support up to 1 Gbps of data: <br><br>- 4 CPUs, each with 2.4 GHz or more<br>- 16-GB RAM of DDR4 or better<br>- 250 GB HDD |
| **Recommended** | To support up to 15 Gbps of data: <br><br>-	8 CPUs, each with 2.4 GHz or more<br>-  32-GB RAM of DDR4 or better<br>- 500 GB HDD |

Your machine must also have:

- The [Ubuntu 18.04 Server](https://releases.ubuntu.com/18.04/) operating system. If you don't yet have Ubuntu installed, download the installation files to an external storage, such as a DVD or disk-on-key, and install it on your appliance or VM. For more information, see the Ubuntu [Image Burning Guide](https://help.ubuntu.com/community/BurningIsoHowto).

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

This procedure describes how to access the sensor setup from Defender for Endpoint, and then continue in Defender for IoT in the Azure portal. When you're done, install the Enterprise IoT monitoring software on your sensor machine.

> [!NOTE]
> While this procedure describes how to install sensor software on a VM using ESXi, enterprise IoT sensors are also supported using Hyper-V.
>

## Access sensor setup from Defender for Endpoint

In the navigation pane of the [https://security.microsoft.com](https://security.microsoft.com/) portal:

1. Select **Settings** \> **Device discovery** \> **Enterprise IoT**.

1. Under **Set up network sensors** select the **Microsoft Defender for IoT** link.

This brings you to the sensor setup process in the Azure portal. For example:

:::image type="content" source="media/tutorial-get-started-eiot/onboard-sensor.png" alt-text="Screenshot of the Getting started page for Enterprise IoT security.":::

> [!NOTE]
> You can also access this page directly in Defender for IoT. In Defender for IoT in the Azure portal, select **Getting started** > **Set up Enterprise IoT Security**.

## Register a sensor

1. On the **Set up Enterprise IoT Security** page, enter the following details, and then select **Register**:

    - In the **Sensor name** field, enter a meaningful name for your sensor.
    - From the **Subscription** drop-down menu, select the subscription where you want to add your sensor.

    A **Sensor registration successful** screen shows your next steps and the command you'll need to start the sensor installation.

    For example:

    :::image type="content" source="media/tutorial-get-started-eiot/successful-registration.png" alt-text="Screenshot of the successful registration of an Enterprise IoT sensor.":::

1. Copy the command to a safe location, where you'll be able to copy it to your physical appliance or VM in order to [install the sensor](#install-the-sensor-software).

## Install sensor software

This procedure describes how to install Enterprise IoT monitoring software on [your sensor machine](#prepare-a-physical-appliance-or-vm), either a physical appliance or VM.

1. On your sensor machine, sign in to the sensor's CLI using a terminal, such as PuTTY, or MobaXterm.

1. Run the command that you'd copied from the [sensor registration](#register-a-sensor) step. For example:

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

Once you've validated your setup, the **Device inventory** page will start to populate with new devices detected by your sensor after 15 minutes.

View all your detected devices, including both those detected by Defender for Endpoint and those detected by the Enterprise IoT sensor in the **Device inventory** pages, in both Defender for IoT and Defender for Endpoint.

For more information, see [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md) and [Defender for Endpoint device discovery](/microsoft-365/security/defender-endpoint/machines-view-overview).

<!--do we want to say anything about calculating and editing committed devices here? isn't this when it becomes relevant, b/c we have extra devices now?-->

## Edit the number of committed devices

After detecting new devices with the Enterprise IoT network sensor, you many need to edit the number of committed devices in your Enterprise IoT plan.

**To calculate the updated number of committed devices**:

In the **Device inventory** page in the **Defender for Endpoint** portal:

1. Add the total number of discovered **network devices** with the total number of discovered **IoT devices**.

    For example:

    :::image type="content" source="media/how-to-manage-subscriptions/eiot-calculate-devices.png" alt-text="Screenshot of network device and IoT devices in the device inventory in Microsoft Defender for Endpoint.":::

    For more information, see the [Defender for Endpoint Device discovery overview](/microsoft-365/security/defender-endpoint/device-discovery).

1. Remove any devices that are *not* considered as committed devices by Defender for IoT, including:

    - **Public internet IP addresses**
    - **Multi-cast groups**
    - **Broadcast groups**
    - **Inactive devices**: Network-monitored, Enterprise IoT devices with no network activity detected for more than 30 days
    - **Endpoints managed by Defender for Endpoint**

    For more information, see [What is a Defender for IoT committed device?](architecture.md#what-is-a-defender-for-iot-committed-device)

1. Round up your total to a multiple of 100.

For example:

- In the Defender for Endpoint **Device inventory**, you have 473 network devices and 1206 IoT devices. Added together the total is **1679** devices.
- 500 of those devices were detected and are managed by Defender for Endpoint, and can be removed. The updated total is now **1179**.
- Round your total up to a multiple of 100. The new value is **1200**. Use **1200** as the estimated number of committed devices.

**To cancel your current plan and add a new one**:

In the Defender for Endpoint **Settings** page:

1. Cancel your current plan. <!--how?-->

1. Add back a new plan.

    - You can select the same subscription as before, or a different one, as needed.
    - Select a monthly or annual plan, and then enter the number of committed devices that you'd calculated earlier.

1. Accept the **terms and conditions** and select **Save**.

1. 1. In the navigation pane of the [https://security.microsoft.com](https://security.microsoft.com/) portal, select **Settings** \> **Device discovery** \> **Enterprise IoT**.

1. Select the following options for your plan:

    - Select the Azure subscription from the list of available subscriptions in your Azure Active Directory tenant where you'd like to add a plan.

    - For the sake of this tutorial, select a trial pricing plan. Microsoft Defender for IoT provides a 30-day free trial for the first 1,000 committed devices for evaluation purposes.

For more information, see the [Microsoft Defender for IoT pricing page](https://azure.microsoft.com/pricing/details/iot-defender/) and [Cancel your Defender for IoT plan](eiot-mde.md#cancel-your-defender-for-iot-plan).

## Delete an Enterprise IoT network sensor

Remove a sensor if it's no longer in use with Defender for IoT.

1. From the **Sites and sensors** page on the Azure portal, locate your sensor in the grid.
1. In the row for your sensor, select the **...** options menu on the right > **Delete sensor**.

Alternately, remove your sensor manually from the CLI. For more information, see [Extra steps and samples for Enterprise IoT deployment](extra-deploy-enterprise-iot.md#remove-an-enterprise-iot-network-sensor-optional).

If you want to cancel your Enterprise IoT plan and stop the integration with Defender for Endpoint, use one of the following methods carefully:

- To cancel your plan for Enterprise IoT networks only, do so from [Defender for Endpoint](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration).
- To cancel a plan for both OT and Enterprise IoT networks together, use the [**Pricing**](how-to-manage-subscriptions.md) page in Defender for IoT in the Azure portal.

## Next steps

For more information, see [Sensor management options from the Azure portal](how-to-manage-sensors-on-the-cloud.md#sensor-management-options-from-the-azure-portal) and [Extra steps and samples for Enterprise IoT deployment](extra-deploy-enterprise-iot.md).