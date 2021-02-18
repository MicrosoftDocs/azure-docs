---
title: Microsoft Connected Cache two level nested IoT Edge Gateway with outbound unauthenticated proxy | Microsoft Docs
description: Microsoft Connected Cache two level nested IoT Edge Gateway with outbound unauthenticated proxy tutorial
author: andyriv
ms.author: andyriv
ms.date: 2/16/2021
ms.topic: tutorial
ms.service: iot-hub-device-update
---

# Microsoft Connected Cache Preview Deployment Scenario Sample: Two Level Nested IoT Edge Gateway With Outbound Unauthenticated Proxy

Given the diagram below, in this scenario there is an IoT Edge gateway and a downstream IoT Edge device, one IoT Edge gateway parented to another IoT Edge gateway and a proxy server at the IT DMZ. Below is an example of the Microsoft Connected Cache environment variables that would be set in the Azure portal UX for both of the MCC modules deployed to the IoT Edge gateways. The example shown demonstrates the configuration for two-levels of IoT Edge gateways, but there is no limit to the depth of upstream hosts that Microsoft Connected Cache will support. There is no difference in MCC container create options from the previous examples.

Refer to the documentation [Connect downstream IoT Edge devices - Azure IoT Edge](https://docs.microsoft.com/azure/iot-edge/how-to-connect-downstream-iot-edge-device?view=iotedge-2020-11&tabs=azure-portal&preserve-view=true) for more details on configuring layered deployments of IoT Edge gateways. Additionally note that when deploying IoT Edge, Microsoft Connected Cache, and custom modules, all modules must reside in the same container registry.

The diagram below describes the scenario where one IoT Edge gateway as direct access to CDN resources is acting as the parent to another IoT Edge gateway that is acting as the parent to an IoT leaf device such as a Raspberry Pi. Only the IoT Edge gateway parent has internet connectivity to CDN resources and both the IoT Edge child and IoT device are internet isolated. 

  :::image type="content" source="media/connected-cache-overview/nested-level-proxy.png" alt-text="Microsoft Connected Cache Nested" lightbox="media/connected-cache-overview/nested-level-proxy.png":::

## Parent Gateway Configuration

1. Add the Microsoft Connected Cache module to your IoT Edge gateway device deployment in IoT Hub (see <link>MCC concepts</link> for details on how to get the module).
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

### Container Create Options

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

## Child Gateway Configuration

>[!Note]
>If you have replicated containers used in your configuration in your own private registry, then there will need to be a modification to the config.yaml settings and runtime settings in your module deployment. For more information, refer to [Tutorial - Create a hierarchy of IoT Edge devices - Azure IoT Edge](https://docs.microsoft.com/azure/iot-edge/tutorial-nested-iot-edge?view=iotedge-2020-11&tabs=azure-portal#deploy-modules-to-the-lower-layer-device&preserve-view=true) for more details.

1. Modify the image path for the Edge agent as demonstrated in the example below:

```markdown
agent:
  name: "edgeAgent"
  type: "docker"
  env: {}
  config:
    image: "<parent_device_fqdn_or_ip>:8000/iotedge/azureiotedge-agent:1.2.0-rc2"
    auth: {}
```
2. Modify the Edge Hub and Edge agent Runtime Settings in the IoT Edge deployment as demonstrated in this example:
	
    * Under Edge Hub, in the image field, enter ```$upstream:8000/iotedge/azureiotedge-hub:1.2.0-rc2```
    * Under Edge Agent, in the image field, enter ```$upstream:8000/iotedge/azureiotedge-agent:1.2.0-rc2```

3. Add the Microsoft Connected Cache module to your IoT Edge gateway device deployment in IoT Hub (see <link>MCC concepts</link> for details on how to get the module).

   * Choose a name for your module: ```ConnectedCache```
   * Modify the Image URI: ```$upstream:8000/mcc/linux/iot/mcc-ubuntu-iot-amd64:latest```

4. Add the same environment variables and container create options used in the parent deployment.

For a validation of properly functioning Microsoft Connected Cache, execute the following command in the terminal of the IoT Edge device hosting the module or any device on the network.

```bash
    wget "http://<CHILD IoT Edge Gateway IP>/mscomtest/wuidt.gif?cacheHostOrigin=au.download.windowsupdate.com
```