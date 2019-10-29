---
title: Add an Azure IoT Edge device to Azure IoT Central | Microsoft Docs
description: As an operator, add an Azure IoT Edge device to your Azure IoT Central
author: rangv
ms.author: rangv
ms.date: 10/22/2019
ms.topic: tutorial
ms.service: iot-central
services: iot-central
ms.custom: mvc
manager: peterpr
---

# Tutorial: Add an Azure IoT Edge device to your Azure IoT Central application (preview features)

[!INCLUDE [iot-central-pnp-original](../../../includes/iot-central-pnp-original-note.md)]

This tutorial shows you how to add and configure a *Azure IoI Edge device* to your Microsoft Azure IoT Central application. In this tutorial, we chose an Azure IoT Edge enabled Linux VM from Azure Marketplace.

This tutorial is made up of two parts:

* First, as an operator, you learn how to do cloud first provisioning of an Azure IoT Edge device.
* Then, you will learn how to do device first provisioning of an Azure IoT Edge device.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Add a new Azure IoT Edge device
> * Configure the Azure IoT Edge device to help provision using SAS Key
> * View Dashboards, Module Health in IoT Central
> * Send commands to a module running on the Azure IoT Edge device
> * Set properties on a module running on the Azure IoT Edge device

## Prerequisites

To complete this tutorial, you need an Azure IoT Central application. Follow this quickstart to [Create an Azure IoT Central application](quick-deploy-iot-central-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json).

## Enable Azure IoT Edge Enrollment Group
Enable SAS keys for Azure IoT Edge enrollment group from the Administration page.

![Device Template - Azure IoT Edge](./media/tutorial-add-edge-as-leaf-device/groupenrollment.png)

## Cloud first Azure IoT Edge device provisioning	
In this section, you will create a new Azure IoT Edge device using the **environment sensor template** and provision a device. 
Click on Devices on the left navigation and click on Environment Sensor Template. 

![Device Template - Azure IoT Edge](./media/tutorial-add-edge-as-leaf-device/deviceexplorer.png)

Click **+ New** and enter a device ID and name, which suits you. 

![Device Template - Azure IoT Edge](./media/tutorial-add-edge-as-leaf-device/cfdevicecredentials.png)

Device goes into **Registered** mode.

![Device Template - Azure IoT Edge](./media/tutorial-add-edge-as-leaf-device/cfregistered.png)

## Deploy an Azure IoT Edge enabled Linux VM

>Note: You can choose to use any machine or device. OS: Linux or Windows)

For this tutorial, we chose an Azure IoT enabled Linux VM, which can be create on Azure. You will be taken to [Azure marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoft_iot_edge.iot_edge_vm_ubuntu?tab=Overview)
 and click on **Get IT NOW** button. 

![Azure Marketplace](./media/tutorial-add-edge-as-leaf-device/cfmarketplace.png)

Click **Continue**

![Azure Marketplace](./media/tutorial-add-edge-as-leaf-device/cfmarketplacecontinue.png)


You will be taken to Azure portal. Click **Create** button

![Azure Marketplace](./media/tutorial-add-edge-as-leaf-device/cfubuntu.png)

Select Subscription, create a new resource group preferably, Select US West 2 for VM availability, enter User and password. Remember User, password will be required for future steps. Click **Review + Create**

![Ubuntu VM](./media/tutorial-add-edge-as-leaf-device/cfvm.png)

Once validated click **Create**

![Ubuntu VM](./media/tutorial-add-edge-as-leaf-device/cfvmvalidated.png)

Takes a few minutes to create the resources. Click on Go to **Resource**

![Ubuntu VM](./media/tutorial-add-edge-as-leaf-device/cfvmdeploymentcomplete.png)

### Provision VM as Azure IoT Edge device 

Under Support + troubleshooting in the left navigation, click on Serial console

![Ubuntu VM](./media/tutorial-add-edge-as-leaf-device/cfserialconsole.png)

You will see a screen like below

![Ubuntu VM](./media/tutorial-add-edge-as-leaf-device/cfconsole.png)

Press enter and provide Username and password as prompted and press enter. 

![Ubuntu VM](./media/tutorial-add-edge-as-leaf-device/cfconsolelogin.png)

To run a command as administrator/root run the command: **sudo su –**

![Ubuntu VM](./media/tutorial-add-edge-as-leaf-device/cfsudo.png)

Check Azure IoT Edge runtime version. Current GA version is 1.0.8

![Ubuntu VM](./media/tutorial-add-edge-as-leaf-device/cfconsoleversion.png)

Install vim editor or use nano if it’s your preference. 

![Ubuntu VM](./media/tutorial-add-edge-as-leaf-device/cfconsolevim.png)

![Ubuntu VM](./media/tutorial-add-edge-as-leaf-device/cfvim.png)

Edit Azure IoT Edge config.yaml file

![Ubuntu VM](./media/tutorial-add-edge-as-leaf-device/cfconsoleconfig.png)

Scroll down and comment out connection string portion of the yaml file. 

**Before**

![Ubuntu VM](./media/tutorial-add-edge-as-leaf-device/cfmanualprovisioning.png)

**After** (Press Esc and Press lower case a, to start editing)

![Ubuntu VM](./media/tutorial-add-edge-as-leaf-device/cfmanualprovisioningcomments.png)

Uncomment Symmetric key portion of the yaml file. 

**Before**

![Ubuntu VM](./media/tutorial-add-edge-as-leaf-device/cfconsolesymmcomments.png)

**After**

![Ubuntu VM](./media/tutorial-add-edge-as-leaf-device/cfconsolesymmuncomments.png)

Go to IoT Central and get scope ID, device ID and symmetric key of the Azure IoT Edge device
![Device Connect](./media/tutorial-add-edge-as-leaf-device/cfdeviceconnect.png)

Go To the Linux box and replace Scope ID, Registration ID with device ID and symmetric key

Press **Esc** and type **:wq!** and press **enter** to save your changes

Restart Azure IoT Edge to process your changes and press **Enter**

![Device Connect](./media/tutorial-add-edge-as-leaf-device/cfrestart.png)

Type: **iotedge list**, it will take few minutes, you will see three modules deployed

![Device Connect](./media/tutorial-add-edge-as-leaf-device/cfconsolemodulelist.png)


## IoT Central device explorer 

In IoT Central your device will move into provisioned state

![Device Connect](./media/tutorial-add-edge-as-leaf-device/cfprovisioned.png)

Modules tab will show the status of the device and module on IoT Central 

![Device Connect](./media/tutorial-add-edge-as-leaf-device/cfiotcmodulestatus.png)


Cloud properties will show up in a Form (from the device template you created in the previous steps). Enter values and click **Save**. 

![Device Connect](./media/tutorial-add-edge-as-leaf-device/deviceinfo.png)

Dashboard tile

![Device Connect](./media/tutorial-add-edge-as-leaf-device/dashboard.png)

In this tutorial, you learned how to:

* Add a new Azure IoT Edge device
* Configure the Azure IoT Edge device to help provision using SAS Key
* View Dashboards, Module Health in IoT Central
* Send commands to a module running on the Azure IoT Edge device
* Set properties on a module running on the Azure IoT Edge device

## Next steps

Now that you've learned how to work with manage Azure IoT Edge devices in IoT Central, here is the suggested next step:

<!-- Next how-tos in the sequence -->

How To Configure a transparent gateway, follow this tutorial

> [!div class="nextstepaction"]
> [Configure Transparent Gateway](../../iot-edge/how-to-create-transparent-gateway.md)
