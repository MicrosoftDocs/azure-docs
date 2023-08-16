---
title: Configure the Microsoft OPC Publisher
description: In this tutorial, you learn how to configure the OPC Publisher in standalone mode.
author: hansgschossmann
ms.author: johanng
ms.service: industrial-iot
ms.topic: tutorial
ms.date: 3/22/2021
---

# Tutorial: Configure the OPC Publisher

In this tutorial contains information on the configuration of the OPC Publisher. Several interfaces can be used to configure it.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Configure the OPC Publisher via Configuration File
> * Configure the OPC Publisher via Command-line Arguments
> * Configure the OPC Publisher via IoT Hub Direct Methods
> * Configure the OPC Publisher via cloud-based, companion REST microservice

## Configuring Security

IoT Edge provides OPC Publisher with its security configuration for accessing IoT Hub automatically. OPC Publisher can also run as a standalone Docker container by specifying a device connection string for accessing IoT Hub via the `dc` command-line parameter. A device for IoT Hub can be created and its connection string retrieved through the Azure portal.

To access OPC UA systems, X.509 certificates are used by OPC UA. The certificates are used for authentication and encryption of the data exchanged. OPC Publisher uses a file system-based certificate store to manage all application certificates. During startup, OPC Publisher checks existence of its own certificate in the certificate store. If no certificate exists for OPC Publisher, it creates a new self-signed certificate and associated private key. Self-signed certificates provide weak authentication, since they are not signed by a trusted Certificate Authority.

Security is enabled in the configuration file via the `"UseSecurity": true,` flag. The most secure endpoint available on the OPC UA server the OPC Publisher is supposed to connect to is automatically selected.
By default, OPC Publisher uses anonymous user authentication (in addition to the application authentication described above). However, OPC Publisher also supports user authentication using username and password. These credentials can be specified via the REST API configuration interface (described below) or the configuration file as follows:

```json
"OpcAuthenticationMode": "UsernamePassword",
"OpcAuthenticationUsername": "usr",
"OpcAuthenticationPassword": "pwd",
```

OPC Publisher version 2.5 and below encrypts the username and password in the configuration file. Version 2.6 and above only supports the username and password in plaintext.

To persist the security configuration of OPC Publisher, the certificate store must be mapped to the IoT Edge host OS filesystem or a container data volume.

## Configuration via Configuration File

The simplest way to configure OPC Publisher is via a configuration file. An example configuration file and format documentation are provided in the file [`publishednodes.json`](https://raw.githubusercontent.com/Azure/Industrial-IoT/main/src/Azure.IIoT.OpcUa.Publisher/tests/Publisher/publishednodes.json) in this repository.
Configuration file syntax has changed over time. OPC Publisher still can read old formats, but converts them into the latest format when writing the file.

A basic configuration file looks like this:

```json
[
  {
    "EndpointUrl": "opc.tcp://testserver:62541/Quickstarts/ReferenceServer",
    "UseSecurity": true,
    "OpcNodes": [
      {
        "Id": "i=2258",
        "OpcSamplingInterval": 2000,
        "OpcPublishingInterval": 5000,
        "DisplayName": "Current time"
      }
    ]
  }
]
```

OPC UA server systems optimize network bandwidth by only sending data changes to OPC Publisher when the data has changed. If data changes need to be published more often or at regular intervals, OPC Publisher supports a "heartbeat" setting for every configured OPC UA node. This "heartbeat" can be enabled by specifying the `HeartbeatInterval` key in the node configuration. The interval is specified in seconds:

```json
 "HeartbeatInterval": 3600,
```

An OPC UA server system always sends the current value of a node when OPC Publisher connects to it. To prevent publishing this data to the cloud, the `SkipFirst` key can be additionally specified in the node configuration:

```json
 "SkipFirst": true,
```

>[!NOTE]
> This feature is only available in version 2.5 and below of OPC Publisher.

Both settings can be enabled globally via command-line options, too.

## Configuration via Command-line Arguments

There are [several command-line arguments](reference-command-line-arguments.md) that can be used to set global settings for OPC Publisher.

## Configuration via the built-in OPC UA Server Interface

>[!NOTE]
> This feature is only available in version 2.5 and below of OPC Publisher.

OPC Publisher has a built-in OPC UA server, running on port 62222. It implements three OPC UA methods:

* PublishNode
* UnpublishNode
* GetPublishedNodes

This interface can be accessed using an OPC UA client application, for example [UA Expert](https://www.unified-automation.com/products/development-tools/uaexpert.html).

## Configuration via IoT Hub Direct Methods

>[!NOTE]
> This feature is only available in version 2.5 and below of OPC Publisher.

OPC Publisher implements the following [IoT Hub Direct Methods](../iot-hub/iot-hub-devguide-direct-methods.md), which can be called from an application (from anywhere in the world) using the [IoT Hub Device SDK](../iot-hub/iot-hub-devguide-sdks.md):

* PublishNodes
* UnpublishNodes
* UnpublishAllNodes
* GetConfiguredEndpoints
* GetConfiguredNodesOnEndpoint
* GetDiagnosticInfo
* GetDiagnosticLog
* GetDiagnosticStartupLog
* ExitApplication
* GetInfo

## Configuration via Cloud-based, Companion REST Microservice

>[!NOTE]
> This feature is only available in version 2.6 and above of OPC Publisher.

A cloud-based, companion microservice with a REST interface is described and available [here](https://github.com/Azure/Industrial-IoT/tree/main/docs/opc-publisher). It can be used to configure OPC Publisher via an OpenAPI-compatible interface, for example through Swagger.

## Configuration of the simple JSON telemetry format via Separate Configuration File

>[!NOTE]
> This feature is only available in version 2.5 and below of OPC Publisher.

OPC Publisher allows configuration of the simple telemetry format via a configuration file. This file can be specified via the `--tc`  command-line option. By default the full JSON telemetry format is sent to IoT Hub. The format of the telemetry configuration file is described [here](reference-opc-publisher-telemetry-format.md#opc-publisher-telemetry-configuration-file-format).

## Next steps

After a successful configuration of OPC Publisher, the next step is to learn how to tune the performance and memory of the module:

> [!div class="nextstepaction"]
> [Performance and Memory Tuning](tutorial-publisher-performance-memory-tuning-opc-publisher.md)
