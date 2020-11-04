---
title: Connect downstream IoT Edge devices - Azure IoT Edge | Microsoft Docs
description: How to configure an IoT Edge device to connect to Azure IoT Edge gateway devices. 
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

# Connect a downstream IoT Edge device to an Azure IoT Edge gateway

This article provides instructions for establishing a trusted connection between an IoT Edge device and an IoT Edge gateway.

In a gateway scenario, an IoT Edge device can be both a gateway and a downstream device. Multiple IoT Edge gateways can be layered to create a hierarchy of devices. Only the top IoT Edge device in a hierarchy can connect to IoT Hub. All IoT Edge devices in lower layers of a hierarchy can only communicate with their gateway (or parent) device and any downstream (or child) devices.

There are two different configurations for IoT Edge devices in a gateway hierarchy, and this article address both. The first is the **top layer** IoT Edge device. When multiple IoT Edge devices are connecting through each other, only the device in the top layer has a connection to the cloud. This device is responsible for handling requests from all the devices below it, whether it's requests to pull container images from a registry or to push blobs to cloud storage. The other configuration applies to any IoT Edge device in a **lower layer** of the hierarchy. These devices may be a gateway for other downstream IoT and IoT Edge devices, but also need to route any communications through their own parent devices.

All the steps in this article build on those in [Configure an IoT Edge device to act as a transparent gateway](how-to-create-transparent-gateway.md), which sets up an IoT Edge device to be a gateway for downstream IoT devices. The same principles apply to all gateway devices: they need certificates so that they can securely connect to downstream devices, and they need to be configured to route messages from downstream devices. Gateway devices that have downstream IoT Edge devices require additional processing, which is handled by special modules.

* The **API proxy module** is required on any IoT Edge gateway that has another IoT Edge device below it. That means it must be on *every layer* of a gateway hierarchy except the bottom layer. This module uses an [nginx](https://nginx.org) reverse proxy to route data through network layers. It is highly configurable through its module twin and environment variables, so can be adjusted to fit your gateway scenario requirements.

* The **Docker registry module** can be deployed on the IoT Edge gateway at the *top layer* of a gateway hierarchy. This module is responsible for retrieving and caching container images on behalf of all the IoT Edge devices in lower layers.

* The **Azure Blob Storage on IoT Edge** can be deployed on the IoT Edge gateway at the *top layer* of a gateway hierarchy. This module is responsible for uploading blobs on behalf of all the IoT Edge devices in lower layers. The ability to upload blobs also enables useful troubleshooting functionality for IoT Edge devices in lower layers, like module log upload and support bundle upload.

## Prerequisites

* A free or standard IoT hub.
* At least two **IoT Edge devices**, one to be the top layer device and one or more lower layer devices. If you don't have IoT Edge devices available, you can [Run Azure IoT Edge on Ubuntu virtual machines](how-to-install-iot-edge-ubuntuvm.md).

<!--This article provides detailed steps and options to help you create the right gateway hierarchy for your scenario. For a guided walkthrough, see [tutorial]-->

## Create a gateway hierarchy

You create an IoT Edge gateway hierarchy by defining parent/child relationships for the IoT Edge devices in the scenario. You can set a parent device when you create a new device identity, or you can manage the parent and children of an existing device identity.

Only IoT Edge devices can be parent devices, but both IoT Edge devices and IoT devices can be children. A parent can have many children, but a child can only have one parent. A gateway hierarcy is created by chaining parent/child sets together so that the child of one device is the parent of another.

<!-- TODO: graphic of gateway hierarcy -->

# [Portal](#tab/azure-portal)

In the Azure portal, you can manage the parent/child relationship when you create new device identities, or by editing existing devices.

When you create a new IoT Edge device, you have the option of choosing parent and children devices from the list of existing IoT Edge devices in that hub.

<!-- TODO: Validate UI text/flows -->

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.
1. Select **IoT Edge** from the navigation menu.
1. Select **Add an IoT Edge device**.
1. Along with setting the device ID and authentication settings, you can **Set a parent device** or **Choose child devices**.
1. Choose the device or devices that you want as a parent or child.

You can also create or manage parent/child relationships for existing devices.

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.
1. Select **IoT Edge** from the navigation menu.
1. Select the device you want to manage from the list of **IoT Edge devices**.
1. Select **Set a parent device** or **Manage child devices**.
1. Add or remove any devices.

# [Azure CLI](#tab/azure-cli)

The [azure-iot](/cli/azure/ext/azure-iot) extension for the Azure CLI provides commands to manage your IoT resources. You can manage the parent/child relationship of IoT and IoT Edge devices when you create new device identities or by editing existing devices.

The [az iot hub device-identity](/cli/azure/ext/azure-iot/iot/hub/device-identity) set of commands allow you to manage the parent/child relationships for a given device.

The `create` command includes parameters for adding children devices and setting a parent device at the time of device creation.

Additional device-identity commands, including `add-children`, `get-parent`, `list-children`, `remove-children`, and `set-parent` allow you to manage the parent/child relationships for existing devices.

---

## Prepare certificates

A consistent chain of certificates must be installed across devices in the same gateway hierarchy to establish a secure communication between themselves. Every device in the hierarchy, whether an IoT Edge device or an IoT leaf device, needs a copy of the same root CA certificate. Each IoT Edge device in the hierarchy then uses that root CA certificate as the root for its device CA certificate.

With this setup, each downstream IoT Edge device or IoT leaf device can verify the identity of their parent by verifying that the edgeHub they connect to has a server certificate that is signed by the shared root CA certificate.

<!-- TODO: certificate graphic -->

Create the following certificates:

* A **root CA certificate**, which is the topmost shared certificate for all the devices in a given gateway hierarchy. This certificate is installed on all devices.
* Any **intermediate certificates** that you want to include in the root certificate chain.
* A **device CA certificate** and its **private key**, generated by the root and intermediate certificates. You need one unique device CA certificate for each IoT Edge device in the gateway hierarchy.

>[!NOTE]
>Currently, a limitation in libiothsm prevents the use of certificates that expire on or after January 1, 2038.

You can use either a self-signed certificate authority or purchase one from a trusted commercial certificate authority like Baltimore, Verisign, Digicert, or GlobalSign.

If you don't have your own certificates to use, you can [create demo certificates to test IoT Edge device features](how-to-create-test-certificates.md). Follow the steps in that article to create the one set of root and intermediate certificates, then to create IoT Edge device CA certificates for each of your devices.

## Configure devices for the top layer

An IoT Edge device is considered the top layer of a gateway hierarchy if it is the parent of other devices, but is not the child of another device. This device maintains the connection to the cloud for all devices that are below it. As such, it has a different configuration pattern than IoT Edge devices in lower levels of a gateway hierarchy.

### Network configuration for top layer devices

For each gateway device in the top layer, network operators need to:

* Provide a static IP address or fully qualified domain name (FQDN).
* Authorize outbound communications from this IP address to your Azure IoT Hub hostname over ports 443 (HTTPS) and 5671 (AMQP).
* Authorize outbound communications from this IP address to your Azure Container Registry hostname and Microsoft Container Registry (mcr.microsoft.com) over port 443 (HTTPS).

### IoT Edge configuration for top layer devices

You should already have IoT Edge installed on your device. If not, follow the steps to [Install the Azure IoT Edge runtime](how-to-install-iot-edge.md) and then provision your device with either [symmetric key authentication](how-to-manual-provision-symmetric-key.md) or [X.509 certificate authentication](how-to-manual-provision-x509.md).

The steps in this section reference the **root CA certificate** and **device CA certificate and private key** that were discussed earlier in this article. If you created those certificates on a different device, have them available on this device. You can transfer the files physically, like with a USB drive, with a service like [Azure Key Vault](../key-vault/general/overview.md), or with a function like [Secure file copy](https://www.ssh.com/ssh/scp/).

Use the following steps to configure IoT Edge on your device.

On Linux, make sure that the user **iotedge** has read permissions for the directory holding the certificates and keys.

1. Install the **root CA certificate** on this IoT Edge device.

   ```bash
   sudo cp <path>/<root ca certificate>.pem /usr/local/share/ca-certificates/<root ca certificate>.pem
   ```

1. Update the certificate store.

   ```bash
   sudo update-ca-certificates
   ```

   This command should output that one certificate was added to /etc/ssl/certs.

1. Open the IoT Edge security daemon configuration file.

   ```bash
   sudo nano /etc/iotedge/config.yaml
   ```

1. Find the **certificates** section in the config.yaml file. Update the three certificate fields to point to your certificates. Provide the file URI paths, which take the format `file:///<path>/<filename>`.

   * **device_ca_cert**: File URI path to the device CA certificate unique to this device.
   * **device_ca_pk**: File URI path to the device CA private key unique to this device.
   * **trusted_ca_certs**: File URI path to the root CA certificate shared by all devices in the gateway hierarchy.

1. Find the **hostname** parameter in the config.yaml file. Update the hostname to be the fully qualified domain name (FQDN) of the IoT Edge device.

   The value of this parameter is what downstream devices will use to connect to this gateway. The hostname takes the machine name by default, but the FQDN makes it easier to connect downstream devices.

   Use a hostname shorter than 64 characters, which is the character limit for a server certificate common name.

   Do not use an IP address as a hostname. If you can't use an FQDN, keep the default machine name as the hostname and instead update the child devices to map the parent device's IP address to its hostname. Detailed instructions for this process are in the [IoT Edge configuration for lower layer devices](#iot-edge-configuration-for-lower-layer-devices), later in this article.

1. Save (`Ctrl+O`) and close (`Ctrl+X`) the config.yaml file.

1. If you've used any other certificates for IoT Edge before, delete the files in the following two directories to make sure that your new certificates get applied:

   * `/var/lib/iotedge/hsm/certs`
   * `/var/lib/iotedge/hsm/cert_keys`

1. Restart the IoT Edge service to apply your changes.

   ```bash
   sudo systemctl restart iotedge
   ```

1. Check for any errors in the configuration.

   ```bash
   sudo iotedge check --verbose
   ```

### Deploy modules to top layer devices

The IoT Edge device at the top layer of a gateway hierarchy has a set of required modules that must be deployed to it, in addition to any workload modules you may run on the device.

The **API proxy module** is required for routing all communications between the cloud and any downstream IoT Edge devices.

The **Docker registry module** is required if you want IoT Edge devices in lower layers of the gateway hierarchy to be able to make container image pulls. The alternative to deploying this module at the top layer is to use a local registry, or to manually load container images onto devices and set the module pull policy to **never**.

The **Azure Blob Storage on IoT Edge module** is required if you want IoT Edge devices in lower layers of the gateway hierarchy to be able to push blobs to Azure Storage, or to make use of troubleshooting features like uploading logs.

The API proxy module was designed to be customized to handle most common gateway scenarios. This article briefly touches on the steps to set up the modules in a basic configuration. Refer to [Configure the API proxy module for your gateway hierarchy scenario](how-to-configure-api-proxy-module.md) for more detailed information and examples.

<!-- TODO: Verify UI text/flow-->
<!-- TODO: Verify default env var values for top layer device??-->
<!-- TODO: Any additional create options for registry? -->

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.
1. Select **IoT Edge** from the navigation menu.
1. Select the top layer device that you're configuring from the list of **IoT Edge devices**.
1. Select **Set modules**.
1. In the **IoT Edge modules** section, select **Add** then choose **IoT Edge module**.
1. Provide the following values to add the API proxy module to your deployment:
   1. **IoT Edge module name**: `apiproxy`
   1. In the **Module settings** tab, **Image URI**: `mcr.microsoft.com/azureiotedge-api-proxy:latest`
   1. In the **Environment variables** tab, add the following environment variables:

      * **Name**: `PROXY_CONFIG_ENV_VAR_LIST` **Value**: `NGINX_DEFAULT_PORT,DOCKER_REQUEST_ROUTE_ADDRESS`

        A list of all the environment variables that you want to update.

      * **Name**: `NGINX_DEFAULT_PORT` **Value**: `8000`

        The port that the nginx proxy listens to. This port also needs to be exposed in the module's dockerfile.

      * **Name**: `DOCKER_REQUEST_ROUTE_ADDRESS` **Value**: `registry:5000`

        On the top layer IoT Edge device, route all Docker requests to the **registry** module running on the device. |

1. Select **Add** to add the module to the deployment.
1. Select **Add** again, then choose **IoT Edge module**.
1. Provide the following values to add the Docker registry module to your deployment:
   1. **IoT Edge module name**: `registry`
   1. On the **Module settings** tab, **Image URI**: `registry:latest`
   1. On the **Environment variables** tab, add the following environment variables:

      * **Name**: `REGISTRY_PROXY_REMOTEURL` **Value**: The URL for the container registry you want this registry module to map to. For example, `https://myregistry.azurecr`.

        For production scenarios, we recommend having all container images in a single private repository. If your downstream IoT Edge devices need to pull from multiple container registries, you need a registry module to map to each one.

      * **Name**: `REGISTRY_PROXY_USERNAME` **Value**: Username to authenticate to the container registry.

      * **Name**: `REGISTRY_PROXY_PASSWORD` **Value**: Password to authenticate to the container registry.

    1. On the **Container create options** tab, paste:

       ```json
       {
           "HostConfig": {
               "PortBindings": {
                   "5000/tcp": [
                       {
                           "HostPort": "5000"
                       }
                   ]
               }
           }
       }
       ```

1. Select **Add** to add the module to the deployment.
1. Select **Next: Routes** to go to the next step.
1. To enable device-to-cloud messages from downstream devices to reach IoT Hub, include a route that passes all messages to IoT Hub. For example:
    1. **Name**: `Route`
    1. **Value**: `FROM /messages/* INTO $upstream`
1. Select **Review + create** to go to the final step.
1. Select **Create** to deploy to your device.

## Configure devices for lower layers

An IoT Edge device is considered a lower layer of a gateway hierarchy if it is the child of another device. This device does not have a connection to the cloud, so passes any requests or communications through its parent device. It doesn't matter how many layers of gateways exist between this device and the cloud. The behavior is the same for an IoT Edge device with one parent device above it or an IoT Edge device with five generations of parent devices above it.

An IoT Edge device can have many children, but only one parent.

### Network configuration for lower layer devices

For each gateway device in a lower layer, network operators need to:

* Provide a static IP address.
* Authorize outbound communications from this IP address to the parent gateway's IP address over ports 443 (HTTPS) and 5671 (AMQP), unless the two devices are part of the same subnet.

### IoT Edge configuration for lower layer devices

You should already have IoT Edge installed on your device. If not, follow the steps to [Install the Azure IoT Edge runtime](how-to-install-iot-edge.md) and then provision your device with either [symmetric key authentication](how-to-manual-provision-symmetric-key.md) or [X.509 certificate authentication](how-to-manual-provision-x509.md).

The steps in this section reference the **root CA certificate** and **device CA certificate and private key** that were discussed earlier in this article. If you created those certificates on a different device, have them available on this device. You can transfer the files physically, like with a USB drive, with a service like [Azure Key Vault](../key-vault/general/overview.md), or with a function like [Secure file copy](https://www.ssh.com/ssh/scp/).

The steps in this section are nearly identical to the steps to configure top layer devices, with one important extra step. For IoT Edge devices in lower layers, you need to include the fully qualified domain name (FQDN) or IP address of the parent device.

Use the following steps to configure IoT Edge on your device.

On Linux, make sure that the user **iotedge** has read permissions for the directory holding the certificates and keys.

1. Install the **root CA certificate** on this IoT Edge device.

   ```bash
   sudo cp <path>/<root ca certificate>.pem /usr/local/share/ca-certificates/<root ca certificate>.pem
   ```

1. Update the certificate store.

   ```bash
   sudo update-ca-certificates
   ```

   This command should output that one certificate was added to /etc/ssl/certs.

1. Open the IoT Edge security daemon configuration file.

   ```bash
   sudo nano /etc/iotedge/config.yaml
   ```

1. Find the **certificates** section in the config.yaml file. Update the three certificate fields to point to your certificates. Provide the file URI paths, which take the format `file:///<path>/<filename>`.

   * **device_ca_cert**: File URI path to the device CA certificate unique to this device.
   * **device_ca_pk**: File URI path to the device CA private key unique to this device.
   * **trusted_ca_certs**: File URI path to the root CA certificate shared by all devices in the gateway hierarchy.

1. Find the **hostname** parameter in the config.yaml file. Update the hostname to be the fully qualified domain name (FQDN) or IP address of the IoT Edge device.

   The value of this parameter is what downstream devices will use to connect to this gateway. The hostname takes the machine name by default, but the FQDN makes it easier to connect downstream devices.

   Use a hostname shorter than 64 characters, which is the character limit for a server certificate common name.

1. Find the **parent_hostname** parameter. Update the **parent_hostname** field to be the FQDN or IP address of the parent device, matching whatever was provided as the hostname in the parent's config.yaml file.

1. Save (`Ctrl+O`) and close (`Ctrl+X`) the config.yaml file.

1. If you've used any other certificates for IoT Edge before, delete the files in the following two directories to make sure that your new certificates get applied:

   * `/var/lib/iotedge/hsm/certs`
   * `/var/lib/iotedge/hsm/cert_keys`

1. Restart the IoT Edge service to apply your changes.

   ```bash
   sudo systemctl restart iotedge
   ```

1. Check for any errors in the configuration.

   ```bash
   sudo iotedge check --verbose
   ```

### Deploy modules to lower layer devices

IoT Edge devices in lower layers of a gateway hierarchy have one required module that must be deployed to them, in addition to any workload modules you may run on the device.

#### Route container image pulls

Before discussing the required proxy module for IoT Edge devices in gateway hierarchies, it's important to understand how IoT Edge devices in lower layers get their module images.

If you want lower layer devices to be able to pull module images as usual, then the top layer device of the gateway hierarchy must be configured to handle these requests. The top layer device needs to run a Docker **registry** module that is mapped to your container registry. Then, configure the API proxy module to route container requests to it. Those details are discussed in the earlier sections of this article. In this configuration, the lower layer devices should not point to cloud container registries, but to the registry running in the top layer.

If your lower layer devices need to pull from more than one container registry, then the top layer device needs a registry module for each container registry.

For example, instead of calling `mcr.microsoft.com/azureiotedge-api-proxy:latest`, lower layer devices should call `$upstream:8000/azureiotedge-api-proxy:latest`.

The **$upstream** parameter points to the parent of a lower layer device, so the request will route through all the layers until it reaches the top layer which has a proxy environment routing container requests to the registry module. The `:8000` port in this example should be replaced with whichever port the API proxy module on the parent device is listening on.

If you don't want lower layer devices making module pull requests through a gateway hierarchy, another option is to manage a local registry solution. Or, push the module images onto the devices before creating deployments and then set the **imagePullPolicy** to **never**.

#### Deploy required proxy module

The **API proxy module** is required for routing all communications between the cloud and any downstream IoT Edge devices. An IoT Edge device in the bottom layer of the hierarchy, with no downstream IoT Edge devices, does not need this module.

The API proxy module was designed to be customized to handle most common gateway scenarios. This article briefly touches on the steps to set up the modules in a basic configuration. Refer to [Configure the API proxy module for your gateway hierarchy scenario](how-to-configure-api-proxy-module.md) for more detailed information and examples.

<!-- TODO: Verify UI text/flow-->

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.
1. Select **IoT Edge** from the navigation menu.
1. Select the lower layer device that you're configuring from the list of **IoT Edge devices**.
1. Select **Set modules**.
1. In the **IoT Edge modules** section, select **Add** then choose **IoT Edge module**.
1. Provide the following values to add the API proxy module to your deployment:
   1. **IoT Edge module name**: `apiproxy`
   1. In the **Module settings** tab, **Image URI**: `$upstream:<listening port>/azureiotedge-api-proxy:latest`
   1. In the **Environment variables** tab, add the following environment variables:

      * **Name**: `PROXY_CONFIG_ENV_VAR_LIST` **Value**: `NGINX_DEFAULT_PORT`

        A list of all the environment variables that you want to update.

      * **Name**: `NGINX_DEFAULT_PORT` **Value**: `8000`

        The port that the nginx proxy listens to. This port also needs to be exposed in the module's dockerfile.

1. Select **Add** to add the module to the deployment.
1. Select **Next: Routes** to go to the next step.
1. To enable device-to-cloud messages from downstream devices to reach IoT Hub, include a route that passes all messages to `$upstream`. The upstream parameter points to the parent device in the case of lower layer devices. For example:
    1. **Name**: `Route`
    1. **Value**: `FROM /messages/* INTO $upstream`
1. Select **Review + create** to go to the final step.
1. Select **Create** to deploy to your device.

## Next steps

[How an IoT Edge device can be used as a gateway](iot-edge-as-gateway.md)

[Configure the API proxy module for your gateway hierarchy scenario](how-to-configure-api-proxy-module.md)