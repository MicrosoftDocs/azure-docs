---
title: Configure API proxy module - Azure IoT Edge | Microsoft Docs
description: Learn how to customize the API proxy module for IoT Edge gateway hierarchies.
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 10/27/2020
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
ms.custom:  [amqp, mqtt]
monikerRange: '>= iotedge-1.2'
---

# Configure the API proxy module for your gateway hierarchy scenario

The API proxy module enables IoT Edge devices to send HTTP requests through gateways instead of making direct connections to cloud services. This article walks through the configuration options so that you can customize the module to support your gateway hierarchy requirements.

In some network architectures, IoT Edge devices behind gateways don't have direct access to the cloud. Any modules that attempt to connect to cloud services will fail. The API proxy module supports downstream IoT Edge devices in this configuration by re-routing module connections to go through the layers of a gateway hierarchy, instead. It provides a secure way for clients to communicate to multiple services over HTTPS without tunneling, but by terminating the connections at each layer. The API proxy module acts as a proxy module between the IoT Edge devices in a gateway hierarchy until they reach the IoT Edge device at the top layer. At that point, services running on the top layer IoT Edge device handle these requests, and the API proxy module proxies all the HTTP traffic from local services to the cloud through a single port.

The API proxy module can enable many scenarios for gateway hierarchies, including allowing lower layer devices to pull container images or push blobs to storage. The configuration of the proxy rules defines how data is routed. This article discusses several common configuration options.

## Deploy the proxy module

The API proxy module is available from the Microsoft Container Registry (MCR): `mcr.microsoft.com/azureiotedge-api-proxy:latest`.

You can also deploy the API proxy module directly from the Azure Marketplace.

<!--TODO: Add marketplace link when availabile-->

## Understand the proxy module

The API proxy module leverages an nginx reverse proxy to route data through network layers. A proxy is embedded in the module, which means that the module image needs to support the proxy configuration. For example, if the proxy is listening on a certain port then the module needs to have that port open.

The proxy starts with a default configuration file embedded in the module. You can pass a new configuration to the module from the cloud using its [module twin](../iot-hub/iot-hub-devguide-module-twins.md). Additionally, you can use environment variables to turn configuration settings on or off at deployment time.

This article focuses first on the default configuration file, and how to use environment variables to enable its settings. Then, we discuss customizing the configuration file at the end.

### Default configuration

The API proxy module comes with a default configuration that supports common scenarios and allows for customization. You can control the default configuration through environment variables of the module.

Currently, the default environment variables include:

| Environment variable | Description |
| -------------------- | ----------- |
| `PROXY_CONFIG_ENV_VAR_LIST` | List all the variables that you intend to update in a comma-separated list. This step prevents accidentally modifying the wrong configuration settings.
| `NGINX_DEFAULT_PORT` | Changes the port that the nginx proxy listens to. If you update this environment variable, make sure the port you select is also exposed in the module dockerfile.<br><br>Default is 443. |
| `DOCKER_REQUEST_ROUTE_ADDRESS` | Address to route docker requests. Modify this variable on the top layer device to point to the registry module.<br><br>Default is the parent hostname. |
| `BLOB_UPLOAD_ROUTE_ADDRESS` | Address to route blob registry requests. Modify this variable on the top layer device to point to the blob storage module.<br><br>Default is the parent hostname. |
| `ROUTE_EDGEHUB_TRAFFIC` | A binary flag that determines whether traffic to the edgeHub module is routed through the API proxy module.<br><br>Default is `false`.|

## Enable container image download

A common use case for the API proxy module is to enable IoT Edge devices in lower layers to pull container images. This scenario uses the [Docker registry module](https://hub.docker.com/_/registry) to retrieve container images from the cloud and cache them at the top layer. The API proxy relays all HTTPS requests to download a container image from the lower layers to be served by the registry module in the top layer.

This scenario requires that downstream IoT Edge devices point to the domain name `$upstream` followed by the API Proxy module port number instead of the container registry of an image. For example: `$upstream:8000/azureiotedge-api-proxy:1.0`.

This use case is demonstrated in the tutorial [Create a hierarchy of IoT Edge devices using gateways](tutorial-nested-iot-edge.md).

Configure the following modules at the **top layer**:

* A Docker registry module
  * Configure the module with a memorable name like *registry* and expose a port in the module to receive requests.
  * Configure the module to map to your container registry.
* An API proxy module
  * Configure the following environment variables:

    | Name | Value |
    | ---- | ----- |
    | `DOCKER_REQUEST_ROUTE_ADDRESS` | The registry module name and open port. For example, `registry:5000`. |
    | `NGINX_DEFAULT_PORT` | The port that the nginx proxy listens on for requests from downstream devices. For example, `8000`. |

  * Configure the following createOptions:

    ```json
    {
       "HostConfig": {
          "PortBindings": {
             "8000/tcp": [
                {
                   "HostPort": "8000"
                }
             ]
          }
       }
    }
    ```

Configure the following module on any **lower layer** for this scenario:

* An API proxy module
  * Configure the following environment variables:

    | Name | Value |
    | ---- | ----- |
    | `NGINX_DEFAULT_PORT` | The port that the nginx proxy listens on for requests from downstream devices. For example, `8000`. |

  * Configure the following createOptions:

    ```json
    {
       "HostConfig": {
          "PortBindings": {
             "8000/tcp": [
                {
                   "HostPort": "8000"
                }
             ]
          }
       }
    }
    ```  

## Enable blob upload

Another use case for the API proxy module is to enable IoT Edge devices in lower layers to upload blobs. This use case enables troubleshooting functionality on lower layer devices like uploading module logs or uploading the support bundle.

This scenario uses the [Azure Blob Storage on IoT Edge](https://azuremarketplace.microsoft.com/marketplace/apps/azure-blob-storage.edge-azure-blob-storage) module at the top layer to handle blob creation and upload.

Configure the following modules at the **top layer**:

* An Azure Blob Storage on IoT Edge module.
* An API proxy module
  * Configure the following environment variables:

    | Name | Value |
    | ---- | ----- |
    | `BLOB_UPLOAD_ROUTE_ADDRESS` | The blob storage module name and open port. For example, `azureblobstorageoniotedge:1102`. |
    | `NGINX_DEFAULT_PORT` | The port that the nginx proxy listens on for requests from downstream devices. For example, `8000`. |

  * Configure the following createOptions:

    ```json
    {
       "HostConfig": {
          "PortBindings": {
             "8000/tcp": [
                {
                   "HostPort": "8000"
                }
             ]
          }
       }
    }
    ```

Configure the following module on any **lower layer** for this scenario:

* An API proxy module
  * Configure the following environment variables:

    | Name | Value |
    | ---- | ----- |
    | `NGINX_DEFAULT_PORT` | The port that the nginx proxy listens on for requests from downstream devices. For example, `8000`. |

  * Configure the following createOptions:

    ```json
    {
       "HostConfig": {
          "PortBindings": {
             "8000/tcp": [
                {
                   "HostPort": "8000"
                }
             ]
          }
       }
    }
    ```

Use the following steps to upload the support bundle or log file to the blob storage module located at the top layer:

1. Create a blob container, using either Azure Storage Explorer or the REST APIs. For more information, see [Store data at the edge with Azure Blob Storage on IoT Edge](how-to-store-data-blob.md).
1. Request a log or support bundle upload according to the steps in [Retrieve logs from IoT Edge deployments](how-to-retrieve-iot-edge-logs.md), but use the domain name `$upstream` and the open proxy port in place of the blob storage module address. For example:

   ```json
   {
      "schemaVersion": "1.0",
      "sasUrl": "https://$upstream:8000/myBlobStorageName/myContainerName?SAS_key",
      "since": "2d",
      "until": "1d",
      "edgeRuntimeOnly": false
   }
   ```

## Minimize open ports

By default, the edgeHub module uses port 443 and the API proxy module uses port 8000. If you want to minimize the number of open ports, configure the API proxy module to relay all HTTPS traffic (port 443) including traffic targeting the edgeHub module.

Configure the following modules for this scenario:

* The edgeHub module

  * To avoid port binding conflicts, modify the edgeHub settings to bind on a port other than 443:

    ```json
    {
      "HostConfig": {
        "PortBindings": {
          "7000/tcp": [
            {
              "HostPort": "7000"
            }
          ],
          "5671/tcp": [
            {
              "HostPort": "5671"
            }
          ],
          "8883/tcp": [
            {
              "HostPort": "8883"
            }
          ]
        }
      }
    }
    ```

* An API proxy module

  * Configure the following environment variables:

    | Name | Value |
    | ---- | ----- |
    | `NGINX_DEFAULT_PORT` | The port that the nginx proxy listens on for requests from downstream devices. Set to `443` to handle HTTPS traffic. |
    | `ROUTE_EDGEHUB_TRAFFIC` | `true` |

  * Configure the following createOptions:

    ```json
    {
       "HostConfig": {
          "PortBindings": {
             "443/tcp": [
                {
                   "HostPort": "443"
                }
             ]
          }
       }
    }
    ```

## Edit the proxy configuration

A default configuration file is embedded in the API proxy module, but you can pass a new configuration to the module via the cloud using the module twin.

When you write your own configuration, you can still use environment to adjust settings per deployment. Use the following syntax:

* Use `${MY_ENVIRONMENT_VARIABLE}` to retrieve the value of an environment variable.
* Use conditional statements to turn settings on or off based on the value of an environment variable:

   ```conf
   #if_tag ${MY_ENVIRONMENT_VARIABLE}
       statement to execute if environment variable evaluates to 1
   #endif_tag ${MY_ENVIRONMENT_VARIABLE}

   #if_tag !${MY_ENVIRONMENT_VARIABLE}
       statement to execute if environment variable evaluates to 0
   #endif_tag !${MY_ENVIRONMENT_VARIABLE}
   ```

When the API proxy module parses a proxy configuration, it first replaces all environment variables listed in the `PROXY_CONFIG_ENV_VAR_LIST` with their provided values using substitution. Then, everything between an `#if_tag` and `#endif_tag` pair is replaced. The module then provides the parsed configuration to the nginx reverse proxy.

To update the proxy configuration dynamically, use the following steps:

1. Write your configuration file. You can use this default template as a reference: [nginx_default_config.conf](hhttps://github.com/Azure/iotedge/blob/master/edge-modules/api-proxy-module/templates/nginx_default_config.conf)
1. Copy the text of the configuration file and convert it to base64.
1. Paste the encoded configuration file as the value of the `proxy_config` desired property in the module twin.

   ![Paste encoded config file as value of proxy_config property](./media/how-to-configure-api-module/change-config.png)

## Next steps

Use the API proxy module to [Connect a downstream IoT Edge device to an Azure IoT Edge gateway](how-to-connect-downstream-iot-edge-device.md)