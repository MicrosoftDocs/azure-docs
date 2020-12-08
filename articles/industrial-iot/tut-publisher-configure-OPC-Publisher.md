---
title: Configure the OPC Publisher
description: In this tutorial you learn how to configure the OPC Publisher in standalone mode.
author: jehona-m
ms.author: jemorina
ms.service: industrial-iot
ms.topic: tutorial
ms.date: 12/07/2020
---



# Tutorial: Configure the OPC Publisher

In this tutorial contains information on the configuration of the OPC Publisher. Several interfaces can be used to to configure it.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Configure the OPC Publisher via Configuration File
> * Configure the OPC Publisher via Command Line Arguments
> * Configure the OPC Publisher via IoT Hub Direct Methods
> * Configure the OPC Publisher via cloud-based, companion REST microservice

### Configuring Security

IoT Edge provides OPC Publisher with its security configuration for accessing IoT Hub automatically. OPC Publisher can also run as a standalone Docker container by specifying a device connection string for accessing IoT Hub via the `dc` command line parameter. A device for IoT Hub can be created and its connection string retrieved through the Azure Portal.

For accessing OPC UA-enabled assets, X.509 certificates and their associated private keys are used by OPC UA. This is called OPC UA application authentication and in addition  to OPC UA user authentication. OPC Publisher uses a file system-based certificate store to manage all application certificates. During startup, OPC Publisher checks if there is a certificate it can use in this certificate stores and creates a new self-signed certificate and new associated private key if there is none. Self-signed certificates provide weak authentication, since they are not signed by a trusted Certificate Authority, but at least the communication to the OPC UA-enabled asset can be encrypted this way.

Security is enabled in the configuration file via the `"UseSecurity": true,` flag. The most secure endpoint available on the OPC UA servers the OPC Publisher is supposed to connect to is automatically selected.
By default, OPC Publisher uses anonymous user authentication (in additional to the application authentication described above). However, OPC Publisher also supports user authentication using username and password. This can be specificed via the REST API configuration interface (described below) or the configuration file as follows:
```
"OpcAuthenticationMode": "UsernamePassword",
"OpcAuthenticationUsername": "usr",
"OpcAuthenticationPassword": "pwd",
```
In addition, OPC Publisher version 2.5 and below encrypts the username and password in the configuration file. Version 2.6 and above only supports the username and password in plaintext. This will be improved in the next version of OPC Publisher.

To persist the security configuration of OPC Publisher across restarts, the certificate and private key located in the the certificate store directory must be mapped to the IoT Edge host OS filesystem. Please see [Specifying Container Create Options in the Azure Portal](https://github.com/Azure/iot-edge-opc-publisher/tree/docs#specifying-container-create-options-in-the-azure-portal).

### Configuration via Configuration File

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

OPC UA assets optimizes network bandwidth by only sending data changes to OPC Publisher when the data has changed. If data changes need to be published more often or at regular intervals, OPC Publisher supports a "heartbeat" for every configured data item that can be enabled by additionally specifying the HeartbeatInterval key in the data item's configuration. The interval is specified in seconds:
```
 "HeartbeatInterval": 3600,
```

An OPC UA asset always send the current value of a data item when OPC Publisher first connects to it. To prevent publishing this data to IoT Hub, the SkipFirst key can be additionally specified in the data item's configuration:
```
 "SkipFirst": true,
```

Both settings can be enabled globally via command line options, too.

### Configuration via Command Line Arguments

There are several command line arguments that can be used to set global settings for OPC Publisher. They are described [here](ref-command-line-arguments.md).


### Configuration via the built-in OPC UA Server Interface
**Please note: This feature is only available in version 2.5 and below of OPC Publisher.**

OPC Publisher has a built-in OPC UA server, running on port 62222. It implements three OPC UA methods:

  - PublishNode
  - UnpublishNode
  - GetPublishedNodes

This interface can be accessed using an OPC UA client application, for example [UA Expert](https://www.unified-automation.com/products/development-tools/uaexpert.html).

### Configuration via IoT Hub Direct Methods

**Please note: This feature is only available in version 2.5 and below of OPC Publisher.**

OPC Publisher implements the following [IoT Hub Direct Methods](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-direct-methods) which can be called from an application (from anywhere in the world) leveraging the [IoT Hub Device SDK](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-sdks):

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

### Configuration via Cloud-based, Companion REST Microservice

**Please note: This feature is only available in version 2.6 and above of OPC Publisher.**

A cloud-based, companion microservice with a REST interface is described and available [here](https://github.com/Azure/Industrial-IoT/blob/master/docs/services/publisher.md). It can be used to configure OPC Publisher via an OpenAPI-compatible interface, for example through Swagger.

## Next steps
Now that you have configured the OPC Publisher, the next step is to learn how to tune the performance and memory of the Edge module:

> [!div class="nextstepaction"]
> [Performance and Memory Tuning](tut-publisher-performance-memory-tuning-OPC-Publisher.md)