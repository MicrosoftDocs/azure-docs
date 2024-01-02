---
title: Prepare to deploy your solution in production - Azure IoT Edge
description: Learn how to take your Azure IoT Edge solution from development to production, including setting up your devices with the appropriate certificates and making a deployment plan for future code updates. 
author: PatAltimore

ms.author: patricka
ms.date: 07/22/2022
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
ms.custom:  [amqp, mqtt]
---

# Prepare to deploy your IoT Edge solution in production

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

When you're ready to take your IoT Edge solution from development into production, make sure that it's configured for ongoing performance.

The information provided in this article isn't all equal. To help you prioritize, each section starts with lists that divide the work into two sections: **important** to complete before going to production, or **helpful** for you to know.

## Device configuration

IoT Edge devices can be anything from a Raspberry Pi to a laptop to a virtual machine running on a server. You may have access to the device either physically or through a virtual connection, or it may be isolated for extended periods of time. Either way, you want to make sure that it's configured to work appropriately.

* **Important**
  * Install production certificates
  * Have a device management plan
  * Use Moby as the container engine

* **Helpful**
  * Choose upstream protocol

### Install production certificates

Every IoT Edge device in production needs a device certificate authority (CA) certificate installed on it. That CA certificate is then declared to the IoT Edge runtime in the config file. For development and testing scenarios, the IoT Edge runtime creates temporary certificates if no certificates are declared in the config file. However, these temporary certificates expire after three months and aren't secure for production scenarios. For production scenarios, you should provide your own device CA certificate, either from a self-signed certificate authority or purchased from a commercial certificate authority.

To understand the role of the device CA certificate, see [How Azure IoT Edge uses certificates](iot-edge-certs.md).

For more information about how to install certificates on an IoT Edge device and reference them from the config file, see [Manage certificate on an IoT Edge device](how-to-manage-device-certificates.md).

### Have a device management plan

Before you put any device in production you should know how you're going to manage future updates. For an IoT Edge device, the list of components to update may include:

* Device firmware
* Operating system libraries
* Container engine, like Moby
* IoT Edge
* CA certificates

[Device Update for IoT Hub](../iot-hub-device-update/index.yml) is a service that enables you to deploy over-the-air updates (OTA) for your IoT Edge devices. 

Alternative methods for updating IoT Edge require physical or SSH access to the IoT Edge device. For more information, see [Update the IoT Edge runtime](how-to-update-iot-edge.md). To update multiple devices, consider adding the update steps to a script or use an automation tool like Ansible.

### Use Moby as the container engine

A container engine is a prerequisite for any IoT Edge device. Only moby-engine is supported in production. Other container engines, like Docker, do work with IoT Edge and it's ok to use these engines for development. The moby-engine can be redistributed when used with Azure IoT Edge, and Microsoft provides servicing for this engine.

### Choose upstream protocol

You can configure the protocol (which determines the port used) for upstream communication to IoT Hub for both the IoT Edge agent and the IoT Edge hub. The default protocol is AMQP, but you may want to change that depending on your network setup.

The two runtime modules both have an **UpstreamProtocol** environment variable. The valid values for the variable are:

* MQTT
* AMQP
* MQTTWS
* AMQPWS

Configure the UpstreamProtocol variable for the IoT Edge agent in the config file on the device itself. For example, if your IoT Edge device is behind a proxy server that blocks AMQP ports, you may need to configure the IoT Edge agent to use AMQP over WebSocket (AMQPWS) to establish the initial connection to IoT Hub.

Once your IoT Edge device connects, be sure to continue configuring the UpstreamProtocol variable for both runtime modules in future deployments. An example of this process is provided in [Configure an IoT Edge device to communicate through a proxy server](how-to-configure-proxy-support.md).

## Deployment

* **Helpful**
  * Be consistent with upstream protocol
  * Set up host storage for system modules
  * Reduce memory space used by the IoT Edge hub
  * Use correct module images in deployment manifests
  * Be mindful of twin size limits when using custom modules
  * Configure how updates to modules are applied

### Be consistent with upstream protocol

If you configured the IoT Edge agent on your IoT Edge device to use a different protocol than the default AMQP, then you should declare the same protocol in all future deployments. For example, if your IoT Edge device is behind a proxy server that blocks AMQP ports, you probably configured the device to connect over AMQP over WebSocket (AMQPWS). When you deploy modules to the device, configure the same AMQPWS protocol for the IoT Edge agent and IoT Edge hub, or else the default AMQP will override the settings and prevent you from connecting again.

You only have to configure the UpstreamProtocol environment variable for the IoT Edge agent and IoT Edge hub modules. Any additional modules adopt whatever protocol is set in the runtime modules.

An example of this process is provided in [Configure an IoT Edge device to communicate through a proxy server](how-to-configure-proxy-support.md).

### Set up host storage for system modules

The IoT Edge hub and agent modules use local storage to maintain state and enable messaging between modules, devices, and the cloud. For better reliability and performance, configure the system modules to use storage on the host filesystem.

For more information, see [Host storage for system modules](how-to-access-host-storage-from-module.md).

### Reduce memory space used by IoT Edge hub

If you're deploying constrained devices with limited memory available, you can configure IoT Edge hub to run in a more streamlined capacity and use less disk space. These configurations do limit the performance of the IoT Edge hub, however, so find the right balance that works for your solution.

#### Don't optimize for performance on constrained devices

The IoT Edge hub is optimized for performance by default, so it attempts to allocate large chunks of memory. This configuration can cause stability problems on smaller devices like the Raspberry Pi. If you're deploying devices with constrained resources, you may want to set the **OptimizeForPerformance** environment variable to **false** on the IoT Edge hub.

When **OptimizeForPerformance** is set to **true**, the MQTT protocol head uses the PooledByteBufferAllocator, which has better performance but allocates more memory. The allocator does not work well on 32-bit operating systems or on devices with low memory. Additionally, when optimized for performance, RocksDb allocates more memory for its role as the local storage provider.

For more information, see [Stability issues on smaller devices](troubleshoot-common-errors.md#stability-issues-on-smaller-devices).

#### Disable unused protocols

Another way to optimize the performance of the IoT Edge hub and reduce its memory usage is to turn off the protocol heads for any protocols that you're not using in your solution.

Protocol heads are configured by setting boolean environment variables for the IoT Edge hub module in your deployment manifests. The three variables are:

* **amqpSettings__enabled**
* **mqttSettings__enabled**
* **httpSettings__enabled**

All three variables have *two underscores* and can be set to either true or false.

#### Reduce storage time for messages

The IoT Edge hub module stores messages temporarily if they cannot be delivered to IoT Hub for any reason. You can configure how long the IoT Edge hub holds on to undelivered messages before letting them expire. If you have memory concerns on your device, you can lower the **timeToLiveSecs** value in the IoT Edge hub module twin.

The default value of the timeToLiveSecs parameter is 7200 seconds, which is two hours.

### Use correct module images in deployment manifests
If an empty or wrong module image is used, the Edge agent retries to load the image, which causes extra traffic to be generated. Add the correct images to the deployment manifest to avoid generating unnecessary traffic.

#### Don't use debug versions of module images
When moving from test scenarios to production scenarios, remember to remove debug configurations from deployment manifests. Check that none of the module images in the deployment manifests have the **\.debug** suffix. If you added create options to expose ports in the modules for debugging, remove those create options as well.

### Be mindful of twin size limits when using custom modules

The deployment manifest that contains custom modules is part of the EdgeAgent twin. Review the [limitation on module twin size](../iot-hub/iot-hub-devguide-module-twins.md#module-twin-size).

If you deploy a large number of modules, you might exhaust this twin size limit. Consider some common mitigations to this hard limit:

- Store any configuration in the custom module twin, which has its own limit.
- Store some configuration that points to a non-space-limited location (that is, to a blob store).


### Configure how updates to modules are applied
When a deployment is updated, Edge Agent receives the new configuration as a twin update. If the new configuration has new or updated module images, by default, Edge Agent sequentially processes each module:
1. The updated image is downloaded
1. The running module is stopped
1. A new module instance is started
1. The next module update is processed

In some cases, for example when dependencies exist between modules, it may be desirable to first download all updated module images before restarting any running modules. This module update behavior can be configured by setting an IoT Edge Agent environment variable `ModuleUpdateMode` to string value `WaitForAllPulls`. For more information, see [IoT Edge Environment Variables](https://github.com/Azure/iotedge/blob/main/doc/EnvironmentVariables.md).

```JSON
"modulesContent": {
    "$edgeAgent": {
        "properties.desired": {
            ...
            "systemModules": {
                "edgeAgent": {
                    "env": {
                        "ModuleUpdateMode": {
                            "value": "WaitForAllPulls"
                        }
                    ...
```
### Container management

* **Important**
  * Use tags to manage versions
  * Manage volumes
* **Helpful**
  * Store runtime containers in your private registry
  * Configure image garbage collection

### Use tags to manage versions

A tag is a docker concept that you can use to distinguish between versions of docker containers. Tags are suffixes like **1.1** that go on the end of a container repository. For example, **mcr.microsoft.com/azureiotedge-agent:1.1**. Tags are mutable and can be changed to point to another container at any time, so your team should agree on a convention to follow as you update your module images moving forward.

Tags also help you to enforce updates on your IoT Edge devices. When you push an updated version of a module to your container registry, increment the tag. Then, push a new deployment to your devices with the tag incremented. The container engine will recognize the incremented tag as a new version and will pull the latest module version down to your device.

#### Tags for the IoT Edge runtime

The IoT Edge agent and IoT Edge hub images are tagged with the IoT Edge version that they are associated with. There are two different ways to use tags with the runtime images:

* **Rolling tags** - Use only the first two values of the version number to get the latest image that matches those digits. For example, 1.1 is updated whenever there's a new release to point to the latest 1.1.x version. If the container runtime on your IoT Edge device pulls the image again, the runtime modules are updated to the latest version. Deployments from the Azure portal default to rolling tags. *This approach is suggested for development purposes.*

* **Specific tags** - Use all three values of the version number to explicitly set the image version. For example, 1.1.0 won't change after its initial release. You can declare a new version number in the deployment manifest when you're ready to update. *This approach is suggested for production purposes.*

### Manage volumes
IoT Edge does not remove volumes attached to module containers. This behavior is by design, as it allows persisting the data across container instances such as upgrade scenarios. However, if these volumes are left unused, then it may lead to disk space exhaustion and subsequent system errors. If you use docker volumes in your scenario, then we encourage you to use docker tools such as [docker volume prune](https://docs.docker.com/engine/reference/commandline/volume_prune/) and [docker volume rm](https://docs.docker.com/engine/reference/commandline/volume_rm/) to remove the unused volumes, especially for production scenarios.

### Store runtime containers in your private registry

You know how to store container images for custom code modules in your private Azure registry, but you can also use it to store public container images such as the **edgeAgent** and **edgeHub** runtime modules. Doing so may be required if you have very tight firewall restrictions as these runtime containers are stored in the Microsoft Container Registry (MCR).

The following steps illustrate how to pull a Docker image of **edgeAgent** and **edgeHub** to your local machine, retag it, push it to your private registry, then update your configuration file so your devices know to pull the image from your private registry.

1. Pull the **edgeAgent** Docker image from the Microsoft registry. Update the version number if needed.

   ```bash
   # Pull edgeAgent image
   docker pull mcr.microsoft.com/azureiotedge-agent:1.4

   # Pull edgeHub image
   docker pull mcr.microsoft.com/azureiotedge-hub:1.4
   ```

1. List all your Docker images, find the **edgeAgent** and **edgeHub** images, then copy their image IDs.

   ```bash
   docker images
   ```

1. Retag your **edgeAgent** and **edgeHub** images. Replace the values in brackets with your own.

   ```bash
   # Retag your edgeAgent image
   docker tag <my-image-id> <registry-name/server>/azureiotedge-agent:1.4

   # Retag your edgeHub image
   docker tag <my-image-id> <registry-name/server>/azureiotedge-hub:1.4
   ```

1. Push your **edgeAgent** and **edgeHub** images to your private registry. Replace the value in brackets with your own.

   ```bash
   # Push your edgeAgent image to your private registry
   docker push <registry-name/server>/azureiotedge-agent:1.4

   # Push your edgeHub image to your private registry
   docker push <registry-name/server>/azureiotedge-hub:1.4
   ```

1. Update the image references in the *deployment.template.json* file for the **edgeAgent** and **edgeHub** system modules, by replacing `mcr.microsoft.com` with your own "registry-name/server" for both modules.

1. Open a text editor on your IoT Edge device to change the configuration file so it knows about your private registry image. 

   ```bash
   sudo nano /etc/aziot/config.toml
   ```

1. In the text editor, change your image values under `[agent.config]`. Replace the values in brackets with your own.

   ```toml
   [agent.config]
   image = "<registry-name/server>/azureiotedge-agent:1.4"
   ```

1. If your private registry requires authentication, set the authentication parameters in `[agent.config.auth]`.

   ```toml
   [agent.config.auth]
   serveraddress = "<login-server>" # Almost always equivalent to <registry-name/server>
   username = "<username>"
   password = "<password>"
   ```

1. Save your changes and exit your text editor.

1. Apply the IoT Edge configuration change.

   ```bash
   sudo iotedge config apply
   ```

   Your IoT Edge runtime restarts.

For more information, see:

* [Configure the IoT Edge agent](./how-to-configure-proxy-support.md#configure-the-iot-edge-agent)
* [Azure IoT Edge Agent](https://hub.docker.com/_/microsoft-azureiotedge-agent)
* [Azure IoT Edge Hub](https://hub.docker.com/_/microsoft-azureiotedge-hub)


### Configure image garbage collection
Image garbage collection is a feature in IoT Edge v1.4 and later to automatically clean up Docker images that are no longer used by IoT Edge modules. It only deletes Docker images that were pulled by the IoT Edge runtime as part of a deployment. Deleting unused Docker images helps conserve disk space.

The feature is implemented in IoT Edge's host component, the `aziot-edged` service and enabled by default. Cleanup is done every day at midnight (device local time) and removes unused Docker images that were last used seven days ago. The parameters to control cleanup behavior are set in the `config.toml` and explained later in this section. If parameters aren't specified in the configuration file, the default values are applied.

For example, the following is the `config.toml` image garbage collection section using default values:
 
```toml
[image_garbage_collection]
enabled = true
cleanup_recurrence = "1d"
image_age_cleanup_threshold = "7d" 
cleanup_time = "00:00"
```
The following table describes image garbage collection parameters. All parameters are **optional** and can be set individually to change the default settings.

| Parameter | Description | Required | Default value |
|-----------|-------------|----------|---------------|
| `enabled` | Enables the image garbage collection. You may choose to disable the feature by changing this setting to `false`. | Optional | true |
| `cleanup_recurrence` | Controls the recurrence frequency of the cleanup task. Must be specified as a multiple of days and can't be less than one day. <br><br> For example: 1d, 2d, 6d, etc. | Optional | 1d |
| `image_age_cleanup_threshold` | Defines the minimum age threshold of unused images before considering for cleanup and must be specified in days. You can specify as *0d* to clean up the images as soon as they're removed from the deployment. <br><br>  Images are considered unused *after* they've been removed from the deployment. | Optional | 7d |
| `cleanup_time` | Time of day, *in device local time*, when the cleanup task runs. Must be in 24-hour HH:MM format. | Optional | 00:00 |


## Networking

* **Helpful**
  * Review outbound/inbound configuration
  * Allow connections from IoT Edge devices
  * Configure communication through a proxy

### Review outbound/inbound configuration

Communication channels between Azure IoT Hub and IoT Edge are always configured to be outbound. For most IoT Edge scenarios, only three connections are necessary. The container engine needs to connect with the container registry (or registries) that holds the module images. The IoT Edge runtime needs to connect with IoT Hub to retrieve device configuration information, and to send messages and telemetry. And if you use automatic provisioning, IoT Edge needs to connect to the Device Provisioning Service. For more information, see [Firewall and port configuration rules](troubleshoot.md#check-your-firewall-and-port-configuration-rules).

### Allow connections from IoT Edge devices

If your networking setup requires that you explicitly permit connections made from IoT Edge devices, review the following list of IoT Edge components:

* **IoT Edge agent** opens a persistent AMQP/MQTT connection to IoT Hub, possibly over WebSockets.
* **IoT Edge hub** opens a single persistent AMQP connection or multiple MQTT connections to IoT Hub, possibly over WebSockets.
* **IoT Edge service** makes intermittent HTTPS calls to IoT Hub.

In all three cases, the fully qualified domain name (FQDN) would match the pattern `\*.azure-devices.net`.

#### Container registries

The **Container engine** makes calls to container registries over HTTPS. To retrieve the IoT Edge runtime container images, the FQDN is `mcr.microsoft.com`. The container engine connects to other registries as configured in the deployment.

This checklist is a starting point for firewall rules:

   | FQDN (`*` = wildcard) | Outbound TCP Ports | Usage |
   | ----- | ----- | ----- |
   | `mcr.microsoft.com`  | 443 | Microsoft Container Registry |
   | `*.data.mcr.microsoft.com` | 443 | Data endpoint providing content delivery |
   | `*.cdn.azcr.io` | 443 | Deploy modules from the Marketplace to devices |
   | `global.azure-devices-provisioning.net`  | 443 | [Device Provisioning Service](../iot-dps/about-iot-dps.md) access (optional) |
   | `*.azurecr.io` | 443 | Personal and third-party container registries |
   | `*.blob.core.windows.net` | 443 | Download Azure Container Registry image deltas from blob storage |
   | `*.azure-devices.net` | 5671, 8883, 443<sup>1</sup> | IoT Hub access |
   | `*.docker.io`  | 443 | Docker Hub access (optional) |

<sup>1</sup>Open port 8883 for secure MQTT or port 5671 for secure AMQP. If you can only make connections via port 443 then either of these protocols can be run through a WebSocket tunnel.

Since the IP address of an IoT hub can change without notice, always use the FQDN to allowlist configuration. To learn more, see [Understanding the IP address of your IoT Hub](../iot-hub/iot-hub-understand-ip-address.md).

Some of these firewall rules are inherited from Azure Container Registry. For more information, see [Configure rules to access an Azure container registry behind a firewall](../container-registry/container-registry-firewall-access-rules.md).

You can enable dedicated data endpoints in your Azure Container registry to avoid wildcard allowlisting of the *\*.blob.core.windows.net* FQDN. For more information, see [Enable dedicated data endpoints](../container-registry/container-registry-firewall-access-rules.md#enable-dedicated-data-endpoints).

> [!NOTE]
> To provide a consistent FQDN between the REST and data endpoints, beginning **June 15, 2020** the Microsoft Container Registry data endpoint will change from `*.cdn.mscr.io` to `*.data.mcr.microsoft.com`  
> For more information, see [Microsoft Container Registry client firewall rules configuration](https://github.com/microsoft/containerregistry/blob/main/docs/client-firewall-rules.md)

If you don't want to configure your firewall to allow access to public container registries, you can store images in your private container registry, as described in [Store runtime containers in your private registry](#store-runtime-containers-in-your-private-registry).

#### Azure IoT Identity Service

The [IoT Identity Service](https://azure.github.io/iot-identity-service/) provides provisioning and cryptographic services for Azure IoT devices. The identity service checks if the installed version is the latest version. The check uses the following FQDNs to verify the version.

| FQDN | Outbound TCP Ports | Usage |
| ---- | ------------------ | ----- |
| `aka.ms` | 443 | Vanity URL that provides redirection to the version file |
| `raw.githubusercontent.com` | 443 | The identity service version file hosted in GitHub |

### Configure communication through a proxy

If your devices are going to be deployed on a network that uses a proxy server, they need to be able to communicate through the proxy to reach IoT Hub and container registries. For more information, see [Configure an IoT Edge device to communicate through a proxy server](how-to-configure-proxy-support.md).

## Solution management

* **Helpful**
  * Set up logs and diagnostics
  * Set up default logging driver
  * Consider tests and CI/CD pipelines

### Set up logs and diagnostics

On Linux, the IoT Edge daemon uses journals as the default logging driver. You can use the command-line tool `journalctl` to query the daemon logs.

Starting with version 1.2, IoT Edge relies on multiple daemons. While each daemon's logs can be individually queried with `journalctl`, the `iotedge system` commands provide a convenient way to query the combined logs.

* Consolidated `iotedge` command:

  ```bash
  sudo iotedge system logs
  ```

* Equivalent `journalctl` command:

  ```bash
  journalctl -u aziot-edge -u aziot-identityd -u aziot-keyd -u aziot-certd -u aziot-tpmd
  ```

When you're testing an IoT Edge deployment, you can usually access your devices to retrieve logs and troubleshoot. In a deployment scenario, you may not have that option. Consider how you're going to gather information about your devices in production. One option is to use a logging module that collects information from the other modules and sends it to the cloud. One example of a logging module is [logspout-loganalytics](https://github.com/veyalla/logspout-loganalytics), or you can design your own.

### Set up default logging driver

By default, the Moby container engine does not set container log size limits. Over time, this can lead to the device filling up with logs and running out of disk space. Configure your container engine to use the [`local` logging driver](https://docs.docker.com/config/containers/logging/local/) as your logging mechanism. `Local` logging driver offers a default log size limit, performs log-rotation by default, and uses a more efficient file format which helps to prevent disk space exhaustion. You may also choose to use different [logging drivers](https://docs.docker.com/config/containers/logging/configure/) and set different size limits based on your need.

#### Option: Configure the default logging driver for all container modules

You can configure your container engine to use a specific logging driver by setting the value of `log driver` to the name of the log driver in the `daemon.json`. The following example sets the default logging driver to the `local` log driver (recommended).

```JSON
{
    "log-driver": "local"
}
```
You can also configure your `log-opts` keys to use appropriate values in the `daemon.json` file. The following example sets the log driver to `local` and sets the `max-size` and `max-file` options.  

```JSON
{
    "log-driver": "local",
    "log-opts": {
        "max-size": "10m",
        "max-file": "3"
    }
}
```

Add (or append) this information to a file named `daemon.json` and place it in the following location:

* `/etc/docker/`

The container engine must be restarted for the changes to take effect.

#### Option: Adjust log settings for each container module

You can do so in the **createOptions** of each module. For example:

```yml
"createOptions": {
    "HostConfig": {
        "LogConfig": {
            "Type": "local",
            "Config": {
                "max-size": "10m",
                "max-file": "3"
            }
        }
    }
}
```

#### Additional options on Linux systems

* Configure the container engine to send logs to `systemd` [journal](https://docs.docker.com/config/containers/logging/journald/) by setting `journald` as the default logging driver.

* Periodically remove old logs from your device by installing a logrotate tool. Use the following file specification:

   ```txt
   /var/lib/docker/containers/*/*-json.log{
       copytruncate
       daily
       rotate7
       delaycompress
       compress
       notifempty
       missingok
   }
   ```

### Consider tests and CI/CD pipelines

For the most efficient IoT Edge deployment scenario, consider integrating your production deployment into your testing and CI/CD pipelines. Azure IoT Edge supports multiple CI/CD platforms, including Azure DevOps. For more information, see [Continuous integration and continuous deployment to Azure IoT Edge](how-to-continuous-integration-continuous-deployment.md).

## Security considerations

* **Important**
  * Manage access to your container registry
  * Limit container access to host resources

### Manage access to your container registry

Before you deploy modules to production IoT Edge devices, ensure that you control access to your container registry so that outsiders can't access or make changes to your container images. Use a private container registry to manage container images.

In the tutorials and other documentation, we instruct you to use the same container registry credentials on your IoT Edge device as you use on your development machine. These instructions are only intended to help you set up testing and development environments more easily, and should not be followed in a production scenario.

For a more secured access to your registry, you have a choice of [authentication options](../container-registry/container-registry-authentication.md). A popular and recommended authentication is to use an Active Directory service principal that's well suited for applications or services to pull container images in an automated or otherwise unattended (headless) manner, as IoT Edge devices do. Another option is to use repository-scoped tokens, which allow you to create long or short-live identities that exist only in the Azure Container Registry they were created in and scope access to the repository level.

To create a service principal, run the two scripts as described in [create a service principal](../container-registry/container-registry-auth-service-principal.md#create-a-service-principal). These scripts do the following tasks:

* The first script creates the service principal. It outputs the Service principal ID and the Service principal password. Store these values securely in your records.

* The second script creates role assignments to grant to the service principal, which can be run subsequently if needed. We recommend applying the **acrPull** user role for the `role` parameter. For a list of roles, see [Azure Container Registry roles and permissions](../container-registry/container-registry-roles.md).

To authenticate using a service principal, provide the service principal ID and password that you obtained from the first script. Specify these credentials in the deployment manifest.

* For the username or client ID, specify the service principal ID.

* For the password or client secret, specify the service principal password.

<br>

To create repository-scoped tokens, please follow [create a repository-scoped token](../container-registry/container-registry-repository-scoped-permissions.md).

To authenticate using repository-scoped tokens, provide the token name and password that you obtained after creating your repository-scoped token. Specify these credentials in the deployment manifest.

* For the username, specify the token's username.

* For the password, specify one of the token's passwords.

> [!NOTE]
> After implementing an enhanced security authentication, disable the **Admin user** setting so that the default username/password access is no longer available. In your container registry in the Azure portal, from the left pane menu under **Settings**, select **Access Keys**.

### Limit container access to host resources

To balance shared host resources across modules, we recommend putting limits on resource consumption per module. These limits ensure that one module can't consume too much memory or CPU usage and prevent other processes from running on the device. The IoT Edge platform does not limit resources for modules by default, since knowing how much resource a given module needs to run optimally requires testing.

Docker provides some constraints that you can use to limit resources like memory and CPU usage. For more information, see [Runtime options with memory, CPUs, and GPUs](https://docs.docker.com/config/containers/resource_constraints/).

These constraints can be applied to individual modules by using create options in deployment manifests. For more information, see [How to configure container create options for IoT Edge modules](how-to-use-create-options.md).

## Next steps

* Learn more about [IoT Edge automatic deployment](module-deployment-monitoring.md).
* See how IoT Edge supports [Continuous integration and continuous deployment](how-to-continuous-integration-continuous-deployment.md).
