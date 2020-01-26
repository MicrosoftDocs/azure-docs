---
title: Prepare to deploy your solution in production - Azure IoT Edge
description: Learn how to take your Azure IoT Edge solution from development to production, including setting up your devices with the appropriate certificates and making a deployment plan for future code updates. 
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 08/09/2019
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Prepare to deploy your IoT Edge solution in production

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

Every IoT Edge device in production needs a device certificate authority (CA) certificate installed on it. That CA certificate is then declared to the IoT Edge runtime in the config.yaml file. For development and testing scenarios, the IoT Edge runtime creates temporary certificates if no certificates are declared in the config.yaml file. However, these temporary certificates expire after three months and aren't secure for production scenarios.

To understand the role of the device CA certificate, see [How Azure IoT Edge uses certificates](iot-edge-certs.md).

For more information about how to install certificates on an IoT Edge device and reference them from the config.yaml file, see [Install production certificates on an IoT Edge device](how-to-create-transparent-gateway.md).

### Have a device management plan

Before you put any device in production you should know how you're going to manage future updates. For an IoT Edge device, the list of components to update may include:

* Device firmware
* Operating system libraries
* Container engine, like Moby
* IoT Edge daemon
* CA certificates

For more information, see [Update the IoT Edge runtime](how-to-update-iot-edge.md). The current methods for updating the IoT Edge daemon require physical or SSH access to the IoT Edge device. If you have many devices to update, consider adding the update steps to a script or use an automation tool like Ansible.

### Use Moby as the container engine

A container engine is a prerequisite for any IoT Edge device. Only moby-engine is supported in production. Other container engines, like Docker, do work with IoT Edge and it's ok to use these engines for development. The moby-engine can be redistributed when used with Azure IoT Edge, and Microsoft provides servicing for this engine.

### Choose upstream protocol

You can configure the protocol (which determines the port used) for upstream communication to IoT Hub for both the IoT Edge agent and the IoT Edge hub. The default protocol is AMQP, but you may want to change that depending on your network setup.

The two runtime modules both have an **UpstreamProtocol** environment variable. The valid values for the variable are:

* MQTT
* AMQP
* MQTTWS
* AMQPWS

Configure the UpstreamProtocol variable for the IoT Edge agent in the config.yaml file on the device itself. For example, if your IoT Edge device is behind a proxy server that blocks AMQP ports, you may need to configure the IoT Edge agent to use AMQP over WebSocket (AMQPWS) to establish the initial connection to IoT Hub.

Once your IoT Edge device connects, be sure to continue configuring the UpstreamProtocol variable for both runtime modules in future deployments. An example of this process is provided in [Configure an IoT Edge device to communicate through a proxy server](how-to-configure-proxy-support.md).

## Deployment

* **Helpful**
  * Be consistent with upstream protocol
  * Set up host storage for system modules
  * Reduce memory space used by the IoT Edge hub
  * Do not use debug versions of module images

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

For more information, see [Stability issues on resource constrained devices](troubleshoot.md#stability-issues-on-resource-constrained-devices).

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

### Do not use debug versions of module images

When moving from test scenarios to production scenarios, remember to remove debug configurations from deployment manifests. Check that none of the module images in the deployment manifests have the **\.debug** suffix. If you added create options to expose ports in the modules for debugging, remove those create options as well.

## Container management

* **Important**
  * Manage access to your container registry
  * Use tags to manage versions

### Manage access to your container registry

Before you deploy modules to production IoT Edge devices, ensure that you control access to your container registry so that outsiders can't access or make changes to your container images. Use a private, not public, container registry to manage container images.

In the tutorials and other documentation, we instruct you to use the same container registry credentials on your IoT Edge device as you use on your development machine. These instructions are only intended to help you set up testing and development environments more easily, and should not be followed in a production scenario. Azure Container Registry recommends [authenticating with service principals](../container-registry/container-registry-auth-service-principal.md) when applications or services pull container images in an automated or otherwise unattended manner, as IoT Edge devices do. Create a service principal with read-only access to your container registry, and provide that username and password in the deployment manifest.

### Use tags to manage versions

A tag is a docker concept that you can use to distinguish between versions of docker containers. Tags are suffixes like **1.0** that go on the end of a container repository. For example, **mcr.microsoft.com/azureiotedge-agent:1.0**. Tags are mutable and can be changed to point to another container at any time, so your team should agree on a convention to follow as you update your module images moving forward.

Tags also help you to enforce updates on your IoT Edge devices. When you push an updated version of a module to your container registry, increment the tag. Then, push a new deployment to your devices with the tag incremented. The container engine will recognize the incremented tag as a new version and will pull the latest module version down to your device.

For an example of a tag convention, see [Update the IoT Edge runtime](how-to-update-iot-edge.md#understand-iot-edge-tags) to learn how IoT Edge uses rolling tags and specific tags to track versions.

## Networking

* **Helpful**
  * Review outbound/inbound configuration
  * Allow connections from IoT Edge devices
  * Configure communication through a proxy

### Review outbound/inbound configuration

Communication channels between Azure IoT Hub and IoT Edge are always configured to be outbound. For most IoT Edge scenarios, only three connections are necessary. The container engine needs to connect with the container registry (or registries) that holds the module images. The IoT Edge runtime needs to connect with IoT Hub to retrieve device configuration information, and to send messages and telemetry. And if you use automatic provisioning, the IoT Edge daemon needs to connect to the Device Provisioning Service. For more information, see [Firewall and port configuration rules](troubleshoot.md#firewall-and-port-configuration-rules-for-iot-edge-deployment).

### Allow connections from IoT Edge devices

If your networking setup requires that you explicitly permit connections made from IoT Edge devices, review the following list of IoT Edge components:

* **IoT Edge agent** opens a persistent AMQP/MQTT connection to IoT Hub, possibly over WebSockets.
* **IoT Edge hub** opens a single persistent AMQP connection or multiple MQTT connections to IoT Hub, possibly over WebSockets.
* **IoT Edge daemon** makes intermittent HTTPS calls to IoT Hub.

In all three cases, the DNS name would match the pattern \*.azure-devices.net.

Additionally, the **Container engine** makes calls to container registries over HTTPS. To retrieve the IoT Edge runtime container images, the DNS name is mcr.microsoft.com. The container engine connects to other registries as configured in the deployment.

This checklist is a starting point for firewall rules:

   | URL (\* = wildcard) | Outbound TCP Ports | Usage |
   | ----- | ----- | ----- |
   | mcr.microsoft.com  | 443 | Microsoft container registry |
   | global.azure-devices-provisioning.net  | 443 | DPS access (optional) |
   | \*.azurecr.io | 443 | Personal and third-party container registries |
   | \*.blob.core.windows.net | 443 | Download Azure Container Registry image deltas from blob storage |
   | \*.azure-devices.net | 5671, 8883, 443 | IoT Hub access |
   | \*.docker.io  | 443 | Docker Hub access (optional) |

Some of these firewall rules are inherited from Azure Container Registry. For more information, see [Configure rules to access an Azure container registry behind a firewall](../container-registry/container-registry-firewall-access-rules.md).

### Configure communication through a proxy

If your devices are going to be deployed on a network that uses a proxy server, they need to be able to communicate through the proxy to reach IoT Hub and container registries. For more information, see [Configure an IoT Edge device to communicate through a proxy server](how-to-configure-proxy-support.md).

## Solution management

* **Helpful**
  * Set up logs and diagnostics
  * Consider tests and CI/CD pipelines

### Set up logs and diagnostics

On Linux, the IoT Edge daemon uses journals as the default logging driver. You can use the command-line tool `journalctl` to query the daemon logs. On Windows, the IoT Edge daemon uses PowerShell diagnostics. Use `Get-IoTEdgeLog` to query logs from the daemon. IoT Edge modules use the JSON driver for logging, which is the  default.  

```powershell
. {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; Get-IoTEdgeLog
```

When you're testing an IoT Edge deployment, you can usually access your devices to retrieve logs and troubleshoot. In a deployment scenario, you may not have that option. Consider how you're going to gather information about your devices in production. One option is to use a logging module that collects information from the other modules and sends it to the cloud. One example of a logging module is [logspout-loganalytics](https://github.com/veyalla/logspout-loganalytics), or you can design your own.

### Place limits on log size

By default the Moby container engine does not set container log size limits. Over time this can lead to the device filling up with logs and running out of disk space. Consider the following options to prevent this:

#### Option: Set global limits that apply to all container modules

You can limit the size of all container logfiles in the container engine log options. The following example sets the log driver to `json-file` (recommended) with limits on size and number of files:

```JSON
{
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "10m",
        "max-file": "3"
    }
}
```

Add (or append) this information to a file named `daemon.json` and place it the right location for your device platform.

| Platform | Location |
| -------- | -------- |
| Linux | `/etc/docker/` |
| Windows | `C:\ProgramData\iotedge-moby\config\` |

The container engine must be restarted for the changes to take effect.

#### Option: Adjust log settings for each container module

You can do so in the **createOptions** of each module. For example:

```yml
"createOptions": {
    "HostConfig": {
        "LogConfig": {
            "Type": "json-file",
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

For the most efficient IoT Edge deployment scenario, consider integrating your production deployment into your testing and CI/CD pipelines. Azure IoT Edge supports multiple CI/CD platforms, including Azure DevOps. For more information, see [Continuous integration and continuous deployment to Azure IoT Edge](how-to-ci-cd.md).

## Next steps

* Learn more about [IoT Edge automatic deployment](module-deployment-monitoring.md).
* See how IoT Edge supports [Continuous integration and continuous deployment](how-to-ci-cd.md).
