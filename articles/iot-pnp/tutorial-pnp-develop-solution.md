---
title: Create and test an Azure IoT Plug and Play device | Microsoft Docs
description: As a solution developer, learn about how to use service SDK to interact with IoT Plug and Play devices.
author: YasinMSFT
ms.author: yahajiza
ms.date: 07/23/2019
ms.topic: Tutorial
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: philmea

# As a solution developer, I want to use Node service SDK to get/set properties and send commands, plus telemetry routing and queries.
---

# Tutorial: Connect and interact with 

This tutorial shows you how, as a solution builder, to connect a Plug and Play device to your solution and interact with it. Azure IoT Plug and Play simplifies IoT by enabling you to interact with device capabilities without knowledge of the underlying device implementation.

In this tutorial, you learn how to:

> * Run the Node device SDK sample as the simulated device
> * Retrieve a digital twin and list the interfaces
> * Get / set properties using the Node service SDK
> * Send a command and retrieve the response using the Node service SDK
> * Connect to the global repository and retrieve a model definition using the Node service SDK
> * Set up digital twin change notifications in IoT Hub
> * Route telemetry based on Plug and Play message headers
> * Run queries in IoT Hub based on HAS_INTERFACE and HAS_CAPABILITYMODEL

## Prerequisites

To complete this tutorial, you need:

* [Visual Studio Code](https://code.visualstudio.com/download): VS Code is available for multiple platforms
* [Node.js](https://nodejs.org/dist/v10.16.0/node-v10.16.0-x64.msi)

## Install dependencies for service samples

Open a second terminal inside samples folder:

```cmd/sh
npm install
```
This step is going to take anywhere between a few seconds to a few minutes, and it should end with no errors. Once complete, you can move on to the next step which is to configure the connection string for the service.

## Configure the service connection string

To run the service samples, you’ll need your IoT Hub connection string. Refer to [this article](https://devblogs.microsoft.com/iotdev/understand-different-connection-strings-in-azure-iot-hub/) for instructions to obtain the connection string.

Just like with device samples, you’ll need to configure an environment variable in the same terminal you’re going to run the code from. Open a new terminal window and use the instructions below to set the IOTHUB_CONNECTION_STRING environment variable. Note that the name is different from the device samples: it’s IOTHUB_CONNECTION_STRING. Be careful with double quotes: depending on the terminal program you’re using, you may or may not need them:

Using CMD on windows:

```cmd/sh
set IOTHUB_CONNECTION_STRING=<your_hub connection_string>
```
Using Powershell:

```cmd/sh
$env:IOTHUB_CONNECTION_STRING="<your_hub connection_string>"
```

Using Terminal on a Mac or Linux:

```cmd/sh
export IOTHUB_CONNECTION_STRING="<your_hub connection_string>"
```

if you see an error, check your double quotes, and if you want to double check that the environment variable was properly set, use one of the following:

Using CMD:

```cmd/sh
echo %IOTHUB_CONNECTION_STRING%
```

Using Powershell:

```cmd/sh
echo $env:IOTHUB_CONNECTION_STRING
```

Using Terminal on a Mac or Linux:

```cmd/sh
echo $IOTHUB_CONNECTION_STRING
```

It should print the entire connection string.


## Run the Node device SDK sample as the simulated device

Once you’ve authored the samples and set your connection string in an environment variable, you can run any of the service samples using the following command (just replace <sample_name.js> with the name of the file that corresponds to the feature you want to test):


## Retrieve a digital twin and list the interfaces

-	get_digital_twin.js will simply get the digital twin associated with your device and print its component in the command line. It does not require a running device sample to succeed.
-	get_digital_twin_component.js will get a single component of digital twin associated with your device and print it in the command line. It does not require the device sample to run.


## Get / set properties using the Node service SDK

-	update_digital_twin.js will update a writable property on your device digital twin using a full patch: that means that you can update multiple properties on multiple interfaces if you want to. For it to succeed, the device sample needs to be running at the same time. Success looks like the device sample printing something about updating a property the service sample printing an updated digital twin in the terminal.

## Send a command and retrieve the response using the Node service SDK

-	invoke_command.js will invoke a synchronous command on your device digital twin. For it to succeed, the device sample needs to be running at the same time. Success looks like the device sample printing something about acknowledging a command, and the service client printing the result of the command in the terminal.

## Connect to the global repository and retrieve a model definition using the Node service SDK

Text here

## Set up digital twin change notifications in IoT Hub

Text here

## Route telemetry based on Plug and Play message headers

Text here

## Run queries in IoT Hub based on capabality models and interfaces

Text here

## Run the model repository sample

Unlike the device and service samples, the model repository sample doesn’t work with a connection string, because it’s only a protocol layer (ie: it’s really not nice to use, it’s a temporary preview thing that doesn’t reflect the final shape of the API).
Using the same instructions as for the service and device samples, you’ll need to set up 4 environment variables:
AZURE_IOT_MODEL_REPO_ID
AZURE_IOT_MODEL_REPO_KEY_ID
AZURE_IOT_MODEL_REPO_KEY_SECRET
AZURE_IOT_MODEL_REPO_HOSTNAME

These values can be obtained from your model repository connection string.
Once you’ve set these 4 environment variables, you can run the sample the same way you ran the other samples:
node model_repo.js
This sample simply downloads the ModelDiscovery interface DTDL and will print this model in the terminal. Not much to see here.


## Next steps

Now that you've built an IoT Plug and Play ready for certification, learn how to:

> [!div class="nextstepaction"]
> [Build a device that's ready for certification](tutorial-build-device-certification.md)
