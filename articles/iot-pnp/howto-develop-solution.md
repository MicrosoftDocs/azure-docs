---
title: Interact with an IoT Plug and Play device from an Azure IoT solution | Microsoft Docs
description: As a solution developer, learn about how to use the service SDK to interact with IoT Plug and Play devices.
author: YasinMSFT
ms.author: yahajiza
ms.date: 07/24/2019
ms.topic: tutorial
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: philmea

# As a solution developer, I want to use Node service SDK to get and set properties, send commands to an IoT Plug and Play device, and manage telemetry routing and queries.
---

# Connect to and interact with an IoT Plug and Play device

This how-to guide shows you how to use the samples in the Node service SDK to learn how to interact with IoT Plug and Play devices connected to your your IoT Solution.

If you haven't completed the [Connect an IoT Plug and Play device to your solution](quickstart-connect-pnp-device-solution.md) quickstart, you should do so now. The quickstart shows you how to download and install the SDK and run some of the samples.

Before running the service samples, open a new terminal, go to the root folder of your cloned repository, navigate to the **/azure-iot-samples-node/tree/master/digital-twins/Quickstarts/Service** folder, and then install all the dependencies by running the following command:

    ```cmd/sh
    npm install
    ```

## Run the service samples

Use the following samples to explore the capabilities of the Node.js service SDK. Make sure that the `IOTHUB_CONNECTION_STRING` environment variable is set in the shell you use:

### Retrieve a digital twin and list the interfaces

**get_digital_twin.js** gets the digital twin associated with your device and prints its component in the command line. It doesn't require a running device sample to succeed.

**get_digital_twin_component.js** gets a single component of digital twin associated with your device and prints it in the command line. It doesn't require the device sample to run.

### Get and set properties using the Node service SDK

**update_digital_twin.js** updates a writable property on your device digital twin using a full patch. You can update multiple properties on multiple interfaces if you want to. For it to succeed, the device sample needs to be running at the same time. Success looks like the device sample is printing something about updating a property the service sample printing an updated digital twin in the terminal.

### Send a command and retrieve the response using the Node service SDK

**invoke_command.js** invokes a synchronous command on your device digital twin. For it to succeed, the device sample needs to be running at the same time. Success looks like the device sample is printing something about acknowledging a command, and the service client printing the result of the command in the terminal.

### Connect to the global repository and retrieve a model definition using the Node service SDK

Using the same instructions as for the service and device samples, you need to set the following four environment variables:

* `AZURE_IOT_MODEL_REPO_ID`
* `AZURE_IOT_MODEL_REPO_KEY_ID`
* `AZURE_IOT_MODEL_REPO_KEY_SECRET`
* `AZURE_IOT_MODEL_REPO_HOSTNAME`

You can get these values from your company model repository connection string. You can find this connection string in the [Azure Certified for IoT portal](https://aka.ms/ACFI) on the **Connection strings** tab for your **Company repository**.

The connection string looks like the following example:

```text
HostName=https://{repo host name};RepositoryId={repo ID};SharedAccessKeyName={repo key ID};SharedAccessKey={repo key secret}
```

After you've set these four environment variables, run the sample the same way you ran the other samples:

```cmd/sh
node model_repo.js
```

This sample downloads the **ModelDiscovery** interface and prints this model in the terminal.

### Run queries in IoT Hub based on capability models and interfaces

The IoT Hub query language supports `HAS_INTERFACE` and `HAS_CAPABILITYMODEL` as shown in the following examples:

```sql
select * from devices where HAS_INTERFACE('id without version', version)
```

```sql
select * from devices where HAS_CAPABILITYMODEL('id without version', version)
```

> [!NOTE]
> To get the new IoT Plug and Play interface data format, use `INTERFACES` instead of `*`.

## Next steps

Now that you've learned about service solutions that interact with your IoT Plug and Play devices, a suggested next step is to learn about [Model discovery](concepts-model-discovery.md).
