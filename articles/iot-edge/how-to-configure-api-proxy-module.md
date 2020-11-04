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

The API proxy module enables IoT Edge devices to function behind gateways. This article walks through the configuration options so that you can customize the module to support your gateway hierarchy requirements.

IoT Edge devices behind gateways don't have direct access to the cloud. Any modules that attempt to connect to cloud services will fail. The API proxy module re-routes those connections to go through the layers of a gateway hierarchy, instead. It provides a secure way for clients to communicate to multiple services over HTTPS without tunneling, but by terminating the connections at each layer. The API proxy module acts as a proxy module between the IoT Edge devices in a gateway hierarchy until they reach the IoT Edge device at the top layer. At that point, services running on the top layer IoT Edge device should handle requests, rather than having those requests sent directly to the cloud.

The API proxy module can enable many scenarios for gateway hierarchies, including allowing lower layer devices to pull container images or push blobs to storage. The configuration of the proxy rules defines how data is routed. This article discusses several common configuration options.

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
| `IOTEDGE_PARENTHOSTNAME` | The hostname of the parent device. |

## Enable container image download

A common use case for the API proxy module is to enable IoT Edge devices in lower layers to pull container images. This scenario uses the [Docker registry module](https://hub.docker.com/_/registry) to retrieve container images from the cloud and cache them at the top layer. The API proxy relays all HTTPS requests to download a container image from the lower layers to be served by the registry module in the top layer.

This scenario requires that downstream IoT Edge devices point to the domain name `$upstream` followed by the API Proxy module port number instead of the container registry of an image. For example: `$upstream:8000/azureiotedge-api-proxy:1.0`.

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

## Next steps

Use the API proxy module to [Connect a downstream IoT Edge device to an Azure IoT Edge gateway](how-to-connect-downstream-iot-edge-device.md)