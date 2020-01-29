---
title: Tutorial - Provision devices across load balanced hubs using Azure IoT Hub Device Provisioning Service
description: This tutorial demonstrates how Device Provisioning Service (DPS) enables automatic device provisioning across load balanced IoT hubs in Azure Portal
author: wesmc7777
ms.author: wesmc
ms.date: 11/12/2019
ms.topic: tutorial
ms.service: iot-dps
services: iot-dps
ms.custom: mvc
---

# Tutorial: Provision devices across load-balanced IoT hubs

This tutorial shows how to provision devices for multiple, load-balanced IoT hubs using the Device Provisioning Service. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Use the Azure portal to provision a second device to a second IoT hub 
> * Add an enrollment list entry to the second device
> * Set the Device Provisioning Service allocation policy to **even distribution**
> * Link the new IoT hub to the Device Provisioning Service

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

This tutorial builds on the previous [Provision device to a hub](tutorial-provision-device-to-hub.md) tutorial.

## Use the Azure portal to provision a second device to a second IoT hub

Follow the steps in the [Provision device to a hub](tutorial-provision-device-to-hub.md) tutorial to provision a second device to another IoT hub.

## Add an enrollment list entry to the second device

The enrollment list tells the Device Provisioning Service which method of attestation (the method for confirming a device identity) it is using with the device. The next step is to add an enrollment list entry for the second device. 

1. In the page for your Device Provisioning Service, click **Manage enrollments**. The **Add enrollment list entry** page appears. 
2. At the top of the page, click **Add**.
2. Complete the fields and then click **Save**.

## Set the Device Provisioning Service allocation policy

The allocation policy is a Device Provisioning Service setting that determines how devices are assigned to an IoT hub. There are three supported allocation policies: 

1. **Lowest latency**: Devices are provisioned to an IoT hub based on the hub with the lowest latency to the device.
2. **Evenly weighted distribution** (default): Linked IoT hubs are equally likely to have devices provisioned to them. This is the default setting. If you are provisioning devices to only one IoT hub, you can keep this setting. 
3. **Static configuration via the enrollment list**: Specification of the desired IoT hub in the enrollment list takes priority over the Device Provisioning Service-level allocation policy.

Follow these steps to set the allocation policy:

1. To set the allocation policy, in the Device Provisioning Service page click **Manage allocation policy**.
2. Set the allocation policy to **Evenly weighted distribution**.
3. Click **Save**.

## Link the new IoT hub to the Device Provisioning Service

Link the Device Provisioning Service and IoT hub so that the Device Provisioning Service can register devices to that hub.

1. In the **All resources** page, click the Device Provisioning service you created previously.
2. In the Device Provisioning Service page, click **Linked IoT hubs**.
3. Click **Add**.
4. In the **Add link to IoT hub** page, use the radio buttons to specify whether the linked IoT hub is located in the current subscription, or in a different subscription. Then, choose the name of the IoT hub from the **IoT hub** box.
5. Click **Save**.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Use the Azure portal to provision a second device to a second IoT hub 
> * Add an enrollment list entry to the second device
> * Set the Device Provisioning Service allocation policy to **even distribution**
> * Link the new IoT hub to the Device Provisioning Service

<!-- Advance to the next tutorial to learn how to 
 Replace this .md
> [!div class="nextstepaction"]
> [Bind an existing custom SSL certificate to Azure Web Apps]()
-->
