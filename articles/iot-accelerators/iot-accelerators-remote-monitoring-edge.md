---
title: Detect anomalies at the edge in an Azure solution tutorial | Microsoft Docs
description: In this tutorial you learn how to monitor your IoT Edge devices using the Remote Monitoring solution accelerator.
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 10/12/2018
ms.topic: tutorial
ms.custom: mvc

# As an operator of an IoT monitoring solution, I want to detect anomalies at the edge in order to reduce the volume of telemetry sent to my Remote Monitoring solution and to respond quickly to those anomalies.
---

# Tutorial: Detect anomalies at the edge with the Remote Monitoring solution accelerator

In this tutorial, you configure the Remote Monitoring solution to respond to anomalies detected by an IoT Edge device. IoT Edge devices let you process telemetry at the edge to reduce the volume of telemetry sent to the solution and to enable faster responses to events on devices. To learn more about the benefits of edge processing, see [What is Azure IoT Edge](../iot-edge/about-iot-edge.md).

To introduce edge processing with remote monitoring, this tutorial uses a simulated oil pump jack device. This oil pump jack is managed by an organization called Contoso and is connected to the Remote Monitoring solution accelerator. Sensors on the oil pump jack measure metrics such as temperature and pressure. Operators at Contoso know that an abnormal increase in temperature can cause the oil pump jack to slow down. Operators at Contoso don't need to monitor the device's temperature when it's within its normal range.

Contoso wants to deploy an intelligent edge module to the oil pump jack that detects temperature anomalies. Another edge module sends alerts to the Remote Monitoring solution. When an alert is received, a Contoso operator can dispatch a maintenance technician. Contoso could also configure an automated action, such as sending an email, to run when the solution receives an alert.

This tutorial uses your local Windows development machine as an IoT Edge device. You install edge modules to simulate the oil pump jack device and to detect the temperature anomalies.

In this tutorial, you:

>[!div class="checklist"]
> * Add an IoT Edge device to the solution
> * Import a package that defines the modules to run on the device
> * Deploy the package to your IoT Edge device
> * View alerts from the device

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [iot-accelerators-tutorial-prereqs](../../includes/iot-accelerators-tutorial-prereqs.md)]

The tutorial uses your local Windows machine to host the IoT Edge runtime. To install the IoT Edge runtime, you must have [Docker for Windows](https://docs.docker.com/docker-for-windows/install/) installed and configured to use Linux containers.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Add an IoT Edge device

There are two steps to add an IoT Edge device to your Remote Monitoring solution accelerator. This section shows you how to use:

* Add an IoT Edge device on the **Devices** page in the Remote Monitoring web UI.
* Windows Powershell to install the IoT Edge runtime on your local Windows device.

### Add an IoT Edge device to your solution

To add an IoT Edge device to the Remote Monitoring solution accelerator, navigate to the **Devices** page in the web UI and click **+ New device**.

In the **New device** panel, choose **IoT Edge device**. You can leave the default values for the other settings. The click **Apply**:

[![Add IoT Edge device](./media/iot-accelerators-remote-monitoring-edge/addedgedevice-inline.png)](./media/iot-accelerators-remote-monitoring-edge/addedgedevice-expanded.png#lightbox)

Make a note of the device connection string, you need it later in this tutorial.

When you register a device with the IoT hub in the Remote Monitoring solution accelerator, it's listed on the **Devices** page in the web UI:

[![New IoT Edge device](./media/iot-accelerators-remote-monitoring-edge/newedgedevice-inline.png)](./media/iot-accelerators-remote-monitoring-edge/newedgedevice-expanded.png#lightbox)

To make it easier to manage  the IoT Edge devices in the solution, create a device group and add the IoT Edge device:

1. On the **Devices** page, click **Manage device groups**.
1. Click **Add new device group**. Create a new device group with the following settings:

    | Setting | Value |
    | ------- | ----- |
    | Name    | EdgeDevices |
    | Field   | Tags.IsEdge |
    | Operator | = Equals |
    | Value    | Y |
    | Type     | Text |

1. Click **Save**.
1. Select the **MyRMEdgeDevice** device in the list on the **Devices** page and then click **Jobs**.
1. Create a job to add the **IsEdge** tag to the device using the following settings:

    | Setting | Value |
    | ------- | ----- |
    | Job     | Tag   |
    | Job Name | AddEdgeTag |
    | Key     | IsEdge |
    | Value   | Y     |

1. Click **Apply**.

You IoT Edge device is now in the **EdgeDevices** group.

### Install the Edge runtime

An Edge device requires the Edge runtime to be installed. In this tutorial, you install the Edge runtime on your local Windows computer to test the scenario.

1. Make sure that Docker is running on your local Windows machine.
1. Open an elevated PowerShell prompt on your local machine. Installing the IoT Edge runtime requires administrative permissions.
1. Run the following PowerShell command to install the IoT Edge runtime:

    ```PowerShell
    . {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; `
    Install-SecurityDaemon -Manual -ContainerOs Linux
    ```

1. When prompted, use the device connection string you made a note of previously.

1. Use the following PowerShell commands to verify the IoT Edge is running:

    ```PowerShell
    Get-Service iotedge
    iotedge list
    ```

    If the runtime started correctly, you see the **edgeHub** and **edgeAgent** processes  have a status of **running**.

## Import a package

## Deploy a package

## Monitor the device

## Next steps

This tutorial showed you how add and configure an IoT Edge device in the Remote Monitoring solution accelerator. To learn more about working with IoT Edge packages in the Remote Monitoring solution, see the following how-to guide:

> [!div class="nextstepaction"]
> [Import an IoT Edge package into your Remote Monitoring solution accelerator](iot-accelerators-remote-monitoring-import-edge-package.md)