---
title: Troubleshoot Azure IoT Edge 
description: Use this article to learn standard diagnostic skills for Azure IoT Edge, like retrieving component status and logs
author: sethmanheim
ms.author: sethm
ms.date: 04/01/2026
ms.topic: troubleshooting-general
ms.service: azure-iot-edge
services: iot-edge
---

# Troubleshoot your IoT Edge device

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

If you experience issues running Azure IoT Edge in your environment, use this article as a guide for troubleshooting and diagnostics.

## Run the 'check' command

Your first step when troubleshooting IoT Edge should be to use the `check` command. It runs a collection of configuration and connectivity tests for common problems. The `check` command is available in [release 1.0.7](https://github.com/Azure/azure-iotedge/releases/tag/1.0.7) and later.

> [!NOTE]
> The troubleshooting tool can't run connectivity checks if the IoT Edge device is behind a proxy server.

Run the `check` command as follows, or include the `--help` flag to see a complete list of options:

```bash
sudo iotedge check
```

The troubleshooting tool runs many checks that it sorts into these three categories:

* **Configuration checks** - The tool examines details that can prevent IoT Edge devices from connecting to the cloud. It includes problems with the config file and the container engine.
* **Connection checks** - The tool verifies that the IoT Edge runtime can access ports on the host device. It also verifies that all the IoT Edge components can connect to the IoT hub. This set of checks returns errors if the IoT Edge device is behind a proxy.
* **Production readiness checks** - The tool looks for recommended production best practices. It checks the state of device certificate authority (CA) certificates and module log file configuration.

The IoT Edge check tool uses a container to run its diagnostics. The container image, `mcr.microsoft.com/azureiotedge-diagnostics:latest`, is available through the [Microsoft Artifact Registry](https://github.com/microsoft/containerregistry) (MAR). If you need to run a check on a device without direct access to the internet, your devices need access to the container image.

In a scenario that uses nested IoT Edge devices, you can get access to the diagnostics image on downstream devices by routing the image pull through the parent devices.

```bash
sudo iotedge check --diagnostics-image-name <parent_device_fqdn_or_ip>:<port_for_api_proxy_module>/azureiotedge-diagnostics:1.5
```

For information about each of the diagnostic checks this tool runs, including what to do if you get an error or warning, see [Built-in troubleshooting functionality](https://github.com/Azure/iotedge/blob/main/doc/troubleshoot-checks.md).

## Gather debug information by using the support-bundle command

When you need to gather logs from an IoT Edge device, the most convenient way is to use the `support-bundle` command. By default, this command collects module, IoT Edge security manager, and container engine logs, `iotedge check` JSON output, and other useful debug information. It compresses them into a single file for easy sharing. The `support-bundle` command is available in [release 1.0.9](https://github.com/Azure/azure-iotedge/releases/tag/1.0.9) and later.

Run the `support-bundle` command with the `--since` flag to specify how long from the past you want to get logs. For example, `6h` gets logs from the last six hours, `6d` gets logs from the last six days, and `6m` gets logs from the last six minutes. Include the `--help` flag to see a complete list of options.

```bash
sudo iotedge support-bundle --since 6h
```

By default, the `support-bundle` command creates a zip file called **support_bundle.zip** in the directory where you run the command. Use the `--output` flag to specify a different path or file name for the output.

For more information about the command, view its help information:

```bash
iotedge support-bundle --help
```

You can also use the built-in direct method call [UploadSupportBundle](how-to-retrieve-iot-edge-logs.md#upload-support-bundle-diagnostics) to upload the output of the support-bundle command to Azure Blob Storage.

> [!WARNING]
> Output from the `support-bundle` command can contain host, device names, module names, and information logged by your modules. Be aware of this inclusion if you share the output in a public forum.

## Review metrics collected from the runtime

The IoT Edge runtime modules produce metrics to help you monitor and understand the health of your IoT Edge devices. Add the **metrics-collector** module to your deployments to handle collecting these metrics and sending them to the cloud for easier monitoring.

For more information, see [Collect and transport metrics](how-to-collect-and-transport-metrics.md).

## Check your IoT Edge version

If you're running an older version of IoT Edge, upgrading might resolve your issue. The `iotedge check` tool checks that the IoT Edge security daemon is the latest version, but it doesn't check the versions of the IoT Edge hub and agent modules. To check the version of the runtime modules on your device, use the commands `iotedge logs edgeAgent` and `iotedge logs edgeHub`. The version number appears in the logs when the module starts up.

For instructions on how to update your device, see [Update IoT Edge](how-to-update-iot-edge.md).

## Verify the installation of IoT Edge on your devices

You can verify the installation of IoT Edge on your devices by [monitoring the edgeAgent module twin](./how-to-monitor-module-twins.md).

To get the latest edgeAgent module twin, run the following command from [Azure Cloud Shell](https://shell.azure.com/):

```azurecli
az iot hub module-twin show --device-id <edge_device_id> --module-id '$edgeAgent' --hub-name <iot_hub_name>
```

This command outputs all the edgeAgent [reported properties](./module-edgeagent-edgehub.md#edgeagent-reported-properties). Here are some helpful ones to monitor the status of the device:

* runtime status
* runtime start time
* runtime last exit time
* runtime restart count

## Check the status of the IoT Edge security manager and its logs

The [IoT Edge security manager](iot-edge-security-manager.md) handles operations like initializing the IoT Edge system at startup and provisioning devices. If IoT Edge isn't starting, the security manager logs can provide useful information.

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

After the IoT Edge security daemon starts, check the logs of the containers to find issues. Start with your deployed containers, and then check the containers that make up the IoT Edge runtime: `edgeAgent` and `edgeHub`. The IoT Edge agent logs usually give you information about the lifecycle of each container. The IoT Edge hub logs give you information about messaging and routing.

You can get the container logs from several places:

* On the IoT Edge device, run the following command to view logs:

  ```bash
  iotedge logs <container name>
  ```

* On the Azure portal, use the built-in troubleshooting tool. For more information, see [Troubleshoot IoT Edge devices from the Azure portal](troubleshoot-in-portal.md).

* Use the [UploadModuleLogs direct method](how-to-retrieve-iot-edge-logs.md#upload-module-logs) to upload the logs of a module to Azure Blob Storage.

## Clean up container logs

By default, the Moby container engine doesn't set container log size limits. Over time, extensive logs can fill up the device and cause it to run out of disk space. If large container logs affect your IoT Edge device performance, use the following command to force-remove the container and its related logs.

If you're still troubleshooting, wait until after you inspect the container logs to take this step.

> [!WARNING]
> If you force-remove the `edgeHub` container while it has an undelivered message backlog and no [host storage](how-to-access-host-storage-from-module.md) configured, the undelivered messages are lost.

```bash
docker rm --force <container name>
```

For more information about ongoing log maintenance and production scenarios, see [Set up default logging driver](production-checklist.md#set-up-default-logging-driver).

## View the messages going through the IoT Edge hub

You can view the messages going through the IoT Edge hub and gather insights from verbose logs from the runtime containers. To turn on verbose logs on these containers, set the `RuntimeLogLevel` environment variable in the deployment manifest.

To view messages going through the IoT Edge hub, set the `RuntimeLogLevel` environment variable to `debug` for the edgeHub module.

Both the **edgeHub** and **edgeAgent** modules have this runtime log environment variable, with the default value set to `info`. This environment variable can take the following values:

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

```bash
iotedge restart <container name>
```

Restart the IoT Edge runtime containers:

```bash
iotedge restart edgeAgent && iotedge restart edgeHub
```

You can also restart modules remotely from the Azure portal. For more information, see [Troubleshoot IoT Edge devices from the Azure portal](troubleshoot-in-portal.md).

## Check your firewall and port configuration rules

Azure IoT Edge supports communication from an on-premises server to Azure cloud by using supported IoT Hub protocols. For more information, see [Choose a device communication protocol](../iot-hub/iot-hub-devguide-protocols.md). For enhanced security, always configure communication channels between Azure IoT Edge and Azure IoT Hub as outbound. This configuration, based on the [Service Assisted Communication pattern](/archive/blogs/clemensv/service-assisted-communication-for-connected-devices), minimizes the attack surface for a malicious entity. Inbound communication is only required for [specific scenarios](#anchortext) where Azure IoT Hub needs to push messages to the Azure IoT Edge device. Cloud-to-device messages are protected by using secure TLS channels and can be further secured by using X.509 certificates and TPM device modules. The Azure IoT Edge Security Manager controls how this communication can be established. For more information, see [Azure IoT Edge security manager](../iot-edge/iot-edge-security-manager.md).

While IoT Edge provides enhanced configuration for securing Azure IoT Edge runtime and deployed modules, it's still dependent on the underlying machine and network configuration. Ensure proper network and firewall rules are set up for secure edge-to-cloud communication. Use the following table as a guideline when configuring firewall rules for the underlying servers where Azure IoT Edge runtime is hosted:

| Protocol | Port | Incoming | Outgoing | Guidance |
|--|--|--|--|--|
| MQTT | 8883 | BLOCKED (Default) | BLOCKED (Default) | <ul> <li>Configure Outgoing (Outbound) to be Open when using MQTT as the communication protocol.<li>IoT Edge doesn't support port 1883 for MQTT.<li>Incoming (Inbound) connections should be blocked.</ul> |
| AMQP | 5671 | BLOCKED (Default) | OPEN (Default) | <ul> <li>Default communication protocol for IoT Edge. <li> Must be configured to be Open if Azure IoT Edge isn't configured for other supported protocols or AMQP is the desired communication protocol.<li>IoT Edge doesn't support port 5672 for AMQP.<li>Block this port when Azure IoT Edge uses a different IoT Hub supported protocol.<li>Incoming (Inbound) connections should be blocked.</ul></ul> |
| HTTPS | 443 | BLOCKED (Default) | OPEN (Default) | <ul> <li>Configure Outgoing (Outbound) to be Open on 443 for IoT Edge provisioning. This configuration is required when using manual scripts or Azure IoT Device Provisioning Service (DPS). <li><a id="anchortext">Incoming (Inbound) connection</a> should be Open only for specific scenarios: <ul> <li>  If you have a transparent gateway with downstream devices that can send method requests. In this case, port 443 doesn't need to be open to external networks to connect to IoT Hub or provide IoT Hub services through Azure IoT Edge. Thus the incoming rule could be restricted to only open Incoming (Inbound) from the internal network. <li> For Client to Device (C2D) scenarios.</ul><li>IoT Edge doesn't support port 80 for HTTP.<li>If non-HTTP protocols (for example, AMQP or MQTT) can't be configured in the enterprise; the messages can be sent over WebSockets. Port 443 is used for WebSocket communication in that case.</ul> |

## Last resort: stop and recreate all containers

Sometimes, a system might require significant special modification to work with existing networking or operating system constraints. For example, a system could require a different data disk mount and proxy settings. If you try all previous steps and still get container failures, the docker system caches or persisted network settings might not be up to date with the latest reconfiguration. In this case, use [`docker prune`](https://docs.docker.com/engine/reference/commandline/system_prune/) to get a clean start from scratch. 

The following command stops the IoT Edge system (and thus all containers), and uses the `all` and `volume` options for `docker prune` to remove all containers and volumes. Review the warning that the command issues and confirm by using `y` when ready.

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

Are you sure you want to continue? [Y/N]
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

Do you think you found a bug in the IoT Edge platform? [Submit an issue](https://github.com/Azure/iotedge/issues) so the team can continue to improve the platform.

If you have more questions, create a [Support request](https://portal.azure.com/#create/Microsoft.Support) for help.
