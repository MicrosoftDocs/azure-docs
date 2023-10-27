---
title: Configure API proxy module
titlesuffix: Azure IoT Edge
description: Learn how to customize the API proxy module for IoT Edge gateway hierarchies.
author: PatAltimore

ms.author: patricka
ms.date: 07/06/2023
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
ms.custom:  [amqp, mqtt]
---

# Configure the API proxy module for your gateway hierarchy scenario

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

This article walks through the configuration options for the API proxy module, so you can customize the module to support your gateway hierarchy requirements.

The API proxy module simplifies communication for IoT Edge devices when multiple services are deployed that all support HTTPS protocol and bind to port 443. This is especially relevant in hierarchical deployments of IoT Edge devices in ISA-95-based network-isolated architectures like those described in [Network isolate downstream devices](how-to-connect-downstream-iot-edge-device.md#network-isolate-downstream-devices) because the clients on the downstream devices can't connect directly to the cloud.

For example, to allow downstream IoT Edge devices to pull Docker images requires deploying a Docker registry module. To allow uploading blobs requires deploying an Azure Blob Storage module on the same IoT Edge device. Both these services use HTTPS for communication. The API proxy enables such deployments on an IoT Edge device. Instead of each service, the API proxy module binds to port 443 on the host device and routes the request to the correct service module running on that device per user-configurable rules. The individual services are still responsible for handling the requests, including authenticating and authorizing the clients.

Without the API proxy, each service module would have to bind to a separate port on the host device, requiring a tedious and error-prone configuration change on each child device that connects to the parent IoT Edge device.

>[!NOTE]
>A downstream device emits data directly to the Internet or to gateway devices (IoT Edge-enabled or not). A child device can be a downstream device or a gateway device in a nested topology.

## Deploy the proxy module

The API proxy module is available from the Microsoft Container Registry (MCR): `mcr.microsoft.com/azureiotedge-api-proxy:1.1`.

You can also deploy the API proxy module directly from the Azure Marketplace: [IoT Edge API Proxy](https://azuremarketplace.microsoft.com/marketplace/apps/azure-iot.azureiotedge-api-proxy?tab=Overview).

## Understand the proxy module

The API proxy module leverages an nginx reverse proxy to route data through network layers. A proxy is embedded in the module, which means that the module image needs to support the proxy configuration. For example, if the proxy is listening on a certain port then the module needs to have that port open.

The proxy starts with a default configuration file embedded in the module. You can pass a new configuration to the module from the cloud using its [module twin](../iot-hub/iot-hub-devguide-module-twins.md). Additionally, you can use environment variables to turn configuration settings on or off at deployment time.

This article focuses first on the default configuration file, and how to use environment variables to enable its settings. Then, we discuss customizing the configuration file at the end.

### Default configuration

The API proxy module comes with a default configuration that supports common scenarios and allows for customization. You can control the default configuration through environment variables of the module.

Currently, the default environment variables include:

| Environment variable | Description |
| -------------------- | ----------- |
| `PROXY_CONFIG_ENV_VAR_LIST` | List all the variables that you intend to update in a comma-separated list. This step prevents accidentally modifying the wrong configuration settings. |
| `NGINX_DEFAULT_TLS` | Specifies the list of TLS protocols to be enabled. See NGINX's [ssl_protocols](https://nginx.org/docs/http/ngx_http_ssl_module.html#ssl_protocols).<br><br>Default is 'TLSv1.2'. |
| `NGINX_DEFAULT_PORT` | Changes the port that the nginx proxy listens to. If you update this environment variable, you must expose the port in the module dockerfile and declare the port binding in the deployment manifest. For more information, see [Expose proxy port](#expose-proxy-port).<br><br>Default is 443.<br><br>When deployed from the Azure Marketplace, the default port is updated to 8000, to prevent conflicts with the edgeHub module. For more information, see [Minimize open ports](#minimize-open-ports). |
| `DOCKER_REQUEST_ROUTE_ADDRESS` | Address to route docker requests. Modify this variable on the top layer device to point to the registry module.<br><br>Default is the parent hostname. |
| `BLOB_UPLOAD_ROUTE_ADDRESS` | Address to route blob registry requests. Modify this variable on the top layer device to point to the blob storage module.<br><br>Default is the parent hostname. |

## Minimize open ports

To minimize the number of open ports, the API proxy module should relay all HTTPS traffic (port 443), including traffic targeting the edgeHub module. The API proxy module is configured by default to re-route all edgeHub traffic on port 443.

Use the following steps to configure your deployment to minimize open ports:

1. Update the edgeHub module settings to not bind on port 443, otherwise there will be port binding conflicts. By default, the edgeHub module binds on ports 443, 5671, and 8883. Delete the port 443 binding and leave the other two in place:

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

   1. Set value of the **NGINX_DEFAULT_PORT** environment variable to `443`.
   1. Update the container create options to bind on port 443.

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

If you don't need to minimize open ports, then you can let the edgeHub module use port 443 and configure the API proxy module to listen on another port. For example, the API proxy module can listen on port 8000 by setting the value of the **NGINX_DEFAULT_PORT** environment variable to `8000` and creating a port binding for port 8000.

## Enable container image download

A common use case for the API proxy module is to enable IoT Edge devices in lower layers to pull container images. This scenario uses the [Docker registry module](https://hub.docker.com/_/registry) to retrieve container images from the cloud and cache them at the top layer. The API proxy relays all HTTPS requests to download a container image from the lower layers to be served by the registry module in the top layer.

This scenario requires that downstream IoT Edge devices point to the domain name `$upstream` followed by the API Proxy module port number instead of the container registry of an image. For example: `$upstream:8000/azureiotedge-api-proxy:1.1`.

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

Port 8000 is exposed by default from the docker image. If a different nginx proxy port is used, add the **ExposedPorts** section declaring the port in the deployment manifest. For example, if you change the nginx proxy port to 8001, add the following to the deployment manifest:

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

Another use case for the API proxy module is to enable IoT Edge devices in lower layers to upload blobs. This use case enables troubleshooting functionality on lower layer devices like uploading module logs or uploading the support bundle.

This scenario uses the [Azure Blob Storage on IoT Edge](https://azuremarketplace.microsoft.com/marketplace/apps/azure-blob-storage.edge-azure-blob-storage) module at the top layer to handle blob creation and upload. In a nested scenario, up to five layers are supported. The *Azure Blob Storage on IoT Edge* module is required on the top layer device and optional for lower layer devices. For a sample multi-layer deployment, see the [Azure IoT Edge for Industrial IoT](https://github.com/Azure-Samples/iot-edge-for-iiot) sample.

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

1. Write your configuration file. You can use this default template as a reference: [nginx_default_config.conf](https://github.com/Azure/iotedge/blob/master/edge-modules/api-proxy-module/templates/nginx_default_config.conf)
1. Copy the text of the configuration file and convert it to base64.
1. Paste the encoded configuration file as the value of the `proxy_config` desired property in the module twin.

   :::image type="content" source="./media/how-to-configure-api-proxy-module/change-config.png" alt-text="Screenshot that shows how to paste encoded config file as value of proxy_config property.":::

## Next steps

Use the API proxy module to [Connect a downstream IoT Edge device to an Azure IoT Edge gateway](how-to-connect-downstream-iot-edge-device.md).
