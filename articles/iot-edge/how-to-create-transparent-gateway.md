---
title: Create transparent gateway device using Azure IoT Edge
description: Use an Azure IoT Edge device as a transparent gateway that can process information from downstream devices
author: PatAltimore

ms.author: patricka
ms.date: 01/17/2022
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
ms.custom:  [amqp, mqtt]
---

# Configure an IoT Edge device to act as a transparent gateway

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

This article provides detailed instructions for configuring an IoT Edge device to function as a transparent gateway for other devices to communicate with IoT Hub. This article uses the term *IoT Edge gateway* to refer to an IoT Edge device configured as a transparent gateway. For more information, see [How an IoT Edge device can be used as a gateway](./iot-edge-as-gateway.md).

>[!NOTE]
>Downstream devices can't use file upload.

There are three general steps to set up a successful transparent gateway connection. This article covers the first step:

1. **Configure the gateway device as a server so that downstream devices can connect to it securely. Set up the gateway to receive messages from downstream devices and route them to the proper destination.**
2. Create a device identity for the downstream device so that it can authenticate with IoT Hub. Configure the downstream device to send messages through the gateway device. For those steps, see [Authenticate a downstream device to Azure IoT Hub](how-to-authenticate-downstream-device.md).
3. Connect the downstream device to the gateway device and start sending messages. For those steps, see [Connect a downstream device to an Azure IoT Edge gateway](how-to-connect-downstream-device.md).

For a device to act as a gateway, it needs to securely connect to its downstream devices. Azure IoT Edge allows you to use a public key infrastructure (PKI) to set up secure connections between devices. In this case, we're allowing a downstream device to connect to an IoT Edge device acting as a transparent gateway. To maintain reasonable security, the downstream device should confirm the identity of the gateway device. This identity check prevents your devices from connecting to potentially malicious gateways.

A downstream device can be any application or platform that has an identity created with the [Azure IoT Hub](../iot-hub/index.yml) cloud service. These applications often use the [Azure IoT device SDK](../iot-hub/iot-hub-devguide-sdks.md). A downstream device could even be an application running on the IoT Edge gateway device itself.

You can create any certificate infrastructure that enables the trust required for your device-gateway topology. In this article, we assume the same certificate setup that you would use to enable [X.509 CA security](../iot-hub/iot-hub-x509ca-overview.md) in IoT Hub, which involves an X.509 CA certificate associated to a specific IoT hub (the IoT hub root CA), a series of certificates signed with this CA, and a CA for the IoT Edge device.

>[!NOTE]
>The term *root CA certificate* used throughout these articles refers to the topmost authority public certificate of the PKI certificate chain, and not necessarily the certificate root of a syndicated certificate authority. In many cases, it is actually an intermediate CA public certificate.

The following steps walk you through the process of creating the certificates and installing them in the right places on the gateway. You can use any machine to generate the certificates, and then copy them over to your IoT Edge device.

## Prerequisites

# [IoT Edge](#tab/iotedge)

A Linux or Windows device with IoT Edge installed.

If you don't have a device ready, you can create one in an Azure virtual machine. Follow the steps in [Deploy your first IoT Edge module to a virtual Linux device](quickstart-linux.md) to create an IoT Hub, create a virtual machine, and configure the IoT Edge runtime.

# [IoT Edge for Linux on Windows](#tab/eflow)

>[!WARNING]
> Because the IoT Edge for Linux on Windows (EFLOW) virtual machine needs to be accessible from external devices, ensure to deploy EFLOW with an _external_ virtual switch. For more information about EFLOW networking configurations, see [Networking configuration for Azure IoT Edge for Linux on Windows](./how-to-configure-iot-edge-for-linux-on-windows-networking.md).

A Windows device with IoT Edge for Linux on Windows installed.

If you don't have a device ready, you should create one before continuing with this guide. Follow the steps in [Create and provision an IoT Edge for Linux on Windows device using symmetric keys](./how-to-provision-single-device-linux-on-windows-symmetric.md) to create an IoT Hub, create an EFLOW virtual machine, and configure the IoT Edge runtime.

---

## Set up the device CA certificate

All IoT Edge gateways need a device CA certificate installed on them. The IoT Edge security daemon uses the IoT Edge device CA certificate to sign a workload CA certificate, which in turn signs a server certificate for IoT Edge hub. The gateway presents its server certificate to the downstream device during the initiation of the connection. The downstream device checks to make sure that the server certificate is part of a certificate chain that rolls up to the root CA certificate. This process allows the downstream device to confirm that the gateway comes from a trusted source. For more information, see [Understand how Azure IoT Edge uses certificates](iot-edge-certs.md).

:::image type="content" source="./media/how-to-create-transparent-gateway/gateway-setup.png" alt-text="Screenshot that shows the gateway certificate setup." lightbox="./media/how-to-create-transparent-gateway/gateway-setup.png":::

The root CA certificate and the device CA certificate (with its private key) need to be present on the IoT Edge gateway device and configured in the IoT Edge config file. Remember that in this case *root CA certificate* means the topmost certificate authority for this IoT Edge scenario. The gateway device CA certificate and the downstream device certificates need to roll up to the same root CA certificate.

>[!TIP]
>The process of installing the root CA certificate and device CA certificate on an IoT Edge device is also explained in more detail in [Manage certificates on an IoT Edge device](how-to-manage-device-certificates.md).

Have the following files ready:

* Root CA certificate
* Device CA certificate
* Device CA private key

For production scenarios, you should generate these files with your own certificate authority. For development and test scenarios, you can use demo certificates.

### Create demo certificates

If you don't have your own certificate authority and want to use demo certificates, follow the instructions in [Create demo certificates to test IoT Edge device features](how-to-create-test-certificates.md) to create your files. On that page, you need to take the following steps:

1. To start, set up the scripts for generating certificates on your device.
1. Create a root CA certificate. At the end of those instructions, you'll have a root CA certificate file `<path>/certs/azure-iot-test-only.root.ca.cert.pem`.
1. Create IoT Edge device CA certificates. At the end of those instructions, you'll have a device CA certificate `<path>/certs/iot-edge-device-ca-<cert name>-full-chain.cert.pem` its private key `<path>/private/iot-edge-device-ca-<cert name>.key.pem`.

### Copy certificates to device

# [IoT Edge](#tab/iotedge)

1. Check the certificate meets [format requirements](how-to-manage-device-certificates.md#format-requirements).
1. If you created the certificates on a different machine, copy them over to your IoT Edge device. You can use a USB drive, a service like [Azure Key Vault](../key-vault/general/overview.md), or with a function like [Secure file copy](https://www.ssh.com/ssh/scp/).
1. Move the files to the preferred directory for certificates and keys. Use `/var/aziot/certs` for certificates and `/var/aziot/secrets` for keys.
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
1. Change the ownership and permissions of the certificates and keys.

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

Now, you need to copy the certificates to the Azure IoT Edge for Linux on Windows virtual machine.

For more information on the following commands, see [PowerShell functions for IoT Edge](reference-iot-edge-for-linux-on-windows-functions.md).

1. Check the certificate meets [format requirements](how-to-manage-device-certificates.md#format-requirements).

1. Copy the certificates to the EFLOW virtual machine to a directory where you have write access. For example, the `/home/iotedge-user` home directory.

   ```powershell
   # Copy the IoT Edge device CA certificate and key
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
   # Move the IoT Edge device CA certificate and key to preferred location
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

1. On your IoT Edge device, open the config file: `/etc/aziot/config.toml`. If you're using IoT Edge for Linux on Windows, you'll have to connect to the EFLOW virtual machine using the `Connect-EflowVm` PowerShell cmdlet.

   >[!TIP]
   >If the config file doesn't exist on your device yet, then use `/etc/aziot/config.toml.edge.template` as a template to create one.

1. Find the `trust_bundle_cert` parameter. Uncomment this line and provide the file URI to the root CA certificate file on your device.

1. Find the `[edge_ca]` section of the file. Uncomment the three lines in this section and provide the file URIs to your certificate and key files as values for the following properties:
   * **cert**: device CA certificate
   * **pk**: device CA private key

1. Save and close the file.

1. Apply your changes.

   ```bash
   sudo iotedge config apply
   ```

## Deploy edgeHub and route messages

Downstream devices send telemetry and messages to the gateway device, where the IoT Edge hub module is responsible for routing the information to other modules or to IoT Hub. To prepare your gateway device for this function, make sure that:

* The IoT Edge hub module is deployed to the device.

  When you first install IoT Edge on a device, only one system module starts automatically: the IoT Edge agent. Once you create the first deployment for a device, the second system module and the IoT Edge hub start as well. If the **edgeHub** module isn't running on your device, create a deployment for your device.

* The IoT Edge hub module has routes set up to handle incoming messages from downstream devices.

  The gateway device must have a route in place to handle messages from downstream devices or else those messages will not be processed. You can send the messages to modules on the gateway device or directly to IoT Hub.

To deploy the IoT Edge hub module and configure it with routes to handle incoming messages from downstream devices, follow these steps:

1. In the Azure portal, navigate to your IoT hub.

2. Go to **Devices** under the **Device management** menu and select your IoT Edge device that you want to use as a gateway.

3. Select **Set Modules**.

4. On the **Modules** page, you can add any modules you want to deploy to the gateway device. For the purposes of this article we're focused on configuring and deploying the edgeHub module, which doesn't need to be explicitly set on this page.

5. Select **Next: Routes**.

6. On the **Routes** page, make sure that there is a route to handle messages coming from downstream devices. For example:

   * A route that sends all messages, whether from a module or from a downstream device, to IoT Hub:
       * **Name**: `allMessagesToHub`
       * **Value**: `FROM /messages/* INTO $upstream`

   * A route that sends all messages from all downstream devices to IoT Hub:
      * **Name**: `allDownstreamToHub`
      * **Value**: `FROM /messages/* WHERE NOT IS_DEFINED ($connectionModuleId) INTO $upstream`

      This route works because, unlike messages from IoT Edge modules, messages from downstream devices don't have a module ID associated with them. Using the **WHERE** clause of the route allows us to filter out any messages with that system property.

      For more information about message routing, see [Deploy modules and establish routes](./module-composition.md#declare-routes).

7. Once your route or routes are created, select **Review + create**.

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

Finally, you must open the EFLOW virtual machine ports. You can open the three ports mentioned above using the following PowerShell cmdlets.

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

Now that you have an IoT Edge device set up as a transparent gateway, you need to configure your downstream devices to trust the gateway and send messages to it. Continue on to [Authenticate a downstream device to Azure IoT Hub](how-to-authenticate-downstream-device.md) for the next steps in setting up your transparent gateway scenario.
