---
title: Provision a simulated X.509 device to Azure IoT Hub using Java | Microsoft Docs
description: Azure Quickstart - Create and provision a simulated X.509 device using Java device SDK for IoT Hub Device Provisioning Service
services: iot-dps 
keywords: 
author: msebolt
ms.author: v-masebo
ms.date: 12/21/2017
ms.topic: quickstart
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: java
ms.custom: mvc
---

# Create and provision a simulated X.509 device using Java device SDK for IoT Hub Device Provisioning Service
[!INCLUDE [iot-dps-selector-quick-create-simulated-device-x509](../../includes/iot-dps-selector-quick-create-simulated-device-x509.md)]

These steps show how to simulate an X.509 device on your development machine running Windows OS, and use a code sample to connect this simulated device with the Device Provisioning Service and your IoT hub. 

Make sure to complete the steps in the [Setup IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md) before you proceed.


## Prepare the environment 

1. Make sure you have [Java SE Development Kit 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) installed on your machine.

1. Download and install [Maven](https://maven.apache.org/install.html).

1. Make sure `git` is installed on your machine and is added to the environment variables accessible to the command window. See [Software Freedom Conservancy's Git client tools](https://git-scm.com/download/) for the latest version of `git` tools to install, which includes the **Git Bash**, the command-line app that you can use to interact with your local Git repository. 

1. Open a command prompt. Clone the GitHub repo for device simulation code sample:
    
    ```cmd/sh
    git clone https://github.com/Azure/azure-iot-sdk-java.git --recursive
    ```

1. Navigate to the certificate generator project and build the project. 

    ```cmd/sh
    cd azure-iot-sdk-java/provisioning/provisioning-tools/provisioning-x509-cert-generator
    mvn clean install
    ```

1. Navigate to the target folder and execute the created jar file.

    ```cmd/sh
    cd target
    java -jar ./provisioning-x509-cert-generator-{version}-with-deps.jar
    ```

1. Create the enrollment information in either of the following ways, as per your setup:

    - **Individual enrollment**:

        1. Enter **N** for _Do you want to input common name_. Copy to the clipboard the output of `Client Cert` from *-----BEGIN CERTIFICATE-----* and ending at *-----END CERTIFICATE-----*.

            ![Individual certificate generator](./media/java-quick-create-simulated-device-x509/individual.png)

        1. Create a file named **_X509individual.pem_** on your Windows machine, open it in an editor of your choice, and copy the clipboard contents to this file. Save the file.

        1. Enter **N** for _Do you want to input Verification Code_ and keep the program output open for reference later in the Quickstart. Note the _Client Cert_ and _Client Cert Private Key_ values.
    
    - **Enrollment groups**:

        1. Enter **N** for _Do you want to input common name_. Copy to the clipboard the output of `Root Cert` from *-----BEGIN CERTIFICATE-----* and ending at *-----END CERTIFICATE-----*.

            ![Group certificate generator](./media/java-quick-create-simulated-device-x509/group.png)

        1. Create a file named **_X509group.pem_** on your Windows machine, open it in an editor of your choice, and copy the clipboard contents to this file. Save the file.

        1. Enter **Y** for _Do you want to input Verification Code_ and keep the program open for use later in the Quickstart. Note the _Client Cert_, _Client Cert Private Key_, _Signer Cert_, and _Root Cert_ values.

        > [!NOTE]
        > The `Root Cert` above is only applicable to certificates created in the console output and cannot be used to sign additional client certificates. If you require a more robust set of testing certificates, see the [Managing CA Certificates Sample](https://github.com/Azure/azure-iot-sdk-c/blob/master/tools/CACertificates/CACertificateOverview.md).
        >

## Create a device enrollment entry

1. Log in to the Azure portal, click on the **All resources** button on the left-hand menu and open your provisioning service.

1. Enter the enrollment information in either of the following ways, as per your setup:

    - **Individual enrollment**: 

        1. On the Device Provisioning Service summary blade, select **Manage enrollments**. Select **Individual Enrollments** tab and click the **Add** button at the top. 

        1. Under the **Add enrollment list entry**, enter the following information:
            - Select **X.509** as the identity attestation *Mechanism*.
            - Under the *Certificate .pem or .cer file*, select the certificate file **_X509individual.pem_** created in the previous steps using the *File Explorer* widget.
            - Optionally, you may provide the following information:
                - Select an IoT hub linked with your provisioning service.
                - Enter a unique device ID. Make sure to avoid sensitive data while naming your device. 
                - Update the **Initial device twin state** with the desired initial configuration for the device.
            - Once complete, click the **Save** button. 

        ![Enter X.509 device enrollment information in the portal blade](./media/java-quick-create-simulated-device-x509/enter-device-enrollment.png)  

       On successful enrollment, your X.509 device appears as **microsoftriotcore** under the *Registration ID* column in the *Individual Enrollments* tab. 

    - **Enrollment groups**: 

        1. On the Device Provisioning Service summary blade, select **Certificates** and click the **Add** button at the top.

        1. Under the **Add Certificate**, enter the following information:
            - Enter a unique certificate name.
            - Select the **_X509group.pem_** file you created previously.
            - Once complete, click the **Save** button.

        ![Add certificate](./media/java-quick-create-simulated-device-x509/add-certificate.png)

        1. Select the newly created certificate:
            - Click **Generate Verification Code**. Copy the code generated.
            - Enter the _verification code_ or right-click to paste in your running _provisioning-x509-cert-generator_ window.  Press **Enter**.
            - Copy to the clipboard the output of `Verification Cert` from *-----BEGIN CERTIFICATE-----* and ending at *-----END CERTIFICATE-----*.
            
                ![Validation generator](./media/java-quick-create-simulated-device-x509/validation-generator.png)

            - Create a file named **_X509validation.pem_** on your Windows machine, open it in an editor of your choice, and copy the clipboard contents to this file. Save the file.
            - Select the **_X509validation.pem_** file in the Azure portal. Click **Verfiy**.

            ![Validate certificate](./media/java-quick-create-simulated-device-x509/validate-certificate.png)

        1. Select **Manage enrollments**. Select **Enrollment Groups** tab and click the **Add** button at the top.
            - Enter a unique group name.
            - Select the unique certificate name created previously
            - Optionally, you may provide the following information:
                - Select an IoT hub linked with your provisioning service.
                - Update the **Initial device twin state** with the desired initial configuration for the device.

        ![Enter X.509 group enrollment information in the portal blade](./media/java-quick-create-simulated-device-x509/enter-group-enrollment.png)

        On successful enrollment, your X.509 device group appears under the *Group Name* column in the *Enrollment Groups* tab.


## Simulate the device

1. On the Device Provisioning Service summary blade, select **Overview** and note your _Id Scope_ and _Provisioning Service Global Endpoint_.

    ![Service information](./media/java-quick-create-simulated-device-x509/extract-dps-endpoints.png)

1. Open a command prompt. Navigate to the sample project folder.

    ```cmd/sh
    cd azure-iot-sdk-java/provisioning/provisioning-samples/provisioning-X509-sample
    ```

1. Enter the enrollment information in either of the following ways, as per your setup:

    - **Individual enrollment**: 

        1. Edit `/src/main/java/samples/com/microsoft/azure/sdk/iot/ProvisioningX509Sample.java` to include your _Id Scope_ and _Provisioning Service Global Endpoint_ as noted before. Also include _Client Cert_ and _Client Cert Private Key_ as noted before.

            ```java
            private static final String idScope = "[Your ID scope here]";
            private static final String globalEndpoint = "[Your Provisioning Service Global Endpoint here]";
            private static final ProvisioningDeviceClientTransportProtocol PROVISIONING_DEVICE_CLIENT_TRANSPORT_PROTOCOL = ProvisioningDeviceClientTransportProtocol.HTTPS;
            private static final String leafPublicPem = "<Your Public PEM Certificate here>";
            private static final String leafPrivateKey = "<Your Private PEM Key here>";
            ```

            - Use the following format for including your certificate and key:
            
                ```java
                private static final String leafPublicPem = "-----BEGIN CERTIFICATE-----\n" +
                    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
                    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
                    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
                    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
                    "+XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
                    "-----END CERTIFICATE-----\n";
                private static final String leafPrivateKey = "-----BEGIN PRIVATE KEY-----\n" +
                    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
                    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
                    "XXXXXXXXXX\n" +
                    "-----END PRIVATE KEY-----\n";
                ```

    - **Enrollment groups**: 

        1. Follow the instructions for **Individual enrollment** above.

        1. Add the following lines of code to the beginning of the `main` function.
        
            ```java
            String intermediatePem = "<Your Signer Certificate here>";			
    		String rootPem = "<Your Root Certificate here>";
    			
    		signerCertificates.add(intermediatePem);
    		signerCertificates.add(rootPem);
            ```
    
            - Use the following format for including your certificates:
        
                ```java
                String intermediatePem = "-----BEGIN CERTIFICATE-----\n" +
                    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
                    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
                    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
                    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
                    "+XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
                    "-----END CERTIFICATE-----\n";
                String rootPem = "-----BEGIN CERTIFICATE-----\n" +
                    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
                    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
                    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
                    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
                    "+XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
                    "-----END CERTIFICATE-----\n";
                ```

1. Build the sample. Navigate to the target folder and execute the created jar file.

    ```cmd/sh
    mvn clean install
    cd target
    java -jar ./provisioning-x509-sample-{version}-with-deps.jar
    ```

1. In the portal, navigate to the IoT hub linked to your provisioning service and open the **Device Explorer** blade. On successful provisioning of the simulated X.509 device to the hub, its device ID appears on the **Device Explorer** blade, with *STATUS* as **enabled**. Note that you might need to click the **Refresh** button at the top if you already opened the blade prior to running the sample device application. 

    ![Device is registered with the IoT hub](./media/java-quick-create-simulated-device-x509/hub-registration.png) 

> [!NOTE]
> If you changed the *initial device twin state* from the default value in the enrollment entry for your device, it can pull the desired twin state from the hub and act accordingly. For more information, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md).
>


## Clean up resources

If you plan to continue working on and exploring the device client sample, do not clean up the resources created in this Quickstart. If you do not plan to continue, use the following steps to delete all resources created by this Quickstart.

1. Close the device client sample output window on your machine.
1. From the left-hand menu in the Azure portal, click **All resources** and then select your Device Provisioning service. Open the **Manage Enrollments** blade for your service, and then click the **Individual Enrollments** tab. Select the *REGISTRATION ID* of the device you enrolled in this Quickstart, and click the **Delete** button at the top. 
1. From the left-hand menu in the Azure portal, click **All resources** and then select your IoT hub. Open the **IoT Devices** blade for your hub, select the *DEVICE ID* of the device you registered in this Quickstart, and then click **Delete** button at the top.


## Next steps

In this Quickstart, you’ve created a simulated X.509 device on your Windows machine and provisioned it to your IoT hub using the Azure IoT Hub Device Provisioning Service on the portal. To learn how to enroll your X.509 device programmatically, continue to the Quickstart for programmatic enrollment of X.509 devices. 

> [!div class="nextstepaction"]
> [Azure Quickstart - Enroll X.509 devices to Azure IoT Hub Device Provisioning Service](quick-enroll-device-x509-java.md)
