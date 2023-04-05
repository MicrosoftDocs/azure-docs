---
title: Troubleshoot - Azure IoT Edge | Microsoft Docs 
description: Use this article to learn standard diagnostic skills for Azure IoT Edge, like retrieving component status and logs
author: PatAltimore

ms.author: patricka
ms.date: 08/25/2022
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Troubleshoot your IoT Edge device

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

If you experience issues running Azure IoT Edge in your environment, use this article as a guide for troubleshooting and diagnostics.

## Run the 'check' command

Your first step when troubleshooting IoT Edge should be to use the `check` command, which runs a collection of configuration and connectivity tests for common issues. The `check` command is available in [release 1.0.7](https://github.com/Azure/azure-iotedge/releases/tag/1.0.7) and later.

>[!NOTE]
>The troubleshooting tool can't run connectivity checks if the IoT Edge device is behind a proxy server.

You can run the `check` command as follows, or include the `--help` flag to see a complete list of options:


```bash
sudo iotedge check
```

The troubleshooting tool runs many checks that are sorted into these three categories:

* *Configuration checks* examine details that could prevent IoT Edge devices from connecting to the cloud, including issues with the config file and the container engine.
* *Connection checks* verify that the IoT Edge runtime can access ports on the host device and that all the IoT Edge components can connect to the IoT Hub. This set of checks returns errors if the IoT Edge device is behind a proxy.
* *Production readiness checks* look for recommended production best practices, such as the state of device certificate authority (CA) certificates and module log file configuration.

The IoT Edge check tool uses a container to run its diagnostics. The container image, `mcr.microsoft.com/azureiotedge-diagnostics:latest`, is available through the [Microsoft Container Registry](https://github.com/microsoft/containerregistry). If you need to run a check on a device without direct access to the internet, your devices will need access to the container image.

In a scenario using nested IoT Edge devices, you can get access to the diagnostics image on downstream devices by routing the image pull through the parent devices.

```bash
sudo iotedge check --diagnostics-image-name <parent_device_fqdn_or_ip>:<port_for_api_proxy_module>/azureiotedge-diagnostics:1.2
```

For information about each of the diagnostic checks this tool runs, including what to do if you get an error or warning, see [IoT Edge troubleshoot checks](https://github.com/Azure/iotedge/blob/master/doc/troubleshoot-checks.md).

## Gather debug information with 'support-bundle' command

When you need to gather logs from an IoT Edge device, the most convenient way is to use the `support-bundle` command. By default, this command collects module, IoT Edge security manager and container engine logs, `iotedge check` JSON output, and other useful debug information. It compresses them into a single file for easy sharing. The `support-bundle` command is available in [release 1.0.9](https://github.com/Azure/azure-iotedge/releases/tag/1.0.9) and later.

Run the `support-bundle` command with the `--since` flag to specify how long from the past you want to get logs. For example `6h` will get logs since the last six hours, `6d` since the last six days, `6m` since the last six minutes and so on. Include the `--help` flag to see a complete list of options.

```bash
sudo iotedge support-bundle --since 6h
```

By default, the `support-bundle` command creates a zip file called **support_bundle.zip** in the directory where the command is called. Use the flag `--output` to specify a different path or file name for the output.

For more information about the command, view its help information.

```bash/cmd
iotedge support-bundle --help
```

You can also use the built-in direct method call [UploadSupportBundle](how-to-retrieve-iot-edge-logs.md#upload-support-bundle-diagnostics) to upload the output of the support-bundle command to Azure Blob Storage.

> [!WARNING]
> Output from the `support-bundle` command can contain host, device and module names, information logged by your modules etc. Please be aware of this if sharing the output in a public forum.

## Review metrics collected from the runtime

The IoT Edge runtime modules produce metrics to help you monitor and understand the health of your IoT Edge devices. Add the **metrics-collector** module to your deployments to handle collecting these metrics and sending them to the cloud for easier monitoring.

For more information, see [Collect and transport metrics](how-to-collect-and-transport-metrics.md).

## Check your IoT Edge version

If you're running an older version of IoT Edge, then upgrading may resolve your issue. The `iotedge check` tool checks that the IoT Edge security daemon is the latest version, but doesn't check the versions of the IoT Edge hub and agent modules. To check the version of the runtime modules on your device, use the commands `iotedge logs edgeAgent` and `iotedge logs edgeHub`. The version number is declared in the logs when the module starts up.

For instructions on how to update your device, see [Update the IoT Edge security daemon and runtime](how-to-update-iot-edge.md).

## Verify the installation of IoT Edge on your devices

You can verify the installation of IoT Edge on your devices by [monitoring the edgeAgent module twin](./how-to-monitor-module-twins.md).

To get the latest edgeAgent module twin, run the following command from [Azure Cloud Shell](https://shell.azure.com/):

   ```azurecli-interactive
   az iot hub module-twin show --device-id <edge_device_id> --module-id '$edgeAgent' --hub-name <iot_hub_name>
   ```

This command will output all the edgeAgent [reported properties](./module-edgeagent-edgehub.md). Here are some helpful ones monitor the status of the device:

* runtime status
* runtime start time
* runtime last exit time
* runtime restart count

## Check the status of the IoT Edge security manager and its logs

The [IoT Edge security manager](iot-edge-security-manager.md) is responsible for operations like initializing the IoT Edge system at startup and provisioning devices. If IoT Edge isn't starting, the security manager logs may provide useful information.

* View the status of the IoT Edge system services:

   ```bash
   sudo iotedge system status
   ```

* View the logs of the IoT Edge system services:

   ```bash
   sudo iotedge system logs -- -f
   ```

* Enable debug-level logs to view more detailed logs of the IoT Edge system services:

  1. Enable debug-level logs.

     ```bash
     sudo iotedge system set-log-level debug
     sudo iotedge system restart
     ```

  1. Switch back to the default info-level logs after debugging.

     ```bash
     sudo iotedge system set-log-level info
     sudo iotedge system restart
     ```

## Check container logs for issues

Once the IoT Edge security daemon is running, look at the logs of the containers to detect issues. Start with your deployed containers, then look at the containers that make up the IoT Edge runtime: edgeAgent and edgeHub. The IoT Edge agent logs typically provide info on the lifecycle of each container. The IoT Edge hub logs provide info on messaging and routing.

You can retrieve the container logs from several places:

* On the IoT Edge device, run the following command to view logs:

  ```cmd
  iotedge logs <container name>
  ```

* On the Azure portal, use the built-in troubleshoot tool. [Monitor and troubleshoot IoT Edge devices from the Azure portal](troubleshoot-in-portal.md)

* Use the [UploadModuleLogs direct method](how-to-retrieve-iot-edge-logs.md#upload-module-logs) to upload the logs of a module to Azure Blob Storage.

## Clean up container logs

By default the Moby container engine doesn't set container log size limits. Over time extensive logs can lead to the device filling up with logs and running out of disk space. If large container logs are affecting your IoT Edge device performance, use the following command to force remove the container along with its related logs.

If you're still troubleshooting, wait until after you've inspected the container logs to take this step.

>[!WARNING]
>If you force remove the edgeHub container while it has an undelivered message backlog and no [host storage](how-to-access-host-storage-from-module.md) set up, the undelivered messages will be lost.

```cmd
docker rm --force <container name>
```

For ongoing logs maintenance and production scenarios, [Set up default logging driver](production-checklist.md#set-up-default-logging-driver).

## View the messages going through the IoT Edge hub

You can view the messages going through the IoT Edge hub and gather insights from verbose logs from the runtime containers. To turn on verbose logs on these containers, set the `RuntimeLogLevel` environment variable in the deployment manifest.

To view messages going through the IoT Edge hub, set the `RuntimeLogLevel` environment variable to `debug` for the edgeHub module.

Both the edgeHub and edgeAgent modules have this runtime log environment variable, with the default value set to `info`. This environment variable can take the following values:

* fatal
* error
* warning
* info
* debug
* verbose

You can also check the messages being sent between IoT Hub and IoT devices. View these messages by using the [Azure IoT Hub extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit). For more information, see [Handy tool when you develop with Azure IoT](https://blogs.msdn.microsoft.com/iotdev/2017/09/01/handy-tool-when-you-develop-with-azure-iot/).

## Restart containers

After investigating the logs and messages for information, you can try restarting containers.

On the IoT Edge device, use the following commands to restart modules:

```cmd
iotedge restart <container name>
```

Restart the IoT Edge runtime containers:

```cmd
iotedge restart edgeAgent && iotedge restart edgeHub
```

You can also restart modules remotely from the Azure portal. For more information, see [Monitor and troubleshoot IoT Edge devices from the Azure portal](troubleshoot-in-portal.md).

## Check your firewall and port configuration rules

Azure IoT Edge allows communication from an on-premises server to Azure cloud using supported IoT Hub protocols, see [choosing a communication protocol](../iot-hub/iot-hub-devguide-protocols.md). For enhanced security, communication channels between Azure IoT Edge and Azure IoT Hub are always configured to be Outbound. This configuration is based on the [Services Assisted Communication pattern](/archive/blogs/clemensv/service-assisted-communication-for-connected-devices), which minimizes the attack surface for a malicious entity to explore. Inbound communication is only required for [specific scenarios](#anchortext) where Azure IoT Hub needs to push messages to the Azure IoT Edge device. Cloud-to-device messages are protected using secure TLS channels and can be further secured using X.509 certificates and TPM device modules. The Azure IoT Edge Security Manager governs how this communication can be established, see [IoT Edge Security Manager](../iot-edge/iot-edge-security-manager.md).

While IoT Edge provides enhanced configuration for securing Azure IoT Edge runtime and deployed modules, it's still dependent on the underlying machine and network configuration. Hence, it's imperative to ensure proper network and firewall rules are set up for secure edge to cloud communication. The following table can be used as a guideline when configuration firewall rules for the underlying servers where Azure IoT Edge runtime is hosted:

|Protocol|Port|Incoming|Outgoing|Guidance|
|--|--|--|--|--|
|MQTT|8883|BLOCKED (Default)|BLOCKED (Default)|<ul> <li>Configure Outgoing (Outbound) to be Open when using MQTT as the communication protocol.<li>1883 for MQTT isn't supported by IoT Edge. <li>Incoming (Inbound) connections should be blocked.</ul>|
|AMQP|5671|BLOCKED (Default)|OPEN (Default)|<ul> <li>Default communication protocol for IoT Edge. <li> Must be configured to be Open if Azure IoT Edge isn't configured for other supported protocols or AMQP is the desired communication protocol.<li>5672 for AMQP isn't supported by IoT Edge.<li>Block this port when Azure IoT Edge uses a different IoT Hub supported protocol.<li>Incoming (Inbound) connections should be blocked.</ul></ul>|
|HTTPS|443|BLOCKED (Default)|OPEN (Default)|<ul> <li>Configure Outgoing (Outbound) to be Open on 443 for IoT Edge provisioning. This configuration is required when using manual scripts or Azure IoT Device Provisioning Service (DPS). <li><a id="anchortext">Incoming (Inbound) connection</a> should be Open only for specific scenarios: <ul> <li>  If you have a transparent gateway with downstream devices that may send method requests. In this case, Port 443 doesn't need to be open to external networks to connect to IoTHub or provide IoTHub services through Azure IoT Edge. Thus the incoming rule could be restricted to only open Incoming (Inbound) from the internal network. <li> For Client to Device (C2D) scenarios.</ul><li>80 for HTTP isn't supported by IoT Edge.<li>If non-HTTP protocols (for example, AMQP or MQTT) can't be configured in the enterprise; the messages can be sent over WebSockets. Port 443 will be used for WebSocket communication in that case.</ul>|


## Last resort: stop and recreate all containers

Sometimes, a system might require significant special modification to work with existing networking or operating system constraints. For example, a system could require a different data disk mount and proxy settings. If you tried all previous steps and still get container failures, the docker system caches or persisted network settings might not up to date with the latest reconfiguration. In this case, the last resort option is to use [`docker prune`](https://docs.docker.com/engine/reference/commandline/system_prune/) get a clean start from scratch. 

The following command stops the IoT Edge system (and thus all containers), uses the "all" and "volume" option for `docker prune` to remove all containers and volumes. Review the warning that the command issues and confirm with `y` when ready.

```bash
sudo iotedge system stop
docker system prune --all --volumes
```

```output
WARNING! This will remove:
  - all stopped containers
  - all networks not used by at least one container
  - all volumes not used by at least one container
  - all images without at least one container associated to them
  - all build cache

Are you sure you want to continue? [y/N]
```

Start the system again. To be safe, apply any potentially remaining configuration and start the system with one command.

```bash
sudo iotedge config apply
```

Wait a few minutes and check again. 

```bash
sudo iotedge list
```

## Next steps

Do you think that you found a bug in the IoT Edge platform? [Submit an issue](https://github.com/Azure/iotedge/issues) so that we can continue to improve.

If you have more questions, create a [Support request](https://portal.azure.com/#create/Microsoft.Support) for help.
