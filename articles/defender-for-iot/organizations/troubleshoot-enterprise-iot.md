---
title: Sample SPAN configuration and validation steps for an Enterprise IoT deployment - Microsoft Defender for IoT
description: Describes additional deployment and validation procedures to use when deploying an Enterprise IoT network sensor.
ms.topic: how-to
ms.date: 08/08/2022
---

# Sample SPAN configuration and validation steps for an Enterprise IoT deployment

This article provides a sample procedure for configuring your SPAN port and validating your installation when deploying an Enterprise IoT sensor.

For more information, see [Tutorial: Get started with Enterprise IoT monitoring](tutorial-getting-started-eiot-sensor.md).

### Configure a SPAN monitoring interface for a virtual appliance

While a virtual switch doesn't have mirroring capabilities, you can use *Promiscuous mode* in a virtual switch environment as a workaround for configuring a SPAN port.

*Promiscuous mode* is a mode of operation and a security, monitoring, and administration technique that is defined at the virtual switch or portgroup level. When Promiscuous mode is used, any of the virtual machine’s network interfaces that are in the same portgroup can view all network traffic that goes through that virtual switch. By default, Promiscuous mode is turned off.

This procedure describes an example of how to configure a SPAN port on your vSwitch with VMWare ESXi. Enterprise IoT sensors also support VMs using Microsoft Hyper-V.

**To configure a SPAN monitoring interface**:

1. On your vSwitch, open the vSwitch properties and select **Add** > **Virtual Machine** > **Next**.

1. Enter **SPAN Network** as your network label, and then select **VLAN ID** > **All** > **Next** > **Finish**.

1. Select **SPAN Network** > **Edit** > **Security**, and verify that the **Promiscuous Mode** policy is set to **Accept** mode.

1. Select **OK**, and then select **Close** to close the vSwitch properties.

1. Open the **IoT Sensor VM** properties.

1. For **Network Adapter 2**, select the **SPAN** network.

1. Select **OK**.

1. Connect to the sensor, and verify that mirroring works.

If you've jumped to this procedure from [preparing a physical appliance or VM](#prepare-a-physical-appliance-or-vm), continue with [step 2](tutorial-getting-started-eiot-sensor.md#sign-in) to continue preparing your appliance.

## Validate your Enterprise IoT sensor setup

If, after completing the Enterprise IoT sensor installation and setup, you don't see your sensor showing on the **Sites and sensors** page in the Azure portal, this procedure can help validate your installation directly on the sensor.

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

<!--for example?-->
