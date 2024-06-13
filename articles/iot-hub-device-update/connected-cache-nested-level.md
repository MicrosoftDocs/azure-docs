---
title: Deploy Microsoft Connected Cache on nested gateways
titleSuffix:  Device Update for Azure IoT Hub
description: Microsoft Connected Cache two level nested Azure IoT Edge Gateway with outbound unauthenticated proxy 
author: andyrivMSFT
ms.author: andyriv
ms.date: 04/14/2023
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Deploy the Microsoft Connected Cache module on nested gateways, including in IIoT scenarios (preview)

The Microsoft Connected Cache module supports nested, or hierarchical gateways, in which one or more IoT Edge gateway devices are behind a single gateway that has access to the internet. This article describes a deployment scenario sample that has two nested Azure IoT Edge gateway devices (a *parent gateway* and a *child gateway*) with outbound unauthenticated proxy.

> [!NOTE]
> This information relates to a preview feature that's available for early testing and use in a production environment. This feature is fully supported but it's still in active development and may receive substantial changes until it becomes generally available.

The following diagram describes the scenario where one Azure IoT Edge gateway has direct access to CDN resources and is acting as the parent to another Azure IoT Edge gateway. The child IoT Edge gateway is acting as the parent to an IoT leaf device such as a Raspberry Pi. Both the IoT Edge child gateway and the IoT device are internet isolated. This example demonstrates the configuration for two levels of Azure IoT Edge gateways, but there's no limit to the depth of upstream hosts that Microsoft Connected Cache will support.

:::image type="content" source="media/connected-cache-overview/nested-level-proxy.png" alt-text="Diagram showing Microsoft Connected Cache modules deployed to two nested IoT Edge gateways.":::

Refer to the documentation [Connect downstream IoT Edge devices](../iot-edge/how-to-connect-downstream-iot-edge-device.md) for more details on configuring layered deployments of Azure IoT Edge gateways. Additionally note that when deploying Azure IoT Edge, Microsoft Connected Cache, and custom modules, all modules must reside in the same container registry.

>[!Note]
>When deploying Azure IoT Edge, Microsoft Connected Cache, and custom modules, all modules must reside in the same container registry.

## Parent gateway configuration

Use the following steps to configure the Microsoft Connected Cache module on the parent gateway device.

1. Add the Microsoft Connected Cache module to your Azure IoT Edge gateway device deployment in Azure IoT Hub (see [Support for disconnected devices](connected-cache-disconnected-device-update.md) for details on how to request access to the preview module).
2. Add the environment variables for the deployment. The following table is an example of the environment variables:

   | Name                           | Value              |
   | ----                           | -----              |
   | CACHE_NODE_ID                  | See [environment variable](connected-cache-disconnected-device-update.md#module-environment-variables) descriptions            |
   | CUSTOMER_ID                    | See [environment variable](connected-cache-disconnected-device-update.md#module-environment-variables) descriptions            |
   | CUSTOMER_KEY                   | See [environment variable](connected-cache-disconnected-device-update.md#module-environment-variables) descriptions            |
   | STORAGE_1_SIZE_GB              | 10                 |
   | CACHEABLE_CUSTOM_1_HOST        | Packagerepo.com:80 |
   | CACHEABLE_CUSTOM_1_CANONICAL   | Packagerepo.com    |
   | IS_SUMMARY_ACCESS_UNRESTRICTED | true               |

3. Add the container create options for the deployment. There's no difference in MCC container create options for single or nested gateways. The following example shows the container create options for the MCC module:

   ```json
   {
       "HostConfig": {
           "Binds": [
               "/MicrosoftConnectedCache1/:/nginx/cache1/"
           ],
           "PortBindings": {
               "8081/tcp": [
                   {
                       "HostPort": "80"
                   }
               ],
               "5000/tcp": [
                   {
                       "HostPort": "5100"
                   }
               ]
           }
       }
   }
   ```

## Child gateway configuration

Use the following steps to configure the Microsoft Connected Cache module on the child gateway device.

>[!Note]
>If you have replicated containers used in your configuration in your own private registry, then there will need to be a modification to the config.toml settings and runtime settings in your module deployment. For more information, see [Connect downstream IoT Edge devices](../iot-edge/how-to-connect-downstream-iot-edge-device.md#deploy-modules-to-lower-layer-devices).

1. Modify the image path for the IoT Edge agent as demonstrated in the example below:

   ```markdown
   [agent]
   name = "edgeAgent"
   type = "docker"
   env = {}
   [agent.config]
   image = "<parent_device_fqdn_or_ip>:8000/iotedge/azureiotedge-agent:1.2.0-rc2"
   auth = {}
   ```

2. Modify the IoT Edge hub and agent runtime settings in the IoT Edge deployment as demonstrated in this example:

   * For the IoT Edge hub image, enter `$upstream:8000/iotedge/azureiotedge-hub:1.2.0-rc2`
   * For the IoT Edge agent image, enter `$upstream:8000/iotedge/azureiotedge-agent:1.2.0-rc2`

3. Add the Microsoft Connected Cache module to your Azure IoT Edge gateway device deployment in Azure IoT Hub.

   * Choose a name for your module: `ConnectedCache`
   * Modify the image URI: `$upstream:8000/mcc/linux/iot/mcc-ubuntu-iot-amd64:latest`

4. Add the same set of environment variables and container create options used in the parent deployment.

   >[!Note]
   >The CACHE_NODE_ID should be unique.  The CUSTOMER_ID and CUSTOMER_KEY values will be identical to the parent. For more information, see [Module environment variables](connected-cache-disconnected-device-update.md#module-environment-variables).

For a validation of properly functioning Microsoft Connected Cache, execute the following command in the terminal of the IoT Edge device hosting the module or any device on the network. Replace \<Azure IoT Edge Gateway IP\> with the IP address or hostname of your IoT Edge gateway. For information on the visibility of this report, see [Microsoft Connected Cache summary report](./connected-cache-disconnected-device-update.md#microsoft-connected-cache-summary-report).

```bash
wget http://<CHILD Azure IoT Edge Gateway IP>/mscomtest/wuidt.gif?cacheHostOrigin=au.download.windowsupdate.com
```

## Industrial IoT (IIoT) configuration

Manufacturing networks are often organized in hierarchical layers following the [Purdue network model](https://en.wikipedia.org/wiki/Purdue_Enterprise_Reference_Architecture) (included in the [ISA 95](https://en.wikipedia.org/wiki/ANSI/ISA-95) and [ISA 99](https://www.isa.org/standards-and-publications/isa-standards/isa-standards-committees/isa99) standards). In these networks, only the top layer has connectivity to the cloud and the lower layers in the hierarchy can only communicate with adjacent north and south layers.

This GitHub sample, [Azure IoT Edge for Industrial IoT](https://github.com/Azure-Samples/iot-edge-for-iiot), deploys the following components:

* Simulated Purdue network in Azure
* Industrial assets
* Hierarchy of Azure IoT Edge gateways
  
These components will be used to acquire industrial data and securely upload it to the cloud without compromising the security of the network. Microsoft Connected Cache can be deployed to support the download of content at all levels within the ISA 95 compliant network.

The key to configuring Microsoft Connected Cache deployments within an ISA 95 compliant network is configuring both the OT proxy *and* the upstream host at the L3 IoT Edge gateway.

1. Configure Microsoft Connected Cache deployments at the L5 and L4 levels as described in the Two-Level Nested IoT Edge gateway sample
2. The deployment at the L3 IoT Edge gateway must specify:

   * UPSTREAM_HOST - The IP/FQDN of the L4 IoT Edge gateway, which the L3 Microsoft Connected Cache will request content.
   * UPSTREAM_PROXY - The IP/FQDN:PORT of the OT proxy server.

3. The OT proxy must add the L4 MCC FQDN/IP address to the allowlist.

To validate that Microsoft Connected Cache is functioning properly, execute the following command in the terminal of the IoT Edge device hosting the module, or any device on the network. Replace \<Azure IoT Edge Gateway IP\> with the IP address or hostname of your IoT Edge gateway. For information on the visibility of this report, see [Microsoft Connected Cache summary report](./connected-cache-disconnected-device-update.md#microsoft-connected-cache-summary-report).

```bash
wget http://<L3 IoT Edge Gateway IP>/mscomtest/wuidt.gif?cacheHostOrigin=au.download.windowsupdate.com
```
