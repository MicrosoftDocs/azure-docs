---
title: How to create X.509 certificates | Microsoft Docs
description: How to create X.509 certificates to enable the X.509 based security in your Azure IoT hub in a simulated environment.
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
# Create CA-signed X.509 certificates and certificate chains

The X.509 certificate-based security in the IoT Hub requires you to start with an [X.509 certificate chain](https://en.wikipedia.org/wiki/X.509#Certificate_chains_and_cross-certification), which includes the root certificate as well as any intermediate certificates up until the leaf certificate. This *How to* guide walks you through an example script using PowerShell and [OpenSSL](https://www.openssl.org/) to create X.509 certificates and certificate chains. You can use these certificates to simulate a test environment that secures your Azure IoT hub using the *X.509 Certificate Authentication*. The steps in this guide create certificates locally on your Windows machine. 

## Prerequisites
This tutorial assumes that you have acquired the OpenSSL binaries. You may either
    - download the OpenSSL source code and build the binaries on your machine, or 
    - download and install any [third-party OpenSSL binaries](https://wiki.openssl.org/index.php/Binaries), for example, from [this project on SourceForge](https://sourceforge.net/projects/openssl/).

<a id="createcerts"></a>

## Create X.509 certificates
The following steps show an example of how to create the X.509 root certificates locally. 

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
3. Run the following script that copies the OpenSSL binaries to your working directory and sets the environment variables:

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
            throw ("Certificate {0} already installed.  Cleanup CA certs 1st" -f $_rootCertSubject)
        }

        if ($NULL -eq $ENV:OPENSSL_CONF)
        {
            throw ("OpenSSL not configured on this system.  Run 'Initialize-CAOpenSSL' (even if you've already done so) to set everything up.")
        }
        Write-Host "Success"
    }
    Test-CAPrerequisites
    ```
    If everything is configured correctly, you should see "Success" message. 

<a id="createcertchain"></a>

## Create X.509 certificate chain
Create a certificate chain with a root CA, for example, "CN=Azure IoT Root CA" that this sample uses, by running the following PowerShell script. This script also updates your Windows OS certificate store, as well creates certificate files in your working directory. 
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
    4. Finally, use the PowerShell functions above to create the X.509 certificate chain, by running the command `New-CACertChain` in your PowerShell window. 


