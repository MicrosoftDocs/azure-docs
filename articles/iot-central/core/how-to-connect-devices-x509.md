---
title: Connect devices with X.509 certificates in an Azure IoT Central application
description: How to connect devices with X.509 certificates using Node.js device SDK for IoT Central Application
author: dominicbetts
ms.author: dobett
ms.date: 06/30/2021
ms.topic: how-to
ms.service: iot-central
services: iot-central
ms.custom: device-developer
zone_pivot_groups: programming-languages-set-ten

# - id: programming-languages-set-ten
# # Owner: aahill
# title: Programming languages
#   prompt: Choose a programming language
#   pivots:
#   - id: programming-language-csharp
#     title: C#
#   - id: programming-language-java
#     title: Java
#   - id: programming-language-javascript
#     title: JavaScript
#   - id: programming-language-python
#     title: Python
---

# How to connect devices with X.509 certificates to IoT Central Application

IoT Central supports both shared access signatures (SAS) and X.509 certificates to secure the communication between a device and your application. The [Create and connect a client application to your Azure IoT Central application](./tutorial-connect-device.md) tutorial uses SAS. In this article, you learn how to modify the code sample to use X.509 certificates. X.509 certificates are recommended in production environments. For more information, see [Get connected to Azure IoT Central](./concepts-get-connected.md).

This guide shows two ways to use X.509 certificates - [group enrollments](how-to-connect-devices-x509.md#use-group-enrollment) typically used in a production environment, and [individual enrollments](how-to-connect-devices-x509.md#use-individual-enrollment) useful for testing. The article also describes how to [roll device certificates](#roll-x509-device-certificates) to maintain connectivity when certificates expire.

This guide builds on the samples shown in the [Create and connect a client application to your Azure IoT Central application](tutorial-connect-device.md) tutorial that use C#, Java, JavaScript, and Python. For an example that uses the C programming language, see the [Provision multiple X.509 devices using enrollment groups](../../iot-dps/tutorial-custom-hsm-enrollment-group-x509.md).

## Prerequisites

Complete the [Create and connect a client application to your Azure IoT Central application](./tutorial-connect-device.md) tutorial. This includes installing the prerequisites for your choice of programming language.

In this how-to guide, you generate some test X.509 certificates. To be able to generate these certificates, you need:

- A development machine with [Node.js](https://nodejs.org/) version 6 or later installed. You can run `node --version` in the command line to check your version. The instructions in this tutorial assume you're running the **node** command at the Windows command prompt. However, you can use Node.js on many other operating systems.
- A local copy of the [Microsoft Azure IoT SDK for Node.js](https://github.com/Azure/azure-iot-sdk-node) GitHub repository that contains the scripts to generate the test X.509 certificates. Use this link to download a copy of the repository: [Download ZIP](https://github.com/Azure/azure-iot-sdk-node/archive/master.zip). Then unzip the file to a suitable location on your local machine.

## Use group enrollment

Use X.509 certificates with a group enrollment in a production environment. In a group enrollment, you add a root or intermediate X.509 certificate to your IoT Central application. Devices with leaf certificates derived from the root or intermediate certificate can connect to your application.

### Generate root and device certificates

In this section, you use an X.509 certificate to connect a device with a certificate derived from the IoT Central enrollment group's certificate.

> [!WARNING]
> This way of generating X.509 certs is for testing only. For a production environment you should use your official, secure mechanism for certificate generation.

1. Navigate to the certificate generator script in the Microsoft Azure IoT SDK for Node.js you downloaded. Install the required packages:

    ```cmd/sh
    cd azure-iot-sdk-node/provisioning/tools
    npm install
    ```

1. Create a root certificate and then derive a device certificate by running the script:

    ```cmd/sh
    node create_test_cert.js root mytestrootcert
    node create_test_cert.js device sample-device-01 mytestrootcert
    ```

    > [!TIP]
    > A device ID can contain letters, numbers, and the `-` character.

These commands produce the following root and the device certificate

| filename | contents |
| -------- | -------- |
| mytestrootcert_cert.pem | The public portion of the root X509 certificate |
| mytestrootcert_key.pem | The private key for the root X509 certificate |
| mytestrootcert_fullchain.pem | The entire keychain for the root X509 certificate. |
| sampleDevice01_cert.pem | The public portion of the device X509 certificate |
| sampleDevice01_key.pem | The private key for the device X509 certificate |
| sampleDevice01_fullchain.pem | The entire keychain for the device X509 certificate. |

Make a note of the location of these files. You need it later.

### Create a group enrollment

1. Open your IoT Central application and navigate to **Administration**  in the left pane and select **Device connection**.

1. Select **+ Create enrollment group**, and create a new enrollment group called _MyX509Group_ with an attestation type of **Certificates (X.509)**.

1. Open the enrollment group you created and select **Manage Primary**.

1. Select file option to upload the root certificate file called _mytestrootcert_cert.pem_ that you generated previously:

    ![Certificate Upload](./media/how-to-connect-devices-x509/certificate-upload.png)

1. To complete the verification, generate the verification code, copy it, and then use it to create an X.509 verification certificate at the command prompt:

    ```cmd/sh
    node create_test_cert.js verification --ca mytestrootcert_cert.pem --key mytestrootcert_key.pem --nonce  {verification-code}
    ```

1. Select **Verify** to upload the signed verification certificate _verification_cert.pem_ to complete the verification:

    ![Verified Certificate](./media/how-to-connect-devices-x509/verified.png)

You can now connect devices that have an X.509 certificate derived from this primary root certificate.

After you save the enrollment group, make a note of the ID Scope.

### Run sample device code

:::zone pivot="programming-language-csharp"

If you're using Windows, the X.509 certificates must be in the Windows certificate store for the sample to work. To add the certificates to the store:

1. Use `openssl` to create PFX files from the PEM files. When you run these commands, you're prompted to create a password. Make a note of the password, you need it in the next step:

    ```bash
    openssl pkcs12 -inkey sampleDevice001_key.pem -in sampleDevice001_cert.pem -export -out sampledevice001.pfx
    openssl pkcs12 -inkey mytestrootcert_key.pem -in mytestrootcert_cert.pem -export -out mytestrootcert.pfx
    ```

1. In Windows Explorer, double-click on each PFX file. In the **Certificate Import Wizard**, select **Current User** as the store location, enter the password from the previous step, and let the wizard choose the certificate store automatically. The wizard imports the certificates to the current user's personal store.

To modify the sample code to use the certificates:

1. In the **IoTHubDeviceSamples** Visual Studio solution, open the *Parameter.cs* file in the **TemperatureController** project.

1. Add the following two parameter definitions to the class:

    ```csharp
    [Option(
        'x',
        "CertificatePath",
        HelpText = "(Required if DeviceSecurityType is \"dps\"). \nThe device PFX file to use during device provisioning." +
        "\nDefaults to environment variable \"IOTHUB_DEVICE_X509_CERT\".")]
    public string CertificatePath { get; set; } = Environment.GetEnvironmentVariable("IOTHUB_DEVICE_X509_CERT");

    [Option(
        'p',
        "CertificatePassword",
        HelpText = "(Required if DeviceSecurityType is \"dps\"). \nThe password of the PFX certificate file." +
        "\nDefaults to environment variable \"IOTHUB_DEVICE_X509_PASSWORD\".")]
    public string CertificatePassword { get; set; } = Environment.GetEnvironmentVariable("IOTHUB_DEVICE_X509_PASSWORD");
    ```

    Save the changes.

1. In the **IoTHubDeviceSamples** Visual Studio solution, open the *Program.cs* file in the **TemperatureController** project.

1. Add the following `using` statements:

    ```csharp
    using System.Security.Cryptography.X509Certificates;
    using System.IO;
    ```

1. Add the following method to the class:

    ```csharp
    private static X509Certificate2 LoadProvisioningCertificate(Parameters parameters)
    {
        var certificateCollection = new X509Certificate2Collection();
        certificateCollection.Import(
            parameters.CertificatePath,
            parameters.CertificatePassword,
            X509KeyStorageFlags.UserKeySet);

        X509Certificate2 certificate = null;

        foreach (X509Certificate2 element in certificateCollection)
        {
            Console.WriteLine($"Found certificate: {element?.Thumbprint} {element?.Subject}; PrivateKey: {element?.HasPrivateKey}");
            if (certificate == null && element.HasPrivateKey)
            {
                certificate = element;
            }
            else
            {
                element.Dispose();
            }
        }

        if (certificate == null)
        {
            throw new FileNotFoundException($"{parameters.CertificatePath} did not contain any certificate with a private key.");
        }

        Console.WriteLine($"Using certificate {certificate.Thumbprint} {certificate.Subject}");

        return certificate;
    }
    ```

1. In the `SetupDeviceClientAsync` method, replace the block of code for `case "dps"` with the following code:

    ```csharp
    case "dps":
        s_logger.LogDebug($"Initializing via DPS");
        Console.WriteLine($"Loading the certificate...");
        X509Certificate2 certificate = LoadProvisioningCertificate(parameters);
        DeviceRegistrationResult dpsRegistrationResult = await ProvisionDeviceAsync(parameters, certificate, cancellationToken);
        var authMethod = new DeviceAuthenticationWithX509Certificate(dpsRegistrationResult.DeviceId, certificate);
        deviceClient = InitializeDeviceClient(dpsRegistrationResult.AssignedHub, authMethod);
        break;
    ```

1. Replace the `ProvisionDeviceAsync` method with the following code:

    ```csharp
    private static async Task<DeviceRegistrationResult> ProvisionDeviceAsync(Parameters parameters, X509Certificate2 certificate, CancellationToken cancellationToken)
    {
        SecurityProvider security = new SecurityProviderX509Certificate(certificate);
        ProvisioningTransportHandler mqttTransportHandler = new ProvisioningTransportHandlerMqtt();
        ProvisioningDeviceClient pdc = ProvisioningDeviceClient.Create(parameters.DpsEndpoint, parameters.DpsIdScope, security, mqttTransportHandler);

        var pnpPayload = new ProvisioningRegistrationAdditionalData
        {
            JsonData = PnpConvention.CreateDpsPayload(ModelId),
        };
        return await pdc.RegisterAsync(pnpPayload, cancellationToken);
    }
    ```

    Save the changes.

1. Add the following environment variables to the project:

    - `IOTHUB_DEVICE_X509_CERT`: `<full path to folder that contains PFX files>sampleDevice01.pfx`
    - `IOTHUB_DEVICE_X509_PASSWORD`: The password you used when you created the *sampleDevice01.pfx* file.

1. Build and run the application. Verify the device provisions successfully.

:::zone-end

:::zone pivot="programming-language-java"

1. Navigate to the _azure-iot-sdk-java/device/iot-device-samples/pnp-device-sample/temperature-controller-device-sample_ folder that contains the *pom.xml* file and *src* folder for the temperature controller device sample.

1. Edit the *pom.xml* file to add the following dependency configuration in the `<dependencies>` node:

    ```xml
    <dependency>
        <groupId>com.microsoft.azure.sdk.iot.provisioning.security</groupId>
        <artifactId>${x509-provider-artifact-id}</artifactId>
        <version>${x509-provider-version}</version>
    </dependency>
    ```

    Save the changes.

1. Open the *src/main/java/samples/com/microsoft/azure/sdk/iot/device/TemperatureController.java* file in your text editor.

1. Replace the `SecurityProviderSymmetricKey` import with the following imports:

    ```java
    import com.microsoft.azure.sdk.iot.provisioning.security.SecurityProvider;
    import com.microsoft.azure.sdk.iot.provisioning.security.hsm.SecurityProviderX509Cert;
    import com.microsoft.azure.sdk.iot.provisioning.security.exceptions.SecurityProviderException;
    ```

1. Add the following import:

    ```java
    import java.nio.file.*;
    ```

1. Add `SecurityProviderException` to the list of exceptions that the `main` method throws:

    ```java
    public static void main(String[] args) throws IOException, URISyntaxException, ProvisioningDeviceClientException, InterruptedException, SecurityProviderException {
    ```

1. Replace the `initializeAndProvisionDevice` method with the following code:

    ```java
    private static void initializeAndProvisionDevice() throws ProvisioningDeviceClientException, IOException, URISyntaxException, InterruptedException, SecurityProviderException {
        String deviceX509Key = new String(Files.readAllBytes(Paths.get(System.getenv("IOTHUB_DEVICE_X509_KEY"))));
        String deviceX509Cert = new String(Files.readAllBytes(Paths.get(System.getenv("IOTHUB_DEVICE_X509_CERT"))));
        SecurityProvider securityProviderX509 = new SecurityProviderX509Cert(deviceX509Cert, deviceX509Key, null);
        ProvisioningDeviceClient provisioningDeviceClient;
        ProvisioningStatus provisioningStatus = new ProvisioningStatus();

        provisioningDeviceClient = ProvisioningDeviceClient.create(globalEndpoint, scopeId, provisioningProtocol, securityProviderX509);

        AdditionalData additionalData = new AdditionalData();
        additionalData.setProvisioningPayload(com.microsoft.azure.sdk.iot.provisioning.device.plugandplay.PnpHelper.createDpsPayload(MODEL_ID));

        provisioningDeviceClient.registerDevice(new ProvisioningDeviceClientRegistrationCallbackImpl(), provisioningStatus, additionalData);

        while (provisioningStatus.provisioningDeviceClientRegistrationInfoClient.getProvisioningDeviceClientStatus() != ProvisioningDeviceClientStatus.PROVISIONING_DEVICE_STATUS_ASSIGNED)
        {
            if (provisioningStatus.provisioningDeviceClientRegistrationInfoClient.getProvisioningDeviceClientStatus() == ProvisioningDeviceClientStatus.PROVISIONING_DEVICE_STATUS_ERROR ||
                    provisioningStatus.provisioningDeviceClientRegistrationInfoClient.getProvisioningDeviceClientStatus() == ProvisioningDeviceClientStatus.PROVISIONING_DEVICE_STATUS_DISABLED ||
                    provisioningStatus.provisioningDeviceClientRegistrationInfoClient.getProvisioningDeviceClientStatus() == ProvisioningDeviceClientStatus.PROVISIONING_DEVICE_STATUS_FAILED)
            {
                provisioningStatus.exception.printStackTrace();
                System.out.println("Registration error, bailing out");
                break;
            }
            System.out.println("Waiting for Provisioning Service to register");
            Thread.sleep(MAX_TIME_TO_WAIT_FOR_REGISTRATION);
        }

        ClientOptions options = new ClientOptions();
        options.setModelId(MODEL_ID);

        if (provisioningStatus.provisioningDeviceClientRegistrationInfoClient.getProvisioningDeviceClientStatus() == ProvisioningDeviceClientStatus.PROVISIONING_DEVICE_STATUS_ASSIGNED) {
            System.out.println("IotHUb Uri : " + provisioningStatus.provisioningDeviceClientRegistrationInfoClient.getIothubUri());
            System.out.println("Device ID : " + provisioningStatus.provisioningDeviceClientRegistrationInfoClient.getDeviceId());

            String iotHubUri = provisioningStatus.provisioningDeviceClientRegistrationInfoClient.getIothubUri();
            String deviceId = provisioningStatus.provisioningDeviceClientRegistrationInfoClient.getDeviceId();

            log.debug("Opening the device client.");
            deviceClient = DeviceClient.createFromSecurityProvider(iotHubUri, deviceId, securityProviderX509, IotHubClientProtocol.MQTT, options);
            deviceClient.open();
        }
    }
    ```

    Save the changes.

1. In your shell environment, add the following two environment variables. Make sure that you provide the full path to the PEM files and use the correct path delimiter for your operating system:

    ```cmd/sh
    set IOTHUB_DEVICE_X509_CERT=<full path to folder that contains PEM files>sampleDevice01_cert.pem
    set IOTHUB_DEVICE_X509_KEY=<full path to folder that contains PEM files>sampleDevice01_key.pem
    ```

    > [!TIP]
    > You set the other required environment variables when you completed the [Create and connect a client application to your Azure IoT Central application](./tutorial-connect-device.md) tutorial.

1. Build and run the application. Verify the device provisions successfully.

:::zone-end

:::zone pivot="programming-language-javascript"

1. Navigate to the _azure-iot-sdk-node/device/samples/pnp_ folder that contains the **pnpTemperatureController.js** application and run the following command to install the X.509 package:

    ```cmd/sh
    npm install azure-iot-security-x509 --save
    ```

1. Open the **pnpTemperatureController.js** file in a text editor.

1. Edit the `require` statements to include the following code:

    ```javascript
    const fs = require('fs');
    const X509Security = require('azure-iot-security-x509').X509Security;
    ```

1. Add the following four lines to the "DPS connection information" section to initialize the `deviceCert` variable:

    ```javascript
    const deviceCert = {
      cert: fs.readFileSync(process.env.IOTHUB_DEVICE_X509_CERT).toString(),
      key: fs.readFileSync(process.env.IOTHUB_DEVICE_X509_KEY).toString()
    };
    ```

1. Edit the `provisionDevice` function that creates the client by replacing the first line with the following code:

    ```javascript
    var provSecurityClient = new X509Security(registrationId, deviceCert);
    ```

1. In the same function, modify the line that sets the `deviceConnectionString` variable as follows:

    ```javascript
    deviceConnectionString = 'HostName=' + result.assignedHub + ';DeviceId=' + result.deviceId + ';x509=true';
    ```

1. In the `main` function, add the following line after the line that calls `Client.fromConnectionString`:

    ```javascript
    client.setOptions(deviceCert);
    ```

    Save the changes.

1. In your shell environment, add the following two environment variables. Make sure that you provide the full path to the PEM files and use the correct path delimiter for your operating system:

    ```cmd/sh
    set IOTHUB_DEVICE_X509_CERT=<full path to folder that contains PEM files>sampleDevice01_cert.pem
    set IOTHUB_DEVICE_X509_KEY=<full path to folder that contains PEM files>sampleDevice01_key.pem
    ```

    > [!TIP]
    > You set the other required environment variables when you completed the [Create and connect a client application to your Azure IoT Central application](./tutorial-connect-device.md) tutorial.

1. Execute the script and verify the device provisions successfully:

    ```cmd/sh
    node simple_thermostat.js
    ```

:::zone-end

:::zone pivot="programming-language-python"

1. Navigate to the _azure-iot-device/samples/pnp_ folder and open the **temp_controller_with_thermostats.py** file in a text editor.

1. Add the following `from` statement to import the X.509 functionality:

    ```python
    from azure.iot.device import X509
    ```

1. Modify the first part of the `provision_device` function as follows:

    ```python
    async def provision_device(provisioning_host, id_scope, registration_id, x509, model_id):
        provisioning_device_client = ProvisioningDeviceClient.create_from_x509_certificate(
            provisioning_host=provisioning_host,
            registration_id=registration_id,
            id_scope=id_scope,
            x509=x509,
        )
    ```

1. In the `main` function, replace the line that sets the `symmetric_key` variable with the following code:

    ```python
    x509 = X509(
        cert_file=os.getenv("IOTHUB_DEVICE_X509_CERT"),
        key_file=os.getenv("IOTHUB_DEVICE_X509_KEY"),
    )
    ```

1. In the `main` function, replace the call to the `provision_device` function with the following code:

    ```python
    registration_result = await provision_device(
        provisioning_host, id_scope, registration_id, x509, model_id
    )
    ```

1. In the `main` function, replace the call to the `IoTHubDeviceClient.create_from_symmetric_key` function with the following code:

    ```python
    device_client = IoTHubDeviceClient.create_from_x509_certificate(
        x509=x509,
        hostname=registration_result.registration_state.assigned_hub,
        device_id=registration_result.registration_state.device_id,
        product_info=model_id,
    )
    ```

    Save the changes.

1. In your shell environment, add the following two environment variables. Make sure that you provide the full path to the PEM files and use the correct path delimiter for your operating system:

    ```cmd/sh
    set IOTHUB_DEVICE_X509_CERT=<full path to folder that contains PEM files>sampleDevice01_cert.pem
    set IOTHUB_DEVICE_X509_KEY=<full path to folder that contains PEM files>sampleDevice01_key.pem
    ```

    > [!TIP]
    > You set the other required environment variables when you completed the [Create and connect a client application to your Azure IoT Central application](./tutorial-connect-device.md) tutorial.

1. Execute the script and verify the device provisions successfully:

    ```cmd/sh
    python temp_controller_with_thermostats.py
    ```

:::zone-end

Verify that telemetry appears on the device view in your IoT Central application:

![Screenshot that shows telemetry arriving in your IoT Central application.](./media/how-to-connect-devices-x509/telemetry.png)

## Use individual enrollment

Use X.509 certificates with an individual enrollment to test your device and solution. In an individual enrollment, there's no root or intermediate X.509 certificate in your IoT Central application. Devices use a self-signed X.509 certificate to connect to your application.

### Generate self-signed device certificate

In this section, you use a self-signed X.509 certificate to connect devices for individual enrollment, which are used to enroll a single device. Self-signed certificates are for testing only.

> [!WARNING]
> This way of generating X.509 certs is for testing only. For a production environment you should use your official, secure mechanism for certificate generation.

Create a self-signed X.509 device certificate by running the following commands:

```cmd/sh
  cd azure-iot-sdk-node/provisioning/tools
  node create_test_cert.js device mytestselfcertprimary
  node create_test_cert.js device mytestselfcertsecondary 
```

> [!TIP]
> A device ID can contain letters, numbers, and the `-` character.

### Create individual enrollment

1. In the Azure IoT Central application, select **Devices**, and create a new device with **Device ID** as _mytestselfcertprimary_ from the thermostat device template. Make a note of the **ID Scope**, you use it later.

1. Open the device you created and select **Connect**.

1. Select **Individual Enrollments** as the **Connect Method** and **Certificates (X.509)** as the mechanism:

    ![Individual enrollment](./media/how-to-connect-devices-x509/individual-device-connect.png)

1. Select file option under primary and upload the certificate file called _mytestselfcertprimary_cert.pem_ that you generated previously.

1. Select the file option for the secondary certificate and upload the certificate file called _mytestselfcertsecondary_cert.pem._ Then select **Save**:

    ![Individual enrollment Certificate Upload](./media/how-to-connect-devices-x509/individual-enrollment.png)

The device is now provisioned with X.509 certificate.

### Run a sample individual enrollment device

1. Copy the _mytestselfcertprimary_key.pem_ and _mytestselfcertprimary_cert.pem_ files to the _azure-iot-sdk-node/device/samples/pnp_ folder that contains the **simple_thermostat.js** application. You used this application when you completed the [Connect a device (JavaScript) tutorial](./tutorial-connect-device.md).

1. Modify the environment variables you used in the sample above as follows:

    ```cmd/sh
    set IOTHUB_DEVICE_DPS_DEVICE_ID=mytestselfcertprimary
    set IOTHUB_DEVICE_X509_CERT=mytestselfcertprimary_cert.pem
    set IOTHUB_DEVICE_X509_KEY=mytestselfcertprimary_key.pem
    ```

1. Execute the script and verify the device is provisioned successfully:

    ```cmd/sh
    node environmentalSensor.js
    ```

    You can also verify that telemetry appears on the device view.

    ![Telemetry Individual enrollment](./media/how-to-connect-devices-x509/telemetry-primary.png)

You can repeat the above steps for _mytestselfcertsecondary_ certificate as well.

## Connect an IoT Edge device

This section assumes you're using a group enrollment to connect your IoT Edge device. Follow the steps in the previous sections to:

- [Generate root and device certificates](#generate-root-and-device-certificates)
- [Create a group enrollment](#create-a-group-enrollment) <!-- No slightly different type of enrollment group - UPDATE!! -->

To connect the IoT Edge device to IoT Central using the X.509 device certificate:

- Copy the device certificate and key files onto your IoT Edge device. In the previous group enrollment example, these files were called **sampleDevice01_key.pem** and **sampleDevice01_cert.pem**.
- On the IoT Edge device, edit `provisioning` section in the **/etc/iotedge/config.yaml** configuration file as follows:

    ```yaml
    # DPS X.509 provisioning configuration
    provisioning:
      source: "dps"
      global_endpoint: "https://global.azure-devices-provisioning.net"
      scope_id: "<SCOPE_ID>"
      attestation:
        method: "x509"
    #   registration_id: "<OPTIONAL REGISTRATION ID. LEAVE COMMENTED OUT TO REGISTER WITH CN OF identity_cert>"
        identity_cert: "file:///<path>/sampleDevice01_cert.pem"
        identity_pk: "file:///<path>/sampleDevice01_key.pem"
    #  always_reprovision_on_startup: true
    #  dynamic_reprovisioning: false
    ```

    > [!TIP]
    > You don't need to add a value for the `registration_id`. IoT Edge can use the **CN** value from the X.509 certificate.

- Run the following command to restart the IoT Edge runtime:

    ```bash
    sudo systemctl restart iotedge
    ```

To learn more, see [Create and provision an IoT Edge device using X.509 certificates](../../iot-edge/how-to-auto-provision-x509-certs.md).

## Connect an IoT Edge leaf device

IoT Edge uses X.509 certificates to secure the connection between leaf devices and an IoT Edge device acting as a gateway. To learn more about configuring this scenario, see [Connect a downstream device to an Azure IoT Edge gateway](../../iot-edge/how-to-connect-downstream-device.md).

## Roll X.509 device certificates

During the lifecycle of your IoT Central application, you'll need to roll your x.509 certificates. For example:

- If you have a security breach, rolling certificates is a security best practice to help secure your system.
- x.509 certificates have expiry dates. The frequency in which you roll your certificates depends on the security needs of your solution. Customers with solutions involving highly sensitive data may roll certificates daily, while others roll their certificates every couple years.

For uninterrupted connectivity, IoT Central lets you configure primary and secondary X.509 certificates. If the primary and secondary certificates have different expiry dates, you can roll the expired certificate while devices continue to connect with the other certificate.

To learn more, see [Assume Breach Methodology](https://download.microsoft.com/download/C/1/9/C1990DBA-502F-4C2A-848D-392B93D9B9C3/Microsoft_Enterprise_Cloud_Red_Teaming.pdf).

This section describes how to roll the certificates in IoT Central. When you roll a certificate in IoT Central, you also need to copy the new device certificate to your devices.

### Obtain new X.509 certificates

Obtain new X.509 certificates from your certificate provider. You can create your own X.509 certificates using a tool like OpenSSL. This approach is useful for testing X.509 certificates but provides few security guarantees. Only use this approach for testing unless you're prepared to act as your own CA provider.

### Enrollment groups and security breaches

To update a group enrollment in response to a security breach, you should use the following approach to update the current certificate immediately. Complete these steps for the primary and secondary certificates if both are compromised:

1. Navigate to **Administration**  in the left pane and select **Device connection**.

2. Select **Enrollment Groups**, and select the group name in the list.

3. For certificate update, select **Manage primary** or **Manage Secondary**.

4. Add and verify root X.509 certificate in the enrollment group.

### Individual enrollments and security breaches

If you're rolling certificates in response to a security breach, use the following approach to update the current certificate immediately. Complete these steps for the primary and secondary certificates, if both are compromised:

1. Select **Devices**, and select the device.

1. Select **Connect**, and select connect method as **Individual Enrollment**

1. Select **Certificates (X.509)** as mechanism.

1. For certificate update, select the folder icon to select the new certificate to be uploaded for the enrollment entry. Select **Save**.

### Enrollment groups and certificate expiration

To handle certificate expirations, use the following approach to update the current certificate immediately:

1. Navigate to **Administration**  in the left pane and select **Device connection**.

2. Select **Enrollment Groups**, and select the group name in the list.

3. For certificate update, select **Manage Primary**.

4. Add and verify root X.509 certificate in the enrollment group.

5. Later when the secondary certificate has expired, come back and update the secondary certificate.

### Individual enrollments and certificate expiration

If you're rolling certificates to handle certificate expirations, you should use the secondary certificate configuration as follows to reduce downtime for devices attempting to provision.

When the secondary certificate nears expiration, and needs to be rolled, you can rotate to using the primary configuration. Rotating between the primary and secondary certificates in this way reduces downtime for devices attempting to provision.

1. Select **Devices**, and select the device.

2. Select **Connect**, and select connect method as **Individual Enrollment**

3. Select **Certificates (X.509)** as mechanism.

4. For secondary certificate update, select the folder icon to select the new certificate to be uploaded for the enrollment entry. Select **Save**.

5. Later when the primary certificate has expired, come back and update the primary certificate.

## Next steps

Now that you've learned how to connect devices using  X.509 certificates, the suggested next step is to learn how to [Monitor device connectivity using Azure CLI](howto-monitor-devices-azure-cli.md).
