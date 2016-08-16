<properties
	pageTitle="IoT Hub device management get started | Microsoft Azure"
	description="Azure IoT Hub for device management with C# getting started tutorial. Use Azure IoT Hub and C# with the Microsoft Azure IoT SDKs to implement device management."
	services="iot-hub"
	documentationCenter=".net"
	authors="juanjperez"
	manager="timlt"
	editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="dotnet"
 ms.topic="get-started-article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="08/11/2016"
 ms.author="juanpere"/>

# Get started with Azure IoT Hub device management using node.js (preview)

[AZURE.INCLUDE [iot-hub-device-management-get-started-selector](../../includes/iot-hub-device-management-get-started-selector.md)]

## Introduction
To get started with Azure IoT Hub device management, you need to create an Azure IoT Hub, provision devices in the IoT Hub, start multiple simulated devices, and view these devices in the device management sample UI. This tutorial walks you through these steps.

> [AZURE.NOTE]  You need to create a new IoT Hub to enable device management capabilities even if you have an existing IoT Hub because existing IoT Hubs do not yet have these capabilities. Once device management is generally available, all existing IoT Hubs will be upgraded to get device management capabilities.

## Prerequisites

This tutorial assumes you are using an Ubuntu Linux development machine.

You need the following software installed to complete the steps:

- Git

- gcc (version 4.9 or later). You can verify the current version installed in your environment using the  `gcc --version` command. For information about how to upgrade your version of gcc on Ubuntu 14.04, see <http://askubuntu.com/questions/466651/how-do-i-use-the-latest-gcc-4-9-on-ubuntu-14-04>.

- [CMake](https://cmake.org/download/) (version 2.8 or later). You can verify the current version installed in your environment using the `cmake --version` command.

- Node.js 6.1.0 or greater.  Install Node.js for your platform from <https://nodejs.org/>.

- An active Azure subscription. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][lnk-free-trial].

## Create a device management enabled IoT Hub

You need to create a device management enabled IoT Hub for your simulated devices to connect to. The following steps show you how to complete this task using the Azure portal.

1.  Sign in to the [Azure portal].
2.  In the Jumpbar, click **New**, then click **Internet of Things**, and then click **Azure IoT Hub**.

	![][img-new-hub]

3.  In the **IoT Hub** blade, choose the configuration for your IoT Hub.

	![][img-configure-hub]

  -   In the **Name** box, enter a name for your IoT Hub. If the **Name** is valid and available, a green check mark appears in the **Name** box.
  -   Select a **Pricing and scale tier**. This tutorial does not require a specific tier.
  -   In **Resource group**, create a new resource group, or select an existing one. For more information, see [Using resource groups to manage your Azure resources].
  -   Check the box to **Enable Device Management**. If you don't check the box to **Enable Device Management**, the samples don't work. By checking **Enable Device Management**, you create a preview IoT Hub supported only in East US, North Europe, and East Asia and not intended for production scenarios. You cannot migrate devices into and out of device management enabled hubs.
  -   In **Location**, select the location to host your IoT Hub. IoT Hub device management is only available in East US, North Europe, and East Asia during public preview. In the future, it will be available in all regions.

4.  When you have chosen your IoT Hub configuration options, click **Create**. It can take a few minutes for Azure to create your IoT Hub. To check the status, you can monitor the progress on the **Startboard** or in the **Notifications** panel.

	![][img-monitor]

5.  When the IoT Hub has been created successfully, open the blade of the new IoT Hub, make a note of the **Hostname**, and then click **Shared access policies**.

	![][img-keys]

6.  Click the **iothubowner** policy, then copy and make note of the connection string in the **iothubowner** blade. Copy it to a location you can access later because you need it to complete the rest of this tutorial.

 	> [AZURE.NOTE] In production scenarios, make sure to refrain from using the **iothubowner** credentials.

	![][img-connection]

You have now created a device management enabled IoT Hub. You need the connection string to complete the rest of this tutorial.

## Build the samples and provision devices in your IoT Hub

In this section, you run a script that builds the simulated device and the samples and provisions a set of new device identities in the device registry of your IoT Hub. A device cannot connect to IoT Hub unless it has an entry in the device registry.

To build the samples and provision devices in your IoT Hub, follow these steps:

1.  Open a shell.

2.  Clone the github repository. **Make sure to clone in a directory that does not have any spaces.**

	  ```
	  git clone --recursive --branch dmpreview https://github.com/Azure/azure-iot-sdks.git
	  ```

3.  From the root folder where you cloned the **azure-iot-sdks** repository, navigate to the **azure-iot-sdks/c/build_all/linux** directory and execute the following command to install the prerequisite packages and the dependent libraries:

	  ```
	  ./setup.sh
	  ```


4.  From the root folder where you cloned the **azure-iot-sdks** repository, navigate to the **azure-iot-sdks/node/service/samples** directory and execute the following command replacing the placeholder value with your connection string from the previous section:

	  ```
	  ./setup.sh <IoT Hub Connection String>
	  ```

This script does the following:

1.  Runs **cmake** to create the necessary make files to build the simulated device. The executable is in **azure-iot-sdks/node/service/samples/cmake/iotdm\_client/samples/iotdm\_simple\_sample**. Note that the source files are in the folder **azure-iot-sdks/c/iotdm\_client/samples/iotdm\_simple\_sample**.

2.  Builds the simulated device executable **iotdm\_simple\_sample**.

3.  Runs `npm install` to install the necessary packages.

4.  Runs `node generate_devices.js` to provision device identities in your IoT Hub. The devices are described in **sampledevices.json**. After the devices are provisioned, the credentials are stored in the **devicecreds.txt** file (located in the **azure-iot-sdks/node/service/samples** directory).

## Start your simulated devices

Now that the devices have been added to the device registry, you can start simulated managed devices. You must start one simulated device for each device identity provisioned in the Azure IoT Hub.

Using a shell, navigate to the **azure-iot-sdks/node/service/samples** directory and run:

  ```
  ./simulate.sh
  ```

This script outputs the commands you need to run to start **iotdm\_simple\_sample** for each device listed in the **devicecreds.txt** file. Run the commands individually from a separate terminal window for each simulated device. The simulated device continues to run until you close the command window.

The **iotdm\_simple\_sample** application is built using the Azure IoT Hub device management client library for C, which enables the creation of IoT devices that can be managed by Azure IoT Hub. Device makers can use this library to report device properties and implement the execute actions required by device jobs. This library is a component delivered as part of the open source Azure IoT Hub SDKs.

When you run **simulate.sh**, you see a stream of data in the output window. This output shows the incoming and outgoing traffic and the **printf** statements in the application-specific callback functions. This output allows you to see incoming and outgoing traffic along with how the sample application is handling the decoded packets. When the device connects to the IoT Hub, the service automatically starts to observe resources on the device. The IoT Hub DM client library then invokes the device callbacks to retrieve the latest values from the device.

Following is the output from the **iotdm\_simple\_sample** sample application. At the top, you see a successful **REGISTERED** message, showing the device with Id **Device11-7ce4a850** connecting to IoT Hub.

> [AZURE.NOTE]  To have less verbose output, build and run the retail configuration.

![][img-output]

Make sure to leave all the simulated devices running as you complete the following sections.

## Run the device management sample UI

Now that you have provisioned an IoT Hub and have several simulated devices running and registered for management, you can deploy the device management sample UI. The device management sample UI provides you with a working example of how to utilize the device management APIs to build an interactive UI experience.  For more information about the device management sample UI, including [known issues](https://github.com/Azure/azure-iot-device-management#knownissues), see the [Azure IoT device management UI][lnk-dm-github] GitHub repository.

To retrieve, build, and run the device management sample UI, follow these steps:

1. Open a shell.

2. Confirm that you’ve installed Node.js 6.1.0 or greater according to the prerequisites section by typing `node --version`.

3. Clone the Azure IoT device management UI GitHub repository by running the following command in the shell:

	```
	git clone https://github.com/Azure/azure-iot-device-management.git
	```
	
4. In the root folder of your cloned copy of the Azure IoT device management UI repository, run the following command to retrieve the dependent packages:

	```
	npm install
	```

5. When the npm install command has completed, run the following command in the shell to build the code:

	```
	npm run build
	```

6. Use a text editor to open the user-config.json file in root of the cloned folder. Replace the text "&lt;YOUR CONNECTION STRING HERE&gt;" with your IoT Hub connection string from the previous section and save the file.

7. In the shell, run the following command to start the device management UX app:

	```
	npm run start
	```

8. When the command prompt has reported "Services have started", open a web browser and navigate to the device management app at the following URL to view your simulated devices: <http://127.0.0.1:3003>.

	![][img-dm-ui]

Leave the simulated devices and the device management app running as you proceed to the next device management tutorial.


## Next steps

To continue getting started with IoT Hub, see [Getting started with the Gateway SDK][lnk-gateway-SDK].

To learn more about the Azure IoT Hub device management features, see the [Explore Azure IoT Hub device management using the sample UI][lnk-sample-ui] tutorial.

<!-- images and links -->
[img-new-hub]: media/iot-hub-device-management-get-started-node/image1.png
[img-configure-hub]: media/iot-hub-device-management-get-started-node/image2.png
[img-monitor]: media/iot-hub-device-management-get-started-node/image3.png
[img-keys]: media/iot-hub-device-management-get-started-node/image4.png
[img-connection]: media/iot-hub-device-management-get-started-node/image5.png
[img-output]: media/iot-hub-device-management-get-started-node/image6.png
[img-dm-ui]: media/iot-hub-device-management-get-started-node/dmui.png

[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[Azure portal]: https://portal.azure.com/
[Using resource groups to manage your Azure resources]: ../azure-portal/resource-group-portal.md
[lnk-dm-github]: https://github.com/Azure/azure-iot-device-management
[lnk-sample-ui]: iot-hub-device-management-ui-sample.md
[lnk-gateway-SDK]: iot-hub-linux-gateway-sdk-get-started.md