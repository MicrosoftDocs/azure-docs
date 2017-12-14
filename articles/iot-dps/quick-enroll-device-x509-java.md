---
title: Enroll X.509 devices to Azure Device Provisioning Service | Microsoft Docs
description: Azure Quickstart - Enroll X.509 devices to Azure IoT Hub Device Provisioning Service
services: iot-dps 
keywords: 
author: dsk-2015
ms.author: dkshir
ms.date: 12/14/2017
ms.topic: hero-article
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc
---

# Enroll X.509 devices to IoT Hub Device Provisioning Services
> [!div class="op_single_selector"]
> * [TPM](quick-enroll-device-tpm-java.md)
> * [X.509](quick-enroll-device-x509-java.md)

These steps show how to enroll X.509 simulated devices programmatically to the Azure IoT Hub Device Provisioning Services, using the [Java Service SDK](https://azure.github.io/azure-iot-sdk-java/service/) with the help of a sample Java application. Although these steps will work on both Windows as well as Linux machines, we will use a Windows development machine for the purpose of this article.

Make sure to [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md), as well as [Simulate X.509 simulated device](quick-create-simulated-device-x509.md) before you proceed.

<a id="setupdevbox"></a>

## Prepare the development environment 

1. Make sure you have [Java SE Development Kit 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) installed on your machine. 

2. Set up environment variables for your Java installation. The `PATH` variable should include the full path to *jdk1.8.x\bin* directory. If this is your machine's first Java installation, then create a new environment variable named `JAVA_HOME` and point it to the full path to the *jdk1.8.x* directory. On Windows machine, this directory is usually found in the *C:\\Program Files\\Java\\* folder, and you can create or edit environment variables by searching for **Edit the system environment variables** on the **Control panel** of your Windows machine. 

  You may check if Java is successfully set up on your machine by running the following command on your command window:

    ```cmd\sh
    java -version
    ```

3. Download and extract [Maven 3](https://maven.apache.org/download.cgi) on your machine. 

4. Edit environment variable `PATH` to point to the *apache-maven-3.x.x\\bin* folder inside the folder where Maven is extracted. You may confirm that Maven is succesfully installed by running this command your command window:

    ```cmd\sh
    mvn --version
    ```

5. Make sure [git](https://git-scm.com/download/) is installed on your machine and is added to the environment variable `PATH`. 


<a id="downloadjava"></a>

## Download the Java source code

1. Open a command prompt. Clone the GitHub repo for device enrollment code sample using the Java Service SDK:
    
    ```cmd/sh
    git clone https://github.com/Azure/azure-iot-sdk-java.git --recursive
    ```

2. Compile the source code using *Maven*. 

    ```cmd/sh
    cd azure-iot-sdk-java
    mvn install -DskipTests=true
    ```
   
   This step creates the Maven package `com.microsoft.azure.sdk.iot.provisioning.service` on your machine.

3. Navigate to the sample folder **_azure-iot-sdk-java/provisioning/provisioning-samples/service-enrollment-group-sample_**.

4. Open the file **_/src/main/java/samples/com/microsoft/azure/sdk/iot/ServiceEnrollmentGroupSample.java_** in an editor of your choice. 

5. In the opened file, replace the *[Provisioning Connection String]* by the one copied from the portal **TBD**.

    ```Java
    /*
     * Details of the Provisioning.
     */
    private static final String PROVISIONING_CONNECTION_STRING = "[Provisioning Connection String]";
    ```

6. Copy the root certificate for the group of devices **TBD**.

    ```Java
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
 
7. Optionally, replace *[Host name]* with the name of the IoT hub linked to your provisioning service.
    
    ```Java
    private static final String IOTHUB_HOST_NAME = "[Host name].azure-devices.net";
    ```

   If you did not provide the above information, you should remove the following statements from the sample code that add this information to the group enrollment entry. 

    ```Java
    enrollmentGroup.setIotHubHostName(IOTHUB_HOST_NAME);                // Optional parameter.
    enrollmentGroup.setProvisioningStatus(ProvisioningStatus.ENABLED);  // Optional parameter.
    ```

8. Save and close the file. 
 

## Build and run sample enrollment

1. Open a command window, and navigate to the folder **_azure-iot-sdk-java/provisioning/provisioning-samples/service-enrollment-group-sample_**.

2. Build the sample code by using this command:

    ```cmd\sh
    mvn install -DskipTests
    ```

3. Run the sample by using these commands at the command window:

    ```cmd\sh
    cd target
    java -jar ./service-enrollment-group-sample-{version}-with-deps.jar
    ```

4. Observe the output window **TBD**.

## Clean up resources
**TBD**
If you plan to continue working on and exploring the device client sample, do not clean up the resources created in this Quickstart. If you do not plan to continue, use the following steps to delete all resources created by this Quickstart.

1. Close the device client sample output window on your machine.
1. Close the TPM simulator window on your machine.
1. From the left-hand menu in the Azure portal, click **All resources** and then select your Device Provisioning service. At the top of the **All resources** blade, click **Delete**.  
1. From the left-hand menu in the Azure portal, click **All resources** and then select your IoT hub. At the top of the **All resources** blade, click **Delete**.  

## Next steps
**TBD**
In this Quickstart, you’ve created a TPM simulated device on your machine and provisioned it to your IoT hub using the Azure IoT Hub Device Provisioning Service. To learn about device provisioning in depth, continue to the tutorial for the Device Provisioning Service setup in the Azure portal. 

> [!div class="nextstepaction"]
> [Azure IoT Hub Device Provisioning Service tutorials](./tutorial-set-up-cloud.md)
