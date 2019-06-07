---
title: Authenticate downstream devices - Azure IoT Edge | Microsoft Docs
description: How to authenticate downstream devices or leaf devices to IoT Hub, and route their connection through Azure IoT Edge gateway devices. 
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 06/07/2019
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
ms.custom: seodec18
---

# Authenticate a downstream device to Azure IoT Hub

In a transparent gateway scenario, downstream devices (sometimes called leaf devices or child devices) need identities in IoT Hub like any other device. This article walks through the options for authenticating a downstream device to IoT Hub, and then demonstrates how to declare the gateway connection.

There are three general steps to set up a successful transparent gateway connection. This article covers the second step:

1. The gateway device needs to be able to securely connect to downstream devices, receive communications from downstream devices, and route messages to the proper destination. For more information, see [Configure an IoT Edge device to act as a transparent gateway](how-to-create-transparent-gateway.md).
2. **The downstream device needs to have a device identity to be able to authenticate with IoT Hub, and know to communicate through its gateway device.**
3. The downstream device needs to be able to securely connect to its gateway device. For more information, see [Connect a downstream device to an Azure IoT Edge gateway](how-to-connect-downstream-device.md).

Downstream devices can authenticate with IoT Hub using one of three methods: symmetric keys (sometimes referred to as shared access keys), X.509 self-signed certificates, or X.509 certificate authority (CA) signed certificates. The authentication steps are similar to the steps used to set up any non-IoT-Edge device with IoT Hub, with small differences to declare the gateway relationship.

The steps in this article show manual device provisioning, not automatic provisioning with the Azure IoT Hub Device Provisioning Service. 

## Symmetric key authentication

Symmetric key authentication, or shared access key authentication, is the simplest way to authenticate with IoT Hub. With symmetric key authentication, a base64 key is associated with your IoT device ID in IoT Hub. You include that key in your IoT applications so that your device can present it when it connects to IoT Hub. 

### Create the device identity 

Add a new IoT device in your IoT hub, using either the Azure portal, Azure CLI, or the IoT extension for Visual Studio Code. Remember that downstream devices need to be identified in IoT Hub as regular IoT device, not IoT Edge devices. 

When you create the new device identity, provide the following information: 

* Create an ID for your device.

* Select **Symmetric key** as the authentication type. 

* Optionally, choose to **Set a parent device** and select the IoT Edge gateway device that this downstream device will connect through. This step is optional for symmetric key authentication, but it's recommended because setting a parent device enables [offline capabilities](offline-capabilities.md) for your downstream device. You can always update the device details to add or change the parent later. 

   ![Create device ID with symmetric key auth in portal](./media/how-to-authenticate-downstream-device/symmetric-key-portal.png)

You can use the [IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension) to complete the same operation. The following example creates a new IoT device with symmetric key authentication and assigns a parent device: 

```cli
az iot hub device-identity create -n {iothub name} -d {device ID} --pd {gateway device ID}
```

For more information about Azure CLI commands for device creation and parent/child management, see the reference content for [az iot hub device-identity](https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot/hub/device-identity?view=azure-cli-latest) commands.

### Connect to IoT Hub through a gateway

The same process is used to authenticate regular IoT devices to IoT Hub with symmetric keys also applies to downstream devices. The only difference is that you need to add a pointer to the gateway device to route the connection or, in offline scenarios, to handle the authentication on behalf of IoT Hub. 

For symmetric key authentication, there's no additional steps that you need to take on your device for it to authenticate with IoT Hub. You still need the certificates in place so that your downstream device can connect to its gateway device, as described in [Connect a downstream device to an Azure IoT Edge gateway](how-to-connect-downstream-device.md).

After creating an IoT device identity in the portal, you can retrieve its primary or secondary keys. One of these keys needs to be included in the connection string that you include in any application that communicates with IoT Hub. For symmetric key authentication, IoT Hub provides the fully formed connection string in the device details for your convenience. You need to add extra information about the gateway device to the connection string. 

Symmetric key connection strings for downstream devices need the following components: 

* The IoT hub that the device connects to: `Hostname={iothub name}.azure-devices.net`
* The device ID registered with the hub: `DeviceID={device ID}`
* Either the primary or secondary key: `SharedAccessKey={key}`
* The gateway device that the device connects through. Provide the **hostname** value from the IoT Edge gateway device's config.yaml file: `GatewayHostName={gateway hostname}`

All together, a complete connection string looks like:

``` 
HostName=myiothub.azure-devices.net;DeviceId=myDownstreamDevice;SharedAccessKey=xxxyyyzzz;GatewayHostName=myGatewayDevice
```

If you established a parent/child relationship for this downstream device, then you can simplify the connection string by calling the gateway directly as the connection host. For example: 

```
HostName=myGatewayDevice;DeviceId=myDownstreamDevice;SharedAccessKey=xxxyyyzzz
```

## X.509 authentication 

There are two ways to authenticate an IoT device using X.509 certificates. Whichever way you choose to authenticate, the steps to connect your device to IoT Hub are the same. Choose either self-signed or CA-signed certs for authentication, then continue to learn how to connect to IoT Hub. 

For more information about how IoT Hub uses X.509 authentication, see the following articles: 
* [Device authentication using X.509 CA certificates](../iot-hub/iot-hub-x509ca-overview.md)
* [Conceptual understanding of X.509 CA certificates in the IoT industry](../iot-hub/iot-hub-x509ca-concept.md)

### Create the device identity with X.509 self-signed certificates

For X.509 self-signed authentication, sometimes referred to as thumbprint authentication, you need to create new certificates to place on your IoT device. These certificates have a thumbprint in them that you share with IoT Hub for authentication. 

The easiest way to do test this scenario is to use the same machine that you used to create certificates in [Configure an IoT Edge device to act as a transparent gateway](how-to-create-transparent-gateway.md). That machine should already be set up with the right tool, root CA certificate, and intermediate CA certificate to create the IoT device certificates. You can copy the final certificates and their private keys over to your downstream device afterwards. Following the steps in the gateway article, you set up openssl on your machine, then cloned the IoT Edge repo to access certificate creation scripts. Then, you made a working directory that we call **\<WRKDIR>** to hold the certificates. The default certificates are meant for developing and testing, so only last 30 days. You should have created a root CA certificate and an intermediate certificate. 

1. Navigate to your working directory in either a bash or PowerShell window. 

2. Create two certificates (primary and secondary) for the downstream device. Provide your device name and then the primary or secondary label. This information is used to name the files so that you can keep track of certificates for multiple devices. 

   ```PowerShell
   New-CACertsDevice "<device name>-primary"
   New-CACertsDevice "<device name>-secondary"
   ```

   ```bash
   ./certGen.sh create_device_certificate "<device name>-primary"
   ./certGen.sh create_device_certificate "<device name>-secondary"
   ```

3. Retrieve the SHA1 fingerprint (called a thumbprint in the IoT Hub interface) from each certificate, which is a 40 hexadecimal character string. Use the following openssl command to view the certificate and find the fingerprint:

   ```PowerShell/bash
   openssl x509 -in <WORKDIR>/certs/iot-device-<device name>-primary.cert.pem -text -fingerprint | sed 's/[:]//g'
   ```

4. Navigate to your IoT hub in the Azure portal and create a new IoT device identity with the following values: 

   * Select **X.509 Self-Signed** as the authentication type.
   * Paste the hexadecimal strings that you copied from your device's primary and secondary certificates.
   * Select **Set a parent device** and choose the IoT Edge gateway device that this downstream device will connect through. A parent device is required for X.509 authentication of a downstream device. 

   ![Create device ID with X.509 self-signed auth in portal](./media/how-to-authenticate-downstream-device/x509-self-signed-portal.png)

5. Copy the following files to any directory on your downstream device:

   * `<WRKDIR>\certs\azure-iot-test-only.root.ca.cert.pem`
   * `<WRKDIR>\certs\iot-device-<device name>*.cert.pem`
   * `<WRKDIR>\certs\iot-device-<device id>*.cert.pfx`
   * `<WRKDIR>\certs\iot-device-<device name>*-full-chain.cert.pem`
   * `<WRKDIR>\private\iot-device-<device name>*.key.pem`

   You'll reference these files in the leaf device applications that connect to IoT Hub. You can use a service like [Azure Key Vault](https://docs.microsoft.com/azure/key-vault) or a function like [Secure copy protoco](https://www.ssh.com/ssh/scp/) to move the certificate files.

You can use the [IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension) to complete the same device creation operation. The following example creates a new IoT device with X.509 self-signed authentication and assigns a parent device: 

```cli
az iot hub device-identity create -n {iothub name} -d {device ID} --pd {gateway device ID} --am x509_thumbprint --ptp {primary thumbprint} --stp {secondary thumbprint}
```

For more information about Azure CLI commands for device creation, certificate generation, and parent and child management, see the reference content for [az iot hub device-identity](https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot/hub/device-identity?view=azure-cli-latest) commands.

### Create the device identity with X.509 CA signed certificates

For X.509 certificate authority (CA) signed authentication, you need a root CA certificate registered in IoT Hub that you use to sign certificates for your IoT device. Any device using a certificate that was issues by the root CA certificate or any of its intermediate certificates will be permitted to authenticate. 

This section is based on the instructions detailed in the IoT Hub article [Set up X.509 security in your Azure IoT hub](../iot-hub/iot-hub-security-x509-get-started.md). Follow the steps in this section to know which values to use to set up a downstream device that connects through a gateway. 

The easiest way to test this scenario is to use the same machine that you used to create certificates in [Configure an IoT Edge device to act as a transparent gateway](how-to-create-transparent-gateway.md). That machine should already be set up with the right tool, root CA certificate, and intermediate CA certificate to create the IoT device certificates. You can copy the final certificates and their private keys over to your downstream device afterwards. Following the steps in the gateway article, you set up openssl on your machine, then cloned the IoT Edge repo to access certificate creation scripts. Then, you made a working directory that we call **\<WRKDIR>** to hold the certificates. The default certificates are meant for developing and testing, so only last 30 days. You should have created a root CA certificate and an intermediate certificate. 

1. Follow the instructions in the [Register X.509 CA certificates to your IoT hub](../iot-hub/iot-hub-security-x509-get-started.md#register-x509-ca-certificates-to-your-iot-hub) section of *Set up X.509 security in your Azure IoT hub*. In that section, you perform the following steps: 

   1. Upload a root CA certificate. If you're using the certificates that you created in the transparent gateway article, upload **\<WRKDIR>/certs/azure-iot-test-only.root.ca.cert.pem** as the root certificate file. 
   2. Verify that you own that root CA certificate. You can verify possession with the cert tools in \<WRKDIR>. 

      ```powershell
      New-CACertsVerificationCert "<verification code from Azure portal>"
      ```

      ```bash
      ./certGen.sh create_verification_certificate <verification code from Azure portal>"
      ```

2. Follow the instructions in the [Create an X.509 device for your IoT hub](../iot-hub/iot-hub-security-x509-get-started.md#create-an-x509-device-for-your-iot-hub) section of *Set up X.509 security in your Azure IoT hub*. In that section, you perform the following steps: 

   1. Add a new device. Provide a lowercase name for **device ID**, and choose the authentication type **X.509 CA Signed**. 
   2. Set a parent device. For downstream devices, select **Set a parent device** and choose the IoT Edge gateway device that will provide the connection to IoT Hub. 

3. Create a certificate chain for your downstream device. Use the same root CA certificate that you uploaded to IoT Hub to make this chain. Use the same lowercase device ID that you gave to your device identity in the portal.

   ```powershell
   New-CACertsDevice "<device id>"
   ```

   ```bash
   ./certGen.sh create_device_certificate "<device id>"
   ```

4. Copy the following files to any directory on your downstream device: 

   * `<WRKDIR>\certs\azure-iot-test-only.root.ca.cert.pem`
   * `<WRKDIR>\certs\iot-device-<device id>*.cert.pem`
   * `<WRKDIR>\certs\iot-device-<device id>*.cert.pfx`
   * `<WRKDIR>\certs\iot-device-<device id>*-full-chain.cert.pem`
   * `<WRKDIR>\private\iot-device-<device id>*.key.pem`

   You'll reference these files in the leaf device applications that connect to IoT Hub. You can use a service like [Azure Key Vault](https://docs.microsoft.com/azure/key-vault) or a function like [Secure copy protoco](https://www.ssh.com/ssh/scp/) to move the certificate files.

You can use the [IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension) to complete the same device creation operation. The following example creates a new IoT device with X.509 CA signed authentication and assigns a parent device: 

```cli
az iot hub device-identity create -n {iothub name} -d {device ID} --pd {gateway device ID} --am x509_ca
```

For more information about Azure CLI commands for device creation and parent/child management, see the reference content for [az iot hub device-identity](https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot/hub/device-identity?view=azure-cli-latest) commands.


### Connect to IoT Hub through a gateway

Each Azure IoT SDK handles X.509 authentication a little differently. However, the same process is used to authenticate regular IoT devices to IoT Hub with X.509 certificates also applies to downstream devices. The only difference is that you need to add a pointer to the gateway device to route the connection or, in offline scenarios, to handle the authentication on behalf of IoT Hub. In general, you can follow the same X.509 authentication steps for all IoT Hub devices, then simply replace the value of **Hostname** in the connection string to be the hostname of your gateway device. 

The following sections show some examples for different SDK languages. 

>[!IMPORTANT]
>The following samples demonstrate how the IoT Hub SDKs use certificates to authenticate devices. In a production deployment, you should store all secrets like private or SAS keys in a hardware secure module (HSM). 

#### .NET

For an example of a C# program authenticating to IoT Hub with X.509 certificates, see [Set up X.509 security in your Azure IoT hub](../iot-hub/iot-hub-security-x509-get-started.md#authenticate-your-x509-device-with-the-x509-certificates). Some of the key lines of that sample are included here to demonstrate the authentication process.

When declaring the hostname for your DeviceClient instance, use the IoT Edge gateway device's hostname. The hostname can be found in the gateway device's config.yaml file. 

If you're using the test certificates provided by the IoT Edge git repository, the key to the certificates is **1234**.

```csharp
try
{
    var cert = new X509Certificate2(@"<absolute-path-to-your-device-pfx-file>", "1234");
    var auth = new DeviceAuthenticationWithX509Certificate("<device-id>", cert);
    var deviceClient = DeviceClient.Create("<gateway hostname>", auth, TransportType.Amqp_Tcp_Only);

    if (deviceClient == null)
    {
        Console.WriteLine("Failed to create DeviceClient!");
    }
    else
    {
        Console.WriteLine("Successfully created DeviceClient!");
        SendEvent(deviceClient).Wait();
    }

    Console.WriteLine("Exiting...\n");
}
catch (Exception ex)
{
    Console.WriteLine("Error in sample: {0}", ex.Message);
}
```

#### C

For an example of a C program authenticating to IoT Hub with X.509 certificates, see the C IoT SDK's [iotedge_downstream_device_sample](https://github.com/Azure/azure-iot-sdk-c/tree/x509_edge_bugbash/iothub_client/samples/iotedge_downstream_device_sample) sample. Some of the key lines of that sample are included here to demonstrate the authentication process.

When defining the connection string for your downstream device, use the IoT Edge gateway device's hostname for the **HostName** parameter. The hostname can be found in the gateway device's config.yaml file. 

```C
// If your downstream device uses X.509 authentication (self signed or X.509 CA) then
// resulting connection string should look like the following:
// "HostName=<gateway device hostname>;DeviceId=<device_id>;x509=true"
static const char* connectionString = "[Downstream device IoT Edge connection string]";

// Path to the Edge "owner" root CA certificate
static const char* edge_ca_cert_path = "[Path to root CA certificate]";

// When the downstream device uses X.509 authentication, a certificate and key 
// in PRM format must be provided.
static const char * x509_device_cert_path = "[Path to primary or secondary device cert]";
static const char * x509_device_key_path = "[Path to primary or secondary device key]";

int main(void)
{
    // Create the iothub handle here
    device_handle = IoTHubDeviceClient_CreateFromConnectionString(connectionString, protocol);

    // Provide the Azure IoT device client with the same root
    // X509 CA certificate that was used to set up the IoT Edge gateway runtime
    if (edge_ca_cert_path != NULL)
    {
        cert_string = obtain_edge_ca_certificate();
        (void)IoTHubDeviceClient_SetOption(device_handle, OPTION_TRUSTED_CERT, cert_string);
    }

    if ((x509_device_cert_path != NULL) && (x509_device_key_path != NULL))
    {
        const char *x509certificate = obtain_file_contents(x509_device_cert_path);
        const char *x509privatekey = obtain_file_contents(x509_device_key_path);
        if ((IoTHubDeviceClient_SetOption(device_handle, OPTION_X509_CERT, x509certificate) != IOTHUB_CLIENT_OK) ||
            (IoTHubDeviceClient_SetOption(device_handle, OPTION_X509_PRIVATE_KEY, x509privatekey) != IOTHUB_CLIENT_OK)
            )
        {
            printf("failure to set options for x509, aborting\r\n");
            exit(1);
        }
    }
}
```

#### Node.js

For an example of a Node.js program authenticating to IoT Hub with X.509 certificates, see the Node.js IoT SDK's [simple_sample_device_x509.js](https://github.com/Azure/azure-iot-sdk-node/blob/master/device/samples/simple_sample_device_x509.js) sample. Some of the key lines of that sample are included here to demonstrate the authentication process.

When defining the connection string for your downstream device, use the IoT Edge gateway device's hostname for the **HostName** parameter. The hostname can be found in the gateway device's config.yaml file. 

If you're using the test certificates provided by the IoT Edge git repository, the key to the certificates is **1234**.

```node
// String containing Hostname and Device Id in the following format:
//  "HostName=<gateway device hostname>;DeviceId=<device_id>;x509=true"
var connectionString = '<DEVICE CONNECTION STRING WITH x509=true>';
var certFile = '<PATH-TO-CERTIFICATE-FILE>';
var keyFile = '<PATH-TO-KEY-FILE>';
var passphrase = '<KEY PASSPHRASE IF ANY>';

// fromConnectionString must specify a transport constructor, coming from any transport package.
var client = Client.fromConnectionString(connectionString, Protocol);

var options = {
   cert : fs.readFileSync(certFile, 'utf-8').toString(),
   key : fs.readFileSync(keyFile, 'utf-8').toString(),
   passphrase: passphrase
 };

// Calling setOptions with the x509 certificate and key (and optionally, passphrase) will configure the client transport to use x509 when connecting to IoT Hub
client.setOptions(options);
```

#### Python

For an example of a Python program authenticating to IoT Hub with X.509 certificates, see the Java IoT SDK's [iothub_client_sample_x509.py](https://github.com/Azure/azure-iot-sdk-python/blob/master/device/samples/iothub_client_sample_x509.py) sample. Some of the key lines of that sample are included here to demonstrate the authentication process.

When defining the connection string for your downstream device, use the IoT Edge gateway device's hostname for the **HostName** parameter. The hostname can be found in the gateway device's config.yaml file. 

```python
# String containing Hostname, Device Id in the format:
# "HostName=<gateway device hostname>;DeviceId=<device_id>;x509=true"
CONNECTION_STRING = "[Device Connection String]"

X509_CERTIFICATE = (
    "-----BEGIN CERTIFICATE-----""\n"
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX""\n"
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX""\n"
    "...""\n"
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX""\n"
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX""\n"
    "XXXXXXXXXXXX""\n"
    "-----END CERTIFICATE-----"
)

X509_PRIVATEKEY = (
    "-----BEGIN RSA PRIVATE KEY-----""\n"
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX""\n"
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX""\n"
    "...""\n"
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX""\n"
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX""\n"
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    "-----END RSA PRIVATE KEY-----"
)

def iothub_client_init():
    # prepare iothub client
    client = IoTHubClient(CONNECTION_STRING, PROTOCOL)

    # this brings in x509 privateKey and certificate
    client.set_option("x509certificate", X509_CERTIFICATE)
    client.set_option("x509privatekey", X509_PRIVATEKEY)

    return client
```

#### Java

For an example of a Java program authenticating to IoT Hub with X.509 certificates, see the Java IoT SDK's [SendEventX509.java](https://github.com/Azure/azure-iot-sdk-python/blob/master/device/samples/iothub_client_sample_x509.py) sample. Some of the key lines of that sample are included here to demonstrate the authentication process.

When defining the connection string for your downstream device, use the IoT Edge gateway device's hostname for the **HostName** parameter. The hostname can be found in the gateway device's config.yaml file. 

```java
//PEM encoded representation of the public key certificate
private static String publicKeyCertificateString =
    "-----BEGIN CERTIFICATE-----\n" +
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
    "-----END CERTIFICATE-----\n";

//PEM encoded representation of the private key
private static String privateKeyString =
    "-----BEGIN EC PRIVATE KEY-----\n" +
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
    "-----END EC PRIVATE KEY-----\n";

DeviceClient client = new DeviceClient(connectionString, protocol, publicKeyCertificateString, false, privateKeyString, false);
```

## Next steps

By completing this article, you should have an IoT Edge device working as a transparent gateway and a downstream device registered with an IoT hub. Next, you need to configure your downstream devices to trust the gateway device and send messages to it. For more information, see [Connect a downstream device to an Azure IoT Edge gateway](how-to-connect-downstream-device.md).
