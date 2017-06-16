---
title: Deploy your Azure IoT Suite connected factory gateway | Microsoft Docs
description: How to deploy a gateway on either Windows or Linux to enable connectivity to the connected factory preconfigured solution.
services: ''
suite: iot-suite
documentationcenter: na
author: dominicbetts
manager: timlt
editor: ''

ms.service: iot-suite
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/22/2017
ms.author: dobett

---

# Deploy a gateway on Windows or Linux for the connected factory preconfigured solution

The software required to deploy a gateway for the connected factory preconfigured solution has two components:

* The *OPC Proxy* establishes a connection to IoT Hub and waits for command and control messages from the integrated OPC Browser that runs in the connected factory solution portal.
* The *OPC Publisher* connects to existing on-premises OPC UA servers and forwards telemetry messages from them to IoT Hub.

Both components are open-source and are available as source on GitHub and as Docker containers:

| GitHub | DockerHub |
| ------ | --------- |
| [OPC Publisher][lnk-publisher-github] | [OPC Publisher][lnk-publisher-docker] |
| [OPC Proxy][lnk-proxy-github] | [OPC Proxy][lnk-proxy-docker] |

No public-facing IP address or holes in the gateway firewall are required for either component. The OPC Proxy and OPC Publisher use only outbound ports 443, 5671, and 8883.

The steps in this article show you how to deploy a gateway using Docker on either Windows or Linux. The gateway enables connectivity to the connected factory preconfigured solution.

> [!NOTE]
> The gateway software that runs in the Docker container is [Azure IoT Edge].

## Windows deployment

> [!NOTE]
> If you don't yet have a gateway device, Microsoft recommends you buy a commercial gateway from one of our partners. Visit the [Azure IoT device catalog] for a list of gateway devices compatible with the connected factory solution. Follow the instructions that come with the device to set up the gateway. Alternatively, use the following instructions to manually set up one of your existing gateways.

### Install Docker

Install [Docker for Windows] on your Windows-based gateway device. During Windows Docker setup, select a drive on your host machine to share with Docker. The following screenshot shows sharing the D drive on your Windows system:

![Install Docker][img-install-docker]

Then create a folder called **docker** in the root of the shared drive.
You can also perform this step after installing docker from the **Settings** menu.

### Configure the gateway

1. You need the **iothubowner** connection string of your Azure IoT Suite connected factory deployment to complete the gateway deployment. In the [Azure portal], navigate to your IoT Hub in the resource group created when you deployed the connected factory solution. Click **Shared access policies** to access the **iothubowner** connection string:

    ![Find the IoT Hub connection string][img-hub-connection]

    Copy the **Connection string--primary key** value.

1. Configure the gateway for your IoT Hub by running the two gateway modules **once** from a command prompt with:

    `docker run -it --rm -h <ApplicationName> -v //D/docker:/build/src/GatewayApp.NetCore/bin/Debug/netcoreapp1.0/publish/CertificateStores -v //D/docker:/root/.dotnet/corefx/cryptography/x509stores microsoft/iot-gateway-opc-ua:1.0.0 <ApplicationName> "<IoTHubOwnerConnectionString>"`

    `docker run -it --rm -v //D/docker:/mapped microsoft/iot-gateway-opc-ua-proxy:0.1.3 -i -c "<IoTHubOwnerConnectionString>" -D /mapped/cs.db`

    * **&lt;ApplicationName&gt;** is the name to give to your OPC UA Publisher in the format **publisher.&lt;your fully qualified domain name&gt;**. For example, if your factory network is called **myfactorynetwork.com**, the **ApplicationName** value is **publisher.myfactorynetwork.com**.
    * **&lt;IoTHubOwnerConnectionString&gt;** is the **iothubowner** connection string you copied in the previous step. This connection string is only used in this step and you don’t need it again.

    The mapped D:\\docker folder (the `-v` argument) is used later to persist the two X.509 certificates used by the gateway modules.

### Run the gateway

1. Restart the gateway using the following commands:

    `docker run -it --rm -h <ApplicationName> --expose 62222 -p 62222:62222 -v //D/docker:/build/src/GatewayApp.NetCore/bin/Debug/netcoreapp1.0/publish/Logs -v //D/docker:/build/src/GatewayApp.NetCore/bin/Debug/netcoreapp1.0/publish/CertificateStores -v //D/docker:/shared -v //D/docker:/root/.dotnet/corefx/cryptography/x509stores -e \_GW\_PNFP="/shared/publishednodes.JSON" microsoft/iot-gateway-opc-ua:1.0.0 <ApplicationName>`

    `docker run -it --rm -v //D/docker:/mapped microsoft/iot-gateway-opc-ua-proxy:0.1.3 -D /mapped/cs.db`

1. For security reasons, the two X.509 certificates persisted in the D:\\docker folder contain the private key. Access to this folder must be limited to the credentials (typically **Administrators**) used to run the Docker container. Right-click the D:\\docker folder, choose **Properties**, then **Security**, and then **Edit**. Give **Administrators** full control and remove everyone else:

    ![Grant permissions to Docker share][img-docker-share]

1. Verify network connectivity. Try to ping your gateway. From a command prompt, enter the command `ping publisher.<your fully qualified domain name>`. If the destination is unreachable, add the IP address and name of your gateway to your hosts file on your gateway. The hosts file is located in the "Windows\\System32\\drivers\\etc" folder.

1. Next, try to connect to the publisher using a local OPC UA client running on the gateway. The OPC UA endpoint URL is `opc.tcp://publisher.<your fully qualified domain name>:62222`. If you don't have an OPC UA client, you can download an [open-source OPC UA client].

1. When you have successfully completed these local tests, browse to the **Connect your own OPC UA Server** page in the connected factory solution portal. Enter the publisher endpoint URL (`tcp://publisher.<your fully qualified domain name>:62222`) and click **Connect**. You get a certificate warning, then click **Proceed.** Next you get an error that the publisher doesn’t trust the UA Web Client. To resolve this error, copy the **UA Web Client** certificate from the "D:\\docker\\Rejected Certificates\\certs" folder to the "D:\\docker\\UA Applications\\certs" folder on the gateway. You do not need to restart of the gateway. Repeat this step. You can now connect to the gateway from the cloud, and you are ready to add OPC UA servers to the solution.

### Add your OPC UA servers

1. Browse to the **Connect your own OPC UA Server** page in the connected factory solution portal. Follow the same steps as in the preceding section to establish trust between the connected factory portal and the OPC UA server. This step establishes a mutual trust of the certificates from the connected factory portal and the OPC UA server and creates a connection.

1. Browse the OPC UA nodes tree of your OPC UA server, right-click the OPC nodes, and select **publish**. For publishing to work this way, the OPC UA server and the publisher must be on the same network. In other words, if the fully qualified domain name of the publisher is **publisher.mydomain.com** then the fully qualified domain name of the OPC UA server must be, for example, **myopcuaserver.mydomain.com**. If your setup is different, you can manually add nodes to the publishesnodes.json file found in the D:\\docker folder. The publishesnodes.json is automatically generated on first successful publish of an OPC node.

1. Telemetry now flows from the gateway device. You can view the telemetry in the **Factory Locations** view of the connected factory portal under **New Factory**.

## Linux deployment

> [!NOTE]
> If you don't yet have a gateway device, Microsoft recommends you buy a commercial gateway from one of our partners. Visit the [Azure IoT device catalog] for a list of gateway devices compatible with the connected factory solution. Follow the instructions that come with the device to set up the gateway. Alternatively, use the following instructions to manually set up one of your existing gateways.

[Install Docker] on your Linux gateway device.

### Configure the gateway

1. You need the **iothubowner** connection string of your Azure IoT Suite connected factory deployment to complete the gateway deployment. In the [Azure portal], navigate to your IoT Hub in the resource group created when you deployed the connected factory solution. Click **Shared access policies** to access the **iothubowner** connection string:

    ![Find the IoT Hub connection string][img-hub-connection]

    Copy the **Connection string--primary key** value.

1. Configure the gateway for your IoT Hub by running the two gateway modules **once** from a shell with:

    `sudo docker run -it --rm -h <ApplicationName> -v /shared:/build/src/GatewayApp.NetCore/bin/Debug/netcoreapp1.0/publish/ -v /shared:/root/.dotnet/corefx/cryptography/x509stores microsoft/iot-gateway-opc-ua:1.0.0 <ApplicationName> "<IoTHubOwnerConnectionString>"`

    `sudo docker run --rm -it -v /shared:/mapped microsoft/iot-gateway-opc-ua-proxy:0.1.3 -i -c "<IoTHubOwnerConnectionString>" -D /mapped/cs.db`

    * **&lt;ApplicationName&gt;** is the name of the OPC UA application the gateway creates in the format **publisher.&lt;your fully qualified domain name&gt;**. For example, **publisher.microsoft.com**.
    * **&lt;IoTHubOwnerConnectionString&gt;** is the **iothubowner** connection string you copied in the previous step. This connection string is only used in this step and you don’t need it again.

    The mapped /shared folder (the `-v` argument) is used later to persist the two X.509 certificates used by the gateway modules.

### Run the gateway

1. Restart the gateway using the following commands:

    `sudo docker run -it -h <ApplicationName> --expose 62222 -p 62222:62222 –-rm -v /shared:/build/src/GatewayApp.NetCore/bin/Debug/netcoreapp1.0/publish/Logs -v /shared:/build/src/GatewayApp.NetCore/bin/Debug/netcoreapp1.0/publish/CertificateStores -v /shared:/shared -v /shared:/root/.dotnet/corefx/cryptography/x509stores -e _GW_PNFP="/shared/publishednodes.JSON" microsoft/iot-gateway-opc-ua:1.0.0 <ApplicationName>`

    `sudo docker run -it -v /shared:/mapped microsoft/iot-gateway-opc-ua-proxy:0.1.3 -D /mapped/cs.db`

1. For security reasons, the two X.509 certificates persisted in the /shared folder contain the private key. Access to this folder must be limited to the credentials used to run the Docker container. To set the permissions for **root** only, use the `chmod` shell command on the folder.

1. Verify network connectivity. Try to ping your gateway. From a shell, enter the command `ping publisher.<your fully qualified domain name>`. If the destination is unreachable, add the IP address and name of your gateway to your hosts file on your gateway. The hosts file is located in /etc.

1. Next, try to connect to the publisher using a local OPC UA client running on the gateway. The OPC UA endpoint URL is `opc.tcp://publisher.<your fully qualified domain name>:62222`. If you don't have an OPC UA client, you can download an [open-source OPC UA client].

1. When you have successfully completed these local tests, browse to the **Connect your own OPC UA Server** page in the connected factory solution portal. Enter the publisher endpoint URL (`tcp://publisher.<your fully qualified domain name>:62222`) and click **Connect**. You get a certificate warning, then click **Proceed.** Next you get an error that the publisher doesn’t trust the UA Web Client. To resolve this error, copy the **UA Web Client** certificate from the "/shared/Rejected Certificates/certs" folder to the "/shared/UA Applications/certs" folder on the gateway. You do not need to restart of the gateway. Repeat this step. You can now connect to the gateway from the cloud, and you are ready to add OPC UA servers to the solution.

### Add your OPC UA servers

1. Browse to the **Connect your own OPC UA Server** page in the connected factory solution portal. Follow the same steps as in the preceding section to establish trust between the connected factory portal and the OPC UA server. This step establishes a mutual trust of the certificates from the connected factory portal and the OPC UA server and creates a connection.

1. Browse the OPC UA nodes tree of your OPC UA server, right-click the OPC nodes, and select **publish**. For publishing to work this way, the OPC UA server and the publisher must be on the same network. In other words, if the fully qualified domain name of the publisher is **publisher.mydomain.com** then the fully qualified domain name of the OPC UA server must be, for example, **myopcuaserver.mydomain.com**. If your setup is different, you can manually add nodes to the publishesnodes.json file found in the /shared folder. The publishesnodes.json is automatically generated on first successful publish of an OPC node.

1. Telemetry now flows from the gateway device. You can view the telemetry in the **Factory Locations** view of the connected factory portal under **New Factory**.

## Next steps

To learn more about the architecture of the connected factory preconfigured solution, see [Connected factory preconfigured solution walkthrough][lnk-walkthrough].

[img-install-docker]: ./media/iot-suite-connected-factory-gateway-deployment/image1.png
[img-hub-connection]: ./media/iot-suite-connected-factory-gateway-deployment/image2.png
[img-docker-share]: ./media/iot-suite-connected-factory-gateway-deployment/image3.png

[Docker for Windows]: https://www.docker.com/docker-windows
[Azure IoT device catalog]: https://catalog.azureiotsuite.com/?q=opc
[Azure portal]: http://portal.azure.com/
[open-source OPC UA client]: https://github.com/OPCFoundation/UA-.NETStandardLibrary/tree/master/SampleApplications/Samples/Client.Net4
[Install Docker]: https://www.docker.com/community-edition#/download
[lnk-walkthrough]: iot-suite-connected-factory-sample-walkthrough.md
[Azure IoT Edge]: https://github.com/Azure/iot-edge

[lnk-publisher-github]: https://github.com/Azure/iot-edge-opc-publisher
[lnk-publisher-docker]: https://hub.docker.com/r/microsoft/iot-gateway-opc-ua
[lnk-proxy-github]: https://github.com/Azure/iot-edge-opc-proxy
[lnk-proxy-docker]: https://hub.docker.com/r/microsoft/iot-gateway-opc-ua-proxy