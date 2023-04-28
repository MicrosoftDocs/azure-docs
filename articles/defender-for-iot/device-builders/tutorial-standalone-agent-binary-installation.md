---
title: Install the Microsoft Defender for IoT micro agent
description: Learn how to install and authenticate the Defender for IoT micro agent.
ms.date: 04/26/2022
ms.topic: tutorial
ms.custom: mode-other
#Customer intent: As an Azure admin I want to install the Defender for IoT agent on devices connected to an Azure IoT Hub
---

# Tutorial: Install the Defender for IoT micro agent

This tutorial will help you learn how to install and authenticate the Defender for IoT micro agent.

In this tutorial you'll learn how to:

> [!div class="checklist"]
> - Download and install the micro agent
> - Authenticate the micro agent
> - Validate the installation
> - Test the system
> - Install a specific micro agent version

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An [IoT hub](../../iot-hub/iot-hub-create-through-portal.md).

- Verify you're running one of the following [operating systems](concept-agent-portfolio-overview-os-support.md).

- You must have [enabled Microsoft Defender for IoT on your Azure IoT Hub](quickstart-onboard-iot-hub.md).

- You must have [added a resource group to your IoT solution](quickstart-configure-your-solution.md).

- You must have [created a Defender for IoT micro agent module twin](quickstart-create-micro-agent-module-twin.md).

## Download and install the micro agent

Depending on your setup, the appropriate Microsoft package will need to be installed.

**To add the appropriate Microsoft package repository**:

1. Download the repository configuration that matches your device operating system.  

    - For Ubuntu 18.04:

        ```bash
        curl https://packages.microsoft.com/config/ubuntu/18.04/multiarch/prod.list > ./microsoft-prod.list
        ```

    - For Ubuntu 20.04:

        ```bash
            curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list > ./microsoft-prod.list
        ```

    - For Debian 9 (both AMD64 and ARM64):

        ```bash
        curl https://packages.microsoft.com/config/debian/stretch/multiarch/prod.list > ./microsoft-prod.list
        ```

1. Use the following command to copy the repository configuration to the `sources.list.d` directory:

    ```bash
    sudo cp ./microsoft-prod.list /etc/apt/sources.list.d/
    ```

1. Install the Microsoft GPG public key with the following command:

    ```bash
    curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
    sudo cp ./microsoft.gpg /etc/apt/trusted.gpg.d/
    ```

1. Ensure that you've updated the apt using the following command:

    ```bash
    sudo apt-get update
    ```

1. Use the following command to install the Defender for IoT micro agent package on Debian, or Ubuntu based Linux distributions:

    ```bash
    sudo apt-get install defender-iot-micro-agent 
    ```

## Connect via a proxy

This procedure describes how you can connect the Defender for IoT micro agent to the IoT Hub via a proxy.

**To configure connections via a proxy**:

1. On your micro agent machine, create a `/etc/defender_iot_micro_agent/conf.json` file with the following content:

    ```json
    {
        "IothubModule_ProxyConfig": "<proxy_ipv4>,<port>,<username>,<password>",
        "IothubModule_TransportProtocol": "MQTT_WebSocket_Protocol"
    }
    ```

    User and password fields are optional. If you don't need them, use the following syntax instead:

    ```json
    {
        "IothubModule_ProxyConfig": "<proxy_ipv4>,<port>",
        "IothubModule_TransportProtocol": "MQTT_WebSocket_Protocol"
    }

1. Delete any cached file at **/var/lib/defender_iot_micro_agent/cache.json**.

1. Restart the micro agent. Run:

    ```bash
    sudo systemctl restart defender-iot-micro-agent.service
    ```

## Add AMQP protocol support

This procedure describes additional steps required to support the AMQP protocol.

**To add AMQP protocol support**:

1. On your micro agent machine, open the `/etc/defender_iot_micro_agent/conf.json` file and add the following content:

    ```json
    {
    "IothubModule_TransportProtocol": "AMQP_Protocol"
    }
    ```
1. Delete any cached file at **/var/lib/defender_iot_micro_agent/cache.json**.

1. Restart the micro agent. Run:

    ```bash
    sudo systemctl restart defender-iot-micro-agent.service
    ```

**To add AMQP over web socket protocol support**:

1. On your micro agent machine, open the `/etc/defender_iot_micro_agent/conf.json` file and add the following content:

    ```json
    {
    "IothubModule_TransportProtocol": "AMQP_WebSocket_Protocol"
    }
    ```
1. Delete any cached file at **/var/lib/defender_iot_micro_agent/cache.json**.

1. Restart the micro agent. Run:

    ```bash
    sudo systemctl restart defender-iot-micro-agent.service
    ```

The agent will use this protocol, and communicate with the IoT Hub on port 443.
Http Proxy configuration is supported for this protocol, in the case that proxy is also configured, the port of communication with the proxy will be as defined in the proxy configuration.

## Authenticate the micro agent

There are two options that can be used to authenticate the Defender for IoT micro agent:

- [Authenticate using a module identity connection string](#authenticate-using-a-module-identity-connection-string).

- [Authenticate using a certificate](#authenticate-using-a-certificate).

### Authenticate using a module identity connection string

You will need to copy the module identity connection string from the DefenderIoTMicroAgent module identity details.

**To copy the module identity's connection string**:

1. Navigate to the **IoT Hub** > **`Your hub`** > **Device management** > **Devices**.

   :::image type="content" source="media/quickstart-standalone-agent-binary-installation/iot-devices.png" alt-text="Select IoT devices from the left-hand menu.":::

1. Select a device from the Device ID list.

1. Select the **Module Identities** tab.

1. Select the **DefenderIotMicroAgent** module from the list of module identities associated with the device.

   :::image type="content" source="media/quickstart-standalone-agent-binary-installation/module-identities.png" alt-text="Select the module identities tab.":::

1. Copy the Connection string (primary key) by selecting the **copy** button.

   :::image type="content" source="media/quickstart-standalone-agent-binary-installation/copy-button.png" alt-text="Select the copy button to copy the Connection string (primary key).":::

1. Create a file named `connection_string.txt` containing the copied connection string encoded in utf-8 in the Defender for IoT agent directory `/etc/defender_iot_micro_agent` path by entering the following command:

    ```bash
    sudo bash -c 'echo "<connection string>" > /etc/defender_iot_micro_agent/connection_string.txt'
    ```

    The `connection_string.txt` will now be located in the following path location `/etc/defender_iot_micro_agent/connection_string.txt`.
    
    > [!NOTE]
    > The connection string includes a key that enables direct access to the module itself, therefore includes sensitive information that should only be used and readable by root users.

1. Restart the service using this command:  

    ```bash
    sudo systemctl restart defender-iot-micro-agent.service 
    ```

### Authenticate using a certificate

**To authenticate using a certificate**:

1. Procure a certificate by following [these instructions](../../iot-hub/tutorial-x509-scripts.md).

1. Place the PEM-encoded public part of the certificate, and the private key, in `/etc/defender_iot_micro_agent`, to files called `certificate_public.pem`, and `certificate_private.pem`.

1. Place the appropriate connection string in to the `connection_string.txt` file. The connection string should look like this:

    `HostName=<the host name of the iot hub>;DeviceId=<the id of the device>;ModuleId=<the id of the module>;x509=true`

    This string alerts the Defender for IoT agent to expect a certificate to be provided for authentication.

1. Restart the service using the following command:  

    ```bash
    sudo systemctl restart defender-iot-micro-agent.service
    ```

## Validate the installation

**To validate your installation**:

1. Use the following command to ensure the micro agent is running properly:  

    ```bash
    systemctl status defender-iot-micro-agent.service
    ```

1. Ensure that the service is stable by making sure it's `active`, and that the uptime of the process is appropriate.

    :::image type="content" source="media/quickstart-standalone-agent-binary-installation/active-running.png" alt-text="Check to make sure your service is stable and active.":::

## Test the system

You can test the system by creating a trigger file on the device. The trigger file will cause the baseline scan in the agent to detect the file as a baseline violation.

1. Create a file on the file system with the following command:

    ```bash
    sudo touch /tmp/DefenderForIoTOSBaselineTrigger.txt
    ```

1. Make sure that your Log Analytics workspace is attached to your IoT hub. For more information, see [Create a log analytics workspace](tutorial-configure-agent-based-solution.md#create-a-log-analytics-workspace).

1. Restart the agent using the command:

    ```bash
    sudo systemctl restart defender-iot-micro-agent.service
    ```

Allow up to one hour for the recommendation to appear in the hub.

A baseline recommendation called 'IoT_CISBenchmarks_DIoTTest' is created. You can query this recommendation from Log Analytics as follows:

```kusto
SecurityRecommendation

| where RecommendationName contains "IoT_CISBenchmarks_DIoTTest"

| where DeviceId contains "<device-id>"

| top 1 by TimeGenerated desc
```

For example:

:::image type="content" source="media/tutorial-standalone-agent-binary-installation/iot_cisbenchmarks_diottest.png" alt-text="Screenshot of the IoT_CISBenchmarks_DIoTTest query run in Log Analytics.":::

## Install a specific micro agent version

You can install a specific version of the micro agent using a specific command.

**To install a specific version of the Defender for IoT micro agent**:

1. Open a terminal.

1. Run the following command:

    ```bash
    sudo apt-get install defender-iot-micro-agent=<version>
    ```

## Clean up resources

There are no resources to clean up.

## Next steps

> [!div class="nextstepaction"]
> [Configure Microsoft Defender for IoT agent-based solution](tutorial-configure-agent-based-solution.md)
