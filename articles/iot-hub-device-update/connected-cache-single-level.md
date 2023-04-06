---
title: Deploy Microsoft Connected Cache on a gateway
titleSuffix:  Device Update for Azure IoT Hub
description: Update disconnected devices with Device Update using the Microsoft Connected Cache module on IoT Edge gateways
author: andyriv
ms.author: andyriv
ms.date: 2/16/2021
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Deploy the Microsoft Connected Cache module on a single gateway (preview)

The Microsoft Connected Cache (MCC) module for IoT Edge gateways enables Device Update for disconnected devices behind the gateway. This article introduces two different configurations for deploying the MCC module on an IoT Edge gateway.

If you have multiple IoT Edge gateways chained together, refer to the instructions in [Deploy the Microsoft Connected Cache module on nested gateways](./connected-cache-nested-level.md).

> [!NOTE]
> This information relates to a preview feature that's available for early testing and use in a production environment. This feature is fully supported but it's still in active development and may receive substantial changes until it becomes generally available.

## Deploy to a gateway with no proxy

The following diagram describes the scenario where an Azure IoT Edge gateway has direct access to CDN resources, and has the Microsoft Connected Cache module deployed on it. Behind the gateway, there is an IoT leaf device such as a Raspberry PI that is an internet isolated child device of the IoT Edge gateway.

:::image type="content" source="media/connected-cache-overview/disconnected-device-update.png" alt-text="Diagram that shows the Microsoft Connected Cache module on a gateway." lightbox="media/connected-cache-overview/disconnected-device-update.png":::

1. Add the Microsoft Connected Cache module to your Azure IoT Edge gateway device deployment in Azure IoT Hub (see [Support for Disconnected Devices](connected-cache-disconnected-device-update.md) for details on how to get the module).
2. Add the environment variables for the deployment. The following table is an example of the environment variables:

   | Name              | Value                   |
   | ----------------- | ----------------------- |
   | CACHE_NODE_ID     | See [environment variable](connected-cache-disconnected-device-update.md#module-environment-variables) descriptions |
   | CUSTOMER_ID       | See [environment variable](connected-cache-disconnected-device-update.md#module-environment-variables) descriptions |
   | CUSTOMER_KEY      | See [environment variable](connected-cache-disconnected-device-update.md#module-environment-variables) descriptions |
   | STORAGE_1_SIZE_GB | 10                      |

3. Add the container create options for the deployment. For example:

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

## Deploy to a gateway with outbound unauthenticated proxy

In this scenario there is an Azure IoT Edge Gateway that has access to CDN resources through an outbound unauthenticated proxy. Microsoft Connected Cache is being configured to cache content from a custom repository and the summary report has been made visible to anyone on the network. This section provides an example of the MCC environment variables to support an outbound unauthenticated proxy.

:::image type="content" source="media/connected-cache-overview/single-level-proxy.png" alt-text="Diagram that shows the Microsoft Connected Cache module on a gateway behind a proxy." lightbox="media/connected-cache-overview/single-level-proxy.png":::

1. Add the Microsoft Connected Cache module to your Azure IoT Edge gateway device deployment in Azure IoT Hub.
2. Add the environment variables for the deployment. Below is an example of the environment variables.

   | Name                          | Value                        |
   | ----------------------------- | ---------------------------- |
   | CACHE_NODE_ID                 | See [environment variable](connected-cache-disconnected-device-update.md#module-environment-variables) descriptions |
   | CUSTOMER_ID                   | See [environment variable](connected-cache-disconnected-device-update.md#module-environment-variables) descriptions |
   | CUSTOMER_KEY                  | See [environment variable](connected-cache-disconnected-device-update.md#module-environment-variables) descriptions |
   | STORAGE_1_SIZE_GB             | 10                           |
   | CACHEABLE_CUSTOM_1_HOST       | Packagerepo.com:80           |
   | CACHEABLE_CUSTOM_1_CANONICAL  | Packagerepo.com              |
   | IS_SUMMARY_ACCESS_UNRESTRICTED| true                         |
   | UPSTREAM_PROXY                | Your proxy server IP or FQDN |

3. Add the container create options for the deployment. For example:

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
