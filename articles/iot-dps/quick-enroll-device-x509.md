---
title: How to programmatically create an Azure Device Provisioning Service enrollment group for X.509 certificate attestation
description: This article shows you how to programmatically create an enrollment group to enroll a group of devices that use intermediate or root CA X.509 certificate attestation.
author: kgremban
ms.author: kgremban
ms.date: 07/22/2022
ms.topic: how-to
ms.service: iot-dps
services: iot-dps
ms.devlang: csharp, java, nodejs
ms.custom: mvc, mode-other
zone_pivot_groups: iot-dps-set2
---
 
# Programmatically create a Device Provisioning Service enrollment group for X.509 certificate attestation

This article shows you how to programmatically create an [enrollment group](concepts-service.md#enrollment-group) that uses intermediate or root CA X.509 certificates. The enrollment group is created by using the [Azure IoT Hub DPS service SDK](libraries-sdks.md#service-sdks) and a sample application. An enrollment group controls access to the provisioning service for devices that share a common signing certificate in their certificate chain. To learn more, see [Controlling device access to the provisioning service with X.509 certificates](./concepts-x509-attestation.md#controlling-device-access-to-the-provisioning-service-with-x509-certificates). For more information about using X.509 certificate-based Public Key Infrastructure (PKI) with Azure IoT Hub and Device Provisioning Service, see [X.509 CA certificate security overview](../iot-hub/iot-hub-x509ca-overview.md).

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

* Complete the steps in [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md).

:::zone pivot="programming-language-csharp"

* Install [.NET 6.0 SDK or later](https://dotnet.microsoft.com/download) or later on your Windows-based machine. You can use the following command to check your version.

    ```bash
    dotnet --info
    ```

:::zone-end

:::zone pivot="programming-language-nodejs"

* Install [Node.js v4.0 or above](https://nodejs.org) or later on your machine.

:::zone-end

:::zone pivot="programming-language-java"

* [Java SE Development Kit 8](/azure/developer/java/fundamentals/java-support-on-azure). This article installs the [Java Service SDK](https://azure.github.io/azure-iot-sdk-java/master/service/) below. It works on both Windows and Linux. This article uses Windows.

* [Maven 3](https://maven.apache.org/download.cgi).

:::zone-end

* Install the latest version of [Git](https://git-scm.com/download/). Make sure that Git is added to the environment variables accessible to the command window. See [Software Freedom Conservancy's Git client tools](https://git-scm.com/download/) for the latest version of `git` tools to install, which includes *Git Bash*, the command-line app that you can use to interact with your local Git repository.

>[!NOTE]
>Although the steps in this article work on both Windows and Linux computers, this article uses a Windows development computer.

## Create test certificates

Enrollment groups that use X.509 certificate attestation can be configured to use a root CA certificate or an intermediate certificate. The more usual case is to configure the enrollment group with an intermediate certificate. This provides more flexibility as multiple intermediate certificates can be generated or revoked by the same root CA certificate.

For this article, you'll need either a root CA certificate file, an intermediate CA certificate file, or both in *.pem* or *.cer* format. One file contains the public portion of the root CA X.509 certificate and the other contains the public portion of the intermediate CA X.509 certificate.

If you already have a root CA file and/or an intermediate CA file, you can continue to [Add and verify your root or intermediate CA certificate](#add-and-verify-your-root-or-intermediate-ca-certificate).

If you don't have a root CA file and/or an intermediate CA file, follow the steps in [Create an X.509 certificate chain](tutorial-custom-hsm-enrollment-group-x509.md?tabs=windows#create-an-x509-certificate-chain) to create them. You can stop after you complete the steps in [Create the intermediate CA certificate](tutorial-custom-hsm-enrollment-group-x509.md?tabs=windows#create-the-intermediate-ca-certificate) as you won't need device certificates to complete the steps in this article. When you're finished, you'll have two X.509 certificate files: *./certs/azure-iot-test-only.root.ca.cert.pem* and *./certs/azure-iot-test-only.intermediate.cert.pem*.

## Add and verify your root or intermediate CA certificate

Devices that provision through an enrollment group using X.509 certificates, present the entire certificate chain when they authenticate with DPS. For DPS to be able to validate the certificate chain, the root or intermediate certificate configured in an enrollment group must either be a verified certificate or must roll up to a verified certificate in the certificate chain a device presents when it authenticates with the service.

For this article, assuming you have both a root CA certificate and an intermediate CA certificate signed by the root CA:

* If you plan on creating the enrollment group with the root CA certificate, you'll need to upload and verify the root CA certificate. 

* If you plan on creating the enrollment group with the intermediate CA certificate, you can upload and verify either the root CA certificate or the intermediate CA certificate. (If you have multiple intermediate CA certificates in the certificate chain, you could, alternatively, upload and verify any intermediate certificate that sits between the root CA certificate and the intermediate certificate that you create the enrollment group with.)

To add and verify your root or intermediate CA certificate to the Device Provisioning Service:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the left-hand menu or on the portal page, select **All resources**.

3. Select your Device Provisioning Service.

4. In the **Settings** menu, select **Certificates**.

5. On the top menu, select **+ Add:**.

6. Enter a name for your root or intermediate CA certificate, and upload the *.pem* or *.cer* file.

7. Select **Set certificate status to verified on upload**.

    :::image type="content" source="./media/quick-enroll-device-x509/add-certificate.png" alt-text="Screenshot that shows adding the root CA certificate to a DPS instance.":::

8. Select **Save**.

## Get the connection string for your provisioning service

For the sample in this article, you'll need to copy the connection string for your provisioning service.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the left-hand menu or on the portal page, select **All resources**.

3. Select your Device Provisioning Service.

4. In the **Settings** menu, select **Shared access policies**.

5. Select the access policy that you want to use.

6. In the **Access Policy** panel, copy and save the primary key connection string.

    :::image type="content" source="./media/quick-enroll-device-x509/get-service-connection-string.png" alt-text="Screenshot that shows the location of the provisioning service connection string in the portal.":::

## Create the enrollment group sample

:::zone pivot="programming-language-csharp"

This section shows you how to create a .NET Core console application that adds an enrollment group to your provisioning service.

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
    namespace CreateEnrollmentGroup;
    ```

1. Add the following `using` statements at the top of the file **above** the `namespace` statement:

    ```csharp
    using System.Security.Cryptography.X509Certificates;
    using System.Threading.Tasks;
    using Microsoft.Azure.Devices.Provisioning.Service;
    ```

1. Add the following fields to the `Program` class, and make the indicated changes.  

    ```csharp
    private static string ProvisioningConnectionString = "{ProvisioningServiceConnectionString}";
    private static string EnrollmentGroupId = "enrollmentgrouptest";
    private static string X509RootCertPath = @"{Path to a .cer or .pem file for a verified root CA or intermediate CA X.509 certificate}";
    ```

    * Replace the `ProvisioningServiceConnectionString` placeholder value with the connection string of the provisioning service that you copied in the previous section.

    * Replace the `X509RootCertPath` placeholder value with the path to a .pem or .cer file. This file represents the public part of a either a root CA X.509 certificate that has been previously uploaded and verified with your provisioning service, or an intermediate certificate that has itself been uploaded and verified or had a certificate in its signing chain uploaded and verified.

    * You may optionally change the `EnrollmentGroupId` value. The string can contain only lower case characters and hyphens.

    > [!IMPORTANT]
    > In production code, be aware of the following security considerations:
    >
    > * Hard-coding the connection string for the provisioning service administrator is against security best practices. Instead, the connection string should be held in a secure manner, such as in a secure configuration file or in the registry.
    > * Be sure to upload only the public part of the signing certificate. Never upload .pfx (PKCS12) or .pem files containing private keys to the provisioning service.

1. Add the following method to the `Program` class. This code creates an [`EnrollmentGroup`](/dotnet/api/microsoft.azure.devices.provisioning.service.enrollmentgroup) entry and then calls the [`ProvisioningServiceClient.CreateOrUpdateEnrollmentGroupAsync`](/dotnet/api/microsoft.azure.devices.provisioning.service.provisioningserviceclient.createorupdateenrollmentgroupasync) method to add the enrollment group to the provisioning service.

    ```csharp
    public static async Task RunSample()
    {
        Console.WriteLine("Starting sample...");
    
        using (ProvisioningServiceClient provisioningServiceClient =
                ProvisioningServiceClient.CreateFromConnectionString(ProvisioningConnectionString))
        {
            #region Create a new enrollmentGroup config
            Console.WriteLine("\nCreating a new enrollmentGroup...");
            var certificate = new X509Certificate2(X509RootCertPath);
            Attestation attestation = X509Attestation.CreateFromRootCertificates(certificate);
            EnrollmentGroup enrollmentGroup =
                    new EnrollmentGroup(
                            EnrollmentGroupId,
                            attestation)
                    {
                        ProvisioningStatus = ProvisioningStatus.Enabled
                    };
            Console.WriteLine(enrollmentGroup);
            #endregion
    
            #region Create the enrollmentGroup
            Console.WriteLine("\nAdding new enrollmentGroup...");
            EnrollmentGroup enrollmentGroupResult =
                await provisioningServiceClient.CreateOrUpdateEnrollmentGroupAsync(enrollmentGroup).ConfigureAwait(false);
            Console.WriteLine("\nEnrollmentGroup created with success.");
            Console.WriteLine(enrollmentGroupResult);
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

This section shows you how to create a Node.js script that adds an enrollment group to your provisioning service.

1. From a command window in your working folder, run:

     ```cmd\sh
     npm install azure-iot-provisioning-service
     ```  

    This step downloads, installs, and adds a reference to the [Azure IoT DPS service client package](https://www.nuget.org/packages/Microsoft.Azure.Devices.Provisioning.Service/) and its dependencies. This package includes the binaries for the Node.js service SDK.

2. Using a text editor, create a **create_enrollment_group.js** file in your working folder. Add the following code to the file and save:

    ```javascript
        'use strict';
        var fs = require('fs');
    
        var provisioningServiceClient = require('azure-iot-provisioning-service').ProvisioningServiceClient;
    
        var serviceClient = provisioningServiceClient.fromConnectionString(process.argv[2]);
    
        var enrollment = {
          enrollmentGroupId: 'first',
          attestation: {
            type: 'x509',
            x509: {
              signingCertificates: {
                primary: {
                  certificate: fs.readFileSync(process.argv[3], 'utf-8').toString()
                }
              }
            }
          },
          provisioningStatus: 'disabled'
        };
    
        serviceClient.createOrUpdateEnrollmentGroup(enrollment, function(err, enrollmentResponse) {
          if (err) {
            console.log('error creating the group enrollment: ' + err);
          } else {
            console.log("enrollment record returned: " + JSON.stringify(enrollmentResponse, null, 2));
            enrollmentResponse.provisioningStatus = 'enabled';
            serviceClient.createOrUpdateEnrollmentGroup(enrollmentResponse, function(err, enrollmentResponse) {
              if (err) {
                console.log('error updating the group enrollment: ' + err);
              } else {
                console.log("updated enrollment record returned: " + JSON.stringify(enrollmentResponse, null, 2));
              }
            });
          }
        });
    ```

:::zone-end

:::zone pivot="programming-language-java"

<a id="runjavasample"></a>

1. Open a Windows command prompt.

1. Clone the GitHub repo for device enrollment code sample using the [Java Service SDK](https://azure.github.io/azure-iot-sdk-java/master/service/):

    ```cmd\sh
    git clone https://github.com/Azure/azure-iot-sdk-java.git --recursive
    ```

1. From the location where you downloaded the repo, go to the sample folder:

    ```cmd\sh
    cd azure-iot-sdk-java\provisioning\provisioning-samples\service-enrollment-group-sample 
    ```

1. Open the file *_/src/main/java/samples/com/microsoft/azure/sdk/iot/ServiceEnrollmentGroupSample.java_* in an editor of your choice.

1. Replace `[Provisioning Connection String]` with the connection string that you copied in [Get the connection string for your provisioning service](#get-the-connection-string-for-your-provisioning-service).

1. Replace the `PUBLIC_KEY_CERTIFICATE_STRING` constant string with the value of your root or intermediate CA certificate `.pem` file. This file represents the public part of a either a root CA X.509 certificate that has been previously uploaded and verified with your provisioning service, or an intermediate certificate that has itself been uploaded and verified or had a certificate in its signing chain uploaded and verified.

    The syntax of certificate text must follow the pattern below with no extra spaces or characters.

    ```java
    private static final String PUBLIC_KEY_CERTIFICATE_STRING = 
            "-----BEGIN CERTIFICATE-----\n" +
            "MIIFOjCCAyKgAwIBAgIJAPzMa6s7mj7+MA0GCSqGSIb3DQEBCwUAMCoxKDAmBgNV\n" +
                ...
            "MDMwWhcNMjAxMTIyMjEzMDMwWjAqMSgwJgYDVQQDDB9BenVyZSBJb1QgSHViIENB\n" +
            "-----END CERTIFICATE-----";
    ```

    Updating this string value manually can be prone to error. To generate the proper syntax, you can copy and paste the following command into a **Git Bash** prompt, replace `your-cert.pem` with the location of your certificate file, and press **ENTER**. This command will generate the syntax for the `PUBLIC_KEY_CERTIFICATE_STRING` string constant value and write it to the output.

    ```bash
    sed 's/^/"/;$ !s/$/\\n" +/;$ s/$/"/' your-cert.pem
    ```

    Copy and paste the output certificate text for the constant value.

    > [!IMPORTANT]
    > In production code, be aware of the following security considerations:
    >
    > * Hard-coding the connection string for the provisioning service administrator is against security best practices. Instead, the connection string should be held in a secure manner, such as in a secure configuration file or in the registry.
    > * Be sure to upload only the public part of the signing certificate. Never upload .pfx (PKCS12) or .pem files containing private keys to the provisioning service.

1. The sample allows you to set an IoT hub in the enrollment group to provision the device to. This must be an IoT hub that has been previously linked to the provisioning service. For this article, we'll let DPS choose from the linked hubs according to the default allocation policy, evenly-weighted distribution. Comment out the following statement in the file:

    ```Java
    enrollmentGroup.setIotHubHostName(IOTHUB_HOST_NAME);                // Optional parameter.
    ```

1. The sample code creates, updates, queries, and deletes an enrollment group for X.509 devices. To verify successful creation of the enrollment group in Azure portal, comment out the following lines of code near the end of the file:

    ```Java
    // ************************************** Delete info of enrollmentGroup ***************************************
    System.out.println("\nDelete the enrollmentGroup...");
    provisioningServiceClient.deleteEnrollmentGroup(enrollmentGroupId);
    ```

1. Save the _ServiceEnrollmentGroupSample.java_ file.

:::zone-end

## Run the enrollment group sample

:::zone pivot="programming-language-csharp"

1. Run the sample:

    ```csharp
    dotnet run
    ```

2. Upon successful creation, the command window displays the properties of the new enrollment group.

:::zone-end

:::zone pivot="programming-language-nodejs"

1. Run the following command in your command prompt. Include the quotes around the command arguments and replace `<connection string>` withe connection string you copied in the previous section, and `<certificate .pem file>` with the path to your certificate `.pem` file. This file represents the public part of a either a root CA X.509 certificate that has been previously uploaded and verified with your provisioning service, or an intermediate certificate that has itself been uploaded and verified or had a certificate in its signing chain uploaded and verified.

    ```cmd\sh
    node create_enrollment_group.js "<connection string>" "<certificate .pem file>"
    ```

2. Upon successful creation, the command window displays the properties of the new enrollment group.

:::zone-end

:::zone pivot="programming-language-java"

1. From the *azure-iot-sdk-java\provisioning\provisioning-samples\service-enrollment-group-sample* folder in your command prompt, run the following command to build the sample:

    ```cmd\sh
    mvn install -DskipTests
    ```

    This command downloads the [Azure IoT DPS service client Maven package](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot.provisioning/provisioning-service-client) to your machine and builds the sample. This package includes the binaries for the Java service SDK.

1. Switch to the *target* folder and run the sample. Be aware that the build in the previous step outputs .jar file in the *target* folder with the following file format: `provisioning-x509-sample-{version}-with-deps.jar`; for example: `provisioning-x509-sample-1.8.1-with-deps.jar`. You may need to replace the version in the command below.

    ```cmd\sh
    cd target
    java -jar ./service-enrollment-group-sample-1.8.1-with-deps.jar
    ```

1. Upon successful creation, the command window displays the properties of the new enrollment group.

:::zone-end

To verify that the enrollment group has been created:

1. In the [Azure portal](https://portal.azure.com), navigate to your Device Provisioning Service instance.

2. In the **Settings** menu, select **Manage enrollments**.

3. Select the **Enrollment groups** tab. You should see a new enrollment entry that corresponds to the enrollment group ID that you used in the sample.

:::zone pivot="programming-language-csharp"

   :::image type="content" source="./media/quick-enroll-device-x509/verify-enrollment-csharp.png" alt-text="Screenshot that shows the newly created enrollment group in the portal.":::

:::zone-end

:::zone pivot="programming-language-nodejs"

   :::image type="content" source="./media/quick-enroll-device-x509/verify-enrollment-nodejs.png" alt-text="Screenshot that shows the newly created enrollment group in the portal.":::

:::zone-end

:::zone pivot="programming-language-java"

   :::image type="content" source="./media/quick-enroll-device-x509/verify-enrollment-java.png" alt-text="Screenshot that shows the newly created enrollment group in the portal.":::

:::zone-end

## Clean up resources

If you plan to explore the Azure IoT Hub Device Provisioning Service tutorials, don't clean up the resources created in this article. Otherwise, use the following steps to delete all resources created by this article.

1. Close the sample output window on your computer.

2. From the left-hand menu in the Azure portal, select **All resources**.

3. Select your Device Provisioning Service.

4. In the left-hand menu under **Settings**, select **Manage enrollments**.

5. Select the **Enrollment groups** tab.

6. Select the check box next to the group name of the enrollment group you created in this article.

7. At the top of the page, select  **Delete**.

8. From your Device Provisioning Service in the Azure portal, select **Certificates** under **Settings** on the left-hand menu.

9. Select the certificate you uploaded for this article.

10. At the top of **Certificate details**, select **Delete**.  

## Certificate tooling

:::zone pivot="programming-language-csharp"

The [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c) has scripts that can help you create root CA, intermediate CA, and device certificates, and do proof-of-possession with the service to verify root and intermediate CA certificates. To learn more, see [Managing test CA certificates for samples and tutorials](https://github.com/Azure/azure-iot-sdk-c/blob/master/tools/CACertificates/CACertificateOverview.md).

The [Group certificate verification sample](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/provisioning/service/samples/how%20to%20guides/GroupCertificateVerificationSample) in the [Azure IoT SDK for C# (.NET)](https://github.com/Azure/azure-iot-sdk-csharp) shows how to do proof-of-possession in C# with an existing X.509 intermediate or root CA certificate.

:::zone-end

:::zone pivot="programming-language-nodejs"

The [Azure IoT Node.js SDK](https://github.com/Azure/azure-iot-sdk-node) has scripts that can help you create root CA, intermediate CA, and device certificates, and do proof-of-possession with the service to verify root and intermediate CA certificates. To learn more, see [Tools for the Azure IoT Device Provisioning Device SDK for Node.js](https://github.com/Azure/azure-iot-sdk-node/tree/main/provisioning/tools).

You can also use tools available in the  [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c). To learn more, see [Managing test CA certificates for samples and tutorials](https://github.com/Azure/azure-iot-sdk-c/blob/master/tools/CACertificates/CACertificateOverview.md).

:::zone-end

:::zone pivot="programming-language-java"

The [Azure IoT Java SDK](https://github.com/Azure/azure-iot-sdk-java) contains test tooling that can help you create an X.509 certificate chain, upload a root or intermediate certificate from that chain, and do proof-of-possession with the service to verify root and intermediate CA certificates. To learn more, see [X509 certificate generator using DICE emulator](https://github.com/Azure/azure-iot-sdk-java/tree/main/provisioning/provisioning-tools/provisioning-x509-cert-generator).

:::zone-end

## Next steps

In this article, you created an enrollment group for an X.509 intermediate or root CA certificate using the Azure IoT Hub Device Provisioning Service. To explore further, check out the following links:

* For more information about X.509 certificate attestation with DPS, see [X.509 certificate attestation](concepts-x509-attestation.md).

* For an end-to-end example of provisioning devices through an enrollment group using X.509 certificates, see the [Provision multiple X.509 devices using enrollment groups](tutorial-custom-hsm-enrollment-group-x509.md) tutorial.

* To learn about managing individual enrollments and enrollment groups using Azure portal, see [How to manage device enrollments with Azure portal](how-to-manage-enrollments.md).
