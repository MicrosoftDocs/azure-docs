---
title: Configure the Microsoft OPC Publisher
description: In this tutorial, you learn how to configure the OPC Publisher in standalone mode.
author: jehona-m
ms.author: jemorina
ms.service: industrial-iot
ms.topic: tutorial
ms.date: 3/22/2021
---

# Tutorial: Configure the OPC Publisher

In this tutorial contains information on the configuration of the OPC Publisher. Several interfaces can be used to configure it.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Configure the OPC Publisher via Configuration File
> * Configure the OPC Publisher via Command-line Arguments
> * Configure the OPC Publisher via IoT Hub Direct Methods
> * Configure the OPC Publisher via cloud-based, companion REST microservice

## Configuring Security

IoT Edge provides OPC Publisher with its security configuration for accessing IoT Hub automatically. OPC Publisher can also run as a standalone Docker container by specifying a device connection string for accessing IoT Hub via the `dc` command-line parameter. A device for IoT Hub can be created and its connection string retrieved through the Azure portal.

For accessing OPC UA-enabled assets, X.509 certificates and their associated private keys are used by OPC UA. This is called OPC UA application authentication and in addition  to OPC UA user authentication. OPC Publisher uses a file system-based certificate store to manage all application certificates. During startup, OPC Publisher checks if there is a certificate it can use in this certificate stores and creates a new self-signed certificate and new associated private key if there is none. Self-signed certificates provide weak authentication, since they are not signed by a trusted Certificate Authority, but at least the communication to the OPC UA-enabled asset can be encrypted this way.

Security is enabled in the configuration file via the `"UseSecurity": true,` flag. The most secure endpoint available on the OPC UA servers the OPC Publisher is supposed to connect to is automatically selected.
By default, OPC Publisher uses anonymous user authentication (in additional to the application authentication described above). However, OPC Publisher also supports user authentication using username and password. This can be specified via the REST API configuration interface (described below) or the configuration file as follows:
```
"OpcAuthenticationMode": "UsernamePassword",
"OpcAuthenticationUsername": "usr",
"OpcAuthenticationPassword": "pwd",
```
In addition, OPC Publisher version 2.5 and below encrypts the username and password in the configuration file. Version 2.6 and above only supports the username and password in plaintext. This will be improved in the next version of OPC Publisher.

To persist the security configuration of OPC Publisher across restarts, the certificate and private key located in the certificate store directory must be mapped to the IoT Edge host OS filesystem. See "Specifying Container Create Options in the Azure portal" above.

## Configuration via Configuration File

The simplest way to configure OPC Publisher is via a configuration file. An example configuration file as well as documentation regarding its format is provided via the file [`publishednodes.json`](https://raw.githubusercontent.com/Azure/iot-edge-opc-publisher/master/opcpublisher/publishednodes.json) in this repository.
Configuration file syntax has changed over time and OPC Publisher still can read old formats, but converts them into the latest format when persisting the configuration, done regularly in an automated fashion.

A basic configuration file looks like this:
```
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

OPC UA assets optimize network bandwidth by only sending data changes to OPC Publisher when the data has changed. If data changes need to be published more often or at regular intervals, OPC Publisher supports a "heartbeat" for every configured data item that can be enabled by additionally specifying the HeartbeatInterval key in the data item's configuration. The interval is specified in seconds:
```
 "HeartbeatInterval": 3600,
```

An OPC UA asset always sends the current value of a data item when OPC Publisher first connects to it. To prevent publishing this data to IoT Hub, the SkipFirst key can be additionally specified in the data item's configuration:
```
 "SkipFirst": true,
```

Both settings can be enabled globally via command-line options, too.

## Configuration via Command-line Arguments

There are several command-line arguments that can be used to set global settings for OPC Publisher. They are described [here](reference-command-line-arguments.md).


## Configuration via the built-in OPC UA Server Interface

>[!NOTE] 
> This feature is only available in version 2.5 and below of OPC Publisher.**

OPC Publisher has a built-in OPC UA server, running on port 62222. It implements three OPC UA methods:

  - PublishNode
  - UnpublishNode
  - GetPublishedNodes

This interface can be accessed using an OPC UA client application, for example [UA Expert](https://www.unified-automation.com/products/development-tools/uaexpert.html).

## Configuration via IoT Hub Direct Methods

>[!NOTE] 
> This feature is only available in version 2.5 and below of OPC Publisher.**

OPC Publisher implements the following [IoT Hub Direct Methods](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-direct-methods), which can be called from an application (from anywhere in the world) leveraging the [IoT Hub Device SDK](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-sdks):

  - PublishNodes
  - UnpublishNodes
  - UnpublishAllNodes
  - GetConfiguredEndpoints
  - GetConfiguredNodesOnEndpoint
  - GetDiagnosticInfo
  - GetDiagnosticLog
  - GetDiagnosticStartupLog
  - ExitApplication
  - GetInfo

We have provided a [sample configuration application](https://github.com/Azure-Samples/iot-edge-opc-publisher-nodeconfiguration) as well as an [application for reading diagnostic information](https://github.com/Azure-Samples/iot-edge-opc-publisher-diagnostics) from OPC Publisher open-source, leveraging this interface.

## Configuration via Cloud-based, Companion REST Microservice

>[!NOTE] 
> This feature is only available in version 2.6 and above of OPC Publisher.

A cloud-based, companion microservice with a REST interface is described and available [here](https://github.com/Azure/Industrial-IoT/blob/master/docs/services/publisher.md). It can be used to configure OPC Publisher via an OpenAPI-compatible interface, for example through Swagger.

## Configuration of the simple JSON telemetry format via Separate Configuration File

>[!NOTE] 
> This feature is only available in version 2.5 and below of OPC Publisher.

OPC Publisher allows filtering the parts of the non-standardized, simple telemetry format via a separate configuration file, which can be specified via the tc command line option. If no configuration file is specified, the full JSON telemetry format is sent to IoT Hub. The format of the separate telemetry configuration file is described [here](reference-opc-publisher-telemetry-format.md#opc-publisher-telemetry-configuration-file-format).

## Next steps
Now that you have configured the OPC Publisher, the next step is to learn how to tune the performance and memory of the Edge module:

> [!div class="nextstepaction"]
> [Performance and Memory Tuning](tutorial-publisher-performance-memory-tuning-opc-publisher.md)