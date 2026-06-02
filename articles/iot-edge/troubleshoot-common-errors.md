---
title: Troubleshoot Azure IoT Edge common errors
description: Resolve common issues in Azure IoT Edge solutions. Learn how to troubleshoot issues with provisioning, deployment, the IoT Edge runtime, and networking.
author: sethmanheim
ms.author: sethm
ms.date: 04/13/2026
ms.topic: troubleshooting-general
ms.service: azure-iot-edge
services: iot-edge
ms.custom:
  - amqp
  - mqtt
  - sfi-image-nochange
---

# Solutions to common issues for Azure IoT Edge

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

Use this article to identify and resolve common issues when using IoT Edge solutions. For information about how to find logs and errors from your IoT Edge device, see [Troubleshoot your IoT Edge device](troubleshoot.md).

## Provisioning and deployment

### IoT Edge module deploys successfully then disappears from device

#### Symptoms

After setting modules for an IoT Edge device, the modules deploy successfully but after a few minutes they disappear from the device and from the device details in the Azure portal. Other modules than the ones defined might also appear on the device.

#### Cause

If an automatic deployment targets a device, it takes priority over manually setting the modules for a single device. The **Set modules** functionality in Azure portal or **Create deployment for single device** functionality in Visual Studio Code takes effect for a moment. You see the modules that you defined start on the device. Then the automatic deployment's priority starts and overwrites the device's desired properties.

#### Solution

Use only one type of deployment mechanism per device, either an automatic deployment or individual device deployments. If you have multiple automatic deployments targeting a device, you can change priority or target descriptions to make sure the correct one applies to a given device. You can also update the device twin to no longer match the target description of the automatic deployment.

For more information, see [Understand IoT Edge automatic deployments for single devices or at scale](module-deployment-monitoring.md).

## IoT Edge runtime

### IoT Edge agent stops after a minute

#### Symptoms

The **edgeAgent** module starts and runs successfully for about a minute, then stops. The logs show that the IoT Edge agent tries to connect to IoT Hub over AMQP, and then tries to connect by using AMQP over WebSocket. When that connection fails, the IoT Edge agent exits.

Example edgeAgent logs:

```output
2017-11-28 18:46:19 [INF] - Starting module management agent.
2017-11-28 18:46:19 [INF] - Version - 1.0.7516610 (03c94f85d0833a861a43c669842f0817924911d5)
2017-11-28 18:46:19 [INF] - Edge agent attempting to connect to IoT Hub via AMQP...
2017-11-28 18:46:49 [INF] - Edge agent attempting to connect to IoT Hub via AMQP over WebSocket...
```

#### Cause

A networking configuration on the host network is preventing the IoT Edge agent from reaching the network. The agent attempts to connect over AMQP (port 5671) first. If the connection fails, it tries WebSockets (port 443).

The IoT Edge runtime sets up a network for each of the modules to communicate on. On Linux, this network is a bridge network. On Windows, it uses NAT. This issue is more common on Windows devices using Windows containers that use the NAT network.

#### Solution

Make sure there's a route to the internet for the IP addresses assigned to this bridge or NAT network. Sometimes a VPN configuration on the host overrides the IoT Edge network.

### Edge Agent module reports 'empty config file' and no modules start on the device

#### Symptoms

* The device has trouble starting modules defined in the deployment. Only the **edgeAgent** is running but reports *empty config file...*.

* When you run `sudo iotedge check` on a device, it reports *Container engine is not configured with DNS server setting, which may impact connectivity to IoT Hub. Please see https://aka.ms/iotedge-prod-checklist-dns for best practices.*

#### Cause

* By default, IoT Edge starts modules in their own isolated container network. The device might have trouble with DNS name resolution within this private network.
* If you use a snap installation of IoT Edge, the Docker configuration file is in a different location. See solution option 3.

#### Solution

**Option 1: Set DNS server in container engine settings**

Specify the DNS server for your environment in the container engine settings. These settings apply to all container modules that the engine starts. Create a file named **daemon.json**, and specify the DNS server to use. For example:

```json
{
    "dns": ["1.1.1.1"]
}
```

This DNS server is set to a publicly accessible DNS service. However, some networks, such as corporate networks, have their own DNS servers and don't allow access to public DNS servers. Therefore, if your edge device can't access a public DNS server, replace it with an accessible DNS server address.

Place `daemon.json` in the `/etc/docker` directory on your device.

If the location already contains a `daemon.json` file, add the **dns** key to it and save the file.

Restart the container engine for the updates to take effect.

```bash
sudo systemctl restart docker
```

**Option 2: Set DNS server in IoT Edge deployment per module**

You can set the DNS server for each module's `createOptions` section in the IoT Edge deployment. For example:

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

**Option 3: Pass the location of the docker configuration file to check command**

If you install IoT Edge as a snap, use the `--container-engine-config-file` parameter to specify the location of the Docker configuration file. For example, if the Docker configuration file is located at `/var/snap/docker/current/config/daemon.json`, run the following command: `iotedge check --container-engine-config-file '/var/snap/docker/current/config/daemon.json'`.

Currently, the warning message continues to appear in the output of *iotedge check* even after you set the configuration file location. Check reports the error because the IoT Edge snap doesn't have read access to the Docker snap. If you use *iotedge check* in your release process, you can suppress the warning message by using the `--ignore container-engine-dns container-engine-logrotate` parameter.

### Edge Agent module with LTE connection reports 'empty edge agent config' and causes 'transient network error'

#### Symptoms

A device configured with an LTE connection has problems starting modules defined in the deployment. The **edgeAgent** can't connect to the IoT Hub and reports "empty edge agent config" and "transient network error occurred."

#### Cause

Some networks have packet overhead, which makes the default docker network MTU (1500) too high and causes packet fragmentation. This fragmentation prevents access to external resources.

#### Solution

1. Check the MTU setting for your docker network.

   `docker network inspect <network name>`

1. Check the MTU setting for the physical network adapter on your device.

    `ip addr show eth0`

>[!NOTE]
>The MTU for the docker network can't be higher than the MTU for your device. Contact your ISP for more information.

If you see a different MTU size for your docker network and the device, try the following workaround:

1. Create a new network. For example,

    `docker network create --opt com.docker.network.driver.mtu=1430 test-mtu`

    In the example, the MTU setting for the device is 1430. Set the MTU for the Docker network to 1430.

1. Stop and remove the Azure network.

    `docker network rm azure-iot-edge`

1. Recreate the Azure network.

   `docker network create --opt com.docker.network.driver.mtu=1430 azure-iot-edge`

1. Remove all containers and restart the *aziot-edged* service.

   `sudo iotedge system stop && sudo docker rm -f $(docker ps -aq -f "label=net.azure-devices.edge.owner=Microsoft.Azure.Devices.Edge.Agent") && sudo iotedge config apply`

### IoT Edge agent can't access a module's image (403)

#### Symptoms

A container fails to run, and the *edgeAgent* logs report a 403 error.

#### Cause

The IoT Edge agent module doesn't have permissions to access a module's image.

#### Solution

Make sure that your container registry credentials are correct your device deployment manifest.

### IoT Edge agent makes excessive identity calls

#### Symptoms

IoT Edge agent makes excessive identity calls to Azure IoT Hub.

#### Cause

Device deployment manifest misconfiguration causes an unsuccessful deployment on the device. IoT Edge Agent retry logic continues to retry deployment. Each retry makes identity calls until the deployment is successful. For example, if the deployment manifest specifies a module URI that that doesn't exist in the container registry or is mistyped, the IoT Edge agent retries the deployment until the deployment manifest is corrected.

#### Solution

Verify the deployment manifest in the Azure portal. Correct any errors and redeploy the manifest to the device.

### IoT Edge hub fails to start

#### Symptoms

The edgeHub module fails to start. You might see a message like one of the following errors in the logs:

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

#### Cause

Some other process on the host machine bound a port that the **edgeHub** module tries to bind. The IoT Edge hub maps ports 443, 5671, and 8883 for use in gateway scenarios. The module fails to start if another process already bound one of those ports.

#### Solution

Resolve this problem in one of two ways:

If the IoT Edge device functions as a gateway device, find and stop the process that uses port 443, 5671, or 8883. An error for port 443 usually means that the other process is a web server.

If you don't need to use the IoT Edge device as a gateway, remove the port bindings from edgeHub's module create options. You can change the create options in the Azure portal or directly in the deployment.json file.

In the Azure portal:

1. Go to your IoT hub and select **Devices** under the **Device management** menu.

1. Select the IoT Edge device that you want to update.

1. Select **Set Modules**.

1. Select **Runtime Settings**.

1. In the **Edge Hub** module settings, delete everything from the **Container Create Options** text box.

1. Select **Apply** to save your changes and create the deployment.

In the deployment.json file:

1. Open the deployment.json file that you applied to your IoT Edge device.

1. Find the `edgeHub` settings in the edgeAgent desired properties section:

   ```json
     "edgeHub": {
         "restartPolicy": "always",
         "settings": {
            "image": "mcr.microsoft.com/azureiotedge-hub:1.5",
            "createOptions": "{\"HostConfig\":{\"PortBindings\":{\"443/tcp\":[{\"HostPort\":\"443\"}],\"5671/tcp\":[{\"HostPort\":\"5671\"}],\"8883/tcp\":[{\"HostPort\":\"8883\"}]}}}"
         },
         "status": "running",
         "type": "docker"
      }
   ```

1. Remove the `createOptions` line, and the trailing comma at the end of the `image` line before it:

   ```json
     "edgeHub": {
         "restartPolicy": "always",
         "settings": {
         "image": "mcr.microsoft.com/azureiotedge-hub:1.5",
         "status": "running",
         "type": "docker"
   }
   ```

1. Select **Create** to apply it to your IoT Edge device again.

### IoT Edge module can't send a message to edgeHub and returns 404 error

#### Symptoms

A custom IoT Edge module can't send a message to the IoT Edge hub and returns a 404 `Module not found` error. The IoT Edge runtime prints the following message to the logs:

```output
Error: Time:Thu Jun  4 19:44:58 2018 File:/usr/sdk/src/c/provisioning_client/adapters/hsm_client_http_edge.c Func:on_edge_hsm_http_recv Line:364 executing HTTP request fails, status=404, response_buffer={"message":"Module not found"}u, 04 )
```

#### Cause

For security reasons, the IoT Edge runtime enforces process identification for all modules connecting to the edgeHub. It verifies that all messages a module sends come from the main process ID of the module. If a module tries to send a message from a different process ID, the runtime rejects the message and returns a 404 error message.

#### Solution

Starting with version 1.0.7, all module processes can connect. For more information, see the [1.0.7 release changelog](https://github.com/Azure/iotedge/blob/main/CHANGELOG.md#iotedged-1).

If you can't upgrade to version 1.0.7, follow these steps. Make sure the custom IoT Edge module always uses the same process ID to send messages to the edgeHub. For example, use the `ENTRYPOINT` command instead of the `CMD` command in your Docker file. The `CMD` command results in one process ID for the module and another process ID for the bash command that runs the main program. The `ENTRYPOINT` command results in a single process ID.



### Stability issues on smaller devices

#### Symptoms

You might experience stability problems on resource constrained devices like the Raspberry Pi, especially when used as a gateway. Symptoms include out of memory exceptions in the IoT Edge hub module, downstream devices failing to connect, or the device failing to send telemetry messages after a few hours.

#### Cause

The IoT Edge hub, which is part of the IoT Edge runtime, is optimized for performance by default and attempts to allocate large chunks of memory. This optimization isn't ideal for constrained edge devices and can cause stability problems.

#### Solution

For the IoT Edge hub, set an environment variable **OptimizeForPerformance** to **false**. You can set environment variables in one of two ways:

In the Azure portal:

1. In your IoT Hub, select your IoT Edge device. From the device details page, select **Set Modules > Runtime Settings**.
1. Create an environment variable for the IoT Edge hub module named **OptimizeForPerformance** with type **True/False** and set it to **False**.
1. Select **Apply** to save your changes, and then select **Review + create**.

   The environment variable is now in the `edgeHub` property of the deployment manifest:

   ```json
      "edgeHub": {
         "env": {
               "OptimizeForPerformance": {
                  "value": false
               }
         },
         "restartPolicy": "always",
         "settings": {
               "image": "mcr.microsoft.com/azureiotedge-hub:1.5",
               "createOptions": "{\"HostConfig\":{\"PortBindings\":{\"443/tcp\":[{\"HostPort\":\"443\"}],\"5671/tcp\":[{\"HostPort\":\"5671\"}],\"8883/tcp\":[{\"HostPort\":\"8883\"}]}}}"
         },
         "status": "running",
         "type": "docker"
      }
    ```

1. Select **Create** to save your changes and deploy the module.

### Security daemon can't start

#### Symptoms

The security daemon can't start and module containers aren't created. The IoT Edge service doesn't start `edgeAgent`, `edgeHub`, or other custom modules. In the `aziot-edged` logs, you see this error message:

> - The daemon could not start up successfully: Could not start management service
>  - caused by: An error occurred for path /var/run/iotedge/mgmt.sock
>  - caused by: Permission denied (os error 13)


#### Cause

For all Linux distros except CentOS 7, IoT Edge uses `systemd` socket activation by default. If you change the configuration file to disable socket activation but keep the URLs as `/var/run/iotedge/*.sock`, you get a permission error. The `iotedge` user can't write to `/var/run/iotedge`, so it can't unlock and mount the sockets. CentOS is end of life (EOL). For more information, see the [CentOS End Of Life guidance](/azure/virtual-machines/workloads/centos/centos-end-of-life).

#### Solution

Don't disable socket activation on a distribution that supports socket activation. However, if you don't want to use socket activation, put the sockets in `/var/lib/iotedge/`.
1. Run `systemctl disable iotedge.socket iotedge.mgmt.socket` to disable the socket units so that systemd doesn't start them.
1. Change the iotedge config to use `/var/lib/iotedge/*.sock` in both `connect` and `listen` sections
1. If you already have modules, they have the old `/var/run/iotedge/*.sock` mounts, so run `docker rm -f` to remove them.

### Message queue cleanup is slow

#### Symptoms

The message queue doesn't clean up after messages are processed. The message queue grows over time and eventually causes the IoT Edge runtime to run out of memory.

#### Cause

The client message TTL (time to live) and the **EdgeHub** `MessageCleanupIntervalSecs` environment variable control the message cleanup interval. The default message TTL value is two hours and the default `MessageCleanupIntervalSecs` value is 30 minutes. If your application uses a TTL value that's shorter than the default and you don't adjust the `MessageCleanupIntervalSecs` value, expired messages aren't cleaned up until the next cleanup interval.

#### Solution

If you change the TTL value for your application to a value that's shorter than the default, also adjust the `MessageCleanupIntervalSecs` value. The `MessageCleanupIntervalSecs` value should be significantly smaller than the smallest TTL value that the client uses. For example, if the client application defines a TTL of five minutes in the message header, set the `MessageCleanupIntervalSecs` value to one minute. These settings ensure that messages are cleaned up within six (5 + 1) minutes.  

To configure the *MessageCleanupIntervalSecs* value, set the environment variable in the deployment manifest for the IoT Edge hub module. For more information about setting runtime environment variables, see [Edge Agent and Edge Hub Environment Variables](https://github.com/Azure/iotedge/blob/main/doc/EnvironmentVariables.md).

### Custom modules stop sending messages after Edge CA certificate renewal

#### Symptoms

Custom modules stop communicating with EdgeHub after running for a period of time, typically around 24-30 days when using the default 30-day quickstart Edge CA certificate, or at 80% of the configured certificate lifetime. The EdgeHub and EdgeAgent modules continue to run, but custom modules can no longer send or receive messages through EdgeHub.

#### Cause

When the Edge CA certificate auto-renews, IoT Edge stops and restarts all modules so they receive new server certificates. After the restart, modules must reestablish their connection to EdgeHub. If a custom module doesn't implement connection retry logic, the module starts but can't reconnect to EdgeHub because the new EdgeHub server certificate isn't yet available or the module doesn't retry the initial connection attempt.

#### Solution

Check the EdgeAgent logs for certificate renewal events:

```bash
sudo iotedge logs edgeAgent | grep -i "renewal"
```

To resolve:

1. Verify that each custom module has `"restartPolicy": "always"` in the deployment manifest.
1. Implement connection retry logic in custom modules. Use the Azure IoT device SDK's built-in retry policies, or add exponential backoff retry logic so the module automatically reconnects to EdgeHub after a restart. For more information, see [Manage connectivity and reliable messaging by using Azure IoT Hub device SDKs](../iot-hub/iot-hub-reliability-features-in-sdks.md).
1. To control when the renewal disruption occurs, set the `threshold` to an absolute time instead of a percentage. For example, `threshold = "10d"` triggers renewal 10 days before certificate expiry. For more information, see [Plan for Edge CA renewal](how-to-manage-device-certificates.md#plan-for-edge-ca-renewal).

### IoT Edge Hub reports System.FormatException error when using AMQP protocol

#### Symptoms

When you route messages from an IoT Edge device to an IoT Hub using the AMQP protocol and set the [`iothub-creation-time-utc` property on outgoing device messages](../iot-hub/iot-hub-devguide-messages-construct.md#application-properties-of-device-to-cloud-messages), the IoT Edge Hub reports a **System.FormatException** error. The error message is similar to the following:

```log
System.FormatException: String '2024-12-01T00:00:0.000Z' was not recognized as a valid DateTime.
```

#### Cause

The `iot-hub-creation-time-utc` value doesn't meet strict format criteria. The format Edge Hub requires is a subset of ISO 8601.

#### Solution

This problem is a known issue in IoT Edge Hub for the AMQP protocol. Currently, the product team is investigating a fix. The MQTT protocol doesn't have this issue.

## Networking

### IoT Edge security daemon fails with an invalid hostname

#### Symptoms

Attempting to [check the IoT Edge security manager logs](troubleshoot.md#check-the-status-of-the-iot-edge-security-manager-and-its-logs) fails and prints the following message:

```output
Error parsing user input data: invalid hostname. Hostname cannot be empty or greater than 64 characters
```

#### Cause

The IoT Edge runtime supports hostnames that are shorter than 64 characters. Physical machines usually don't have long hostnames, but the issue is more common on a virtual machine. The automatically generated hostnames for Windows virtual machines hosted in Azure, in particular, tend to be long.

#### Solution

When you see this error, resolve it by configuring the DNS name of your virtual machine, and then setting the DNS name as the hostname in the setup command.


1. In the Azure portal, go to the overview page of your virtual machine.

1. Open the configuration panel by selecting the **Not configured** link (if your virtual machine is new) or select your existing DNS name under **Essentials** > **DNS name**. If your virtual machine already has a DNS name configured, you don't need to configure a new one.

1. Enter a value for **DNS name label** if you don't have one already and select **Save**.

1. Copy the new DNS name, which should be in the format: <br>
   **\<DNSnamelabel\>.\<vmlocation\>.cloudapp.azure.com**.

1. On the IoT Edge device, open the config file.

   ```bash
   sudo nano /etc/aziot/config.toml
   ```

1. Replace the value of `hostname` with your DNS name.

1. Save and close the file, then apply the changes to IoT Edge.

   ```bash
   sudo iotedge config apply
   ```

### IoT Edge module reports connectivity errors

#### Symptoms

IoT Edge modules that connect directly to cloud services, including the runtime modules, stop working as expected and return errors related to connection or networking failures.

#### Cause

Containers rely on IP packet forwarding to connect to the internet so they can communicate with cloud services. Docker enables IP packet forwarding by default, but if you disable it, any modules that connect to cloud services don't work as expected. For more information, see [Understand container communication](https://docs.docker.com/config/containers/container-networking/) in the Docker documentation.

#### Solution

Use the following steps to enable IP packet forwarding.

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


### IoT Edge device behind a gateway can't perform HTTP requests or start edgeAgent module

#### Symptoms

The IoT Edge runtime is active with a valid configuration file, but it can't start the *edgeAgent* module. The command `iotedge list` returns an empty list. The IoT Edge runtime reports `Could not perform HTTP request` in the logs.

#### Cause

IoT Edge devices behind a gateway get their module images from the parent IoT Edge device specified in the `parent_hostname` field of the config file. The `Could not perform HTTP request` error means that the downstream device can't reach its parent device via HTTP.

#### Solution

Make sure the parent IoT Edge device can receive incoming requests from the downstream IoT Edge device. Open network traffic on ports 443 and 6617 for requests coming from the downstream device.

### IoT Edge behind a gateway can't connect when migrating from one IoT hub to another

#### Symptoms

When you migrate a hierarchy of IoT Edge devices from one IoT hub to another, the top level parent IoT Edge device connects to IoT Hub, but downstream IoT Edge devices can't. The logs report `Unable to authenticate client downstream-device/$edgeAgent with module credentials`.

#### Cause

The migration didn't properly update the credentials for the downstream devices. Because of this problem, the `edgeAgent` and `edgeHub` modules have an authentication type of `none` (the default if you don't set it explicitly). During connection, the modules on the downstream devices use old credentials, causing the authentication to fail.

#### Solution

When you migrate to the new IoT hub (assuming you're not using DPS), follow these steps in order:
1. Follow [this guide to export and then import device identities](../iot-hub/iot-hub-bulk-identity-mgmt.md) from the old IoT hub to the new one
1. Reconfigure all IoT Edge deployments and configurations in the new IoT hub
1. Reconfigure all parent-child device relationships in the new IoT hub
1. Update each device to point to the new IoT hub hostname (`iothub_hostname` under `[provisioning]` in `config.toml`)
1. If you chose to exclude authentication keys during the device export, reconfigure each device with the new keys given by the new IoT hub (`device_id_pk` under `[provisioning.authentication]` in `config.toml`)
1. Restart the top-level parent Edge device first, make sure it's up and running
1. Restart each device in hierarchy level by level from top to the bottom

### IoT Edge has low message throughput when geographically distant from IoT Hub

#### Symptoms

Azure IoT Edge devices that are geographically distant from Azure IoT Hub have lower message throughput.

#### Cause

High latency between the device and IoT Hub causes lower message throughput. IoT Edge uses a default message batch size of 10. This batch size limits the number of messages that are sent in a single batch, which increases the number of round trips between the device and IoT Hub.

#### Solution

Try increasing the IoT Edge Hub **MaxUpstreamBatchSize** environment variable. This change sends more messages in a single batch, which reduces the number of round trips between the device and IoT Hub.

To set Azure Edge Hub environment variables in the Azure portal:

1. Navigate to your IoT Hub and select **Devices** under the **Device management** menu.
1. Select the IoT Edge device that you want to update.
1. Select **Set Modules**.
1. Select **Runtime Settings**.
1. In the **Edge Hub** module settings tab, add the **MaxUpstreamBatchSize** environment variable as type **Number** with a value of **20**.
1. Select **Apply**.

## Next steps

Do you think that you found a bug in the IoT Edge platform? [Submit an issue](https://github.com/Azure/iotedge/issues) so that the product team can continue to improve the platform.

If you have more questions, create a [Support request](https://portal.azure.com/#create/Microsoft.Support) for help.
