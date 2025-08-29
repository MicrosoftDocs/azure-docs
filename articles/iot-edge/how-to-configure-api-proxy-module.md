---
title: Configure API proxy module
titlesuffix: Azure IoT Edge
description: Learn how to customize the API proxy module for IoT Edge gateway hierarchies.
author: sethmanheim
ms.author: sethm
ms.date: 07/11/2025
ms.topic: concept-article
ms.service: azure-iot-edge
services: iot-edge
ms.custom:  [amqp, mqtt]
---

# Configure the API proxy module for your gateway hierarchy scenario

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

This article describes the configuration options for the API proxy module, so you can customize the module to support your gateway hierarchy requirements.

The API proxy module simplifies communication for IoT Edge devices when multiple services use the HTTPS protocol and bind to port 443. This setup is especially relevant in hierarchical deployments of IoT Edge devices in ISA-95-based network isolated architectures, like those described in [Network isolate downstream devices](how-to-connect-downstream-iot-edge-device.md#network-isolate-downstream-devices), because clients on downstream devices can't connect directly to the cloud.

For example, letting downstream IoT Edge devices pull Docker images requires deploying a Docker registry module. Letting devices upload blobs requires deploying an Azure Blob Storage module on the same IoT Edge device. Both services use HTTPS for communication. The API proxy module enables these deployments on an IoT Edge device. Instead of each service binding to port 443, the API proxy module binds to port 443 on the host device and routes requests to the correct service module running on that device based on user-configurable rules. The individual services are still responsible for handling requests, including authenticating and authorizing clients.

Without the API proxy, each service module must bind to a separate port on the host device, which requires a tedious and error-prone configuration change on each child device that connects to the parent IoT Edge device.

>[!NOTE]
>A downstream device sends data directly to the Internet or to gateway devices (IoT Edge-enabled or not). A child device can be a downstream device or a gateway device in a nested topology.

## Deploy the proxy module

The API proxy module is available from the [Microsoft Container Registry (MCR)](https://mcr.microsoft.com/product/azureiotedge-api-proxy/tags), and the image URI is `mcr.microsoft.com/azureiotedge-api-proxy:latest`. Deploy the module using the [Azure portal](how-to-deploy-modules-portal.md) or [Azure CLI](how-to-deploy-modules-cli.md).

## Understand the proxy module

The API proxy module uses an nginx reverse proxy to route data through network layers. The module has an embedded proxy, so the module image needs to support the proxy configuration. For example, if the proxy listens on a certain port, the module needs to have that port open.

The proxy starts with a default configuration file embedded in the module. Pass a new configuration to the module from the cloud using its [module twin](../iot-hub/iot-hub-devguide-module-twins.md). You can also use environment variables to turn configuration settings on or off at deployment time.

This article first covers the default configuration file and how to use environment variables to enable its settings. It then explains how to customize the configuration file.

### Default configuration

The API proxy module comes with a default configuration that supports common scenarios and lets you customize it. Control the default configuration through the module's environment variables.

Currently, the default environment variables include:

| Environment variable | Description |
| -------------------- | ----------- |
| `PROXY_CONFIG_ENV_VAR_LIST` | List all the variables you want to update in a comma-separated list. This step helps prevent accidentally changing the wrong configuration settings. |
| `NGINX_DEFAULT_TLS` | Sets the list of TLS protocols to enable. See NGINX's [ssl_protocols](https://nginx.org/docs/http/ngx_http_ssl_module.html#ssl_protocols).<br><br>Default is 'TLSv1.2'. |
| `NGINX_DEFAULT_PORT` | Changes the port that the nginx proxy listens on. If you update this environment variable, expose the port in the module dockerfile and declare the port binding in the deployment manifest. For more information, see [Expose proxy port](#expose-proxy-port).<br><br>Default is 443.<br><br>When deployed from the Azure Marketplace, the default port changes to 8000 to prevent conflicts with the edgeHub module. For more information, see [Minimize open ports](#minimize-open-ports). |
| `DOCKER_REQUEST_ROUTE_ADDRESS` | Address to route docker requests. Modify this variable on the top layer device to point to the registry module.<br><br>Default is the parent hostname. |
| `BLOB_UPLOAD_ROUTE_ADDRESS` | Address to route blob registry requests. Modify this variable on the top layer device to point to the blob storage module.<br><br>Default is the parent hostname. |

## Minimize open ports

To minimize open ports, set the API proxy module to relay all HTTPS traffic (port 443), including traffic for the edgeHub module. By default, the API proxy module reroutes all edgeHub traffic on port 443.

Follow these steps to set up your deployment to minimize open ports:

1. Update the edgeHub module settings so it doesn't bind to port 443. Otherwise, you get port binding conflicts. By default, the edgeHub module binds to ports 443, 5671, and 8883. Delete the port 443 binding and leave the other two in place:

   ```json
   {
     "HostConfig": {
       "PortBindings": {
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

1. Configure the API proxy module to bind on port 443.

   1. Set the value of the **NGINX_DEFAULT_PORT** environment variable to `443`.
   1. Update the container create options to bind to port 443.

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

If you don't need to minimize open ports, let the edgeHub module use port 443 and configure the API proxy module to listen on another port. For example, configure the **NGINX_DEFAULT_PORT** environment variable to `8000` and create a port binding for port 8000.

## Enable container image download

A common use case for the API proxy module is to let IoT Edge devices in lower layers pull container images. This scenario uses the [Docker registry module](https://hub.docker.com/_/registry) to get container images from the cloud and cache them at the top layer. The API proxy relays all HTTPS requests to download a container image from the lower layers to the registry module in the top layer.

In this scenario, downstream IoT Edge devices point to the domain name `$upstream` followed by the API proxy module port number instead of the container registry of an image. For example, `$upstream:8000/azureiotedge-api-proxy:1.1`.

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

* API proxy module. The API proxy module is required on all lower layer devices except the bottom layer device.
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

## Expose proxy port

Port 8000 is exposed by default from the Docker image. If you use a different nginx proxy port, add the **ExposedPorts** section to declare the port in the deployment manifest. For example, if you change the nginx proxy port to 8001, add the following to the deployment manifest:

```json
{
   "ExposedPorts": {
      "8001/tcp": {}
   },
   "HostConfig": {
      "PortBindings": {
            "8001/tcp": [
               {
                  "HostPort": "8001"
               }
            ]
      }
   }
}
```

## Enable blob upload

Another use case for the API proxy module is letting IoT Edge devices in lower layers upload blobs. This use case lets you troubleshoot lower layer devices, like uploading module logs or the support bundle.

This scenario uses the [Azure Blob Storage on IoT Edge](https://hub.docker.com/r/microsoft/azure-blob-storage) module at the top layer to handle blob creation and upload. In a nested scenario, up to five layers are supported. The *Azure Blob Storage on IoT Edge* module is required on the top layer device, but it's optional for lower layer devices. For a sample multi-layer deployment, see the [Azure IoT Edge for Industrial IoT](https://github.com/Azure-Samples/iot-edge-for-iiot) sample.

Configure the following modules at the **top layer**:

* An Azure Blob Storage on IoT Edge module.
* An API proxy module
  * Configure the following environment variables:

    | Name | Value |
    | ---- | ----- |
    | `BLOB_UPLOAD_ROUTE_ADDRESS` | The blob storage module name and open port. For example, `azureblobstorageoniotedge:11002`. |
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

Follow these steps to upload the support bundle or log file to the blob storage module at the top layer:

1. Create a blob container using Azure Storage Explorer or the REST APIs. For more information, see [Store data at the edge with Azure Blob Storage on IoT Edge](how-to-store-data-blob.md).
1. Request a log or support bundle upload by following the steps in [Retrieve logs from IoT Edge deployments](how-to-retrieve-iot-edge-logs.md), but use the domain name `$upstream` and the open proxy port instead of the blob storage module address. For example:

   ```json
   {
      "schemaVersion": "1.0",
      "sasUrl": "https://$upstream:8000/myBlobStorageName/myContainerName?SAS_key",
      "since": "2d",
      "until": "1d",
      "edgeRuntimeOnly": false
   }
   ```

## Edit the proxy configuration

A default configuration file is embedded in the API proxy module, but you can pass a new configuration to the module through the cloud by using the module twin.

When you write your own configuration, you can still use environment variables to adjust settings for each deployment. Use the following syntax:

* Use `${MY_ENVIRONMENT_VARIABLE}` to get the value of an environment variable.
* Use conditional statements to turn settings on or off based on the value of an environment variable:

   ```conf
   #if_tag ${MY_ENVIRONMENT_VARIABLE}
       statement to execute if environment variable evaluates to 1
   #endif_tag ${MY_ENVIRONMENT_VARIABLE}

   #if_tag !${MY_ENVIRONMENT_VARIABLE}
       statement to execute if environment variable evaluates to 0
   #endif_tag !${MY_ENVIRONMENT_VARIABLE}
   ```

When the API proxy module parses a proxy configuration, it first replaces all environment variables listed in the `PROXY_CONFIG_ENV_VAR_LIST` with their values by using substitution. Then, it replaces everything between an `#if_tag` and `#endif_tag` pair. The module then provides the parsed configuration to the nginx reverse proxy.

To update the proxy configuration dynamically, follow these steps:

1. Write your configuration file. Use this default template as a reference: [nginx_default_config.conf](https://github.com/Azure/iotedge/blob/main/edge-modules/api-proxy-module/templates/nginx_default_config.conf).
1. Copy the text of the configuration file and convert it to base64.
1. Paste the encoded configuration file as the value of the `proxy_config` desired property in the module twin.

   :::image type="content" source="./media/how-to-configure-api-proxy-module/change-config.png" alt-text="Screenshot that shows how to paste encoded config file as value of proxy_config property.":::

## Next steps

Use the API proxy module to [connect a downstream IoT Edge device to an Azure IoT Edge gateway](how-to-connect-downstream-iot-edge-device.md).
