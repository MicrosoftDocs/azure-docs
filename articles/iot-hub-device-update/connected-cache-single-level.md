---
title: Microsoft Connected Cache preview deployment scenario samples | Microsoft Docs
titleSuffix:  Device Update for Azure IoT Hub
description: Microsoft Connected Cache preview deployment scenario samples tutorials
author: andyriv
ms.author: andyriv
ms.date: 2/16/2021
ms.topic: tutorial
ms.service: iot-hub-device-update
---

# Microsoft Connected Cache preview deployment scenario samples

## Single level Azure IoT Edge gateway no proxy

The diagram below describes the scenario where an Azure IoT Edge gateway that has direct access to CDN resources and there is an Azure IoT leaf device such as a Raspberry PI that is an internet isolated child devices of the Azure IoT Edge gateway. 

  :::image type="content" source="media/connected-cache-overview/disconnected-device-update.png" alt-text="Microsoft Connected Cache Disconnected Device Update" lightbox="media/connected-cache-overview/disconnected-device-update.png":::

1. Add the Microsoft Connected Cache module to your Azure IoT Edge gateway device deployment in Azure IoT Hub (see [Support for Disconnected Devices](connected-cache-disconnected-device-update.md) for details on how to get the module).
2. Add the environment variables for the deployment. Below is an example of the environment variables.

    **Environment Variables**
    
    | Name                          | Value                                                                 |
    | ----------------------------- | ----------------------------------------------------------------------| 
    | CACHE_NODE_ID                 | See [environment variable](connected-cache-configure.md) descriptions |
    | CUSTOMER_ID                   | See [environment variable](connected-cache-configure.md) descriptions |
    | CUSTOMER_KEY                  | See [environment variable](connected-cache-configure.md) descriptions |
    | STORAGE_1_SIZE_GB             | 10                                                                    |

3. Add the container create options for the deployment. Below is an example of the container create options.

### Container create options

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

For a validation of properly functioning Microsoft Connected Cache, execute the following command in the terminal of the IoT Edge device hosting the module or any device on the network. Replace \<Azure IoT Edge Gateway IP\> with the IP address or hostname of your IoT Edge gateway. (see environment variable details for information on visibility of this report).

```bash
    wget http://<IoT Edge Gateway IP>/mscomtest/wuidt.gif?cacheHostOrigin=au.download.windowsupdate.com
```

## Single level Azure IoT Edge gateway with outbound unauthenticated proxy

In this scenario there is an Azure IoT Edge Gateway that has access to CDN resources through an outbound unauthenticated proxy. Microsoft Connected Cache is being configured to cache content from a custom repository and the summary report has been made visible to anyone on the network. Below is an example of the MCC environment variables that would be set.

  :::image type="content" source="media/connected-cache-overview/single-level-proxy.png" alt-text="Microsoft Connected Cache Single Level Proxy" lightbox="media/connected-cache-overview/single-level-proxy.png":::

1. Add the Microsoft Connected Cache module to your Azure IoT Edge gateway device deployment in Azure IoT Hub.
2. Add the environment variables for the deployment. Below is an example of the environment variables.

    **Environment Variables**

    | Name                          | Value                                                                 |
    | ----------------------------- | ----------------------------------------------------------------------| 
    | CACHE_NODE_ID                 | See [environment variable](connected-cache-configure.md) descriptions |
    | CUSTOMER_ID                   | See [environment variable](connected-cache-configure.md) descriptions |
    | CUSTOMER_KEY                  | See [environment variable](connected-cache-configure.md) descriptions |
    | STORAGE_1_SIZE_GB             | 10                                                                    |
    | CACHEABLE_CUSTOM_1_HOST       | Packagerepo.com:80                                                    |
    | CACHEABLE_CUSTOM_1_CANONICAL  | Packagerepo.com                                                       |
    | IS_SUMMARY_ACCESS_UNRESTRICTED| true                                                                  |
    | UPSTREAM_PROXY                | Your proxy server IP or FQDN                                          |

3. Add the container create options for the deployment. There is no difference in MCC container create options from the previous example. Below is an example of the container create options.

### Container create options

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

For a validation of properly functioning Microsoft Connected Cache, execute the following command in the terminal of the Azure IoT Edge device hosting the module or any device on the network. Replace \<Azure IoT Edge Gateway IP\> with the IP address or hostname of your IoT Edge gateway. (see environment variable details for information on visibility of this report).

```bash
    wget http://<Azure IoT Edge Gateway IP>/mscomtest/wuidt.gif?cacheHostOrigin=au.download.windowsupdate.com 
```
