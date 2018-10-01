---
title: Configure Azure IoT Edge devices for network proxies | Microsoft Docs
description: How to configure the Azure IoT Edge runtime and any internet-facing IoT Edge modules to communicate through a proxy server. 
author: kgremban
manager: 
ms.author: kgremban
ms.date: 09/24/2018
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Configure an IoT Edge device to communicate through a proxy server

IoT Edge devices send HTTPS requests to communicate with IoT Hub. If your device is connected to a network that uses a proxy server, you need to configure the IoT Edge runtime to communicate through the server. Proxy servers can also affect individual IoT Edge modules if they make HTTP or HTTPS requests that aren't routed through the Edge hub. 

Configuring an IoT Edge device to work with a proxy server follows these basic steps: 

1. Install the IoT Edge runtime on your device. 
2. Configure the Docker daemon and the IoT Edge daemon on your device to use the proxy server.
3. Configure the edgeAgent properties in the config.yaml file on your device.
4. Set environment variables for the IoT Edge runtime and other IoT Edge modules in the deployment manifest. 

## Install the runtime

If you're installing the IoT Edge runtime on a Linux device, configure the package manager to go through your proxy server to access the installation package. For example, [Set up apt-get to use a http-proxy](https://help.ubuntu.com/community/AptGet/Howto/#Setting_up_apt-get_to_use_a_http-proxy). Once your package manager is configured, follow the instructions in [Install Azure IoT Edge runtime on Linux (ARM32v7/armhf)](how-to-install-iot-edge-linux-arm.md) or [Install the Azure IoT Edge runtime on Linux (x64)](how-to-install-iot-edge-linux.md) as usual. 

If you're installing the IoT Edge runtime on a Windows device, you need to go through the proxy server to access the installation package. You can configure proxy information in Windows settings, or include your proxy information directly in the installation script. The following powershell script is an example of a windows installation using the `-proxy` argument:

```powershell
. {Invoke-WebRequest -proxy <proxy URL> -useb aka.ms/iotedge-win} | Invoke-Expression; `
Install-SecurityDaemon -Manual -ContainerOs Windows
```

For more information and installation options, see [Install Azure IoT Edge runtime on Windows to use with Windows containers](how-to-install-iot-edge-windows-with-windows.md) or [Install Azure IoT Edge runtime on Windows to use with Linux containers](how-to-install-iot-edge-windows-with-linux.md).

Once the IoT Edge runtime is installed, use the following section to configure it with your proxy information. 

## Configure the daemons

The Docker and IoT Edge daemons running on your IoT Edge device need to be configured to use the proxy server. The Docker daemon makes web requests to pull container images from container registries. The IoT Edge daemon makes web requests to communicate with IoT Hub.

### Docker daemon

Refer to the Docker documentation to configure the Docker daemon with environment variables. Most container registries (including DockerHub and Azure Container Registries) support HTTPS requests, so the variable that you should set is **HTTPS_PROXY**. If you're pulling images from a registry that doesn't support transport layer security (TLS) then you may should set the **HTTP_PROXY**. 

Choose the article that applies to your Docker version: 

* [Docker](https://docs.docker.com/config/daemon/systemd/#httphttps-proxy)
* [Docker for Windows](https://docs.docker.com/docker-for-windows/#proxies)

### IoT Edge daemon

The IoT Edge daemon is configured in a similar manner to the Docker daemon. All the requests that IoT Edge sends to IoT Hub use HTTPS. Use the following steps to set an environment variable for the service, based on your operating system. 

#### Linux

Open an editor in the terminal to configure the IoT Edge daemon. 

```bash
sudo systemctl edit iotedge
```

Enter the following text, replacing **\<proxy URL>** with your proxy server address and port. Then, save and exit. 

```text
[Service]
Environment="https_proxy=<proxy URL>"
```

Refresh the service manager to pick up the new configuration for iotedge.

```bash
sudo systemctl daemon-reload
```

Restart IoT Edge for the changes to take effect.

```bash
sudo systemctl restart iotedge
```

Verify that your environment variable was created, and the new configuration was loaded. 

```bash
systemctl show --property=Environment iotedge
```

#### Windows

Open a PowerShell window as an administrator and run the following command to edit the registry with the new environment variable. Replace **\<proxy url>** with your proxy server address and port. 

```powershell
reg add HKLM\SYSTEM\CurrentControlSet\Services\iotedge /v Environment /t REG_MULTI_SZ /d https_proxy=<proxy URL>
```

Restart IoT Edge for the changes to take effect.

```powershell
Restart-Service iotedge
```

## Configure the Edge agent

The Edge agent is the first module to start on any IoT Edge device. It's started for the first time based on the information in the IoT Edge config.yaml file. The Edge agent then connects to IoT Hub to retrieve deployment manifests, which declare what other modules should be deployed on the device.

Open the config.yaml file on your IoT Edge device. On Linux systems, this file is located at **/etc/iotedge/config.yaml**. On Windows systems, this file is located at **C:\ProgramData\iotedge\config.yaml**. The configuration file is protected, so you need administrative privileges to access it. On Linux systems, that means using the `sudo` command before opening the file in your preferred text editor. On Windows, that means opening a text editor like Notepad to run as administrator and then opening the file. 

In the config.yaml file, find the **Edge Agent module spec** section. The Edge agent definition includes an **env** parameter where you can add environment variables. 

![edgeAgent definition](./media/how-to-configure-proxy-support/edgeagent-unedited.png)

Remove the curly brackets that are placeholders for the env parameter, and add the new variable on a new line. Remember that indents in YAML are two spaces. 

```yaml
https_proxy: "<proxy URL>"
```

The IoT Edge runtime uses AMQP by default to talk to IoT Hub. Some proxy servers block AMQP ports. If that's the case, then you also need to configure edgeAgent to use AMQP over WebSocket. Add a second environment variable.

```yaml
UpstreamProtocol: "AmqpWs"
```

![edgeAgent definition with environment variables](./media/how-to-configure-proxy-support/edgeagent-edited.png)

Save the changes to config.yaml and close the editor. Restart IoT Edge for the changes to take effect. 

* Linux: 

   ```bash
   sudo systemctl restart iotedge
   ```

* Windows:

   ```powershell
   Restart-Service iotedge
   ```

## Configure deployment manifests  

Once your IoT Edge device is configured to work with your proxy server, you need to also declare the environment variables in all future deployment manifests. The two runtime modules, edgeAgent and edgeHub, should always have the proxy server configured to maintain communication with IoT Hub. You can configure any IoT Edge module to communicate through a proxy server, but it's not necessary for modules that route their messages through edgeHub or that only communicate with other modules on the device. 

You can create deployment manifests using the Azure portal or manually by editing a JSON file. 

### Azure portal

When you use the **Set modules** wizard to create deployments for IoT Edge devices, every module has an **Environment Variables** section that you can use to configure proxy server connections. 

To configure the Edge agent and Edge hub modules, select **Configure advanced Edge Runtime settings** on the first step of the wizard. 

![Configure advanced Edge Runtime settings](./media/how-to-configure-proxy-support/configure-runtime.png)

Add the **https_proxy** environment variable to both the Edge agent and Edge hub module definitions. If you included the **UpstreamProtocol** environment variable in the config.yaml file on your IoT Edge device, add that to the Edge agent module definition too. 

![Set environment variables](./media/how-to-configure-proxy-support/edgehub-environmentvar.png)

All other modules that you add to a deployment manifest follow the same pattern. In the page where you set the module name and image, there is an environment variables section.

### JSON deployment manifest files

If you create deployments for IoT Edge devices using the templates in Visual Studio Code or by manually creating JSON files, you can add the environment variables directly to each module definition. 

Use the following JSON format: 

```json
"env": {
    "https_proxy": {
        "value": "<proxy URL>"
    }
}
```

With the environment variables included, your module definition should look like the following edgeHub example:

```json
"edgeHub": {
    "type": "docker",
    "settings": {
        "image": "mcr.microsoft.com/azureiotedge-hub:1.0",
        "createOptions": ""
    },
    "env": {
        "https_proxy": {
            "value": "https://proxy.example.com:3128"
        }
    },
    "status": "running",
    "restartPolicy": "always"
}
```

If you included the **UpstreamProtocol** environment variable in the confige.yaml file on your IoT Edge device, add that to the Edge agent module definition too. 

```json
"env": {
    "https_proxy": {
        "value": "<proxy URL"
    },
    "UpstreamProtocol": {
        "value": "AmqpWs"
    }
}
```

## Next steps

Learn more about the roles of the [IoT Edge runtime](iot-edge-runtime.md).

Troubleshoot installation and configuration errors with [Common issues and resolutions for Azure IoT Edge](troubleshoot.md)

