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
ms.date: 09/20/2017
ms.author: dkshir

---
# Get started on setting up X.509 security in your Azure IoT hub

This tutorial describes the tasks you need to do to set up the CA-based X.509 based security in Azure IoT Hub, with the help of a simulated script. It uses the open source tool [OpenSSL](https://www.openssl.org/) to create certificates locally on your Windows machine. We recommend that you use this tutorial for test purposes only. For production environment, you should purchase the certificates from a *certificate authority (CA)* such as **VeriSign**. 

## Prerequisites
This tutorial requires that you have the following resources ready:

- You have created an IoT hub with your Azure subscription. See [Create an IoT hub through portal](iot-hub-create-through-portal.md) for detailed steps to create a hub. 
- You have downloaded the OpenSSL source code and built the binaries on your machine. You may also download and install the [third-party OpenSSL binaries for your development environment](https://wiki.openssl.org/index.php/Binaries), such as [SourceForge](https://sourceforge.net/projects/openssl/). Make sure the environment variables such as *PATH* are updated.

<a id="createcerts"></a>

## Task 1: Create X.509 certificates
The X.509 certificate-based security in the IoT Hub requires you to start with an [X.509 certificate chain](https://en.wikipedia.org/wiki/X.509#Certificate_chains_and_cross-certification), which includes the root certificate as well as any intermediate certificates up until the leaf certificate. The following steps show you how to create these certificates locally. 

1. Open a PowerShell window as an *Administrator*. 
2. Navigate to your working directory. Run the following script to set the global variables. 
    ```PowerShell
    $openSSLBinSource = "<full_path_to_the_binaries>\OpenSSL\bin"
    $errorActionPreference    = "stop"

    # Note that these values are for test purpose only
    $_rootCertSubject         = "CN=Azure IoT Root CA"
    $_intermediateCertSubject = "CN=Azure IoT Intermediate {0} CA"
    $_privateKeyPassword      = "123"

    $rootCACerFileName          = "./RootCA.cer"
    $rootCAPemFileName          = "./RootCA.pem"
    $intermediate1CAPemFileName = "./Intermediate1.pem"
    $intermediate2CAPemFileName = "./Intermediate2.pem"
    $intermediate3CAPemFileName = "./Intermediate3.pem"

    $openSSLBinDir              = Join-Path $ENV:TEMP "openssl-bin"

    # Whether to use ECC or RSA.
    $useEcc                     = $true
    ```
3. Then run the following script that copies the OpenSSL binaries to your working directory and sets the environment variables:

    ```PowerShell
    function Initialize-CAOpenSSL()
    {
        Write-Host ("Beginning copy of openssl binaries to {0} (and setting up env variables...)" -f $openSSLBinDir)
        if (-not (Test-Path $openSSLBinDir))
        {
            mkdir $openSSLBinDir | Out-Null
        }

        robocopy $openSSLBinSource $openSSLBinDir * /s 
        robocopy $openSSLBinSource . * /s 

        Write-Host "Setting up PATH and other environment variables."
        $ENV:PATH += "; $openSSLBinDir"
        $ENV:OPENSSL_CONF = Join-Path $openSSLBinDir "openssl.cnf"

        Write-Host "Success"
    }
    Initialize-CAOpenSSL
    ```
4. Next, run the following script that searches whether a certificate by the specified *Subject Name* is already installed, and whether OpenSSL is configured correctly on your machine:
    ```PowerShell
    function Get-CACertBySubjectName([string]$subjectName)
    {
        $certificates = gci -Recurse Cert:\LocalMachine\ |? { $_.gettype().name -eq "X509Certificate2" }
        $cert = $certificates |? { $_.subject -eq $subjectName -and $_.PSParentPath -eq "Microsoft.PowerShell.Security\Certificate::LocalMachine\My" }
        if ($NULL -eq $cert)
        {
            throw ("Unable to find certificate with subjectName {0}" -f $subjectName)
        }
    
        write $cert
    }
    function Test-CAPrerequisites()
    {
        $certInstalled = $null
        try
        {
            $certInstalled = Get-CACertBySubjectName $_rootCertSubject
        }
        catch {}

        if ($NULL -ne $certInstalled)
        {
            throw ("Certificate {0} already installed.  Cleanup CA Dogfood certs 1st" -f $_rootCertSubject)
        }

        if ($NULL -eq $ENV:OPENSSL_CONF)
        {
            throw ("OpenSSL not configured on this system.  Run 'Initialize-CADogfoodOpenSSL' (even if you've already done so) to set everything up.")
        }
        Write-Host "Success"
    }
    Test-CAPrerequisites
    ```
    If everything is configured correctly, you should see "Success" message.
5. Create a certificate chain with a root CA, for example, "CN=Azure IoT Root CA" that this sample uses, by running the following PowerShell script. This script also updates your Windows OS certificate store, as well creates certificate files in your working directory. 
    1. The following script creates a PowerShell function to create a self signed certificate, for a given *Subject Name* and signing authority. 
    ```PowerShell
    function New-CASelfsignedCertificate([string]$subjectName, [object]$signingCert, [bool]$isASigner=$true)
    {
	      # Build up argument list
	      $selfSignedArgs =@{"-DnsName"=$subjectName; 
	                         "-CertStoreLocation"="cert:\LocalMachine\My";
                           "-NotAfter"=(get-date).AddDays(30); 
	                        }

	      if ($isASigner -eq $true)
	      {
		        $selfSignedArgs += @{"-KeyUsage"="CertSign"; }
            $selfSignedArgs += @{"-TextExtension"= @(("2.5.29.19={text}ca=TRUE&pathlength=12")); }
	      }
        else
        {
            $selfSignedArgs += @{"-TextExtension"= @("2.5.29.37={text}1.3.6.1.5.5.7.3.2,1.3.6.1.5.5.7.3.1", "2.5.29.19={text}ca=FALSE&pathlength=0")  }
        }

	      if ($signingCert -ne $null)
	      {
		        $selfSignedArgs += @{"-Signer"=$signingCert }
	      }

        if ($useEcc -eq $true)
        {
            $selfSignedArgs += @{"-KeyAlgorithm"="ECDSA_nistP256";
                             "-CurveExport"="CurveName" }
        }

	      # Now use splatting to process this
	      Write-Host ("Generating certificate {0} which is for prototyping, NOT PRODUCTION.  It will expire in 30 days." -f $subjectName)
	      write (New-SelfSignedCertificate @selfSignedArgs)
    }
    ``` 
    2. The following PowerShell function creates intermediate X.509 certificates using the preceding function as well as the OpenSSL binaries. 
    ```PowerShell
    function New-CAIntermediateCert([string]$subjectName, [Microsoft.CertificateServices.Commands.Certificate]$signingCert, [string]$pemFileName)
    {
        $certFileName = ($subjectName + ".cer")
        $newCert = New-CASelfsignedCertificate $subjectName $signingCert
        Export-Certificate -Cert $newCert -FilePath $certFileName -Type CERT | Out-Null
        Import-Certificate -CertStoreLocation "cert:\LocalMachine\CA" -FilePath $certFileName | Out-Null

        # Store public PEM for later chaining
        openssl x509 -inform deer -in $certFileName -out $pemFileName

        del $certFileName
   
        write $newCert
    }  
    ```
    3. The following PowerShell function creates the X.509 certificate chain. Read [Certificate chains](https://en.wikipedia.org/wiki/X.509#Certificate_chains_and_cross-certification) for more information.
    ```PowerShell
    function New-CACertChain()
    {
        Write-Host "Beginning to install certificate chain to your LocalMachine\My store"
        $rootCACert =  New-CASelfsignedCertificate $_rootCertSubject $null
    
        Export-Certificate -Cert $rootCACert -FilePath $rootCACerFileName  -Type CERT
        Import-Certificate -CertStoreLocation "cert:\LocalMachine\Root" -FilePath $rootCACerFileName

        openssl x509 -inform der -in $rootCACerFileName -out $rootCAPemFileName

        $intermediateCert1 = New-CAIntermediateCert ($_intermediateCertSubject -f "1") $rootCACert $intermediate1CAPemFileName
        $intermediateCert2 = New-CAIntermediateCert ($_intermediateCertSubject -f "2") $intermediateCert1 $intermediate2CAPemFileName
        $intermediateCert3 = New-CAIntermediateCert ($_intermediateCertSubject -f "3") $intermediateCert2 $intermediate3CAPemFileName
        Write-Host "Success"
    }    
    ```
    This script creates a file named *RootCA.cer* in your working directory. 

<a id="uploadcerts"></a>

## Task 2: Upload X.509 certificates through the portal

These steps show you how to add a new Certificate Authority to your hub through the portal.

1. In the Azure portal, navigate to your IoT hub and open the **Certificate Explorer**. 
2. Click **Add** to add a new certificate.
3. Enter a friendly display name to your certificate, and select the root certificate file named from your machine, for example, the *RootCA.cer* created in the previous section. Click **Upload**.
4. The **Certificate** box will show your certificate once uploaded. Click **Save**.

    ![Upload certificate](./media/iot-hub-security-x509-get-started/add-new-cert.png)  

   This will show your certificate in the **Certificate Explorer** list. Note the **STATUS** of this certificate is *Unverified*.

5. Click on the certificate that you added in the previous step.
6. In the **Certificate Details** blade, click **Generate Verification Code**.
7. It creates a **Verification Code** for to validate the certificate ownership. Copy the code to your clipboard. 

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
   This creates a certificate with the given subject name, signed by the CA, as a file named *VerifyCert4.cer* in your working directory. This informs your IoT hub that you have the signing permission (the private key) of this CA.
9. In the **Certificate Details** blade on the Azure portal, navigate to the **Verification Certificate .pem or .cer file**, and select the *VerifyCert4.cer* created by the preceding PowerShell command to **Upload**.

10. Once the certificate is uploaded, and you see it below the **Verification Certificate** box, click **Verify**. Once the certificate is verified, you should see the **STATUS** of your certificate change to **_Verified_** in the **Certificate Explorer** blade. 

   ![Upload certificate verification](./media/iot-hub-security-x509-get-started/upload-cert-verification.png)  


<a id="registerdevice"></a>

## Task 3: Register your X.509 device with your IoT hub

1. In the Azure portal, navigate to your IoT hub's **Device Explorer**.
2. Click **Add** to add a new device. 
3. Give a friendly display name for the **Device ID**, and select **_X.509_** as the **Authentication Type**. 

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
    
        $signingCert = Get-CACertBySubjectName $signingCertSubject ## "CN=Azure IoT CA Dogfood Intermediate 1 CA"

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
    New-CADevice "yourTestDevice"
    ```
   When prompted for the password for the CA's private key, enter "123". 



<a id="deviceconnects"></a>

## Task 5: Device connects to the hub

In this section, you create a C# application to simulate the X.509 device registered for your IoT hub, and send temperature and humidity values from the device to your hub. Note that in this tutorial, we will create only the device application, that is set up to communicate with the service application. It is left as an exercise to the readers to create the service application that will send response to the events sent by this simulated device.

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
6. Add the following function to received commands from the IoT hub in response to the events sent above:
    ```CSharp
    static async Task ReceiveCommands(DeviceClient deviceClient)
    {
        Console.WriteLine("\nDevice waiting for commands from IoTHub...\n");
        Message receivedMessage;
        string messageData;

        while (true)
        {
            receivedMessage = await deviceClient.ReceiveAsync(TimeSpan.FromSeconds(1));
            if (receivedMessage != null)
            {
                messageData = Encoding.ASCII.GetString(receivedMessage.GetBytes());
                Console.WriteLine("\t{0}> Received message: {1}", DateTime.Now.ToLocalTime(), messageData);

                int propCount = 0;
                foreach (var prop in receivedMessage.Properties)
                {
                    Console.WriteLine("\t\tProperty[{0}> Key={1} : Value={2}", propCount++, prop.Key, prop.Value);
                }

                await deviceClient.CompleteAsync(receivedMessage);
            }
        }
    }
    ```
7. Finally, add the following lines of code to the **Main** function:
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
            Console.WriteLine("Press any key to exit.");
            ReceiveCommands(deviceClient).Wait();
        }

        Console.WriteLine("Exited!\n");
    }
    catch (Exception ex)
    {
        Console.WriteLine("Error in sample: {0}", ex.Message);
    }
    ```
   This code connects to your IoT hub by creating the connection string for your X.509 device. Once successfully connected, it then sends temperature and humidity events to the hub, and waits for its response. 
8. Since this application accesses a *.pfx* file, you need to execute this in *Admin* mode. Save and close the above Visual Studio solution. Open a new command window as an **Administrator**, and navigate to the folder containing the above application. Navigate to the *bin/Debug* path within the solution folder. Run the application **SimulateX509Device.exe** from the Admin command window. You should see your device succesfully connecting to the hub and sending the events. 

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
