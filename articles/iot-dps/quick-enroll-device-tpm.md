---
title: How to programmatically create an Azure Device Provisioning Service individual enrollment for TPM attestation
description: This article shows you how to programmatically create an individual enrollment entry for a device that uses TPM attestation.
author: kgremban
ms.author: kgremban
ms.date: 04/28/2022
ms.topic: quickstart
ms.service: iot-dps
services: iot-dps
ms.devlang: csharp
ms.custom: mvc, mode-other
zone_pivot_groups: iot-dps-set2
---
 
# Programmatically create a Device Provisioning Service individual enrollment for TPM attestation

This article shows you how to programmatically create an individual enrollment for a TPM device in the Azure IoT Hub Device Provisioning Service by using the [Microsoft Azure IoT SDK](../iot-hub/iot-hub-devguide-sdks.md) and a sample application. After you've created the individual enrollment, you can optionally enroll a simulated TPM device to the provisioning service through this enrollment entry.

Although these steps work on both Windows and Linux computers, this article uses a Windows development computer.

## Prerequisites

* [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

* Complete the steps in [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md).

:::zone pivot="programming-language-csharp"

* Install [Visual Studio 2022](https://www.visualstudio.com/vs/).

* Install [.NET 6.0 SDK or later](https://dotnet.microsoft.com/download) or later on your Windows-based machine. You can use the following command to check your version.

    ```bash
    dotnet --info
    ```

* (Optional) If you want to enroll a simulated device at the end of this article, follow the procedure in [Create and provision a simulated TPM device](quick-create-simulated-device-tpm.md?pivots=programming-language-csharp) up to the step where you get an endorsement key for the device. Save the endorsement key, registration ID, and, optionally, the device ID.

    > [!NOTE]
    > Don't follow the steps to create an individual enrollment by using the Azure portal.

:::zone-end

:::zone pivot="programming-language-nodejs"

* Install [Node.js v4.0+](https://nodejs.org).

* (Optional) Create an endorsement key. Follow the steps in [Create and provision a simulated device](quick-create-simulated-device-tpm.md?pivots=programming-language-nodejs) until you get the key.

    > [!NOTE]
    > Don't follow the steps to create an individual enrollment by using the Azure portal.

:::zone-end

:::zone pivot="programming-language-java"

* Install the [Java SE Development Kit 8](/azure/developer/java/fundamentals/java-support-on-azure). This article installs the [Java Service SDK](https://azure.github.io/azure-iot-sdk-java/master/service/) below. It works on both Windows and Linux. This article uses Windows.

* Install [Maven 3](https://maven.apache.org/download.cgi).

* Install [Git](https://git-scm.com/download/) and make sure the the path is added to the environment variable `PATH`.

:::zone-end

:::zone pivot="programming-language-java"

<a id="setupdevbox"></a>

## Prepare the development environment 

### Set up environment variables

To set up environment variables:

1. The `PATH` variable should include the full path to *jdk1.8.x\bin* directory. If this is your machine's first Java installation, then create a new environment variable named `JAVA_HOME` and point it to the full path to the *jdk1.8.x* directory. On Windows machine, this directory is found in the *C:\\Program Files\\Java\\* folder, and you can create or edit environment variables by searching for **Edit the system environment variables** on the **Control panel** of your Windows machine.

    You can check if Java is successfully set up on your machine by running the following command on your command window:

    ```cmd\sh
    java -version
    ```

2. Edit environment variable `PATH` to point to the *apache-maven-3.x.x\\bin* folder inside the folder where Maven was extracted. You may confirm that Maven is successfully installed by running this command on your command window:

    ```cmd\sh
    mvn --version
    ```

3. Make sure [git](https://git-scm.com/download/) is installed on your machine and is added to the environment variable `PATH`.

### Clone Git repository for Azure IoT Java SDK

To clone the Azure IoT Java SDK:

1. Open a command prompt. 

2. Clone the GitHub repo for device enrollment code sample using the [Java Service SDK](https://azure.github.io/azure-iot-sdk-java/master/service/):

    ```cmd\sh
    git clone https://github.com/Azure/azure-iot-sdk-java.git --recursive
    ```

:::zone-end

## Get the connection string for your provisioning service

For the sample in this article, you'll need to copy the connection string for your provisioning service.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the left-hand menu or on the portal page, select **All resources**.

3. Select your Device Provisioning Service.

4. In the **Settings** menu, select **Shared access policies**.

5. Select the access policy that you want to use.

6. In the **Access Policy** panel, copy and save the primary key connection string.

    :::image type="content" source="./media/quick-enroll-device-tpm/get-service-connection-string.png" alt-text="Get provisioning service connection string from the portal.":::

## Create the individual enrollment sample

:::zone pivot="programming-language-csharp"

This section shows you how to create a .NET Core console app that adds an individual enrollment for a TPM device to your provisioning service.

1. Open a Windows command prompt and navigate to a folder where you want to create your app.

1. To create a console project, run the following command:

    ```cmd
    dotnet new console --framework net6.0 --use-program-main 
    ```

1. To add a reference to the DPS service SDK, run the following command:

    ```cmd
    dotnet add package Microsoft.Azure.Devices.Provisioning.Service 
    ```

    This step downloads, installs, and adds a reference to the [Azure IoT Provisioning Service Client SDK](https://www.nuget.org/packages/Microsoft.Azure.Devices.Provisioning.Service/) NuGet package and its dependencies.

1. Open *Program.cs* file in an editor.

1. Replace the namespace statement at the top of the file with the following: 

    ```csharp
    namespace CreateIndividualEnrollment
    ```

1. Add the following `using` statements just under the `namespace` statement at the top of the file:
  
    ```csharp
    using System.Threading.Tasks;
    using Microsoft.Azure.Devices.Provisioning.Service;
    ```

1. Add the following fields to the `Program` class, and make the listed changes.  

    ```csharp
    private static string ProvisioningConnectionString = "{ProvisioningServiceConnectionString}";
    private const string RegistrationId = "sample-registrationid-csharp";
    private const string TpmEndorsementKey =
        "AToAAQALAAMAsgAgg3GXZ0SEs/gakMyNRqXXJP1S124GUgtk8qHaGzMUaaoABgCAAEMAEAgAAAAAAAEAxsj2gUS" +
        "cTk1UjuioeTlfGYZrrimExB+bScH75adUMRIi2UOMxG1kw4y+9RW/IVoMl4e620VxZad0ARX2gUqVjYO7KPVt3d" +
        "yKhZS3dkcvfBisBhP1XH9B33VqHG9SHnbnQXdBUaCgKAfxome8UmBKfe+naTsE5fkvjb/do3/dD6l4sGBwFCnKR" +
        "dln4XpM03zLpoHFao8zOwt8l/uP3qUIxmCYv9A7m69Ms+5/pCkTu/rK4mRDsfhZ0QLfbzVI6zQFOKF/rwsfBtFe" +
        "WlWtcuJMKlXdD8TXWElTzgh7JS4qhFzreL0c1mI0GCj+Aws0usZh7dLIVPnlgZcBhgy1SSDQMQ==";
        
    // Optional parameters
    private const string OptionalDeviceId = "myCSharpDevice";
    private const ProvisioningStatus OptionalProvisioningStatus = ProvisioningStatus.Enabled;
    ```

1. Replace the `ProvisioningServiceConnectionString` placeholder value with the connection string of the provisioning service that you copied in the previous section.

1. If you're using this article together with the [Create and provision a simulated TPM device](quick-create-simulated-device-tpm.md?pivots=programming-language-csharp) quickstart to provision a simulated device, replace the endorsement key and registration ID with the values that you noted in that quickstart. You can replace the device ID with the value suggested in that quickstart, use your own value, or use the default value in this sample.

1. Add the following method to the `Program` class.  This code creates an individual enrollment entry and then calls the `CreateOrUpdateIndividualEnrollmentAsync` method on the `ProvisioningServiceClient` to add the individual enrollment to the provisioning service.

    ```csharp
    public static async Task RunSample()
    {
        Console.WriteLine("Starting sample...");
    
        using (ProvisioningServiceClient provisioningServiceClient =
                ProvisioningServiceClient.CreateFromConnectionString(ProvisioningConnectionString))
        {
            #region Create a new individualEnrollment config
            Console.WriteLine("\nCreating a new individualEnrollment...");
            Attestation attestation = new TpmAttestation(TpmEndorsementKey);
            IndividualEnrollment individualEnrollment =
                    new IndividualEnrollment(
                            RegistrationId,
                            attestation);
    
            // The following parameters are optional. Remove them if you don't need them.
            individualEnrollment.DeviceId = OptionalDeviceId;
            individualEnrollment.ProvisioningStatus = OptionalProvisioningStatus;
            #endregion
    
            #region Create the individualEnrollment
            Console.WriteLine("\nAdding new individualEnrollment...");
            IndividualEnrollment individualEnrollmentResult =
                await provisioningServiceClient.CreateOrUpdateIndividualEnrollmentAsync(individualEnrollment).ConfigureAwait(false);
            Console.WriteLine("\nIndividualEnrollment created with success.");
            Console.WriteLine(individualEnrollmentResult);
            #endregion
        
        }
    }
    ```

1. Finally, replace the `Main` method with the following lines:

    ```csharp
    static async Task Main(string[] args)
    {
        await RunSample();
        Console.WriteLine("\nHit <Enter> to exit ...");
        Console.ReadLine();
    }
    ```

1. Build the solution:

:::zone-end

:::zone pivot="programming-language-nodejs"

1. From a command window in your working folder, run:
  
    ```cmd\sh
    npm install azure-iot-provisioning-service
    ```  

2. Using a text editor, create a _create_individual_enrollment.js_ file in your working folder. Add the following code to the file:

    ```Java
    'use strict';

    var provisioningServiceClient = require('azure-iot-provisioning-service').ProvisioningServiceClient;

    var serviceClient = provisioningServiceClient.fromConnectionString(process.argv[2]);
    var endorsementKey = process.argv[3];

    var enrollment = {
      registrationId: 'first',
      attestation: {
        type: 'tpm',
        tpm: {
          endorsementKey: endorsementKey
        }
      }
    };

    serviceClient.createOrUpdateIndividualEnrollment(enrollment, function(err, enrollmentResponse) {
      if (err) {
        console.log('error creating the individual enrollment: ' + err);
      } else {
        console.log("enrollment record returned: " + JSON.stringify(enrollmentResponse, null, 2));
      }
    });
    ```

3. Save the file.

:::zone-end

:::zone pivot="programming-language-java"

1. In the downloaded source code, navigate to the sample folder *_azure-iot-sdk-java/provisioning/provisioning-samples/service-enrollment-sample_*. Open the file *_/src/main/java/samples/com/microsoft/azure/sdk/iot/ServiceEnrollmentSample.java_*.

2. Replace `[Provisioning Connection String]` with the connection string that you copied in [Get the connection string for your provisioning service](#get-the-connection-string-for-your-provisioning-service).

    ```Java
    private static final String PROVISIONING_CONNECTION_STRING = "[Provisioning Connection String]";
    ```

3. Add the TPM device details:
    1. Get the *Registration ID* and the *TPM endorsement key* for a TPM device simulation, by following the steps leading to the section [Simulate TPM device](quick-create-simulated-device-tpm.md#simulatetpm).
    2. Use the **_Registration ID_** and the **_Endorsement Key_** from the output of the preceding step, to replace the `[RegistrationId]` and `[TPM Endorsement Key]` in the sample code file **_ServiceEnrollmentSample.java_**:

        ```Java
        private static final String REGISTRATION_ID = "[RegistrationId]";
        private static final String TPM_ENDORSEMENT_KEY = "[TPM Endorsement Key]";
        ```

4. To configure your provisioning service from within the sample code, proceed to the next step. If you  do not want to configure it, make sure to comment out or delete the following statements in the _ServiceEnrollmentSample.java_ file:

    ```Java
    / / The following parameters are optional. Remove it if you don't need.
    individualEnrollment.setDeviceId(DEVICE_ID);
    individualEnrollment.setIotHubHostName(IOTHUB_HOST_NAME);
    individualEnrollment.setProvisioningStatus(PROVISIONING_STATUS);
    ```

5. This step shows you how to configure your provisioning service in the sample code.

    1. Go to the [Azure portal](https://portal.azure.com).

    2. On the left-hand menu or on the portal page, select **All resources**.

    3. Select your Device Provisioning Service.

    4. In the **Overview** panel, copy the hostname of the *Service endpoint*.  In the source code sample, replace `[Host name]` with the copied hostname.

    ```Java
    private static final String IOTHUB_HOST_NAME = "[Host name].azure-devices.net";
    ```

6. Study the sample code. It creates, updates, queries, and deletes an individual TPM device enrollment. To verify successful enrollment in portal, temporarily comment out the following lines of code at the end of the _ServiceEnrollmentSample.java_ file:

    ```Java
    // *********************************** Delete info of individualEnrollment ************************************
    System.out.println("\nDelete the individualEnrollment...");
    provisioningServiceClient.deleteIndividualEnrollment(REGISTRATION_ID);
    ```

7. Save the file _ServiceEnrollmentSample.java_.

:::zone-end

## Run the individual enrollment sample

:::zone pivot="programming-language-csharp"

1. Run the sample:

    ```csharp
    dotnet run
    ```

2. Upon successful creation, the command window displays the properties of the new enrollment.

:::zone-end

:::zone pivot="programming-language-nodejs"

To run the sample, you'll need the connection string for your provisioning service that you copied in the previous section, as well as the endorsement key for the device. If you've followed the [Create and provision a simulated device](quick-create-simulated-device-tpm.md) quickstart to create a simulated TPM device, use the key created for that device. Otherwise, to create a sample individual enrollment, you can use the following endorsement key supplied with the [Node.js Service SDK](https://github.com/Azure/azure-iot-sdk-node):

```bash
AToAAQALAAMAsgAgg3GXZ0SEs/gakMyNRqXXJP1S124GUgtk8qHaGzMUaaoABgCAAEMAEAgAAAAAAAEAxsj2gUScTk1UjuioeTlfGYZrrimExB+bScH75adUMRIi2UOMxG1kw4y+9RW/IVoMl4e620VxZad0ARX2gUqVjYO7KPVt3dyKhZS3dkcvfBisBhP1XH9B33VqHG9SHnbnQXdBUaCgKAfxome8UmBKfe+naTsE5fkvjb/do3/dD6l4sGBwFCnKRdln4XpM03zLpoHFao8zOwt8l/uP3qUIxmCYv9A7m69Ms+5/pCkTu/rK4mRDsfhZ0QLfbzVI6zQFOKF/rwsfBtFeWlWtcuJMKlXdD8TXWElTzgh7JS4qhFzreL0c1mI0GCj+Aws0usZh7dLIVPnlgZcBhgy1SSDQMQ==
```

1. To create an individual enrollment for your TPM device, run the following command (include the quotes around the command arguments):

     ```cmd\sh
     node create_individual_enrollment.js "<the connection string for your provisioning service>" "<endorsement key>"
     ```

2. Upon successful creation, the command window displays the properties of the new enrollment.

:::zone-end

:::zone pivot="programming-language-java"

1. Open a command window in Administrator mode, and go to the folder *_azure-iot-sdk-java/provisioning/provisioning-samples/service-enrollment-group-sample_*.

2. In the command prompt, use this command:

    ```cmd\sh
    mvn install -DskipTests
    ```

    This command downloads the Maven package [`com.microsoft.azure.sdk.iot.provisioning.service`](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot.provisioning/provisioning-service-client) to your machine. This package includes the binaries for the Java service SDK, that the sample code needs to build. If you ran the _X.509 certificate generator_ tool in the preceding section, this package will be already downloaded on your machine.

3. In the command prompt, run the script:

    ```cmd\sh
    cd target
    java -jar ./service-enrollment-group-sample-{version}-with-deps.jar
    ```

4. Upon successful creation, the command window displays the properties of the new enrollment.

:::zone-end

To verify that the enrollment group has been created:

1. In the Azure portal, select your Device Provisioning Service.

2. In the **Settings** menu, select **Manage enrollments**.

3. Select **Individual Enrollments**. You should see a new enrollment entry that corresponds to the registration ID that you used in the sample.

:::zone pivot="programming-language-csharp"

:::image type="content" source="./media/quick-enroll-device-tpm/verify-enrollment-csharp.png" alt-text="Verify enrollment for C# individual device in the portal.":::

:::zone-end

:::zone pivot="programming-language-nodejs"

:::image type="content" source="./media/quick-enroll-device-tpm/verify-enrollment-nodejs.png" alt-text="Verify enrollment for Node.js individual device in the portal.":::

:::zone-end

:::zone pivot="programming-language-java"

:::image type="content" source="./media/quick-enroll-device-tpm/verify-enrollment-java.png" alt-text="Verify enrollment for Java individual device in the portal.":::

:::zone-end

## Clean up resources

If you plan to explore the DPS tutorials, don't clean up the resources created in this article. Otherwise, use the following steps to delete all resources created by this article.

1. Close the sample output window on your computer.

2. From the left-hand menu in the Azure portal, select **All resources**.

3. Select your Device Provisioning Service.

4. In the left-hand menu under **Settings**, select **Manage enrollments**.

5. Select the **Individual Enrollments** tab.

6. Select the check box next to the *Registration ID* of the enrollment entry you created in this article.

7. At the top of the page, select  **Delete**.

:::zone pivot="programming-language-csharp"

8. If you followed the steps in [Create and provision a simulated TPM device](quick-create-simulated-device-tpm.md?pivot=programming-language-csharp) to create a simulated TPM device, do the following steps:

    1. In the Azure portal, navigate to the IoT Hub where your device was provisioned.

    1. In the left-hand menu under **Device management**, select **Devices**.

    1. Select the check box next to the *Device ID* of the device you registered in this article.

    1. At the top of the pane, select **Delete**.
:::zone-end

:::zone pivot="programming-language-nodejs"

8. If you followed the steps in [Create and provision a simulated TPM device](quick-create-simulated-device-tpm.md?pivot=programming-language-nodejs) to create a simulated TPM device, do the following steps:

    1. Close the TPM simulator window and the sample output window for the simulated device.

    2. In the Azure portal, navigate to the IoT Hub where your device was provisioned.

    3. In the left-hand menu under **Device management**, select **Devices**.

    4. Select the check box next to the *Device ID* of the device you registered in this article.

    5. At the top of the pane, select **Delete**.
:::zone-end

:::zone pivot="programming-language-java"

8. If you followed the steps in [Create and provision a simulated TPM device](quick-create-simulated-device-tpm.md?pivot=programming-language-java) to create a simulated TPM device, do the following steps:

    1. Close the TPM simulator window and the sample output window for the simulated device.

    2. In the Azure portal, navigate to the IoT Hub where your device was provisioned.

    3. In the left-hand menu under **Device management**, select **Devices**.

    4. Select the check box next to the *Device ID* of the device you registered in this article.

    5. At the top of the pane, select **Delete**.
:::zone-end

## Next steps

In this article, you’ve programmatically created an individual enrollment entry for a TPM device. Optionally, you created a TPM simulated device on your computer and provisioned it to your IoT hub using the Azure IoT Hub Device Provisioning Service. To learn about provisioning multiple devices, continue to the tutorials for the Device Provisioning Service.

> [!div class="nextstepaction"]
> [How to provision devices using symmetric key enrollment groups](how-to-legacy-device-symm-key.md)
