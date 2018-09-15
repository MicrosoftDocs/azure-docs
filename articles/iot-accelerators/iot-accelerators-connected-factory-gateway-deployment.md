---
title: Deploy your Connected Factory gateway - Azure | Microsoft Docs
description: How to deploy a gateway on either Windows or Linux to enable connectivity to the Connected Factory solution accelerator.
author: dominicbetts
manager: timlt
ms.service: iot-accelerators
services: iot-accelerators
ms.topic: conceptual
ms.date: 01/17/2018
ms.author: dobett
---

# Deploy an edge gateway for the Connected Factory solution accelerator on Windows or Linux

You need two software components to deploy an edge gateway for the *Connected Factory* solution accelerator:

- The *OPC Proxy* establishes a connection to Connected Factory. The OPC Proxy then waits for command and control messages from the integrated OPC Browser that runs in the Connected Factory solution portal.

- The *OPC Publisher* connects to existing on-premises OPC UA servers and forwards telemetry messages from them to Connected Factory. You can connect an OPC classic device using the [OPC classic adapter for OPC UA](https://github.com/OPCFoundation/UA-.NETStandard/blob/master/ComIOP/README.md).

Both components are open-source and are available as source on GitHub and as Docker containers on DockerHub:

| GitHub | DockerHub |
| ------ | --------- |
| [OPC Publisher](https://github.com/Azure/iot-edge-opc-publisher) | [OPC Publisher](https://hub.docker.com/r/microsoft/iot-edge-opc-publisher/)   |
| [OPC Proxy](https://github.com/Azure/iot-edge-opc-proxy)         | [OPC Proxy](https://hub.docker.com/r/microsoft/iot-edge-opc-proxy/) |

You do not need a public-facing IP address or open inbound ports in the gateway firewall for either component. The OPC Proxy and OPC Publisher components only use outbound port 443.

The steps in this article show you how to deploy an edge gateway using Docker on either Windows or Linux. The gateway enables connectivity to the Connected Factory solution accelerator. You can also use the components without Connected Factory.

> [!NOTE]
> Both components can be used as modules in [Azure IoT Edge](https://github.com/Azure/iot-edge).

## Choose a gateway device

If you don't yet have a gateway device, Microsoft recommends you buy a commercial gateway from one of their partners. For a list of gateway devices compatible with the Connected Factory solution, visit the [Azure IoT device catalog](https://catalog.azureiotsuite.com/?q=opc). Follow the instructions that come with the device to set up the gateway.

Alternatively, use the following instructions to manually configure an existing gateway device.

## Install and configure Docker

Install [Docker for Windows](https://www.docker.com/docker-windows) on your Windows-based gateway device or use a package manager to install docker on your Linux-based gateway device.

During Docker for Windows setup, select a drive on your host machine to share with Docker. The following screenshot shows sharing the **D** drive on your Windows system to allow access to the host drive from inside a docker container:

![Install Docker for Windows](./media/iot-accelerators-connected-factory-gateway-deployment/image1.png)

> [!NOTE]
> You can also perform this step after installing docker from the **Settings** dialog. Right-click on the **Docker** icon in the Windows system tray and choose **Settings**. If major Windows updates have been deployed to the system, such as the Windows Fall Creators update, unshare the drives and share them again to refresh the access rights.

If you are using Linux, no additional configuration is required to enable access to the file system.

On Windows, create a folder on the drive you shared with Docker, on Linux create a folder under the root filesystem. This walkthrough refers to this folder as `<SharedFolder>`.

When you refer to the `<SharedFolder>` in a Docker command, be sure to use the correct syntax for your operating system. Here are two examples, one for Windows and one for Linux:

- If your are using the folder `D:\shared` on Windows as your `<SharedFolder>`, the Docker command syntax is `d:/shared`.

- If your are using the folder `/shared` on Linux as your `<SharedFolder>`, the Docker command syntax is `/shared`.

For more information see the [Use volumes](https://docs.docker.com/engine/admin/volumes/volumes/) docker engine reference.

## Configure the OPC components

Before you install the OPC components, complete the following steps to prepare your environment:

1. To complete the gateway deployment, you need the **iothubowner** connection string of the IoT Hub in your Connected Factory deployment. In the [Azure portal](http://portal.azure.com/), navigate to your IoT Hub in the resource group created when you deployed the Connected Factory solution. Click **Shared access policies** to access the **iothubowner** connection string:

    ![Find the IoT Hub connection string](./media/iot-accelerators-connected-factory-gateway-deployment/image2.png)

    Copy the **Connection string-primary key** value.

1. To allow communication between docker containers, you need a user-defined bridge network. To create a bridge network for your containers, run the following commands at a command prompt:

    ```cmd/sh
    docker network create -d bridge iot_edge
    ```

    To verify the **iot_edge** bridge network was created, run the following command:

    ```cmd/sh
    docker network ls
    ```

    Your **iot_edge** bridge network is included in the list of networks.

To run the OPC Publisher, run the following command at a command prompt:

```cmd/sh
docker run --rm -it -v <SharedFolder>:/docker -v x509certstores:/root/.dotnet/corefx/cryptography/x509stores --network iot_edge --name publisher -h publisher -p 62222:62222 --add-host <OpcServerHostname>:<IpAddressOfOpcServerHostname> microsoft/iot-edge-opc-publisher:2.1.4 publisher "<IoTHubOwnerConnectionString>" --lf /docker/publisher.log.txt --as true --si 1 --ms 0 --tm true --vc true --di 30
```

- The [OPC Publisher GitHub](https://github.com/Azure/iot-edge-opc-publisher) and the [docker run reference](https://docs.docker.com/engine/reference/run/) provide more information about:

  - The docker command line options specified before the container name (`microsoft/iot-edge-opc-publisher:2.1.4`).
  - The meaning of the OPC Publisher command line parameters specified after the container name (`microsoft/iot-edge-opc-publisher:2.1.4`).

- The `<IoTHubOwnerConnectionString>` is the **iothubowner** shared access policy connection string from the Azure portal. You copied this connection string in a previous step. You only need this connection string for the first run of OPC Publisher. On subsequent runs you should omit it because it poses a security risk.

- The `<SharedFolder>` you use and its syntax is described in the section [Install and configure Docker](#install-and-configure-docker). OPC Publisher uses the `<SharedFolder>` to read and write to the OPC Publisher configuration file, write to the log file, and make both these files available outside of the container.

- OPC Publisher reads its configuration from the **publishednodes.json** file, which is read from and written to the `<SharedFolder>/docker` folder. This configuration file defines which OPC UA node data on a given OPC UA server the OPC Publisher should subscribe to. The full syntax of the **publishednodes.json** file is described on the [OPC Publisher](https://github.com/Azure/iot-edge-opc-publisher) page on GitHub. When you add a gateway, put an empty **publishednodes.json** into the folder:

    ```json
    [
    ]
    ```

- Whenever the OPC UA server notifies OPC Publisher of a data change, the new value is sent to IoT Hub. Depending on the batching settings, the OPC Publisher may first accumulate the data before it sends the data to IoT Hub in a batch.

- Docker does not support NetBIOS name resolution, only DNS name resolution. If you don't have a DNS server on the network, you can use the workaround shown in the previous command line example. The previous command line example uses the `--add-host` parameter to add an entry into the containers hosts file. This entry enables hostname lookup for the given `<OpcServerHostname>`, resolving to the given IP address `<IpAddressOfOpcServerHostname>`.

- OPC UA uses X.509 certificates for authentication and encryption. You need to place the OPC Publisher certificate on the OPC UA server you are connecting to, to ensure it trusts OPC Publisher. The OPC Publisher certificate store is located in the `<SharedFolder>/CertificateStores` folder. You can find the OPC Publisher certificate in the `trusted/certs` folder in the `CertificateStores` folder.

  The steps to configure the OPC UA server depend on the device you are using. these steps are typically documented in the OPC UA server's user manual.

To install the OPC Proxy, run the following command at a command prompt:

```cmd/sh
docker run -it --rm -v <SharedFolder>:/mapped --network iot_edge --name proxy --add-host <OpcServerHostname>:<IpAddressOfOpcServerHostname> microsoft/iot-edge-opc-proxy:1.0.4 -i -c "<IoTHubOwnerConnectionString>" -D /mapped/cs.db
```

You only need to run the installation once on a system.

Use the following command to run the OPC Proxy:

```cmd/sh
docker run -it --rm -v <SharedFolder>:/mapped --network iot_edge --name proxy --add-host <OpcServerHostname>:<IpAddressOfOpcServerHostname> microsoft/iot-edge-opc-proxy:1.0.4 -D /mapped/cs.db
```

OPC Proxy saves the connection string during the installation. On subsequent runs you should omit the connection string because it poses a security risk.

## Enable your gateway

Complete the following steps to enable your gateway in the Connected Factory solution accelerator:

1. When both components are running, browse to the **Connect your own OPC UA Server** page in the Connected Factory solution portal. This page is only available to Administrators in the solution. Enter the publisher endpoint URL (opc.tcp://publisher:62222) and click **Connect**.

1. Establish a trust relationship between the Connected Factory portal and OPC Publisher. When you see a certificate warning, click **Proceed**. Next, you see an error that the OPC Publisher doesn’t trust the UA Web client. To resolve this error, copy the **UA Web Client** certificate from the `<SharedFolder>/CertificateStores/rejected/certs` folder to the `<SharedFolder>/CertificateStores/trusted/certs` folder on the gateway. You do not need to restart the gateway.

You can now connect to the gateway from the cloud, and you are ready to add OPC UA servers to the solution.

## Add your own OPC UA servers

To add your own OPC UA servers to the Connected Factory solution accelerator:

1. Browse to the **Connect your own OPC UA server** page in the Connected Factory solution portal.

    1. Start the OPC UA server you want to connect to. Ensure that your OPC UA server can be reached from OPC Publisher and OPC Proxy running in the container (see the previous comments about name resolution).
    1. Enter the endpoint URL of your OPC UA server (`opc.tcp://<host>:<port>`) and click **Connect**.
    1. As part of the connection setup, a trust relationship between the Connected Factory portal (OPC UA client) and the OPC UA server you are trying to connect is established. In the Connected Factory dashboard you get a **Certificate of the server you want to connect cannot be verified** warning. When you see a certificate warning, click **Proceed**.
    1. More difficult to setup is the certificate configuration of the OPC UA server you are trying to connect to. For PC based OPC UA servers, you may just get a warning dialog in the dashboard that you can acknowledge. For embedded OPC UA server systems, consult the documentation of your OPC UA server to look up how this task is done. To complete this task, you may need the certificate of the Connected Factory portal's OPC UA client. An Administrator can download this certificate on the **Connect your own OPC UA server** page:

        ![Solution portal](./media/iot-accelerators-connected-factory-gateway-deployment/image4.png)

1. Browse the OPC UA nodes tree of your OPC UA server, right-click the OPC nodes you want to send values to Connected Factory, and select **publish**.

1. Telemetry now flows from the gateway device. You can view the telemetry in the **Factory Locations** view of the Connected Factory portal under **New Factory**.

## Next steps

To learn more about the architecture of the Connected Factory solution accelerator, see [Connected Factory solution accelerator walkthrough](iot-accelerators-connected-factory-sample-walkthrough.md).

Learn about the [OPC Publisher reference implementation](https://docs.microsoft.com/azure/iot-suite/iot-suite-connected-factory-publisher).