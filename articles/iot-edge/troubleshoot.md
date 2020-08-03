---
title: Troubleshoot - Azure IoT Edge | Microsoft Docs 
description: Use this article to learn standard diagnostic skills for Azure IoT Edge, like retrieving component status and logs
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 04/27/2020
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Troubleshoot your IoT Edge device

If you experience issues running Azure IoT Edge in your environment, use this article as a guide for troubleshooting and diagnostics.

## Run the 'check' command

Your first step when troubleshooting IoT Edge should be to use the `check` command, which runs a collection of configuration and connectivity tests for common issues. The `check` command is available in [release 1.0.7](https://github.com/Azure/azure-iotedge/releases/tag/1.0.7) and later.

>[!NOTE]
>The troubleshooting tool can't run connectivity checks if the IoT Edge device is behind a proxy server.

You can run the `check` command as follows, or include the `--help` flag to see a complete list of options:

On Linux:

```bash
sudo iotedge check
```

On Windows:

```powershell
iotedge check
```

The troubleshooting tool runs many checks that are sorted into these three categories:

* *Configuration checks* examines details that could prevent IoT Edge devices from connecting to the cloud, including issues with *config.yaml* and the container engine.
* *Connection checks* verify that the IoT Edge runtime can access ports on the host device and that all the IoT Edge components can connect to the IoT Hub. This set of checks returns errors if the IoT Edge device is behind a proxy.
* *Production readiness checks* look for recommended production best practices, such as the state of device certificate authority (CA) certificates and module log file configuration.

For information about each of the diagnostic checks this tool runs, including what to do if you get an error or warning, see [IoT Edge troubleshoot checks](https://github.com/Azure/iotedge/blob/master/doc/troubleshoot-checks.md).

## Gather debug information with 'support-bundle' command

When you need to gather logs from an IoT Edge device, the most convenient way is to use the `support-bundle` command. By default, this command collects module, IoT Edge security manager and container engine logs, `iotedge check` JSON output, and other useful debug information. It compresses them into a single file for easy sharing. The `support-bundle` command is available in [release 1.0.9](https://github.com/Azure/azure-iotedge/releases/tag/1.0.9) and later.

Run the `support-bundle` command with the `--since` flag to specify how long from the past you want to get logs. For example `6h` will get logs since the last six hours, `6d` since the last six days, `6m` since the last six minutes and so on. Include the `--help` flag to see a complete list of options.

On Linux:

```bash
sudo iotedge support-bundle --since 6h
```

On Windows:

```powershell
iotedge support-bundle --since 6h
```

> [!WARNING]
> Output from the `support-bundle` command can contain host, device and module names, information logged by your modules etc. Please be aware of this if sharing the output in a public forum.

## Check your IoT Edge version

If you're running an older version of IoT Edge, then upgrading may resolve your issue. The `iotedge check` tool checks that the IoT Edge security daemon is the latest version, but does not check the versions of the IoT Edge hub and agent modules. To check the version of the runtime modules on your device, use the commands `iotedge logs edgeAgent` and `iotedge logs edgeHub`. The version number is declared in the logs when the module starts up.

For instructions on how to update your device, see [Update the IoT Edge security daemon and runtime](how-to-update-iot-edge.md).

## Check the status of the IoT Edge security manager and its logs

The [IoT Edge security manager](iot-edge-security-manager.md) is responsible for operations like initializing the IoT Edge system at startup and provisioning devices. If IoT Edge isn't starting, the security manager logs may provide useful information.

On Linux:

* View the status of the IoT Edge security manager:

   ```bash
   sudo systemctl status iotedge
   ```

* View the logs of the IoT Edge security manager:

    ```bash
    sudo journalctl -u iotedge -f
    ```

* View more detailed logs of the IoT Edge security manager:

  * Edit the IoT Edge daemon settings:

      ```bash
      sudo systemctl edit iotedge.service
      ```

  * Update the following lines:

      ```bash
      [Service]
      Environment=IOTEDGE_LOG=edgelet=debug
      ```

  * Restart the IoT Edge Security Daemon:

      ```bash
      sudo systemctl cat iotedge.service
      sudo systemctl daemon-reload
      sudo systemctl restart iotedge
      ```

On Windows:

* View the status of the IoT Edge security manager:

   ```powershell
   Get-Service iotedge
   ```

* View the logs of the IoT Edge security manager:

   ```powershell
   . {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; Get-IoTEdgeLog
   ```

* View only the last 5 minutes of the IoT Edge security manager logs:

   ```powershell
   . {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; Get-IoTEdgeLog -StartTime ([datetime]::Now.AddMinutes(-5))
   ```

* View more detailed logs of the IoT Edge security manager:

  * Add a system-level environment variable:

      ```powershell
      [Environment]::SetEnvironmentVariable("IOTEDGE_LOG", "edgelet=debug", [EnvironmentVariableTarget]::Machine)
      ```

  * Restart the IoT Edge Security Daemon:

      ```powershell
      Restart-Service iotedge
      ```

### If the IoT Edge security manager is not running, verify your yaml configuration file

> [!WARNING]
> YAML files cannot contain tabs as indentation. Use 2 spaces instead. Top-level elements should have no leading spaces.

On Linux:

   ```bash
   sudo nano /etc/iotedge/config.yaml
   ```

On Windows:

   ```cmd
   notepad C:\ProgramData\iotedge\config.yaml
   ```

### Restart the IoT Edge security manager

If issue is still persisting, you can try restarting the IoT Edge security manager.

On Linux:

   ```cmd
   sudo systemctl restart iotedge
   ```

On Windows:

   ```powershell
   Stop-Service iotedge -NoWait
   sleep 5
   Start-Service iotedge
   ```

## Check container logs for issues

Once the IoT Edge security daemon is running, look at the logs of the containers to detect issues. Start with your deployed containers, then look at the containers that make up the IoT Edge runtime: edgeAgent and edgeHub. The IoT Edge agent logs typically provide info on the lifecycle of each container. The IoT Edge hub logs provide info on messaging and routing.

```cmd
iotedge logs <container name>
```

## View the messages going through the IoT Edge hub

You can view the messages going through the IoT Edge hub, and gather insights from verbose logs from the runtime containers. To turn on verbose logs on these containers, set `RuntimeLogLevel` in your yaml configuration file. To open the file:

On Linux:

   ```bash
   sudo nano /etc/iotedge/config.yaml
   ```

On Windows:

   ```cmd
   notepad C:\ProgramData\iotedge\config.yaml
   ```

By default, the `agent` element will look like the following example:

   ```yaml
   agent:
     name: edgeAgent
     type: docker
     env: {}
     config:
       image: mcr.microsoft.com/azureiotedge-agent:1.0
       auth: {}
   ```

Replace `env: {}` with:

   ```yaml
   env:
     RuntimeLogLevel: debug
   ```

   > [!WARNING]
   > YAML files cannot contain tabs as identation. Use 2 spaces instead. Top-level items cannot have leading whitespace.

Save the file and restart the IoT Edge security manager.

You can also check the messages being sent between IoT Hub and the IoT Edge devices. View these messages by using the [Azure IoT Hub extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit). For more information, see [Handy tool when you develop with Azure IoT](https://blogs.msdn.microsoft.com/iotdev/2017/09/01/handy-tool-when-you-develop-with-azure-iot/).

## Restart containers

After investigating the logs and messages for information, you can try restarting containers:

```cmd
iotedge restart <container name>
```

Restart the IoT Edge runtime containers:

```cmd
iotedge restart edgeAgent && iotedge restart edgeHub
```

## Check your firewall and port configuration rules

Azure IoT Edge allows communication from an on-premises server to Azure cloud using supported IoT Hub protocols, see [choosing a communication protocol](../iot-hub/iot-hub-devguide-protocols.md). For enhanced security, communication channels between Azure IoT Edge and Azure IoT Hub are always configured to be Outbound. This configuration is based on the [Services Assisted Communication pattern](https://blogs.msdn.microsoft.com/clemensv/2014/02/09/service-assisted-communication-for-connected-devices/), which minimizes the attack surface for a malicious entity to explore. Inbound communication is only required for specific scenarios where Azure IoT Hub needs to push messages to the Azure IoT Edge device. Cloud-to-device messages are protected using secure TLS channels and can be further secured using X.509 certificates and TPM device modules. The Azure IoT Edge Security Manager governs how this communication can be established, see [IoT Edge Security Manager](../iot-edge/iot-edge-security-manager.md).

While IoT Edge provides enhanced configuration for securing Azure IoT Edge runtime and deployed modules, it is still dependent on the underlying machine and network configuration. Hence, it is imperative to ensure proper network and firewall rules are set up for secure edge to cloud communication. The following table can be used as a guideline when configuration firewall rules for the underlying servers where Azure IoT Edge runtime is hosted:

|Protocol|Port|Incoming|Outgoing|Guidance|
|--|--|--|--|--|
|MQTT|8883|BLOCKED (Default)|BLOCKED (Default)|<ul> <li>Configure Outgoing (Outbound) to be Open when using MQTT as the communication protocol.<li>1883 for MQTT is not supported by IoT Edge. <li>Incoming (Inbound) connections should be blocked.</ul>|
|AMQP|5671|BLOCKED (Default)|OPEN (Default)|<ul> <li>Default communication protocol for IoT Edge. <li> Must be configured to be Open if Azure IoT Edge is not configured for other supported protocols or AMQP is the desired communication protocol.<li>5672 for AMQP is not supported by IoT Edge.<li>Block this port when Azure IoT Edge uses a different IoT Hub supported protocol.<li>Incoming (Inbound) connections should be blocked.</ul></ul>|
|HTTPS|443|BLOCKED (Default)|OPEN (Default)|<ul> <li>Configure Outgoing (Outbound) to be Open on 443 for IoT Edge provisioning. This configuration is required when using manual scripts or Azure IoT Device Provisioning Service (DPS). <li>Incoming (Inbound) connection should be Open only for specific scenarios: <ul> <li>  If you have a transparent gateway with leaf devices that may send method requests. In this case, Port 443 does not need to be open to external networks to connect to IoTHub or provide IoTHub services through Azure IoT Edge. Thus the incoming rule could be restricted to only open Incoming (Inbound) from the internal network. <li> For Client to Device (C2D) scenarios.</ul><li>80 for HTTP is not supported by IoT Edge.<li>If non-HTTP protocols (for example, AMQP or MQTT) cannot be configured in the enterprise; the messages can be sent over WebSockets. Port 443 will be used for WebSocket communication in that case.</ul>|

## Next steps

Do you think that you found a bug in the IoT Edge platform? [Submit an issue](https://github.com/Azure/iotedge/issues) so that we can continue to improve.

If you have more questions, create a [Support request](https://portal.azure.com/#create/Microsoft.Support) for help.
