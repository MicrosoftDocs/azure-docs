---
title: X.509 security in Azure IoT Hub | Microsoft Docs
description: Get started on the X.509 based security in your Azure IoT hub in a simulated environment.
services: iot-hub
documentationcenter: ''
author: dsk-2015
manager: timlt
editor: ''

ms.service: iot-hub
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/09/2017
ms.author: dkshir

---
# Set up X.509 security in your Azure IoT hub

This tutorial simulates the steps you need to secure your Azure IoT hub using the *X.509 Certificate Authentication*. For the purpose of illustration, we will show how to use the open source tool OpenSSL to create certificates locally on your Windows machine. We recommend that you use this tutorial for test purposes only. For production environment, you should purchase the certificates from a *certificate authority (CA)* such as **VeriSign**. 

## Prerequisites
This tutorial requires that you have the following resources ready:

- You have created an IoT hub with your Azure subscription. See [Create an IoT hub through portal](iot-hub-create-through-portal.md) for detailed steps. 
- You have a Windows development machine with [PowerShell installed](https://docs.microsoft.com/powershell/scripting/setup/installing-windows-powershell) on it. 
- You have [Visual Studio 2015 or Visual Studio 2017](https://www.visualstudio.com/vs/) installed on your machine. 
- You have acquired the OpenSSL binaries. You may either
    - download the OpenSSL source code and build the binaries on your machine, or 
    - download and install any [third-party OpenSSL binaries](https://wiki.openssl.org/index.php/Binaries), for example, from [this project on SourceForge](https://sourceforge.net/projects/openssl/).

<a id="getcerts"></a>

## Get X.509 certificates
The X.509 certificate-based security in the IoT Hub requires you to start with an [X.509 certificate chain](https://en.wikipedia.org/wiki/X.509#Certificate_chains_and_cross-certification), which includes the root certificate as well as any intermediate certificates up until the leaf certificate. 

You may choose either of the following ways to get your certificates:
- Purchase X.509 certificates from a *certificate authority (CA)* such as **VeriSign**. This is recommended for production environments.
OR,
- Create your own X.509 certificates using a third party tool such as [OpenSSL](https://www.openssl.org/). This will be fine for test and development purposes. The article [How to create your X.509 certificates](iot-hub-security-x509-create-certificates.md) walks you through a sample PowerShell script to create the certificates using OpenSSL. The rest of this tutorial will use the OpenSSL environment set up in this *How to* guide to walk through the end-to-end X.509 security in Azure IoT Hub.


<a id="registercerts"></a>

## Register X.509 certificates to your IoT hub

These steps show you how to add a new Certificate Authority to your IoT hub through the portal.

1. In the Azure portal, navigate to your IoT hub and open the **SETTINGS** > **Certificates** menu. 
2. Click **Add** to add a new certificate.
3. Enter a friendly display name to your certificate. Select the root certificate file named *RootCA.cer* created in the previous section, from your machine. Click **Upload**.
4. Once you get a notification that your certificate is successfully uploaded, click **Save**.

    ![Upload certificate](./media/iot-hub-security-x509-get-started/add-new-cert.png)  

   This will show your certificate in the **Certificate Explorer** list. Note the **STATUS** of this certificate is *Unverified*.

5. Click on the certificate that you added in the previous step.

6. In the **Certificate Details** blade, click **Generate Verification Code**.

7. It creates a **Verification Code** to validate the certificate ownership. Copy the code to your clipboard. 

   ![Verify certificate](./media/iot-hub-security-x509-get-started/verify-cert.png)  

8. In the PowerShell window on your desktop, run the following code:
    ```PowerShell
    function New-CAVerificationCert([string]$requestedSubjectName)
    {
        $cnRequestedSubjectName = ("CN={0}" -f $requestedSubjectName)
        $verifyRequestedFileName = ".\verifyCert4.cer"
        $rootCACert = Get-CACertBySubjectName $_rootCertSubject
        Write-Host "Using Signing Cert:::" 
        Write-Host $rootCACert
    
        $verifyCert = New-CASelfsignedCertificate $cnRequestedSubjectName $rootCACert $false

        Export-Certificate -cert $verifyCert -filePath $verifyRequestedFileName -Type Cert
        if (-not (Test-Path $verifyRequestedFileName))
        {
            throw ("Error: CERT file {0} doesn't exist" -f $verifyRequestedFileName)
        }
    
        Write-Host ("Certificate with subject {0} has been output to {1}" -f $cnRequestedSubjectName, (Join-Path (get-location).path $verifyRequestedFileName)) 
    }
    New-CAVerificationCert "<your verification code>"
    ```
   This creates a certificate with the given subject name, signed by the CA, as a file named *VerifyCert4.cer* in your working directory. This certificate file will help validate with your IoT hub that you have the signing permission (i.e. the private key) of this CA.
9. In the **Certificate Details** blade on the Azure portal, navigate to the **Verification Certificate .pem or .cer file**, and select the *VerifyCert4.cer* created by the preceding PowerShell command using the _File Explorer_ icon besides it.

10. Once the certificate is successfuly uploaded, click **Verify**. The **STATUS** of your certificate changes to **_Verified_** in the **Certificates** blade. Click **Refresh** if it does not update automatically.

   ![Upload certificate verification](./media/iot-hub-security-x509-get-started/upload-cert-verification.png)  


<a id="createdevice"></a>

## Create an X.509 device for your IoT hub

1. In the Azure portal, navigate to your IoT hub's **Device Explorer**.

2. Click **Add** to add a new device. 

3. Give a friendly display name for the **Device ID**, and select **_X.509 CA Signed_** as the **Authentication Type**. Click **Save**.

   ![Create X.509 device in portal](./media/iot-hub-security-x509-get-started/create-x509-device.png)

4. In the PowerShell window on your local machine, run the following script to create a CA-signed X.509 certificate for this device:
    ```PowerShell
    function New-CADevice([string]$deviceName, [string]$signingCertSubject=$_rootCertSubject)
    {
        $cnNewDeviceSubjectName = ("CN={0}" -f $deviceName)
        $newDevicePfxFileName = ("./{0}.pfx" -f $deviceName)
        $newDevicePemAllFileName      = ("./{0}-all.pem" -f $deviceName)
        $newDevicePemPrivateFileName  = ("./{0}-private.pem" -f $deviceName)
        $newDevicePemPublicFileName   = ("./{0}-public.pem" -f $deviceName)
    
        $signingCert = Get-CACertBySubjectName $signingCertSubject ## "CN=Azure IoT CA Intermediate 1 CA"

        $newDeviceCertPfx = New-CASelfSignedCertificate $cnNewDeviceSubjectName $signingCert $false
    
        $certSecureStringPwd = ConvertTo-SecureString -String $_privateKeyPassword -Force -AsPlainText

        # Export the PFX of the cert we've just created.  The PFX is a format that contains both public and private keys.
        Export-PFXCertificate -cert $newDeviceCertPfx -filePath $newDevicePfxFileName -password $certSecureStringPwd
        if (-not (Test-Path $newDevicePfxFileName))
        {
            throw ("Error: CERT file {0} doesn't exist" -f $newDevicePfxFileName)
        }

        # Begin the massaging.  First, turn the PFX into a PEM file which contains public key, private key, and other attributes.
        Write-Host ("When prompted for password by openssl, enter the password as {0}" -f $_privateKeyPassword)
        openssl pkcs12 -in $newDevicePfxFileName -out $newDevicePemAllFileName -nodes

        # Convert the PEM to get formats we can process
        if ($useEcc -eq $true)
        {
            openssl ec -in $newDevicePemAllFileName -out $newDevicePemPrivateFileName
        }
        else
        {
            openssl rsa -in $newDevicePemAllFileName -out $newDevicePemPrivateFileName
        }
        openssl x509 -in $newDevicePemAllFileName -out $newDevicePemPublicFileName
 
        Write-Host ("Certificate with subject {0} has been output to {1}" -f $cnNewDeviceSubjectName, (Join-Path (get-location).path $newDevicePemPublicFileName)) 
    }
    ```
   Then run `New-CADevice "<yourTestDevice>"` in your PowerShell window, using the friendly name that you used to create your device. When prompted for the password for the CA's private key, enter "123". This creates a _<yourTestDevice>.pfx_ file in your working directory.



<a id="authenticatedevice"></a>

## Authenticate your X.509 device with the X.509 certificates

In this section, you create a C# application to simulate the X.509 device registered for your IoT hub, and send temperature and humidity values from the device to your hub. Note that in this tutorial, we will create only the device application. It is left as an exercise to the readers to create the IoT Hub service application that will send response to the events sent by this simulated device.

1. In Visual Studio, create a new Visual C# Windows Classic Desktop project by using the Console Application project template. Name the project **SimulateX509Device**.
   ![Create X.509 device project in Visual Studio](./media/iot-hub-security-x509-get-started/create-device-project.png)

2. In Solution Explorer, right-click the **SimulateX509Device** project, and then click **Manage NuGet Packages...**. In the NuGet Package Manager window, select **Browse** and search for **microsoft.azure.devices.client**. Select **Install** to install the **Microsoft.Azure.Devices.Client** package, and accept the terms of use. This procedure downloads, installs, and adds a reference to the Azure IoT device SDK NuGet package and its dependencies.
   ![Add device SDK Nuget package in Visual Studio](./media/iot-hub-security-x509-get-started/device-sdk-nuget.png)

3. Add the following lines of code at the top of the *Program.cs* file:
    
    ```CSharp
        using Microsoft.Azure.Devices.Client;
        using Microsoft.Azure.Devices.Shared;
        using System.Security.Cryptography.X509Certificates;
    ```

4. Add the following lines of code inside the **Program** class:
    
    ```CSharp
        private static int MESSAGE_COUNT = 5;
        private const int TEMPERATURE_THRESHOLD = 30;
        private static String deviceId = "<your-device-id>";
        private static float temperature;
        private static float humidity;
        private static Random rnd = new Random();
    ```
   Use the friendly device name you used in the preceding section in place of _<your_device_id>_ placeholder.

5. Add the following function to create random numbers for temperature and humidity and send these values to the hub:
    ```CSharp
    static async Task SendEvent(DeviceClient deviceClient)
    {
        string dataBuffer;
        Console.WriteLine("Device sending {0} messages to IoTHub...\n", MESSAGE_COUNT);

        for (int count = 0; count < MESSAGE_COUNT; count++)
        {
            temperature = rnd.Next(20, 35);
            humidity = rnd.Next(60, 80);
            dataBuffer = string.Format("{{\"deviceId\":\"{0}\",\"messageId\":{1},\"temperature\":{2},\"humidity\":{3}}}", deviceId, count, temperature, humidity);
            Message eventMessage = new Message(Encoding.UTF8.GetBytes(dataBuffer));
            eventMessage.Properties.Add("temperatureAlert", (temperature > TEMPERATURE_THRESHOLD) ? "true" : "false");
            Console.WriteLine("\t{0}> Sending message: {1}, Data: [{2}]", DateTime.Now.ToLocalTime(), count, dataBuffer);

            await deviceClient.SendEventAsync(eventMessage);
        }
    }
    ```

6. Finally, add the following lines of code to the **Main** function, replacing the placeholders _<device-name>_, <your-iot-hub-name>_ and _<absolute-path-to-your-device-pfx-file>_ as required by your setup.
    ```CSharp
    try
    {
        var cert = new X509Certificate2(@"<absolute-path-to-your-device-pfx-file>", "123");
        var auth = new DeviceAuthenticationWithX509Certificate("<device-name>", cert);
        var deviceClient = DeviceClient.Create("<your-iot-hub-name>.azure-devices.net", auth, TransportType.Amqp_Tcp_Only);

        if (deviceClient == null)
        {
            Console.WriteLine("Failed to create DeviceClient!");
        }
        else
        {
            Console.WriteLine("Successfully created DeviceClient!");
            SendEvent(deviceClient).Wait();
        }

        Console.WriteLine("Exiting...\n");
    }
    catch (Exception ex)
    {
        Console.WriteLine("Error in sample: {0}", ex.Message);
    }
    ```
   This code connects to your IoT hub by creating the connection string for your X.509 device. Once successfully connected, it then sends temperature and humidity events to the hub, and waits for its response. 
7. Since this application accesses a *.pfx* file, you need to execute this in *Admin* mode. Build the Visual Studio solution. Open a new command window as an **Administrator**, and navigate to the folder containing this solution. Navigate to the *bin/Debug* path within the solution folder. Run the application **SimulateX509Device.exe** from the _Admin_ command window. You should see your device succesfully connecting to the hub and sending the events. 
   ![Run device app](./media/iot-hub-security-x509-get-started/device-app-success.png)

## See also
To learn more about securing your IoT solution, see:

* [IoT Security Best Practices][lnk-security-best-practices]
* [IoT Security Architecture][lnk-security-architecture]
* [Secure your IoT deployment][lnk-security-deployment]

To further explore the capabilities of IoT Hub, see:

* [Simulating a device with Azure IoT Edge][lnk-iotedge]

[lnk-security-best-practices]: iot-hub-security-best-practices.md
[lnk-security-architecture]: iot-hub-security-architecture.md
[lnk-security-deployment]: iot-hub-security-deployment.md

[lnk-iotedge]: iot-hub-linux-iot-edge-simulated-device.md
