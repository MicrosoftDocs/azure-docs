---
title: Common errors - Azure IoT Edge | Microsoft Docs 
description: Use this article to resolve common issues encountered when deploying an IoT Edge solution
author: PatAltimore

ms.author: patricka
ms.date: 02/28/2022
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
ms.custom:  [amqp, mqtt]
---

# Common issues and resolutions for Azure IoT Edge

[!INCLUDE [iot-edge-version-1.1-or-1.4](./includes/iot-edge-version-1.1-or-1.4.md)]

Use this article to find steps to resolve common issues that you may experience when deploying IoT Edge solutions. If you need to learn how to find logs and errors from your IoT Edge device, see [Troubleshoot your IoT Edge device](troubleshoot.md).

## IoT Edge agent stops after about a minute

**Observed behavior:**

The edgeAgent module starts and runs successfully for about a minute, then stops. The logs indicate that the IoT Edge agent attempts to connect to IoT Hub over AMQP, and then attempts to connect using AMQP over WebSocket. When that fails, the IoT Edge agent exits.

Example edgeAgent logs:

```output
2017-11-28 18:46:19 [INF] - Starting module management agent.
2017-11-28 18:46:19 [INF] - Version - 1.0.7516610 (03c94f85d0833a861a43c669842f0817924911d5)
2017-11-28 18:46:19 [INF] - Edge agent attempting to connect to IoT Hub via AMQP...
2017-11-28 18:46:49 [INF] - Edge agent attempting to connect to IoT Hub via AMQP over WebSocket...
```

**Root cause:**

A networking configuration on the host network is preventing the IoT Edge agent from reaching the network. The agent attempts to connect over AMQP (port 5671) first. If the connection fails, it tries WebSockets (port 443).

The IoT Edge runtime sets up a network for each of the modules to communicate on. On Linux, this network is a bridge network. On Windows, it uses NAT. This issue is more common on Windows devices using Windows containers that use the NAT network.

**Resolution:**

Ensure that there is a route to the internet for the IP addresses assigned to this bridge/NAT network. Sometimes a VPN configuration on the host overrides the IoT Edge network.

## IoT Edge agent can't access a module's image (403)

**Observed behavior:**

A container fails to run, and the edgeAgent logs show a 403 error.

**Root cause:**

The IoT Edge agent doesn't have permissions to access a module's image.

**Resolution:**

Make sure that your registry credentials are correctly specified in your deployment manifest.

## Edge Agent module reports 'empty config file' and no modules start on the device

**Observed behavior:**

The device has trouble starting modules defined in the deployment. Only the edgeAgent is running but continually reporting 'empty config file...'.

**Root cause:**

By default, IoT Edge starts modules in their own isolated container network. The device may be having trouble with DNS name resolution within this private network.

**Resolution:**

**Option 1: Set DNS server in container engine settings**

Specify the DNS server for your environment in the container engine settings, which will apply to all container modules started by the engine. Create a file named `daemon.json`, then specify the DNS server to use. For example:

```json
{
    "dns": ["1.1.1.1"]
}
```

This DNS server is set to a publicly accessible DNS service. However some networks, such as corporate networks, have their own DNS servers installed and won't allow access to public DNS servers. Therefore, if your edge device can't access a public DNS server, replace it with an accessible DNS server address.

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"
Place `daemon.json` in the right location for your platform:

| Platform | Location |
| --------- | -------- |
| Linux | `/etc/docker` |
| Windows host with Windows containers | `C:\ProgramData\iotedge-moby\config` |

If the location already contains `daemon.json` file, add the **dns** key to it and save the file.

Restart the container engine for the updates to take effect.

| Platform | Command |
| --------- | -------- |
| Linux | `sudo systemctl restart docker` |
| Windows (Admin PowerShell) | `Restart-Service iotedge-moby -Force` |

:::moniker-end
<!-- end 1.1 -->

<!-- iotedge-2020-11 -->
:::moniker range=">=iotedge-2020-11"
Place `daemon.json` in the `/etc/docker` directory on your device.

If the location already contains a `daemon.json` file, add the **dns** key to it and save the file.

Restart the container engine for the updates to take effect.

```bash
sudo systemctl restart docker
```

:::moniker-end
<!-- end iotedge-2020-11 -->

**Option 2: Set DNS server in IoT Edge deployment per module**

You can set DNS server for each module's *createOptions* in the IoT Edge deployment. For example:

```json
"createOptions": {
  "HostConfig": {
    "Dns": [
      "x.x.x.x"
    ]
  }
}
```

> [!WARNING]
> If you use this method and specify the wrong DNS address, *edgeAgent* loses connection with IoT Hub and can't receive new deployments to fix the issue. To resolve this issue, you can reinstall the IoT Edge runtime. Before you install a new instance of IoT Edge, be sure to remove any *edgeAgent* containers from the previous installation.

Be sure to set this configuration for the *edgeAgent* and *edgeHub* modules as well.

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"
## Could not start module due to OS mismatch

 **Observed behavior:**

The edgeHub module fails to start in IoT Edge version 1.1.

**Root cause:**

Windows module uses a version of Windows that is incompatible with the version of Windows on the host. IoT Edge Windows version 1809 build 17763 is needed as the base layer for the module image, but a different version is in use.

**Resolution:**

Check the version of your various Windows operating systems in [Troubleshoot host and container image mismatches](/virtualization/windowscontainers/deploy-containers/update-containers#troubleshoot-host-and-container-image-mismatches). If the operating systems are different, update them to IoT Edge Windows version 1809 build 17763 and rebuild the Docker image used for that module.

:::moniker-end
<!-- end 1.1 -->

## IoT Edge hub fails to start

**Observed behavior:**

The edgeHub module fails to start. You may see a message like one of the following errors in the logs:

```output
One or more errors occurred.
(Docker API responded with status code=InternalServerError, response=
{\"message\":\"driver failed programming external connectivity on endpoint edgeHub (6a82e5e994bab5187939049684fb64efe07606d2bb8a4cc5655b2a9bad5f8c80):
Error starting userland proxy: Bind for 0.0.0.0:443 failed: port is already allocated\"}\n)
```

Or

```output
info: edgelet_docker::runtime -- Starting module edgeHub...
warn: edgelet_utils::logging -- Could not start module edgeHub
warn: edgelet_utils::logging --     caused by: failed to create endpoint edgeHub on network nat: hnsCall failed in Win32:  
        The process cannot access the file because it is being used by another process. (0x20)
```

**Root cause:**

Some other process on the host machine has bound a port that the edgeHub module is trying to bind. The IoT Edge hub maps ports 443, 5671, and 8883 for use in gateway scenarios. The module fails to start if another process has already bound one of those ports.

**Resolution:**

You can resolve this issue two ways:

If the IoT Edge device is functioning as a gateway device, then you need to find and stop the process that is using port 443, 5671, or 8883. An error for port 443 usually means that the other process is a web server.

If you don't need to use the IoT Edge device as a gateway, then you can remove the port bindings from edgeHub's module create options. You can change the create options in the Azure portal or directly in the deployment.json file.

In the Azure portal:

1. Navigate to your IoT hub and select **Devices** under the **Device management** menu.

2. Select the IoT Edge device that you want to update.

3. Select **Set Modules**.

4. Select **Runtime Settings**.

5. In the **Edge Hub** module settings, delete everything from the **Create Options** text box.

6. Save your changes and create the deployment.

In the deployment.json file:

1. Open the deployment.json file that you applied to your IoT Edge device.

2. Find the `edgeHub` settings in the edgeAgent desired properties section:

   ```json
   "edgeHub": {
       "settings": {
           "image": "mcr.microsoft.com/azureiotedge-hub:1.1",
           "createOptions": "{\"HostConfig\":{\"PortBindings\":{\"8883/tcp\":[{\"HostPort\":\"8883\"}],\"443/tcp\":[{\"HostPort\":\"443\"}]}}}"
       },
       "type": "docker",
       "status": "running",
       "restartPolicy": "always"
   }
   ```

3. Remove the `createOptions` line, and the trailing comma at the end of the `image` line before it:

   ```json
   "edgeHub": {
       "settings": {
           "image": "mcr.microsoft.com/azureiotedge-hub:1.1"
       },
       "type": "docker",
       "status": "running",
       "restartPolicy": "always"
   }
   ```

4. Save the file and apply it to your IoT Edge device again.

## IoT Edge security daemon fails with an invalid hostname

**Observed behavior:**

Attempting to [check the IoT Edge security manager logs](troubleshoot.md#check-the-status-of-the-iot-edge-security-manager-and-its-logs) fails and prints the following message:

```output
Error parsing user input data: invalid hostname. Hostname cannot be empty or greater than 64 characters
```

**Root cause:**

The IoT Edge runtime can only support hostnames that are shorter than 64 characters. Physical machines usually don't have long hostnames, but the issue is more common on a virtual machine. The automatically generated hostnames for Windows virtual machines hosted in Azure, in particular, tend to be long.

**Resolution:**

When you see this error, you can resolve it by configuring the DNS name of your virtual machine, and then setting the DNS name as the hostname in the setup command.

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"

1. In the Azure portal, navigate to the overview page of your virtual machine.
2. Select **configure** under DNS name. If your virtual machine already has a DNS name configured, you don't need to configure a new one.

   ![Configure DNS name of virtual machine](./media/troubleshoot/configure-dns.png)

3. Provide a value for **DNS name label** and select **Save**.
4. Copy the new DNS name, which should be in the format **\<DNSnamelabel\>.\<vmlocation\>.cloudapp.azure.com**.
5. Inside the virtual machine, use the following command to set up the IoT Edge runtime with your DNS name:

   * On Linux:

      ```bash
      sudo nano /etc/iotedge/config.yaml
      ```

   * On Windows:

      ```cmd
      notepad C:\ProgramData\iotedge\config.yaml
      ```

:::moniker-end
<!-- end 1.1 -->

<!-- iotedge-2020-11 -->
:::moniker range=">=iotedge-2020-11"

1. In the Azure portal, navigate to the overview page of your virtual machine.

2. Select **configure** under DNS name. If your virtual machine already has a DNS name configured, you don't need to configure a new one.

   ![Configure DNS name of virtual machine](./media/troubleshoot/configure-dns.png)

3. Provide a value for **DNS name label** and select **Save**.

4. Copy the new DNS name, which should be in the format **\<DNSnamelabel\>.\<vmlocation\>.cloudapp.azure.com**.

5. On the IoT Edge device, open the config file.

   ```bash
   sudo nano /etc/aziot/config.toml
   ```

6. Replace the value of `hostname` with your DNS name.

7. Save and close the file, then apply the changes to IoT Edge.

   ```bash
   sudo iotedge config apply
   ```

:::moniker-end
<!-- end iotedge-2020-11 -->

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"

## Can't get the IoT Edge daemon logs on Windows

**Observed behavior:**

You get an EventLogException when using `Get-WinEvent` on Windows.

**Root cause:**

The `Get-WinEvent` PowerShell command relies on a registry entry to be present to find logs by a specific `ProviderName`.

**Resolution:**

Set a registry entry for the IoT Edge daemon. Create a **iotedge.reg** file with the following content, and import in to the Windows Registry by double-clicking it or using the `reg import iotedge.reg` command:

```reg
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\EventLog\Application\iotedged]
"CustomSource"=dword:00000001
"EventMessageFile"="C:\\ProgramData\\iotedge\\iotedged.exe"
"TypesSupported"=dword:00000007
```

## DPS client error

**Observed behavior:**

IoT Edge fails to start with error message `failed to provision with IoT Hub, and no valid device backup was found dps client error.`

**Root cause:**

A group enrollment is used to provision an IoT Edge device to an IoT Hub. The IoT Edge device is moved to a different hub. The registration is deleted in DPS. A new registration is created in DPS for the new hub. The device is not reprovisioned.

**Resolution:**

1. Verify your DPS credentials are correct.
1. Apply your configuration using `sudo iotedge apply config`.
1. If the device isn't reprovisioned, restart the device using `sudo iotedge system restart`.
1. If the device isn't reprovisioned, force reprovisioning using `sudo iotedge system reprovision`.

To automatically reprovision, set `dynamic_reprovisioning: true` in the device configuration file. Setting this flag to true opts in to the dynamic re-provisioning feature. IoT Edge detects situations where the device appears to have been reprovisioned in the cloud by monitoring its own IoT Hub connection for certain errors. IoT Edge responds by shutting itself and all Edge modules down. The next time the daemon starts up, it will attempt to reprovision this device with Azure to receive the new IoT Hub provisioning information.

When using external provisioning, the daemon will also notify the external provisioning endpoint about the re-provisioning event before shutting down. For more information, see [IoT Hub device reprovisioning concepts](../iot-dps/concepts-device-reprovision.md).

:::moniker-end
<!-- end 1.1 -->

## Stability issues on smaller devices

**Observed behavior:**

You may experience stability problems on resource constrained devices like the Raspberry Pi, especially when used as a gateway. Symptoms include out of memory exceptions in the IoT Edge hub module, downstream devices failing to connect, or the device failing to send telemetry messages after a few hours.

**Root cause:**

The IoT Edge hub, which is part of the IoT Edge runtime, is optimized for performance by default and attempts to allocate large chunks of memory. This optimization is not ideal for constrained edge devices and can cause stability problems.

**Resolution:**

For the IoT Edge hub, set an environment variable **OptimizeForPerformance** to **false**. There are two ways to set environment variables:

In the Azure portal:

In your IoT Hub, select your IoT Edge device and from the device details page and select **Set Modules** > **Runtime Settings**. Create an environment variable for the IoT Edge hub module called *OptimizeForPerformance* that is set to *false*.

![OptimizeForPerformance set to false](./media/troubleshoot/optimizeforperformance-false.png)

In the deployment manifest:

```json
"edgeHub": {
  "type": "docker",
  "settings": {
    "image": "mcr.microsoft.com/azureiotedge-hub:1.1",
    "createOptions": <snipped>
  },
  "env": {
    "OptimizeForPerformance": {
      "value": "false"
    }
  },
```

## IoT Edge module fails to send a message to edgeHub with 404 error

**Observed behavior:**

A custom IoT Edge module fails to send a message to the IoT Edge hub with a 404 `Module not found` error. The IoT Edge daemon prints the following message to the logs:

```output
Error: Time:Thu Jun  4 19:44:58 2018 File:/usr/sdk/src/c/provisioning_client/adapters/hsm_client_http_edge.c Func:on_edge_hsm_http_recv Line:364 executing HTTP request fails, status=404, response_buffer={"message":"Module not found"}u, 04 )
```

**Root cause:**

The IoT Edge daemon enforces process identification for all modules connecting to the edgeHub for security reasons. It verifies that all messages being sent by a module come from the main process ID of the module. If a message is being sent by a module from a different process ID than initially established, it will reject the message with a 404 error message.

**Resolution:**

As of version 1.0.7, all module processes are authorized to connect. For more information, see the [1.0.7 release changelog](https://github.com/Azure/iotedge/blob/master/CHANGELOG.md#iotedged-1).

If upgrading to 1.0.7 isn't possible, complete the following steps. Make sure that the same process ID is always used by the custom IoT Edge module to send messages to the edgeHub. For instance, make sure to `ENTRYPOINT` instead of `CMD` command in your Docker file. The `CMD` command leads to one process ID for the module and another process ID for the bash command running the main program, but `ENTRYPOINT` leads to a single process ID.

## IoT Edge module deploys successfully then disappears from device

**Observed behavior:**

After setting modules for an IoT Edge device, the modules are deployed successfully but after a few minutes they disappear from the device and from the device details in the Azure portal. Other modules than the ones defined might also appear on the device.

**Root cause:**

If an automatic deployment targets a device, it takes priority over manually setting the modules for a single device. The **Set modules** functionality in Azure portal or **Create deployment for single device** functionality in Visual Studio Code will take effect for a moment. You see the modules that you defined start on the device. Then the automatic deployment's priority kicks in and overwrites the device's desired properties.

**Resolution:**

Only use one type of deployment mechanism per device, either an automatic deployment or individual device deployments. If you have multiple automatic deployments targeting a device, you can change priority or target descriptions to make sure the correct one applies to a given device. You can also update the device twin to no longer match the target description of the automatic deployment.

For more information, see [Understand IoT Edge automatic deployments for single devices or at scale](module-deployment-monitoring.md).

## IoT Edge module reports connectivity errors

**Observed behavior:**

IoT Edge modules that connect directly to cloud services, including the runtime modules, stop working as expected and return errors around connection or networking failures.

**Root cause:**

Containers rely on IP packet forwarding in order to connect to the internet so that they can communicate with cloud services. IP packet forwarding is enabled by default in Docker, but if it gets disabled then any modules that connect to cloud services will not work as expected. For more information, see [Understand container communication](https://docs.docker.com/config/containers/container-networking/) in the Docker documentation.

**Resolution:**

Use the following steps to enable IP packet forwarding.

<!--1.1-->
:::moniker range="iotedge-2018-06"

On Windows:

1. Open the **Run** application.

1. Enter `regedit` in the text box and select **Ok**.

1. In the **Registry Editor** window, browse to **HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters**.

1. Look for the **IPEnableRouter** parameter.

   1. If the parameter exists, set the value of the parameter to **1**.

   1. If the parameter doesn't exist, add it as a new parameter with the following settings:

      | Setting | Value |
      | ------- | ----- |
      | Name    | IPEnableRouter |
      | Type    | REG_DWORD |
      | Value   | 1 |

1. Close the registry editor window.

1. Restart your system to apply the changes.

On Linux:
:::moniker-end
<!-- end -->

1. Open the **sysctl.conf** file.

   ```bash
   sudo nano /etc/sysctl.conf
   ```

1. Add the following line to the file.

   ```input
   net.ipv4.ip_forward=1
   ```

1. Save and close the file.

1. Restart the network service and docker service to apply the changes.

<!-- iotedge-2020-11 -->
::: moniker range=">=iotedge-2020-11"

## IoT Edge behind a gateway cannot perform HTTP requests and start edgeAgent module

**Observed behavior:**

The IoT Edge daemon is active with a valid configuration file, but it cannot start the edgeAgent module. The command `iotedge list` returns an empty list. The IoT Edge daemon logs report `Could not perform HTTP request`.

**Root cause:**

IoT Edge devices behind a gateway get their module images from the parent IoT Edge device specified in the `parent_hostname` field of the config file. The `Could not perform HTTP request` error means that the child device isn't able to reach its parent device via HTTP.

**Resolution:**

Make sure the parent IoT Edge device can receive incoming requests from the child IoT Edge device. Open network traffic on ports 443 and 6617 for requests coming from the child device.

## IoT Edge behind a gateway cannot connect when migrating from one IoT hub to another

**Observed behavior:**

When attempting to migrate a hierarchy of IoT Edge devices from one IoT hub to another, the top level parent IoT Edge device can connect to IoT Hub, but downstream IoT Edge devices cannot. The logs report `Unable to authenticate client downstream-device/$edgeAgent with module credentials`. 

**Root cause:**

The credentials for the downstream devices were not updated properly when the migration to the new IoT hub happened. Because of this, `edgeAgent` and `edgeHub` modules were set to have authentication type of `none` (default if not set explicitly). During connection, the modules on the downstream devices use old credentials, causing the authentication to fail.

**Resolution:**

When migrating to the new IoT hub (assuming not using DPS), follow these steps in order:
1. Follow [this guide to export and then import device identities](../iot-hub/iot-hub-bulk-identity-mgmt.md) from the old IoT hub to the new one 
1. Reconfigure all IoT Edge deployments and configurations in the new IoT hub
1. Reconfigure all parent-child device relationships in the new IoT hub
1. Update each device to point to the new IoT hub hostname (`iothub_hostname` under `[provisioning]` in `config.toml`)
1. If you chose to exclude authentication keys during the device export, reconfigure each device with the new keys given by the new IoT hub (`device_id_pk` under `[provisioning.authentication]` in `config.toml`)
1. Restart the top-level parent Edge device first, make sure it's up and running
1. Restart each device in hierarchy level by level from top to the bottom

:::moniker-end
<!-- end iotedge-2020-11 -->

## Security daemon couldn't start successfully

**Observed behavior:**

The security daemon fails to start and module containers aren't created. The `edgeAgent`, `edgeHub` and other custom modules aren't started by IoT Edge service. In `aziot-edged` logs, you see this error:

> - The daemon could not start up successfully: Could not start management service
>  - caused by: An error occurred for path /var/run/iotedge/mgmt.sock
>  - caused by: Permission denied (os error 13)


**Root cause:**

For all Linux distros except CentOS 7, IoT Edge's default configuration is to use `systemd` socket activation. A permission error happens if you change the configuration file to not use socket activation but leave the URLs as `/var/run/iotedge/*.sock`, since the `iotedge` user can't write to `/var/run/iotedge` meaning it can't unlock and mount the sockets itself. 

**Resolution:**

You do not need to disable socket activation on a distro where socket activation is supported. However, if you prefer to not use socket activation at all, put the sockets in `/var/lib/iotedge/`. To do this 
1. Run `systemctl disable iotedge.socket iotedge.mgmt.socket` to disable the socket units so that systemd doesn't start them unnecessarily
1. Change the iotedge config to use `/var/lib/iotedge/*.sock` in both `connect` and `listen` sections
1. If you already have modules, they have the old `/var/run/iotedge/*.sock` mounts, so `docker rm -f` them.

## Next steps

Do you think that you found a bug in the IoT Edge platform? [Submit an issue](https://github.com/Azure/iotedge/issues) so that we can continue to improve.

If you have more questions, create a [Support request](https://portal.azure.com/#create/Microsoft.Support) for help.
