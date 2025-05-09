---
title: Configure devices for network proxies for Azure IoT Edge
description: Learn how to configure Azure IoT Edge devices to communicate through a proxy server.
author: PatAltimore
ms.author: patricka
ms.date: 05/09/2025
ms.topic: how-to
ms.service: azure-iot-edge
services: iot-edge
ms.custom:
  - amqp
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:05/09/2025
---

# Configure an IoT Edge device to communicate through a proxy server

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

IoT Edge devices send HTTPS requests to communicate with IoT Hub. If your device connects to a network that uses a proxy server, configure the IoT Edge runtime to communicate through the server. Proxy servers can also affect individual IoT Edge modules if they make HTTP or HTTPS requests that aren't routed through the IoT Edge hub.

This article explains the four steps to configure and manage an IoT Edge device behind a proxy server:

1. [**Install the IoT Edge runtime on your device**](#install-iot-edge-through-a-proxy)

   The IoT Edge installation scripts pull packages and files from the internet, so the device communicates through the proxy server to make those requests. For Windows devices, the installation script also provides an offline installation option.

   This step is a one-time process to configure the IoT Edge device when you first set it up. You also need these same connections when you update the IoT Edge runtime.

2. [**Configure IoT Edge and the container runtime on your device**](#configure-iot-edge-and-moby)

   IoT Edge handles communications with IoT Hub. The container runtime manages containers and communicates with container registries. Both of these components need to make web requests through the proxy server.

   This step is a one-time process to configure the IoT Edge device when you first set it up.

3. [**Configure the IoT Edge agent properties in the config file on your device**](#configure-the-iot-edge-agent)

   The IoT Edge daemon starts the edgeAgent module initially. Then, the edgeAgent module retrieves the deployment manifest from IoT Hub and starts all the other modules. Manually configure the edgeAgent module environment variables on the device so the IoT Edge agent makes the initial connection to IoT Hub. After the initial connection, you can configure the edgeAgent module remotely.

   This step is a one-time process to configure the IoT Edge device when you first set it up.

4. [**For all future module deployments, set environment variables for any module communicating through the proxy**](#configure-deployment-manifests)

   After setting up and connecting an IoT Edge device to IoT Hub through the proxy server, maintain the connection in all future module deployments.

   This step is an ongoing process done remotely so that every new module or deployment update maintains the device's ability to communicate through the proxy server.

## Know your proxy URL

Before starting the steps in this article, know your proxy URL.

Proxy URLs use the following format: **protocol**://**proxy_host**:**proxy_port**.

* The **protocol** is either HTTP or HTTPS. The Docker daemon can use either protocol depending on your container registry settings, but the IoT Edge daemon and runtime containers always use HTTP to connect to the proxy.

* The **proxy_host** is the address of the proxy server. If the proxy server requires authentication, provide your credentials as part of the proxy host in the following format: **user**:**password**\@**proxy_host**.

* The **proxy_port** is the network port where the proxy responds to traffic.

## Install IoT Edge through a proxy

Whether your IoT Edge device runs on Windows or Linux, access the installation packages through the proxy server. Depending on your operating system, follow the steps to install the IoT Edge runtime through a proxy server.

### Linux devices

If you're installing the IoT Edge runtime on a Linux device, set up the package manager to use your proxy server to access the installation package. For example, [Set up apt-get to use a http-proxy](https://help.ubuntu.com/community/AptGet/Howto/#Setting_up_apt-get_to_use_a_http-proxy). After setting up your package manager, follow the instructions in [Install Azure IoT Edge runtime](how-to-provision-single-device-linux-symmetric.md).

### Windows devices using IoT Edge for Linux on Windows

If you're installing the IoT Edge runtime using IoT Edge for Linux on Windows, the IoT Edge runtime is installed by default on your Linux virtual machine. You're not required to install or update any other steps.

### Windows devices using Windows containers

If you're installing the IoT Edge runtime on a Windows device, you need to go through the proxy server twice. The first connection downloads the installer script file, and the second connection downloads the necessary components during installation. You can configure proxy information in Windows settings, or include your proxy information directly in the PowerShell commands.

The following steps show an example of a Windows installation using the `-proxy` argument:

1. The Invoke-WebRequest command needs proxy information to access the installer script. Then the Deploy-IoTEdge command needs the proxy information to download the installation files.

   ```powershell
   . {Invoke-WebRequest -proxy <proxy URL> -useb aka.ms/iotedge-win} | Invoke-Expression; Deploy-IoTEdge -proxy <proxy URL>
   ```

2. The Initialize-IoTEdge command doesn't need to go through the proxy server, so the second step only requires proxy information for Invoke-WebRequest.

   ```powershell
   . {Invoke-WebRequest -proxy <proxy URL> -useb aka.ms/iotedge-win} | Invoke-Expression; Initialize-IoTEdge
   ```

If your proxy server credentials are complex and can't be included in the URL, use the `-ProxyCredential` parameter within `-InvokeWebRequestParameters`. For example,

```powershell
$proxyCredential = (Get-Credential).GetNetworkCredential()
. {Invoke-WebRequest -proxy <proxy URL> -ProxyCredential $proxyCredential -useb aka.ms/iotedge-win} | Invoke-Expression; `
Deploy-IoTEdge -InvokeWebRequestParameters @{ '-Proxy' = '<proxy URL>'; '-ProxyCredential' = $proxyCredential }
```

For more information about proxy parameters, see [Invoke-WebRequest](/powershell/module/microsoft.powershell.utility/invoke-webrequest).

## Configure IoT Edge and Moby

IoT Edge uses two daemons running on the IoT Edge device. The Moby daemon pulls container images from container registries. The IoT Edge daemon communicates with IoT Hub.

Configure both the Moby and IoT Edge daemons to use the proxy server for ongoing device functionality. Perform this step on the IoT Edge device during initial setup.

### Moby daemon

Because Moby is built on Docker, see the Docker documentation to configure the Moby daemon with environment variables. Most container registries, including DockerHub and Azure Container Registries, support HTTPS requests, so set the **HTTPS_PROXY** parameter. If you're pulling images from a registry that doesn't support transport layer security (TLS), then you should set the **HTTP_PROXY** parameter.

Select the article that applies to your IoT Edge device operating system:

* [Configure Docker daemon on Linux](https://docs.docker.com/config/daemon/systemd/#httphttps-proxy)
    On Linux devices, the Moby daemon is still called Docker.
* [Configure Docker daemon on Windows](/virtualization/windowscontainers/manage-docker/configure-docker-daemon#proxy-configuration)
    The Moby daemon on Windows devices is called iotedge-moby. The names are different because it's possible to run both Docker Desktop and Moby in parallel on a Windows device.

### IoT Edge daemon

The IoT Edge daemon is similar to the Moby daemon. Use the following steps to set an environment variable for the service, based on your operating system.

The IoT Edge daemon always uses HTTPS to send requests to IoT Hub.

#### Linux

In the terminal, open an editor to configure the IoT Edge daemon.

```bash
sudo systemctl edit aziot-edged
```

Enter the following text, replacing **\<proxy URL>** with your proxy server address and port. Then, save and exit.

```ini
[Service]
Environment="https_proxy=<proxy URL>"
```

Starting in version 1.2, IoT Edge uses the IoT identity service to handle device provisioning with IoT Hub or IoT Hub Device Provisioning Service. Open an editor in the terminal to configure the IoT identity service daemon.

```bash
sudo systemctl edit aziot-identityd
```

Enter the following text, replacing **\<proxy URL>** with your proxy server address and port. Then, save and exit.

```ini
[Service]
Environment="https_proxy=<proxy URL>"
```

Refresh the service manager to pick up the new configurations.

```bash
sudo systemctl daemon-reload
```

Restart the IoT Edge system services to apply the changes to both daemons.

```bash
sudo iotedge system restart
```

Verify that your environment variables and the new configuration are present.

```bash
systemctl show --property=Environment aziot-edged
systemctl show --property=Environment aziot-identityd
```

#### Windows using IoT Edge for Linux on Windows

Sign in to the IoT Edge for Linux on Windows virtual machine:

```powershell
Connect-EflowVm
```

Follow the same steps as the Linux section of this article to configure the IoT Edge daemon.

#### Windows using Windows containers

Open a PowerShell window as an administrator and run the following command to edit the registry with the new environment variable. Replace **\<proxy url>** with your proxy server address and port.

```powershell
reg add HKLM\SYSTEM\CurrentControlSet\Services\iotedge /v Environment /t REG_MULTI_SZ /d https_proxy=<proxy URL>
```

Restart IoT Edge for the changes to take effect.

```powershell
Restart-Service iotedge
```

## Configure the IoT Edge agent

The IoT Edge agent is the first module to start on any IoT Edge device. This module starts for the first time based on information in the IoT Edge config file. The IoT Edge agent then connects to IoT Hub to retrieve deployment manifests. The manifest declares which other modules the device should deploy.

This step takes place once on the IoT Edge device during initial device setup.

1. Open the config file on your IoT Edge device: `/etc/aziot/config.toml`. You need administrative privileges to access the configuration file. On Linux systems, use the `sudo` command before opening the file in your preferred text editor.

2. In the config file, find the `[agent]` section, which contains all the configuration information for the edgeAgent module to use on startup. Check that the `[agent]` section doesn't have comments. If the `[agent]` section is missing, add it to the `config.toml`. The IoT Edge agent definition includes an `[agent.env]` subsection where you can add environment variables.

3. Add the **https_proxy** parameter to the environment variables section and set your proxy URL as its value.

    ```toml
    [agent]
    name = "edgeAgent"
    type = "docker"
    
    [agent.config]
    image = "mcr.microsoft.com/azureiotedge-agent:1.5"
    
    [agent.env]
    # "RuntimeLogLevel" = "debug"
    # "UpstreamProtocol" = "AmqpWs"
    "https_proxy" = "<proxy URL>"
    ```

4. The IoT Edge runtime uses AMQP by default to communicate with IoT Hub. Some proxy servers block AMQP ports. If that's the case, then you also need to configure edgeAgent to use AMQP over WebSocket. Remove the comment from the `UpstreamProtocol` parameter.

    ```toml
    [agent.config]
    image = "mcr.microsoft.com/azureiotedge-agent:1.5"
    
    [agent.env]
    # "RuntimeLogLevel" = "debug"
    "UpstreamProtocol" = "AmqpWs"
    "https_proxy" = "<proxy URL>"
    ```

3. Add the **https_proxy** parameter to the environment variables section, and set your proxy URL as its value.

    ```toml
    [agent]
    name = "edgeAgent"
    type = "docker"
    
    [agent.config]
    image = "mcr.microsoft.com/azureiotedge-agent:1.5"
    
    [agent.env]
    # "RuntimeLogLevel" = "debug"
    # "UpstreamProtocol" = "AmqpWs"
    "https_proxy" = "<proxy URL>"
    ```

4. The IoT Edge runtime uses AMQP by default to talk to IoT Hub. Some proxy servers block AMQP ports. If that's the case, then you also need to configure edgeAgent to use AMQP over WebSocket. Uncomment the `UpstreamProtocol` parameter.

    ```toml
    [agent.config]
    image = "mcr.microsoft.com/azureiotedge-agent:1.5"
    
    [agent.env]
    # "RuntimeLogLevel" = "debug"
    "UpstreamProtocol" = "AmqpWs"
    "https_proxy" = "<proxy URL>"
    ```

5. Save the changes and close the editor. Apply the changes.

   ```bash
   sudo iotedge config apply
   ```
   
6. Verify that the proxy settings are applied using `docker inspect edgeAgent` in the `Env` section. If not, you must recreate the container.

   ```bash
   sudo docker rm -f edgeAgent
   ```
   
7. The IoT Edge runtime recreates `edgeAgent` within a minute. Once the `edgeAgent` container is running again, use the `docker inspect edgeAgent` command to verify that the proxy settings match the configuration file. 

## Configure deployment manifests  

After you configure your IoT Edge device to work with your proxy server, declare the HTTPS_PROXY environment variable in future deployment manifests. You can edit deployment manifests either using the Azure portal wizard or by editing a deployment manifest JSON file.

Always configure the two runtime modules, edgeAgent, and edgeHub, to communicate through the proxy server so they maintain a connection with IoT Hub. If you remove the proxy information from the edgeAgent module, the only way to reestablish the connection is to edit the config file on the device, as described in the previous section.

In addition to the edgeAgent and edgeHub modules, other modules may need the proxy configuration. Modules that access Azure resources besides IoT Hub, like blob storage, must specify the HTTPS_PROXY variable in the deployment manifest file.

This procedure applies throughout the life of the IoT Edge device.

### Azure portal

When you use the **Set modules** wizard to create deployments for IoT Edge devices, every module has an **Environment Variables** section where you can configure proxy server connections.

To configure the IoT Edge agent and IoT Edge hub modules, select **Runtime Settings** on the first step of the wizard.

:::image type="content" source="./media/how-to-configure-proxy-support/configure-runtime.png" alt-text="Screenshot of how to configure advanced Edge Runtime settings.":::

Add the **https_proxy** environment variable to *both the IoT Edge agent and IoT Edge hub modules* runtime settings definitions. If you include the **UpstreamProtocol** environment variable in the config file on your IoT Edge device, add it to the IoT Edge agent module definition too.

All other modules that you add to a deployment manifest follow the same pattern. Select **Apply** to save your changes.

### JSON deployment manifest files

If you create deployments for IoT Edge devices using the templates in Visual Studio Code or by manually creating JSON files, you can add the environment variables directly to each module definition. If you didn't add them in the Azure portal, add them here to your JSON manifest file. Replace `<proxy URL>` with your value.

Use the following JSON format:

```json
"env": {
    "https_proxy": {
        "value": "<proxy URL>"
    }
}
```

With the environment variables included, the module definition looks like the following edgeHub example:

```json
"edgeHub": {
    "type": "docker",
    "settings": {
        "image": "mcr.microsoft.com/azureiotedge-hub:1.5",
        "createOptions": "{}"
    },
    "env": {
        "https_proxy": {
            "value": "http://proxy.example.com:3128"
        }
    },
    "status": "running",
    "restartPolicy": "always"
}
```

If you included the **UpstreamProtocol** environment variable in the config.yaml file on your IoT Edge device, add that to the IoT Edge agent module definition too.

```json
"env": {
    "https_proxy": {
        "value": "<proxy URL>"
    },
    "UpstreamProtocol": {
        "value": "AmqpWs"
    }
}
```

## Working with traffic inspecting proxies

Some proxies like [Zscaler](https://www.zscaler.com) can inspect TLS-encrypted traffic. During TLS traffic inspection, the certificate returned by the proxy isn't the certificate from the target server but is instead the certificate signed by the proxy's own root certificate. By default, IoT Edge modules (including *edgeAgent* and *edgeHub*) don't trust this proxy's certificate and the TLS handshake fails.

To fix the failed handshake, set up both the operating system and IoT Edge modules to trust the proxy's root certificate by following these steps.

1. Set up the proxy certificate in the trusted root certificate store of your host operating system. For more information about how to install a root certificate, see [Install root CA to OS certificate store](how-to-manage-device-certificates.md#install-root-ca-to-os-certificate-store).

2. Set up your IoT Edge device to communicate through a proxy server by referencing the certificate in the trust bundle. For more information on how to set up the trust bundle, see [Manage trusted root CA (trust bundle)](how-to-manage-device-certificates.md#manage-trusted-root-ca-trust-bundle).

To set up traffic inspection proxy support for containers not managed by IoT Edge, contact your proxy provider. 

## Fully qualified domain names (FQDNs) of destinations IoT Edge communicates with

If your proxy's firewall requires adding all FQDNs to your allowlist for internet connectivity, review the list from [Allow connections from IoT Edge devices](production-checklist.md#allow-connections-from-iot-edge-devices) to determine which FQDNs to add.

## Next steps

Learn about the roles of the [IoT Edge runtime](iot-edge-runtime.md).

Troubleshoot installation and configuration errors in [Common issues and resolutions for Azure IoT Edge](troubleshoot.md).
