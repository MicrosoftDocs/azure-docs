---
title: Deploy the Microsoft OPC Publisher
description: In this tutorial, you learn how to deploy the OPC Publisher in standalone mode.
author: hansgschossmann
ms.author: johanng
ms.service: industrial-iot
ms.topic: tutorial
ms.date: 3/22/2021
---

# Tutorial: Deploy the OPC Publisher

OPC Publisher is a fully supported Microsoft product, developed in the open, that bridges the gap between industrial assets and the Microsoft Azure cloud. It does so by connecting to OPC UA-enabled assets or industrial connectivity software and publishes telemetry data to [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/) in various formats, including IEC62541 OPC UA PubSub standard format (from version 2.6 onwards).

It runs on [Azure IoT Edge](https://azure.microsoft.com/services/iot-edge/) as a Module.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Deploy the OPC Publisher
> * Run the latest released version of OPC Publisher as a container
> * Specify Container Create Options in the Azure portal

## Prerequisites

- An Azure subscription must be created. If you don’t have an Azure subscription, create a [free trial account](https://azure.microsoft.com/free/search/).
- An IoT Hub must be created
- An IoT Edge device must be created
- An IoT Edge device must be registered

## Deploy the OPC Publisher from the Azure Marketplace

1. Pick the Azure subscription to use. If no Azure subscription is available, one must be created.
2. Pick the IoT Hub the OPC Publisher is supposed to send data to. If no IoT Hub is available, one must be created.
3. Pick the IoT Edge device the OPC Publisher is supposed to run on (or enter a name for a new IoT Edge device to be created).
4. Select **Create**. The **Set modules on Device** page for the selected IoT Edge device opens.
5. Select **OPCPublisher** to open the OPC Publisher's **Update IoT Edge Module** page and then select **Container Create Options**.
6. Specify other container create options based on your usage of OPC Publisher, see next section below.

All supported docker images for the docker OPC Publisher are listed [here](https://mcr.microsoft.com/v2/iotedge/opc-publisher/tags/list). For non-OPC UA-enabled assets, leading industrial connectivity providers offer OPC UA adapter software.  These adapters are available in the Azure [Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?page=1).

## Specifying Container Create Options in the Azure portal
When deploying OPC Publisher through the Azure portal, container create options can be specified in the Update IoT Edge Module page of OPC Publisher. These create options must be in JSON format. The OPC Publisher command-line arguments can be specified via the Cmd key, for example:
```
"Cmd": [
    "--pf=./pn.json",
    "--aa"
],
```

A typical set of IoT Edge Module Container Create Options for OPC Publisher is:
```
{
    "Hostname": "opcpublisher",
    "Cmd": [
        "--pf=/appdata/pn.json",
        "--aa"
    ],
    "HostConfig": {
        "Binds": [
            "/iiotedge:/appdata"
        ]
    }
}
```

With these options specified, OPC Publisher will read the configuration file `./pn.json`. The OPC Publisher's working directory is set to
`/appdata` at startup and thus OPC Publisher will read the file `/appdata/pn.json` inside its Docker container. 
OPC Publisher's log file will be written to `/appdata` and the `CertificateStores` directory (used for OPC UA certificates) will also be created in this directory. To make these files available in the IoT Edge host file system, the container configuration requires a bind mount volume. The `/iiotedge:/appdata` bind will map the directory `/appdata` to the host directory `/iiotedge` (which will be created by the IoT Edge runtime if it doesn't exist).
**Without this bind mount volume, all OPC Publisher configuration files will be lost when the container is restarted.**

A connection to an OPC UA server using its hostname without a DNS server configured on the network can be achieved by adding an `ExtraHosts` entry to the `HostConfig` section:

```
"HostConfig": {
    "ExtraHosts": [
        "opctestsvr:192.168.178.26"
    ]
}
```

## Next steps 
Now that you've deployed the OPC Publisher IoT Edge module, the next step is to configure it:

> [!div class="nextstepaction"]
> [Configure the OPC Publisher](tutorial-publisher-configure-opc-publisher.md)
