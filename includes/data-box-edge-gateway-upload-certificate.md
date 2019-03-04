---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 03/04/2019
ms.author: alkohli
---

A proper SSL certificate ensures that you are sending encrypted information to the right server. In addition to encryption, it also allows for authentication. You can upload your own trusted SSL certificate via the PowerShell interface of the device.

1. Connect to the PowerShell interface.
2. Use the `Set-HcsCertificate` cmdlet to upload the certificate. When prompted, provide the following parameters:

    - `CertificateFilePath` - Path to the share that contains the certificate file in *.pfx* format.
    - `CertificatePassword` - A password assigned by the user to protect the certificate.
    - `Credentials` - Username and password to access the share that contains the certificate.

    The following example shows the usage of this cmdlet:

    ```
    Set-HcsCertificate -Scope LocalWebUI -CertificateFilePath "\\myfileshare\certificates\mycert.pfx" -CertificatePassword "mypassword" -Credentials "Username/Password"
    ```

