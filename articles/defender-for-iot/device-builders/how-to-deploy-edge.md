---
title: Deploy IoT Edge security module
description: Learn about how to deploy a Defender for IoT security agent on IoT Edge.
ms.topic: conceptual
ms.date: 03/28/2022
---

# Deploy a security module on your IoT Edge device

**Defender for IoT** module provides a comprehensive security solution for your IoT Edge devices. The security module collects, aggregates, and analyzes raw security data from your Operating System and Container system into actionable security recommendations and alerts. To learn more, see [Security module for IoT Edge](security-edge-architecture.md).

In this article, you'll learn how to deploy a security module on your IoT Edge device.

## Deploy security module

Use the following steps to deploy a Defender for IoT security module for IoT Edge.

### Prerequisites

1. In your IoT Hub, make sure your device is [Register a new device](../../iot-edge/how-to-provision-single-device-linux-symmetric.md#register-your-device).

1. Defender for IoT Edge module requires the [AuditD framework](https://linux.die.net/man/8/auditd) is installed on the IoT Edge device.

    - Install the framework by running the following command on your IoT Edge device:

    `sudo apt-get install auditd audispd-plugins`

    - Verify AuditD is active by running the following command:

    `sudo systemctl status auditd`<br>
    - Expected response is: `active (running)`

### Deployment using Azure portal

1. From the Azure portal, open **Marketplace**.

1. Select **Internet of Things**, then search for **Azure Security Center for IoT** and select it.

   :::image type="content" source="media/howto/edge-onboarding.png" alt-text="Select Defender for IoT":::

1. Select **Create** to configure the deployment.

1. Choose the Azure **Subscription** of your IoT Hub, then select your **IoT Hub**.<br>Select **Deploy to a device** to target a single device or select **Deploy at Scale** to target multiple devices, and select **Create**. For more information about deploying at scale, see [How to deploy](../../iot-edge/how-to-deploy-at-scale.md).

    >[!Note]
    >If you selected **Deploy at Scale**, add the device name and details before continuing to the **Add Modules** tab in the following instructions.

Complete each step to complete your IoT Edge deployment for Defender for IoT.

#### Step 1: Modules

1. Select the **AzureSecurityCenterforIoT** module.

1. On the **Module Settings** tab, change the **name** to **azureiotsecurity**.

1. On the **Environment Variables** tab, add a variable if needed (for example, you can add *debug level* and set it to one of the following values: "Fatal", "Error", "Warning", or "Information").

1. On the **Container Create Options** tab, add the following configuration:

    ``` json
    {
        "NetworkingConfig": {
            "EndpointsConfig": {
                "host": {}
            }
        },
        "HostConfig": {
            "Privileged": true,
            "NetworkMode": "host",
            "PidMode": "host",
            "Binds": [
                "/:/host"
            ]
        }
    }
    ```

1. On the **Module Twin Settings** tab, add the following configuration:

   Module Twin Property:

   ``` json
     "ms_iotn:urn_azureiot_Security_SecurityAgentConfiguration"
   ```

   Module Twin Property Content:

   ```json
     {

     }
   ```

   For more information about configuring the agent, see [Configure security agents](./how-to-agent-configuration.md).

1. Select **Update**.

#### Step 2: Runtime settings

1. Select **Runtime Settings**.
2. Under **Edge Hub**, change the **Image** to **mcr.microsoft.com/azureiotedge-hub:1.0.8.3**.

    >[!Note]
    > Currently, version 1.0.8.3 or older is supported.

3. Verify **Create Options** is set to the following configuration:

    ``` json
    {
       "HostConfig":{
          "PortBindings":{
             "8883/tcp":[
                {
                   "HostPort":"8883"
                }
             ],
             "443/tcp":[
                {
                   "HostPort":"443"
                }
             ],
             "5671/tcp":[
                {
                   "HostPort":"5671"
                }
             ]
          }
       }
    }
    ```

4. Select **Save**.

5. Select **Next**.

#### Step 3: Specify routes

1. On the **Specify Routes** tab, make sure you have a route (explicit or implicit) that will forward messages from the **azureiotsecurity** module to **$upstream** according to the following examples. Only when the route is in place, select **Next**.

   Example routes:

    ```Default implicit route
    "route": "FROM /messages/* INTO $upstream"
    ```

    ```Explicit route
    "ASCForIoTRoute": "FROM /messages/modules/azureiotsecurity/* INTO $upstream"
    ```

1. Select **Next**.

#### Step 4: Review deployment

- On the **Review Deployment** tab, review your deployment information, then select **Create** to complete the deployment.

## Diagnostic steps

If you encounter an issue, container logs are the best way to learn about the state of an IoT Edge security module device. Use the commands and tools in this section to gather information.

### Verify the required containers are installed and functioning as expected

1. Run the following command on your IoT Edge device:

    `sudo docker ps`

1. Verify that the following containers are running:

   | Name | IMAGE |
   | --- | --- |
   | azureiotsecurity | mcr.microsoft.com/ascforiot/azureiotsecurity:1.0.2 |
   | edgeHub | mcr.microsoft.com/azureiotedge-hub:1.0.8.3 |
   | edgeAgent | mcr.microsoft.com/azureiotedge-agent:1.0.1 |

   If the minimum required containers are not present, check if your IoT Edge deployment manifest is aligned with the recommended settings. For more information, see [Deploy IoT Edge module](#deployment-using-azure-portal).

### Inspect the module logs for errors

1. Run the following command on your IoT Edge device:

   `sudo docker logs azureiotsecurity`

1. For more verbose logs, add the following environment variable to the **azureiotsecurity** module deployment: `logLevel=Debug`.

## Next steps

To learn more about configuration options, continue to the how-to guide for module configuration.
> [!div class="nextstepaction"]
> [Module configuration how-to guide](./how-to-agent-configuration.md)
