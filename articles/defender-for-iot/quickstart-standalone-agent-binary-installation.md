---
title: Install Defender for IoT micro agent (Preview)
titleSuffix: Azure Defender for IoT
description: Learn how to install, and authenticate the Defender Micro Agent.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 3/9/2021
ms.topic: quickstart
ms.service: azure
---

# Install Defender for IoT micro agent (Preview)

This article provides an explanation of how to install, and authenticate the Defender micro agent.

## Prerequisites

Before you install the Defender for IoT module, you must create a module identity in the IoT Hub. For more information on how to create a module identity, see [Create a Defender IoT micro agent module twin (Preview)](quickstart-create-micro-agent-module-twin.md).

## Install the package

Install, and configure the Microsoft package repository by following [these instructions](/windows-server/administration/linux-package-repository-for-microsoft-software). 

For Debian 9, the instructions do not include the repository that needs to be added, use the following commands to add the repository: 

```azurecli
curl -sSL https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add - 

sudo apt-get install software-properties-common

sudo apt-add-repository https://packages.microsoft.com/debian/9/multiarch/prod

sudo apt-get update
```

To install the Defender micro agent package on Debian, and Ubuntu based Linux distributions, use the following command:

```azurecli
sudo apt-get install defender-iot-micro-agent 
```

## Micro agent authentication methods 

The two options used to authenticate the Defender for IoT micro agent are: 

- Module identity connection string. 

- Certificate.

### Authenticate using a module identity connection string

Ensure the [Prerequisites](#prerequisites) for this article are met, and that you create a module identity before starting these steps. 

#### Get the module identity connection string

To get the module identity connection string from the IoT Hub: 

1. Navigate to the IoT Hub, and select your hub.

1. In the left-hand menu, under the **Explorers** section, select **IoT devices**.

   :::image type="content" source="media/quickstart-standalone-agent-binary-installation/iot-devices.png" alt-text="Select IoT devices from the left-hand menu.":::

1. Select a device from the Device ID list to view the **Device details** page.

1. Select the **Module identities** tab, and then select the **DefenderIotMicroAgent** module from the list of module identities associated with the device.

   :::image type="content" source="media/quickstart-standalone-agent-binary-installation/module-identities.png" alt-text="Select the module identities tab.":::

1. In the **Module Identity Details** page, copy the primary key by selecting the **copy** button.

   :::image type="content" source="media/quickstart-standalone-agent-binary-installation/copy-button.png" alt-text="Select the copy button to copy the primary key.":::

#### Configure authentication using a module identity connection string

To configure the agent to authenticate using a module identity connection string:

1. Place a file named `connection_string.txt` containing the connection string encoded in utf-8 in the defender agent directory `/var/defender_iot_micro_agent` path by entering the following command:

    ```azurecli
    sudo bash -c 'echo "<connection string" > /var/defender_iot_micro_agent/connection_string.txt' 
    ```

    The `connection_string.txt` should be located in the following path location `/var/defender_iot_micro_agent/connection_string.txt`.

1. Restart the service using this command:  

    ```azurecli
    sudo systemctl restart defender-iot-micro-agent.service 
    ```

### Authenticate using a certificate

To authenticate using a certificate:

1. Procure a certificate by following [these instructions](../iot-hub/iot-hub-security-x509-get-started.md).

1. Place the PEM-encoded public part of the certificate, and the private key, in to the Defender Agent Directory in to the file called `certificate_public.pem`, and `certificate_private.pem`. 

1. Place the appropriate connection string in to the `connection_string.txt` file. the connection string should look like this: 

    `HostName=<the host name of the iot hub>;DeviceId=<the id of the device>;ModuleId=<the id of the module>;x509=true` 

    This string alerts the defender agent, to expect a certificate be provided for authentication. 

1. Restart the service using the following command:  

    ```azurecli
    sudo systemctl restart defender-iot-micro-agent.service
    ```

### Validate your installation

To validate your installation:

1. Making sure the micro agent is running properly with the following command:  

    ```azurecli
    systemctl status defender-iot-micro-agent.service
    ```
1. Ensure that the service is stable by making sure it is `active` and that the uptime of the process is appropriate

    :::image type="content" source="media/quickstart-standalone-agent-binary-installation/active-running.png" alt-text="Check to make sure your service is stable and active.":::
 
## Testing the system end-to-end 

You can test the system from end to end by creating a trigger file on the device. The trigger file will cause the baseline scan in the agent to detect the file as a baseline violation. 

Create a file on the file system with the following command:

```azurecli
sudo touch /tmp/DefenderForIoTOSBaselineTrigger.txt 
```
A baseline validation failure recommendation will occur in the hub, with a `CceId` of CIS-debian-9-DEFENDER_FOR_IOT_TEST_CHECKS-0.0: 

:::image type="content" source="media/quickstart-standalone-agent-binary-installation/validation-failure.png" alt-text="The baseline validation failure recommendation that occurs in the hub." lightbox="media/quickstart-standalone-agent-binary-installation/validation-failure-expanded.png":::

Allow up to one hour for the recommendation to appear in the hub. 

## Micro agent versioning 

To install a specific version of the Defender IoT micro agent, run the following command: 

```azurecli
sudo apt-get install defender-iot-micro-agent=<version>
```

## Next steps

[Building the Defender micro agent from source code](quickstart-building-the-defender-micro-agent-from-source.md)