---
title: Create a self-signed public certificate to authenticate your application
description: Create a self-signed public certificate to authenticate your application.
services: active-directory
author: henrymbuguakiarie
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 10/17/2022
ms.author: henrymbugua
ms.reviewer: jmprieur, saeeda, sureshja, ludwignick
ms.custom: scenarios:getting-started, engagement-fy23
#Customer intent: As an application developer, I want to understand the basic concepts of authentication and authorization in the Microsoft identity platform.
---

# Create a self-signed public certificate to authenticate your application

Microsoft Entra ID supports two types of authentication for service principals: **password-based authentication** (app secret) and **certificate-based authentication**. While app secrets can easily be created in the Azure portal or using a Microsoft API like Microsoft Graph, they're long-lived, and not as secure as certificates. It's therefore recommended that your application uses a certificate rather than a secret.

For testing, you can use a self-signed public certificate instead of a Certificate Authority (CA)-signed certificate. In this how-to, you'll use PowerShell to create and export a self-signed certificate.

> [!CAUTION]
> Self-signed certificates are not trusted by default and they can be difficult to maintain. Also, they may use outdated hash and cipher suites that may not be strong. For better security, purchase a certificate signed by a well-known certificate authority.

While creating the certificate using PowerShell, you can specify parameters like cryptographic and hash algorithms, certificate validity period, and domain name. The certificate can then be exported with or without its private key depending on your application needs. 

The application that initiates the authentication session requires the private key while the application that confirms the authentication requires the public key. So, if you're authenticating from your PowerShell desktop app to Microsoft Entra ID, you only export the public key (*.cer* file) and upload it to the Azure portal. The PowerShell app uses the private key from your local certificate store to initiate authentication and obtain access tokens for calling Microsoft APIs like Microsoft Graph.

Your application may also be running from another machine, such as Azure Automation. In this scenario, you export the public and private key pair from your local certificate store, upload the public key to the Azure portal, and the private key (a *.pfx* file) to Azure Automation. Your application running in Azure Automation will use the private key to initiate authentication and obtain access tokens for calling Microsoft APIs like Microsoft Graph.

This article uses the `New-SelfSignedCertificate` PowerShell cmdlet to create the self-signed certificate and the `Export-Certificate` cmdlet to export it to a location that is easily accessible. These cmdlets are built-in to modern versions of Windows (Windows 8.1 and greater, and Windows Server 2012R2 and greater). The self-signed certificate will have the following configuration:

+ A 2048-bit key length. While longer values are supported, the 2048-bit size is highly recommended for the best combination of security and performance.
+ Uses the RSA cryptographic algorithm. Microsoft Entra ID currently supports only RSA.
+ The certificate is signed with the SHA256 hash algorithm. Microsoft Entra ID also supports certificates signed with SHA384 and SHA512 hash algorithms.
+ The certificate is valid for only one year.
+ The certificate is supported for use for both client and server authentication.

To customize the start and expiry date and other properties of the certificate, refer to [New-SelfSignedCertificate](/powershell/module/pki/new-selfsignedcertificate?view=windowsserver2019-ps&preserve-view=true).


## Create and export your public certificate

Use the certificate you create using this method to authenticate from an application running from your machine. For example, authenticate from PowerShell.

In a PowerShell prompt, run the following command and leave the PowerShell console session open. Replace `{certificateName}` with the name that you wish to give to your certificate.

```powershell
$certname = "{certificateName}"    ## Replace {certificateName}
$cert = New-SelfSignedCertificate -Subject "CN=$certname" -CertStoreLocation "Cert:\CurrentUser\My" -KeyExportPolicy Exportable -KeySpec Signature -KeyLength 2048 -KeyAlgorithm RSA -HashAlgorithm SHA256

```

The `$cert` variable in the previous command stores your certificate in the current session and allows you to export it.

The command below exports the certificate in *.cer* format. You can also export it in other formats supported on the Azure portal including *.pem* and *.crt*.

```powershell

Export-Certificate -Cert $cert -FilePath "C:\Users\admin\Desktop\$certname.cer"   ## Specify your preferred location

```

Your certificate is now ready to upload to the Azure portal. Once uploaded, retrieve the certificate thumbprint for use to authenticate your application.

## (Optional): Export your public certificate with its private key

If your application will be running from another machine or cloud, such as Azure Automation, you'll also need a private key.

Following on from the previous commands, create a password for your certificate private key and save it in a variable. Replace `{myPassword}` with the password that you wish to use to protect your certificate private key.

```powershell

$mypwd = ConvertTo-SecureString -String "{myPassword}" -Force -AsPlainText  ## Replace {myPassword}

```

Using the password you stored in the `$mypwd` variable, secure and export your private key using the command;

```powershell

Export-PfxCertificate -Cert $cert -FilePath "C:\Users\admin\Desktop\$certname.pfx" -Password $mypwd   ## Specify your preferred location

```

Your certificate (*.cer* file) is now ready to upload to the Azure portal. The private key (*.pfx* file) is encrypted and can't be read by other parties. Once uploaded, retrieve the certificate thumbprint, which you can use to authenticate your application.


## Optional task: Delete the certificate from the keystore.

You can delete the key pair from your personal store by running the following command to retrieve the certificate thumbprint.

```powershell

Get-ChildItem -Path "Cert:\CurrentUser\My" | Where-Object {$_.Subject -Match "$certname"} | Select-Object Thumbprint, FriendlyName

```

Then, copy the thumbprint that is displayed and use it to delete the certificate and its private key.

```powershell

Remove-Item -Path Cert:\CurrentUser\My\{pasteTheCertificateThumbprintHere} -DeleteKey

```

### Know your certificate expiry date

The self-signed certificate you created following the steps above has a limited lifetime before it expires. In the **App registrations** section of the Azure portal, the **Certificates & secrets** screen displays the expiration date of the certificate. If you're using Azure Automation, the **Certificates** screen on the Automation account displays the expiration date of the certificate. Follow the previous steps to create a new self-signed certificate.

## Next steps

[Manage certificates for federated single sign-on in Microsoft Entra ID](../manage-apps/tutorial-manage-certificates-for-federated-single-sign-on.md)
