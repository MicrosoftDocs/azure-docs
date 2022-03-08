---
author: dominicbetts
ms.author: dobett
ms.service: iot-develop
ms.topic: include
ms.date: 12/17/2021
---

To modify the sample code to use the X.509 certificates:

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