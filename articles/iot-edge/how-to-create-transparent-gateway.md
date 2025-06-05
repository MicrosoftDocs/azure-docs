---
title: Create transparent gateway device using Azure IoT Edge
description: Use an Azure IoT Edge device as a transparent gateway that can process information from downstream devices
author: PatAltimore

ms.author: patricka
ms.date: 06/05/2025
ms.topic: concept-article
ms.service: azure-iot-edge
services: iot-edge
ms.custom:  [amqp, mqtt]
---

# Configure an IoT Edge device to act as a transparent gateway

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

This article gives detailed instructions to configure an IoT Edge device as a transparent gateway so other devices can connect to IoT Hub. In this article, *IoT Edge gateway* means an IoT Edge device configured as a transparent gateway. For more information, see [How an IoT Edge device can be used as a gateway](./iot-edge-as-gateway.md).

>[!NOTE]
>Downstream devices can't use file upload.

There are three main steps to set up a transparent gateway connection. This article covers the first step:

1. **Configure the gateway device as a server so downstream devices can connect securely. Set up the gateway to receive messages from downstream devices and route them to the right destination.**
2. Create a device identity for the downstream device so it can authenticate with IoT Hub. Configure the downstream device to send messages through the gateway device. For those steps, see [Authenticate a downstream device to Azure IoT Hub](how-to-authenticate-downstream-device.md).
3. Connect the downstream device to the gateway device and start sending messages. For those steps, see [Connect a downstream device to an Azure IoT Edge gateway](how-to-connect-downstream-device.md).

To act as a gateway, a device needs to connect securely to its downstream devices. Azure IoT Edge lets you use public key infrastructure (PKI) to set up secure connections between devices. In this case, a downstream device connects to an IoT Edge device acting as a transparent gateway. To keep things secure, the downstream device checks the gateway device's identity. This check helps prevent devices from connecting to malicious gateways.

A downstream device can be any application or platform with an identity created in [Azure IoT Hub](../iot-hub/index.yml). These applications often use the [Azure IoT device SDK](../iot-hub/iot-hub-devguide-sdks.md). A downstream device can even be an application running on the IoT Edge gateway device itself.

You can create any certificate infrastructure that enables the trust required for your device-gateway topology. In this article, we use the same certificate setup as [X.509 CA security](../iot-hub/iot-hub-x509ca-overview.md) in IoT Hub. This setup uses an X.509 CA certificate associated to a specific IoT hub (the IoT hub root CA), a series of certificates signed with this CA, and a CA for the IoT Edge device.

>[!NOTE]
>The term *root CA certificate* used throughout these articles refers to the topmost authority public certificate of the PKI certificate chain, and not necessarily the certificate root of a syndicated certificate authority. In many cases, it's actually an intermediate CA public certificate.

Follow these steps to create the certificates and install them in the right places on the gateway. Use any machine to generate the certificates, then copy them to your IoT Edge device.

## Prerequisites

# [IoT Edge](#tab/iotedge)

You need a Linux or Windows device with IoT Edge installed.

If you don't have a device ready, create one in an Azure virtual machine. Follow the steps in [Deploy your first IoT Edge module to a virtual Linux device](quickstart-linux.md) to create an IoT Hub, create a virtual machine, and configure the IoT Edge runtime.

# [IoT Edge for Linux on Windows](#tab/eflow)

>[!WARNING]
> Because the IoT Edge for Linux on Windows (EFLOW) virtual machine needs to be accessible from external devices, make sure to deploy EFLOW with an *external* virtual switch. For more information about EFLOW networking configurations, see [Networking configuration for Azure IoT Edge for Linux on Windows](./how-to-configure-iot-edge-for-linux-on-windows-networking.md).

You need a Windows device with IoT Edge for Linux on Windows installed.

If you don't have a device ready, create one before you continue with this guide. Follow the steps in [Create and provision an IoT Edge for Linux on Windows device using symmetric keys](./how-to-provision-single-device-linux-on-windows-symmetric.md) to create an IoT Hub, create an EFLOW virtual machine, and configure the IoT Edge runtime.

---

## Set up the Edge CA certificate

All IoT Edge gateways need an Edge CA certificate installed on them. The IoT Edge security daemon uses the Edge CA certificate to sign a workload CA certificate, which in turn signs a server certificate for IoT Edge hub. The gateway presents its server certificate to the downstream device during the initiation of the connection. The downstream device checks to make sure that the server certificate is part of a certificate chain that rolls up to the root CA certificate. This process allows the downstream device to confirm that the gateway comes from a trusted source. For more information, see [Understand how Azure IoT Edge uses certificates](iot-edge-certs.md).

:::image type="content" source="./media/how-to-create-transparent-gateway/gateway-setup.png" alt-text="Screenshot that shows the gateway certificate setup." lightbox="./media/how-to-create-transparent-gateway/gateway-setup.png":::

The root CA certificate and the Edge CA certificate (with its private key) must be on the IoT Edge gateway device and set in the IoT Edge configuration file. In this case, *root CA certificate* means the top certificate authority for this IoT Edge scenario. The gateway Edge CA certificate and the downstream device certificates must roll up to the same root CA certificate.

>[!TIP]
>The process of installing the root CA certificate and Edge CA certificate on an IoT Edge device is also explained in more detail in [Manage certificates on an IoT Edge device](how-to-manage-device-certificates.md).

Have the following files ready:

* Root CA certificate
* Edge CA certificate
* Device CA private key

For production scenarios, generate these files with your own certificate authority. For development and test scenarios, you can use demo certificates.

### Create demo certificates

If you don't have your own certificate authority and want to use demo certificates, follow the instructions in [Create demo certificates to test IoT Edge device features](how-to-create-test-certificates.md) to create your files. On that page, follow these steps:

1. Set up the scripts for generating certificates on your device.
1. Create a root CA certificate. At the end, you have a root CA certificate file `<path>/certs/azure-iot-test-only.root.ca.cert.pem`.
1. Create Edge CA certificates. At the end, you have an Edge CA certificate `<path>/certs/iot-edge-device-ca-<cert name>-full-chain.cert.pem` and its private key `<path>/private/iot-edge-device-ca-<cert name>.key.pem`.

### Copy certificates to device

# [IoT Edge](#tab/iotedge)

1. Check the certificate meets [format requirements](how-to-manage-device-certificates.md#format-requirements).
1. If you created the certificates on a different machine, copy them to your IoT Edge device. Use a USB drive, a service like [Azure Key Vault](/azure/key-vault/general/overview), or a command like [Secure file copy](https://www.ssh.com/ssh/scp/).
1. Move the files to the preferred directory for certificates and keys: `/var/aziot/certs` for certificates and `/var/aziot/secrets` for keys.
1. Create the certificates and keys directories and set permissions. Store your certificates and keys in the preferred `/var/aziot` directory: `/var/aziot/certs` for certificates and `/var/aziot/secrets` for keys.

   ```bash
   # If the certificate and keys directories don't exist, create, set ownership, and set permissions
   sudo mkdir -p /var/aziot/certs
   sudo chown aziotcs:aziotcs /var/aziot/certs
   sudo chmod 755 /var/aziot/certs

   sudo mkdir -p /var/aziot/secrets
   sudo chown aziotks:aziotks /var/aziot/secrets
   sudo chmod 700 /var/aziot/secrets
   ```
1. Change the ownership and permissions for the certificates and keys.

   ```bash
   # Give aziotcs ownership to certificates
   # Read and write for aziotcs, read-only for others
   sudo chown -R aziotcs:aziotcs /var/aziot/certs
   sudo find /var/aziot/certs -type f -name "*.*" -exec chmod 644 {} \;

   # Give aziotks ownership to private keys
   # Read and write for aziotks, no permission for others
   sudo chown -R aziotks:aziotks /var/aziot/secrets
    sudo find /var/aziot/secrets -type f -name "*.*" -exec chmod 600 {} \;
   ```

# [IoT Edge for Linux on Windows](#tab/eflow)

Now, copy the certificates to the Azure IoT Edge for Linux on Windows virtual machine.

For more information about these commands, see [PowerShell functions for IoT Edge](reference-iot-edge-for-linux-on-windows-functions.md).

1. Check the certificate meets [format requirements](how-to-manage-device-certificates.md#format-requirements).

1. Copy the certificates to the EFLOW virtual machine in a directory where you have write access, such as the `/home/iotedge-user` home directory.

   ```powershell
   # Copy the Edge CA certificate and key
   Copy-EflowVMFile -fromFile <path>\certs\iot-edge-device-ca-<cert name>-full-chain.cert.pem -toFile ~/iot-edge-device-ca-<cert name>-full-chain.cert.pem -pushFile
   Copy-EflowVMFile -fromFile <path>\private\iot-edge-device-ca-<cert name>.key.pem -toFile ~/iot-edge-device-ca-<cert name>.key.pem -pushFile

   # Copy the root CA certificate
   Copy-EflowVMFile -fromFile <path>\certs\azure-iot-test-only.root.ca.cert.pem -toFile ~/azure-iot-test-only.root.ca.cert.pem -pushFile
   ```
1. Open an elevated _PowerShell_ session by starting with **Run as Administrator**.

   Connect to the EFLOW virtual machine.

   ```powershell
   Connect-EflowVm
   ```

1. Create the certificates and keys directories and set permissions. You should store your certificates and keys to the preferred `/var/aziot` directory. Use `/var/aziot/certs` for certificates and `/var/aziot/secrets` for keys.

   ```bash
   # If the certificate and keys directories don't exist, create, set ownership, and set permissions
   sudo mkdir -p /var/aziot/certs
   sudo chown aziotcs:aziotcs /var/aziot/certs
   sudo chmod 755 /var/aziot/certs

   sudo mkdir -p /var/aziot/secrets
   sudo chown aziotks:aziotks /var/aziot/secrets
   sudo chmod 700 /var/aziot/secrets
   ```

1. Move the certificates and keys to the preferred `/var/aziot` directory.

   ```bash
   # Move the Edge CA certificate and key to preferred location
   sudo mv ~/azure-iot-test-only.root.ca.cert.pem /var/aziot/certs
   sudo mv ~/iot-edge-device-ca-<cert name>-full-chain.cert.pem /var/aziot/certs
   sudo mv ~/iot-edge-device-ca-<cert name>.key.pem /var/aziot/secrets
   ```

1. Change the ownership and permissions of the certificates and keys.

   ```bash
   # Give aziotcs ownership to certificate
   # Read and write for aziotcs, read-only for others
   sudo chown aziotcs:aziotcs /var/aziot/certs/azure-iot-test-only.root.ca.cert.pem
   sudo chown aziotcs:aziotcs /var/aziot/certs/iot-edge-device-ca-<cert name>-full-chain.cert.pem
   sudo chmod 644 /var/aziot/certs/azure-iot-test-only.root.ca.cert.pem
   sudo chmod 644 /var/aziot/certs/iot-edge-device-ca-<cert name>-full-chain.cert.pem

   # Give aziotks ownership to private key
   # Read and write for aziotks, no permission for others
   sudo chown aziotks:aziotks /var/aziot/secrets/iot-edge-device-ca-<cert name>.key.pem
   sudo chmod 600 /var/aziot/secrets/iot-edge-device-ca-<cert name>.key.pem
   ```
 
1. Exit the EFLOW VM connection.

   ```bash
   exit
   ```

----

### Configure certificates on device

1. On your IoT Edge device, open the config file: `/etc/aziot/config.toml`. If you use IoT Edge for Linux on Windows, connect to the EFLOW virtual machine using the `Connect-EflowVm` PowerShell cmdlet.

   >[!TIP]
   >If the config file doesn't exist on your device yet, then use `/etc/aziot/config.toml.edge.template` as a template to create one.

1. Find the `trust_bundle_cert` parameter. Uncomment this line and provide the file URI to the root CA certificate file on your device.

1. Find the `[edge_ca]` section of the file. Uncomment the three lines in this section and provide the file URIs to your certificate and key files as values for the following properties:
   * **cert**: Edge CA certificate
   * **pk**: device CA private key

1. Save and close the file.

1. Apply your changes.

   ```bash
   sudo iotedge config apply
   ```

## Deploy edgeHub and route messages

Downstream devices send telemetry and messages to the gateway device, where the IoT Edge hub module routes the information to other modules or to IoT Hub. To prepare your gateway device for this function, make sure that:

* The IoT Edge hub module is deployed to the device.

  When you install IoT Edge on a device, only one system module starts automatically: the IoT Edge agent. When you create the first deployment for a device, the second system module and the IoT Edge hub start as well. If the **edgeHub** module isn't running on your device, create a deployment for your device.

* The IoT Edge hub module has routes set up to handle incoming messages from downstream devices.

  The gateway device needs a route to handle messages from downstream devices, or those messages aren't processed. You can send the messages to modules on the gateway device or directly to IoT Hub.

To deploy the IoT Edge hub module and configure routes to handle incoming messages from downstream devices, follow these steps:

1. In the Azure portal, go to your IoT hub.

2. Go to **Devices** under the **Device management** menu and select your IoT Edge device to use as a gateway.

3. Select **Set Modules**.

4. On the **Modules** page, add any modules you want to deploy to the gateway device. In this article, you're focused on configuring and deploying the edgeHub module, which doesn't need to be explicitly set on this page.

5. Select **Next: Routes**.

6. On the **Routes** page, make sure there's a route to handle messages from downstream devices. For example:

   * A route that sends all messages, whether from a module or from a downstream device, to IoT Hub:
       * **Name**: `allMessagesToHub`
       * **Value**: `FROM /messages/* INTO $upstream`

   * A route that sends all messages from all downstream devices to IoT Hub:
      * **Name**: `allDownstreamToHub`
      * **Value**: `FROM /messages/* WHERE NOT IS_DEFINED ($connectionModuleId) INTO $upstream`

      This route works because, unlike messages from IoT Edge modules, messages from downstream devices don't have a module ID associated with them. Using the **WHERE** clause of the route lets you filter out any messages with that system property.

      For more information about message routing, see [Deploy modules and establish routes](./module-composition.md#declare-routes).

7. After you create your route or routes, select **Review + create**.

8. On the **Review + create** page, select **Create**.

## Open ports on gateway device

Standard IoT Edge devices don't need any inbound connectivity to function, because all communication with IoT Hub is done through outbound connections. Gateway devices are different because they need to receive messages from their downstream devices. If a firewall is between the downstream devices and the gateway device, then communication needs to be possible through the firewall as well.

# [IoT Edge](#tab/iotedge)

For a gateway scenario to work, at least one of the IoT Edge Hub's supported protocols must be open for inbound traffic from downstream devices. The supported protocols are MQTT, AMQP, HTTPS, MQTT over WebSockets, and AMQP over WebSockets.

| Port | Protocol |
| ---- | -------- |
| 8883 | MQTT |
| 5671 | AMQP |
| 443 | HTTPS <br> MQTT+WS <br> AMQP+WS |

# [IoT Edge for Linux on Windows](#tab/eflow)

For a gateway scenario to work, at least one of the IoT Edge Hub's supported protocols must be open for inbound traffic from downstream devices. The supported protocols are MQTT, AMQP, HTTPS, MQTT over WebSockets, and AMQP over WebSockets.

| Port | Protocol |
| ---- | -------- |
| 8883 | MQTT |
| 5671 | AMQP |
| 443 | HTTPS <br> MQTT+WS <br> AMQP+WS |

Next, open the EFLOW virtual machine ports. Use the following PowerShell cmdlets to open the three ports previously mentioned.

   ```powershell
   # Open MQTT port
   Invoke-EflowVmCommand "sudo iptables -A INPUT -p tcp --dport 8883 -j ACCEPT"

   # Open AMQP port
   Invoke-EflowVmCommand "sudo iptables -A INPUT -p tcp --dport 5671 -j ACCEPT"

   # Open HTTPS/MQTT+WS/AMQP+WS port
   Invoke-EflowVmCommand "sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT"

   # Save the iptables rules
   Invoke-EflowVmCommand "sudo iptables-save | sudo tee /etc/systemd/scripts/ip4save"
   ```
---

## Next steps

Now that you set up an IoT Edge device as a transparent gateway, set up your downstream devices to trust the gateway and send messages to it. Continue to [Authenticate a downstream device to Azure IoT Hub](how-to-authenticate-downstream-device.md) for the next steps in your transparent gateway scenario.
