---
title: Extra deployment steps and samples for Enterprise IoT deployment - Microsoft Defender for IoT
description: Describes extra deployment and validation procedures to use when deploying an Enterprise IoT network sensor.
ms.topic: install-set-up-deploy
ms.date: 08/08/2022
ms.custom: enterprise-iot
---

# Extra steps and samples for Enterprise IoT deployment

This article provides extra steps for deploying an Enterprise IoT sensor, including a sample SPAN port configuration procedure, and CLI steps to validate your deployment or delete a sensor.

For more information, see [Enhance IoT security monitoring with an Enterprise IoT network sensor (Public preview)](eiot-sensor.md).

## Configure a SPAN monitoring interface for a virtual appliance

While a virtual switch doesn't have mirroring capabilities, you can use *Promiscuous mode* in a virtual switch environment as a workaround for configuring a SPAN port.

*Promiscuous mode* is a mode of operation and a security, monitoring, and administration technique that is defined at the virtual switch or portgroup level. When Promiscuous mode is used, any of the virtual machine’s network interfaces that are in the same portgroup can view all network traffic that goes through that virtual switch. By default, Promiscuous mode is turned off.

This procedure describes an example of how to configure a SPAN port on your vSwitch with VMware ESXi. Enterprise IoT sensors also support VMs using Microsoft Hyper-V.

**To configure a SPAN monitoring interface**:

1. On your vSwitch, open the vSwitch properties and select **Add** > **Virtual Machine** > **Next**.

1. Enter **SPAN Network** as your network label, and then select **VLAN ID** > **All** > **Next** > **Finish**.

1. Select **SPAN Network** > **Edit** > **Security**, and verify that the **Promiscuous Mode** policy is set to **Accept** mode.

1. Select **OK**, and then select **Close** to close the vSwitch properties.

1. Open the **IoT Sensor VM** properties.

1. For **Network Adapter 2**, select the **SPAN** network.

1. Select **OK**.

1. Connect to the sensor, and verify that mirroring works.

If you've jumped to this procedure from the tutorial procedure for [Prepare a physical appliance or VM](eiot-sensor.md#prepare-a-physical-appliance-or-vm), continue the procedure to [prepare your appliance](eiot-sensor.md#sign-in) to continue preparing your appliance.

## Validate your Enterprise IoT sensor setup

If after completing the Enterprise IoT sensor installation and setup, you don't see your sensor showing on the **Sites and sensors** page in the Azure portal, this procedure can help validate your installation directly on the sensor.

Wait 1 minute after your sensor installation has completed before starting this procedure.

**To validate the sensor setup from the sensor**:

1. To process your system sanity, run:

    ```bash
    sudo docker ps
    ```

1. In the results that display, ensure that the following containers are up and listed as healthy.

    - `compose_attributes-collector_1`
    - `compose_cloud-communication_1`
    - `compose_logstash_1`
    - `compose_horizon_1`
    - `compose_statistics-collector_1`
    - `compose_properties_1`

    For example:

    :::image type="content" source="media/tutorial-get-started-eiot/validate-setup.png" alt-text="Screenshot of the validated containers listed." lightbox="media/tutorial-get-started-eiot/validate-setup.png":::

1. Check your port validation to see which interface is defined to handle port mirroring. Run:

    ```bash
    sudo docker logs compose_horizon_1
    ````

    For example, the following response might be displayed: `Found env variable for monitor interfaces: ens192`

1. Wait 5 minutes and then check your traffic D2C sanity. Run:

    ```bash
    sudo docker logs -f compose_attributes-collector_1
    ```

    Check the results to ensure that packets are being sent as expected.

## Remove an Enterprise IoT network sensor (optional)

Remove a sensor if it's no longer in use with Defender for IoT.

**To remove a sensor**, run the following command on the sensor server or VM:

```bash
sudo apt purge -y microsoft-eiot-sensor
```

> [!IMPORTANT]
> If you want to cancel your plan for Enterprise IoT networks only, do so from [Defender for Endpoint](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration).
>
> If you want to cancel your plan for both OT and Enterprise IoT networks together, you can use the [**Plans and pricing**](how-to-manage-subscriptions.md) page in Defender for IoT in the Azure portal.
>

## Next steps

For more information, see [Enhance IoT security monitoring with an Enterprise IoT network sensor (Public preview)](eiot-sensor.md) and [Manage sensors with Defender for IoT in the Azure portal](how-to-manage-sensors-on-the-cloud.md).
