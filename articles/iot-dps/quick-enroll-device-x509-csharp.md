---
title: Quickstart - Enroll X.509 device to Azure Device Provisioning Service using C#
description: This quickstart uses group enrollments. In this quickstart, enroll X.509 devices to the Azure IoT Hub Device Provisioning Service (DPS) using C#.
author: wesmc7777
ms.author: wesmc
ms.date: 09/28/2020
ms.topic: quickstart
ms.service: iot-dps
services: iot-dps 
ms.devlang: csharp
ms.custom: "mvc, devx-track-csharp"
---
 
# Quickstart: Enroll X.509 devices to the Device Provisioning Service using C#

[!INCLUDE [iot-dps-selector-quick-enroll-device-x509](../../includes/iot-dps-selector-quick-enroll-device-x509.md)]

This quickstart shows how to use C# to programmatically create an [Enrollment group](concepts-service.md#enrollment-group) that uses intermediate or root CA X.509 certificates. The enrollment group is created by using the [Microsoft Azure IoT SDK for .NET](https://github.com/Azure/azure-iot-sdk-csharp) and a sample C# .NET Core application. An enrollment group controls access to the provisioning service for devices that share a common signing certificate in their certificate chain. To learn more, see [Controlling device access to the provisioning service with X.509 certificates](./concepts-x509-attestation.md#controlling-device-access-to-the-provisioning-service-with-x509-certificates). For more information about using X.509 certificate-based Public Key Infrastructure (PKI) with Azure IoT Hub and Device Provisioning Service, see [X.509 CA certificate security overview](../iot-hub/iot-hub-x509ca-overview.md). 

This quickstart expects you've already created an IoT hub and Device Provisioning Service instance. If you haven't already created these resources, complete the [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md) quickstart before you continue with this article.

Although the steps in this article work on both Windows and Linux computers, this article uses a Windows development computer.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* Install [Visual Studio 2019](https://www.visualstudio.com/vs/).
* Install [.NET Core SDK](https://dotnet.microsoft.com/download).
* Install [Git](https://git-scm.com/download/).

## Prepare test certificates

For this quickstart, you must have a .pem or a .cer file that contains the public portion of an intermediate or root CA X.509 certificate. This certificate must be uploaded to your provisioning service, and verified by the service.

The [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c) contains test tooling that can help you create an X.509 certificate chain, upload a root or intermediate certificate from that chain, and do proof-of-possession with the service to verify the certificate.

> [!CAUTION]
> Use certificates created with the SDK tooling for development testing only.
> Do not use these certificates in production.
> They contain hard-coded passwords, such as *1234*, that expire after 30 days.
> To learn about obtaining certificates suitable for production use, see [How to get an X.509 CA certificate](../iot-hub/iot-hub-x509ca-overview.md#how-to-get-an-x509-ca-certificate) in the Azure IoT Hub documentation.
>

To use this test tooling to generate certificates, do the following steps:

1. Find the tag name for the [latest release](https://github.com/Azure/azure-iot-sdk-c/releases/latest) of the Azure IoT C SDK.

2. Open a command prompt or Git Bash shell, and change to a working folder on your machine. Run the following commands to clone the latest release of the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c) GitHub repository. Use the tag you found in the previous step as the value for the `-b` parameter:

    ```cmd/sh
    git clone -b <release-tag> https://github.com/Azure/azure-iot-sdk-c.git
    cd azure-iot-sdk-c
    git submodule update --init
    ```

    You should expect this operation to take several minutes to complete.

   The test tooling is located in the *azure-iot-sdk-c/tools/CACertificates* of the repository you cloned.

3. Follow the steps in [Managing test CA certificates for samples and tutorials](https://github.com/Azure/azure-iot-sdk-c/blob/master/tools/CACertificates/CACertificateOverview.md).

In addition to the tooling in the C SDK, the [Group certificate verification sample](https://github.com/Azure-Samples/azure-iot-samples-csharp/tree/master/provisioning/Samples/service/GroupCertificateVerificationSample) in the *Microsoft Azure IoT SDK for .NET* shows how to do proof-of-possession in C# with an existing X.509 intermediate or root CA certificate.

## Get the connection string for your provisioning service

For the sample in this quickstart, you need the connection string for your provisioning service.

1. Sign in to the Azure portal, select **All resources**, and then your Device Provisioning Service.

1. Select **Shared access policies**, then choose the access policy you want to use to open its properties. In **Access Policy**, copy and save the primary key connection string.

    ![Get provisioning service connection string from the portal](media/quick-enroll-device-x509-csharp/get-service-connection-string-vs2019.png)

## Create the enrollment group sample 

This section shows how to create a .NET Core console app that adds an enrollment group to your provisioning service. With some modification, you can also follow these steps to create a [Windows IoT Core](https://developer.microsoft.com/en-us/windows/iot) console app to add the enrollment group. To learn more about developing with IoT Core, see the [Windows IoT Core developer documentation](/windows/iot-core/).

1. Open Visual Studio and select **Create a new project**. In **Create a new project**, choose the **Console App (.NET Core)** for C# project template and select **Next**.

1. Name the project *CreateEnrollmentGroup*, and then press **Create**.

    ![Configure Visual C# Windows Classic Desktop project](media//quick-enroll-device-x509-csharp/configure-app-vs2019.png)

1. When the solution opens in Visual Studio, in the **Solution Explorer** pane, right-click the **CreateEnrollmentGroup** project, and then select **Manage NuGet Packages**.

1. In **NuGet Package Manager**, select **Browse**, search for and choose **Microsoft.Azure.Devices.Provisioning.Service**, and then press **Install**.

    ![NuGet Package Manager window](media//quick-enroll-device-x509-csharp/add-nuget.png)

   This step downloads, installs, and adds a reference to the [Azure IoT Provisioning Service Client SDK](https://www.nuget.org/packages/Microsoft.Azure.Devices.Provisioning.Service/) NuGet package and its dependencies.

1. Add the following `using` statements after the other `using` statements at the top of `Program.cs`:

   ```csharp
   using System.Security.Cryptography.X509Certificates;
   using System.Threading.Tasks;
   using Microsoft.Azure.Devices.Provisioning.Service;
   ```

1. Add the following fields to the `Program` class, and make the listed changes.  

   ```csharp
   private static string ProvisioningConnectionString = "{ProvisioningServiceConnectionString}";
   private static string EnrollmentGroupId = "enrollmentgrouptest";
   private static string X509RootCertPath = @"{Path to a .cer or .pem file for a verified root CA or intermediate CA X.509 certificate}";
   ```

   * Replace the `ProvisioningServiceConnectionString` placeholder value with the connection string of the provisioning service that you want to create the enrollment for.

   * Replace the `X509RootCertPath` placeholder value with the path to a .pem or .cer file. This file represents the public part of an intermediate or root CA X.509 certificate that has been previously uploaded and verified with your provisioning service.

   * You may optionally change the `EnrollmentGroupId` value. The string can contain only lower case characters and hyphens.

   > [!IMPORTANT]
   > In production code, be aware of the following security considerations:
   >
   > * Hard-coding the connection string for the provisioning service administrator is against security best practices. Instead, the connection string should be held in a secure manner, such as in a secure configuration file or in the registry.
   > * Be sure to upload only the public part of the signing certificate. Never upload .pfx (PKCS12) or .pem files containing private keys to the provisioning service.

1. Add the following method to the `Program` class. This code creates an enrollment group entry and then calls the `CreateOrUpdateEnrollmentGroupAsync` method on `ProvisioningServiceClient` to add the enrollment group to the provisioning service.

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

1. Build the solution.

## Run the enrollment group sample
  
Run the sample in Visual Studio to create the enrollment group. A Command Prompt window will appear and start showing confirmation messages. On successful creation, the Command Prompt window displays the properties of the new enrollment group.

You can verify that the enrollment group has been created. Go to the Device Provisioning Service summary, and select **Manage enrollments**, then select **Enrollment Groups**. You should see a new enrollment entry that corresponds to the registration ID you used in the sample.

![Enrollment properties in the portal](media/quick-enroll-device-x509-csharp/verify-enrollment-portal-vs2019.png)

Select the entry to verify the certificate thumbprint and other properties for the entry.

## Clean up resources

If you plan to explore the C# service sample, don't clean up the resources created in this quickstart. Otherwise, use the following steps to delete all resources created by this quickstart.

1. Close the C# sample output window on your computer.

1. Navigate to your Device Provisioning service in the Azure portal, select **Manage enrollments**, and then select **Enrollment Groups**. Select the *Registration ID* for the enrollment entry you created using this quickstart and press **Delete**.

1. From your Device Provisioning service in the Azure portal, select **Certificates**, choose the certificate you uploaded for this quickstart, and press **Delete** at the top of **Certificate Details**.  

## Next steps

In this quickstart, you created an enrollment group for an X.509 intermediate or root CA certificate using the Azure IoT Hub Device Provisioning Service. To learn about device provisioning in depth, continue to the tutorial for the Device Provisioning Service setup in the Azure portal.

> [!div class="nextstepaction"]
> [Azure IoT Hub Device Provisioning Service tutorials](./tutorial-set-up-cloud.md)