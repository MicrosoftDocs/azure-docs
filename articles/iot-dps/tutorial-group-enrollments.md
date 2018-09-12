---
title: Provision a simulated X.509 device to Azure IoT Hub using Java and enrollment groups | Microsoft Docs
description: Azure Tutorial - Create and provision a simulated X.509 device using Java device and service SDK and enrollment groups for IoT Hub Device Provisioning Service
author: wesmc7777
ms.author: wesmc
ms.date: 01/04/2018
ms.topic: tutorial
ms.service: iot-dps
services: iot-dps 
manager: timlt
ms.devlang: java
ms.custom: mvc
---

# Create and provision a simulated X.509 device using Java device and service SDK and group enrollments for IoT Hub Device Provisioning Service

These steps show how to simulate an X.509 device on your development machine running Windows OS, and use a code sample to connect this simulated device with the Device Provisioning Service and your IoT hub using enrollment groups. 

Make sure to complete the steps in the [Setup IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md) before you proceed.


## Prepare the environment 

1. Make sure you have [Java SE Development Kit 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) installed on your machine.

1. Download and install [Maven](https://maven.apache.org/install.html).

1. Make sure `git` is installed on your machine and is added to the environment variables accessible to the command window. See [Software Freedom Conservancy's Git client tools](https://git-scm.com/download/) for the latest version of `git` tools to install, which includes the **Git Bash**, the command-line app that you can use to interact with your local Git repository. 

1. Use the following [Certifcate Overview](https://github.com/Azure/azure-iot-sdk-c/blob/master/tools/CACertificates/CACertificateOverview.md) to create your test certificates.

    > [!NOTE]
    > This step requires [OpenSSL](https://www.openssl.org/), which can either be built and installed from source or downloaded and installed from a [3rd party](https://wiki.openssl.org/index.php/Binaries) such as [this](https://sourceforge.net/projects/openssl/). If you have already created your _root_, _intermediate_ and _device_ certificates you may skip this step.
    >

    1. Run through the first two steps to create your _root_ and _intermediate_ certificates.

    1. Log in to the Azure portal, click on the **All resources** button on the left-hand menu and open your provisioning service.

        1. On the Device Provisioning Service summary blade, select **Certificates** and click the **Add** button at the top.

        1. Under the **Add Certificate**, enter the following information:
            - Enter a unique certificate name.
            - Select the **_RootCA.pem_** file you just created.
            - Once complete, click the **Save** button.

        ![Add certificate](./media/tutorial-group-enrollments/add-certificate.png)

        1. Select the newly created certificate:
            - Click **Generate Verification Code**. Copy the code generated.
            - Run the verification step. Enter the _verification code_ or right-click to paste in your running PowerShell window.  Press **Enter**.
            - Select the newly created **_verifyCert4.pem_** file in the Azure portal. Click **Verify**.

            ![Validate certificate](./media/tutorial-group-enrollments/validate-certificate.png)

    1. Finish by running the steps to create your device certificates and clean-up resources.

    > [!NOTE]
    > When creating device certificates be sure to use only lower-case alphanumerics and hyphens in your device name.
    >


## Create a device enrollment entry

1. Open a command prompt. Clone the GitHub repo for Java SDK code samples:
    
    ```cmd/sh
    git clone https://github.com/Azure/azure-iot-sdk-java.git --recursive
    ```

1. In the downloaded source code, navigate to the sample folder **_azure-iot-sdk-java/provisioning/provisioning-samples/service-enrollment-group-sample_**. Open the file **_/src/main/java/samples/com/microsoft/azure/sdk/iot/ServiceEnrollmentGroupSample.java_** in an editor of your choice, and add the following details:

    1. Add the `[Provisioning Connection String]` for your provisioning service, from the portal as following:

        1. Navigate to your provisioning service in the [Azure portal](https://portal.azure.com). 

        1. Open the **Shared access policies**, and select a policy which has the *EnrollmentWrite* permission.
    
        1. Copy the **Primary key connection string**. 

            ![Get the provisioning connection string from portal](./media/tutorial-group-enrollments/provisioning-string.png)  

        1. In the sample code file **_ServiceEnrollmentGroupSample.java_**, replace the `[Provisioning Connection String]` with the **Primary key connection string**.

            ```java
            private static final String PROVISIONING_CONNECTION_STRING = "[Provisioning Connection String]";
            ```

    1. Open the **_RootCA.pem_** file in a text editor. Assign the value of the **Root Cert** to the parameter **PUBLIC_KEY_CERTIFICATE_STRING** as shown below:

        ```java
        private static final String PUBLIC_KEY_CERTIFICATE_STRING =
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
        ```
 
    1. Navigate to the IoT hub linked to your provisioning service in the [Azure portal](https://portal.azure.com). Open the **Overview** tab for the hub, and copy the **Hostname**. Assign this **Hostname** to the *IOTHUB_HOST_NAME* parameter.

        ```java
        private static final String IOTHUB_HOST_NAME = "[Host name].azure-devices.net";
        ```

    1. Study the sample code. It creates, updates, queries and deletes a group enrollment for X.509 devices. To verify successful enrollment in portal, temporarily comment out the following lines of code at the end of the _ServiceEnrollmentGroupSample.java_ file:

        ```java
        // ************************************** Delete info of enrollmentGroup ***************************************
        System.out.println("\nDelete the enrollmentGroup...");
        provisioningServiceClient.deleteEnrollmentGroup(enrollmentGroupId);
        ```

    1. Save the file _ServiceEnrollmentGroupSample.java_. 

1. Open a command window, and navigate to the folder **_azure-iot-sdk-java/provisioning/provisioning-samples/service-enrollment-group-sample_**.

1. Build the sample code by using this command:

    ```cmd\sh
    mvn install -DskipTests
    ```

1. Run the sample by using these commands at the command window:

    ```cmd\sh
    cd target
    java -jar ./service-enrollment-group-sample-{version}-with-deps.jar
    ```

1. Observe the output window for successful enrollment.

    ![Successful enrollment](./media/tutorial-group-enrollments/enrollment.png) 

1. Navigate to your provisioning service in the Azure portal. Click **Manage enrollments**. Notice that your group of X.509 devices appears under the **Enrollment Groups** tab, with an auto-generated *GROUP NAME*. 


## Simulate the device

1. On the Device Provisioning Service summary blade, select **Overview** and note your _Id Scope_ and _Provisioning Service Global Endpoint_.

    ![Service information](./media/tutorial-group-enrollments/extract-dps-endpoints.png)

1. Open a command prompt. Navigate to the sample project folder.

    ```cmd/sh
    cd azure-iot-sdk-java/provisioning/provisioning-samples/provisioning-X509-sample
    ```

1. Enter the enrollment group information in the following way:

    - Edit `/src/main/java/samples/com/microsoft/azure/sdk/iot/ProvisioningX509Sample.java` to include your _Id Scope_ and _Provisioning Service Global Endpoint_ as noted before. Open your **_{deviceName}-public.pem_** file and include this value as your _Client Cert_. Open your **_{deviceName}-all.pem_** file and copy the text from _-----BEGIN PRIVATE KEY-----_ to _-----END PRIVATE KEY-----_.  Use this as your _Client Cert Private Key_.

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

1. Build the sample. Navigate to the target folder and execute the created jar file.

    ```cmd/sh
    mvn clean install
    cd target
    java -jar ./provisioning-x509-sample-{version}-with-deps.jar
    ```

    ![Successful registration](./media/tutorial-group-enrollments/registration.png)

1. In the portal, navigate to the IoT hub linked to your provisioning service and open the **Device Explorer** blade. On successful provisioning of the simulated X.509 device to the hub, its device ID appears on the **Device Explorer** blade, with *STATUS* as **enabled**. Note that you might need to click the **Refresh** button at the top if you already opened the blade prior to running the sample device application. 

    ![Device is registered with the IoT hub](./media/tutorial-group-enrollments/hub-registration.png) 


## Clean up resources

If you plan to continue working on and exploring the device client sample, do not clean up the resources created in this Quickstart. If you do not plan to continue, use the following steps to delete all resources created by this Quickstart.

1. Close the device client sample output window on your machine.
1. From the left-hand menu in the Azure portal, click **All resources** and then select your Device Provisioning service. Open the **Manage Enrollments** blade for your service, and then click the **Individual Enrollments** tab. Select the *REGISTRATION ID* of the device you enrolled in this Quickstart, and click the **Delete** button at the top. 
1. From the left-hand menu in the Azure portal, click **All resources** and then select your IoT hub. Open the **IoT Devices** blade for your hub, select the *DEVICE ID* of the device you registered in this Quickstart, and then click **Delete** button at the top.


## Next steps

In this tutorial, you’ve created a simulated X.509 device on your Windows machine and provisioned it to your IoT hub using the Azure IoT Hub Device Provisioning Service and enrollment groups. To learn more about your X.509 device, continue to device concepts. 

> [!div class="nextstepaction"]
> [IoT Hub Device Provisioning Service device concepts](concepts-device.md)
