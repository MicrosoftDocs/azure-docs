---
title: Microsoft Connected Cache two level nested Azure IoT Edge Gateway with outbound unauthenticated proxy | Microsoft Docs
titleSuffix:  Device Update for Azure IoT Hub
description: Microsoft Connected Cache two level nested Azure IoT Edge Gateway with outbound unauthenticated proxy tutorial
author: andyriv
ms.author: andyriv
ms.date: 2/16/2021
ms.topic: tutorial
ms.service: iot-hub-device-update
---

# Microsoft Connected Cache preview deployment scenario sample: Two level nested Azure IoT Edge Gateway with outbound unauthenticated proxy

Given the diagram below, in this scenario there is an Azure IoT Edge gateway and a downstream Azure IoT Edge device, one Azure IoT Edge gateway parented to another Azure IoT Edge gateway and a proxy server at the IT DMZ. Below is an example of the Microsoft Connected Cache environment variables that would be set in the Azure portal UX for both of the MCC modules deployed to the Azure IoT Edge gateways. The example shown demonstrates the configuration for two-levels of Azure IoT Edge gateways, but there is no limit to the depth of upstream hosts that Microsoft Connected Cache will support. There is no difference in MCC container create options from the previous examples.

Refer to the documentation [Connect downstream IoT Edge devices - Azure IoT Edge](../iot-edge/how-to-connect-downstream-iot-edge-device.md?preserve-view=true&tabs=azure-portal&view=iotedge-2020-11) for more details on configuring layered deployments of Azure IoT Edge gateways. Additionally note that when deploying Azure IoT Edge, Microsoft Connected Cache, and custom modules, all modules must reside in the same container registry.

The diagram below describes the scenario where one Azure IoT Edge gateway as direct access to CDN resources is acting as the parent to another Azure IoT Edge gateway that is acting as the parent to an Azure IoT leaf device such as a Raspberry Pi. Only the Azure IoT Edge gateway parent has internet connectivity to CDN resources and both the Azure IoT Edge child and Azure IoT device are internet isolated. 

  :::image type="content" source="media/connected-cache-overview/nested-level-proxy.png" alt-text="Microsoft Connected Cache Nested" lightbox="media/connected-cache-overview/nested-level-proxy.png":::

## Parent gateway configuration

1. Add the Microsoft Connected Cache module to your Azure IoT Edge gateway device deployment in Azure IoT Hub.
2. Add the environment variables for the deployment. Below is an example of the environment variables.

    **Environment Variables**

    | Name                 | Value                                       |
    | ----------------------------- | --------------------------------------------| 
    | CACHE_NODE_ID                 | See environment variable description above. |
    | CUSTOMER_ID                   | See environment variable description above. |
    | CUSTOMER_KEY                  | See environment variable description above. |
    | STORAGE_*N*_SIZE_GB           | N = 5                                       |
    | CACHEABLE_CUSTOM_1_HOST       | Packagerepo.com:80                          |
    | CACHEABLE_CUSTOM_1_CANONICAL  | Packagerepo.com                             |
    | IS_SUMMARY_ACCESS_UNRESTRICTED| true                                        |
    | UPSTREAM_PROXY                | Proxy server IP or FQDN                     |

3. Add the container create options for the deployment. There is no difference in MCC container create options from the previous example. Below is an example of the container create options.

### Container create options

```markdown
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
```

## Child gateway configuration

>[!Note]
>If you have replicated containers used in your configuration in your own private registry, then there will need to be a modification to the config.toml settings and runtime settings in your module deployment. For more information, refer to [Tutorial - Create a hierarchy of IoT Edge devices - Azure IoT Edge](../iot-edge/tutorial-nested-iot-edge.md?preserve-view=true&tabs=azure-portal&view=iotedge-2020-11#deploy-modules-to-the-lower-layer-device) for more details.

1. Modify the image path for the Edge agent as demonstrated in the example below:

```markdown
[agent]
name = "edgeAgent"
type = "docker"
env = {}
[agent.config]
image = "<parent_device_fqdn_or_ip>:8000/iotedge/azureiotedge-agent:1.2.0-rc2"
auth = {}
```
2. Modify the Edge Hub and Edge agent Runtime Settings in the Azure IoT Edge deployment as demonstrated in this example:
	
    * Under Edge Hub, in the image field, enter ```$upstream:8000/iotedge/azureiotedge-hub:1.2.0-rc2```
    * Under Edge Agent, in the image field, enter ```$upstream:8000/iotedge/azureiotedge-agent:1.2.0-rc2```

3. Add the Microsoft Connected Cache module to your Azure IoT Edge gateway device deployment in Azure IoT Hub.

   * Choose a name for your module: ```ConnectedCache```
   * Modify the Image URI: ```$upstream:8000/mcc/linux/iot/mcc-ubuntu-iot-amd64:latest```

4. Add the same environment variables and container create options used in the parent deployment.

For a validation of properly functioning Microsoft Connected Cache, execute the following command in the terminal of the IoT Edge device hosting the module or any device on the network.

```bash
    wget "http://<CHILD Azure IoT Edge Gateway IP>/mscomtest/wuidt.gif?cacheHostOrigin=au.download.windowsupdate.com
```