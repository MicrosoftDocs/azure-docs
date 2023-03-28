---
title: How to programmatically create an Azure Device Provisioning Service individual enrollment for TPM attestation
description: This article shows you how to programmatically create an individual enrollment entry for a device that uses TPM attestation.
author: kgremban
ms.author: kgremban
ms.date: 07/28/2022
ms.topic: how-to
ms.service: iot-dps
services: iot-dps
ms.devlang: csharp, java, nodejs
ms.custom: mvc, mode-other
zone_pivot_groups: iot-dps-set2
---
 
# Programmatically create a Device Provisioning Service individual enrollment for TPM attestation

This article shows you how to programmatically create an individual enrollment for a TPM device in the Azure IoT Hub Device Provisioning Service by using the [Azure IoT Hub DPS service SDK](libraries-sdks.md#service-sdks) and a sample application. After you've created the individual enrollment, you can optionally enroll a simulated TPM device to the provisioning service through this enrollment entry.

Although these steps work on both Windows and Linux computers, this article uses a Windows development computer.

## Prerequisites

* [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

* Complete the steps in [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md).

:::zone pivot="programming-language-csharp"

* Install [.NET 6.0 SDK or later](https://dotnet.microsoft.com/download) or later on your Windows-based machine. You can use the following command to check your version.

    ```bash
    dotnet --info
    ```

* (Optional) If you want to enroll a simulated device at the end of this article, follow the procedure in [Create and provision a simulated TPM device](quick-create-simulated-device-tpm.md?pivots=programming-language-csharp) up to the step where you get an endorsement key for the device. Save the **Endorsement key**, as youuse it later in this article.

    > [!NOTE]
    > Don't follow the steps to create an individual enrollment by using the Azure portal.

:::zone-end

:::zone pivot="programming-language-nodejs"

* Install [Node.js v4.0+](https://nodejs.org).

* (Optional) If you want to enroll a simulated device at the end of this article, follow the procedure in [Create and provision a simulated TPM device](quick-create-simulated-device-tpm.md?pivots=programming-language-nodejs) up to the step where you get an endorsement key and registration ID for the device. Save the **Endorsement key** and **Registration ID**, as you use them later in this article.

    > [!NOTE]
    > Don't follow the steps to create an individual enrollment by using the Azure portal.

:::zone-end

:::zone pivot="programming-language-java"

* Install the [Java SE Development Kit 8](/azure/developer/java/fundamentals/java-support-on-azure). This article installs the [Java Service SDK](https://azure.github.io/azure-iot-sdk-java/master/service/) later in the article. It works on both Windows and Linux. This article uses Windows.

* Install [Maven 3](https://maven.apache.org/download.cgi).

* Install [Git](https://git-scm.com/download/) and make sure that the path is added to the environment variable `PATH`.

* (Optional) If you want to enroll a simulated device at the end of this article, follow the procedure in [Create and provision a simulated TPM device](quick-create-simulated-device-tpm.md?pivots=programming-language-java) up to the step where you get an endorsement key for the device. Note the **Endorsement key** and the **Registration ID**, as you use them later in this article.

    > [!NOTE]
    > Don't follow the steps to create an individual enrollment by using the Azure portal.

:::zone-end

## Get TPM endorsement key (Optional)

You can follow the steps in this article to create a sample individual enrollment. In this, case, you'll be able to view the enrollment entry in DPS, but you won't be able to use it to provision a device.

:::zone pivot="programming-language-csharp"

You can also choose to follow the steps in this article to create an individual enrollment and enroll a simulated TPM device. If you want to enroll a simulated device at the end of this article, follow the procedure in [Create and provision a simulated TPM device](quick-create-simulated-device-tpm.md?pivots=programming-language-csharp) up to the step where you get an endorsement key for the device. Save the **Endorsement key**, as you use it later in this article.

> [!NOTE]
> Don't follow the steps to create an individual enrollment by using the Azure portal.

:::zone-end

:::zone pivot="programming-language-nodejs"

You can also choose to follow the steps in this article to create an individual enrollment and enroll a simulated TPM device. If you want to enroll a simulated device at the end of this article, follow the procedure in [Create and provision a simulated TPM device](quick-create-simulated-device-tpm.md?pivots=programming-language-nodejs) up to the step where you get an endorsement key and registration ID for the device. Save the **Endorsement key** and **Registration ID**, as you use them later in this article.

> [!NOTE]
> Don't follow the steps to create an individual enrollment by using the Azure portal.

:::zone-end

:::zone pivot="programming-language-java"

You can also choose to follow the steps in this article to create an individual enrollment and enroll a simulated TPM device. If you want to enroll a simulated device at the end of this article, follow the procedure in [Create and provision a simulated TPM device](quick-create-simulated-device-tpm.md?pivots=programming-language-java) up to the step where you get an endorsement key for the device. Note the **Endorsement key** and the **Registration ID**, as you use them later in this article.

> [!NOTE]
> Don't follow the steps to create an individual enrollment by using the Azure portal.

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

    This step downloads, installs, and adds a reference to the [Azure IoT DPS service client NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Devices.Provisioning.Service/) and its dependencies. This package includes the binaries for the .NET service SDK.

1. Open *Program.cs* file in an editor.

1. Replace the namespace statement at the top of the file with the following:

    ```csharp
    namespace CreateIndividualEnrollment;
    ```

1. Add the following `using` statements at the top of the file **above** the `namespace` statement:
  
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

    * Replace the `ProvisioningServiceConnectionString` placeholder value with the connection string of the provisioning service that you copied in the previous section.

    * If you're using this article together with the [Create and provision a simulated TPM device](quick-create-simulated-device-tpm.md?pivots=programming-language-csharp) quickstart to provision a simulated device, replace the endorsement key with the value that you noted in that quickstart. You can replace the device ID and registration ID with the values suggested in that quickstart, use your own values, or use the default values in this sample.

1. Add the following method to the `Program` class.  This code creates an individual enrollment entry and then calls the `CreateOrUpdateIndividualEnrollmentAsync` method on the `ProvisioningServiceClient` to add the individual enrollment to the provisioning service.

    ```csharp
    public static async Task RunSample()
    {
        Console.WriteLine("Starting sample...");
    
        using (ProvisioningServiceClient provisioningServiceClient =
                ProvisioningServiceClient.CreateFromConnectionString(ProvisioningConnectionString))
        {
            #region Create a new individualEnrollment config
            Console.WriteLine("\nCreating a new individualEnrollment object...");
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
            Console.WriteLine("\nAdding the individualEnrollment to the provisioning service...");
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

1. Save your changes.

:::zone-end

:::zone pivot="programming-language-nodejs"

1. From a command window in your working folder, run:
  
    ```cmd\sh
    npm install azure-iot-provisioning-service
    ```  

    This step downloads, installs, and adds a reference to the [Azure IoT DPS service client package](https://www.nuget.org/packages/Microsoft.Azure.Devices.Provisioning.Service/) and its dependencies. This package includes the binaries for the Node.js service SDK.

2. Using a text editor, create a _create_individual_enrollment.js_ file in your working folder. Add the following code to the file:

    ```javascript
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

1. Open a Windows command prompt.

1. Clone the [Microsoft Azure IoT SDKs for Java GitHub repo](https://github.com/Azure/azure-iot-sdk-java):

    ```cmd\sh
    git clone https://github.com/Azure/azure-iot-sdk-java.git --recursive
    ```

1. Go to the sample folder:

    ```cmd
    cd azure-iot-sdk-java\provisioning\provisioning-samples\service-enrollment-sample
    ```

1. Open the file *\src\main\java\samples\com\microsoft\azure\sdk\iot\ServiceEnrollmentSample.java* in an editor.

1. Replace `[Provisioning Connection String]` with the connection string that you copied in [Get the connection string for your provisioning service](#get-the-connection-string-for-your-provisioning-service).

    ```Java
    private static final String PROVISIONING_CONNECTION_STRING = "[Provisioning Connection String]";
    ```

1. Add the TPM device details. Replace the `[RegistrationId]` and `[TPM Endorsement Key]` in the following statements with your endorsement key and registration ID.

    ```Java
    private static final String REGISTRATION_ID = "[RegistrationId]";
    private static final String TPM_ENDORSEMENT_KEY = "[TPM Endorsement Key]";
    ```

    * If you're using this article together with the [Create and provision a simulated TPM device](quick-create-simulated-device-tpm.md?pivots=programming-language-java) quickstart to provision a simulated device, use the **Registration ID** and **Endorsement key** values that you noted from that quickstart.

    * If you're using this article to just create a sample individual enrollment and don't intend to use it to enroll a device, you can use the following value for an endorsement key:

        ```java
        private static final String TPM_ENDORSEMENT_KEY = "AToAAQALAAMAsgAgg3GXZ0SEs/gakMyNRqXXJP1S124GUgtk8qHaGzMUaaoABgCAAEMAEAgAAAAAAAEAxsj2gUScTk1UjuioeTlfGYZrrimExB+bScH75adUMRIi2UOMxG1kw4y+9RW/IVoMl4e620VxZad0ARX2gUqVjYO7KPVt3dyKhZS3dkcvfBisBhP1XH9B33VqHG9SHnbnQXdBUaCgKAfxome8UmBKfe+naTsE5fkvjb/do3/dD6l4sGBwFCnKRdln4XpM03zLpoHFao8zOwt8l/uP3qUIxmCYv9A7m69Ms+5/pCkTu/rK4mRDsfhZ0QLfbzVI6zQFOKF/rwsfBtFeWlWtcuJMKlXdD8TXWElTzgh7JS4qhFzreL0c1mI0GCj+Aws0usZh7dLIVPnefZcBhgy1SSDQMQ==";
        ```

        Enter your own value for the registration ID, for example, "myJavaDevice".

1. For individual enrollments, you can choose to set a device ID that DPS assigns to the device when it provisions it to IoT Hub. If you don't assign a device ID, DPS uses the registration ID as the device ID. By default, this sample assigns "myJavaDevice" as the device ID. If you want to change the device ID, modify the following statement:

    ```java
        private static final String DEVICE_ID = "myJavaDevice";
    ```

    If you don't want to assign a specific device ID, comment out the following statement:

    ```java
    individualEnrollment.setDeviceId(DEVICE_ID);
    ```

1. The sample allows you to set an IoT hub in the individual enrollment to provision the device to. This IoT hub must be one that has been previously linked to the provisioning service. For this article, we let DPS choose from the linked hubs according to the default allocation policy, evenly-weighted distribution. Comment out the following statement in the file:

    ```Java
    individualEnrollment.setIotHubHostName(IOTHUB_HOST_NAME);
    ```

1. The sample creates, updates, queries, and deletes an individual TPM device enrollment. To verify successful enrollment in portal, temporarily comment out the following lines of code at the end of the file:

    ```Java
    // *********************************** Delete info of individualEnrollment ************************************
    System.out.println("\nDelete the individualEnrollment...");
    provisioningServiceClient.deleteIndividualEnrollment(REGISTRATION_ID);
    ```

1. Save your changes.

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

To run the sample, you need the connection string for your provisioning service that you copied in the previous section, and the endorsement key for the device. If you've followed the [Create and provision a simulated device](quick-create-simulated-device-tpm.md) quickstart to create a simulated TPM device, use the endorsement key created for that device. Otherwise, to create a sample individual enrollment, you can use the following endorsement key supplied with the [Node.js Service SDK](https://github.com/Azure/azure-iot-sdk-node):

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

1. From the *azure-iot-sdk-java\provisioning\provisioning-samples\service-enrollment-sample* folder in your command prompt, run the following command to build the sample:

    ```cmd\sh
    mvn install -DskipTests
    ```

    This command downloads the [Azure IoT DPS service client Maven package](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot.provisioning/provisioning-service-client) to your machine and builds the sample. This package includes the binaries for the Java service SDK.

1. Switch to the *target* folder and run the sample. The build in the previous step outputs .jar file in the *target* folder with the following file format: `service-enrollment-sample-{version}-with-deps.jar`; for example: `service-enrollment-sample-1.8.1-with-deps.jar`. You may need to replace the version in the following command.

    ```cmd\sh
    cd target
    java -jar ./service-enrollment-sample-1.8.1-with-deps.jar
    ```

1. Upon successful creation, the command window displays the properties of the new enrollment.

:::zone-end

To verify that the individual enrollment has been created:

1. In the [Azure portal](https://portal.azure.com), navigate to your Device Provisioning Service instance.

2. In the **Settings** menu, select **Manage enrollments**.

3. Select the **Individual enrollments** tab. You should see a new enrollment entry that corresponds to the registration ID that you used in the sample.

:::zone pivot="programming-language-csharp"

   :::image type="content" source="./media/quick-enroll-device-tpm/verify-enrollment-csharp.png" alt-text="Screenshot that shows verifying enrollment for a C# individual device in the portal.":::

:::zone-end

:::zone pivot="programming-language-nodejs"

   :::image type="content" source="./media/quick-enroll-device-tpm/verify-enrollment-nodejs.png" alt-text="Screenshot that shows verifying enrollment for a Node.js individual device in the portal.":::

:::zone-end

:::zone pivot="programming-language-java"

   :::image type="content" source="./media/quick-enroll-device-tpm/verify-enrollment-java.png" alt-text="Screenshot that shows verifying enrollment for a Java individual device in the portal.":::

:::zone-end

## Enroll a simulated device (Optional)

:::zone pivot="programming-language-csharp"

If you've been following steps in the [Create and provision a simulated TPM device](quick-create-simulated-device-tpm.md?pivots=programming-language-csharp) quickstart to provision a simulated device, resume the quickstart at [Register the device](quick-create-simulated-device-tpm.md?pivots=programming-language-csharp#register-the-device).

:::zone-end

:::zone pivot="programming-language-nodejs"

If you've been following steps in the [Create and provision a simulated TPM device](quick-create-simulated-device-tpm.md?pivots=programming-language-nodejs) quickstart to provision a simulated device, resume the quickstart at [Register the device](quick-create-simulated-device-tpm.md?pivots=programming-language-nodejs#register-the-device).

:::zone-end

:::zone pivot="programming-language-java"

If you've been following steps in the [Create and provision a simulated TPM device](quick-create-simulated-device-tpm.md?pivots=programming-language-java) quickstart to provision a simulated device, resume the quickstart at [Register the device](quick-create-simulated-device-tpm.md?pivots=programming-language-java#register-the-device).

:::zone-end

## Clean up resources

If you plan to explore the DPS tutorials, don't clean up the resources created in this article. Otherwise, use the following steps to delete all resources created by this article.

1. In the [Azure portal](https://portal.azure.com), navigate to your Device Provisioning Service instance.

2. In the **Settings** menu, select **Manage enrollments**.

3. Select the **Individual enrollments** tab.

4. Select the check box next to the registration ID of the enrollment entry you created in this article.

5. At the top of the page, select  **Delete**.

:::zone pivot="programming-language-csharp"

6. If you followed the steps in [Create and provision a simulated TPM device](quick-create-simulated-device-tpm.md?pivot=programming-language-csharp) to create a simulated TPM device, do the following steps:

    1. In the Azure portal, navigate to the IoT Hub where your device was provisioned.

    1. In the left-hand menu under **Device management**, select **Devices**.

    1. Select the check box next to the Device ID of the device you registered in this article.

    1. At the top of the pane, select **Delete**.
:::zone-end

:::zone pivot="programming-language-nodejs"

8. If you followed the steps in [Create and provision a simulated TPM device](quick-create-simulated-device-tpm.md?pivot=programming-language-nodejs) to create a simulated TPM device, do the following steps:

    1. Close the TPM simulator window and the sample output window for the simulated device.

    2. In the Azure portal, navigate to the IoT Hub where your device was provisioned.

    3. In the left-hand menu under **Device management**, select **Devices**.

    4. Select the check box next to the device ID of the device you registered in this article.

    5. At the top of the pane, select **Delete**.
:::zone-end

:::zone pivot="programming-language-java"

8. If you followed the steps in [Create and provision a simulated TPM device](quick-create-simulated-device-tpm.md?pivot=programming-language-java) to create a simulated TPM device, do the following steps:

    1. Close the TPM simulator window and the sample output window for the simulated device.

    2. In the Azure portal, navigate to the IoT Hub where your device was provisioned.

    3. In the left-hand menu under **Device management**, select **Devices**.

    4. Select the check box next to the device ID of the device you registered in this article.

    5. At the top of the pane, select **Delete**.
:::zone-end

## Next steps

In this article, you’ve programmatically created an individual enrollment entry for a TPM device. Optionally, you created a TPM simulated device on your computer and provisioned it to your IoT hub using the Azure IoT Hub Device Provisioning Service. To explore further, check out the following links:

* For more information about TPM attestation with DPS, see [TPM attestation](concepts-x509-attestation.md).

* For an end-to-end example of a provisioning a device through an individual enrollment using TPM attestation, see the [Provision a simulated TPM device](quick-create-simulated-device-tpm.md) quickstart.

* To learn about managing individual enrollments and enrollment groups using Azure portal, see [How to manage device enrollments with Azure portal](how-to-manage-enrollments.md).
