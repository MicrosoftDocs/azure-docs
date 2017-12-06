---
title: Provision an X.509 simulated device to Azure IoT Hub (Java) | Microsoft Docs
description: Azure Quickstart - Create and provision an X.509 simulated device using Azure IoT Hub Device Provisioning Service (Java)
services: iot-dps 
keywords: 
author: msebolt
ms.author: v-masebo
ms.date: 12/05/2017
ms.topic: hero-article
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: java
ms.custom: mvc
---

# Create and provision an X.509 simulated device using IoT Hub Device Provisioning Service (Java)
> [!div class="op_single_selector"]
> * [TPM](quick-create-simulated-device.md)
> * [X.509](java-quick-create-simulated-device-x509.md)

These steps show how to simulate an X.509 device on your development machine running Windows OS, and use a code sample to connect this simulated device with the Device Provisioning Service and your IoT hub. 

Make sure to complete the steps in the [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md) before you proceed.

> [!NOTE]
    > Be sure to note your _Id Scope_ and _Provisioning Service Global Endpoint_ for use later in this Quickstart.
    >
    > ![Service information](./media/java-quick-create-simulated-device-x509/extract-dps-endpoints.png)


<a id="setupdevbox"></a>
## Prepare the development environment 

1. Make sure you have [Java SE Development Kit 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) installed on your machine.

1. Download and install [Maven](https://maven.apache.org/install.html).

1. Make sure `git` is installed on your machine and is added to the environment variables accessible to the command window. See [Software Freedom Conservancy's Git client tools](https://git-scm.com/download/) for the latest version of `git` tools to install, which includes the **Git Bash**, the command-line app that you can use to interact with your local Git repository. 

1. Open a command prompt. Clone the GitHub repo for device simulation code sample:
    
    ```cmd/sh
    git clone https://github.com/Azure/azure-iot-sdk-java.git --recursive
    ```

1. Navigate to the root and build the project. 

    ```cmd/sh
    cd azure-iot-sdk-java
    mvn install -DskipTests=true
    ```

1. Navigate to the certificate generator project folder and build the project.

    ```cmd/sh
    cd provisioning/provisioning-tools/provisioning-x509-cert-generator
    mvn clean install
    ```

1. Navigate to the target folder and execute the created jar file.

    ```cmd/sh
    cd target
    java -jar ./provisioning-x509-cert-generator-{version}-with-deps.jar
    ```

1. Enter **N** for _Do you want to input common name_. Copy to the clipboard the output from *-----BEGIN CERTIFICATE-----* and ending at *-----END CERTIFICATE-----* (excluding the `Client Cert Private Key` and `Root Cert`).

1. Create a file named **_X509individual.pem_** on your Windows machine, open it in an editor of your choice, and copy the clipboard contents to this file. Save the file.

1. Enter **N** for _Do you want to input Verification Code_ and keep the program output open for use later in the Quickstart. Note _Client Cert_ and _Client Cert Private Key_ values.

    ![Certificate generator](./media/java-quick-create-simulated-device-x509/certificate.png)


## Create a device enrollment entry in the Device Provisioning Service

1. Log in to the Azure portal, click on the **All resources** button on the left-hand menu and open your provisioning service.

1. On the Device Provisioning Service summary blade, select **Manage enrollments**. Select **Individual Enrollments** tab and click the **Add** button at the top. 

1. Under the **Add enrollment list entry**, enter the following information:
    - Select **X.509** as the identity attestation *Mechanism*.
    - Under the *Certificate .pem or .cer file*, select the certificate file **_X509testcertificate.pem_** created in the previous steps using the *File Explorer* widget.
    - Optionally, you may provide the following information:
        - Select an IoT hub linked with your provisioning service.
        - Enter a unique device ID. Make sure to avoid sensitive data while naming your device. 
        - Update the **Initial device twin state** with the desired initial configuration for the device.
    - Once complete, click the **Save** button. 

    ![Enter X.509 device enrollment information in the portal blade](./media/java-quick-create-simulated-device-x509/enter-device-enrollment.png)  

   On successful enrollment, your X.509 device appears as **microsoftriotcore** under the *Registration ID* column in the *Individual Enrollments* tab. 


<a id="firstbootsequence"></a>
## Simulate first boot sequence for the device

1. Open a command prompt. Navigate to the sample project folder.

    ```cmd/sh
    cd azure-iot-sdk-java/provisioning/provisioning-samples/provisioning-X509-sample
    ```

1. Edit `/src/main/java/samples/com/microsoft/azure/sdk/iot/ProvisioningX509Sample.java` to include your _Id Scope_ and _Provisioning Service Global Endpoint_ as noted before. Also include _Client Cert_ and _Client Cert Private Key_ as noted before.

    ```java
    private static final String idScope = "[Your ID scope here]";
    private static final String globalEndpoint = "[Your Provisioning Service Global Endpoint here]";
    private static final ProvisioningDeviceClientTransportProtocol PROVISIONING_DEVICE_CLIENT_TRANSPORT_PROTOCOL = ProvisioningDeviceClientTransportProtocol.HTTPS;
    private static final String leafPublicPem = "<Your Public PEM Certificate here>";
    private static final String leafPrivateKey = "<Your Private PEM Key here>";
    ```

    > [!NOTE]
    > You can choose one of available protocols [HTTPS, AMQP, MQTT, AMQP_WS, MQTT_WS] for registration.

    > [!NOTE]
    > When including your certificate and key use the format:
    >
    >    ```java
    >    private static final String leafPublicPem = "-----BEGIN CERTIFICATE-----\n" +
    >        "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
    >        "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
    >        "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
    >        "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
    >        "+XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
    >        "-----END CERTIFICATE-----\n";
    >    private static final String leafPrivateKey = "-----BEGIN PRIVATE KEY-----\n" +
    >        "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
    >        "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
    >        "XXXXXXXXXX\n" +
    >        "-----END PRIVATE KEY-----\n";
    >    ```

1. Build the sample. Navigate to the target folder and execute the created jar file.

    ```cmd/sh
    mvn clean install
    cd target
    java -jar ./provisioning-x509-sample-{version}-with-deps.jar
    ```

1. In the portal, navigate to the IoT hub linked to your provisioning service and open the **Device Explorer** blade. On successful provisioning of the simulated X.509 device to the hub, its device ID appears on the **Device Explorer** blade, with *STATUS* as **enabled**. Note that you might need to click the **Refresh** button at the top if you already opened the blade prior to running the sample device application. 

    ![Device is registered with the IoT hub](./media/java-quick-create-simulated-device/hub-registration.png) 

> [!NOTE]
> If you changed the *initial device twin state* from the default value in the enrollment entry for your device, it can pull the desired twin state from the hub and act accordingly. For more information, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md).
>


## Clean up resources

If you plan to continue working on and exploring the device client sample, do not clean up the resources created in this Quickstart. If you do not plan to continue, use the following steps to delete all resources created by this Quickstart.

1. Close the device client sample output window on your machine.
1. From the left-hand menu in the Azure portal, click **All resources** and then select your Device Provisioning service. At the top of the **All resources** blade, click **Delete**.  
1. From the left-hand menu in the Azure portal, click **All resources** and then select your IoT hub. At the top of the **All resources** blade, click **Delete**.  


## Next steps

In this Quickstart, you’ve created a simulated X.509 device on your Windows machine and provisioned it to your IoT hub using the Azure IoT Hub Device Provisioning Service. To learn about device provisioning in depth, continue to the tutorial for the Device Provisioning Service setup in the Azure portal. 

> [!div class="nextstepaction"]
> [Azure IoT Hub Device Provisioning Service tutorials](./tutorial-set-up-cloud.md)
