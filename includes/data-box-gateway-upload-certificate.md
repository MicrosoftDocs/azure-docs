---
author: stevenmatthew
ms.service: azure-databox
ms.topic: include
ms.date: 10/15/2020
ms.author: shaas
---

A proper SSL certificate ensures that you're sending encrypted information to the right server. Besides encryption, the certificate also allows for authentication. You can upload your own trusted SSL certificate via the PowerShell interface of the device.

1. [Connect to the PowerShell interface](#connect-to-the-powershell-interface).
2. Use the `Set-HcsCertificate` cmdlet to upload the certificate. When prompted, provide the following parameters:

   - `CertificateFilePath` - Path to the share that contains the certificate file in *.pfx* format.
   - `CertificatePassword` - A password used to protect the certificate.
   - `Credentials` - Username to access the share that contains the certificate. Provide the password to the network share when prompted.

     The following example shows the usage of this cmdlet:

     ```
     $pwd="<CertificatePassword>"
     $password=ConvertTo-SecureString -String $pwd -AsPlainText -Force
     $cred=New-Object System.Management.Automation.PSCredential('Administrator',$password)

     Set-HcsCertificate -Scope LocalWebUI -CertificateFilePath \\myfileshare\certificates\mycert.pfx -CertificatePassword $cred -Credential "Username"
     ```

